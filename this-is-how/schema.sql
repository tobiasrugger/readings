-- This Is How We Do It / This Is How I Do It  --  unit table
-- Run this in the Supabase SQL editor BEFORE students open the app.
-- The anon key cannot create tables, so this has to be done in the dashboard.

create table if not exists public.tih_work (
  id            bigserial primary key,
  email         text not null,
  name          text,
  period        text,
  level         text default 's',
  data          jsonb not null default '{}'::jsonb,
  auto_score    int  default 0,
  auto_total    int  default 0,
  test_score    int,
  teacher_score int,
  teacher_note  text,
  turned_in     boolean default false,
  updated_at    timestamptz default now()
);

-- IMPORTANT: a plain-column unique index, not an expression index.
-- PostgREST upsert (on_conflict=email) only works if the conflict target
-- matches a unique index on the plain column. lower(email) would break it.
-- The app lowercases the email in JavaScript before sending.
create unique index if not exists tih_work_email_key on public.tih_work (email);

alter table public.tih_work enable row level security;

drop policy if exists "tih anon read"   on public.tih_work;
drop policy if exists "tih anon write"  on public.tih_work;
drop policy if exists "tih anon update" on public.tih_work;

create policy "tih anon read"   on public.tih_work for select to anon using (true);
create policy "tih anon write"  on public.tih_work for insert to anon with check (true);
create policy "tih anon update" on public.tih_work for update to anon using (true) with check (true);

-- The teacher answer key lives in this same table as one special row,
-- email = 'answer-key@teacher'. The dashboard writes it and filters it
-- out of the roster. No second table needed.
