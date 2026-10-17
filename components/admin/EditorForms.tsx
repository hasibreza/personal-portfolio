'use client'

import { useActionState, useState } from 'react'
import { saveCertification, savePost, saveProject } from '@/app/admin/(panel)/actions'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { workAreas } from '@/content/taxonomy'
import type { ActionResult } from '@/lib/admin'
import { slugify } from '@/lib/sanitize'
import type { Row } from '@/lib/supabase/database.types'
import { PublishFields, SaveBar } from './FormBits'
import { RichTextEditor } from './RichTextEditor'
import { DownloadField, GalleryField, ImageField } from './Uploads'

function TitleAndSlug({
  title: t0,
  slug: s0,
  base,
}: {
  title: string
  slug: string
  base: string
}) {
  const [title, setTitle] = useState(t0)
  const [slug, setSlug] = useState(s0)
  const [touched, setTouched] = useState(Boolean(s0))
  return (
    <div className="flex flex-col gap-4">
      <TextField
        id="f-title"
        name="title"
        label="Title"
        value={title}
        maxLength={160}
        required
        onChange={(e) => {
          setTitle(e.target.value)
          if (!touched) setSlug(slugify(e.target.value))
        }}
      />
      <TextField
        id="f-slug"
        name="slug"
        label="URL slug"
        hint={`Public address: ${base}/${slug || '…'}`}
        value={slug}
        maxLength={100}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        required
        onChange={(e) => {
          setTouched(true)
          setSlug(e.target.value)
        }}
      />
    </div>
  )
}

function SeoFields({ title, description }: { title: string | null; description: string | null }) {
  return (
    <fieldset className="border-line m-0 flex flex-col gap-4 rounded-[14px] border p-4">
      <legend className="px-1 text-[15px] font-medium">Search & sharing (optional)</legend>
      <TextField
        id="f-seo-title"
        name="seo_title"
        label="SEO title"
        hint="About 60 characters. Leave empty to use the title."
        defaultValue={title ?? ''}
        maxLength={70}
      />
      <TextAreaField
        id="f-seo-desc"
        name="seo_description"
        label="SEO description"
        hint="About 155 characters. Leave empty to use the summary."
        defaultValue={description ?? ''}
        maxLength={170}
        rows={3}
      />
    </fieldset>
  )
}

/* ---------------- Case study ---------------- */

export function ProjectForm({ project }: { project: Row<'projects'> | null }) {
  const [result, action] = useActionState<ActionResult | null, FormData>(saveProject, null)
  const p = project
  const gallery = Array.isArray(p?.gallery) ? (p.gallery as { path: string; alt: string }[]) : []
  return (
    <form action={action} className="flex max-w-[860px] flex-col gap-6">
      <input type="hidden" name="id" value={p?.id ?? ''} />
      <TitleAndSlug title={p?.title ?? ''} slug={p?.slug ?? ''} base="/work" />
      <TextAreaField
        id="f-summary"
        name="summary"
        label="Summary"
        hint="One or two sentences shown on cards."
        defaultValue={p?.summary ?? ''}
        maxLength={400}
        rows={3}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="f-area"
          name="area"
          label="Area"
          options={workAreas}
          defaultValue={p?.area || workAreas[0]}
        />
        <TextField
          id="f-tags"
          name="tags"
          label="Tags"
          hint="Comma-separated, e.g. vsphere, ha"
          defaultValue={p?.tags.join(', ') ?? ''}
        />
        <TextField
          id="f-role"
          name="role"
          label="My role"
          defaultValue={p?.role ?? ''}
          maxLength={120}
        />
        <TextField
          id="f-timeline"
          name="timeline"
          label="Timeline"
          defaultValue={p?.timeline ?? ''}
          maxLength={120}
        />
        <TextField
          id="f-scale"
          name="scale"
          label="Scale"
          defaultValue={p?.scale ?? ''}
          maxLength={160}
        />
        <TextField
          id="f-stack"
          name="stack"
          label="Stack"
          defaultValue={p?.stack ?? ''}
          maxLength={200}
        />
      </div>
      <RichTextEditor
        id="f-problem"
        label="The problem"
        name="problem_html"
        initialHtml={p?.problem_html}
        minHeight={160}
      />
      <RichTextEditor
        id="f-approach"
        label="My approach"
        name="approach_html"
        initialHtml={p?.approach_html}
        minHeight={200}
      />
      <RichTextEditor
        id="f-outcome"
        label="The outcome"
        name="outcome_html"
        initialHtml={p?.outcome_html}
        minHeight={160}
      />
      <ImageField
        id="f-cover"
        label="Cover image"
        folder="projects"
        pathName="cover_image"
        altName="cover_alt"
        initialPath={p?.cover_image}
        initialAlt={p?.cover_alt}
      />
      <GalleryField initial={gallery} folder="projects" />
      <DownloadField initialPath={p?.file_path} />
      <PublishFields
        initialStatus={p?.status ?? 'draft'}
        initialPublishedAt={p?.published_at ?? null}
      />
      <div className="flex flex-wrap items-end gap-6">
        <label className="flex min-h-11 items-center gap-2.5 text-[15px] font-medium">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={p?.featured ?? false}
            className="size-5"
          />
          Feature on the home page
        </label>
        <TextField
          id="f-order"
          name="sort_order"
          label="Sort order"
          type="number"
          min={0}
          max={9999}
          defaultValue={String(p?.sort_order ?? 0)}
          className="w-40"
        />
      </div>
      <SeoFields title={p?.seo_title ?? null} description={p?.seo_description ?? null} />
      <SaveBar result={result} />
    </form>
  )
}

/* ---------------- Post ---------------- */

export function PostForm({ post }: { post: Row<'posts'> | null }) {
  const [result, action] = useActionState<ActionResult | null, FormData>(savePost, null)
  const p = post
  return (
    <form action={action} className="flex max-w-[860px] flex-col gap-6">
      <input type="hidden" name="id" value={p?.id ?? ''} />
      <TitleAndSlug title={p?.title ?? ''} slug={p?.slug ?? ''} base="/insights" />
      <TextAreaField
        id="f-excerpt"
        name="excerpt"
        label="Excerpt"
        hint="Shown on cards and under the title."
        defaultValue={p?.excerpt ?? ''}
        maxLength={400}
        rows={3}
      />
      <TextField
        id="f-tags"
        name="tags"
        label="Tags"
        hint="Comma-separated, e.g. virtualization, agentic-ai"
        defaultValue={p?.tags.join(', ') ?? ''}
      />
      <RichTextEditor
        id="f-body"
        label="Article"
        name="body_html"
        jsonName="body_json"
        initialHtml={p?.body_html}
        minHeight={420}
      />
      <ImageField
        id="f-cover"
        label="Cover image (also the share image)"
        folder="posts"
        pathName="cover_image"
        altName="cover_alt"
        initialPath={p?.cover_image}
        initialAlt={p?.cover_alt}
      />
      <PublishFields
        initialStatus={p?.status ?? 'draft'}
        initialPublishedAt={p?.published_at ?? null}
      />
      <label className="flex min-h-11 items-center gap-2.5 text-[15px] font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={p?.featured ?? false}
          className="size-5"
        />
        Feature at the top of Insights
      </label>
      <SeoFields title={p?.seo_title ?? null} description={p?.seo_description ?? null} />
      <SaveBar result={result} />
    </form>
  )
}

/* ---------------- Certification ---------------- */

export function CertificationForm({ cert }: { cert: Row<'certifications'> }) {
  const [result, action] = useActionState<ActionResult | null, FormData>(saveCertification, null)
  return (
    <form
      action={action}
      className="rounded-card border-line bg-surface flex flex-col gap-4 border p-5"
    >
      <input type="hidden" name="id" value={cert.id} />
      <div>
        <h2 className="font-display m-0 text-xl font-semibold">{cert.name}</h2>
        <p className="text-ink-2 m-0 font-mono text-[13px]">
          {cert.code} · {cert.issuer}
        </p>
      </div>
      <TextField
        id={`c-url-${cert.id}`}
        name="verify_url"
        label="Verification link"
        hint="Credly or vendor URL, starting with https://"
        type="url"
        defaultValue={cert.verify_url ?? ''}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id={`c-year-${cert.id}`}
          name="year"
          label="Year"
          defaultValue={cert.year}
          maxLength={20}
          required
        />
        <TextField
          id={`c-detail-${cert.id}`}
          name="detail"
          label="Detail (optional)"
          defaultValue={cert.detail ?? ''}
          maxLength={160}
        />
      </div>
      <ImageField
        id={`c-badge-${cert.id}`}
        label="Official badge image"
        folder="badges"
        pathName="badge_image"
        altName="badge_alt"
        initialPath={cert.badge_image}
        initialAlt={cert.badge_alt}
      />
      <SaveBar result={result} />
    </form>
  )
}
