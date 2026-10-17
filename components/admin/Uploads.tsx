'use client'

import { useState } from 'react'
import { TextField } from '@/components/ui/Field'
import { browserClient } from '@/lib/supabase/browser'
import { mediaUrl } from '@/lib/supabase/env'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'application/pdf': 'pdf',
  'application/zip': 'zip',
}

/**
 * Uploads straight from the browser to Supabase Storage with the admin's session.
 * Storage RLS allows uploads only for the allow-listed admin in an MFA session;
 * bucket limits enforce file type and size again on the server.
 */
export async function uploadTo(
  bucket: 'media' | 'files' | 'cv',
  folder: string,
  file: File,
  maxBytes: number,
  allowed: string[],
): Promise<{ path: string } | { error: string }> {
  if (!allowed.includes(file.type)) return { error: 'That file type is not allowed.' }
  if (file.size > maxBytes)
    return { error: `File is too large (max ${Math.round(maxBytes / 1048576)} MB).` }
  const name = `${crypto.randomUUID()}.${EXT[file.type]}`
  const path = folder ? `${folder}/${name}` : name
  const { error } = await browserClient().storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
    cacheControl: '31536000',
  })
  if (error) return { error: 'Upload failed. Check your connection and try again.' }
  return { path }
}

/** Single image (cover or badge) with required alt text. */
export function ImageField({
  id,
  label,
  folder,
  pathName,
  altName,
  initialPath,
  initialAlt,
}: {
  id: string
  label: string
  folder: string
  pathName: string
  altName: string
  initialPath?: string | null
  initialAlt?: string | null
}) {
  const [path, setPath] = useState(initialPath ?? '')
  const [alt, setAlt] = useState(initialAlt ?? '')
  const [status, setStatus] = useState('')
  const url = mediaUrl(path)

  return (
    <fieldset className="border-line m-0 flex flex-col gap-3 rounded-[14px] border p-4">
      <legend className="px-1 text-[15px] font-medium">{label}</legend>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of a just-uploaded image
        <img
          src={url}
          alt=""
          className="border-line max-h-48 w-auto self-start rounded-lg border object-contain"
        />
      ) : (
        <p className="text-ink-2 m-0 text-sm">No image yet.</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={`${id}-file`} className="text-sm font-medium">
          {url ? 'Replace image' : 'Upload image'} (JPG, PNG, WebP or AVIF, max 5 MB)
        </label>
        <input
          id={`${id}-file`}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          className="text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setStatus('Uploading…')
            const r = await uploadTo('media', folder, file, 5 * 1048576, IMAGE_TYPES)
            if ('error' in r) setStatus(r.error)
            else {
              setPath(r.path)
              setStatus('Uploaded. Remember to save.')
            }
            e.target.value = ''
          }}
        />
        {path ? (
          <button
            type="button"
            className="text-ink-2 min-h-11 cursor-pointer border-0 bg-transparent text-sm underline"
            onClick={() => {
              setPath('')
              setAlt('')
            }}
          >
            Remove image
          </button>
        ) : null}
      </div>
      {path ? (
        <TextField
          id={`${id}-alt`}
          name={altName}
          label="Alt text (required)"
          hint="Describe what the image shows for people using screen readers."
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          required
          maxLength={200}
        />
      ) : null}
      <input type="hidden" name={pathName} value={path} />
      <p role="status" className="text-ink-2 m-0 text-sm">
        {status}
      </p>
    </fieldset>
  )
}

/** Up to 12 gallery images, each with required alt text. */
export function GalleryField({
  initial,
  folder,
}: {
  initial: { path: string; alt: string }[]
  folder: string
}) {
  const [items, setItems] = useState(initial)
  const [status, setStatus] = useState('')
  return (
    <fieldset className="border-line m-0 flex flex-col gap-3 rounded-[14px] border p-4">
      <legend className="px-1 text-[15px] font-medium">Gallery ({items.length}/12)</legend>
      {items.map((g, i) => (
        <div key={g.path} className="flex flex-wrap items-end gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
          <img
            src={mediaUrl(g.path) ?? ''}
            alt=""
            className="border-line h-20 w-32 rounded-lg border object-cover"
          />
          <TextField
            id={`gallery-alt-${i}`}
            label={`Alt text for image ${i + 1}`}
            value={g.alt}
            required
            maxLength={200}
            className="flex-[1_1_240px]"
            onChange={(e) =>
              setItems((all) => all.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
            }
          />
          <button
            type="button"
            className="text-ink-2 min-h-11 cursor-pointer border-0 bg-transparent text-sm underline"
            onClick={() => setItems((all) => all.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      {items.length < 12 ? (
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="gallery-file" className="text-sm font-medium">
            Add image
          </label>
          <input
            id="gallery-file"
            type="file"
            accept={IMAGE_TYPES.join(',')}
            className="text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setStatus('Uploading…')
              const r = await uploadTo('media', folder, file, 5 * 1048576, IMAGE_TYPES)
              if ('error' in r) setStatus(r.error)
              else {
                setItems((all) => [...all, { path: r.path, alt: '' }])
                setStatus('Uploaded. Add alt text, then save.')
              }
              e.target.value = ''
            }}
          />
        </div>
      ) : null}
      <input type="hidden" name="gallery" value={JSON.stringify(items)} />
      <p role="status" className="text-ink-2 m-0 text-sm">
        {status}
      </p>
    </fieldset>
  )
}

/** Optional downloadable file (PDF or ZIP) for a case study, served via signed URL. */
export function DownloadField({ initialPath }: { initialPath?: string | null }) {
  const [path, setPath] = useState(initialPath ?? '')
  const [status, setStatus] = useState('')
  return (
    <fieldset className="border-line m-0 flex flex-col gap-3 rounded-[14px] border p-4">
      <legend className="px-1 text-[15px] font-medium">Optional download</legend>
      <p className="text-ink-2 m-0 text-sm">{path ? `Attached: ${path}` : 'No file attached.'}</p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="download-file" className="text-sm font-medium">
          Upload PDF or ZIP (max 20 MB)
        </label>
        <input
          id="download-file"
          type="file"
          accept="application/pdf,application/zip"
          className="text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setStatus('Uploading…')
            const r = await uploadTo('files', 'projects', file, 20 * 1048576, [
              'application/pdf',
              'application/zip',
            ])
            if ('error' in r) setStatus(r.error)
            else {
              setPath(r.path)
              setStatus('Uploaded. Remember to save.')
            }
            e.target.value = ''
          }}
        />
        {path ? (
          <button
            type="button"
            className="text-ink-2 min-h-11 cursor-pointer border-0 bg-transparent text-sm underline"
            onClick={() => setPath('')}
          >
            Remove file
          </button>
        ) : null}
      </div>
      <input type="hidden" name="file_path" value={path} />
      <p role="status" className="text-ink-2 m-0 text-sm">
        {status}
      </p>
    </fieldset>
  )
}
