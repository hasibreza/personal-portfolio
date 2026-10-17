import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'
import { supabasePublishableKey, supabaseUrl } from './env'

/**
 * Per-request client carrying the signed-in user's session (admin area and server actions).
 * Every query runs as that user, so Row Level Security decides what it can see and change.
 */
export async function serverClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, where cookies are read-only. The proxy refreshes
          // the session on the next request, so this is safe to ignore.
        }
      },
    },
  })
}
