-- Story Reel: one row per student per episode (upsert on email + episode)
create table if not exists public.reel_views (
  id            bigserial primary key,
  email         text not null,
  episode       text not null,
  student_name  text,
  period        text,
  level         text,
  lang          text,
  work          jsonb default '{}'::jsonb,
  scores        jsonb default '{}'::jsonb,
  turned_in     boolean default false,
  updated_at    timestamptz default now()
);

-- plain-column unique index (PostgREST upsert needs this, not lower(email))
create unique index if not exists reel_views_email_episode on public.reel_views (email, episode);

alter table public.reel_views enable row level security;
drop policy if exists "reel anon read"   on public.reel_views;
drop policy if exists "reel anon insert" on public.reel_views;
drop policy if exists "reel anon update" on public.reel_views;
create policy "reel anon read"   on public.reel_views for select to anon using (true);
create policy "reel anon insert" on public.reel_views for insert to anon with check (true);
create policy "reel anon update" on public.reel_views for update to anon using (true) with check (true);
