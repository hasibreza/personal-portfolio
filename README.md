# Md. Hasib Reza — Personal Portfolio

Personal portfolio site for Md. Hasib Reza, Virtualization & Private Cloud Infrastructure Specialist.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · pnpm · Vercel ·
Supabase (Phase 4).

## Status

| Phase | Scope                                                             | State         |
| ----- | ----------------------------------------------------------------- | ------------- |
| 0     | Content & Project Brief                                           | Approved      |
| 1     | Design prototype (Prototype A)                                    | Approved      |
| 2     | Project scaffold: tokens, components, all routes, SEO foundation  | Done (live)   |
| 3     | Icons, security headers, CI, analytics, polish, live verification | **In review** |
| 4     | Supabase: admin auth (MFA), CV, work samples, blog, contact inbox | Later         |
| 5     | Custom domain, Search Console, analytics, security review         | Later         |

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

## Deploying

The repo is connected to the Vercel project **personal-portfolio** (team _hasib_).

- **Push to `main`** → production deploy (https://personal-portfolio-two-iota-94.vercel.app).
- **Push any other branch / open a PR** → private preview deploy (Vercel sign-in required).
- Environment variables live in Vercel → Project → Settings → Environment Variables
  (`NEXT_PUBLIC_SITE_URL` is set for Production).

Workflow: branch → PR → CI green → review the preview → merge to `main`.

## Quality gates (CI)

`.github/workflows/ci.yml` runs on every PR and on `main`: `format:check` → `lint` → `typecheck`
→ `build` (Node 24, pnpm). Dependabot (`.github/dependabot.yml`) opens grouped weekly update PRs for
npm packages and GitHub Actions. Recommended: enable branch protection on `main` (require a PR and
the **CI** check).

## Security headers

Set for every route in `next.config.ts`:

| Header                     | Value (summary)                                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-Security-Policy    | `default-src 'self'`; scripts/styles self + inline; `object-src 'none'`; `frame-ancestors 'none'`; `form-action 'self'`; `base-uri 'self'`; upgrade insecure requests |
| Strict-Transport-Security  | 2 years, includeSubDomains, preload                                                                                                                                   |
| X-Frame-Options            | DENY                                                                                                                                                                  |
| X-Content-Type-Options     | nosniff                                                                                                                                                               |
| Referrer-Policy            | strict-origin-when-cross-origin                                                                                                                                       |
| Permissions-Policy         | camera, microphone, geolocation, payment, USB, topics all off                                                                                                         |
| Cross-Origin-Opener-Policy | same-origin                                                                                                                                                           |
| X-Robots-Tag (`/admin`)    | noindex, nofollow, noarchive                                                                                                                                          |

**Why `'unsafe-inline'` for scripts:** Next.js can only attach per-request nonces to its inline
scripts when every page is rendered dynamically, which disables static prerendering and CDN
caching. The site loads no third-party scripts and accepts no user content on public pages, so the
static-site CSP from the Next.js guide is used; everything except inline scripts is locked to this
origin. Preview deployments additionally allow `vercel.live` for the Vercel Toolbar.

## Analytics

Vercel Web Analytics and Speed Insights (`@vercel/analytics`, `@vercel/speed-insights`) are
cookie-free and served first-party from `/_vercel/*`. Enable both in Vercel → Project → **Analytics**
and **Speed Insights**; until enabled, their scripts return 404 (harmless).

## Updating content

| What                                | Where                                                          |
| ----------------------------------- | -------------------------------------------------------------- |
| LinkedIn URL                        | Vercel env var `NEXT_PUBLIC_LINKEDIN_URL`                      |
| CV PDF link (until Phase 4)         | Vercel env var `CV_URL`                                        |
| Certification verification links    | `content/certifications.ts` → `verifyUrl`                      |
| Headshot                            | replace `public/images/headshot.png` (portrait, ≥ 800 px wide) |
| Profile copy, expertise, experience | `content/*.ts`                                                 |
