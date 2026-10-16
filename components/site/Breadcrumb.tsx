import Link from 'next/link'
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo'

export type Crumb = { label: string; href?: string }

/** Visible breadcrumb + matching BreadcrumbList structured data. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-ink-2 mb-5 text-sm">
        <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {all.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex gap-1.5">
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="no-underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
              {i < all.length - 1 ? <span aria-hidden="true">/</span> : null}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  )
}
