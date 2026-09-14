-- Short Stories & Fables unit — run this once in the Supabase SQL editor.
-- The unique index uses PLAIN COLUMNS (no lower() expression), because
-- PostgREST upsert with on_conflict=email,story must match it exactly.
-- The app lowercases the email before sending, so plain columns are safe.

create table if not exists public.fables_work (
  id            bigserial primary key,
  email         text        not null,
  student_name  text,
  story         text        not null,
  data          jsonb       not null default '{}'::jsonb,
  score         numeric,
  turned_in     boolean     not null default false,
  updated_at    timestamptz not null default now()
);

create unique index if not exists fables_work_email_story_uidx
  on public.fables_work (email, story);

create index if not exists fables_work_story_idx   on public.fables_work (story);
create index if not exists fables_work_updated_idx on public.fables_work (updated_at desc);

alter table public.fables_work enable row level security;

drop policy if exists fables_work_anon_select on public.fables_work;
drop policy if exists fables_work_anon_write  on public.fables_work;

create policy fables_work_anon_select on public.fables_work
  for select to anon using (true);

create policy fables_work_anon_write on public.fables_work
  for all to anon using (true) with check (true);

-- Quick check that upsert works (safe to run, then delete the row):
-- insert into public.fables_work (email, student_name, story, data)
-- values ('test@sfusd.edu','Test Student','ant','{"predict":"hello"}'::jsonb)
-- on conflict (email, story) do update set data = excluded.data, updated_at = now();
-- delete from public.fables_work where email = 'test@sfusd.edu';
