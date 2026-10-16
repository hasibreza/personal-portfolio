import Link from 'next/link'
import type { Certification } from '@/content/certifications'
import type { Expertise } from '@/content/expertise'
import type { Post, WorkSample } from '@/content/samples'
import { Tag } from '@/components/ui/Basics'
import { buttonClasses } from '@/components/ui/Button'
import { expertiseIcons } from '@/components/ui/icons'

export function ExpertiseCard({ item }: { item: Expertise }) {
  const Icon = expertiseIcons[item.icon]
  if (item.featured) {
    return (
      <article className="reveal rounded-card border-accent bg-tint flex flex-[2_1_560px] flex-col gap-3.5 border-2 p-8">
        <Icon size={36} className="text-accent" />
        <h3 className="font-display m-0 text-[26px] font-semibold">{item.title}</h3>
        <p className="text-ink-2 m-0 text-[17px]">{item.body}</p>
        {item.tags ? (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
      </article>
    )
  }
  return (
    <article className="reveal rounded-card border-line bg-bg flex flex-[1_1_300px] flex-col gap-3 border p-7">
      <Icon size={30} className="text-accent" />
      <h3 className="font-display m-0 text-[21px] font-semibold">{item.title}</h3>
      <p className="text-ink-2 m-0">{item.body}</p>
    </article>
  )
}

function CoverPlaceholder({ ratio = 'aspect-video' }: { ratio?: string }) {
  return (
    <div
      className={`${ratio} bg-tint text-ink-2 flex items-center justify-center font-mono text-[13px]`}
      aria-hidden="true"
    >
      [Cover image]
    </div>
  )
}

export function WorkCard({
  item,
  headingLevel = 'h3',
}: {
  item: WorkSample
  /** h2 when the card sits directly under the page h1 (e.g. /work), h3 inside a titled section. */
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  return (
    <Link
      href={`/work/${item.slug}`}
      className="reveal rounded-card border-line bg-surface text-ink hover:border-ink-2 hover:text-ink flex flex-col overflow-hidden border no-underline"
    >
      <CoverPlaceholder />
      <div className="flex flex-col gap-2.5 p-6">
        <span className="text-accent font-mono text-[12.5px] uppercase">{item.tag}</span>
        <Heading className="font-display m-0 text-[21px] font-semibold">{item.title}</Heading>
        <p className="text-ink-2 m-0">{item.summary}</p>
      </div>
    </Link>
  )
}

export function PostCard({ item, onSurface = false }: { item: Post; onSurface?: boolean }) {
  return (
    <Link
      href={`/insights/${item.slug}`}
      className={`reveal rounded-card border-line text-ink hover:border-ink-2 hover:text-ink flex flex-col gap-3 border p-7 no-underline ${
        onSurface ? 'bg-bg' : 'bg-surface'
      }`}
    >
      <span className="text-ink-2 font-mono text-[12.5px]">
        {item.date} · {item.readingTime}
      </span>
      <h3 className="font-display m-0 text-[21px] font-semibold">{item.title}</h3>
      <p className="text-ink-2 m-0">{item.excerpt}</p>
      <span className="text-accent font-mono text-[12.5px]">#{item.tag}</span>
    </Link>
  )
}

function BadgeSlot({ large = false }: { large?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`border-line bg-bg text-ink-2 flex shrink-0 items-center justify-center border text-center font-mono ${
        large ? 'size-24 rounded-[16px] text-xs' : 'size-16 rounded-[12px] text-[11.5px]'
      }`}
    >
      [Badge]
    </div>
  )
}

function VerifyLink({ cert, asButton = false }: { cert: Certification; asButton?: boolean }) {
  const label = `Verify ${cert.name}`
  if (!cert.verifyUrl) {
    return (
      <span className={asButton ? buttonClasses('secondary', 'md') : 'text-ink-2 mt-auto text-sm'}>
        Verification link to supply
      </span>
    )
  }
  return (
    <a
      href={cert.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        asButton
          ? buttonClasses('primary', 'md')
          : 'mt-auto inline-flex min-h-11 items-center font-semibold no-underline'
      }
    >
      Verify ↗
    </a>
  )
}

export function CertBadgeCard({ cert }: { cert: Certification }) {
  if (cert.featured) {
    return (
      <article className="reveal rounded-card border-accent bg-tint col-span-full flex flex-wrap items-center gap-7 border-2 p-8">
        <BadgeSlot large />
        <div className="flex flex-[1_1_360px] flex-col gap-1.5">
          {/* Body text colour: accent on the tint panel is below 4.5:1 (WCAG AA). */}
          <span className="text-ink font-mono text-[13px] font-medium uppercase">
            {cert.code} · {cert.year}
          </span>
          <h2 className="font-display m-0 text-[26px] font-semibold">{cert.name}</h2>
          <p className="text-ink-2 m-0">
            {cert.issuer}
            {cert.detail ? ` · ${cert.detail}` : ''}
          </p>
        </div>
        <VerifyLink cert={cert} asButton />
      </article>
    )
  }
  return (
    <article className="reveal rounded-card border-line bg-surface flex flex-col gap-2.5 border p-6">
      <BadgeSlot />
      <span className="text-accent font-mono text-[12.5px] uppercase">
        {cert.code} · {cert.year}
      </span>
      <h3 className="font-display m-0 text-[19px] font-semibold">{cert.name}</h3>
      <p className="text-ink-2 m-0 text-[15px]">
        {cert.issuer}
        {cert.detail ? ` · ${cert.detail}` : ''}
      </p>
      <VerifyLink cert={cert} />
    </article>
  )
}
