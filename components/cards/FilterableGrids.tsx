'use client'

import { useMemo, useState } from 'react'
import { workAreas } from '@/content/taxonomy'
import type { PostItem, WorkItem } from '@/lib/content'
import { PostCard, WorkCard } from './Cards'

function FilterBar({
  label,
  options,
  active,
  onPick,
  format = (v) => v,
}: {
  label: string
  options: readonly string[]
  active: string
  onPick: (v: string) => void
  format?: (v: string) => string
}) {
  const all = ['All', ...options]
  return (
    <div role="group" aria-label={label} className="mb-9 flex flex-wrap gap-2.5">
      {all.map((o) => {
        const on = o === active
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(o)}
            className={`min-h-11 cursor-pointer rounded-full border px-[18px] text-[15px] font-medium ${
              on ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-ink'
            }`}
          >
            {o === 'All' ? 'All' : format(o)}
          </button>
        )
      })}
    </div>
  )
}

export function FilterableWork({ items }: { items: WorkItem[] }) {
  const [active, setActive] = useState('All')
  const areas = workAreas.filter((a) => items.some((i) => i.area === a))
  const shown = active === 'All' ? items : items.filter((i) => i.area === active)
  return (
    <>
      {areas.length > 1 ? (
        <FilterBar label="Filter by area" options={areas} active={active} onPick={setActive} />
      ) : null}
      <p className="sr-only" aria-live="polite">
        {shown.length} case studies shown
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
        {shown.map((w) => (
          <WorkCard key={w.slug} item={w} headingLevel="h2" />
        ))}
      </div>
    </>
  )
}

export function FilterablePosts({ items }: { items: PostItem[] }) {
  const [active, setActive] = useState('All')
  const tagList = useMemo(() => [...new Set(items.flatMap((i) => i.tags))].sort(), [items])
  const shown = active === 'All' ? items : items.filter((i) => i.tags.includes(active))
  return (
    <>
      {tagList.length > 1 ? (
        <FilterBar
          label="Filter by tag"
          options={tagList}
          active={active}
          onPick={setActive}
          format={(v) => `#${v}`}
        />
      ) : null}
      <p className="sr-only" aria-live="polite">
        {shown.length} articles shown
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
        {shown.map((p) => (
          <PostCard key={p.slug} item={p} headingLevel="h2" />
        ))}
      </div>
    </>
  )
}
