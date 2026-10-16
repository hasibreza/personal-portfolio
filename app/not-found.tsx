import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      id="main"
      className="container-page flex min-h-[70dvh] flex-col items-start justify-center gap-5 py-24"
    >
      <p className="text-accent m-0 font-mono text-[13px] tracking-[0.08em]">404</p>
      <h1 className="font-display m-0 text-[clamp(36px,5vw,52px)] leading-[1.05] font-bold">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-ink-2 m-0 text-lg">The link may be old, or the address mistyped.</p>
      <Link
        href="/"
        className="bg-accent text-on-accent hover:text-on-accent rounded-button inline-flex h-[52px] items-center px-6 font-semibold no-underline"
      >
        Back to home
      </Link>
    </main>
  )
}
