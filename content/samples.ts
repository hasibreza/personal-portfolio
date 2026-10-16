/**
 * SAMPLE CONTENT — clearly labelled placeholders until Hasib supplies real case studies
 * and articles. In Phase 4 these arrays are replaced by Supabase queries
 * (tables `projects` and `posts`, brief §5). Sample pages are marked noindex and
 * excluded from the sitemap so placeholders never reach search engines.
 */

export const workAreas = [
  'Private Cloud',
  'Data Centre & DR',
  'Networking',
  'Security',
  'ERP & AI',
] as const
export type WorkArea = (typeof workAreas)[number]

export type WorkSample = {
  slug: string
  area: WorkArea
  tag: string
  title: string
  summary: string
  isSample: true
}

const sampleTitle = '[Case study title — to be supplied]'
const sampleSummary = '[One-line outcome — to be supplied]'

const workSeed: { slug: string; area: WorkArea; tag: string }[] = [
  { slug: 'sample-private-cloud', area: 'Private Cloud', tag: 'Private Cloud' },
  { slug: 'sample-data-centre-dr', area: 'Data Centre & DR', tag: 'Data Centre & DR' },
  { slug: 'sample-financial-erp', area: 'ERP & AI', tag: 'Financial ERP' },
  { slug: 'sample-networking', area: 'Networking', tag: 'Networking' },
  { slug: 'sample-cybersecurity', area: 'Security', tag: 'Cybersecurity' },
  { slug: 'sample-applied-ai', area: 'ERP & AI', tag: 'Applied AI' },
]

export const workSamples: WorkSample[] = workSeed.map((w) => ({
  ...w,
  title: sampleTitle,
  summary: sampleSummary,
  isSample: true as const,
}))

export const postTags = [
  'virtualization',
  'data-centre',
  'networking',
  'cybersecurity',
  'agentic-ai',
] as const
export type PostTag = (typeof postTags)[number]

export type Post = {
  slug: string
  tag: PostTag
  title: string
  excerpt: string
  date: string
  readingTime: string
  isSample: true
}

export const posts: Post[] = [
  { slug: 'sample-virtualization', tag: 'virtualization', topic: 'virtualization' },
  { slug: 'sample-cybersecurity', tag: 'cybersecurity', topic: 'cybersecurity' },
  { slug: 'sample-agentic-ai', tag: 'agentic-ai', topic: 'applied AI' },
  { slug: 'sample-data-centre', tag: 'data-centre', topic: 'data centre' },
  { slug: 'sample-networking', tag: 'networking', topic: 'networking' },
  { slug: 'sample-private-cloud', tag: 'virtualization', topic: 'private cloud' },
].map(({ slug, tag, topic }) => ({
  slug,
  tag: tag as PostTag,
  title: `[Article title — ${topic}]`,
  excerpt: '[Excerpt — written by Hasib]',
  date: '[Date]',
  readingTime: '[5 min read]',
  isSample: true as const,
}))

export function getWorkSample(slug: string) {
  return workSamples.find((w) => w.slug === slug)
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
