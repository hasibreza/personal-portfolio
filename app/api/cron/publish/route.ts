import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { tags } from '@/lib/content'

/**
 * Daily Vercel Cron (vercel.json). Scheduled posts and case studies become visible through
 * RLS as soon as their date passes; this refreshes the cached pages so they appear.
 * Vercel sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const given = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  const ok =
    Boolean(secret) &&
    given.length === expected.length &&
    timingSafeEqual(Buffer.from(given), Buffer.from(expected))
  if (!ok) return new Response('Unauthorized', { status: 401 })

  revalidateTag(tags.posts, { expire: 0 })
  revalidateTag(tags.projects, { expire: 0 })
  return Response.json({ refreshed: [tags.posts, tags.projects], at: new Date().toISOString() })
}
