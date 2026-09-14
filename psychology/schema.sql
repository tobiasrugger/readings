-- Who Am I? Psychology & Short Stories unit
-- Run this in the Supabase SQL editor BEFORE students use the pages.

create table if not exists public.psych_work (
  id          bigserial primary key,
  email       text not null,
  name        text,
  page        text not null,
  data        jsonb not null default '{}'::jsonb,
  turned_in   boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- Plain-column unique index (NOT an expression index -- PostgREST upsert
-- silently fails against lower(email)). The page JS lowercases the email
-- before sending, so this is safe.
create unique index if not exists psych_work_email_page_idx
  on public.psych_work (email, page);

create index if not exists psych_work_page_idx on public.psych_work (page);

-- keep updated_at fresh
create or replace function public.psych_touch() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end $$ language plpgsql;

drop trigger if exists psych_work_touch on public.psych_work;
create trigger psych_work_touch before update on public.psych_work
  for each row execute function public.psych_touch();

-- Anon access, same pattern as the other reading units.
alter table public.psych_work enable row level security;

drop policy if exists psych_work_all on public.psych_work;
create policy psych_work_all on public.psych_work
  for all to anon using (true) with check (true);

-- page values used by the unit:
--   index, p1, p2, p3, p4, p5, p6, grammar, writing, assessment
