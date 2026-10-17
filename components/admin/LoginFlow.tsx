'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { browserClient } from '@/lib/supabase/browser'

type Step =
  | { kind: 'checking' }
  | { kind: 'password' }
  | { kind: 'verify'; factorId: string }
  | { kind: 'enroll'; factorId: string; qr: string; secret: string }

function authMessage(err: { message: string; status?: number; code?: string }): string {
  if (err.status === 429 || err.code === 'over_request_rate_limit') {
    return 'Too many attempts. For your security, sign-in is paused for a few minutes. Please wait and try again.'
  }
  if (err.code === 'invalid_credentials') return 'Email or password is incorrect.'
  if (err.code === 'mfa_verification_failed' || /invalid totp|verification/i.test(err.message)) {
    return 'That code did not match. Use the current 6-digit code from your authenticator app.'
  }
  return 'Sign-in failed. Please try again.'
}

/** Email + password, then a TOTP code (or first-time authenticator enrolment). */
export function LoginFlow() {
  const router = useRouter()
  const [step, setStep] = useState<Step>({ kind: 'checking' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function toMfaStep() {
    const supabase = browserClient()
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors()
    if (listError) throw listError
    const verified = factors.totp.find((f) => f.status === 'verified')
    if (verified) {
      setStep({ kind: 'verify', factorId: verified.id })
      return
    }
    // First sign-in: clear abandoned enrolments, then enrol a new authenticator.
    for (const f of factors.all.filter((f) => f.status === 'unverified')) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Authenticator app',
    })
    if (enrollError) throw enrollError
    setStep({ kind: 'enroll', factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret })
  }

  useEffect(() => {
    let alive = true
    browserClient()
      .auth.mfa.getAuthenticatorAssuranceLevel()
      .then(async ({ data }) => {
        if (!alive) return
        if (data?.currentLevel === 'aal2') router.replace('/admin')
        else if (data?.currentLevel === 'aal1') await toMfaStep()
        else setStep({ kind: 'password' })
      })
      .catch(() => alive && setStep({ kind: 'password' }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const fd = new FormData(e.currentTarget)
    try {
      const { error: signInError } = await browserClient().auth.signInWithPassword({
        email: String(fd.get('email')),
        password: String(fd.get('password')),
      })
      if (signInError) throw signInError
      await toMfaStep()
    } catch (err) {
      setError(authMessage(err as { message: string; status?: number; code?: string }))
    } finally {
      setBusy(false)
    }
  }

  async function onCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (step.kind !== 'verify' && step.kind !== 'enroll') return
    setError('')
    setBusy(true)
    const code = String(new FormData(e.currentTarget).get('code')).replace(/\s/g, '')
    try {
      const { error: verifyError } = await browserClient().auth.mfa.challengeAndVerify({
        factorId: step.factorId,
        code,
      })
      if (verifyError) throw verifyError
      router.replace('/admin')
      router.refresh()
    } catch (err) {
      setError(authMessage(err as { message: string; status?: number; code?: string }))
      setBusy(false)
    }
  }

  async function startOver() {
    await browserClient().auth.signOut()
    setError('')
    setStep({ kind: 'password' })
  }

  const alert = error ? (
    <p role="alert" className="bg-warn-bg text-warn rounded-button m-0 px-4 py-3 text-[15px]">
      {error}
    </p>
  ) : null

  if (step.kind === 'checking') {
    return <p className="text-ink-2 m-0">Checking your session…</p>
  }

  if (step.kind === 'password') {
    return (
      <>
        <div>
          <h1 className="font-display m-0 mb-1.5 text-[28px] font-semibold">Sign in</h1>
          <p className="text-ink-2 m-0 text-[15px]">Private area for site management.</p>
        </div>
        {alert}
        <form aria-label="Sign in" className="flex flex-col gap-4" onSubmit={onPassword}>
          <TextField
            id="a-email"
            name="email"
            label="Email"
            type="email"
            autoComplete="username"
            required
          />
          <TextField
            id="a-pass"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? 'Checking…' : 'Continue'}
          </Button>
        </form>
      </>
    )
  }

  return (
    <>
      <div>
        <h1 className="font-display m-0 mb-1.5 text-[28px] font-semibold">
          {step.kind === 'enroll' ? 'Set up your authenticator' : 'Authenticator code'}
        </h1>
        <p className="text-ink-2 m-0 text-[15px]">
          {step.kind === 'enroll'
            ? 'Scan this QR code with your authenticator app (for example Google Authenticator or 1Password), then enter the 6-digit code it shows.'
            : 'Enter the 6-digit code from your authenticator app.'}
        </p>
      </div>
      {step.kind === 'enroll' ? (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL SVG from Supabase */}
          <img
            src={step.qr}
            alt="QR code for your authenticator app"
            width={180}
            height={180}
            className="rounded-lg bg-white p-2"
          />
          <p className="text-ink-2 m-0 text-center text-[13px]">
            Can&apos;t scan? Enter this key manually:
            <br />
            <code className="text-ink font-mono text-[13px] break-all select-all">
              {step.secret}
            </code>
          </p>
        </div>
      ) : null}
      {alert}
      <form aria-label="Verify code" className="flex flex-col gap-4" onSubmit={onCode}>
        <TextField
          id="a-code"
          name="code"
          label="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
          autoFocus
        />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Verifying…' : 'Verify and sign in'}
        </Button>
      </form>
      <button
        type="button"
        onClick={startOver}
        className="text-ink-2 min-h-11 cursor-pointer self-start border-0 bg-transparent p-0 text-sm underline"
      >
        Use a different account
      </button>
    </>
  )
}
