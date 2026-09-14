-- ============================================================
-- Survival English · Unit 1 · Supabase schema
-- Run this in the Supabase SQL editor BEFORE students use the pages.
-- The anon key cannot run DDL, so this must be done in the dashboard.
-- ============================================================

-- ---------- student unit work ----------
create table if not exists public.se_unit1 (
  id          bigserial primary key,
  email       text not null,
  name        text,
  lang        text,
  level       text default 'easy',
  answers     jsonb default '{}'::jsonb,
  score       int  default 0,
  total       int  default 0,
  turned_in   boolean default false,
  updated_at  timestamptz default now()
);

-- IMPORTANT: the unique index must use PLAIN COLUMNS, not an expression
-- like lower(email). PostgREST's on_conflict=email has to match this index
-- exactly or the upsert silently fails. The client already lowercases email.
create unique index if not exists se_unit1_email_key
  on public.se_unit1 (email);


-- ---------- unit test ----------
create table if not exists public.se_unit1_test (
  id          bigserial primary key,
  email       text not null,
  name        text,
  level       text default 'easy',
  answers     jsonb default '{}'::jsonb,
  score       int  default 0,
  total       int  default 0,
  skills      jsonb default '{}'::jsonb,
  writing_score int,
  turned_in   boolean default false,
  updated_at  timestamptz default now()
);

create unique index if not exists se_unit1_test_email_key
  on public.se_unit1_test (email);


-- ---------- access ----------
-- These are classroom tables with no private data beyond a school email.
-- Permissive policies so the anon key can read and upsert.
alter table public.se_unit1      enable row level security;
alter table public.se_unit1_test enable row level security;

drop policy if exists se_unit1_all on public.se_unit1;
create policy se_unit1_all on public.se_unit1
  for all to anon using (true) with check (true);

drop policy if exists se_unit1_test_all on public.se_unit1_test;
create policy se_unit1_test_all on public.se_unit1_test
  for all to anon using (true) with check (true);


-- ---------- handy queries ----------
-- Who has turned in the unit work:
--   select name, email, level, score, total, updated_at
--   from se_unit1 where turned_in order by name;

-- Reopen one student's locked test (they also need to clear the page on their device):
--   delete from se_unit1_test where email = 'student@sfusd.edu';

-- Wipe everything at the end of the unit:
--   truncate se_unit1, se_unit1_test;
