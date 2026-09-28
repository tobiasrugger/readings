/* =====================================================================
   speak-core.js — shared by every speaking page in readings/speaking/.

   Holds:
     - Galileo sign-in (period -> name from roster -> school email),
       canonical email, student_aliases, students seed
     - language picker, directions toggle (instruction_reveals),
       tap-any-word through the Apps Script proxy, quiet canary
       (page_translation)
     - listen (text-to-speech), record (speech recognition + audio at
       the same time), forgiving sentence matching
     - saving: audio -> fluency-recordings bucket (speaking/ folder),
       one row per attempt -> speaking_attempts

   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var GS = window.GS = {};

GS.SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
GS.SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
GS.PROXY    = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
GS.BUCKET   = 'fluency-recordings';
GS.TABLE    = 'speaking_attempts';
GS.SLUG     = 'speaking';

function $(id){ return document.getElementById(id); }
GS.$ = $;
GS.esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
GS.H = function(pref){
  var h = {'apikey':GS.SUPA_KEY,'Authorization':'Bearer '+GS.SUPA_KEY,'Content-Type':'application/json'};
  if (pref) h['Prefer'] = pref;
  return h;
};
GS.uid = function(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); };

/* ---------------- roster + identity ---------------- */
var CANON_DOMAIN = '@s.sfusd.edu';
GS.ROSTER = [];
GS.ME = null;
GS.cleanMail = function(x){ return String(x || '').trim().toLowerCase(); };
GS.localPart = function(e){ return GS.cleanMail(e).split('@')[0]; };
GS.validMail = function(e){ return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(GS.cleanMail(e)); };
GS.canonMail = function(raw){
  var lp = GS.localPart(raw), i;
  for (i = 0; i < GS.ROSTER.length; i++){
    if (GS.localPart(GS.ROSTER[i].email) === lp) return GS.cleanMail(GS.ROSTER[i].email);
  }
  return lp + CANON_DOMAIN;
};
GS.displayName = function(r){
  if (!r) return '';
  var n = r.name || ((r.first_name || '') + ' ' + (r.last_name || '')).trim();
  if (n) return n;
  return GS.localPart(r.email).replace(/[._]/g,' ');
};
GS.firstName = function(n){ return String(n || '').trim().split(/\s+/)[0] || ''; };
GS.recordAlias = function(alias, canon){
  if (!alias || alias === canon) return;
  fetch(GS.SUPA_URL + '/rest/v1/student_aliases?on_conflict=alias_email', {
    method:'POST', headers:GS.H('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{alias_email:alias, email:canon}])}).catch(function(){});
};
GS.hasName = function(r){
  return !!(r && (String(r.name || '').trim() || String(r.first_name || '').trim()));
};
/* first/last are only sent when a student typed them. A roster row that
   has no name yet gets the typed name filled in. */
GS.seedStudent = function(name, email, period, first, last){
  var row = {email:email, name:name, period:period};
  if (first){ row.first_name = first; row.last_name = last || null; }
  fetch(GS.SUPA_URL + '/rest/v1/students?on_conflict=email', {
    method:'POST', headers:GS.H('resolution=ignore-duplicates,return=minimal'),
    body:JSON.stringify([row])}).catch(function(){});
  var r = GS.findByEmail(email);
  if (first && r && !GS.hasName(r)){
    fetch(GS.SUPA_URL + '/rest/v1/students?email=eq.' + encodeURIComponent(r.email), {
      method:'PATCH', headers:GS.H('return=minimal'),
      body:JSON.stringify({name:name, first_name:first, last_name:last || null})}).catch(function(){});
    r.name = name; r.first_name = first; r.last_name = last || null;
  }
  if (first && !r) GS.ROSTER.push({email:email, name:name, first_name:first, last_name:last || null, period:period});
};
/* Adds First name / Last name boxes right after a label, once. Returns {box, first, last}. */
GS.nameBoxes = function(afterLabel, idPrefix){
  var box = document.getElementById(idPrefix + 'Names');
  if (!box){
    box = document.createElement('div');
    box.id = idPrefix + 'Names'; box.className = 'namebox hide';
    box.innerHTML = '<label>First name<input id="' + idPrefix + 'First" type="text" autocomplete="given-name"></label>' +
      '<label>Last name<input id="' + idPrefix + 'Last" type="text" autocomplete="family-name"></label>';
    afterLabel.parentNode.insertBefore(box, afterLabel.nextSibling);
  }
  return {box:box, first:document.getElementById(idPrefix + 'First'), last:document.getElementById(idPrefix + 'Last')};
};
GS.cleanName = function(x){
  return String(x || '').trim().replace(/\s+/g, ' ').replace(/(^|[\s'-])([a-z])/g, function(_, a, b){ return a + b.toUpperCase(); });
};
GS.loadRoster = function(){
  return fetch(GS.SUPA_URL + '/rest/v1/students?select=*', {headers:GS.H()})
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(rows){
      GS.ROSTER = (rows || []).filter(function(r){ return r && r.email; });
      GS.ROSTER.sort(function(a,b){ return GS.displayName(a).localeCompare(GS.displayName(b)); });
      return GS.ROSTER;
    }).catch(function(){ return []; });
};
GS.rosterFor = function(period){
  return GS.ROSTER.filter(function(r){ return String(r.period || '') === String(period || ''); });
};
GS.findByEmail = function(email){
  var lp = GS.localPart(email), i;
  for (i = 0; i < GS.ROSTER.length; i++) if (GS.localPart(GS.ROSTER[i].email) === lp) return GS.ROSTER[i];
  return null;
};

/* Fill a <select> with names from one period. */
GS.fillNames = function(sel, period, skipEmail, firstLabel){
  var list = GS.rosterFor(period), h = '<option value="">' + GS.esc(firstLabel || 'Choose your name') + '</option>';
  list.forEach(function(r){
    if (skipEmail && GS.cleanMail(r.email) === GS.cleanMail(skipEmail)) return;
    h += '<option value="' + GS.esc(GS.cleanMail(r.email)) + '">' + GS.esc(GS.displayName(r)) + '</option>';
  });
  h += '<option value="__other">My name is not on the list</option>';
  sel.innerHTML = h;
};

/* Standard sign-in block. Needs #gsPer, #gsWho, #gsMail, #gsMsg in the page.
   onReady(ME) fires whenever a valid sign-in settles. */
GS.initSignin = function(onReady){
  var per = $('gsPer'), who = $('gsWho'), mail = $('gsMail'), msg = $('gsMsg');
  var nb = GS.nameBoxes(mail.parentNode, 'gs');
  var saved = '';
  try { saved = localStorage.getItem('gal_student_email') || ''; } catch(e){}
  function settle(){
    var raw = GS.cleanMail(mail.value);
    if (!raw){ msg.textContent = ''; GS.ME = null; return; }
    if (!GS.validMail(raw)){ msg.textContent = 'Use your school email (@s.sfusd.edu).'; GS.ME = null; return; }
    if (!per.value){ msg.textContent = 'Choose your period.'; return; }
    var c = GS.canonMail(raw);
    if (c !== raw) mail.value = c;
    var r = GS.findByEmail(c), name, first = '', last = '';
    if (GS.hasName(r)){
      nb.box.classList.add('hide');
      name = GS.displayName(r);
    } else {
      nb.box.classList.remove('hide');
      first = GS.cleanName(nb.first.value); last = GS.cleanName(nb.last.value);
      if (!first || !last){ msg.textContent = 'Type your first name and last name.'; GS.ME = null; (first ? nb.last : nb.first).focus(); return; }
      name = first + ' ' + last;
    }
    GS.recordAlias(raw, c);
    GS.seedStudent(name, c, per.value, first, last);
    try { localStorage.setItem('gal_student_email', c); localStorage.setItem('gal_student_period', per.value); } catch(e){}
    if (who.value && who.value !== '__other') who.options[who.selectedIndex].text = name;
    GS.ME = {email:c, name:name, period:per.value};
    msg.textContent = '\u2713 ' + name + ' \u00b7 ' + c;
    if (onReady) onReady(GS.ME);
  }
  per.addEventListener('change', function(){
    GS.fillNames(who, per.value, null, 'Choose your name');
    mail.value = ''; GS.ME = null; msg.textContent = '';
    mail.parentNode.classList.add('hide'); nb.box.classList.add('hide');
  });
  who.addEventListener('change', function(){
    if (who.value === '__other'){
      mail.value = ''; mail.parentNode.classList.remove('hide'); nb.box.classList.remove('hide'); mail.focus(); return;
    }
    mail.parentNode.classList.add('hide');
    mail.value = who.value;
    settle();
  });
  [mail, nb.first, nb.last].forEach(function(el){
    el.addEventListener('change', settle);
    el.addEventListener('blur', settle);
  });
  GS.loadRoster().then(function(){
    var p = '';
    try { p = localStorage.getItem('gal_student_period') || ''; } catch(e){}
    var r = saved ? GS.findByEmail(saved) : null;
    if (r && r.period) p = String(r.period);
    if (p){ per.value = p; GS.fillNames(who, p, null, 'Choose your name'); }
    if (saved){
      if (r){ who.value = GS.cleanMail(r.email); mail.parentNode.classList.add('hide'); }
      else { who.value = '__other'; mail.parentNode.classList.remove('hide'); }
      mail.value = saved;
      if (per.value) settle();
    }
  });
};

/* ---------------- languages ---------------- */
GS.LANGS = [
  ['es','Espa\u00f1ol'],['yue','\u5ee3\u6771\u8a71 (Cantonese)'],['zh-CN','\u4e2d\u6587 (\u666e\u901a\u8a71)'],
  ['ar','\u0627\u0644\u0639\u0631\u0628\u064a\u0629'],['ary','\u0627\u0644\u062f\u0627\u0631\u062c\u0629 (Darija)'],
  ['vi','Ti\u1ebfng Vi\u1ec7t'],['ru','\u0420\u0443\u0441\u0441\u043a\u0438\u0439'],['ur','\u0627\u0631\u062f\u0648'],
  ['tl','Tagalog'],['fr','Fran\u00e7ais'],['ko','\ud55c\uad6d\uc5b4'],['hi','\u0939\u093f\u0928\u094d\u0926\u0940'],
  ['so','Soomaali'],['ne','\u0928\u0947\u092a\u093e\u0932\u0940'],['th','\u0e44\u0e17\u0e22']
];
GS.initLang = function(){
  var sel = $('gsLang'); if (!sel) return;
  var h = '<option value="">No translation</option>';
  GS.LANGS.forEach(function(l){ h += '<option value="' + l[0] + '">' + l[1] + '</option>'; });
  sel.innerHTML = h;
  try { sel.value = localStorage.getItem('vocab_lang') || ''; } catch(e){}
  sel.addEventListener('change', function(){
    try { localStorage.setItem('vocab_lang', sel.value); } catch(e){}
    if (DIR_ON) GS.showDirections();
  });
};
GS.lang = function(){ var s = $('gsLang'); return s ? s.value : ''; };

/* translation through the proxy (sentence call, then word call) */
var tmem = {};
function pickText(d){
  if (d == null) return '';
  if (typeof d === 'string') return d.trim();
  if (typeof d !== 'object') return '';
  var keys = ['translation','translatedText','equiv','meaning','text','result','output'], i;
  for (i = 0; i < keys.length; i++) if (d[keys[i]] != null){ var v = pickText(d[keys[i]]); if (v) return v; }
  for (var k in d) if (k !== 'ok' && typeof d[k] === 'string' && d[k].trim()) return d[k].trim();
  return '';
}
function askProxy(params){
  return fetch(GS.PROXY + '?' + params).then(function(r){ return r.text(); }).then(function(t){
    var j; t = String(t || '').trim();
    try { j = JSON.parse(t); } catch(e){ return t.charAt(0) === '<' ? '' : t; }
    if (j && j.ok === false) return '';
    return pickText(j);
  }).catch(function(){ return ''; });
}
GS.translate = function(text, lang){
  if (!lang || !text) return Promise.resolve('');
  var key = 'gs_tr|' + lang + '|' + text;
  if (tmem[key]) return Promise.resolve(tmem[key]);
  try { var c = localStorage.getItem(key); if (c){ tmem[key] = c; return Promise.resolve(c); } } catch(e){}
  var e = encodeURIComponent, L = e(lang);
  var sentCall = function(){ return askProxy('action=translate&idiom=' + e(text) + '&meaning=&lang=' + L); };
  var wordCall = function(){ return askProxy('text=' + e(text) + '&q=' + e(text) + '&target=' + L + '&lang=' + L + '&to=' + L); };
  var isSentence = text.trim().split(/\s+/).length > 3;
  var first = isSentence ? sentCall : wordCall, second = isSentence ? wordCall : sentCall;
  function good(v){ return v && v.toLowerCase() !== text.toLowerCase() && v.indexOf('[object') < 0; }
  return first().then(function(v){ return good(v) ? v : second(); }).then(function(v){
    if (!good(v)) return '';
    tmem[key] = v; try { localStorage.setItem(key, v); } catch(err){}
    return v;
  });
};

/* spoken language name -> proxy code (blank when the proxy has no such language) */
var LANG_NAMES = [['spanish','es'],['espanol','es'],['cantonese','yue'],['mandarin','zh-CN'],['chinese','zh-CN'],
  ['darija','ary'],['moroccan','ary'],['arabic','ar'],['vietnamese','vi'],['russian','ru'],['urdu','ur'],['tagalog','tl'],
  ['filipino','tl'],['french','fr'],['korean','ko'],['hindi','hi'],['somali','so'],['nepali','ne'],['thai','th'],
  ['portuguese','pt'],['japanese','ja'],['ukrainian','uk'],['punjabi','pa'],['bengali','bn'],['turkish','tr'],
  ['persian','fa'],['farsi','fa'],['dari','fa'],['pashto','ps'],['tigrinya','ti'],['amharic','am'],['english','en']];
GS.langCode = function(name){
  var n = String(name || '').toLowerCase(), i;
  for (i = 0; i < LANG_NAMES.length; i++) if (n.indexOf(LANG_NAMES[i][0]) > -1) return LANG_NAMES[i][1];
  return '';
};

/* ---------------- directions toggle ---------------- */
var DIR_ON = false, SENT = {};
try { DIR_ON = localStorage.getItem('song_dir') === '1'; } catch(e){}
function logReveal(k, lang){
  if (!GS.ME) return;
  var sig = k + '|' + lang; if (SENT[sig]) return; SENT[sig] = true;
  fetch(GS.SUPA_URL + '/rest/v1/instruction_reveals', {
    method:'POST', headers:GS.H('return=minimal'),
    body:JSON.stringify([{email:GS.ME.email, set_slug:GS.SLUG, activity:k, lang:lang}])}).catch(function(){});
}
GS.showDirections = function(){
  var lang = GS.lang();
  Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'), function(p){
    var out = p.querySelector('.dirtr');
    if (!out){ out = document.createElement('span'); out.className = 'dirtr'; p.appendChild(out); }
    if (!DIR_ON || !lang){ out.textContent = ''; return; }
    var k = p.getAttribute('data-dir'), en = p.getAttribute('data-en') || p.textContent;
    out.textContent = '\u2026';
    GS.translate(en, lang).then(function(t){
      out.textContent = t || '';
      if (t) logReveal(k, lang);
    });
  });
};
GS.initDirections = function(){
  var b = $('btnDir'); if (!b) return;
  b.classList.toggle('on', DIR_ON);
  b.setAttribute('aria-pressed', DIR_ON ? 'true' : 'false');
  b.addEventListener('click', function(){
    DIR_ON = !DIR_ON;
    try { localStorage.setItem('song_dir', DIR_ON ? '1' : '0'); } catch(e){}
    b.classList.toggle('on', DIR_ON);
    b.setAttribute('aria-pressed', DIR_ON ? 'true' : 'false');
    if (DIR_ON && !GS.lang() && $('gsLang')) $('gsLang').focus();
    GS.showDirections();
  });
  if (DIR_ON) setTimeout(GS.showDirections, 600);
};

/* ---------------- tap any word ---------------- */
var TAP_ON = false;
try { TAP_ON = localStorage.getItem('song_tap') === '1'; } catch(e){}
function wrapWords(root){
  if (root.getAttribute('data-wrapped')) return;
  root.setAttribute('data-wrapped','1');
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
  while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
  nodes.forEach(function(node){
    if (node.parentNode.closest('textarea,input,button,select,.wt-tap,.wt-bub')) return;
    var frag = document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(function(piece){
      if (!piece.trim()){ frag.appendChild(document.createTextNode(piece)); return; }
      var s = document.createElement('span'); s.className = 'wt-tap'; s.textContent = piece;
      frag.appendChild(s);
    });
    node.parentNode.replaceChild(frag, node);
  });
}
GS.rewrap = function(){ if (TAP_ON) Array.prototype.forEach.call(document.querySelectorAll('[data-tap]'), wrapWords); };
function setTap(on){
  TAP_ON = on;
  try { localStorage.setItem('song_tap', on ? '1' : '0'); } catch(e){}
  document.body.classList.toggle('tap-on', on);
  var b = $('btnTap');
  if (b){ b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  GS.rewrap();
}
GS.initTap = function(){
  var b = $('btnTap');
  if (b) b.addEventListener('click', function(){ setTap(!TAP_ON); });
  document.addEventListener('click', function(ev){
    if (!TAP_ON) return;
    var s = ev.target.closest('.wt-tap'); if (!s) return;
    if (ev.target.closest('button')) return;
    var lang = GS.lang();
    if (!lang){ if ($('gsLang')) $('gsLang').focus(); return; }
    var word = (s.textContent || '').replace(/[^A-Za-z\u00C0-\u00FF'\u2019-]/g,'');
    if (!word) return;
    if (s.getAttribute('data-shown')){ s.removeAttribute('data-shown'); var t = s.querySelector('.wt-bub'); if (t) t.remove(); return; }
    var bub = document.createElement('span'); bub.className = 'wt-bub'; bub.textContent = '\u2026';
    s.appendChild(bub); s.setAttribute('data-shown','1');
    GS.translate(word, lang).then(function(t){ bub.textContent = t || '?'; });
  });
  if (TAP_ON) setTimeout(function(){ setTap(true); }, 300);
};

/* ---------------- quiet browser-translation canary ---------------- */
var CANARY = 'the quick brown fox jumps over the lazy dog', TR_SENT = '';
function detectTranslation(){
  var c = document.querySelector('#canary');
  var got = c ? (c.textContent || '').trim().toLowerCase() : '';
  var cls = document.documentElement.className || '';
  var drift = (c && got !== CANARY) ? got : '';
  if (!drift && !/translated|notranslate-off/.test(cls)) return null;
  return {observed:drift, html_lang:document.documentElement.lang || '', html_class:cls};
}
GS.checkTranslation = function(){
  var d = detectTranslation();
  if (!d || !GS.ME) return;
  var sig = d.observed + '|' + d.html_lang;
  if (sig === TR_SENT) return;
  TR_SENT = sig;
  fetch(GS.SUPA_URL + '/rest/v1/page_translation?on_conflict=email,set_slug', {
    method:'POST', headers:GS.H('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{email:GS.ME.email, set_slug:GS.SLUG, translated:true,
      observed:d.observed, html_lang:d.html_lang, html_class:d.html_class,
      updated_at:new Date().toISOString()}])}).catch(function(){});
};
GS.initCanary = function(){
  setInterval(GS.checkTranslation, 20000);
  setTimeout(GS.checkTranslation, 4000);
};

GS.initAll = function(slug, onReady){
  GS.SLUG = slug || GS.SLUG;
  GS.initLang(); GS.initDirections(); GS.initTap(); GS.initCanary();
  GS.initSignin(onReady);
};

/* ---------------- listen (text to speech) ---------------- */
var VOICE = null;
function pickVoice(){
  if (!window.speechSynthesis) return;
  var vs = speechSynthesis.getVoices() || [], i;
  var prefs = ['Google US English','Samantha','Microsoft Aria','Microsoft Jenny'];
  for (i = 0; i < prefs.length; i++){
    for (var j = 0; j < vs.length; j++) if (vs[j].name.indexOf(prefs[i]) > -1){ VOICE = vs[j]; return; }
  }
  for (i = 0; i < vs.length; i++) if (/^en[-_]US/i.test(vs[i].lang)){ VOICE = vs[i]; return; }
  for (i = 0; i < vs.length; i++) if (/^en/i.test(vs[i].lang)){ VOICE = vs[i]; return; }
}
if (window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
GS.say = function(text, slow, btn){
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, ' blank '));
  u.lang = 'en-US'; u.rate = slow ? 0.62 : 0.9;
  if (VOICE) u.voice = VOICE;
  if (btn){ btn.classList.add('playing'); u.onend = u.onerror = function(){ btn.classList.remove('playing'); }; }
  speechSynthesis.speak(u);
};

/* ---------------- record: recognition + audio together ---------------- */
var REC_API = window.SpeechRecognition || window.webkitSpeechRecognition;
GS.canRecognize = !!REC_API;
GS.canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
var STREAM = null;
function getStream(){
  if (STREAM && STREAM.active) return Promise.resolve(STREAM);
  return navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true, noiseSuppression:true}})
    .then(function(s){ STREAM = s; return s; });
}
/* opts: onInterim(text), onDone({alts:[{t,c}], blob, secs, error}), maxMs
   returns {stop()} */
GS.record = function(opts){
  opts = opts || {};
  var ctl = {stopped:false}, rec = null, mr = null, chunks = [], alts = [], interim = '',
      t0 = Date.now(), finished = false, safety = null, recEnded = !REC_API, mrEnded = false, err = '';
  function finish(){
    if (finished) return;
    if (!recEnded || !mrEnded) return;
    finished = true; clearTimeout(safety);
    var blob = chunks.length ? new Blob(chunks, {type:(mr && mr.mimeType) || 'audio/webm'}) : null;
    if (!alts.length && interim) alts.push({t:interim, c:0.3});
    if (opts.onDone) opts.onDone({alts:alts, blob:blob, secs:(Date.now() - t0) / 1000, error:err});
  }
  function stopAll(){
    if (ctl.stopped) return; ctl.stopped = true;
    try { if (rec) rec.stop(); } catch(e){ recEnded = true; }
    setTimeout(function(){ try { if (mr && mr.state === 'recording') mr.stop(); else { mrEnded = true; finish(); } } catch(e){ mrEnded = true; finish(); } }, 350);
  }
  ctl.stop = stopAll;
  if (!GS.canRecord && !GS.canRecognize){
    err = 'nomic'; recEnded = true; mrEnded = true; setTimeout(finish, 0); return ctl;
  }
  (GS.canRecord ? getStream() : Promise.resolve(null)).then(function(stream){
    if (stream){
      try { mr = new MediaRecorder(stream); } catch(e){ mr = null; }
    }
    if (mr){
      mr.ondataavailable = function(e){ if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = function(){ mrEnded = true; finish(); };
      mr.start();
    } else mrEnded = true;
    if (REC_API){
      rec = new REC_API();
      rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
      rec.onresult = function(ev){
        var i, j, txt = '';
        for (i = ev.resultIndex; i < ev.results.length; i++){
          var res = ev.results[i];
          if (res.isFinal){
            for (j = 0; j < res.length; j++) alts.push({t:res[j].transcript, c:res[j].confidence || 0});
          } else txt += res[0].transcript;
        }
        if (txt){ interim = txt; if (opts.onInterim) opts.onInterim(txt); }
      };
      rec.onerror = function(e){ err = e.error || 'error'; };
      rec.onend = function(){ recEnded = true; stopAll(); finish(); };
      try { rec.start(); } catch(e){ recEnded = true; }
    }
    safety = setTimeout(stopAll, opts.maxMs || 15000);
  }).catch(function(){
    err = 'not-allowed'; recEnded = true; mrEnded = true; finish();
  });
  return ctl;
};

/* ---------------- forgiving matching ---------------- */
var SOUNDALIKE = {
  'blonde':'blond','blend':'blond','ice':'eyes','eye':'eyes','eyes':'eyes','ayes':'eyes','is':'is',
  'hare':'hair','hairs':'hair','heir':'hair','her':'hair',
  'curry':'curly','kirby':'curly','curley':'curly','wavey':'wavy','weavy':'wavy',
  'shai':'shy','sky':'shy','dramatics':'dramatic','athletics':'athletic','artistics':'artistic',
  'humbled':'humble','prod':'proud','generously':'generous','selfishly':'selfish',
  'hard-working':'hardworking','piece':'peace','peaceable':'peaceful',
  'yeah':'yes','y':'why','wide':'why','ya':'you','u':'you','r':'are','ur':'your',
  'medium-length':'medium','mediums':'medium','cause':'because','cuz':'because','coz':'because'
};
var CONTRACT = [
  [/\bi'?m\b/g,'i am'],[/\byou'?re\b/g,'you are'],[/\bdon'?t\b/g,'do not'],[/\bi'?ve\b/g,'i have'],
  [/\bdoesn'?t\b/g,'does not'],[/\bisn'?t\b/g,'is not'],[/\baren'?t\b/g,'are not'],[/\bit'?s\b/g,'it is']
];
var LETTER = {'ay':'a','be':'b','bee':'b','see':'c','sea':'c','si':'c','dee':'d','ef':'f','eff':'f','gee':'g','ji':'g',
  'aitch':'h','age':'h','eye':'i','eyes':'i','jay':'j','kay':'k','okay':'k','ok':'k','el':'l','elle':'l','em':'m','en':'n','and':'n',
  'oh':'o','owe':'o','pee':'p','pea':'p','queue':'q','cue':'q','ar':'r','are':'r','es':'s','ess':'s','tee':'t','tea':'t',
  'you':'u','vee':'v','ex':'x','why':'y','wye':'y','zee':'z','zed':'z'};
GS.tokens = function(s, opts){
  var out = baseTokens(s);
  if (!opts || !opts.spell) return out;
  var ex = {}, res = [], i;
  (opts.expand || []).forEach(function(w){ ex[String(w).toLowerCase()] = 1; });
  for (i = 0; i < out.length; i++){
    var w = out[i];
    if (w === 'double' && (out[i+1] === 'you' || out[i+1] === 'u')){ res.push('w'); i++; continue; }
    if (ex[w]){ w.split('').forEach(function(c){ res.push(c); }); continue; }
    if (/^[a-z]+$/.test(w) && w.length > 1 && w.length <= 12 && w === w.replace(/[aeiou]/g, '') ){ w.split('').forEach(function(c){ res.push(c); }); continue; }
    res.push(LETTER[w] || w);
  }
  return res;
};
function baseTokens(s){
  s = String(s || '').toLowerCase().replace(/[\u2018\u2019]/g, "'");
  CONTRACT.forEach(function(c){ s = s.replace(c[0], c[1]); });
  s = s.replace(/upper case/g, 'uppercase').replace(/_+/g, ' ___ ').replace(/[^a-z0-9'_ -]/g, ' ').replace(/-/g, ' ');
  return s.split(/\s+/).filter(Boolean).map(function(w){
    if (w === '___') return w;
    w = w.replace(/'/g, '');
    return SOUNDALIKE[w] || w;
  });
};
function lev(a, b){
  if (a === b) return 0;
  var m = a.length, n = b.length, i, j, prev = [], cur;
  for (j = 0; j <= n; j++) prev[j] = j;
  for (i = 1; i <= m; i++){
    cur = [i];
    for (j = 1; j <= n; j++){
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a.charAt(i-1) === b.charAt(j-1) ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
GS.wordEq = function(a, b){
  if (a === b) return true;
  var L = Math.min(a.length, b.length);
  if (L < 4) return false;
  var d = lev(a, b);
  return d <= 1 || (L >= 7 && d <= 2);
};
/* LCS over words. Returns {n, tIdx:[target indexes matched], sIdx:[said indexes matched], pairs} */
function lcs(said, target){
  var m = said.length, n = target.length, i, j, T = [];
  for (i = 0; i <= m; i++){ T[i] = []; for (j = 0; j <= n; j++) T[i][j] = 0; }
  for (i = 1; i <= m; i++) for (j = 1; j <= n; j++){
    if (target[j-1] !== '___' && GS.wordEq(said[i-1], target[j-1])) T[i][j] = T[i-1][j-1] + 1;
    else T[i][j] = Math.max(T[i-1][j], T[i][j-1]);
  }
  var pairs = [];
  i = m; j = n;
  while (i > 0 && j > 0){
    if (target[j-1] !== '___' && GS.wordEq(said[i-1], target[j-1]) && T[i][j] === T[i-1][j-1] + 1){ pairs.unshift([i-1, j-1]); i--; j--; }
    else if (T[i-1][j] >= T[i][j-1]) i--; else j--;
  }
  return {n:T[m][n], pairs:pairs};
}
function tidy(s){
  s = String(s || '').trim().replace(/\s+/g, ' ');
  s = s.replace(/\bi\b/g, 'I');
  if (!s) return s;
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.?!]$/.test(s)) s += '.';
  return s;
}
GS.tidy = tidy;

/* Score one heard string against one target (a sentence, or a frame with ___).
   Returns {score 0..1, display, hitWords:[bool per target word]} */
GS.scoreOne = function(heard, target, opts){
  var s = GS.tokens(heard, opts), tw = GS.tokens(target, opts);
  var fixed = tw.filter(function(w){ return w !== '___'; });
  var isFrame = fixed.length !== tw.length;
  if (!s.length || !fixed.length) return {score:0, display:target, hitWords:[]};
  var L = lcs(s, tw);
  var recall = L.n / fixed.length;
  var hits = tw.map(function(){ return false; });
  L.pairs.forEach(function(p){ hits[p[1]] = true; });
  if (!isFrame){
    var prec = L.n / s.length;
    var f = (recall + prec) ? 2 * recall * prec / (recall + prec) : 0;
    return {score:f, display:target, hitWords:hits};
  }
  /* frame: fill each blank with the words heard between its neighbours */
  var tToS = {};
  L.pairs.forEach(function(p){ tToS[p[1]] = p[0]; });
  var rawWords = String(heard || '').replace(/[.?!,]/g, '').trim().split(/\s+/);
  var normIdxToRaw = !(opts && opts.spell) && rawWords.length === s.length;
  var out = [], filled = 0, used = 0, k;
  for (k = 0; k < tw.length; k++){
    if (tw[k] !== '___') continue;
    var before = -1, after = s.length, b;
    for (b = k - 1; b >= 0; b--) if (tToS[b] != null){ before = tToS[b]; break; }
    for (b = k + 1; b < tw.length; b++) if (tToS[b] != null){ after = tToS[b]; break; }
    var fill = [];
    var cap = (after === s.length) ? 14 : 4;   /* a blank at the end can hold a longer idea */
    for (b = before + 1; b < after && b < s.length; b++){
      if (b - before > cap) break;
      fill.push(normIdxToRaw ? rawWords[b].toLowerCase() : s[b]);
    }
    if (fill.length){ filled++; used += fill.length; }
    out.push(fill.join(' '));
  }
  /* rebuild the display from the target text, swapping each ___ for its fill */
  var fi = 0;
  var display = String(target).replace(/_+/g, function(){ var v = out[fi++] || '___'; return v; });
  var blanks = out.length;
  var extra = Math.max(0, s.length - L.n - used);
  var score = recall * 0.8 + (blanks ? 0.2 * filled / blanks : 0.2) - Math.min(0.3, extra * 0.05);
  return {score:Math.max(0, score), display:display, hitWords:hits, frame:true, complete:filled === blanks};
};

/* Best match over every alternative the recognizer gave and every target.
   targets: array of strings. Returns {score, index, display, heard, hitWords} */
GS.bestMatch = function(alts, targets, opts){
  var best = {score:0, index:0, display:targets[0] || '', heard:(alts[0] && alts[0].t) || '', hitWords:[]};
  alts.forEach(function(a, ai){
    targets.forEach(function(t, ti){
      var r = GS.scoreOne(a.t, t, opts);
      var adj = r.score + (r.frame ? -0.02 : 0) + (ai === 0 ? 0.01 : 0);
      if (r.frame && !r.complete) adj -= 0.15;
      if (adj > best.adj || best.adj == null){
        best = {score:r.score, adj:adj, index:ti, display:r.display, heard:a.t, hitWords:r.hitWords, frame:!!r.frame};
      }
    });
  });
  if (best.frame) best.display = tidy(best.display);
  return best;
};

/* ---------------- saving ---------------- */
var QUEUE = Promise.resolve();
GS.pending = 0;
GS.onPending = null;
function bump(d){ GS.pending += d; if (GS.onPending) GS.onPending(GS.pending); }
GS.saveAttempt = function(row, blob){
  bump(1);
  QUEUE = QUEUE.then(function(){
    var up = Promise.resolve(null);
    if (blob && blob.size){
      var path = 'speaking/' + (row.activity || 'misc') + '/' + String(row.email).replace(/[^a-z0-9]/g, '_') + '_' + Date.now() + '.webm';
      up = fetch(GS.SUPA_URL + '/storage/v1/object/' + GS.BUCKET + '/' + path, {
        method:'POST',
        headers:{'apikey':GS.SUPA_KEY,'Authorization':'Bearer ' + GS.SUPA_KEY,'Content-Type':blob.type || 'audio/webm'},
        body:blob
      }).then(function(r){ return r.ok ? path : null; }).catch(function(){ return null; });
    }
    return up.then(function(path){
      row.audio_path = path;
      return fetch(GS.SUPA_URL + '/rest/v1/' + GS.TABLE, {
        method:'POST', headers:GS.H('return=minimal'), body:JSON.stringify([row])
      }).then(function(r){ if (!r.ok) throw new Error('save ' + r.status); });
    });
  }).then(function(){ bump(-1); }, function(){ bump(-1); GS.saveFailed = true; if (GS.onFail) GS.onFail(); });
  return QUEUE;
};
GS.audioUrl = function(path){
  return path ? GS.SUPA_URL + '/storage/v1/object/public/' + GS.BUCKET + '/' + path : '';
};

/* ---------------- the record button, as a reusable widget ----------------
   GS.recorder(el, {label, onResult(res, rec)}) draws a round record button
   inside el and handles the listening states. */
GS.micButton = function(btn, opts){
  var ctl = null;
  btn.addEventListener('click', function(){
    if (ctl){ ctl.stop(); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    btn.classList.add('live'); btn.setAttribute('aria-label', 'Stop recording');
    if (opts.onStart) opts.onStart();
    ctl = GS.record({
      onInterim: opts.onInterim,
      maxMs: opts.maxMs,
      onDone: function(res){
        ctl = null;
        btn.classList.remove('live'); btn.setAttribute('aria-label', opts.label || 'Record');
        opts.onDone(res);
      }
    });
  });
};

})();
