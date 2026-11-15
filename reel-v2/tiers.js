/* Story Reel: "After the story" — FOUR STATIONS (T-421, Job C).
   THE STATIONS (they replace the old A/B/C/D cards; the saved keys and the tierA-D score names are
   unchanged, so old work still loads and the dashboard still reads it):
     say   Say it      CORE, always      the 5 key sentences out loud (scene decks = extra)
     para  Paragraph   CORE by default   put the story in order -> pick the topic sentence -> write
                                         the paragraph, ALL IN ONE PANEL. The order and the topic
                                         sentence are the PLAN for the writing, not two quizzes:
                                         the panel carries both into the write box.
     rw    Paraphrase  EXTRA             say the key sentences a new way
     gram  Grammar     EXTRA             tap the word that fits (sentences from this episode)
   An EXTRA can only raise a score, never lower it (fair-scores rule). When Mr. Toby assigns a tier
   from the dashboard (reel_views.tier) that tier's station becomes THAT student's core instead of
   the default: A = order + topic, B = Paraphrase, C = the paragraph, D = Grammar. Say it stays core
   for everyone, because speaking is the medium here, not an extra step at the end.

   WHAT THE ENGINE CAN ASK US FOR (Job C's surface, for its folder tabs):
     REEL_TIERS.stations() -> [{ id, label, icon, color, core, done, n, of, mount(root) }]
         one entry per station, in order; mount(root) draws it into any element the engine gives us.
     REEL_TIERS.nextStep() -> { say:'<one short line>', at:<element or null> } or null
     REEL_TIERS.onChange(cb) -> cb() runs whenever a station's progress changes.
     REEL_TIERS.scores() -> { pts, max, coreMax, out } — coreMax is ALWAYS reported, even before the
         student opens After the story, so stopping after Your Turn no longer shows full marks. The
         engine adds it to GAL_MAX:  var cm = ts.coreMax || 0;
                                     window.GAL_MAX = max + cm;
                                     window.GAL_SCORE = Math.min(max + cm, base + (ts.pts || 0));
     REEL_TIERS.coreDone() -> true when every core station is done (engine's "You finished" box).
   If the engine sets window.REEL_HOST.tabs it draws the station row AND the arrow, and we draw
   neither, so there is still ONE arrow on screen. Until then we draw our own.

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
  var CSS = '\n.tiers{max-width:1180px;margin:0 auto 50px;padding:0 16px}\n.tiersbox{background:#fff;border-radius:18px;padding:22px 22px 20px;border:2px solid var(--line)}\n.tiersbox h2{margin:0 0 6px;font-size:28px;font-weight:900}\n.tiersbox .lead{margin:0 0 14px;color:var(--soft)}\n.tiersbox .soft{color:var(--soft)}\n.tiersbox .lab{display:block;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--purple);margin:0 0 4px}\n/* T-414: an empty left gutter the green arrow sits in, so it never lands on a word, a listen button or a choice */\n.tiersbox #tpanel{padding-left:66px}\n@media (max-width:760px){.tiersbox #tpanel{padding-left:50px}}\n.tsteps{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}\n.tstep{border:2px solid var(--line);background:#fff;border-radius:999px;padding:8px 16px;font-weight:800;color:var(--soft)}\n.tstep.on{background:var(--purple);border-color:var(--purple);color:#fff}\n.tstep .dirtr{display:inline;margin-left:6px;font-size:.9em;color:inherit;opacity:.85}\n.osay{border:0;background:#f1e8f6;border-radius:999px;width:34px;height:34px;font-size:15px;flex:none}\n/* order */\n.ord{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}\n.opool{display:flex;flex-direction:column;gap:10px;min-height:60px;padding:10px;border:2px dashed var(--line);border-radius:14px;background:#faf9fc}\n.ochip{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--line);border-radius:12px;padding:10px 12px;font-weight:700;font-size:19px;line-height:1.3;cursor:pointer;user-select:none}\n.ochip:hover{border-color:var(--purple)}\n.ochip.sel{border-color:var(--orange);box-shadow:0 0 0 3px #fde3c3;background:#fff7ec}\n.ochip.in{flex:1;cursor:grab}\n.oslots{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}\n.oslot{display:flex;align-items:center;gap:12px;min-height:60px;border:2px solid var(--line);border-radius:14px;padding:6px 10px 6px 6px;background:#fff;cursor:pointer}\n.oslot.over,.oslot:hover{border-color:var(--purple)}\n.onum{width:40px;height:40px;border-radius:50%;background:var(--purple);color:#fff;font-weight:900;font-size:20px;display:inline-flex;align-items:center;justify-content:center;flex:none}\n.ohint{color:var(--soft);font-weight:700}\n.oslot.ok{border-color:#3b9b5c;background:#e3f4e8}\n.oslot.bad{border-color:#F8981F;background:#fff3e2}\n.oslot.full .ochip{border-color:transparent;background:transparent;padding:4px 0}\n/* topic sentence */\n.topts{display:flex;flex-direction:column;gap:10px;margin:0 0 10px}\n.toptrow{display:flex;align-items:center;gap:10px}\n.toptrow .qopt{flex:1}\n.tiersbox .qmsg{margin:0;min-height:1.5em}\n/* tier B */\n.rw{display:grid;grid-template-columns:1fr 1fr;gap:16px;border:2px solid var(--line);border-radius:16px;padding:14px 16px;margin:0 0 12px;background:#faf9fc}\n.rw.done{border-color:#3b9b5c;background:#f3faf5}\n.rwo p{margin:0;font-size:21px;font-weight:700;line-height:1.35;display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n.swapw{border:0;background:none;padding:0 2px;font:inherit;font-weight:800;color:var(--plum);box-shadow:inset 0 -3px 0 var(--orange);border-radius:4px;cursor:pointer}\n.swapw:hover{background:#fff1dd}\n.rwm textarea{width:100%;min-height:64px;border:2px solid var(--line);border-radius:12px;padding:10px 12px;font-size:19px;resize:vertical;background:#fff}\n.rwm textarea:focus{border-color:var(--purple);outline:none}\n.rwok{display:block;margin-top:6px;font-weight:800;font-size:15px}\n.rwok.yes{color:#2d7a47}.rwok.no{color:#b2612a}.rwok.keep{color:var(--soft)}\n.ladder{display:none;margin-top:10px;background:#fff;border:2px solid var(--line);border-radius:12px;padding:8px 10px 4px}\n.ladder.on{display:block}\n.rung{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 8px}\n.rlab{font-weight:900;font-size:13px;color:var(--purple);width:100%}\n.rlab .dirtr{display:inline;margin-left:6px}\n.rchip{border:2px solid var(--line);background:#faf9fc;border-radius:999px;padding:5px 12px;font-weight:700;font-size:16px}\n.rchip:hover{border-color:var(--purple);background:#f1e8f6}\n/* tier C */\n.cgrid{display:grid;grid-template-columns:minmax(220px,1fr) minmax(280px,1.3fr);gap:18px;align-items:start}\n.cframes{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-height:70vh;overflow:auto;padding:4px}\n.cframe{background:#fff;border:2px solid var(--line);border-radius:12px;overflow:hidden}\n.cframe svg{display:block;width:100%;height:auto}\n.cframe p{margin:0;padding:6px 8px 8px;font-weight:700;font-size:14px;line-height:1.3}\n.cframe b{color:var(--purple)}\n.cwrite textarea{width:100%;min-height:220px;border:2px solid var(--line);border-radius:12px;padding:12px 14px;font-size:19px;line-height:1.5;resize:vertical}\n.cwrite textarea:focus{border-color:var(--purple);outline:none}\n.cwrite .row{margin:10px 0}\n.wc{font-weight:800;color:var(--soft);margin-right:auto}\n.fb{display:none;border:2px solid var(--line);border-radius:14px;padding:4px 14px 10px;background:#faf9fc}\n.fbrow{padding:10px 0;border-bottom:1px solid var(--line);font-size:16px}\n.fbrow:last-child{border-bottom:0}\n.fbrow ul{margin:6px 0 0;padding-left:20px}\n.fbrow.good b{color:#2d7a47}\n.fbrow.copy b{color:#864D9E}\n.fbrow .hit{color:#2d7a47;font-weight:800;list-style:none;margin-left:-20px}\n.fbrow .miss{color:var(--soft);font-weight:700;list-style:none;margin-left:-20px}\n.fbrow.fix p{margin:6px 0 0;font-size:18px}\n.fbrow.fix s{color:#8a7f95}\n.fbrow.next{font-weight:800;color:var(--purple)}\n.saywrap{--say-accent:#864D9E;--say-soft:#f1e8f6;--say-line:#d9d3e3;--say-radius:14px}\n@media (max-width:760px){\n  .ord,.rw,.cgrid{grid-template-columns:1fr}\n  .cframes{max-height:40vh}\n}\n';
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
    '.gline{display:flex;align-items:center;gap:10px;border:2px solid #2B2233;border-left:10px solid #1f7a4d;border-radius:12px;background:#e0f2e8;padding:9px 14px;margin:0 0 14px;box-shadow:0 2px 0 rgba(43,34,51,.18)}' +
    '.gline p{margin:0;font-weight:900;font-size:19px;color:var(--plum)}' +
    '.gline .gpin{color:#1f7a4d;font-size:15px}' +
    /* the arrow moves the way My Page's does: slides in and fades up, 1 s */
    '.gnudge{position:fixed;width:56px;height:56px;z-index:40;pointer-events:none;display:none}' +
    '.gnudge svg{width:100%;height:100%;display:block}' +
    '.gnudge.left{animation:gnudgeX 1s ease-in-out infinite}' +
    '.gnudge.up{animation:gnudgeY 1s ease-in-out infinite}' +
    '.gnudge.down{animation:gnudgeYup 1s ease-in-out infinite}' +
    '.gnudge.up svg{transform:rotate(90deg)}' +
    '.gnudge.down svg{transform:rotate(-90deg)}' +
    '@keyframes gnudgeX{0%,100%{transform:translateX(-10px);opacity:.5}50%{transform:translateX(5px);opacity:1}}' +
    '@keyframes gnudgeY{0%,100%{transform:translateY(-10px);opacity:.5}50%{transform:translateY(5px);opacity:1}}' +
    '@keyframes gnudgeYup{0%,100%{transform:translateY(10px);opacity:.5}50%{transform:translateY(-5px);opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.gnudge.left,.gnudge.up,.gnudge.down{animation:none;opacity:.9}}' +
    '@media (max-width:760px){.gline p{font-size:17px}.gnudge{width:42px;height:42px}}' +
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
    /* T-421: the station row, and the three chunks of the Paragraph panel */
    '.sbar{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px}' +
    '.stn{display:flex;align-items:center;gap:10px;border:2px solid #2B2233;background:#fff;border-radius:14px;padding:9px 14px;box-shadow:0 2px 0 rgba(43,34,51,.18);font:inherit;text-align:left;cursor:pointer}' +
    '.stn .se{font-size:26px;line-height:1;flex:none}' +
    '.stn b{display:block;font-size:18px;font-weight:900;color:var(--plum)}' +
    '.stn .sn{display:block;font-weight:800;font-size:14px;color:var(--soft)}' +
    '.stn .sx{font-weight:900;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#8a7f95}' +
    '.stn.on{background:#f1e8f6;box-shadow:0 0 0 3px #e4d3ee,0 2px 0 rgba(43,34,51,.18)}' +
    '.stn.ok{background:#e3f4e8}.stn.ok .sn{color:#2d7a47}' +
    '.stn.todo{animation:gshim 1.4s ease-in-out infinite}' +
    '@media (prefers-reduced-motion:reduce){.stn.todo{animation:none}}' +
    '.pchunk{border:2px solid #2B2233;border-radius:16px;padding:14px 16px 16px;margin:0 0 16px;background:#fff;box-shadow:0 2px 0 rgba(43,34,51,.18)}' +
    '.pchunk:after{content:"";display:block;clear:both}' +
    '.pchunk>.gpic{width:min(34%,280px)}' +
    '@media (max-width:760px){.pchunk>.gpic{float:none;width:100%;margin:0 0 10px}}' +
    '.pchunk>h3{margin:0 0 6px;font-size:22px;font-weight:900;display:flex;align-items:center;gap:9px}' +
    '.pnum{width:30px;height:30px;border-radius:50%;background:var(--purple);color:#fff;font-size:16px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;flex:none}' +
    '.pchunk.done>h3 .pnum{background:#2d7a47}' +
    '.plan{border:2px solid #2B2233;border-radius:12px;background:#faf9fc;padding:8px 12px 10px;margin:0 0 12px}' +
    '.plan .lab{display:block;font-weight:900;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--purple);margin:0 0 4px}' +
    '.plan ol{margin:0;padding-left:22px}' +
    '.plan li{font-weight:700;font-size:17px;line-height:1.4;margin:0 0 3px}' +
    '.plan .ptop{margin:7px 0 0;font-weight:800;font-size:17px;border-top:1px solid #d9d3e3;padding-top:7px}' +
    '.plan .ptop b{color:var(--purple)}' +
    '.sayx{border:2px dashed #2B2233;border-radius:12px;background:#faf9fc;padding:8px 12px;margin:0 0 12px;font-weight:800}' +
    '.sayx p{margin:0}' +
    /* T-421: the topic sentence never turns red for ELD 101 — the wrong one fades, the right one
       pulses when it is shown after three misses, and the tick is the only colour that stays. */
    '.topts .qopt.gone{opacity:.25;text-decoration:line-through;pointer-events:none}' +
    '.topts .qopt.wrong{background:#faf9fc;border-color:#2B2233}' +
    '.topts .qopt.right{background:#e3f4e8;border-color:#3b9b5c}' +
    '.topts .qopt.show{border-color:var(--orange);background:#fff3e2;animation:gpulse 1s ease-in-out infinite}' +
    '.tiersbox .qmsg .gquip{margin:8px 0 0}' +
    '@media (max-width:760px){.gpic{float:none;width:100%;margin:0 0 10px}.gs{font-size:19px}.gtile{font-size:18px;padding:8px 14px}}' +
    /* Real borders (standing rule): the shared --line is light grey on off-white, which two
       sections cannot be told apart by from across a classroom. Every tier box gets a dark line. */
    '.tiersbox,.gbox,.gq:not(.done),.rw:not(.done),.cframe,.fb,.gex,.gpic,.oslot:not(.ok):not(.bad),.opool,.ochip,.ladder,.rwm textarea,.cwrite textarea{border-color:#2B2233}' +
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
  /* ================= AFTER THE STORY: THE STATIONS (T-421) =================
     EP.tiers = { ask, order:[...], key:[{t, swap, rungs, keep, idea, ideas}],
                  topic:{ask, opts, good, why}, summary:{min, hint, teaser} }
     grammar:[...] arrives from epNN/grammar-data.js. */
  var TIERS = null;
  var assignedTier = '';                 /* '', 'A', 'B', 'C' or 'D' — written by the dashboard */
  /* the stations, in the order a student meets them */
  var ST_DEF = [
    { id: 'say',  label: 'Say it',     icon: '🗣️', color: '#F8981F', blurb: 'Say the five sentences out loud.' },
    { id: 'para', label: 'Paragraph',  icon: '✍️', color: '#2d7a47', blurb: 'Order the story, pick the topic sentence, then write it.' },
    { id: 'rw',   label: 'Paraphrase', icon: '🔁', color: '#864D9E', blurb: 'Say the sentences a new way.' },
    { id: 'gram', label: 'Grammar',    icon: '🧩', color: '#2f6fbd', blurb: 'Tap the word that fits.' }
  ];
  /* the old A/B/C/D cards: saved work carries them, and so does the teacher's switch */
  var LEGACY = { A: 'say', B: 'rw', C: 'para', D: 'gram' };
  function stIds() {
    return ST_DEF.filter(function (s) { return s.id !== 'gram' || (TIERS && TIERS.grammar && TIERS.grammar.length); })
                 .map(function (s) { return s.id; });
  }
  function stDef(id) { for (var i = 0; i < ST_DEF.length; i++) if (ST_DEF[i].id === id) return ST_DEF[i]; return ST_DEF[0]; }
  /* Which stations is THIS student expected to do? Say it always, then the Paragraph — unless Mr.
     Toby assigned a tier, in which case that tier's station is the core instead. Tier A is the
     order + topic half of the Paragraph panel, so an A student's core is the panel WITHOUT the
     writing; everything outside the core is an extra and can only raise a score. */
  function coreSet() {
    var c = { say: true, para: false, rw: false, gram: false, write: true };
    if (!assignedTier || assignedTier === 'C') { c.para = true; return c; }
    if (assignedTier === 'A') { c.para = true; c.write = false; return c; }
    c[LEGACY[assignedTier] || 'para'] = true;
    if (!c.para) c.write = false;              /* "write" only means anything inside the Paragraph panel */
    return c;
  }
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
  /* ---------- how far along each station is (T-421) ----------
     say.js counts every deck it was handed (the key sentences AND the scene decks) and only the key
     sentences are core, but it has no per-deck accessor. So we read that one deck's count off its
     own chip and remember it in the saved work; when the chip is not on screen the remembered
     number stands in, and work saved before T-421 is clamped instead of over-counted. */
  function nKey() { return (TIERS && TIERS.key) ? TIERS.key.length : 0; }
  function sayKeyOk() {
    var A = tierState().A, rd = A.read || null;
    var m = $('sayMount'), chip = m && m.querySelector('.sj-chip[data-deck="key"]');
    if (chip) {
      var hit = String(chip.textContent || '').match(/(\d+)\s*\/\s*(\d+)\s*$/);
      if (hit) {
        var k = +hit[1];
        if (!rd) { rd = A.read = { ok: k, total: +hit[2] }; }
        if (rd.key !== k) { rd.key = k; touch(); }
        return k;
      }
    }
    if (rd && rd.key != null) return rd.key;
    return rd ? Math.min(rd.ok || 0, nKey()) : 0;
  }
  function sayExtraOk() { var rd = tierState().A.read; return rd ? Math.max(0, (rd.ok || 0) - sayKeyOk()) : 0; }
  function bChanged() {
    var B = tierState().B, n = 0, mx = 0, any = false;
    (TIERS.key || []).forEach(function (k, i) {
      if (k.keep) return; mx++;
      if (B.rw[i]) any = true;
      if (changedB(i) && !markOff('tB.' + i, B.rw[i])) n++;   /* T-396: sent back = the point is off until it changes */
    });
    return { n: n, max: mx, any: any };
  }
  function writePts() {
    var C = tierState().C, text = C.text || '';
    if (!norm(text)) return { pts: 0, words: 0, ideas: 0, back: false };
    var w = wordsOf(text).length, hits = ideaHits(text).filter(function (h) { return h.hit; }).length;
    var p = (w >= (TIERS.summary.min || 25) ? 2 : (w >= 10 ? 1 : 0)) + (hits >= 3 ? 2 : (hits >= 1 ? 1 : 0)) + (C.revised ? 1 : 0);
    var back = markOff('tC.sum', text); if (back) p = 0;   /* T-396/T-421: a ✗ on the paragraph takes a CORE point */
    return { pts: p, words: w, ideas: hits, back: back };
  }
  function topicRight() { var tp = tierState().A.topic; return !!(TIERS.topic && tp.pick != null && tp.pick === TIERS.topic.good); }
  /* a paragraph Mr. Toby sent back is not finished — the episode stops saying "You finished" until
     the student changes it (T-421) */
  function writeDone() { var wp = writePts(); return !wp.back && wp.words >= ((TIERS.summary && TIERS.summary.min) || 25); }
  function stProg(id) {
    var core = coreSet(), o = tierState().A.order, nOrd = ordList().length;
    if (id === 'say') { var kf = nKey(), k = Math.min(sayKeyOk(), kf); return { n: k, of: kf, done: kf > 0 && k >= kf }; }
    if (id === 'para') {
      var wp = writePts(), n = (o.best || 0) + (topicRight() ? 1 : 0), of = nOrd + 1;
      if (core.write) { n += wp.pts; of += 5; }
      return { n: n, of: of, done: (o.best || 0) >= nOrd && topicRight() && (!core.write || writeDone()) };
    }
    if (id === 'rw') { var b = bChanged(); return { n: b.n, of: b.max, done: b.max > 0 && b.n >= b.max }; }
    if (id === 'gram') { var g = gSolved(); return { n: g.solved, of: g.total, done: g.total > 0 && g.solved >= g.total }; }
    return { n: 0, of: 0, done: false };
  }
  function stDone(id) { return stProg(id).done; }
  function coreDone() {
    if (!TIERS) return true;
    var core = coreSet(), ids = stIds(), i;
    for (i = 0; i < ids.length; i++) if (core[ids[i]] && !stDone(ids[i])) return false;
    return true;
  }
  /* ---------- the score ----------
     coreMax is what EVERY student here is expected to do, and it is reported even before the student
     opens After the story — that is what stops a page showing full marks for Your Turn alone.
     Extras carry no max of their own, so doing more can only raise the percent; they are capped at a
     share of the core so that extras can fill in missing points without replacing the core work
     (grammar alone is ~20 items, and a student who only taps grammar has not done the episode). */
  var EXTRA_SHARE = 0.4;
  function tierScores() {
    var out = {};
    if (!TIERS) return { out: out, pts: 0, max: 0, coreMax: 0 };
    var core = coreSet(), t = tierState(), A = t.A, o = A.order, nOrd = ordList().length;
    var kf = nKey(), k = Math.min(sayKeyOk(), kf), ex = sayExtraOk();
    var tp = topicRight() ? 1 : 0, wp = writePts(), b = bChanged();
    var g = (TIERS.grammar && TIERS.grammar.length) ? gSolved() : null;
    var corePts = 0, coreMax = 0, extra = 0;
    corePts += k; coreMax += kf; extra += ex;                                  /* Say it: core for everyone */
    if (core.para) { corePts += (o.best || 0) + tp; coreMax += nOrd + 1; }     /* the plan: order + topic */
    else extra += (o.best || 0) + tp;
    if (core.para && core.write) { corePts += wp.pts; coreMax += 5; }          /* the paragraph itself */
    else extra += wp.pts;
    if (core.rw) { corePts += b.n; coreMax += b.max; } else extra += b.n;      /* paraphrase */
    if (g) { if (core.gram) { corePts += g.solved; coreMax += g.total; } else extra += g.solved; }
    var cap = Math.max(2, Math.round(coreMax * EXTRA_SHARE)), counted = Math.min(extra, cap);
    /* the old names the dashboard reads (tiers-dash.js), unchanged in shape.
       T-421: the topic sentence counts on ANY try (fair-scores rule); the first try is kept for the
       dashboard in topic_first. order_of is new, so the dashboard stops printing "/5" for 4 events. */
    out.tierA = { order: o.best || 0, order_of: nOrd, order_first: o.first, topic: tp,
                  topic_first: A.topic.first === true ? 1 : 0, read: A.read || null };
    out.tierC = { words: wp.words, ideas: wp.ideas, checked: t.C.checked, revised: t.C.revised,
                  pts: wp.pts, sent_back: wp.back || undefined };
    /* tierB_max: ep01 keeps sentence 1 (names and countries), so B is out of 4 there and out of 5
       in later episodes — the dashboard reads this instead of assuming 4. */
    if (b.any || core.rw) { out.tierB = b.n; out.tierB_max = b.max; }
    if (g && (g.solved || g.first_try || Object.keys(t.D.ans || {}).length || core.gram)) out.tierD = g;
    var st = {};
    stIds().forEach(function (id) { var p = stProg(id); st[id] = p.n + '/' + p.of + (core[id] ? ' core' : ' extra') + (p.done ? ' done' : ''); });
    out.stations = st;
    /* core.set and core.cap let the dashboard replay this same sum when a ✗ takes a point off,
       without keeping its own copy of the rules (tiers-dash.js tierPts). */
    var cset = [];
    ['say', 'para', 'rw', 'gram', 'write'].forEach(function (key) { if (core[key]) cset.push(key); });
    out.core = { pts: corePts, max: coreMax, extra: extra, extra_counted: counted, cap: cap,
                 set: cset.join(','), done: coreDone(), assigned: assignedTier || '' };
    out.say = out.tierS = { key: k, key_of: kf, extra: ex, total: (A.read && A.read.ok) || 0 };
    if (t.askNext) out.ask_next = true;
    return { out: out, pts: corePts + counted, max: coreMax, coreMax: coreMax };
  }
  function speakPlain(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(spokenWord(text)); var v = pickVoice('n'); if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = rate || 0.85; speechSynthesis.speak(u);
  }
  function dir(en, tag, cls) { tag = tag || 'p'; return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' translate="yes" data-en="' + esc(en) + '">' + esc(en) + '</' + tag + '>'; }

  /* which station is open: the saved one (old A/B/C/D included), else the first core station the
     student has not finished */
  function openId() {
    var v = tierState().open || '', ids = stIds(), i;
    if (LEGACY[v]) v = LEGACY[v];
    if (ids.indexOf(v) >= 0) return v;
    var core = coreSet();
    for (i = 0; i < ids.length; i++) if (core[ids[i]] && !stDone(ids[i])) return ids[i];
    for (i = 0; i < ids.length; i++) if (!stDone(ids[i])) return ids[i];
    return ids[0];
  }
  function hostTabs() { try { return H.tabs || null; } catch (e) { return null; } }
  function mountStation(id, root) {
    if (!root) return;
    if (id === 'say') renderSay(root);
    else if (id === 'para') renderPara(root);
    else if (id === 'rw') renderTierB(root);
    else if (id === 'gram') renderTierD(root);
  }
  function stationList() {
    var core = coreSet();
    return stIds().map(function (id) {
      var d = stDef(id), p = stProg(id);
      return { id: id, label: d.label, icon: d.icon, color: d.color, blurb: d.blurb,
               core: !!core[id], done: p.done, n: p.n, of: p.of,
               mount: function (root) { mountStation(id, root); } };
    });
  }
  /* the next core station that is not finished — what the station row pulses and the arrow aims at */
  function todoId() {
    var core = coreSet(), ids = stIds(), i;
    for (i = 0; i < ids.length; i++) if (core[ids[i]] && !stDone(ids[i])) return ids[i];
    return '';
  }
  function showTiers(scroll) {
    if (!TIERS) return;
    var box = $('tiersBox'); if (!box) return;
    var open = openId(), tabs = hostTabs(), h = '';
    h += '<h2 translate="yes">After the story</h2>';
    if (!tabs) {
      /* T-421: the engine draws its own folder tabs once it has them (REEL_HOST.tabs). Until then
         this is the station row: one chip per station with its count, a tick when it is finished,
         and "must do" or "extra" so a student can see what is actually required of them. */
      var first = todoId();
      h += '<div class="sbar" id="sbar">';
      stationList().forEach(function (s) {
        var tag = s.core ? 'must do' : 'extra';
        h += '<button class="stn' + (s.id === open ? ' on' : '') + (s.done ? ' ok' : '') + (s.id === first && s.id !== open ? ' todo' : '') + '" data-s="' + s.id + '">' +
             '<span class="se">' + s.icon + '</span><span><b translate="yes" data-en="' + esc(s.label) + '">' + esc(s.label) + '</b>' +
             '<span class="sn">' + (s.done ? '✓ ' : '') + s.n + ' / ' + s.of + ' <span class="sx" translate="yes" data-en="' + tag + '">' + tag + '</span></span></span></button>';
      });
      h += '</div>';
    }
    h += '<div class="tpanel" id="tpanel"></div>';
    box.innerHTML = h;
    $('tiers').style.display = 'block';
    showDirections(box);
    box.querySelectorAll('.stn[data-s]').forEach(function (b) {
      b.addEventListener('click', function () { tierState().open = b.getAttribute('data-s'); touch(); showTiers(false); });
    });
    mountStation(open, $('tpanel'));
    repaintMarks();
    guide();
    score();
    if (scroll) $('tiers').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ================= Mr. Toby's marks on the writing (T-396) =================
     The engine owns the marks for this page (T-393/T-394): it loads readings/marks.js, fetches
     reel_views.marks, and paints every marked answer in ONE pass so there is ONE arrow. Our part
     is to say which written answers are ours — markItems() — and to take the points off while an
     answer is sent back. Keys: "tB.<i>" per Tier B rewrite, "tC.sum" for the paragraph; "yt.*"
     belongs to the engine. The student page never writes the marks column. */
  function marksNow() { try { return (H.marks && H.marks()) || null; } catch (e) { return null; } }
  function markOff(key, ans) { var m = marksNow(); return !!(window.GALMARK && m && GALMARK.off(m, key, ans)); }
  function markItems() {
    var p = $('tpanel'), out = [];
    if (!p) return out;
    p.querySelectorAll('.rwm textarea').forEach(function (ta) {
      out.push({ key: 'tB.' + ta.getAttribute('data-i'), box: ta.closest('.rw') || ta.parentNode, field: ta });
    });
    var ct = $('cText');
    if (ct) out.push({ key: 'tC.sum', box: ct.closest('.cwrite') || ct.parentNode, field: ct });
    return out;
  }
  function repaintMarks() { try { if (H.marksPaint) H.marksPaint(); } catch (e) {} }

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
    /* T-374: the same arrow My Page uses in its "Do this next" band — a solid green ➤, drawn as
       SVG here (the orange line arrow read as a scratch, and orange is the site's own theme). */
    NUDGE.innerHTML = '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 6 C 30 18, 40 24, 48 28 C 40 32, 30 38, 12 50 C 17 38, 19 32, 19 28 C 19 24, 17 18, 12 6 Z" fill="#1f7a4d"/></svg>';
    document.body.appendChild(NUDGE);
    return NUDGE;
  }
  function hideNudge() { if (NUDGE) NUDGE.style.display = 'none'; }
  function NW() { return (window.innerWidth || 1366) <= 760 ? 42 : 56; }   /* matches .gnudge in CSS */
  function gutter(pan) {
    var v = 0;
    try { v = parseFloat(getComputedStyle(pan).paddingLeft) || 0; } catch (e) {}
    return v || ((window.innerWidth || 1366) <= 760 ? 50 : 66);
  }
  function pointAt(el, below) {
    if (!el || !el.getBoundingClientRect) { hideNudge(); return; }
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) { hideNudge(); return; }
    var n = nudgeEl(), W = NW(), H = W, gap = 2;
    var top = r.top + r.height / 2 - H / 2, mode = 'left', left;
    /* T-421: a station chip sits in the row above the panel, so the arrow goes UNDER it pointing
       up — beside it there is another chip, and above it the heading. */
    if (below) {
      left = Math.max(4, Math.min(r.left + r.width / 2 - W / 2, (window.innerWidth || 1366) - W - 4));
      n.style.display = 'block';
      n.style.left = Math.round(left) + 'px';
      n.style.top = Math.round(r.bottom + gap) + 'px';
      n.className = 'gnudge down';
      return;
    }
    /* T-414: the panel keeps an empty gutter down its left side — the arrow goes THERE, level with
       whatever it points at. Before this it sat just outside the target's own left edge, which on a
       phone left no room and flipped the arrow ABOVE the question, onto the line of text above it.
       In the gutter there is nothing to cover, at any width. */
    var pan = el.closest && el.closest('#tpanel'), pr = pan && pan.getBoundingClientRect();
    if (pr && pr.width) {
      var gut = gutter(pan);
      left = pr.left + Math.max(0, (gut - W) / 2);
      if (left + W > r.left - gap) left = r.left - W - gap;   /* never ride over the target itself */
      left = Math.max(4, left);
    } else {
      left = r.left - W - gap;
      if (left < 4) {                     /* nothing to sit beside: above, pointing down */
        left = Math.max(4, r.left + r.width / 2 - W / 2);
        top = r.top - H - gap;
        mode = 'up';
        if (top < 4) { top = r.bottom + gap; mode = 'down'; }
      }
    }
    n.style.display = 'block';
    n.style.left = Math.round(left) + 'px';
    n.style.top = Math.round(top) + 'px';
    n.className = 'gnudge ' + mode;
  }
  /* T-421: when a station is finished the line and the arrow move on to the next station's chip,
     so a student is never told "ask your teacher" by a page that already knows what comes next. */
  function stationStep() {
    var id = todoId(), extra = false, ids, i;
    if (!id) {
      ids = stIds();
      for (i = 0; i < ids.length; i++) if (!stDone(ids[i])) { id = ids[i]; extra = true; break; }
      if (!id) return { say: 'You finished this part.', at: null };
    }
    var d = stDef(id), chip = $('sbar') ? $('sbar').querySelector('.stn[data-s="' + id + '"]') : null;
    return { say: (extra ? 'Everything you must do is done. Extra practice: ' : 'Next: ') + d.label + '.', at: chip, below: true };
  }
  /* what the student should do right now, read off the open station */
  function nextStep() {
    var p = $('tpanel'); if (!p) return null;
    var open = openId(), q, t;
    if (open === 'gram') {
      q = p.querySelector('.gq:not(.done)');
      /* T-400: the tiles are shuffled, but an arrow on one of them is still an arrow on an answer —
         point at the sentence with the blank instead. */
      if (q) return { say: 'Tap the word that fits in the sentence.', at: q.querySelector('.gs') || q };
      t = p.querySelector('.tstep:not(.ok)');
      if (t) return { say: 'Next: ' + t.getAttribute('data-en'), at: t };
      return stationStep();
    }
    if (open === 'say') {
      if (stDone('say')) return stationStep();
      var rd = tierState().A.read, mic = $('sayMount') ? $('sayMount').querySelector('button') : null;
      return { say: (rd && rd.ok) ? 'Keep going. Listen, then say the next sentence.' : 'Start here — listen, then say the sentence out loud.', at: mic };
    }
    if (open === 'rw') {
      var sw = p.querySelector('.rw:not(.done) .swapw');
      if (sw) return { say: 'Tap an orange word to see other ways to say it.', at: sw };
      var ta = p.querySelector('.rw:not(.done) textarea');
      if (ta) return { say: 'Write the sentence your own way in the box.', at: ta };
      return stationStep();
    }
    if (open === 'para') {
      var nOrd = ordList().length, o = tierState().A.order;
      if ((o.best || 0) < nOrd) {
        var pool = p.querySelector('#opool .ochip');
        if (pool) return { say: 'Tap a sentence. Then tap its place in the list.', at: pool };
        if (p.querySelector('.oslot.bad')) return { say: 'Move the orange ones. What happened first? What happened last?', at: p.querySelector('.oslot.bad') };
        return { say: 'Now press Check.', at: $('ordCheck') };
      }
      /* T-400: point at the QUESTION, never at one of the three answers */
      if (!topicRight()) return { say: 'Read all three. Which one tells the whole story? Tap it.', at: p.querySelector('#pTop .qtext') || p.querySelector('.qtext') };
      if ($('cText')) {
        var C = tierState().C;
        if (!String($('cText').value || '').trim()) return { say: 'Now write your paragraph. Start with your topic sentence.', at: $('cText') };
        if (!writeDone()) return { say: 'Keep writing. Use the sentences in your plan.', at: $('cText') };
        if (!C.checked) return { say: 'Now press Check my writing.', at: $('cCheck') };
        if (!C.revised) return { say: 'Change one thing in your paragraph, then press Turn in.', at: $('cTurnIn') };
      }
      return stationStep();
    }
    return null;
  }
  /* T-421: the Paragraph panel's three chunks tick themselves off, and the plan box under the
     write box keeps up with the order and the topic sentence the student has chosen. */
  function paraMarks() {
    var a = $('pOrd'); if (!a) return;
    var nOrd = ordList().length, o = tierState().A.order, b = $('pTop'), c = $('pWr');
    a.classList.toggle('done', (o.best || 0) >= nOrd);
    if (b) b.classList.toggle('done', topicRight());
    if (c) c.classList.toggle('done', writeDone());
    planFill();
  }
  var CBS = [], lastSig = '';
  function progSig() {
    var s = '';
    try { stIds().forEach(function (id) { var p = stProg(id); s += id + p.n + '/' + p.of + (p.done ? 'd' : '') + ';'; }); } catch (e) { return ''; }
    return s + '|' + assignedTier;
  }
  function changed() {
    var s = progSig();
    if (!s || s === lastSig) return;
    lastSig = s;
    CBS.forEach(function (cb) { try { cb(); } catch (e) {} });
  }
  function updateGuide() {
    var p = $('tpanel');
    /* marks.js points its own arrow at an answer Mr. Toby sent back — ours stands down so there
       is still only ONE arrow on screen (body.gm-fixing is set by GALMARK.paint101). */
    if (document.body.classList.contains('gm-fixing')) {
      var ln = p && p.querySelector('.gline'); if (ln) ln.remove();
      hideNudge(); return;
    }
    if (!p || !$('tiers') || $('tiers').style.display !== 'block') { hideNudge(); return; }
    paraMarks(); changed();
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
    pointAt(step.at, step.below);
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
  /* ---------- STATION: Say it (T-421; was Tier A step 1) ----------
     The Key sentences deck is the core: five sentences, said out loud. The Scene decks that say.js
     also shows are extra practice and never lower a score. */
  function renderSay(root) {
    var kf = nKey();
    root.innerHTML = dir('Listen to each sentence. Then say it out loud. The microphone shows a check when it understands you.', 'p', 'lead') +
      '<div class="sayx">' + dir('Do the ' + kf + ' Key sentences first — those are the ones you must do. The Scene lists after them are extra practice.', 'p') + '</div>' +
      '<div class="saywrap" id="sayMount"></div>';
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
      onProgress: function (ok, total) {
        var A = tierState().A, rd = A.read || (A.read = {});
        rd.ok = ok; rd.total = total;
        sayKeyOk();                                  /* re-reads the key deck's own count off its chip */
        score(); touch(); guide();
      }
    });
    guide();
  }
  /* ---------- STATION: Paragraph (T-421; was Tier A steps 2-3 + Tier C) ----------
     One panel, three chunks, no step pills: put the story in order, pick the topic sentence, write
     the paragraph. The first two are the PLAN for the third — the sentences the student ordered and
     the topic sentence they picked sit in a bordered box right above the write box, each with its
     own listen button, so the writing starts from work they have already done. */
  function renderPara(root) {
    var core = coreSet(), h = '';
    /* every chunk gets a picture from the episode's own scenes, floated beside the work (standing
       rule): the first scene over the ordering, the last one over the topic sentence, and the whole
       storyboard beside the write box. */
    var sc = EP.scenes || [], pic = function (i) {
      var s = sc[i]; return s ? '<div class="gpic">' + R.sceneSVG(boardState(s)) + '</div>' : '';
    };
    h += '<div class="pchunk" id="pOrd">' + pic(0) + '<h3><span class="pnum">1</span><span translate="yes" data-en="Put the story in order">Put the story in order</span></h3><div id="pOrdBody"></div></div>';
    h += '<div class="pchunk" id="pTop">' + pic(sc.length - 1) + '<h3><span class="pnum">2</span><span translate="yes" data-en="Pick the topic sentence">Pick the topic sentence</span></h3><div id="pTopBody"></div></div>';
    if (core.write) h += '<div class="pchunk" id="pWr"><h3><span class="pnum">3</span><span translate="yes" data-en="Write your paragraph">Write your paragraph</span></h3><div id="pWrBody"></div></div>';
    root.innerHTML = h;
    showDirections(root);
    renderOrder($('pOrdBody'));
    renderTopic($('pTopBody'));
    if (core.write) renderTierC($('pWrBody'));
    paraMarks();
    guide();
  }
  /* the plan box inside chunk 3 */
  function planFill() {
    var host = $('cPlan'); if (!host) return;
    var LIST = ordList(), o = tierState().A.order, T = TIERS.topic, tp = tierState().A.topic;
    var lines = (o.slots || []).filter(function (v) { return v != null; }).map(function (v) { return LIST[v].t; });
    var sig = lines.join('|') + '||' + (tp.pick != null ? tp.pick : '') + '||' + (state.lang || '');
    if (host.getAttribute('data-sig') === sig) return;
    host.setAttribute('data-sig', sig);
    var h = '<span class="lab" translate="yes" data-en="Your plan">Your plan</span>';
    if (!lines.length) h += dir('Put the story in order up above, and your sentences will show up here.', 'p', 'soft');
    else {
      h += '<ol>';
      lines.forEach(function (s) { h += '<li><button class="osay" data-say="' + esc(s) + '" aria-label="Listen">🔊</button> <span translate="no">' + esc(s) + '</span></li>'; });
      h += '</ol>';
    }
    if (tp.pick != null && tp.pick === T.good) {
      h += '<p class="ptop"><span translate="yes" data-en="Start with this sentence:">Start with this sentence:</span> ' +
           '<b translate="no">' + esc(T.opts[T.good]) + '</b> <button class="osay" data-say="' + esc(T.opts[T.good]) + '" aria-label="Listen">🔊</button></p>';
    }
    host.innerHTML = h;
    showDirections(host);
    host.querySelectorAll('.osay').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(b.getAttribute('data-say')); });
    });
  }

  /* T-400: shuffledIdx refuses the data order on purpose — the ordering chips must never arrive
     already in the right sequence. For a multiple choice that bias is wrong: with three options
     it pushes the first option into slot 1 only a fifth of the time. Answer choices use a plain
     fair shuffle instead. */
  function fairIdx(n) {
    var a = [], i, j, t;
    for (i = 0; i < n; i++) a.push(i);
    for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
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
    function redraw() { touch(); renderOrder(root); guide(); }   /* T-374: the line keeps up with each placement */
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
  /* T-421: nothing red in ELD 101. A wrong topic sentence FADES out, a cast member says one line
     and a hint follows; on the third miss (or when only the right one is left standing) the answer
     is shown with its sound and the student taps it once for the full point — the standing
     reveal-after-3-misses rule. Only the green tick is ever shown. Every try is recorded for the
     dashboard, and the point counts on any try (fair-scores rule). */
  function renderTopic(root) {
    var T = TIERS.topic, tp = tierState().A.topic, h = '';
    /* T-400: the options used to be drawn in data order, and every episode so far has good: 0 —
       so the right answer sat first and the arrow pointed straight at it. Shuffle once per
       student and keep the order (like the ordering chips and the grammar tiles), so a reload
       never moves them. tp.pick and T.good stay indexes into T.opts, not into the shuffle. */
    if (!tp.shuf || tp.shuf.length !== T.opts.length) { tp.shuf = fairIdx(T.opts.length); touch(); }
    if (!tp.out) tp.out = [];
    var right = tp.pick != null && tp.pick === T.good;
    h += '<p class="lead"><span translate="yes" data-en="A topic sentence tells what the whole story is about.">A topic sentence tells what the whole story is about.</span></p>';
    h += '<p class="qtext" translate="no">' + esc(T.ask) + '</p><div class="topts">';
    tp.shuf.forEach(function (i) {
      var cls = '';
      if (right && i === T.good) cls = ' right';
      else if (tp.out.indexOf(i) >= 0) cls = ' gone';
      else if (tp.shown && i === T.good) cls = ' show';
      h += '<div class="toptrow"><button class="osay" data-k="' + i + '" aria-label="Listen">🔊</button>' +
           '<button class="qopt' + cls + '" data-i="' + i + '" translate="no"' + (right ? ' disabled' : '') + '>' + esc(T.opts[i]) + '</button></div>';
    });
    h += '</div><div class="qmsg" id="topicMsg"></div>';
    root.innerHTML = h;
    showDirections(root);
    function msgRight() {
      var m = $('topicMsg'); if (!m) return;
      m.innerHTML = '<span class="gok" translate="yes" data-en="' + esc(T.why[T.good]) + '">✓ ' + esc(T.why[T.good]) + '</span>';
      showDirections(m);
    }
    function msgMiss(i, shown) {
      var m = $('topicMsg'); if (!m) return;
      var qp = QUIPS[Math.max(0, tp.tries - 1) % QUIPS.length];
      var line = shown ? 'Here is the answer. Tap it once, and you still get the point.' : qp.line;
      m.innerHTML = '<div class="gquip">' + headSVG(qp.who) + '<p translate="yes" data-en="' + esc(line) + '">' + esc(line) + '</p></div>' +
                    '<p class="ghint" translate="yes" data-en="' + esc(T.why[i]) + '">💡 ' + esc(T.why[i]) + '</p>';
      showDirections(m);
    }
    if (right) msgRight();
    root.querySelectorAll('.osay').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(T.opts[+b.getAttribute('data-k')]); });
    });
    root.querySelectorAll('.qopt').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        if (tp.pick != null && tp.pick === T.good) return;
        if (tp.out.indexOf(i) >= 0) return;
        tp.tries++; if (tp.first == null) tp.first = (i === T.good);
        if (i === T.good) {
          tp.pick = i; score(); touch(); save();
          renderTopic(root); msgRight(); paraMarks(); guide();
          speakPlain(T.opts[i]);
          return;
        }
        tp.out.push(i);
        b.classList.add('wobble');
        var standing = T.opts.length - tp.out.length - 1;        /* wrong ones still on screen */
        var shown = tp.tries >= 3 || standing <= 0;
        if (shown) { tp.shown = true; speakPlain(T.opts[T.good]); }
        score(); touch(); save();
        setTimeout(function () { renderTopic(root); msgMiss(i, shown); guide(); }, 420);
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
      ta.addEventListener('input', function () { B.rw[+ta.getAttribute('data-i')] = ta.value; score(); touch(); guide(); repaintMarks(); });
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
         '<div class="plan" id="cPlan"></div>' +            /* T-421: the order + topic sentence, as the plan */
         '<span class="lab" translate="yes" data-en="My paragraph">My paragraph</span>' +
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
    planFill();
    function count() { var n = wordsOf($('cText').value).length; $('cCount').textContent = n + (n === 1 ? ' word' : ' words'); }
    count();
    $('cText').addEventListener('input', function () {
      C.text = this.value; count();
      if (C.checked && norm(C.text) && norm(C.text) !== norm(C.draft1)) C.revised = true;
      score(); touch(); guide(); repaintMarks();
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
    /* T-421: the assignment changes which station is this student's core, so forget the saved
       "open" and let openId() land on the first core station they have not finished. */
    if (assignedTier) { tierState().open = ''; tierState().askNext = false; }
    changed();
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
    markItems: markItems,          /* T-396: the engine paints these with its own (one arrow) */
    ready: function () { return !!TIERS; },
    /* T-421, for the engine's folder tabs */
    stations: function () { return TIERS ? stationList() : []; },
    nextStep: function () { return TIERS ? nextStep() : null; },
    onChange: function (cb) { if (typeof cb === 'function') CBS.push(cb); },
    coreDone: coreDone,
    open: function (id) {
      if (!TIERS) return '';
      if (id) { tierState().open = LEGACY[id] || id; touch(); if ($('tiers') && $('tiers').style.display === 'block') showTiers(false); }
      return openId();
    }
  };
  if (EP.tiers || window.EP_TIERS) init();
  else addScript('tiers-data.js', init);   /* epNN/tiers-data.js beside the episode page */
})();
