/* ─────────────────────────────────────────────────────────────
   STAND BY ME / THE BODY · GALILEO STANDARD
   Loaded by every page in this folder:

     <script src="sbm_std.js" data-slug="sbm-part1"><\/script>

   The pages in this unit sign students in three different ways
   (an injected cl- bar, a studentbar with name/period boxes, and a
   modal). This adds one consistent layer over whichever is there:
     · school email, canonical address, alias, students row
     · class period 1-7
     · the 13 languages, tap-any-word, directions on request
     · answers saved to sbm_work
     · the quiet browser-translation canary
   ───────────────────────────────────────────────────────────── */
(function(){
'use strict';

var SUPA_URL='https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var PROXY='https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var TABLE='sbm_pages';   /* sbm_work already exists with a different shape */

var SLUG=(document.currentScript&&document.currentScript.getAttribute('data-slug'))||'sbm';
var me={name:'',email:'',period:''}, ROSTER=[];

var LANGS=[['','Language'],['Spanish','Español'],['Chinese (Simplified)','中文'],['Arabic','العربية'],
 ['Vietnamese','Tiếng Việt'],['Russian','Русский'],['Urdu','اردو'],['Tagalog','Tagalog'],
 ['French','Français'],['Korean','한국어'],['Hindi','हिन्दी'],['Somali','Soomaali'],
 ['Nepali','नेपाली'],['Thai','ไทย']];

function el(tag,attrs,html){var e=document.createElement(tag);
  if(attrs)for(var k in attrs)e.setAttribute(k,attrs[k]);
  if(html!=null)e.innerHTML=html;return e;}
function head(pref){var h={'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'};
  if(pref)h['Prefer']=pref;return h;}
function clean(x){return String(x||'').trim().toLowerCase();}
function lp(e){return clean(e).split('@')[0];}
function valid(e){return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(clean(e));}
function canon(raw){var l=lp(raw),i;
  for(i=0;i<ROSTER.length;i++){if(lp(ROSTER[i].email)===l)return clean(ROSTER[i].email);}
  return l+'@s.sfusd.edu';}
function alias(a,c){if(!a||a===c)return;
  fetch(SUPA_URL+'/rest/v1/student_aliases?on_conflict=alias_email',{method:'POST',
    headers:head('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{alias_email:a,email:c}])}).catch(function(){});}
function seed(n,e,p){fetch(SUPA_URL+'/rest/v1/students?on_conflict=email',{method:'POST',
    headers:head('resolution=ignore-duplicates,return=minimal'),
    body:JSON.stringify([{email:e,name:n,period:p}])}).catch(function(){});}

var CSS=[
'#sbm-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:7px 12px;',
'  background:#2C3E3A;color:#f2f6f4;font:inherit;font-size:14px;position:sticky;top:0;z-index:70}',
'#sbm-bar .who{font-weight:700;margin-right:auto}',
'#sbm-bar select,#sbm-bar button{font:inherit;padding:5px 9px;border-radius:8px;',
'  border:1px solid #4d6b62;background:#fff;color:#2C3E3A;cursor:pointer}',
'#sbm-bar button.on{background:#C46A3F;color:#fff;border-color:#C46A3F}',
'#sbm-gate{position:fixed;inset:0;z-index:300;background:rgba(30,40,37,.94);display:flex;',
'  align-items:center;justify-content:center;padding:18px}',
'#sbm-gate .box{background:#fff;color:#22302c;max-width:420px;width:100%;border-radius:16px;padding:22px}',
'#sbm-gate h2{margin:0 0 4px;font-size:20px}',
'#sbm-gate p{margin:0 0 12px;font-size:14px;color:#5b6a65}',
'#sbm-gate label{display:block;font-weight:700;font-size:13px;margin:10px 0 3px}',
'#sbm-gate input,#sbm-gate select{width:100%;font:inherit;padding:9px 10px;border:1px solid #c7cfcb;border-radius:9px}',
'#sbm-gate button{margin-top:14px;width:100%;font:inherit;font-weight:800;padding:11px;border:0;',
'  border-radius:10px;background:#2C3E3A;color:#fff;cursor:pointer}',
'#sbm-err{color:#c1442f;font-weight:700;font-size:13px;min-height:17px;margin-top:7px}',
'.sbm-dirtr{display:block;margin-top:4px;color:#2f6f57;font-weight:700}',
'.sbm-dirtr:empty{display:none}',
'body.sbm-tap .sbm-w{cursor:pointer;border-bottom:1px dotted #8aa79a}',
'.sbm-bub{display:inline-block;margin-left:5px;padding:1px 6px;border-radius:6px;',
'  background:#2C3E3A;color:#fff;font-size:.85em;font-weight:700}'
].join('\n');

var tc={};
function tr(text,lang){var k=text+'|'+lang;
  if(!lang)return Promise.resolve(null);
  if(tc[k])return Promise.resolve(tc[k]);
  return fetch(PROXY+'?action=translate&idiom='+encodeURIComponent(text)+'&meaning=&lang='+encodeURIComponent(lang))
    .then(function(r){return r.json();}).then(function(d){
      if(!d||!d.ok||!d.translation)return null;tc[k]=d.translation;return d.translation;
    }).catch(function(){return null;});}

/* ---------- saving: whatever the student typed or chose ---------- */
var timer=null,last='';
function gather(){
  var o={},i;
  var els=document.querySelectorAll('textarea[id],input[id],select[id]');
  for(i=0;i<els.length;i++){
    var e=els[i];
    if(/^(sbm-|cl-|gllang)/.test(e.id))continue;
    if(e.type==='checkbox'||e.type==='radio'){ if(e.checked)o[e.id]=e.value||'1'; }
    else if(e.value) o[e.id]=e.value;
  }
  return o;
}
function save(){
  if(!me.email)return;
  var ans=gather(),s=JSON.stringify(ans);
  if(s===last)return; last=s;
  fetch(SUPA_URL+'/rest/v1/'+TABLE+'?on_conflict=email,slug',{method:'POST',
    headers:head('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{email:me.email,slug:SLUG,student_name:me.name,period:me.period,
      answers:ans,updated_at:new Date().toISOString()}])}).catch(function(){});
}
function queue(){clearTimeout(timer);timer=setTimeout(save,1200);}
function restore(){
  if(!me.email)return;
  fetch(SUPA_URL+'/rest/v1/'+TABLE+'?email=eq.'+encodeURIComponent(me.email)+
        '&slug=eq.'+encodeURIComponent(SLUG)+'&select=answers',{headers:head()})
    .then(function(r){return r.ok?r.json():[];})
    .then(function(rows){
      if(!rows||!rows.length||!rows[0].answers)return;
      var a=rows[0].answers,k;
      for(k in a){var e=document.getElementById(k);if(!e)continue;
        if(e.type==='checkbox'||e.type==='radio')e.checked=true;else e.value=a[k];}
    }).catch(function(){});
}

/* ---------- directions ---------- */
var DIR_ON=false,SENT={};
try{DIR_ON=localStorage.getItem('sbm_dir')==='1';}catch(e){}
function logReveal(k,lang){
  if(!me.email)return;var sig=k+'|'+lang;if(SENT[sig])return;SENT[sig]=true;
  fetch(SUPA_URL+'/rest/v1/instruction_reveals',{method:'POST',headers:head('return=minimal'),
    body:JSON.stringify([{email:me.email,set_slug:SLUG,activity:k,lang:lang}])}).catch(function(){});}
function showDirections(){
  var lang=document.getElementById('sbm-lang').value;
  var list=document.querySelectorAll('[data-sdir]'),i;
  for(i=0;i<list.length;i++){
    (function(p){
      var out=p.querySelector('.sbm-dirtr');
      if(!out){out=el('span',{'class':'sbm-dirtr'});p.appendChild(out);}
      if(!DIR_ON||!lang){out.textContent='';return;}
      var k=p.getAttribute('data-sdir'),en=p.getAttribute('data-sen')||'';
      out.textContent='…';
      tr(en,lang).then(function(t){out.textContent=t?(t.equiv||t.meaning||''):'';
        if(out.textContent)logReveal(k,lang);});
    })(list[i]);
  }
}

/* ---------- tap any word ---------- */
var TAP_ON=false;
try{TAP_ON=localStorage.getItem('sbm_tap')==='1';}catch(e){}
function wrap(root){
  if(root.getAttribute('data-swrapped'))return;root.setAttribute('data-swrapped','1');
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),ns=[],n;
  while((n=w.nextNode()))if(n.nodeValue.trim())ns.push(n);
  ns.forEach(function(node){
    if(node.parentNode.closest('textarea,input,button,select,.sbm-w,#sbm-bar'))return;
    var f=document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(function(piece){
      if(!piece.trim()){f.appendChild(document.createTextNode(piece));return;}
      f.appendChild(el('span',{'class':'sbm-w'},piece.replace(/[<>&]/g,'')));
    });
    node.parentNode.replaceChild(f,node);
  });
}
function setTap(on){
  TAP_ON=on;try{localStorage.setItem('sbm_tap',on?'1':'0');}catch(e){}
  document.body.classList.toggle('sbm-tap',on);
  var b=document.getElementById('sbm-tap');if(b)b.classList.toggle('on',on);
  if(on)document.querySelectorAll('[data-stap]').forEach(wrap);
}

/* ---------- canary ---------- */
var CAN='the quick brown fox jumps over the lazy dog',TR_SENT='';
function check(){
  if(!me.email)return;
  var c=document.getElementById('sbm-canary');
  var got=c?(c.textContent||'').trim().toLowerCase():'';
  var cls=document.documentElement.className||'';
  var drift=(c&&got!==CAN)?got:'';
  if(!drift&&!/translated|notranslate-off/.test(cls))return;
  var sig=drift+'|'+(document.documentElement.lang||'');
  if(sig===TR_SENT)return;TR_SENT=sig;
  fetch(SUPA_URL+'/rest/v1/page_translation?on_conflict=email,set_slug',{method:'POST',
    headers:head('resolution=merge-duplicates,return=minimal'),
    body:JSON.stringify([{email:me.email,set_slug:SLUG,translated:true,observed:drift,
      html_lang:document.documentElement.lang||'',html_class:cls,
      updated_at:new Date().toISOString()}])}).catch(function(){});
}

/* ---------- sign in ---------- */
function signIn(){
  var name=document.getElementById('sbm-name').value.trim();
  var raw=clean(document.getElementById('sbm-mail').value);
  var per=document.getElementById('sbm-per').value;
  var err=document.getElementById('sbm-err');
  if(name.length<3){err.textContent='Please write your first and last name.';return;}
  if(!valid(raw)){err.textContent='Please use your school email — it ends with @s.sfusd.edu';return;}
  if(!per){err.textContent='Please choose your class period.';return;}
  err.textContent='';
  var c=canon(raw);
  alias(raw,c);seed(name,c,per);
  me={name:name,email:c,period:per};
  try{localStorage.setItem('sbm_me',JSON.stringify(me));
      localStorage.setItem('gal_student_email',c);}catch(e){}
  document.getElementById('sbm-gate').style.display='none';
  document.querySelector('#sbm-bar .who').textContent=me.name+' · P'+me.period;
  /* the page's own name/period boxes, where it has them */
  var n2=document.getElementById('sName')||document.getElementById('inName');
  if(n2)n2.value=me.name;
  var p2=document.getElementById('sPeriod')||document.getElementById('inPeriod');
  if(p2)p2.value=me.period;
  var m2=document.getElementById('cl-email');
  if(m2){m2.value=me.email;var go=document.getElementById('cl-go');if(go)go.click();}
  restore();
}

function build(){
  document.head.appendChild(el('style',null,CSS));
  document.body.insertBefore(el('span',{id:'sbm-canary',
    style:'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden'},CAN),document.body.firstChild);

  var opts=LANGS.map(function(l){return '<option value="'+l[0]+'">'+l[1]+'</option>';}).join('');
  var bar=el('div',{id:'sbm-bar'},
    '<span class="who">Not signed in</span>'+
    '<select id="sbm-lang" title="Translation language">'+opts+'</select>'+
    '<button id="sbm-dir">Directions</button><button id="sbm-tap">Tap words</button>');
  document.body.insertBefore(bar,document.body.firstChild.nextSibling);

  document.body.appendChild(el('div',{id:'sbm-gate'},
    '<div class="box"><h2>Sign in</h2><p>Your work saves to your school account.</p>'+
    '<label for="sbm-mail">School email</label>'+
    '<input id="sbm-mail" type="email" placeholder="name@s.sfusd.edu" autocomplete="email">'+
    '<label for="sbm-name">First and last name</label><input id="sbm-name" type="text" autocomplete="name">'+
    '<label for="sbm-per">Class period</label>'+
    '<select id="sbm-per"><option value="">Choose your period</option>'+
      '<option>1</option><option>2</option><option>3</option><option>4</option>'+
      '<option>5</option><option>6</option><option>7</option></select>'+
    '<div id="sbm-err"></div><button id="sbm-go">Start</button></div>'));

  document.getElementById('sbm-go').addEventListener('click',signIn);
  document.getElementById('sbm-tap').addEventListener('click',function(){setTap(!TAP_ON);});
  document.getElementById('sbm-dir').addEventListener('click',function(){
    DIR_ON=!DIR_ON;try{localStorage.setItem('sbm_dir',DIR_ON?'1':'0');}catch(e){}
    this.classList.toggle('on',DIR_ON);showDirections();});
  document.getElementById('sbm-lang').addEventListener('change',function(){if(DIR_ON)showDirections();});

  document.addEventListener('click',function(ev){
    if(!TAP_ON)return;
    var s=ev.target.closest('.sbm-w');if(!s)return;
    var lang=document.getElementById('sbm-lang').value;
    if(!lang){document.getElementById('sbm-lang').focus();return;}
    var word=(s.textContent||'').replace(/[^A-Za-z'’-]/g,'');if(!word)return;
    if(s.getAttribute('data-shown')){s.removeAttribute('data-shown');
      var o=s.querySelector('.sbm-bub');if(o)o.remove();return;}
    var b=el('span',{'class':'sbm-bub'},'…');s.appendChild(b);s.setAttribute('data-shown','1');
    tr(word,lang).then(function(t){b.textContent=t?(t.equiv||t.meaning||'?'):'?';});
  });
  document.addEventListener('input',function(ev){
    if(ev.target.matches('textarea,input,select'))queue();});
  document.addEventListener('change',function(ev){
    if(ev.target.matches('textarea,input,select'))queue();});

  try{
    var saved=JSON.parse(localStorage.getItem('sbm_me')||'null');
    if(saved&&saved.email){
      document.getElementById('sbm-mail').value=saved.email;
      document.getElementById('sbm-name').value=saved.name||'';
      document.getElementById('sbm-per').value=String(saved.period||'');
    }else{
      var g=localStorage.getItem('gal_student_email');
      if(g)document.getElementById('sbm-mail').value=g;
    }
  }catch(e){}

  fetch(SUPA_URL+'/rest/v1/students?select=name,email,period&order=name',{headers:head()})
    .then(function(r){return r.ok?r.json():[];})
    .then(function(rows){ROSTER=rows||[];}).catch(function(){});

  if(TAP_ON)setTimeout(function(){setTap(true);},350);
  if(DIR_ON){document.getElementById('sbm-dir').classList.add('on');setTimeout(showDirections,600);}
  setInterval(check,20000);setTimeout(check,4000);
  setInterval(save,15000);
  window.addEventListener('beforeunload',save);
}

window.SBM_STD={save:save,checkTranslation:check,me:function(){return me;}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
