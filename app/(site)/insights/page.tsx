import Image from 'next/image'
import Link from 'next/link'
import { FilterablePosts } from '@/components/cards/FilterableGrids'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { EmptyState } from '@/components/site/RichText'
import { SectionLabel } from '@/components/ui/Basics'
import { RssIcon } from '@/components/ui/icons'
import { getPosts } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Insights on Private Cloud, Infrastructure & AI – Hasib Reza',
  description:
    'Articles on virtualization, data centre resilience, cybersecurity and applied AI in regulated enterprises.',
  path: '/insights',
})

export default async function InsightsPage() {
  const posts = await getPosts()
  const featured = posts.find((p) => p.featured) ?? posts[0]
  const rest = posts.filter((p) => p.slug !== featured?.slug)

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

      {featured ? (
        <Link
          href={`/insights/${featured.slug}`}
          className="border-line bg-surface text-ink hover:border-ink-2 hover:text-ink rounded-panel mb-10 flex flex-wrap overflow-hidden border no-underline"
        >
          <div className="bg-tint relative min-h-[240px] flex-[1_1_480px]">
            {featured.coverUrl ? (
              <Image
                src={featured.coverUrl}
                alt={featured.coverAlt}
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-[1_1_380px] flex-col justify-center gap-3.5 p-8 sm:p-10">
            <span className="text-accent font-mono text-[12.5px] uppercase">
              Featured · #{featured.tag}
            </span>
            <h2 className="font-display m-0 text-[32px] leading-[1.15] font-semibold">
              {featured.title}
            </h2>
            <p className="text-ink-2 m-0">{featured.excerpt}</p>
            <span className="text-ink-2 font-mono text-[12.5px]">
              <time dateTime={featured.dateIso}>{featured.date}</time> · {featured.readingTime}
            </span>
          </div>
        </Link>
      ) : (
        <EmptyState>The first articles are on their way.</EmptyState>
      )}

      {rest.length > 0 ? <FilterablePosts items={rest} /> : null}

      {featured ? (
        <div className="border-line mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <a
            href="/insights/rss.xml"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            <RssIcon size={18} /> RSS feed
          </a>
        </div>
      ) : null}
    </div>
  )
}
