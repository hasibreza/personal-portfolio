import Link from 'next/link'
import { DataTable } from '@/components/admin/AdminUi'
import { StatusPill } from '@/components/ui/Basics'

type Item = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'scheduled' | 'published'
  published_at: string | null
  updated_at: string
}

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Dhaka' })

/** Table of posts or case studies with status and links to edit and view. */
export function ContentList({
  items,
  base,
  publicBase,
}: {
  items: Item[]
  base: string
  publicBase: string
}) {
  if (items.length === 0) return <p className="text-ink-2 m-0">Nothing here yet.</p>
  return (
    <DataTable
      caption="Content"
      rows={items}
      rowKey={(r) => r.id}
      columns={[
        {
          key: 'title',
          header: 'Title',
          cell: (r) => (
            <Link href={`${base}/${r.id}`} className="text-ink font-medium">
              {r.title}
            </Link>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          cell: (r) => (
            <StatusPill tone={r.status}>{r.status[0].toUpperCase() + r.status.slice(1)}</StatusPill>
          ),
        },
        {
          key: 'date',
          header: 'Publish date',
          cell: (r) => (r.published_at ? fmt.format(new Date(r.published_at)) : '—'),
        },
        { key: 'updated', header: 'Updated', cell: (r) => fmt.format(new Date(r.updated_at)) },
        {
          key: 'view',
          header: 'Public page',
          cell: (r) =>
            r.status === 'draft' ? (
              <span className="text-ink-2">Hidden</span>
            ) : (
              <a href={`${publicBase}/${r.slug}`} target="_blank" rel="noopener">
                View ↗
              </a>
            ),
        },
      ]}
    />
  )
}
