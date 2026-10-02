/* vets01.js — shared engine for the Shopping Day practice modules.
   Needs: /readings/speaking/speak-core.js (GS) and data.js (SD) loaded first,
   and /readings/track.js loaded last.
   String concatenation only; no template literals. */
(function(){
var V = window.V = {};
V.SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
V.SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
V.TABLE = 'vets_modules';
V.me = null; V.state = {}; V.module = ''; V.score = 0; V.max = 0; V.completed = false;
var dirty = false, saving = false;

function $(id){ return document.getElementById(id); }
V.esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
V.H = function(pref){
  var h = {'apikey':V.SUPA_KEY, 'Authorization':'Bearer ' + V.SUPA_KEY, 'Content-Type':'application/json'};
  if (pref) h['Prefer'] = pref;
  return h;
};
V.shuffle = function(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
V.canon = function(e){ e = String(e || '').trim().toLowerCase(); if (/@sfusd\.edu$/.test(e)) e = e.replace(/@sfusd\.edu$/, '@s.sfusd.edu'); return e; };
V.valid = function(e){ return /^[^@\s]+@s\.sfusd\.edu$/.test(e); };
V.pct = function(n, d){ return d ? Math.round(n / d * 100) : 0; };
V.band = function(p){ return p >= 70 ? 'ok' : p >= 40 ? 'mid' : 'bad'; };

/* ---------- header + gate ---------- */
V.header = function(title){
  return '<header class="hdr">' +
    '<div><a class="back" href="../">\u2190 Shopping Day</a><span class="crumb">Very Easy True Stories \u00b7 <b>' + V.esc(title) + '</b></span></div>' +
    '<div class="tools"><span id="saveDot"></span>' +
    '<button type="button" class="tool-btn" id="btnTap" aria-pressed="false">Tap words</button>' +
    '<label class="sr-only" for="gsLang" style="position:absolute;left:-9999px">Language</label><select id="gsLang"></select></div>' +
    '</header>';
};
V.gateHtml = function(){
  return '<div class="card gate" id="gate"><h2 style="margin-top:0">Sign in to begin</h2><p class="hint">Your work saves to your account.</p>' +
    '<label for="gEmail">School email</label><input type="email" id="gEmail" placeholder="you@s.sfusd.edu" autocomplete="email">' +
    '<label for="gName">Your name</label><input type="text" id="gName" placeholder="First Last" autocomplete="name">' +
    '<label for="gPer">Period</label><select id="gPer"><option value="">\u2014 choose \u2014</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select>' +
    '<div class="err" id="gErr">Please fill in all three with a valid SFUSD email.</div>' +
    '<div class="row" style="margin-top:16px"><button class="btn" id="gGo" type="button">Begin \u2192</button></div></div>';
};
function readSaved(){
  var e = '', n = '', p = '';
  try { e = localStorage.getItem('gal_student_email') || ''; n = localStorage.getItem('gal_student_name') || ''; p = localStorage.getItem('gal_student_period') || ''; } catch(x){}
  return {email:e, name:n, period:p};
}
function initGate(onReady){
  var s = readSaved();
  if (s.email) $('gEmail').value = s.email;
  if (s.name) $('gName').value = s.name;
  if (s.period) $('gPer').value = s.period;
  $('gGo').addEventListener('click', function(){
    var email = V.canon($('gEmail').value), name = $('gName').value.trim(), per = $('gPer').value;
    if (!V.valid(email) || !name || !per){ $('gErr').style.display = 'block'; return; }
    $('gErr').style.display = 'none';
    try { localStorage.setItem('gal_student_email', email); localStorage.setItem('gal_student_name', name); localStorage.setItem('gal_student_period', per); } catch(x){}
    V.me = {email:email, name:name, period:per};
    if (window.GS) GS.ME = V.me;
    if (window.GS && GS.seedStudent) GS.seedStudent(name, email, per);
    $('gate').style.display = 'none';
    V.load().then(onReady);
  });
}

/* ---------- init ---------- */
V.init = function(opts){
  V.module = opts.module;
  var root = $('app');
  root.insertAdjacentHTML('beforebegin', V.header(opts.title));
  root.insertAdjacentHTML('beforebegin', '<div class="wrap" id="gateWrap">' + V.gateHtml() + '</div>');
  root.style.display = 'none';
  if (window.GS){ GS.initLang(); GS.initTap(); }
  window.GAL_META = { title:'Shopping Day \u00b7 ' + opts.title, unit:'Very Easy True Stories', skills:opts.skills || [], sort_order:610 };
  initGate(function(){
    $('gateWrap').style.display = 'none';
    root.style.display = 'block';
    opts.onReady();
    if (window.GS) GS.rewrap();
    setInterval(function(){ if (dirty) V.save(); }, 20000);
    window.addEventListener('beforeunload', function(){ if (dirty) V.save(true); });
  });
};

/* ---------- save / load (vets_modules) ---------- */
V.touch = function(){ dirty = true; };
V.load = function(){
  var u = V.SUPA_URL + '/rest/v1/' + V.TABLE + '?email=eq.' + encodeURIComponent(V.me.email) +
          '&story=eq.' + encodeURIComponent(SD.STORY) + '&module=eq.' + encodeURIComponent(V.module) + '&select=state,score,max_score,completed';
  return fetch(u, {headers:V.H()}).then(function(r){ return r.ok ? r.json() : []; }).then(function(rows){
    var r = rows && rows[0];
    if (r){ V.state = r.state || {}; V.score = r.score || 0; V.max = r.max_score || 0; V.completed = !!r.completed; }
  }).catch(function(){});
};
V.save = function(sync){
  if (!V.me) return Promise.resolve();
  var row = { email:V.me.email, name:V.me.name, period:parseInt(V.me.period, 10) || null, story:SD.STORY, module:V.module,
              state:V.state, score:V.score, max_score:V.max, completed:V.completed, updated_at:new Date().toISOString() };
  dirty = false;
  var d = $('saveDot'); if (d) d.textContent = 'saving\u2026';
  var url = V.SUPA_URL + '/rest/v1/' + V.TABLE + '?on_conflict=email,story,module';
  var init = {method:'POST', headers:V.H('resolution=merge-duplicates,return=minimal'), body:JSON.stringify([row])};
  if (sync) init.keepalive = true;
  return fetch(url, init)
    .then(function(r){ if (d) d.textContent = r.ok ? 'saved' : 'not saved'; })
    .catch(function(){ if (d) d.textContent = 'offline'; });
};
/* call when the module is finished: logs to activity_attempts + skill_attempts via track.js */
V.finish = function(score, max, skills, highlights){
  V.score = score; V.max = max; V.completed = true;
  window.GAL_SCORE = score; window.GAL_MAX = max;
  if (skills) window.GAL_SKILLS = skills;
  if (highlights) window.GAL_HIGHLIGHTS = highlights;
  V.save().then(function(){ if (window.GAL_logAttempt) window.GAL_logAttempt({module:V.module, story:SD.STORY}); });
};

/* ---------- speech helpers (speak-core.js) ---------- */
V.say = function(text, slow, btn){ if (window.GS) GS.say(text, slow, btn); };
V.lang = function(){ return window.GS ? GS.lang() : ''; };
/* translate through the Galileo proxy, the same call the story page makes (action=translate).
   speak-core's word call returns the proxy's status line for single words, so it is not used here. */
V.PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var tmem = {};
/* the proxy takes language names; the picker stores codes */
V.LANG_NAME = {es:'Spanish', yue:'Chinese (Traditional)', 'zh-CN':'Chinese (Simplified)', ar:'Arabic', ary:'Arabic', vi:'Vietnamese',
  ru:'Russian', ur:'Urdu', tl:'Tagalog', fr:'French', ko:'Korean', hi:'Hindi', so:'Somali', ne:'Nepali', th:'Thai'};
V.translate = function(text){
  var L = V.LANG_NAME[V.lang()] || ''; if (!L || !text) return Promise.resolve('');
  var key = 'vt|' + L + '|' + text;
  if (tmem[key]) return Promise.resolve(tmem[key]);
  try { var c = localStorage.getItem(key); if (c){ tmem[key] = c; return Promise.resolve(c); } } catch(e){}
  return fetch(V.PROXY + '?action=translate&idiom=' + encodeURIComponent(text) + '&meaning=&lang=' + encodeURIComponent(L))
    .then(function(r){ return r.json(); })
    .then(function(d){
      var v = (d && d.ok && d.translation) ? String(d.translation).trim() : '';
      if (/backend is running/i.test(v) || v.toLowerCase() === text.toLowerCase()) v = '';
      if (v){ tmem[key] = v; try { localStorage.setItem(key, v); } catch(e){} }
      return v;
    }).catch(function(){ return ''; });
};
/* clear bad entries speak-core cached as translations */
try { Object.keys(localStorage).forEach(function(k){ if (k.indexOf('gs_tr|') === 0 && /backend is running/i.test(localStorage.getItem(k) || '')) localStorage.removeItem(k); }); } catch(e){}
V.canSpeak = function(){ return !!(window.GS && (GS.canRecognize || GS.canRecord)); };
V.mic = function(btn, opts){ if (window.GS) GS.micButton(btn, opts); else btn.disabled = true; };
V.match = function(alts, targets){ return window.GS ? GS.bestMatch(alts || [], targets) : {score:0, heard:'', hitWords:[]}; };
V.heardHtml = function(target, m){
  var words = String(target).split(/\s+/), hits = (m && m.hitWords) || [];
  return words.map(function(w, i){ return '<span class="' + (hits[i] ? 'hit' : 'miss') + '">' + V.esc(w) + '</span>'; }).join(' ');
};
/* a speaking attempt row for speaking_attempts (+ audio upload) */
V.speakSave = function(itemId, target, m, res, accepted, attemptNo){
  if (!window.GS || !V.me) return;
  var alts = (res && res.alts) || [];
  GS.saveAttempt({
    activity:'vets-01-' + V.module, item_id:itemId, exchange_id:GS.uid(), round:1, line_no:1, role:'student',
    email:V.me.email, speaker_name:V.me.name, partner_email:null, partner_name:null,
    period:V.me.period, device_email:V.me.email,
    target_text:target, said_text:(m && m.score >= 0.5) ? m.display : null,
    transcript:m ? m.heard : ((alts[0] && alts[0].t) || null), alternatives:alts.slice(0, 5),
    match_score:m ? Math.round(m.score * 1000) / 1000 : null,
    attempt_no:attemptNo || 1, accepted:!!accepted, practice:false,
    seconds:res && res.secs ? Math.round(res.secs * 10) / 10 : null
  }, res ? res.blob : null);
};

/* ---------- feed My Words (vocab_preassess) ---------- */
/* results: [{w, right:true|false, e, s}] */
V.myWords = function(results){
  if (!V.me || !results.length) return;
  var items = [], answers = {}, score = 0, idk = 0;
  results.forEach(function(r, i){
    var k = 'q' + (i + 1);
    items.push({k:k, w:r.w, e:r.e || '', s:r.s || ''});
    answers[k] = r.right ? r.w : '__idk';
    if (r.right) score++; else idk++;
  });
  var now = new Date().toISOString();
  var row = { email:V.me.email, name:V.me.name, period:V.me.period, quiz:'vets-01', quiz_title:'Shopping Day words',
    phase:'practice', attempt:1, items:items, answers:answers, score:score, total:items.length, answered:items.length, idk:idk,
    turned_in:true, turned_in_at:now, updated_at:now };
  fetch(V.SUPA_URL + '/rest/v1/vocab_preassess?on_conflict=email,quiz,attempt', {
    method:'POST', headers:V.H('resolution=merge-duplicates,return=minimal'), body:JSON.stringify([row])
  }).catch(function(){});
};

/* ---------- small UI helpers ---------- */
V.sayBtn = function(text, slow){ return '<button type="button" class="say' + (slow ? ' slow' : '') + '" data-say="' + V.esc(text) + '" data-slow="' + (slow ? 1 : 0) + '">' + (slow ? '\ud83d\udc22 slow' : '\ud83d\udd0a listen') + '</button>'; };
document.addEventListener('click', function(ev){
  var b = ev.target.closest('.say'); if (!b) return;
  V.say(b.getAttribute('data-say'), b.getAttribute('data-slow') === '1', b);
});
V.doneBox = function(score, max, extraHtml){
  var p = V.pct(score, max);
  return '<div class="card done-box"><div class="big">' + score + ' / ' + max + '</div><p class="sub">' + p + '% \u00b7 saved to your account</p>' + (extraHtml || '') +
    '<div class="row" style="justify-content:center;margin-top:14px"><a class="btn ghost" href="../">All Shopping Day practice</a></div></div>';
};
V.pic = function(v){
  if (v.pic === 'svg' && SD.ART[v.w]) return SD.ART[v.w];
  return '<span>' + v.pic + '</span>';
};
})();
