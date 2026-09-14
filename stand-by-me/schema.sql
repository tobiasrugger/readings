-- ===========================================================
-- The Body / Stand By Me — student work
-- Run this in the Supabase SQL editor BEFORE any student signs in.
-- Project: lhmwtfyceilgndpygivj
-- ===========================================================

create table if not exists public.body_work (
  id            bigserial primary key,
  email         text        not null,
  page          text        not null,
  name          text,
  class_period  text,
  answers       jsonb       not null default '{}'::jsonb,
  turned_in     boolean     not null default false,
  updated_at    timestamptz not null default now()
);

-- IMPORTANT: plain columns, not lower(email).
-- PostgREST matches ?on_conflict=email,page against a plain unique index only;
-- an expression index makes the upsert fail silently. The pages lowercase the
-- address in JavaScript before sending, so this stays consistent.
create unique index if not exists body_work_email_page_idx
  on public.body_work (email, page);

create index if not exists body_work_page_idx on public.body_work (page);

alter table public.body_work enable row level security;

drop policy if exists body_work_select on public.body_work;
drop policy if exists body_work_insert on public.body_work;
drop policy if exists body_work_update on public.body_work;

create policy body_work_select on public.body_work
  for select to anon using (true);

create policy body_work_insert on public.body_work
  for insert to anon with check (true);

create policy body_work_update on public.body_work
  for update to anon using (true) with check (true);

-- page values written by the four student pages:
--   'guide-easy'  Reading Guide #1, plain version
--   'part1a'      King's text, opens at "I was twelve going on thirteen"
--   'part1'       King's text, full opening
--   'vocab'       Vocabulary and grammar #V1
