/* Story Reel: "After the story" tiers (A words and voice, B synonyms and details, C paragraph).
   Owned by the tiers chat. Loaded by engine.js after it has set window.REEL_HOST; needs no edits
   to episode pages: it adds its own button, section, styles and the say.js scripts, and reads the
   episode's tier data from EP.tiers or from ./tiers-data.js (window.EP_TIERS) beside the episode.
   Contract with the engine (window.REEL_HOST): EP, state, me, $, esc, txt, save, touch, score,
   wordPop, showDirections, spokenWord, pickVoice, boardState, R, PROXY, SUPA_URL, TABLE, sbHead.
   The engine calls: REEL_TIERS.show(scroll) after Your Turn renders, REEL_TIERS.setTier(v) after load,
   REEL_TIERS.poll() after a good save, REEL_TIERS.refresh() on level/language change, and adds
   REEL_TIERS.scores() -> {pts, max, out} into GAL_SCORE / GAL_MAX / the scores payload. */
(function () {
  'use strict';
  var H = window.REEL_HOST;
  if (!H) { console.warn('tiers.js: window.REEL_HOST missing; engine.js must set it before loading tiers.js'); return; }
  var EP = H.EP, state = H.state, me = H.me, $ = H.$, esc = H.esc, txt = H.txt, save = H.save, touch = H.touch, score = H.score,
      wordPop = H.wordPop, showDirections = H.showDirections, spokenWord = H.spokenWord, pickVoice = H.pickVoice,
      boardState = H.boardState, R = H.R, PROXY = H.PROXY, SUPA_URL = H.SUPA_URL, TABLE = H.TABLE, sbHead = H.sbHead;
  var CSS = '\n.tiers{max-width:1180px;margin:0 auto 50px;padding:0 16px}\n.tiersbox{background:#fff;border-radius:18px;padding:22px 22px 20px;border:2px solid var(--line)}\n.tiersbox h2{margin:0 0 6px;font-size:28px;font-weight:900}\n.tiersbox .lead{margin:0 0 14px;color:var(--soft)}\n.tiersbox .soft{color:var(--soft)}\n.tiersbox .lab{display:block;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--purple);margin:0 0 4px}\n.tcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:0 0 18px}\n.tcards.one{grid-template-columns:minmax(220px,420px) auto;align-items:center}\n.tcard{text-align:left;background:#faf9fc;border:2px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;color:var(--plum)}\n.tcard:hover{border-color:var(--purple)}\n.tcard.on{background:#f1e8f6;border-color:var(--purple);box-shadow:0 0 0 3px #e4d3ee}\n.tcard .te{font-size:30px;line-height:1}\n.tcard b{font-size:20px;font-weight:900}\n.tcard .tb{color:var(--soft);font-size:15px;font-weight:700}\n.tcard .tb .dirtr{font-size:1em}\n.asknext{align-self:center}\n.asknext.on{background:#e3f4e8;border-color:#2d7a47;color:#2d7a47}\n.tsteps{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}\n.tstep{border:2px solid var(--line);background:#fff;border-radius:999px;padding:8px 16px;font-weight:800;color:var(--soft)}\n.tstep.on{background:var(--purple);border-color:var(--purple);color:#fff}\n.tstep .dirtr{display:inline;margin-left:6px;font-size:.9em;color:inherit;opacity:.85}\n.osay{border:0;background:#f1e8f6;border-radius:999px;width:34px;height:34px;font-size:15px;flex:none}\n/* order */\n.ord{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}\n.opool{display:flex;flex-direction:column;gap:10px;min-height:60px;padding:10px;border:2px dashed var(--line);border-radius:14px;background:#faf9fc}\n.ochip{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--line);border-radius:12px;padding:10px 12px;font-weight:700;font-size:19px;line-height:1.3;cursor:pointer;user-select:none}\n.ochip:hover{border-color:var(--purple)}\n.ochip.sel{border-color:var(--orange);box-shadow:0 0 0 3px #fde3c3;background:#fff7ec}\n.ochip.in{flex:1;cursor:grab}\n.oslots{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}\n.oslot{display:flex;align-items:center;gap:12px;min-height:60px;border:2px solid var(--line);border-radius:14px;padding:6px 10px 6px 6px;background:#fff;cursor:pointer}\n.oslot.over,.oslot:hover{border-color:var(--purple)}\n.onum{width:40px;height:40px;border-radius:50%;background:var(--purple);color:#fff;font-weight:900;font-size:20px;display:inline-flex;align-items:center;justify-content:center;flex:none}\n.ohint{color:var(--soft);font-weight:700}\n.oslot.ok{border-color:#3b9b5c;background:#e3f4e8}\n.oslot.bad{border-color:#F8981F;background:#fff3e2}\n.oslot.full .ochip{border-color:transparent;background:transparent;padding:4px 0}\n/* topic sentence */\n.topts{display:flex;flex-direction:column;gap:10px;margin:0 0 10px}\n.toptrow{display:flex;align-items:center;gap:10px}\n.toptrow .qopt{flex:1}\n.tiersbox .qmsg{margin:0;min-height:1.5em}\n/* tier B */\n.rw{display:grid;grid-template-columns:1fr 1fr;gap:16px;border:2px solid var(--line);border-radius:16px;padding:14px 16px;margin:0 0 12px;background:#faf9fc}\n.rw.done{border-color:#3b9b5c;background:#f3faf5}\n.rwo p{margin:0;font-size:21px;font-weight:700;line-height:1.35;display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n.swapw{border:0;background:none;padding:0 2px;font:inherit;font-weight:800;color:var(--plum);box-shadow:inset 0 -3px 0 var(--orange);border-radius:4px;cursor:pointer}\n.swapw:hover{background:#fff1dd}\n.rwm textarea{width:100%;min-height:64px;border:2px solid var(--line);border-radius:12px;padding:10px 12px;font-size:19px;resize:vertical;background:#fff}\n.rwm textarea:focus{border-color:var(--purple);outline:none}\n.rwok{display:block;margin-top:6px;font-weight:800;font-size:15px}\n.rwok.yes{color:#2d7a47}.rwok.no{color:#b2612a}.rwok.keep{color:var(--soft)}\n.ladder{display:none;margin-top:10px;background:#fff;border:2px solid var(--line);border-radius:12px;padding:8px 10px 4px}\n.ladder.on{display:block}\n.rung{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 8px}\n.rlab{font-weight:900;font-size:13px;color:var(--purple);width:100%}\n.rlab .dirtr{display:inline;margin-left:6px}\n.rchip{border:2px solid var(--line);background:#faf9fc;border-radius:999px;padding:5px 12px;font-weight:700;font-size:16px}\n.rchip:hover{border-color:var(--purple);background:#f1e8f6}\n/* tier C */\n.cgrid{display:grid;grid-template-columns:minmax(220px,1fr) minmax(280px,1.3fr);gap:18px;align-items:start}\n.cframes{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-height:70vh;overflow:auto;padding:4px}\n.cframe{background:#fff;border:2px solid var(--line);border-radius:12px;overflow:hidden}\n.cframe svg{display:block;width:100%;height:auto}\n.cframe p{margin:0;padding:6px 8px 8px;font-weight:700;font-size:14px;line-height:1.3}\n.cframe b{color:var(--purple)}\n.cwrite textarea{width:100%;min-height:220px;border:2px solid var(--line);border-radius:12px;padding:12px 14px;font-size:19px;line-height:1.5;resize:vertical}\n.cwrite textarea:focus{border-color:var(--purple);outline:none}\n.cwrite .row{margin:10px 0}\n.wc{font-weight:800;color:var(--soft);margin-right:auto}\n.fb{display:none;border:2px solid var(--line);border-radius:14px;padding:4px 14px 10px;background:#faf9fc}\n.fbrow{padding:10px 0;border-bottom:1px solid var(--line);font-size:16px}\n.fbrow:last-child{border-bottom:0}\n.fbrow ul{margin:6px 0 0;padding-left:20px}\n.fbrow.good b{color:#2d7a47}\n.fbrow.copy b{color:#864D9E}\n.fbrow .hit{color:#2d7a47;font-weight:800;list-style:none;margin-left:-20px}\n.fbrow .miss{color:var(--soft);font-weight:700;list-style:none;margin-left:-20px}\n.fbrow.fix p{margin:6px 0 0;font-size:18px}\n.fbrow.fix s{color:#8a7f95}\n.fbrow.next{font-weight:800;color:var(--purple)}\n.saywrap{--say-accent:#864D9E;--say-soft:#f1e8f6;--say-line:#d9d3e3;--say-radius:14px}\n@media (max-width:760px){\n  .ord,.rw,.cgrid{grid-template-columns:1fr}\n  .tcards.one{grid-template-columns:1fr}\n  .cframes{max-height:40vh}\n}\n';
  var CSS_D = '.gbox{position:relative;border:2px solid var(--line);border-radius:16px;padding:14px 16px 16px;margin:0 0 16px;background:#faf9fc;box-shadow:0 2px 0 rgba(0,0,0,.06)}' +
    '.gbox:after{content:"";display:block;clear:both}' +
    '.gpic{float:right;width:min(42%,340px);margin:0 0 10px 16px;border:2px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}' +
    '.gpic svg{display:block;width:100%;height:auto}' +
    '.gbox h3{margin:0 0 6px;font-size:23px;font-weight:900}' +
    '.grule{margin:0 0 10px;font-size:18px;font-weight:700;color:var(--plum)}' +
    '.gex{border:2px dashed var(--line);border-radius:12px;padding:8px 12px;background:#fff}' +
    '.gex .lab{display:block;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--purple);margin:0 0 2px}' +
    '.gnote{display:block;color:var(--soft);font-weight:700;font-size:15px;margin-top:4px}' +
    '.gtools{border:2px solid var(--orange);background:#fff7ec;border-radius:12px;padding:8px 14px;margin:0 0 14px;font-weight:800}' +
    '.gtools p{margin:0}' +
    '.gs{font-size:21px;font-weight:700;line-height:1.5}' +
    '.gslot{display:inline-block;min-width:92px;border-bottom:3px solid var(--purple);text-align:center;font-weight:900;color:var(--purple);margin:0 4px}' +
    '.gslot.full{border-bottom-color:#3b9b5c;color:#2d7a47}' +
    '.gslot.drop{animation:gdrop .3s ease-out}' +
    '@keyframes gdrop{0%{transform:translateY(-14px);opacity:0}100%{transform:none;opacity:1}}' +
    '.gq{border:2px solid var(--line);border-radius:14px;padding:12px 14px;margin:0 0 12px;background:#fff}' +
    '.gq.done{border-color:#3b9b5c;background:#f3faf5}' +
    '.gq.firstq{border-color:var(--orange);box-shadow:0 0 0 3px #fde3c3}' +
    '.gqtop{display:flex;align-items:center;gap:10px;flex-wrap:wrap}' +
    '.gopts{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0}' +
    '.gtile{border:2px solid var(--line);background:#faf9fc;border-radius:12px;padding:8px 16px;font-weight:800;font-size:19px;color:var(--plum)}' +
    '.gtile:hover{border-color:var(--purple);background:#f1e8f6}' +
    '.gtile.gone{opacity:.25;text-decoration:line-through;pointer-events:none}' +
    '.gtile.right{background:#e3f4e8;border-color:#3b9b5c;color:#2d7a47;opacity:1;text-decoration:none}' +
    '.gtile.show{border-color:var(--orange);background:#fff3e2;animation:gpulse 1s ease-in-out infinite}' +
    '@keyframes gpulse{0%,100%{box-shadow:0 0 0 0 #f8981f55}50%{box-shadow:0 0 0 7px #f8981f00}}' +
    '.wobble{animation:gwob .4s ease-in-out}' +
    '@keyframes gwob{0%,100%{transform:none}20%{transform:translateX(-6px) rotate(-3deg)}50%{transform:translateX(6px) rotate(3deg)}80%{transform:translateX(-3px)}}' +
    '.shimmer{position:relative;animation:gshim 1.4s ease-in-out infinite}' +
    '@keyframes gshim{0%,100%{box-shadow:0 0 0 0 #864d9e44}50%{box-shadow:0 0 0 8px #864d9e00}}' +
    '.gfb{min-height:4px}' +
    '.gquip{display:flex;align-items:center;gap:10px;margin:10px 0 0}' +
    '.gquip p{margin:0;font-weight:800;color:var(--plum)}' +
    '.quipface{width:62px;height:62px;flex:none;border:2px solid var(--line);border-radius:50%;background:#fff}' +
    '.ghint{margin:8px 0 0;font-weight:800;color:#8a6200;background:#fff8e8;border:2px solid #f0d9a8;border-radius:10px;padding:6px 10px}' +
    '.gok{font-weight:900;color:#2d7a47}' +
    '.gcount{font-weight:800;color:var(--soft)}' +
    /* the what's-next line and the bobbing arrow (T-371) */
    '.gline{display:flex;align-items:center;gap:10px;border:2px solid #2B2233;border-left:10px solid var(--orange);border-radius:12px;background:#fff7ec;padding:9px 14px;margin:0 0 14px;box-shadow:0 2px 0 rgba(43,34,51,.18)}' +
    '.gline p{margin:0;font-weight:900;font-size:19px;color:var(--plum)}' +
    '.gline .gpin{color:var(--orange);font-size:15px}' +
    '.gnudge{position:fixed;width:96px;height:44px;z-index:40;pointer-events:none;display:none;filter:drop-shadow(0 2px 2px rgba(43,34,51,.25))}' +
    '.gnudge svg{width:100%;height:100%;display:block}' +
    '.gnudge.left{animation:gnudgeX 1.5s ease-in-out infinite}' +
    '.gnudge.up{transform:rotate(90deg);animation:gnudgeY 1.5s ease-in-out infinite}' +
    '.gnudge.down{transform:rotate(-90deg);animation:gnudgeY 1.5s ease-in-out infinite}' +
    '@keyframes gnudgeX{0%,100%{margin-left:0}50%{margin-left:3px}}' +
    '@keyframes gnudgeY{0%,100%{margin-top:0}50%{margin-top:3px}}' +
    '@media (prefers-reduced-motion:reduce){.gnudge.left,.gnudge.up,.gnudge.down{animation:none}}' +
    '@media (max-width:760px){.gline p{font-size:17px}.gnudge{width:70px;height:32px}}' +
    '.bex{border:2px solid var(--line);border-radius:14px;padding:10px 14px;margin:0 0 16px;background:#faf9fc}' +
    '.bex .lab{display:block;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--purple);margin:0 0 6px}' +
    '.bexrow{border-top:1px solid var(--line);padding:8px 0 2px}.bexrow:first-of-type{border-top:0}' +
    '.bexhow{display:block;font-weight:800;color:var(--soft);font-size:15px;margin:0 0 2px}' +
    '.bexrow p{margin:2px 0;font-size:19px;font-weight:700;display:flex;gap:8px;align-items:baseline}' +
    '.bexlab{flex:none;width:22px;height:22px;border-radius:50%;background:var(--purple);color:#fff;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center}' +
    '.chg{background:#fff3e2;box-shadow:inset 0 -3px 0 var(--orange);border-radius:4px;padding:0 2px}' +
    '.cex{margin:4px 0 2px}.cex summary{cursor:pointer;font-weight:800;color:var(--purple);font-size:15px}' +
    '.cex p{margin:4px 0;font-size:17px;font-weight:700;display:flex;gap:8px;align-items:baseline}' +
    '.tstep.ok{border-color:#3b9b5c;color:#2d7a47}' +
    '@media (max-width:760px){.gpic{float:none;width:100%;margin:0 0 10px}.gs{font-size:19px}.gtile{font-size:18px;padding:8px 14px}}' +
    /* Real borders (standing rule): the shared --line is light grey on off-white, which two
       sections cannot be told apart by from across a classroom. Every tier box gets a dark line. */
    '.tiersbox,.gbox,.gq:not(.done),.rw:not(.done),.cframe,.fb,.gex,.gpic,.tcard:not(.on),.oslot:not(.ok):not(.bad),.opool,.ochip,.ladder,.rwm textarea,.cwrite textarea{border-color:#2B2233}' +
    '.gbox,.gq,.rw,.tiersbox{box-shadow:0 2px 0 rgba(43,34,51,.18)}';
  function addStyle() { if ($('tiersCss')) return; var st = document.createElement('style'); st.id = 'tiersCss'; st.textContent = CSS + CSS_D; document.head.appendChild(st); }
  function addScript(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb || null; s.onerror = cb || null; document.body.appendChild(s); }
  function ensureMarkup() {
    if (!$('tiers')) {
      var sec = document.createElement('section'); sec.className = 'tiers'; sec.id = 'tiers'; sec.style.display = 'none';
      sec.innerHTML = '<div class="tiersbox" id="tiersBox"></div>';
      var yt = $('yt'); if (yt) yt.parentNode.insertBefore(sec, yt.nextSibling); else document.body.appendChild(sec);
    }
    if (!$('tierBtn')) {
      var ctrl = document.querySelector('.ctrl'), yb = $('ytBtn');
      if (ctrl) {
        var b = document.createElement('button'); b.className = 'cbtn'; b.id = 'tierBtn'; b.setAttribute('translate', 'yes'); b.setAttribute('data-canary', 'After the story'); b.textContent = 'After the story';
        if (yb && yb.parentNode === ctrl) ctrl.insertBefore(b, yb.nextSibling); else ctrl.appendChild(b);
      }
    }
    var rw = $('rewatch');
    if (rw && !$('ytNext')) {
      var nb = document.createElement('button'); nb.className = 'btn alt'; nb.id = 'ytNext'; nb.setAttribute('translate', 'yes'); nb.textContent = 'After the story ↓';
      rw.parentNode.insertBefore(nb, rw.nextSibling);
      nb.addEventListener('click', function () { showTiers(true); });
    }
    if ($('tierBtn') && !$('tierBtn').__wired) { $('tierBtn').__wired = true; $('tierBtn').addEventListener('click', function () { showTiers(true); }); }
  }
  /* ================= AFTER THE STORY: TIERS =================
     EP.tiers = { ask, key:[{t, swap, rungs, keep, idea, ideas}], topic:{ask, opts, good, why}, summary:{min, hint, teaser} }
     Tier A  words and voice : read along (say.js) -> order the 5 key sentences -> pick the topic sentence
     Tier B  synonyms/details: reword the key sentences, one phrase ladder each
     Tier C  paragraph       : summary from the storyboard, "Check my writing", one revision
     The teacher assigns a tier from the dashboard (reel_views.tier). With no tier set,
     the page says "Ask your teacher" and shows the three cards. */
  var TIERS = null;
  var assignedTier = '';                 /* '', 'A', 'B', 'C' or 'D' — written by the dashboard */
  var TIER_INFO = {
    A: { name: 'Words and voice', e: '🗣️', blurb: 'Read along. Put the story in order. Pick the topic sentence.' },
    B: { name: 'Paraphrase', e: '🔁', blurb: 'Say it a new way.' },
    C: { name: 'Paragraph', e: '✍️', blurb: 'Write a short summary of the story in your own words.' },
    D: { name: 'Grammar from the story', e: '🧩', blurb: 'Tap the word that fits. The sentences come from this episode.' }
  };
  var TIER_KEYS = ['A', 'B', 'C', 'D'];
  function tierState() {
    if (!state.tiers) state.tiers = {};
    var t = state.tiers;
    if (!t.A) t.A = { step: 0, read: null, order: { shuf: null, slots: [], first: null, best: 0, tries: 0 }, topic: { first: null, pick: null, tries: 0 } };
    if (!t.B) t.B = { rw: [] };
    if (!t.C) t.C = { text: '', fb: null, checked: 0, draft1: '', revised: false };
    if (!t.D) t.D = { set: 0, ans: {}, shuf: {}, tools: 0 };
    if (!t.open) t.open = '';
    return t;
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/\u2019/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function wordsOf(s) { var n = norm(s); return n ? n.split(' ') : []; }
  function sentenceOk(s) { s = String(s || '').trim(); return wordsOf(s).length >= 3 && /^[A-Z]/.test(s) && /[.!?]$/.test(s); }
  function changedB(i) {
    if (!TIERS) return false;
    var k = TIERS.key[i], rw = (tierState().B.rw[i] || '');
    if (k.keep) return false;
    return !!norm(rw) && norm(rw) !== norm(k.t) && sentenceOk(rw);
  }
  function ideaHits(text) {
    var hits = [];
    (TIERS.key || []).forEach(function (k) { hits.push({ idea: k.idea, hit: !!(k.ideas && k.ideas.test(text)) }); });
    return hits;
  }
  function tierScores() {
    var out = {}, pts = 0, max = 0;
    if (!TIERS) return { out: out, pts: pts, max: max };
    var t = tierState(), A = t.A, B = t.B, C = t.C;
    if (A.order.first != null || A.topic.first != null || A.read) {
      var tp = A.topic.first === true ? 1 : 0;
      out.tierA = { order: A.order.best, order_first: A.order.first, topic: tp, read: A.read };
      pts += A.order.best + tp; max += ordList().length + 1;
    }
    var nB = 0, anyB = false, maxB = 0;
    TIERS.key.forEach(function (k, i) { if (k.keep) return; maxB++; if (B.rw[i]) anyB = true; if (changedB(i)) nB++; });
    /* tierB_max: ep01 keeps sentence 1 (names and countries), so B is out of 4 there and out of 5 in
       later episodes — the dashboard reads this instead of assuming 4. */
    if (anyB) { out.tierB = nB; out.tierB_max = maxB; pts += nB; max += maxB; }
    if (norm(C.text)) {
      var w = wordsOf(C.text).length, hits = ideaHits(C.text).filter(function (h) { return h.hit; }).length;
      var p = (w >= (TIERS.summary.min || 25) ? 2 : (w >= 10 ? 1 : 0)) + (hits >= 3 ? 2 : (hits >= 1 ? 1 : 0)) + (C.revised ? 1 : 0);
      out.tierC = { words: w, ideas: hits, checked: C.checked, revised: C.revised, pts: p };
      pts += p; max += 5;
    }
    if (TIERS.grammar && TIERS.grammar.length) {
      var g = gSolved();
      if (g.solved || g.first_try || Object.keys(t.D.ans || {}).length) { out.tierD = g; pts += g.solved; max += g.total; }
    }
    if (t.askNext) out.ask_next = true;
    return { out: out, pts: pts, max: max };
  }
  function speakPlain(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(spokenWord(text)); var v = pickVoice('n'); if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = rate || 0.85; speechSynthesis.speak(u);
  }
  function dir(en, tag, cls) { tag = tag || 'p'; return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' translate="yes" data-en="' + esc(en) + '">' + esc(en) + '</' + tag + '>'; }

  function showTiers(scroll) {
    if (!TIERS) return;
    var box = $('tiersBox'); if (!box) return;
    /* T-371: with no tier set the page used to show three closed cards, and students left
       without opening one. Card A opens by itself, so the microphone is on screen on arrival. */
    var t = tierState(), open = assignedTier || t.open || 'A', h = '';
    h += '<h2 translate="yes">After the story</h2>';
    if (assignedTier) {
      var inf = TIER_INFO[assignedTier];
      h += '<div class="tcards one"><div class="tcard on"><span class="te">' + inf.e + '</span><b>' + assignedTier + '. ' + esc(inf.name) + '</b>' + dir(inf.blurb, 'span', 'tb') + '</div>' +
           '<button class="btn alt asknext' + (t.askNext ? ' on' : '') + '" id="askNext" translate="yes" data-en="' + (t.askNext ? 'Your teacher knows you are ready. Keep working.' : 'Ready for the next one? Ask your teacher.') + '">' +
           (t.askNext ? '🙋 Your teacher knows you are ready. Keep working.' : '🙋 Ready for the next one? Ask your teacher.') + '</button></div>';
    } else {
      h += dir(TIERS.ask, 'p', 'lead');
      h += '<div class="tcards">';
      TIER_KEYS.forEach(function (k) {
        if (k === 'D' && !(TIERS.grammar && TIERS.grammar.length)) return;
        var inf = TIER_INFO[k];
        h += '<button class="tcard' + (open === k ? ' on' : '') + '" data-t="' + k + '"><span class="te">' + inf.e + '</span><b>' + k + '. ' + esc(inf.name) + '</b>' + dir(inf.blurb, 'span', 'tb') + '</button>';
      });
      h += '</div>';
    }
    h += '<div class="tpanel" id="tpanel"></div>';
    box.innerHTML = h;
    $('tiers').style.display = 'block';
    showDirections(box);
    box.querySelectorAll('.tcard[data-t]').forEach(function (b) {
      b.addEventListener('click', function () { tierState().open = b.getAttribute('data-t'); touch(); showTiers(false); });
    });
    if ($('askNext')) $('askNext').addEventListener('click', function () { tierState().askNext = !tierState().askNext; touch(); save(); showTiers(false); });
    if (open === 'A') renderTierA($('tpanel'));
    else if (open === 'B') renderTierB($('tpanel'));
    else if (open === 'C') renderTierC($('tpanel'));
    else if (open === 'D') renderTierD($('tpanel'));
    else hideNudge();
    guide();
    score();
    if (scroll) $('tiers').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ================= WHAT'S NEXT: one line, one arrow (T-371) =================
     The next action is named in a short line at the top of the open card, and a drawn arrow
     bobs at the thing itself — the microphone, the first chip, the word tile. One arrow on
     screen at a time, pointing at exactly one element. Most of these students see the arrow
     before they can read the label, so the arrow carries the meaning on its own; the line is
     translated like every other direction. The bob is 3px and slow, and stops dead under
     prefers-reduced-motion. */
  var NUDGE = null, nudgeTimer = null;
  function nudgeEl() {
    if (NUDGE && NUDGE.parentNode) return NUDGE;
    NUDGE = document.createElement('div');
    NUDGE.className = 'gnudge';
    NUDGE.setAttribute('aria-hidden', 'true');
    NUDGE.innerHTML = '<svg viewBox="0 0 96 44" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 22 C 26 8, 46 8, 70 22" fill="none" stroke="#F8981F" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M70 22 L 52 12 L 56 22 L 52 32 Z" fill="#F8981F"/></svg>';
    document.body.appendChild(NUDGE);
    return NUDGE;
  }
  function hideNudge() { if (NUDGE) NUDGE.style.display = 'none'; }
  function pointAt(el) {
    if (!el || !el.getBoundingClientRect) { hideNudge(); return; }
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) { hideNudge(); return; }
    var n = nudgeEl(), W = 96, H = 44, gap = 6;
    var left = r.left - W - gap, top = r.top + r.height / 2 - H / 2, mode = 'left';
    if (left < 4) {                       /* no room beside it: sit above and point down */
      left = Math.max(4, r.left + r.width / 2 - W / 2);
      top = r.top - H - gap;
      mode = 'up';
      if (top < 4) { top = r.bottom + gap; mode = 'down'; }
    }
    n.style.display = 'block';
    n.style.left = Math.round(left) + 'px';
    n.style.top = Math.round(top) + 'px';
    n.className = 'gnudge ' + mode;
  }
  /* what the student should do right now, read off the open panel */
  function nextStep() {
    var p = $('tpanel'); if (!p) return null;
    var q, t;
    /* D: grammar */
    q = p.querySelector('.gq:not(.done)');
    if (q) return { say: 'Tap the word that fits in the sentence.', at: q.querySelector('.gtile:not(.gone)') || q };
    if (p.querySelector('.gq')) {
      t = p.querySelector('.tstep:not(.ok)');
      return t ? { say: 'Next: ' + t.getAttribute('data-en'), at: t } : { say: 'You finished the grammar sets. Nice work.', at: null };
    }
    /* A step 1: read along */
    if ($('sayMount')) {
      var rd = tierState().A.read;
      if (rd && rd.ok >= rd.total && rd.total) return { say: 'Next: put the story in order.', at: p.querySelector('.tstep[data-i="1"]') };
      var mic = $('sayMount').querySelector('button');
      return { say: rd && rd.ok ? 'Keep going. Listen, then say the next sentence.' : 'Start here \u2014 listen, then say the sentence out loud.', at: mic };
    }
    /* A step 2: order */
    if (p.querySelector('.oslots')) {
      var pool = p.querySelector('#opool .ochip');
      if (pool) return { say: 'Tap a sentence. Then tap its place in the list.', at: pool };
      if (p.querySelector('.oslot.ok') && !p.querySelector('.oslot.bad') && p.querySelectorAll('.oslot.ok').length === p.querySelectorAll('.oslot').length)
        return { say: 'Next: pick the topic sentence.', at: p.querySelector('.tstep[data-i="2"]') };
      if (p.querySelector('.oslot.bad')) return { say: 'Move the orange ones. What happened first? What happened last?', at: p.querySelector('.oslot.bad') };
      return { say: 'Now press Check.', at: $('ordCheck') };
    }
    /* A step 3: topic sentence */
    if (p.querySelector('.topts')) {
      var right = p.querySelector('.topts .qopt.right');
      if (right) return { say: 'You finished Words and voice. Ask your teacher what to do next.', at: null };
      return { say: 'Which sentence tells the whole story? Tap it.', at: p.querySelector('.topts .qopt') };
    }
    /* B: paraphrase */
    if (p.querySelector('.rw')) {
      var open2 = p.querySelector('.rw:not(.done) .swapw');
      if (open2) return { say: 'Tap an orange word to see other ways to say it.', at: open2 };
      return { say: 'All five are changed. Press Turn in.', at: $('bTurnIn') };
    }
    /* C: paragraph */
    if ($('cText')) {
      if (!String($('cText').value || '').trim()) return { say: 'Write 4 or 5 sentences about the story here.', at: $('cText') };
      if (!tierState().C.checked) return { say: 'Now press Check my writing.', at: $('cCheck') };
      return { say: 'Change one thing in your summary, then press Turn in.', at: $('cTurnIn') };
    }
    return null;
  }
  function updateGuide() {
    var p = $('tpanel');
    if (!p || !$('tiers') || $('tiers').style.display !== 'block') { hideNudge(); return; }
    var step = nextStep();
    var line = p.querySelector('.gline');
    if (!step) { if (line) line.remove(); hideNudge(); return; }
    if (!line) {
      line = document.createElement('div');
      line.className = 'gline';
      p.insertBefore(line, p.firstChild);
    }
    if (line.getAttribute('data-say') !== step.say) {
      line.setAttribute('data-say', step.say);
      line.innerHTML = '<span class="gpin">\u25B6</span><p translate="yes" data-en="' + esc(step.say) + '">' + esc(step.say) + '</p>';
      showDirections(line);
    }
    pointAt(step.at);
  }
  function guide() {
    setTimeout(updateGuide, 30);
    if (!nudgeTimer) {
      nudgeTimer = setInterval(updateGuide, 700);          /* follows scrolling and re-renders */
      window.addEventListener('resize', updateGuide);
      window.addEventListener('scroll', updateGuide, true);
    }
  }

  /* ---------- Tier A ---------- */
  var SAY_CTL = null;
  function readDecks() {
    var decks = [{ k: 'key', name: 'Key sentences', e: '⭐', items: TIERS.key.map(function (k) { return k.t; }) }];
    EP.scenes.forEach(function (sc, si) {
      var items = [];
      sc.lines.forEach(function (ln) { if (ln.type === 'q' || ln.sA || ln.sB) return; var s = ln.A || txt(ln); if (s && !ln.teaser) items.push(s); });
      if (items.length) decks.push({ k: 's' + (si + 1), name: 'Scene ' + (si + 1), e: '🎬', items: items });
    });
    return decks;
  }
  function renderTierA(root) {
    var A = tierState().A, step = A.step || 0, h = '';
    var steps = ['Read along', 'Put the story in order', 'Pick the topic sentence'];
    h += '<div class="tsteps">';
    steps.forEach(function (s, i) { h += '<button class="tstep' + (i === step ? ' on' : '') + '" data-i="' + i + '" translate="yes" data-en="' + esc(s) + '">' + (i + 1) + '. ' + esc(s) + '</button>'; });
    h += '</div><div id="tstepBody"></div>';
    root.innerHTML = h;
    root.querySelectorAll('.tstep').forEach(function (b) { b.addEventListener('click', function () { tierState().A.step = +b.getAttribute('data-i'); touch(); renderTierA(root); }); });
    showDirections(root);
    var body = $('tstepBody');
    if (step === 0) renderRead(body); else if (step === 1) renderOrder(body); else renderTopic(body);
    guide();
  }
  function renderRead(root) {
    root.innerHTML = dir('Listen to each line. Then say it. The microphone listens and shows a check when it understands you. Start with the Key sentences.', 'p', 'lead') + '<div class="saywrap" id="sayMount"></div>';
    showDirections(root);
    if (!window.Say || !window.Say.mount) { $('sayMount').innerHTML = '<p class="soft">The speaking tool did not load. Check your internet and refresh.</p>'; return; }
    if (SAY_CTL) { try { SAY_CTL.destroy(); } catch (e) {} SAY_CTL = null; }
    SAY_CTL = Say.mount($('sayMount'), {
      decks: readDecks(), setName: 'reel-' + EP.id,
      student: function () { return me.email ? { email: me.email, name: me.name, period: me.period } : null; },
      lang: function () { return state.lang || 'none'; },
      translate: function (text, anchor) {
        setTimeout(function () {
          var el = anchor || $('sayMount'), had = el.getAttribute('data-w');
          el.setAttribute('data-w', text); wordPop(el, text);
          if (had == null) el.removeAttribute('data-w'); else el.setAttribute('data-w', had);
        }, 0);
      },
      onProgress: function (ok, total) { tierState().A.read = { ok: ok, total: total }; score(); touch(); guide(); }
    });
  }
  function shuffledIdx(n) {
    var a = [], i, j, t;
    for (i = 0; i < n; i++) a.push(i);
    do { for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } }
    while (n > 1 && a.every(function (v, k) { return v === k; }));
    return a;
  }
  var ordSel = null;
  /* T-342: ordering uses TIERS.order (4 events) when the episode supplies it, not the key
     sentences — several orders of those are defensible. Only the ends are anchored: lock:1 must
     come first, lock:'last' must come last, and the middle counts right in any order, so a
     newcomer practises the IDEA of sequencing and still succeeds. Stricter orders are for later. */
  function ordList() { return (TIERS.order && TIERS.order.length) ? TIERS.order : TIERS.key; }
  function ordRight(k, slot, n) {
    var it = ordList()[k], L = it && it.lock;
    if (L === 1) return slot === 0;
    if (L === 'last') return slot === n - 1;
    return slot > 0 && slot < n - 1;
  }
  function renderOrder(root) {
    var o = tierState().A.order, LIST = ordList(), n = LIST.length, i;
    if (!o.shuf || o.shuf.length !== n) { o.shuf = shuffledIdx(n); o.slots = []; for (i = 0; i < n; i++) o.slots.push(null); }
    var placed = {};
    o.slots.forEach(function (v) { if (v != null) placed[v] = 1; });
    var h = dir('Tap a sentence. Then tap its place in the list. Tap a sentence in the list to take it out. Start with what happened FIRST and finish with what happened LAST.', 'p', 'lead');
    h += '<div class="ord"><div class="opool" id="opool">';
    o.shuf.forEach(function (k) {
      if (placed[k]) return;
      h += '<div class="ochip' + (ordSel === k ? ' sel' : '') + '" draggable="true" data-k="' + k + '" translate="no"><button class="osay" data-k="' + k + '" aria-label="Listen">🔊</button><span>' + esc(LIST[k].t) + '</span></div>';
    });
    h += '</div><ol class="oslots" id="oslots">';
    for (i = 0; i < n; i++) {
      var v = o.slots[i];
      h += '<li class="oslot' + (v != null ? ' full' : '') + '" data-i="' + i + '"><span class="onum">' + (i + 1) + '</span>' +
           (v != null ? '<div class="ochip in" draggable="true" data-k="' + v + '" translate="no"><button class="osay" data-k="' + v + '" aria-label="Listen">🔊</button><span>' + esc(LIST[v].t) + '</span></div>' : '<span class="ohint" translate="yes" data-en="Tap here">Tap here</span>') + '</li>';
    }
    h += '</ol></div>';
    h += '<div class="row"><button class="btn" id="ordCheck" translate="yes">Check</button><button class="btn alt" id="ordReset" translate="yes">Start over</button><span id="ordMsg" translate="yes"></span></div>';
    root.innerHTML = h;
    showDirections(root);
    function redraw() { touch(); renderOrder(root); }
    function placeAt(k, i) {
      var cur = o.slots.indexOf(k); if (cur >= 0) o.slots[cur] = null;
      o.slots[i] = k; ordSel = null; redraw();
    }
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(LIST[+b.getAttribute('data-k')].t); }); });
    root.querySelectorAll('#opool .ochip').forEach(function (c) {
      c.addEventListener('click', function () { var k = +c.getAttribute('data-k'); ordSel = ordSel === k ? null : k; renderOrder(root); });
      c.addEventListener('dragstart', function (e) { ordSel = +c.getAttribute('data-k'); try { e.dataTransfer.setData('text/plain', String(ordSel)); } catch (x) {} });
    });
    root.querySelectorAll('.oslot').forEach(function (li) {
      var i = +li.getAttribute('data-i');
      li.addEventListener('click', function () {
        if (ordSel != null) { placeAt(ordSel, i); return; }
        if (o.slots[i] != null) { o.slots[i] = null; redraw(); }
      });
      li.addEventListener('dragover', function (e) { e.preventDefault(); li.classList.add('over'); });
      li.addEventListener('dragleave', function () { li.classList.remove('over'); });
      li.addEventListener('drop', function (e) { e.preventDefault(); li.classList.remove('over'); if (ordSel != null) placeAt(ordSel, i); });
      var inChip = li.querySelector('.ochip');
      if (inChip) inChip.addEventListener('dragstart', function (e) { ordSel = +inChip.getAttribute('data-k'); try { e.dataTransfer.setData('text/plain', String(ordSel)); } catch (x) {} });
    });
    $('ordCheck').addEventListener('click', function () {
      if (o.slots.some(function (v) { return v == null; })) { var m0 = 'Put all ' + n + ' sentences in the list first.'; $('ordMsg').setAttribute('data-en', m0); $('ordMsg').textContent = m0; showDirections(root); return; }
      var right = 0;
      root.querySelectorAll('.oslot').forEach(function (li) {
        var i = +li.getAttribute('data-i'), ok = ordRight(o.slots[i], i, n);
        li.classList.toggle('ok', ok); li.classList.toggle('bad', !ok); if (ok) right++;
      });
      o.tries++; if (o.first == null) o.first = right; if (right > o.best) o.best = right;
      var msg = right === n ? 'Yes! That is the story, 1 to ' + n + '.' : right + ' of ' + n + ' are in a good place. Move the orange ones. What happened first? What happened last?';
      $('ordMsg').setAttribute('data-en', msg); $('ordMsg').textContent = msg; showDirections(root);
      score(); touch(); save(); guide();
    });
    $('ordReset').addEventListener('click', function () { o.shuf = shuffledIdx(n); o.slots = []; for (var j = 0; j < n; j++) o.slots.push(null); ordSel = null; redraw(); });
  }
  function renderTopic(root) {
    var T = TIERS.topic, tp = tierState().A.topic, h = '';
    h += '<p class="lead"><span translate="yes" data-en="A topic sentence tells what the whole story is about.">A topic sentence tells what the whole story is about.</span></p>';
    h += '<p class="qtext" translate="no">' + esc(T.ask) + '</p><div class="topts">';
    T.opts.forEach(function (o, i) {
      var cls = tp.pick === i ? (i === T.good ? ' right' : ' wrong') : '';
      h += '<div class="toptrow"><button class="osay" data-k="' + i + '" aria-label="Listen">🔊</button><button class="qopt' + cls + '" data-i="' + i + '" translate="no">' + esc(o) + '</button></div>';
    });
    h += '</div><p class="qmsg" id="topicMsg" translate="yes"' + (tp.pick != null ? ' data-en="' + esc(T.why[tp.pick]) + '">' + esc(T.why[tp.pick]) : '>') + '</p>';
    root.innerHTML = h;
    showDirections(root);
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(T.opts[+b.getAttribute('data-k')]); }); });
    root.querySelectorAll('.qopt').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        tp.tries++; if (tp.first == null) tp.first = (i === T.good);
        tp.pick = i; score(); touch(); save(); renderTopic(root); guide();
      });
    });
  }

  /* ---------- Tier B ---------- */
  var ladderOpen = null;
  /* T-342: two worked examples above the items — one swaps a word, one moves the sentence
     around. [brackets] in the data mark the words that changed, so a student sees WHAT moved. */
  function markWords(s2) { return esc(s2).replace(/\[([^\]]*)\]/g, '<b class="chg">$1</b>'); }
  function bExamples() {
    var ex = TIERS.bex || [];
    if (!ex.length) return '';
    var h2 = '<div class="bex"><span class="lab" translate="yes" data-en="Two examples">Two examples</span>';
    ex.forEach(function (e) {
      h2 += '<div class="bexrow">' + dir(e.how, 'span', 'bexhow') +
            '<p translate="no"><span class="bexlab">1</span><span>' + markWords(e.from) + '</span></p>' +
            '<p translate="no"><span class="bexlab">2</span><span>' + markWords(e.to) + '</span></p></div>';
    });
    return h2 + '</div>';
  }
  function renderTierB(root) {
    var B = tierState().B, h = '';
    h += dir('Say each sentence in a new way. Tap the orange words to see other ways to say them. Change at least one thing, but keep the meaning.', 'p', 'lead');
    h += bExamples();
    TIERS.key.forEach(function (k, i) {
      if (k.keep && !B.rw[i]) B.rw[i] = k.t;
      var orig = k.swap ? esc(k.t).replace(esc(k.swap), '<button class="swapw" data-i="' + i + '">' + esc(k.swap) + '</button>') : esc(k.t);
      var ok = changedB(i), rw = B.rw[i] || '', st = '';
      if (k.keep) st = '<span class="rwok keep" translate="yes" data-en="Keep this one. Names and countries stay the same.">Keep this one. Names and countries stay the same.</span>';
      else if (ok) st = '<span class="rwok yes" translate="yes" data-en="Changed. It still makes sense.">✓ Changed. It still makes sense.</span>';
      else if (norm(rw) && norm(rw) === norm(k.t)) st = '<span class="rwok no" translate="yes" data-en="This is the same as the original. Change at least one word.">This is the same as the original. Change at least one word.</span>';
      else if (norm(rw) && !sentenceOk(rw)) st = '<span class="rwok no" translate="yes" data-en="Start with a capital letter and end with a period.">Start with a capital letter and end with a period.</span>';
      h += '<div class="rw' + (ok ? ' done' : '') + '"><div class="rwo"><span class="lab" translate="yes" data-en="Original">Original</span><p translate="no">' + orig + '<button class="osay" data-k="' + i + '" aria-label="Listen">🔊</button></p>' +
           (k.swap ? '<div class="ladder' + (ladderOpen === i ? ' on' : '') + '" id="lad' + i + '"></div>' : '') + '</div>' +
           '<div class="rwm"><span class="lab" translate="yes" data-en="Your sentence">Your sentence</span><textarea data-i="' + i + '" translate="no" spellcheck="false">' + esc(rw) + '</textarea>' + st + '</div></div>';
    });
    h += '<div class="row"><button class="btn" id="bTurnIn" translate="yes">Turn in</button><span id="bMsg" translate="yes"></span></div>';
    root.innerHTML = h;
    showDirections(root);
    var labels = ['Small change', 'A step further', 'Freer, more detail'];
    function fillLadder(i) {
      var k = TIERS.key[i], el = $('lad' + i); if (!el) return;
      var s = '';
      k.rungs.forEach(function (r, ri) {
        s += '<div class="rung"><span class="rlab" translate="yes" data-en="' + esc(labels[ri]) + '">' + esc(labels[ri]) + '</span>';
        r.forEach(function (opt) { s += '<button class="rchip" data-i="' + i + '" data-o="' + esc(opt) + '" translate="no">' + esc(opt) + '</button>'; });
        s += '</div>';
      });
      el.innerHTML = s;
      showDirections(el);
      el.querySelectorAll('.rchip').forEach(function (c) {
        c.addEventListener('click', function () {
          var opt = c.getAttribute('data-o'), out = /\.$/.test(opt) ? opt : k.t.replace(k.swap, opt);
          B.rw[i] = out; ladderOpen = null; touch(); score(); renderTierB(root);
          var ta = root.querySelector('textarea[data-i="' + i + '"]'); if (ta) ta.focus();
        });
      });
    }
    root.querySelectorAll('.swapw').forEach(function (b) {
      b.addEventListener('click', function () { var i = +b.getAttribute('data-i'); ladderOpen = ladderOpen === i ? null : i; renderTierB(root); });
    });
    if (ladderOpen != null) fillLadder(ladderOpen);
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function () { speakPlain(TIERS.key[+b.getAttribute('data-k')].t); }); });
    root.querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', function () { B.rw[+ta.getAttribute('data-i')] = ta.value; score(); touch(); guide(); });
      ta.addEventListener('change', function () { renderTierB(root); });
    });
    $('bTurnIn').addEventListener('click', function () {
      state.turned = true; save();
      var n = 0, mx = 0; TIERS.key.forEach(function (k, i) { if (k.keep) return; mx++; if (changedB(i)) n++; });
      var m = 'Saved. ' + n + ' of ' + mx + ' sentences are changed.'; $('bMsg').setAttribute('data-en', m); $('bMsg').textContent = m; showDirections(root);
    });
  }

  /* ---------- Tier C ---------- */
  function sourceText() {
    var parts = [];
    EP.scenes.forEach(function (sc) { sc.lines.forEach(function (ln) { if (ln.type === 'q') return; ['A', 'B', 'C'].forEach(function (lv) { if (ln[lv]) parts.push(ln[lv]); }); }); });
    TIERS.key.forEach(function (k) { parts.push(k.t); });
    return ' ' + parts.map(norm).join(' | ') + ' ';
  }
  function copiedRuns(text, minLen) {
    var src = sourceText(), w = wordsOf(text), runs = [], i = 0;
    while (i < w.length) {
      var j = i + 1, best = null;
      while (j <= w.length) {
        var ph = ' ' + w.slice(i, j).join(' ') + ' ';
        if (src.indexOf(ph) < 0) break;
        if (j - i >= minLen) best = w.slice(i, j).join(' ');
        j++;
      }
      if (best) { runs.push(best); i = j - 1; } else i++;
    }
    return runs;
  }
  function splitSent(s) { return (String(s).match(/[^.!?]+[.!?]*\s*/g) || [s]).map(function (x) { return x.trim(); }); }
  function grammarFix(text) {
    var rules = [
      { re: /(^|\s)i(\s|'|\u2019)/, fix: function (s) { return s.replace(/(^|\s)i(\s|'|\u2019)/, '$1I$2'); }, why: 'Write I with a capital letter.' },
      { re: /(^|[.!?]\s+)[a-z]/, fix: function (s) { return s.replace(/(^|[.!?]\s+)([a-z])/, function (m, a, b) { return a + b.toUpperCase(); }); }, why: 'Start each sentence with a capital letter.' },
      { re: /\b(she|he|linh|mateo|amira|jun|paolo)\s+(have)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh|mateo|amira|jun|paolo)\s+have\b/i, '$1 has'); }, why: 'With she or he, use has.' },
      { re: /\b(she|he|linh)\s+(are|am)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(are|am)\b/i, '$1 is'); }, why: 'With she or he, use is.' },
      { re: /\b(she|he|linh)\s+(don't|dont)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(don't|dont)\b/i, "$1 doesn't"); }, why: 'With she or he, use doesn\u2019t.' },
      { re: /\b(she|he|linh)\s+(ask|talk|write|meet|feel|say|like|go|walk|sit|want|need|make|see|learn|play)\s/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(ask|talk|write|meet|feel|say|like|go|walk|sit|want|need|make|see|learn|play)\s/i, function (m, a, b) { return a + ' ' + b + (b === 'go' ? 'es' : 's') + ' '; }); }, why: 'With she or he, the verb takes -s: she asks, she writes.' },
      { re: /\bis (new student|student|girl|boy|teacher|friend)\b/i, fix: function (s) { return s.replace(/\bis (new student|student|girl|boy|teacher|friend)\b/i, 'is a $1'); }, why: 'Use a before a singular noun: a new student.' },
      { re: /\bis (nervous|happy|shy|new|short|tall|comfortable|scared)\s+(linh|she|he)\b/i, fix: function (s) { return s.replace(/\bis (nervous|happy|shy|new|short|tall|comfortable|scared)\s+(linh|she|he)\b/i, 'is $1. $2'); }, why: 'Put a period between two sentences.' },
      { re: /[a-z]\s*$/i, fix: function (s) { return s.replace(/\s*$/, '.'); }, why: 'End your last sentence with a period.' }
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].re.test(text)) {
        var fixed = rules[i].fix(text);
        if (fixed !== text) {
          var a = splitSent(text), b = splitSent(fixed), k;
          for (k = 0; k < a.length; k++) if (a[k] !== b[k]) break;
          return { before: a[k] || text, after: b[k] || fixed, why: rules[i].why };
        }
      }
    }
    return null;
  }
  function localFeedback(text) {
    var fb = { copied: copiedRuns(text, 5), ideas: ideaHits(text), fix: grammarFix(text), notes: [] };
    var w = wordsOf(text).length, min = TIERS.summary.min || 25;
    if (w < min) fb.notes.push('You wrote ' + w + ' words. Try for ' + min + ' or more.');
    if (TIERS.summary.teaser && TIERS.summary.teaser.test(text)) fb.notes.push(TIERS.summary.teaserNote || 'That part is a teaser for the next episode. Leave it out of the summary.');
    return fb;
  }
  function remoteFeedback(text, cb) {
    var done = false, timer = setTimeout(function () { if (!done) { done = true; cb(null); } }, 9000);
    var u = PROXY + '?action=feedback&text=' + encodeURIComponent(text) + '&source=' + encodeURIComponent(TIERS.key.map(function (k) { return k.t; }).join(' ')) +
            '&lang=' + encodeURIComponent(state.lang || '') + '&level=' + encodeURIComponent(state.level);
    fetch(u).then(function (r) { return r.json(); }).then(function (d) {
      if (done) return; done = true; clearTimeout(timer);
      cb(d && d.ok && d.feedback && typeof d.feedback === 'object' ? d.feedback : null);
    }).catch(function () { if (!done) { done = true; clearTimeout(timer); cb(null); } });
  }
  /* T-342: a collapsed worked example under each copied line — the key sentence it overlaps and
     one of that sentence's own rewrites, else the first Tier B example. Collapsed on purpose:
     the student tries their own words first (models may hide; reading never does). */
  function copyExample(copied) {
    var c = norm(copied), best = null, bestHits = 0;
    (TIERS.key || []).forEach(function (k) {
      if (!k.rungs || !k.rungs.length || !k.swap) return;
      var hits = 0;
      wordsOf(k.t).forEach(function (w) { if (w.length > 2 && c.indexOf(w) >= 0) hits++; });
      if (hits > bestHits) { bestHits = hits; best = k; }
    });
    var from, to;
    if (best && bestHits >= 2) {
      from = best.t;
      var r = best.rungs[1] || best.rungs[0], opt = r[0];
      to = /\.$/.test(opt) ? opt : best.t.replace(best.swap, opt);
    } else if ((TIERS.bex || []).length) {
      from = TIERS.bex[0].from.replace(/[\[\]]/g, ''); to = TIERS.bex[0].to.replace(/[\[\]]/g, '');
    } else return '';
    return '<details class="cex"><summary translate="yes" data-en="See an example">See an example</summary>' +
           '<p><span class="bexlab">1</span><span translate="no">' + esc(from) + '</span></p>' +
           '<p><span class="bexlab">2</span><span translate="no">' + esc(to) + '</span></p></details>';
  }
  function renderTierC(root) {
    var C = tierState().C, S = TIERS.summary, h = '';
    h += dir(S.hint, 'p', 'lead');
    h += '<div class="cgrid"><div class="cframes" id="cframes"></div><div class="cwrite">' +
         '<span class="lab" translate="yes" data-en="My summary">My summary</span>' +
         '<textarea id="cText" translate="no" spellcheck="false" placeholder="Linh is ...">' + esc(C.text) + '</textarea>' +
         '<div class="row"><span class="wc" id="cCount"></span><button class="btn" id="cCheck" translate="yes">Check my writing</button><button class="btn alt" id="cTurnIn" translate="yes">Turn in</button><span id="cMsg" translate="yes"></span></div>' +
         '<div class="fb" id="cFb"></div></div></div>';
    root.innerHTML = h;
    showDirections(root);
    var fh = '';
    EP.scenes.forEach(function (sc, si) {
      var first = null;
      for (var i = 0; i < sc.lines.length; i++) if (sc.lines[i].type !== 'q') { first = sc.lines[i]; break; }
      fh += '<div class="cframe">' + R.sceneSVG(boardState(sc)) + '<p translate="no"><b>' + (si + 1) + '.</b> ' + esc(first ? (first.A || txt(first)) : '') + '</p></div>';
    });
    $('cframes').innerHTML = fh;
    function count() { var n = wordsOf($('cText').value).length; $('cCount').textContent = n + (n === 1 ? ' word' : ' words'); }
    count();
    $('cText').addEventListener('input', function () {
      C.text = this.value; count();
      if (C.checked && norm(C.text) && norm(C.text) !== norm(C.draft1)) C.revised = true;
      score(); touch(); guide();
    });
    function showFb(fb) {
      var s = '';
      if (fb.copied && fb.copied.length) {
        s += '<div class="fbrow copy"><b translate="yes" data-en="These words are copied from the story. Say them your way.">These words are copied from the story. Say them your way.</b><ul>';
        fb.copied.forEach(function (c) { s += '<li translate="no">\u201c' + esc(c) + '\u201d' + copyExample(c) + '</li>'; });
        s += '</ul></div>';
      } else s += '<div class="fbrow good"><b translate="yes" data-en="Your words are your own. Good.">✓ Your words are your own. Good.</b></div>';
      if (fb.ideas && fb.ideas.length) {
        s += '<div class="fbrow ideas"><b translate="yes" data-en="Does it say what happened?">Does it say what happened?</b><ul>';
        fb.ideas.forEach(function (it) { s += '<li class="' + (it.hit ? 'hit' : 'miss') + '" translate="yes" data-en="' + esc(it.idea) + '">' + (it.hit ? '✓ ' : '○ ') + esc(it.idea) + '</li>'; });
        s += '</ul></div>';
      }
      if (fb.fix && fb.fix.after) {
        s += '<div class="fbrow fix"><b translate="yes" data-en="One thing to fix:">One thing to fix:</b>' + (fb.fix.why ? ' <span translate="yes" data-en="' + esc(fb.fix.why) + '">' + esc(fb.fix.why) + '</span>' : '') +
             '<p translate="no"><s>' + esc(fb.fix.before) + '</s><br>\u2192 <b>' + esc(fb.fix.after) + '</b></p></div>';
      }
      (fb.notes || []).forEach(function (n) { s += '<div class="fbrow note" translate="yes" data-en="' + esc(n) + '">' + esc(n) + '</div>'; });
      if (fb.note) s += '<div class="fbrow note" translate="no">' + esc(fb.note) + '</div>';
      s += '<div class="fbrow next" translate="yes" data-en="Now change one thing in your summary. Then turn it in.">Now change one thing in your summary. Then turn it in.</div>';
      $('cFb').innerHTML = s; $('cFb').style.display = 'block';
      showDirections($('cFb'));
    }
    if (C.fb) showFb(C.fb);
    $('cCheck').addEventListener('click', function () {
      var text = $('cText').value.trim();
      if (wordsOf(text).length < 5) { $('cMsg').setAttribute('data-en', 'Write a few sentences first.'); $('cMsg').textContent = 'Write a few sentences first.'; showDirections(root); return; }
      $('cCheck').disabled = true; $('cCheck').textContent = '…';
      var local = localFeedback(text);
      remoteFeedback(text, function (rf) {
        $('cCheck').disabled = false; $('cCheck').textContent = 'Check my writing';
        var fb = local;
        if (rf) { fb = { copied: rf.copied || local.copied, ideas: rf.ideas || local.ideas, fix: rf.fix || local.fix, notes: rf.notes || local.notes, note: rf.note || '' }; }
        C.fb = fb; C.checked++; if (!C.draft1) C.draft1 = text; C.revised = false;
        C.text = text; showFb(fb); score(); touch(); save();
      });
    });
    $('cTurnIn').addEventListener('click', function () {
      C.text = $('cText').value; state.turned = true; save();
      $('cMsg').setAttribute('data-en', 'Saved. You can keep editing.'); $('cMsg').textContent = 'Saved. You can keep editing.'; showDirections(root);
    });
  }

  /* ================= TIER D: GRAMMAR FROM THE STORY (T-333) =================
     EP_TIERS.grammar = [{ id, title, rule, example:{p,a,note}, scene:<index into EP.scenes>,
                           items:[{p:'... ___ ...', o:[...], a:'...'}] }]
     Every sentence is a real line from the episode. The mechanic is not A's chips: the wrong
     word wobbles out of the row and the right one drops into the blank.
     House rules: options shuffled and the order kept per student; the answer never sits in the
     same slot more than 3 times running; the voice reads the blank as "blank"; every sentence has
     🔊 and tap-to-translate; nothing red — a wrong tile fades, a cast member says one line, then a
     hint; after the 3rd miss the answer is shown with 🔊 and the student taps it once. Any try
     earns the point; first tries and misses are for the dashboard only. */
  var QUIPS = [
    { who: 'mateo', line: 'Not that one. I read the wrong row this morning, so I know the feeling.' },
    { who: 'amira', line: 'Try again. Read the whole sentence first, then choose.' },
    { who: 'paolo', line: 'Close! Say the sentence out loud with that word in it.' },
    { who: 'linh', line: 'Hmm, that one does not fit. Look at the words beside the blank.' },
    { who: 'jun', line: 'Try another one. I get this wrong too.' }
  ];
  function gSets() { return (TIERS && TIERS.grammar) || []; }
  function gState() {
    var t = tierState();
    if (!t.D) t.D = { set: 0, ans: {}, shuf: {}, tools: 0 };
    if (!t.D.ans) t.D.ans = {};
    if (!t.D.shuf) t.D.shuf = {};
    return t.D;
  }
  function gRec(gid, i) {
    var D = gState(), k = gid + ':' + i;
    if (!D.ans[k]) D.ans[k] = { tries: 0, first: null, done: false, shown: false };
    return D.ans[k];
  }
  /* the shuffle is made once and kept, so reloading never moves the words about */
  function gOrder(set, i, recent) {
    var D = gState(), k = set.id + ':' + i, it = set.items[i], n = it.o.length;
    if (D.shuf[k] && D.shuf[k].length === n) return D.shuf[k];
    var right = it.o.indexOf(it.a), ord = null, tries = 0;
    while (tries++ < 40) {
      var a = [], j, x, tmp;
      for (j = 0; j < n; j++) a.push(j);
      for (j = n - 1; j > 0; j--) { x = Math.floor(Math.random() * (j + 1)); tmp = a[j]; a[j] = a[x]; a[x] = tmp; }
      var slot = a.indexOf(right);
      if (!(recent.length >= 2 && recent[recent.length - 1] === slot && recent[recent.length - 2] === slot)) { ord = a; break; }
    }
    if (!ord) { ord = []; for (var m = 0; m < n; m++) ord.push(m); }
    D.shuf[k] = ord; touch();
    return ord;
  }
  function gSolved() {
    var n = 0, total = 0, first = 0, shown = 0;
    gSets().forEach(function (s) {
      s.items.forEach(function (it, i) {
        total++;
        var r = (gState().ans[s.id + ':' + i]) || {};
        if (r.done) n++;
        if (r.first === true) first++;
        if (r.shown) shown++;
      });
    });
    return { solved: n, total: total, first_try: first, shown: shown };
  }
  /* a sentence with 🔊 and tap-to-translate on every word; blank = a plain ___ slot */
  function gSentence(p, fill, cls) {
    var parts = String(p).split('___'), h = '<span class="gs ' + (cls || '') + '" translate="no">';
    parts.forEach(function (chunk, ci) {
      if (ci) h += fill ? '<b class="gslot full">' + esc(fill) + '</b>' : '<b class="gslot"></b>';
      chunk.split(/(\s+)/).forEach(function (tok) {
        if (!tok.trim()) { h += esc(tok); return; }
        var core = tok.replace(/[^A-Za-z'\u2019-]/g, '');
        h += core ? '<span class="w qw" data-w="' + esc(core.toLowerCase()) + '">' + esc(tok) + '</span>' : esc(tok);
      });
    });
    return h + '</span>';
  }
  function gWire(root, sentenceOf) {
    root.querySelectorAll('.gs .qw').forEach(function (w) {
      if (w.__wired) return; w.__wired = true;
      w.addEventListener('click', function (e) { e.stopPropagation(); wordPop(w, sentenceOf(w)); });
    });
  }
  function headSVG(id) {
    var c = R.CAST[id]; if (!c) return '';
    var top = R.headTop(id), x = 0;
    return '<svg class="quipface" viewBox="' + (x - 150) + ' ' + top + ' 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(c.name) + '">' +
           R.placeChar(id, 0, 1, { expr: 'smile', pose: 'idle' }) + '</svg>';
  }
  function renderTierD(root) {
    var sets = gSets(), D = gState();
    if (!sets.length) { root.innerHTML = dir('This episode has no grammar sets yet.', 'p', 'lead'); showDirections(root); return; }
    if (D.set >= sets.length) D.set = 0;
    var h = '<div class="tsteps">';
    sets.forEach(function (s, i) {
      var done = s.items.every(function (it, j) { return gRec(s.id, j).done; });
      h += '<button class="tstep' + (i === D.set ? ' on' : '') + (done ? ' ok' : '') + '" data-i="' + i + '" translate="yes" data-en="' + esc(s.title) + '">' + (i + 1) + '. ' + esc(s.title) + (done ? ' ✓' : '') + '</button>';
    });
    h += '</div><div id="gBody"></div>';
    root.innerHTML = h;
    root.querySelectorAll('.tstep').forEach(function (b) {
      b.addEventListener('click', function () { gState().set = +b.getAttribute('data-i'); touch(); renderTierD(root); });
    });
    showDirections(root);
    renderGSet($('gBody'), sets[D.set], root);
  }
  function renderGSet(root, set, outer) {
    var D = gState(), sets = gSets(), si = sets.indexOf(set), h = '';
    var sc = EP.scenes[set.scene != null ? set.scene : Math.min(si, EP.scenes.length - 1)];
    h += '<div class="gbox">';
    h += '<div class="gpic">' + (sc ? R.sceneSVG(boardState(sc)) : '') + '</div>';
    h += '<h3 translate="no">' + esc(set.title) + '</h3>';
    h += dir(set.rule, 'p', 'grule');
    h += '<div class="gex"><span class="lab" translate="yes" data-en="Like this">Like this</span>' +
         gSentence(set.example.p, set.example.a, 'ok') + '<button class="osay gexsay" data-say="' + esc(set.example.p.replace(/___/g, set.example.a)) + '" aria-label="Listen">🔊</button>' +
         (set.example.note ? dir(set.example.note, 'span', 'gnote') : '') + '</div>';
    h += '</div>';
    if (si === 0 && !D.tools) {
      h += '<div class="gtools" id="gTools">' + dir('First, try the buttons. Tap a word in the sentence to hear it and see it in your language. Then press 🔊 to hear the whole sentence.', 'p') + '</div>';
    }
    var recent = [];
    h += '<div class="gitems">';
    set.items.forEach(function (it, i) {
      var r = gRec(set.id, i), ord = gOrder(set, i, recent);
      recent.push(ord.indexOf(it.o.indexOf(it.a)));
      var first = (si === 0 && i === 0 && !D.tools);
      h += '<div class="gq' + (r.done ? ' done' : '') + (first ? ' firstq' : '') + '" data-g="' + set.id + '" data-i="' + i + '">' +
           '<div class="gqtop">' + gSentence(it.p, r.done ? it.a : '') +
           '<button class="osay' + (first ? ' shimmer' : '') + '" data-say="' + esc(it.p.replace(/___/g, ' blank ')) + '" aria-label="Listen">🔊</button></div>';
      h += '<div class="gopts">';
      ord.forEach(function (oi) {
        var o = it.o[oi];
        h += '<button class="gtile' + (r.done && o === it.a ? ' right' : '') + (r.shown && o === it.a && !r.done ? ' show' : '') + '" data-o="' + esc(o) + '"' + (r.done ? ' disabled' : '') + ' translate="no">' + esc(o) + '</button>';
      });
      h += '</div><div class="gfb"></div></div>';
    });
    h += '</div>';
    var nxt = sets[si + 1];
    h += '<div class="row">' + (nxt ? '<button class="btn" id="gNext" translate="yes">Next set →</button>' : '<button class="btn" id="gTurnIn" translate="yes">Turn in</button>') +
         '<span class="gcount" id="gCount"></span></div>';
    root.innerHTML = h;
    showDirections(root);
    function sentenceOf(w) {
      var q = w.closest('.gq'), ex = w.closest('.gex');
      if (ex) return set.example.p.replace(/___/g, set.example.a);
      if (!q) return '';
      return set.items[+q.getAttribute('data-i')].p.replace(/___/g, set.items[+q.getAttribute('data-i')].a);
    }
    gWire(root, sentenceOf);
    root.querySelectorAll('.osay').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation(); b.classList.remove('shimmer');
        if (!gState().tools) { gState().tools = 1; touch(); }
        speakPlain(b.getAttribute('data-say'));
      });
    });
    function count() {
      var g = gSolved(), m = $('gCount'); if (!m) return;
      var s = g.solved + ' of ' + g.total + ' done';
      m.setAttribute('data-en', s); m.textContent = s; showDirections(root);
    }
    count();
    root.querySelectorAll('.gq').forEach(function (q) {
      var i = +q.getAttribute('data-i'), it = set.items[i], r = gRec(set.id, i);
      var fb = q.querySelector('.gfb'), slot = q.querySelector('.gslot');
      function finish(byShow) {
        r.done = true; if (byShow) r.shown = true;
        slot.textContent = it.a; slot.classList.add('full', 'drop');
        q.classList.add('done');
        q.querySelectorAll('.gtile').forEach(function (t) {
          t.disabled = true;
          if (t.getAttribute('data-o') === it.a) t.classList.add('right'); else t.classList.add('gone');
        });
        fb.innerHTML = '<span class="gok" translate="yes" data-en="That fits.">✓ That fits.</span>';
        showDirections(q);
        speakPlain(it.p.replace(/___/g, it.a));
        count(); score(); touch(); save(); guide();
      }
      q.querySelectorAll('.gtile').forEach(function (t) {
        t.addEventListener('click', function () {
          if (r.done) return;
          var o = t.getAttribute('data-o'), right = (o === it.a);
          if (r.first === null) r.first = right;
          if (right) { finish(false); return; }
          r.tries++;
          t.classList.add('wobble');
          setTimeout(function () { t.classList.remove('wobble'); t.classList.add('gone'); t.disabled = true; }, 420);
          slot.classList.add('wobble');
          setTimeout(function () { slot.classList.remove('wobble'); }, 420);
          var qp = QUIPS[(r.tries - 1) % QUIPS.length];
          var hint = set.hint || set.rule;
          /* with two or three choices the wrong ones run out before a third miss: once only the
             right word is left, that IS the answer shown, so record it the same way */
          var left = 0;
          q.querySelectorAll('.gtile').forEach(function (b2) { if (b2.getAttribute('data-o') !== it.a && !b2.classList.contains('gone') && b2 !== t) left++; });
          if (r.tries >= 3 || left === 0) {
            r.shown = true;
            fb.innerHTML = '<div class="gquip">' + headSVG(qp.who) + '<p translate="yes" data-en="' + esc('Here is the answer. Tap it once, and you still get the point.') + '">Here is the answer. Tap it once, and you still get the point.</p></div>' +
                           '<p class="ghint" translate="yes" data-en="' + esc(hint) + '">💡 ' + esc(hint) + '</p>';
            q.querySelectorAll('.gtile').forEach(function (b2) { if (b2.getAttribute('data-o') === it.a) { b2.classList.add('show'); b2.classList.remove('gone'); b2.disabled = false; } });
            speakPlain(it.a);
          } else {
            fb.innerHTML = '<div class="gquip">' + headSVG(qp.who) + '<p translate="yes" data-en="' + esc(qp.line) + '">' + esc(qp.line) + '</p></div>' +
                           '<p class="ghint" translate="yes" data-en="' + esc(hint) + '">💡 ' + esc(hint) + '</p>';
          }
          showDirections(q);
          score(); touch(); save();
        });
      });
    });
    if ($('gNext')) $('gNext').addEventListener('click', function () { gState().set = si + 1; touch(); renderTierD(outer); outer.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if ($('gTurnIn')) $('gTurnIn').addEventListener('click', function () {
      state.turned = true; save();
      var g = gSolved(), m = 'Saved. ' + g.solved + ' of ' + g.total + ' done.';
      $('gCount').setAttribute('data-en', m); $('gCount').textContent = m; showDirections(root);
    });
  }

  /* ---------- the teacher's tier switch (reel_views.tier) ---------- */
  function applyTier(v) {
    v = (v || '').toUpperCase(); if (!/^[ABCD]$/.test(v)) v = '';
    if (v === assignedTier) return;
    assignedTier = v;
    if (assignedTier) { tierState().open = assignedTier; tierState().askNext = false; }
    if ($('tiers') && $('tiers').style.display === 'block') showTiers(false);
  }
  function pollTier() {
    if (!me.email) return;
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(me.email) + '&episode=eq.' + encodeURIComponent(EP.id) + '&select=tier', { headers: sbHead() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { if (rows && rows[0]) applyTier(rows[0].tier); })
      .catch(function () {});
  }

  /* ---------- public surface ---------- */
  var pollTimer = null;
  function init() {
    TIERS = EP.tiers || window.EP_TIERS || null;
    if (!TIERS) return;
    /* ep01 still carries an old inline EP.tiers block, so its tiers-data.js was being ignored and
       anything added there (order, bex) never arrived. Always read the data file and fill in the
       keys the inline block lacks; the inline block still wins for keys it does have. */
    function fill(src) { if (!src) return; for (var k in src) if (!(k in TIERS)) TIERS[k] = src[k]; }
    fill(window.EP_TIERS);
    if (!TIERS.order || !TIERS.bex) {
      addScript('tiers-data.js', function () {
        fill(window.EP_TIERS);
        if ($('tiers') && $('tiers').style.display === 'block') showTiers(false);
      });
    }
    /* Tier D's sets live in epNN/grammar-data.js (window.EP_GRAMMAR), beside the tier data */
    if (!TIERS.grammar && window.EP_GRAMMAR) TIERS.grammar = window.EP_GRAMMAR;
    if (!TIERS.grammar) { addScript('grammar-data.js', function () { if (window.EP_GRAMMAR) { TIERS.grammar = window.EP_GRAMMAR; if ($('tiers') && $('tiers').style.display === 'block') showTiers(false); } }); }
    addStyle(); ensureMarkup();
    if (!window.Say) addScript('/readings/say/sets.js', function () { addScript('/readings/say/say.js'); });
    if (!pollTimer) pollTimer = setInterval(pollTier, 30000);
    if (state.done && $('yt') && $('yt').style.display === 'block') showTiers(false);
  }
  window.REEL_TIERS = {
    show: function (scroll) { if (!TIERS) return; ensureMarkup(); showTiers(scroll); },
    refresh: function () { if (TIERS && $('tiers') && $('tiers').style.display === 'block') showTiers(false); },
    setTier: applyTier,
    poll: pollTier,
    scores: tierScores,
    ready: function () { return !!TIERS; }
  };
  if (EP.tiers || window.EP_TIERS) init();
  else addScript('tiers-data.js', init);   /* epNN/tiers-data.js beside the episode page */
})();
