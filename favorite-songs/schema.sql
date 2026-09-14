-- ===========================================================================
-- Our Favorite Songs unit — run this once in the Supabase SQL editor.
-- Identity is the student's school email. Safe to run twice.
-- ===========================================================================
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- entries
create table if not exists song_entries (
  id            uuid primary key default gen_random_uuid(),
  email         text,                   -- the identifier
  student_name  text,                   -- display name on the mixtape
  student_key   text,                   -- legacy, unused
  class_period  text,
  is_example    boolean default false,  -- model songs, shown to every period
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

-- if an older version of this table already exists, bring it up to date
alter table song_entries add column if not exists email      text;
alter table song_entries add column if not exists is_example boolean default false;
alter table song_entries alter column student_key  drop not null;
alter table song_entries alter column student_name drop not null;
alter table song_entries alter column class_period drop not null;

drop index if exists song_entries_uniq;
create unique index if not exists song_entries_email_uniq on song_entries (email);
create index if not exists song_entries_period  on song_entries (class_period);
create index if not exists song_entries_example on song_entries (is_example);

-- ---------------------------------------------------------------- comments
create table if not exists song_comments (
  id           uuid primary key default gen_random_uuid(),
  entry_id     uuid references song_entries(id) on delete cascade,
  class_period text,
  author_name  text,
  author_email text,
  author_key   text,                    -- legacy, unused
  body         text,
  hidden       boolean default false,
  created_at   timestamptz default now()
);
alter table song_comments add column if not exists author_email text;
create index if not exists song_comments_entry on song_comments (entry_id);

-- ---------------------------------------------------------------- likes
create table if not exists song_likes (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid references song_entries(id) on delete cascade,
  liker_email text,
  liker_key   text,                     -- legacy, unused
  created_at  timestamptz default now()
);
alter table song_likes add column if not exists liker_email text;
drop index if exists song_likes_uniq;
create unique index if not exists song_likes_email_uniq on song_likes (entry_id, liker_email);

-- ---------------------------------------------------------------- votes
-- One vote per student: "which song should the whole class study together?"
create table if not exists song_votes (
  id           uuid primary key default gen_random_uuid(),
  entry_id     uuid references song_entries(id) on delete cascade,
  voter_email  text,
  voter_name   text,
  class_period text,
  created_at   timestamptz default now()
);
create unique index if not exists song_votes_voter_uniq on song_votes (voter_email);
create index if not exists song_votes_entry on song_votes (entry_id);

-- ---------------------------------------------------------------- lessons
create table if not exists song_vocab_progress (
  id           uuid primary key default gen_random_uuid(),
  email        text,
  student_name text,
  student_key  text,                    -- legacy, unused
  class_period text,
  lesson       text not null,           -- 'sound' or 'feelings'
  level        text,
  language     text,
  scores       jsonb default '{}'::jsonb,
  writing      jsonb default '{}'::jsonb,
  turned_in    boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table song_vocab_progress add column if not exists email text;
alter table song_vocab_progress alter column student_key  drop not null;
alter table song_vocab_progress alter column class_period drop not null;

drop index if exists song_vocab_uniq;
create unique index if not exists song_vocab_email_uniq on song_vocab_progress (email, lesson);

-- ---------------------------------------------------------------- access
alter table song_entries        enable row level security;
alter table song_comments       enable row level security;
alter table song_likes          enable row level security;
alter table song_votes          enable row level security;
alter table song_vocab_progress enable row level security;

do $$
declare t text;
begin
  foreach t in array array['song_entries','song_comments','song_likes',
                           'song_votes','song_vocab_progress'] loop
    execute format('drop policy if exists %I on %I', t||'_all', t);
    execute format('create policy %I on %I for all to anon using (true) with check (true)', t||'_all', t);
  end loop;
end $$;
