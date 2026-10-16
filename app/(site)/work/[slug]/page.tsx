import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { Tag } from '@/components/ui/Basics'
import { DownloadIcon } from '@/components/ui/icons'
import { getWorkSample, workSamples } from '@/content/samples'
import { JsonLd, creativeWorkJsonLd, pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return workSamples.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const item = getWorkSample(slug)
  if (!item) return {}
  return pageMetadata({
    title: `${item.title} – Case Study – Hasib Reza`,
    description: item.summary,
    path: `/work/${item.slug}`,
    type: 'article',
    noindex: item.isSample,
  })
}

const meta = [
  ['My role', '[Role]'],
  ['Timeline', '[Year or period]'],
  ['Scale', '[Sites, users or systems]'],
  ['Stack', '[Key technologies]'],
] as const

const sections = [
  [
    '01 — The problem',
    '[What needed solving]',
    '[The business and technical situation before the project: constraints, risks and why it mattered.]',
  ],
  [
    '02 — My approach',
    '[How it was designed and delivered]',
    '[Design decisions, architecture, rollout steps and the team involved.]',
  ],
  [
    '03 — The outcome',
    '[What changed]',
    '[Results in plain terms: availability, cost, speed, risk reduced. Only figures Hasib supplies.]',
  ],
] as const

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const item = getWorkSample(slug)
  if (!item) notFound()

  const index = workSamples.findIndex((w) => w.slug === item.slug)
  const next = workSamples[(index + 1) % workSamples.length]

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
        <Breadcrumb items={[{ label: 'Work', href: '/work' }, { label: 'Case study' }]} />
        <span className="text-accent font-mono text-[13px] tracking-[0.06em] uppercase">
          {item.tag}
        </span>
        <h1 className="font-display mt-3 mb-4 text-[clamp(36px,4.5vw,52px)] leading-[1.08] font-bold tracking-[-0.02em]">
          {item.title}
        </h1>
        <p className="text-ink-2 m-0 text-xl">
          [Two-sentence summary of the project and its result, written from Hasib&apos;s notes.]
        </p>
        <dl className="rounded-card border-line bg-surface m-0 mt-8 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 border p-6">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="text-ink-2 font-mono text-xs uppercase">{k}</dt>
              <dd className="m-0 mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="container-page">
        <div
          role="img"
          aria-label="Cover image placeholder"
          className="rounded-panel border-line bg-tint text-ink-2 flex aspect-[21/9] items-center justify-center border p-4 text-center font-mono text-sm"
        >
          [Cover image or architecture diagram — uploaded in admin]
        </div>
      </div>

      <article className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-6 pt-16 pb-10 text-lg">
        {sections.map(([label, heading, body]) => (
          <section key={label} className="flex flex-col gap-3">
            <span className="text-accent font-mono text-[13px] uppercase">{label}</span>
            <h2 className="font-display m-0 text-[28px] font-semibold">{heading}</h2>
            <p className="text-ink-2 m-0">{body}</p>
          </section>
        ))}
        <div className="flex flex-wrap gap-2">
          <Tag>[tag]</Tag>
          <Tag>[tag]</Tag>
          <Tag>[tag]</Tag>
        </div>
        <span className="rounded-button border-line text-ink-2 inline-flex h-[52px] items-center gap-2.5 self-start border border-dashed px-5 text-base">
          <DownloadIcon size={18} />
          Optional download — attached in admin
        </span>
      </article>

      <div className="mx-auto w-full max-w-[720px] px-6 pb-24">
        <div className="border-line flex flex-wrap justify-between gap-4 border-t pt-8">
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center font-semibold no-underline"
          >
            ← All work
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="inline-flex min-h-11 items-center font-semibold no-underline"
          >
            Next case study →
          </Link>
        </div>
      </div>
    </>
  )
}
