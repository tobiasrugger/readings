-- Speaking interviews: one row per recorded sentence (every try, plus private practice).
-- email = the student who SPOKE the sentence, so each student's recordings are in their own account.
create table if not exists public.speaking_attempts (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  activity      text not null,          -- e.g. describe-a-classmate
  item_id       text not null,          -- q01 ... q16
  exchange_id   text,                   -- one question-and-answer between two students
  round         int,                    -- 1 = device owner asks, 2 = after "Switch"
  line_no       int,                    -- 1 question, 2 answer, 3 why, 4 because
  role          text,                   -- ask | answer | why_ask | why_answer
  email         text not null,          -- who spoke
  speaker_name  text,
  partner_email text,
  partner_name  text,
  period        text,
  device_email  text,                   -- whose Chromebook recorded it
  target_text   text,                   -- the sentence it matched best
  said_text     text,                   -- what the page showed (frames filled in)
  transcript    text,                   -- raw speech-to-text
  alternatives  jsonb,                  -- up to 5 guesses from the recognizer
  match_score   real,                   -- 0..1
  attempt_no    int,
  accepted      boolean default false,  -- the try that was kept
  practice      boolean default false,  -- true = re-recorded privately on My Speaking
  seconds       real,
  audio_path    text                    -- in the fluency-recordings bucket, speaking/ folder
);

create index if not exists speaking_attempts_email_idx   on public.speaking_attempts (email);
create index if not exists speaking_attempts_partner_idx on public.speaking_attempts (partner_email);
create index if not exists speaking_attempts_period_idx  on public.speaking_attempts (period);

alter table public.speaking_attempts enable row level security;

drop policy if exists "speaking read"   on public.speaking_attempts;
drop policy if exists "speaking insert" on public.speaking_attempts;
create policy "speaking read"   on public.speaking_attempts for select to anon using (true);
create policy "speaking insert" on public.speaking_attempts for insert to anon with check (true);

grant select, insert on public.speaking_attempts to anon;
