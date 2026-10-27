/* =====================================================================
   teachme/words.js — the word sets for "Teach Mr. Toby".

   Shared by the student page (teachme/index.html) and Toby's page
   (teachme/dashboard.html).

   Each word is ONE MEANING, pinned by a picture and a sentence, because
   most English words have several ("right" = correct / not left / a
   human right; "looks" = seems / looks at). Students say the word for
   THIS meaning. Toby's page then sorts what they said into:
     match    – the usual word for this meaning
     syn      – a different word, same meaning (a synonym or a dialect word)
     mixed    – a word with this meaning AND others (ask the student)
     other    – same English word, other meaning (derecho for "right" = correct)
     unknown  – the computer can't tell; Toby decides

     senseEn  English words that confirm THIS meaning in a back-translation
     otherEn  English words that mean one of the OTHER meanings
     seeds    what Toby's page already knows, per language: [word, how to say it]
              (pinyin / jyutping / English letters). Students' accepted words
              are added to these on Toby's page.
   ===================================================================== */
(function(){
var TM = window.TM = window.TM || {};

/* ---------- languages: sign-in name -> Google translate code, speech code ---------- */
TM.LANGS = {
  'Spanish':   {tr:'es',    sp:'es-US',       dir:'ltr'},
  'Cantonese': {tr:'yue',   sp:'yue-Hant-HK', dir:'ltr'},
  'Mandarin':  {tr:'zh-CN', sp:'cmn-Hans-CN', dir:'ltr'},
  'Arabic':    {tr:'ar',    sp:'ar-SA',       dir:'rtl'},
  'Vietnamese':{tr:'vi',    sp:'vi-VN',       dir:'ltr'},
  'Russian':   {tr:'ru',    sp:'ru-RU',       dir:'ltr'},
  'Darija':    {tr:'ar',    sp:'ar-MA',       dir:'rtl'},
  'Urdu':      {tr:'ur',    sp:'ur-PK',       dir:'rtl'},
  'Tagalog':   {tr:'tl',    sp:'fil-PH',      dir:'ltr'},
  'French':    {tr:'fr',    sp:'fr-FR',       dir:'ltr'},
  'Korean':    {tr:'ko',    sp:'ko-KR',       dir:'ltr'},
  'Hindi':     {tr:'hi',    sp:'hi-IN',       dir:'ltr'},
  'Somali':    {tr:'so',    sp:'so-SO',       dir:'ltr'},
  'Thai':      {tr:'th',    sp:'th-TH',       dir:'ltr'},
  'Nepali':    {tr:'ne',    sp:'ne-NP',       dir:'ltr'}
};
TM.LANG_ORDER = ['Mandarin','Cantonese','Spanish','Arabic','Vietnamese','Thai','Nepali','Darija','Russian','Urdu','Tagalog','French','Korean','Hindi','Somali'];

/* Chinese and Arabic students often speak something the menu doesn't name */
TM.DIALECTS = {
  'Mandarin':  ['Mandarin','Cantonese','Taishanese','Fuzhounese','Other'],
  'Cantonese': ['Cantonese','Mandarin','Taishanese','Other'],
  'Arabic':    ['Yemeni','Egyptian','Syrian / Lebanese','Iraqi','Saudi / Gulf','Other'],
  'Darija':    ['Moroccan','Algerian','Tunisian','Other'],
  'Spanish':   ['Mexico','Guatemala','El Salvador','Honduras','Nicaragua','Colombia','Venezuela','Other']
};

/* ======================= pictures (200 x 160) ======================= */
var INK='#2b2d42';
function svg(inner){return '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img">'+inner+'</svg>';}
/* a cast kid: x,y = neck point. o: skin, hair, shirt, pants, mood, hijab, glasses, armL, armR */
function kid(x,y,o){
  var s=o.skin||'#e0ac7e', sh=o.shirt||'#4a7fb5', pa=o.pants||'#3c4a63', h='';
  /* legs + shoes */
  h+='<path d="M'+(x-9)+' '+(y+38)+'l-2 30h8l3-24 3 24h8l-2-30z" fill="'+pa+'"/>';
  h+='<ellipse cx="'+(x-8)+'" cy="'+(y+70)+'" rx="7" ry="3.5" fill="#33302e"/><ellipse cx="'+(x+8)+'" cy="'+(y+70)+'" rx="7" ry="3.5" fill="#33302e"/>';
  /* body */
  h+='<path d="M'+(x-14)+' '+(y+6)+'q14-6 28 0l3 34h-34z" fill="'+sh+'"/>';
  h+='<path d="M'+(x-14)+' '+(y+6)+'q14-6 28 0l1 6q-15-4-30 0z" fill="#000" opacity=".12"/>';
  /* arms */
  var aL=o.armL||'down', aR=o.armR||'down';
  function arm(side,pose){var sx=x+side*14, sy=y+9, p;
    if(pose==='up') p='M'+sx+' '+sy+'l'+(side*10)+' -16l'+(side*3)+' -12';
    else if(pose==='out') p='M'+sx+' '+sy+'l'+(side*14)+' 8l'+(side*10)+' -2';
    else if(pose==='heart') p='M'+sx+' '+sy+'l'+(side*4)+' 14l'+(-side*12)+' -2';
    else if(pose==='point') p='M'+sx+' '+sy+'l'+(side*12)+' -4l'+(side*14)+' -6';
    else p='M'+sx+' '+sy+'l'+(side*4)+' 16l'+(side*1)+' 12';
    var end=p.match(/l(-?[\d.]+) (-?[\d.]+)l(-?[\d.]+) (-?[\d.]+)$/), ex=sx+ +end[1]+ +end[3], ey=sy+ +end[2]+ +end[4];
    return '<path d="'+p+'" fill="none" stroke="'+sh+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+ex+'" cy="'+ey+'" r="4.4" fill="'+s+'"/>';}
  h+=arm(-1,aL)+arm(1,aR);
  /* neck + head */
  h+='<rect x="'+(x-4)+'" y="'+(y-4)+'" width="8" height="8" fill="'+s+'"/>';
  if(o.hijab){h+='<path d="M'+(x-17)+' '+(y-14)+'q17-30 34 0q4 18-6 24q-11 6-22 0q-10-6-6-24z" fill="'+o.hijab+'"/><path d="M'+(x-16)+' '+(y+4)+'q16 10 32 0l2 6q-18 10-36 0z" fill="'+o.hijab+'"/><path d="M'+(x-8)+' '+(y-30)+'q8-4 16 0" stroke="#fff" stroke-width="1.2" opacity=".35" fill="none"/>';}
  h+='<ellipse cx="'+x+'" cy="'+(y-16)+'" rx="12" ry="13" fill="'+s+'"/>';
  if(!o.hijab){h+='<path d="M'+(x-13)+' '+(y-17)+'q0-16 13-16q14 0 13 16q-4-8-13-9q-8 1-13 9z" fill="'+(o.hair||'#2a1f1a')+'"/>';
    if(o.long) h+='<path d="M'+(x-13)+' '+(y-17)+'q-3 16 2 24h4l-1-20zM'+(x+13)+' '+(y-17)+'q3 16-2 24h-4l1-20z" fill="'+(o.hair||'#2a1f1a')+'"/>';
    h+='<ellipse cx="'+(x-12)+'" cy="'+(y-15)+'" rx="2.4" ry="3.4" fill="'+s+'"/><ellipse cx="'+(x+12)+'" cy="'+(y-15)+'" rx="2.4" ry="3.4" fill="'+s+'"/>';}
  else h+='<path d="M'+(x-12)+' '+(y-24)+'q12-8 24 0" fill="'+o.hijab+'"/>';
  /* face */
  var m=o.mood||'smile', ey=y-17;
  if(m==='tired'){h+='<path d="M'+(x-7)+' '+ey+'h5M'+(x+2)+' '+ey+'h5" stroke="'+INK+'" stroke-width="1.8" stroke-linecap="round"/>';}
  else h+='<circle cx="'+(x-4.5)+'" cy="'+ey+'" r="1.7" fill="'+INK+'"/><circle cx="'+(x+4.5)+'" cy="'+ey+'" r="1.7" fill="'+INK+'"/>';
  if(o.look==='right') h+='<circle cx="'+(x-3.6)+'" cy="'+ey+'" r=".7" fill="#fff"/><circle cx="'+(x+5.4)+'" cy="'+ey+'" r=".7" fill="#fff"/>';
  if(o.glasses) h+='<circle cx="'+(x-4.5)+'" cy="'+ey+'" r="4" fill="none" stroke="'+INK+'" stroke-width="1.2"/><circle cx="'+(x+4.5)+'" cy="'+ey+'" r="4" fill="none" stroke="'+INK+'" stroke-width="1.2"/><path d="M'+(x-.5)+' '+ey+'h1" stroke="'+INK+'"/>';
  if(m==='smile'||m==='big') h+='<path d="M'+(x-5)+' '+(y-10)+'q5 '+(m==='big'?6:4)+' 10 0" fill="'+(m==='big'?'#8c2f39':'none')+'" stroke="'+INK+'" stroke-width="1.5" stroke-linecap="round"/>';
  else if(m==='sad'||m==='tired') h+='<path d="M'+(x-4)+' '+(y-8)+'q4-3 8 0" fill="none" stroke="'+INK+'" stroke-width="1.5" stroke-linecap="round"/>';
  else if(m==='o') h+='<ellipse cx="'+x+'" cy="'+(y-9)+'" rx="2.2" ry="2.8" fill="#8c2f39"/>';
  h+='<circle cx="'+(x-8)+'" cy="'+(y-12)+'" r="2.4" fill="#e07a5f" opacity=".35"/><circle cx="'+(x+8)+'" cy="'+(y-12)+'" r="2.4" fill="#e07a5f" opacity=".35"/>';
  return h;
}
TM.kid=kid;
var FLOOR='<rect x="0" y="128" width="200" height="32" fill="#c9a77c"/><path d="M0 136h200M0 146h200M40 128l-6 32M90 128l-3 32M140 128l3 32M185 128l6 32" stroke="#a9875e" stroke-width="1"/>';
var WALL='<rect width="200" height="128" fill="#f1e6d0"/><path d="M0 92h200" stroke="#d8c6a4" stroke-width="3"/>';
var CHECK='<g><circle cx="0" cy="0" r="13" fill="#2e8b57"/><path d="M-6 0l4 5 8-9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>';
var XMARK='<g><circle cx="0" cy="0" r="13" fill="#c0392b"/><path d="M-5-5l10 10M5-5l-10 10" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></g>';

TM.ART = {
backpack: svg(WALL+'<rect x="128" y="18" width="56" height="44" rx="3" fill="#7a5b3a"/><rect x="132" y="22" width="48" height="36" fill="#9ec2d6"/><path d="M156 22v36M132 40h48" stroke="#7a5b3a" stroke-width="3"/>'+FLOOR+
 '<ellipse cx="88" cy="140" rx="52" ry="7" fill="#000" opacity=".18"/>'+
 '<path d="M58 44q-8-20 30-22q38 2 30 22" fill="none" stroke="#2c4f7c" stroke-width="7"/>'+
 '<path d="M52 52q0-14 36-14t36 14v76q0 10-10 10H62q-10 0-10-10z" fill="#3c6ea8"/>'+
 '<path d="M52 52q0-14 36-14t36 14v6q-36-10-72 0z" fill="#2c4f7c"/>'+
 '<path d="M56 56q32-10 64 0" fill="none" stroke="#9fc1e6" stroke-width="1.4" stroke-dasharray="3 3"/>'+
 '<rect x="62" y="84" width="52" height="44" rx="8" fill="#2c5d94"/><path d="M66 90h44" stroke="#c9d3df" stroke-width="2.4"/><path d="M66 90h44" stroke="#5c6b7d" stroke-width="2.4" stroke-dasharray="1.6 1.6"/>'+
 '<rect x="104" y="87" width="6" height="9" rx="2" fill="#d9b44a"/><path d="M107 96v8" stroke="#d9b44a" stroke-width="1.5"/>'+
 '<path d="M66 124q22 6 44 0" fill="none" stroke="#9fc1e6" stroke-width="1.2" stroke-dasharray="3 3"/>'+
 '<rect x="74" y="26" width="5" height="22" fill="#f2c94c" transform="rotate(-12 76 37)"/><path d="M74 26l2.5-6 2.5 6z" fill="#e8c9a0" transform="rotate(-12 76 37)"/>'+
 '<circle cx="80" cy="106" r="7" fill="#f2b33d"/><path d="M76 103q4-5 8 0q2 5-4 8q-6-3-4-8z" fill="#c9862a"/><circle cx="78.6" cy="105" r=".8" fill="'+INK+'"/><circle cx="81.4" cy="105" r=".8" fill="'+INK+'"/>'+
 '<path d="M52 70q-10 2-10 18" stroke="#2c4f7c" stroke-width="6" fill="none" stroke-linecap="round"/>'),

look: svg(WALL+'<rect x="104" y="16" width="88" height="62" rx="3" fill="#fbfbf8" stroke="#8a8f99" stroke-width="4"/><path d="M110 82h76" stroke="#8a8f99" stroke-width="4"/><rect x="150" y="78" width="14" height="4" fill="#d94f4f"/>'+
 '<text x="148" y="46" font-family="Nunito,Arial" font-size="20" font-weight="800" fill="#2f6db5" text-anchor="middle">A B C</text><path d="M120 58q12-6 24 0t24 0" stroke="#2e8b57" stroke-width="2.4" fill="none"/>'+FLOOR+
 kid(52,74,{skin:'#c68a5a',hair:'#1b1410',shirt:'#d1603d',look:'right'})+
 '<path d="M62 57Q90 40 116 40" fill="none" stroke="#e8a33d" stroke-width="2.6" stroke-dasharray="5 4"/><path d="M110 35l8 5-8 5" fill="none" stroke="#e8a33d" stroke-width="2.6" stroke-linecap="round"/>'),

looks: svg('<rect width="200" height="160" fill="#fdf7ea"/><rect x="4" y="4" width="94" height="152" rx="8" fill="#fff6c9" stroke="'+INK+'" stroke-width="2"/><rect x="102" y="4" width="94" height="152" rx="8" fill="#e3e7ee" stroke="'+INK+'" stroke-width="2"/>'+
 '<circle cx="24" cy="26" r="9" fill="#f6c443"/><path d="M24 11v-4M24 41v4M9 26h-4M39 26h4M13 15l-3-3M35 37l3 3M35 15l3-3M13 37l-3 3" stroke="#f6c443" stroke-width="2"/>'+
 kid(51,78,{skin:'#d9a27a',hijab:'#5b8a72',shirt:'#5b8a72',pants:'#4a3f55',mood:'big',armL:'up',armR:'up'})+
 '<path d="M118 22q6-8 12 0q6-8 12 0" stroke="#7d8597" stroke-width="2" fill="none"/><path d="M130 30v10M124 34v8M136 34v8" stroke="#7d93b5" stroke-width="1.5"/>'+
 kid(149,78,{skin:'#d9a27a',hijab:'#5b8a72',shirt:'#5b8a72',pants:'#4a3f55',mood:'sad'})+
 '<g transform="translate(26 140)">'+CHECK+'</g><g transform="translate(176 140)">'+XMARK+'</g>'),

teacher: svg(WALL+'<rect x="10" y="14" width="120" height="70" rx="3" fill="#2f4a3a" stroke="#7a5b3a" stroke-width="5"/><path d="M14 86h112" stroke="#7a5b3a" stroke-width="4"/><rect x="30" y="83" width="16" height="4" fill="#f4f1e6"/>'+
 '<text x="54" y="44" font-family="Nunito,Arial" font-size="17" font-weight="800" fill="#f4f1e6" text-anchor="middle">Hello!</text><path d="M24 58h60M24 68h40" stroke="#f4f1e6" stroke-width="2" opacity=".7"/>'+
 '<circle cx="104" cy="54" r="10" fill="none" stroke="#f2c94c" stroke-width="2"/><path d="M98 50q6-8 12 0M100 57q4 3 8 0" stroke="#f2c94c" stroke-width="1.6" fill="none"/>'+FLOOR+
 '<rect x="128" y="106" width="68" height="8" fill="#8a5a36"/><rect x="132" y="114" width="6" height="22" fill="#6e4528"/><rect x="186" y="114" width="6" height="22" fill="#6e4528"/>'+
 '<rect x="160" y="96" width="24" height="5" fill="#b84a3a"/><rect x="162" y="91" width="20" height="5" fill="#3a6ea5"/><circle cx="146" cy="100" r="6" fill="#d93a32"/><path d="M146 94q2-4 5-4" stroke="#4a7c3a" stroke-width="2" fill="none"/>'+
 kid(150,60,{skin:'#f0c8a4',hair:'#8a8a86',shirt:'#3d5a80',pants:'#2c2f3a',glasses:true,armL:'point'})+
 '<rect x="118" y="45" width="8" height="3.5" fill="#2e8b57" transform="rotate(-20 122 47)"/>'),

student: svg(WALL+'<rect x="138" y="14" width="52" height="58" fill="#9ec2d6" stroke="#7a5b3a" stroke-width="4"/><path d="M164 14v58M138 43h52" stroke="#7a5b3a" stroke-width="3"/><circle cx="178" cy="28" r="6" fill="#fff" opacity=".7"/>'+FLOOR+
 kid(86,62,{skin:'#e8c09a',hair:'#1b1410',shirt:'#e0a83a',pants:'#3c4a63',armL:'out',armR:'out',long:true})+
 '<rect x="44" y="86" width="96" height="8" rx="2" fill="#a77b4f"/><rect x="48" y="94" width="5" height="40" fill="#7d5a38"/><rect x="131" y="94" width="5" height="40" fill="#7d5a38"/>'+
 '<path d="M70 78l34-2 4 9-36 2z" fill="#fbfbf8" stroke="#8a8f99"/><path d="M76 81h24M76 84h18" stroke="#6a8fd1" stroke-width="1"/><rect x="100" y="70" width="3" height="14" fill="#f2c94c" transform="rotate(30 101 77)"/>'+
 '<path d="M140 112q0-10 14-10t14 10v20h-28z" fill="#c0504d"/><path d="M146 108q8-8 16 0" stroke="#8f3a37" stroke-width="3" fill="none"/>'),

friend: svg('<rect width="200" height="160" fill="#cfe6f2"/><circle cx="170" cy="26" r="12" fill="#f6d36b"/><path d="M0 100q50-20 100 0t100 0v28H0z" fill="#9cc58a"/>'+
 '<path d="M10 100v-26q8-14 16 0v26z" fill="#6f9f5c"/><rect x="16" y="98" width="4" height="10" fill="#7a5b3a"/>'+FLOOR+
 kid(70,70,{skin:'#e8c09a',hair:'#14100d',shirt:'#c95b8a',pants:'#36405a',long:true,mood:'big',armR:'up'})+
 kid(130,70,{skin:'#b97f55',hair:'#14100d',shirt:'#3f8f7a',pants:'#36405a',mood:'big',armL:'up'})+
 '<path d="M96 28l4-8 4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6z" fill="#f6c443"/><path d="M88 22l-4-4M112 22l4-4M100 14v-6" stroke="#f6c443" stroke-width="2"/>'),

school: svg('<rect width="200" height="160" fill="#bfdcef"/><path d="M0 34q30-10 60 0" stroke="#fff" stroke-width="6" fill="none" opacity=".7"/>'+
 '<rect x="26" y="46" width="148" height="86" fill="#e9d9b6"/><path d="M20 48l80-26 80 26z" fill="#b9573e"/><rect x="26" y="46" width="148" height="6" fill="#c9b48c"/>'+
 '<rect x="72" y="58" width="56" height="12" rx="2" fill="#fff8e6" stroke="#8a6d3b"/><text x="100" y="67.5" font-family="Nunito,Arial" font-size="8.5" font-weight="900" fill="#8a2d1f" text-anchor="middle" letter-spacing="1">SCHOOL</text>'+
 '<circle cx="100" cy="36" r="7" fill="#fff" stroke="#8a6d3b" stroke-width="1.5"/><path d="M100 36v-4M100 36h3" stroke="'+INK+'" stroke-width="1.3"/>'+
 '<g fill="#7fa6c7" stroke="#8a6d3b" stroke-width="1.2"><rect x="36" y="76" width="16" height="18"/><rect x="58" y="76" width="16" height="18"/><rect x="126" y="76" width="16" height="18"/><rect x="148" y="76" width="16" height="18"/><rect x="36" y="102" width="16" height="18"/><rect x="148" y="102" width="16" height="18"/></g>'+
 '<path d="M44 76v18M66 76v18M134 76v18M156 76v18" stroke="#8a6d3b"/>'+
 '<rect x="86" y="92" width="28" height="40" fill="#6e4528"/><path d="M100 92v40" stroke="#4d2f1b" stroke-width="1.5"/><circle cx="96" cy="113" r="1.5" fill="#d9b44a"/><circle cx="104" cy="113" r="1.5" fill="#d9b44a"/>'+
 '<rect x="80" y="132" width="40" height="5" fill="#b8b2a6"/><rect x="76" y="137" width="48" height="5" fill="#a39d91"/>'+
 '<rect x="176" y="20" width="2" height="40" fill="#777"/><path d="M178 22h16v10h-16z" fill="#c0392b"/><path d="M178 26h16" stroke="#fff" stroke-width="1.4"/>'+
 '<rect x="0" y="132" width="200" height="28" fill="#8fbf74"/><circle cx="14" cy="120" r="14" fill="#5f9150"/><circle cx="188" cy="118" r="16" fill="#5f9150"/><rect x="12" y="124" width="4" height="12" fill="#7a5b3a"/>'),

book: svg('<rect width="200" height="160" fill="#efe3c8"/><rect x="0" y="112" width="200" height="48" fill="#a77b4f"/><path d="M0 120h200M0 140h200" stroke="#8d6440" stroke-width="1"/>'+
 '<ellipse cx="100" cy="126" rx="84" ry="8" fill="#000" opacity=".16"/>'+
 '<path d="M100 40q-34-14-80-6v84q46-8 80 6z" fill="#fbf7ec" stroke="#8a7a5a" stroke-width="1.6"/><path d="M100 40q34-14 80-6v84q-46-8-80 6z" fill="#fffdf6" stroke="#8a7a5a" stroke-width="1.6"/>'+
 '<path d="M100 40v84" stroke="#b7a57e" stroke-width="2"/>'+
 '<path d="M30 50q30-4 60 2M30 60q30-4 60 2M30 70q30-4 60 2M30 80q30-4 60 2M30 90q30-4 44 2" stroke="#9a9a9a" stroke-width="2.2" fill="none"/>'+
 '<rect x="112" y="48" width="56" height="34" rx="2" fill="#bcd7e8"/><circle cx="126" cy="60" r="5" fill="#f6c443"/><path d="M114 80l16-14 12 10 8-6 16 10z" fill="#6f9f5c"/>'+
 '<path d="M112 92q28-4 56 2M112 102q28-4 40 2" stroke="#9a9a9a" stroke-width="2.2" fill="none"/>'+
 '<path d="M150 30v34l6-6 6 6V30z" fill="#c0392b"/>'+
 '<path d="M24 118q76 10 152 0" stroke="#8a7a5a" stroke-width="2" fill="none"/>'),

pencil: svg('<rect width="200" height="160" fill="#f3ecdc"/><rect x="18" y="24" width="140" height="104" fill="#fff" stroke="#c9c2b0" transform="rotate(-4 88 76)"/><path d="M26 44h132M26 60h132M26 76h132M26 92h132M26 108h132" stroke="#a9c4e8" stroke-width="1" transform="rotate(-4 88 76)"/><path d="M40 34v90" stroke="#e8a3a3" stroke-width="1" transform="rotate(-4 88 76)"/>'+
 '<path d="M44 100q20-16 40-4t36-8" stroke="#555" stroke-width="2" fill="none"/>'+
 '<g transform="rotate(-32 120 98)"><rect x="82" y="90" width="92" height="16" fill="#f2c335"/><path d="M82 95.3h92M82 100.6h92" stroke="#d9a520" stroke-width="1.2"/>'+
 '<rect x="174" y="89" width="12" height="18" fill="#b8b8b8"/><path d="M177 89v18M180 89v18M183 89v18" stroke="#8d8d8d" stroke-width="1"/><rect x="186" y="89" width="12" height="18" rx="4" fill="#e88f9a"/>'+
 '<path d="M82 90L62 98l20 8z" fill="#e8c9a0"/><path d="M70 95l-8 3 8 3" fill="#e0b88a"/><path d="M68.4 95.6L62 98l6.4 2.4z" fill="#3a3a3a"/>'+
 '<path d="M74 94q-2 4 0 8" stroke="#c99f6c" stroke-width=".8" fill="none"/></g>'+
 '<path d="M36 132q6-6 12 0q-6 4-12 0zM50 136q5-5 10 0q-5 3-10 0z" fill="#e8c9a0" stroke="#c99f6c" stroke-width=".7"/><path d="M42 134l2 1" stroke="#f2c335" stroke-width="2"/>'),

hello: svg(WALL+'<rect x="10" y="20" width="36" height="66" fill="#7a5b3a"/><rect x="14" y="24" width="28" height="58" fill="#946b44"/><circle cx="38" cy="56" r="2" fill="#d9b44a"/>'+FLOOR+
 kid(112,66,{skin:'#ecc49c',hair:'#14100d',shirt:'#5a7d4d',pants:'#2f3b52',mood:'big',armR:'up'})+
 '<path d="M140 22q4-6 8 0M146 18q5-7 10 0M134 28q3-4 6 0" stroke="#e8a33d" stroke-width="2" fill="none" stroke-linecap="round"/>'+
 '<rect x="150" y="96" width="34" height="32" rx="6" fill="#d9a03a"/><path d="M156 96q11-10 22 0" stroke="#a87726" stroke-width="3" fill="none"/>'),

thankyou: svg(WALL+FLOOR+
 kid(62,66,{skin:'#e8c09a',hair:'#14100d',shirt:'#c95b8a',pants:'#36405a',long:true,mood:'big',armR:'heart'})+
 kid(140,66,{skin:'#b97f55',hair:'#14100d',shirt:'#3f8f7a',pants:'#36405a',mood:'smile',armL:'out'})+
 '<rect x="106" y="72" width="22" height="4" fill="#f2c335" transform="rotate(-10 117 74)"/><path d="M106 74l-5 1 5 2z" fill="#e8c9a0"/>'+
 '<path d="M88 30q-5-7-10 0q-3 5 10 13q13-8 10-13q-5-7-10 0z" fill="#e0607e"/>'),

right: svg('<rect width="200" height="160" fill="#fdf7ea"/>'+
 '<rect x="6" y="10" width="90" height="120" rx="4" fill="#fff" stroke="'+INK+'" stroke-width="2"/><path d="M14 30h74M14 52h74M14 74h74M14 96h74" stroke="#cfe0f3"/>'+
 '<text x="50" y="72" font-family="Nunito,Arial" font-size="22" font-weight="800" fill="'+INK+'" text-anchor="middle">2+2=4</text>'+
 '<rect x="104" y="10" width="90" height="120" rx="4" fill="#fff" stroke="'+INK+'" stroke-width="2"/><path d="M112 30h74M112 52h74M112 74h74M112 96h74" stroke="#cfe0f3"/>'+
 '<text x="149" y="72" font-family="Nunito,Arial" font-size="22" font-weight="800" fill="'+INK+'" text-anchor="middle">2+2=5</text>'+
 '<path d="M24 98l10 12 30-30" stroke="#2e8b57" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
 '<g transform="translate(50 146)">'+CHECK+'</g><g transform="translate(149 146)">'+XMARK+'</g>'),

/* the intro scene: Mr. Toby with a notebook, students teaching him */
intro: svg('<rect width="200" height="160" fill="#f1e6d0"/><rect x="8" y="10" width="100" height="58" rx="3" fill="#2f4a3a" stroke="#7a5b3a" stroke-width="4"/>'+
 '<text x="58" y="30" font-family="Nunito,Arial" font-size="11" font-weight="800" fill="#f4f1e6" text-anchor="middle">apple =</text><text x="58" y="47" font-family="Nunito,Arial" font-size="11.5" font-weight="800" fill="#f6d36b" text-anchor="middle">苹果 · manzana</text><text x="58" y="61" font-family="Nunito,Arial" font-size="10" font-weight="800" fill="#9fd3b0" text-anchor="middle">تفاحة · quả táo</text>'+FLOOR+
 kid(140,60,{skin:'#f0c8a4',hair:'#8a8a86',shirt:'#3d5a80',pants:'#2c2f3a',glasses:true,armL:'out',mood:'o'})+
 '<rect x="104" y="72" width="20" height="24" rx="2" fill="#f6efd9" stroke="#8a6d3b" stroke-width="1.5" transform="rotate(-8 114 84)"/><path d="M108 78h12M108 83h12M108 88h8" stroke="#6a8fd1" stroke-width="1" transform="rotate(-8 114 84)"/>'+
 kid(36,96,{skin:'#d9a27a',hijab:'#5b8a72',shirt:'#5b8a72',pants:'#4a3f55',mood:'big',armR:'up'})+
 '<path d="M150 24q14-14 30-4q10 8-2 16q-8 4-20 2l-8 6 2-8q-8-4-2-12z" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/><text x="164" y="32" font-family="Nunito,Arial" font-size="14" font-weight="900" fill="'+INK+'" text-anchor="middle">?</text>'),

lion: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#c9862a"/><path d="M6 14l4 2M34 14l-4 2M5 24l5-1M35 24l-5-1M10 33l4-3M30 33l-4-3" stroke="#a86a1e" stroke-width="2"/><circle cx="20" cy="21" r="11" fill="#f2b33d"/><circle cx="16" cy="19" r="1.6" fill="#2b2d42"/><circle cx="24" cy="19" r="1.6" fill="#2b2d42"/><path d="M18 24h4l-2 2z" fill="#6b3b1f"/><path d="M17 27q3 2 6 0" stroke="#6b3b1f" stroke-width="1.2" fill="none"/></svg>'
};

/* ======================= the words ======================= */
/* set u1: Unit 1 + Story Reel Ep 1–2 */
TM.SETS = {
 u1: { title:'Unit 1 words', back:'/readings/launch-plus/', words:[
  {id:'backpack', en:'backpack', sense:'a bag you carry on your back', def:'a bag you wear on your back for school', sent:'Jun lost his backpack.', hl:'backpack', art:'backpack',
   senseEn:['backpack','school bag','schoolbag','bag','rucksack','knapsack'], otherEn:[],
   seeds:{Mandarin:[['背包','bēibāo'],['书包','shūbāo']], Cantonese:[['書包','syū bāau (syu1 baau1)'],['背囊','bui nòng (bui3 nong4)']], Spanish:[['mochila','mo-CHEE-la']], Arabic:[['حقيبة ظهر','haqeebat dhahr'],['شنطة','shanta']], Vietnamese:[['ba lô','ba lo'],['cặp','cap']], Thai:[['กระเป๋าเป้','kra-pao pay']], Nepali:[['झोला','jhola']]}},
  {id:'look', en:'look', sense:'look AT something (use your eyes)', def:'use your eyes to see something', sent:'Look at the board.', hl:'Look', art:'look',
   senseEn:['look','look at','see','watch','view'], otherEn:['seem','seems','appear','appears','face'],
   seeds:{Mandarin:[['看','kàn']], Cantonese:[['睇','tái (tai2)']], Spanish:[['mira','MEE-ra'],['mirar','mee-RAR'],['ver','vehr']], Arabic:[['انظر','unzhur'],['شوف','shoof']], Vietnamese:[['nhìn','nyin'],['xem','sem']], Thai:[['ดู','doo']], Nepali:[['हेर','her'],['हेर्नुहोस्','hernuhos']]}},
  {id:'looks', en:'looks', sense:'SEEMS (how someone looks: happy, tired…)', def:'seems; you can see how someone feels', sent:'Amira looks happy.', hl:'looks', art:'looks',
   senseEn:['seems','seem','appears','appear','looks like','look like'], otherEn:['watch','see','read','look at'],
   seeds:{Mandarin:[['看起来','kàn qǐlái'],['好像','hǎoxiàng']], Cantonese:[['睇落','tái lohk (tai2 lok6)'],['好似','hóu chíh (hou2 ci5)']], Spanish:[['se ve','seh veh'],['parece','pa-REH-seh']], Arabic:[['تبدو','tabdoo']], Vietnamese:[['trông','trong'],['có vẻ','ko veh']], Thai:[['ดูเหมือน','doo muean']], Nepali:[['देखिन्छ','dekhinchha']]}},
  {id:'teacher', en:'teacher', sense:'the person who teaches a class', def:'a person who helps students learn', sent:'Mr. Toby is my teacher.', hl:'teacher', art:'teacher',
   senseEn:['teacher','professor','instructor','tutor','master'], otherEn:[],
   seeds:{Mandarin:[['老师','lǎoshī']], Cantonese:[['老師','lóuh sī (lou5 si1)'],['阿Sir','ah sir']], Spanish:[['maestro','ma-ES-tro'],['maestra','ma-ES-tra'],['profesor','pro-feh-SOR'],['profe','PRO-feh']], Arabic:[['معلم','mu\u2019allim'],['أستاذ','ustaadh']], Vietnamese:[['giáo viên','zao vien'],['thầy','tie'],['cô','co']], Thai:[['ครู','kroo']], Nepali:[['शिक्षक','shikshak'],['सर','sar']]}},
  {id:'student', en:'student', sense:'a person who studies at school', def:'a person who learns at a school', sent:'I am a student.', hl:'student', art:'student',
   senseEn:['student','pupil','learner'], otherEn:[],
   seeds:{Mandarin:[['学生','xuéshēng']], Cantonese:[['學生','hohk sāang (hok6 saang1)']], Spanish:[['estudiante','es-too-dee-AN-teh'],['alumno','a-LOOM-no']], Arabic:[['طالب','taalib'],['طالبة','taaliba']], Vietnamese:[['học sinh','hok sing']], Thai:[['นักเรียน','nak rian']], Nepali:[['विद्यार्थी','vidyarthi']]}},
  {id:'friend', en:'friend', sense:'a person you like and trust', def:'a person you like who likes you too', sent:'Linh is my friend.', hl:'friend', art:'friend',
   senseEn:['friend','buddy','pal','companion','mate'], otherEn:[],
   seeds:{Mandarin:[['朋友','péngyou']], Cantonese:[['朋友','pàhng yáuh (pang4 jau5)'],['老友','lóuh yáu (lou5 jau2)']], Spanish:[['amigo','a-MEE-go'],['amiga','a-MEE-ga'],['cuate','KWA-teh'],['chero','CHEH-ro']], Arabic:[['صديق','sadeeq'],['صاحب','saahib']], Vietnamese:[['bạn','ban']], Thai:[['เพื่อน','phuean']], Nepali:[['साथी','saathi']]}},
  {id:'school', en:'school', sense:'the building where students learn', def:'a place where students go to learn', sent:'Galileo is my school.', hl:'school', art:'school',
   senseEn:['school','academy','high school'], otherEn:['shoal','faculty'],
   seeds:{Mandarin:[['学校','xuéxiào']], Cantonese:[['學校','hohk haauh (hok6 haau6)']], Spanish:[['escuela','es-KWEH-la'],['colegio','ko-LEH-hyo']], Arabic:[['مدرسة','madrasa']], Vietnamese:[['trường','troong']], Thai:[['โรงเรียน','rong rian']], Nepali:[['विद्यालय','vidyalaya'],['स्कुल','skul']]}},
  {id:'book', en:'book', sense:'a thing you read, with pages', def:'pages with words that you read', sent:'Open your book.', hl:'book', art:'book',
   senseEn:['book','textbook'], otherEn:['reserve','booking','register'],
   seeds:{Mandarin:[['书','shū'],['课本','kèběn']], Cantonese:[['書','syū (syu1)']], Spanish:[['libro','LEE-bro']], Arabic:[['كتاب','kitaab']], Vietnamese:[['sách','sak']], Thai:[['หนังสือ','nang-sue']], Nepali:[['किताब','kitaab'],['पुस्तक','pustak']]}},
  {id:'pencil', en:'pencil', sense:'a thing you write with (it has an eraser)', def:'a thin thing you write with; you can erase it', sent:'Can I borrow a pencil?', hl:'pencil', art:'pencil',
   senseEn:['pencil'], otherEn:['pen'],
   seeds:{Mandarin:[['铅笔','qiānbǐ']], Cantonese:[['鉛筆','yùhn bāt (jyun4 bat1)']], Spanish:[['lápiz','LA-pees']], Arabic:[['قلم رصاص','qalam rasaas']], Vietnamese:[['bút chì','boot chee']], Thai:[['ดินสอ','din-so']], Nepali:[['सिसाकलम','sisakalam']]}},
  {id:'hello', en:'hello', sense:'what you say when you meet someone', def:'a word you say when you see someone', sent:'Hello, my name is Jun.', hl:'Hello', art:'hello',
   senseEn:['hello','hi','greetings','hey','good day'], otherEn:['goodbye','bye'],
   seeds:{Mandarin:[['你好','nǐ hǎo']], Cantonese:[['你好','néih hóu (nei5 hou2)'],['哈囉','hā lóu']], Spanish:[['hola','OH-la']], Arabic:[['مرحبا','marhaban'],['السلام عليكم','as-salaamu alaykum']], Vietnamese:[['xin chào','sin chow'],['chào','chow']], Thai:[['สวัสดี','sa-wat-dee']], Nepali:[['नमस्ते','namaste']]}},
  {id:'thankyou', en:'thank you', sense:'what you say when someone helps you', def:'words you say when someone helps you or gives you something', sent:'Thank you for the pencil!', hl:'Thank you', art:'thankyou',
   senseEn:['thank you','thanks','thank'], otherEn:['please','excuse me','sorry'],
   seeds:{Mandarin:[['谢谢','xièxie']], Cantonese:[['唔該','m̀h gōi (m4 goi1) — for help'],['多謝','dō jeh (do1 ze6) — for a gift']], Spanish:[['gracias','GRA-syas']], Arabic:[['شكرا','shukran']], Vietnamese:[['cảm ơn','gam un']], Thai:[['ขอบคุณ','khob khun']], Nepali:[['धन्यवाद','dhanyabaad']]}},
  {id:'right', en:'right', sense:'CORRECT (not wrong) — not the direction, not a human right', def:'correct; not wrong', sent:'Your answer is right.', hl:'right', art:'right',
   senseEn:['correct','true','yes','accurate'], otherEn:['straight','law','direction','turn','human right','privilege','upright','righteous'],
   seeds:{Mandarin:[['对','duì'],['正确','zhèngquè']], Cantonese:[['啱','ngāam (ngaam1)'],['對','deui (deui3)']], Spanish:[['correcto','ko-REK-to'],['correcta','ko-REK-ta'],['bien','byen']], Arabic:[['صحيح','saheeh'],['صح','sah']], Vietnamese:[['đúng','doong']], Thai:[['ถูก','thook']], Nepali:[['सही','sahi'],['ठीक','theek']]}}
 ]}
};

TM.norm=function(s){return String(s||'').toLowerCase().replace(/[.,!?¿¡。，！？、"“”'’]/g,'').replace(/\s+/g,' ').trim();};
TM.wordById=function(set,id){var w=(TM.SETS[set]||{}).words||[];for(var i=0;i<w.length;i++)if(w[i].id===id)return w[i];return null;};
})();
