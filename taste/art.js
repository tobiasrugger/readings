/* readings/taste/art.js — T-418 (Nov 15 2026). Drawings for the Taste Test page: 18 word pictures, 8 candies, four doors, the opening scene.
   Shared by taste/index.html and taste/dashboard.html. Cast helpers (PEOPLE, kid) copied from thanks/index.html. */
var PEOPLE={
 linh:{skin:'#f2cba6',hair:'long',hc:'#231b1b',shirt:'#e98aa5',pants:'#3d4a6b',shoes:'#f4f1ee',h:.86},
 mateo:{skin:'#c68a5e',hair:'curly',hc:'#1c1512',shirt:'#2f6fbd',pants:'#2b2f3a',shoes:'#e24b3b',h:1.1},
 amira:{skin:'#d9a37a',hair:'hijab',hc:'#2a9d8f',shirt:'#F8981F',pants:'#4b3f58',shoes:'#2b2233',h:.95},
 jun:{skin:'#efcfae',hair:'short',hc:'#161314',shirt:'#6f7d8c',pants:'#23262d',shoes:'#f4f1ee',h:.98,glasses:true},
 paolo:{skin:'#b97a50',hair:'wavy',hc:'#4a2f1d',shirt:'#864D9E',pants:'#2f3342',shoes:'#f8c33a',h:1}
};
function shade(hex,a){var n=parseInt(hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;function f(c){return Math.max(0,Math.min(255,Math.round(c+a)));}return '#'+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);}
/* small folded school map held in front */
function mapProp(o){return '<g><rect x="-44" y="-30" width="88" height="62" rx="4" fill="#fffdf6" stroke="#6b6458" stroke-width="2"/>'+
 '<rect x="-38" y="-24" width="76" height="14" fill="#cfe3f7" stroke="#8fa6bd"/><rect x="-38" y="-6" width="76" height="14" fill="#c8e6c9" stroke="#8fb08f"/><rect x="-38" y="12" width="76" height="14" fill="#fdf1b8" stroke="#c9b05a"/>'+
 '<path d="M24 -24 v50" stroke="#8b8f98" stroke-width="3" stroke-dasharray="3 2"/><path d="M-30 -18 l2.5 5 5.5 .6 -4 3.8 1 5.4 -5 -2.6 -5 2.6 1 -5.4 -4 -3.8 5.5 -.6z" fill="#f2c230" stroke="#b5891d" stroke-width=".8" transform="translate(0,36)"/></g>';}
/* a student seen from the front. o: {who, expr, hold:'map'|'none', point:'left'|'right', walk:bool} */
function kid(x,y,s,o){var P=PEOPLE[o.who],sk=P.skin,sh=P.shirt,dk=shade(sh,-40),hc=P.hc,h=P.h,hd=-270*h;
 var S='<g transform="translate('+x+','+y+') scale('+((o.flip?-1:1)*s)+','+s+')"><ellipse cx="0" cy="4" rx="44" ry="8" fill="rgba(0,0,0,.16)"/>';
 var legTop=-136*h,lw=o.walk?8:0;
 S+='<rect x="'+(-24-lw)+'" y="-14" width="22" height="14" rx="5" fill="'+P.shoes+'" stroke="rgba(0,0,0,.3)"/><rect x="'+(2+lw)+'" y="-14" width="22" height="14" rx="5" fill="'+P.shoes+'" stroke="rgba(0,0,0,.3)"/>';
 S+='<rect x="-22" y="'+legTop+'" width="19" height="'+(-legTop-12)+'" rx="6" fill="'+P.pants+'" transform="rotate('+(o.walk?6:0)+' -12 '+legTop+')"/><rect x="3" y="'+legTop+'" width="19" height="'+(-legTop-12)+'" rx="6" fill="'+P.pants+'" transform="rotate('+(o.walk?-6:0)+' 12 '+legTop+')"/>';
 var tTop=-236*h,tBot=legTop+6;
 if(o.who==='linh')S+='<path d="M-38 '+tTop+' q38 -14 76 0 l8 '+(tBot-tTop+14)+' h-92 z" fill="'+sh+'" stroke="'+dk+'" stroke-width="2"/><path d="M-34 '+(tBot+2)+' h68" stroke="'+dk+'" stroke-width="5"/>'+(function(){var r='';for(var i=0;i<6;i++)r+='<path d="M'+(-28+i*11)+' '+(tTop+30)+' v'+(tBot-tTop-30)+'" stroke="'+shade(sh,-18)+'" stroke-width="1.6"/>';return r;})();
 else if(o.who==='amira')S+='<path d="M-40 '+tTop+' q40 -14 80 0 l10 '+(tBot-tTop+24)+' h-100 z" fill="#4b3f58"/><path d="M-22 '+tTop+' q22 -8 44 0 l2 '+(tBot-tTop+18)+' h-48 z" fill="'+sh+'"/>';
 else if(o.who==='jun')S+='<path d="M-40 '+tTop+' q40 -16 80 0 l6 '+(tBot-tTop+6)+' h-92 z" fill="'+sh+'" stroke="'+dk+'" stroke-width="2"/><path d="M-18 '+(tTop+50)+' h36 v26 h-36z" fill="'+shade(sh,-14)+'"/><path d="M-10 '+(tTop+2)+' v24 M10 '+(tTop+2)+' v24" stroke="#ddd" stroke-width="2"/>';
 else S+='<path d="M-40 '+tTop+' q40 -16 80 0 l6 '+(tBot-tTop+6)+' h-92 z" fill="'+sh+'" stroke="'+dk+'" stroke-width="2"/><path d="M-14 '+(tTop+2)+' l14 18 l14 -18" fill="none" stroke="#fff" stroke-width="5"/>';
 var ay=tTop+60;
 if(o.hold==='map'||o.hold==='card'){
  S+='<path d="M-40 '+(tTop+10)+' q-14 40 2 '+(ay-tTop)+'" stroke="'+sh+'" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M40 '+(tTop+10)+' q14 40 -2 '+(ay-tTop)+'" stroke="'+sh+'" stroke-width="16" fill="none" stroke-linecap="round"/>';
  S+='<g transform="translate(0,'+(ay+4)+')">'+(o.hold==='card'?'<g transform="scale(1.5) translate(-18,8)">'+cardProp("#fff6cf")+'</g>':mapProp())+'</g><circle cx="-44" cy="'+(ay+4)+'" r="8" fill="'+sk+'"/><circle cx="44" cy="'+(ay+4)+'" r="8" fill="'+sk+'"/>';}
 else{S+='<path d="M-40 '+(tTop+8)+' q-16 50 -6 '+(ay+20-tTop)+'" stroke="'+sh+'" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="-46" cy="'+(ay+26)+'" r="8" fill="'+sk+'"/>';
  if(o.point)S+='<path d="M40 '+(tTop+12)+' l52 -10" stroke="'+sh+'" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="96" cy="'+(tTop+1)+'" r="8" fill="'+sk+'"/><path d="M100 '+(tTop+1)+' h12" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>';
  else S+='<path d="M40 '+(tTop+8)+' q16 50 6 '+(ay+20-tTop)+'" stroke="'+sh+'" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="46" cy="'+(ay+26)+'" r="8" fill="'+sk+'"/>';}
 S+='<rect x="-8" y="'+(hd+20)+'" width="16" height="16" fill="'+sk+'"/>';
 if(P.hair==='hijab')S+='<path d="M-40 '+(hd+10)+' q0 -50 40 -50 q40 0 40 50 q4 34 -14 48 h-52 q-18 -14 -14 -48z" fill="'+hc+'"/>';
 if(P.hair==='long')S+='<path d="M-34 '+(hd-6)+' q-6 60 4 84 h60 q10 -24 4 -84z" fill="'+hc+'"/>';
 S+='<ellipse cx="0" cy="'+hd+'" rx="30" ry="34" fill="'+sk+'"/>';
 if(P.hair==='hijab')S+='<path d="M-34 '+(hd-4)+' q2 -40 34 -40 q32 0 34 40 q-6 -26 -34 -28 q-28 2 -34 28z" fill="'+hc+'"/>';
 else if(P.hair==='long')S+='<path d="M-32 '+(hd-2)+' q2 -38 32 -38 q30 0 32 38 q-14 -20 -32 -22 q-12 6 -32 22z" fill="'+hc+'"/>';
 else if(P.hair==='curly'){[[-26,-26],[-14,-34],[0,-37],[14,-35],[26,-28],[32,-14],[-32,-12],[-6,-28],[10,-26]].forEach(function(p){S+='<circle cx="'+p[0]+'" cy="'+(hd+p[1])+'" r="10" fill="'+hc+'"/>';});}
 else if(P.hair==='wavy')S+='<path d="M-33 '+(hd-2)+' q-2 -36 33 -38 q35 2 33 38 q-8 -10 -14 -6 q-6 -14 -19 -10 q-13 -4 -19 10 q-6 -4 -14 6z" fill="'+hc+'"/>';
 else S+='<path d="M-31 '+(hd-4)+' q0 -34 31 -34 q31 0 31 34 q-12 -12 -31 -14 q-19 2 -31 14z" fill="'+hc+'"/>';
 var e=o.expr||'smile';
 S+='<ellipse cx="-12" cy="'+(hd+2)+'" rx="5" ry="6" fill="#fff"/><ellipse cx="12" cy="'+(hd+2)+'" rx="5" ry="6" fill="#fff"/><circle cx="-11" cy="'+(hd+4)+'" r="3.2" fill="#1c1512"/><circle cx="13" cy="'+(hd+4)+'" r="3.2" fill="#1c1512"/>';
 if(P.glasses)S+='<circle cx="-12" cy="'+(hd+3)+'" r="9" fill="none" stroke="#222" stroke-width="2.4"/><circle cx="12" cy="'+(hd+3)+'" r="9" fill="none" stroke="#222" stroke-width="2.4"/><path d="M-3 '+(hd+3)+' h6" stroke="#222" stroke-width="2.4"/>';
 S+=e==='worried'?'<path d="M-19 '+(hd-10)+' l11 -4 M8 '+(hd-14)+' l11 4" stroke="#1c1512" stroke-width="3" stroke-linecap="round"/><path d="M-8 '+(hd+22)+' q8 -6 16 0" stroke="#5a2a1c" stroke-width="3" fill="none" stroke-linecap="round"/>':
  e==='open'?'<path d="M-19 '+(hd-12)+' q7 -5 14 0 M5 '+(hd-12)+' q7 -5 14 0" stroke="#1c1512" stroke-width="3" fill="none"/><path d="M-9 '+(hd+16)+' q9 12 18 0z" fill="#5a2a1c"/>':
  '<path d="M-19 '+(hd-10)+' q7 -5 14 0 M5 '+(hd-10)+' q7 -5 14 0" stroke="#1c1512" stroke-width="3" fill="none"/><path d="M-10 '+(hd+16)+' q10 9 20 0" stroke="#5a2a1c" stroke-width="3" fill="none" stroke-linecap="round"/>';
 S+='<ellipse cx="-20" cy="'+(hd+14)+'" rx="5" ry="3" fill="#e89a8a" opacity=".5"/><ellipse cx="20" cy="'+(hd+14)+'" rx="5" ry="3" fill="#e89a8a" opacity=".5"/>';
 if(o.bubble)S+='<g transform="translate(40,'+(hd-70)+')"><circle r="20" fill="#fff" stroke="#1c2640" stroke-width="3"/><circle cx="-16" cy="22" r="4" fill="#fff" stroke="#1c2640" stroke-width="2"/><text y="10" font-family="Nunito,Arial" font-weight="900" font-size="28" text-anchor="middle" fill="#d9567f">?</text></g>';
 return S+'</g>';}
function floorP(c1,c2,y0){y0=y0||300;var s='<path d="M0 '+y0+' H800 V420 H0z" fill="'+c1+'"/>';for(var i=0;i<12;i++)s+='<path d="M'+(i*80-40)+' 420 L'+(400+(i*80-440)*.45)+' '+y0+'" stroke="'+c2+'" stroke-width="2"/>';[y0+18,y0+40,y0+68,y0+104].forEach(function(y){if(y<420)s+='<path d="M0 '+y+' H800" stroke="'+c2+'" stroke-width="2"/>';});return s;}
function cardProp(f){return '<g transform="rotate(-8)"><rect x="-6" y="-34" width="46" height="34" rx="2" fill="'+(f||'#ffd6e0')+'" stroke="#7a1f3d" stroke-width="2.5"/><path d="M17 -34 v34" stroke="#e7a6b8" stroke-width="2"/>'+
 '<path d="M28 -22 c-3 -5 -10 -2 -7 3 l7 7 7 -7 c3 -5 -4 -8 -7 -3z" fill="#d9567f"/><path d="M-1 -26 h12 M-1 -20 h12 M-1 -14 h9" stroke="#b5476b" stroke-width="1.6"/></g>';}
/* ---------- Taste Test drawings (T-418). Word and candy pictures are 200×160; the scene is 800×420. ---------- */
function svg(w,h,label,inner){return '<svg viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+label+'">'+inner+'</svg>';}
/* a wooden tabletop under a soft wall: every food picture sits on it */
function tbl(wall){wall=wall||'#eaf3fb';var s='<rect width="200" height="160" fill="'+wall+'"/><rect y="0" width="200" height="6" fill="rgba(255,255,255,.6)"/>'+
 '<path d="M0 112 H200 V160 H0z" fill="#d6a46a"/><path d="M0 112 H200" stroke="#a8743c" stroke-width="3"/>';
 for(var i=0;i<5;i++)s+='<path d="M'+(i*46-10)+' 122 q30 -4 60 2 M'+(i*46+8)+' 140 q26 3 52 -2" stroke="#c18c52" stroke-width="1.6" fill="none"/>';
 return s+'<ellipse cx="160" cy="150" rx="5" ry="2" fill="#b98247"/>';}
function shadow(cx,cy,rx){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+(rx*0.18)+'" fill="rgba(60,30,0,.22)"/>';}
/* small face for feelings: m = sweet | sour | bitter | spicy | yum | wow */
function face(x,y,r,m,skin){skin=skin||'#f2cba6';var s='<g transform="translate('+x+','+y+')"><circle r="'+r+'" fill="'+skin+'" stroke="#8a5a3a" stroke-width="1.6"/>';
 var e=r*0.35,ey=-r*0.15;
 if(m==='sour')s+='<path d="M'+(-e-5)+' '+(ey-2)+' l8 3 M'+(e+5)+' '+(ey-2)+' l-8 3" stroke="#3a2a1a" stroke-width="2.4" stroke-linecap="round"/><path d="M'+(-e-4)+' '+(ey+3)+' l7 0 M'+(e-3)+' '+(ey+3)+' l7 0" stroke="#3a2a1a" stroke-width="2.4"/><ellipse cx="0" cy="'+(r*0.45)+'" rx="'+(r*0.14)+'" ry="'+(r*0.12)+'" fill="#7a2e1c"/><path d="M'+(-r*0.75)+' '+(-r*0.75)+' l-5 -5 M'+(r*0.75)+' '+(-r*0.75)+' l5 -5" stroke="#6aa0d8" stroke-width="2"/>';
 else if(m==='bitter')s+='<path d="M'+(-e-5)+' '+(ey-6)+' l9 4 M'+(e+5)+' '+(ey-6)+' l-9 4" stroke="#3a2a1a" stroke-width="2.4" stroke-linecap="round"/><circle cx="'+(-e)+'" cy="'+ey+'" r="2.4" fill="#3a2a1a"/><circle cx="'+e+'" cy="'+ey+'" r="2.4" fill="#3a2a1a"/><path d="M'+(-r*0.38)+' '+(r*0.5)+' q'+(r*0.38)+' -'+(r*0.3)+' '+(r*0.76)+' 0" stroke="#7a2e1c" stroke-width="2.6" fill="none"/><path d="M'+(r*0.2)+' '+(r*0.55)+' q4 6 0 10" stroke="#5aa04a" stroke-width="2.4" fill="none"/>';
 else if(m==='spicy')s+='<circle r="'+r+'" fill="#f08a6a" opacity=".55"/><path d="M'+(-e-4)+' '+ey+' q4 -4 8 0 M'+(e-4)+' '+ey+' q4 -4 8 0" stroke="#3a2a1a" stroke-width="2.4" fill="none"/><ellipse cx="0" cy="'+(r*0.42)+'" rx="'+(r*0.3)+'" ry="'+(r*0.24)+'" fill="#7a1c10"/><path d="M-4 '+(r*0.5)+' q4 6 8 0" fill="#e85a6a"/><path d="M'+(r*0.85)+' '+(-r*0.2)+' q4 8 0 12 q-4 -4 0 -12" fill="#7fc4ee"/>';
 else if(m==='wow')s+='<circle cx="'+(-e)+'" cy="'+ey+'" r="3.4" fill="#3a2a1a"/><circle cx="'+e+'" cy="'+ey+'" r="3.4" fill="#3a2a1a"/><ellipse cx="0" cy="'+(r*0.42)+'" rx="'+(r*0.16)+'" ry="'+(r*0.2)+'" fill="#7a2e1c"/>';
 else s+='<path d="M'+(-e-4)+' '+ey+' q4 -5 8 0 M'+(e-4)+' '+ey+' q4 -5 8 0" stroke="#3a2a1a" stroke-width="2.4" fill="none"/><path d="M'+(-r*0.4)+' '+(r*0.3)+' q'+(r*0.4)+' '+(r*0.4)+' '+(r*0.8)+' 0" stroke="#7a2e1c" stroke-width="2.6" fill="'+(m==='yum'?'#c4524a':'none')+'"/>'+(m==='yum'?'<path d="M2 '+(r*0.42)+' q6 4 6 -2" fill="#e88a9a"/>':'');
 return s+'<ellipse cx="'+(-r*0.62)+'" cy="'+(r*0.2)+'" rx="'+(r*0.16)+'" ry="'+(r*0.09)+'" fill="#e89a8a" opacity=".6"/><ellipse cx="'+(r*0.62)+'" cy="'+(r*0.2)+'" rx="'+(r*0.16)+'" ry="'+(r*0.09)+'" fill="#e89a8a" opacity=".6"/></g>';}
function sparkle(x,y,s,c){return '<path transform="translate('+x+','+y+') scale('+s+')" d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4Z" fill="'+(c||'#fff')+'"/>';}
function lollipop(x,y,s,c1,c2){c1=c1||'#e94b6a';c2=c2||'#fff';var g='<g transform="translate('+x+','+y+') scale('+s+')"><rect x="-3" y="0" width="6" height="70" rx="3" fill="#f5efe2" stroke="#c9bfa8"/><circle r="34" fill="'+c1+'" stroke="'+shade(c1,-50)+'" stroke-width="2.5"/>';
 for(var i=0;i<4;i++)g+='<path d="M0 0 m'+(-30+i*4)+' 0 a'+(30-i*7)+' '+(30-i*7)+' 0 1 1 '+(2*(30-i*7))+' 0" fill="none" stroke="'+c2+'" stroke-width="5" opacity=".85" transform="rotate('+(i*45)+')"/>';
 return g+'<ellipse cx="-12" cy="-16" rx="9" ry="5" fill="#fff" opacity=".55" transform="rotate(-30 -12 -16)"/></g>';}
function gummy(x,y,s,c,rot){c=c||'#e8433f';var d=shade(c,-45);return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+s+')"><circle cx="-11" cy="-30" r="7" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><circle cx="11" cy="-30" r="7" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/>'+
 '<circle cy="-20" r="15" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><ellipse cy="8" rx="19" ry="22" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><ellipse cx="-17" cy="-2" rx="6" ry="8" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><ellipse cx="17" cy="-2" rx="6" ry="8" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/>'+
 '<ellipse cx="-10" cy="28" rx="8" ry="6" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><ellipse cx="10" cy="28" rx="8" ry="6" fill="'+c+'" stroke="'+d+'" stroke-width="1.5"/><circle cx="-5" cy="-23" r="1.8" fill="'+d+'"/><circle cx="5" cy="-23" r="1.8" fill="'+d+'"/><ellipse cy="-15" rx="3.4" ry="2.4" fill="'+d+'"/>'+
 '<ellipse cx="-7" cy="0" rx="4" ry="9" fill="#fff" opacity=".4"/><ellipse cx="-8" cy="-26" rx="3" ry="4" fill="#fff" opacity=".45"/></g>';}
function chip(x,y,s,rot,c){c=c||'#f1c45a';return '<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+s+')"><path d="M-30 4 C-28 -16 -6 -24 14 -20 C30 -16 34 0 26 12 C14 24 -16 24 -28 14 Z" fill="'+c+'" stroke="'+shade(c,-60)+'" stroke-width="2"/>'+
 '<path d="M-18 -6 q8 -6 18 -3 M-12 8 q10 4 22 -2" stroke="'+shade(c,-25)+'" stroke-width="2" fill="none"/><circle cx="-8" cy="-10" r="2.4" fill="#c4682e" opacity=".6"/><circle cx="10" cy="4" r="2" fill="#c4682e" opacity=".55"/><circle cx="-14" cy="6" r="1.6" fill="#c4682e" opacity=".55"/>'+
 '<path d="M-6 -2 l2 2 M4 -12 l2 2 M16 -6 l1.5 1.5 M-20 0 l2 1" stroke="#fff" stroke-width="2"/></g>';}
function popcornPiece(x,y,s){return '<g transform="translate('+x+','+y+') scale('+s+')"><circle cx="-6" cy="0" r="8" fill="#fff8e6" stroke="#d9b56c" stroke-width="1.2"/><circle cx="6" cy="-2" r="8" fill="#fffbef" stroke="#d9b56c" stroke-width="1.2"/><circle cx="0" cy="-9" r="7" fill="#fff8e6" stroke="#d9b56c" stroke-width="1.2"/><circle cx="1" cy="6" r="5" fill="#f2d07a"/></g>';}
function candyBar(x,y,s){var g='<g transform="translate('+x+','+y+') scale('+s+')"><path d="M-62 -22 h70 v44 h-70z" fill="#6b3a1e" stroke="#3f200e" stroke-width="2"/>';
 for(var i=0;i<3;i++)for(var j=0;j<2;j++)g+='<rect x="'+(-58+i*22)+'" y="'+(-18+j*20)+'" width="18" height="16" rx="2" fill="#7d4524" stroke="#4d2611" stroke-width="1.4"/><path d="M'+(-56+i*22)+' '+(-16+j*20)+' h14" stroke="#9a5d36" stroke-width="2"/>';
 g+='<path d="M8 -26 h56 v52 h-56z" fill="#c8102e" stroke="#7d0a1d" stroke-width="2"/><path d="M8 -26 l-6 8 l6 6 l-6 8 l6 6 l-6 8 l6 6 l-6 8 l6 8" fill="#c8102e" stroke="#7d0a1d" stroke-width="2"/>'+
 '<path d="M8 -26 h56 v14 h-56z" fill="#e8c55a"/><path d="M8 -12 h56" stroke="#a88a2e" stroke-width="2"/><text x="36" y="12" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="13" fill="#fff">CHOCO</text></g>';return g;}
function mintDisk(x,y,s){var g='<g transform="translate('+x+','+y+') scale('+s+')"><circle r="22" fill="#fff" stroke="#b9c6c2" stroke-width="2"/>';
 for(var i=0;i<8;i++)g+='<path d="M0 0 L'+(22*Math.cos(i*Math.PI/4))+' '+(22*Math.sin(i*Math.PI/4))+' A22 22 0 0 1 '+(22*Math.cos((i+.5)*Math.PI/4))+' '+(22*Math.sin((i+.5)*Math.PI/4))+'Z" fill="#e23b3b"/>';
 return g+'<circle r="7" fill="#fff"/><path d="M-30 -8 l-8 -6 l0 28 l8 -6z M30 -8 l8 -6 l0 28 l-8 -6z" fill="#e8f2ef" stroke="#b9c6c2" stroke-width="1.6"/><ellipse cx="-8" cy="-10" rx="6" ry="3" fill="#fff" opacity=".8"/></g>';}
function caramelCube(x,y,s){return '<g transform="translate('+x+','+y+') scale('+s+')"><path d="M-18 -10 l18 -9 l18 9 l-18 9z" fill="#e3a24e"/><path d="M-18 -10 v20 l18 9 v-20z" fill="#b8742c"/><path d="M18 -10 v20 l-18 9 v-20z" fill="#cc8a3b"/><path d="M-10 -12 l8 -4" stroke="#f6d39a" stroke-width="3" stroke-linecap="round"/></g>';}
function sourStrip(x,y,s,rot){var cs=['#e8433f','#f29a2e','#f4d23a','#5cbf4c','#3b8fd9'],g='<g transform="translate('+x+','+y+') rotate('+(rot||0)+') scale('+s+')">';
 cs.forEach(function(c,i){g+='<rect x="-60" y="'+(-15+i*6)+'" width="120" height="6" fill="'+c+'"/>';});g+='<rect x="-60" y="-15" width="120" height="30" rx="4" fill="none" stroke="#7a5a2a" stroke-width="1.4"/>';
 for(var k=0;k<40;k++)g+='<circle cx="'+(-56+((k*37)%112))+'" cy="'+(-13+((k*13)%27))+'" r="1.2" fill="#fff" opacity=".9"/>';return g+'</g>';}
function lemon(x,y,s){var g='<g transform="translate('+x+','+y+') scale('+s+')"><circle r="30" fill="#f6dd4a" stroke="#c9a51e" stroke-width="3"/><circle r="25" fill="#fbf0a4"/>';
 for(var i=0;i<8;i++)g+='<path d="M0 0 L'+(23*Math.cos(i*Math.PI/4+.2))+' '+(23*Math.sin(i*Math.PI/4+.2))+' A23 23 0 0 1 '+(23*Math.cos((i+1)*Math.PI/4-.2))+' '+(23*Math.sin((i+1)*Math.PI/4-.2))+'Z" fill="#f7e46c" stroke="#fff6c8" stroke-width="2"/>';
 return g+'<circle r="3" fill="#fff6c8"/><ellipse cx="-6" cy="8" rx="2" ry="4" fill="#fff" opacity=".7" transform="rotate(30)"/></g>';}
function bowl(x,y,w,c){c=c||'#3d7cc9';return '<g transform="translate('+x+','+y+')"><path d="M'+(-w)+' 0 q0 '+(w*.55)+' '+w+' '+(w*.55)+' q'+w+' 0 '+w+' -'+(w*.55)+'z" fill="'+c+'" stroke="'+shade(c,-50)+'" stroke-width="2.4"/><ellipse cx="0" cy="0" rx="'+w+'" ry="'+(w*.16)+'" fill="'+shade(c,-25)+'" stroke="'+shade(c,-50)+'" stroke-width="2"/><path d="M'+(-w*.7)+' '+(w*.18)+' q'+(w*.2)+' '+(w*.22)+' '+(w*.5)+' '+(w*.28)+'" stroke="#fff" stroke-width="3" fill="none" opacity=".45"/></g>';}

var TASTE_ART={
 /* ---------------- word pictures ---------------- */
 sweet:function(){return svg(200,160,'sweet',tbl('#fde8ef')+shadow(70,134,34)+lollipop(70,64,0.95)+
  '<g transform="translate(140,118)"><path d="M-22 -14 l14 -6 l14 6 l-14 6z" fill="#fff" stroke="#c9c2b6"/><path d="M-22 -14 v14 l14 6 v-14z" fill="#f2efe8" stroke="#c9c2b6"/><path d="M6 -14 v14 l-14 6 v-14z" fill="#e6e1d6" stroke="#c9c2b6"/>'+
  '<path d="M4 -30 l12 -6 l12 6 l-12 6z" fill="#fff" stroke="#c9c2b6"/><path d="M4 -30 v12 l12 6 v-12z" fill="#f2efe8" stroke="#c9c2b6"/><path d="M28 -30 v12 l-12 6 v-12z" fill="#e6e1d6" stroke="#c9c2b6"/></g>'+
  face(150,48,22,'yum')+'<path d="M126 50 q-10 0 -18 10" stroke="#d9567f" stroke-width="2" fill="none" stroke-dasharray="3 3"/>'+sparkle(178,24,.7,'#f2c230')+sparkle(30,26,.6,'#f2c230'));},
 sour:function(){return svg(200,160,'sour',tbl('#fbf7d6')+shadow(62,134,32)+lemon(62,104,1.05)+
  '<g transform="translate(40,128)"><path d="M-8 0 q8 -24 30 -22 q4 14 -6 24z" fill="#f6dd4a" stroke="#c9a51e" stroke-width="2"/></g>'+face(146,62,30,'sour')+
  '<path d="M106 40 l-10 -6 M110 26 l-12 -2 M182 40 l10 -6 M178 26 l12 -2" stroke="#c9412e" stroke-width="3" stroke-linecap="round"/>'+'<path d="M120 102 q26 -8 52 0" stroke="#c9a51e" stroke-width="2" fill="none" stroke-dasharray="4 3"/>');},
 salty:function(){var s=tbl('#eef3f4')+bowl(80,108,52,'#c9412e');for(var i=0;i<6;i++)s+=chip(48+i*13,104-(i%2)*8,0.55,i*30-40);
  s+='<g transform="translate(158,82) rotate(-25)"><rect x="-14" y="-6" width="28" height="44" rx="7" fill="#f5f7f8" stroke="#8a9aa6" stroke-width="2.4"/><rect x="-14" y="-6" width="28" height="44" rx="7" fill="url(#none)"/><path d="M-14 -6 q14 -16 28 0z" fill="#b9c4cc" stroke="#8a9aa6" stroke-width="2"/>'+
   '<circle cx="-5" cy="-11" r="1.4" fill="#5d6b75"/><circle cx="0" cy="-13" r="1.4" fill="#5d6b75"/><circle cx="5" cy="-11" r="1.4" fill="#5d6b75"/><text x="0" y="22" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="11" fill="#5d6b75">SALT</text><ellipse cx="-7" cy="10" rx="3" ry="10" fill="#fff" opacity=".7"/></g>';
  for(var k=0;k<14;k++)s+='<rect x="'+(108+((k*7)%30))+'" y="'+(52+((k*11)%40))+'" width="2.6" height="2.6" fill="#fff" stroke="#9aa8b2" stroke-width=".6" transform="rotate(20 120 70)"/>';
  return svg(200,160,'salty',s);},
 bitter:function(){return svg(200,160,'bitter',tbl('#efe6dc')+shadow(58,136,34)+
  '<g transform="translate(58,112)"><path d="M-26 -34 h48 l-6 42 q-18 8 -36 0z" fill="#fff" stroke="#8a7a6a" stroke-width="2.4"/><ellipse cx="-2" cy="-34" rx="24" ry="6" fill="#4a2a17" stroke="#8a7a6a" stroke-width="2"/><path d="M22 -26 q16 0 14 14 q-2 12 -18 10" fill="none" stroke="#8a7a6a" stroke-width="5"/>'+
  '<path d="M-10 -48 q-6 -10 2 -18 q6 -8 0 -16 M4 -48 q-6 -10 2 -18 q6 -8 0 -16" stroke="#b5a796" stroke-width="2.4" fill="none" opacity=".8"/><ellipse cx="-2" cy="12" rx="34" ry="5" fill="#f5efe4" stroke="#b5a796"/></g>'+
  '<g transform="translate(136,120) rotate(-8)"><rect x="-30" y="-12" width="60" height="22" fill="#3b1d0e" stroke="#1c0c04" stroke-width="2"/><path d="M-10 -12 v22 M10 -12 v22 M-30 -1 h60" stroke="#1c0c04" stroke-width="1.6"/><path d="M-26 -9 h12 M-6 -9 h12 M14 -9 h12" stroke="#5a301a" stroke-width="2"/><text x="0" y="24" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="9" fill="#3b1d0e">90% cacao</text></g>'+
  face(150,50,26,'bitter'));},
 spicy:function(){var s=tbl('#fdeae2');s+=shadow(70,136,40)+'<g transform="translate(70,104) rotate(-20)"><path d="M-46 4 C-30 -22 20 -26 40 -8 C50 2 46 14 36 12 C14 6 -18 18 -46 4Z" fill="#d7261e" stroke="#7d0e09" stroke-width="2.4"/>'+
  '<path d="M-30 -6 C-10 -16 14 -16 30 -8" stroke="#ff7a6a" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/><path d="M38 -6 q10 -12 4 -24" stroke="#3f8a2a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M34 -10 q8 -2 12 6" fill="#4ea33a"/></g>';
  [[28,62],[50,46],[72,58]].forEach(function(p,i){s+='<path transform="translate('+p[0]+','+p[1]+')" d="M0 14 C-10 4 -4 -6 0 -14 C2 -6 10 -2 6 8 C5 12 2 14 0 14Z" fill="#f29a2e" stroke="#d7261e" stroke-width="1.6"/><path transform="translate('+p[0]+','+(p[1]+4)+')" d="M0 8 C-4 4 -2 0 0 -4 C2 0 4 4 0 8Z" fill="#f4d23a"/>';});
  return svg(200,160,'spicy',s+face(150,58,30,'spicy')+'<path d="M134 96 q-4 8 0 12 M150 98 q-4 10 0 14 M166 96 q-4 8 0 12" stroke="#c9412e" stroke-width="2.4" fill="none" stroke-linecap="round"/>');},
 buttery:function(){var s=tbl('#fff6dc');s+=shadow(76,140,44)+'<g transform="translate(76,110)"><path d="M-38 -38 l8 66 h60 l8 -66z" fill="#fff" stroke="#c9412e" stroke-width="2.4"/>';
  for(var i=0;i<5;i++)s+='<path d="M'+(-36+i*16)+' -38 l'+(4+i*0.6)+' 66 h8 l'+(-3+i*0.6)+' -66z" fill="#e8433f"/>';s+='</g>';
  for(var k=0;k<16;k++)s+=popcornPiece(46+((k*17)%62),66-((k*7)%22)+(k>10?-8:0),0.75+((k%3)*0.08));
  s+='<g transform="translate(150,124)"><path d="M-22 -10 h40 l6 10 h-52z" fill="#fbe27a" stroke="#c9a51e" stroke-width="2"/><path d="M-28 0 h52 v8 h-52z" fill="#f4d23a" stroke="#c9a51e" stroke-width="2"/><path d="M-10 -10 q6 -4 14 0" stroke="#fff6c8" stroke-width="3"/></g>'+
  '<path d="M98 56 q6 10 0 16 q-4 -6 0 -16z M60 52 q5 8 0 14 q-4 -6 0 -14z" fill="#f4c430" opacity=".9"/>'+face(160,52,22,'yum');return svg(200,160,'buttery',s);},
 crunchy:function(){var s=tbl('#eaf6e6');s+=shadow(80,138,38)+'<g transform="translate(80,96)"><path d="M0 -30 C-34 -42 -46 -6 -38 18 C-30 42 -8 46 0 38 C8 46 30 42 38 18 C46 -6 34 -42 0 -30Z" fill="#d6332c" stroke="#8a1612" stroke-width="2.4"/>'+
  '<path d="M38 -6 C30 -2 26 6 30 14 C24 18 22 26 28 32 L40 18 C44 6 42 -2 38 -6Z" fill="#fbf3d6" stroke="#c9b48a" stroke-width="1.6"/><circle cx="33" cy="10" r="1.6" fill="#5a3a1a"/><circle cx="34" cy="22" r="1.4" fill="#5a3a1a"/>'+
  '<path d="M0 -30 q2 -12 8 -18" stroke="#6b4423" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M6 -40 q16 -12 26 -2 q-14 8 -26 2z" fill="#5cbf4c" stroke="#2f7d4f"/><ellipse cx="-18" cy="-14" rx="7" ry="12" fill="#fff" opacity=".35" transform="rotate(20 -18 -14)"/></g>'+
  '<g font-family="Nunito,Arial" font-weight="900" fill="#c9412e"><text x="116" y="50" font-size="20" transform="rotate(-8 150 44)">CRUNCH!</text></g><path d="M126 70 l14 -6 M130 84 l16 0 M126 98 l14 6" stroke="#c9412e" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M150 104 l3 -4 M160 110 l5 -2 M152 118 l4 2" stroke="#fbf3d6" stroke-width="3"/>';return svg(200,160,'crunchy',s);},
 crispy:function(){var s=tbl('#fdf3e1');s+=shadow(100,138,46)+chip(76,108,1.15,-14)+'<g transform="translate(134,92) rotate(16)"><path d="M-22 4 C-20 -12 0 -18 14 -14 L4 -2 L12 6 L2 14 C-10 18 -20 14 -22 4Z" fill="#f1c45a" stroke="#a8742c" stroke-width="2"/><circle cx="-8" cy="-4" r="2" fill="#c4682e" opacity=".6"/></g>'+
  '<g transform="translate(158,104) rotate(-20)"><path d="M0 -10 L18 -6 L10 4 L20 14 C8 18 -2 12 0 -10Z" fill="#f1c45a" stroke="#a8742c" stroke-width="2"/></g>'+
  '<path d="M150 88 l6 -10 M160 92 l10 -6 M146 112 l-6 6" stroke="#a8742c" stroke-width="2.4" stroke-linecap="round"/>'+'<circle cx="150" cy="128" r="2" fill="#f1c45a"/><circle cx="166" cy="130" r="1.6" fill="#f1c45a"/><circle cx="140" cy="132" r="1.4" fill="#f1c45a"/>'+
  '<g font-family="Nunito,Arial" font-weight="900" fill="#a8742c" font-size="16"><text x="110" y="44">snap!</text></g>';return svg(200,160,'crispy',s);},
 chewy:function(){var s=tbl('#fdeaf0');s+=shadow(100,138,60)+'<g transform="translate(100,104)"><path d="M-60 -10 q30 -10 60 -4 q30 6 60 -6 l0 22 q-30 10 -60 4 q-30 -6 -60 4z" fill="#ef6b8a" stroke="#a8264a" stroke-width="2.4"/>'+
  '<path d="M-50 -2 q24 -6 50 0 q24 4 50 -4" stroke="#fbb3c6" stroke-width="3" fill="none"/></g>'+gummy(40,98,0.62,'#ef6b8a',-12)+gummy(160,98,0.62,'#ef6b8a',12)+
  '<g transform="translate(40,98) scale(.62)"><circle cx="-24" cy="0" r="9" fill="#f2cba6" stroke="#8a5a3a"/><circle cx="-18" cy="-12" r="8" fill="#f2cba6" stroke="#8a5a3a"/></g><g transform="translate(160,98) scale(.62)"><circle cx="24" cy="0" r="9" fill="#f2cba6" stroke="#8a5a3a"/><circle cx="18" cy="-12" r="8" fill="#f2cba6" stroke="#8a5a3a"/></g>'+
  '<path d="M60 64 l-10 -8 M140 64 l10 -8" stroke="#a8264a" stroke-width="3" stroke-linecap="round"/><g font-family="Nunito,Arial" font-weight="900" fill="#a8264a" font-size="15"><text x="76" y="46">stretch…</text></g>';return svg(200,160,'chewy',s);},
 soft:function(){var s=tbl('#eef0fb');s+=shadow(96,138,48)+'<g transform="translate(96,104)"><path d="M-38 -26 q38 -16 76 0 v40 q-38 22 -76 0z" fill="#fffdf8" stroke="#c9c2b6" stroke-width="2.4"/><ellipse cx="0" cy="-26" rx="38" ry="12" fill="#fff" stroke="#c9c2b6" stroke-width="2.4"/>'+
  '<path d="M-14 -30 q14 14 28 0" fill="#ece6da" stroke="#c9c2b6" stroke-width="1.6"/><ellipse cx="-24" cy="2" rx="6" ry="14" fill="#f4efe6"/></g>'+
  '<g transform="translate(96,54)"><path d="M-12 -40 q-2 30 0 44 q6 6 12 0 q4 -16 2 -44z" fill="#f2cba6" stroke="#8a5a3a" stroke-width="2"/><path d="M-12 -2 q6 4 12 0" stroke="#8a5a3a" stroke-width="1.6" fill="none"/><path d="M-6 -6 h6" stroke="#fff" stroke-width="3" opacity=".6"/></g>'+
  '<path d="M56 72 q-10 -2 -14 -10 M136 72 q10 -2 14 -10" stroke="#8a9ad8" stroke-width="2.4" fill="none" stroke-linecap="round"/><g font-family="Nunito,Arial" font-weight="900" fill="#5a6ac0" font-size="14"><text x="134" y="40">squish</text></g>';return svg(200,160,'soft',s);},
 hard:function(){var s=tbl('#eef3f8');s+=shadow(70,138,30)+'<g transform="translate(70,108)"><path d="M-26 -8 q-6 -20 8 -26 q18 -6 30 4 q14 12 6 28 q-10 16 -30 12 q-14 -4 -14 -18z" fill="#3b8fd9" stroke="#1d4f80" stroke-width="2.4"/>'+
  '<ellipse cx="-8" cy="-16" rx="8" ry="4" fill="#fff" opacity=".7"/>'+sparkle(10,-10,.5)+'</g>'+
  '<g transform="translate(140,80)"><path d="M-18 -26 q-6 30 4 48 q4 8 8 0 l6 -14 l6 14 q4 8 8 0 q10 -18 4 -48 q-18 -10 -36 0z" fill="#fff" stroke="#8a9aa6" stroke-width="2.4"/><path d="M0 -28 l-4 12 l6 6 l-4 10" stroke="#c9412e" stroke-width="2.4" fill="none"/></g>'+
  '<path d="M104 92 l12 -8 M106 104 l14 0" stroke="#5d6b75" stroke-width="3" stroke-linecap="round"/><g font-family="Nunito,Arial" font-weight="900" fill="#1d4f80" font-size="16"><text x="98" y="138">clack!</text></g>';return svg(200,160,'hard',s);},
 sticky:function(){var s=tbl('#fdf1e2');s+=shadow(100,138,40)+caramelCube(100,124,1.4)+
  '<g transform="translate(100,52)"><path d="M-34 -6 q-6 -16 6 -20 q8 -2 10 10 M-16 -8 q-2 -18 8 -20 q10 0 8 18 M4 -8 q2 -18 12 -16 q8 4 4 18 M22 -4 q8 -14 16 -8 q6 8 -4 18" fill="#f2cba6" stroke="#8a5a3a" stroke-width="2"/><path d="M-36 -4 q36 18 74 4 l-6 22 q-30 10 -62 0z" fill="#f2cba6" stroke="#8a5a3a" stroke-width="2"/></g>'+
  '<path d="M80 78 q-4 22 6 38 M96 80 q4 18 -2 34 M112 78 q8 20 0 38 M124 76 q2 16 -4 30" stroke="#d48b33" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M80 78 q-4 22 6 38" stroke="#f3c27a" stroke-width="1.2" fill="none"/>'+
  '<path d="M84 76 q16 6 34 -2" stroke="#d48b33" stroke-width="5" fill="none" stroke-linecap="round"/>';return svg(200,160,'sticky',s);},
 creamy:function(){var s=tbl('#fdeef3');s+=shadow(100,140,30)+'<g transform="translate(100,104)"><path d="M-22 -6 l22 44 l22 -44z" fill="#d9a35a" stroke="#8a5a2a" stroke-width="2.4"/><path d="M-16 0 l32 0 M-12 10 l24 0 M-8 20 l16 0 M-14 -6 l20 40 M14 -6 l-20 40" stroke="#b07a3a" stroke-width="1.4"/>'+
  '<path d="M-28 -8 q-6 -16 8 -20 q-2 -16 18 -16 q4 -14 16 -6 q16 -2 14 14 q12 4 4 18 q-8 10 -60 10z" fill="#f8d4e0" stroke="#c9768f" stroke-width="2.4"/>'+
  '<path d="M-18 -24 q14 -6 30 0 M-20 -12 q20 -6 44 2" stroke="#fff" stroke-width="3" fill="none" opacity=".75"/><circle cx="4" cy="-50" r="6" fill="#d7261e" stroke="#7d0e09"/><path d="M4 -56 q4 -8 10 -8" stroke="#3f8a2a" stroke-width="2" fill="none"/></g>'+
  '<g font-family="Nunito,Arial" font-weight="900" fill="#c9768f" font-size="14"><text x="134" y="56">smooth</text></g><path d="M40 60 q10 -6 20 0 q10 6 20 0" stroke="#c9768f" stroke-width="2.4" fill="none"/>';return svg(200,160,'creamy',s);},
 juicy:function(){var s=tbl('#fff1dc');s+=shadow(80,138,40)+'<g transform="translate(80,100)"><circle r="36" fill="#f39a2b" stroke="#b5620c" stroke-width="3"/><circle r="30" fill="#fbc56a"/>';
  for(var i=0;i<10;i++)s+='<path d="M0 0 L'+(28*Math.cos(i*Math.PI/5+.15))+' '+(28*Math.sin(i*Math.PI/5+.15))+' A28 28 0 0 1 '+(28*Math.cos((i+1)*Math.PI/5-.15))+' '+(28*Math.sin((i+1)*Math.PI/5-.15))+'Z" fill="#fda93a" stroke="#fde2a8" stroke-width="1.6"/>';
  s+='<circle r="4" fill="#fde2a8"/></g>';[[128,70],[146,86],[136,104],[156,60],[120,46]].forEach(function(p,i){s+='<path transform="translate('+p[0]+','+p[1]+') scale('+(0.8+i*0.1)+')" d="M0 -10 C4 -4 8 2 6 6 C4 10 -4 10 -6 6 C-8 2 -4 -4 0 -10Z" fill="#fdb44b" stroke="#d07a12" stroke-width="1.2"/>';});
  s+='<path d="M48 136 q16 6 40 2" stroke="#fdb44b" stroke-width="5" stroke-linecap="round" opacity=".8"/>';return svg(200,160,'juicy',s);},
 shiny:function(){var s=tbl('#eef1fb');s+=shadow(100,136,46)+'<g transform="translate(100,104)"><path d="M-34 -4 l-20 -16 l0 40 l20 -16z M34 -4 l20 -16 l0 40 l-20 -16z" fill="#c8102e" stroke="#7d0a1d" stroke-width="2"/>'+
  '<ellipse rx="36" ry="26" fill="#e8293f" stroke="#7d0a1d" stroke-width="2.4"/><ellipse cx="-12" cy="-10" rx="14" ry="6" fill="#fff" opacity=".85" transform="rotate(-20 -12 -10)"/><ellipse cx="14" cy="10" rx="6" ry="3" fill="#fff" opacity=".45"/></g>'+
  sparkle(58,60,1.1,'#fff6c8')+sparkle(146,56,.9,'#fff6c8')+sparkle(126,82,.6)+sparkle(30,92,.6,'#fff6c8')+
  '<g transform="translate(168,44)"><circle r="14" fill="#f4d23a"/><path d="M-26 0 h-8 M26 0 h8 M0 -26 v-8 M-18 -18 l-6 -6 M18 -18 l6 -6" stroke="#f4d23a" stroke-width="3" stroke-linecap="round"/></g>'+
  '<path d="M156 58 l-36 30" stroke="#f4d23a" stroke-width="3" stroke-dasharray="4 4"/>';return svg(200,160,'shiny',s);},
 colorful:function(){var s=tbl('#f3f0fb'),cs=['#e8433f','#f29a2e','#f4d23a','#5cbf4c','#3b8fd9','#8a5cc9','#ef6b8a','#2ab0a8'];s+=bowl(100,104,62,'#ffffff');
  for(var k=0;k<22;k++){var x=54+((k*29)%92),y=96-((k*13)%22)-(k>14?10:0);s+='<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="6" fill="'+cs[k%cs.length]+'" stroke="'+shade(cs[k%cs.length],-50)+'" stroke-width="1.2" transform="rotate('+(k*23)+' '+x+' '+y+')"/><ellipse cx="'+(x-3)+'" cy="'+(y-2)+'" rx="3" ry="1.5" fill="#fff" opacity=".6"/>';}
  s+='<path d="M20 40 q80 -50 160 0" stroke="#e8433f" stroke-width="5" fill="none"/><path d="M28 44 q72 -42 144 0" stroke="#f4d23a" stroke-width="5" fill="none"/><path d="M36 48 q64 -34 128 0" stroke="#5cbf4c" stroke-width="5" fill="none"/><path d="M44 52 q56 -26 112 0" stroke="#3b8fd9" stroke-width="5" fill="none"/>';
  return svg(200,160,'colorful',s);},
 fruity:function(){var s=tbl('#fdeef0');s+=shadow(100,138,60)+
  '<g transform="translate(52,108)"><path d="M0 -26 C-22 -26 -24 4 0 22 C24 4 22 -26 0 -26Z" fill="#e3263c" stroke="#8a0f1e" stroke-width="2.4"/><path d="M-12 -30 l12 6 l12 -6 l-6 -8 l-6 4 l-6 -4z" fill="#3f8a2a"/>';
  for(var k=0;k<10;k++)s+='<ellipse cx="'+(-12+((k*7)%24))+'" cy="'+(-16+((k*9)%30))+'" rx="1.4" ry="2.2" fill="#f4d23a"/>';
  s+='</g><g transform="translate(150,104)"><circle cx="-10" cy="-8" r="10" fill="#7b3fb8" stroke="#3f1d66" stroke-width="1.6"/><circle cx="8" cy="-8" r="10" fill="#8a4cc9" stroke="#3f1d66" stroke-width="1.6"/><circle cx="-2" cy="8" r="10" fill="#7b3fb8" stroke="#3f1d66" stroke-width="1.6"/><circle cx="-18" cy="10" r="9" fill="#8a4cc9" stroke="#3f1d66" stroke-width="1.6"/><circle cx="14" cy="10" r="9" fill="#7b3fb8" stroke="#3f1d66" stroke-width="1.6"/><path d="M-2 -18 q2 -14 12 -18" stroke="#6b4423" stroke-width="3" fill="none"/><ellipse cx="-12" cy="-12" rx="3" ry="2" fill="#fff" opacity=".5"/></g>'+
  gummy(100,112,0.5,'#f29a2e',0)+'<path d="M84 52 q8 -10 16 0 q8 10 16 0 M88 40 q6 -8 12 0" stroke="#e3263c" stroke-width="2.4" fill="none" opacity=".7"/>'+
  '<g transform="translate(100,30)"><path d="M-8 0 q-6 -10 0 -14 q6 4 0 14z M8 0 q6 -10 0 -14 q-6 4 0 14z" fill="#e3263c" opacity=".55"/></g>';return svg(200,160,'fruity',s);},
 minty:function(){var s=tbl('#e6f7f1');s+=shadow(74,140,34)+mintDisk(74,118,1.05)+
  '<g transform="translate(150,104)"><path d="M0 30 C-30 10 -26 -24 0 -36 C26 -24 30 10 0 30Z" fill="#3fae6a" stroke="#1f6b3e" stroke-width="2.4"/><path d="M0 30 V-32 M0 -10 l-12 -10 M0 6 l-14 -8 M0 -10 l12 -10 M0 6 l14 -8" stroke="#1f6b3e" stroke-width="1.8" fill="none"/></g>'+
  face(70,52,22,'wow')+'<path d="M92 50 q12 -4 22 4 q10 8 24 0 M94 60 q14 -2 24 6 q10 6 22 -2 M92 42 q10 -6 22 -2" stroke="#7fd4ee" stroke-width="3" fill="none" stroke-linecap="round"/>'+
  sparkle(150,40,.7,'#bfeaf8')+sparkle(176,62,.5,'#bfeaf8')+'<g transform="translate(176,30)"><path d="M0 -8 v16 M-7 -4 l14 8 M-7 4 l14 -8" stroke="#7fd4ee" stroke-width="2.4" stroke-linecap="round"/></g>';return svg(200,160,'minty',s);},

 /* ---------------- candies for the lab (200×160) ---------------- */
 c_gummy:function(){var s=tbl('#fdeaf0')+bowl(100,110,58,'#f6f2ea'),cs=['#e8433f','#f29a2e','#f4d23a','#5cbf4c','#ef6b8a','#3b8fd9'];
  for(var k=0;k<7;k++)s+=gummy(62+k*13,92-(k%2)*12,0.46,cs[k%cs.length],(k%3-1)*14);return svg(200,160,'gummy bears',s+gummy(160,128,0.42,'#5cbf4c',20));},
 c_lolly:function(){return svg(200,160,'lollipop',tbl('#eaf3fb')+shadow(100,138,40)+'<g transform="rotate(-18 100 80)">'+lollipop(100,58,1,'#8a5cc9','#f4d23a')+'</g>'+lollipop(44,96,0.45,'#e94b6a')+'<g transform="translate(150,120) rotate(40)">'+lollipop(0,0,0.45,'#2ab0a8')+'</g>');},
 c_choco:function(){return svg(200,160,'chocolate bar',tbl('#f3ebe2')+shadow(100,134,70)+'<g transform="rotate(-6 100 100)">'+candyBar(100,100,1.25)+'</g>'+'<g transform="translate(40,134) rotate(10)"><rect x="-10" y="-8" width="18" height="16" rx="2" fill="#7d4524" stroke="#4d2611" stroke-width="1.4"/></g>');},
 c_sourstrip:function(){var s=tbl('#fbf7d6')+shadow(100,138,64);s+=sourStrip(100,118,1.2,-6)+sourStrip(104,94,1.05,8)+sourStrip(96,72,0.9,-12);return svg(200,160,'sour strips',s+lemon(170,40,0.45));},
 c_mint:function(){return svg(200,160,'mints',tbl('#e6f7f1')+shadow(100,138,60)+mintDisk(64,112,0.9)+mintDisk(118,120,0.9)+mintDisk(150,96,0.75)+mintDisk(92,84,0.7));},
 c_caramel:function(){var s=tbl('#fdf1e2')+shadow(100,138,60);[[60,122],[100,126],[140,122],[80,100],[120,100],[100,78]].forEach(function(p){s+=caramelCube(p[0],p[1],1.1);});
  return svg(200,160,'caramel',s+'<path d="M120 100 q10 -20 30 -24" stroke="#d48b33" stroke-width="3" fill="none"/>');},
 c_popcorn:function(){var s=tbl('#fff6dc')+shadow(100,140,44)+'<g transform="translate(100,112)"><path d="M-38 -38 l8 66 h60 l8 -66z" fill="#fff" stroke="#c9412e" stroke-width="2.4"/>';
  for(var i=0;i<5;i++)s+='<path d="M'+(-36+i*16)+' -38 l'+(4+i*0.6)+' 66 h8 l'+(-3+i*0.6)+' -66z" fill="#e8433f"/>';s+='<text x="0" y="0" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="13" fill="#fff" stroke="#c9412e" stroke-width=".6">POP</text></g>';
  for(var k=0;k<18;k++)s+=popcornPiece(70+((k*17)%62),68-((k*7)%22)+(k>11?-10:0),0.78);return svg(200,160,'popcorn',s+popcornPiece(40,140,.8)+popcornPiece(164,138,.8));},
 c_chips:function(){var s=tbl('#fdf3e1')+shadow(100,140,60)+'<g transform="translate(100,96)"><path d="M-40 -46 q40 -8 80 0 l6 82 q-46 10 -92 0z" fill="#3b8fd9" stroke="#1d4f80" stroke-width="2.4"/><path d="M-40 -46 l4 -8 h72 l4 8" fill="#2a6fb0" stroke="#1d4f80" stroke-width="2"/>'+
  '<path d="M-40 -46 l-4 6 l4 4 l-4 6 M40 -46 l4 6 l-4 4 l4 6" stroke="#1d4f80" stroke-width="2" fill="none"/><ellipse cx="0" cy="0" rx="26" ry="18" fill="#f4d23a" stroke="#c9a51e" stroke-width="2"/><text x="0" y="5" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="14" fill="#c9412e">CHIPS</text>'+
  '<ellipse cx="-28" cy="-18" rx="5" ry="18" fill="#fff" opacity=".35"/></g>';s+=chip(40,128,0.7,20)+chip(160,130,0.7,-30)+chip(140,140,0.5,10);return svg(200,160,'chips',s);},

 /* ---------------- the four doors (sort) ---------------- */
 d_taste:function(){return svg(120,90,'taste','<rect width="120" height="90" fill="#fde8ef"/><path d="M30 30 q30 -10 60 0 q-4 40 -30 50 q-26 -10 -30 -50z" fill="#ef7f95" stroke="#a8264a" stroke-width="2.4"/><path d="M60 34 v34" stroke="#a8264a" stroke-width="2"/><ellipse cx="46" cy="44" rx="4" ry="6" fill="#f8b3c2"/><path d="M22 24 q38 -16 76 0" stroke="#8a2a3a" stroke-width="5" fill="none" stroke-linecap="round"/>');},
 d_feel:function(){return svg(120,90,'feel','<rect width="120" height="90" fill="#eef0fb"/><path d="M36 20 q-6 30 4 54 q4 8 8 0 l10 -18 l10 18 q4 8 8 0 q10 -24 4 -54 q-22 -10 -44 0z" fill="#fff" stroke="#8a9aa6" stroke-width="2.4"/><ellipse cx="48" cy="30" rx="4" ry="8" fill="#eef3f8"/><path d="M84 30 l12 -6 M86 44 l14 0 M84 58 l12 6" stroke="#5a6ac0" stroke-width="3" stroke-linecap="round"/>');},
 d_look:function(){return svg(120,90,'look','<rect width="120" height="90" fill="#eaf3fb"/><path d="M14 46 q46 -44 92 0 q-46 44 -92 0z" fill="#fff" stroke="#1d4f80" stroke-width="3"/><circle cx="60" cy="46" r="17" fill="#3b8fd9"/><circle cx="60" cy="46" r="8" fill="#10233a"/><circle cx="54" cy="40" r="4" fill="#fff"/><path d="M30 24 l-6 -8 M60 16 v-10 M90 24 l6 -8" stroke="#1d4f80" stroke-width="3" stroke-linecap="round"/>');},
 d_smell:function(){return svg(120,90,'smell','<rect width="120" height="90" fill="#e6f7f1"/><path d="M50 14 q-4 30 -16 46 q-6 10 6 14 q14 4 24 -2 q10 6 22 0 q8 -6 0 -14 q-12 -16 -14 -44" fill="#f2cba6" stroke="#8a5a3a" stroke-width="2.4"/><ellipse cx="50" cy="66" rx="5" ry="3" fill="#8a5a3a"/><ellipse cx="72" cy="66" rx="5" ry="3" fill="#8a5a3a"/><path d="M14 40 q10 -6 20 0 q10 6 20 0 M10 54 q10 -6 18 0" stroke="#3fae6a" stroke-width="2.6" fill="none" stroke-linecap="round"/>');},

 /* ---------------- scene: the Taste Test table (800×420) ---------------- */
 scene:function(){var s='<rect width="800" height="420" fill="#f4ead8"/><rect width="800" height="250" fill="#dfe9f2"/>';
  s+='<rect x="24" y="24" width="210" height="128" rx="6" fill="#2f5e4a" stroke="#6b4a2a" stroke-width="10"/><text x="129" y="70" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="34" fill="#f4f1e8">Taste Test!</text>'+
   '<text x="129" y="104" text-anchor="middle" font-family="Nunito,Arial" font-weight="700" font-size="18" fill="#e6f0e6">sweet · sour · salty</text><text x="129" y="132" text-anchor="middle" font-family="Nunito,Arial" font-weight="700" font-size="18" fill="#e6f0e6">crunchy · chewy</text>';
  s+='<rect x="680" y="30" width="100" height="110" fill="#bfe0f4" stroke="#fff" stroke-width="8"/><path d="M730 30 v110 M680 85 h100" stroke="#fff" stroke-width="5"/><circle cx="756" cy="58" r="14" fill="#f4d23a" opacity=".8"/>';
  /* pennant flags */
  s+='<path d="M280 26 q160 30 220 0" stroke="#7a6a5a" stroke-width="2" fill="none"/>';['#e8433f','#f4d23a','#3b8fd9','#5cbf4c','#ef6b8a','#f29a2e'].forEach(function(c,i){var x=296+i*36,y=32+Math.sin(i/5*Math.PI)*12;s+='<path d="M'+x+' '+y+' l20 2 l-8 22z" fill="'+c+'"/>';});
  s+=kid(330,340,0.9,{who:'paolo',expr:'open'})+kid(620,340,0.9,{who:'amira',expr:'smile',point:true,flip:true})+kid(470,330,0.82,{who:'jun',expr:'smile'});
  /* table */
  s+='<path d="M60 300 H740 L770 360 H30z" fill="#c98a4a" stroke="#7a4a1f" stroke-width="4"/><path d="M30 360 H770 V378 H30z" fill="#a8703a"/><path d="M80 378 v40 M720 378 v40" stroke="#7a4a1f" stroke-width="12"/>';
  s+='<rect x="90" y="296" width="620" height="12" fill="#fff" opacity=".85"/>';for(var i=0;i<16;i++)s+='<rect x="'+(90+i*40)+'" y="296" width="20" height="12" fill="#e8433f" opacity=".7"/>';
  s+='<g transform="translate(150,292) scale(1.2)">'+bowlG('#f6f2ea')+gummyRow()+'</g>';
  s+='<g transform="translate(290,262) scale(.75)">'+lollipop(0,0,1,'#8a5cc9','#f4d23a')+'</g>';
  s+='<g transform="translate(380,300) scale(.7)">'+candyBar(0,0,1)+'</g>';
  s+='<g transform="translate(520,276) scale(.55)"><path d="M-38 -38 l8 66 h60 l8 -66z" fill="#fff" stroke="#c9412e" stroke-width="2.4"/>'+[0,1,2,3,4].map(function(i){return '<path d="M'+(-36+i*16)+' -38 l'+(4+i*0.6)+' 66 h8 l'+(-3+i*0.6)+' -66z" fill="#e8433f"/>';}).join('')+[0,1,2,3,4,5,6,7,8,9].map(function(k){return popcornPiece(-26+((k*17)%54),-44-((k*7)%16),1);}).join('')+'</g>';
  s+=lemon(610,300,0.6)+mintDisk(680,300,0.6)+chip(240,316,0.55,10)+chip(262,322,0.5,-30);
  s+='<g class="lion" id="lionB" transform="translate(130,226) scale(.3)">'+lionG()+'</g>';
  return svg(800,420,'Students at a Taste Test table with candy',s);},

 /* ---------------- side pictures ---------------- */
 side_ear:function(){return svg(200,160,'listen',tbl('#f3eefb')+'<g transform="translate(100,76)"><path d="M-30 20 q-8 -60 34 -64 q40 -2 38 40 q-2 20 -20 28 q-12 6 -12 22 q0 18 -18 18 q-16 0 -18 -14" fill="#f2cba6" stroke="#8a5a3a" stroke-width="3"/><path d="M-12 8 q-4 -30 18 -32 q18 0 16 18 q-2 10 -12 12" stroke="#8a5a3a" stroke-width="3" fill="none"/></g>'+
  '<path d="M150 50 q14 26 0 52 M164 40 q22 36 0 72" stroke="#6a4ac0" stroke-width="4" fill="none" stroke-linecap="round"/>');},
 side_write:function(){return svg(200,160,'write',tbl('#eef5ff')+'<g transform="translate(96,104) rotate(-6)"><rect x="-56" y="-44" width="112" height="64" rx="4" fill="#fff" stroke="#8a9aa6" stroke-width="2"/>'+[0,1,2,3].map(function(i){return '<path d="M-46 '+(-30+i*14)+' h'+(i===3?50:92)+'" stroke="#9fb4d6" stroke-width="2"/>';}).join('')+
  '<path d="M-46 -32 q10 -6 18 0 q8 6 16 0 q8 -6 18 0" stroke="#2f4a7a" stroke-width="2.4" fill="none"/></g><g transform="translate(150,72) rotate(35)"><rect x="-6" y="-40" width="12" height="62" fill="#f4d23a" stroke="#a8742c" stroke-width="2"/><path d="M-6 22 l6 14 l6 -14z" fill="#f2cba6" stroke="#a8742c" stroke-width="2"/><rect x="-6" y="-48" width="12" height="10" fill="#ef7f95"/></g>'+gummy(40,128,0.4,'#5cbf4c',-10));},
 side_star:function(){return svg(200,160,'favorite',tbl('#fff8dc')+'<g transform="translate(100,72)"><path d="M0 -46 L13 -14 L46 -12 L20 8 L30 42 L0 22 L-30 42 L-20 8 L-46 -12 L-13 -14Z" fill="#f4c430" stroke="#b5820c" stroke-width="3"/><ellipse cx="-10" cy="-16" rx="8" ry="4" fill="#fff" opacity=".6"/></g>'+lollipop(36,108,0.38,'#e94b6a')+gummy(166,120,0.4,'#3b8fd9',10));},
 side_camera:function(){return svg(200,160,'my food photo',tbl('#eaf3fb')+'<g transform="translate(100,82)"><rect x="-56" y="-30" width="112" height="70" rx="12" fill="#3a4250" stroke="#1c2230" stroke-width="3"/><rect x="-26" y="-42" width="40" height="16" rx="4" fill="#3a4250" stroke="#1c2230" stroke-width="3"/><circle cx="0" cy="6" r="26" fill="#1c2230"/><circle cx="0" cy="6" r="18" fill="#3b8fd9"/><circle cx="-6" cy="0" r="6" fill="#fff" opacity=".7"/><rect x="34" y="-22" width="14" height="8" rx="2" fill="#f4d23a"/></g>'+
  bowl(160,130,24,'#c9412e')+'<path d="M146 126 q14 -12 28 0" stroke="#f4d23a" stroke-width="5"/>');}
};
function bowlG(c){return '<path d="M-60 0 q0 34 60 34 q60 0 60 -34z" fill="'+c+'" stroke="'+shade(c,-60)+'" stroke-width="2.4"/><ellipse rx="60" ry="10" fill="'+shade(c,-20)+'" stroke="'+shade(c,-60)+'" stroke-width="2"/>';}
function gummyRow(){var cs=['#e8433f','#f29a2e','#f4d23a','#5cbf4c','#ef6b8a'],s='';for(var k=0;k<5;k++)s+=gummy(-36+k*18,-10-(k%2)*6,0.4,cs[k],(k-2)*10);return s;}
function lionG(){var s='';for(var i=0;i<16;i++)s+='<ellipse cx="0" cy="-42" rx="12" ry="18" fill="#c9862b" transform="rotate('+(i*22.5)+')"/>';return s+'<circle r="36" fill="#f2c230"/><circle cx="-12" cy="-8" r="4.5" fill="#3d2c00"/><circle cx="12" cy="-8" r="4.5" fill="#3d2c00"/><path d="M-8 8 h16 l-8 8z" fill="#7a3e1d"/><path d="M-12 20 q12 8 24 0" stroke="#3d2c00" stroke-width="3" fill="none"/>';}
