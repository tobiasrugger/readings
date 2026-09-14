-- Our Favorite Songs unit — run this once in the Supabase SQL editor
create extension if not exists pgcrypto;

create table if not exists song_entries (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  student_key   text not null,          -- lowercased name, set by the page
  class_period  text not null,
  sticker       text,
  song_title    text,
  artist        text,
  song_url      text,
  lyrics_url    text,
  song_language text,
  speed         text,
  volume        text,
  voice         text,
  instruments   jsonb default '[]'::jsonb,
  moods         jsonb default '[]'::jsonb,
  why_like      text,
  first_heard   text,
  main_idea     text,
  fav_line      text,
  fav_line_why  text,
  level         text,
  turned_in     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create unique index if not exists song_entries_uniq on song_entries (student_key, class_period);
create index if not exists song_entries_period on song_entries (class_period);

create table if not exists song_comments (
  id           uuid primary key default gen_random_uuid(),
  entry_id     uuid references song_entries(id) on delete cascade,
  class_period text,
  author_name  text,
  author_key   text,
  body         text,
  hidden       boolean default false,
  created_at   timestamptz default now()
);
create index if not exists song_comments_entry on song_comments (entry_id);

create table if not exists song_likes (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid references song_entries(id) on delete cascade,
  liker_key  text,
  created_at timestamptz default now()
);
create unique index if not exists song_likes_uniq on song_likes (entry_id, liker_key);

create table if not exists song_vocab_progress (
  id           uuid primary key default gen_random_uuid(),
  student_name text,
  student_key  text not null,
  class_period text not null,
  lesson       text not null,           -- 'sound' or 'feelings'
  level        text,
  language     text,
  scores       jsonb default '{}'::jsonb,
  writing      jsonb default '{}'::jsonb,
  turned_in    boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create unique index if not exists song_vocab_uniq
  on song_vocab_progress (student_key, class_period, lesson);

-- open access for the classroom pages (anon key)
alter table song_entries         enable row level security;
alter table song_comments        enable row level security;
alter table song_likes           enable row level security;
alter table song_vocab_progress  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['song_entries','song_comments','song_likes','song_vocab_progress'] loop
    execute format('drop policy if exists %I on %I', t||'_all', t);
    execute format('create policy %I on %I for all to anon using (true) with check (true)', t||'_all', t);
  end loop;
end $$;
