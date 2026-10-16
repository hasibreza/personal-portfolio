import type { MetadataRoute } from 'next'
import { posts, workSamples } from '@/content/samples'
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

/** Sample (placeholder) case studies and posts are excluded until real content exists. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.7,
  }))
  const work = workSamples
    .filter((w) => !w.isSample)
    .map((w) => ({ url: absoluteUrl(`/work/${w.slug}`), priority: 0.6 }))
  const articles = posts
    .filter((p) => !p.isSample)
    .map((p) => ({ url: absoluteUrl(`/insights/${p.slug}`), priority: 0.6 }))
  return [...pages, ...work, ...articles]
}
