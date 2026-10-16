import { absoluteUrl } from '@/lib/site'

/**
 * /cv — every "Download CV" button points here.
 * Phase 2: if CV_URL is set (a privacy-safe PDF), redirect to it; otherwise send the
 *          visitor to the Contact page so the link never breaks.
 * Phase 4: reads the live version from Supabase `cv_files` / Storage bucket `cv`.
 */
export function GET() {
  const target = process.env.CV_URL || absoluteUrl('/contact')
  return Response.redirect(target, 307)
}
