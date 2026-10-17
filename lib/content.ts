import { cacheLife, cacheTag } from 'next/cache'
import { certifications as fallbackCertifications } from '@/content/certifications'
import type { Row } from './supabase/database.types'
import { hasSupabase, mediaUrl } from './supabase/env'
import { publicClient } from './supabase/public'

/**
 * Public content, read with the anon role and cached until the admin publishes a change
 * (`updateTag`) or the daily cron refreshes scheduled items (`revalidateTag`).
 * RLS guarantees only published-and-due rows ever reach this layer.
 */
export const tags = {
  projects: 'projects',
  posts: 'posts',
  certifications: 'certifications',
  cv: 'cv',
} as const

export type WorkItem = {
  slug: string
  area: string
  tag: string
  title: string
  summary: string
  coverUrl: string | null
  coverAlt: string
  featured: boolean
}

export type ProjectDetail = WorkItem & {
  role: string
  timeline: string
  scale: string
  stack: string
  problemHtml: string
  approachHtml: string
  outcomeHtml: string
  tags: string[]
  gallery: { url: string; alt: string }[]
  hasDownload: boolean
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
}

export type PostItem = {
  slug: string
  tag: string
  tags: string[]
  title: string
  excerpt: string
  date: string
  dateIso: string
  readingTime: string
  coverUrl: string | null
  coverAlt: string
  featured: boolean
}

export type PostDetail = PostItem & {
  bodyHtml: string
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
}

export type CertificationItem = {
  code: string
  name: string
  issuer: string
  year: string
  detail?: string
  verifyUrl?: string
  badgeUrl: string | null
  badgeAlt: string
  featured: boolean
}

const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Dhaka',
})

function toWorkItem(p: Row<'projects'>): WorkItem {
  return {
    slug: p.slug,
    area: p.area,
    tag: p.area || p.tags[0] || 'Case study',
    title: p.title,
    summary: p.summary,
    coverUrl: mediaUrl(p.cover_image),
    coverAlt: p.cover_alt ?? '',
    featured: p.featured,
  }
}

function toPostItem(p: Row<'posts'>): PostItem {
  const iso = p.published_at ?? p.created_at
  return {
    slug: p.slug,
    tag: p.tags[0] ?? 'insights',
    tags: p.tags,
    title: p.title,
    excerpt: p.excerpt,
    date: dateFmt.format(new Date(iso)),
    dateIso: iso,
    readingTime: `${p.reading_minutes} min read`,
    coverUrl: mediaUrl(p.cover_image),
    coverAlt: p.cover_alt ?? '',
    featured: p.featured,
  }
}

function fail(what: string, error: { message: string }): never {
  // Throwing keeps the last good cached version in place instead of caching an empty page.
  throw new Error(`Supabase read failed (${what}): ${error.message}`)
}

/* ---------------- Projects ---------------- */

export async function getProjects(): Promise<WorkItem[]> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.projects)
  if (!hasSupabase) return []
  const { data, error } = await publicClient()
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
  if (error) fail('projects', error)
  return data.map(toWorkItem)
}

export async function getFeaturedProjects(limit = 3): Promise<WorkItem[]> {
  const all = await getProjects()
  const featured = all.filter((p) => p.featured)
  return (featured.length ? featured : all).slice(0, limit)
}

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.projects)
  if (!hasSupabase) return null
  const { data: p, error } = await publicClient()
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) fail('project', error)
  if (!p) return null
  const gallery = Array.isArray(p.gallery)
    ? (p.gallery as { path?: string; alt?: string }[])
        .map((g) => ({ url: mediaUrl(g.path) ?? '', alt: g.alt ?? '' }))
        .filter((g) => g.url && g.alt)
    : []
  return {
    ...toWorkItem(p),
    role: p.role,
    timeline: p.timeline,
    scale: p.scale,
    stack: p.stack,
    problemHtml: p.problem_html,
    approachHtml: p.approach_html,
    outcomeHtml: p.outcome_html,
    tags: p.tags,
    gallery,
    hasDownload: Boolean(p.file_path),
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    publishedAt: p.published_at,
  }
}

/* ---------------- Posts ---------------- */

export async function getPosts(): Promise<PostItem[]> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.posts)
  if (!hasSupabase) return []
  const { data, error } = await publicClient()
    .from('posts')
    .select(
      'slug, title, excerpt, tags, featured, status, published_at, created_at, reading_minutes, cover_image, cover_alt',
    )
    .order('published_at', { ascending: false })
  if (error) fail('posts', error)
  return (data as Row<'posts'>[]).map(toPostItem)
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.posts)
  if (!hasSupabase) return null
  const { data: p, error } = await publicClient()
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) fail('post', error)
  if (!p) return null
  return {
    ...toPostItem(p),
    bodyHtml: p.body_html,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    updatedAt: p.updated_at,
  }
}

/* ---------------- Certifications ---------------- */

export async function getCertifications(): Promise<CertificationItem[]> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.certifications)
  if (!hasSupabase) {
    return fallbackCertifications.map((c) => ({
      ...c,
      featured: Boolean(c.featured),
      badgeUrl: null,
      badgeAlt: '',
    }))
  }
  const { data, error } = await publicClient()
    .from('certifications')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) fail('certifications', error)
  return data.map((c) => ({
    code: c.code,
    name: c.name,
    issuer: c.issuer,
    year: c.year,
    detail: c.detail ?? undefined,
    verifyUrl: c.verify_url ?? undefined,
    badgeUrl: mediaUrl(c.badge_image),
    badgeAlt: c.badge_alt ?? '',
    featured: c.featured,
  }))
}

/* ---------------- CV ---------------- */

/** Object path of the live CV in the private `cv` bucket, or null when none is live. */
export async function getLiveCvPath(): Promise<string | null> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.cv)
  if (!hasSupabase) return null
  const { data, error } = await publicClient()
    .from('cv_files')
    .select('file_path')
    .eq('is_active', true)
    .maybeSingle()
  if (error) fail('cv', error)
  return data?.file_path ?? null
}
