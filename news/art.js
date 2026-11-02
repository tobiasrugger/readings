/* readings/news/art.js — drawn pictures for news articles, keyed by article SLUG.
   hero = full-width scene panel at the top of the article and on its "Pick a story" card.
   pics = smaller pictures floated right beside a paragraph: the first paragraph containing a word in near[]
   (tried in order), else at = 0..1 (how far down the article).
   Captions never answer a question. Added Nov 2 2026 (T-205). */
var NEWS_ART = window.NEWS_ART = window.NEWS_ART || {};

/* ================= SPIDERS ================= */
NEWS_ART['spiders-sleep'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A tiny spider hangs upside down under a leaf at night. A camera watches it.">'+
'<defs><radialGradient id="ssMoon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffbe6"/><stop offset="1" stop-color="#f3e3a6"/></radialGradient>'+
'<linearGradient id="ssSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14213d"/><stop offset="1" stop-color="#2b3a67"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="url(#ssSky)"/>'+
'<g fill="#fff" opacity=".75"><circle cx="40" cy="30" r="1.4"/><circle cx="120" cy="60" r="1"/><circle cx="210" cy="22" r="1.6"/><circle cx="300" cy="48" r="1"/><circle cx="380" cy="18" r="1.3"/><circle cx="470" cy="70" r="1"/><circle cx="600" cy="36" r="1.5"/><circle cx="560" cy="96" r="1"/><circle cx="90" cy="110" r="1"/></g>'+
'<circle cx="540" cy="58" r="30" fill="url(#ssMoon)"/><circle cx="530" cy="50" r="5" fill="#eadb9c"/><circle cx="550" cy="68" r="3.5" fill="#eadb9c"/>'+
/* branch + leaves */
'<path d="M0 34 C120 40 200 26 330 44 S520 40 640 30" stroke="#4a3426" stroke-width="10" fill="none" stroke-linecap="round"/>'+
'<path d="M0 34 C120 40 200 26 330 44 S520 40 640 30" stroke="#6b4b36" stroke-width="4" fill="none" stroke-linecap="round"/>'+
'<g><path d="M250 40 C230 80 270 120 320 112 C330 80 300 50 250 40Z" fill="#3f6b4a"/><path d="M250 40 C275 70 300 95 320 112" stroke="#2c4d35" stroke-width="2" fill="none"/>'+
'<path d="M270 62 l18 -2 M282 80 l18 2 M296 96 l14 4" stroke="#2c4d35" stroke-width="1.2"/></g>'+
'<g><path d="M360 44 C350 90 400 118 440 100 C440 70 410 48 360 44Z" fill="#4c7c55"/><path d="M360 44 C385 70 415 88 440 100" stroke="#2c4d35" stroke-width="2" fill="none"/></g>'+
'<path d="M140 36 C120 70 150 96 190 92 C196 66 175 44 140 36Z" fill="#355c40"/>'+
/* silk thread and sheet web */
'<path d="M300 104 L300 150" stroke="#e8eef7" stroke-width="1.3"/>'+
'<path d="M262 92 Q300 120 338 98" stroke="#e8eef7" stroke-width=".8" fill="none" opacity=".7"/>'+
'<path d="M270 98 Q300 130 330 104" stroke="#e8eef7" stroke-width=".8" fill="none" opacity=".6"/>'+
/* spider, hanging upside down, legs curled */
'<g transform="translate(300 168)">'+
'<ellipse cx="0" cy="-8" rx="13" ry="17" fill="#3b2a20"/><ellipse cx="0" cy="-10" rx="8" ry="11" fill="#5a4030" opacity=".7"/>'+
'<path d="M-6 -16 l12 0 M-7 -8 l14 0 M-6 0 l12 0" stroke="#c9a46b" stroke-width="1.4" opacity=".8"/>'+
'<ellipse cx="0" cy="16" rx="12" ry="11" fill="#2c1f18"/>'+
'<g fill="#111"><circle cx="-5" cy="22" r="4"/><circle cx="5" cy="22" r="4"/><circle cx="-10" cy="18" r="2"/><circle cx="10" cy="18" r="2"/></g>'+
'<g fill="#fff" opacity=".85"><circle cx="-6" cy="21" r="1.2"/><circle cx="4" cy="21" r="1.2"/></g>'+
'<g stroke="#2c1f18" stroke-width="3" fill="none" stroke-linecap="round">'+
'<path d="M-10 12 q-16 -4 -14 -18 q2 -6 6 -4"/><path d="M10 12 q16 -4 14 -18 q-2 -6 -6 -4"/>'+
'<path d="M-11 16 q-20 4 -20 -8"/><path d="M11 16 q20 4 20 -8"/>'+
'<path d="M-10 20 q-18 10 -24 0"/><path d="M10 20 q18 10 24 0"/>'+
'<path d="M-8 24 q-12 14 -20 8"/><path d="M8 24 q12 14 20 8"/></g>'+
'<g stroke="#f5e6a6" stroke-width="1.5" opacity=".9"><path d="M-30 -2 l-6 -4"/><path d="M30 -2 l6 -4"/><path d="M-34 6 l-7 0"/><path d="M34 6 l7 0"/></g>'+
'</g>'+
'<text x="248" y="234" fill="#f5e6a6" font-family="Nunito,Arial" font-size="15" font-weight="800">z z z</text>'+
/* infrared camera on a tripod */
'<g transform="translate(470 150)">'+
'<path d="M30 40 L10 104 M30 40 L50 104 M30 40 L30 104" stroke="#9aa6b8" stroke-width="4" stroke-linecap="round"/>'+
'<rect x="0" y="14" width="64" height="32" rx="6" fill="#59647a"/><rect x="6" y="20" width="22" height="6" rx="2" fill="#3c4558"/>'+
'<circle cx="-4" cy="30" r="15" fill="#3c4558"/><circle cx="-4" cy="30" r="10" fill="#1d2433"/><circle cx="-7" cy="27" r="3" fill="#7d8aa3"/>'+
'<circle cx="54" cy="22" r="4" fill="#e23b3b"/><circle cx="54" cy="22" r="8" fill="#e23b3b" opacity=".25"/>'+
'<path d="M-18 30 L-160 2 L-160 58 Z" fill="#e23b3b" opacity=".07"/></g>'+
'<rect x="0" y="240" width="640" height="20" fill="#1b2a24"/><path d="M0 240 q40 -10 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" fill="#24382f"/>'+
'</svg>',
pics:[
{at:0.2,near:['jumping spider'],cap:'A jumping spider has big eyes in front.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The face of a jumping spider with two big front eyes">'+
'<rect width="200" height="160" fill="#f3efe4"/><circle cx="100" cy="150" r="90" fill="#e6dcc4"/>'+
'<ellipse cx="100" cy="92" rx="62" ry="52" fill="#4a3426"/>'+
'<g stroke="#6b4b36" stroke-width="2" opacity=".8"><path d="M50 70 l-8 -6"/><path d="M58 60 l-6 -8"/><path d="M150 70 l8 -6"/><path d="M142 60 l6 -8"/><path d="M70 50 l-3 -9"/><path d="M130 50 l3 -9"/><path d="M100 44 l0 -9"/></g>'+
'<ellipse cx="100" cy="66" rx="40" ry="12" fill="#c98a3a"/><path d="M64 66 q36 -14 72 0" stroke="#e8b45a" stroke-width="3" fill="none"/>'+
'<circle cx="78" cy="96" r="20" fill="#0d0d0d"/><circle cx="122" cy="96" r="20" fill="#0d0d0d"/>'+
'<circle cx="72" cy="89" r="6" fill="#fff" opacity=".9"/><circle cx="116" cy="89" r="6" fill="#fff" opacity=".9"/>'+
'<circle cx="84" cy="102" r="2.5" fill="#fff" opacity=".5"/><circle cx="128" cy="102" r="2.5" fill="#fff" opacity=".5"/>'+
'<circle cx="48" cy="104" r="8" fill="#0d0d0d"/><circle cx="152" cy="104" r="8" fill="#0d0d0d"/><circle cx="46" cy="101" r="2.5" fill="#fff" opacity=".8"/><circle cx="150" cy="101" r="2.5" fill="#fff" opacity=".8"/>'+
'<path d="M84 126 q-6 18 -14 24 M116 126 q6 18 14 24" stroke="#3b2a20" stroke-width="7" stroke-linecap="round" fill="none"/>'+
'<path d="M84 126 q-6 18 -14 24 M116 126 q6 18 14 24" stroke="#d8c8a8" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/>'+
'</svg>'},
{at:0.6,near:['played sounds','sounds','dish'],cap:'A spider in a small dish. A speaker makes a sound.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A small spider sleeps in a round plastic dish next to a little speaker">'+
'<rect width="200" height="160" fill="#eef2f7"/><rect x="0" y="118" width="200" height="42" fill="#c9d3df"/><path d="M0 118 h200" stroke="#9aa8b8" stroke-width="2"/>'+
'<ellipse cx="88" cy="112" rx="70" ry="22" fill="#dfe8f2" stroke="#7d8aa3" stroke-width="3"/><ellipse cx="88" cy="106" rx="66" ry="18" fill="#f7fbff" opacity=".7"/>'+
'<path d="M30 102 q58 -12 116 0" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>'+
'<g transform="translate(88 104)"><ellipse cx="-4" cy="0" rx="9" ry="6" fill="#3b2a20"/><ellipse cx="8" cy="0" rx="6" ry="5" fill="#2c1f18"/>'+
'<g stroke="#2c1f18" stroke-width="2" fill="none"><path d="M-8 3 q-6 6 -2 8"/><path d="M-2 4 q-2 8 4 8"/><path d="M4 4 q4 7 9 5"/><path d="M8 3 q8 4 10 0"/></g></g>'+
'<text x="70" y="86" font-family="Nunito,Arial" font-size="12" font-weight="800" fill="#3c4558">z</text><text x="78" y="78" font-family="Nunito,Arial" font-size="10" font-weight="800" fill="#3c4558">z</text>'+
'<g transform="translate(168 86)"><rect x="-14" y="-22" width="28" height="44" rx="5" fill="#3c4558"/><circle cx="0" cy="-8" r="7" fill="#1d2433"/><circle cx="0" cy="10" r="9" fill="#1d2433"/><circle cx="0" cy="10" r="4" fill="#59647a"/>'+
'<path d="M-22 -6 q-6 8 0 16 M-30 -12 q-10 14 0 28" stroke="#e08a1e" stroke-width="3" fill="none" stroke-linecap="round"/></g>'+
'<g transform="translate(20 20)"><rect x="0" y="0" width="54" height="34" rx="4" fill="#fff" stroke="#7d8aa3" stroke-width="2"/><path d="M6 26 l10 -8 l8 5 l10 -12 l14 9" stroke="#e23b3b" stroke-width="2" fill="none"/></g>'+
'</svg>'}
]};

/* ================= SNAKES ================= */
NEWS_ART['rolling-snakes'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A small snake on a forest floor of dry leaves. A bird looks down from a branch.">'+
'<defs><linearGradient id="rsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6d2"/><stop offset="1" stop-color="#9cc3a3"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="url(#rsSky)"/>'+
'<g fill="#6e9c74" opacity=".55"><rect x="30" y="0" width="34" height="190"/><rect x="180" y="0" width="22" height="180"/><rect x="420" y="0" width="40" height="200"/><rect x="580" y="0" width="26" height="185"/></g>'+
'<g fill="#5a8a62" opacity=".7"><circle cx="50" cy="30" r="60"/><circle cx="190" cy="10" r="50"/><circle cx="440" cy="20" r="70"/><circle cx="600" cy="10" r="50"/></g>'+
/* bird on branch */
'<path d="M330 60 C400 64 470 54 640 66" stroke="#5b3d2a" stroke-width="9" fill="none" stroke-linecap="round"/>'+
'<g transform="translate(470 40)"><ellipse cx="0" cy="12" rx="24" ry="16" fill="#8a5a3c"/><ellipse cx="4" cy="16" rx="14" ry="10" fill="#e9d2a6"/>'+
'<circle cx="-16" cy="-2" r="12" fill="#8a5a3c"/><circle cx="-20" cy="-4" r="3" fill="#111"/><circle cx="-21" cy="-5" r="1" fill="#fff"/>'+
'<path d="M-28 0 l-12 4 l12 3 Z" fill="#e0a23a"/><path d="M18 8 l22 10 l-20 6 Z" fill="#6b4530"/>'+
'<path d="M-4 26 l-2 10 M6 26 l2 10" stroke="#e0a23a" stroke-width="2.5"/></g>'+
'<path d="M448 62 q-40 40 -110 86" stroke="#1d4d3f" stroke-width="2" stroke-dasharray="5 6" fill="none" opacity=".5"/>'+
/* ground with leaf litter */
'<path d="M0 170 C120 160 260 176 380 166 S560 160 640 170 L640 260 L0 260Z" fill="#8b6a45"/>'+
'<g>'+
'<ellipse cx="60" cy="200" rx="26" ry="9" fill="#b9853f" transform="rotate(-14 60 200)"/><path d="M38 205 l44 -10" stroke="#8a5f2a" stroke-width="1.5"/>'+
'<ellipse cx="140" cy="232" rx="30" ry="10" fill="#c99a52" transform="rotate(10 140 232)"/><path d="M112 228 l56 8" stroke="#8a5f2a" stroke-width="1.5"/>'+
'<ellipse cx="520" cy="214" rx="28" ry="9" fill="#a7743a" transform="rotate(-6 520 214)"/><path d="M494 216 l52 -4" stroke="#7a5226" stroke-width="1.5"/>'+
'<ellipse cx="600" cy="244" rx="24" ry="8" fill="#d0a45e" transform="rotate(16 600 244)"/>'+
'<ellipse cx="410" cy="240" rx="22" ry="8" fill="#b07c3e" transform="rotate(-20 410 240)"/>'+
'<ellipse cx="250" cy="248" rx="24" ry="8" fill="#9c6b34"/>'+
'<g fill="#6f5233"><circle cx="90" cy="180" r="3"/><circle cx="330" cy="236" r="2.5"/><circle cx="470" cy="186" r="3"/><circle cx="560" cy="190" r="2"/></g>'+
'</g>'+
/* the snake, coiled into a wheel, with motion lines */
'<g transform="translate(300 182)">'+
'<circle cx="0" cy="0" r="30" fill="none" stroke="#3a2e2a" stroke-width="13"/>'+
'<circle cx="0" cy="0" r="30" fill="none" stroke="#5c4a42" stroke-width="7" stroke-dasharray="10 7"/>'+
'<path d="M-21 21 A30 30 0 0 1 -30 0" stroke="#d9cdb8" stroke-width="4" fill="none" opacity=".5"/>'+
'<ellipse cx="22" cy="-26" rx="10" ry="7" fill="#3a2e2a" transform="rotate(-30 22 -26)"/><circle cx="27" cy="-30" r="2" fill="#fff"/><circle cx="27.5" cy="-30" r="1" fill="#111"/>'+
'<path d="M-8 -36 q-6 -8 -2 -14" stroke="#3a2e2a" stroke-width="5" fill="none" stroke-linecap="round"/>'+
'</g>'+
'<g stroke="#f4ecd8" stroke-width="4" stroke-linecap="round" opacity=".9"><path d="M246 168 h-60"/><path d="M240 184 h-80"/><path d="M246 200 h-56"/></g>'+
'<g fill="#a07d55" opacity=".8"><circle cx="232" cy="210" r="4"/><circle cx="214" cy="204" r="3"/><circle cx="196" cy="212" r="2.5"/></g>'+
'</svg>',
pics:[
{at:0.2,near:['side to side','side-to-side'],cap:'Most snakes move like this: side to side.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A snake slithering side to side in an S shape">'+
'<rect width="200" height="160" fill="#f1ead9"/><rect y="112" width="200" height="48" fill="#b9935e"/>'+
'<g fill="#9c7642"><ellipse cx="30" cy="140" rx="16" ry="5"/><ellipse cx="150" cy="148" rx="18" ry="5"/></g>'+
'<path d="M20 100 C45 70 70 130 95 100 S145 70 170 96" stroke="#3a2e2a" stroke-width="14" fill="none" stroke-linecap="round"/>'+
'<path d="M20 100 C45 70 70 130 95 100 S145 70 170 96" stroke="#6a564c" stroke-width="5" fill="none" stroke-dasharray="8 7" stroke-linecap="round"/>'+
'<ellipse cx="176" cy="92" rx="12" ry="8" fill="#3a2e2a"/><circle cx="181" cy="89" r="2" fill="#fff"/><circle cx="181.5" cy="89" r="1" fill="#111"/>'+
'<path d="M188 94 l8 2 m-8 -2 l7 -3" stroke="#c0392b" stroke-width="1.6"/>'+
'<g stroke="#1d4d3f" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M44 64 l-10 -6 m10 6 l-10 6" transform="rotate(90 44 64)"/><path d="M110 64 q-10 0 -14 0"/></g>'+
'<path d="M40 40 q30 -16 60 0 q30 16 60 0" stroke="#1d4d3f" stroke-width="2.5" fill="none" stroke-dasharray="4 5"/>'+
'</svg>'},
{at:0.7,near:['head'],cap:'The body turns. Look at the head.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A snake rolling like a wheel while its head stays up and steady">'+
'<rect width="200" height="160" fill="#e9f1ea"/><rect y="126" width="200" height="34" fill="#a4865a"/>'+
'<g transform="translate(96 92)"><circle r="32" fill="none" stroke="#3a2e2a" stroke-width="12"/><circle r="32" fill="none" stroke="#6a564c" stroke-width="5" stroke-dasharray="9 7"/></g>'+
'<path d="M120 70 q14 -22 30 -26" stroke="#3a2e2a" stroke-width="10" fill="none" stroke-linecap="round"/>'+
'<ellipse cx="156" cy="42" rx="12" ry="8" fill="#3a2e2a"/><circle cx="161" cy="39" r="2.2" fill="#fff"/><circle cx="161.5" cy="39" r="1.1" fill="#111"/>'+
'<path d="M140 26 h34" stroke="#1d4d3f" stroke-width="2" stroke-dasharray="3 4"/>'+
'<g stroke="#e08a1e" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M58 70 a42 42 0 0 1 22 -30"/><path d="M80 40 l-2 9 m2 -9 l-9 2"/><path d="M130 118 a42 42 0 0 1 -26 18"/><path d="M104 136 l9 -1 m-9 1 l5 -8"/></g>'+
'</svg>'}
]};

/* ================= ANTS ================= */
NEWS_ART['ants-asteroid'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A bright rock falls from the sky over a forest long ago. A dinosaur is far away. Small ants walk on a log.">'+
'<defs><linearGradient id="aaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b46b"/><stop offset=".6" stop-color="#f8d79a"/><stop offset="1" stop-color="#f2e3c0"/></linearGradient>'+
'<linearGradient id="aaTail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6d8" stop-opacity="0"/><stop offset="1" stop-color="#fff2c4"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="url(#aaSky)"/>'+
'<path d="M40 10 L470 112" stroke="url(#aaTail)" stroke-width="26" stroke-linecap="round"/>'+
'<circle cx="474" cy="114" r="18" fill="#fff4cf"/><circle cx="474" cy="114" r="11" fill="#ffd27a"/><circle cx="474" cy="114" r="34" fill="#fff2c4" opacity=".35"/>'+
'<path d="M0 150 L60 120 L110 140 L170 108 L240 138 L300 116 L370 146 L640 150 L640 170 L0 170Z" fill="#c98f63" opacity=".6"/>'+
/* far trees + dinosaur silhouette */
'<g fill="#6b7f4a"><path d="M80 170 q10 -40 20 0Z"/><path d="M130 172 q14 -56 28 0Z"/><path d="M520 172 q12 -48 24 0Z"/><path d="M590 172 q10 -38 20 0Z"/></g>'+
'<g transform="translate(210 140)" fill="#4e5a3a"><path d="M0 24 C10 4 40 0 60 8 C70 -14 80 -28 92 -26 C100 -24 98 -16 90 -14 C84 -6 80 6 78 16 C90 22 96 30 94 36 L84 36 L80 28 L66 30 L62 40 L52 40 L52 28 C34 30 16 32 0 24Z"/><path d="M0 24 C-20 22 -40 14 -60 6 C-40 20 -20 30 2 30Z"/></g>'+
'<path d="M0 168 L640 168 L640 260 L0 260Z" fill="#7a8c4e"/>'+
'<g fill="#91a35d"><path d="M0 180 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 L640 260 L0 260Z"/></g>'+
'<g stroke="#5c6e36" stroke-width="2"><path d="M30 214 l4 -14"/><path d="M38 214 l-2 -12"/><path d="M590 210 l3 -12"/><path d="M600 210 l-3 -10"/></g>'+
/* log in front with ants */
'<g><rect x="330" y="206" width="250" height="34" rx="17" fill="#8a5a3c"/><ellipse cx="580" cy="223" rx="13" ry="17" fill="#c99a6a"/><ellipse cx="580" cy="223" rx="8" ry="11" fill="#a9784b"/><ellipse cx="580" cy="223" rx="3" ry="5" fill="#8a5a3c"/>'+
'<path d="M350 214 q40 -4 80 0 M380 228 q60 4 120 0" stroke="#6b4530" stroke-width="2" fill="none"/></g>'+
'<g fill="#2a1a12" id="aaAnt">'+
'<g transform="translate(372 200)"><ellipse cx="0" cy="0" rx="5" ry="4"/><ellipse cx="8" cy="0" rx="3.5" ry="3"/><circle cx="14" cy="-1" r="3.5"/><path d="M16 -4 l4 -6 M16 -3 l6 -3" stroke="#2a1a12" stroke-width="1.2"/><path d="M6 2 l-4 6 M8 2 l0 7 M10 2 l4 6" stroke="#2a1a12" stroke-width="1.2"/></g>'+
'<g transform="translate(402 200)"><ellipse cx="0" cy="0" rx="5" ry="4"/><ellipse cx="8" cy="0" rx="3.5" ry="3"/><circle cx="14" cy="-1" r="3.5"/><path d="M16 -4 l4 -6 M16 -3 l6 -3" stroke="#2a1a12" stroke-width="1.2"/><path d="M6 2 l-4 6 M8 2 l0 7 M10 2 l4 6" stroke="#2a1a12" stroke-width="1.2"/><rect x="-3" y="-12" width="12" height="8" rx="2" fill="#7fae5a" transform="rotate(-12 3 -8)"/></g>'+
'<g transform="translate(432 201)"><ellipse cx="0" cy="0" rx="5" ry="4"/><ellipse cx="8" cy="0" rx="3.5" ry="3"/><circle cx="14" cy="-1" r="3.5"/><path d="M16 -4 l4 -6 M16 -3 l6 -3" stroke="#2a1a12" stroke-width="1.2"/><path d="M6 2 l-4 6 M8 2 l0 7 M10 2 l4 6" stroke="#2a1a12" stroke-width="1.2"/></g>'+
'<g transform="translate(470 200)"><ellipse cx="0" cy="0" rx="5" ry="4"/><ellipse cx="8" cy="0" rx="3.5" ry="3"/><circle cx="14" cy="-1" r="3.5"/><path d="M16 -4 l4 -6 M16 -3 l6 -3" stroke="#2a1a12" stroke-width="1.2"/><path d="M6 2 l-4 6 M8 2 l0 7 M10 2 l4 6" stroke="#2a1a12" stroke-width="1.2"/><rect x="-3" y="-12" width="12" height="8" rx="2" fill="#a5c86d" transform="rotate(8 3 -8)"/></g>'+
'</g>'+
'</svg>',
pics:[
{at:0.4,near:['jumping genes','DNA'],cap:'DNA is like a long ladder. Some pieces can move.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A DNA ladder; one small piece jumps from one place to another">'+
'<rect width="200" height="160" fill="#f0eefa"/>'+
'<path d="M30 20 C70 60 30 100 70 140" stroke="#5b4bb7" stroke-width="6" fill="none"/><path d="M90 20 C50 60 90 100 50 140" stroke="#2f8f83" stroke-width="6" fill="none"/>'+
'<g stroke="#9aa0b8" stroke-width="4"><path d="M38 32 h44"/><path d="M48 50 h24"/><path d="M52 70 h18"/><path d="M44 90 h32"/><path d="M50 110 h20"/><path d="M42 128 h36"/></g>'+
'<g stroke-width="4"><path d="M38 32 h20" stroke="#e08a1e"/><path d="M44 90 h14" stroke="#d64f6a"/><path d="M42 128 h18" stroke="#e08a1e"/></g>'+
'<rect x="120" y="58" width="44" height="18" rx="6" fill="#d64f6a"/><text x="142" y="71" text-anchor="middle" font-family="Nunito,Arial" font-size="10" font-weight="800" fill="#fff">piece</text>'+
'<path d="M120 66 C100 50 90 70 80 88" stroke="#d64f6a" stroke-width="3" fill="none" stroke-dasharray="5 4"/><path d="M80 88 l2 -10 m-2 10 l8 -6" stroke="#d64f6a" stroke-width="3" fill="none"/>'+
'<path d="M142 80 C150 110 120 120 82 122" stroke="#d64f6a" stroke-width="3" fill="none" stroke-dasharray="5 4"/><path d="M82 122 l9 -5 m-9 5 l9 4" stroke="#d64f6a" stroke-width="3" fill="none"/>'+
'<g fill="#5b4bb7"><circle cx="150" cy="40" r="2"/><circle cx="170" cy="100" r="2"/><circle cx="130" cy="140" r="2"/></g>'+
'</svg>'},
{at:0.75,near:['smell','15,000'],cap:'Two ants meet. They use their antennae.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two ants face each other and touch antennae; small smell clouds float between them">'+
'<rect width="200" height="160" fill="#f6efe2"/><rect y="116" width="200" height="44" fill="#c9a56f"/><g fill="#b08b55"><circle cx="20" cy="140" r="4"/><circle cx="170" cy="134" r="3"/><circle cx="110" cy="150" r="3"/></g>'+
'<g transform="translate(46 100)" fill="#3a2418"><ellipse cx="0" cy="0" rx="18" ry="13"/><ellipse cx="24" cy="-2" rx="9" ry="7"/><circle cx="40" cy="-8" r="11"/><circle cx="45" cy="-11" r="2" fill="#fff"/>'+
'<g stroke="#3a2418" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M18 4 l-8 16 M24 4 l2 18 M30 2 l12 16"/><path d="M46 -16 q8 -18 20 -16"/><path d="M48 -14 q14 -10 22 -4"/></g></g>'+
'<g transform="translate(154 100) scale(-1 1)" fill="#5a2e1c"><ellipse cx="0" cy="0" rx="18" ry="13"/><ellipse cx="24" cy="-2" rx="9" ry="7"/><circle cx="40" cy="-8" r="11"/><circle cx="45" cy="-11" r="2" fill="#fff"/>'+
'<g stroke="#5a2e1c" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M18 4 l-8 16 M24 4 l2 18 M30 2 l12 16"/><path d="M46 -16 q8 -18 20 -16"/><path d="M48 -14 q14 -10 22 -4"/></g></g>'+
'<g fill="#8fbf7a" opacity=".55"><circle cx="100" cy="58" r="9"/><circle cx="90" cy="46" r="6"/><circle cx="112" cy="44" r="7"/><circle cx="102" cy="32" r="5"/></g>'+
'<g stroke="#5f8f4a" stroke-width="2" fill="none" opacity=".8"><path d="M86 70 q4 -6 0 -12"/><path d="M114 70 q-4 -6 0 -12"/></g>'+
'</svg>'}
]};
