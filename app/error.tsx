'use client'

import Link from 'next/link'

/** Branded fallback for unexpected errors. Shows no technical detail to visitors. */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main
      id="main"
      className="container-page flex min-h-[70dvh] flex-col items-start justify-center gap-5 py-24"
    >
      <p className="text-accent m-0 font-mono text-[13px] tracking-[0.08em]">
        SOMETHING WENT WRONG
      </p>
      <h1 className="font-display m-0 text-[clamp(36px,5vw,52px)] leading-[1.05] font-bold">
        This page didn&apos;t load properly.
      </h1>
      <p className="text-ink-2 m-0 text-lg">
        Please try again. If it keeps happening, go back home.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-accent text-on-accent rounded-button inline-flex h-[52px] cursor-pointer items-center border-0 px-6 font-semibold"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-line bg-surface text-ink rounded-button inline-flex h-[52px] items-center border px-6 font-semibold no-underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
