-- Favorites: move the key from name+period to school email.
-- Safe to run whether or not you already created the table.

create table if not exists favorites_work (
  id           bigserial primary key,
  student_name text        not null,
  class_period text        not null,
  data         jsonb       not null default '{}'::jsonb,
  turned_in    boolean     not null default false,
  updated_at   timestamptz not null default now()
);

-- email becomes the key that links this to every other app
alter table favorites_work add column if not exists email text;

-- the old name+period index has to go before the new one can work
drop index if exists favorites_work_uniq;

-- plain column, no expression — an expression index makes PostgREST
-- silently insert duplicates instead of merging
create unique index if not exists favorites_work_email_uniq
  on favorites_work (email);

alter table favorites_work enable row level security;
drop policy if exists favorites_anon_all on favorites_work;
create policy favorites_anon_all on favorites_work
  for all to anon using (true) with check (true);


-- Shared identity tables. Skip if you already made these for ELD 103.
create table if not exists students (
  email   text primary key,
  name    text,
  period  text,
  created_at timestamptz default now()
);
alter table students enable row level security;
drop policy if exists students_anon_all on students;
create policy students_anon_all on students for all to anon using (true) with check (true);

create table if not exists student_aliases (
  alias_email text primary key,
  email       text not null,
  created_at  timestamptz default now()
);
alter table student_aliases enable row level security;
drop policy if exists aliases_anon_all on student_aliases;
create policy aliases_anon_all on student_aliases for all to anon using (true) with check (true);
