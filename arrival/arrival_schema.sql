-- The Arrival unit — run this once in the Supabase SQL editor
-- (the anon key cannot create tables, so this has to be pasted in by hand)

create table if not exists public.arrival_responses (
  id            bigserial primary key,
  email         text not null,
  student_name  text,
  period        text,
  guide_key     text not null,      -- 'arrival_unit' or 'arrival_projects'
  lang          text,
  level         text,               -- 'easy' | 'std' | 'chal'
  payload       jsonb,
  answered      integer default 0,
  total         integer default 0,
  submitted     boolean default false,
  submitted_at  timestamptz,
  updated_at    timestamptz default now()
);

-- plain-column unique index (NOT an expression index — the client lowercases
-- the email before sending, so lower(email) here would silently break upserts)
create unique index if not exists arrival_responses_email_guide_idx
  on public.arrival_responses (email, guide_key);

create index if not exists arrival_responses_guide_idx
  on public.arrival_responses (guide_key);

alter table public.arrival_responses enable row level security;

drop policy if exists "arrival anon read"  on public.arrival_responses;
drop policy if exists "arrival anon write" on public.arrival_responses;
drop policy if exists "arrival anon edit"  on public.arrival_responses;

create policy "arrival anon read"  on public.arrival_responses for select to anon using (true);
create policy "arrival anon write" on public.arrival_responses for insert to anon with check (true);
create policy "arrival anon edit"  on public.arrival_responses for update to anon using (true) with check (true);
