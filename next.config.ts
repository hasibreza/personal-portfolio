import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'
/** Vercel preview deployments load the Vercel Toolbar (comments/feedback) from vercel.live. */
const isPreview = process.env.VERCEL_ENV === 'preview'
const toolbar = isPreview ? ' https://vercel.live' : ''

/**
 * Content-Security-Policy — static-site variant (Next.js "Without Nonces" guide).
 * Nonces would force every page to render dynamically and disable static prerendering,
 * so inline scripts (theme script + React Server Components payload) are allowed while
 * everything else is locked to this origin. No third-party scripts are used.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${toolbar}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' blob: data:${toolbar} ${isPreview ? 'https://vercel.com' : ''}`.trim(),
  "font-src 'self'" + (isPreview ? ' https://vercel.live https://assets.vercel.com' : ''),
  `connect-src 'self'${isPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''}`,
  `frame-src ${isPreview ? 'https://vercel.live' : "'none'"}`,
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
