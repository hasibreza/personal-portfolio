import type { ReactNode } from 'react'

/** Small mono eyebrow above section headings, e.g. "EXPERTISE". */
export function SectionLabel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-accent mb-3 font-mono text-[13px] font-medium tracking-[0.08em] uppercase ${className}`}
    >
      {children}
    </p>
  )
}

export function SectionHeading({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      id={id}
      className={`font-display m-0 text-[clamp(30px,3.4vw,40px)] leading-[1.15] font-semibold ${className}`}
    >
      {children}
    </h2>
  )
}

export function PageIntro({
  label,
  title,
  lead,
}: {
  label: string
  title: ReactNode
  lead?: ReactNode
}) {
  return (
    <div className="max-w-[820px]">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="font-display m-0 text-[clamp(40px,5vw,56px)] leading-[1.05] font-bold tracking-[-0.02em]">
        {title}
      </h1>
      {lead ? <p className="text-ink-2 mt-4 max-w-[640px] text-lg">{lead}</p> : null}
    </div>
  )
}

/** Mono tag chip used for technologies and categories. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-tag border-line bg-surface inline-block border px-2.5 py-1 font-mono text-[12.5px]">
      {children}
    </span>
  )
}

export function TrainingPill({
  children,
  highlight = false,
}: {
  children: ReactNode
  highlight?: boolean
}) {
  return (
    <li
      className={`rounded-full border px-3.5 py-2 text-[15px] ${
        highlight ? 'border-accent bg-tint' : 'border-line bg-surface'
      }`}
    >
      {children}
    </li>
  )
}

type PillTone = 'draft' | 'published' | 'scheduled' | 'live' | 'muted'
const tones: Record<PillTone, string> = {
  draft: 'bg-tint text-accent',
  published: 'bg-ink text-bg',
  scheduled: 'border border-line text-ink',
  live: 'bg-accent text-on-accent',
  muted: 'text-ink-2',
}

export function StatusPill({ tone, children }: { tone: PillTone; children: ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

/** Clearly visible marker for content that still needs Hasib's input. */
export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-ink-2">[{children}]</span>
}
