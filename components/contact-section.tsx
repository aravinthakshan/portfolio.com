'use client'

import { Calendar, Check, Clock, Github, Linkedin, Lock, Mail } from 'lucide-react'
import { FormEvent, useState } from 'react'

type Status = 'idle' | 'sending' | 'sent'

const bullets = [
  'Direct reply — no assistants, no routing.',
  'Contracts, research, or full-time — all on the table.',
  "I'll be honest if I'm not the right fit.",
]

const socials: { icon: typeof Linkedin; href: string; label: string }[] = [
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/aravinthakshan',
    label: 'LinkedIn',
  },
  { icon: Github, href: 'https://github.com/aravinthakshan', label: 'GitHub' },
  {
    icon: Mail,
    href: 'mailto:aravinthakshan@gmail.com',
    label: 'Gmail',
  },
]

export function ContactSection() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status !== 'idle') return
    setStatus('sending')
    // Placeholder — wire up to your email service (Resend, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 900))
    setStatus('sent')
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen bg-neutral-50 text-neutral-900 overflow-hidden"
    >
      {/* Grid backdrop, fades out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 90%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
        {/* ─── Left column ─────────────────────────────────────────────── */}
        <div className="flex flex-col min-w-0">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-4">
            Contact
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            Get in touch.
          </h2>
          <p className="mt-5 text-base md:text-lg text-neutral-600 max-w-md leading-relaxed">
            Got a project, a research idea, or a role you think I&apos;d fit?
            Send the details and I&apos;ll get back, usually within a day.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            {bullets.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white shrink-0">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
                <span className="text-neutral-700">{t}</span>
              </li>
            ))}
          </ul>

          {/* Status / quote card */}
          <div className="mt-8 p-5 md:p-6 rounded-xl bg-neutral-950 text-neutral-100 max-w-md">
            <p className="text-sm md:text-[15px] leading-relaxed">
              &ldquo;Aravinth ships fast and thinks about the math. Rare combo
              — most engineers I&apos;ve worked with are one or the other.&rdquo;
            </p>
            <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              Research Lead
              <br />
              Past collaborator
            </div>
          </div>

          {/* Bottom-left: socials + book a meeting — wraps on tight widths so
              the pill never overlaps the form card on the right. */}
          <div className="mt-10 md:mt-auto pt-10 flex flex-wrap items-end gap-x-6 gap-y-6 lg:gap-x-8">
            <div className="shrink-0">
              <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
                Find me elsewhere
              </div>
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-300 bg-white text-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </div>

            {/* Divider only when there's room for both groups on one line */}
            <div className="hidden lg:block h-8 w-px bg-neutral-300 shrink-0 self-end mb-1" />

            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
                Prefer a call?
              </div>
              <a
                href="https://calendar.app.google/fXXwdQZyg9QE1Gyf7"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 sm:gap-2 pl-3.5 sm:pl-4 pr-1 py-1 rounded-full bg-black text-white border-2 border-black hover:scale-[1.04] active:scale-[1.01] transition-transform"
              >
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase whitespace-nowrap">
                  Book a meeting
                </span>
                <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 transition-transform duration-300 group-hover:rotate-12 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── Right column — form card ────────────────────────────────── */}
        <form
          onSubmit={onSubmit}
          className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] self-start min-w-0"
        >
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
            Talk to me
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Goes straight to my inbox.
          </p>

          <div className="mt-6 space-y-4">
            <Field
              label="Name"
              name="name"
              placeholder="Your name"
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <Field
              label="Company"
              name="company"
              placeholder="Optional — if relevant"
            />
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-semibold text-neutral-800 mb-1.5"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell me what you&#39;re thinking about…"
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none resize-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="w-full mt-5 rounded-lg bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase py-3.5 hover:bg-neutral-800 disabled:bg-neutral-700 disabled:opacity-80 transition-colors"
          >
            {status === 'sent'
              ? "Message sent — I'll get back soon"
              : status === 'sending'
              ? 'Sending…'
              : 'Send message'}
          </button>

          <div className="mt-5 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.75} />
              Reply within 24 hrs
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" strokeWidth={1.75} />
              Stays between us
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}

// ─── Tiny field helper ────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-neutral-800 mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-colors"
      />
    </div>
  )
}
