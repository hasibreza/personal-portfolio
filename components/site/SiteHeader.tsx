import Link from 'next/link'
import { Suspense } from 'react'
import { buttonClasses } from '@/components/ui/Button'
import { MobileMenu } from './MobileMenu'
import { NavLinks, NavLinksFallback } from './NavLinks'
import { Monogram } from './Monogram'
import { ThemeToggle } from './ThemeToggle'

export function SiteHeader() {
  return (
    <header className="border-line bg-bg/95 sticky top-0 z-30 border-b backdrop-blur">
      <a
        href="#main"
        className="bg-accent text-on-accent sr-only rounded-md px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>
      <div className="container-page relative flex items-center justify-between gap-4 py-4">
        <Link href="/" className="text-ink flex items-center gap-3 no-underline">
          <Monogram />
          <span className="font-display text-lg font-semibold whitespace-nowrap">Hasib Reza</span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <span className="hidden sm:block">
            <a href="/cv" className={buttonClasses('primary', 'md')}>
              Download CV
            </a>
          </span>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
