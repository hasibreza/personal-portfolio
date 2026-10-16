'use client'

import { useState } from 'react'
import { postTags, workAreas, type Post, type WorkSample } from '@/content/samples'
import { PostCard, WorkCard } from './Cards'

function FilterBar<T extends string>({
  label,
  options,
  active,
  onPick,
  format = (v) => v,
}: {
  label: string
  options: readonly T[]
  active: T | 'All'
  onPick: (v: T | 'All') => void
  format?: (v: string) => string
}) {
  const all: (T | 'All')[] = ['All', ...options]
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

export function FilterableWork({ items }: { items: WorkSample[] }) {
  const [active, setActive] = useState<(typeof workAreas)[number] | 'All'>('All')
  const shown = active === 'All' ? items : items.filter((i) => i.area === active)
  return (
    <>
      <FilterBar label="Filter by area" options={workAreas} active={active} onPick={setActive} />
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

export function FilterablePosts({ items }: { items: Post[] }) {
  const [active, setActive] = useState<(typeof postTags)[number] | 'All'>('All')
  const shown = active === 'All' ? items : items.filter((i) => i.tag === active)
  return (
    <>
      <FilterBar
        label="Filter by tag"
        options={postTags}
        active={active}
        onPick={setActive}
        format={(v) => `#${v}`}
      />
      <p className="sr-only" aria-live="polite">
        {shown.length} articles shown
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">
        {shown.map((p) => (
          <PostCard key={p.slug} item={p} />
        ))}
      </div>
    </>
  )
}
