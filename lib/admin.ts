import 'server-only'
import { redirect } from 'next/navigation'
import { serverClient } from './supabase/server'

/**
 * For admin Server Components and Server Actions. Re-checks the session server-side
 * (the proxy is the first gate, this is the second, RLS is the third).
 */
export async function requireAdmin() {
  const supabase = await serverClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims as { aal?: string; email?: string; sub?: string } | undefined
  if (!claims || claims.aal !== 'aal2') redirect('/admin/login')
  return { supabase, email: claims.email ?? '', userId: claims.sub ?? '' }
}

export type ActionResult = { ok: true; message?: string } | { ok: false; message: string }

export function friendlyDbError(message: string): string {
  if (message.includes('duplicate key') && message.includes('slug')) {
    return 'That URL slug is already used. Choose a different one.'
  }
  if (message.includes('_needs_alt')) return 'Every image needs alt text.'
  if (message.includes('scheduled_needs_date')) return 'Scheduled items need a publish date.'
  if (message.includes('violates check constraint'))
    return 'One of the fields is too long or invalid.'
  if (message.includes('row-level security') || message.includes('not_authorized')) {
    return 'Your session is not allowed to make this change. Sign in again with your authenticator code.'
  }
  return 'Saving failed. Please try again.'
}
