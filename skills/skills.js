/* =====================================================================
   Galileo ELD Skill Map (T-145, Oct 2026)
   One source of truth for "which skills does this activity practise?"
   - SKILLS: 24 can-do skills in Listening, Speaking, Reading, Writing
     and How English Works, each tagged 101 / 103 / both and mapped to
     the CA ELD Standards (grades 9-12: Part I = PI.n, Part II = PII.n,
     Part III = foundational literacy).
   - MAP: activity path prefix -> skill ids. The LONGEST matching prefix
     wins, so "easy-true/01/listen" beats "easy-true". Add a line here
     whenever a new activity ships (or let the Atlas chat do it).
   - Helpers: GAL_SKILLS.skillsOf(slug), .domainOf(slug) ('RWSL' letters,
     How English Works counts as W), .forCourse('101'|'103').
   Used by readings/skills/dashboard.html; the Teacher's Desk can call
   GAL_SKILLS.domainOf(slug) instead of its own folder guess.
   ===================================================================== */
(function () {
  'use strict';
  var D = { L: 'Listening', S: 'Speaking', R: 'Reading', W: 'Writing', H: 'How English Works' };

  var SKILLS = [
    /* ---- Listening ---- */
    { id: 'l.words', short: 'Hear & know a word',  d: 'L', course: '101',  label: 'Hear a word and know it',              eld: ['PI.5', 'PIII'] },
    { id: 'l.story', short: 'Follow a story',  d: 'L', course: '101',  label: 'Follow a story: who, what, where',     eld: ['PI.5'] },
    { id: 'l.ears', short: 'Listen, no text',   d: 'L', course: 'both', label: 'Understand speech with no words on screen', eld: ['PI.5'] },
    { id: 'l.main', short: 'Main idea (talk)',   d: 'L', course: '103',  label: 'Get the main idea and details from a talk, news or song', eld: ['PI.5'] },
    /* ---- Speaking ---- */
    { id: 's.pron', short: 'Say words clearly',   d: 'S', course: '101',  label: 'Say words clearly',                    eld: ['PIII'] },
    { id: 's.aloud', short: 'Read aloud',  d: 'S', course: 'both', label: 'Read a passage aloud accurately',      eld: ['PIII'] },
    { id: 's.talk', short: 'Talk with a partner',   d: 'S', course: 'both', label: 'Ask and answer with a partner',        eld: ['PI.1'] },
    { id: 's.present', short: 'Retell / present',d: 'S', course: 'both', label: 'Retell or present to a group',         eld: ['PI.9'] },
    { id: 's.opinion', short: 'Opinion + why',d: 'S', course: '103',  label: 'Give an opinion and back it up',       eld: ['PI.3', 'PI.11'] },
    /* ---- Reading ---- */
    { id: 'r.vocab', short: 'Word meanings',  d: 'R', course: 'both', label: 'Know word meanings',                   eld: ['PI.6', 'PI.12'] },
    { id: 'r.text', short: 'Understand a text',   d: 'R', course: 'both', label: 'Understand a short text',              eld: ['PI.6'] },
    { id: 'r.infer', short: 'Infer / predict',  d: 'R', course: '103',  label: 'Infer, predict, explain why',          eld: ['PI.6'] },
    { id: 'r.craft', short: 'Writer\u2019s language',  d: 'R', course: '103',  label: 'Notice how the writer uses language',  eld: ['PI.7', 'PI.8'] },
    { id: 'r.decode', short: 'Letters & sounds', d: 'R', course: '101',  label: 'Decode letters, sounds and spellings', eld: ['PIII'] },
    /* ---- Writing ---- */
    { id: 'w.sentence', short: 'Correct sentence',   d: 'W', course: '101',  label: 'Write a correct sentence',          eld: ['PII.3', 'PII.4'] },
    { id: 'w.expand', short: 'Bigger sentences',     d: 'W', course: 'both', label: 'Make sentences bigger (adjectives, because / but / so)', eld: ['PII.4', 'PII.5', 'PII.6'] },
    { id: 'w.paragraph', short: 'Paragraph',  d: 'W', course: 'both', label: 'Organize a paragraph',              eld: ['PII.1', 'PII.2', 'PI.10'] },
    { id: 'w.summary', short: 'Summarize',    d: 'W', course: 'both', label: 'Summarize',                         eld: ['PI.10'] },
    { id: 'w.paraphrase', short: 'Paraphrase', d: 'W', course: '103',  label: 'Paraphrase: say it another way',    eld: ['PI.10', 'PII.7'] },
    { id: 'w.argue', short: 'Argue + evidence',      d: 'W', course: '103',  label: 'Argue with evidence',               eld: ['PI.11'] },
    { id: 'w.toperson', short: 'Write to someone',   d: 'W', course: 'both', label: 'Write to someone (a message, a reply, a letter)', eld: ['PI.2'] },
    /* ---- How English Works ---- */
    { id: 'h.verbs', short: 'Verbs & tenses',     d: 'H', course: 'both', label: 'Verbs and tenses',                    eld: ['PII.3'] },
    { id: 'h.nouns', short: 'Nouns & pronouns',     d: 'H', course: 'both', label: 'Nouns, plurals and pronouns',         eld: ['PII.4'] },
    { id: 'h.questions', short: 'Questions', d: 'H', course: 'both', label: 'Asking questions',                    eld: ['PII.3', 'PI.1'] }
  ];

  /* Prefix -> skills. Longest prefix wins. Story-length readings for 103
     add r.infer / r.craft; their 101 "easy" versions don't. */
  var STORY103 = ['r.text', 'r.vocab', 'r.infer', 'r.craft', 'w.summary'];
  var MAP = [
    /* Story Reel and its checks */
    ['reel-test',             ['s.aloud', 's.pron', 'l.story']],
    ['checks/dashboard',      ['s.aloud', 's.pron']],
    ['reel-v2',               ['l.words', 'l.story', 'r.vocab', 'r.text', 'w.sentence']],
    ['reel',                  ['l.words', 'l.story', 'r.vocab', 'r.text']],
    /* Speaking */
    ['say',                   ['s.pron']],
    ['fluency',               ['s.aloud', 's.pron']],
    ['speaking/spell-your-name', ['s.pron', 'r.decode']],
    ['speaking/describe-a-classmate', ['s.present', 'w.expand']],
    ['speaking',              ['s.talk', 's.present']],
    ['group',                 ['s.talk', 'r.text', 'l.words']],
    ['launch-plus/find',      ['s.talk', 'h.questions']],
    ['find',                  ['s.talk', 'h.questions']],
    ['describe',              ['s.present', 'w.expand']],
    ['favorites',             ['s.present', 'w.sentence']],
    ['teachme',               ['s.pron', 's.present']],
    /* Launch Plus and daily practice */
    ['launch-plus/u1-l5',     ['r.text', 'r.vocab', 'w.sentence', 'w.expand', 's.pron', 'h.nouns']],
    ['launch-plus',           ['r.text', 'r.vocab', 'w.sentence', 'w.expand', 's.pron', 'h.verbs']],
    ['basics',                ['r.vocab', 'w.sentence', 'h.verbs']],
    ['donow',                 ['w.sentence', 'r.vocab']],
    ['wit',                   ['w.sentence', 'w.expand']],
    ['revise',                ['w.sentence', 'w.expand']],
    ['topic-sentence',        ['w.paragraph']],
    ['write',                 ['w.paragraph', 'w.summary', 'w.paraphrase', 'w.argue']],
    ['questions',             ['h.questions', 'w.sentence']],
    ['question-builder',      ['h.questions', 'w.sentence']],
    ['verbs',                 ['h.verbs']],
    ['pronouns',              ['h.nouns']],
    ['grammar',               ['h.verbs', 'h.nouns', 'w.sentence']],
    ['exceptions',            ['r.vocab', 'h.nouns']],
    ['false-friends',         ['r.vocab']],
    ['shades',                ['r.vocab', 'w.paraphrase']],
    ['vocab',                 ['r.vocab', 'l.words']],
    ['tyma-vocab',            ['r.vocab']],
    ['phonics',               ['r.decode', 's.pron']],
    ['alphabet',              ['r.decode', 's.pron']],
    ['survival-english',      ['r.vocab', 's.talk']],
    /* Very Easy True Stories */
    ['easy-true/01/listen',   ['l.words', 'l.story']], ['easy-true/02/listen', ['l.words', 'l.story']],
    ['easy-true/03/listen',   ['l.words', 'l.story']], ['easy-true/04/listen', ['l.words', 'l.story']],
    ['easy-true/05/listen',   ['l.words', 'l.story']], ['easy-true/06/listen', ['l.words', 'l.story']],
    ['easy-true/01/speak',    ['s.pron', 's.aloud']],  ['easy-true/02/speak',  ['s.pron', 's.aloud']],
    ['easy-true/03/speak',    ['s.pron', 's.aloud']],  ['easy-true/04/speak',  ['s.pron', 's.aloud']],
    ['easy-true/05/speak',    ['s.pron', 's.aloud']],  ['easy-true/06/speak',  ['s.pron', 's.aloud']],
    ['easy-true/01/spell',    ['r.decode']], ['easy-true/02/spell', ['r.decode']], ['easy-true/03/spell', ['r.decode']],
    ['easy-true/04/spell',    ['r.decode']], ['easy-true/05/spell', ['r.decode']], ['easy-true/06/spell', ['r.decode']],
    ['easy-true/01/grammar',  ['h.verbs']], ['easy-true/02/grammar', ['h.verbs']], ['easy-true/03/grammar', ['h.verbs']],
    ['easy-true/04/grammar',  ['h.verbs']], ['easy-true/05/grammar', ['h.verbs']], ['easy-true/06/grammar', ['h.verbs']],
    ['easy-true',             ['r.text', 'r.vocab', 'l.story']],
    /* News, songs */
    ['news',                  ['r.text', 'r.vocab', 'l.main']],
    ['songs',                 ['l.main', 'r.vocab']],
    ['favorite-songs',        ['l.main', 's.present']],
    /* ELD 103 stories and long texts */
    ['landlady/investigate',  ['r.infer', 'r.vocab']],
    ['landlady-easy',         ['r.text', 'r.vocab', 'r.infer', 'w.summary']],
    ['landlady',              STORY103],
    ['telltale',              STORY103],
    ['monkeyspaw',            STORY103],
    ['omelas-easy',           ['r.text', 'r.vocab', 'w.summary']],
    ['omelas',                STORY103.concat(['s.opinion'])],
    ['seedfolks-easy',        ['r.text', 'r.vocab', 'w.sentence']],
    ['seedfolks/quiz-prep',   ['s.talk', 'r.text', 'r.decode']],
    ['seedfolks',             ['r.text', 'r.vocab', 'r.infer', 'w.expand', 'w.paragraph', 'h.verbs']],
    ['brothers-in-arms',      ['r.text', 'r.vocab', 'l.story', 's.pron', 'w.sentence', 'h.verbs']],
    ['stand-by-me',           STORY103.concat(['s.opinion'])],
    ['maus',                  STORY103.concat(['s.present'])],
    ['manzanar',              STORY103],
    ['romeo-juliet',          STORY103],
    ['odyssey',               STORY103],
    ['sept11-easy',           ['r.text', 'r.vocab']],
    ['sept11',                ['r.text', 'r.vocab', 'r.infer']],
    ['psychology',            ['r.text', 'r.vocab', 'r.infer', 'w.paragraph', 'w.argue']],
    ['grasshopper-ant',       ['r.text', 'r.vocab', 'h.verbs', 'w.paragraph']],
    ['fables',                ['r.text', 'r.infer']],
    ['eld103',                ['r.text', 'r.vocab', 'r.infer', 'w.paragraph']],
    ['eld101/respect',        ['r.text', 'r.vocab', 'w.sentence']],
    /* Theme units */
    ['gratitude-letters',     ['w.toperson', 'w.paragraph']],
    ['gratitude',             ['w.toperson', 'r.text']],
    ['holidays',              ['r.text', 'r.vocab', 'w.sentence']],
    ['monsters',              ['r.text', 'r.vocab', 'r.infer', 'w.expand']],
    ['four-agreements',       ['r.text', 'r.infer', 'w.paragraph']],
    ['this-is-how',           ['r.text', 'r.infer', 'w.paragraph']],
    ['human-rights',          ['r.text', 'r.infer', 's.opinion']],
    ['indigenous101',         ['r.text', 'r.vocab']],
    ['indigenous',            ['r.text', 'r.infer']],
    ['mlk',                   ['r.text', 'r.infer']],
    ['thoughts-chain',        ['w.paragraph', 'w.expand']],
    ['thoughts',              ['w.paragraph']],
    ['creativity',            ['r.text', 'w.paragraph']],
    ['resume',                ['w.paragraph', 'w.toperson']],
    ['oral-histories',        ['s.talk', 'w.paragraph']],
    ['arrival',               ['r.text', 's.present']],
    ['toolkits',              ['h.verbs', 'w.sentence']]
  ];
  /* Pages that are not practice (never counted). */
  var SKIP = /(^|\/)dashboard|^teacher|^assign|^student($|\/)|^reports|^dashboards|^atlas|^audit|^diagnostic|^gradebook|^desk/;

  MAP.sort(function (a, b) { return b[0].length - a[0].length; });
  var BYID = {}; SKILLS.forEach(function (s) { BYID[s.id] = s; });

  function clean(slug) {
    return String(slug || '').split('?')[0].split('#')[0]
      .replace(/^https?:\/\/[^/]+/, '').replace(/^\/?readings\//, '')
      .replace(/\/index\.html?$/, '').replace(/\.html?$/, '').replace(/\/+$/, '');
  }
  function skillsOf(slug) {
    var s = clean(slug);
    if (s.indexOf('checks/dashboard') === 0) return ['s.aloud', 's.pron'];
    if (!s || SKIP.test(s)) return [];
    for (var i = 0; i < MAP.length; i++) {
      var p = MAP[i][0];
      if (s.indexOf(p) === 0) return MAP[i][1].slice();
    }
    return ['r.text'];
  }
  function domainOf(slug) {
    var seen = {}, out = '';
    skillsOf(slug).forEach(function (id) { var d = BYID[id].d; if (d === 'H') d = 'W'; if (!seen[d]) { seen[d] = 1; out += d; } });
    return out || 'R';
  }
  function forCourse(course) {
    return SKILLS.filter(function (s) { return s.course === 'both' || !course || s.course === String(course); });
  }
  /* 2026-27: ELD 101 = periods 1, 4, 6; ELD 103 = periods 3, 5. */
  var PERIOD_COURSE = { 1: '101', 4: '101', 6: '101', 3: '103', 5: '103' };

  window.GAL_SKILLS = {
    SKILLS: SKILLS, MAP: MAP, DOMAINS: D, BYID: BYID, PERIOD_COURSE: PERIOD_COURSE,
    clean: clean, skillsOf: skillsOf, domainOf: domainOf, forCourse: forCourse
  };
})();
