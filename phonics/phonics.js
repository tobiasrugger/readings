/* =====================================================================
   phonics.js — shared phonics engine for Mr. Toby's readings.

   Used by any page with a spelling activity (My Words today) and by the
   phonics lessons in /readings/phonics/<rule>/.

   The main job: when a student types a letter that is the RIGHT SOUND but
   the WRONG SPELLING ("bisykle" for "bicycle"), say so. Those letters show
   yellow, not red, and the page can explain the rule behind them.

   Rules are found from each word's own spelling, so no word lists need
   tagging. To add a rule later: add it to PH.RULES and teach PH.letterInfo
   to recognise it.

   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var PH = window.PH = {};

PH.SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
PH.SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';

/* a rule shows up on My Page after this many mix-ups */
PH.ASSIGN_AFTER = 2;

PH.RULES = {
  'c-and-g': {
    title: 'C and G sounds',
    short: 'C says /s/ or /k/. G says /j/ or /g/.',
    url: '/readings/phonics/c-and-g/',
    emoji: '\ud83d\udd24',
    /* activities that count toward finishing the lesson */
    parts: ['sortC', 'sortG', 'look', 'spell'],
    partNames: { sortC:'Sort C', sortG:'Sort G', look:'Look first', say:'Say it', spell:'Spell' }
  }
};

/* hard G even though e, i, or y comes next */
PH.HARD_G = ['get','gets','getting','give','gives','given','forgive','girl','girls','gift','gifts','begin',
  'beginning','tiger','together','forget','target','gear','geese','giggle','gill','finger','hunger','anger',
  'eager','tiger','burger','hamburger','singer','bigger','biggest','foggy','soggy','buggy','doggy','piggy',
  'baggy','muggy','leggings','digging','hugging','logging','jogging','shaggy','geyser','gecko','gynecology'];
/* C that breaks the rule */
PH.C_ODD = ['soccer','cello','celtic','ocean','special','social','delicious','musician','magician'];

function inList(list, word){
  var w = String(word || '').toLowerCase();
  return w.split(/[^a-z]+/).some(function(t){ return list.indexOf(t) > -1; });
}
var SOFT = { e:1, i:1, y:1 };

/* What is this letter doing in this word?
   Returns null for letters no rule covers, or
   { rule, letter, sound, alike:[letters that make the same sound], why } */
PH.letterInfo = function(word, i){
  var T = String(word || ''), c = T.charAt(i).toLowerCase(), nx = T.charAt(i + 1).toLowerCase(), pv = T.charAt(i - 1).toLowerCase();
  if (!c) return null;
  if (c === 'c'){
    if (nx === 'h') return null;                              /* ch is its own sound */
    if (pv === 's' && SOFT[nx]) return null;                 /* science, scissors: sc */
    if (inList(PH.C_ODD, T)) return null;
    if (SOFT[nx]) return { rule:'c-and-g', letter:'c', sound:'s', alike:['s'], next:nx, why:'soft-c' };
    return { rule:'c-and-g', letter:'c', sound:'k', alike:['k'], next:nx, why:'hard-c' };
  }
  if (c === 'g'){
    if (nx === 'h') return null;                              /* ghost, night */
    if (pv === 'n' && !SOFT[nx]) return null;                /* sing, English: ng */
    if (SOFT[nx] && !inList(PH.HARD_G, T)) return { rule:'c-and-g', letter:'g', sound:'j', alike:['j'], next:nx, why:'soft-g' };
    return null;                                              /* hard g: nothing sounds like it */
  }
  /* the other direction: K, S, J where a student might write C or G */
  if (c === 'k' && SOFT[nx]) return { rule:'c-and-g', letter:'k', sound:'k', alike:['c'], next:nx, why:'k-not-c' };
  if (c === 's' && SOFT[nx]) return { rule:'c-and-g', letter:'s', sound:'s', alike:['c'], next:nx, why:'s-not-c' };
  if (c === 'j' && SOFT[nx]) return { rule:'c-and-g', letter:'j', sound:'j', alike:['g'], next:nx, why:'j-not-g' };
  return null;
};

/* Compare what they typed with the word, letter by letter.
   Each position: 'ok', 'bad', 'sound' (right sound, other spelling), or null (empty). */
PH.analyze = function(word, typed){
  var T = String(word || ''), v = String(typed || ''), out = [], i;
  for (i = 0; i < T.length; i++){
    var ch = v.charAt(i);
    if (!ch){ out.push(null); continue; }
    if (ch.toLowerCase() === T.charAt(i).toLowerCase()){ out.push('ok'); continue; }
    var info = PH.letterInfo(T, i);
    out.push(info && info.alike.indexOf(ch.toLowerCase()) > -1 ? 'sound' : 'bad');
  }
  return out;
};

/* ---------------- what to tell them ---------------- */
PH.EXPLAIN = {
  'soft-c': { head:'Good ear! You hear /s/.',
    body:'Here the /s/ sound is spelled with C. C says /s/ when e, i, or y comes next.',
    ex:['city','rice','pencil','bicycle'] },
  'hard-c': { head:'Good ear! You hear /k/.',
    body:'Here the /k/ sound is spelled with C. C says /k/ when a, o, u, or another consonant comes next.',
    ex:['cat','coat','cup','clock'] },
  'soft-g': { head:'Good ear! You hear /j/.',
    body:'Here the /j/ sound is spelled with G. G often says /j/ when e, i, or y comes next.',
    ex:['gym','page','orange','giraffe'] },
  'k-not-c': { head:'Good ear! You hear /k/.',
    body:'Before e, i, or y, we spell the /k/ sound with K. C would say /s/ there.',
    ex:['kite','key','kid','keep'] },
  's-not-c': { head:'Good ear! You hear /s/.',
    body:'C can say /s/ before e, i, or y, so your spelling makes sense. But this word uses S. Look at it and remember it.',
    ex:['sit','see','six','seven'] },
  'j-not-g': { head:'Good ear! You hear /j/.',
    body:'G can say /j/ before e, i, or y, so your spelling makes sense. But this word uses J. Look at it and remember it.',
    ex:['jeans','jelly','jet','jeep'] }
};

/* Notes for each home language: what is the same, what is different.
   Written in simple English; pages translate them on request. */
PH.L1 = {
  'c-and-g': {
    es: 'Good news: in Latin American Spanish, c before e and i also says /s/ (cena, cine), and c before a, o, u says /k/ (casa). English works the same way! G is different. In Spanish, g before e and i is a sound from the throat (gente). In English, g before e, i, or y says /j/, like in "jeans."',
    fr: 'Good news: in French, c before e, i, y says /s/ (ceci), and c before a, o, u says /k/ (café). English works the same way! G before e and i is soft in French too (girafe). But the English sound is /j/, like in "jeans," not the French j.',
    tl: 'In Tagalog, the /k/ sound is usually spelled with k, and the /s/ sound with s. In English, both sounds can be spelled with c. In Tagalog, g always sounds like in "gabi." In English, g before e, i, or y often says /j/, like in "jeans."',
    vi: 'In Vietnamese, c always says /k/ (cá). In English, c says /k/ only before a, o, u, or a consonant. Before e, i, or y, it says /s/. In Vietnamese, "gi" sounds like z or y. In English, "gi" usually says /j/, like in "giraffe."',
    so: 'In Somali, the letter c is a sound from the throat (like in "caano"). In English, c never makes that sound. It says /k/ or /s/. In Somali, g always sounds like in "gabar." In English, g before e, i, or y often says /j/.',
    ru: 'Be careful: the Russian letter С looks like the English c, and it always says /s/. The English c says /s/ only before e, i, or y. Before a, o, u, or a consonant, it says /k/.',
    _other: 'Your language does not use the letters c and g, so this rule is new for you. Here is the trick: look at the next letter. It tells you the sound.'
  }
};
PH.l1Note = function(rule, lang){
  var r = PH.L1[rule]; if (!r) return '';
  if (!lang) return '';
  return r[lang] || r._other;
};

/* ---------------- saving ---------------- */
function sb(path, opts){
  opts = opts || {};
  var h = { apikey:PH.SUPA_KEY, Authorization:'Bearer ' + PH.SUPA_KEY, 'Content-Type':'application/json' };
  if (opts.prefer) h.Prefer = opts.prefer;
  return fetch(PH.SUPA_URL + '/rest/v1/' + path, { method:opts.method || 'GET', headers:h,
    body:opts.body ? JSON.stringify(opts.body) : undefined })
  .then(function(r){
    if (!r.ok) return r.text().then(function(t){ console.warn('PH', path, r.status, t); return null; });
    return r.text().then(function(t){ return t ? JSON.parse(t) : []; });
  }).catch(function(e){ console.warn('PH', e); return null; });
}
PH.sb = sb;
function variants(e){
  e = String(e || '').trim().toLowerCase();
  var lp = e.split('@')[0], out = [e];
  if (/@(s\.)?sfusd\.edu$/.test(e)){ out.push(lp + '@s.sfusd.edu'); out.push(lp + '@sfusd.edu'); }
  return out.filter(function(x, i){ return x && out.indexOf(x) === i; });
}
function inEmails(e){
  return 'email=in.(' + encodeURIComponent(variants(e).map(function(x){ return '"' + x + '"'; }).join(',')) + ')';
}
/* one mix-up: which rule, which word, what they typed */
PH.logHit = function(email, info, word, typed, source){
  if (!email || !info) return;
  sb('phonics_hits', { method:'POST', prefer:'return=minimal', body:[{
    email:email, rule:info.rule, why:info.why, word:word, typed:typed, source:source || '',
    created_at:new Date().toISOString() }] });
};
PH.loadHits = function(email){ return sb('phonics_hits?' + inEmails(email) + '&select=rule,why,word,typed,source,created_at&order=created_at.desc&limit=200'); };
PH.loadWork = function(email){ return sb('phonics_work?' + inEmails(email) + '&select=rule,scores,updated_at'); };

/* Which rules should this student practice, and how far along are they?
   A rule is assigned after ASSIGN_AFTER mix-ups, or once they have started it. */
PH.assigned = function(hits, work){
  var by = {};
  (hits || []).forEach(function(h){
    var o = by[h.rule] = by[h.rule] || { rule:h.rule, hits:[], scores:{} };
    if (!o.hits.some(function(x){ return x.word === h.word && x.typed === h.typed; })) o.hits.push(h);
  });
  (work || []).forEach(function(w){
    var o = by[w.rule] = by[w.rule] || { rule:w.rule, hits:[], scores:{} };
    var s = w.scores || {};
    Object.keys(s).forEach(function(k){ o.scores[k] = Math.max(o.scores[k] || 0, s[k] || 0); });
    o.started = true;
  });
  return Object.keys(by).map(function(k){ return by[k]; }).filter(function(o){
    return PH.RULES[o.rule] && (o.started || o.hits.length >= PH.ASSIGN_AFTER);
  }).map(function(o){
    var R = PH.RULES[o.rule];
    o.done = R.parts.filter(function(p){ return (o.scores[p] || 0) >= 80; }).length;
    o.total = R.parts.length;
    o.complete = o.done === o.total;
    return o;
  });
};

})();
