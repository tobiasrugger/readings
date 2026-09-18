-- ===================================================================
-- ELD 103 Chapter 3 — Paragraph Structure. Run once in the Supabase
-- SQL editor. Safe to re-run. No student_name column this time.
-- ===================================================================

create table if not exists public.eld103_ch3 (
  id         bigserial primary key,
  email      text not null,
  name       text,
  period     text,
  unit       text,
  slug       text,
  score      int,
  max_score  int,
  turned_in  boolean default false,
  payload    jsonb,
  updated_at timestamptz default now()
);

-- Plain-column unique index. NOT an expression like lower(email),
-- or the upsert with on_conflict=email fails silently.
create unique index if not exists eld103_ch3_email_idx
  on public.eld103_ch3 (email);

alter table public.eld103_ch3 enable row level security;
drop policy if exists "anon insert" on public.eld103_ch3;
drop policy if exists "anon update" on public.eld103_ch3;
drop policy if exists "anon select" on public.eld103_ch3;
create policy "anon insert" on public.eld103_ch3 for insert to anon with check (true);
create policy "anon update" on public.eld103_ch3 for update to anon using (true) with check (true);
create policy "anon select" on public.eld103_ch3 for select to anon using (true);

-- The API caches each table's shape. Without this it can keep
-- refusing writes for a few minutes after the table is created.
notify pgrst, 'reload schema';

select column_name, data_type, is_nullable
from information_schema.columns
where table_schema='public' and table_name='eld103_ch3'
order by ordinal_position;
