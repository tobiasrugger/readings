-- Vocabulary pre-test: Language Launch Units 1–2
-- Run once in Supabase → SQL Editor. Safe to re-run.

create table if not exists vocab_pretest (id bigint generated always as identity primary key);

alter table vocab_pretest add column if not exists email        text;
alter table vocab_pretest add column if not exists name         text;
alter table vocab_pretest add column if not exists period       text;
alter table vocab_pretest add column if not exists form         text default 'pre';   -- 'pre' or 'post'
alter table vocab_pretest add column if not exists items        jsonb;                -- question order + choices, so a student resumes the same test
alter table vocab_pretest add column if not exists answers      jsonb default '{}'::jsonb;
alter table vocab_pretest add column if not exists score        int  default 0;
alter table vocab_pretest add column if not exists total        int  default 0;
alter table vocab_pretest add column if not exists answered     int  default 0;
alter table vocab_pretest add column if not exists idk          int  default 0;
alter table vocab_pretest add column if not exists page         int  default 0;
alter table vocab_pretest add column if not exists translate_flags int default 0;
alter table vocab_pretest add column if not exists tab_leaves   int  default 0;
alter table vocab_pretest add column if not exists turned_in    boolean default false;
alter table vocab_pretest add column if not exists started_at   timestamptz default now();
alter table vocab_pretest add column if not exists turned_in_at timestamptz;
alter table vocab_pretest add column if not exists updated_at   timestamptz default now();

-- Plain-column unique index (NOT lower(email)) so upserts work through PostgREST.
create unique index if not exists vocab_pretest_email_form on vocab_pretest (email, form);

alter table vocab_pretest enable row level security;
drop policy if exists vocab_pretest_anon_all on vocab_pretest;
create policy vocab_pretest_anon_all on vocab_pretest for all to anon using (true) with check (true);

-- vocab_words must be readable by anon (it already is if your other apps load it).
-- students / student_aliases: already exist from the other apps. If not:
create table if not exists students (
  email text primary key, name text, period text, created_at timestamptz default now()
);
create table if not exists student_aliases (
  alias_email text primary key, email text not null, created_at timestamptz default now()
);
