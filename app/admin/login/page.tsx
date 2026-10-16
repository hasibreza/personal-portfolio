import Link from 'next/link'
import { Monogram } from '@/components/site/Monogram'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { TextField } from '@/components/ui/Field'
import { buttonClasses } from '@/components/ui/Button'

/** Shell only. Phase 4: Supabase Auth (email + password) followed by an MFA (TOTP) step. */
export default function AdminLoginPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monogram />
            <span className="font-display text-lg font-semibold">Admin</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="rounded-panel border-line bg-surface flex flex-col gap-5 border p-9">
          <div>
            <h1 className="font-display m-0 mb-1.5 text-[28px] font-semibold">Sign in</h1>
            <p className="text-ink-2 m-0 text-[15px]">Private area for site management.</p>
          </div>
          <form aria-label="Sign in" className="flex flex-col gap-4">
            <TextField id="a-email" label="Email" type="email" autoComplete="username" />
            <TextField
              id="a-pass"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Link href="/admin" className={buttonClasses('primary', 'lg', 'w-full')}>
              Continue (preview)
            </Link>
          </form>
          <p className="text-ink-2 m-0 text-[13px]">
            Sign-in and the two-factor step are connected in Phase 4. This button only previews the
            dashboard.
          </p>
        </div>
        <p className="text-ink-2 m-0 text-center text-[13px]">
          Single admin account · public sign-up disabled · Supabase Auth + MFA
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center self-center text-sm no-underline"
        >
          ← Back to the public site
        </Link>
      </div>
    </main>
  )
}
