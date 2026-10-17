# Md. Hasib Reza — Personal Portfolio

Personal portfolio site for Md. Hasib Reza, Virtualization & Private Cloud Infrastructure Specialist.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · pnpm · Vercel ·
Supabase (Postgres, Auth with MFA, Storage) · Cloudflare Turnstile · Resend.

## Status

| Phase | Scope                                                             | State         |
| ----- | ----------------------------------------------------------------- | ------------- |
| 0     | Content & Project Brief                                           | Approved      |
| 1     | Design prototype (Prototype A)                                    | Approved      |
| 2     | Project scaffold: tokens, components, all routes, SEO foundation  | Done (live)   |
| 3     | Icons, security headers, CI, analytics, polish, live verification | Done (live)   |
| 4     | Supabase backend, working admin (MFA), CV, work, blog, contact    | **In review** |
| 5     | Custom domain, Search Console, security review                    | Later         |

## Getting started

Requires **Node.js 22+** (24 LTS recommended) and **pnpm 10**.

```bash
pnpm install
cp .env.example .env.local   # fill in the public Supabase values (see "Environment variables")
pnpm dev                     # http://localhost:3000
```

Without Supabase values the site still builds: Work and Insights show their empty states and the
admin stays locked.

| Script                      | What it does                                                    |
| --------------------------- | --------------------------------------------------------------- |
| `pnpm dev`                  | Development server                                              |
| `pnpm build` / `pnpm start` | Production build / serve                                        |
| `pnpm lint`                 | ESLint (Next.js core-web-vitals + TypeScript rules)             |
| `pnpm typecheck`            | Route types + TypeScript, no emit                               |
| `pnpm test`                 | Vitest: HTML sanitiser (XSS cases) and contact-form abuse cases |
| `pnpm format`               | Prettier (with Tailwind class sorting)                          |

## Folder map

```
app/
  layout.tsx            root: self-hosted fonts, no-flash theme script, default metadata
  globals.css           design tokens (light/dark CSS variables) mapped into Tailwind
  (site)/               public pages with header + footer
    work/ insights/     read published rows from Supabase (cached, refreshed on publish)
    insights/rss.xml/   RSS feed (published articles only)
    contact/actions.ts  contact server action: Turnstile → rate limit → insert → email alert
  admin/
    login/              email + password, then authenticator (TOTP) code / first-time enrolment
    (panel)/            dashboard, cv, work, blog, certifications, inbox + actions.ts
  cv/route.ts           /cv → 5-minute signed URL for the live CV (otherwise /contact)
  api/cron/publish/     daily Vercel Cron: refreshes pages so scheduled items appear
  api/keepalive/        pinged twice a week by GitHub Actions so Supabase never pauses
proxy.ts                guards /admin (needs an MFA session) and refreshes the auth cookie
components/
  site/                 header, footer, ContactForm, Turnstile, RichText, …
  cards/                ExpertiseCard, WorkCard, PostCard, CertBadgeCard, filterable grids
  admin/                LoginFlow, RichTextEditor (Tiptap), Uploads, EditorForms, CvManager, …
content/                approved copy as typed data (profile, expertise, experience, training)
lib/
  content.ts            cached public reads ('use cache' + cache tags)
  sanitize.ts           rich-text allow-list (runs on save and on render)
  contact.ts            contact validation, IP hashing, Turnstile verification
  admin.ts              requireAdmin(): server-side MFA session check
  supabase/             typed clients: public (anon), server (user session), browser, service
supabase/
  migrations/           schema, RLS, storage buckets, seed (applied in order)
  tests/rls.sql         RLS test suite (anon / admin without MFA / other user / admin with MFA)
tests/                  Vitest unit tests
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
- Certifications vs training are kept separate.
- Work and Insights show only published (or scheduled-and-due) items. Drafts never reach the public
  site, the sitemap or the RSS feed.

## SEO

Per-page title, description and canonical (`lib/seo.ts`), Open Graph/Twitter cards (case studies
and articles use their cover image), JSON-LD (Person, WebSite, ProfilePage, BreadcrumbList,
BlogPosting, CreativeWork), `sitemap.xml` and `/insights/rss.xml` (published items only),
`robots.txt` (blocks `/admin`). Per-item SEO title and description are editable in the admin.

## Supabase

Project **hasib-portfolio** (ref `goubfqfpmxpclwoohmri`, Singapore, Free tier).

| Table               | Public (anon) can…                                    | Admin (your user + MFA) can… |
| ------------------- | ----------------------------------------------------- | ---------------------------- |
| `projects`, `posts` | read rows that are published, or scheduled and due    | everything                   |
| `certifications`    | read                                                  | edit links, badges, years    |
| `cv_files`          | read the live version only                            | upload, make live, delete    |
| `contact_messages`  | **nothing** (the server inserts after the spam check) | read, archive, delete        |
| `site_settings`     | read                                                  | update                       |

- **Admin = allow-listed user ID AND an MFA (aal2) session.** A password-only session is treated
  like the public. The allow-list is `private.admin_users`, which the API cannot reach.
- Storage: `cv` and `files` are private (served through short-lived signed URLs); `media` is public
  for images of published content, with random file names. Only the admin can upload.
- The service key is used on the server only, for exactly two jobs: inserting contact messages and
  signing CV/download URLs.
- Schema changes go in a new file in `supabase/migrations/`, reviewed before it runs. After running
  one, regenerate `lib/supabase/database.types.ts` and re-run the security advisors (target: zero).

**RLS tests:** run `supabase/tests/rls.sql` in the Supabase SQL editor. It ends with the error
`RLS_TESTS_PASSED` (by design, which also rolls back its test rows); any failure reads
`RLS_TEST_FAILED: …`.

## Admin guide

Sign in at **/admin** with your email and password, then the 6-digit code from your authenticator
app. On the very first sign-in you scan a QR code to set the authenticator up.

| Task                 | How                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Publish a case study | Work samples → New → fill in, add a cover image **with alt text** → Status: Published → Save                |
| Schedule an article  | Blog → New → Status: Scheduled + publish date → Save. It appears on that date (checked daily at 00:05 UTC). |
| Replace the CV       | CV → add a label → choose the PDF → **Make live**. Every "Download CV" button follows.                      |
| Certification links  | Certifications → paste the Credly/vendor `https://` link → Save                                             |
| Read messages        | Inbox → open a message (marks it read) → Reply by email / Archive / Delete                                  |

Publishing refreshes the affected public pages straight away; drafts stay invisible. Too many wrong
sign-in attempts pause sign-in for a few minutes (Supabase rate limit).

### First-time admin setup (once)

1. Supabase → Authentication → Sign In / Providers: **turn off** "Allow new users to sign up";
   keep Email on. Multi-Factor: TOTP enabled.
2. Authentication → Users → Add user: your email and **your own password**; tick Auto Confirm.
3. Allow-list your account (SQL editor):
   `insert into private.admin_users (user_id) select id from auth.users where email = 'hasibreza@gmail.com';`
4. Sign in at /admin and enrol your authenticator app.

## Environment variables

See `.env.example`. Set them in Vercel → Project → Settings → Environment Variables; tick
**Sensitive** for secrets. `NEXT_PUBLIC_*` values are public by design.

| Variable                               | Secret? | Used for                                       |
| -------------------------------------- | ------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | no      | Supabase API                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | no      | public reads, admin sign-in (RLS applies)      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | no      | contact form widget                            |
| `NEXT_PUBLIC_LINKEDIN_URL`             | no      | LinkedIn link in footer, Contact and JSON-LD   |
| `SUPABASE_SECRET_KEY`                  | **yes** | contact inserts, signed CV/download URLs       |
| `TURNSTILE_SECRET_KEY`                 | **yes** | verifying the spam check                       |
| `RESEND_API_KEY`                       | **yes** | contact alerts to hasibreza@gmail.com          |
| `CONTACT_IP_SALT`                      | **yes** | hashing visitor IPs (raw IPs are never stored) |
| `CRON_SECRET`                          | **yes** | authenticates the daily publish cron           |

Preview deployments use Cloudflare's official always-pass Turnstile test keys, because preview URLs
change on every deploy.

## Backup & restore

- **Database:** the Free tier has no automatic backups. Before risky changes, and monthly, export
  with the Supabase CLI: `supabase db dump --db-url "$DB_URL" --data-only -f backup.sql` (the
  connection string is in Supabase → Connect). Keep the dump private: it contains messages. Restore
  with `psql "$DB_URL" -f backup.sql` on a project created from `supabase/migrations/`.
- **Files:** download the `cv`, `files` and `media` buckets from Supabase → Storage. Keep your master
  CV PDF locally too.
- **Code:** GitHub is the source of truth; every production deploy is reproducible from `main`.

## Key rotation

Rotate a key immediately if it may have leaked, and once a year otherwise.

| Key                              | Where to rotate                                                                 | Then                            |
| -------------------------------- | ------------------------------------------------------------------------------- | ------------------------------- |
| `SUPABASE_SECRET_KEY`            | Supabase → Project Settings → API Keys → create a new secret key, delete old    | update Vercel env var, redeploy |
| Publishable key                  | same page (rarely needed)                                                       | update Vercel env var, redeploy |
| `TURNSTILE_SECRET_KEY`           | Cloudflare → Turnstile → widget → Rotate secret                                 | update Vercel env var, redeploy |
| `RESEND_API_KEY`                 | Resend → API Keys → create new, delete old                                      | update Vercel env var, redeploy |
| `CONTACT_IP_SALT`, `CRON_SECRET` | generate a new long random string                                               | update Vercel env var, redeploy |
| Password / authenticator         | Supabase → Authentication → Users (reset; remove the factor if a phone is lost) | sign in and re-enrol            |

## Deploying

The repo is connected to the Vercel project **personal-portfolio** (team _hasib_).

- **Push to `main`** → production deploy (https://personal-portfolio-two-iota-94.vercel.app).
- **Push any other branch / open a PR** → private preview deploy (Vercel sign-in required).

Workflow: branch → PR → CI green → review the preview → merge to `main`.

## Quality gates (CI)

`.github/workflows/ci.yml` runs on every PR and on `main`: `format:check` → `lint` → `typecheck` →
`test` → `build` (Node 24, pnpm). `keepalive.yml` pings `/api/keepalive` twice a week. Dependabot
opens grouped weekly update PRs. Branch protection on `main`: require a PR and the **CI** check.

## Security headers

Set for every route in `next.config.ts`:

| Header                     | Value (summary)                                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Content-Security-Policy    | `default-src 'self'`; scripts self + inline + Turnstile; images/connect self + Supabase; frames Turnstile only; `object-src 'none'`; `frame-ancestors 'none'`; `form-action 'self'` |
| Strict-Transport-Security  | 2 years, includeSubDomains, preload                                                                                                                                                 |
| X-Frame-Options            | DENY                                                                                                                                                                                |
| X-Content-Type-Options     | nosniff                                                                                                                                                                             |
| Referrer-Policy            | strict-origin-when-cross-origin                                                                                                                                                     |
| Permissions-Policy         | camera, microphone, geolocation, payment, USB, topics all off                                                                                                                       |
| Cross-Origin-Opener-Policy | same-origin                                                                                                                                                                         |
| X-Robots-Tag (`/admin`)    | noindex, nofollow, noarchive (plus `Cache-Control: private, no-store` from the proxy)                                                                                               |

**Why `'unsafe-inline'` for scripts:** Next.js can only attach per-request nonces when every page is
rendered dynamically, which would disable static prerendering and CDN caching. The only third-party
script is Cloudflare Turnstile. Rich text written in the admin is sanitised with a strict allow-list
both when it is saved and when it is rendered, so no script, style, event handler or `javascript:`
link can reach a public page.

## Analytics

Vercel Web Analytics and Speed Insights are cookie-free and served first-party from `/_vercel/*`.
