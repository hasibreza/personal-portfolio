import { connection } from 'next/server'
import { publicClient } from '@/lib/supabase/public'
import { hasSupabase } from '@/lib/supabase/env'
import { serviceClient } from '@/lib/supabase/service'

/**
 * Optional download attached to a case study. The project lookup uses the public role, so
 * only published, due projects resolve; the file itself is served by a 5-minute signed URL.
 */
export async function GET(_req: Request, ctx: RouteContext<'/work/[slug]/download'>) {
  await connection()
  const { slug } = await ctx.params
  const supabase = serviceClient()
  if (!hasSupabase || !supabase) return new Response('Not found', { status: 404 })

  const { data: project } = await publicClient()
    .from('projects')
    .select('file_path')
    .eq('slug', slug)
    .maybeSingle()
  if (!project?.file_path) return new Response('Not found', { status: 404 })

  const { data } = await supabase.storage.from('files').createSignedUrl(project.file_path, 300, {
    download: true,
  })
  if (!data?.signedUrl) return new Response('Not found', { status: 404 })
  return new Response(null, {
    status: 307,
    headers: { Location: data.signedUrl, 'Cache-Control': 'no-store' },
  })
}
