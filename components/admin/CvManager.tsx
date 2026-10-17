'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { addCv, deleteCv, makeCvLive } from '@/app/admin/(panel)/actions'
import { StatusPill } from '@/components/ui/Basics'
import { TextField } from '@/components/ui/Field'
import type { Row } from '@/lib/supabase/database.types'
import { ActionButton } from './FormBits'
import { uploadTo } from './Uploads'

const fmt = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Dhaka',
})

export function CvManager({ versions }: { versions: Row<'cv_files'>[] }) {
  const router = useRouter()
  const [label, setLabel] = useState('')
  const [status, setStatus] = useState('')

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="up-h"
        className="rounded-card border-line bg-surface flex flex-col gap-4 border p-6"
      >
        <h2 id="up-h" className="font-display m-0 text-xl font-semibold">
          Upload a new version
        </h2>
        <p className="text-ink-2 m-0 text-[15px]">
          PDF only, max 10 MB. Use the privacy-safe version with no address or phone number.
        </p>
        <TextField
          id="cv-label"
          label="Label"
          hint="For example: CV – October 2026"
          value={label}
          maxLength={120}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="cv-file" className="text-sm font-medium">
            Choose PDF
          </label>
          <input
            id="cv-file"
            type="file"
            accept="application/pdf"
            className="text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              if (!label.trim()) {
                setStatus('Add a label first, then choose the file.')
                return
              }
              setStatus('Uploading…')
              const up = await uploadTo('cv', '', file, 10 * 1048576, ['application/pdf'])
              if ('error' in up) return setStatus(up.error)
              const saved = await addCv({ path: up.path, label: label.trim(), size: file.size })
              setStatus(saved.message ?? '')
              if (saved.ok) {
                setLabel('')
                router.refresh()
              }
            }}
          />
        </div>
        <p role="status" className="text-ink-2 m-0 text-sm">
          {status}
        </p>
      </section>

      <section aria-labelledby="ver-h" className="flex flex-col gap-3">
        <h2 id="ver-h" className="font-display m-0 text-xl font-semibold">
          Versions
        </h2>
        {versions.length === 0 ? (
          <p className="text-ink-2 m-0">
            No versions yet. Until one is live, /cv sends visitors to the Contact page.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {versions.map((v) => (
              <li
                key={v.id}
                className="rounded-card border-line bg-surface flex flex-wrap items-center gap-4 border p-4"
              >
                <div className="flex min-w-0 flex-[1_1_260px] flex-col">
                  <span className="font-semibold">{v.label}</span>
                  <span className="text-ink-2 text-sm">
                    Uploaded {fmt.format(new Date(v.uploaded_at))}
                    {v.size_bytes ? ` · ${(v.size_bytes / 1048576).toFixed(1)} MB` : ''}
                  </span>
                </div>
                {v.is_active ? (
                  <StatusPill tone="live">Live at /cv</StatusPill>
                ) : (
                  <span className="flex flex-wrap gap-2">
                    <ActionButton
                      label="Make live"
                      variant="primary"
                      run={async () => {
                        const r = await makeCvLive(v.id)
                        router.refresh()
                        return r
                      }}
                    />
                    <ActionButton
                      label="Delete"
                      confirm="Delete this version?"
                      run={async () => {
                        const r = await deleteCv(v.id)
                        router.refresh()
                        return r
                      }}
                    />
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
