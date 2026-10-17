'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { supabasePublishableKey, supabaseUrl } from './env'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

/** Browser client for sign-in, MFA and direct-to-Storage uploads in the admin. */
export function browserClient() {
  client ??= createBrowserClient<Database>(supabaseUrl, supabasePublishableKey)
  return client
}
