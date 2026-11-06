/* missed/art.js — drawings for "Practice the words you missed" (T-177). Flat layered SVG, muted palette.
   MISSED_ART.hero(lionId) = study-desk scene (a tiny Galileo lion hides on the shelf);
   MISSED_ART.see / hear / spell = round pictures; MISSED_ART.done = finished scene. */
(function(){
var A={};
function S(vb,b){return '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+b+'</svg>';}
function lion(x,y,s,id){ /* tiny Galileo lion: mane, face, ears, tail */
 return '<g id="'+id+'" class="lion" transform="translate('+x+' '+y+') scale('+s+')" style="cursor:pointer">'+
  '<path d="M30 34 q14 -6 18 8" stroke="#a0662a" stroke-width="3" fill="none"/><circle cx="49" cy="43" r="3" fill="#7a4a1c"/>'+
  '<ellipse cx="22" cy="38" rx="14" ry="9" fill="#e0a64f"/>'+
  '<g fill="#a0662a">'+[0,40,80,120,160,200,240,280,320].map(function(a){var r=a*Math.PI/180;return '<circle cx="'+(12+11*Math.cos(r)).toFixed(1)+'" cy="'+(22+11*Math.sin(r)).toFixed(1)+'" r="6"/>';}).join('')+'</g>'+
  '<circle cx="12" cy="22" r="9" fill="#f2c071"/><circle cx="9" cy="20" r="1.4" fill="#2b1d10"/><circle cx="15" cy="20" r="1.4" fill="#2b1d10"/>'+
  '<path d="M10 25 q2 2 4 0" stroke="#2b1d10" stroke-width="1.2" fill="none"/><ellipse cx="12" cy="23.2" rx="1.6" ry="1.1" fill="#7a4a1c"/>'+
  '<rect x="12" y="44" width="4" height="6" fill="#e0a64f"/><rect x="26" y="44" width="4" height="6" fill="#e0a64f"/></g>';}
A.hero=function(lionId){return S('0 0 640 260',
 /* wall + window */'<rect width="640" height="260" fill="#eef1e8"/><rect y="0" width="640" height="18" fill="#dfe6d6"/>'+
 '<rect x="40" y="30" width="170" height="120" rx="6" fill="#bcd9e8" stroke="#5b4a3a" stroke-width="6"/><path d="M125 30v120M40 90h170" stroke="#5b4a3a" stroke-width="5"/>'+
 '<circle cx="80" cy="62" r="14" fill="#f6d77a"/><path d="M150 140 q20 -40 50 -30 v30z" fill="#9cc48a"/><path d="M45 140 q30 -30 70 -10 v10z" fill="#86b475"/>'+
 /* shelf with books + lion */'<rect x="420" y="70" width="190" height="10" fill="#8a6440"/><rect x="420" y="80" width="190" height="4" fill="#6e4f31"/>'+
 '<g>'+[['#c45a40',0,46],['#4f7d8c',16,52],['#d4a017',34,44],['#7a4fb0',50,50],['#2f7d4f',68,40],['#b5451b',82,48]].map(function(b){return '<rect x="'+(428+b[1])+'" y="'+(70-b[2])+'" width="14" height="'+b[2]+'" fill="'+b[0]+'"/><rect x="'+(428+b[1])+'" y="'+(70-b[2]+6)+'" width="14" height="3" fill="rgba(255,255,255,.45)"/>';}).join('')+'</g>'+
 lion(540,22,0.92,lionId||'lion')+
 /* desk */'<rect x="0" y="196" width="640" height="64" fill="#c9a77c"/><rect x="0" y="196" width="640" height="8" fill="#a9855c"/>'+
 '<g stroke="#b8946a" stroke-width="1"><path d="M0 222h640M0 244h640"/></g>'+
 /* lamp */'<path d="M560 196 l10 -60 l-28 -26" stroke="#3c3c44" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M520 98 l40 -10 l-6 34 z" fill="#2f6aa8"/><ellipse cx="562" cy="196" rx="24" ry="6" fill="#3c3c44"/>'+
 '<path d="M524 118 l-20 70 h80 l-26 -78" fill="#f6e7a8" opacity=".35"/>'+
 /* student (Linh) */'<rect x="250" y="150" width="120" height="60" rx="26" fill="#c4567a"/><path d="M262 160 q48 -24 96 0" fill="#d97294"/>'+
 '<circle cx="310" cy="112" r="34" fill="#e8bf94"/><path d="M276 110 q2 -42 36 -40 q34 0 34 40 q-12 -20 -36 -20 q-22 0 -34 20z" fill="#2a1d16"/><path d="M276 110 q-4 30 6 46 l8 -30z" fill="#2a1d16"/><path d="M344 110 q4 30 -6 46 l-8 -30z" fill="#2a1d16"/>'+
 '<circle cx="298" cy="116" r="3.4" fill="#2a2a2a"/><circle cx="322" cy="116" r="3.4" fill="#2a2a2a"/><path d="M302 132 q8 6 16 0" stroke="#8a4a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
 '<circle cx="292" cy="126" r="5" fill="#f2a7a0" opacity=".5"/><circle cx="328" cy="126" r="5" fill="#f2a7a0" opacity=".5"/>'+
 /* hands + flashcards */'<g transform="rotate(-8 230 170)"><rect x="196" y="136" width="70" height="52" rx="6" fill="#fffdf4" stroke="#1c2640" stroke-width="2.5"/><text x="231" y="174" font-size="26" text-anchor="middle">🎒</text></g>'+
 '<g transform="rotate(7 392 168)"><rect x="356" y="138" width="74" height="50" rx="6" fill="#fffdf4" stroke="#1c2640" stroke-width="2.5"/><text x="393" y="161" font-family="Nunito,sans-serif" font-weight="800" font-size="13" text-anchor="middle" fill="#1c2640">backpack</text><path d="M372 172 h42" stroke="#9db7d6" stroke-width="2"/></g>'+
 '<ellipse cx="268" cy="190" rx="13" ry="9" fill="#e8bf94"/><ellipse cx="356" cy="190" rx="13" ry="9" fill="#e8bf94"/>'+
 /* more cards + pencil on desk */'<rect x="90" y="206" width="64" height="40" rx="5" fill="#fff" stroke="#1c2640" stroke-width="2"/><text x="122" y="234" font-size="20" text-anchor="middle">✏️</text>'+
 '<rect x="160" y="212" width="64" height="40" rx="5" fill="#fff" stroke="#1c2640" stroke-width="2" transform="rotate(6 192 232)"/><text x="192" y="238" font-size="20" text-anchor="middle" transform="rotate(6 192 232)">📘</text>'+
 '<g transform="rotate(-14 470 226)"><rect x="430" y="222" width="80" height="9" fill="#f2c14e"/><rect x="430" y="222" width="80" height="3" fill="#f7d77f"/><path d="M510 222 l12 4.5 l-12 4.5z" fill="#e8c9a0"/><path d="M517 224.7 l5 1.8 l-5 1.8z" fill="#333"/><rect x="423" y="222" width="8" height="9" fill="#e58b8b"/></g>');};
A.see=S('0 0 200 160','<rect width="200" height="160" fill="#eef5ff"/>'+
 '<rect x="26" y="22" width="100" height="78" rx="8" fill="#fffdf4" stroke="#1c2640" stroke-width="3"/><text x="76" y="78" font-family="Nunito,sans-serif" font-weight="900" font-size="52" text-anchor="middle" fill="#c4762b">?</text>'+
 '<g transform="translate(100 70)"><path d="M0 30 q40 -40 80 0 q-40 40 -80 0z" fill="#fff" stroke="#1c2640" stroke-width="3"/><circle cx="40" cy="30" r="15" fill="#2f6aa8"/><circle cx="40" cy="30" r="7" fill="#111"/><circle cx="45" cy="25" r="3" fill="#fff"/></g>'+
 '<rect x="16" y="118" width="58" height="22" rx="11" fill="#fff" stroke="#1c2640" stroke-width="2"/><path d="M28 129h34" stroke="#9aa3b5" stroke-width="4" stroke-linecap="round"/>'+
 '<rect x="80" y="118" width="58" height="22" rx="11" fill="#d8f0e2" stroke="#2f7d4f" stroke-width="2"/><path d="M92 129h34" stroke="#2f7d4f" stroke-width="4" stroke-linecap="round"/>');
A.hear=S('0 0 200 160','<rect width="200" height="160" fill="#f3eefb"/>'+
 '<path d="M70 26 Q128 18 130 76 Q130 108 104 118 Q92 122 92 138 Q88 154 70 148" fill="#e8bf94" stroke="#b98a60" stroke-width="3"/><path d="M84 50 Q110 50 108 76 Q106 94 90 96" fill="none" stroke="#b98a60" stroke-width="6"/>'+
 '<g stroke="#7a4fb0" stroke-width="4" fill="none" stroke-linecap="round"><path d="M150 54 q12 22 0 44"/><path d="M164 42 q20 34 0 68"/><path d="M178 30 q28 46 0 92"/></g>'+
 '<rect x="16" y="20" width="38" height="30" rx="6" fill="#fff" stroke="#1c2640" stroke-width="2"/><path d="M24 30h8l8 -6v22l-8 -6h-8z" fill="#1c2640"/>');
A.spell=S('0 0 200 160','<rect width="200" height="160" fill="#eef7ee"/>'+
 '<g font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#1c2640">'+['a','b','c'].map(function(c,i){return '<rect x="'+(18+i*36)+'" y="30" width="30" height="38" rx="5" fill="#fff" stroke="#1c2640" stroke-width="2.5"/><text x="'+(33+i*36)+'" y="57" text-anchor="middle">'+c+'</text>';}).join('')+
 '<rect x="126" y="30" width="30" height="38" rx="5" fill="#fffdf4" stroke="#2f7d4f" stroke-width="3" stroke-dasharray="4 3"/><rect x="162" y="30" width="30" height="38" rx="5" fill="#fffdf4" stroke="#2f7d4f" stroke-width="3" stroke-dasharray="4 3"/></g>'+
 '<path d="M110 150 Q140 108 176 112 L178 134 Q150 150 124 156 Z" fill="#e8bf94"/><g transform="rotate(-40 150 112)"><rect x="128" y="104" width="62" height="10" fill="#f2c14e"/><rect x="128" y="104" width="62" height="3" fill="#f7d77f"/><path d="M128 104 l-14 5 l14 5z" fill="#e8c9a0"/><path d="M118 107.6 l-4 1.4 l4 1.4z" fill="#333"/><rect x="190" y="104" width="8" height="10" fill="#e58b8b"/></g>');
A.done=S('0 0 200 160','<rect width="200" height="160" fill="#fff6dc"/>'+
 '<g fill="#d4a017">'+[[30,30],[170,24],[40,120],[168,118],[100,16]].map(function(p){return '<path d="M'+p[0]+' '+(p[1]-8)+' l2.4 5.6 6 .6 -4.6 4 1.4 6 -5.2 -3.2 -5.2 3.2 1.4 -6 -4.6 -4 6 -.6z"/>';}).join('')+'</g>'+
 '<path d="M66 40 h68 v20 q0 34 -34 40 q-34 -6 -34 -40z" fill="#e3b341" stroke="#9a7413" stroke-width="3"/><path d="M66 48 q-22 0 -20 18 q2 14 22 14" fill="none" stroke="#9a7413" stroke-width="5"/><path d="M134 48 q22 0 20 18 q-2 14 -22 14" fill="none" stroke="#9a7413" stroke-width="5"/>'+
 '<rect x="90" y="100" width="20" height="18" fill="#c99a2a"/><rect x="72" y="118" width="56" height="14" rx="3" fill="#8a6440"/><text x="100" y="78" font-family="Nunito,sans-serif" font-weight="900" font-size="22" text-anchor="middle" fill="#fff">✓</text>');
window.MISSED_ART=A;
})();
