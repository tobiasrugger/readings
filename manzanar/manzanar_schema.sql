-- Farewell to Manzanar ELD unit -- run this once in the Supabase SQL editor
-- Project: lhmwtfyceilgndpygivj

create table if not exists manzanar_work (
  id          bigserial primary key,
  email       text        not null,
  name        text,
  page        text        not null,
  data        jsonb       not null default '{}'::jsonb,
  turned_in   boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- MUST be plain columns, not lower(email). An expression index breaks
-- PostgREST upsert with ?on_conflict=email,page -- this is the bug from the
-- Sept 11 unit that made saves silently fail.
create unique index if not exists manzanar_work_email_page
  on manzanar_work (email, page);

alter table manzanar_work enable row level security;

drop policy if exists manzanar_anon on manzanar_work;
create policy manzanar_anon on manzanar_work
  for all to anon using (true) with check (true);

create or replace function manzanar_touch() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists manzanar_work_touch on manzanar_work;
create trigger manzanar_work_touch
  before insert or update on manzanar_work
  for each row execute function manzanar_touch();

-- The movie link the teacher sets lives here too, as one row:
--   email = 'teacher@galileo.local', page = 'movie_media', data = {"url": "..."}
-- The dashboard filters that row out of the student list.
