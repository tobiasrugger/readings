/* ─────────────────────────────────────────────────────────────
   VERY EASY TRUE STORIES · GALILEO STANDARD
   One file, loaded by every story page:

     <script src="vets_std.js" data-slug="vets-02"><\/script>   (as written in HTML)

   It adds, without the story page having to cooperate:
     · school-email sign-in (canonical address, alias, students row)
     · class period 1–7
     · the 13-language picker and tap-any-word translation
     · directions translated on request, logged to instruction_reveals
     · answers saved to vets_progress
     · the quiet browser-translation canary
   ───────────────────────────────────────────────────────────── */
(function(){
'use strict';

var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var TABLE = 'vets_progress';

var me = { name:'', email:'', period:'' };
var ROSTER = [];
var SLUG = (document.currentScript && document.currentScript.getAttribute('data-slug')) || 'vets';

var LANGS = [
  ['', 'Language'], ['Spanish','Español'], ['Chinese (Simplified)','中文'], ['Arabic','العربية'],
  ['Vietnamese','Tiếng Việt'], ['Russian','Русский'], ['Urdu','اردو'], ['Tagalog','Tagalog'],
  ['French','Français'], ['Korean','한국어'], ['Hindi','हिन्दी'], ['Somali','Soomaali'],
  ['Nepali','नेपाली'], ['Thai','ไทย']
];

/* ---------- small helpers ---------- */
function langEl(){
  return document.getElementById('lang-pick') || document.getElementById('lang') ||
         document.getElementById('vstd-lang');
}
function langValue(){
  var e = langEl(); if(!e) return '';
  var v = e.value || '';
  /* a page of its own may store codes where the proxy wants names */
  var CODE2NAME = {es:'Spanish','zh-CN':'Chinese (Simplified)',zh:'Chinese (Simplified)',ar:'Arabic',
    vi:'Vietnamese',ru:'Russian',ur:'Urdu',tl:'Tagalog',fr:'French',ko:'Korean',hi:'Hindi',
    so:'Somali',ne:'Nepali',th:'Thai'};
  return CODE2NAME[v] || v;
}
function el(tag, attrs, html){
  var e = document.createElement(tag);
  if(attrs) for(var k in attrs) e.setAttribute(k, attrs[k]);
  if(html != null) e.innerHTML = html;
  return e;
}
function head(pref){
  var h = {'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'};
  if(pref) h['Prefer'] = pref;
  return h;
}
function cleanMail(x){ return String(x||'').trim().toLowerCase(); }
function localPart(e){ return cleanMail(e).split('@')[0]; }
function validMail(e){ return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(cleanMail(e)); }
function canonMail(raw){
  var lp = localPart(raw), i;
  for(i=0;i<ROSTER.length;i++){ if(localPart(ROSTER[i].email)===lp) return cleanMail(ROSTER[i].email); }
  return lp + '@s.sfusd.edu';
}
function recordAlias(alias, canon){
  if(!alias || alias===canon) return;
  fetch(SUPA_URL+'/rest/v1/student_aliases?on_conflict=alias_email',{
    method:'POST', headers:head('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{alias_email:alias, email:canon}])}).catch(function(){});
}
function seedStudent(name, email, period){
  fetch(SUPA_URL+'/rest/v1/students?on_conflict=email',{
    method:'POST', headers:head('resolution=ignore-duplicates,return=minimal'),
    body:JSON.stringify([{email:email, name:name, period:period}])}).catch(function(){});
}

/* ---------- styles ---------- */
var CSS = [
'#vstd-bar{position:sticky;top:0;z-index:60;display:flex;gap:6px;align-items:center;flex-wrap:wrap;',
'  padding:7px 12px;background:#1A1F2E;color:#F5EFE2;font-family:inherit;font-size:14px}',
'#vstd-bar .who{font-weight:700;margin-right:auto}',
'#vstd-bar select,#vstd-bar button{font:inherit;padding:5px 9px;border-radius:8px;border:1px solid #4a5468;',
'  background:#F5EFE2;color:#1A1F2E;cursor:pointer}',
'#vstd-bar button.on{background:#D94A38;color:#fff;border-color:#D94A38}',
'#vstd-gate{position:fixed;inset:0;z-index:200;background:rgba(26,31,46,.93);display:flex;',
'  align-items:center;justify-content:center;padding:18px}',
'#vstd-gate .box{background:#FFFCF3;color:#1A1F2E;max-width:430px;width:100%;border-radius:16px;padding:22px}',
'#vstd-gate h2{margin:0 0 4px;font-size:21px}',
'#vstd-gate p{margin:0 0 14px;font-size:14px;color:#5b6474}',
'#vstd-gate label{display:block;font-weight:700;font-size:13px;margin:10px 0 3px}',
'#vstd-gate input,#vstd-gate select{width:100%;font:inherit;padding:9px 10px;border:1px solid #c9c2b2;border-radius:9px}',
'#vstd-gate button{margin-top:14px;width:100%;font:inherit;font-weight:800;padding:11px;border:0;',
'  border-radius:10px;background:#1A1F2E;color:#F5EFE2;cursor:pointer}',
'#vstd-err{color:#c1442f;font-weight:700;font-size:13px;min-height:17px;margin-top:7px}',
'.vstd-dirtr{display:block;margin-top:4px;color:#2E6B8C;font-weight:700}',
'.vstd-dirtr:empty{display:none}',
'body.vstd-tap .vstd-w{cursor:pointer;border-bottom:1px dotted #8a93a5}',
'.vstd-bub{display:inline-block;margin-left:5px;padding:1px 6px;border-radius:6px;',
'  background:#2E6B8C;color:#fff;font-size:.85em;font-weight:700}',
'#vstd-dot{font-size:12px;opacity:.8}'
].join('\n');

/* ---------- translation through the proxy ---------- */
var tcache = {};
function tr(text, lang){
  var key = text + '|' + lang;
  if(!lang) return Promise.resolve(null);
  if(tcache[key]) return Promise.resolve(tcache[key]);
  return fetch(PROXY + '?action=translate&idiom=' + encodeURIComponent(text) +
               '&meaning=&lang=' + encodeURIComponent(lang))
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d || !d.ok || !d.translation) return null;
      tcache[key] = d.translation; return d.translation;
    }).catch(function(){ return null; });
}

/* ---------- saving ---------- */
var saveTimer = null, lastPayload = '';
function payload(){
  var st = (window.VETS && VETS.state) || {};
  var scored = st.scored || {}, predicted = st.predicted || {};
  var firstTry = 0, done = 0, k;
  for(k in scored){ done++; if(scored[k].firstAttemptCorrect) firstTry++; }
  return {
    email: me.email, slug: SLUG, student_name: me.name, period: me.period,
    payload: { scored: scored, predicted: predicted },
    score: firstTry, max_score: st.totalScored || 0,
    updated_at: new Date().toISOString()
  };
}
function save(){
  if(!me.email) return;
  var body = payload(), s = JSON.stringify(body.payload);
  if(s === lastPayload) return;
  lastPayload = s;
  dot('saving…');
  fetch(SUPA_URL + '/rest/v1/' + TABLE + '?on_conflict=email,slug', {
    method:'POST', headers:head('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify([body])
  }).then(function(r){ dot(r.ok ? 'saved' : 'not saved'); })
    .catch(function(){ dot('offline'); });
}
function queueSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(save, 900); }
function dot(txt){ var d = document.getElementById('vstd-dot'); if(d) d.textContent = txt; }

function restore(){
  if(!me.email) return;
  fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(me.email) +
        '&slug=eq.' + encodeURIComponent(SLUG) + '&select=payload', {headers:head()})
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(rows){
      if(!rows || !rows.length || !rows[0].payload || !window.VETS) return;
      var p = rows[0].payload;
      VETS.state.scored = p.scored || {};
      VETS.state.predicted = p.predicted || {};
      replay();
      if(VETS.updateScorePill) VETS.updateScorePill();
      dot('loaded');
    }).catch(function(){});
}
/* put the page back the way the student left it */
function replay(){
  var st = VETS.state;
  document.querySelectorAll('.question').forEach(function(q){
    var qid = (q.id || '').replace(/^q-/, '') || q.dataset.qid;
    var rec = st.scored[qid] || st.predicted[qid];
    if(!rec) return;
    var want = (typeof rec === 'string') ? rec : rec.answer;
    q.querySelectorAll('.choice').forEach(function(b){
      var txt = (b.textContent || '').trim();
      if(txt === want || b.dataset.choice === want){
        b.classList.add(typeof rec === 'string' ? 'predicted' : (rec.correct ? 'correct' : 'wrong'));
      }
      b.disabled = true;
    });
    q.dataset.locked = '1';
    var fb = document.getElementById('fb-' + qid);
    if(fb) fb.classList.add('show');
  });
}

/* ---------- directions ---------- */
var DIR_ON = false, SENT = {};
try{ DIR_ON = localStorage.getItem('vets_dir') === '1'; }catch(e){}
function logReveal(k, lang){
  if(!me.email) return;
  var sig = k + '|' + lang;
  if(SENT[sig]) return;
  SENT[sig] = true;
  fetch(SUPA_URL + '/rest/v1/instruction_reveals', {
    method:'POST', headers:head('return=minimal'),
    body: JSON.stringify([{email:me.email, set_slug:SLUG, activity:k, lang:lang}])
  }).catch(function(){});
}
function showDirections(){
  var lang = langValue();
  document.querySelectorAll('[data-vdir]').forEach(function(p){
    var out = p.querySelector('.vstd-dirtr');
    if(!out){ out = el('span', {'class':'vstd-dirtr'}); p.appendChild(out); }
    if(!DIR_ON || !lang){ out.textContent = ''; return; }
    var k = p.getAttribute('data-vdir'), en = p.getAttribute('data-ven') || '';
    out.textContent = '…';
    tr(en, lang).then(function(t){
      out.textContent = t ? (t.equiv || t.meaning || '') : '';
      if(out.textContent) logReveal(k, lang);
    });
  });
}

/* ---------- tap any word ---------- */
var TAP_ON = false;
try{ TAP_ON = localStorage.getItem('vets_tap') === '1'; }catch(e){}
function wrapWords(root){
  if(root.getAttribute('data-vwrapped')) return;
  root.setAttribute('data-vwrapped', '1');
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
  while((n = walker.nextNode())) if(n.nodeValue.trim()) nodes.push(n);
  nodes.forEach(function(node){
    if(node.parentNode.closest('button,textarea,input,select,.vstd-w,#vstd-bar')) return;
    var frag = document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(function(piece){
      if(!piece.trim()){ frag.appendChild(document.createTextNode(piece)); return; }
      frag.appendChild(el('span', {'class':'vstd-w'}, piece.replace(/[<>&]/g, '')));
    });
    node.parentNode.replaceChild(frag, node);
  });
}
function setTap(on){
  TAP_ON = on;
  try{ localStorage.setItem('vets_tap', on ? '1' : '0'); }catch(e){}
  document.body.classList.toggle('vstd-tap', on);
  var b = document.getElementById('vstd-tap');
  if(b) b.classList.toggle('on', on);
  if(on) document.querySelectorAll('.story-text,.panel-caption,.q-prompt,.story-sub').forEach(wrapWords);
}

/* ---------- canary ---------- */
var CANARY = 'the quick brown fox jumps over the lazy dog', TR_SENT = '';
function detectTranslation(){
  var c = document.getElementById('vstd-canary');
  var got = c ? (c.textContent || '').trim().toLowerCase() : '';
  var cls = document.documentElement.className || '';
  var drift = (c && got !== CANARY) ? got : '';
  if(!drift && !/translated|notranslate-off/.test(cls)) return null;
  return {observed:drift, html_lang:document.documentElement.lang || '', html_class:cls};
}
function checkTranslation(){
  var d = detectTranslation();
  if(!d || !me.email) return;
  var sig = d.observed + '|' + d.html_lang;
  if(sig === TR_SENT) return;
  TR_SENT = sig;
  fetch(SUPA_URL + '/rest/v1/page_translation?on_conflict=email,set_slug', {
    method:'POST', headers:head('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify([{email:me.email, set_slug:SLUG, translated:true,
      observed:d.observed, html_lang:d.html_lang, html_class:d.html_class,
      updated_at:new Date().toISOString()}])
  }).catch(function(){});
}

/* ---------- sign in ---------- */
function signIn(){
  var name = document.getElementById('vstd-name').value.trim();
  var raw  = cleanMail(document.getElementById('vstd-mail').value);
  var per  = document.getElementById('vstd-per').value;
  var err  = document.getElementById('vstd-err');
  if(name.length < 3){ err.textContent = 'Please write your first and last name.'; return; }
  if(!validMail(raw)){ err.textContent = 'Please use your school email — it ends with @s.sfusd.edu'; return; }
  if(!per){ err.textContent = 'Please choose your class period.'; return; }
  err.textContent = '';
  var canon = canonMail(raw);
  recordAlias(raw, canon);
  seedStudent(name, canon, per);
  me = {name:name, email:canon, period:per};
  try{
    localStorage.setItem('vets_me', JSON.stringify(me));
    localStorage.setItem('gal_student_email', canon);
  }catch(e){}
  document.getElementById('vstd-gate').style.display = 'none';
  document.querySelector('#vstd-bar .who').textContent = me.name + ' · P' + me.period;
  restore();
}

/* ---------- build the furniture ---------- */
function build(){
  document.head.appendChild(el('style', null, CSS));
  document.body.insertBefore(
    el('span', {id:'vstd-canary', style:'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden'},
       CANARY), document.body.firstChild);

  /* a page that already has its own picker or tap mode keeps them */
  var ownLang = document.getElementById('lang-pick') || document.getElementById('lang');
  var ownTap  = document.getElementById('wt-btn');
  var opts = LANGS.map(function(l){ return '<option value="'+l[0]+'">'+l[1]+'</option>'; }).join('');
  var bar = el('div', {id:'vstd-bar'},
    '<span class="who">Not signed in</span>' +
    (ownLang ? '' : '<select id="vstd-lang" title="Translation language">' + opts + '</select>') +
    '<button id="vstd-dir" title="Show the directions in your language">Directions</button>' +
    (ownTap ? '' : '<button id="vstd-tap" title="Tap any word for its meaning">Tap words</button>') +
    '<span id="vstd-dot"></span>');
  document.body.insertBefore(bar, document.body.firstChild.nextSibling);

  var gate = el('div', {id:'vstd-gate'},
    '<div class="box">' +
      '<h2>Sign in</h2><p>Your answers save automatically.</p>' +
      '<label for="vstd-mail">School email</label>' +
      '<input id="vstd-mail" type="email" placeholder="name@s.sfusd.edu" autocomplete="email">' +
      '<label for="vstd-name">First and last name</label>' +
      '<input id="vstd-name" type="text" autocomplete="name">' +
      '<label for="vstd-per">Class period</label>' +
      '<select id="vstd-per"><option value="">Choose your period</option>' +
        '<option>1</option><option>2</option><option>3</option><option>4</option>' +
        '<option>5</option><option>6</option><option>7</option></select>' +
      '<div id="vstd-err"></div>' +
      '<button id="vstd-go">Start</button>' +
    '</div>');
  document.body.appendChild(gate);

  document.getElementById('vstd-go').addEventListener('click', signIn);
  var tapBtn = document.getElementById('vstd-tap');
  if(tapBtn) tapBtn.addEventListener('click', function(){ setTap(!TAP_ON); });
  document.getElementById('vstd-dir').addEventListener('click', function(){
    DIR_ON = !DIR_ON;
    try{ localStorage.setItem('vets_dir', DIR_ON ? '1' : '0'); }catch(e){}
    this.classList.toggle('on', DIR_ON);
    showDirections();
  });
  var le = langEl();
  if(le) le.addEventListener('change', function(){ if(DIR_ON) showDirections(); });

  /* tap bubbles */
  document.addEventListener('click', function(ev){
    if(!TAP_ON) return;
    var s = ev.target.closest('.vstd-w'); if(!s) return;
    var lang = langValue();
    if(!lang){ var le = langEl(); if(le) le.focus(); return; }
    var word = (s.textContent || '').replace(/[^A-Za-z'’-]/g, '');
    if(!word) return;
    if(s.getAttribute('data-shown')){
      s.removeAttribute('data-shown');
      var old = s.querySelector('.vstd-bub'); if(old) old.remove();
      return;
    }
    var bub = el('span', {'class':'vstd-bub'}, '…');
    s.appendChild(bub); s.setAttribute('data-shown','1');
    tr(word, lang).then(function(t){ bub.textContent = t ? (t.equiv || t.meaning || '?') : '?'; });
  });

  /* every answer click is a save */
  document.addEventListener('click', function(ev){
    if(ev.target.closest('.choice')) queueSave();
  });
  document.addEventListener('input', function(ev){
    if(ev.target.matches('textarea,input')) queueSave();
  });

  /* prefill */
  try{
    var saved = JSON.parse(localStorage.getItem('vets_me') || 'null');
    if(saved && saved.email){
      document.getElementById('vstd-mail').value = saved.email;
      document.getElementById('vstd-name').value = saved.name || '';
      document.getElementById('vstd-per').value = String(saved.period || '');
    } else {
      var g = localStorage.getItem('gal_student_email');
      if(g) document.getElementById('vstd-mail').value = g;
    }
  }catch(e){}

  fetch(SUPA_URL+'/rest/v1/students?select=name,email,period&order=name',{headers:head()})
    .then(function(r){ return r.ok ? r.json() : []; })
    .then(function(rows){ ROSTER = rows || []; }).catch(function(){});

  if(TAP_ON && tapBtn) setTimeout(function(){ setTap(true); }, 300);
  if(DIR_ON){ document.getElementById('vstd-dir').classList.add('on'); setTimeout(showDirections, 600); }
  setInterval(checkTranslation, 20000);
  setTimeout(checkTranslation, 4000);
  setInterval(save, 15000);
  window.addEventListener('beforeunload', save);
}

window.VETS_STD = {save:save, checkTranslation:checkTranslation, me:function(){ return me; }};

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
else build();
})();
