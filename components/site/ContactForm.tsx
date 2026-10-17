'use client'

import { useActionState, useState } from 'react'
import { sendContact } from '@/app/(site)/contact/actions'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { MailIcon } from '@/components/ui/icons'
import { contactSubjects, type ContactState } from '@/lib/contact'
import { Turnstile } from './Turnstile'

const initial: ContactState = { status: 'idle' }

function FieldError({ id, text }: { id: string; text?: string }) {
  if (!text) return null
  return (
    <p id={id} className="text-warn m-0 -mt-3 text-sm font-medium">
      {text}
    </p>
  )
}

/** Contact form: server action with Turnstile, rate limiting and an email alert. */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial)
  const [round, setRound] = useState(0)

  if (state.status === 'sent') {
    return (
      <div role="status" className="flex min-h-[420px] flex-col items-start justify-center gap-4">
        <MailIcon size={48} className="text-accent" />
        <h2 className="font-display m-0 text-3xl font-semibold">Thank you — message received.</h2>
        <p className="text-ink-2 m-0">
          I read every message myself and will reply
          {state.email ? (
            <>
              {' '}
              to <strong className="text-ink">{state.email}</strong>
            </>
          ) : null}{' '}
          as soon as I can.
        </p>
      </div>
    )
  }

  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  const v = state.status === 'error' ? (state.values ?? {}) : {}
  const describe = (k: string) => (errors[k as keyof typeof errors] ? `c-${k}-err` : undefined)

  return (
    <form
      aria-label="Contact form"
      className="flex flex-col gap-5"
      action={(fd) => {
        action(fd)
        setRound((r) => r + 1) // a Turnstile token is single-use: fresh widget after each try
      }}
      noValidate
    >
      {state.status === 'error' ? (
        <p role="alert" className="bg-warn-bg text-warn rounded-button m-0 px-4 py-3 text-[15px]">
          {state.message}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-[1_1_220px] flex-col gap-5">
          <TextField
            id="c-name"
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={v.name}
            required
            maxLength={120}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe('name')}
          />
          <FieldError id="c-name-err" text={errors.name} />
        </div>
        <div className="flex flex-[1_1_220px] flex-col gap-5">
          <TextField
            id="c-email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={v.email}
            required
            maxLength={254}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
          />
          <FieldError id="c-email-err" text={errors.email} />
        </div>
      </div>
      <SelectField
        id="c-subject"
        label="Subject"
        name="subject"
        options={contactSubjects}
        defaultValue={v.subject}
      />
      <TextAreaField
        id="c-message"
        label="Message"
        name="message"
        rows={6}
        required
        maxLength={5000}
        defaultValue={v.message}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={describe('message')}
      />
      <FieldError id="c-message-err" text={errors.message} />

      {/* Honeypot for bots: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="c-company">Company</label>
        <input id="c-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Turnstile resetKey={round} />

      <Button type="submit" className="self-start" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </Button>
      <p className="text-ink-2 m-0 text-sm">
        Your details are used only to reply to you. They are never shared.
      </p>
    </form>
  )
}
