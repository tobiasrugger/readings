-- ============================================================
-- Maus / Holocaust / Oral Histories unit — Supabase schema
-- Run this in the Supabase SQL editor BEFORE using the pages.
-- The anon key cannot create tables or buckets, so this is manual.
-- ============================================================

-- 1. Student work (all pages autosave here)
create table if not exists public.maus_progress (
  id            bigserial primary key,
  student_name  text not null,            -- always lowercased by the client
  display_name  text,                     -- what the student actually typed
  class_period  text not null,            -- lowercased by the client
  activity      text not null,            -- background | vocab | reading | oralhistory | assessment
  level         text,                     -- '1' | '2' | '3'
  answers       jsonb not null default '{}'::jsonb,
  score         numeric,
  max_score     numeric,
  turned_in     boolean not null default false,
  updated_at    timestamptz not null default now()
);

-- IMPORTANT: plain-column unique index (NOT an expression index).
-- PostgREST upserts fail silently against expression indexes like lower(col).
create unique index if not exists maus_progress_uniq
  on public.maus_progress (student_name, class_period, activity);

create index if not exists maus_progress_period on public.maus_progress (class_period);

-- 2. Row level security
alter table public.maus_progress enable row level security;

create policy "anon can insert"  on public.maus_progress for insert to anon with check (true);
create policy "anon can update"  on public.maus_progress for update to anon using (true) with check (true);
create policy "anon can select"  on public.maus_progress for select to anon using (true);

-- 3. Storage bucket for interview recordings
--    Create this in the dashboard: Storage -> New bucket
--      name:   maus-recordings
--      public: yes
--    Then add these policies on storage.objects:
--
--    create policy "anon upload maus" on storage.objects for insert to anon
--      with check (bucket_id = 'maus-recordings');
--    create policy "anon read maus"   on storage.objects for select to anon
--      using (bucket_id = 'maus-recordings');

-- 4. Handy teacher views
create or replace view public.maus_oral_stages as
select
  display_name, class_period,
  answers->>'oh.who'   as interviewee,
  answers->>'oh.rel'   as relationship,
  (answers->>'oh.stage.interview' = '1') as did_interview,
  (answers->>'oh.stage.publish'   = '1') as published,
  array_length(regexp_split_to_array(coalesce(answers->>'oh.story',''), '[[:space:]]+'), 1) as story_words,
  answers->>'oh.audio' as audio_url,
  updated_at
from public.maus_progress
where activity = 'oralhistory';

-- Students who flagged an exit ticket as heavy, any chapter
create or replace view public.maus_checkins as
select display_name, class_period, key as chapter_field, value as mood, updated_at
from public.maus_progress, jsonb_each_text(answers)
where activity = 'reading' and key like '%.mood' and value in ('heavy','fast')
order by updated_at desc;
