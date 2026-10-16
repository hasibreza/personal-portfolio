'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { CloseIcon, MenuIcon } from '@/components/ui/icons'
import { mainNav } from '@/lib/site'

/** Phone-width menu: a disclosure button that reveals a stacked nav panel. */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="rounded-control border-line bg-surface text-ink flex size-11 cursor-pointer items-center justify-center border"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav
        id={panelId}
        aria-label="Mobile"
        hidden={!open}
        className="border-line bg-surface absolute inset-x-0 top-full z-40 border-b px-4 pt-2 pb-4 shadow-sm"
      >
        <ul className="font-display m-0 list-none p-0 text-xl font-medium">
          {mainNav.map((item) => (
            <li key={item.href} className="border-line border-b last:border-b-0">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-ink block py-3 no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
