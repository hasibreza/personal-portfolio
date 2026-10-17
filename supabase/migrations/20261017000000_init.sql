-- =====================================================================
-- Md. Hasib Reza portfolio — initial schema (Phase 4)
-- Brief §5. Review before running. Idempotency is not attempted: this is
-- the first migration on a brand-new project.
--
-- Security model
--   * RLS is enabled on every table.
--   * "Admin" = Hasib's user ID (listed in private.admin_users) AND an MFA
--     session (JWT aal = 'aal2'). A password-only session gets nothing extra.
--   * Public (anon) can read only published-and-due content, certifications,
--     site settings and nothing else.
--   * contact_messages: NO public policies at all. The website's server action
--     inserts with the service-role key after Turnstile + rate limiting, so the
--     public anon key cannot be used to post messages directly.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Private schema (not exposed through the Data API)
-- ---------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

-- Admin allow-list. Hasib's auth user ID is inserted after he creates his
-- account in the dashboard (see README → "First-time admin setup").
create table private.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on private.admin_users from anon, authenticated;

-- True only for an allow-listed user in an MFA (aal2) session.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
    and exists (
      select 1 from private.admin_users a where a.user_id = (select auth.uid())
    );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Keeps updated_at current on every UPDATE.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Stamps published_at the first time a row is published.
create or replace function private.stamp_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type public.content_status as enum ('draft', 'scheduled', 'published');
create type public.message_status as enum ('new', 'read', 'archived');

-- Shared slug rule: lowercase words joined by single hyphens.
create domain public.slug as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) between 1 and 100);

-- ---------------------------------------------------------------------
-- cv_files — uploaded CV versions; exactly one can be live
-- ---------------------------------------------------------------------
create table public.cv_files (
  id          uuid primary key default gen_random_uuid(),
  file_path   text not null unique,                 -- object name in the `cv` bucket
  label       text not null check (char_length(label) between 1 and 120),
  size_bytes  integer check (size_bytes > 0),
  is_active   boolean not null default false,
  uploaded_at timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create unique index cv_files_one_live on public.cv_files (is_active) where is_active;

-- ---------------------------------------------------------------------
-- projects — case studies / work samples
-- ---------------------------------------------------------------------
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            public.slug not null unique,
  title           text not null check (char_length(title) between 1 and 160),
  summary         text not null default '' check (char_length(summary) <= 400),
  area            text not null default '',          -- e.g. 'Private Cloud' (filter chip)
  role            text not null default '',
  timeline        text not null default '',
  scale           text not null default '',
  stack           text not null default '',
  problem_html    text not null default '',          -- sanitised server-side before save
  approach_html   text not null default '',
  outcome_html    text not null default '',
  tags            text[] not null default '{}',
  cover_image     text,                              -- object name in the `media` bucket
  cover_alt       text,
  gallery         jsonb not null default '[]'::jsonb, -- [{ "path": "...", "alt": "..." }]
  file_path       text,                              -- optional download in the `files` bucket
  featured        boolean not null default false,
  sort_order      integer not null default 0,
  status          public.content_status not null default 'draft',
  published_at    timestamptz,
  seo_title       text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint projects_cover_needs_alt
    check (cover_image is null or char_length(coalesce(cover_alt, '')) > 0),
  constraint projects_gallery_is_array check (jsonb_typeof(gallery) = 'array'),
  constraint projects_scheduled_needs_date
    check (status <> 'scheduled' or published_at is not null)
);
create index projects_public_idx on public.projects (status, published_at, sort_order);

-- ---------------------------------------------------------------------
-- posts — Insights articles
-- ---------------------------------------------------------------------
create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            public.slug not null unique,
  title           text not null check (char_length(title) between 1 and 160),
  excerpt         text not null default '' check (char_length(excerpt) <= 400),
  body_html       text not null default '',          -- sanitised server-side before save
  body_json       jsonb,                             -- Tiptap document, for re-editing
  cover_image     text,
  cover_alt       text,
  tags            text[] not null default '{}',
  featured        boolean not null default false,
  status          public.content_status not null default 'draft',
  published_at    timestamptz,
  reading_minutes integer not null default 1 check (reading_minutes between 1 and 120),
  seo_title       text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  og_image        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint posts_cover_needs_alt
    check (cover_image is null or char_length(coalesce(cover_alt, '')) > 0),
  constraint posts_scheduled_needs_date
    check (status <> 'scheduled' or published_at is not null)
);
create index posts_public_idx on public.posts (status, published_at desc);

-- ---------------------------------------------------------------------
-- certifications
-- ---------------------------------------------------------------------
create table public.certifications (
  id          uuid primary key default gen_random_uuid(),
  code        text not null check (char_length(code) between 1 and 60),
  name        text not null check (char_length(name) between 1 and 160),
  issuer      text not null check (char_length(issuer) between 1 and 80),
  year        text not null check (char_length(year) between 4 and 20),
  detail      text,
  verify_url  text check (verify_url is null or verify_url ~ '^https://'),
  badge_image text,                                  -- object name in the `media` bucket
  badge_alt   text,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now(),
  constraint certifications_badge_needs_alt
    check (badge_image is null or char_length(coalesce(badge_alt, '')) > 0)
);

-- ---------------------------------------------------------------------
-- contact_messages — written only by the server (service role)
-- ---------------------------------------------------------------------
create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (
               char_length(email) between 3 and 254
               and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject    text not null check (char_length(subject) between 1 and 160),
  message    text not null check (char_length(message) between 1 and 5000),
  ip_hash    text not null check (char_length(ip_hash) = 64),  -- sha256(ip + secret salt), never the raw IP
  status     public.message_status not null default 'new',
  created_at timestamptz not null default now()
);
create index contact_messages_ip_recent on public.contact_messages (ip_hash, created_at desc);
create index contact_messages_status on public.contact_messages (status, created_at desc);

-- Database-level backstop for the app's rate limit: max 5 messages per sender per hour.
create or replace function private.contact_rate_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    select count(*) from public.contact_messages
    where ip_hash = new.ip_hash and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- site_settings — single row
-- ---------------------------------------------------------------------
create table public.site_settings (
  id                  smallint primary key default 1 check (id = 1),
  default_title       text not null check (char_length(default_title) <= 70),
  default_description text not null check (char_length(default_description) <= 170),
  email               text not null,
  linkedin_url        text check (linkedin_url is null or linkedin_url ~ '^https://(www\.)?linkedin\.com/'),
  og_image            text,
  profile             jsonb not null default '{}'::jsonb,  -- editable profile copy
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
create trigger cv_files_updated_at       before update on public.cv_files       for each row execute function private.set_updated_at();
create trigger projects_updated_at       before update on public.projects       for each row execute function private.set_updated_at();
create trigger posts_updated_at          before update on public.posts          for each row execute function private.set_updated_at();
create trigger certifications_updated_at before update on public.certifications for each row execute function private.set_updated_at();
create trigger site_settings_updated_at  before update on public.site_settings  for each row execute function private.set_updated_at();

create trigger projects_published_at before insert or update on public.projects for each row execute function private.stamp_published_at();
create trigger posts_published_at    before insert or update on public.posts    for each row execute function private.stamp_published_at();

create trigger contact_messages_rate_limit before insert on public.contact_messages for each row execute function private.contact_rate_limit();

-- ---------------------------------------------------------------------
-- "Make live" for CVs: one transaction, RLS still applies (security invoker)
-- ---------------------------------------------------------------------
create or replace function public.set_live_cv(p_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;
  update public.cv_files set is_active = false where is_active and id <> p_id;
  update public.cv_files set is_active = true where id = p_id;
end;
$$;
revoke all on function public.set_live_cv(uuid) from public, anon;
grant execute on function public.set_live_cv(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.cv_files         enable row level security;
alter table public.projects         enable row level security;
alter table public.posts            enable row level security;
alter table public.certifications   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings    enable row level security;

-- cv_files: public sees only the live CV; admin everything
create policy "cv_files: public reads live" on public.cv_files
  for select to anon, authenticated using (is_active);
create policy "cv_files: admin all" on public.cv_files
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- projects: public sees published (or scheduled and due); admin everything
create policy "projects: public reads published" on public.projects
  for select to anon, authenticated
  using (status in ('published', 'scheduled') and published_at <= now());
create policy "projects: admin all" on public.projects
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- posts: same rule as projects
create policy "posts: public reads published" on public.posts
  for select to anon, authenticated
  using (status in ('published', 'scheduled') and published_at <= now());
create policy "posts: admin all" on public.posts
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- certifications: public read; admin write
create policy "certifications: public read" on public.certifications
  for select to anon, authenticated using (true);
create policy "certifications: admin write" on public.certifications
  for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- contact_messages: admin only (read, mark, archive, delete). No public policy.
create policy "contact_messages: admin read" on public.contact_messages
  for select to authenticated using ((select private.is_admin()));
create policy "contact_messages: admin update" on public.contact_messages
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "contact_messages: admin delete" on public.contact_messages
  for delete to authenticated using ((select private.is_admin()));

-- site_settings: public read; admin update
create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "site_settings: admin update" on public.site_settings
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Defence in depth: the public role can never write, whatever the policies say.
revoke insert, update, delete, truncate on all tables in schema public from anon;
revoke truncate on all tables in schema public from authenticated;

-- ---------------------------------------------------------------------
-- Storage buckets
--   cv     private  — PDF only, 10 MB. /cv redirects to a short-lived signed URL
--                     for the live file, created server-side.
--   files  private  — work-sample downloads, 20 MB, signed URLs for published items.
--   media  public   — images for published content, 5 MB. Object names are random
--                     UUIDs, so draft images are not discoverable.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('cv',    'cv',    false, 10485760, array['application/pdf']),
  ('files', 'files', false, 20971520, array['application/pdf', 'application/zip']),
  ('media', 'media', true,   5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

-- Admin-only upload / replace / delete / list in all three buckets.
create policy "storage: admin read" on storage.objects
  for select to authenticated
  using (bucket_id in ('cv', 'files', 'media') and (select private.is_admin()));
create policy "storage: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('cv', 'files', 'media') and (select private.is_admin()));
create policy "storage: admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('cv', 'files', 'media') and (select private.is_admin()))
  with check (bucket_id in ('cv', 'files', 'media') and (select private.is_admin()));
create policy "storage: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('cv', 'files', 'media') and (select private.is_admin()));

-- ---------------------------------------------------------------------
-- Seed: the eight certifications (content/certifications.ts, brief §4)
-- ---------------------------------------------------------------------
insert into public.certifications (code, name, issuer, year, detail, featured, sort_order) values
  ('VCP-DCV · vSphere 8', 'VMware Certified Professional — Data Center Virtualization', 'VMware by Broadcom', '2024', 'The credential behind my private cloud specialism', true, 1),
  ('RHCE · EX294',        'Red Hat Certified Engineer',                                 'Red Hat',            '2026', null,                                               false, 2),
  ('CEH',                 'Certified Ethical Hacker',                                   'EC-Council',         '2018', null,                                               false, 3),
  ('CCNP R&S',            'CCNP Routing & Switching',                                   'Cisco',              '2016–2019', 'ROUTE, SWITCH, TSHOOT',                       false, 4),
  ('MCT',                 'Microsoft Certified Trainer',                                'Microsoft',          '2014', null,                                               false, 5),
  ('CCNA',                'Cisco Certified Network Associate',                          'Cisco',              '2012–2013', 'ICND1, ICND2',                                false, 6),
  ('MCP',                 'Microsoft Certified Professional',                           'Microsoft',          '2010', null,                                               false, 7),
  ('MCSA',                'MCSA — Windows Server 2008',                                 'Microsoft',          '2009–2010', '70-640, 70-642, 70-646',                      false, 8);

-- ---------------------------------------------------------------------
-- Seed: site settings + profile copy (lib/site.ts, content/profile.ts)
-- ---------------------------------------------------------------------
insert into public.site_settings (id, default_title, default_description, email, linkedin_url, profile) values (
  1,
  'Md. Hasib Reza – Virtualization & Private Cloud Specialist',
  'CIO & AMD at Sonali Life Insurance PLC. 16+ years in VMware private cloud, data centre, networking and cybersecurity.',
  'hasibreza@gmail.com',
  null,
  jsonb_build_object(
    'name',          'Md. Hasib Reza',
    'role',          'Virtualization & Private Cloud Infrastructure Specialist',
    'tagline',       'I build infrastructure that doesn''t go down.',
    'current',       'CIO & AMD, Sonali Life Insurance PLC',
    'location',      'Dhaka, Bangladesh',
    'heroIntro',     'Virtualization & Private Cloud Infrastructure Specialist. CIO & Assistant Managing Director at Sonali Life Insurance PLC, with 16+ years in enterprise infrastructure.',
    'aboutHeadline', 'I design and run infrastructure that can''t afford to fail.',
    'aboutShort', jsonb_build_array(
      'I design and run the infrastructure that regulated businesses can''t afford to lose: high-availability virtualization, data centres, networks and security.',
      'My career started hands-on in London and grew through ten years at Dragon IT & Communication, where I also helped deliver two financial ERP platforms for the insurance industry. Today I lead technology for a Head Office and 254 branches.'
    ),
    'aboutLong', jsonb_build_array(
      'As Chief Information Officer and Assistant Managing Director of Sonali Life Insurance PLC, I lead the IT roadmap, data centre and private cloud for a Head Office and 254 branches.',
      'My career has been hands-on from the start. I began in London as a support engineer, then worked as a network engineer at the City of London Academy. Over ten years at Dragon IT & Communication Ltd., I moved from System Analyst to Head of Project. Along the way I helped develop and implement two financial ERP platforms for the Life and Non-Life insurance industries.',
      'Today I focus on resilience, security and measurable business value. That means high-availability virtualization, DC/DR design, layered cybersecurity, and data analytics and AI, including Agentic AI, that turn operational data into better decisions.',
      'I hold an MSc in Computer Networking with Distinction from the University of Greenwich. I''m also certified across Red Hat, VMware, Cisco, EC-Council and Microsoft.'
    )
  )
);
