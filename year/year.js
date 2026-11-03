/* year.js — the data behind readings/year/ (teacher page) and readings/year/share.html.
 * Source: Claude Doc "Galileo ELD — Year So Far: Calendar, Workflow, Scope & Sequence (Aug–Nov 2026)"
 *   https://claude.ai/artifact/5MYycEAC1P9reDLBAtqd8K  (T-218).  Web version built as T-224.
 * Owner: the "Year calendar webpage (year/)" chat. Add a row = add one object to YEAR.rows.
 *
 * Row fields
 *   date    'YYYY-MM-DD' first day          end   optional last day (for "Sept 14–18")
 *   label   how the date reads              week  Monday of its week (filled in below)
 *   course  '101' | '103' | 'both'          strand words|grammar|reading|writing|speaking|assessment|tools
 *   title   what happened / what landed     kind  'class' (in class, beside the site) | 'site' (landed on the site) | 'pre' (before August)
 *   digital [[label, url], …]  site pages + other web tools (Quill, YouTube, GitHub)
 *   paper   [[label, url], …]  Google Docs / Sheets / Slides / Drive — the paper side
 *   book    book pages, e.g. 'pp. 38–47'    shot  optional screenshot name in shots/ (default: from the first readings URL)
 */
(function(){
var R='https://tobiasrugger.github.io/readings/';
var GD='https://docs.google.com/document/d/', GS='https://docs.google.com/spreadsheets/d/', GP='https://docs.google.com/presentation/d/';
var QUILL='https://www.quill.org/assign/diagnostic';
function r(date,label,course,strand,kind,title,digital,paper,book,end){
  return {date:date,end:end||null,label:label,course:course,strand:strand,kind:kind,title:title,digital:digital||[],paper:paper||[],book:book||''};
}
var rows=[
/* ---------- Before August: the spring starter kit ---------- */
r('2026-04-28','Apr 28','both','words','pre','Language Launch bilingual dictionaries + Unit 5 pages, Idiom Island translation proxy (still powers every tap-to-translate) — parked',
  [['languagelaunch','https://github.com/tobiasrugger/languagelaunch'],['languagelaunchunit5','https://github.com/tobiasrugger/languagelaunchunit5']]),
r('2026-05-05','May 5','both','reading','pre','ELD Adventure — text-adventure game with branching stories and badges',[['eldadventure','https://github.com/tobiasrugger/eldadventure']]),
r('2026-05-05','May 5','both','writing','pre','Comic Dialogue creator',[['comicdialogue','https://github.com/tobiasrugger/comicdialogue']]),
r('2026-05-06','May 6','both','tools','pre','Galileo Hub',[['galileohub','https://github.com/tobiasrugger/galileohub']]),
r('2026-05-13','May 13','both','assessment','pre','ELD Assessment app with teacher annotation layer (Supabase)',[['eld1assessment','https://github.com/tobiasrugger/eld1assessment']]),

/* ---------- Week of Aug 17 ---------- */
r('2026-08-18','Aug 18','103','assessment','class','Writing assessment, share with a partner, Quill assessment',[['Quill',QUILL]]),
r('2026-08-19','Aug 19–20','101','assessment','class','Do Now; dyads about the stories; Quill ELL Starter diagnostics (Beginning, Intermediate); weather word search as a sponge and quick check',
  [['Quill diagnostics',QUILL]],
  [['Do Now',GD+'1ErgTn6U4YU39vsRX8QkaCdJ3pwiinfyB9G96qnqfaMc/edit?tab=t.0'],['dyads',GD+'1qakBHqBHeUIqHos91nwwX-EwgRgBMyJYT53pSnTnemE/edit?tab=t.0'],['weather folder','https://drive.google.com/drive/folders/1O3BsVLQuxbYgmDo49FASIWHnXQKBrDIy']],'', '2026-08-20'),
r('2026-08-20','Aug 20','103','assessment','class','Do Now; Quill diagnostics (Intermediate, Advanced)',[['Quill',QUILL]],[['Do Now',GD+'1CORc0PVNdci8vmbtau_OO6PRrEa7H5kGme1jDx186t0/edit?tab=t.0']]),
r('2026-08-21','Aug 21','101','assessment','class','Writing assessment, paper and pencil (40-minute periods, assembly)',[],[['Writing Assessment',GD+'1-0q2yRYi9ztrDehtse8VeE3nj12Vx12gS4lXq0AI6ns/edit?tab=t.0']]),

/* ---------- Week of Aug 24 ---------- */
r('2026-08-24','Aug 24','103','writing','class','Where I\u2019m From brainstorm, projected (internet down)',[],
  [['brainstorm',GD+'1OCqWlfAailZQ57L9LUloEURIa9hIX-6mrGu3omj8V0k/edit?tab=t.0'],['Where I\u2019m From folder','https://drive.google.com/drive/folders/1OLalPV3sqN2sCdO1nwByad5z8L7sUUn9?usp=drive_link']]),
r('2026-08-24','Aug 24','101','words','class','Ordinal numbers Do Now; My Favorite Things poster with translation grids',[],
  [['Do Now',GD+'14LDBs3rAhpySJnpquBGFidIn_bgIcmvzvcdIVdryXBk/edit?tab=t.0'],['organizer',GD+'1WwXWIrPKcjjVKo9a2dYpTq3yop8LHyUEB6e7TQpVgwo/edit?tab=t.0'],['example poster',GD+'18cau19ugi5-_d0vCEW7FuWWwBGl74w36qCO2eLCADQ8/edit?tab=t.0'],['10 favorite things grid',GS+'151X5EbudRAxr6WGwGzuM_l7KL0fypar_8nHvjsiI8xM/edit?gid=1323970639#gid=1323970639']]),
r('2026-08-25','Aug 25','103','writing','class','Copy the brainstorm into the fill-in poem; your example',[],
  [['your example',GD+'1bAxIWTpNvJup0jl8SIYqMvarJB02kurQh0AuBRjpoGU/edit?tab=t.0'],['blank poem',GD+'1vS2NSFgg3xIWIeLPwZVtaMJPEak4HMUEUdEbCjfqs-U/edit?tab=t.0']]),
r('2026-08-25','Aug 25','101','speaking','class','Do Now read aloud and repeated; 1st, 2nd, 3rd practice',[],[['Do Now',GD+'1NRXM7E9wxiw79eCxVm_fBTOnbCxRB_I0q7wVU3KsjK4/edit?tab=t.0']]),
r('2026-08-26','Aug 26','101','speaking','class','Give One, Get One — Favorite Things; posters presented; paper and Quill writing assessments',[],[['Give One, Get One',GD+'1qnZdcIFjEYerLht6A19U8qasZikrBISYn7HmQkbwXc0/edit?tab=t.0']]),
r('2026-08-27','Aug 27','103','writing','class','Type up the poem (Classroom); sensory details (taste); Give One, Get One — Favorite Song; George Ella Lyon reading',
  [['video','https://www.youtube.com/watch?v=T-9KwCTJRyI']],
  [['questions 1 and 8',GD+'16_dD_gnB_IK4Y62sJYRWZXnrfDXWnceji3ItWT2uQvI/edit?tab=t.0'],['taste grid',GS+'1PuSOuID2z8sV8h438NcyyxCei2oMU3b9kX9R8YTptHE/edit?gid=1323970639#gid=1323970639'],['Favorite Song',GD+'1ToR3iqNRQ0MohxlYQ8MXd55wW-RzQWW-5W9_rylxXHg/edit?tab=t.0']]),
r('2026-08-28','Aug 28','101','grammar','class','Do Now',[],[['Do Now',GD+'1x1iwQ8L0Uve6ADeiAlIDHvOS96XbWHwK11WS-P4Ilro/edit?tab=t.0']]),

/* ---------- Week of Aug 31 ---------- */
r('2026-08-31','Aug 31','both','reading','class','Sub day: Binti reading (101); Grades during Junior Year & Impressions (103)',[],
  [['Binti',GD+'1ZTQ7wflsPS1gs2F7Nv57v9PIS3oR5wFavVATJpt_4ZM/edit?tab=t.0'],['103 sub activity',GD+'13GILvLTur_p0T8ICWZaDKTIQFSZYTXgffSqvPsqBNHs/edit?tab=t.0']]),
r('2026-09-01','Sept 1','101','words','class','Language Launch Day 1 (numbers); Favorite Things read aloud and record; weather',[],
  [['LL Day 1 Do Now',GD+'1IfNR9MAjb86RSUHU-s34fgEh0ah4xtXS-APo1hgx6QI/edit?tab=t.0'],['Do Now',GD+'1Dk4JxgKnOBc6MpeXw9Zb5izfbZd58wmKzAQmlXdNcWI/edit?tab=t.0']],'pp. 38–47'),
r('2026-09-01','Sept 1','103','speaking','class','Smell words; Where I\u2019m From videos (voice, tone, style); read aloud, record, present',[],
  [['smell words',GD+'1SwhfaVccDfjih_OpW6ls0jTqc3PJ-M3qskhCXYvBPOo/edit?tab=t.0'],['poem videos',GD+'1ITAOfXLPN7JBd3L0YOk1GCzn48gaIXeV-amuwGtbmn0/edit?tab=t.0']]),
r('2026-09-03','Sept 3','101','words','class','Action verbs slides and word search; house and food worksheets; pronouns for one student',[],
  [['action verbs',GP+'1N33fI09A3xAdF6vOUw9RMo0txGBOnF0VCL9m4t4NXbA/edit'],['worksheets folder','https://drive.google.com/drive/folders/1aUfWjGiBbJxCS8I0RtJEeuIS0Gqo9aLn']]),
r('2026-09-03','Sept 3','103','reading','class','Finish Quill; Phenomenal Woman (character traits, figurative language)',[['Phenomenal Woman',R+'songs/phenomenal-woman/']]),
r('2026-09-04','Sept 4','101','assessment','class','Action verbs from memory, then reference sheets back (quick check)',[],[['Do Now',GD+'16HJBB5nWdAgke5I35Tu3Wi3XoIAbR7-84T9ZagjbUOE/edit?tab=t.0']]),
r('2026-09-04','Sept 4','103','grammar','class','Fix capital letters',[],[['capitals',GD+'1zg5VhHFRFiLMKEQXZSY5Vfr40YcQCPBaPq66JcpxpL4/edit?tab=t.0']]),

/* ---------- Week of Sept 7 ---------- */
r('2026-09-08','Sept 8','103','writing','class','Review teacher comments and fix errors'),
r('2026-09-09','Sept 9–10','101','assessment','class','STAR Reading testing',[],[['instructions, translated',GS+'1Jna7PqAXakK-qhvI8QKWA3HDlxUJuAb7st35hfZ3vIU/edit?gid=1398175066#gid=1398175066']],'','2026-09-10'),
r('2026-09-09','Sept 9–11','both','grammar','site','The two Quill-style grammar tools bridged into the site: Sentence Lab and Anytime Lessons',
  [['Sentence Lab','https://github.com/tobiasrugger/sentence-lab'],['Anytime Lessons','https://github.com/tobiasrugger/anytime']],[],'','2026-09-11'),
r('2026-09-10','Sept 10','103','reading','class','Stand By Me film; The Body (Stephen King)',[['site',R+'stand-by-me/']],
  [['Do Now',GD+'1t8bHLg2BLQve7Xfx9ZJM-xXjz_xwYV6bgMWSgx7yBBo/edit?tab=t.0'],['The Body',GD+'1jMhePmMb8kfS-hTu6NVlMnZJmREzNkFQFFzZHA2lU9I/edit?tab=t.0']]),
r('2026-09-11','Sept 11','both','reading','class','9/11 Do Now and reading; Zombie song analysis',[['sept11',R+'sept11/']],
  [['101 Do Now',GD+'19QGq_rfdntweWhVA5838RGj-jSJbjYplTwakB3PLoW4/edit?tab=t.0'],['103 Do Now',GD+'1DMZD1Qlp6yv5m4Bkub__25eSL__hQr62iusROl_6clE/edit?tab=t.0'],['Zombie questions',GD+'1Pz1RPRZouxoLESyaum7C2PPza5a7EJx7WVf4JCuy6yA/edit?tab=t.0']]),
r('2026-09-11','Sept 11','103','reading','site','9/11 reading guide (two levels) — the first page in the repo',[['sept11',R+'sept11/'],['easy',R+'sept11-easy/']]),
r('2026-09-11','Sept 11','both','reading','site','First song page: Zombie',[['songs/zombie',R+'songs/zombie/']]),
r('2026-09-13','Sept 13','103','reading','site','Literature units moved in: Romeo and Juliet, The Odyssey, Farewell to Manzanar, Maus, Seedfolks, Human Rights/UDHR, MLK, Oral Histories, This Is How We Do It, Thoughts',
  [['romeo-juliet',R+'romeo-juliet/'],['odyssey',R+'odyssey/'],['manzanar',R+'manzanar/'],['maus',R+'maus/'],['seedfolks',R+'seedfolks/'],['human-rights',R+'human-rights/'],['mlk',R+'mlk/'],['oral-histories',R+'oral-histories/'],['this-is-how',R+'this-is-how/']]),
r('2026-09-13','Sept 13','101','reading','site','Newcomer units: The Arrival, Survival English, Fables, The Grasshopper and the Ant, Holidays, first vocab sets (colors, foods, animals, drinks, sports, school subjects)',
  [['arrival',R+'arrival/'],['survival-english',R+'survival-english/'],['fables',R+'fables/'],['grasshopper-ant',R+'grasshopper-ant/'],['holidays',R+'holidays/'],['vocab/colors',R+'vocab/colors/']]),

/* ---------- Week of Sept 14 ---------- */
r('2026-09-14','Sept 14–18','101','grammar','class','Capital letters packet; weekend plans board games; Quill continues',[],
  [['capitals rev.pdf','https://drive.google.com/file/d/1rp2HCzvVgsKgfaDz4eeqdzX3pDdncNkh/view?usp=sharing'],['weekend board games','https://drive.google.com/file/d/1hayWkIsOco8gJMOJTBnV3XjCWgI7IT4E/view?usp=drive_link'],['weekend chat','https://drive.google.com/file/d/1A3-mQufBylBYM5nR8T0X8HQoie1U3aiD/view?usp=drive_link']],'','2026-09-18'),
r('2026-09-14','Sept 14','103','reading','site','Psychology (six readings), Toolkits, Résumé, Stand By Me, Gratitude + gratitude letters, Thank You Ma\u2019am vocab, songs (Ave Cesaria, Phenomenal Woman, Stromae)',
  [['psychology',R+'psychology/'],['toolkits',R+'toolkits/'],['resume',R+'resume/'],['stand-by-me',R+'stand-by-me/'],['gratitude',R+'gratitude/'],['tyma-vocab',R+'tyma-vocab/'],['songs',R+'songs/']]),
r('2026-09-14','Sept 14','101','writing','site','Favorites, Favorite Songs class mixtape, first This Week\u2019s Reading (news)',
  [['favorites',R+'favorites/'],['favorite-songs',R+'favorite-songs/'],['news',R+'news/']]),
r('2026-09-15','Sept 15','103','writing','class','ELD 103 site, Do Now',[['eld103',R+'eld103/']]),
r('2026-09-15','Sept 15','both','tools','site','track.js on every page; first combined dashboard'),
r('2026-09-16','Sept 16','101','assessment','site','Language Launch Units 1–2 word pre-test',[['vocab/pretest-ll12',R+'vocab/pretest-ll12/']]),
r('2026-09-18','Sept 18','103','writing','site','ELD 103 Chapter 3',[['eld103',R+'eld103/']]),
r('2026-09-18','Sept 18','both','grammar','site','Do Nows begin',[['donow',R+'donow/']]),
r('2026-09-18','Sept 18','101','reading','site','Very Easy True Stories (VETS)',[['easy-true',R+'easy-true/']]),

/* ---------- Week of Sept 21 ---------- */
r('2026-09-21','Sept 21','both','grammar','class','Sub day, Quill lessons',[],[['sub plan',GD+'1TQLkyfv1K1h1drolQ1cLFJpWgMxIqLsb5oHXDS6d2mQ/edit?usp=sharing']]),
r('2026-09-22','Sept 22','101','words','class','Past-tense weekend; action verbs whiteboard teams; \u201cDo you like\u2026?\u201d lines; classroom objects; vocab pre-tests',[['vocab/pre',R+'vocab/pre/']],
  [['action verbs',GP+'1LApCjUALMaRJD_RNHwQbU-jAoy71LZCOBMywZWWhwGo/edit'],['do you like lines',GP+'1j0apJnGqEiZ-yCXq30A45qTNsCuHuy-Hbk_r8bYMMfU/edit'],['classroom objects',GP+'1srzhrGw8oUZlJRF6JkROOhiKm_E9Aq1oybGaqqn2myc/edit']]),
r('2026-09-22','Sept 22','103','grammar','class','Articles and prepositions reference',[],[['reference sheet',GD+'12q0fAfMytVeZ3EVeTtgyG80aroMf-uEmDiQDb6Ynuhs/edit?tab=t.0']]),
r('2026-09-22','Sept 22','101','grammar','site','Verbs: present + past pages, five verb vocab sets',[['verbs/present',R+'verbs/present/'],['verbs/past',R+'verbs/past/']]),
r('2026-09-22','Sept 22','101','words','site','Word checks (pre/post for topics)',[['vocab/pre',R+'vocab/pre/']]),
r('2026-09-22','Sept 22','both','tools','site','Fluency Tracker, grammar pool, teacher class data, first audit',[['fluency',R+'fluency/'],['grammar',R+'grammar/']]),
r('2026-09-23','Sept 23–24','101','words','class','Traits pre-quiz, Describing Self handout, partner interviews',[['traits quiz',R+'vocab/pre/traits/']],
  [['Describing People',GD+'1eL_GxiHgP1nYYT3P9N0jwXGQj9FkPmMe8Vu26YnQJOw/edit?tab=t.0']],'','2026-09-24'),
r('2026-09-24','Sept 24–28','103','reading','class','News articles (phones, food, AI, World Cup) + Quill',[['news',R+'news/']],[],'','2026-09-28'),
r('2026-09-24','Sept 24','103','reading','site','The Four Agreements',[['four-agreements',R+'four-agreements/']]),
r('2026-09-25','Sept 25','103','reading','site','Monsters',[['monsters',R+'monsters/']]),
r('2026-09-25','Sept 25','101','reading','site','Story Reel Episode 1 \u201cThe New Student\u201d',[['reel/ep01',R+'reel/ep01/']]),
r('2026-09-25','Sept 25','101','words','site','Describing people: how I look, traits, strengths, My Words',[['vocab/how-i-look',R+'vocab/how-i-look/'],['vocab/traits-1',R+'vocab/traits-1/'],['vocab/mywords',R+'vocab/mywords/']]),
r('2026-09-25','Sept 25–27','101','reading','site','Phonics: six lessons (C and G, Magic E, digraphs, bossy R, vowel teams, heart words)',[['phonics/c-and-g',R+'phonics/c-and-g/'],['phonics/magic-e',R+'phonics/magic-e/']],[],'','2026-09-27'),
r('2026-09-27','Sept 27','103','reading','site','The Landlady and Omelas reading guides, easier + harder',[['landlady',R+'landlady/'],['omelas',R+'omelas/']]),
r('2026-09-27','Sept 27','101','reading','site','Do Now: The Dog at the Bus Stop',[['donow/dog-01',R+'donow/dog-01/']]),

/* ---------- Week of Sept 28 ---------- */
r('2026-09-28','Sept 28–30','101','writing','class','Listen and Write; Venn diagrams; Toolkit #3 compare and contrast',[],
  [['Describing then Comparing folder','https://drive.google.com/drive/folders/1z5_ExhX_GkyWM3pVLFpJS5_RWkiutB0C?usp=drive_link'],['Venn',GD+'1G0MB2zs8-FN8igSjmbagx351QDGKnQOkITsRtwjUCt4/edit?tab=t.0'],['Toolkit #3',GD+'1Q3pQcU9E4bsLULav4pK96AZAvI-lJ8qQklWvRPPhaWQ/edit?tab=t.0']],'','2026-09-30'),
r('2026-09-28','Sept 28','101','speaking','site','Speaking: meet and greet, spell your name, describe a classmate, mine, want at school',[['speaking',R+'speaking/'],['speaking/meet-and-greet',R+'speaking/meet-and-greet/']]),
r('2026-09-28','Sept 28','both','assessment','site','Grammar diagnostics',[['diagnostic',R+'diagnostic/']]),
r('2026-10-01','Oct 1','101','speaking','class','Compare yourself with a video game character'),
r('2026-10-01','Oct 1','103','writing','site','ELD 103 Unit 1 (paragraphs and sentences, Introducing People)',[['eld103/unit1',R+'eld103/unit1/']]),
r('2026-10-02','Oct 2','101','grammar','class','To have vs. to be Do Now',[],[['Do Now',GD+'1jNAjA55h4Manv0HFt71e33k-3DxJ7NW_F5kGyJ-SMZ8/edit?tab=t.0'],['grid',GS+'1qHoetJqn9fQmArJfZZiudxcWIa7jVCXO-wDyMYRjs8M/edit?gid=1323970639#gid=1323970639']]),
r('2026-10-02','Oct 2','103','writing','class','Do Now + Respect poem',[],[['Do Now',GD+'18CrycoKDoxaWHRIEyY3MTdnjQNT7LwWMp4B0L-QBFzI/edit?tab=t.0']]),
r('2026-10-02','Oct 2','both','writing','site','Describing people + compare and contrast (Drive materials)',[],[['Drive folder','https://drive.google.com/drive/folders/1OLad221wnyW7ombttPQJoUKc4jsD-ysx?usp=drive_link']]),
r('2026-10-02','Oct 2','both','writing','site','Respect reflection (home language for 101, English for 103)',[['eld101/respect',R+'eld101/respect/'],['eld103/respect',R+'eld103/respect/']]),
r('2026-10-02','Oct 2','101','reading','site','Describe a Classmate; VETS Story 01 with seven practice modules',[['describe',R+'describe/'],['easy-true/01',R+'easy-true/01/']]),
r('2026-10-02','Oct 2','both','tools','site','Build roadmap (pw galileo2026)',[['roadmap',R+'roadmap/']]),

/* ---------- Week of Oct 5 ---------- */
r('2026-10-05','Oct 5','101','speaking','class','Weekend board game; Respect, rules',[['weekend',R+'launch-plus/weekend/']]),
r('2026-10-07','Oct 7','101','grammar','site','Pronouns with Toolkit drawings (I said \u201ceye\u201d)',[['pronouns',R+'pronouns/']]),
r('2026-10-08','Oct 8','101','reading','site','Launch Plus L1 People at School + L2 Introductions',[['u1-l1',R+'launch-plus/u1-l1/'],['u1-l2',R+'launch-plus/u1-l2/']],[],'L1 pp. 6–9, 64–67 · L2 pp. 16–21'),
r('2026-10-08','Oct 8','101','speaking','site','Say recorder, embedded in lessons',[['say',R+'say/']]),
r('2026-10-08','Oct 8','101','reading','site','VETS Stories 02–06',[['easy-true',R+'easy-true/']]),
r('2026-10-08','Oct 8','103','words','site','Omelas Words + four practice sets; Creativity',[['vocab/omelas-1',R+'vocab/omelas-1/'],['creativity',R+'creativity/']]),
r('2026-10-08','Oct 8','both','tools','site','Gradebook (0–4, Synergy export) (pw galileo2026)',[['gradebook',R+'gradebook/']]),
r('2026-10-09','Oct 9','101','reading','site','Alphabet; Indigenous Peoples\u2019 Day (101 version)',[['alphabet',R+'alphabet/'],['indigenous101',R+'indigenous101/']]),
r('2026-10-09','Oct 9','103','words','site','Indigenous Peoples\u2019 Day (103); Landlady Words + four practice sets',[['indigenous',R+'indigenous/'],['vocab/landlady-1',R+'vocab/landlady-1/']]),

/* ---------- Week of Oct 12 ---------- */
r('2026-10-13','Oct 13','103','reading','class','Sub day: Newsela Columbus / Indigenous Peoples\u2019 Day, news, Landlady',[['Newsela','https://app.newsela.com/view/ck9noohdx04vt0iqjxswroxli/?selectedAssignmentId=cmv179yls000823oivjpl0wli']]),
r('2026-10-14','Oct 14–19','101','grammar','class','Daily Classroom list: Reel Ep 1, Launch Plus L1, Indigenous Peoples\u2019 Day, pronouns, Quill, verbs, VETS',[['Quill unit','https://www.quill.org/classrooms/2140881?unit_id=5090315']],[],'','2026-10-19'),
r('2026-10-14','Oct 14','101','reading','site','Launch Plus L3 From A to Z + Extras for L1 and L3',[['u1-l3',R+'launch-plus/u1-l3/'],['u1-l1x',R+'launch-plus/u1-l1x/'],['u1-l3x',R+'launch-plus/u1-l3x/']],[],'L3 pp. 30–33'),
r('2026-10-14','Oct 14','101','writing','site','Topic Sentences; Daily Basics; Revise ladder',[['topic-sentence',R+'topic-sentence/'],['basics',R+'basics/'],['revise',R+'revise/']]),
r('2026-10-14','Oct 14','101','reading','site','Reel v2 (Ep 1 fixes); verb drill engine',[['reel-v2/ep01',R+'reel-v2/ep01/'],['verbs/drill',R+'verbs/drill/']]),
r('2026-10-15','Oct 15','both','words','site','Sentence Work (WIT); Shades of Meaning; Tricky Words; False Friends; Enjoy the Silence',[['wit',R+'wit/'],['shades',R+'shades/'],['exceptions',R+'exceptions/'],['false-friends',R+'false-friends/'],['songs/enjoy-the-silence',R+'songs/enjoy-the-silence/']]),
r('2026-10-16','Oct 16','103','reading','class','Landlady + words, Enjoy the Silence, neighbors article, Respect poem',[['news?a=neighbors',R+'news/?a=neighbors']]),
r('2026-10-16','Oct 16','101','speaking','site','Find Someone Who (mingle); Reel Ep 2',[['launch-plus/find',R+'launch-plus/find/'],['reel-v2/ep02',R+'reel-v2/ep02/']]),
r('2026-10-16','Oct 16','103','writing','site','Writing Ladder: The Landlady',[['write/landlady',R+'write/landlady/']]),
r('2026-10-17','Oct 17','101','reading','site','Launch Plus L4 0 to 100; getting-to-school book; lessons redesigned with cast, lion, whiteboard Fix',[['u1-l4',R+'launch-plus/u1-l4/'],['launch-plus/book',R+'launch-plus/book/']],[],'L4 pp. 38–41'),
r('2026-10-17','Oct 17','103','words','site','Landlady deep words',[['vocab/landlady-deep',R+'vocab/landlady-deep/']]),
r('2026-10-18','Oct 18','103','reading','site','The Tell-Tale Heart + words + ladder',[['telltale',R+'telltale/'],['write/telltale',R+'write/telltale/']]),

/* ---------- Week of Oct 19 ---------- */
r('2026-10-19','Oct 19','103','reading','site','The Monkey\u2019s Paw + words + ladder',[['monkeyspaw',R+'monkeyspaw/'],['write/monkeyspaw',R+'write/monkeyspaw/']]),
r('2026-10-19','Oct 19','101','reading','site','Brothers in Arms (8 chapters, Thi Bui pictures); Weekend helper',[['brothers-in-arms',R+'brothers-in-arms/'],['launch-plus/weekend',R+'launch-plus/weekend/']]),
r('2026-10-19','Oct 19','both','tools','site','My Page, Push an activity, class report, Group grades',[['student',R+'student/'],['assign (pw galileo2026)',R+'assign/'],['groups (pw galileo2026)',R+'groups/']]),
r('2026-10-20','Oct 20','both','speaking','class','Find Someone Who: digital (101), question writing + paper (103)',[],
  [['Do Now',GD+'1Y-Vh4_4UeUtSi1BSNB6AT1ZCqWR1_na2cDfEdbNHZ24/edit?tab=t.0'],['paper PDF','https://drive.google.com/file/d/17XOdg-Bo60fYMSoaeziGbdeizsyjtwQM/view?usp=drive_link']]),
r('2026-10-20','Oct 20','103','speaking','site','Question Practice',[['questions',R+'questions/']]),
r('2026-10-21','Oct 21–30','101','assessment','class','One-on-one read-alouds of Reel 2, levels A/B/C set per student',[],[['Period 1 notes',GD+'1IBQm8EpPqPjQQ7SgsEqO8RssW9TCRXawNz__Nu4Uh3w/edit?tab=t.0']],'','2026-10-30'),
r('2026-10-22','Oct 22–30','103','reading','class','Landlady: read, learn the words, tell the story back (due Oct 29–30)',[['landlady',R+'landlady/']],[],'','2026-10-30'),
r('2026-10-22','Oct 22','101','reading','site','Launch Plus L5; Basics paper/board maker; group slides maker',[['u1-l5',R+'launch-plus/u1-l5/'],['basics/print',R+'basics/print/'],['group maker',R+'group/maker.html']],[],'L5 pp. 48–55'),
r('2026-10-22','Oct 22','103','speaking','site','Question Builder; Landlady: Investigate the tea',[['question-builder',R+'question-builder/'],['landlady/investigate',R+'landlady/investigate/']]),
r('2026-10-22','Oct 22','both','tools','site','Dashboards front door (pw galileo2026)',[['dashboards',R+'dashboards/']]),
r('2026-10-23','Oct 23–30','both','reading','class','Holidays + Monsters; Halloween word search, monster drawings, Samhain Nearpods',[],
  [['Halloween folder','https://drive.google.com/drive/folders/1ZF3PsMsfp-o4sncVRFL6Q1xgkTxyM3qV'],['activities','https://drive.google.com/drive/folders/1LOD8TNel3WLhq64Y8SFSTEG4Ihinxwpe?usp=drive_link'],['monster drawings','https://drive.google.com/drive/folders/17xluagbWhc3X5rHCl7lmb41Id18Kdf1o']],'','2026-10-30'),

/* ---------- Week of Oct 26 ---------- */
r('2026-10-26','Oct 26','both','tools','site','The Atlas (pw galileo2026)',[['atlas',R+'atlas/']]),
r('2026-10-27','Oct 27','both','tools','site','Teacher\u2019s Desk (piles per period); Skill Map; Read-aloud Check (all pw galileo2026)',[['desk',R+'desk/dashboard.html'],['skills',R+'skills/dashboard.html'],['checks',R+'checks/dashboard.html']]),
r('2026-10-27','Oct 27','101','assessment','site','Ep 2 Story Check; Teach Mr. Toby',[['reel-test/ep02',R+'reel-test/ep02/'],['teachme',R+'teachme/']]),
r('2026-10-28','Oct 28','both','tools','site','Load-before-save on 100+ pages (saveguard), robot save test of 166 pages, safety trigger on 85 tables, Quiz Mr. Toby (behind the scenes)'),

/* ---------- Week of Nov 2 ---------- */
r('2026-11-02','Nov 2','103','assessment','site','Landlady test (44 points) + practice test with hints + teacher preview (pw galileo2026)',[['landlady/test',R+'landlady/test/'],['practice',R+'landlady/test/?practice=1'],['preview',R+'landlady/test/preview.html']]),
r('2026-11-02','Nov 2','103','reading','site','Read it together (one Chromebook per table) + paper story',[['landlady/table',R+'landlady/table/'],['handout',R+'landlady/table/handout.html']]),
r('2026-11-02','Nov 2','103','words','site','Landlady Table Word Game + 12 words solo',[['wordgame/landlady',R+'wordgame/landlady/'],['solo',R+'wordgame/landlady/solo/']]),
r('2026-11-02','Nov 2','101','words','site','Weekend Word Game (2–5 players, past tense)',[['weekend/game.html',R+'launch-plus/weekend/game.html']]),
r('2026-11-02','Nov 2','103','writing','site','Who Answers Whom? Homelessness (op-ed + letters)',[['voices/homelessness',R+'voices/homelessness/']]),
r('2026-11-02','Nov 2','103','writing','site','Dear Lion advice letters (levels A/B/C)',[['advice',R+'advice/'],['advice/kitchen',R+'advice/kitchen/']]),
r('2026-11-02','Nov 2','103','reading','site','News story sets (\u201cSmall Animals, Big Surprises\u201d) + Find It',[['news',R+'news/']]),
r('2026-11-02','Nov 2','both','tools','site','Push catalog split per folder; Shelves (Lab / Trying / Ready) (pw galileo2026)',[['assign',R+'assign/'],['shelves',R+'shelves/']])
];

/* Weeks: Monday of each school week, with the doc's own words for what the week was about. */
var weeks=[
 ['2026-08-17','Assessments and Quill diagnostics'],
 ['2026-08-24','Favorite Things and Where I\u2019m From'],
 ['2026-08-31','First book pages, action verbs, presentations'],
 ['2026-09-07','STAR testing, Stand By Me, 9/11 \u2014 and the move-in begins'],
 ['2026-09-14','Moving in, tracking, and the Units 1\u20132 pre-test'],
 ['2026-09-21','Verbs, fluency, phonics, the first Reel, The Landlady'],
 ['2026-09-28','Speaking, diagnostics, respect, describing, true stories'],
 ['2026-10-05','Launch Plus begins, gradebook, Say'],
 ['2026-10-12','Paragraphs, Extras, the 103 story set'],
 ['2026-10-19','Questions, My Page, one front door'],
 ['2026-10-26','The Atlas, Desk, skills, checks, saving safely'],
 ['2026-11-02','Testing The Landlady, new voices for ELD 103']
];
var months={
 '2026-08':'The year opened Aug 17 with writing assessments and Quill ELL diagnostics, then two identity projects: My Favorite Things posters in ELD 101 and the Where I\u2019m From poem in ELD 103.',
 '2026-09':'September\u2019s job was getting every unit onto one site and putting tracking on all of it (track.js went on every page Sept 15). Many units moved in on Sept 13\u201314 were written earlier and are listed by move-in date.',
 '2026-10':'October turned separate pages into a system: every page signs in the same way, saves to Supabase, scores 0\u20134, and shows up on the student\u2019s own page and your dashboards.',
 '2026-11':'Nov 2 was the busiest single day of the year: a full Landlady assessment kit plus three new ELD 103 formats.'
};

/* Scope & sequence by strand. Cells use [label](url) for links. */
var scope={
 '101':[
  ['Sounds + letters','reading','[Phonics]('+R+'phonics/c-and-g/) six lessons','[Alphabet]('+R+'alphabet/), spell your name in [u1-l3]('+R+'launch-plus/u1-l3/)','\u2014'],
  ['Words','words','Topic sets ([colors]('+R+'vocab/colors/), foods\u2026), [pre-test]('+R+'vocab/pretest-ll12/), [word checks]('+R+'vocab/pre/)','[Shades]('+R+'shades/), [Tricky Words]('+R+'exceptions/), [Teach Mr. Toby]('+R+'teachme/)','[Weekend Word Game]('+R+'launch-plus/weekend/game.html)'],
  ['Grammar','grammar','[Verbs present/past]('+R+'verbs/present/), [grammar pool]('+R+'grammar/)','[Pronouns]('+R+'pronouns/), [Daily Basics]('+R+'basics/) (am/is/are, he/she/they, has/have), [verb drills]('+R+'verbs/drill/)','past tense in the Weekend game'],
  ['Book lessons (Launch Plus)','reading','\u2014','[L1]('+R+'launch-plus/u1-l1/) \u2192 [L2]('+R+'launch-plus/u1-l2/) \u2192 [L3]('+R+'launch-plus/u1-l3/) \u2192 [L4]('+R+'launch-plus/u1-l4/) \u2192 [L5]('+R+'launch-plus/u1-l5/) + Extras','Unit 1 continues'],
  ['Reading + stories','reading','[Arrival]('+R+'arrival/), [Fables]('+R+'fables/), [VETS]('+R+'easy-true/), [Reel Ep 1]('+R+'reel/ep01/)','[Reel Ep 2]('+R+'reel-v2/ep02/) + [Story Check]('+R+'reel-test/ep02/), [Brothers in Arms]('+R+'brothers-in-arms/), [Holidays]('+R+'holidays/)','\u2014'],
  ['Writing','writing','[Favorites]('+R+'favorites/)','[Topic Sentences]('+R+'topic-sentence/), [Revise]('+R+'revise/), [WIT]('+R+'wit/), Write step in each lesson','\u2014'],
  ['Speaking + listening','speaking','[Speaking interviews]('+R+'speaking/), [Describe a Classmate]('+R+'describe/)','[Say]('+R+'say/), [Find Someone Who]('+R+'launch-plus/find/), [Weekend]('+R+'launch-plus/weekend/)','\u2014']
 ],
 '103':[
  ['Literature','reading','Moved in: [Romeo and Juliet]('+R+'romeo-juliet/), [Manzanar]('+R+'manzanar/), [Maus]('+R+'maus/), [Seedfolks]('+R+'seedfolks/); new [Landlady]('+R+'landlady/) + [Omelas]('+R+'omelas/)','Spooky trio: [Landlady]('+R+'landlady/) \u2192 [Tell-Tale Heart]('+R+'telltale/) \u2192 [Monkey\u2019s Paw]('+R+'monkeyspaw/), [Investigate]('+R+'landlady/investigate/)','[Landlady test]('+R+'landlady/test/), [Read it together]('+R+'landlady/table/)'],
  ['Vocabulary','words','[Thank You Ma\u2019am words]('+R+'tyma-vocab/)','12-word sets per story ([landlady-1]('+R+'vocab/landlady-1/), [omelas-1]('+R+'vocab/omelas-1/), [telltale-1]('+R+'vocab/telltale-1/)), [False Friends]('+R+'false-friends/)','[Table Word Game]('+R+'wordgame/landlady/), [solo]('+R+'wordgame/landlady/solo/)'],
  ['Writing','writing','[ELD 103 Ch 3]('+R+'eld103/), [R\u00e9sum\u00e9]('+R+'resume/)','[Unit 1 paragraphs]('+R+'eld103/unit1/), Writing Ladders ([Landlady]('+R+'write/landlady/), [Tell-Tale]('+R+'write/telltale/), [Monkey\u2019s Paw]('+R+'write/monkeyspaw/))','Letter to the editor in [voices]('+R+'voices/homelessness/), advice in [Dear Lion]('+R+'advice/)'],
  ['Nonfiction + news','reading','[9/11]('+R+'sept11/), [Psychology]('+R+'psychology/), [This Week\u2019s Reading]('+R+'news/), [Four Agreements]('+R+'four-agreements/)','[Indigenous Peoples\u2019 Day]('+R+'indigenous/), [Creativity]('+R+'creativity/)','News story sets + Find It, [Who Answers Whom?]('+R+'voices/homelessness/)'],
  ['Questions + talk','speaking','[Stand By Me]('+R+'stand-by-me/) agree/disagree','[Question Practice]('+R+'questions/), [Question Builder]('+R+'question-builder/)','Class wall votes in [Dear Lion]('+R+'advice/)']
 ],
 both:'[Fluency Tracker]('+R+'fluency/), [Do Nows]('+R+'donow/), [songs]('+R+'songs/), [Respect reflection]('+R+'eld101/respect/), and each student\u2019s [My Page]('+R+'student/).'
};

var augustPlan={
 '101':'Unit 1 Identity & Others (favorites, weather, days, months, cardinal and ordinal numbers, book pp. 38\u201347), then describing self and others, the alphabet and school words in September, then book Unit 2 strengths, habits, clothes and past tense, Unit 4 maps, Unit 6 cultures and holidays, then Fables and The Arrival.',
 '103':'Where I\u2019m From, comparing self to others in paragraphs, creepy short stories near Halloween, The Gift of the Magi near Christmas, and ELPAC practice.',
 source:['Running ELD 101 and ELD 103 Running Lessons 2026-2027',GD+'1O0WCSLWmMQbBFOcaQI_A8lzhLHRKmp1PZBm3Jhx5fCI/edit?tab=t.0'],
 donows:['Do Nows Hub',GD+'1oXK86GNdOpv7FX8zPbIWDWGJaHZvVrg8_50HdrVNkCM/edit?tab=t.0'],
 quill:['Quill class','https://www.quill.org/classrooms/2140881?unit_id=5090315']
};

var workflow=[
 'Idea or source: a book lesson (Language Launch PDF), a story, a news piece, or a paper activity you already run.',
 'Claim a task number (T-nnn) in the ledger before building.',
 'Build on the shared parts: sign-in gate with language, tap-to-translate, \ud83d\udd0a on every word and sentence, drawn pictures, real borders.',
 'Save safely: load saved work first (saveguard), autosave every 20 s, robot save test.',
 'Score: GAL_SCORE / GAL_MAX \u2192 0\u20134 in the [gradebook]('+R+'gradebook/) (pw galileo2026).',
 'List it everywhere: hub card, Push catalog (assign/catalog/<folder>.js), dashboard line in dashboards/list.js, say/sets.js if it records.',
 'Ship one zip; you push; the chat verifies live and closes the T.',
 'Use it in class: push it from [assign]('+R+'assign/) \u2192 students see it on [My Page]('+R+'student/) \u2192 you read the [Desk]('+R+'desk/dashboard.html) \u2192 it moves Lab \u2192 Trying \u2192 Ready on the [Shelves]('+R+'shelves/); a batch of change notes goes into the [Atlas]('+R+'atlas/) every couple of weeks.'
];

var doors=[
 ['Push an activity','Before class: send a page to a period',R+'assign/'],
 ['Teacher\u2019s Desk','During or after: who\u2019s done, who isn\u2019t',R+'desk/dashboard.html'],
 ['Gradebook','Grading day, Synergy',R+'gradebook/'],
 ['Group grades','Walking the tables',R+'groups/'],
 ['Skill Map','Who needs what skill',R+'skills/dashboard.html'],
 ['Launch Plus dashboard','ELD 101 lessons',R+'launch-plus/dashboard.html'],
 ['The Atlas','Remembering what exists',R+'atlas/'],
 ['Shelves','Urgent day: open only Ready',R+'shelves/'],
 ['Year calendar','This page \u2014 the year so far',R+'year/']
];

/* fill in week (Monday) and a stable id */
function monday(iso){var d=new Date(iso+'T12:00:00Z');var w=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-w);return d.toISOString().slice(0,10);}
rows.forEach(function(x,i){ x.week = x.kind==='pre' ? 'pre' : monday(x.date); x.id='r'+i; });

window.YEAR={start:'2026-08-17',rows:rows,weeks:weeks,months:months,scope:scope,augustPlan:augustPlan,workflow:workflow,doors:doors,
  source:['Galileo ELD \u2014 Year So Far (Claude Doc)','https://claude.ai/artifact/5MYycEAC1P9reDLBAtqd8K']};
})();
