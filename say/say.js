/* =====================================================================
   say.js — the "Say the words" engine, mounted inside a host page.

   Replaces <iframe src="/readings/say/?set=…&embed=1">. The engine draws
   no header and no directions of its own (the host section already has
   them), uses the host's font, and takes its colors from CSS variables
   the host may set on the mount element:

     --say-accent   buttons, selected chip, progress   (default #3C3489)
     --say-soft     tint behind the accent               (default #EEEDFE)
     --say-ink      text                                 (default inherit)
     --say-muted    secondary text                       (default #777)
     --say-card     card background                      (default #fff)
     --say-line     borders                              (default #e5e3de)
     --say-ok / --say-ok-soft   correct                  (#0F6E56 / #E1F5EE)
     --say-no / --say-no-soft   try again                (#A32D2D / #FBE5E1)
     --say-rec      the red record button                (default #dd3b33)
     --say-radius   corner radius                        (default 12px)

   Usage:
     <script src="/readings/say/sets.js"></script>
     <script src="/readings/say/say.js"></script>
     var ctl = Say.mount(document.getElementById('sayMount'), {
       set: 'firstpeoples',                // key in SAY_SETS (or pass decks:[…])
       student: function(){ return student; },   // {email,name,period} or a getter
       lang: function(){ return curLang; },      // 'es' / 'Spanish' / 'none', or a getter
       translate: function(text, anchorEl){ … }, // optional: host's own tap-to-translate
       onProgress: function(ok, total, done){ … } // optional
     });
     ctl.refresh()   // re-read student/lang getters and redraw
     ctl.destroy()

   Needs /readings/speaking/speak-core.js (window.GS) for the mic; say.js
   loads it itself if it is not already on the page.
   Saves one row per student per set to say_work (same table and shape
   as the old /say/ page, so the dashboards do not change) and one row
   per attempt to speaking_attempts through GS.saveAttempt.
   No localStorage for student work. String concatenation only.
   ===================================================================== */
(function(){
var Say = window.Say = window.Say || {};
if (Say.mount) return;

var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var TABLE = 'say_work';
var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var CORE_SRC = '/readings/speaking/speak-core.js';
var ACCEPT = 0.55, PRAISE = ['Clear!','Nice!','Great!','Got it!','Perfect!'];

var LANGS = ['Spanish','Cantonese','Mandarin','Arabic','Darija','Vietnamese','Russian','Urdu','Tagalog','French','Korean','Hindi','Somali','Nepali','Thai','Portuguese','Persian'];
var CODE2NAME = { es:'Spanish', zh:'Mandarin', 'zh-CN':'Mandarin', 'zh-TW':'Mandarin', yue:'Cantonese', ar:'Arabic', ary:'Darija', vi:'Vietnamese', ru:'Russian', ur:'Urdu', tl:'Tagalog', fr:'French', ko:'Korean', hi:'Hindi', so:'Somali', ne:'Nepali', th:'Thai', pt:'Portuguese', fa:'Persian' };
var RTL = /^(Arabic|Darija|Urdu|Persian)$/;

function H(pref){ var h = {'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'}; if (pref) h['Prefer'] = pref; return h; }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function val(x){ return typeof x === 'function' ? x() : x; }
function tidy(s){ return (s || '').toLowerCase().replace(/[^a-z' ]/g,' ').replace(/\s+/g,' ').trim(); }
function langName(v){ if (!v || v === 'none' || v === '') return 'none'; if (CODE2NAME[v]) return CODE2NAME[v]; for (var i = 0; i < LANGS.length; i++) if (LANGS[i].toLowerCase() === String(v).toLowerCase()) return LANGS[i]; return 'none'; }
Say.langName = langName;

/* ---------------- styles: one <style>, scoped to .sayjs ---------------- */
var CSS = [
'.sayjs{--sj-accent:var(--say-accent,#3C3489);--sj-soft:var(--say-soft,#EEEDFE);--sj-muted:var(--say-muted,#777);--sj-card:var(--say-card,#fff);--sj-line:var(--say-line,#e5e3de);--sj-ok:var(--say-ok,#0F6E56);--sj-ok-soft:var(--say-ok-soft,#E1F5EE);--sj-no:var(--say-no,#A32D2D);--sj-no-soft:var(--say-no-soft,#FBE5E1);--sj-rec:var(--say-rec,#dd3b33);--sj-r:var(--say-radius,12px);position:relative;color:var(--say-ink,inherit);font:inherit;line-height:1.5}',
'.sayjs *{box-sizing:border-box}',
'.sayjs button{font:inherit;color:inherit;cursor:pointer;margin:0}',
'.sayjs button:disabled{opacity:.4;cursor:default}',
'.sayjs button:focus-visible{outline:2px solid var(--sj-accent);outline-offset:2px}',
'.sj-decks{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 .9rem}',
'.sj-chip{font-size:.9em;font-weight:600;padding:6px 13px;border-radius:999px;border:1.5px solid var(--sj-line);background:var(--sj-card);color:var(--sj-muted)}',
'.sj-chip.sel{background:var(--sj-soft);color:var(--sj-accent);border-color:var(--sj-accent)}',
'.sj-chip.ok{background:var(--sj-ok-soft);color:var(--sj-ok);border-color:var(--sj-ok)}',
'.sj-card{background:var(--sj-card);border:1px solid var(--sj-line);border-radius:14px;padding:1rem 1.2rem 1.1rem}',
'.sj-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:.9rem}',
'.sj-num{font-size:.85em;font-weight:700;color:var(--sj-accent);background:var(--sj-soft);border-radius:999px;padding:2px 11px}',
'.sj-dots{display:inline-flex;gap:5px;align-items:center}',
'.sj-dot{width:8px;height:8px;border-radius:50%;background:var(--sj-line);display:inline-block}',
'.sj-dot.on{background:var(--sj-ok)}.sj-dot.err{background:var(--sj-no)}.sj-dot.cur{outline:2px solid var(--sj-accent);outline-offset:1px}',
'.sj-word{font-size:2.1em;font-weight:800;line-height:1.2;text-align:center;letter-spacing:-.01em;margin:.3em 0 .35em;color:var(--sj-accent)}',
'.sj-ears{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:.9rem}',
'.sj-ear{display:inline-flex;align-items:center;gap:5px;border:1.5px solid var(--sj-line);background:var(--sj-card);border-radius:999px;padding:5px 13px;font-size:.9em;font-weight:600;color:var(--sj-muted)}',
'.sj-ear svg{width:17px;height:17px}',
'.sj-ear:hover,.sj-ear.playing{border-color:var(--sj-accent);color:var(--sj-accent);background:var(--sj-soft)}',
'.sj-slot{display:flex;align-items:center;gap:12px}',
'.sj-mic{flex:none;width:54px;height:54px;border-radius:50%;border:0;background:var(--sj-rec);color:#fff;display:grid;place-items:center;box-shadow:0 0 0 4px rgba(221,59,51,.18)}',
'.sj-mic svg{width:26px;height:26px}',
'.sj-mic.live{background:#1a1a1a;box-shadow:0 0 0 4px var(--sj-accent)}',
'@media (prefers-reduced-motion:no-preference){.sj-mic.live{animation:sj-pulse 1.1s ease-in-out infinite}@keyframes sj-pulse{0%,100%{box-shadow:0 0 0 3px var(--sj-accent)}50%{box-shadow:0 0 0 11px var(--sj-soft)}}}',
'.sj-rule{flex:1;min-height:52px;display:flex;align-items:flex-end;flex-wrap:wrap;gap:4px 10px;border-bottom:2px dashed var(--sj-line);padding:4px 2px 6px}',
'.sj-rule.fin{border-bottom-style:solid;border-bottom-color:var(--sj-ok)}',
'.sj-hint{color:var(--sj-muted);font-size:.9em}',
'.sj-hint.no{color:var(--sj-no)}',
'.sj-listening{font-weight:700;font-size:.9em;width:100%}',
'.sj-interim{color:var(--sj-muted);font-style:italic;font-size:.9em}',
'.sj-said{font-size:1.25em;font-weight:700;color:var(--sj-ok)}',
'.sj-okp{font-size:.8em;font-weight:700;color:#fff;background:var(--sj-ok);border-radius:999px;padding:2px 10px;margin-left:auto}',
'.sj-nudge{margin:10px 0 0 66px;font-size:.9em;color:var(--sj-muted);display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px}',
'.sj-nudge:empty{display:none}',
'.sj-nudge .sj-tip{width:100%;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-weight:700;font-size:1.05em;color:var(--say-ink,inherit)}',
'.sj-nudge .sj-ear{padding:3px 10px;font-size:.85em}',
'.sj-link{background:none;border:0;padding:0 2px;color:var(--sj-accent);text-decoration:underline;font-weight:600}',
'.sj-nav{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:1rem}',
'.sj-btn{border:1.5px solid var(--sj-line);border-radius:var(--sj-r);padding:9px 18px;font-weight:600;background:var(--sj-card);color:var(--sj-muted)}',
'.sj-btn.primary{background:var(--sj-accent);border-color:var(--sj-accent);color:#fff}',
'.sj-btn.primary:hover{filter:brightness(1.12)}',
'.sj-done{text-align:center;padding:1.2rem;background:var(--sj-ok-soft);color:var(--sj-ok);border-radius:14px;font-weight:700;margin-top:.9rem}',
'.sj-pop{position:absolute;z-index:40;max-width:320px;background:var(--sj-card);border:1px solid var(--sj-line);border-radius:11px;padding:.65rem .9rem;font-size:.9em;line-height:1.55;box-shadow:0 6px 22px rgba(0,0,0,.16)}',
'.sj-pop .sj-x{position:absolute;top:2px;right:6px;background:none;border:0;font-size:1.3em;color:var(--sj-muted);padding:0 4px}',
'.sj-pop .sj-src{display:block;font-weight:700;color:var(--sj-accent);padding-right:18px}',
'.sj-pop .sj-dst{font-size:1.15em;margin-top:3px}',
'.sj-pop .sj-mean{color:var(--sj-muted);font-size:.9em;margin-top:2px}',
'.sj-pop .rtl{direction:rtl;text-align:right}',
'@media (max-width:520px){.sj-word{font-size:1.7em}.sj-nudge{margin-left:0}.sj-card{padding:.85rem .9rem 1rem}}'
].join('\n');
function ensureCss(){ if (document.getElementById('sayjs-css')) return; var st = document.createElement('style'); st.id = 'sayjs-css'; st.textContent = CSS; document.head.appendChild(st); }

var EAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
var MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function ears(t){ return '<button type="button" class="sj-ear" data-say="'+esc(t)+'" aria-label="Listen">'+EAR+'<span>Listen</span></button><button type="button" class="sj-ear" data-say="'+esc(t)+'" data-slow="1" aria-label="Listen slowly">Slow</button>'; }

/* ---------------- speech ---------------- */
var VOICE = null;
function pickVoice(){ if (!window.speechSynthesis) return; var vs = speechSynthesis.getVoices() || []; if (!vs.length) return;
  var en = vs.filter(function(v){ return /^en[-_]US/i.test(v.lang); }); if (!en.length) en = vs.filter(function(v){ return /^en/i.test(v.lang); }); if (!en.length) return;
  var fem = /Samantha|Aria|Jenny|Zira|Karen|Moira|Tessa|Victoria|Allison|Ava|Susan|Zoe|Female|Chrome OS US English|Google US English/i, male = /David|Mark|Guy|Alex|Daniel|Fred|Male/i;
  var local = en.filter(function(v){ return v.localService; }), pool = local.length ? local : en, best = null;
  pool.forEach(function(v){ if (!best && fem.test(v.name)) best = v; }); if (!best) pool.forEach(function(v){ if (!best && !male.test(v.name)) best = v; }); VOICE = best || pool[0]; }
if (window.speechSynthesis){ pickVoice(); speechSynthesis.addEventListener('voiceschanged', pickVoice); }
function sayable(t){ t = String(t).replace(/_+/g, ' blank '); if (/^\s*I\s*[.!?]?\s*$/.test(t)) return 'eye'; return t.replace(/\bI\b(?=\s*$)/, 'eye'); }  /* a lone "I" is read as "eye", never "capital I" */
function speak(text, slow, btn){ if (!window.speechSynthesis) return;
  var S = speechSynthesis; try { S.cancel(); S.resume(); } catch(e){}
  if (!VOICE) pickVoice();
  var started = false, tries = 0;
  function go(useVoice){ tries++; var u = new SpeechSynthesisUtterance(sayable(text)); u.lang = 'en-US'; u.rate = slow ? 0.62 : 0.9; if (useVoice && VOICE){ try { u.voice = VOICE; } catch(e){ VOICE = null; } }
    u.onstart = function(){ started = true; if (btn) btn.classList.add('playing'); };
    u.onend = u.onerror = function(){ if (btn) btn.classList.remove('playing'); };
    S.speak(u);
    setTimeout(function(){ if (!started && tries < 2){ try { S.cancel(); } catch(e){} go(false); } }, 1500); }
  setTimeout(function(){ go(true); }, 60); }
Say.speak = speak;

/* ---------------- speak-core loader ---------------- */
var coreP = null;
function ensureCore(){ if (window.GS && window.GS.micButton) return Promise.resolve(window.GS);
  if (coreP) return coreP;
  coreP = new Promise(function(res){ var s = document.createElement('script'); s.src = CORE_SRC; s.onload = function(){ res(window.GS || null); }; s.onerror = function(){ res(null); }; document.head.appendChild(s); });
  return coreP; }

/* ---------------- translate (built-in popup; host may override) ---------------- */
var trCache = {};
function fetchTr(text, lang){ var key = lang + '|' + text; if (trCache[key]) return Promise.resolve(trCache[key]);
  var url = PROXY + '?action=translate&idiom=' + encodeURIComponent(text) + '&meaning=' + encodeURIComponent('A simple English word, sentence, or instruction for beginner English learners. Translate it plainly.') + '&lang=' + encodeURIComponent(lang);
  return fetch(url).then(function(r){ return r.json(); }).then(function(d){ if (d && d.ok && d.translation){ trCache[key] = d.translation; return d.translation; } return null; }).catch(function(){ return null; }); }

/* ---------------- mount ---------------- */
Say.mount = function(root, opts){
  opts = opts || {}; ensureCss();
  if (root._say) root._say.destroy();
  root.classList.add('sayjs'); root.setAttribute('translate', 'no');
  var setName = opts.set || opts.setName || '';
  var SET = opts.decks ? {decks:opts.decks} : ((window.SAY_SETS || {})[setName]);
  var DB_SET = opts.setName || setName || 'custom';
  var A = {}, dirty = false, timer = null, loadedFor = '', dead = false, saved = {ok:0};
  function student(){ var s = val(opts.student); return (s && s.email) ? s : null; }
  function lang(){ return langName(val(opts.lang)); }
  function decks(){ return SET.decks; }

  if (!SET || !SET.decks){ root.innerHTML = '<p class="sj-hint">Word set "' + esc(setName) + '" was not found. Known sets: ' + esc(Object.keys(window.SAY_SETS || {}).join(', ')) + '</p>'; return {destroy:function(){}, refresh:function(){}}; }

  function okCount(){ var n = 0, t = 0; decks().forEach(function(d){ d.items.forEach(function(x){ t++; if ((A.w[d.k+'|'+x] || {}).ok) n++; }); }); return {ok:n, total:t}; }
  function progress(){ var c = okCount(); if (opts.onProgress && c.ok !== saved.ok){ saved.ok = c.ok; try { opts.onProgress(c.ok, c.total, c.ok === c.total); } catch(e){} } return c; }

  function render(){
    if (dead) return;
    A.w = A.w || {}; A.wi = A.wi || {}; A.wdeck = A.wdeck || decks()[0].k;
    var V = decks(), deck = V.filter(function(d){ return d.k === A.wdeck; })[0] || V[0];
    var items = deck.items, i = Math.min(A.wi[deck.k] || 0, items.length - 1), it = items[i], st = A.w[deck.k+'|'+it] || {};
    var c = progress(), allDone = c.ok === c.total;
    var h = '<div class="sj-decks">' + V.map(function(d){ var n = d.items.filter(function(x){ return (A.w[d.k+'|'+x] || {}).ok; }).length; return '<button type="button" class="sj-chip ' + (d.k === deck.k ? 'sel' : (n === d.items.length ? 'ok' : '')) + '" data-deck="' + esc(d.k) + '">' + esc(d.e || '') + ' ' + esc(d.name) + ' ' + n + '/' + d.items.length + '</button>'; }).join('') + '</div>';
    h += '<div class="sj-card">';
    h += '<div class="sj-top"><span class="sj-num">' + (i+1) + ' / ' + items.length + '</span><span class="sj-dots">' + items.map(function(x, xi){ var s = A.w[deck.k+'|'+x] || {}; return '<span class="sj-dot ' + (s.ok ? 'on' : (s.tries ? 'err' : '')) + (xi === i ? ' cur' : '') + '"></span>'; }).join('') + '</span></div>';
    h += '<div class="sj-word">' + esc(it) + '</div>';
    h += '<div class="sj-ears">' + ears(it) + '<button type="button" class="sj-ear" data-tr="' + esc(it) + '">translate</button></div>';
    h += '<div class="sj-slot"><button type="button" class="sj-mic" aria-label="Record">' + MIC + '</button><div class="sj-rule' + (st.ok ? ' fin' : '') + '">' + (st.ok ? '<span class="sj-said">' + esc(it) + '</span><span class="sj-okp">' + esc(st.p || 'Clear!') + '</span>' : '<span class="sj-hint">Tap the red button, say it, tap again.</span>') + '</div></div>';
    h += '<div class="sj-nudge"></div>';
    h += '<div class="sj-nav"><button type="button" class="sj-btn" data-go="-1" ' + (i === 0 ? 'disabled' : '') + '>← Back</button><button type="button" class="sj-btn primary" data-go="1">' + (i === items.length - 1 ? (V.indexOf(deck) < V.length - 1 ? 'Next list →' : 'Finish →') : 'Next word →') + '</button></div>';
    h += '</div>';
    if (allDone) h += '<div class="sj-done">You said every word! ' + c.ok + ' / ' + c.total + '</div>';
    root.innerHTML = h;
    wireMic(deck, i, it);
    speak(it);
  }
  function go(deck, i, d){ var V = decks(), items = deck.items, n = i + d;
    if (n >= items.length){ var di = V.indexOf(deck); if (di < V.length - 1){ A.wdeck = V[di+1].k; } else { A.wi[deck.k] = items.length - 1; render(); return; } }
    else if (n < 0){ n = 0; A.wi[deck.k] = n; }
    else A.wi[deck.k] = n;
    dirty = true; render(); }

  function wireMic(deck, i, it){
    var mic = root.querySelector('.sj-mic'), rule = root.querySelector('.sj-rule'), nudgeEl = root.querySelector('.sj-nudge');
    function nudge(x){ nudgeEl.innerHTML = x; }
    ensureCore().then(function(GS){
      if (dead || !GS || !GS.micButton){ mic.onclick = function(){ rule.innerHTML = '<span class="sj-hint no">The recording tool did not load. Reload the page.</span>'; }; return; }
      if (mic._wired) return; mic._wired = true;
      var tries = 0;
      GS.micButton(mic, {label:'Record', maxMs:6000,
        onStart:function(){ nudge(''); rule.classList.remove('fin'); rule.innerHTML = '<span class="sj-listening">Listening…</span><span class="sj-interim"></span>'; },
        onInterim:function(t){ var s = rule.querySelector('.sj-interim'); if (s) s.textContent = t; },
        onDone:function(res){
          if (dead) return;
          if (res.error === 'not-allowed' || res.error === 'nomic' || res.error === 'service-not-allowed'){ rule.innerHTML = '<span class="sj-hint no">The microphone is off.</span>'; nudge('Click the lock next to the web address. Set <b>Microphone</b> to <b>Allow</b>. Then try again.'); return; }
          tries++; var rec = A.w[deck.k+'|'+it] || {tries:0}; rec.tries = (rec.tries || 0) + 1;
          var m = null, ok = false, heard = '', alts = res.alts || [];
          if (GS.canRecognize && alts.length){ m = GS.bestMatch(alts, [it]); heard = m.heard || alts[0].t || ''; var tgt = tidy(it);
            ok = m.score >= ACCEPT || alts.some(function(a){ var t = tidy(a.t); return t === tgt || t.indexOf(tgt) >= 0 || (tgt.indexOf(t) >= 0 && t.length > 2); }); }
          else if (!GS.canRecognize){ ok = true; }
          rec.heard = heard; if (ok){ rec.ok = true; rec.p = pick(PRAISE); }
          A.w[deck.k+'|'+it] = rec; dirty = true;
          var me = student() || {};
          try { GS.saveAttempt({activity:'say-'+DB_SET, item_id:deck.k+'|'+it, exchange_id:(me.email || '')+'-'+deck.k, round:1, line_no:i+1, role:'word', email:me.email || null, speaker_name:me.name || null, period:me.period || null, device_email:me.email || null, target_text:it, said_text:ok ? it : null, transcript:heard || null, alternatives:alts.slice(0,5), match_score:m ? Math.round(m.score*1000)/1000 : null, attempt_no:tries, accepted:ok, practice:false, seconds:res.secs ? Math.round(res.secs*10)/10 : null}, res.blob); } catch(e){}
          if (ok){ rule.classList.add('fin'); rule.innerHTML = '<span class="sj-said">' + esc(it) + '</span><span class="sj-okp">' + esc(rec.p) + '</span>'; speak(it); progress(); save();
            setTimeout(function(){ if (!dead && (A.wi[deck.k] === i || A.wi[deck.k] == null) && A.wdeck === deck.k) go(deck, i, 1); }, 1100); return; }
          rule.innerHTML = '<span class="sj-hint no">' + (heard ? 'I heard: <b>' + esc(heard) + '</b>.' : 'I did not hear you.') + '</span>';
          nudge('<span class="sj-tip"><span>' + esc(it) + '</span>' + ears(it) + '</span><span>Listen, then tap the red button and say it again.' + (tries >= 3 ? ' Or <button type="button" class="sj-link" data-skip="1">skip this word</button>.' : '') + '</span>');
          save();
        }
      });
    });
  }

  /* one click handler for the whole mount */
  function onClick(e){
    var t = e.target.closest ? e.target.closest('button,.sj-x') : null; if (!t || !root.contains(t)) return;
    if (t.hasAttribute('data-say')){ e.preventDefault(); speak(t.getAttribute('data-say'), !!t.getAttribute('data-slow'), t); return; }
    if (t.hasAttribute('data-deck')){ A.wdeck = t.getAttribute('data-deck'); dirty = true; render(); return; }
    if (t.hasAttribute('data-go')){ var V = decks(), deck = V.filter(function(d){ return d.k === A.wdeck; })[0] || V[0]; go(deck, Math.min(A.wi[deck.k] || 0, deck.items.length - 1), +t.getAttribute('data-go')); return; }
    if (t.hasAttribute('data-skip')){ var V2 = decks(), dk = V2.filter(function(d){ return d.k === A.wdeck; })[0] || V2[0]; go(dk, Math.min(A.wi[dk.k] || 0, dk.items.length - 1), 1); return; }
    if (t.hasAttribute('data-tr')){ e.stopPropagation(); translate(t.getAttribute('data-tr'), t); return; }
    if (t.classList.contains('sj-x')){ closePop(); return; }
  }
  root.addEventListener('click', onClick);

  function closePop(){ var p = root.querySelector('.sj-pop'); if (p) p.remove(); }
  function translate(text, anchor){
    if (opts.translate){ try { opts.translate(text, anchor); } catch(e){} return; }
    var L = lang(); closePop();
    var p = document.createElement('div'); p.className = 'sj-pop'; var rtl = RTL.test(L) ? ' rtl' : '';
    function fill(dst, mean){ p.innerHTML = '<button type="button" class="sj-x" aria-label="Close">×</button><span class="sj-src">' + esc(text) + '</span><div class="sj-dst' + rtl + '">' + esc(dst) + '</div>' + (mean ? '<div class="sj-mean' + rtl + '">' + esc(mean) + '</div>' : ''); }
    fill(L === 'none' ? 'Choose your language at the top of the page.' : '…', '');
    root.appendChild(p);
    var rr = root.getBoundingClientRect(), ar = anchor.getBoundingClientRect(); var left = ar.left - rr.left, top = ar.bottom - rr.top + 8; var max = root.clientWidth - 320 - 8; if (left > max) left = Math.max(8, max); p.style.left = left + 'px'; p.style.top = top + 'px';
    if (L === 'none') return;
    fetchTr(text, L).then(function(tr){ if (!p.parentNode) return; if (tr) fill(tr.equiv || tr.meaning || '', tr.equiv ? tr.meaning : ''); else fill('Translation is not available right now.', ''); });
  }
  function onDocClick(e){ if (!e.target.closest || !e.target.closest('.sj-pop,[data-tr]')) closePop(); }
  document.addEventListener('click', onDocClick);

  /* ---- save / load: one row per student per set, no localStorage ---- */
  function save(){ var me = student(); if (!me) return; dirty = false;
    var c = okCount();
    var row = {email:me.email, set:DB_SET, name:me.name || '', period:me.period || '', lang:lang(), answers:A, scores:{words0:{correct:c.ok, total:c.total}}, completed:c.ok === c.total, updated_at:new Date().toISOString()};
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?on_conflict=email,set', {method:'POST', headers:H('resolution=merge-duplicates,return=minimal'), body:JSON.stringify(row)})
      .then(function(r){ if (!r.ok) dirty = true; }).catch(function(){ dirty = true; }); }
  function load(){ var me = student(); if (!me){ render(); return; } if (loadedFor === me.email){ render(); return; } loadedFor = me.email;
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?select=answers&email=eq.' + encodeURIComponent(me.email) + '&set=eq.' + encodeURIComponent(DB_SET), {headers:H()})
      .then(function(r){ return r.json(); }).then(function(rows){ if (rows && rows.length && rows[0].answers) A = rows[0].answers; render(); }).catch(function(){ render(); }); }
  timer = setInterval(function(){ if (dirty) save(); }, 20000);
  function onUnload(){ if (dirty) save(); }
  window.addEventListener('beforeunload', onUnload);

  var ctl = {
    refresh:function(){ load(); },
    setLang:function(){ dirty = true; },
    save:save,
    destroy:function(){ dead = true; clearInterval(timer); root.removeEventListener('click', onClick); document.removeEventListener('click', onDocClick); window.removeEventListener('beforeunload', onUnload); if (dirty) save(); root.innerHTML = ''; root._say = null; }
  };
  root._say = ctl;
  ensureCore().then(function(GS){ if (GS) GS.say = speak; });
  load();
  return ctl;
};
})();
