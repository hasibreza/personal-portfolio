import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Guards /admin and keeps the Supabase session fresh.
 *  - No session              → /admin/login
 *  - Password only (aal1)    → /admin/login (finish the authenticator step)
 *  - Full MFA session (aal2) → allowed; /admin/login bounces to the dashboard
 * Database access is still enforced separately by Row Level Security.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const isLogin = request.nextUrl.pathname === '/admin/login'
  if (!url || !key) {
    return isLogin
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/admin/login', request.url))
  }

  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // Verifies the JWT (and refreshes it when needed) before trusting any claim.
  const { data } = await supabase.auth.getClaims()
  const aal = (data?.claims as { aal?: string } | undefined)?.aal
  const fullyAuthed = aal === 'aal2'

  if (!isLogin && !fullyAuthed) {
    const to = new URL('/admin/login', request.url)
    const redirect = NextResponse.redirect(to)
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }
  if (isLogin && fullyAuthed) {
    const redirect = NextResponse.redirect(new URL('/admin', request.url))
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
