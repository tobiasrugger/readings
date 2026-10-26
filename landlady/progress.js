/* readings/landlady/progress.js \u2014 per-part progress for the ELD 103 story guides (T-123, Oct 26).
   Owned by the ELD 103 chat (c1e00dcf). The question map below is GENERATED from the five story
   pages (landlady, landlady-easy, landlady-hard, telltale, monkeyspaw): if a page gains or loses a
   question box, regenerate it in the same zip.

   Use (student page, or any page):
     <div id="storyProgress"></div>
     <script src="/readings/landlady/progress.js"></script>
     StoryProgress.render(document.getElementById('storyProgress'), email [, {only:['landlady'], period:'3'}]);
   Shows one card per story the student has started (plus any guide_key in opts.only even if not started):
   a link to the story, one button per part, the part's own count, and greyed-out parts with the reason
   ("Finish Part 1 first") \u2014 the same 85% rule, hidden Harder-only questions skipped in Easier, that the
   story page itself uses. Read-only: it never writes. */
(function(){
var SUPA_URL='https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var MAP={"landlady":{"title":"The Landlady","sub":"Story","url":"/readings/landlady/","table":"landlady_responses","story":["intro","p1","p2","p3","p4"],"steps":[{"id":"intro","label":"Intro & prediction","kind":"ch","q":[["pre1",0],["pre2",0],["pre3",0],["pre4",0],["pre5",0]]},{"id":"p1","label":"Part 1","kind":"ch","q":[["hl1",0],["s1",0],["s2",0],["s3",0],["q1",0],["q2",0],["h1",1],["simile1",0],["simile2",0],["simile3",0],["simile4",0]]},{"id":"words","label":"Word practice","kind":"ch","q":[]},{"id":"p2","label":"Part 2","kind":"ch","q":[["q3",0],["s4",0],["s5",0],["pred1",0],["s6",0],["q4",0],["pred2",0],["h2",1]]},{"id":"p3","label":"Part 3","kind":"ch","q":[["s7",0],["s8",0],["q5",0],["h3",1],["pred3",0],["s9",0]]},{"id":"p4","label":"Part 4","kind":"ch","q":[["pred4",0],["s10",0],["s11",0],["q6",0],["q7",0],["q8",0]]},{"id":"ending","label":"What happened?","kind":"act","q":[["e3",0],["e4",0],["e5",0],["e6",0],["e1",0],["e8",0],["e2",0]]},{"id":"fore","label":"Foreshadowing","kind":"act","q":[["f3",0],["f4",0],["a1",0],["a2",0],["a3",0]]},{"id":"chars","label":"Characters","kind":"act","q":[["a4",0],["a5",0],["a6",0],["a7",0]]},{"id":"sum","label":"Write a summary","kind":"act","q":[["sum1",0],["sum2",0],["sum3",0]]},{"id":"comp","label":"Do you get it?","kind":"act","q":[["d1",0],["c3",0],["d2",0],["c4",0],["d3",0],["d4",0]]},{"id":"write","label":"Perspective writing","kind":"act","q":[["pw1",0],["pw2",0],["w1",0]]},{"id":"police","label":"Police report","kind":"act","q":[["p1",0],["p2",0],["p3",0],["p4",0],["p5",0],["p6",0],["w2",0],["p7",0],["p8",0]]},{"id":"film","label":"The film","kind":"act","q":[["f1",0],["f2",0]]}]},"landlady_easy":{"title":"The Landlady","sub":"Story (Easier)","url":"/readings/landlady-easy/","table":"landlady_responses","story":["intro","p1","p2","p3","p4"],"steps":[{"id":"intro","label":"Intro & prediction","kind":"ch","q":[["pre1",0],["pre2",0],["pre3",0],["pre4",0],["pre5",0]]},{"id":"p1","label":"Part 1","kind":"ch","q":[["hl1",0],["s1",0],["s2",0],["s3",0],["q1",0],["q2",0],["h1",1],["simile1",0],["simile2",0],["simile3",0],["simile4",0]]},{"id":"words","label":"Word practice","kind":"ch","q":[]},{"id":"p2","label":"Part 2","kind":"ch","q":[["q3",0],["s4",0],["s5",0],["pred1",0],["s6",0],["q4",0],["pred2",0],["h2",1]]},{"id":"p3","label":"Part 3","kind":"ch","q":[["s7",0],["s8",0],["q5",0],["h3",1],["pred3",0],["s9",0]]},{"id":"p4","label":"Part 4","kind":"ch","q":[["pred4",0],["s10",0],["s11",0],["q6",0],["q7",0],["q8",0]]},{"id":"ending","label":"What happened?","kind":"act","q":[["e1",0],["e2",0]]},{"id":"fore","label":"Foreshadowing","kind":"act","q":[["a1",0],["a2",0],["a3",0]]},{"id":"chars","label":"Characters","kind":"act","q":[["a4",0],["a5",0],["a6",0],["a7",0]]},{"id":"sum","label":"Write a summary","kind":"act","q":[["sum1",0],["sum2",0],["sum3",0]]},{"id":"comp","label":"Do you get it?","kind":"act","q":[["d1",0],["c3",0],["d2",0],["c4",0],["d3",0],["d4",0]]},{"id":"write","label":"Perspective writing","kind":"act","q":[["pw1",0],["pw2",0],["w1",0]]},{"id":"police","label":"Police report","kind":"act","q":[["p1",0],["p2",0],["p3",0],["p4",0],["p5",0],["p6",0],["w2",0],["p7",0],["p8",0]]},{"id":"film","label":"The film","kind":"act","q":[["f1",0],["f2",0]]}]},"landlady_hard":{"title":"The Landlady","sub":"Story (Harder)","url":"/readings/landlady-hard/","table":"landlady_responses","story":["intro","p1","p2","p3","p4"],"steps":[{"id":"intro","label":"Intro & prediction","kind":"ch","q":[["pre1",0],["pre2",0],["pre3",0],["pre4",0],["pre5",0]]},{"id":"p1","label":"Part 1","kind":"ch","q":[["hl1",0],["s1",0],["s2",0],["s3",0],["q1",0],["q2",0],["h1",1],["simile1",0],["simile2",0],["simile3",0],["simile4",0]]},{"id":"words","label":"Word practice","kind":"ch","q":[]},{"id":"p2","label":"Part 2","kind":"ch","q":[["q3",0],["s4",0],["s5",0],["pred1",0],["s6",0],["q4",0],["pred2",0],["h2",1]]},{"id":"p3","label":"Part 3","kind":"ch","q":[["s7",0],["s8",0],["q5",0],["h3",1],["pred3",0],["s9",0]]},{"id":"p4","label":"Part 4","kind":"ch","q":[["pred4",0],["s10",0],["s11",0],["q6",0],["q7",0],["q8",0]]},{"id":"ending","label":"What happened?","kind":"act","q":[["e1",0],["e2",0]]},{"id":"fore","label":"Foreshadowing","kind":"act","q":[["a1",0],["a2",0],["a3",0]]},{"id":"chars","label":"Characters","kind":"act","q":[["a4",0],["a5",0],["a6",0],["a7",0]]},{"id":"sum","label":"Write a summary","kind":"act","q":[["sum1",0],["sum2",0],["sum3",0]]},{"id":"comp","label":"Do you get it?","kind":"act","q":[["d1",0],["c3",0],["d2",0],["c4",0],["d3",0],["d4",0]]},{"id":"write","label":"Perspective writing","kind":"act","q":[["pw1",0],["pw2",0],["w1",0]]},{"id":"police","label":"Police report","kind":"act","q":[["p1",0],["p2",0],["p3",0],["p4",0],["p5",0],["p6",0],["w2",0],["p7",0],["p8",0]]},{"id":"film","label":"The film","kind":"act","q":[["f1",0],["f2",0]]}]},"telltale":{"title":"The Tell-Tale Heart","sub":"Story","url":"/readings/telltale/","table":"telltale_responses","story":["intro","p1","p2","p3","p4"],"steps":[{"id":"intro","label":"Intro & prediction","kind":"ch","q":[["pre1",0],["pre2",0],["pre3",0],["pre4",0],["pre5",0]]},{"id":"words","label":"Words","kind":"ch","q":[]},{"id":"p1","label":"Part 1","kind":"ch","q":[["s1",0],["s2",0],["q1",0],["h1",1],["pred1",0]]},{"id":"p2","label":"Part 2","kind":"ch","q":[["s3",0],["rep1",0],["rep2",0],["rep3",0],["rep4",0],["s4",0],["q2",0],["h2",1],["pred2",0]]},{"id":"p3","label":"Part 3","kind":"ch","q":[["s5",0],["q3",0],["s6",0],["pred3",0]]},{"id":"p4","label":"Part 4","kind":"ch","q":[["s7",0],["s8",0],["q4",0],["q5",0],["h3",1],["q6",0],["q7",0]]},{"id":"sum","label":"Write a summary","kind":"act","q":[["sum1",0],["sum2",0],["sum3",0]]},{"id":"comp","label":"Do you get it?","kind":"act","q":[["c1",0],["c1w",0],["c2",0],["c2w",0],["c3",0],["c3w",0],["c4",0],["c4w",0]]}]},"monkeyspaw":{"title":"The Monkey's Paw","sub":"Story","url":"/readings/monkeyspaw/","table":"monkeyspaw_responses","story":["intro","p1","p2","p3","p4"],"steps":[{"id":"intro","label":"Intro & prediction","kind":"ch","q":[["pre1",0],["pre2",0],["pre3",0],["pre4",0],["pre5",0]]},{"id":"words","label":"Words","kind":"ch","q":[]},{"id":"p1","label":"Part 1","kind":"ch","q":[["s1",0],["q1",0],["s2",0],["h1",1],["pred1",0]]},{"id":"p2","label":"Part 2","kind":"ch","q":[["s3",0],["q2",0],["h2",1],["pred2",0]]},{"id":"p3","label":"Part 3","kind":"ch","q":[["s4",0],["q3",0],["fs1",0],["fs2",0],["fs3",0],["fs4",0],["pred3",0]]},{"id":"p4","label":"Part 4","kind":"ch","q":[["s5",0],["q4",0],["s6",0],["h3",1],["q5",0],["q6",0],["q7",0]]},{"id":"sum","label":"Write a summary","kind":"act","q":[["sum1",0],["sum2",0],["sum3",0]]},{"id":"comp","label":"Do you get it?","kind":"act","q":[["c1",0],["c1w",0],["c2",0],["c2w",0],["c3",0],["c3w",0],["c4",0],["c4w",0]]}]}};
var ORDER=['intro','p1','p2','p3','p4'];
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function H(){return {apikey:SUPA_KEY,Authorization:'Bearer '+SUPA_KEY};}
function local(e){return String(e||'').trim().toLowerCase().split('@')[0];}
function css(){if(document.getElementById('sp-css'))return;var s=document.createElement('style');s.id='sp-css';s.textContent=
'.spcard{background:#fffaf0;border:2px solid #2b2016;border-radius:12px;box-shadow:4px 4px 0 rgba(43,32,22,.28);padding:12px 14px;margin:0 0 14px;font-family:inherit;color:#2b2016}'+
'.spcard h3{margin:0 0 2px;font-size:1.15rem}.spcard h3 a{color:#2b2016}.spsub{font-size:.85rem;font-weight:700;color:#6b5c46}'+
'.spbar{height:10px;border:2px solid #2b2016;border-radius:6px;background:#fff;margin:8px 0 10px;overflow:hidden}.spbar i{display:block;height:100%;background:#2e7d4f}'+
'.spgrp{font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#6b5c46;margin:8px 0 4px}'+
'.spsteps{display:flex;flex-wrap:wrap;gap:8px}'+
'.spstep{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:118px;text-decoration:none;color:#2b2016;background:#fff;border:2px solid #2b2016;border-radius:10px;padding:6px 10px;font-weight:800;font-size:.95rem}'+
'.spstep small{font-weight:700;font-size:.78rem;color:#6b5c46}'+
'.spstep.done{background:#e2f2e6;border-color:#2e7d4f}.spstep.done small{color:#1f5e38}'+
'.spstep.part{background:#fdf0c8}'+
'.spstep.lock{background:#eceeea;border-color:#9aa39e;color:#7b857f;cursor:not-allowed}.spstep.lock small{color:#7b857f}'+
'.spstep.next{outline:4px solid #e2a42b;animation:sppulse 1.6s ease-in-out infinite}'+
'@keyframes sppulse{50%{outline-color:rgba(226,164,43,.35)}}'+
'@media (prefers-reduced-motion:reduce){.spstep.next{animation:none}}';
document.head.appendChild(s);}
function countFor(step,ans,easy){var d=0,n=0;(step.q||[]).forEach(function(x){if(easy&&x[1])return;n++;if(ans[x[0]])d++;});return [d,n];}
function card(gk,row){
  var m=MAP[gk];if(!m)return '';
  var pay=(row&&row.payload)||{},easy=((pay.meta&&pay.meta.mode)||(row&&row.mode))==='easy';
  var ans={};(pay.questions||[]).forEach(function(q){if(q&&q.id&&String(q.a||'').trim())ans[q.id]=1;});
  var byId={};m.steps.forEach(function(s){byId[s.id]=s;});
  function done(id){var c=countFor(byId[id],ans,easy);return c[1]===0||c[0]>=Math.ceil(c[1]*0.85);}
  var sd=0,sn=0;m.story.forEach(function(id){var c=countFor(byId[id],ans,easy);sd+=c[0];sn+=c[1];});
  var storyOpen=sn>0&&sd>=Math.max(1,Math.ceil(sn*0.85));
  var all=0,alld=0,next=null,html={ch:'',act:''};
  m.steps.forEach(function(s){
    var c=countFor(s,ans,easy),lock=false,why='';
    if(s.kind==='ch'){var i=ORDER.indexOf(s.id);if(i>1&&!done(ORDER[i-1])){lock=true;why='Finish '+byId[ORDER[i-1]].label+' first';}}
    else if(!storyOpen){lock=true;why='Finish the story first';}
    all+=c[1];alld+=c[0];
    var full=c[1]>0&&c[0]===c[1],cls='spstep'+(lock?' lock':full?' done':c[0]?' part':'');
    if(!lock&&!full&&!next&&c[1]>0)next=s.id;   /* the next part with questions left; Words is practice, never the nudge */
    var note=lock?why:(s.id==='words'?(pay.vocab_check?'\u2713 '+pay.vocab_check.score+'/'+pay.vocab_check.total+' words':'Practice the words'):(c[1]?(full?'\u2713 '+c[0]+'/'+c[1]:c[0]+'/'+c[1]+' done'):'Open'));
    var inner=esc(s.label)+'<small>'+esc(note)+'</small>';
    html[s.kind]+= lock?'<span class="'+cls+'" data-step="'+s.id+'" aria-disabled="true">\uD83D\uDD12 '+inner+'</span>'
                      :'<a class="'+cls+'" data-step="'+s.id+'" href="'+m.url+'#'+s.id+'">'+inner+'</a>';
  });
  var pct=all?Math.round(100*alld/all):0;
  var out='<div class="spcard" data-guide="'+gk+'"><h3><a href="'+m.url+'">'+esc(m.title)+'</a></h3><div class="spsub">'+esc(m.sub)+(easy?' \u00b7 Easier':' \u00b7 Harder')+' \u00b7 '+alld+' of '+all+' answered'+(row&&row.submitted?' \u00b7 turned in':'')+'</div>'+
    '<div class="spbar"><i style="width:'+pct+'%"></i></div><div class="spgrp">Read the story</div><div class="spsteps">'+html.ch+'</div>'+
    (html.act?'<div class="spgrp">After you read</div><div class="spsteps">'+html.act+'</div>':'')+'</div>';
  if(next)out=out.replace('class="spstep','class="spstep').replace('data-step="'+next+'"','data-step="'+next+'" data-next="1"');
  return out.replace(/(<a class="spstep[^"]*)(" data-step="[^"]+" data-next="1")/,'$1 next$2');
}
function fetchRows(email){
  var tables={};Object.keys(MAP).forEach(function(k){tables[MAP[k].table]=1;});
  var l=local(email),or='or=(email.eq.'+encodeURIComponent(l+'@sfusd.edu')+',email.eq.'+encodeURIComponent(l+'@s.sfusd.edu')+')';
  return Promise.all(Object.keys(tables).map(function(t){
    return fetch(SUPA_URL+'/rest/v1/'+t+'?select=guide_key,mode,payload,submitted,updated_at&'+or,{headers:H()})
      .then(function(r){return r.ok?r.json():[];}).catch(function(){return [];});
  })).then(function(lists){var by={};lists.forEach(function(rows){(rows||[]).forEach(function(r){if(!MAP[r.guide_key])return;var c=by[r.guide_key];if(!c||String(r.updated_at)>String(c.updated_at))by[r.guide_key]=r;});});return by;});
}
function render(el,email,opts){
  opts=opts||{};if(!el||!email)return Promise.resolve();css();
  return fetchRows(email).then(function(by){
    var keys=Object.keys(MAP).filter(function(k){return by[k]||(opts.only&&opts.only.indexOf(k)>-1);});
    keys.sort(function(a,b){return String((by[b]||{}).updated_at||'').localeCompare(String((by[a]||{}).updated_at||''));});
    el.innerHTML=keys.map(function(k){return card(k,by[k]);}).join('');
    return keys.length;
  });
}
window.StoryProgress={render:render,card:card,map:MAP};
})();
