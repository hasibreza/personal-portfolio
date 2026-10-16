import Link from 'next/link'
import { FilterablePosts } from '@/components/cards/FilterableGrids'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { SectionLabel } from '@/components/ui/Basics'
import { RssIcon } from '@/components/ui/icons'
import { posts } from '@/content/samples'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Insights on Private Cloud, Infrastructure & AI – Hasib Reza',
  description:
    'Articles on virtualization, data centre resilience, cybersecurity and applied AI in regulated enterprises.',
  path: '/insights',
})

export default function InsightsPage() {
  const [featured, ...rest] = posts
  return (
    <div className="container-page pt-[72px] pb-24">
      <Breadcrumb items={[{ label: 'Insights' }]} />
      <div className="mb-10 max-w-[680px]">
        <SectionLabel>Insights</SectionLabel>
        <h1 className="font-display m-0 mb-4 text-[clamp(40px,5vw,56px)] leading-[1.05] font-bold tracking-[-0.02em]">
          Notes on private cloud, infrastructure and AI
        </h1>
        <p className="text-ink-2 m-0 text-lg">
          Practical writing for technology leaders in regulated industries.
        </p>
      </div>

      <Link
        href={`/insights/${featured.slug}`}
        className="border-line bg-surface text-ink hover:border-ink-2 hover:text-ink rounded-panel mb-10 flex flex-wrap overflow-hidden border no-underline"
      >
        <div
          aria-hidden="true"
          className="bg-tint text-ink-2 flex min-h-[240px] flex-[1_1_480px] items-center justify-center font-mono text-[13px]"
        >
          [Cover image]
        </div>
        <div className="flex flex-[1_1_380px] flex-col justify-center gap-3.5 p-8 sm:p-10">
          <span className="text-accent font-mono text-[12.5px]">FEATURED · #{featured.tag}</span>
          <h2 className="font-display m-0 text-[32px] leading-[1.15] font-semibold">
            [Featured article title]
          </h2>
          <p className="text-ink-2 m-0">{featured.excerpt}</p>
          <span className="text-ink-2 font-mono text-[12.5px]">
            {featured.date} · {featured.readingTime}
          </span>
        </div>
      </Link>

      <FilterablePosts items={rest} />

      <div className="border-line mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <span className="text-ink-2 inline-flex min-h-11 items-center gap-2">
          <RssIcon size={18} /> RSS feed arrives with the blog in Phase 4
        </span>
      </div>
    </div>
  )
}
