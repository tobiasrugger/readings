-- The Odyssey unit — run this once in the Supabase SQL editor
-- Project: lhmwtfyceilgndpygivj

create table if not exists public.odyssey_work (
  email       text primary key,
  name        text,
  period      text,
  level       text default 's',
  data        jsonb default '{}'::jsonb,
  turned_in   boolean default false,
  updated_at  timestamptz default now()
);

-- The upsert in the app posts to ?on_conflict=email
-- email is the primary key, which is a plain (non-expression) unique index,
-- so the conflict target matches exactly. Do not replace this with an index
-- on lower(email) — PostgREST cannot use an expression index as a conflict
-- target and the upsert will silently fail.

create index if not exists odyssey_work_period_idx on public.odyssey_work (period);
create index if not exists odyssey_work_updated_idx on public.odyssey_work (updated_at desc);

alter table public.odyssey_work enable row level security;

drop policy if exists "odyssey read"   on public.odyssey_work;
drop policy if exists "odyssey insert" on public.odyssey_work;
drop policy if exists "odyssey update" on public.odyssey_work;

create policy "odyssey read"   on public.odyssey_work for select using (true);
create policy "odyssey insert" on public.odyssey_work for insert with check (true);
create policy "odyssey update" on public.odyssey_work for update using (true) with check (true);

-- Quick check that the upsert path works:
-- insert into public.odyssey_work (email, name, period) values ('test@sfusd.edu','Test','Period 1')
--   on conflict (email) do update set name = excluded.name;
-- select * from public.odyssey_work;
-- delete from public.odyssey_work where email = 'test@sfusd.edu';
