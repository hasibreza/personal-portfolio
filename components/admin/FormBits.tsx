'use client'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'
import type { ActionResult } from '@/lib/admin'

/** Status + publish date. The local date/time is converted to an ISO timestamp for the server. */
export function PublishFields({
  initialStatus,
  initialPublishedAt,
}: {
  initialStatus: 'draft' | 'scheduled' | 'published'
  initialPublishedAt: string | null
}) {
  const [status, setStatus] = useState(initialStatus)
  const toLocal = (iso: string | null) => {
    if (!iso) return ''
    const d = new Date(iso)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }
  const [local, setLocal] = useState(toLocal(initialPublishedAt))
  const iso = local ? new Date(local).toISOString() : ''
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-[1_1_200px] flex-col gap-1.5">
        <label htmlFor="f-status" className="text-[15px] font-medium">
          Status
        </label>
        <select
          id="f-status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-control border-field bg-bg text-ink h-12 w-full border px-3.5"
        >
          <option value="draft">Draft (hidden)</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex flex-[1_1_240px] flex-col gap-1.5">
        <label htmlFor="f-published" className="text-[15px] font-medium">
          Publish date {status === 'scheduled' ? '(required)' : '(optional)'}
        </label>
        <input
          id="f-published"
          type="datetime-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          required={status === 'scheduled'}
          className="rounded-control border-field bg-bg text-ink h-12 w-full border px-3.5"
        />
        <input type="hidden" name="published_at" value={iso} />
      </div>
    </div>
  )
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  )
}

/** Sticky save bar with the result of the last save. */
export function SaveBar({
  result,
  label = 'Save',
}: {
  result: ActionResult | null
  label?: string
}) {
  return (
    <div className="border-line bg-bg sticky bottom-0 z-10 flex flex-wrap items-center gap-4 border-t py-4">
      <SubmitButton label={label} />
      <p
        role="status"
        aria-live="polite"
        className={`m-0 text-[15px] ${result && !result.ok ? 'text-warn font-medium' : 'text-ink-2'}`}
      >
        {result?.message ?? ''}
      </p>
    </div>
  )
}

/** Button for destructive or state-changing actions, with an in-page confirmation step. */
export function ActionButton({
  run,
  label,
  confirm,
  variant = 'secondary',
}: {
  run: () => Promise<ActionResult | void>
  label: string
  confirm?: string
  variant?: 'primary' | 'secondary'
}) {
  const [asking, setAsking] = useState(false)
  const [msg, setMsg] = useState('')
  const [pending, start] = useTransition()
  const go = () =>
    start(async () => {
      const r = await run()
      setAsking(false)
      if (r && !r.ok) setMsg(r.message)
      else if (r?.message) setMsg(r.message)
    })
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {asking ? (
        <>
          <span className="text-sm">{confirm}</span>
          <Button size="md" variant="primary" onClick={go} disabled={pending}>
            {pending ? 'Working…' : 'Yes'}
          </Button>
          <Button size="md" variant="secondary" onClick={() => setAsking(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <Button
          size="md"
          variant={variant}
          disabled={pending}
          onClick={() => (confirm ? setAsking(true) : go())}
        >
          {pending ? 'Working…' : label}
        </Button>
      )}
      {msg ? (
        <span role="status" className="text-ink-2 text-sm">
          {msg}
        </span>
      ) : null}
    </span>
  )
}
