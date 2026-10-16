# Md. Hasib Reza — Personal Portfolio

Personal portfolio site for Md. Hasib Reza, Virtualization & Private Cloud Infrastructure Specialist.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · pnpm · Vercel ·
Supabase (Phase 4).

## Status

| Phase | Scope                                                             | State           |
| ----- | ----------------------------------------------------------------- | --------------- |
| 0     | Content & Project Brief                                           | Approved        |
| 1     | Design prototype (Prototype A)                                    | Approved        |
| 2     | Project scaffold: tokens, components, all routes, SEO foundation  | **This commit** |
| 3     | Build polish + Vercel deploy                                      | Next            |
| 4     | Supabase: admin auth (MFA), CV, work samples, blog, contact inbox | Later           |
| 5     | Custom domain, Search Console, analytics, security review         | Later           |

## Getting started

Requires **Node.js 22+** (24 LTS recommended) and **pnpm 10**.

```bash
pnpm install
cp .env.example .env.local   # optional for local dev
pnpm dev                     # http://localhost:3000
```

| Script                      | What it does                                        |
| --------------------------- | --------------------------------------------------- |
| `pnpm dev`                  | Development server                                  |
| `pnpm build` / `pnpm start` | Production build / serve                            |
| `pnpm lint`                 | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `pnpm typecheck`            | TypeScript, no emit                                 |
| `pnpm format`               | Prettier (with Tailwind class sorting)              |

## Folder map

```
app/
  layout.tsx            root: self-hosted fonts, no-flash theme script, default metadata
  globals.css           design tokens (light/dark CSS variables) mapped into Tailwind
  fonts/ + fonts.ts     Inter, Space Grotesk, JetBrains Mono (woff2, SIL OFL)
  (site)/               public pages with header + footer
    page.tsx            Home
    about/ experience/ certifications/ work/ work/[slug]/ insights/ insights/[slug]/ contact/
  admin/                private, noindex — route shells only until Phase 4
    login/              sign-in shell (no sidebar)
    (panel)/            dashboard, cv, work, blog, inbox (with sidebar)
  cv/route.ts           /cv → live CV (CV_URL for now; Supabase Storage in Phase 4)
  sitemap.ts robots.ts opengraph-image.tsx not-found.tsx
components/
  site/                 SiteHeader, NavLinks, MobileMenu, ThemeToggle, SiteFooter, Breadcrumb, ContactForm
  ui/                   Button, Basics (SectionLabel, Tag, PageIntro, StatusPill, TrainingPill), Field, icons
  cards/                ExpertiseCard, WorkCard, PostCard, CertBadgeCard, filterable grids
  timeline/             TimelineItem
  admin/                AdminSidebar, StatCard, DataTable, EditorToolbar
content/                approved copy as typed data (replaced by Supabase queries in Phase 4)
lib/                    site.ts (settings, nav), seo.ts (metadata + JSON-LD)
public/images/          headshot.png (temporary — replace with high-resolution photo)
```

## Design tokens

Palette B "Graphite & Signal Blue". Defined as CSS variables in `app/globals.css`; switch via
`data-theme="light|dark"` on `<html>`. Tailwind names in brackets.

| Token                                   | Light       | Dark         |
| --------------------------------------- | ----------- | ------------ |
| `--bg` (`bg-bg`)                        | #FAFAFA     | #111315      |
| `--surface` (`bg-surface`)              | #FFFFFF     | #1A1D21      |
| `--text` (`text-ink`)                   | #16181B     | #ECEEF0      |
| `--text2` (`text-ink-2`)                | #5B6168     | #A3A9B1      |
| `--accent` (`text-accent`, `bg-accent`) | #1F5EFF     | #5B8CFF      |
| `--on-accent` (`text-on-accent`)        | #FFFFFF     | #111315      |
| `--border` (`border-line`)              | #E4E6E9     | #2A2E34      |
| `--tint` (`bg-tint`)                    | accent @ 8% | accent @ 13% |

Fonts: `font-display` Space Grotesk · `font-sans` Inter · `font-mono` JetBrains Mono.
Radii: tag 6 · control 10 · button 12 · card 16 · panel 20 px. Minimum touch target 44 px.

## Content rules

- Copy comes only from the CV and Hasib's confirmed answers (Project Brief).
- No home address or personal phone number anywhere.
- Certifications vs training are kept separate (`content/certifications.ts`).
- Anything in `[brackets]` is a placeholder. Sample case studies and posts are `noindex` and
  excluded from `sitemap.xml`.

## SEO

Per-page title, description and canonical (`lib/seo.ts`), Open Graph/Twitter cards, default OG image,
JSON-LD (Person, WebSite, ProfilePage, BreadcrumbList, BlogPosting, CreativeWork), `sitemap.xml`,
`robots.txt` (blocks `/admin`). Lighthouse on Home (desktop, local): 100 / 100 / 100 / 100.

## Deploying (Phase 3)

Import the GitHub repo in Vercel, framework preset **Next.js**, set `NEXT_PUBLIC_SITE_URL`.
