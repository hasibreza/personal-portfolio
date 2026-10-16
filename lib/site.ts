/**
 * Site-wide settings. In Phase 4 the editable values (social links, default SEO)
 * move to the Supabase `site_settings` table and are managed from /admin.
 */
export const site = {
  /** Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://hasib-portfolio.vercel.app). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  name: 'Md. Hasib Reza',
  shortName: 'Hasib Reza',
  locale: 'en_GB',
  email: 'hasibreza@gmail.com',
  /** To supply: Hasib's public LinkedIn URL. Shown as a placeholder until set. */
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '',
  defaultTitle: 'Md. Hasib Reza – Virtualization & Private Cloud Specialist',
  defaultDescription:
    'CIO & AMD at Sonali Life Insurance PLC. 16+ years in VMware private cloud, data centre, networking and cybersecurity.',
} as const

export const mainNav = [
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/work', label: 'Work' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
] as const

export const adminNav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/cv', label: 'CV' },
  { href: '/admin/work', label: 'Work samples' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/inbox', label: 'Inbox' },
] as const

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
