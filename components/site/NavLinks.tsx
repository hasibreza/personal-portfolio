'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav } from '@/lib/site'

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** Desktop navigation with the current page marked (aria-current). */
export function NavLinks({ withActive = true }: { withActive?: boolean }) {
  const pathname = usePathname()
  return <NavList pathname={withActive ? pathname : null} />
}

/** Static fallback rendered while the pathname resolves (Cache Components + Suspense). */
export function NavLinksFallback() {
  return <NavList pathname={null} />
}

function NavList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-7 p-0 text-[15px] font-medium">
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`no-underline ${
                active ? 'text-ink border-accent border-b-2' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
