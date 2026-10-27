/* list.js — the registry behind readings/dashboards/.
 *
 * ONE line per teacher page. A page missing from here is unfinished, the same
 * way a student page with no score is unfinished. Any chat that builds, moves
 * or renames a teacher page edits this file in the SAME zip.
 *
 *   url     path from the repo root
 *   name    what it is, in Toby's words — not the <title>
 *   course  '101' | '103' | 'both'
 *   group   what kind of page: Reading, Vocabulary, Speaking, Writing,
 *           Grammar, Unit, Data
 *   note    optional one line: what it is good for
 */
window.DASHBOARDS = [

/* ---------- Data: the pages that answer "how is everyone doing?" ---------- */
{url:'atlas/',                  name:'The Atlas \u2014 everything we\u2019ve built', course:'both', group:'Data', note:'Every page, maker and engine on one spiral. Tap one to peel its layers: sign-in, pictures, listening, translation, saving, score, My Page, dashboard \u2014 and read what changed.'},
{url:'gradebook/',              name:'Gradebook — all scores',       course:'both', group:'Data', note:'Every student, every activity, 0\u20134. Synergy export lives here.'},
{url:'desk/dashboard.html',      name:'Teacher\u2019s Desk \u2014 piles of paper', course:'both', group:'Data', note:'One desk per period: every assignment with its not-finished and done piles; tap a sheet to read that student\u2019s work. Gradebook underneath: \ud83d\udcca per activity, tap a score to jump to that student on its dashboard, \u2691 stuck, and blue extra work for chosen students.'},
{url:'groups/',                 name:'Group grades',                 course:'both', group:'Data', note:'Seat tables, then tap a table and a 0\u20134 while you walk around.'},
{url:'teacher/',                name:'Class data',                   course:'both', group:'Data', note:'Skill bars and activity history per student.'},
{url:'reports/',                name:'Class report',                 course:'both', group:'Data'},
{url:'assign/',                 name:'Push an activity',             course:'both', group:'Data', note:'Send one activity to a period or a student.'},
{url:'roadmap/',                name:'Build roadmap',                course:'both', group:'Data', note:'What is built, in progress, still to do.'},
{url:'audit/',                  name:'Feature audit',                course:'both', group:'Data', note:'Which pages meet the student-page standard.'},
{url:'audit/check.html',        name:'Conformance checker',          course:'both', group:'Data', note:'Re-checks every page live and shows what drifted since the saved grid.'},
{url:'teacher/mywords.html',    name:'My Words',                     course:'both', group:'Data', note:'The words each student chose to keep.'},
{url:'diagnostic/report.html',  name:'Grammar checks report',        course:'both', group:'Data'},

/* ---------- Reading ---------- */
{url:'news/dashboard.html',             name:'This Week\u2019s Reading',      course:'103', group:'Reading', note:'Weekly news article, per student and per question.'},
{url:'landlady/dashboard.html',         name:'The Landlady',                  course:'103', group:'Reading'},
{url:'landlady/investigate/dashboard.html', name:'The Landlady: Investigate the tea', course:'103', group:'Reading', note:'Optional detective game: which bottle, which poison, the case report.'},
{url:'telltale/dashboard.html',         name:'The Tell-Tale Heart',           course:'103', group:'Reading'},
{url:'monkeyspaw/dashboard.html',       name:'The Monkey\u2019s Paw',         course:'103', group:'Reading'},
{url:'omelas/dashboard.html',           name:'Omelas',                        course:'103', group:'Reading'},
{url:'sept11/dashboard.html',           name:'September 11',                  course:'103', group:'Reading'},
{url:'maus/dashboard.html',             name:'Maus',                          course:'103', group:'Reading'},
{url:'manzanar/dashboard.html',         name:'Farewell to Manzanar',          course:'103', group:'Reading'},
{url:'stand-by-me/dashboard.html',      name:'Stand By Me',                   course:'103', group:'Reading'},
{url:'odyssey/dashboard.html',          name:'The Odyssey',                   course:'103', group:'Reading'},
{url:'romeo-juliet/dashboard.html',     name:'Romeo and Juliet',              course:'103', group:'Reading'},
{url:'seedfolks/dashboard.html',        name:'Seedfolks',                     course:'both', group:'Reading'},
{url:'seedfolks/quiz-prep/dashboard.html', name:'Seedfolks: Quiz Practice 1 (group)', course:'101', group:'Reading', note:'Slides marked right, not-yet taps, repeats asked, words spelled aloud.'},
{url:'group/dashboard.html',            name:'Group Practice (every deck)',   course:'both', group:'Reading', note:'Every Group Practice deck and mix: score, misses, repeats asked.'},
{url:'group/maker.html',                name:'Group Practice \u2014 make or mix a deck', course:'both', group:'Reading', note:'Teacher tool: type words, sentences, pictures and questions; get a student link.'},
{url:'brothers-in-arms/dashboard.html', name:'Brothers in Arms',              course:'101', group:'Reading'},
{url:'easy-true/dashboard.html',        name:'Very Easy True Stories',        course:'101', group:'Reading', note:'All six stories and their seven modules.'},
{url:'arrival/dashboard.html',          name:'The Arrival',                   course:'101', group:'Reading'},
{url:'holidays/dashboard.html',         name:'Ghosts, Candy, and Remembering',course:'101', group:'Reading'},
{url:'monsters/dashboard.html',         name:'Monsters as Symbols',           course:'103', group:'Reading'},
{url:'four-agreements/dashboard.html',  name:'The Four Agreements',           course:'103', group:'Reading'},
{url:'psychology/dashboard.html',       name:'Who Am I? (psychology)',        course:'103', group:'Reading'},
{url:'creativity/dashboard.html',       name:'Open Mode (Cleese)',            course:'103', group:'Reading'},
{url:'fluency/dashboard.html',          name:'Fluency \u2014 read aloud',     course:'both', group:'Reading', note:'Words correct per minute, accuracy, and the recordings.'},

/* ---------- Vocabulary ---------- */
{url:'vocab/pre/dashboard.html',          name:'Vocabulary pre-assessments',  course:'101', group:'Vocabulary'},
{url:'vocab/pre/report.html',             name:'Vocabulary \u2014 class report', course:'101', group:'Vocabulary'},
{url:'vocab/pretest-ll12/dashboard.html', name:'Vocabulary pre-test (U1\u2013U2)', course:'101', group:'Vocabulary'},
{url:'false-friends/dashboard.html',        name:'False Friends',               course:'both', group:'Vocabulary'},

/* ---------- Speaking ---------- */
{url:'checks/dashboard.html',            name:'Read-aloud Check',              course:'both', group:'Speaking', note:'A student reads to you; tap the words they miss. Next check shows last time\u2019s misses. Most-missed words per period.'},
{url:'reel-test/ep02/dashboard.html',      name:'Story Check 2: The Backpack (read-aloud + test)', course:'101', group:'Speaking', note:'Practice and test versions of the Ep 2 check. Listen to every read-aloud and set 0\u20132 per sentence; set 0\u20134 on the extras; your numbers go to the gradebook.'},
{url:'say/dashboard/',                  name:'Say the Words',                 course:'101', group:'Speaking', note:'Every recording, by set.'},
{url:'describe/dashboard/',             name:'Describe a Classmate',          course:'101', group:'Speaking'},
{url:'oral-histories/dashboard.html',   name:'Oral Histories',                course:'103', group:'Speaking'},
{url:'oral-histories/teacher-guide.html',name:'Oral Histories \u2014 unit guide', course:'103', group:'Speaking', note:'How to run the unit, not student data.'},
{url:'favorite-songs/dashboard.html',   name:'Our Favorite Songs',            course:'101', group:'Speaking'},
{url:'songs/enjoy-the-silence/dashboard.html', name:'Enjoy the Silence',      course:'101', group:'Speaking'},

/* ---------- Writing ---------- */
{url:'write/dashboard.html',            name:'Writing Ladder',                course:'103', group:'Writing', note:'Every rung, every text.'},
{url:'eld103/dashboard.html',           name:'ELD 103 Writing',               course:'103', group:'Writing'},
{url:'eld103/ch1-2/dashboard.html',     name:'ELD 103 Ch. 1\u20132',          course:'103', group:'Writing'},
{url:'eld103/ch3/dashboard.html',       name:'ELD 103 Ch. 3',                 course:'103', group:'Writing'},
{url:'eld103/unit1/dashboard.html',     name:'ELD 103 Unit 1: Introducing People', course:'103', group:'Writing'},
{url:'eld103/respect/dashboard.html',   name:'Respect reflection',            course:'103', group:'Writing'},
{url:'resume/dashboard.html',           name:'R\u00e9sum\u00e9 unit',         course:'103', group:'Writing'},
{url:'this-is-how/dashboard.html',      name:'This Is How We Do It',          course:'103', group:'Writing'},
{url:'toolkits/dashboard.html',         name:'Toolkits',                      course:'103', group:'Writing'},

/* ---------- Grammar ---------- */
{url:'verbs/dashboard.html',            name:'Verb drills',                   course:'both', group:'Grammar'},
{url:'questions/dashboard.html',          name:'Question Practice',             course:'103', group:'Grammar'},
{url:'question-builder/dashboard.html', name:'Question Builder (pictures): Find Someone Who', course:'103', group:'Grammar'},
{url:'grasshopper-ant/dashboard.html',    name:'Grasshopper and Ant',           course:'101', group:'Grammar'},
{url:'fables/dashboard.html',             name:'Fables',                        course:'101', group:'Grammar'},

/* ---------- Unit ---------- */
{url:'launch-plus/dashboard.html',      name:'Launch Plus',                   course:'101', group:'Unit', note:'Every lesson and its six parts, plus the Record step.'},
{url:'basics/dashboard.html',           name:'Daily Basics',                  course:'101', group:'Unit'},
{url:'basics/print/',                   name:'Daily Basics \u2014 print & project', course:'101', group:'Unit', note:'Make a paper do-now sheet (12\u201340 questions, answer key) or put the whole set on the board. Same questions as the tap-through page.'},
{url:'donow/dashboard.html',            name:'Do Now \u2014 all',             course:'both', group:'Unit'},
{url:'donow/dog-01/dashboard.html',     name:'Do Now: The Dog at the Bus Stop',course:'both', group:'Unit'},
{url:'donow/0918/dashboard.html',       name:'Do Now: Sept 18',               course:'both', group:'Unit'},
{url:'survival-english/dashboard.html', name:'Survival English',              course:'101', group:'Unit'},
{url:'phonics/dashboard.html',          name:'Phonics',                       course:'101', group:'Unit'}
];

/* Legacy paths kept working but NOT listed: the front door redirects them.
   arrival/arrival_dashboard.html -> arrival/dashboard.html
   eld103/ch3_dashboard.html      -> eld103/ch3/dashboard.html
   dashboard.html (repo root)     -> easy-true/dashboard.html
   fables/ false-friends/ grasshopper-ant/ questions/ teacher.html -> dashboard.html (T-121)
   New dashboards are named dashboard.html inside their activity's folder. */
window.DASHBOARD_LEGACY = {
  'arrival/arrival_dashboard.html': 'arrival/dashboard.html',
  'eld103/ch3_dashboard.html':      'eld103/ch3/dashboard.html',
  'dashboard.html':                 'easy-true/dashboard.html',
  'fables/teacher.html':            'fables/dashboard.html',
  'false-friends/teacher.html':     'false-friends/dashboard.html',
  'grasshopper-ant/teacher.html':   'grasshopper-ant/dashboard.html',
  'questions/teacher.html':         'questions/dashboard.html'
};
