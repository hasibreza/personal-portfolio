import { connection } from 'next/server'
import { getLiveCvPath } from '@/lib/content'
import { serviceClient } from '@/lib/supabase/service'
import { absoluteUrl } from '@/lib/site'

/**
 * /cv — every "Download CV" button points here.
 * Redirects to a 5-minute signed URL for the live, privacy-safe CV in the private `cv`
 * bucket. If no CV is live yet (or Supabase is unavailable), visitors go to Contact so
 * the link never breaks.
 */
export async function GET() {
  await connection() // a fresh signed URL per request; never cached
  const path = await getLiveCvPath().catch(() => null)
  const supabase = serviceClient()
  if (path && supabase) {
    const { data } = await supabase.storage
      .from('cv')
      .createSignedUrl(path, 300, { download: 'Md-Hasib-Reza-CV.pdf' })
    if (data?.signedUrl) {
      return new Response(null, {
        status: 307,
        headers: { Location: data.signedUrl, 'Cache-Control': 'no-store' },
      })
    }
  }
  return Response.redirect(absoluteUrl('/contact'), 307)
}
