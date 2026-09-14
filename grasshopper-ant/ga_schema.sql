-- The Grasshopper and the Ant — ELD unit
-- Run this once in the Supabase SQL editor before the first class period.

create table if not exists public.ga_work (
  id          bigint generated always as identity primary key,
  email       text        not null,
  name        text,
  page        text        not null,   -- reading | grammar | writing | assessment
  data        jsonb       not null default '{}'::jsonb,
  score       numeric     not null default 0,
  max_score   numeric     not null default 0,
  turned_in   boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- IMPORTANT: plain columns, not an expression like lower(email).
-- PostgREST upserts with ?on_conflict=email,page must match this index exactly,
-- or the insert fails silently and nothing ever saves.
create unique index if not exists ga_work_email_page_key
  on public.ga_work (email, page);

alter table public.ga_work enable row level security;

drop policy if exists ga_work_select on public.ga_work;
drop policy if exists ga_work_insert on public.ga_work;
drop policy if exists ga_work_update on public.ga_work;

create policy ga_work_select on public.ga_work for select to anon using (true);
create policy ga_work_insert on public.ga_work for insert to anon with check (true);
create policy ga_work_update on public.ga_work for update to anon using (true) with check (true);

grant select, insert, update on public.ga_work to anon;

-- Reopen one student's assessment:
-- update public.ga_work set turned_in = false
--   where email = 'student@sfusd.edu' and page = 'assessment';

-- Wipe the unit and start over:
-- truncate public.ga_work;
