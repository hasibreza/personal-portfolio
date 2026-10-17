/** Public Supabase settings. Both values are safe to expose to the browser. */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
export const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

/**
 * False in CI and in a fresh clone without .env.local. Public pages then render their
 * empty states instead of failing the build.
 */
export const hasSupabase = Boolean(supabaseUrl && supabasePublishableKey)

/** Public URL for an object in the public `media` bucket. */
export function mediaUrl(path: string | null | undefined) {
  if (!path || !supabaseUrl) return null
  return `${supabaseUrl}/storage/v1/object/public/media/${path.split('/').map(encodeURIComponent).join('/')}`
}
