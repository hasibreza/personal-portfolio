import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { supabaseUrl } from './env'

/**
 * Service-role client. Bypasses Row Level Security, so it is used for exactly two jobs:
 * inserting contact messages (after Turnstile + rate limit) and signing CV download URLs.
 * The key lives only in Vercel's server environment and is never sent to the browser.
 */
export function serviceClient() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !key) return null
  return createClient<Database>(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
