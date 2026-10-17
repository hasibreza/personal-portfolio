'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminNav } from '@/lib/site'
import { Monogram } from '@/components/site/Monogram'
import { ThemeToggle } from '@/components/site/ThemeToggle'

function AdminNavList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-0.5 p-0 font-medium">
      {adminNav.map((item) => {
        const active =
          pathname !== null &&
          (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href))
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`block rounded-lg px-3 py-2.5 no-underline ${
                active ? 'bg-tint text-ink' : 'text-ink-2 hover:text-ink'
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

export function AdminNav() {
  return <AdminNavList pathname={usePathname()} />
}

export function AdminNavFallback() {
  return <AdminNavList pathname={null} />
}

export function AdminSidebarFrame({
  children,
  footer,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <aside className="border-line bg-surface flex w-full flex-col gap-6 border-b px-4 py-6 md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center gap-2.5 px-2">
        <Monogram size={36} />
        <span className="font-display text-[17px] font-semibold">Admin</span>
      </div>
      <nav aria-label="Admin">{children}</nav>
      <div className="border-line mt-auto flex items-center justify-between gap-2 border-t px-1 pt-4">
        <div className="flex flex-col">
          <Link href="/" className="text-ink-2 inline-flex min-h-11 items-center px-2 no-underline">
            View site ↗
          </Link>
          {footer}
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
