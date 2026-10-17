import type { Role } from '@/content/experience'

export function TimelineItem({ role, last = false }: { role: Role; last?: boolean }) {
  return (
    <li className="reveal flex gap-4 sm:gap-6">
      <div className="flex w-5 shrink-0 flex-col items-center" aria-hidden="true">
        {role.current ? (
          <span className="bg-accent border-tint mt-[26px] size-[18px] rounded-full border-4" />
        ) : (
          <span
            className={`bg-bg mt-[30px] size-3.5 rounded-full border-2 ${last ? 'border-line' : 'border-accent'}`}
          />
        )}
        {!last ? <span className="bg-line w-0.5 flex-1" /> : null}
      </div>
      <article
        className={`rounded-card bg-surface mb-6 flex min-w-0 flex-1 flex-col gap-2.5 p-6 sm:p-7 ${
          role.current ? 'border-accent border-2' : 'border-line border'
        }`}
      >
        <span
          className={`font-mono text-[13px] uppercase ${role.current ? 'text-accent' : 'text-ink-2'}`}
        >
          {role.period}
        </span>
        <h2 className="font-display m-0 text-[22px] font-semibold sm:text-2xl">{role.title}</h2>
        <p className="m-0 font-medium">
          {role.organisation} · {role.location}
        </p>
        {role.summary ? <p className="text-ink-2 m-0">{role.summary}</p> : null}
        {role.points ? (
          <ul className="text-ink-2 m-0 mt-1 flex list-disc flex-col gap-1.5 pl-5">
            {role.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : null}
      </article>
    </li>
  )
}
