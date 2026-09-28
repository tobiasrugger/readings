-- Grammar Checks (readings/diagnostic/) — run once in Supabase SQL editor
create table if not exists diag_attempts (
  id          bigserial primary key,
  attempt_id  text not null unique,
  email       text not null,
  name        text,
  period      text,
  test        text not null,
  score       int,
  max_score   int,
  skills      jsonb,
  lang        text,
  started_at  timestamptz,
  finished_at timestamptz default now(),
  seconds     int
);
create index if not exists diag_attempts_test_idx  on diag_attempts (test);
create index if not exists diag_attempts_email_idx on diag_attempts (email);

create table if not exists diag_responses (
  id          bigserial primary key,
  attempt_id  text not null,
  email       text not null,
  period      text,
  test        text not null,
  item_id     text not null,
  item_no     int,
  skill       text,
  correct     boolean,
  strict_ok   boolean,
  part_n      int,
  part_d      int,
  response    text,
  raw         text,
  override    boolean,
  created_at  timestamptz default now(),
  unique (attempt_id, item_id)
);
create index if not exists diag_responses_test_idx  on diag_responses (test);
create index if not exists diag_responses_email_idx on diag_responses (email);

alter table diag_attempts  enable row level security;
alter table diag_responses enable row level security;
drop policy if exists diag_attempts_anon  on diag_attempts;
drop policy if exists diag_responses_anon on diag_responses;
create policy diag_attempts_anon  on diag_attempts  for all to anon using (true) with check (true);
create policy diag_responses_anon on diag_responses for all to anon using (true) with check (true);
