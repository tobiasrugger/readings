-- English Toolkits: one table for every toolkit page, practice page, and lesson.
-- Run this in the Supabase SQL editor BEFORE students use the pages.

create table if not exists public.toolkit_work (
  id          bigserial primary key,
  email       text not null,
  name        text,
  period      text,
  section     text not null,
  payload     jsonb not null default '{}'::jsonb,
  submitted   boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- Plain-column unique index so PostgREST upsert works.
-- (Do NOT use an expression index like lower(email) -- upsert fails silently against those.
--  The pages already lowercase the email in JavaScript before sending.)
create unique index if not exists toolkit_work_email_section_idx
  on public.toolkit_work (email, section);

create index if not exists toolkit_work_section_idx on public.toolkit_work (section);
create index if not exists toolkit_work_period_idx  on public.toolkit_work (period);

alter table public.toolkit_work enable row level security;

drop policy if exists toolkit_work_anon_all on public.toolkit_work;
create policy toolkit_work_anon_all on public.toolkit_work
  for all to anon using (true) with check (true);

-- Section values written by the pages:
--   toolkit1            toolkit2            toolkit3            (ML notes on the reference sheets)
--   toolkit1_practice   toolkit2_practice   toolkit3_practice
--   lesson1  lesson2  lesson3  lesson3b  lesson4  lesson5
