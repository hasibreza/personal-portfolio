import Link from 'next/link'
import { deleteMessage, setMessageStatus } from '../actions'
import { AdminPageHeader } from '@/components/admin/AdminUi'
import { ActionButton } from '@/components/admin/FormBits'
import { StatusPill } from '@/components/ui/Basics'
import { requireAdmin } from '@/lib/admin'

const fmt = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Dhaka',
})
const views = ['new', 'read', 'archived'] as const

export default async function AdminInboxPage({ searchParams }: PageProps<'/admin/inbox'>) {
  const { supabase } = await requireAdmin()
  const sp = await searchParams
  const view = views.includes(sp.view as (typeof views)[number])
    ? (sp.view as (typeof views)[number])
    : 'new'
  const openId = typeof sp.id === 'string' ? sp.id : undefined

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('id, name, email, subject, status, created_at')
    .eq('status', view)
    .order('created_at', { ascending: false })
    .limit(100)

  let open = null
  if (openId) {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', openId)
      .maybeSingle()
    open = data
    // Opening a new message marks it as read.
    if (open?.status === 'new') await setMessageStatus(open.id, 'read')
  }

  return (
    <>
      <AdminPageHeader
        title="Inbox"
        lead="Messages from the contact form. Raw IP addresses are never stored."
      />
      <nav aria-label="Inbox folders" className="flex flex-wrap gap-2.5">
        {views.map((v) => (
          <Link
            key={v}
            href={`/admin/inbox?view=${v}`}
            aria-current={v === view ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-[18px] text-[15px] font-medium no-underline ${
              v === view ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-ink'
            }`}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </Link>
        ))}
      </nav>

      {open ? (
        <article
          aria-labelledby="msg-h"
          className="rounded-card border-line bg-surface flex flex-col gap-4 border p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="msg-h" className="font-display m-0 text-xl font-semibold">
                {open.subject}
              </h2>
              <p className="text-ink-2 m-0 text-sm">
                {open.name} · <a href={`mailto:${open.email}`}>{open.email}</a> ·{' '}
                {fmt.format(new Date(open.created_at))}
              </p>
            </div>
            <StatusPill tone={open.status === 'archived' ? 'muted' : 'scheduled'}>
              {open.status}
            </StatusPill>
          </div>
          <p className="m-0 whitespace-pre-wrap">{open.message}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              Reply by email
            </a>
            {open.status !== 'archived' ? (
              <ActionButton
                label="Archive"
                run={setMessageStatus.bind(null, open.id, 'archived')}
              />
            ) : (
              <ActionButton
                label="Move to read"
                run={setMessageStatus.bind(null, open.id, 'read')}
              />
            )}
            <ActionButton
              label="Delete"
              confirm="Delete this message permanently?"
              run={deleteMessage.bind(null, open.id)}
            />
          </div>
        </article>
      ) : null}

      {messages && messages.length > 0 ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {messages.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/inbox?view=${view}&id=${m.id}`}
                aria-current={m.id === openId ? 'true' : undefined}
                className="rounded-card border-line bg-surface text-ink hover:border-ink-2 flex flex-wrap items-center justify-between gap-2 border p-4 no-underline"
              >
                <span className="flex min-w-0 flex-col">
                  <span className={m.status === 'new' ? 'font-semibold' : ''}>{m.subject}</span>
                  <span className="text-ink-2 text-sm">{m.name}</span>
                </span>
                <span className="text-ink-2 text-sm">{fmt.format(new Date(m.created_at))}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-2 m-0">No {view} messages.</p>
      )}
    </>
  )
}
