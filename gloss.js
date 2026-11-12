/* gloss.js — T-354, T-356 (Nov 2026). Opt-in fix for words Google translates in the wrong sense.
   A page loads it in <head>: <script src="/readings/gloss.js"></script>
   It wraps fetch: when a translator request (action=translate) asks for ONE word or short phrase on
   the list below, the request asks for clearer English instead ("letter" → "letter of the alphabet",
   so Chinese gets 字母, not 信). Sentences are never changed.
   A word with two school meanings ("period": class or punctuation) picks by the sentence it was
   tapped in (the request's meaning=), then by the page (/basics/ = grammar), then the default.
   NOT site-wide on purpose: Dear Lion (advice/) uses "letter" = mail. Add a page, not track.js.
   To add a word: one entry in G. Lowercase keys. */
(function(){
 if(window.__GLOSS_ON)return;window.__GLOSS_ON=true;
 var PATH=String(location.pathname||''),GRAMMAR=/\/basics\//.test(PATH);
 var PUNCT=/capital letter|sentence|dot|punctuation|comma|question mark|full stop|\u2713|\u25cb/i;
 var SCHOOLTIME=/class|school|bell|lunch|schedule|first|second|third|fourth|fifth|sixth|seventh|\d|today|teacher/i;
 var GRAM=/verb|sentence|noun|pronoun|fragment|\bis\b.*\bdoes\b|who or what/i;
 /* each entry: a plain string, or {ifs:[[regex on the sentence, english],...], def:english, grammar:english} */
 var G={
  'letter':'letter of the alphabet','letters':'letters of the alphabet',
  'a letter':'a letter of the alphabet','the letter':'the letter of the alphabet',
  'spell':'spell a word','spells':'spells a word',
  'period':{ifs:[[PUNCT,'period (punctuation mark)'],[SCHOOLTIME,'class period (one class at school)']],def:'class period (one class at school)',grammar:'period (punctuation mark)'},
  'periods':{ifs:[[PUNCT,'periods (punctuation marks)'],[SCHOOLTIME,'class periods (classes at school)']],def:'class periods (classes at school)',grammar:'periods (punctuation marks)'},
  'capital':{ifs:[[/city|country|state/i,'capital city']],def:'capital letter (A, B, C)'},
  'capitals':{ifs:[[/city|cities|country|countries/i,'capital cities']],def:'capital letters (A, B, C)'},
  'class':'class at school','classes':'classes at school',
  'grade':{ifs:[[/score|test|good|bad|report|percent/i,'grade (a score on a test)']],def:'grade (year in school, like 9th grade)'},
  'subject':{ifs:[[GRAM,'subject of a sentence (grammar)']],def:'school subject (like math or science)',grammar:'subject of a sentence (grammar)'},
  'subjects':{ifs:[[GRAM,'subjects of sentences (grammar)']],def:'school subjects (like math or science)',grammar:'subjects of sentences (grammar)'},
  'principal':'principal of a school','security':'security guard at a school',
  'second':{ifs:[[/minute|seconds|wait|clock|time/i,'one second of time']],def:'second (2nd, after first)'},
  'order':{ifs:[[/food|restaurant|lunch|buy/i,'order food']],def:'order (sequence, like ABC order)'},
  'break':{ifs:[[/broke|glass|window|arm|leg/i,'break (to break something)']],def:'break (a short rest time at school)'},
  'mean':{ifs:[[/does|what|meaning|word/i,'mean (to have a meaning)']],def:'mean (to have a meaning)'},
  'means':'means (has the meaning)',
  'floor':{ifs:[[/first|second|third|fourth|fifth|\d|upstairs|downstairs/i,'floor (level of a building)']],def:'floor (level of a building)'},
  'match':'match (put together things that go together)',
  'tap':'tap (touch the screen)','record':'record (record your voice)',
  'check':'check (look to see if it is right)','present':{ifs:[[/tense|verb|now/i,'present tense']],def:'present (here at school)'}
 };
 window.GAL_GLOSS=G;
 function norm(s){return String(s||'').trim().toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,'').replace(/\s+/g,' ');}
 function fix(src,ctx){var e=G[norm(src)];if(!e)return null;if(typeof e==='string')return e;
  ctx=String(ctx||'');
  /* the sentence itself is the best clue, minus the tapped word */
  var c=ctx.replace(new RegExp('\\b'+norm(src)+'\\b','ig'),' ');
  if(c.trim())for(var i=0;i<e.ifs.length;i++)if(e.ifs[i][0].test(c))return e.ifs[i][1];
  if(GRAMMAR&&e.grammar)return e.grammar;
  return e.def;}
 window.GAL_glossFix=fix;
 var f0=window.fetch;if(!f0)return;
 window.fetch=function(u,o){
  try{if(typeof u==='string'&&u.indexOf('action=translate')>-1){
   var m=u.match(/([?&]idiom=)([^&]*)/),mm=u.match(/[?&]meaning=([^&]*)/);
   if(m){var dec=function(x){try{return decodeURIComponent(String(x||'').replace(/\+/g,' '));}catch(e){return '';}};
    var src=dec(m[2]);
    if(src.trim().split(/\s+/).length<=3){var g=fix(src,dec(mm&&mm[1]));
     if(g)u=u.replace(m[0],m[1]+encodeURIComponent(g)).replace(/([?&]mode=)sentence/,'$1word');}}}}catch(e){}
  return f0.apply(this,[u,o]);
 };
})();
