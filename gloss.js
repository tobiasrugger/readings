/* gloss.js — T-354 (Nov 2026). Opt-in fix for words Google translates in the wrong sense.
   A page loads it in <head>: <script src="/readings/gloss.js"></script>
   It wraps fetch: when a translator request (action=translate) asks for a word on the list
   below, the request asks for the clearer English instead. Example: "letter" → "letter of the alphabet",
   so Chinese gets 字母, not 信 (mail). Only whole-word requests are changed; sentences are left alone.
   NOT site-wide on purpose: Dear Lion (advice/) uses "letter" = mail. Add a page, not track.js.
   To add a word: one line in GLOSS. Lowercase key. */
(function(){
 if(window.__GLOSS_ON)return;window.__GLOSS_ON=true;
 var GLOSS=window.GAL_GLOSS=Object.assign({
  'letter':'letter of the alphabet',
  'letters':'letters of the alphabet',
  'a letter':'a letter of the alphabet',
  'the letter':'the letter of the alphabet',
  'spell':'spell a word',
  'spells':'spells a word'
 },window.GAL_GLOSS||{});
 function fix(s){var k=String(s||'').trim().toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,'').replace(/\s+/g,' ');return GLOSS[k]||null;}
 window.GAL_glossFix=fix;
 var f0=window.fetch;if(!f0)return;
 window.fetch=function(u,o){
  try{if(typeof u==='string'&&u.indexOf('action=translate')>-1){
   var m=u.match(/([?&]idiom=)([^&]*)/);
   if(m){var src=decodeURIComponent(m[2].replace(/\+/g,' ')),g=fix(src);
    if(g)u=u.replace(m[0],m[1]+encodeURIComponent(g)).replace(/([?&]mode=)sentence/,'$1word');}}}catch(e){}
  return f0.apply(this,[u,o]);
 };
})();
