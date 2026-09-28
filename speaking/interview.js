/* =====================================================================
   interview.js — the partner interview engine.
   A lesson page defines LESSON = {slug, items:[...]} and loads
   speak-core.js, then this file.

   One Chromebook, two students. The owner signs in, picks a classmate
   from the roster, picks a question (skipped when the lesson has only
   one). Each line is recorded by the student who says it and saved
   under THAT student's email, so both students get their own copy.

   Public feedback is kind on purpose: close-enough speech snaps to the
   clean sentence, a weak try gets ONE friendly "try once more," and the
   second try is always accepted. Detailed feedback lives on My Speaking.

   ITEM FORMATS
   Short form (question + answers):
     {id, grp, q:'Are you tall or short?', a:[['I am tall.','emoji'],...], why:true}
   Long form (any number of lines):
     {id, title, lines:[LINE,...], more:{label, lines:[LINE,...], reset:['word']}}
   LINE:
     who:'A' (asker) or 'B' (answerer)
     say:'text'                 one sentence to say (can use {tokens})
     choices:[['text','icon'],...]  pick-one sentences; ___ = student fills in
     also:['text',...]          other sentences that also count
     bank:{words:[...], sets:'word', say:'I speak {x}.'}  tappable word chips
     capture:{name:'lang', re:'^I speak (.+?)(?: and .*)?$'}  keep a piece of the answer
     translate:'word'           fill the last ___ with {word} translated into {lang}
     spell:true                 letters mode (for spelling names)
     role, verb, hint, long
   TOKENS: {A} {B} first names, {Aspell} {Bspell} L-I-N-H, {Ainit} {Binit},
     plus anything captured or set by a word bank ({lang}, {word}, {adj}...).

   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var $ = GS.$, esc = GS.esc;
var S = {me:null, partner:null, item:null, round:1, asker:null, answerer:null, lines:[], exchange:'', vars:{}, moreUsed:0};
var PANELS = ['pSign','pPartner','pPick','pTalk'];
var PRAISE = ['Nice!','Great!','Clear!','Good job!','Got it!'];
var ACCEPT = 0.6;   /* close enough to snap to the sentence */
var SHOW   = 0.35;  /* below this on the last try, show nothing we are unsure of */
var SINGLE = LESSON.items.length === 1;

function show(id){
  PANELS.forEach(function(p){ $(p).classList.toggle('hide', p !== id); });
  window.scrollTo(0, 0);
  GS.rewrap();
  GS.showDirections();
}

/* ---------------- short form -> long form ---------------- */
function linesOf(it){
  if (it.lines) return it;
  var out = {id:it.id, grp:it.grp, q:it.q, lines:[
    {who:'A', say:it.q, hint:'say the question.'},
    {who:'B', choices:it.a, hint:'say your answer.', capture:{name:'adj', re:'^I am (.+?)[.!?]*$'}}
  ]};
  if (it.why) out.more = {label:'Ask \u201cWhy?\u201d (extra)', once:true, lines:[
    {who:'A', role:'why_ask', say:'Why?', also:['Why are you {adj}?'], hint:'say \u201cWhy?\u201d'},
    {who:'B', role:'why_answer', verb:'explains', choices:[['I am {adj} because ___.','\ud83d\udca1']], also:['Because ___.'],
     long:true, hint:'say your reason with \u201cbecause.\u201d'}
  ]};
  return out;
}

/* ---------------- progress on this device ---------------- */
function progKey(){ return 'gs_prog_' + LESSON.slug + '_' + (S.me ? S.me.email : ''); }
function getProg(){ try { return JSON.parse(localStorage.getItem(progKey()) || '{}'); } catch(e){ return {}; } }
function markDone(itemId, name){
  var p = getProg(); p[itemId] = p[itemId] || [];
  if (p[itemId].indexOf(name) < 0) p[itemId].push(name);
  try { localStorage.setItem(progKey(), JSON.stringify(p)); } catch(e){}
}

/* ---------------- pictures ---------------- */
function head(hairColor, len){
  var sides = '';
  if (len === 'medium') sides = '<path d="M8 20 L7 31 L13 31 L13 20Z M32 20 L33 31 L27 31 L27 20Z" fill="' + hairColor + '"/>';
  if (len === 'long')   sides = '<path d="M8 20 L6 39 L14 39 L13 20Z M32 20 L34 39 L26 39 L27 20Z" fill="' + hairColor + '"/>';
  return '<svg viewBox="0 0 40 40" aria-hidden="true">' + sides +
    '<circle cx="20" cy="22" r="11" fill="#f0c8a0"/>' +
    '<path d="M8 22 C7 7 33 7 32 22 C28 15 12 15 8 22Z" fill="' + hairColor + '"/></svg>';
}
function icon(spec){
  if (!spec) return '';
  var k = spec.split(':')[0], v = spec.slice(k.length + 1);
  if (k === 'sw')  return head(v, 'medium');
  if (k === 'len') return head('#5a3a22', v);
  if (k === 'eye') return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M3 20 Q20 5 37 20 Q20 35 3 20Z" fill="#fff" stroke="#39425e" stroke-width="2"/>' +
    '<circle cx="20" cy="20" r="7.5" fill="' + v + '"/><circle cx="20" cy="20" r="3" fill="#111"/><circle cx="22" cy="18" r="1.3" fill="#fff"/></svg>';
  if (k === 'tex'){
    var d = '';
    if (v === 'straight') d = '<path d="M10 5 V35 M20 5 V35 M30 5 V35"/>';
    if (v === 'wavy')     d = '<path d="M10 5 q6 5 0 10 q-6 5 0 10 q6 5 0 10 M20 5 q6 5 0 10 q-6 5 0 10 q6 5 0 10 M30 5 q6 5 0 10 q-6 5 0 10 q6 5 0 10"/>';
    if (v === 'curly')    d = '<g><circle cx="10" cy="10" r="4"/><circle cx="10" cy="20" r="4"/><circle cx="10" cy="30" r="4"/><circle cx="20" cy="10" r="4"/><circle cx="20" cy="20" r="4"/><circle cx="20" cy="30" r="4"/><circle cx="30" cy="10" r="4"/><circle cx="30" cy="20" r="4"/><circle cx="30" cy="30" r="4"/></g>';
    return '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="#5a3a22" stroke-width="3" stroke-linecap="round">' + d + '</svg>';
  }
  return '<span class="emo" aria-hidden="true">' + spec + '</span>';
}

var EAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function ears(text){
  return '<span class="ears"><button class="ear" data-say="' + esc(text) + '" aria-label="Listen">' + EAR + '<span>Listen</span></button>' +
    '<button class="ear slow" data-say="' + esc(text) + '" data-slow="1" aria-label="Listen slowly">Slow</button></span>';
}
document.addEventListener('click', function(e){
  var b = e.target.closest('[data-say]'); if (!b) return;
  GS.say(b.getAttribute('data-say'), !!b.getAttribute('data-slow'), b);
});

/* ---------------- tokens ---------------- */
function spellOf(name){ return GS.firstName(name).replace(/[^A-Za-z]/g, '').toUpperCase().split('').join('-'); }
function setPeople(){
  var a = GS.firstName(S.asker.name), b = GS.firstName(S.answerer.name);
  S.vars.A = a; S.vars.B = b;
  S.vars.Aspell = spellOf(a); S.vars.Bspell = spellOf(b);
  S.vars.Ainit = S.vars.Aspell.charAt(0); S.vars.Binit = S.vars.Bspell.charAt(0);
}
function fill(t){
  return String(t == null ? '' : t).replace(/\{(\w+)\}/g, function(_, k){ return S.vars[k] || '___'; });
}

/* ---------------- sign in ---------------- */
function onSigned(me){
  S.me = me;
  $('goPartner').disabled = false;
  $('meName').textContent = GS.firstName(me.name);
}
$('goPartner').addEventListener('click', function(){
  if (!GS.ME) return;
  S.me = GS.ME;
  GS.fillNames($('ptWho'), S.me.period, S.me.email, 'Choose a name');
  if (!GS.rosterFor(S.me.period).length){ $('ptWho').value = '__other'; $('ptMailBox').classList.remove('hide'); }
  S.partner = null; $('goPick').disabled = true; $('ptMsg').textContent = '';
  show('pPartner');
});
$('backSign').addEventListener('click', function(){ show('pSign'); });
if (SINGLE) $('goPick').textContent = 'Start';

/* ---------------- partner ---------------- */
function setPartner(email, name){
  S.partner = {email:email, name:name};
  $('ptMsg').textContent = '\u2713 ' + name;
  $('goPick').disabled = false;
}
$('ptWho').addEventListener('change', function(){
  var v = $('ptWho').value;
  S.partner = null; $('goPick').disabled = true; $('ptMsg').textContent = '';
  if (v === '__other'){ $('ptMailBox').classList.remove('hide'); $('ptMail').focus(); return; }
  $('ptMailBox').classList.add('hide');
  if (!v) return;
  var r = GS.findByEmail(v);
  setPartner(GS.cleanMail(v), r ? GS.displayName(r) : v);
});
function partnerMail(){
  var raw = GS.cleanMail($('ptMail').value);
  if (!raw) return;
  if (!GS.validMail(raw)){ $('ptMsg').textContent = 'Use their school email (@s.sfusd.edu).'; return; }
  var c = GS.canonMail(raw);
  if (c === S.me.email){ $('ptMsg').textContent = 'That is your email. Type your classmate\u2019s email.'; return; }
  GS.recordAlias(raw, c);
  var r = GS.findByEmail(c);
  var nm = r ? GS.displayName(r) : GS.localPart(c).replace(/[._]/g, ' ');
  GS.seedStudent(nm, c, S.me.period);
  $('ptMail').value = c;
  setPartner(c, nm);
}
$('ptMail').addEventListener('change', partnerMail);
$('ptMail').addEventListener('blur', partnerMail);
$('goPick').addEventListener('click', function(){
  if (SINGLE){ startItem(LESSON.items[0]); return; }
  renderPick(); show('pPick');
});
$('newPartner').addEventListener('click', function(){ $('goPartner').click(); });

function pairHtml(){
  return '<span class="chip a"><b>' + esc(GS.firstName(S.me.name)) + '</b> (you)</span>' +
    '<span class="amp">and</span>' +
    '<span class="chip b"><b>' + esc(GS.firstName(S.partner.name)) + '</b></span>';
}

/* ---------------- pick a question ---------------- */
function renderPick(){
  $('pairTop').innerHTML = pairHtml();
  var prog = getProg(), pf = GS.firstName(S.partner.name), groups = {}, order = [];
  LESSON.items.forEach(function(it, i){
    var done = prog[it.id] || [];
    var withNow = done.indexOf(pf) > -1;
    var h = '<button class="qcard' + (done.length ? ' done' : '') + (withNow ? ' now' : '') + '" data-i="' + i + '">' +
      '<span class="qn">' + (i + 1) + '</span>' +
      '<span class="qt" translate="no" data-tap="1">' + esc(it.title || it.q) + '</span>' +
      (done.length ? '<span class="qd">\u2713 ' + esc(done.join(', ')) + '</span>' : '') + '</button>';
    var g = it.grp || 'all';
    if (!groups[g]){ groups[g] = ''; order.push(g); }
    groups[g] += h;
  });
  if ($('gridHave')){
    $('gridHave').innerHTML = groups.have || '';
    $('gridBe').innerHTML = groups.be || '';
    if (groups.all) $('gridHave').innerHTML += groups.all;
  }
  GS.rewrap();
}
document.addEventListener('click', function(e){
  var c = e.target.closest('.qcard'); if (!c || e.target.closest('.wt-bub')) return;
  if (document.body.classList.contains('tap-on') && e.target.closest('.wt-tap')) return;
  startItem(LESSON.items[+c.getAttribute('data-i')]);
});

/* ---------------- the interview ---------------- */
function startItem(it){
  S.item = linesOf(it); S.round = 1;
  S.asker = S.me; S.answerer = S.partner;
  buildScript();
  show('pTalk');
}
function buildScript(){
  flushAll();
  S.lines = []; S.vars = {}; S.exchange = GS.uid(); S.moreUsed = 0;
  setPeople();
  $('script').innerHTML = '';
  $('endBar').classList.add('hide'); $('endBar').innerHTML = '';
  var label = SINGLE ? '' : '<span class="qnum">Question ' + (LESSON.items.map(function(x){ return x.id; }).indexOf(S.item.id) + 1) + '</span>';
  $('pairTalk').innerHTML =
    '<span class="chip a"><b>' + esc(S.vars.A) + '</b> starts</span>' +
    '<span class="amp">and</span>' +
    '<span class="chip b"><b>' + esc(S.vars.B) + '</b> answers</span>' + label;
  S.item.lines.forEach(function(spec){ addLine(spec); });
  if (!GS.canRecognize){
    var w = document.createElement('p'); w.className = 'warn';
    w.textContent = 'This browser cannot turn speech into words. Use Chrome. Your voice still saves.';
    $('script').insertBefore(w, $('script').firstChild);
  }
  GS.rewrap(); GS.showDirections();
  S.lines[0].el.querySelector('.mic').focus({preventScroll:true});
}

var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function speakerOf(spec){ return spec.who === 'A' ? S.asker : S.answerer; }
function otherOf(spec){ return spec.who === 'A' ? S.answerer : S.asker; }
function targetsOf(L){
  var sp = L.spec, t = [];
  if (sp.say) t.push(sp.say);
  (sp.choices || []).forEach(function(c){ t.push(c[0]); });
  (sp.also || []).forEach(function(x){ t.push(x); });
  return t.map(fill);
}

function promptHtml(L){
  var sp = L.spec, h = '';
  if (sp.say){
    var t = fill(sp.say);
    h += '<div class="say"><span class="txt" translate="no" data-tap="1">' + esc(t).replace(/_{3,}/g, '<span class="blank">&nbsp;</span>') + '</span>' + ears(t) + '</div>';
  }
  if (sp.choices){
    h += '<ul class="choices">';
    sp.choices.forEach(function(c, i){
      var t = fill(c[0]), shown = esc(t).replace(/_{3,}/g, '<span class="blank">&nbsp;</span>');
      h += '<li data-c="' + i + '"><span class="ico">' + icon(c[1]) + '</span>' +
        '<span class="txt" translate="no" data-tap="1">' + shown + '</span>' + ears(t) + '</li>';
    });
    h += '</ul>';
  }
  if (sp.bank){
    var cur = sp.bank.sets ? S.vars[sp.bank.sets] : '';
    h += '<div class="bank" translate="no">' + (sp.bank.label ? '<span class="banklbl">' + esc(sp.bank.label) + '</span>' : '');
    sp.bank.words.forEach(function(w){
      h += '<button class="bw' + (cur === w ? ' on' : '') + '" data-w="' + esc(w) + '">' + esc(w) + '</button>';
    });
    h += '</div>';
  }
  return h;
}
function refreshPrompts(){
  S.lines.forEach(function(L){
    if (L.done) return;
    L.el.querySelector('.prompt').innerHTML = promptHtml(L);
    var hint = L.el.querySelector('.rule .hint');
    if (hint && !L.held) hint.textContent = GS.firstName(L.speaker.name) + ', tap the red button and ' + (L.spec.hint || 'say your sentence.');
  });
  GS.rewrap();
}

function addLine(spec){
  var L = {spec:spec, attempts:0, done:false, held:null, url:'', no:S.lines.length + 1,
    speaker:speakerOf(spec), other:otherOf(spec),
    role:spec.role || (spec.who === 'A' ? 'ask' : 'answer')};
  var el = document.createElement('div');
  el.className = 'line ' + (spec.who === 'A' ? 'a' : 'b');
  var first = esc(GS.firstName(L.speaker.name));
  el.innerHTML = '<div class="tag"><span class="nm">' + first + '</span> ' + (spec.verb || (spec.who === 'A' ? 'asks' : 'answers')) + '</div>' +
    '<div class="prompt">' + promptHtml(L) + '</div>' +
    '<div class="slot"><button class="mic" aria-label="Record ' + first + '">' + MIC + '</button>' +
    '<div class="rule"><span class="hint">' + first + ', tap the red button and ' + esc(spec.hint || 'say your sentence.') + '</span></div></div>' +
    '<div class="nudge hide" aria-live="polite"></div>';
  $('script').appendChild(el);
  L.el = el;
  el.addEventListener('click', function(e){
    var b = e.target.closest('.bw'); if (!b || L.done) return;
    var w = b.getAttribute('data-w'), bk = spec.bank;
    if (bk.sets){ S.vars[bk.sets] = w; refreshPrompts(); }
    if (bk.say) GS.say(fill(bk.say.replace('{x}', w)));
  });
  var rule = el.querySelector('.rule'), mic = el.querySelector('.mic');
  GS.micButton(mic, {
    label:'Record ' + first,
    maxMs: spec.long ? 22000 : 12000,
    onStart:function(){
      if (L.held){ saveRow(L, L.held.m, L.held.res, false); L.held = null; }
      el.querySelector('.nudge').classList.add('hide');
      rule.innerHTML = '<span class="listening">Listening\u2026 tap again when you finish.</span><span class="interim"></span>';
      el.classList.add('rec');
      S.lines.forEach(function(o){ if (o !== L) o.el.querySelector('.mic').disabled = true; });
    },
    onInterim:function(t){ var s = rule.querySelector('.interim'); if (s) s.textContent = t; },
    onDone:function(res){
      el.classList.remove('rec');
      S.lines.forEach(function(o){ o.el.querySelector('.mic').disabled = false; });
      judge(L, res);
    }
  });
  S.lines.push(L);
  return L;
}

function nudge(L, html){
  var n = L.el.querySelector('.nudge');
  n.innerHTML = html; n.classList.remove('hide');
  GS.rewrap();
}
function resetRule(L, text){
  L.el.querySelector('.rule').innerHTML = '<span class="hint">' + esc(text) + '</span>';
}

function matchOpts(L){
  if (!L.spec.spell) return null;
  return {spell:true, expand:[S.vars.A, S.vars.B].map(function(x){ return String(x || '').toLowerCase(); })};
}

function judge(L, res){
  if (res.error === 'not-allowed' || res.error === 'nomic' || res.error === 'service-not-allowed'){
    resetRule(L, 'The microphone is off.');
    nudge(L, '<p>Click the lock next to the web address. Set <b>Microphone</b> to <b>Allow</b>. Then try again.</p>');
    return;
  }
  L.attempts++;
  if (!GS.canRecognize){ accept(L, null, res); return; }
  if (!res.alts.length){
    if (L.attempts < 2){
      saveRow(L, null, res, false);
      resetRule(L, 'I did not hear you.');
      nudge(L, '<p>Hold the Chromebook closer and speak a little louder. Tap the red button again.</p>');
      return;
    }
    accept(L, null, res); return;
  }
  var targets = targetsOf(L);
  var m = GS.bestMatch(res.alts, targets, matchOpts(L));
  m.target = targets[m.index] || targets[0];
  if (m.score >= ACCEPT || L.attempts >= 2){ accept(L, m, res); return; }
  /* one kind retry */
  L.held = {m:m, res:res};
  var target = /_{3,}/.test(m.target) ? m.display : m.target;
  var heardN = GS.tokens(m.heard, matchOpts(L)).length, needN = GS.tokens(target, matchOpts(L)).length;
  var tip = heardN < needN - 1 ? 'Say the whole sentence.' : 'Almost! Listen, then try one more time.';
  resetRule(L, tip);
  nudge(L, '<p class="tipline"><span class="txt" translate="no" data-tap="1">' + esc(target) + '</span>' + ears(target) + '</p>' +
    '<p class="small">Tap the red button to try again, or <button class="linkish keep">keep this one</button>.</p>');
  L.el.querySelector('.keep').addEventListener('click', function(){
    var h = L.held; L.held = null;
    if (h) accept(L, h.m, h.res);
  });
}

function typeInto(el, text){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){ el.textContent = text; return; }
  var i = 0; el.textContent = '';
  var t = setInterval(function(){
    i++; el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(t);
  }, 24);
}

/* keep a piece of what was said, for later lines */
function capture(L, text){
  var c = L.spec.capture; if (!c || !text) return;
  var m = String(text).match(new RegExp(c.re, 'i'));
  if (!m || !m[1] || /_{3,}/.test(m[1])) return;
  var v = m[1].trim().replace(/[.!?]+$/, '');
  if (c.cap) v = v.replace(/\b[a-z]/g, function(x){ return x.toUpperCase(); });
  S.vars[c.name] = v;
  if (c.name === 'lang') S.vars.langCode = GS.langCode(v);
}

function accept(L, m, res){
  L.done = true; L.held = null;
  var shown = null;
  if (m && m.score >= SHOW) shown = m.display;
  else if (L.spec.say && !/_{3,}/.test(fill(L.spec.say))) shown = fill(L.spec.say);
  if (m && m.score >= SHOW){
    /* a line with only one sentence shows that sentence, names spelled right */
    if (!/_{3,}/.test(m.target)) shown = m.target;
  }
  if (shown) capture(L, shown);
  if (shown && L.spec.capture && L.spec.capture.cap){
    shown = shown.replace(/\b(spanish|cantonese|mandarin|chinese|arabic|vietnamese|russian|urdu|tagalog|filipino|french|korean|hindi|somali|nepali|thai|mam|english|portuguese|japanese|darija|punjabi|ukrainian|farsi|dari|pashto|tigrinya|amharic|turkish|bengali)\b/gi,
      function(w){ return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });
  }
  var rule = L.el.querySelector('.rule');
  if (L.url) URL.revokeObjectURL(L.url);
  L.url = res.blob ? URL.createObjectURL(res.blob) : '';
  rule.innerHTML = (shown ? '<span class="said" translate="no"></span>' : '<span class="saved">Saved. Hear it on My Speaking.</span>') +
    '<span class="ok">' + PRAISE[Math.floor(Math.random() * PRAISE.length)] + '</span>';
  var n = L.el.querySelector('.nudge');
  n.innerHTML = (L.url ? '<button class="linkish hear">\u25b6 Hear yourself</button>' : '') +
    '<button class="linkish again">Record again</button>';
  n.classList.remove('hide');
  if (L.url) n.querySelector('.hear').addEventListener('click', function(){ new Audio(L.url).play(); });
  n.querySelector('.again').addEventListener('click', function(){
    L.attempts = 1;   /* a voluntary redo is always accepted, no second prompt */
    L.done = false;
    L.el.querySelector('.mic').click();
  });
  L.el.classList.add('fin');
  Array.prototype.forEach.call(L.el.querySelectorAll('.choices li'), function(li){ li.classList.remove('picked'); });
  if (m && m.score >= SHOW && L.spec.choices){
    var ci = m.index - (L.spec.say ? 1 : 0);
    var li = L.el.querySelector('.choices li[data-c="' + ci + '"]'); if (li) li.classList.add('picked');
  }
  var finish = function(text){
    if (text) typeInto(rule.querySelector('.said'), text);
    saveRow(L, m, res, true, text);
    refreshPrompts();
    afterLine(L);
  };
  /* The language line: a Chromebook listening in English cannot spell the
     other language, so the page writes the word in that language itself. */
  if (L.spec.translate && S.vars[L.spec.translate] && S.vars.langCode && S.vars.langCode !== 'en'){
    var frame = fill((L.spec.choices && L.spec.choices[0][0]) || L.spec.say);
    if (rule.querySelector('.said')) rule.querySelector('.said').textContent = '\u2026';
    else rule.innerHTML = '<span class="said" translate="no">\u2026</span>' + rule.innerHTML;
    GS.translate(S.vars[L.spec.translate], S.vars.langCode).then(function(tr){
      finish(tr ? frame.replace(/_{3,}([^_]*)$/, tr + '$1') : shown);
    });
    return;
  }
  if (L.spec.translate && shown && !(S.vars.langCode && S.vars.langCode !== 'en')){
    /* no translator for this language: do not print a guess, the recording is the answer */
    var fr = fill((L.spec.choices && L.spec.choices[0][0]) || L.spec.say);
    if (S.vars.langCode !== 'en') shown = fr.replace(/_{3,}([^_]*)$/, '\u2026$1');
  }
  finish(shown);
}

function afterLine(L){
  var i = S.lines.indexOf(L), next = S.lines[i + 1];
  if (next && !next.done){
    next.el.scrollIntoView({behavior:'smooth', block:'center'});
    next.el.querySelector('.mic').focus({preventScroll:true});
  }
  var core = S.item.lines.length;
  var allCore = S.lines.slice(0, core).every(function(x){ return x.done; });
  if (allCore) drawEnd();
}

function addMore(){
  var mo = S.item.more;
  (mo.reset || []).forEach(function(k){ delete S.vars[k]; });
  S.moreUsed++;
  var firstNew = S.lines.length;
  mo.lines.forEach(function(spec){ addLine(spec); });
  GS.rewrap(); GS.showDirections();
  S.lines[firstNew].el.scrollIntoView({behavior:'smooth', block:'center'});
  drawEnd();
}

function drawEnd(){
  var bar = $('endBar'), a = S.vars.A, b = S.vars.B;
  if (S.round === 1) markDone(S.item.id, GS.firstName(S.partner.name));
  var h = '', mo = S.item.more;
  var lastDone = S.lines[S.lines.length - 1].done;
  if (mo && (!mo.once || !S.moreUsed) && lastDone) h += '<button class="side" id="btnMore">' + esc(mo.label) + '</button>';
  if (S.round === 1){
    h += '<button class="big" id="btnSwitch">Switch: now ' + esc(b) + ' starts</button>';
    h += '<button class="quiet" id="btnSkip">' + (SINGLE ? 'Talk to the next classmate' : 'Skip switching') + '</button>';
  } else {
    h += '<button class="big" id="btnNextMate">Talk to the next classmate</button>';
    if (!SINGLE) h += '<button class="quiet" id="btnSameMate">Ask ' + esc(GS.firstName(S.partner.name)) + ' a new question</button>';
  }
  bar.innerHTML = h; bar.classList.remove('hide');
  var w = $('btnMore'); if (w) w.addEventListener('click', function(){ w.remove(); addMore(); });
  var sw = $('btnSwitch'); if (sw) sw.addEventListener('click', function(){
    S.round = 2; var t = S.asker; S.asker = S.answerer; S.answerer = t; buildScript();
    window.scrollTo({top:0, behavior:'smooth'});
  });
  var sk = $('btnSkip'); if (sk) sk.addEventListener('click', function(){
    flushAll();
    if (SINGLE){ $('goPartner').click(); return; }
    renderPick(); show('pPick');
  });
  var nm = $('btnNextMate'); if (nm) nm.addEventListener('click', function(){ flushAll(); $('goPartner').click(); });
  var sm = $('btnSameMate'); if (sm) sm.addEventListener('click', function(){ flushAll(); renderPick(); show('pPick'); });
}

/* ---------------- saving ---------------- */
function saveRow(L, m, res, accepted, shownText){
  var alts = (res && res.alts) || [], targets = targetsOf(L);
  var row = {
    activity: LESSON.slug, item_id: S.item.id, exchange_id: S.exchange, round: S.round,
    line_no: L.no, role: L.role,
    email: L.speaker.email, speaker_name: L.speaker.name,
    partner_email: L.other.email, partner_name: L.other.name,
    period: S.me.period, device_email: S.me.email,
    target_text: m ? m.target : targets[0],
    said_text: shownText || ((m && m.score >= SHOW) ? m.display : null),
    transcript: m ? m.heard : ((alts[0] && alts[0].t) || null),
    alternatives: alts.slice(0, 5),
    match_score: m ? Math.round(m.score * 1000) / 1000 : null,
    attempt_no: L.attempts, accepted: !!accepted, practice: false,
    seconds: res && res.secs ? Math.round(res.secs * 10) / 10 : null
  };
  GS.saveAttempt(row, res ? res.blob : null);
}
/* a held "try once more" that the student walked away from still gets saved */
function flushAll(){
  S.lines.forEach(function(L){ if (L.held){ saveRow(L, L.held.m, L.held.res, false); L.held = null; } });
}
window.addEventListener('pagehide', flushAll);

GS.onPending = function(n){
  var s = $('saveNote');
  if (n > 0) s.textContent = 'Saving\u2026';
  else if (!GS.saveFailed) s.textContent = 'All recordings saved.';
};
GS.onFail = function(){ $('saveNote').textContent = 'Some recordings did not save. Check the internet, then record again.'; };

GS.initAll(LESSON.slug, onSigned);
})();
