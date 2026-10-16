import Link from 'next/link'
import type { ReactNode } from 'react'

export function AdminPageHeader({
  title,
  lead,
  actions,
}: {
  title: string
  lead?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display m-0 text-[32px] font-semibold">{title}</h1>
        {lead ? <p className="text-ink-2 m-0 mt-1">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5">{actions}</div> : null}
    </div>
  )
}

/** Shown on every admin shell until Phase 4 wires up Supabase. */
export function PhaseNotice() {
  return (
    <p className="bg-warn-bg text-warn rounded-button m-0 px-4 py-3 text-[14.5px]" role="note">
      Interface shell only. Sign-in, saving and the database are connected in Phase 4.
    </p>
  )
}

export function StatCard({
  label,
  value,
  sub,
  href,
  highlight = false,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href}
      className={`text-ink hover:text-ink rounded-[14px] p-5 no-underline ${
        highlight ? 'border-accent bg-tint border-2' : 'border-line bg-surface border'
      }`}
    >
      <span className="text-ink-2 text-sm">{label}</span>
      <div className="font-display text-[32px] font-semibold">{value}</div>
      {sub ? <span className="text-ink-2 text-[13px]">{sub}</span> : null}
    </Link>
  )
}

export type Column<T> = {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T, i: number) => string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-ink-2 text-left">
            {columns.map((c) => (
              <th key={c.key} scope="col" className="border-line border-b px-2 py-2.5 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={rowKey(r, i)}>
              {columns.map((c) => (
                <td key={c.key} className={`border-line border-b px-2 py-3 ${c.className ?? ''}`}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const tools = [
  { label: 'Heading', text: 'H2' },
  { label: 'Subheading', text: 'H3' },
  { label: 'Bold', text: 'B' },
  { label: 'Italic', text: 'I' },
  { label: 'Link', text: '🔗︎' },
  { label: 'Bulleted list', text: '•' },
  { label: 'Quote', text: '“' },
  { label: 'Code block', text: '</>' },
  { label: 'Insert image', text: '▣' },
] as const

/** Formatting toolbar for the blog editor (behaviour wired up with the editor in Phase 4). */
export function EditorToolbar() {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="rounded-control border-line bg-surface sticky top-0 flex flex-wrap gap-1 border p-1.5"
    >
      {tools.map((t) => (
        <button
          key={t.label}
          type="button"
          aria-label={t.label}
          title={t.label}
          className="text-ink hover:bg-tint h-10 min-w-10 cursor-pointer rounded-lg border-0 bg-transparent px-2 font-mono text-[13px] font-semibold"
        >
          {t.text}
        </button>
      ))}
    </div>
  )
}
