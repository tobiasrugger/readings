/* ─────────────────────────────────────────────────────────────
   VERY EASY TRUE STORIES · LANGUAGE LAYER

     <script src="vets_l10n.js" data-slug="vets-02"><\/script>

   The story pages already handle sign-in and saving. This adds only
   the four things the rebuild left out:
     · the 13-language picker
     · tap any word for its meaning
     · directions on request, logged to instruction_reveals
     · the quiet browser-translation canary

   It never touches identity or student answers. It reads the email the
   page already stored in localStorage under gal_student_email.
   ───────────────────────────────────────────────────────────── */
(function(){
'use strict';

var SUPA_URL='https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var PROXY='https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var SLUG=(document.currentScript&&document.currentScript.getAttribute('data-slug'))||'vets';

var LANGS=[['','Language'],['Spanish','Español'],['Chinese (Simplified)','中文'],['Arabic','العربية'],
 ['Vietnamese','Tiếng Việt'],['Russian','Русский'],['Urdu','اردو'],['Tagalog','Tagalog'],
 ['French','Français'],['Korean','한국어'],['Hindi','हिन्दी'],['Somali','Soomaali'],
 ['Nepali','नेपाली'],['Thai','ไทย']];

function el(tag,attrs,html){var e=document.createElement(tag);
  if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);
  if(html!=null)e.innerHTML=html;return e;}
function head(pref){var h={'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'};
  if(pref)h['Prefer']=pref;return h;}
function myEmail(){
  try{ return localStorage.getItem('gal_student_email')||''; }catch(e){ return ''; }
}

var CSS=[
'#vl-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 12px;',
'  background:#1A1F2E;color:#F5EFE2;font:inherit;font-size:14px;position:sticky;top:0;z-index:80}',
'#vl-bar select,#vl-bar button{font:inherit;padding:5px 9px;border-radius:8px;',
'  border:1px solid #4a5468;background:#F5EFE2;color:#1A1F2E;cursor:pointer}',
'#vl-bar button.on{background:#D94A38;color:#fff;border-color:#D94A38}',
'.vl-dirtr{display:block;margin-top:4px;color:#2E6B8C;font-weight:700;font-size:.95em}',
'.vl-dirtr:empty{display:none}',
'body.vl-tap .vl-w{cursor:pointer;border-bottom:1px dotted #8a93a5}',
'.vl-bub{display:inline-block;margin-left:5px;padding:1px 6px;border-radius:6px;',
'  background:#2E6B8C;color:#fff;font-size:.85em;font-weight:700}'
].join('\n');

var tc={};
function tr(text,lang){
  var k=text+'|'+lang;
  if(!lang)return Promise.resolve(null);
  if(tc[k])return Promise.resolve(tc[k]);
  return fetch(PROXY+'?action=translate&idiom='+encodeURIComponent(text)+'&meaning=&lang='+encodeURIComponent(lang))
    .then(function(r){return r.json();}).then(function(d){
      if(!d||!d.ok||!d.translation)return null;tc[k]=d.translation;return d.translation;
    }).catch(function(){return null;});
}

/* ---------- directions ---------- */
var DIR_ON=false, SENT={};
try{ DIR_ON=localStorage.getItem('vets_dir')==='1'; }catch(e){}
function logReveal(k,lang){
  var em=myEmail(); if(!em) return;
  var sig=k+'|'+lang; if(SENT[sig])return; SENT[sig]=true;
  fetch(SUPA_URL+'/rest/v1/instruction_reveals',{method:'POST',headers:head('return=minimal'),
    body:JSON.stringify([{email:em,set_slug:SLUG,activity:k,lang:lang}])}).catch(function(){});
}
/* the question prompts are what a student needs in L1 */
function stamp(){
  var qs=document.querySelectorAll('.q-prompt'),i;
  for(i=0;i<qs.length;i++){
    var p=qs[i], plain=(p.textContent||'').trim();
    if(plain.length<12) continue;
    if(p.getAttribute('data-ven')===plain) continue;
    p.setAttribute('translate','yes');
    p.setAttribute('data-ven',plain);
    p.setAttribute('data-vdir',plain.toLowerCase().replace(/[^a-z]/g,'').slice(0,16));
    var old=p.querySelector('.vl-dirtr'); if(old) old.remove();
  }
}
function showDirections(){
  stamp();
  var lang=document.getElementById('vl-lang').value;
  var list=document.querySelectorAll('[data-vdir]'),i;
  for(i=0;i<list.length;i++){
    (function(p){
      var out=p.querySelector('.vl-dirtr');
      if(!out){ out=el('span',{'class':'vl-dirtr'}); p.appendChild(out); }
      if(!DIR_ON||!lang){ out.textContent=''; return; }
      var k=p.getAttribute('data-vdir'), en=p.getAttribute('data-ven')||'';
      out.textContent='…';
      tr(en,lang).then(function(t){
        out.textContent=t?(t.equiv||t.meaning||''):'';
        if(out.textContent) logReveal(k,lang);
      });
    })(list[i]);
  }
}

/* ---------- tap any word ---------- */
var TAP_ON=false;
try{ TAP_ON=localStorage.getItem('vets_tap')==='1'; }catch(e){}
function wrap(root){
  if(root.getAttribute('data-vwrapped'))return;
  root.setAttribute('data-vwrapped','1');
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),ns=[],n;
  while((n=w.nextNode()))if(n.nodeValue.trim())ns.push(n);
  ns.forEach(function(node){
    if(node.parentNode.closest('button,textarea,input,select,.vl-w,#vl-bar'))return;
    var f=document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(function(piece){
      if(!piece.trim()){f.appendChild(document.createTextNode(piece));return;}
      f.appendChild(el('span',{'class':'vl-w'},piece.replace(/[<>&]/g,'')));
    });
    node.parentNode.replaceChild(f,node);
  });
}
function setTap(on){
  TAP_ON=on;
  try{ localStorage.setItem('vets_tap',on?'1':'0'); }catch(e){}
  document.body.classList.toggle('vl-tap',on);
  var b=document.getElementById('vl-tap'); if(b) b.classList.toggle('on',on);
  if(on) document.querySelectorAll('.panel-caption,.q-prompt,.story-sub,.d').forEach(wrap);
}

/* ---------- canary ---------- */
var CAN='the quick brown fox jumps over the lazy dog', TR_SENT='';
function check(){
  var em=myEmail(); if(!em) return;
  var c=document.getElementById('vl-canary');
  var got=c?(c.textContent||'').trim().toLowerCase():'';
  var cls=document.documentElement.className||'';
  var drift=(c&&got!==CAN)?got:'';
  if(!drift&&!/translated|notranslate-off/.test(cls))return;
  var sig=drift+'|'+(document.documentElement.lang||'');
  if(sig===TR_SENT)return; TR_SENT=sig;
  fetch(SUPA_URL+'/rest/v1/page_translation?on_conflict=email,set_slug',{method:'POST',
    headers:head('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{email:em,set_slug:SLUG,translated:true,observed:drift,
      html_lang:document.documentElement.lang||'',html_class:cls,
      updated_at:new Date().toISOString()}])}).catch(function(){});
}

function build(){
  document.head.appendChild(el('style',null,CSS));
  document.body.insertBefore(el('span',{id:'vl-canary',
    style:'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden'},CAN),
    document.body.firstChild);

  var opts=LANGS.map(function(l){return '<option value="'+l[0]+'">'+l[1]+'</option>';}).join('');
  var bar=el('div',{id:'vl-bar'},
    '<select id="vl-lang" title="Translation language">'+opts+'</select>'+
    '<button id="vl-dir">Directions</button>'+
    '<button id="vl-tap">Tap words</button>');
  document.body.insertBefore(bar,document.body.firstChild.nextSibling);

  document.getElementById('vl-tap').addEventListener('click',function(){ setTap(!TAP_ON); });
  document.getElementById('vl-dir').addEventListener('click',function(){
    DIR_ON=!DIR_ON;
    try{ localStorage.setItem('vets_dir',DIR_ON?'1':'0'); }catch(e){}
    this.classList.toggle('on',DIR_ON);
    showDirections();
  });
  document.getElementById('vl-lang').addEventListener('change',function(){ if(DIR_ON) showDirections(); });

  document.addEventListener('click',function(ev){
    if(!TAP_ON)return;
    var s=ev.target.closest('.vl-w'); if(!s)return;
    var lang=document.getElementById('vl-lang').value;
    if(!lang){ document.getElementById('vl-lang').focus(); return; }
    var word=(s.textContent||'').replace(/[^A-Za-z'’-]/g,''); if(!word)return;
    if(s.getAttribute('data-shown')){
      s.removeAttribute('data-shown');
      var o=s.querySelector('.vl-bub'); if(o)o.remove();
      return;
    }
    var b=el('span',{'class':'vl-bub'},'…');
    s.appendChild(b); s.setAttribute('data-shown','1');
    tr(word,lang).then(function(t){ b.textContent=t?(t.equiv||t.meaning||'?'):'?'; });
  });

  if(TAP_ON) setTimeout(function(){ setTap(true); },350);
  if(DIR_ON){ document.getElementById('vl-dir').classList.add('on'); setTimeout(showDirections,600); }
  setInterval(check,20000); setTimeout(check,4000);
}

window.VETS_L10N={checkTranslation:check,showDirections:showDirections};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
