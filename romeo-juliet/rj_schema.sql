-- Romeo and Juliet unit — run once in the Supabase SQL editor.
-- One row per student per page. page is 'scenes', 'grammar', or 'assess'.

create table if not exists public.rj_work (
  id            bigserial primary key,
  email         text        not null,
  student_name  text,
  period        text,
  page          text        not null,
  data          jsonb       not null default '{}'::jsonb,
  score         numeric,
  turned_in     boolean     not null default false,
  updated_at    timestamptz not null default now()
);

-- CRITICAL: the upsert uses ?on_conflict=email,page, so the unique index must be
-- on those two PLAIN columns. No lower(email), no expressions — an expression
-- index will not match the conflict target and the upsert fails silently.
create unique index if not exists rj_work_email_page_idx
  on public.rj_work (email, page);

alter table public.rj_work enable row level security;

drop policy if exists rj_work_anon_all on public.rj_work;
create policy rj_work_anon_all
  on public.rj_work
  for all
  to anon
  using (true)
  with check (true);

-- The pages lowercase the email before sending, so the plain-column index
-- behaves case-insensitively in practice.

-- Quick check after students start working:
-- select student_name, period, page, score, turned_in, updated_at
--   from public.rj_work order by updated_at desc limit 50;
