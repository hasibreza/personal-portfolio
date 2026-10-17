import Link from 'next/link'
import { LoginFlow } from '@/components/admin/LoginFlow'
import { Monogram } from '@/components/site/Monogram'
import { ThemeToggle } from '@/components/site/ThemeToggle'

/** Supabase Auth: email + password, then an authenticator (TOTP) code. */
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
        <div className="rounded-panel border-line bg-surface flex flex-col gap-5 border p-6 sm:p-9">
          <LoginFlow />
        </div>
        <p className="text-ink-2 m-0 text-center text-[13px]">
          Single admin account · public sign-up disabled · two-factor sign-in required
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
