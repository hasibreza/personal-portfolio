import Link from 'next/link'
import { site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-line border-t">
      <div className="container-page text-ink-2 flex flex-wrap justify-between gap-6 py-10 text-sm">
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-ink text-base font-semibold">{site.name}</span>
          <span>© 2026 · Dhaka, Bangladesh</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-6">
          <a href={`mailto:${site.email}`} className="no-underline">
            {site.email}
          </a>
          {site.linkedin ? (
            <a href={site.linkedin} rel="me noopener" className="no-underline">
              LinkedIn
            </a>
          ) : (
            <span>LinkedIn [URL to supply]</span>
          )}
          <Link href="/contact" className="no-underline">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
