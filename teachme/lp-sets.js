/* =====================================================================
   teachme/lp-sets.js — Teach Mr. Toby word sets for each Launch Plus
   lesson (u1-l1 … u1-l5). Loaded after words.js by teachme/index.html
   and teachme/dashboard.html. Open a set with ?set=u1-l3.

   Same shape as words.js: each word is ONE meaning, pinned by a drawing
   and a sentence from that lesson's story; seeds are what Toby's page
   already knows for Mandarin, Cantonese, Spanish, Arabic, Vietnamese,
   Thai and Nepali: [word, how to say it]. Cantonese romanization is
   Jyutping (number = tone). Word ids are unique across ALL sets because
   teachme_lex is keyed by word_id.
   T-158 · Oct 27 2026.
   ===================================================================== */
(function(){
var TM=window.TM; if(!TM||!TM.SETS) return;
var kid=TM.kid, INK='#2b2d42', F='font-family="Nunito,Arial" font-weight="900"';
function svg(i){return '<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img">'+i+'</svg>';}
function T(x,y,s,size,col,anchor){return '<text x="'+x+'" y="'+y+'" '+F+' font-size="'+(size||10)+'" fill="'+(col||INK)+'" text-anchor="'+(anchor||'middle')+'">'+s+'</text>';}
var FLOOR='<rect x="0" y="128" width="200" height="32" fill="#c9a77c"/><path d="M0 136h200M0 146h200M40 128l-6 32M90 128l-3 32M140 128l3 32M185 128l6 32" stroke="#a9875e" stroke-width="1"/>';
var TILE='<rect x="0" y="128" width="200" height="32" fill="#d8d3c4"/><path d="M0 138h200M0 149h200M25 128v32M60 128v32M95 128v32M130 128v32M165 128v32" stroke="#b9b2a0" stroke-width="1"/>';
var WALL='<rect width="200" height="128" fill="#f1e6d0"/><path d="M0 92h200" stroke="#d8c6a4" stroke-width="3"/>';
var HALL='<rect width="200" height="128" fill="#e4ebe2"/><rect y="84" width="200" height="44" fill="#c9d6c4"/><path d="M0 84h200" stroke="#9fb39a" stroke-width="3"/>';
var SKY='<rect width="200" height="160" fill="#cfe6f2"/><circle cx="172" cy="24" r="11" fill="#f6d36b"/><path d="M20 30q10-8 22 0q8-6 16 2h-38z" fill="#fff" opacity=".85"/>';
function CHECK(x,y){return '<g transform="translate('+x+' '+y+')"><circle r="12" fill="#2e8b57" stroke="#fff" stroke-width="2"/><path d="M-6 0l4 5 8-9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>';}
function XM(x,y){return '<g transform="translate('+x+' '+y+')"><circle r="12" fill="#c0392b" stroke="#fff" stroke-width="2"/><path d="M-5-5l10 10M5-5l-10 10" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></g>';}
function board(x,y,w,h,lines,fs){var s='<rect x="'+(x-4)+'" y="'+(y-4)+'" width="'+(w+8)+'" height="'+(h+8)+'" rx="2" fill="#8a6440"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#2f5d47"/><path d="M'+(x+6)+' '+(y+h-6)+'q'+(w/3)+' -4 '+(w/2)+' 0" stroke="#fff" stroke-width="1" opacity=".18" fill="none"/><rect x="'+(x-2)+'" y="'+(y+h+3)+'" width="'+(w+4)+'" height="3" fill="#6d4e32"/><rect x="'+(x+w-18)+'" y="'+(y+h+1)+'" width="8" height="2.4" fill="#fff"/>';
 (lines||[]).forEach(function(l,i){s+=T(x+w/2,y+(fs||10)+4+i*((fs||10)+4),l,fs||10,'#f4f1e6');});return s;}
function door(x,y,num,col){return '<rect x="'+(x-3)+'" y="'+(y-3)+'" width="40" height="'+(131-y)+'" fill="#7d5a38"/><rect x="'+x+'" y="'+y+'" width="34" height="'+(128-y)+'" fill="'+(col||'#a5774b')+'"/><rect x="'+(x+8)+'" y="'+(y+8)+'" width="18" height="16" fill="#bcd7e8" stroke="#6d4e32" stroke-width="1.5"/><path d="M'+(x+17)+' '+(y+8)+'v16" stroke="#6d4e32"/><circle cx="'+(x+28)+'" cy="'+(y+48)+'" r="2.2" fill="#d9b44a"/>'+(num?'<rect x="'+(x+6)+'" y="'+(y-16)+'" width="22" height="10" rx="2" fill="#fff" stroke="#6d4e32"/>'+T(x+17,y-8,num,7.5):'');}
function desk(x,y,w){w=w||46;return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="6" rx="1.5" fill="#b98a58"/><rect x="'+x+'" y="'+(y+6)+'" width="'+w+'" height="2" fill="#8d6440"/><rect x="'+(x+3)+'" y="'+(y+8)+'" width="3" height="'+(128-y-6)+'" fill="#6f7680"/><rect x="'+(x+w-6)+'" y="'+(y+8)+'" width="3" height="'+(128-y-6)+'" fill="#6f7680"/>';}
function chair(x,y,c){return '<rect x="'+x+'" y="'+(y-22)+'" width="20" height="16" rx="2" fill="'+(c||'#3f72a8')+'"/><rect x="'+(x-2)+'" y="'+y+'" width="24" height="5" rx="2" fill="'+(c||'#3f72a8')+'"/><path d="M'+(x+2)+' '+(y+5)+'l-2 '+(126-y-5)+'M'+(x+18)+' '+(y+5)+'l2 '+(126-y-5)+'M'+(x+2)+' '+(y-6)+'v6M'+(x+18)+' '+(y-6)+'v6" stroke="#6f7680" stroke-width="2.4"/>';}
function bubble(x,y,w,h,inner,tail){var tx=tail==='r'?x+w-14:x+12;return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="#fff" stroke="'+INK+'" stroke-width="1.6"/><path d="M'+tx+' '+(y+h-1)+'l'+(tail==='r'?6:-4)+' 10 '+(tail==='r'?2:8)+'-10" fill="#fff" stroke="'+INK+'" stroke-width="1.6" stroke-linejoin="round"/><path d="M'+(tx+1)+' '+(y+h-1.5)+'h8" stroke="#fff" stroke-width="3"/>'+inner;}
function clock(cx,cy,r,h,m){var a=(h%12+m/60)*30*Math.PI/180, b=m*6*Math.PI/180, t='';
 for(var i=0;i<12;i++){var q=i*30*Math.PI/180;t+='<path d="M'+(cx+Math.sin(q)*(r-2))+' '+(cy-Math.cos(q)*(r-2))+'L'+(cx+Math.sin(q)*(r-(i%3?4:6)))+' '+(cy-Math.cos(q)*(r-(i%3?4:6)))+'" stroke="'+INK+'" stroke-width="'+(i%3?1:1.8)+'"/>';}
 return '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+3)+'" fill="#3a3f4a"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#fffdf4"/>'+t+
 '<path d="M'+cx+' '+cy+'L'+(cx+Math.sin(a)*r*.5)+' '+(cy-Math.cos(a)*r*.5)+'" stroke="'+INK+'" stroke-width="2.6" stroke-linecap="round"/><path d="M'+cx+' '+cy+'L'+(cx+Math.sin(b)*r*.78)+' '+(cy-Math.cos(b)*r*.78)+'" stroke="'+INK+'" stroke-width="1.6" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="1.8" fill="#c0392b"/>';}
function win(x,y,w,h){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#9ec2d6" stroke="#7a5b3a" stroke-width="3"/><path d="M'+(x+w/2)+' '+y+'v'+h+'M'+x+' '+(y+h/2)+'h'+w+'" stroke="#7a5b3a" stroke-width="2"/><path d="M'+(x+4)+' '+(y+h-4)+'l'+(w/3)+' -'+(h/3)+'" stroke="#fff" stroke-width="2" opacity=".5"/>';}
function bk(x,y,w,h,c,r){return '<g transform="rotate('+(r||0)+' '+(x+w/2)+' '+(y+h/2)+')"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="1.5" fill="'+c+'"/><rect x="'+(x+w-3)+'" y="'+(y+1)+'" width="2" height="'+(h-2)+'" fill="#fff" opacity=".5"/><rect x="'+(x+3)+'" y="'+(y+h*.3)+'" width="'+(w-8)+'" height="3" fill="#fff" opacity=".55"/></g>';}
function heart(x,y,s,c){return '<path transform="translate('+x+' '+y+') scale('+s+')" d="M0 4C-6-4-14 2-8 8L0 15 8 8C14 2 6-4 0 4z" fill="'+(c||'#e06c75')+'"/>';}
function shadow(x,y,w){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+w+'" ry="4" fill="#000" opacity=".15"/>';}
var SK=['#e8c09a','#b97f55','#d9a27a','#f0c8a4','#8d5a3b','#e0ac7e'];
/* the five cast kids, ready to place */
function linh(x,y,o){return kid(x,y,Object.assign({skin:'#f0c8a4',hair:'#1b1410',shirt:'#d9567f',pants:'#3c4a63',long:true},o||{}));}
function mateo(x,y,o){return kid(x,y,Object.assign({skin:'#c98e62',hair:'#2a1f1a',shirt:'#2f6fbd',pants:'#2c2f3a'},o||{}));}
function amira(x,y,o){return kid(x,y,Object.assign({skin:'#d9a27a',hijab:'#1f8a7e',shirt:'#1f8a7e',pants:'#4a3f55'},o||{}));}
function jun(x,y,o){return kid(x,y,Object.assign({skin:'#ecc49c',hair:'#14100d',shirt:'#5b6b7c',pants:'#2c2f3a'},o||{}));}
function paolo(x,y,o){return kid(x,y,Object.assign({skin:'#b97f55',hair:'#14100d',shirt:'#864D9E',pants:'#36405a'},o||{}));}
function adult(x,y,o){return kid(x,y-6,Object.assign({pants:'#2c2f3a'},o||{}));}

var A={};
/* ======================= Lesson 1 · People at School ======================= */
A.principal=svg(HALL+door(14,40,'100','#7a4a2a')+'<rect x="6" y="20" width="54" height="10" rx="2" fill="#2c4f7c"/>'+T(33,28,'MAIN OFFICE',6.5,'#fff')+TILE+
 '<rect x="70" y="10" width="64" height="40" fill="#fffdf4" stroke="#8a6d3b" stroke-width="2"/><path d="M78 22h48M78 30h40M78 38h44" stroke="#9a9a9a" stroke-width="2"/><circle cx="122" cy="16" r="3" fill="#c0392b"/>'+
 adult(150,64,{skin:'#8d5a3b',hair:'#1b1410',shirt:'#3d3f6b',long:true,armL:'out',mood:'smile'})+'<rect x="138" y="72" width="22" height="3" fill="#c9a24a"/>'+
 '<path d="M130 80l-12 10" stroke="#3d3f6b" stroke-width="3"/><rect x="104" y="86" width="16" height="20" rx="2" fill="#f6efd9" stroke="#8a6d3b"/><path d="M107 92h10M107 96h10M107 100h7" stroke="#6a8fd1"/>'+
 '<g transform="translate(184 18)"><circle r="9" fill="#f2b33d"/><path d="M-4-1l2 2M4-1l-2 2" stroke="#6b3b1f" stroke-width="1.4"/><path d="M-3 3q3 2 6 0" stroke="#6b3b1f" fill="none"/><path d="M0-9l3-5 3 5M-6-6l-4-3" stroke="#c9862a" stroke-width="2"/></g>'+
 jun(80,74,{mood:'o',armR:'heart'})+linh(58,76,{mood:'smile'}));
A.counselor=svg(WALL+'<rect x="66" y="8" width="70" height="56" fill="#fff8e6" stroke="#8a6d3b" stroke-width="2"/>'+T(101,20,'MY CLASSES',7)+
 '<g font-size="6.5">'+['1  English','2  Math','3  Science','4  Art','5  P.E.'].map(function(s,i){return T(74,30+i*7.5,s,6.5,'#2f5d47','start');}).join('')+'</g><path d="M118 42l4 4 8-9" stroke="#2e8b57" stroke-width="2.4" fill="none"/>'+
 '<rect x="8" y="10" width="40" height="40" rx="20" fill="#bcd7e8" stroke="#7a5b3a" stroke-width="2"/><path d="M22 34q6-14 12 0" fill="#6f9f5c"/><circle cx="28" cy="24" r="4" fill="#f6c443"/>'+FLOOR+
 '<rect x="70" y="88" width="80" height="8" rx="2" fill="#a77b4f"/><rect x="74" y="96" width="5" height="34" fill="#7d5a38"/><rect x="141" y="96" width="5" height="34" fill="#7d5a38"/>'+
 '<rect x="90" y="80" width="26" height="9" rx="1" fill="#fbfbf8" stroke="#8a8f99"/><path d="M93 83h20M93 86h14" stroke="#6a8fd1"/><rect x="122" y="74" width="10" height="14" rx="3" fill="#e07a5f"/><path d="M124 74q3-6 6 0" stroke="#a75d4a" fill="none"/>'+
 adult(160,60,{skin:'#e8c09a',hair:'#3a2a1e',shirt:'#5b8a72',long:true,armL:'point',mood:'smile',glasses:true})+
 linh(40,70,{mood:'smile',armR:'out'}));
A.nurse=svg('<rect width="200" height="128" fill="#eef5f7"/><path d="M0 92h200" stroke="#cfe0e4" stroke-width="3"/>'+
 '<rect x="10" y="12" width="40" height="40" rx="4" fill="#fff" stroke="#b6c7cc" stroke-width="2"/><path d="M30 20v24M18 32h24" stroke="#c0392b" stroke-width="7"/>'+TILE+
 '<rect x="96" y="80" width="96" height="14" rx="4" fill="#fff" stroke="#9fb3b8" stroke-width="2"/><rect x="100" y="94" width="4" height="34" fill="#9aa3ad"/><rect x="184" y="94" width="4" height="34" fill="#9aa3ad"/><rect x="164" y="72" width="26" height="10" rx="5" fill="#dfe9ff"/>'+
 '<g transform="translate(118 72) rotate(-90)">'+kid(0,0,{skin:'#b97f55',hair:'#14100d',shirt:'#e0a83a',pants:'#3c4a63',mood:'sad'})+'</g>'+
 '<rect x="118" y="36" width="8" height="18" rx="2" fill="#fff" stroke="#c0392b" stroke-width="1.5"/><path d="M118 44h8" stroke="#c0392b"/><path d="M122 54v10" stroke="#c0392b" stroke-width="1.5"/>'+
 adult(66,62,{skin:'#f0c8a4',hair:'#7a4a2a',shirt:'#7fc4c9',pants:'#7fc4c9',long:true,armR:'out',mood:'smile'})+
 '<path d="M60 64q-4 14 6 18q8-2 6-12" stroke="#555" stroke-width="1.6" fill="none"/><circle cx="66" cy="83" r="2.5" fill="#888"/><rect x="58" y="34" width="16" height="5" rx="2" fill="#fff"/><path d="M66 34v5M63.5 36.5h5" stroke="#c0392b" stroke-width="1.4"/>');
A.librarian=svg('<rect width="200" height="128" fill="#efe3c8"/>'+
 [0,1,2].map(function(r){var y=14+r*30,s='<rect x="6" y="'+(y+24)+'" width="110" height="4" fill="#7d5a38"/>';var cs=['#c0504d','#3c6ea8','#2e8b57','#e0a83a','#864D9E','#5b6b7c','#e07a5f','#1f8a7e'];for(var i=0;i<12;i++){var h=16+((i*7+r*3)%8);s+='<rect x="'+(8+i*9)+'" y="'+(y+24-h)+'" width="8" height="'+h+'" fill="'+cs[(i+r)%8]+'"/><rect x="'+(9+i*9)+'" y="'+(y+28-h)+'" width="6" height="1.5" fill="#fff" opacity=".6"/>';}return s;}).join('')+
 '<rect x="4" y="10" width="114" height="92" fill="none" stroke="#7d5a38" stroke-width="4"/>'+FLOOR+
 '<rect x="122" y="84" width="74" height="44" fill="#8d6440"/><rect x="118" y="80" width="82" height="7" fill="#a77b4f"/><rect x="170" y="70" width="18" height="12" rx="2" fill="#3a3f4a"/><rect x="172" y="72" width="14" height="7" fill="#9ec2d6"/>'+
 adult(150,54,{skin:'#e8c09a',hair:'#9a9a96',shirt:'#c0504d',long:true,glasses:true,armL:'out',mood:'smile'})+
 bk(110,62,12,18,'#2e8b57',-10)+mateo(70,72,{armR:'out',mood:'big'}));
A.securityguard=svg(SKY+'<rect x="0" y="40" width="200" height="88" fill="#e9d9b6"/><rect x="0" y="40" width="200" height="6" fill="#c9b48c"/>'+
 '<rect x="66" y="58" width="68" height="70" fill="#6e4528"/><path d="M100 58v70" stroke="#4d2f1b" stroke-width="2"/><rect x="72" y="64" width="22" height="26" fill="#9ec2d6"/><rect x="106" y="64" width="22" height="26" fill="#9ec2d6"/><circle cx="96" cy="100" r="2" fill="#d9b44a"/><circle cx="104" cy="100" r="2" fill="#d9b44a"/>'+
 '<rect x="70" y="48" width="60" height="8" rx="2" fill="#fff8e6" stroke="#8a6d3b"/>'+T(100,55,'GALILEO',6.5,'#8a2d1f')+
 '<rect x="0" y="128" width="200" height="32" fill="#b8b2a6"/><path d="M0 140h200" stroke="#a39d91"/>'+
 adult(150,72,{skin:'#8d5a3b',hair:'#1b1410',shirt:'#2c3e63',pants:'#1f2a40',armL:'out',mood:'smile'})+
 '<path d="M137 40h26l-3-8h-20z" fill="#1f2a40"/><rect x="138" y="40" width="24" height="3" fill="#111"/><circle cx="150" cy="36" r="2" fill="#d9b44a"/>'+
 '<path d="M144 82l4 0 2 6-4 2z" fill="#d9b44a"/><rect x="158" y="80" width="4" height="10" rx="1" fill="#222"/><path d="M160 80v-4" stroke="#222"/>'+
 '<path d="M8 132l14-10 14 10z" fill="#f2b33d"/><rect x="18" y="124" width="8" height="16" fill="#f2b33d"/><path d="M8 132l28 0" stroke="#fff" stroke-width="2"/>'+
 amira(40,74,{armR:'up',mood:'big'}));
A.custodian=svg(WALL+'<rect x="12" y="20" width="60" height="44" fill="#2f5d47" stroke="#8a6440" stroke-width="4"/>'+desk(120,96,40)+chair(170,104,'#e0a83a')+TILE+
 '<path d="M30 140q30 8 70 0q20-4 40 2" stroke="#9ec2d6" stroke-width="10" fill="none" opacity=".55"/><path d="M40 142q22 4 46-2" stroke="#fff" stroke-width="2" opacity=".7"/>'+
 '<path d="M12 118l14 6-2 6-14-4z" fill="#f2c94c"/>'+T(20,116,'!',9,'#c9862a')+
 '<rect x="100" y="104" width="22" height="24" rx="2" fill="#2e8b57"/><rect x="98" y="100" width="26" height="5" rx="2" fill="#256f45"/><path d="M104 110v14M111 110v14M118 110v14" stroke="#1f5c39"/>'+
 adult(70,70,{skin:'#c98e62',hair:'#3a3a3a',shirt:'#5b6b7c',pants:'#3c4a63',armR:'out',mood:'smile'})+
 '<path d="M88 76l8 52" stroke="#a77b4f" stroke-width="3"/><path d="M84 126q12 10 26 2l-4-6q-8 4-18-2z" fill="#d8d3c4" stroke="#8d8676"/><path d="M88 128l-2 5M94 130l-1 5M100 129l1 5" stroke="#8d8676"/>'+
 '<rect x="58" y="78" width="24" height="3" fill="#d9b44a"/><circle cx="62" cy="82" r="2" fill="#aaa"/><circle cx="66" cy="83" r="2" fill="#aaa"/>');
A.assistant=svg(WALL+board(8,12,92,46,['ELD 101','4 + 4 = 8'],11)+FLOOR+
 desk(104,92,70)+'<rect x="114" y="84" width="24" height="9" rx="1" fill="#fbfbf8" stroke="#8a8f99"/><path d="M117 87h18M117 90h12" stroke="#6a8fd1"/>'+
 paolo(132,66,{armL:'point',mood:'o'})+'<path d="M128 22q8-10 16 0q-2 6-8 6t-8-6" fill="#fff" stroke="'+INK+'"/>'+T(136,27,'?',10)+
 adult(176,60,{skin:'#e0ac7e',hair:'#2a1f1a',shirt:'#e07a5f',long:true,armL:'out',mood:'smile'})+'<rect x="166" y="66" width="20" height="7" rx="2" fill="#fff"/>'+T(176,72,'HELPER',4.8,'#c0392b')+
 adult(44,64,{skin:'#f0c8a4',hair:'#8a8a86',shirt:'#3d5a80',glasses:true,armR:'point',mood:'smile'}));
A.classmate=svg(WALL+board(56,8,88,34,['Period 3'],11)+FLOOR+
 desk(14,94,80)+desk(108,94,80)+
 linh(40,68,{armR:'out',mood:'big'})+jun(70,68,{armL:'out',mood:'smile'})+mateo(130,68,{mood:'smile'})+amira(164,68,{mood:'smile'})+
 '<rect x="20" y="86" width="20" height="8" fill="#fbfbf8" stroke="#8a8f99"/><rect x="62" y="86" width="20" height="8" fill="#fbfbf8" stroke="#8a8f99"/><rect x="120" y="86" width="20" height="8" fill="#fbfbf8" stroke="#8a8f99"/><rect x="156" y="86" width="20" height="8" fill="#fbfbf8" stroke="#8a8f99"/>'+
 '<path d="M48 54q7-8 14 0" stroke="#e06c75" stroke-width="2" fill="none"/>'+heart(55,44,.6));
A.classroom=svg('<rect width="200" height="128" fill="#f4ead6"/><path d="M0 100h200" stroke="#d8c6a4" stroke-width="3"/>'+board(30,10,100,40,['Welcome!'],12)+clock(160,24,10,8,40)+win(146,44,40,34)+
 '<path d="M0 128L20 100h160l20 28z" fill="#c9a77c"/>'+FLOOR+
 '<g>'+[[34,106],[82,106],[130,106]].map(function(p){return desk(p[0],p[1],36);}).join('')+[[16,126],[64,126],[112,126],[160,126]].map(function(p){return desk(p[0],p[1]-6,36);}).join('')+'</g>'+
 '<rect x="8" y="56" width="14" height="40" fill="#8d6440"/><rect x="10" y="60" width="10" height="6" fill="#c0504d"/><rect x="10" y="70" width="10" height="6" fill="#3c6ea8"/><rect x="10" y="80" width="10" height="6" fill="#e0a83a"/>'+
 '<path d="M30 56h100" stroke="#c0504d" stroke-width="2"/>'+['A','B','C','D','E','F'].map(function(l,i){return '<rect x="'+(34+i*16)+'" y="54" width="10" height="10" fill="#fff" stroke="#c0504d"/>'+T(39+i*16,62,l,7,'#c0504d');}).join(''));
A.office=svg(HALL+'<rect x="20" y="20" width="160" height="108" fill="#f6efe0" stroke="#7d5a38" stroke-width="4"/>'+'<rect x="26" y="8" width="148" height="14" rx="2" fill="#2c4f7c"/>'+T(100,18,'ROOM 208',9,'#fff')+
 '<rect x="30" y="70" width="140" height="58" fill="#a77b4f"/><rect x="26" y="66" width="148" height="8" fill="#c79a66"/><path d="M40 84h120M40 100h120" stroke="#8d6440"/>'+
 '<rect x="36" y="30" width="30" height="22" fill="#fff" stroke="#999"/><path d="M40 36h22M40 41h18M40 46h20" stroke="#9a9a9a" stroke-width="1.4"/><rect x="134" y="28" width="34" height="26" fill="#bcd7e8" stroke="#7a5b3a" stroke-width="2"/>'+
 '<rect x="124" y="54" width="22" height="13" rx="1" fill="#3a3f4a"/><rect x="126" y="56" width="18" height="8" fill="#9ec2d6"/><rect x="60" y="58" width="12" height="8" rx="2" fill="#e0a83a"/><path d="M62 56h8" stroke="#555" stroke-width="2"/>'+
 adult(100,52,{skin:'#e8c09a',hair:'#d9d4c8',shirt:'#c95b8a',long:true,glasses:true,armL:'out',mood:'big'})+TILE+
 '<rect x="40" y="58" width="10" height="9" fill="#f6efd9" stroke="#8a6d3b" transform="rotate(-8 45 62)"/>');
A.cafeteria=svg('<rect width="200" height="128" fill="#fdf1d6"/><rect x="0" y="0" width="200" height="12" fill="#e0a83a"/><path d="M0 12h200" stroke="#b98226" stroke-width="2"/>'+win(8,20,36,28)+win(156,20,36,28)+
 '<rect x="54" y="20" width="92" height="34" fill="#c9d6c4" stroke="#7d8f7a" stroke-width="2"/>'+
 '<circle cx="70" cy="38" r="7" fill="#c0392b"/><path d="M70 31q2-4 5-4" stroke="#2e8b57" stroke-width="2" fill="none"/><rect x="84" y="32" width="20" height="12" rx="3" fill="#e9c46a"/><path d="M86 36h16" stroke="#b07a2a"/><rect x="112" y="30" width="10" height="16" rx="2" fill="#fff" stroke="#3c6ea8"/><rect x="112" y="30" width="10" height="5" fill="#3c6ea8"/><circle cx="134" cy="38" r="7" fill="#f2b33d"/>'+
 TILE+'<rect x="10" y="98" width="180" height="7" rx="3" fill="#3f72a8"/><rect x="18" y="105" width="4" height="23" fill="#6f7680"/><rect x="178" y="105" width="4" height="23" fill="#6f7680"/><rect x="10" y="120" width="180" height="4" rx="2" fill="#2c4f7c"/>'+
 '<rect x="26" y="90" width="26" height="9" rx="2" fill="#dfe6ec" stroke="#8a97a3"/><circle cx="34" cy="93" r="3" fill="#e07a5f"/><rect x="40" y="91" width="9" height="4" fill="#9cc58a"/><rect x="136" y="90" width="26" height="9" rx="2" fill="#dfe6ec" stroke="#8a97a3"/><circle cx="144" cy="93" r="3" fill="#e9c46a"/>'+
 mateo(56,62,{armR:'out',mood:'big'})+amira(120,62,{armL:'out',mood:'smile'})+'<path d="M90 50q0-6 4-8M98 50q0-6 4-8" stroke="#bbb" stroke-width="1.5" fill="none"/>');
A.help=svg(HALL+FLOOR+
 bk(40,116,22,8,'#c0504d',8)+bk(66,120,20,7,'#3c6ea8',-6)+bk(96,118,18,7,'#2e8b57',14)+'<rect x="112" y="122" width="16" height="4" fill="#f2c94c" transform="rotate(-20 120 124)"/><path d="M84 112l10-4 6 2" stroke="#fff" stroke-width="2"/>'+
 '<g transform="translate(60 76) rotate(-8)">'+kid(0,0,{skin:'#ecc49c',hair:'#14100d',shirt:'#5b6b7c',pants:'#2c2f3a',mood:'sad',armL:'out',armR:'out'})+'</g>'+
 kid(132,70,{skin:'#d9a27a',hijab:'#1f8a7e',shirt:'#1f8a7e',pants:'#4a3f55',mood:'smile',armL:'point'})+
 bk(100,92,18,12,'#e0a83a',-10)+'<path d="M150 24q10-14 26-6q12 8 0 16q-6 4-16 2l-8 6 2-8q-10-4-4-10z" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/>'+heart(162,22,.7));

/* ======================= Lesson 2 · Introductions ======================= */
A.name=svg(WALL+FLOOR+
 '<rect x="40" y="30" width="120" height="74" rx="8" fill="#fff" stroke="#c0392b" stroke-width="3"/><rect x="40" y="30" width="120" height="26" rx="8" fill="#c0392b"/><rect x="40" y="48" width="120" height="8" fill="#c0392b"/>'+
 T(100,44,'HELLO',12,'#fff')+T(100,54,'my name is',8,'#fff')+
 '<path d="M58 84q8-12 16-2t12-6q6-10 12 0q6 8 12-2q6-8 12 4q4 6 10-2" stroke="'+INK+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
 '<rect x="146" y="82" width="5" height="26" fill="#f2c94c" transform="rotate(30 148 95)"/><path d="M150 104l-3 6 6-2z" fill="#333" transform="rotate(30 148 95)"/>'+
 '<path d="M26 26l6 4M24 40h7M174 26l-6 4M176 40h-7" stroke="#e0a83a" stroke-width="2.4" stroke-linecap="round"/>'+shadow(100,112,60));
A.meet=svg(HALL+'<rect x="40" y="10" width="120" height="16" rx="3" fill="#2e8b57"/>'+T(100,22,'FIRST DAY',10,'#fff')+TILE+
 linh(72,66,{armR:'out',mood:'smile'})+mateo(128,64,{armL:'out',mood:'big'})+'<circle cx="100" cy="76" r="6" fill="#e0b48c"/>'+
 '<path d="M90 50l6-10M110 50l-6-10M100 46v-12" stroke="#f6c443" stroke-width="2.4" stroke-linecap="round"/>'+
 '<rect x="20" y="88" width="10" height="40" fill="#b8b2a6"/><rect x="170" y="88" width="10" height="40" fill="#b8b2a6"/>');
A.introduce=svg(WALL+FLOOR+
 jun(48,64,{mood:'smile'})+mateo(100,64,{armL:'point',armR:'point',mood:'big'})+paolo(152,64,{mood:'smile'})+
 '<path d="M80 40q-8-10-20-6" stroke="#c0392b" stroke-width="2.4" fill="none" marker-end="none"/><path d="M60 34l2 6 5-4z" fill="#c0392b"/>'+
 '<path d="M120 40q8-10 20-6" stroke="#c0392b" stroke-width="2.4" fill="none"/><path d="M140 34l-2 6-5-4z" fill="#c0392b"/>'+
 bubble(64,4,72,22,T(100,19,'Jun, this is Paolo.',8),'l'));
A.goodbye=svg(SKY+'<rect x="0" y="62" width="200" height="66" fill="#e9d9b6"/><path d="M0 62h200" stroke="#c9b48c" stroke-width="4"/><rect x="132" y="78" width="40" height="50" fill="#6e4528"/><path d="M152 78v50" stroke="#4d2f1b"/>'+
 '<rect x="0" y="128" width="200" height="32" fill="#b8b2a6"/><path d="M0 140h200" stroke="#a39d91"/>'+clock(30,82,10,15,15)+
 '<g transform="translate(150 66) scale(.82)">'+amira(0,0,{armR:'up',mood:'big'})+'</g>'+
 linh(64,70,{armL:'up',mood:'smile'})+'<path d="M40 40q-4-6 0-12M34 44q-6-8 0-18M176 38q4-6 0-12M182 42q6-8 0-18" stroke="#8a6d3b" stroke-width="1.6" fill="none"/>'+
 '<path d="M98 108h24l-6-6M122 108l-6 6" stroke="#c0392b" stroke-width="2.4" fill="none"/>');
A.goodmorning=svg('<rect width="200" height="160" fill="#ffe8c2"/><circle cx="40" cy="70" r="26" fill="#f6c443"/>'+[0,1,2,3,4,5,6,7].map(function(i){var q=i*Math.PI/4;return '<path d="M'+(40+Math.cos(q)*32)+' '+(70+Math.sin(q)*32)+'L'+(40+Math.cos(q)*42)+' '+(70+Math.sin(q)*42)+'" stroke="#f2a93b" stroke-width="3" stroke-linecap="round"/>';}).join('')+
 '<rect x="0" y="96" width="200" height="64" fill="#9cc58a"/><path d="M0 96q50-14 100 0t100 0" fill="#86b374"/>'+'<rect x="0" y="128" width="200" height="32" fill="#b8b2a6"/>'+
 clock(176,24,13,7,30)+mateo(150,64,{armR:'up',mood:'big'})+'<rect x="138" y="80" width="10" height="16" rx="2" fill="#c0504d"/>'+
 bubble(78,20,60,20,T(108,34,'Morning!',9),'r'));
A.friendly=svg('<rect width="200" height="160" fill="#f6efe0"/><path d="M100 8v144" stroke="'+INK+'" stroke-width="2" stroke-dasharray="4 4"/>'+
 '<rect x="6" y="8" width="88" height="144" rx="8" fill="#e8f5ec"/><rect x="106" y="8" width="88" height="144" rx="8" fill="#f8e6e3"/>'+
 kid(50,66,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#2f6fbd',pants:'#2c2f3a',armR:'up',mood:'big'})+heart(74,30,.8)+heart(26,40,.6)+
 kid(150,66,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#5b6b7c',pants:'#2c2f3a',mood:'sad'})+'<path d="M140 44l7 3M160 44l-7 3" stroke="'+INK+'" stroke-width="2"/>'+
 '<path d="M170 30q6 4 0 8q-6 4 0 8" stroke="#888" stroke-width="2" fill="none"/>'+CHECK(84,140)+XM(184,140));
A.shakehands=svg(WALL+'<rect x="20" y="20" width="160" height="80" rx="6" fill="#efe6cf" stroke="#d8c6a4" stroke-width="2"/>'+
 '<path d="M0 104h70q14-2 22 6l12 6q6 4 0 8l-10-2" fill="#d9a27a" stroke="#8d5a3b" stroke-width="1.6"/><path d="M0 98h66v12H0z" fill="#2f6fbd"/>'+
 '<path d="M200 104h-70q-14-2-22 6l-12 6q-4 6 4 8h16q10 0 16-6" fill="#f0c8a4" stroke="#b98a58" stroke-width="1.6"/><path d="M200 98h-64v12h64z" fill="#d9567f"/>'+
 '<path d="M96 112q6-4 12-2M98 118q6-4 12-2M100 124q6-4 10-2" stroke="#8d5a3b" stroke-width="1.4" fill="none"/>'+
 '<path d="M86 86l-6-10M100 82v-12M114 86l6-10" stroke="#f6c443" stroke-width="2.6" stroke-linecap="round"/>'+FLOOR);
A.wave=svg(SKY+'<rect x="0" y="96" width="200" height="64" fill="#8fbf74"/><rect x="0" y="128" width="200" height="32" fill="#b8b2a6"/>'+
 '<rect x="120" y="48" width="70" height="80" fill="#e9d9b6"/><rect x="140" y="88" width="22" height="40" fill="#6e4528"/>'+win(128,58,20,18)+win(166,58,18,18)+
 paolo(60,66,{armR:'up',mood:'big'})+'<path d="M84 22q6 4 6 12M90 18q8 6 8 18M80 28q4 2 4 6" stroke="'+INK+'" stroke-width="2" fill="none" stroke-linecap="round"/>'+
 '<g transform="translate(150 84) scale(.6)">'+linh(0,0,{armL:'up',mood:'big'})+'</g>');
A.smile=svg('<rect width="200" height="160" fill="#fff4cc"/>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){var q=i*Math.PI/6;return '<path d="M'+(100+Math.cos(q)*62)+' '+(80+Math.sin(q)*62)+'L'+(100+Math.cos(q)*76)+' '+(80+Math.sin(q)*76)+'" stroke="#f2c94c" stroke-width="4" stroke-linecap="round"/>';}).join('')+
 '<circle cx="100" cy="80" r="52" fill="#e0ac7e"/><path d="M50 70q0-46 50-46t50 46q-10-22-50-26q-40 4-50 26z" fill="#2a1f1a"/>'+
 '<ellipse cx="80" cy="74" rx="5" ry="6" fill="'+INK+'"/><ellipse cx="120" cy="74" rx="5" ry="6" fill="'+INK+'"/><circle cx="82" cy="72" r="1.6" fill="#fff"/><circle cx="122" cy="72" r="1.6" fill="#fff"/>'+
 '<path d="M72 64q8-6 16 0M112 64q8-6 16 0" stroke="#2a1f1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
 '<path d="M74 94q26 26 52 0z" fill="#8c2f39"/><path d="M78 95q22 8 44 0" fill="#fff"/><path d="M70 92q-4-2-6 2M130 92q4-2 6 2" stroke="'+INK+'" stroke-width="2" fill="none"/>'+
 '<circle cx="66" cy="90" r="7" fill="#e07a5f" opacity=".35"/><circle cx="134" cy="90" r="7" fill="#e07a5f" opacity=".35"/>');
A.firstname=svg(WALL+FLOOR+'<rect x="18" y="30" width="164" height="70" rx="6" fill="#fff" stroke="#8a6d3b" stroke-width="2.5"/>'+
 '<rect x="26" y="40" width="70" height="26" rx="4" fill="#ffd45c" stroke="#c9862a" stroke-width="2.5"/>'+T(61,58,'Amira',13)+
 '<rect x="104" y="40" width="70" height="26" rx="4" fill="#fff" stroke="#c8c2b2" stroke-width="1.5"/>'+T(139,58,'Saleh',13,'#a8a294')+
 '<path d="M61 70v12" stroke="#c9862a" stroke-width="3"/><path d="M55 78l6 8 6-8" fill="#c9862a"/>'+T(61,96,'1',12,'#c9862a')+
 '<g transform="translate(176 22) scale(.6)">'+amira(0,0,{mood:'smile',armL:'point'})+'</g>');
A.lastname=svg(WALL+FLOOR+'<rect x="18" y="30" width="164" height="70" rx="6" fill="#fff" stroke="#8a6d3b" stroke-width="2.5"/>'+
 '<rect x="26" y="40" width="70" height="26" rx="4" fill="#fff" stroke="#c8c2b2" stroke-width="1.5"/>'+T(61,58,'Amira',13,'#a8a294')+
 '<rect x="104" y="40" width="70" height="26" rx="4" fill="#8fd0c4" stroke="#1f8a7e" stroke-width="2.5"/>'+T(139,58,'Saleh',13)+
 '<path d="M139 70v12" stroke="#1f8a7e" stroke-width="3"/><path d="M133 78l6 8 6-8" fill="#1f8a7e"/>'+T(139,96,'2',12,'#1f8a7e')+
 '<g fill="#d9a27a"><circle cx="30" cy="112" r="6"/><circle cx="46" cy="110" r="7"/><circle cx="62" cy="112" r="6"/></g><path d="M22 128q8-12 16 0M38 128q8-14 16 0M54 128q8-12 16 0" fill="#5b8a72"/>');
A.welcome=svg(HALL+'<rect x="10" y="8" width="180" height="26" rx="3" fill="#c0392b"/><path d="M10 34l8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6 8-6" fill="#a42f23"/>'+T(100,26,'WELCOME!',14,'#fff')+
 '<circle cx="20" cy="46" r="7" fill="#f2c94c"/><path d="M20 53q-2 10 2 16" stroke="#999" fill="none"/><circle cx="180" cy="48" r="7" fill="#3c6ea8"/><path d="M180 55q2 10-2 16" stroke="#999" fill="none"/>'+TILE+
 door(84,56,'','#6e4528')+jun(46,70,{armL:'up',armR:'out',mood:'big'})+linh(150,70,{mood:'o'})+'<rect x="158" y="80" width="12" height="16" rx="2" fill="#3c6ea8"/>');

/* ======================= Lesson 3 · From A to Z ======================= */
var ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
A.alphabet=svg(WALL+'<rect x="6" y="6" width="188" height="84" fill="#fffdf4" stroke="#8a6d3b" stroke-width="3"/>'+
 ABC.split('').map(function(l,i){var c=['#c0392b','#e0a83a','#2e8b57','#3c6ea8','#864D9E'][i%5],x=12+(i%9)*20.5,y=12+Math.floor(i/9)*25;return '<rect x="'+x+'" y="'+y+'" width="18" height="21" rx="3" fill="'+c+'"/>'+T(x+9,y+16,l,13,'#fff');}).join('')+
 FLOOR+T(46,150,'26',18,'#c0392b')+'<g transform="translate(150 112) scale(.55)">'+linh(0,0,{armL:'point',mood:'big'})+'</g>');
A.letter=svg('<rect width="200" height="160" fill="#eaf2f7"/>'+FLOOR+
 '<rect x="56" y="10" width="88" height="104" rx="12" fill="#3c6ea8"/><rect x="62" y="16" width="76" height="92" rx="9" fill="#5b8fcf"/>'+
 '<path d="M76 98L100 24l24 74M84 74h32" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
 '<path d="M76 98L100 24l24 74M84 74h32" stroke="#ffd45c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="2 6"/>'+
 '<g opacity=".95"><rect x="8" y="94" width="34" height="34" rx="6" fill="#e0a83a"/>'+T(25,120,'b',22,'#fff')+'<rect x="158" y="94" width="34" height="34" rx="6" fill="#2e8b57"/>'+T(175,120,'c',22,'#fff')+'</g>'+
 '<g transform="translate(166 20)">'+XM(0,22)+'<rect x="-18" y="-10" width="30" height="20" fill="#fff" stroke="#999"/><path d="M-18-10l15 11 15-11" stroke="#999" fill="none"/></g>');
A.uppercase=svg(WALL+'<rect x="16" y="14" width="168" height="98" rx="8" fill="#fff" stroke="#8a6d3b" stroke-width="2.5"/>'+
 '<path d="M24 92h152M24 40h152" stroke="#e06c75" stroke-width="1.4"/><path d="M24 66h152" stroke="#9ec2d6" stroke-width="1.4" stroke-dasharray="4 4"/>'+
 T(54,92,'A',56,'#c0392b')+T(100,92,'B',56,'#3c6ea8')+T(146,92,'C',56,'#2e8b57')+
 '<path d="M30 40v52" stroke="#c0392b" stroke-width="2"/><path d="M26 44l4-6 4 6M26 88l4 6 4-6" fill="#c0392b"/>'+FLOOR+
 '<rect x="70" y="118" width="60" height="18" rx="4" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(100,131,'BIG',10,'#8a5a10'));
A.lowercase=svg(WALL+'<rect x="16" y="14" width="168" height="98" rx="8" fill="#fff" stroke="#8a6d3b" stroke-width="2.5"/>'+
 '<path d="M24 92h152M24 40h152" stroke="#e06c75" stroke-width="1.4"/><path d="M24 66h152" stroke="#9ec2d6" stroke-width="1.4" stroke-dasharray="4 4"/>'+
 T(54,92,'a',46,'#c0392b')+T(100,92,'b',46,'#3c6ea8')+T(146,92,'c',46,'#2e8b57')+
 '<path d="M172 66v26" stroke="#2e8b57" stroke-width="2"/><path d="M168 70l4-6 4 6M168 88l4 6 4-6" fill="#2e8b57"/>'+FLOOR+
 '<rect x="78" y="120" width="44" height="14" rx="4" fill="#bfe8cf" stroke="#2e8b57" stroke-width="2"/>'+T(100,131,'small',8.5,'#1e5e3a'));
A.vowel=svg('<rect width="200" height="160" fill="#f6efe0"/>'+
 ['a','e','i','o','u'].map(function(l,i){var x=12+i*36;return '<circle cx="'+(x+16)+'" cy="44" r="17" fill="#c0392b" stroke="#8a1c12" stroke-width="2"/>'+T(x+16,52,l,22,'#fff');}).join('')+
 '<path d="M10 70h180" stroke="#8a6d3b" stroke-width="2" stroke-dasharray="3 4"/>'+
 ['b','c','d','f','g','h','k','m','p','s','t'].map(function(l,i){var x=12+i*16.5;return '<rect x="'+x+'" y="80" width="14" height="18" rx="3" fill="#cfd6df"/>'+T(x+7,94,l,11,'#5d6170');}).join('')+
 FLOOR+'<g transform="translate(100 96) scale(.62)">'+amira(0,0,{mood:'o',armL:'up',armR:'up'})+'</g>'+
 '<path d="M86 108q-6-4-10 0M114 108q6-4 10 0" stroke="#c0392b" stroke-width="2" fill="none"/>');
A.spell=svg(WALL+FLOOR+linh(46,66,{mood:'big',armR:'out'})+
 bubble(74,10,120,34,['L','–','I','–','N','–','H'].map(function(c,i){return T(86+i*15,33,c,c==='–'?10:15,c==='–'?'#999':['#c0392b','','#e0a83a','','#2e8b57','','#3c6ea8'][i]);}).join(''),'l')+
 '<rect x="96" y="66" width="80" height="40" rx="4" fill="#fff" stroke="#8a6d3b" stroke-width="2"/><path d="M104 96h64" stroke="#9ec2d6"/>'+T(136,92,'Linh',18)+
 '<rect x="168" y="82" width="5" height="26" fill="#f2c94c" transform="rotate(25 170 95)"/>');
A.word=svg(WALL+FLOOR+'<rect x="10" y="40" width="180" height="56" rx="10" fill="#fff" stroke="#8a6d3b" stroke-width="2.5"/>'+
 ['c','a','t'].map(function(l,i){return '<rect x="'+(30+i*30)+'" y="52" width="26" height="32" rx="4" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(43+i*30,76,l,22);}).join('')+
 '<path d="M30 90h86" stroke="#c0392b" stroke-width="3"/><path d="M28 86v8M118 86v8" stroke="#c0392b" stroke-width="3"/>'+T(140,76,'=',22,'#c0392b')+
 '<g transform="translate(168 70)"><ellipse cx="0" cy="8" rx="13" ry="10" fill="#e0a83a"/><circle cx="0" cy="-6" r="9" fill="#e0a83a"/><path d="M-8-12l2-8 5 6M8-12l-2-8-5 6" fill="#e0a83a"/><circle cx="-3" cy="-7" r="1.4" fill="'+INK+'"/><circle cx="3" cy="-7" r="1.4" fill="'+INK+'"/><path d="M-2-3h4l-2 2z" fill="#c0392b"/><path d="M12 12q8-2 6-12" stroke="#e0a83a" stroke-width="3" fill="none"/><path d="M-6-3h-8M6-3h8" stroke="#8a5a10" stroke-width=".8"/></g>');
A.notebook=svg('<rect width="200" height="160" fill="#efe3c8"/><rect x="0" y="118" width="200" height="42" fill="#a77b4f"/><path d="M0 126h200" stroke="#8d6440"/>'+shadow(100,124,70)+
 '<rect x="34" y="18" width="132" height="102" rx="4" fill="#3c6ea8"/><rect x="40" y="20" width="124" height="96" rx="3" fill="#fffdf6"/>'+
 [0,1,2,3,4,5,6,7].map(function(i){return '<path d="M44 '+(34+i*10)+'h116" stroke="#9ec2d6" stroke-width="1.2"/>';}).join('')+'<path d="M58 22v92" stroke="#e06c75" stroke-width="1.4"/>'+
 [0,1,2,3,4,5,6,7,8,9].map(function(i){return '<circle cx="40" cy="'+(26+i*9.5)+'" r="3.6" fill="none" stroke="#888" stroke-width="1.8"/>';}).join('')+
 '<path d="M64 42q6-6 10 0t10 0 10 0M64 52q8-6 14 0t12 0M64 62q6-5 12 0t12-2 12 2" stroke="#2b2d42" stroke-width="1.6" fill="none"/>'+T(110,82,'Chris',12,'#2f5d47','start')+
 '<rect x="146" y="64" width="6" height="40" fill="#f2c94c" transform="rotate(20 149 84)"/><path d="M152 103l-4 8 8-4z" fill="#e8c9a0" transform="rotate(20 149 84)"/>');
A.write=svg(WALL+FLOOR+desk(30,92,140)+
 '<rect x="70" y="80" width="62" height="14" rx="1" fill="#fbfbf8" stroke="#8a8f99" transform="rotate(-4 100 87)"/><path d="M76 86h22M76 90h40" stroke="#6a8fd1" stroke-width="1.2" transform="rotate(-4 100 87)"/>'+
 mateo(104,56,{armR:'out',armL:'heart',mood:'smile'})+'<rect x="122" y="66" width="4" height="22" fill="#f2c94c" transform="rotate(35 124 77)"/>'+
 '<path d="M102 82q6-4 10 0q4 4 10 0" stroke="'+INK+'" stroke-width="1.6" fill="none"/><path d="M134 76l6-4M136 82l8 0" stroke="#e0a83a" stroke-width="2" stroke-linecap="round"/>');
A.repeat=svg(WALL+FLOOR+jun(44,66,{mood:'o',armR:'out'})+paolo(156,66,{mood:'smile',armL:'out'})+
 bubble(66,6,70,24,T(101,22,'Again?',11),'l')+
 '<path d="M80 60a20 20 0 1 1 40 0" stroke="#3c6ea8" stroke-width="4" fill="none"/><path d="M116 52l6 10 6-10z" fill="#3c6ea8"/>'+
 '<path d="M120 76a20 20 0 1 1 -40 0" stroke="#e0a83a" stroke-width="4" fill="none"/><path d="M84 84l-6-10-6 10z" fill="#e0a83a"/>'+T(100,74,'2×',12,'#c0392b'));
A.slowly=svg('<rect width="200" height="160" fill="#f6efe0"/><path d="M100 8v144" stroke="'+INK+'" stroke-width="2" stroke-dasharray="4 4"/>'+
 '<rect x="6" y="8" width="88" height="144" rx="8" fill="#e8f5ec"/><rect x="106" y="8" width="88" height="144" rx="8" fill="#f8e6e3"/>'+
 '<path d="M14 118h72" stroke="#86b374" stroke-width="6"/><g transform="translate(50 102)"><ellipse cx="0" cy="0" rx="22" ry="14" fill="#6f9f5c"/><path d="M-14-4l8-6 10 2 8 6-6 6-10-2z" fill="#4f7d42"/><circle cx="26" cy="-2" r="7" fill="#9cc58a"/><circle cx="28" cy="-4" r="1.4" fill="'+INK+'"/><path d="M-16 10v6M16 10v6M-6 12v6M6 12v6" stroke="#9cc58a" stroke-width="4" stroke-linecap="round"/></g>'+
 T(50,50,'A · B · C',11,'#2e8b57')+'<path d="M26 60h48" stroke="#2e8b57" stroke-width="1.4" stroke-dasharray="2 4"/>'+
 '<path d="M114 118h72" stroke="#c9a77c" stroke-width="6"/><g transform="translate(150 98)"><ellipse cx="0" cy="0" rx="16" ry="11" fill="#c9a07a"/><circle cx="16" cy="-8" r="8" fill="#c9a07a"/><path d="M14-16l-2-16 5 2 1 14M20-16l2-14 4 4-3 12" fill="#c9a07a"/><circle cx="19" cy="-9" r="1.4" fill="'+INK+'"/><path d="M-14 8l-6 10M10 8l8 8" stroke="#c9a07a" stroke-width="4" stroke-linecap="round"/></g>'+
 '<path d="M118 92h-8M120 100h-10M118 108h-8" stroke="#888" stroke-width="2"/>'+T(150,50,'ABC!!',12,'#c0392b')+CHECK(84,140)+XM(184,140));
A.sentence=svg(WALL+board(8,14,184,64,[],10)+
 T(18,44,'My',13,'#ffd45c','start')+T(42,44,'name',13,'#f4f1e6','start')+T(80,44,'is',13,'#f4f1e6','start')+T(96,44,'Linh',13,'#f4f1e6','start')+T(126,44,'.',16,'#ff8f7a','start')+
 '<path d="M18 52h24" stroke="#ffd45c" stroke-width="2"/><circle cx="128" cy="40" r="5" fill="none" stroke="#ff8f7a" stroke-width="2"/>'+
 T(18,68,'capital',8,'#ffd45c','start')+T(118,68,'period',8,'#ff8f7a','start')+FLOOR+
 adult(166,82,{skin:'#f0c8a4',hair:'#8a8a86',shirt:'#3d5a80',glasses:true,armL:'point',mood:'smile'}));

/* ======================= Lesson 4 · 0 to 100 ======================= */
A.number=svg('<rect width="200" height="160" fill="#eaf2f7"/>'+
 [['7','#c0392b',34,46,-8],['42','#3c6ea8',100,40,4],['3','#2e8b57',164,52,10],['100','#864D9E',62,104,-4],['15','#e0a83a',142,108,6]].map(function(n){return '<g transform="rotate('+n[4]+' '+n[2]+' '+n[3]+')"><rect x="'+(n[2]-26)+'" y="'+(n[3]-22)+'" width="52" height="40" rx="8" fill="'+n[1]+'"/>'+T(n[2],n[3]+9,n[0],n[0].length>2?20:26,'#fff')+'</g>';}).join(''));
A.count=svg(WALL+FLOOR+'<g>'+[0,1,2,3,4].map(function(i){return '<g transform="translate('+(28+i*30)+' 100)"><circle r="11" fill="#f2b33d"/><path d="M-6-2q6 6 12 0" stroke="#c9862a" fill="none"/><circle cx="-4" cy="-3" r="1.3" fill="'+INK+'"/><circle cx="4" cy="-3" r="1.3" fill="'+INK+'"/></g>'+T(28+i*30,82,String(i+1),13,'#c0392b');}).join('')+'</g>'+
 '<path d="M14 116h152" stroke="#e0a83a" stroke-width="2" stroke-dasharray="3 3"/>'+
 '<g transform="translate(176 54)"><path d="M-8 28v-26q0-6 4-6t4 6v-8q0-6 4-6t4 6v14" fill="#e0ac7e" stroke="#a7744c"/><path d="M-12 30h22l2-12q0-6-6-6h-14z" fill="#e0ac7e" stroke="#a7744c"/></g>'+
 bubble(16,14,120,30,T(76,34,'1, 2, 3, 4, 5…',13),'r'));
A.howmany=svg(WALL+FLOOR+'<rect x="20" y="70" width="110" height="58" fill="#b98a58"/><rect x="16" y="66" width="118" height="6" fill="#d0a66f"/>'+
 [0,1,2,3,4,5].map(function(i){var x=30+(i%3)*32,y=78+Math.floor(i/3)*24;return '<rect x="'+x+'" y="'+y+'" width="24" height="18" rx="2" fill="'+['#c0504d','#3c6ea8','#2e8b57','#e0a83a','#864D9E','#e07a5f'][i]+'"/><rect x="'+(x+3)+'" y="'+(y+4)+'" width="18" height="3" fill="#fff" opacity=".6"/>';}).join('')+
 amira(166,62,{mood:'o',armL:'point'})+'<path d="M136 18q12-16 30-6q14 10 0 18q-8 4-20 2l-8 6 2-8q-10-4-4-12z" fill="#fff" stroke="'+INK+'" stroke-width="1.5"/>'+T(154,30,'?',16,'#c0392b'));
A.zero=svg('<rect width="200" height="160" fill="#f6efe0"/><rect x="0" y="118" width="200" height="42" fill="#a77b4f"/>'+shadow(70,124,44)+
 '<path d="M30 70h80l-8 52H38z" fill="#d9e6ef" stroke="#7a8e9e" stroke-width="2.5"/><ellipse cx="70" cy="70" rx="40" ry="9" fill="#eef4f8" stroke="#7a8e9e" stroke-width="2.5"/><ellipse cx="70" cy="72" rx="34" ry="6" fill="#c9d8e3"/>'+
 '<path d="M64 40q6-10 12 0M58 30q12-16 24 0" stroke="#9aa" stroke-width="1.6" fill="none" opacity=".7"/>'+
 '<ellipse cx="156" cy="72" rx="28" ry="38" fill="none" stroke="#c0392b" stroke-width="14"/><ellipse cx="156" cy="72" rx="28" ry="38" fill="none" stroke="#e8735f" stroke-width="4"/>');
A.ten=svg('<rect width="200" height="160" fill="#eaf2f7"/>'+
 '<g transform="translate(18 26)"><path d="M10 70V20q0-6 6-6t6 6v26M22 46V10q0-6 6-6t6 6v36M34 46V12q0-6 6-6t6 6v34M46 46V20q0-6 6-6t6 6v32" fill="#e0ac7e" stroke="#a7744c" stroke-width="1.6"/><path d="M4 58q-6-14 6-20l4 8M4 58q4 30 34 30t26-36" fill="#e0ac7e" stroke="#a7744c" stroke-width="1.6"/></g>'+
 '<g transform="translate(118 26) scale(-1 1) translate(-64 0)"><path d="M10 70V20q0-6 6-6t6 6v26M22 46V10q0-6 6-6t6 6v36M34 46V12q0-6 6-6t6 6v34M46 46V20q0-6 6-6t6 6v32" fill="#c98e62" stroke="#8d5a3b" stroke-width="1.6"/><path d="M4 58q-6-14 6-20l4 8M4 58q4 30 34 30t26-36" fill="#c98e62" stroke="#8d5a3b" stroke-width="1.6"/></g>'+
 '<rect x="70" y="122" width="60" height="30" rx="8" fill="#3c6ea8"/>'+T(100,145,'10',22,'#fff'));
A.hundred=svg('<rect width="200" height="160" fill="#f6efe0"/><rect x="30" y="8" width="140" height="140" fill="#fff" stroke="#8a6d3b" stroke-width="2"/>'+
 (function(){var s='';for(var r=0;r<10;r++)for(var c=0;c<10;c++){var n=r*10+c+1;s+='<rect x="'+(33+c*13.4)+'" y="'+(11+r*13.4)+'" width="12" height="12" rx="1.5" fill="'+(n===100?'#c0392b':(c===9?'#ffd45c':'#dfe9f5'))+'"/>';}return s;})()+
 T(161,143,'100',6.5,'#fff')+'<rect x="0" y="148" width="200" height="12" fill="#a77b4f"/>');
A.largest=svg('<rect width="200" height="160" fill="#eaf2f7"/>'+FLOOR+
 [[30,18,'12'],[78,40,'47'],[132,68,'95']].map(function(b,i){return '<rect x="'+(b[0]-16)+'" y="'+(128-b[1]-30)+'" width="'+(32+i*6)+'" height="'+(b[1]+30)+'" rx="4" fill="'+(i===2?'#2e8b57':'#a9b7c6')+'"/>'+T(b[0]+i*3,128-b[1]-36,b[2],i===2?20:14,i===2?'#1e5e3a':'#5d6170');}).join('')+
 '<path d="M178 6l5 10 11 1-8 7 2 11-10-5-10 5 2-11-8-7 11-1z" fill="#f6c443" stroke="#c9862a"/>');
A.smallest=svg('<rect width="200" height="160" fill="#eaf2f7"/>'+FLOOR+
 [[34,8,'3'],[86,40,'47'],[140,70,'95']].map(function(b,i){return '<rect x="'+(b[0]-16)+'" y="'+(128-b[1]-30)+'" width="32" height="'+(b[1]+30)+'" rx="4" fill="'+(i===0?'#e07a5f':'#a9b7c6')+'"/>'+T(b[0],128-b[1]-36,b[2],i===0?20:14,i===0?'#a33f2a':'#5d6170');}).join('')+
 '<path d="M34 42v14" stroke="#c0392b" stroke-width="3"/><path d="M28 54l6 8 6-8" fill="#c0392b"/><circle cx="34" cy="28" r="10" fill="none" stroke="#c0392b" stroke-width="2.4" stroke-dasharray="3 3"/>');
A.clock=svg(WALL+clock(100,62,44,8,40)+
 '<path d="M64 20l-12-10M136 20l12-10" stroke="#3a3f4a" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="8" r="7" fill="#c0392b"/><circle cx="150" cy="8" r="7" fill="#c0392b"/><path d="M76 106l-8 12M124 106l8 12" stroke="#3a3f4a" stroke-width="5" stroke-linecap="round"/>'+FLOOR+
 '<rect x="62" y="132" width="76" height="20" rx="5" fill="#2b2d42"/>'+T(100,147,'8:40',14,'#7ef0a0'));
A.page=svg('<rect width="200" height="160" fill="#efe3c8"/><rect x="0" y="118" width="200" height="42" fill="#a77b4f"/>'+shadow(100,124,86)+
 '<path d="M100 30q-36-14-84-6v94q48-8 84 6z" fill="#fbf7ec" stroke="#8a7a5a" stroke-width="1.6"/><path d="M100 30q36-14 84-6v94q-48-8-84 6z" fill="#fffdf6" stroke="#8a7a5a" stroke-width="1.6"/>'+
 '<path d="M100 30q30-30 60-14v86q-30-12-60 26z" fill="#fff" stroke="#8a7a5a" stroke-width="1.4" opacity=".95"/>'+
 '<path d="M26 44q30-4 64 2M26 54q30-4 64 2M26 64q30-4 64 2M26 74q30-4 50 2" stroke="#9a9a9a" stroke-width="2" fill="none"/>'+
 '<circle cx="46" cy="108" r="11" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(46,112,'40',10)+'<circle cx="168" cy="108" r="11" fill="#fff" stroke="#c8c2b2"/>'+T(168,112,'41',10,'#a8a294'));
A.room=svg(HALL+door(82,40,'258','#6e4528')+'<rect x="20" y="40" width="44" height="40" fill="#fff8e6" stroke="#8a6d3b" stroke-width="2"/>'+T(42,58,'Room',9)+T(42,72,'258',12,'#c0392b')+
 '<path d="M64 60h14" stroke="#c0392b" stroke-width="2.4"/><path d="M74 55l6 5-6 5" fill="#c0392b"/>'+TILE+
 '<rect x="140" y="40" width="50" height="30" fill="#bcd7e8" stroke="#7a5b3a" stroke-width="2"/><path d="M146 64h38M146 56h30" stroke="#7a5b3a"/>'+
 '<g transform="translate(150 78) scale(.75)">'+mateo(0,0,{armL:'point',mood:'smile'})+'</g>');
A.bell=svg(HALL+TILE+'<rect x="70" y="12" width="60" height="10" fill="#7a7f8a"/><path d="M100 22v8" stroke="#555" stroke-width="3"/>'+
 '<path d="M72 74q0-44 28-44t28 44l8 8H64z" fill="#c0392b" stroke="#8a1c12" stroke-width="2"/><ellipse cx="100" cy="82" rx="36" ry="6" fill="#8a1c12"/><circle cx="100" cy="90" r="6" fill="#555"/>'+
 '<path d="M52 44q-8 12 0 24M42 38q-12 18 0 36M148 44q8 12 0 24M158 38q12 18 0 36" stroke="#e0a83a" stroke-width="3" fill="none" stroke-linecap="round"/>'+
 clock(30,34,13,8,40)+'<g transform="translate(176 76) scale(.6)">'+jun(0,0,{mood:'o',armL:'up',armR:'up'})+'</g>');

/* ======================= Lesson 5 · About Me ======================= */
A.country=svg('<rect width="200" height="160" fill="#dfeef7"/><circle cx="100" cy="82" r="62" fill="#5b9bd5"/>'+
 '<path d="M60 40q16-6 22 6t-6 20q-8 4-6 14q4 12-6 16q-12-8-16-24q-2-18 12-32z" fill="#8cc06a"/><path d="M104 32q20-4 34 6q10 12 4 22q-14 2-18 12q-8 2-14-6q-14-4-12-18t6-16z" fill="#8cc06a"/>'+
 '<path d="M118 82q14-4 22 6q4 14-6 24q-12 6-18-4q-8-12 2-26z" fill="#8cc06a"/><path d="M70 104q8-2 12 6l-4 12q-8 0-10-8z" fill="#8cc06a"/>'+
 '<path d="M118 82q14-4 22 6q4 14-6 24q-12 6-18-4q-8-12 2-26z" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="4 3"/>'+
 '<path d="M128 70q0-12 10-12t10 12q0 8-10 20q-10-12-10-20z" fill="#c0392b" stroke="#8a1c12" stroke-width="1.5"/><circle cx="138" cy="70" r="4" fill="#fff"/>'+
 '<ellipse cx="100" cy="150" rx="40" ry="5" fill="#000" opacity=".12"/><circle cx="100" cy="82" r="62" fill="none" stroke="#2c5d8a" stroke-width="2"/>');
A.language=svg(WALL+FLOOR+amira(100,70,{mood:'big'})+
 bubble(4,6,58,26,T(33,24,'Hello',11),'r')+bubble(140,6,56,26,T(168,25,'مرحبا',12),'l')+
 bubble(4,44,56,26,T(32,62,'你好',13),'r')+bubble(142,44,54,26,T(169,62,'Hola',11),'l')+
 '<path d="M86 30q14-10 28 0" stroke="#e0a83a" stroke-width="2" fill="none"/>');
A.yearsold=svg('<rect width="200" height="160" fill="#fdeef3"/><path d="M0 12l20 14 20-14 20 14 20-14 20 14 20-14 20 14 20-14 20 14 20-14" stroke="#e07a5f" stroke-width="2" fill="none"/>'+
 '<rect x="0" y="128" width="200" height="32" fill="#c9a77c"/><ellipse cx="100" cy="128" rx="74" ry="8" fill="#e8e1d4"/>'+
 '<rect x="40" y="82" width="120" height="44" rx="6" fill="#f7c6d6"/><rect x="40" y="82" width="120" height="10" rx="5" fill="#fff"/><path d="M40 104q10 6 20 0t20 0 20 0 20 0 20 0 20 0" stroke="#e07a5f" stroke-width="3" fill="none"/>'+
 '<rect x="72" y="46" width="12" height="36" rx="2" fill="#3c6ea8"/><rect x="72" y="50" width="12" height="4" fill="#fff"/><rect x="72" y="60" width="12" height="4" fill="#fff"/><path d="M78 46q-6-8 0-14q6 6 0 14z" fill="#f2b33d"/>'+
 '<rect x="112" y="46" width="12" height="36" rx="2" fill="#2e8b57"/><rect x="112" y="50" width="12" height="4" fill="#fff"/><rect x="112" y="60" width="12" height="4" fill="#fff"/><path d="M118 46q-6-8 0-14q6 6 0 14z" fill="#f2b33d"/>'+
 T(78,78,'1',12,'#fff')+T(118,78,'6',12,'#fff')+'<circle cx="20" cy="70" r="10" fill="#f2c94c"/><path d="M20 80q2 14-2 30" stroke="#999" fill="none"/><circle cx="182" cy="60" r="10" fill="#9fc1e6"/><path d="M182 70q-2 14 2 30" stroke="#999" fill="none"/>');
A.share=svg(WALL+FLOOR+linh(54,66,{armR:'out',mood:'big'})+jun(146,66,{armL:'out',mood:'big'})+
 '<path d="M80 80h20l-2 10H82z" fill="#e9c46a" stroke="#b07a2a"/><path d="M100 80h20l-2 10h-16z" fill="#e9c46a" stroke="#b07a2a"/><path d="M80 80q20-12 40 0" fill="#f3d999" stroke="#b07a2a"/><path d="M100 72v20" stroke="#c0392b" stroke-width="1.6" stroke-dasharray="2 2"/>'+
 '<path d="M74 50q26-20 52 0" stroke="#e0a83a" stroke-width="2" fill="none"/><path d="M122 44l6 8-10 0z" fill="#e0a83a"/><path d="M78 44l-6 8 10 0z" fill="#e0a83a"/>');
A.go=svg(SKY+'<rect x="0" y="96" width="200" height="64" fill="#8fbf74"/><rect x="0" y="118" width="200" height="22" fill="#b8b2a6"/><path d="M10 129h20M50 129h20M90 129h20M130 129h20M170 129h20" stroke="#fff" stroke-width="2"/>'+
 '<rect x="138" y="52" width="58" height="66" fill="#e9d9b6"/><path d="M134 54l33-18 33 18z" fill="#b9573e"/><rect x="158" y="90" width="18" height="28" fill="#6e4528"/>'+win(142,62,14,14)+win(178,62,14,14)+
 '<g transform="translate(60 64)">'+kid(0,0,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#2f6fbd',pants:'#2c2f3a',mood:'smile',look:'right'})+'</g>'+
 '<rect x="40" y="70" width="12" height="20" rx="3" fill="#c0504d"/>'+
 '<path d="M84 104h40" stroke="#c0392b" stroke-width="5" stroke-linecap="round"/><path d="M120 96l12 8-12 8z" fill="#c0392b"/><path d="M24 104h-10M30 112h-12" stroke="#888" stroke-width="2"/>');
A.bilingual=svg('<rect width="200" height="160" fill="#f6efe0"/>'+FLOOR+
 '<circle cx="100" cy="66" r="40" fill="#e0ac7e"/><path d="M60 60q0-40 40-40t40 40q-8-18-40-22q-32 4-40 22z" fill="#2a1f1a"/>'+
 '<path d="M100 26v80" stroke="#fff" stroke-width="2" stroke-dasharray="3 3" opacity=".7"/>'+
 '<circle cx="86" cy="62" r="3.5" fill="'+INK+'"/><circle cx="114" cy="62" r="3.5" fill="'+INK+'"/><path d="M88 80q12 10 24 0" stroke="'+INK+'" stroke-width="2.4" fill="none"/>'+
 bubble(2,6,56,30,T(30,26,'ABC',14,'#3c6ea8'),'r')+bubble(142,6,56,30,T(170,27,'أ ب ت',13,'#2e8b57'),'l')+
 '<rect x="76" y="110" width="48" height="16" rx="8" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(100,122,'1 + 1',10,'#8a5a10'));
A.partner=svg(WALL+board(56,8,88,30,['Interview'],11)+FLOOR+desk(30,96,140)+
 mateo(70,66,{armR:'out',mood:'o'})+amira(130,66,{armL:'out',mood:'big'})+
 '<rect x="84" y="86" width="32" height="12" rx="1" fill="#fbfbf8" stroke="#8a8f99"/><path d="M88 90h22M88 94h16" stroke="#6a8fd1"/>'+
 
 '<rect x="14" y="70" width="18" height="18" rx="9" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(23,83,'1',10,'#8a5a10')+'<rect x="168" y="70" width="18" height="18" rx="9" fill="#ffd45c" stroke="#c9862a" stroke-width="2"/>'+T(177,83,'2',10,'#8a5a10'));
A.speak=svg(WALL+FLOOR+'<rect x="128" y="82" width="10" height="46" fill="#555"/><ellipse cx="133" cy="128" rx="16" ry="4" fill="#444"/><rect x="124" y="64" width="18" height="22" rx="9" fill="#333"/><path d="M127 70h12M127 75h12M127 80h12" stroke="#777"/>'+
 paolo(86,66,{armR:'out',mood:'big'})+
 '<path d="M150 50q8 8 0 16M158 42q14 16 0 32M166 34q20 24 0 48" stroke="#3c6ea8" stroke-width="3" fill="none" stroke-linecap="round"/>'+
 '<g transform="translate(30 44)">'+[0,1,2].map(function(i){return '<circle cx="'+(i*14)+'" cy="0" r="5" fill="#e0a83a"/>';}).join('')+'</g>');
A.live=svg(SKY+'<rect x="0" y="110" width="200" height="50" fill="#8fbf74"/>'+
 '<rect x="36" y="56" width="92" height="62" fill="#e8cfa6"/><path d="M28 60l54-36 54 36z" fill="#b9573e"/><rect x="104" y="30" width="12" height="20" fill="#8a4a32"/>'+
 '<rect x="70" y="84" width="22" height="34" fill="#6e4528"/><circle cx="88" cy="102" r="2" fill="#d9b44a"/>'+win(44,70,20,18)+win(100,70,20,18)+
 '<rect x="72" y="76" width="18" height="7" rx="1" fill="#fff" stroke="#6d4e32"/>'+T(81,82,'1520',5.5)+
 '<g transform="translate(110 79) scale(.4)">'+kid(0,0,{skin:'#d9a27a',hijab:'#1f8a7e',shirt:'#1f8a7e',pants:'#4a3f55',mood:'big',armL:'up'})+'</g>'+
 '<path d="M82 46q-3 6-1 10" stroke="#ccc" stroke-width="3" fill="none" opacity=".7"/><circle cx="160" cy="98" r="16" fill="#5f9150"/><rect x="158" y="108" width="4" height="12" fill="#6e4528"/>'+
 '<path d="M144 120h40v6h-40z" fill="#b8b2a6"/>'+heart(170,62,.8));
A.family=svg('<rect width="200" height="160" fill="#fdf1d6"/><rect x="40" y="10" width="120" height="30" rx="4" fill="#fff" stroke="#c9a24a" stroke-width="2"/>'+heart(100,16,.9)+FLOOR+
 adult(30,62,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#3d5a80',armR:'out',mood:'smile'})+adult(66,62,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#c95b8a',long:true,armL:'out',armR:'out',mood:'big'})+
 '<g transform="translate(102 82) scale(.8)">'+kid(0,0,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#2f6fbd',pants:'#2c2f3a',armL:'out',armR:'out',mood:'big'})+'</g>'+
 '<g transform="translate(134 92) scale(.66)">'+kid(0,0,{skin:'#c98e62',hair:'#2a1f1a',shirt:'#e0a83a',pants:'#3c4a63',long:true,armL:'out',mood:'big'})+'</g>'+
 adult(170,64,{skin:'#c98e62',hair:'#cfcac0',shirt:'#5b8a72',long:true,glasses:true,armL:'out',mood:'smile'}));
A.city=svg('<rect width="200" height="160" fill="#ffd9b0"/><circle cx="160" cy="40" r="16" fill="#f6a35b"/>'+
 '<path d="M0 100L28 70 44 82 70 60 92 76 110 64 130 80 160 62 200 88V128H0z" fill="#9c8fb5" opacity=".5"/>'+
 '<rect x="10" y="64" width="24" height="64" fill="#5b6b7c"/><rect x="38" y="44" width="20" height="84" fill="#4a5868"/><path d="M84 128L96 20l12 108z" fill="#e8e3d8" stroke="#8a8f99"/><path d="M88 100h16M90 80h12M92 60h8" stroke="#8a8f99"/>'+
 '<rect x="112" y="56" width="26" height="72" fill="#5b6b7c"/><rect x="142" y="76" width="22" height="52" fill="#4a5868"/><rect x="168" y="66" width="26" height="62" fill="#5b6b7c"/><rect x="62" y="74" width="18" height="54" fill="#6f7c8c"/>'+
 (function(){var s='';[[14,70,4,7],[42,50,3,9],[116,62,4,8],[146,82,3,5],[172,72,4,7],[64,80,2,6]].forEach(function(b){for(var c=0;c<b[2];c++)for(var r=0;r<b[3];r++)if((c+r)%3)s+='<rect x="'+(b[0]+c*5)+'" y="'+(b[1]+r*7)+'" width="3" height="4" fill="#ffe08a"/>';});return s;})()+
 '<rect x="0" y="128" width="200" height="32" fill="#7a7f8a"/><path d="M0 142h200" stroke="#fff" stroke-width="2" stroke-dasharray="10 8"/>'+
 '<rect x="20" y="118" width="34" height="12" rx="3" fill="#c0392b"/><circle cx="28" cy="131" r="3" fill="#222"/><circle cx="46" cy="131" r="3" fill="#222"/><rect x="24" y="120" width="8" height="5" fill="#9ec2d6"/>');
A.question=svg(WALL+board(10,10,100,58,['What is your','name?'],11)+'<path d="M96 44h4" stroke="none"/>'+FLOOR+
 '<path d="M158 18q0-12 14-12t14 12q0 9-11 14v8" stroke="#c0392b" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="175" cy="52" r="5" fill="#c0392b"/>'+
 linh(60,86,{armR:'up',mood:'o'})+jun(150,86,{mood:'smile'}));

TM.LP_ART=A;
Object.keys(A).forEach(function(k){if(!TM.ART[k])TM.ART[k]=A[k];});

/* ======================= the sets ======================= */
function W(id,en,sense,def,sent,hl,senseEn,otherEn,seeds){return {id:id,en:en,sense:sense,def:def,sent:sent,hl:hl,art:id,senseEn:senseEn,otherEn:otherEn,seeds:seeds};}
function S(m,c,es,ar,vi,th,ne){return {Mandarin:m,Cantonese:c,Spanish:es,Arabic:ar,Vietnamese:vi,Thai:th,Nepali:ne};}
var BACK='/readings/launch-plus/';

TM.SETS['u1-l1']={title:'Lesson 1 words · People at School', short:'Lesson 1', back:BACK, words:[
 W('principal','principal','the person who leads the whole school','the leader of a school','The principal leads the whole school.','principal',['principal','headmaster','head teacher','director','school director'],['main','chief','capital','loan amount'],
  S([['校长','xiàozhǎng']],[['校長','haau6 zoeng2']],[['director','dee-rek-TOR'],['directora','dee-rek-TOR-a']],[['مدير المدرسة','mudeer al-madrasa'],['مدير','mudeer']],[['hiệu trưởng','hyew troong']],[['ผู้อำนวยการ','phu am-nuay-kan'],['ครูใหญ่','kroo yai']],[['प्रधानाध्यापक','pradhanadhyapak']])),
 W('counselor','counselor','the person who helps you choose your classes','a person at school who helps students with classes and problems','The counselor helps me choose my classes.','counselor',['counselor','counsellor','adviser','advisor','consultant','guidance counselor','tutor'],['lawyer','attorney','councilor','council member'],
  S([['辅导员','fǔdǎoyuán'],['辅导老师','fǔdǎo lǎoshī']],[['輔導員','fu6 dou6 jyun4'],['社工','se5 gung1']],[['consejero','kon-seh-HEH-ro'],['consejera','kon-seh-HEH-ra']],[['مرشد','murshid'],['مستشار','mustashaar']],[['cố vấn','co vun'],['tư vấn viên','tur vun vyen']],[['ครูแนะแนว','kroo nae-naeo']],[['परामर्शदाता','paramarshadata']])),
 W('nurse','nurse','the person who helps sick students at school','a person who takes care of sick people','The nurse helps sick students.','nurse',['nurse','nursing'],['breastfeed','feed a baby','nanny'],
  S([['护士','hùshi']],[['護士','wu6 si6']],[['enfermero','en-fehr-MEH-ro'],['enfermera','en-fehr-MEH-ra']],[['ممرضة','mumarrida'],['ممرض','mumarrid']],[['y tá','ee ta']],[['พยาบาล','pha-ya-baan']],[['नर्स','nars']])),
 W('librarian','librarian','the person who works in the library','a person who helps you find books in a library','The librarian helps me find a book.','librarian',['librarian','library administrator','library manager'],['bookseller','book store'],
  S([['图书管理员','túshū guǎnlǐyuán']],[['圖書館管理員','tou4 syu1 gun2 gun2 lei5 jyun4']],[['bibliotecario','bee-blyo-teh-KAR-yo'],['bibliotecaria','bee-blyo-teh-KAR-ya']],[['أمين المكتبة','ameen al-maktaba']],[['thủ thư','too tur']],[['บรรณารักษ์','ban-na-rak']],[['पुस्तकालयाध्यक्ष','pustakalayadhyaksha']])),
 W('securityguard','security guard','the person who keeps the school safe','a person whose job is to keep people safe','The security guard keeps us safe.','security guard',['security guard','guard','security','watchman','security officer'],['police','soldier','goalkeeper'],
  S([['保安','bǎo\u2019ān']],[['保安','bou2 on1'],['護衛員','wu6 wai6 jyun4']],[['guardia de seguridad','GWAR-dya deh seh-goo-ree-DAD'],['guardia','GWAR-dya']],[['حارس أمن','haaris amn'],['حارس','haaris']],[['bảo vệ','bao veh']],[['ยาม','yaam'],['รปภ.','ro-po-po']],[['सुरक्षा गार्ड','suraksha gard']])),
 W('custodian','custodian','the person who cleans the school','a person who cleans and fixes a building','The custodian cleans the classrooms.','custodian',['janitor','custodian','cleaner','caretaker','cleaning staff'],['guardian','keeper of a child','trustee'],
  S([['清洁工','qīngjiégōng'],['校工','xiàogōng']],[['清潔工','cing1 git3 gung1'],['校工','haau6 gung1']],[['conserje','kon-SEHR-heh']],[['عامل النظافة','\u2019aamil an-nadhaafa'],['فراش','farraash']],[['lao công','lao kong']],[['ภารโรง','phan-rong']],[['सफाइ कर्मचारी','safai karmachari']])),
 W('assistant','assistant','a person who helps the teacher in class','a person who helps another person do their job','The assistant helps the teacher.','assistant',['assistant','teaching assistant','helper','aide','assistant teacher'],['secretary','manager'],
  S([['助教','zhùjiào'],['助理','zhùlǐ']],[['助教','zo6 gaau3'],['助理','zo6 lei5']],[['asistente','a-sees-TEN-teh'],['ayudante','a-yoo-DAN-teh']],[['مساعد','musaa\u2019id'],['مساعدة','musaa\u2019ida']],[['trợ giảng','tro zang'],['trợ lý','tro lee']],[['ผู้ช่วยครู','phu chuay kroo']],[['सहायक','sahayak']])),
 W('classmate','classmate','a student in the same class as you','a person who is in your class','Jun is my classmate.','classmate',['classmate','schoolmate','fellow student','classmates'],['coworker','colleague'],
  S([['同学','tóngxué']],[['同學','tung4 hok6']],[['compañero de clase','kom-pa-NYEH-ro deh KLA-seh'],['compañera','kom-pa-NYEH-ra']],[['زميل','zameel'],['زميلة','zameela']],[['bạn cùng lớp','ban koong lup']],[['เพื่อนร่วมชั้น','phuean ruam chan']],[['सहपाठी','sahapathi']])),
 W('classroom','classroom','the room where a class learns','a room in a school where students learn','Our classroom has a big board.','classroom',['classroom','class room','schoolroom','class'],['lesson','course','grade'],
  S([['教室','jiàoshì']],[['課室','fo3 sat1'],['教室','gaau3 sat1']],[['salón de clases','sa-LON deh KLA-ses'],['aula','OW-la']],[['فصل','fasl'],['صف','saff']],[['lớp học','lup hok']],[['ห้องเรียน','hong rian']],[['कक्षाकोठा','kakshakotha']])),
 W('office','office','the room where school staff work (the main office)','a room where people work at desks','Linh goes to the main office.','office',['office','main office','administration','front office','bureau'],['job','position','post','role'],
  S([['办公室','bàngōngshì']],[['校務處','haau6 mou6 cyu3'],['辦公室','baan6 gung1 sat1']],[['oficina','o-fee-SEE-na'],['dirección','dee-rek-SYON']],[['مكتب','maktab'],['الإدارة','al-idaara']],[['văn phòng','van fong']],[['สำนักงาน','sam-nak-ngaan'],['ห้องธุรการ','hong thu-ra-kan']],[['कार्यालय','karyalaya']])),
 W('cafeteria','cafeteria','the room where students eat lunch','a big room at school where you buy and eat food','We eat lunch in the cafeteria.','cafeteria',['cafeteria','canteen','dining hall','lunchroom','mess hall'],['coffee shop','cafe','café'],
  S([['食堂','shítáng']],[['飯堂','faan6 tong4']],[['cafetería','ka-feh-teh-REE-a'],['comedor','ko-meh-DOR']],[['مقصف','maqsaf'],['كافتيريا','kaafteeriya']],[['căng tin','kang tin'],['nhà ăn','nya an']],[['โรงอาหาร','rong a-han']],[['क्यान्टिन','kyantin']])),
 W('help','help','do something for someone who needs it','do something good for a person who needs it','Can you help me?','help',['help','assist','aid','support','give a hand'],['rescue','save','emergency'],
  S([['帮','bāng'],['帮助','bāngzhù']],[['幫','bong1'],['幫手','bong1 sau2']],[['ayudar','a-yoo-DAR'],['ayúdame','a-YOO-da-meh']],[['ساعد','saa\u2019ada'],['ساعدني','saa\u2019idni']],[['giúp','zoop'],['giúp đỡ','zoop duh']],[['ช่วย','chuay']],[['मद्दत गर्नु','maddat garnu'],['सहयोग','sahayog']]))
]};

TM.SETS['u1-l2']={title:'Lesson 2 words · Introductions', short:'Lesson 2', back:BACK, words:[
 W('name','name','what people call you (Mateo, Linh…)','the word people call you','My name is Mateo.','name',['name','first name','full name'],['call','appoint','nominate','mention','reputation'],
  S([['名字','míngzi']],[['名','meng2'],['名字','meng4 zi6']],[['nombre','NOM-breh']],[['اسم','ism'],['اسمي','ismi']],[['tên','ten']],[['ชื่อ','chue']],[['नाम','naam']])),
 W('meet','meet','see someone for the first time and learn their name','see and talk to a person for the first time','Nice to meet you.','meet',['meet','get to know','know','see','acquainted'],['satisfy','fulfill','gather','join','assemble'],
  S([['认识','rènshi'],['见面','jiànmiàn']],[['識','sik1'],['見面','gin3 min6']],[['conocer','ko-no-SEHR'],['mucho gusto','MOO-cho GOOS-to']],[['أتعرف','ata\u2019arraf'],['ألتقي','altaqi']],[['gặp','gap'],['làm quen','lam kwen']],[['พบ','phop'],['รู้จัก','roo-jak']],[['भेट्नु','bhetnu'],['चिन्नु','chinnu']])),
 W('introduce','introduce','tell two people each other\u2019s names','say the name of one person to another person','Mateo introduces Jun and Paolo.','introduces',['introduce','present','introduces'],['insert','launch','bring in','put in','start'],
  S([['介绍','jièshào']],[['介紹','gaai3 siu6']],[['presentar','preh-sen-TAR'],['te presento','teh preh-SEN-to']],[['يقدّم','yuqaddim'],['أعرّفك على','u\u2019arrifuk \u2019ala']],[['giới thiệu','zoi tyew']],[['แนะนำ','nae-nam']],[['परिचय गराउनु','parichaya garaunu']])),
 W('goodbye','goodbye','what you say when you leave','a word you say when you go away','Goodbye! See you tomorrow.','Goodbye',['goodbye','bye','farewell','see you','so long'],['hello','hi','welcome'],
  S([['再见','zàijiàn'],['拜拜','báibái']],[['拜拜','baai1 baai3'],['再見','zoi3 gin3']],[['adiós','a-DYOS'],['chao','chow']],[['مع السلامة','ma\u2019a as-salaama'],['إلى اللقاء','ila al-liqaa\u2019']],[['tạm biệt','tam byet'],['chào nhé','chow nyeh']],[['ลาก่อน','la gon'],['บ๊ายบาย','baai baai']],[['फेरि भेटौंला','pheri bhetaunla'],['बिदा','bida']])),
 W('goodmorning','good morning','what you say to someone in the morning','a greeting for the time before 12:00','Good morning, Mr. Toby!','Good morning',['good morning','morning','hello'],['good night','good evening','goodbye'],
  S([['早上好','zǎoshang hǎo'],['早','zǎo']],[['早晨','zou2 san4']],[['buenos días','BWEH-nos DEE-as']],[['صباح الخير','sabaah al-khayr']],[['chào buổi sáng','chow bwee sang']],[['สวัสดีตอนเช้า','sa-wat-dee ton chao']],[['शुभ प्रभात','shubha prabhat'],['नमस्ते','namaste']])),
 W('friendly','friendly','kind and happy to talk to people','kind, nice and easy to talk to','Mateo is friendly.','friendly',['friendly','kind','nice','amicable','warm','sociable','affable'],['compatible','user-friendly','easy to use'],
  S([['友好','yǒuhǎo'],['友善','yǒushàn']],[['友善','jau5 sin6'],['好nice','hou2 nice']],[['amable','a-MA-bleh'],['simpático','seem-PA-tee-ko']],[['ودود','wadood'],['لطيف','lateef']],[['thân thiện','tun tyen']],[['เป็นมิตร','pen mit'],['ใจดี','jai dee']],[['मिलनसार','milansaar']])),
 W('shakehands','shake hands','hold someone\u2019s hand and move it up and down when you meet','hold another person\u2019s right hand when you meet','In the United States, people shake hands when they meet.','shake hands',['shake hands','handshake','shake hand'],['tremble','shake','shiver'],
  S([['握手','wòshǒu']],[['握手','ak1 sau2'],['揸手','zaa1 sau2']],[['dar la mano','dar la MA-no']],[['يصافح','yusaafih'],['مصافحة','musaafaha']],[['bắt tay','bat tai']],[['จับมือ','jap mue']],[['हात मिलाउनु','haat milaunu']])),
 W('wave','wave','move your hand to say hi or bye (not water in the sea)','move your hand from side to side to say hello or goodbye','Paolo waves to his friend.','waves',['wave','waves','wave hand','beckon'],['ocean','sea','surf','water','tide','swell','billow','undulate'],
  S([['挥手','huīshǒu']],[['揮手','fai1 sau2'],['擰手','ning6 sau2']],[['saludar con la mano','sa-loo-DAR kon la MA-no']],[['يلوّح بيده','yulawwih biyadih']],[['vẫy tay','vay tai']],[['โบกมือ','bok mue']],[['हात हल्लाउनु','haat hallaunu']])),
 W('smile','smile','make a happy face with your mouth','make your mouth turn up because you are happy','Linh smiles at Mateo.','smiles',['smile','smiles','grin','beam'],['laugh','laughter','giggle'],
  S([['微笑','wēixiào'],['笑','xiào']],[['笑','siu3'],['微笑','mei4 siu3']],[['sonreír','son-reh-EER'],['sonrisa','son-REE-sa']],[['يبتسم','yabtasim'],['ابتسامة','ibtisaama']],[['mỉm cười','meem kuh-ee'],['cười','kuh-ee']],[['ยิ้ม','yim']],[['मुस्कुराउनु','muskuraunu'],['मुस्कान','muskaan']])),
 W('firstname','first name','your own name, not your family name (Amira)','the name your parents gave you, not your family name','My first name is Amira.','first name',['first name','given name','name','forename'],['last name','surname','family name'],
  S([['名','míng'],['名字','míngzi']],[['名','meng2']],[['nombre','NOM-breh'],['nombre de pila','NOM-breh deh PEE-la']],[['الاسم الأول','al-ism al-awwal']],[['tên','ten']],[['ชื่อจริง','chue jing']],[['पहिलो नाम','pahilo naam']])),
 W('lastname','last name','your family name (Saleh)','the name everyone in your family has','My last name is Saleh.','last name',['last name','surname','family name'],['first name','given name','final name','latest'],
  S([['姓','xìng']],[['姓','sing3']],[['apellido','a-peh-YEE-do']],[['اسم العائلة','ism al-\u2019aa\u2019ila'],['الكنية','al-kunya']],[['họ','haw']],[['นามสกุล','nam-sa-kun']],[['थर','thar']])),
 W('welcome','welcome','what you say to a new person: we are happy you are here','words that say we are happy you came','Welcome to Galileo!','Welcome',['welcome','greetings','be welcome'],['you\u2019re welcome','you are welcome','no problem','don\u2019t mention it','my pleasure'],
  S([['欢迎','huānyíng']],[['歡迎','fun1 jing4']],[['bienvenido','byen-veh-NEE-do'],['bienvenida','byen-veh-NEE-da']],[['أهلا وسهلا','ahlan wa sahlan'],['مرحبا بك','marhaban bik']],[['chào mừng','chow mung']],[['ยินดีต้อนรับ','yin-dee ton-rap']],[['स्वागत छ','swagat chha']]))
]};

TM.SETS['u1-l3']={title:'Lesson 3 words · From A to Z', short:'Lesson 3', back:BACK, words:[
 W('alphabet','alphabet','all the letters, A to Z','all the letters of a language in order','The English alphabet has 26 letters.','alphabet',['alphabet','letters','abc','abcs'],['bulletin','literacy'],
  S([['字母表','zìmǔbiǎo']],[['字母表','zi6 mou5 biu2']],[['abecedario','a-beh-seh-DAR-yo'],['alfabeto','al-fa-BEH-to']],[['الأبجدية','al-abjadiyya'],['الحروف','al-huruuf']],[['bảng chữ cái','bang chur kai']],[['ตัวอักษร','tua ak-son'],['ก ข ค','gor khor khor']],[['वर्णमाला','varnamala']])),
 W('letter','letter','A, B, C … one sign in the alphabet (not mail)','one of the signs we use to write words','A is the first letter.','letter',['letter','character','alphabet letter'],['mail','envelope','message','note','epistle','post'],
  S([['字母','zìmǔ']],[['字母','zi6 mou5']],[['letra','LEH-tra']],[['حرف','harf']],[['chữ cái','chur kai'],['chữ','chur']],[['ตัวอักษร','tua ak-son'],['ตัว','tua']],[['अक्षर','akshar']])),
 W('uppercase','uppercase','a big letter: A, B, C','a big letter, like A','Names start with an uppercase letter.','uppercase',['uppercase','capital letter','capital','upper case','capitals'],['money','city','capital city','funds'],
  S([['大写','dàxiě']],[['大楷','daai6 kaai2'],['大寫','daai6 se2']],[['mayúscula','ma-YOOS-koo-la']],[['حرف كبير','harf kabeer']],[['chữ hoa','chur hwa']],[['ตัวพิมพ์ใหญ่','tua phim yai']],[['ठूलो अक्षर','thulo akshar']])),
 W('lowercase','lowercase','a small letter: a, b, c','a small letter, like a','Chris writes his name in lowercase.','lowercase',['lowercase','small letter','lower case','minuscule'],['short','tiny'],
  S([['小写','xiǎoxiě']],[['細楷','sai3 kaai2'],['小寫','siu2 se2']],[['minúscula','mee-NOOS-koo-la']],[['حرف صغير','harf sagheer']],[['chữ thường','chur thuong']],[['ตัวพิมพ์เล็ก','tua phim lek']],[['सानो अक्षर','sano akshar']])),
 W('vowel','vowel','the letters a, e, i, o, u','one of the letters a, e, i, o or u','The letter a is a vowel.','vowel',['vowel','vowels','vowel sound'],['consonant','vow','promise'],
  S([['元音','yuányīn']],[['元音','jyun4 jam1'],['母音','mou5 jam1']],[['vocal','vo-KAL']],[['حرف علة','harf \u2019illa']],[['nguyên âm','ngwen um']],[['สระ','sa-ra']],[['स्वर','swar']])),
 W('spell','spell','say or write the letters of a word in order','say the letters of a word one by one','How do you spell your name?','spell',['spell','spelling','spell out'],['magic','charm','curse','period','while','enchantment'],
  S([['拼写','pīnxiě'],['拼','pīn']],[['串','cyun3'],['點串','dim2 cyun3']],[['deletrear','deh-leh-treh-AR']],[['يتهجّى','yatahajja'],['تهجئة','tahji\u2019a']],[['đánh vần','dan vun']],[['สะกด','sa-kot']],[['हिज्जे गर्नु','hijje garnu']])),
 W('word','word','letters together that mean something (cat)','a group of letters that has a meaning','Cat is a word.','word',['word','term','vocabulary'],['promise','news','message','talk'],
  S([['词','cí'],['单词','dāncí']],[['字','zi6'],['詞','ci4']],[['palabra','pa-LA-bra']],[['كلمة','kalima']],[['từ','tur'],['chữ','chur']],[['คำ','kham']],[['शब्द','shabda']])),
 W('notebook','notebook','a book of empty paper you write in','a book with lines where you write','Maria writes it in her notebook.','notebook',['notebook','exercise book','copybook','notepad','book'],['laptop','computer','notebook computer'],
  S([['笔记本','bǐjìběn'],['本子','běnzi']],[['簿','bou2'],['筆記簿','bat1 gei3 bou2']],[['cuaderno','kwa-DEHR-no'],['libreta','lee-BREH-ta']],[['دفتر','daftar'],['كراسة','kurraasa']],[['vở','vuh'],['sổ tay','so tai']],[['สมุด','sa-mut']],[['कापी','kaapi']])),
 W('write','write','put words on paper with a pen or pencil','make letters and words with a pen or pencil','Write your name on the paper.','Write',['write','writing','write down','compose'],['record','type'],
  S([['写','xiě']],[['寫','se2']],[['escribir','es-kree-BEER'],['escribe','es-KREE-beh']],[['يكتب','yaktub'],['اكتب','uktub']],[['viết','vyet']],[['เขียน','khian']],[['लेख्नु','lekhnu'],['लेख','lekha']])),
 W('repeat','repeat','say it one more time','say the same thing again','Can you please repeat that?','repeat',['repeat','say again','again','reiterate','one more time'],['copy','duplicate','rerun','retake','fail a grade'],
  S([['再说一遍','zài shuō yí biàn'],['重复','chóngfù']],[['再講一次','zoi3 gong2 jat1 ci3'],['重複','cung4 fuk1']],[['repetir','reh-peh-TEER'],['otra vez','O-tra ves']],[['أعد','a\u2019id'],['كرر','karrir']],[['nhắc lại','nyak lai'],['nói lại','noy lai']],[['พูดอีกครั้ง','phut eek krang'],['ทวน','thuan']],[['दोहोर्याउनु','dohoryaunu'],['फेरि भन्नु','pheri bhannu']])),
 W('slowly','slowly','not fast','not quickly; taking a long time','Please say it slowly.','slowly',['slowly','slow','gradually','little by little'],['late','later','delayed'],
  S([['慢慢','mànmàn'],['慢一点','màn yìdiǎn']],[['慢慢','maan6 maan2'],['慢啲','maan6 di1']],[['despacio','des-PA-syo'],['lento','LEN-to']],[['ببطء','bi-but\u2019'],['شوي شوي','shway shway']],[['chậm','chum'],['từ từ','tur tur']],[['ช้าๆ','cha cha']],[['बिस्तारै','bistarai']])),
 W('sentence','sentence','words that make one full idea, with a capital and a period','a group of words with one idea; it starts with a capital letter','My name is Linh. That is a sentence.','sentence',['sentence','clause','phrase'],['prison','jail','punishment','judgment','verdict','penalty','term'],
  S([['句子','jùzi']],[['句子','geoi3 zi2']],[['oración','o-ra-SYON'],['frase','FRA-seh']],[['جملة','jumla']],[['câu','kow']],[['ประโยค','pra-yok']],[['वाक्य','vakya']]))
]};

TM.SETS['u1-l4']={title:'Lesson 4 words · 0 to 100', short:'Lesson 4', back:BACK, words:[
 W('number','number','1, 2, 3 … it tells how many','a word or sign like 1, 2, 3 that tells how many','A number tells how many.','number',['number','numeral','figure','digit','amount'],['numb','issue','song','phone number'],
  S([['数字','shùzì']],[['數字','sou3 zi6'],['號碼','hou6 maa5']],[['número','NOO-meh-ro']],[['رقم','raqm'],['عدد','\u2019adad']],[['số','so'],['con số','kon so']],[['ตัวเลข','tua lek']],[['संख्या','sankhya'],['नम्बर','nambar']])),
 W('count','count','say numbers in order: 1, 2, 3…','say the numbers one by one to find how many','Today we count our school.','count',['count','counting','calculate','number','tally'],['earl','nobleman','matter','rely','depend','charge'],
  S([['数','shǔ']],[['數','sou2']],[['contar','kon-TAR']],[['يعدّ','ya\u2019udd'],['عدّ','\u2019udd']],[['đếm','dem']],[['นับ','nap']],[['गन्नु','gannu'],['गन','gana']])),
 W('howmany','how many','the question for a number: how many books?','the words you use to ask for a number','How many books do you see?','How many',['how many','how much','what number','how many?'],['how','why'],
  S([['多少','duōshao'],['几','jǐ']],[['幾多','gei2 do1'],['幾','gei2']],[['cuántos','KWAN-tos'],['cuántas','KWAN-tas']],[['كم','kam']],[['bao nhiêu','bao nyew'],['mấy','may']],[['กี่','kee'],['เท่าไร','thao rai']],[['कति','kati']])),
 W('zero','zero','0, nothing','the number 0; none','Zero plus ten is ten.','Zero',['zero','nothing','none','nil','null','0'],['empty','blank'],
  S([['零','líng']],[['零','ling4']],[['cero','SEH-ro']],[['صفر','sifr']],[['không','khom'],['số không','so khom']],[['ศูนย์','soon']],[['शून्य','shunya'],['सुन्ना','sunna']])),
 W('ten','ten','10','the number 10','I have ten fingers.','ten',['ten','10'],['tin','tent'],
  S([['十','shí']],[['十','sap6']],[['diez','dyes']],[['عشرة','\u2019ashara']],[['mười','muoy']],[['สิบ','sip']],[['दश','das']])),
 W('hundred','hundred','100','the number 100; ten tens','I can count to one hundred.','hundred',['hundred','one hundred','100'],['thousand','century'],
  S([['一百','yìbǎi'],['百','bǎi']],[['一百','jat1 baak3']],[['cien','syen'],['ciento','SYEN-to']],[['مئة','mi\u2019a'],['مية','miyya']],[['một trăm','mot tram']],[['หนึ่งร้อย','neung roi'],['ร้อย','roi']],[['एक सय','ek saya'],['सय','saya']])),
 W('largest','largest','the biggest of all (95 is the largest)','the most big; bigger than all the others','95 is the largest number.','largest',['largest','biggest','greatest','maximum','largest number'],['wide','generous','oldest'],
  S([['最大','zuì dà']],[['最大','zeoi3 daai6']],[['el más grande','el mas GRAN-deh'],['mayor','ma-YOR']],[['الأكبر','al-akbar']],[['lớn nhất','lun nyut']],[['ใหญ่ที่สุด','yai tee sut']],[['सबैभन्दा ठूलो','sabaibhanda thulo']])),
 W('smallest','smallest','the littlest of all (3 is the smallest)','the most small; smaller than all the others','3 is the smallest number.','smallest',['smallest','least','littlest','minimum','tiniest'],['youngest','shortest'],
  S([['最小','zuì xiǎo']],[['最細','zeoi3 sai3'],['最小','zeoi3 siu2']],[['el más pequeño','el mas peh-KEH-nyo'],['menor','meh-NOR']],[['الأصغر','al-asghar']],[['nhỏ nhất','nyaw nyut']],[['เล็กที่สุด','lek tee sut']],[['सबैभन्दा सानो','sabaibhanda sano']])),
 W('clock','clock','the thing on the wall that tells the time','a machine that shows the time','The clock says 8:40.','clock',['clock','wall clock','timepiece','watch'],['hour','time','o\u2019clock','hours'],
  S([['钟','zhōng'],['时钟','shízhōng']],[['鐘','zung1'],['時鐘','si4 zung1']],[['reloj','reh-LOH']],[['ساعة','saa\u2019a'],['ساعة حائط','saa\u2019at haa\u2019it']],[['đồng hồ','dom ho']],[['นาฬิกา','na-li-ka']],[['घडी','ghadi']])),
 W('page','page','one side of paper in a book (page 40)','one side of a piece of paper in a book','Open your book to page 40.','page',['page','sheet','leaf'],['face','front','call','beep','servant','page boy','webpage'],
  S([['页','yè']],[['頁','jip6'],['版','baan2']],[['página','PA-hee-na']],[['صفحة','safha']],[['trang','trang']],[['หน้า','na']],[['पृष्ठ','prishtha'],['पेज','pej']])),
 W('room','room','a place inside a building with walls and a door (Room 258)','a space in a building with walls and a door','Mr. Toby\u2019s class is in Room 258.','Room',['room','classroom','chamber','hall'],['space','place','area','capacity'],
  S([['房间','fángjiān'],['教室','jiàoshì']],[['房','fong2'],['課室','fo3 sat1']],[['salón','sa-LON'],['cuarto','KWAR-to'],['sala','SA-la']],[['غرفة','ghurfa'],['قاعة','qaa\u2019a']],[['phòng','fong']],[['ห้อง','hong']],[['कोठा','kotha']])),
 W('bell','bell','the school bell that rings when class starts','a thing that makes a loud ring to start or end class','The first bell rings at 8:40.','bell',['bell','school bell','ring','buzzer','chime'],['doorbell','bell pepper'],
  S([['铃','líng'],['上课铃','shàngkè líng']],[['鐘','zung1'],['鐘聲','zung1 seng1']],[['timbre','TEEM-breh'],['campana','kam-PA-na']],[['جرس','jaras']],[['chuông','chuong']],[['กริ่ง','kring'],['ระฆัง','ra-khang']],[['घण्टी','ghanti']]))
]};

TM.SETS['u1-l5']={title:'Lesson 5 words · About Me', short:'Lesson 5', back:BACK, words:[
 W('country','country','a land with its own name and flag (Yemen, Mexico)','a nation, like Vietnam or Guatemala','I am from Yemen. Yemen is my country.','country',['country','nation','state','homeland','land'],['countryside','rural','village','farm','field','country music'],
  S([['国家','guójiā']],[['國家','gwok3 gaa1']],[['país','pa-EES']],[['بلد','balad'],['دولة','dawla']],[['đất nước','dut nuoc'],['nước','nuoc']],[['ประเทศ','pra-tet']],[['देश','desh']])),
 W('language','language','what people speak, like Arabic or English','the words people use to talk and write','Arabic is my language.','language',['language','tongue','speech','idiom'],['tongue (mouth)','body part'],
  S([['语言','yǔyán']],[['語言','jyu5 jin4']],[['idioma','ee-DYO-ma'],['lengua','LEN-gwa']],[['لغة','lugha']],[['ngôn ngữ','ngon ngur'],['tiếng','tyeng']],[['ภาษา','pha-sa']],[['भाषा','bhasha']])),
 W('yearsold','years old','your age: I am sixteen years old','how old you are','I am sixteen years old.','years old',['years old','age','years','old','year'],['ancient','elderly','old-fashioned'],
  S([['岁','suì']],[['歲','seoi3']],[['años','A-nyos'],['tengo… años','TEN-go A-nyos']],[['عمري','\u2019umri'],['سنة','sana']],[['tuổi','tooy']],[['อายุ','a-yu'],['ปี','pee']],[['वर्ष','barsha'],['उमेर','umer']])),
 W('share','share','give some of what you have to another person','let another person have part of something','Linh shares her lunch with Jun.','shares',['share','split','divide','give part'],['stock','portion','part','dividend','a share','post'],
  S([['分享','fēnxiǎng'],['分','fēn']],[['分享','fan1 hoeng2'],['分','fan1']],[['compartir','kom-par-TEER']],[['يشارك','yushaarik'],['قسّم','qassim']],[['chia sẻ','chee-a seh'],['chia','chee-a']],[['แบ่ง','baeng'],['แบ่งปัน','baeng pan']],[['बाँड्नु','baadnu']])),
 W('go','go','move to a place: I go to school','move from one place to another','I go to Galileo every day.','go',['go','walk','travel','attend','move'],['leave','turn','work (it goes)','become','try (have a go)'],
  S([['去','qù']],[['去','heoi3']],[['ir','eer'],['voy','voy']],[['يذهب','yadh-hab'],['أروح','aruuh']],[['đi','dee']],[['ไป','pai']],[['जानु','jaanu'],['जान्छु','jaanchhu']])),
 W('bilingual','bilingual','you can speak two languages','able to speak two languages','Amira is bilingual. She speaks Arabic and English.','bilingual',['bilingual','two languages','speaks two languages'],['translator','foreign'],
  S([['双语','shuāngyǔ'],['会说两种语言','huì shuō liǎng zhǒng yǔyán']],[['雙語','soeng1 jyu5']],[['bilingüe','bee-LEEN-gweh']],[['ثنائي اللغة','thunaa\u2019iyy al-lugha'],['أتكلم لغتين','atakallam lughatayn']],[['song ngữ','song ngur']],[['สองภาษา','song pha-sa']],[['द्विभाषी','dvibhashi'],['दुई भाषा','dui bhasha']])),
 W('partner','partner','the classmate you work with today','one other student you work with','Interview a partner.','partner',['partner','classmate','teammate','pair','companion','buddy'],['boyfriend','girlfriend','spouse','husband','wife','lover','business partner','associate','couple'],
  S([['搭档','dādàng'],['同伴','tóngbàn']],[['拍檔','paak3 dong3'],['同伴','tung4 bun6']],[['compañero','kom-pa-NYEH-ro'],['compañera','kom-pa-NYEH-ra']],[['زميل','zameel'],['شريك','shareek']],[['bạn cùng nhóm','ban koong nyom'],['bạn','ban']],[['คู่','khu'],['เพื่อนคู่','phuean khu']],[['साथी','saathi'],['जोडी','jodi']])),
 W('speak','speak','use your voice to say words in a language','talk; use words with your mouth','I speak Arabic and English.','speak',['speak','talk','say','speaking'],['lecture','give a speech'],
  S([['说','shuō'],['讲','jiǎng']],[['講','gong2']],[['hablar','a-BLAR'],['hablo','A-blo']],[['يتكلّم','yatakallam'],['أتكلم','atakallam']],[['nói','noy']],[['พูด','phut']],[['बोल्नु','bolnu'],['बोल्छु','bolchhu']])),
 W('live','live','have your home in a place: I live in San Francisco','have your home in a place','I live in San Francisco.','live',['live','reside','dwell','stay','inhabit'],['alive','life','survive','living','exist','broadcast','in person'],
  S([['住','zhù']],[['住','zyu6']],[['vivir','vee-VEER'],['vivo','VEE-vo']],[['يسكن','yaskun'],['أسكن','askun']],[['sống','song'],['ở','uh']],[['อยู่','yoo'],['อาศัย','a-sai']],[['बस्नु','basnu'],['बस्छु','baschhu']])),
 W('family','family','your mother, father, brothers, sisters…','the people you are related to, like parents and children','My family is from Guatemala.','family',['family','relatives','household','folks','kin'],['species','genus','category'],
  S([['家人','jiārén'],['家庭','jiātíng']],[['屋企人','uk1 kei2 jan4'],['家人','gaa1 jan4']],[['familia','fa-MEE-lya']],[['عائلة','\u2019aa\u2019ila'],['أسرة','usra']],[['gia đình','za ding']],[['ครอบครัว','khrop-khrua']],[['परिवार','pariwar']])),
 W('city','city','a big town with many buildings and people','a big place where many people live and work','San Francisco is a big city.','city',['city','town','metropolis','urban area'],['downtown','center','village','country'],
  S([['城市','chéngshì']],[['城市','sing4 si5']],[['ciudad','syoo-DAD']],[['مدينة','madeena']],[['thành phố','tan fo']],[['เมือง','mueang']],[['शहर','shahar']])),
 W('question','question','what you ask when you want to know something','a sentence you ask; it ends with ?','Ask your partner three questions.','questions',['question','questions','query','inquiry','ask'],['problem','issue','trouble','doubt','matter'],
  S([['问题','wèntí']],[['問題','man6 tai4']],[['pregunta','preh-GOON-ta']],[['سؤال','su\u2019aal']],[['câu hỏi','kow hoy']],[['คำถาม','kham tham']],[['प्रश्न','prashna'],['सोधाइ','sodhai']]))
]};
TM.SET_ORDER=['u1','u1-l1','u1-l2','u1-l3','u1-l4','u1-l5'];
if(TM.SETS.u1&&!TM.SETS.u1.short) TM.SETS.u1.short='Unit 1';
})();
