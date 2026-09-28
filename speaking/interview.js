/* =====================================================================
   interview.js — the partner interview engine.
   A lesson page defines LESSON = {slug, items:[...]} and loads
   speak-core.js, then this file.

   One Chromebook, two students. The owner signs in, picks a classmate
   from the roster, picks a question. The asker records the question,
   the classmate records the answer. Every recording is saved under the
   email of the person who SPOKE it, so both students get their own copy.

   Public feedback is kind on purpose: close-enough speech snaps to the
   clean sentence, a weak try gets ONE friendly "try once more," and the
   second try is always accepted. Detailed feedback lives on My Speaking.

   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var $ = GS.$, esc = GS.esc;
var S = {me:null, partner:null, item:null, round:1, asker:null, answerer:null, lines:[], exchange:'', chosen:null, busy:false};
var PANELS = ['pSign','pPartner','pPick','pTalk'];
var PRAISE = ['Nice!','Great!','Clear!','Good job!','Got it!'];
var ACCEPT = 0.6;   /* close enough to snap to the sentence */
var SHOW   = 0.35;  /* below this on the last try, show nothing we are unsure of */

function show(id){
  PANELS.forEach(function(p){ $(p).classList.toggle('hide', p !== id); });
  window.scrollTo(0, 0);
  GS.rewrap();
  GS.showDirections();
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
$('goPick').addEventListener('click', function(){ renderPick(); show('pPick'); });
$('newPartner').addEventListener('click', function(){ $('goPartner').click(); });

function pairHtml(){
  return '<span class="chip a"><b>' + esc(GS.firstName(S.me.name)) + '</b> (you)</span>' +
    '<span class="amp">and</span>' +
    '<span class="chip b"><b>' + esc(GS.firstName(S.partner.name)) + '</b></span>';
}

/* ---------------- pick a question ---------------- */
function renderPick(){
  $('pairTop').innerHTML = pairHtml();
  var prog = getProg(), pf = GS.firstName(S.partner.name), have = '', be = '';
  LESSON.items.forEach(function(it, i){
    var done = prog[it.id] || [];
    var withNow = done.indexOf(pf) > -1;
    var h = '<button class="qcard' + (done.length ? ' done' : '') + (withNow ? ' now' : '') + '" data-i="' + i + '">' +
      '<span class="qn">' + (i + 1) + '</span>' +
      '<span class="qt" translate="no" data-tap="1">' + esc(it.q) + '</span>' +
      (done.length ? '<span class="qd">\u2713 ' + esc(done.join(', ')) + '</span>' : '') + '</button>';
    if (it.grp === 'have') have += h; else be += h;
  });
  $('gridHave').innerHTML = have; $('gridBe').innerHTML = be;
  GS.rewrap();
}
document.addEventListener('click', function(e){
  var c = e.target.closest('.qcard'); if (!c || e.target.closest('.wt-bub')) return;
  if (document.body.classList.contains('tap-on') && e.target.closest('.wt-tap')) return;
  startItem(LESSON.items[+c.getAttribute('data-i')]);
});

/* ---------------- the interview ---------------- */
function startItem(it){
  S.item = it; S.round = 1;
  S.asker = S.me; S.answerer = S.partner;
  buildScript();
  show('pTalk');
}
function buildScript(){
  flushAll();
  S.lines = []; S.chosen = null; S.exchange = GS.uid();
  $('script').innerHTML = '';
  $('endBar').classList.add('hide'); $('endBar').innerHTML = '';
  $('pairTalk').innerHTML =
    '<span class="chip a"><b>' + esc(GS.firstName(S.asker.name)) + '</b> asks</span>' +
    '<span class="amp">and</span>' +
    '<span class="chip b"><b>' + esc(GS.firstName(S.answerer.name)) + '</b> answers</span>' +
    '<span class="qnum">Question ' + (LESSON.items.indexOf(S.item) + 1) + '</span>';
  addLine({role:'ask', no:1, speaker:S.asker, other:S.answerer, cls:'a', verb:'asks',
    text:S.item.q, targets:[S.item.q], hint:'say the question.'});
  addLine({role:'answer', no:2, speaker:S.answerer, other:S.asker, cls:'b', verb:'answers',
    choices:S.item.a, targets:S.item.a.map(function(x){ return x[0]; }), hint:'say your answer.'});
  if (!GS.canRecognize){
    var w = document.createElement('p'); w.className = 'warn';
    w.textContent = 'This browser cannot turn speech into words. Use Chrome. Your voice still saves.';
    $('script').insertBefore(w, $('script').firstChild);
  }
  GS.rewrap(); GS.showDirections();
  S.lines[0].el.querySelector('.mic').focus({preventScroll:true});
}

var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function addLine(cfg){
  var L = {cfg:cfg, attempts:0, done:false, held:null, url:''};
  var el = document.createElement('div');
  el.className = 'line ' + cfg.cls;
  var first = esc(GS.firstName(cfg.speaker.name));
  var h = '<div class="tag"><span class="nm">' + first + '</span> ' + cfg.verb + '</div>';
  if (cfg.text){
    h += '<div class="say"><span class="txt" translate="no" data-tap="1">' + esc(cfg.text) + '</span>' + ears(cfg.text) + '</div>';
  }
  if (cfg.choices){
    h += '<ul class="choices">';
    cfg.choices.forEach(function(c, i){
      var t = c[0], shown = esc(t).replace(/_+/g, '<span class="blank">&nbsp;</span>');
      h += '<li data-c="' + i + '"><span class="ico">' + icon(c[1]) + '</span>' +
        '<span class="txt" translate="no" data-tap="1">' + shown + '</span>' + ears(t) + '</li>';
    });
    h += '</ul>';
  }
  h += '<div class="slot"><button class="mic" aria-label="Record ' + first + '">' + MIC + '</button>' +
    '<div class="rule"><span class="hint">' + first + ', tap the red button and ' + esc(cfg.hint) + '</span></div></div>' +
    '<div class="nudge hide" aria-live="polite"></div>';
  el.innerHTML = h;
  $('script').appendChild(el);
  L.el = el;
  var rule = el.querySelector('.rule'), mic = el.querySelector('.mic');
  GS.micButton(mic, {
    label:'Record ' + first,
    maxMs: cfg.role === 'why_answer' ? 22000 : 12000,
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

function judge(L, res){
  var first = GS.firstName(L.cfg.speaker.name);
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
  var m = GS.bestMatch(res.alts, L.cfg.targets);
  if (m.score >= ACCEPT || L.attempts >= 2){ accept(L, m, res); return; }
  /* one kind retry */
  L.held = {m:m, res:res};
  var target = L.cfg.targets[m.index] || L.cfg.targets[0];
  if (/_/.test(target)) target = m.display;
  var heardN = GS.tokens(m.heard).length, needN = GS.tokens(target).length;
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

function accept(L, m, res){
  L.done = true; L.held = null;
  saveRow(L, m, res, true);
  var show = null;
  if (m && m.score >= SHOW) show = m.display;
  else if (L.cfg.role === 'ask' || L.cfg.role === 'why_ask') show = L.cfg.targets[0];
  if (L.url) URL.revokeObjectURL(L.url);
  L.url = res.blob ? URL.createObjectURL(res.blob) : '';
  var rule = L.el.querySelector('.rule');
  rule.innerHTML = (show ? '<span class="said" translate="no"></span>' : '<span class="saved">Saved. Hear it on My Speaking.</span>') +
    '<span class="ok">' + PRAISE[Math.floor(Math.random() * PRAISE.length)] + '</span>';
  if (show) typeInto(rule.querySelector('.said'), show);
  var n = L.el.querySelector('.nudge');
  n.innerHTML = (L.url ? '<button class="linkish hear">\u25b6 Hear yourself</button>' : '') +
    '<button class="linkish again">Record again</button>';
  n.classList.remove('hide');
  if (L.url) n.querySelector('.hear').addEventListener('click', function(){ new Audio(L.url).play(); });
  n.querySelector('.again').addEventListener('click', function(){
    L.attempts = 1;   /* a voluntary redo is always accepted, no second prompt */
    L.el.querySelector('.mic').click();
  });
  L.el.classList.add('fin');
  if (L.cfg.role === 'answer'){
    S.chosen = show;
    Array.prototype.forEach.call(L.el.querySelectorAll('.choices li'), function(li){ li.classList.remove('picked'); });
    if (m && m.score >= SHOW){ var li = L.el.querySelector('.choices li[data-c="' + m.index + '"]'); if (li) li.classList.add('picked'); }
  }
  afterLine(L);
}

function afterLine(L){
  var i = S.lines.indexOf(L), next = S.lines[i + 1];
  if (next && !next.done){
    next.el.scrollIntoView({behavior:'smooth', block:'center'});
    next.el.querySelector('.mic').focus({preventScroll:true});
  }
  if (S.lines[1] && S.lines[1].done) drawEnd();
}

function whyAdj(){
  var c = String(S.chosen || '').replace(/^I am\s+/i, '').replace(/[.!?]+$/, '').trim();
  return c || '___';
}
function addWhy(){
  var adj = whyAdj();
  var frame = 'I am ' + adj + ' because ___.';
  addLine({role:'why_ask', no:3, speaker:S.asker, other:S.answerer, cls:'a', verb:'asks',
    text:'Why?', targets:['Why?', 'Why are you ' + adj + '?'], hint:'say \u201cWhy?\u201d'});
  var L = addLine({role:'why_answer', no:4, speaker:S.answerer, other:S.asker, cls:'b', verb:'explains',
    choices:[[frame, '\ud83d\udca1']], targets:[frame, 'Because ___.'], hint:'say your reason with \u201cbecause.\u201d'});
  GS.rewrap(); GS.showDirections();
  S.lines[2].el.scrollIntoView({behavior:'smooth', block:'center'});
  drawEnd();
}

function drawEnd(){
  var bar = $('endBar'), a = GS.firstName(S.asker.name), b = GS.firstName(S.answerer.name);
  if (S.round === 1) markDone(S.item.id, GS.firstName(S.partner.name));
  var h = '';
  if (S.item.why && S.lines.length === 2) h += '<button class="side" id="btnWhy">Ask \u201cWhy?\u201d (extra)</button>';
  if (S.round === 1){
    h += '<button class="big" id="btnSwitch">Switch: now ' + esc(b) + ' asks ' + esc(a) + '</button>';
    h += '<button class="quiet" id="btnSkip">Skip switching</button>';
  } else {
    h += '<button class="big" id="btnNextMate">Talk to the next classmate</button>';
    h += '<button class="quiet" id="btnSameMate">Ask ' + esc(GS.firstName(S.partner.name)) + ' a new question</button>';
  }
  bar.innerHTML = h; bar.classList.remove('hide');
  var w = $('btnWhy'); if (w) w.addEventListener('click', function(){ w.remove(); addWhy(); });
  var sw = $('btnSwitch'); if (sw) sw.addEventListener('click', function(){
    S.round = 2; var t = S.asker; S.asker = S.answerer; S.answerer = t; buildScript();
    window.scrollTo({top:0, behavior:'smooth'});
  });
  var sk = $('btnSkip'); if (sk) sk.addEventListener('click', function(){ flushAll(); renderPick(); show('pPick'); });
  var nm = $('btnNextMate'); if (nm) nm.addEventListener('click', function(){ flushAll(); $('goPartner').click(); });
  var sm = $('btnSameMate'); if (sm) sm.addEventListener('click', function(){ flushAll(); renderPick(); show('pPick'); });
}

/* ---------------- saving ---------------- */
function saveRow(L, m, res, accepted){
  var c = L.cfg, alts = (res && res.alts) || [];
  var tgt = m ? (c.targets[m.index] || c.targets[0]) : c.targets[0];
  var row = {
    activity: LESSON.slug, item_id: S.item.id, exchange_id: S.exchange, round: S.round,
    line_no: c.no, role: c.role,
    email: c.speaker.email, speaker_name: c.speaker.name,
    partner_email: c.other.email, partner_name: c.other.name,
    period: S.me.period, device_email: S.me.email,
    target_text: tgt,
    said_text: (m && m.score >= SHOW) ? m.display : null,
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
