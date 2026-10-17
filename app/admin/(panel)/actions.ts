'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { workAreas } from '@/content/taxonomy'
import { friendlyDbError, requireAdmin, type ActionResult } from '@/lib/admin'
import { tags } from '@/lib/content'
import { readingMinutes, sanitizeRichText, slugify } from '@/lib/sanitize'
import type { Json } from '@/lib/supabase/database.types'
import { serverClient } from '@/lib/supabase/server'

/* ---------------- Helpers ---------------- */

const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()
const opt = (fd: FormData, k: string) => str(fd, k) || null
const list = (fd: FormData, k: string) =>
  str(fd, k)
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12)

const objectPath = z
  .string()
  .regex(/^[a-z0-9/_.-]{1,200}$/i, 'Invalid file reference.')
  .nullable()

const status = z.enum(['draft', 'scheduled', 'published'])

const seo = {
  seo_title: z.string().max(70, 'SEO title: 70 characters max.').nullable(),
  seo_description: z.string().max(170, 'SEO description: 170 characters max.').nullable(),
}

const publishedAt = z
  .string()
  .datetime({ offset: true, message: 'Invalid publish date.' })
  .nullable()

function firstIssue(e: z.ZodError) {
  return e.issues[0]?.message ?? 'Please check the form.'
}

function withAlt(path: string | null, alt: string | null, label: string) {
  if (path && !alt) return `${label} needs alt text describing the image.`
  return null
}

/* ---------------- Session ---------------- */

export async function signOut() {
  const supabase = await serverClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

/* ---------------- CV ---------------- */

export async function addCv(input: {
  path: string
  label: string
  size: number
}): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const parsed = z
    .object({
      path: z.string().regex(/^[a-z0-9-]+\.pdf$/),
      label: z.string().trim().min(1).max(120),
      size: z
        .number()
        .int()
        .positive()
        .max(10 * 1024 * 1024),
    })
    .safeParse(input)
  if (!parsed.success) return { ok: false, message: 'That upload could not be recorded.' }
  const { error } = await supabase.from('cv_files').insert({
    file_path: parsed.data.path,
    label: parsed.data.label,
    size_bytes: parsed.data.size,
  })
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  return { ok: true, message: 'Uploaded. Make it live when you are ready.' }
}

export async function makeCvLive(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.rpc('set_live_cv', { p_id: id })
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  updateTag(tags.cv)
  return { ok: true, message: 'This version is now served at /cv.' }
}

export async function deleteCv(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { data: row } = await supabase
    .from('cv_files')
    .select('file_path, is_active')
    .eq('id', id)
    .single()
  if (!row) return { ok: false, message: 'Version not found.' }
  if (row.is_active)
    return { ok: false, message: 'Make another version live before deleting this one.' }
  await supabase.storage.from('cv').remove([row.file_path])
  const { error } = await supabase.from('cv_files').delete().eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  return { ok: true, message: 'Version deleted.' }
}

/* ---------------- Projects ---------------- */

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(160),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens.')
    .max(100),
  summary: z.string().max(400, 'Summary: 400 characters max.'),
  area: z.enum(workAreas, { message: 'Choose an area.' }),
  role: z.string().max(120),
  timeline: z.string().max(120),
  scale: z.string().max(160),
  stack: z.string().max(200),
  status,
  published_at: publishedAt,
  featured: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
  cover_image: objectPath,
  cover_alt: z.string().max(200).nullable(),
  file_path: objectPath,
  ...seo,
})

export async function saveProject(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = str(fd, 'id')
  const parsed = projectSchema.safeParse({
    title: str(fd, 'title'),
    slug: str(fd, 'slug') || slugify(str(fd, 'title')),
    summary: str(fd, 'summary'),
    area: str(fd, 'area'),
    role: str(fd, 'role'),
    timeline: str(fd, 'timeline'),
    scale: str(fd, 'scale'),
    stack: str(fd, 'stack'),
    status: str(fd, 'status'),
    published_at: opt(fd, 'published_at'),
    featured: fd.get('featured') === 'on',
    sort_order: Number(str(fd, 'sort_order') || 0),
    cover_image: opt(fd, 'cover_image'),
    cover_alt: opt(fd, 'cover_alt'),
    file_path: opt(fd, 'file_path'),
    seo_title: opt(fd, 'seo_title'),
    seo_description: opt(fd, 'seo_description'),
  })
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  let gallery: { path: string; alt: string }[] = []
  try {
    gallery = z
      .array(
        z.object({
          path: z.string().regex(/^[a-z0-9/_.-]{1,200}$/i),
          alt: z.string().trim().max(200),
        }),
      )
      .max(12)
      .parse(JSON.parse(str(fd, 'gallery') || '[]'))
  } catch {
    return { ok: false, message: 'The gallery data is invalid. Reload the page and try again.' }
  }
  const altProblem =
    withAlt(parsed.data.cover_image, parsed.data.cover_alt, 'The cover image') ??
    (gallery.some((g) => !g.alt) ? 'Every gallery image needs alt text.' : null)
  if (altProblem) return { ok: false, message: altProblem }
  if (parsed.data.status === 'scheduled' && !parsed.data.published_at) {
    return { ok: false, message: 'Choose a publish date for a scheduled case study.' }
  }

  const row = {
    ...parsed.data,
    tags: list(fd, 'tags'),
    gallery: gallery as unknown as Json,
    problem_html: sanitizeRichText(str(fd, 'problem_html')),
    approach_html: sanitizeRichText(str(fd, 'approach_html')),
    outcome_html: sanitizeRichText(str(fd, 'outcome_html')),
  }
  const result = id
    ? await supabase.from('projects').update(row).eq('id', id).select('id').single()
    : await supabase.from('projects').insert(row).select('id').single()
  if (result.error) return { ok: false, message: friendlyDbError(result.error.message) }

  updateTag(tags.projects)
  if (!id) redirect(`/admin/work/${result.data.id}?saved=1`)
  return { ok: true, message: savedMessage(parsed.data.status) }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  updateTag(tags.projects)
  redirect('/admin/work')
}

/* ---------------- Posts ---------------- */

const postSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(160),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens.')
    .max(100),
  excerpt: z.string().max(400, 'Excerpt: 400 characters max.'),
  status,
  published_at: publishedAt,
  featured: z.boolean(),
  cover_image: objectPath,
  cover_alt: z.string().max(200).nullable(),
  ...seo,
})

export async function savePost(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const id = str(fd, 'id')
  const parsed = postSchema.safeParse({
    title: str(fd, 'title'),
    slug: str(fd, 'slug') || slugify(str(fd, 'title')),
    excerpt: str(fd, 'excerpt'),
    status: str(fd, 'status'),
    published_at: opt(fd, 'published_at'),
    featured: fd.get('featured') === 'on',
    cover_image: opt(fd, 'cover_image'),
    cover_alt: opt(fd, 'cover_alt'),
    seo_title: opt(fd, 'seo_title'),
    seo_description: opt(fd, 'seo_description'),
  })
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }
  const altProblem = withAlt(parsed.data.cover_image, parsed.data.cover_alt, 'The cover image')
  if (altProblem) return { ok: false, message: altProblem }
  if (parsed.data.status === 'scheduled' && !parsed.data.published_at) {
    return { ok: false, message: 'Choose a publish date for a scheduled post.' }
  }

  const body = sanitizeRichText(str(fd, 'body_html'))
  let bodyJson: Json | null = null
  try {
    bodyJson = JSON.parse(str(fd, 'body_json') || 'null') as Json
  } catch {
    bodyJson = null
  }
  const row = {
    ...parsed.data,
    tags: list(fd, 'tags'),
    body_html: body,
    body_json: bodyJson,
    reading_minutes: readingMinutes(body),
  }
  const result = id
    ? await supabase.from('posts').update(row).eq('id', id).select('id').single()
    : await supabase.from('posts').insert(row).select('id').single()
  if (result.error) return { ok: false, message: friendlyDbError(result.error.message) }

  updateTag(tags.posts)
  if (!id) redirect(`/admin/blog/${result.data.id}?saved=1`)
  return { ok: true, message: savedMessage(parsed.data.status) }
}

export async function deletePost(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  updateTag(tags.posts)
  redirect('/admin/blog')
}

function savedMessage(s: 'draft' | 'scheduled' | 'published') {
  if (s === 'published') return 'Saved and published. The public site is updated.'
  if (s === 'scheduled') return 'Saved. It goes live on the publish date (checked daily).'
  return 'Draft saved. Not visible on the public site.'
}

/* ---------------- Certifications ---------------- */

const certSchema = z.object({
  id: z.string().uuid(),
  year: z.string().trim().min(4).max(20),
  detail: z.string().max(160).nullable(),
  verify_url: z
    .string()
    .url('Verification link must be a full https:// URL.')
    .refine((u) => u.startsWith('https://'), 'Verification link must start with https://')
    .nullable(),
  badge_image: objectPath,
  badge_alt: z.string().max(200).nullable(),
})

export async function saveCertification(
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const parsed = certSchema.safeParse({
    id: str(fd, 'id'),
    year: str(fd, 'year'),
    detail: opt(fd, 'detail'),
    verify_url: opt(fd, 'verify_url'),
    badge_image: opt(fd, 'badge_image'),
    badge_alt: opt(fd, 'badge_alt'),
  })
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }
  const altProblem = withAlt(parsed.data.badge_image, parsed.data.badge_alt, 'The badge image')
  if (altProblem) return { ok: false, message: altProblem }
  const { id, ...row } = parsed.data
  const { error } = await supabase.from('certifications').update(row).eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  updateTag(tags.certifications)
  return { ok: true, message: 'Saved. The certifications page is updated.' }
}

/* ---------------- Inbox ---------------- */

export async function setMessageStatus(
  id: string,
  next: 'new' | 'read' | 'archived',
): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('contact_messages').update({ status: next }).eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  return { ok: true }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) return { ok: false, message: friendlyDbError(error.message) }
  redirect('/admin/inbox')
}
