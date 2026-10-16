import { AdminPageHeader } from '@/components/admin/AdminUi'
import { StatusPill } from '@/components/ui/Basics'

const subjects = [
  'Speaking invitation',
  'Advisory or consulting',
  'Collaboration',
  'Something else',
]

export default function AdminInboxPage() {
  return (
    <>
      <AdminPageHeader
        title="Inbox"
        lead="Contact form messages · email alerts go to hasibreza@gmail.com"
      />
      <div className="rounded-card border-line bg-surface flex min-h-[560px] flex-wrap overflow-hidden border">
        <ul
          aria-label="Messages"
          className="border-line m-0 flex-[1_1_300px] list-none border-r p-0"
        >
          {subjects.map((s, i) => (
            <li
              key={s}
              className={`border-line flex flex-col gap-0.5 border-b px-5 py-4 ${
                i === 0 ? 'bg-tint shadow-[inset_3px_0_0_var(--accent)]' : ''
              }`}
            >
              <span className="flex justify-between gap-2">
                <span className="font-semibold">[Sender name]</span>
                <span className="text-ink-2 text-[12.5px]">[date]</span>
              </span>
              <span className="text-sm font-medium">{s}</span>
              <span className="text-ink-2 text-[13.5px]">[First line of the message…]</span>
            </li>
          ))}
        </ul>
        <article className="flex min-w-0 flex-[2_1_420px] flex-col gap-5 p-7">
          <div className="border-line flex flex-col gap-1 border-b pb-5">
            <StatusPill tone="draft">{subjects[0]}</StatusPill>
            <h2 className="font-display m-0 mt-2 text-2xl font-semibold">[Sender name]</h2>
            <span className="text-ink-2 text-sm">[sender@email] · [date and time]</span>
          </div>
          <p className="m-0 text-base leading-relaxed">
            [The full message from the contact form appears here, exactly as the sender wrote it.]
          </p>
          <p className="text-ink-2 m-0 text-[13px]">
            Reply, mark as read and archive arrive with Phase 4.
          </p>
        </article>
      </div>
    </>
  )
}
