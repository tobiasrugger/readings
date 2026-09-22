-- Run this in the Supabase SQL editor. Safe to re-run.

alter table news_work add column if not exists level text;

create table if not exists news_student_level (
  email      text primary key,
  level      text,
  updated_at timestamptz default now()
);

alter table news_student_level enable row level security;
drop policy if exists "anon all news_student_level" on news_student_level;
create policy "anon all news_student_level"
  on news_student_level for all using (true) with check (true);
