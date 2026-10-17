import { connection } from 'next/server'
import { publicClient } from '@/lib/supabase/public'
import { hasSupabase } from '@/lib/supabase/env'

/**
 * Weekly ping from GitHub Actions so the free Supabase project is never paused for
 * inactivity. Runs one tiny public query; returns no data.
 */
export async function GET() {
  await connection()
  if (!hasSupabase) return Response.json({ ok: false }, { status: 503 })
  const { error } = await publicClient()
    .from('certifications')
    .select('id', { head: true, count: 'exact' })
  return Response.json(
    { ok: !error },
    { status: error ? 503 : 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
