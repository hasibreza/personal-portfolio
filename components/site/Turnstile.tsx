'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

/**
 * Cloudflare Turnstile widget (explicit render, so it also works after client-side
 * navigation). It adds a hidden `cf-turnstile-response` field to the surrounding form.
 */
export function Turnstile({ resetKey }: { resetKey: number }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const [ready, setReady] = useState(() => typeof window !== 'undefined' && !!window.turnstile)

  useEffect(() => {
    if (!ready || !siteKey || !box.current || !window.turnstile) return
    widget.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      theme: 'auto',
      size: 'flexible',
    })
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current)
      widget.current = null
    }
  }, [ready, siteKey, resetKey])

  if (!siteKey) {
    return (
      <p className="text-ink-2 m-0 text-sm" role="note">
        Spam protection isn&apos;t configured on this deployment, so the form can&apos;t be sent.
      </p>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={box} className="min-h-[65px]" />
    </>
  )
}
