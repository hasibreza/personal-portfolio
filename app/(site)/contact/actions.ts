'use server'

import { headers } from 'next/headers'
import {
  RATE_LIMIT_PER_HOUR,
  clientIp,
  contactSchema,
  fieldErrors,
  hashIp,
  verifyTurnstile,
  type ContactInput,
  type ContactState,
} from '@/lib/contact'
import { serviceClient } from '@/lib/supabase/service'
import { site } from '@/lib/site'

const emailMe = `Please email me directly at ${site.email}.`
const tooMany = `You've sent several messages in the last hour. Please try again later, or email me directly at ${site.email}.`

/**
 * Contact form: validate → Turnstile → rate limit → insert (service role) → email alert.
 * Each failure returns an honest message; nothing claims success unless the row was saved.
 */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values: Record<keyof ContactInput, string> = {
    name: String(form.get('name') ?? ''),
    email: String(form.get('email') ?? ''),
    subject: String(form.get('subject') ?? ''),
    message: String(form.get('message') ?? ''),
  }
  const fail = (
    message: string,
    errors?: Partial<Record<keyof ContactInput, string>>,
  ): ContactState => ({
    status: 'error',
    message,
    fieldErrors: errors,
    values,
  })

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get('company') ?? '') !== '') return { status: 'sent', email: '' }

  const parsed = contactSchema.safeParse(values)
  if (!parsed.success)
    return fail('Please check the highlighted fields.', fieldErrors(parsed.error))

  const h = await headers()
  const ip = clientIp(h)
  const human = await verifyTurnstile(
    String(form.get('cf-turnstile-response') ?? ''),
    ip,
    process.env.TURNSTILE_SECRET_KEY,
  )
  if (!human) {
    return fail("The spam check didn't complete. Please wait for it to finish and try again.")
  }

  const supabase = serviceClient()
  const salt = process.env.CONTACT_IP_SALT ?? (process.env.NODE_ENV === 'development' ? 'dev' : '')
  if (!supabase || !salt) return fail(`The form isn't available right now. ${emailMe}`)
  const ipHash = hashIp(ip, salt)

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since)
  if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) return fail(tooMany)

  const { name, email, subject, message } = parsed.data
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, subject, message, ip_hash: ipHash })
  if (error) {
    return fail(
      error.message.includes('rate_limited')
        ? tooMany
        : `Your message couldn't be saved. ${emailMe}`,
    )
  }

  // The message is stored; the email alert is best-effort (it is also in the admin inbox).
  await sendAlert({ name, email, subject, message }).catch(() => undefined)
  return { status: 'sent', email }
}

async function sendAlert(m: ContactInput) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portfolio contact <onboarding@resend.dev>',
      to: [site.email],
      reply_to: m.email,
      subject: `[Portfolio] ${m.subject} — ${m.name}`,
      text: `${m.message}\n\n— ${m.name} <${m.email}>\n\nAlso saved in the admin inbox.`,
    }),
    signal: AbortSignal.timeout(8000),
  })
}
