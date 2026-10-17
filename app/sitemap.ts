import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'

const staticRoutes = [
  '/',
  '/about',
  '/experience',
  '/certifications',
  '/work',
  '/insights',
  '/contact',
]

/** Only published, due case studies and articles are listed (RLS enforces it). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])
  const pages = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.7,
  }))
  const work = projects.map((w) => ({ url: absoluteUrl(`/work/${w.slug}`), priority: 0.6 }))
  const articles = posts.map((p) => ({
    url: absoluteUrl(`/insights/${p.slug}`),
    lastModified: p.dateIso,
    priority: 0.6,
  }))
  return [...pages, ...work, ...articles]
}
