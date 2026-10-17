import { cacheLife, cacheTag } from 'next/cache'
import { getPosts, tags } from '@/lib/content'
import { absoluteUrl, site } from '@/lib/site'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function feed() {
  'use cache'
  cacheLife('max')
  cacheTag(tags.posts)
  const posts = await getPosts()
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${absoluteUrl(`/insights/${p.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/insights/${p.slug}`)}</guid>
      <pubDate>${new Date(p.dateIso).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Insights – ${esc(site.name)}</title>
    <link>${absoluteUrl('/insights')}</link>
    <description>Articles on virtualization, data centre resilience, cybersecurity and applied AI.</description>
    <language>en-gb</language>
    <atom:link href="${absoluteUrl('/insights/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

/** /insights/rss.xml — published, due articles only (RLS enforces it). */
export async function GET() {
  return new Response(await feed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
