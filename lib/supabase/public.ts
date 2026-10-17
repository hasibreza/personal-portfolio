import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { supabasePublishableKey, supabaseUrl } from './env'

/**
 * Cookie-free client with the public (anon) role. Safe inside `'use cache'` functions:
 * it reads only what Row Level Security allows the public to see.
 */
export function publicClient() {
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
