import type { Metadata } from 'next'
import { createElement } from 'react'
import { profile } from '@/content/profile'
import { certifications } from '@/content/certifications'
import { absoluteUrl, site } from './site'

const defaultOgAlt = 'Md. Hasib Reza — Virtualization & Private Cloud Infrastructure Specialist'

type PageSeo = {
  title: string
  description: string
  path: string
  /** Keep out of search results (admin, sample content). */
  noindex?: boolean
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  image?: string
}

/** Per-page metadata: exact title (no template), canonical, Open Graph and Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
  type = 'website',
  publishedTime,
  image,
}: PageSeo): Metadata {
  const url = absoluteUrl(path)
  const ogImage = image
    ? { url: image }
    : { url: absoluteUrl('/opengraph-image'), width: 1200, height: 630, alt: defaultOgAlt }
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(publishedTime ? { publishedTime } : {}),
      // A page-level openGraph object replaces the root one, so the share image must be set here.
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
  }
}

/* ---------- JSON-LD ---------- */

type Json = Record<string, unknown>

/** Renders a JSON-LD <script>. `<` is escaped so content can never close the tag. */
export function JsonLd({ data }: { data: Json }) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, '\\u003c') },
  })
}

export function personJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: profile.name,
    alternateName: profile.shortName,
    url: site.url,
    image: absoluteUrl('/images/headshot.png'),
    jobTitle: profile.jobTitle,
    description: site.defaultDescription,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
    worksFor: { '@type': 'Organization', name: 'Sonali Life Insurance PLC' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Greenwich' },
      { '@type': 'CollegeOrUniversity', name: 'London Metropolitan University' },
    ],
    knowsAbout: profile.knowsAbout,
    hasCredential: certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
    })),
    ...(site.linkedin ? { sameAs: [site.linkedin] } : {}),
  }
}

export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: site.url,
    name: site.name,
    inLanguage: 'en',
    publisher: { '@id': absoluteUrl('/#person') },
  }
}

export function profilePageJsonLd(path: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absoluteUrl(path),
    mainEntity: { '@id': absoluteUrl('/#person') },
  }
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  }
}

export function blogPostingJsonLd(p: {
  title: string
  description: string
  path: string
  datePublished?: string
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    url: absoluteUrl(p.path),
    mainEntityOfPage: absoluteUrl(p.path),
    author: { '@id': absoluteUrl('/#person'), name: profile.name },
    ...(p.datePublished ? { datePublished: p.datePublished, dateModified: p.datePublished } : {}),
    image: absoluteUrl('/opengraph-image'),
  }
}

export function creativeWorkJsonLd(p: { title: string; description: string; path: string }): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.description,
    url: absoluteUrl(p.path),
    creator: { '@id': absoluteUrl('/#person'), name: profile.name },
  }
}
