import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

import { ContactAcknowledgment } from '@/emails/contact-acknowledgment'
import { ContactNotification } from '@/emails/contact-notification'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Invalid email').max(200),
  company: z
    .string()
    .trim()
    .max(120)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  message: z.string().trim().min(1, 'Message is required').max(5000),
})

const SUBJECT_ACK = 'Thanks — I got your message'

function subjectNotification(name: string) {
  return `New message from ${name} — aravinthakshan`
}

type ResendErrorShape = {
  statusCode?: number
  name?: string
  message?: string
}

function jsonForResendFailure(
  step: 'ack' | 'notification',
  err: ResendErrorShape | null | undefined,
) {
  const code = err?.statusCode
  const hint =
    code === 401 || code === 403
      ? 'RESEND_API_KEY is missing, wrong, or not allowed for this environment. Copy a fresh key from Resend → API Keys and redeploy.'
      : 'Resend rejected the send. Check Vercel logs for the full Resend error (often invalid `from` / domain, or API key).'

  console.error(`[contact] ${step} Resend error:`, err)
  return NextResponse.json(
    {
      ok: false,
      error:
        step === 'ack'
          ? 'Could not send acknowledgment'
          : 'Could not send notification',
      resendStatus: code,
      hint,
    },
    { status: code === 401 || code === 403 ? 500 : 502 },
  )
}

function getEnv() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || undefined
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    'aravinthakshan <onboarding@resend.dev>'
  const to = process.env.CONTACT_TO_EMAIL?.trim() || undefined
  const replyToInbox =
    process.env.CONTACT_REPLY_TO_EMAIL?.trim() || to
  const messageIdHost =
    process.env.CONTACT_MESSAGE_ID_HOST?.trim() || 'aravinthakshan.dev'
  return { apiKey, from, to, replyToInbox, messageIdHost }
}

export async function POST(req: Request) {
  const { apiKey, from, to, replyToInbox, messageIdHost } = getEnv()
  if (!apiKey || !to) {
    const missing: string[] = []
    if (!apiKey) missing.push('RESEND_API_KEY')
    if (!to) missing.push('CONTACT_TO_EMAIL')
    console.error('[contact] missing env:', missing.join(', '))
    return NextResponse.json(
      {
        ok: false,
        error: 'Server not configured',
        missing,
      },
      { status: 500 },
    )
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    )
  }

  const parsed = ContactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid input',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { name, email, company, message } = parsed.data
  const resend = new Resend(apiKey)

  // One conversation id; threading uses Message-ID + In-Reply-To + References.
  // Subjects differ (friendlier ack vs actionable notification) but Gmail
  // still groups the thread via References. Auto-ack Reply-To is the inbox
  // you read so replies to hello@… reach you without inbound MX on the domain.
  const conversationId = crypto.randomUUID()
  const ackMessageId = `<ack.${conversationId}@${messageIdHost}>`
  const notifMessageId = `<notif.${conversationId}@${messageIdHost}>`

  try {
    const ack = await resend.emails.send({
      from,
      to: [email],
      subject: SUBJECT_ACK,
      replyTo: replyToInbox,
      react: <ContactAcknowledgment name={name} message={message} />,
      headers: {
        'Message-ID': ackMessageId,
      },
    })
    if (ack.error) {
      return jsonForResendFailure('ack', ack.error as ResendErrorShape)
    }

    const notif = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: subjectNotification(name),
      react: (
        <ContactNotification
          name={name}
          email={email}
          company={company}
          message={message}
        />
      ),
      headers: {
        'Message-ID': notifMessageId,
        'In-Reply-To': ackMessageId,
        References: ackMessageId,
      },
    })
    if (notif.error) {
      return jsonForResendFailure('notification', notif.error as ResendErrorShape)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] unexpected error:', err)
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    )
  }
}
