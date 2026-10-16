'use client'

import { MoonIcon, SunIcon } from '@/components/ui/icons'

/**
 * Toggles data-theme on <html> and remembers the choice in localStorage.
 * Both icons are rendered and CSS shows the right one, so server and client HTML match.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  function toggle() {
    const root = document.documentElement
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className={`rounded-control border-line bg-surface text-ink flex size-11 cursor-pointer items-center justify-center border ${className}`}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  )
}
