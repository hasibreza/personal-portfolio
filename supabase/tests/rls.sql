-- =====================================================================
-- Row Level Security tests. Run in the SQL editor (or via the Supabase MCP).
-- Everything happens inside one DO block that ends by raising
-- 'RLS_TESTS_PASSED', which rolls back every test row. Any failure raises
-- 'RLS_TEST_FAILED: <what>' instead. Nothing is left behind either way.
-- =====================================================================
do $$
declare
  admin_id    constant uuid := '00000000-0000-4000-8000-0000000000a1';
  intruder_id constant uuid := '00000000-0000-4000-8000-0000000000b2';
  n integer;
  cv_a uuid; cv_b uuid;
  denied boolean;

begin
  -- Fixtures (as the migration owner) ------------------------------------
  insert into auth.users (id, email, aud, role) values
    (admin_id, 'rls-admin@test.invalid', 'authenticated', 'authenticated'),
    (intruder_id, 'rls-intruder@test.invalid', 'authenticated', 'authenticated');
  insert into private.admin_users (user_id) values (admin_id);

  insert into public.projects (slug, title, status, published_at) values
    ('rls-draft', 'Draft', 'draft', null),
    ('rls-live', 'Live', 'published', now() - interval '1 day'),
    ('rls-future', 'Future', 'scheduled', now() + interval '7 days');
  insert into public.posts (slug, title, status, published_at) values
    ('rls-draft', 'Draft', 'draft', null),
    ('rls-live', 'Live', 'published', now() - interval '1 day'),
    ('rls-future', 'Future', 'scheduled', now() + interval '7 days');
  insert into public.cv_files (file_path, label, is_active) values ('rls-a.pdf', 'A', true) returning id into cv_a;
  insert into public.cv_files (file_path, label, is_active) values ('rls-b.pdf', 'B', false) returning id into cv_b;
  insert into public.contact_messages (name, email, subject, message, ip_hash)
    values ('T', 't@test.invalid', 'S', 'Message body', repeat('a', 64));

  -- ===================== 1. Anonymous visitor ===========================
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  set local role anon;

  select count(*) into n from public.projects where slug like 'rls-%';
  if n <> 1 then raise exception 'RLS_TEST_FAILED: anon sees % projects (expected 1 published)', n; end if;
  select count(*) into n from public.posts where slug like 'rls-%';
  if n <> 1 then raise exception 'RLS_TEST_FAILED: anon sees % posts (expected 1 published)', n; end if;
  select count(*) into n from public.cv_files where file_path like 'rls-%';
  if n <> 1 then raise exception 'RLS_TEST_FAILED: anon sees % CV rows (expected only the live one)', n; end if;
  select count(*) into n from public.contact_messages;
  if n <> 0 then raise exception 'RLS_TEST_FAILED: anon can read contact messages'; end if;

  denied := false;
  begin
    insert into public.contact_messages (name, email, subject, message, ip_hash)
      values ('x', 'x@test.invalid', 'x', 'spam spam', repeat('b', 64));
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: anon could insert a contact message directly'; end if;

  denied := false;
  begin
    update public.certifications set year = '1999';
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: anon could update certifications'; end if;

  denied := false;
  begin perform public.set_live_cv(cv_b);
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: anon could call set_live_cv'; end if;

  denied := false;
  begin perform 1 from private.admin_users;
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: anon could read the admin allow-list'; end if;

  denied := false;
  begin insert into storage.objects (bucket_id, name) values ('media', 'rls/anon.png');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: anon could upload to storage'; end if;
  reset role;

  -- ===================== 2. Admin, password only (aal1) ==================
  perform set_config('request.jwt.claims',
    json_build_object('sub', admin_id, 'role', 'authenticated', 'aal', 'aal1')::text, true);
  set local role authenticated;

  select count(*) into n from public.projects where slug like 'rls-%';
  if n <> 1 then raise exception 'RLS_TEST_FAILED: admin without MFA sees % projects', n; end if;
  select count(*) into n from public.contact_messages;
  if n <> 0 then raise exception 'RLS_TEST_FAILED: admin without MFA can read messages'; end if;
  denied := false;
  begin insert into public.projects (slug, title) values ('rls-aal1', 'x');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: admin without MFA could create a project'; end if;
  denied := false;
  begin perform public.set_live_cv(cv_b);
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: admin without MFA could switch the live CV'; end if;
  reset role;

  -- ===================== 3. Other user with MFA (not allow-listed) =======
  perform set_config('request.jwt.claims',
    json_build_object('sub', intruder_id, 'role', 'authenticated', 'aal', 'aal2')::text, true);
  set local role authenticated;

  select count(*) into n from public.posts where slug like 'rls-%';
  if n <> 1 then raise exception 'RLS_TEST_FAILED: non-admin MFA user sees % posts', n; end if;
  select count(*) into n from public.contact_messages;
  if n <> 0 then raise exception 'RLS_TEST_FAILED: non-admin MFA user can read messages'; end if;
  denied := false;
  begin insert into public.posts (slug, title) values ('rls-intruder', 'x');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: non-admin MFA user could create a post'; end if;
  update public.certifications set year = '1999' where code = 'CEH';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'RLS_TEST_FAILED: non-admin MFA user updated a certification'; end if;
  denied := false;
  begin insert into storage.objects (bucket_id, name) values ('media', 'rls/intruder.png');
  exception when insufficient_privilege then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: non-admin MFA user could upload to storage'; end if;
  reset role;

  -- ===================== 4. Admin with MFA (aal2) =======================
  perform set_config('request.jwt.claims',
    json_build_object('sub', admin_id, 'role', 'authenticated', 'aal', 'aal2')::text, true);
  set local role authenticated;

  select count(*) into n from public.projects where slug like 'rls-%';
  if n <> 3 then raise exception 'RLS_TEST_FAILED: admin sees % projects (expected all 3)', n; end if;
  select count(*) into n from public.posts where slug like 'rls-%';
  if n <> 3 then raise exception 'RLS_TEST_FAILED: admin sees % posts (expected all 3)', n; end if;
  select count(*) into n from public.cv_files where file_path like 'rls-%';
  if n <> 2 then raise exception 'RLS_TEST_FAILED: admin sees % CV rows (expected 2)', n; end if;
  select count(*) into n from public.contact_messages;
  if n < 1 then raise exception 'RLS_TEST_FAILED: admin cannot read messages'; end if;

  insert into public.projects (slug, title) values ('rls-admin-new', 'New');
  update public.posts set title = 'Edited' where slug = 'rls-draft';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'RLS_TEST_FAILED: admin could not edit a post'; end if;
  update public.certifications set verify_url = 'https://example.com/verify' where code = 'CEH';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'RLS_TEST_FAILED: admin could not edit a certification'; end if;
  update public.contact_messages set status = 'archived';
  get diagnostics n = row_count;
  if n < 1 then raise exception 'RLS_TEST_FAILED: admin could not archive a message'; end if;

  perform public.set_live_cv(cv_b);
  select count(*) into n from public.cv_files where is_active;
  if n <> 1 then raise exception 'RLS_TEST_FAILED: % live CVs after set_live_cv (expected 1)', n; end if;
  perform 1 from public.cv_files where id = cv_b and is_active;
  if not found then raise exception 'RLS_TEST_FAILED: set_live_cv did not switch the live CV'; end if;

  insert into storage.objects (bucket_id, name) values ('media', 'rls/admin.png');
  reset role;

  -- ===================== 5. Database constraints ========================
  denied := false;
  begin
    for i in 1..6 loop
      insert into public.contact_messages (name, email, subject, message, ip_hash)
        values ('R', 'r@test.invalid', 'S', 'Rate limit test', repeat('c', 64));
    end loop;
  exception when raise_exception then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: the 6th message in an hour was not refused'; end if;

  denied := false;
  begin insert into public.projects (slug, title, cover_image) values ('rls-noalt', 'x', 'p/x.png');
  exception when check_violation then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: an image without alt text was accepted'; end if;

  denied := false;
  begin insert into public.posts (slug, title) values ('Bad Slug!', 'x');
  exception when check_violation then denied := true; end;
  if not denied then raise exception 'RLS_TEST_FAILED: an invalid slug was accepted'; end if;

  raise exception 'RLS_TESTS_PASSED';
end
$$;
