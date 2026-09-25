/* =====================================================================
   words.js — shared by My Page (student/) and My Words (vocab/mywords/).

   Reads a student's vocabulary checks (vocab_preassess) and practice
   (vocab_word_practice) and works out:
     - which words they know and which they don't know yet
     - which practice to suggest, and in what order
   It also holds the practice sentence for every picture word, so the
   "Use it" grammar step has a real sentence to work with.

   Needs /readings/vocab/pre/quizzes.js loaded first (QUIZZES + ICONS).
   Uses string concatenation only. No template literals.
   ===================================================================== */
(function(){
var MW = window.MW = {};

MW.SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
MW.SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
MW.PROXY    = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
MW.IDK      = '__idk';
MW.PRACTICE_URL = '/readings/vocab/mywords/';
MW.CHECK_URL    = '/readings/vocab/pre/';

/* A word counts as learned in practice after 3 right answers
   in at least 2 different kinds of activity. */
MW.LEARN_CORRECT = 3;
MW.LEARN_MODES   = 2;

/* ---------------- languages (the standard 15) ---------------- */
MW.LANGS = [
  ['es','Espa\u00f1ol'],['yue','\u5ee3\u6771\u8a71 (Cantonese)'],['zh-CN','\u4e2d\u6587 (\u666e\u901a\u8a71)'],
  ['ar','\u0627\u0644\u0639\u0631\u0628\u064a\u0629'],['ary','\u0627\u0644\u062f\u0627\u0631\u062c\u0629 (Darija)'],
  ['vi','Ti\u1ebfng Vi\u1ec7t'],['ru','\u0420\u0443\u0441\u0441\u043a\u0438\u0439'],['ur','\u0627\u0631\u062f\u0648'],
  ['tl','Tagalog'],['fr','Fran\u00e7ais'],['ko','\ud55c\uad6d\uc5b4'],['hi','\u0939\u093f\u0928\u094d\u0926\u0940'],
  ['so','Soomaali'],['ne','\u0928\u0947\u092a\u093e\u0932\u0940'],['th','\u0e44\u0e17\u0e22']
];
MW.RTL = {ar:1, ary:1, ur:1};
MW.langFromHome = function(txt){
  txt = String(txt || '').toLowerCase();
  var map = [['darija','ary'],['moroc','ary'],['cantonese','yue'],['mandarin','zh-CN'],['chinese','zh-CN'],
    ['spanish','es'],['espa','es'],['arabic','ar'],['vietnam','vi'],['russian','ru'],['urdu','ur'],
    ['tagalog','tl'],['filipino','tl'],['french','fr'],['korean','ko'],['hindi','hi'],['somali','so'],
    ['nepal','ne'],['thai','th']];
  for (var i=0;i<map.length;i++) if (txt.indexOf(map[i][0]) > -1) return map[i][1];
  return '';
};
MW.getLang = function(home){
  var L = '';
  try { L = localStorage.getItem('vocab_lang') || ''; } catch(e){}
  return L || MW.langFromHome(home);
};
MW.setLang = function(L){ try { localStorage.setItem('vocab_lang', L); } catch(e){} };
MW.langOptions = function(sel){
  var h = '<option value="">No translation</option>';
  MW.LANGS.forEach(function(l){
    h += '<option value="' + l[0] + '"' + (l[0] === sel ? ' selected' : '') + '>' + l[1] + '</option>';
  });
  return h;
};

/* Words that translate badly alone get a clearer English version first. */
MW.TR_HINT = { fall:'autumn', right:'to the right', left:'to the left', last:'last name',
  met:'met (past of meet)', won:'won (past of win)', made:'made (past of make)',
  like:'like (similar)', just:'just as', call:'to call', code:'to write computer code',
  cold:'cold (temperature)', park:'a park', bank:'a bank for money', trash:'trash, garbage',
  start:'to start', spell:'to spell a word', share:'to share', wash:'to wash', take:'to take',
  wait:'to wait', sit:'to sit', choose:'to choose', drink:'to drink', eat:'to eat', work:'to work',
  leave:'to leave', draw:'to draw', speak:'to speak', listen:'to listen', read:'to read',
  cook:'a cook (person)', mean:'mean (not kind)', smart:'smart (intelligent)' };

/* ---------------- translation (proxy, cached on the device) ---------------- */
var tmem = {};
MW.translate = function(word, lang){
  if (!lang || !word) return Promise.resolve('');
  var text = MW.TR_HINT[String(word).toLowerCase()] || word;
  var key = 'mw_tr|' + lang + '|' + text;
  if (tmem[key]) return Promise.resolve(tmem[key]);
  try { var c = localStorage.getItem(key); if (c){ tmem[key] = c; return Promise.resolve(c); } } catch(e){}
  var u = MW.PROXY + '?text=' + encodeURIComponent(text) + '&q=' + encodeURIComponent(text)
    + '&target=' + encodeURIComponent(lang) + '&lang=' + encodeURIComponent(lang) + '&to=' + encodeURIComponent(lang);
  return fetch(u).then(function(r){ return r.text(); }).then(function(t){
    var v = t;
    try { var j = JSON.parse(t); v = j.translation || j.text || j.result || j.translatedText || ''; } catch(e){}
    if (v && typeof v === 'object') v = v.equiv || v.meaning || '';
    v = String(v || '').trim();
    if (v && v.length < 120){ tmem[key] = v; try { localStorage.setItem(key, v); } catch(e){} }
    return v;
  }).catch(function(){ return ''; });
};
/* run translations a few at a time so 30 words don't hit the proxy at once */
MW.translateMany = function(words, lang, onEach){
  var i = 0, live = 0, MAX = 3;
  return new Promise(function(done){
    function next(){
      if (i >= words.length && live === 0) return done();
      while (live < MAX && i < words.length){
        (function(w){
          live++;
          MW.translate(w, lang).then(function(t){ onEach(w, t); }).then(function(){ live--; next(); });
        })(words[i++]);
      }
    }
    next();
  });
};

/* ---------------- speech ---------------- */
var VOICE = null;
function pickVoice(){
  if (!window.speechSynthesis) return;
  var vs = speechSynthesis.getVoices() || [];
  VOICE = vs.filter(function(v){ return /^en[-_]US/i.test(v.lang) && /Samantha|Google US|Aria|Jenny/i.test(v.name); })[0]
       || vs.filter(function(v){ return /^en[-_]US/i.test(v.lang); })[0] || null;
}
if (window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
MW.speak = function(txt, slow){
  if (!window.speechSynthesis || !txt) return;
  var u = new SpeechSynthesisUtterance(String(txt).replace(/_{2,}/g, 'blank'));
  u.lang = 'en-US'; u.rate = slow ? 0.55 : 0.9; if (VOICE) u.voice = VOICE;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
};

/* ---------------- helpers ---------------- */
MW.esc = function(s){ return (s == null ? '' : String(s)).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
MW.norm = function(s){ return String(s || '').toLowerCase().replace(/[\u2019']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); };
MW.local = function(e){ return String(e || '').trim().toLowerCase().split('@')[0]; };
/* every spelling this student's email could have been saved under */
MW.emailVariants = function(e){
  e = String(e || '').trim().toLowerCase();
  var lp = MW.local(e), out = [e];
  if (/@(s\.)?sfusd\.edu$/.test(e)){ out.push(lp + '@s.sfusd.edu'); out.push(lp + '@sfusd.edu'); }
  return out.filter(function(x, i){ return x && out.indexOf(x) === i; });
};
MW.sb = function(path, opts){
  opts = opts || {};
  var h = { apikey:MW.SUPA_KEY, Authorization:'Bearer ' + MW.SUPA_KEY, 'Content-Type':'application/json' };
  if (opts.prefer) h.Prefer = opts.prefer;
  return fetch(MW.SUPA_URL + '/rest/v1/' + path, { method:opts.method || 'GET', headers:h,
    body:opts.body ? JSON.stringify(opts.body) : undefined })
  .then(function(r){
    if (!r.ok) return r.text().then(function(t){ console.warn('MW', path, r.status, t); return null; });
    return r.text().then(function(t){ return t ? JSON.parse(t) : []; });
  }).catch(function(e){ console.warn('MW', e); return null; });
};
MW.inEmails = function(email){
  return 'email=in.(' + encodeURIComponent(MW.emailVariants(email).map(function(x){ return '"' + x + '"'; }).join(',')) + ')';
};
MW.loadChecks = function(email){
  return MW.sb('vocab_preassess?' + MW.inEmails(email)
    + '&select=quiz,quiz_title,attempt,items,answers,turned_in,updated_at&order=attempt.asc');
};
MW.loadPractice = function(email){
  return MW.sb('vocab_word_practice?' + MW.inEmails(email)
    + '&select=quiz,word,correct,wrong,modes,learned,updated_at');
};

/* ---------------- quiz lookups ---------------- */
MW.quiz = function(id){ return (window.QUIZZES || []).filter(function(q){ return q.id === id; })[0] || null; };
MW.itemFor = function(quizId, w){
  var q = MW.quiz(quizId); if (!q) return null;
  return q.items.filter(function(it){ return it.w === w; })[0] || null;
};
function blank(s){ return String(s || '').replace(/_{2,}/g, '___'); }
MW.sentenceFor = function(quizId, w, it){
  if (it && it.s) return blank(it.s);
  return (MW.SENT[quizId] && MW.SENT[quizId][w]) || '';
};
/* one word with everything a page needs to show and practice it */
MW.entry = function(quizId, w, saved){
  var it = MW.itemFor(quizId, w) || {};
  var q = MW.quiz(quizId);
  var e = {
    quiz: quizId, quizTitle: q ? q.title : quizId, w: w,
    e: it.e || (saved && saved.e) || '', icon: it.icon || '', s: it.s ? blank(it.s) : (saved && saved.s ? blank(saved.s) : ''),
    opts: it.opts || (saved && saved.opts ? saved.opts.filter(function(o){ return o !== w; }) : [])
  };
  e.sent = e.s || MW.sentenceFor(quizId, w, it);
  return e;
};
/* the picture: emoji, drawn icon, or the sentence with a blank */
MW.pic = function(en, cls){
  cls = cls || 'mw-pic';
  if (en.icon && window.ICONS && window.ICONS[en.icon]) return '<span class="' + cls + ' mw-svg" aria-hidden="true">' + window.ICONS[en.icon] + '</span>';
  if (en.e) return '<span class="' + cls + ' mw-emoji" aria-hidden="true">' + en.e + '</span>';
  return '<span class="' + cls + ' mw-sentpic" translate="no">' + MW.esc(en.s || en.sent || en.w).replace(/___/g, '<span class="mw-blank">\u00a0</span>') + '</span>';
};

/* ---------------- the core: what do they know? ----------------
   For each quiz, use the newest attempt that has answers.
   Right = know it. Wrong or "I don't know" = to learn. Skipped = left out. */
MW.buildState = function(checks, practice){
  var byQuiz = {}, order = [];
  (checks || []).forEach(function(r){
    var hasAns = r.answers && Object.keys(r.answers).length;
    if (!hasAns) return;
    var cur = byQuiz[r.quiz];
    if (!cur){ order.push(r.quiz); byQuiz[r.quiz] = r; }
    else if ((r.attempt || 1) >= (cur.attempt || 1)) byQuiz[r.quiz] = r;
  });
  var pr = {};
  (practice || []).forEach(function(p){
    var k = p.quiz + '|' + p.word, o = pr[k];
    if (!o) pr[k] = p;
    else {  /* two email spellings: add them together */
      o.correct = (o.correct||0) + (p.correct||0); o.wrong = (o.wrong||0) + (p.wrong||0);
      o.modes = (o.modes||[]).concat((p.modes||[]).filter(function(m){ return (o.modes||[]).indexOf(m) < 0; }));
      o.learned = o.learned || p.learned;
    }
  });
  var quizzes = order.map(function(id){
    var r = byQuiz[id], known = [], learn = [];
    (r.items || []).forEach(function(it){
      var a = r.answers[it.k]; if (!a) return;
      var en = MW.entry(id, it.w, it);
      if (a === it.w){ en.status = 'known'; known.push(en); return; }
      en.idk = a === MW.IDK; en.chose = en.idk ? '' : a;
      var p = pr[id + '|' + it.w];
      en.practice = p || null;
      en.status = p && p.learned ? 'got' : (p && ((p.correct||0) + (p.wrong||0)) ? 'practicing' : 'new');
      learn.push(en);
    });
    return { id:id, title:(MW.quiz(id) || {}).title || r.quiz_title || id, tag:(MW.quiz(id) || {}).tag || '',
      emoji:(MW.quiz(id) || {}).emoji || '', attempt:r.attempt || 1, when:r.updated_at, done:!!r.turned_in,
      known:known, learn:learn, left:learn.filter(function(x){ return x.status !== 'got'; }) };
  });
  quizzes.sort(function(a, b){ return String(b.when).localeCompare(String(a.when)); });
  var all = { known:0, learn:0, got:0 };
  quizzes.forEach(function(q){ all.known += q.known.length; all.learn += q.left.length; all.got += q.learn.length - q.left.length; });
  return { quizzes:quizzes, totals:all };
};

/* ---------------- suggestions ---------------- */
var STOP = {a:1,an:1,the:1,my:1,to:1,up:1,of:1,is:1,and:1};
function tokens(w){ return MW.norm(w).split(' ').filter(function(t){ return t && !STOP[t]; }); }
var ALIAS = { 'physical education':'PE' };

MW.suggest = function(state){
  var out = [];
  state.quizzes.forEach(function(q){
    if (q.learn.length && !q.left.length)
      out.push({ kind:'again', rank:0, title:'Check again: ' + q.title,
        sub:'You practiced all ' + q.learn.length + ' words. Show what you know now.',
        url:MW.CHECK_URL + '?q=' + encodeURIComponent(q.id) + '&again=1', emoji:'\u2705' });
  });
  var withLeft = state.quizzes.filter(function(q){ return q.left.length; })
    .sort(function(a, b){ return b.left.length - a.left.length; });
  withLeft.slice(0, 3).forEach(function(q, i){
    out.push({ kind:'mine', rank:1 + i, title:'Practice: ' + q.title,
      sub:q.left.length + ' word' + (q.left.length === 1 ? '' : 's') + ': ' + q.left.slice(0, 5).map(function(x){ return x.w; }).join(', ') + (q.left.length > 5 ? '\u2026' : ''),
      url:MW.PRACTICE_URL + '?q=' + encodeURIComponent(q.id), words:q.left.map(function(x){ return x.w; }), emoji:q.emoji || '\ud83d\udcdd' });
  });
  if (withLeft.length > 1){
    var n = 0; withLeft.forEach(function(q){ n += q.left.length; });
    out.push({ kind:'mix', rank:4, title:'Mix: all my words', sub:n + ' words from ' + withLeft.length + ' checks, 10 at a time',
      url:MW.PRACTICE_URL, emoji:'\ud83d\udd00' });
  }
  withLeft.forEach(function(q){
    (MW.EXTRA[q.id] || []).forEach(function(x){
      out.push({ kind:'extra', rank:5, title:x.title, sub:x.sub, url:x.url, emoji:x.emoji });
    });
  });
  /* existing word sets that share their words */
  var left = []; withLeft.forEach(function(q){ q.left.forEach(function(x){ left.push(x.w); }); });
  var hits = [];
  Object.keys(MW.SETS).forEach(function(slug){
    var set = MW.SETS[slug], lower = set.words.map(function(w){ return MW.norm(w); }), found = [];
    left.forEach(function(w){
      var t = tokens(ALIAS[MW.norm(w)] || w);
      if (t.some(function(x){ return lower.indexOf(x) > -1; }) && found.indexOf(w) < 0) found.push(w);
    });
    if (found.length) hits.push({ slug:slug, set:set, found:found });
  });
  hits.sort(function(a, b){ return b.found.length - a.found.length; });
  hits.slice(0, 2).forEach(function(h){
    out.push({ kind:'set', rank:5, title:h.set.title,
      sub:'Has ' + h.found.length + ' of your words: ' + h.found.slice(0, 4).join(', ') + (h.found.length > 4 ? '\u2026' : ''),
      url:'/readings/vocab/' + h.slug + '/', emoji:h.set.emoji });
  });
  return out.slice(0, 7);
};

/* ---------------- practice record for one word ---------------- */
MW.isLearned = function(p){
  return (p.correct || 0) >= MW.LEARN_CORRECT && (p.modes || []).length >= MW.LEARN_MODES;
};

MW.SENT = {
"u1-l7-supplies": {
"backpack": "I carry my books in my ___.",
"pencil": "I write my name with a ___.",
"pen": "Can I borrow your ___?",
"book": "I read a ___ every night.",
"notebook": "I write my notes in my ___.",
"calculator": "I use a ___ in math class.",
"computer": "I type my essay on the ___.",
"folder": "I keep my papers in a ___.",
"ruler": "I measure the line with a ___.",
"scissors": "I cut the paper with ___."
},
"u2-l5-weather": {
"sunny": "It is ___ today. Wear sunglasses.",
"rainy": "It is ___ today. Take an umbrella.",
"cloudy": "It is ___. I can't see the sun.",
"windy": "It is ___. My hat flew away!",
"snowy": "It is ___. Everything is white.",
"hot": "It is ___. I want ice cream.",
"cold": "It is ___. Wear a jacket.",
"temperature": "The ___ today is 65 degrees.",
"storm": "There is a big ___ with thunder.",
"rainbow": "After the rain, I see a ___."
},
"u2-l11-feelings": {
"happy": "I feel ___ on my birthday.",
"sad": "I feel ___ when my friend moves away.",
"angry": "I feel ___ when someone takes my phone.",
"afraid": "I am ___ of big dogs.",
"nervous": "I feel ___ before a test.",
"confused": "I feel ___. I don't understand the homework.",
"embarrassed": "I feel ___ when I fall in front of everyone.",
"proud": "I feel ___ of my good grade.",
"tired": "I feel ___. I need to sleep.",
"excited": "I feel ___. We go to the beach tomorrow!"
},
"u2-l7-clothes": {
"shirt": "I am wearing a blue ___.",
"pants": "I am wearing black ___.",
"dress": "She is wearing a red ___.",
"jacket": "It is cold. Wear your ___.",
"shoes": "I put on my ___ before I go outside.",
"glasses": "I wear ___ to read.",
"hat": "I wear a ___ in the sun.",
"socks": "I wear ___ under my shoes.",
"scarf": "I wear a ___ around my neck.",
"gloves": "I wear ___ on my hands in winter."
},
"u1-l12-lunch": {
"apple": "I eat an ___ every day.",
"banana": "A ___ is long and yellow.",
"sandwich": "I have a ham ___ for lunch.",
"pizza": "We eat ___ on Friday.",
"milk": "I drink ___ with my cereal.",
"rice": "My mom cooks ___ every night.",
"chicken": "I like fried ___.",
"salad": "I eat a green ___.",
"bread": "I buy ___ at the bakery.",
"cookie": "I want a chocolate chip ___."
},
"u2-l8-habits": {
"wake up": "I ___ at 7:00 every morning.",
"brush my teeth": "I ___ after breakfast.",
"take a shower": "I ___ every night.",
"wash": "I ___ my hands before I eat.",
"eat": "I ___ breakfast at home.",
"exercise": "I ___ at the gym after school.",
"do homework": "I ___ at the kitchen table.",
"watch TV": "I ___ with my family at night.",
"take the bus": "I ___ to school.",
"go to sleep": "I ___ at 10:30."
},
"u1-l10-subjects": {
"math": "In ___ class, we add numbers.",
"science": "In ___ class, we do experiments.",
"art": "In ___ class, we paint pictures.",
"music": "In ___ class, we play the piano.",
"physical education": "In ___ class, we run and play games.",
"computer science": "In ___ class, we write code.",
"history": "In ___ class, we learn about the past.",
"social studies": "In ___ class, we learn about countries and people.",
"English": "In ___ class, we read and write stories.",
"drama": "In ___ class, we act in plays."
},
"u2-l6-freetime": {
"dance": "I like to ___ to music.",
"sing": "I like to ___ songs.",
"cook": "I like to ___ dinner for my family.",
"ride a bike": "I like to ___ in the park.",
"swim": "I like to ___ in the pool.",
"read": "I like to ___ books.",
"play soccer": "I like to ___ with my friends.",
"take photos": "I like to ___ with my phone.",
"code": "I like to ___ apps on the computer.",
"watch movies": "I like to ___ on the weekend."
},
"u1-l6-people": {
"teacher": "The ___ helps students learn.",
"student": "The ___ goes to school to learn.",
"nurse": "The ___ helps sick people.",
"cook": "The ___ makes food in a restaurant.",
"police officer": "The ___ keeps people safe.",
"scientist": "The ___ does experiments.",
"artist": "The ___ paints a picture.",
"farmer": "The ___ grows food on the farm.",
"pilot": "The ___ flies the airplane.",
"mechanic": "The ___ fixes cars."
},
"u1-l9-places": {
"school": "I go to ___ every day to learn.",
"library": "I borrow books at the ___.",
"hospital": "Doctors work at the ___.",
"store": "I buy food at the ___.",
"park": "I play soccer at the ___.",
"house": "My family lives in a big ___.",
"bank": "I keep my money in the ___.",
"restaurant": "We eat dinner at a ___.",
"post office": "I mail a letter at the ___.",
"bus stop": "I wait for the bus at the ___."
},
"u2-l12-seasons": {
"winter": "It is cold in the ___.",
"spring": "Flowers grow in the ___.",
"summer": "It is hot in the ___. There is no school.",
"fall": "Leaves fall from the trees in the ___.",
"vacation": "We go to Mexico on ___.",
"party": "We dance at the ___.",
"birthday": "Today is my ___. I am 15!",
"camping": "We sleep in a tent when we go ___.",
"picnic": "We eat lunch on a blanket at a ___.",
"fireworks": "We watch ___ in the sky on New Year's."
},
"u2-l13-senses": {
"see": "I ___ with my eyes.",
"hear": "I ___ with my ears.",
"smell": "I ___ with my nose.",
"taste": "I ___ with my tongue.",
"touch": "I ___ with my hands.",
"loud": "The music is very ___.",
"quiet": "The library is ___.",
"sweet": "Candy is ___.",
"sour": "A lemon is ___.",
"cold": "Ice is ___."
},
"dp-looks": {
"blond hair": "She has long ___.",
"red hair": "He has short ___.",
"curly hair": "My sister has ___.",
"white hair": "My grandpa has ___.",
"bald": "My uncle has no hair. He is ___.",
"a beard": "My dad has ___ on his face.",
"glasses": "He wears ___ to see.",
"young": "The baby is very ___.",
"old": "My great-grandma is 95. She is ___.",
"brown eyes": "I have ___."
},
"dp-traits-1": {
"athletic": "She plays three sports. She is ___.",
"artistic": "He draws every day. He is ___.",
"musical": "She plays guitar and sings. She is ___.",
"loud": "He talks very loudly. He is ___.",
"quiet": "She doesn't talk much. She is ___.",
"shy": "He is nervous around new people. He is ___.",
"lazy": "He stays on the sofa all day. He is ___.",
"brave": "She is not afraid. She is ___.",
"generous": "He shares his lunch. He is ___.",
"playful": "The puppy likes to play. It is ___."
},
"dp-traits-2": {
"friendly": "She says hi to everyone. She is ___.",
"curious": "He asks many questions. He is ___.",
"studious": "She studies every night. She is ___.",
"smart": "He learns fast. He is ___.",
"funny": "She makes everyone laugh. She is ___.",
"dramatic": "He acts big about small things. He is ___.",
"mean": "He says bad things to people. He is ___.",
"rude": "She doesn't say please or thank you. She is ___.",
"peaceful": "He is calm and does not fight. He is ___.",
"aggressive": "He pushes and fights. He is ___."
},
"u1-l9-school-places": {
"classroom": "We have English class in this ___.",
"cafeteria": "We eat lunch in the ___.",
"gym": "We play basketball in the ___.",
"library": "I read quietly in the ___.",
"hallway": "I walk down the ___ to my next class.",
"office": "The principal works in the ___.",
"schoolyard": "We play outside in the ___.",
"locker": "I put my backpack in my ___.",
"stairs": "I walk up the ___ to the second floor.",
"bathroom": "May I go to the ___, please?"
},
"u1-l6-school-people": {
"teacher": "The ___ teaches our class.",
"student": "I am a ___ at Galileo.",
"nurse": "I feel sick. I go to see the ___.",
"principal": "The ___ is the leader of the school.",
"coach": "The ___ helps the soccer team.",
"custodian": "The ___ cleans the school.",
"food service": "The ___ workers give us lunch.",
"librarian": "The ___ helps me find a book.",
"bus driver": "The ___ drives the bus.",
"cook": "The ___ makes food in the kitchen."
},
"u1-l11-lunchtime": {
"breakfast": "I eat ___ in the morning.",
"lunch": "We eat ___ at 12:00.",
"eat": "I ___ my sandwich.",
"wait": "I ___ in line for my food.",
"take": "I ___ a tray.",
"choose": "I ___ pizza or salad.",
"sit": "I ___ with my friends.",
"clean up": "I ___ my table after lunch.",
"trash": "I put my ___ in the can.",
"drink": "I ___ milk with lunch."
},
"u1-day": {
"morning": "I wake up in the ___.",
"afternoon": "School ends in the ___.",
"weather": "The ___ is sunny today.",
"listen": "I ___ to the teacher.",
"speak": "I ___ English and Spanish.",
"friends": "I eat lunch with my ___.",
"color": "My favorite ___ is blue.",
"draw": "I ___ a picture in art class.",
"work": "My mom goes to ___ at 8:00.",
"leave": "I ___ school at 3:30."
}
};

/* existing 9-tab word sets, so suggestions can point at them */
MW.SETS = {"colors": {"title": "Colors", "words": ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white", "gray", "gold"], "emoji": "🎨"}, "animals": {"title": "Animals", "words": ["dog", "cat", "bird", "horse", "cow", "pig", "duck", "sheep", "rabbit", "mouse", "elephant", "lion", "tiger", "bear", "snake", "monkey"], "emoji": "🐱"}, "foods": {"title": "Foods", "words": ["rice", "bread", "chicken", "beef", "fish", "egg", "apple", "banana", "mango", "tomato", "potato", "cheese", "soup", "noodles", "beans", "cake"], "emoji": "🍱"}, "drinks": {"title": "Drinks", "words": ["water", "milk", "juice", "tea", "coffee", "soda", "smoothie", "lemonade", "hot chocolate", "coconut water"], "emoji": "🥤"}, "sports": {"title": "Sports", "words": ["soccer", "basketball", "baseball", "volleyball", "tennis", "swimming", "running", "cycling", "boxing", "dancing", "ping-pong", "football"], "emoji": "⚽"}, "school-subjects": {"title": "School subjects", "words": ["math", "English", "science", "history", "art", "music", "PE", "biology", "chemistry", "geography", "computer science", "Spanish"], "emoji": "📚"}, "verbs-1": {"title": "Action verbs 1", "words": ["watch", "play", "exercise", "open", "walk", "close", "sit", "write", "jump", "read", "give", "run", "dance", "talk", "sing", "listen"], "emoji": "🏃"}, "verbs-2": {"title": "Action verbs 2", "words": ["ski", "smell", "drive", "fly", "skate", "sleep", "dive", "swing", "swim", "sail", "climb", "drink", "ride", "eat", "slide", "wake"], "emoji": "🏃"}, "verbs-3": {"title": "Action verbs 3", "words": ["water", "plant", "knit", "pack", "vacuum", "dust", "sweep", "cut", "wipe", "repair", "sew", "cook", "mop", "pick", "paint", "wash"], "emoji": "🏃"}, "verbs-4": {"title": "Action verbs 4", "words": ["lift", "shout", "hit", "tie", "cry", "knock", "push", "kick", "sell", "laugh", "pull", "buy", "try", "fold", "wave", "throw"], "emoji": "🏃"}, "verbs-5": {"title": "Action verbs 5", "words": ["march", "crash", "comb", "fight", "break", "examine", "teach", "wait", "shave", "point", "brush", "tell", "draw", "look", "mix", "stop"], "emoji": "🏃"}};

/* extra practice that fits a whole check */
MW.EXTRA = {"u2-l8-habits": [{"title": "Present tense verbs", "sub": "Every day I wake up, I eat, she eats…", "url": "/readings/verbs/present/", "emoji": "⏰"}], "u2-l10-catching-up": [{"title": "Past tense verbs", "sub": "won, made, finished: what happened before", "url": "/readings/verbs/past/", "emoji": "⌛"}]};

})();
