-- =====================================================================
-- Follow-up: one permissive SELECT policy per table (Supabase performance
-- advisor "multiple_permissive_policies"). Same access rules as before:
--   public  → published-and-due rows (projects, posts), live CV, all certs
--   admin   → everything (MFA session + allow-listed user ID)
-- The "for all" admin policies are split so they no longer overlap SELECT.
-- =====================================================================

-- cv_files
drop policy "cv_files: public reads live" on public.cv_files;
drop policy "cv_files: admin all" on public.cv_files;
create policy "cv_files: read" on public.cv_files
  for select to anon, authenticated
  using (is_active or (select private.is_admin()));
create policy "cv_files: admin insert" on public.cv_files
  for insert to authenticated with check ((select private.is_admin()));
create policy "cv_files: admin update" on public.cv_files
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "cv_files: admin delete" on public.cv_files
  for delete to authenticated using ((select private.is_admin()));

-- projects
drop policy "projects: public reads published" on public.projects;
drop policy "projects: admin all" on public.projects;
create policy "projects: read" on public.projects
  for select to anon, authenticated
  using ((status in ('published', 'scheduled') and published_at <= now()) or (select private.is_admin()));
create policy "projects: admin insert" on public.projects
  for insert to authenticated with check ((select private.is_admin()));
create policy "projects: admin update" on public.projects
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "projects: admin delete" on public.projects
  for delete to authenticated using ((select private.is_admin()));

-- posts
drop policy "posts: public reads published" on public.posts;
drop policy "posts: admin all" on public.posts;
create policy "posts: read" on public.posts
  for select to anon, authenticated
  using ((status in ('published', 'scheduled') and published_at <= now()) or (select private.is_admin()));
create policy "posts: admin insert" on public.posts
  for insert to authenticated with check ((select private.is_admin()));
create policy "posts: admin update" on public.posts
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "posts: admin delete" on public.posts
  for delete to authenticated using ((select private.is_admin()));

-- certifications (public read stays; admin loses its overlapping SELECT)
drop policy "certifications: admin write" on public.certifications;
create policy "certifications: admin insert" on public.certifications
  for insert to authenticated with check ((select private.is_admin()));
create policy "certifications: admin update" on public.certifications
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "certifications: admin delete" on public.certifications
  for delete to authenticated using ((select private.is_admin()));
