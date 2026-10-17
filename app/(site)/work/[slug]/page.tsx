import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { RichText } from '@/components/site/RichText'
import { Tag } from '@/components/ui/Basics'
import { buttonClasses } from '@/components/ui/Button'
import { DownloadIcon } from '@/components/ui/icons'
import { getProject, getProjects } from '@/lib/content'
import { htmlToText } from '@/lib/sanitize'
import { JsonLd, creativeWorkJsonLd, pageMetadata } from '@/lib/seo'

/** Cache Components needs at least one param; '_' renders the 404 page. */
export async function generateStaticParams() {
  const items = await getProjects()
  return items.length ? items.map((w) => ({ slug: w.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const item = await getProject(slug)
  if (!item) return {}
  return pageMetadata({
    title: item.seoTitle || `${item.title} – Case Study – Hasib Reza`,
    description: item.seoDescription || item.summary || htmlToText(item.problemHtml).slice(0, 155),
    path: `/work/${item.slug}`,
    type: 'article',
    image: item.coverUrl ?? undefined,
  })
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const item = await getProject(slug)
  if (!item) notFound()

  const all = await getProjects()
  const index = all.findIndex((w) => w.slug === item.slug)
  const next = all.length > 1 ? all[(index + 1) % all.length] : null

  const meta = [
    ['My role', item.role],
    ['Timeline', item.timeline],
    ['Scale', item.scale],
    ['Stack', item.stack],
  ].filter(([, v]) => v)

  const sections = [
    ['01 — The problem', item.problemHtml],
    ['02 — My approach', item.approachHtml],
    ['03 — The outcome', item.outcomeHtml],
  ].filter(([, html]) => htmlToText(html))

  return (
    <>
      <JsonLd
        data={creativeWorkJsonLd({
          title: item.title,
          description: item.summary,
          path: `/work/${item.slug}`,
        })}
      />
      <div className="mx-auto w-full max-w-[880px] px-6 pt-16 pb-10">
        <Breadcrumb items={[{ label: 'Work', href: '/work' }, { label: item.title }]} />
        <span className="text-accent font-mono text-[13px] tracking-[0.06em] uppercase">
          {item.tag}
        </span>
        <h1 className="font-display mt-3 mb-4 text-[clamp(36px,4.5vw,52px)] leading-[1.08] font-bold tracking-[-0.02em]">
          {item.title}
        </h1>
        {item.summary ? <p className="text-ink-2 m-0 text-xl">{item.summary}</p> : null}
        {meta.length ? (
          <dl className="rounded-card border-line bg-surface m-0 mt-8 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 border p-6">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="text-ink-2 font-mono text-xs uppercase">{k}</dt>
                <dd className="m-0 mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {item.coverUrl ? (
        <div className="container-page">
          <div className="rounded-panel border-line relative aspect-[21/9] overflow-hidden border">
            <Image
              src={item.coverUrl}
              alt={item.coverAlt}
              fill
              preload
              sizes="(min-width: 1200px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <article className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-6 pt-16 pb-10 text-lg">
        {sections.map(([label, html]) => (
          <section key={label} className="flex flex-col gap-3">
            <h2 className="text-accent m-0 font-mono text-[13px] font-normal uppercase">{label}</h2>
            <RichText html={html} className="text-ink-2" />
          </section>
        ))}
        {item.gallery.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {item.gallery.map((g) => (
              <figure key={g.url} className="m-0">
                <div className="border-line relative aspect-video overflow-hidden rounded-[14px] border">
                  <Image
                    src={g.url}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 768px) 340px, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            ))}
          </div>
        ) : null}
        {item.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
        {item.hasDownload ? (
          <a
            href={`/work/${item.slug}/download`}
            className={buttonClasses('secondary', 'lg', 'self-start')}
          >
            <DownloadIcon size={18} />
            Download summary
          </a>
        ) : null}
      </article>

      <div className="mx-auto w-full max-w-[720px] px-6 pb-24">
        <div className="border-line flex flex-wrap justify-between gap-4 border-t pt-8">
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center font-semibold no-underline"
          >
            ← All work
          </Link>
          {next ? (
            <Link
              href={`/work/${next.slug}`}
              className="inline-flex min-h-11 items-center font-semibold no-underline"
            >
              Next case study →
            </Link>
          ) : null}
        </div>
      </div>
    </>
  )
}
