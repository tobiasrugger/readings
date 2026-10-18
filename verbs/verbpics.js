/* =============================================================================
   verbpics.js — one drawn scene per verb, for readings/verbs/*
   Mr. Toby / Galileo ELD

     VERBPIC.get('watch')   -> '<svg …>'  (a person watching TV)
     VERBPIC.has('watch')   -> true
     VERBPIC.get('strive')  -> ''         (no picture yet; draw nothing)

   Scenes are flat SVG in the drill page palette, two or three tones per
   surface, no text inside the picture. Phrasal verbs are keyed whole
   ("hang out"). To add one: write a scene function, add it to SCENES.
   ============================================================================= */
(function(global){
'use strict';

var C = {
  ink:'#1c2640', line:'#8e9ab5', paper:'#f3f6fb', skin:'#e8b182', skin2:'#b9774a',
  hair:'#2b2320', shirt:'#2c5bc4', shirt2:'#1d7f53', gold:'#f0a52a', gold2:'#a86400',
  teal:'#0f7b74', red:'#b93a2e', green:'#1d7f53', wood:'#b07a44', sky:'#d7e5fb', white:'#ffffff'
};

function svg(inner){
  return '<svg viewBox="0 0 120 90" aria-hidden="true" focusable="false">'+inner+'</svg>';
}
/* a person: head, hair, shoulders. x,y is the centre of the head. */
function P(x,y,o){
  o=o||{};
  var skin=o.skin||C.skin, shirt=o.shirt||C.shirt, hair=o.hair||C.hair, r=o.r||11;
  var s='';
  s+='<path d="M'+(x-r*1.7)+' '+(y+r*4.2)+' Q'+(x-r*1.7)+' '+(y+r*1.5)+' '+x+' '+(y+r*1.35)+
     ' Q'+(x+r*1.7)+' '+(y+r*1.5)+' '+(x+r*1.7)+' '+(y+r*4.2)+' Z" fill="'+shirt+'"/>';
  s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+skin+'"/>';
  if(o.hairStyle==='long') s+='<path d="M'+(x-r)+' '+(y+r*0.9)+' Q'+(x-r*1.25)+' '+(y-r*1.3)+' '+x+' '+(y-r*1.25)+' Q'+(x+r*1.25)+' '+(y-r*1.3)+' '+(x+r)+' '+(y+r*0.9)+' Q'+(x+r*0.6)+' '+(y-r*0.2)+' '+x+' '+(y-r*0.35)+' Q'+(x-r*0.6)+' '+(y-r*0.2)+' '+(x-r)+' '+(y+r*0.9)+' Z" fill="'+hair+'"/>';
  else s+='<path d="M'+(x-r)+' '+(y-r*0.15)+' Q'+(x-r*0.95)+' '+(y-r*1.35)+' '+x+' '+(y-r*1.3)+' Q'+(x+r*0.95)+' '+(y-r*1.35)+' '+(x+r)+' '+(y-r*0.15)+' Q'+(x+r*0.5)+' '+(y-r*0.6)+' '+x+' '+(y-r*0.55)+' Q'+(x-r*0.5)+' '+(y-r*0.6)+' '+(x-r)+' '+(y-r*0.15)+' Z" fill="'+hair+'"/>';
  var ey=y+1;
  if(o.eyes==='shut'){
    s+='<path d="M'+(x-5)+' '+ey+' q2.5 2 5 0M'+(x+1)+' '+ey+' q2.5 2 5 0" stroke="'+C.ink+'" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  } else {
    s+='<circle cx="'+(x-4)+'" cy="'+ey+'" r="1.6" fill="'+C.ink+'"/><circle cx="'+(x+4)+'" cy="'+ey+'" r="1.6" fill="'+C.ink+'"/>';
  }
  if(o.mouth==='sad') s+='<path d="M'+(x-4)+' '+(y+7)+' q4 -3 8 0" stroke="'+C.ink+'" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  else if(o.mouth==='open') s+='<ellipse cx="'+x+'" cy="'+(y+6)+'" rx="3" ry="2.6" fill="'+C.red+'"/>';
  else s+='<path d="M'+(x-4)+' '+(y+5)+' q4 3.4 8 0" stroke="'+C.ink+'" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  return s;
}
/* a whole figure: head, torso, two arms, two legs */
function FIG(x,y,o){
  o=o||{};
  var skin=o.skin||C.skin, shirt=o.shirt||C.shirt, hair=o.hair||C.hair;
  var hr=8, hipY=y+34, kneeY=y+52;
  var g='<g'+(o.rot?' transform="rotate('+o.rot+' '+x+' '+(y+20)+')"':'')+'>';
  /* legs */
  if(o.legs==='stride'){
    g+='<path d="M'+x+' '+hipY+' L'+(x-13)+' '+(kneeY+12)+'M'+x+' '+hipY+' L'+(x+15)+' '+(kneeY+6)+'" stroke="'+C.ink+'" stroke-width="5.5" stroke-linecap="round" fill="none"/>';
  } else {
    g+='<path d="M'+(x-4)+' '+hipY+' L'+(x-6)+' '+(kneeY+14)+'M'+(x+4)+' '+hipY+' L'+(x+6)+' '+(kneeY+14)+'" stroke="'+C.ink+'" stroke-width="5.5" stroke-linecap="round" fill="none"/>';
  }
  /* torso */
  g+='<path d="M'+(x-10)+' '+(y+10)+' h20 v26 h-20 z" fill="'+shirt+'" rx="4"/>';
  /* arms */
  if(o.arms==='up') g+='<path d="M'+(x-9)+' '+(y+16)+' L'+(x-22)+' '+(y-4)+'M'+(x+9)+' '+(y+16)+' L'+(x+22)+' '+(y-4)+'" stroke="'+skin+'" stroke-width="5" stroke-linecap="round"/>';
  else if(o.arms==='forward') g+='<path d="M'+(x-9)+' '+(y+16)+' L'+(x-20)+' '+(y+26)+'M'+(x+9)+' '+(y+16)+' L'+(x+24)+' '+(y+10)+'" stroke="'+skin+'" stroke-width="5" stroke-linecap="round"/>';
  else if(o.arms==='stride') g+='<path d="M'+(x-9)+' '+(y+16)+' L'+(x-20)+' '+(y+4)+'M'+(x+9)+' '+(y+16)+' L'+(x+20)+' '+(y+26)+'" stroke="'+skin+'" stroke-width="5" stroke-linecap="round"/>';
  else g+='<path d="M'+(x-9)+' '+(y+16)+' L'+(x-15)+' '+(y+34)+'M'+(x+9)+' '+(y+16)+' L'+(x+15)+' '+(y+34)+'" stroke="'+skin+'" stroke-width="5" stroke-linecap="round"/>';
  /* head */
  g+='<circle cx="'+x+'" cy="'+y+'" r="'+hr+'" fill="'+skin+'"/>';
  g+='<path d="M'+(x-hr)+' '+(y-1)+' q0 -10 '+hr+' -10 q'+hr+' 0 '+hr+' 10 q-4 -5 -'+hr+' -5 q-5 0 -'+hr+' 5 z" fill="'+hair+'"/>';
  g+='<circle cx="'+(x-3)+'" cy="'+(y+1)+'" r="1.3" fill="'+C.ink+'"/><circle cx="'+(x+3)+'" cy="'+(y+1)+'" r="1.3" fill="'+C.ink+'"/>';
  g+=(o.mouth==='sad'
      ? '<path d="M'+(x-3)+' '+(y+6)+' q3 -2.5 6 0" stroke="'+C.ink+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
      : '<path d="M'+(x-3)+' '+(y+4)+' q3 2.6 6 0" stroke="'+C.ink+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>');
  return g+'</g>';
}
function arm(x1,y1,x2,y2,color,w){
  return '<path d="M'+x1+' '+y1+' Q'+((x1+x2)/2)+' '+(Math.min(y1,y2)-6)+' '+x2+' '+y2+'" stroke="'+(color||C.skin)+'" stroke-width="'+(w||5)+'" fill="none" stroke-linecap="round"/>';
}
function bubble(x,y,w,h,fill){
  return '<path d="M'+x+' '+y+' h'+w+' a5 5 0 0 1 5 5 v'+h+' a5 5 0 0 1 -5 5 h-'+(w-10)+' l-7 7 v-7 h-3 a5 5 0 0 1 -5 -5 v-'+h+' a5 5 0 0 1 5 -5 z" fill="'+(fill||C.white)+'" stroke="'+C.line+'" stroke-width="1.4"/>';
}
function book(x,y,s,c1,c2){
  s=s||1;
  return '<g transform="translate('+x+','+y+') scale('+s+')">'+
    '<path d="M0 0 L16 -3 L32 0 L32 22 L16 19 L0 22 Z" fill="'+(c1||C.paper)+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<path d="M16 -3 L16 19" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<path d="M4 6 h9M4 11 h9M20 6 h9M20 11 h9" stroke="'+(c2||C.line)+'" stroke-width="1.2" stroke-linecap="round"/></g>';
}
function screen(x,y,w,h,fill){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+(fill||C.sky)+'" stroke="'+C.ink+'" stroke-width="1.6"/>';
}
function floor(){ return '<path d="M0 78 h120" stroke="'+C.line+'" stroke-width="1.2" opacity=".5"/>'; }

/* ------------------------------------------------------------------ scenes */
var SCENES = {
  /* ---------- school and class ---------- */
  read: function(){ return P(34,30,{hairStyle:'long'})+arm(26,56,44,58)+book(46,44,1.1,C.paper)+floor(); },
  write: function(){ return P(32,26)+'<rect x="52" y="50" width="42" height="28" rx="2" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.5"/>'+
    '<path d="M58 60 h26M58 68 h18" stroke="'+C.line+'" stroke-width="1.4" stroke-linecap="round"/>'+
    arm(42,52,70,58)+'<path d="M66 60 L84 44" stroke="'+C.gold+'" stroke-width="4" stroke-linecap="round"/><path d="M84 44 l4 -4 l1 5 z" fill="'+C.gold2+'"/>'+floor(); },
  listen: function(){ return P(44,32)+'<path d="M74 28 q14 14 0 28" stroke="'+C.teal+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<path d="M84 22 q20 20 0 40" stroke="'+C.teal+'" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>'+
    '<circle cx="58" cy="32" r="3.4" fill="'+C.skin2+'"/>'+floor(); },
  speak: function(){ return P(32,34,{mouth:'open'})+bubble(58,22,38,20)+'<path d="M66 32 h22M66 39 h14" stroke="'+C.line+'" stroke-width="1.6" stroke-linecap="round"/>'+floor(); },
  talk: function(){ return P(28,36,{mouth:'open'})+P(92,36,{hairStyle:'long',shirt:C.shirt2,mouth:'open'})+bubble(44,16,22,12,C.sky)+bubble(74,30,18,10,C.gold)+floor(); },
  study: function(){ return '<rect x="14" y="58" width="92" height="7" rx="2" fill="'+C.wood+'"/>'+P(40,26,{eyes:'shut'})+book(58,44,1,C.paper)+
    '<path d="M24 52 l6 -16 l5 16 z" fill="'+C.gold+'"/>'+floor(); },
  learn: function(){ return P(36,36)+'<path d="M36 18 q0 -12 12 -12 q10 0 10 8" stroke="'+C.gold+'" stroke-width="2.4" fill="none"/>'+
    '<circle cx="76" cy="26" r="12" fill="'+C.gold+'"/><path d="M70 26 l5 5 l10 -11" stroke="'+C.white+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+floor(); },
  teach: function(){ return '<rect x="52" y="12" width="60" height="42" rx="3" fill="'+C.shirt2+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M60 26 h40M60 34 h30M60 42 h22" stroke="'+C.white+'" stroke-width="2" stroke-linecap="round"/>'+
    P(26,34,{hairStyle:'long',shirt:C.gold2})+arm(36,54,52,36)+floor(); },
  practice: function(){ return P(30,30)+'<path d="M52 62 q14 -22 30 -6" stroke="'+C.teal+'" stroke-width="3" fill="none" stroke-dasharray="5 4"/>'+
    '<circle cx="52" cy="62" r="4" fill="'+C.gold+'"/><circle cx="68" cy="50" r="4" fill="'+C.gold+'"/><circle cx="82" cy="56" r="4" fill="'+C.teal+'"/>'+floor(); },
  solve: function(){ return screen(40,20,66,44,C.paper)+'<path d="M50 34 h12M56 28 v12" stroke="'+C.shirt+'" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M72 34 h12" stroke="'+C.red+'" stroke-width="3" stroke-linecap="round"/><path d="M90 30 l8 8M98 30 l-8 8" stroke="'+C.teal+'" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M50 50 h48" stroke="'+C.ink+'" stroke-width="1.6"/>'+P(20,40)+floor(); },
  understand: function(){ return P(40,36)+'<circle cx="40" cy="12" r="8" fill="'+C.gold+'"/><path d="M36 12 h8M40 8 v8" stroke="'+C.white+'" stroke-width="2" stroke-linecap="round"/>'+
    '<path d="M28 6 l-4 -5M52 6 l4 -5M58 18 l6 -2" stroke="'+C.gold2+'" stroke-width="2" stroke-linecap="round"/>'+
    '<circle cx="86" cy="42" r="14" fill="none" stroke="'+C.teal+'" stroke-width="3"/><path d="M80 42 l5 5 l10 -12" stroke="'+C.teal+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+floor(); },
  spell: function(){ return P(26,34,{mouth:'open'})+'<rect x="50" y="24" width="20" height="24" rx="3" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<rect x="74" y="24" width="20" height="24" rx="3" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<path d="M56 36 h8M60 30 v12" stroke="'+C.ink+'" stroke-width="2"/><path d="M80 30 v12M80 30 q8 0 8 6 q0 6 -8 6" stroke="'+C.ink+'" stroke-width="2" fill="none"/>'+floor(); },
  find: function(){ return '<circle cx="62" cy="38" r="18" fill="none" stroke="'+C.ink+'" stroke-width="3.4"/><path d="M75 51 L94 70" stroke="'+C.ink+'" stroke-width="5" stroke-linecap="round"/>'+
    '<circle cx="62" cy="38" r="15" fill="'+C.sky+'" opacity=".55"/><path d="M56 38 l5 6 l10 -13" stroke="'+C.green+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+P(20,40)+floor(); },
  /* ---------- greetings and people ---------- */
  meet: function(){ return P(28,32)+P(92,32,{hairStyle:'long',shirt:C.shirt2})+arm(40,52,60,56)+arm(80,52,60,56,C.skin2)+
    '<circle cx="60" cy="56" r="6" fill="'+C.gold+'" opacity=".5"/>'+floor(); },
  shake: function(){ return SCENES.meet(); },
  greet: function(){ return P(32,34)+arm(44,50,58,22)+'<circle cx="60" cy="18" r="5" fill="'+C.skin+'"/>'+bubble(70,16,24,12,C.gold)+floor(); },
  wave: function(){ return SCENES.greet(); },
  introduce: function(){ return P(26,36,{mouth:'open'})+P(94,36,{shirt:C.shirt2,hairStyle:'long'})+arm(38,52,66,44)+
    bubble(46,12,34,14,C.sky)+floor(); },
  ask: function(){ return P(34,34,{mouth:'open'})+bubble(60,18,30,22)+'<path d="M70 28 q0 -6 6 -6 q6 0 6 5 q0 5 -6 6 v3" stroke="'+C.shirt+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="76" cy="40" r="1.8" fill="'+C.shirt+'"/>'+floor(); },
  answer: function(){ return P(34,34,{mouth:'open'})+bubble(60,18,30,22)+'<path d="M72 26 v12M72 26 q10 0 10 6 q0 6 -10 6" stroke="'+C.green+'" stroke-width="2.6" fill="none"/>'+floor(); },
  say: function(){ return P(36,34,{mouth:'open'})+bubble(62,22,30,18,C.white)+'<path d="M70 32 h16" stroke="'+C.line+'" stroke-width="1.8" stroke-linecap="round"/>'+floor(); },
  thank: function(){ return P(34,34)+arm(46,52,58,40)+'<path d="M74 54 C 60 44 56 36 62 31 C 67 27 73 30 75 35 C 77 30 83 27 88 31 C 94 36 88 44 74 54 Z" fill="'+C.red+'"/>'+floor(); },
  show: function(){ return P(26,36)+arm(38,52,62,40)+'<rect x="66" y="22" width="40" height="30" rx="3" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M72 44 l10 -12 l8 9 l6 -6 l6 9 z" fill="'+C.teal+'"/><circle cx="78" cy="30" r="3" fill="'+C.gold+'"/>'+floor(); },
  help: function(){ return P(30,38,{mouth:'sad'})+P(90,30,{shirt:C.shirt2})+arm(80,48,52,44,C.skin2)+
    '<path d="M44 44 q8 -6 14 0" stroke="'+C.gold+'" stroke-width="2.4" fill="none"/>'+floor(); },
  give: function(){ return P(26,36)+P(96,36,{hairStyle:'long',shirt:C.shirt2})+arm(38,52,56,50)+arm(86,52,68,50,C.skin2)+
    '<rect x="54" y="42" width="18" height="14" rx="2" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.4"/><path d="M63 42 v14M54 49 h18" stroke="'+C.white+'" stroke-width="1.6"/>'+floor(); },
  /* ---------- doing and making ---------- */
  work: function(){ return '<rect x="10" y="60" width="100" height="6" rx="2" fill="'+C.wood+'"/>'+P(38,28)+screen(58,34,44,26,C.sky)+
    '<path d="M64 42 h30M64 50 h20" stroke="'+C.shirt+'" stroke-width="2" stroke-linecap="round"/>'+floor(); },
  make: function(){ return P(30,30)+'<path d="M52 62 l14 -14" stroke="'+C.wood+'" stroke-width="5" stroke-linecap="round"/>'+
    '<path d="M64 46 l10 -10 l8 8 l-10 10 z" fill="'+C.line+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<path d="M84 62 l6 -6M92 56 l6 -6" stroke="'+C.gold+'" stroke-width="2.4" stroke-linecap="round"/>'+floor(); },
  fix: function(){ return P(28,30)+'<path d="M56 66 l20 -20" stroke="'+C.line+'" stroke-width="6" stroke-linecap="round"/>'+
    '<path d="M74 48 a9 9 0 1 1 12 -12 l-7 7 l5 5 l7 -7 a9 9 0 0 1 -12 12 z" fill="'+C.gold2+'"/>'+floor(); },
  clean: function(){ return P(32,28)+'<path d="M58 60 L78 30" stroke="'+C.wood+'" stroke-width="4" stroke-linecap="round"/>'+
    '<path d="M48 70 l16 -14 l8 8 l-16 14 z" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.4"/>'+
    '<path d="M86 24 a4 4 0 1 1 0 .1M96 36 a3 3 0 1 1 0 .1" fill="none" stroke="'+C.teal+'" stroke-width="2"/>'+floor(); },
  build: function(){ return P(26,32)+'<rect x="52" y="54" width="20" height="16" fill="'+C.red+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<rect x="74" y="54" width="20" height="16" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<rect x="63" y="36" width="20" height="16" fill="'+C.teal+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+floor(); },
  use: function(){ return P(28,32)+arm(40,50,62,48)+'<rect x="62" y="36" width="34" height="24" rx="3" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<rect x="66" y="40" width="26" height="7" rx="1.5" fill="'+C.sky+'"/><circle cx="70" cy="53" r="2.4" fill="'+C.ink+'"/><circle cx="79" cy="53" r="2.4" fill="'+C.ink+'"/><circle cx="88" cy="53" r="2.4" fill="'+C.ink+'"/>'+floor(); },
  put: function(){ return '<rect x="56" y="48" width="44" height="26" rx="3" fill="'+C.wood+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    P(26,34)+arm(38,50,64,40)+'<rect x="60" y="28" width="16" height="13" rx="2" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.4"/>'+
    '<path d="M68 42 v6" stroke="'+C.line+'" stroke-width="1.6" stroke-dasharray="3 2"/>'+floor(); },
  /* ---------- home and body ---------- */
  eat: function(){ return P(34,30,{mouth:'open'})+'<circle cx="80" cy="56" r="17" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<circle cx="80" cy="56" r="9" fill="'+C.gold+'"/>'+arm(46,52,66,50)+'<path d="M62 44 v-14M58 30 v8M66 30 v8" stroke="'+C.line+'" stroke-width="1.8" stroke-linecap="round"/>'+floor(); },
  drink: function(){ return P(34,30)+arm(46,52,62,44)+'<path d="M62 32 h22 l-3 26 h-16 z" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M64 42 h18" stroke="'+C.shirt+'" stroke-width="2"/><path d="M78 32 l6 -12" stroke="'+C.red+'" stroke-width="2.4" stroke-linecap="round"/>'+floor(); },
  sleep: function(){ return '<path d="M12 56 h96 v18 h-96 z" fill="'+C.shirt+'"/><rect x="18" y="44" width="30" height="16" rx="5" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<circle cx="36" cy="52" r="10" fill="'+C.skin+'"/><path d="M31 52 q2.5 2 5 0M38 52 q2.5 2 5 0" stroke="'+C.ink+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>'+
    '<path d="M54 40 h10 l-10 10 h10" stroke="'+C.teal+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<path d="M70 24 h8 l-8 8 h8" stroke="'+C.teal+'" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>'; },
  wake: function(){ return '<path d="M10 58 h60 v16 h-60 z" fill="'+C.shirt+'"/>'+P(36,34)+
    '<circle cx="88" cy="34" r="16" fill="'+C.gold+'"/><path d="M88 18 v-8M88 50 v8M72 34 h-8M104 34 h8M77 23 l-6 -6M99 45 l6 6" stroke="'+C.gold2+'" stroke-width="2.4" stroke-linecap="round"/>'+floor(); },
  live: function(){ return '<path d="M60 12 L104 44 L104 76 L16 76 L16 44 Z" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+
    '<path d="M60 12 L108 46 L104 52 L60 20 L16 52 L12 46 Z" fill="'+C.red+'"/>'+
    '<rect x="50" y="54" width="20" height="22" fill="'+C.wood+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<rect x="26" y="50" width="16" height="14" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<rect x="78" y="50" width="16" height="14" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.4"/>'; },
  feel: function(){ return P(40,34)+'<path d="M86 56 C 70 44 66 34 73 29 C 79 25 85 28 87 34 C 89 28 95 25 101 29 C 108 34 102 44 86 56 Z" fill="'+C.red+'"/>'+
    '<path d="M56 30 q10 -6 14 0" stroke="'+C.red+'" stroke-width="2" fill="none" opacity=".6"/>'+floor(); },
  cry: function(){ return P(44,34,{mouth:'sad',eyes:'shut'})+'<path d="M40 40 q-2 10 2 14" stroke="'+C.sky+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<path d="M48 40 q2 10 -1 13" stroke="'+C.sky+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<circle cx="78" cy="56" r="4" fill="'+C.sky+'"/><circle cx="90" cy="46" r="3" fill="'+C.sky+'"/>'+floor(); },
  hurt: function(){ return P(40,34,{mouth:'sad'})+'<path d="M52 50 l10 8 l-6 4 l8 7" stroke="'+C.red+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<path d="M76 30 l8 8M84 30 l-8 8" stroke="'+C.red+'" stroke-width="3" stroke-linecap="round"/>'+floor(); },
  hold: function(){ return P(34,30)+arm(44,52,64,52)+'<rect x="60" y="40" width="30" height="22" rx="3" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.6"/>'+
    '<path d="M75 40 v22M60 51 h30" stroke="'+C.white+'" stroke-width="1.8"/>'+floor(); },
  /* ---------- out and about ---------- */
  go: function(){ return '<path d="M22 74 L46 74 L40 40 L28 40 Z" fill="'+C.shirt+'"/>'+P(34,24)+
    '<path d="M60 56 h30M86 50 l8 6 l-8 6" stroke="'+C.teal+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+floor(); },
  come: function(){ return P(86,26)+'<path d="M74 56 L30 56M38 50 l-8 6 l8 6" stroke="'+C.teal+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+floor(); },
  run: function(){ return FIG(50,24,{legs:'stride',arms:'stride'})+'<path d="M14 24 h14M8 38 h18M16 52 h12" stroke="'+C.line+'" stroke-width="2.4" stroke-linecap="round"/>'+'<path d="M30 78 h70" stroke="'+C.line+'" stroke-width="2" opacity=".5"/>'; },
  walk: function(){ return FIG(40,24,{legs:'stride',arms:'stride'})+'<path d="M12 78 h96" stroke="'+C.line+'" stroke-width="2" opacity=".6"/>'+'<path d="M74 70 h22M82 62 h18" stroke="'+C.line+'" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'; },
  play: function(){ return P(28,28)+'<circle cx="82" cy="58" r="16" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+
    '<path d="M82 46 l9 7 l-3.5 11 h-11 L73 53 Z" fill="'+C.ink+'"/>'+arm(40,50,58,44)+
    '<path d="M62 70 q10 6 20 0" stroke="'+C.line+'" stroke-width="1.6" fill="none" opacity=".6"/>'+floor(); },
  watch: function(){ return P(26,38)+screen(50,20,58,40,C.sky)+'<rect x="56" y="26" width="46" height="22" rx="2" fill="'+C.shirt+'"/>'+
    '<path d="M74 32 l12 6 l-12 6 z" fill="'+C.white+'"/><path d="M68 60 h22M79 60 v8" stroke="'+C.ink+'" stroke-width="2"/>'+floor(); },
  see: function(){ return '<path d="M16 46 q26 -26 52 0 q-26 26 -52 0 z" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="2"/>'+
    '<circle cx="42" cy="46" r="10" fill="'+C.sky+'"/><circle cx="42" cy="46" r="4.5" fill="'+C.ink+'"/>'+
    '<path d="M78 34 q8 -6 16 0 q-2 10 -8 14 q-6 -4 -8 -14 z" fill="'+C.teal+'"/><path d="M86 48 v10" stroke="'+C.wood+'" stroke-width="2.4"/>'; },
  look: function(){ return SCENES.see(); },
  'hang out': function(){ return '<path d="M14 66 h92 v10 h-92 z" fill="'+C.wood+'"/>'+P(38,30,{hairStyle:'long'})+P(84,32,{shirt:C.shirt2})+
    bubble(52,12,26,12,C.gold)+'<circle cx="62" cy="66" r="4" fill="'+C.teal+'"/>'; },
  wait: function(){ return P(40,32)+'<circle cx="88" cy="40" r="17" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="2"/>'+
    '<path d="M88 40 v-10M88 40 l8 5" stroke="'+C.ink+'" stroke-width="2.4" stroke-linecap="round"/>'+floor(); },
  /* ---------- numbers, things, money ---------- */
  count: function(){ return '<path d="M26 70 v-26M42 70 v-36M58 70 v-46M74 70 v-30M90 70 v-20" stroke="'+C.shirt+'" stroke-width="9" stroke-linecap="round"/>'+
    '<circle cx="26" cy="38" r="5" fill="'+C.gold+'"/><circle cx="42" cy="28" r="5" fill="'+C.gold+'"/><circle cx="58" cy="18" r="5" fill="'+C.gold+'"/>'+floor(); },
  add: function(){ return '<circle cx="36" cy="42" r="18" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+
    '<circle cx="86" cy="42" r="18" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.8"/>'+
    '<path d="M61 34 v16M53 42 h16" stroke="'+C.ink+'" stroke-width="4" stroke-linecap="round"/>'+
    '<circle cx="30" cy="38" r="3" fill="'+C.shirt+'"/><circle cx="42" cy="46" r="3" fill="'+C.shirt+'"/><circle cx="80" cy="38" r="3" fill="'+C.gold2+'"/><circle cx="92" cy="46" r="3" fill="'+C.gold2+'"/>'; },
  have: function(){ return P(34,30)+arm(46,52,64,52)+'<circle cx="78" cy="48" r="14" fill="'+C.red+'"/><path d="M78 34 q4 -6 10 -5 q-3 6 -10 5z" fill="'+C.green+'"/>'+floor(); },
  need: function(){ return P(34,34,{mouth:'sad'})+'<rect x="60" y="30" width="40" height="30" rx="3" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M80 36 v14M74 43 h12" stroke="'+C.red+'" stroke-width="3" stroke-linecap="round"/>'+floor(); },
  buy: function(){ return P(28,32)+'<path d="M58 42 h36 l-4 30 h-28 z" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.6"/>'+
    '<path d="M68 42 v-6a8 8 0 0 1 16 0v6" fill="none" stroke="'+C.gold2+'" stroke-width="2"/>'+
    '<circle cx="48" cy="56" r="7" fill="'+C.teal+'"/><path d="M48 50 v12M45 54 h6" stroke="'+C.white+'" stroke-width="1.8"/>'+floor(); },
  sell: function(){ return '<path d="M10 54 h100 v6 h-100 z" fill="'+C.wood+'"/>'+P(30,28)+P(92,30,{shirt:C.shirt2,hairStyle:'long'})+
    '<circle cx="60" cy="46" r="7" fill="'+C.gold+'"/><path d="M60 40 v12" stroke="'+C.gold2+'" stroke-width="1.8"/>'+floor(); },
  pay: function(){ return SCENES.buy(); },
  /* ---------- thinking ---------- */
  think: function(){ return P(40,40)+'<circle cx="60" cy="24" r="4" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.2"/>'+
    '<circle cx="70" cy="16" r="6" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.2"/>'+
    '<circle cx="88" cy="22" r="14" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.4"/>'+
    '<path d="M82 22 q0 -7 7 -7 q6 0 6 5 q0 5 -6 6 v2" stroke="'+C.shirt+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+floor(); },
  know: function(){ return P(40,38)+'<circle cx="84" cy="30" r="16" fill="'+C.gold+'"/><path d="M84 38 v-10M84 44 v2" stroke="'+C.white+'" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M68 14 l-5 -5M100 14 l5 -5" stroke="'+C.gold2+'" stroke-width="2.2" stroke-linecap="round"/>'+floor(); },
  believe: function(){ return SCENES.know(); },
  forget: function(){ return P(40,38,{mouth:'sad'})+'<circle cx="86" cy="26" r="14" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.4" stroke-dasharray="4 3"/>'+
    '<path d="M80 26 q0 -6 6 -6 q6 0 6 5 q0 5 -6 6 v2" stroke="'+C.line+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<path d="M60 20 l-8 -6M62 30 l-10 0" stroke="'+C.line+'" stroke-width="1.8" stroke-linecap="round" opacity=".6"/>'+floor(); },
  like: function(){ return P(34,34)+'<path d="M84 58 C 68 46 64 36 71 31 C 77 27 83 30 85 36 C 87 30 93 27 99 31 C 106 36 100 46 84 58 Z" fill="'+C.red+'"/>'+
    '<path d="M50 44 q6 -4 10 0" stroke="'+C.red+'" stroke-width="2" fill="none" opacity=".5"/>'+floor(); },
  try: function(){ return P(30,34)+'<path d="M56 70 L74 34 L92 70 Z" fill="none" stroke="'+C.gold2+'" stroke-width="2.4"/>'+
    '<path d="M62 60 h24" stroke="'+C.gold+'" stroke-width="3"/><circle cx="74" cy="30" r="5" fill="'+C.gold+'"/>'+
    '<path d="M48 40 q12 -16 24 -8" stroke="'+C.teal+'" stroke-width="2.4" fill="none" stroke-dasharray="4 3"/>'+floor(); },
  start: function(){ return '<path d="M20 14 v62" stroke="'+C.ink+'" stroke-width="3"/><path d="M22 16 h34 v10 h-34z" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="1.2"/>'+
    '<path d="M22 26 h34 v10 h-34z" fill="'+C.ink+'"/><path d="M22 16 h17v10h-17zM39 26h17v10h-17z" fill="'+C.ink+'"/>'+
    P(80,34)+'<path d="M94 60 h14M104 54 l6 6 l-6 6" stroke="'+C.green+'" stroke-width="3" fill="none" stroke-linecap="round"/>'+floor(); },
  begin: function(){ return SCENES.start(); },
  win: function(){ return '<rect x="38" y="62" width="44" height="16" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.6"/>'+FIG(60,16,{legs:'stand',arms:'up'})+'<circle cx="60" cy="34" r="5" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.2"/>'+'<path d="M30 20 l-8 -8M90 20 l8 -8M60 -2 v-4" stroke="'+C.gold+'" stroke-width="2.4" stroke-linecap="round"/>'; },
  lose: function(){ return FIG(50,26,{legs:'stand',arms:'down',mouth:'sad'})+'<path d="M88 26 v30M82 48 l6 8 l6 -8" stroke="'+C.red+'" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+'<path d="M14 78 h92" stroke="'+C.line+'" stroke-width="2" opacity=".6"/>'; },
  /* ---------- a few more past-tense favourites ---------- */
  fall: function(){ return FIG(56,30,{rot:62,arms:'up',mouth:'sad'})+'<path d="M20 76 h84" stroke="'+C.line+'" stroke-width="2.6" stroke-linecap="round"/>'+'<path d="M86 24 q10 10 6 24" stroke="'+C.gold+'" stroke-width="2.4" fill="none" stroke-dasharray="4 3"/>'; },
  hit: function(){ return P(28,32)+arm(40,50,64,44)+'<circle cx="76" cy="40" r="10" fill="'+C.skin2+'"/>'+
    '<path d="M90 28 l8 -6M92 40 h10M90 52 l8 6" stroke="'+C.red+'" stroke-width="2.6" stroke-linecap="round"/>'+floor(); },
  ride: function(){ return '<circle cx="34" cy="62" r="13" fill="none" stroke="'+C.ink+'" stroke-width="3"/><circle cx="86" cy="62" r="13" fill="none" stroke="'+C.ink+'" stroke-width="3"/>'+
    '<path d="M34 62 L58 62 L72 40 L86 62M58 62 L48 40 h16" stroke="'+C.shirt+'" stroke-width="3" fill="none" stroke-linejoin="round"/>'+
    '<circle cx="62" cy="22" r="9" fill="'+C.skin+'"/><path d="M56 18 q6 -7 12 -2" stroke="'+C.hair+'" stroke-width="4.5" fill="none"/>'+
    '<path d="M62 32 L58 44" stroke="'+C.shirt2+'" stroke-width="6" stroke-linecap="round"/>'; },
  catch: function(){ return FIG(40,30,{legs:'stand',arms:'up'})+'<circle cx="72" cy="18" r="10" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+'<path d="M65 13 q7 5 14 0M65 23 q7 -5 14 0" stroke="'+C.red+'" stroke-width="1.5" fill="none"/>'+'<path d="M104 6 q-14 6 -22 10" stroke="'+C.line+'" stroke-width="2.2" fill="none" stroke-dasharray="5 4"/>'; },
  feed: function(){ return FIG(28,26,{legs:'stand',arms:'forward'})+'<path d="M62 60 q0 -8 10 -8 h14 q10 0 10 8 v10 h-34 z" fill="'+C.wood+'"/>'+'<circle cx="94" cy="50" r="10" fill="'+C.wood+'"/><path d="M86 42 l-4 -8 l9 3 z" fill="'+C.wood+'"/>'+'<circle cx="91" cy="49" r="1.6" fill="'+C.ink+'"/><path d="M86 54 q5 4 10 0" stroke="'+C.ink+'" stroke-width="1.4" fill="none"/>'+'<path d="M62 68 q-8 -4 -8 -12" stroke="'+C.wood+'" stroke-width="3" fill="none"/>'+'<circle cx="56" cy="46" r="5" fill="'+C.gold+'"/>'+floor(); },
  stand: function(){ return '<path d="M74 40 h26 v34 h-26 z" fill="none" stroke="'+C.line+'" stroke-width="2"/><path d="M74 56 h26" stroke="'+C.line+'" stroke-width="2"/>'+FIG(44,22,{legs:'stand',arms:'down'})+'<path d="M14 78 h92" stroke="'+C.line+'" stroke-width="2" opacity=".6"/>'; },
  ring: function(){ return '<path d="M46 56 q0 -26 14 -26 q14 0 14 26 z" fill="'+C.gold+'" stroke="'+C.gold2+'" stroke-width="1.6"/>'+
    '<path d="M40 56 h40" stroke="'+C.gold2+'" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="62" r="4" fill="'+C.gold2+'"/>'+
    '<path d="M30 34 q-6 10 0 20M90 34 q6 10 0 20" stroke="'+C.teal+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; },
  dig: function(){ return P(26,30)+'<path d="M50 62 L74 38" stroke="'+C.wood+'" stroke-width="4" stroke-linecap="round"/>'+
    '<path d="M70 34 l12 12 l-8 8 l-12 -12 z" fill="'+C.line+'" stroke="'+C.ink+'" stroke-width="1.4"/>'+
    '<path d="M18 74 q20 -10 40 0 q20 10 44 0" stroke="'+C.wood+'" stroke-width="3" fill="none"/>'; },
  hide: function(){ return '<rect x="52" y="30" width="54" height="46" rx="3" fill="'+C.wood+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+
    '<circle cx="40" cy="52" r="10" fill="'+C.skin+'"/><path d="M34 46 q6 -8 13 -2" stroke="'+C.hair+'" stroke-width="5" fill="none"/>'+
    '<circle cx="37" cy="52" r="1.6" fill="'+C.ink+'"/>'+floor(); },
  wear: function(){ return FIG(40,24,{legs:'stand',arms:'down',shirt:C.red})+'<path d="M30 14 h20 v-5 a10 6 0 0 0 -20 0 z" fill="'+C.ink+'"/><path d="M24 14 h32" stroke="'+C.ink+'" stroke-width="3" stroke-linecap="round"/>'+'<path d="M88 20 v8M80 28 h16" stroke="'+C.line+'" stroke-width="1.8"/>'+'<path d="M78 30 h20 l6 28 h-32 z" fill="'+C.shirt+'" stroke="'+C.ink+'" stroke-width="1.4"/>'; },
  swim: function(){ return '<circle cx="46" cy="34" r="9" fill="'+C.skin+'"/><path d="M40 30 q6 -7 12 -2" stroke="'+C.hair+'" stroke-width="4.5" fill="none"/>'+
    '<path d="M52 42 L84 34" stroke="'+C.shirt+'" stroke-width="7" stroke-linecap="round"/>'+
    '<path d="M8 56 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0" stroke="'+C.sky+'" stroke-width="4" fill="none"/>'+
    '<path d="M8 68 q12 -8 24 0 q12 8 24 0 q12 -8 24 0 q12 8 24 0" stroke="'+C.sky+'" stroke-width="4" fill="none" opacity=".6"/>'; },
  drive: function(){ return '<path d="M16 60 h88 v-14 h-18 l-10 -12 h-40 l-10 12 h-10 z" fill="'+C.shirt+'" stroke="'+C.ink+'" stroke-width="1.8"/>'+
    '<rect x="42" y="38" width="22" height="10" fill="'+C.sky+'"/><circle cx="36" cy="64" r="9" fill="'+C.ink+'"/><circle cx="88" cy="64" r="9" fill="'+C.ink+'"/>'+
    '<circle cx="36" cy="64" r="3.4" fill="'+C.line+'"/><circle cx="88" cy="64" r="3.4" fill="'+C.line+'"/>'; },
  sing: function(){ return P(36,32,{mouth:'open'})+'<path d="M72 50 v-24 l18 -5 v24" stroke="'+C.ink+'" stroke-width="2.4" fill="none"/>'+
    '<circle cx="68" cy="52" r="5" fill="'+C.ink+'"/><circle cx="86" cy="47" r="5" fill="'+C.ink+'"/>'+floor(); },
  wash: function(){ return P(28,30)+'<path d="M52 56 h44 v18 h-44 z" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<circle cx="62" cy="46" r="6" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.2"/>'+
    '<circle cx="76" cy="38" r="8" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.2"/>'+
    '<circle cx="90" cy="46" r="5" fill="'+C.white+'" stroke="'+C.line+'" stroke-width="1.2"/>'+floor(); },
  finish: function(){ return '<path d="M86 12 v64" stroke="'+C.ink+'" stroke-width="3"/><path d="M88 16 h20v10h-20z" fill="'+C.white+'" stroke="'+C.ink+'" stroke-width="1.2"/>'+
    '<path d="M88 16 h10v10h-10zM98 26h10v10h-10z" fill="'+C.ink+'"/><path d="M88 26 h20v10h-20z" fill="none" stroke="'+C.ink+'" stroke-width="1.2"/>'+
    P(44,34)+'<path d="M16 60 h16M12 48 h14" stroke="'+C.line+'" stroke-width="2.2" stroke-linecap="round"/>'+floor(); },
  relax: function(){ return '<path d="M18 48 h76 v26 h-76 z" fill="'+C.shirt+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M18 48 q0 -12 12 -12 h52 q12 0 12 12" fill="'+C.shirt2+'"/>'+
    '<circle cx="52" cy="38" r="9" fill="'+C.skin+'"/><path d="M47 38 q2.5 2 5 0M53 38 q2.5 2 5 0" stroke="'+C.ink+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>'+
    '<path d="M100 34 h8 l-8 8 h8" stroke="'+C.teal+'" stroke-width="2" fill="none" stroke-linecap="round"/>'; },
  miss: function(){ return P(34,36,{mouth:'sad'})+'<path d="M58 62 h44M62 70 h36" stroke="'+C.line+'" stroke-width="2" stroke-linecap="round"/>'+
    '<path d="M64 34 h38 v22 h-38 z" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<circle cx="76" cy="44" r="4" fill="'+C.skin2+'"/><circle cx="90" cy="44" r="4" fill="'+C.skin2+'"/>'+
    '<path d="M52 30 C 46 24 50 18 56 22" stroke="'+C.red+'" stroke-width="2" fill="none"/>'; },
  be: function(){ return FIG(36,28,{legs:'stand',arms:'down'})+'<rect x="66" y="18" width="42" height="44" rx="4" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="2"/>'+'<circle cx="87" cy="34" r="8" fill="'+C.skin+'"/><path d="M79 33 q0 -10 8 -10 q8 0 8 10 q-4 -5 -8 -5 q-4 0 -8 5 z" fill="'+C.hair+'"/>'+'<path d="M80 46 h14 v12 h-14 z" fill="'+C.shirt+'"/>'+'<path d="M52 40 h10" stroke="'+C.gold2+'" stroke-width="2.4"/><path d="M52 46 h10" stroke="'+C.gold2+'" stroke-width="2.4"/>'+floor(); },
  do: function(){ return P(28,30)+'<rect x="56" y="30" width="46" height="42" rx="3" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="1.6"/>'+
    '<path d="M62 42 l4 4 l8 -9M62 56 l4 4 l8 -9" stroke="'+C.green+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>'+
    '<path d="M80 42 h16M80 56 h16" stroke="'+C.line+'" stroke-width="2" stroke-linecap="round"/>'+floor(); }
};

/* a few verbs share a scene */
var ALIAS = {
  shake:'meet', wave:'greet', look:'see', believe:'know', begin:'start', pay:'buy',
  learn:'learn', spend:'buy', lend:'give', tell:'say', meet:'meet'
};

function get(base){
  base=String(base||'').toLowerCase().trim();
  var key = SCENES[base] ? base : (ALIAS[base] && SCENES[ALIAS[base]] ? ALIAS[base] : null);
  return key ? svg(SCENES[key]()) : '';
}
function has(base){ return !!get(base); }
function list(){ return Object.keys(SCENES).concat(Object.keys(ALIAS)).filter(function(v,i,a){ return a.indexOf(v)===i; }).sort(); }

global.VERBPIC = {get:get, has:has, list:list, SCENES:SCENES, COLORS:C};
})(window);
