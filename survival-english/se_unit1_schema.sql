-- ============================================================
-- Survival English · Unit 1 · Supabase
-- Run in the Supabase SQL editor. The anon key cannot run DDL.
-- Safe to re-run.
-- ============================================================

create table if not exists public.se_unit1 (
  id bigserial primary key,
  email text not null, name text, lang text, period text,
  level text default 'easy',
  answers jsonb default '{}'::jsonb,
  score int default 0, total int default 0,
  turned_in boolean default false,
  updated_at timestamptz default now()
);

create table if not exists public.se_unit1_test (
  id bigserial primary key,
  email text not null, name text, lang text, period text,
  level text default 'easy',
  answers jsonb default '{}'::jsonb,
  score int default 0, total int default 0,
  skills jsonb default '{}'::jsonb,
  writing_score int,
  turned_in boolean default false,
  updated_at timestamptz default now()
);

-- new columns for the retrofitted test page
alter table public.se_unit1      add column if not exists period text;
alter table public.se_unit1      add column if not exists lang   text;
alter table public.se_unit1_test add column if not exists period text;
alter table public.se_unit1_test add column if not exists lang   text;

-- Unique index on PLAIN columns so PostgREST on_conflict=email matches.
create unique index if not exists se_unit1_email_key      on public.se_unit1 (email);
create unique index if not exists se_unit1_test_email_key on public.se_unit1_test (email);

alter table public.se_unit1      enable row level security;
alter table public.se_unit1_test enable row level security;

drop policy if exists se_unit1_all on public.se_unit1;
create policy se_unit1_all on public.se_unit1
  for all to anon using (true) with check (true);

drop policy if exists se_unit1_test_all on public.se_unit1_test;
create policy se_unit1_test_all on public.se_unit1_test
  for all to anon using (true) with check (true);

-- Reopen one student's locked test:
--   delete from se_unit1_test where email = 'student@s.sfusd.edu';
