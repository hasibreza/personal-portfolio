import { createHash } from 'node:crypto'
import { z } from 'zod'

export const contactSubjects = [
  'Speaking invitation',
  'Advisory or consulting',
  'Collaboration',
  'Something else',
] as const

/** Mirrors the database CHECK constraints on public.contact_messages. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120, 'Name is too long.'),
  email: z
    .string()
    .trim()
    .max(254, 'Email is too long.')
    .pipe(z.email({ message: 'Please enter a valid email address.' })),
  subject: z.enum(contactSubjects, { message: 'Please choose a subject.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Please write a little more (at least 10 characters).')
    .max(5000, 'Please keep your message under 5,000 characters.'),
})
export type ContactInput = z.infer<typeof contactSchema>

export type ContactState =
  | { status: 'idle' }
  | {
      status: 'error'
      message: string
      fieldErrors?: Partial<Record<keyof ContactInput, string>>
      /** Echoed back so a failed attempt doesn't clear what the visitor typed. */
      values?: Partial<Record<keyof ContactInput, string>>
    }
  | { status: 'sent'; email: string }

/** Max messages per sender (hashed IP) per hour, enforced before the database backstop of 5. */
export const RATE_LIMIT_PER_HOUR = 3

export function clientIp(h: Headers): string {
  const fwd = h.get('x-forwarded-for')?.split(',')[0]?.trim()
  return fwd || h.get('x-real-ip')?.trim() || 'unknown'
}

/** Raw IPs are never stored: only a salted SHA-256 (64 hex chars). */
export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

/** Verifies a Cloudflare Turnstile token server-side. Fails closed on any error. */
export async function verifyTurnstile(
  token: string,
  ip: string,
  secret: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!secret || !token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip !== 'unknown') body.set('remoteip', ip)
    const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return false
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch {
    return false
  }
}

export function fieldErrors(error: z.ZodError<ContactInput>) {
  const out: Partial<Record<keyof ContactInput, string>> = {}
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput
    out[key] ??= issue.message
  }
  return out
}
