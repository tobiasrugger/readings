-- ===========================================================================
-- Three model songs for the mixtape. Run AFTER schema.sql.
-- They are pinned above the student tracks in every class period, so the first
-- student to open the mixtape still has something to copy the shape of.
--
-- Three levels on purpose: a short answer, a standard one, and a long one, so
-- nobody thinks the long one is the only acceptable answer.
--
-- TWO THINGS TO DO YOURSELF, both at the bottom of this file:
--   1. paste the two missing YouTube links (I only had a verified link for one)
--   2. paste the real favourite lines if you want them quoted exactly
-- Re-running this file is safe: it replaces the three rows rather than adding more.
-- ===========================================================================

delete from song_entries where email in
  ('example-standard@teacher','example-short@teacher','example-long@teacher');

-- ------------------------------------------------------- 1. standard answer
insert into song_entries
  (email, student_name, class_period, is_example, sticker, song_title, artist,
   song_url, song_language, speed, volume, voice, instruments, moods,
   why_like, first_heard, main_idea, fav_line, fav_line_why, level, turned_in)
values (
  'example-standard@teacher', 'Mr. Toby', 'example', true, '🌙',
  'Dancing in the Moonlight', 'King Harvest',
  'https://www.youtube.com/watch?v=stDXwVqQvdA',
  'English', 'medium', 'medium', 'high',
  '["piano","guitar","drums","bass"]'::jsonb,
  '["happy","calm","nostalgic"]'::jsonb,
  'I like this song because of the electric piano. It sounds warm, like a summer night. The tempo is medium, so you can move to it without trying hard. It makes me feel calm and happy at the same time, which is rare. I listen to it when I am driving home and I do not want the day to finish yet.',
  'I first heard this song when I was about fifteen, in my friend''s car. We were driving to the beach and the radio was loud. I was with three friends. We did not know the words, so we only sang the chorus.',
  'The main idea of this song is that people forget their problems when they dance together at night. The singer wrote it to describe a feeling of being safe and free with other people. I think he wrote it to hold on to one good night that was already finished.',
  '(paste your favourite line here)',
  'I like this line because it says that nobody is fighting. Everyone is just happy together, and that almost never happens.',
  'std', true
);

-- ------------------------------------------------------- 2. short answer
insert into song_entries
  (email, student_name, class_period, is_example, sticker, song_title, artist,
   song_url, song_language, speed, volume, voice, instruments, moods,
   why_like, first_heard, main_idea, fav_line, fav_line_why, level, turned_in)
values (
  'example-short@teacher', 'Mr. Toby — short answer', 'example', true, '🌅',
  'Color Esperanza', 'Diego Torres',
  '',                                    -- <<< paste link at the bottom
  'Spanish', 'medium', 'loud', 'high',
  '["guitar","piano","drums"]'::jsonb,
  '["hopeful","happy","powerful"]'::jsonb,
  'I like this song because it is hopeful. It makes me feel strong. I like the voice and the guitar.',
  'I first heard it at my cousin''s house. I heard it with my family.',
  'This song is about hope. The singer wrote it because he wants people to believe that life can change.',
  '(paste your favourite line here)',
  'I like this line because it gives me hope when I am tired.',
  'easy', true
);

-- ------------------------------------------------------- 3. long answer
insert into song_entries
  (email, student_name, class_period, is_example, sticker, song_title, artist,
   song_url, song_language, speed, volume, voice, instruments, moods,
   why_like, first_heard, main_idea, fav_line, fav_line_why, level, turned_in)
values (
  'example-long@teacher', 'Mr. Toby — long answer', 'example', true, '☮️',
  'Imagine', 'John Lennon',
  '',                                    -- <<< paste link at the bottom
  'English', 'slow', 'quiet', 'high',
  '["piano","voice only"]'::jsonb,
  '["calm","hopeful","peaceful","sad"]'::jsonb,
  'I like this song for two reasons, one about the sound and one about the words. The sound is almost nothing — a slow piano and one quiet voice. There are no drums pushing you, so you have to lean in and listen. The words are the opposite of the sound: they are enormous. He asks you to imagine a world with no countries and no war, which is an idea big enough to argue about for a hundred years, delivered in the calmest voice possible. That difference between the small sound and the huge idea is what I like.',
  'I first heard this song at school, not at home. A teacher played it on a tape and then asked us whether we agreed with it. I was maybe thirteen. I remember being annoyed, because I thought the idea was impossible, and then thinking about it for the rest of the week anyway.',
  'The purpose of this song is to make the listener picture a world that does not exist yet. The singer is talking to ordinary people, not to governments. He knows the idea sounds impossible — he says so himself — but he argues that if enough people imagine the same thing, it stops being impossible. He wrote it a few years after his band ended, when he was writing about politics and peace, and countries were still at war.',
  '(paste your favourite line here)',
  'I like this line because he admits that people will think he is dreaming, and he does not argue with them. He just says he is not the only one. That is a stronger answer than getting angry.',
  'chal', true
);

-- ===========================================================================
-- FILL THESE IN — run these two lines after you paste the links.
-- ===========================================================================
-- update song_entries set song_url = 'PASTE_COLOR_ESPERANZA_YOUTUBE_URL'
--   where email = 'example-short@teacher';
-- update song_entries set song_url = 'PASTE_IMAGINE_YOUTUBE_URL'
--   where email = 'example-long@teacher';

-- Optional: quote the real lines instead of the placeholder.
-- update song_entries set fav_line = '…' where email = 'example-standard@teacher';
-- update song_entries set fav_line = '…' where email = 'example-short@teacher';
-- update song_entries set fav_line = '…' where email = 'example-long@teacher';
