import { describe, expect, it, vi } from 'vitest'
import { clientIp, contactSchema, hashIp, verifyTurnstile } from '@/lib/contact'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Collaboration',
  message: 'Hello Hasib, I would like to talk about private cloud.',
}

describe('contactSchema — abuse cases', () => {
  it('accepts a normal message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })
  it.each([
    ['empty name', { name: '   ' }],
    ['oversized name', { name: 'x'.repeat(121) }],
    ['invalid email', { email: 'not-an-email' }],
    ['header injection in email', { email: 'a@b.co\r\nBcc: victim@example.com' }],
    ['unknown subject', { subject: 'Buy cheap pills' }],
    ['too-short message', { message: 'hi' }],
    ['oversized message', { message: 'x'.repeat(5001) }],
  ])('rejects %s', (_name, patch) => {
    expect(contactSchema.safeParse({ ...valid, ...patch }).success).toBe(false)
  })
  it('trims whitespace', () => {
    const r = contactSchema.parse({ ...valid, name: '  Ada  ' })
    expect(r.name).toBe('Ada')
  })
})

describe('IP handling', () => {
  it('uses the first forwarded address', () => {
    const h = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })
    expect(clientIp(h)).toBe('203.0.113.7')
  })
  it('falls back to x-real-ip, then "unknown"', () => {
    expect(clientIp(new Headers({ 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2')
    expect(clientIp(new Headers())).toBe('unknown')
  })
  it('never stores the raw IP: 64-char salted hash, salt-dependent', () => {
    const a = hashIp('203.0.113.7', 'salt-a')
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(a).not.toContain('203.0.113.7')
    expect(hashIp('203.0.113.7', 'salt-b')).not.toBe(a)
  })
})

describe('verifyTurnstile — fails closed', () => {
  const ok = () => Promise.resolve(new Response(JSON.stringify({ success: true })))
  const no = () => Promise.resolve(new Response(JSON.stringify({ success: false })))

  it('passes only when Cloudflare says success', async () => {
    expect(await verifyTurnstile('tok', '1.2.3.4', 'secret', vi.fn(ok))).toBe(true)
    expect(await verifyTurnstile('tok', '1.2.3.4', 'secret', vi.fn(no))).toBe(false)
  })
  it('rejects a missing token or secret without calling Cloudflare', async () => {
    const f = vi.fn(ok)
    expect(await verifyTurnstile('', '1.2.3.4', 'secret', f)).toBe(false)
    expect(await verifyTurnstile('tok', '1.2.3.4', undefined, f)).toBe(false)
    expect(f).not.toHaveBeenCalled()
  })
  it('rejects on network errors and non-200 responses', async () => {
    expect(
      await verifyTurnstile(
        'tok',
        'x',
        's',
        vi.fn(() => Promise.reject(new Error('down'))),
      ),
    ).toBe(false)
    expect(
      await verifyTurnstile(
        'tok',
        'x',
        's',
        vi.fn(() => Promise.resolve(new Response('', { status: 500 }))),
      ),
    ).toBe(false)
  })
})
