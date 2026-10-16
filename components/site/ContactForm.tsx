'use client'

import { useState } from 'react'
import { Button, buttonClasses } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { MailIcon } from '@/components/ui/icons'
import { site } from '@/lib/site'

const subjects = [
  'Speaking invitation',
  'Advisory or consulting',
  'Collaboration',
  'Something else',
] as const

/**
 * Phase 2: front-end only — no data leaves the browser.
 * Phase 4: submits to Supabase `contact_messages` (insert-only, rate-limited,
 * Cloudflare Turnstile) and emails an alert to hasibreza@gmail.com.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div role="status" className="flex min-h-[420px] flex-col items-start justify-center gap-4">
        <MailIcon size={48} className="text-accent" />
        <h2 className="font-display m-0 text-3xl font-semibold">Your message was not sent yet.</h2>
        <p className="text-ink-2 m-0">
          The contact form is being connected. Until then, please email me directly and I&apos;ll
          reply personally.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className={buttonClasses('primary', 'md')}>
            Email {site.email}
          </a>
          <Button variant="secondary" size="md" onClick={() => setSent(false)}>
            Back to the form
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      aria-label="Contact form"
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <div className="flex flex-wrap gap-5">
        <TextField
          id="c-name"
          label="Name"
          name="name"
          autoComplete="name"
          required
          className="flex-[1_1_220px]"
        />
        <TextField
          id="c-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="flex-[1_1_220px]"
        />
      </div>
      <SelectField id="c-subject" label="Subject" name="subject" options={subjects} />
      <TextAreaField id="c-message" label="Message" name="message" rows={6} required />
      <div
        className="rounded-control border-line bg-bg text-ink-2 flex h-16 items-center border border-dashed px-4 font-mono text-[13px]"
        aria-hidden="true"
      >
        [Cloudflare Turnstile — spam check, added in Phase 4]
      </div>
      <Button type="submit" className="self-start">
        Send message
      </Button>
      <p className="text-ink-2 m-0 text-sm">
        Your details are used only to reply to you. They are never shared.
      </p>
    </form>
  )
}
