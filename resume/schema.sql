-- =====================================================================
-- RESUME UNIT  --  Mr. Toby / Galileo Academy
-- Run this in Supabase SQL Editor BEFORE using the pages.
-- =====================================================================

-- 1. THE LIVING RESUME  (one row per student, updated for 4 years)
create table if not exists resume_profiles (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  full_name   text,
  class_period text,
  data        jsonb not null default '{}'::jsonb,
  grade_level text,
  checkins    int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- PLAIN COLUMN unique index (NOT lower(email)) so PostgREST upsert works.
-- The page lowercases email in JS before sending.
create unique index if not exists resume_profiles_email_key
  on resume_profiles (email);

-- 2. LESSON WORK  (one row per student per lesson)
create table if not exists resume_work (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  full_name   text,
  lesson      text not null,          -- 'lesson1' | 'lesson2' | 'lesson3'
  answers     jsonb not null default '{}'::jsonb,
  score       int,
  max_score   int,
  turned_in   boolean default false,
  updated_at  timestamptz default now()
);

create unique index if not exists resume_work_email_lesson_key
  on resume_work (email, lesson);

-- 3. RLS  (open for classroom use, same pattern as your other apps)
alter table resume_profiles enable row level security;
alter table resume_work     enable row level security;

drop policy if exists "open_profiles" on resume_profiles;
create policy "open_profiles" on resume_profiles for all using (true) with check (true);

drop policy if exists "open_work" on resume_work;
create policy "open_work" on resume_work for all using (true) with check (true);
