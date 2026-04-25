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

const SUBJECT = 'Got your message — aravinthakshan'

function getEnv() {
  const apiKey = process.env.RESEND_API_KEY
  const from =
    process.env.CONTACT_FROM_EMAIL ?? 'aravinthakshan <onboarding@resend.dev>'
  const to = process.env.CONTACT_TO_EMAIL
  const messageIdHost =
    process.env.CONTACT_MESSAGE_ID_HOST ?? 'aravinthakshan.dev'
  return { apiKey, from, to, messageIdHost }
}

export async function POST(req: Request) {
  const { apiKey, from, to, messageIdHost } = getEnv()
  if (!apiKey || !to) {
    console.error('[contact] missing RESEND_API_KEY or CONTACT_TO_EMAIL')
    return NextResponse.json(
      { ok: false, error: 'Server not configured' },
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

  // One conversation id; both emails share threading state via Message-ID +
  // References. When the recipient replies to the notification, the reply
  // chain includes the auto-ack's Message-ID, so the sender's mail client
  // groups everything into a single thread on their side too.
  const conversationId = crypto.randomUUID()
  const ackMessageId = `<ack.${conversationId}@${messageIdHost}>`
  const notifMessageId = `<notif.${conversationId}@${messageIdHost}>`

  try {
    const ack = await resend.emails.send({
      from,
      to: [email],
      subject: SUBJECT,
      react: <ContactAcknowledgment name={name} message={message} />,
      headers: {
        'Message-ID': ackMessageId,
      },
    })
    if (ack.error) {
      console.error('[contact] auto-ack failed:', ack.error)
      return NextResponse.json(
        { ok: false, error: 'Could not send acknowledgment' },
        { status: 502 },
      )
    }

    const notif = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: SUBJECT,
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
      console.error('[contact] notification failed:', notif.error)
      // Sender still got their ack, so we report a soft success — but flag
      // the failure server-side so it is visible in logs.
      return NextResponse.json(
        { ok: true, warning: 'Notification delivery delayed' },
        { status: 200 },
      )
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
