import Link from 'next/link'
import { AdminPageHeader, DataTable, StatCard } from '@/components/admin/AdminUi'
import { StatusPill } from '@/components/ui/Basics'
import { buttonClasses } from '@/components/ui/Button'

const checklist = [
  'Add LinkedIn profile URL',
  'Add verification links for 8 certifications',
  'Upload a high-resolution headshot',
  'Publish 2–3 case studies',
  'Upload the privacy-safe CV (no address or phone)',
]

type Row = {
  title: string
  type: string
  status: 'Draft' | 'Published' | 'Scheduled'
  href: string
}
const rows: Row[] = [
  { title: '[Post title]', type: 'Post', status: 'Draft', href: '/admin/blog' },
  { title: '[Case study title]', type: 'Case study', status: 'Published', href: '/admin/work' },
  { title: '[Post title]', type: 'Post', status: 'Scheduled', href: '/admin/blog' },
]
const toneFor = { Draft: 'draft', Published: 'published', Scheduled: 'scheduled' } as const

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Welcome back, Hasib"
        lead="Here's what's on your site."
        actions={
          <>
            <Link href="/admin/blog" className={buttonClasses('primary', 'md')}>
              + New post
            </Link>
            <Link href="/admin/work" className={buttonClasses('secondary', 'md')}>
              + New case study
            </Link>
            <Link href="/admin/cv" className={buttonClasses('secondary', 'md')}>
              Replace CV
            </Link>
          </>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard
          label="Published posts"
          value="[n]"
          sub="[n] drafts · [n] scheduled"
          href="/admin/blog"
        />
        <StatCard label="Case studies" value="[n]" sub="[n] featured on Home" href="/admin/work" />
        <StatCard
          label="New messages"
          value="[n]"
          sub="Alerts to hasibreza@gmail.com"
          href="/admin/inbox"
          highlight
        />
        <StatCard
          label="Live CV"
          value={<span className="text-xl">[CV label]</span>}
          sub="Uploaded [date]"
          href="/admin/cv"
        />
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <section
          aria-labelledby="todo-h"
          className="rounded-card border-line bg-surface flex-[1_1_340px] border p-6"
        >
          <h2 id="todo-h" className="font-display m-0 mb-1 text-xl font-semibold">
            Launch checklist
          </h2>
          <p className="text-ink-2 m-0 mb-4 text-sm">Items still needed before go-live.</p>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {checklist.map((c, i) => (
              <li key={c}>
                <label
                  htmlFor={`todo-${i}`}
                  className="flex min-h-11 cursor-pointer items-center gap-3"
                >
                  <input id={`todo-${i}`} type="checkbox" className="accent-accent size-[18px]" />
                  {c}
                </label>
              </li>
            ))}
          </ul>
        </section>
        <section
          aria-labelledby="recent-h"
          className="rounded-card border-line bg-surface min-w-0 flex-[1.5_1_420px] border p-6"
        >
          <h2 id="recent-h" className="font-display m-0 mb-4 text-xl font-semibold">
            Recent content
          </h2>
          <DataTable<Row>
            caption="Recently updated content"
            rows={rows}
            rowKey={(r, i) => `${r.title}-${i}`}
            columns={[
              {
                key: 'title',
                header: 'Title',
                cell: (r) => (
                  <Link href={r.href} className="text-ink font-medium no-underline">
                    {r.title}
                  </Link>
                ),
              },
              { key: 'type', header: 'Type', cell: (r) => r.type },
              {
                key: 'status',
                header: 'Status',
                cell: (r) => <StatusPill tone={toneFor[r.status]}>{r.status}</StatusPill>,
              },
              { key: 'updated', header: 'Updated', cell: () => '[date]', className: 'text-ink-2' },
            ]}
          />
        </section>
      </div>
    </>
  )
}
