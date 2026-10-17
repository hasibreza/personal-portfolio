import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'
/** Vercel preview deployments load the Vercel Toolbar (comments/feedback) from vercel.live. */
const isPreview = process.env.VERCEL_ENV === 'preview'
const toolbar = isPreview ? ' https://vercel.live' : ''
/** Supabase project origin (Auth + Storage), e.g. https://xyz.supabase.co */
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : ''
const sb = supabase ? ` ${supabase}` : ''
/** Cloudflare Turnstile (contact form spam check). */
const turnstile = ' https://challenges.cloudflare.com'

/**
 * Content-Security-Policy — static-site variant (Next.js "Without Nonces" guide).
 * Nonces would force every page to render dynamically and disable static prerendering,
 * so inline scripts (theme script + React Server Components payload) are allowed while
 * everything else is locked to this origin. The only third-party origins are Supabase
 * (admin sign-in, uploads, admin image previews) and Cloudflare Turnstile (contact form).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${toolbar}${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${sb}${toolbar} ${isPreview ? 'https://vercel.com' : ''}`.trim(),
  "font-src 'self'" + (isPreview ? ' https://vercel.live https://assets.vercel.com' : ''),
  `connect-src 'self'${sb}${isPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
  `frame-src${turnstile}${isPreview ? ' https://vercel.live' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // Public `media` bucket only (covers, gallery, badges).
    remotePatterns: supabase
      ? [
          {
            protocol: 'https',
            hostname: new URL(supabase).hostname,
            pathname: '/storage/v1/object/public/media/**',
          },
        ]
      : [],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/admin',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ]
  },
}

export default nextConfig
