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

/* ================= THE SCIENCE OF HAPPINESS (T-365, Nov 12 2026) ================= */

/* ---------- GRATITUDE ---------- */
NEWS_ART['happiness-gratitude'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A student writes in a notebook at a desk by a window in the evening. A lamp is on and a cup of tea steams.">'+
'<defs><linearGradient id="hgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4a76b"/><stop offset=".55" stop-color="#f7cf95"/><stop offset="1" stop-color="#e8dcc0"/></linearGradient>'+
'<radialGradient id="hgLamp" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#fff6cf" stop-opacity=".95"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></radialGradient>'+
'<linearGradient id="hgWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9b896"/><stop offset="1" stop-color="#b8a582"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="url(#hgWall)"/>'+
'<g opacity=".18" stroke="#6d5a3c" stroke-width="1"><path d="M0 40 h640 M0 80 h640 M0 120 h640"/></g>'+
/* window with evening city + fog */
'<rect x="58" y="22" width="250" height="150" rx="4" fill="#5a4630"/><rect x="66" y="30" width="234" height="134" fill="url(#hgSky)"/>'+
'<path d="M66 118 q40 -14 80 -4 t80 -6 t74 4 v52 h-234z" fill="#f2ead8" opacity=".75"/>'+
'<g fill="#7c6a8f"><rect x="76" y="104" width="22" height="60"/><path d="M76 104 l11 -12 l11 12z"/><rect x="104" y="96" width="30" height="68"/><rect x="140" y="112" width="24" height="52"/><path d="M140 112 l12 -10 l12 10z"/><rect x="170" y="100" width="34" height="64"/><rect x="210" y="110" width="26" height="54"/><rect x="242" y="92" width="22" height="72"/><rect x="270" y="106" width="30" height="58"/></g>'+
'<g fill="#ffe7a3"><rect x="82" y="112" width="4" height="5"/><rect x="90" y="124" width="4" height="5"/><rect x="110" y="104" width="5" height="5"/><rect x="122" y="118" width="5" height="5"/><rect x="176" y="110" width="5" height="5"/><rect x="190" y="126" width="5" height="5"/><rect x="216" y="120" width="4" height="5"/><rect x="248" y="102" width="4" height="5"/><rect x="278" y="116" width="5" height="5"/><rect x="288" y="130" width="5" height="5"/></g>'+
'<path d="M66 150 q60 -10 120 0 t114 -4 v18 h-234z" fill="#f6f0e2" opacity=".85"/>'+
'<path d="M183 30 v134 M66 97 h234" stroke="#5a4630" stroke-width="6"/>'+
'<rect x="50" y="168" width="266" height="9" rx="2" fill="#6b5236"/>'+
/* small plant on sill + framed photo on wall */
'<g transform="translate(270 140)"><path d="M0 28 h26 l-3 14 h-20z" fill="#b5653d"/><path d="M13 28 q-14 -18 -10 -30 M13 28 q2 -20 10 -28 M13 28 q12 -10 18 -12" stroke="#3f6b4a" stroke-width="3" fill="none"/><ellipse cx="3" cy="-3" rx="6" ry="3" fill="#4c7c55"/><ellipse cx="23" cy="-1" rx="6" ry="3" fill="#4c7c55"/><ellipse cx="30" cy="16" rx="6" ry="3" fill="#4c7c55"/></g>'+
'<g transform="translate(420 34)"><rect width="74" height="58" rx="3" fill="#7a5a3a"/><rect x="6" y="6" width="62" height="46" fill="#cfe3ea"/><circle cx="26" cy="26" r="8" fill="#e2b48a"/><circle cx="46" cy="28" r="7" fill="#c98f65"/><path d="M14 52 q12 -20 24 0 M36 52 q10 -18 22 0" fill="#3f6fa0"/><path d="M18 22 q8 -10 16 0" fill="#3b2a20"/><path d="M39 24 q7 -9 14 0" fill="#1d1d1d"/></g>'+
/* desk */
'<path d="M0 196 h640 v64 h-640z" fill="#8a5a36"/><path d="M0 196 h640" stroke="#5e3a22" stroke-width="4"/>'+
'<g stroke="#6d4428" stroke-width="1.2" opacity=".6"><path d="M0 214 q160 6 320 0 t320 2"/><path d="M0 234 q200 -6 400 2 t240 -2"/></g>'+
/* lamp */
'<path d="M548 196 v-70 q0 -10 -20 -24" stroke="#2f3a35" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M500 92 l40 -14 l14 34 l-44 10z" fill="#2f6b4f"/><path d="M510 122 l44 -10" stroke="#24543d" stroke-width="3"/>'+
'<path d="M510 122 L420 196 H600 Z" fill="url(#hgLamp)"/><rect x="530" y="190" width="40" height="8" rx="3" fill="#2f3a35"/>'+
/* tea cup with steam */
'<g transform="translate(560 168)"><path d="M0 0 h30 v18 q0 10 -15 10 q-15 0 -15 -10z" fill="#f4efe4" stroke="#8a7a62" stroke-width="2"/><path d="M30 6 q10 0 10 7 q0 7 -10 7" stroke="#8a7a62" stroke-width="3" fill="none"/><ellipse cx="15" cy="1" rx="14" ry="3" fill="#a8763e"/>'+
'<path d="M8 -6 q-6 -10 2 -18 q8 -8 0 -18 M20 -6 q-6 -10 2 -18" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8" stroke-linecap="round"/></g>'+
/* the student, from behind-side, writing */
'<g transform="translate(340 96)">'+
'<path d="M-6 100 q0 -64 46 -66 q48 0 50 66z" fill="#c2484d"/><path d="M8 100 q4 -40 32 -50" stroke="#a63a3f" stroke-width="3" fill="none"/>'+
'<rect x="30" y="20" width="16" height="18" rx="6" fill="#c98f65"/>'+
'<circle cx="40" cy="6" r="24" fill="#c98f65"/><path d="M14 4 q2 -30 28 -30 q26 0 26 26 q-6 -12 -22 -14 q-14 -2 -32 18z" fill="#1d1a17"/><path d="M60 -2 q6 10 2 22" stroke="#1d1a17" stroke-width="6" fill="none" stroke-linecap="round"/>'+
'<ellipse cx="54" cy="10" rx="3" ry="2" fill="#2a1d14"/><path d="M50 22 q5 3 10 0" stroke="#7a4a35" stroke-width="2" fill="none"/>'+
'<path d="M70 60 q34 10 46 34" stroke="#c2484d" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="118" cy="96" r="7" fill="#c98f65"/><path d="M120 94 l14 -16" stroke="#e0b030" stroke-width="3.5" stroke-linecap="round"/><path d="M134 78 l3 -3" stroke="#3b3b3b" stroke-width="3"/></g>'+
/* open notebook with 5 numbered lines */
'<g transform="translate(410 176) skewX(-14)"><rect x="0" y="0" width="150" height="40" rx="3" fill="#fbf8ef" stroke="#8a7a62" stroke-width="2"/><path d="M75 0 v40" stroke="#c9bda3" stroke-width="2"/>'+
'<g font-family="Nunito,Arial" font-size="7" font-weight="800" fill="#2f6b4f"><text x="82" y="9">1</text><text x="82" y="16">2</text><text x="82" y="23">3</text><text x="82" y="30">4</text><text x="82" y="37">5</text></g>'+
'<g stroke="#5b6d8a" stroke-width="1.6" stroke-linecap="round"><path d="M90 7 h40 M90 14 h48 M90 21 h34 M90 28 h44"/></g><path d="M90 35 h18" stroke="#5b6d8a" stroke-width="1.6"/>'+
'<g stroke="#c9bda3" stroke-width="1"><path d="M8 8 h60 M8 15 h60 M8 22 h60 M8 29 h60 M8 36 h60"/></g></g>'+
'</svg>',
pics:[
{at:0.1,near:['Moscow'],cap:'From Moscow to the United States',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A girl with a suitcase. Behind her, Moscow domes on one side and a US city on the other, with a plane between.">'+
'<rect width="200" height="160" fill="#eaf1f6"/><rect y="120" width="200" height="40" fill="#cfd8c4"/>'+
/* moscow domes left */
'<g transform="translate(14 46)"><rect x="6" y="34" width="44" height="40" fill="#d9c6a5"/><rect x="14" y="20" width="10" height="16" fill="#e8d9bc"/><path d="M12 22 q7 -22 14 0z" fill="#d8494b"/><path d="M12 22 q7 -10 14 0" stroke="#a83335" stroke-width="1" fill="none"/><path d="M19 0 v6" stroke="#c9a23a" stroke-width="2"/>'+
'<rect x="30" y="16" width="12" height="20" fill="#e8d9bc"/><path d="M28 18 q8 -26 16 0z" fill="#3f8a5a"/><path d="M30 18 q6 -6 12 0 M30 10 q6 -6 12 0" stroke="#2c6343" stroke-width="1" fill="none"/><path d="M36 -10 v8" stroke="#c9a23a" stroke-width="2"/>'+
'<path d="M2 36 q7 -16 14 0z" fill="#3b6fb0"/><path d="M44 36 q6 -14 12 0z" fill="#e0a83a"/><g fill="#7a6a52"><rect x="12" y="46" width="5" height="8"/><rect x="26" y="46" width="5" height="8"/><rect x="38" y="46" width="5" height="8"/></g></g>'+
/* US city right */
'<g transform="translate(130 44)" fill="#8696aa"><rect x="0" y="30" width="16" height="46"/><rect x="18" y="10" width="20" height="66"/><path d="M28 0 v10" stroke="#8696aa" stroke-width="2"/><rect x="40" y="24" width="16" height="52"/><rect x="58" y="40" width="10" height="36"/>'+
'<g fill="#d9e2ec"><rect x="4" y="36" width="3" height="4"/><rect x="9" y="44" width="3" height="4"/><rect x="22" y="18" width="3" height="4"/><rect x="30" y="30" width="3" height="4"/><rect x="22" y="44" width="3" height="4"/><rect x="44" y="32" width="3" height="4"/><rect x="50" y="46" width="3" height="4"/></g></g>'+
/* plane + dashed path */
'<path d="M60 40 q40 -34 80 -6" stroke="#5b6d8a" stroke-width="2" stroke-dasharray="4 4" fill="none"/>'+
'<g transform="translate(98 22) rotate(12)"><path d="M-12 0 h24 l4 2 l-4 2 h-24z" fill="#fff" stroke="#5b6d8a" stroke-width="1.5"/><path d="M-2 0 l-6 -8 h4 l8 8 M-2 4 l-6 8 h4 l8 -8" fill="#c7d3e3" stroke="#5b6d8a" stroke-width="1"/></g>'+
/* girl with suitcase */
'<g transform="translate(92 74)"><circle cx="10" cy="10" r="10" fill="#f0c8a4"/><path d="M0 8 q2 -14 12 -12 q10 0 9 14 q-4 -8 -12 -8z" fill="#9a6a3a"/><path d="M1 10 q-3 10 0 18 M19 10 q3 10 0 18" stroke="#9a6a3a" stroke-width="4" fill="none" stroke-linecap="round"/>'+
'<circle cx="7" cy="11" r="1.3" fill="#2a1d14"/><circle cx="13" cy="11" r="1.3" fill="#2a1d14"/><path d="M7 15 q3 2 6 0" stroke="#a5583d" stroke-width="1.2" fill="none"/>'+
'<path d="M0 22 h20 l4 26 h-28z" fill="#3f78b5"/><path d="M2 48 v14 M16 48 v14" stroke="#2f3a35" stroke-width="4"/><path d="M20 28 l12 12" stroke="#f0c8a4" stroke-width="4" stroke-linecap="round"/>'+
'<rect x="26" y="40" width="22" height="20" rx="3" fill="#a4683a" stroke="#6b4223" stroke-width="2"/><path d="M33 40 v-4 h8 v4" stroke="#6b4223" stroke-width="2" fill="none"/><path d="M26 50 h22" stroke="#6b4223" stroke-width="1.5"/></g>'+
'</svg>'},
{at:0.45,near:['grateful','blessings'],cap:'Counting blessings',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An open notebook with five drawings: the sun, a friend, a bowl of food, a family, and music.">'+
'<rect width="200" height="160" fill="#f4efe2"/><path d="M0 140 h200 v20 h-200z" fill="#c9a77a"/>'+
'<path d="M14 22 q43 -8 86 4 q43 -12 86 -4 v116 q-43 -8 -86 4 q-43 -12 -86 -4z" fill="#fffdf6" stroke="#8a7a62" stroke-width="2"/><path d="M100 26 v116" stroke="#c9bda3" stroke-width="2"/>'+
'<g stroke="#e3dccb" stroke-width="1"><path d="M22 48 h70 M22 72 h70 M22 96 h70 M22 120 h70 M108 48 h70 M108 72 h70 M108 96 h70 M108 120 h70"/></g>'+
'<g font-family="Nunito,Arial" font-weight="800" font-size="11" fill="#2f6b4f"><text x="22" y="44">1</text><text x="22" y="92">2</text><text x="108" y="44">3</text><text x="108" y="92">4</text><text x="60" y="134">5</text></g>'+
/* 1 sun */
'<g transform="translate(58 38)"><circle r="9" fill="#f3b63f"/><g stroke="#f3b63f" stroke-width="2.5" stroke-linecap="round"><path d="M0 -14 v-5 M0 14 v5 M-14 0 h-5 M14 0 h5 M10 10 l3 3 M-10 -10 l-3 -3 M10 -10 l3 -3 M-10 10 l-3 3"/></g></g>'+
/* 2 friends */
'<g transform="translate(50 74)"><circle cx="0" cy="0" r="7" fill="#c98f65"/><circle cx="18" cy="0" r="7" fill="#f0c8a4"/><path d="M-7 -2 q7 -10 14 0" fill="#1d1a17"/><path d="M11 -2 q7 -10 14 0" fill="#c4842e"/><path d="M-8 18 q8 -14 16 0z" fill="#d8494b"/><path d="M10 18 q8 -14 16 0z" fill="#3f78b5"/><path d="M6 10 l6 0" stroke="#c98f65" stroke-width="3"/></g>'+
/* 3 bowl of noodles */
'<g transform="translate(144 40)"><path d="M-18 0 h36 q0 16 -18 16 q-18 0 -18 -16z" fill="#e8e1d2" stroke="#8a7a62" stroke-width="1.5"/><path d="M-14 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0" stroke="#e0b030" stroke-width="2" fill="none"/><path d="M6 -2 l14 -16 M10 -2 l14 -14" stroke="#6b4223" stroke-width="2"/><path d="M-6 -6 q-2 -6 2 -10 M2 -8 q-2 -6 2 -10" stroke="#9aa6b8" stroke-width="1.5" fill="none"/></g>'+
/* 4 family / house */
'<g transform="translate(144 76)"><path d="M-16 4 l16 -14 l16 14 v14 h-32z" fill="#e7c08a" stroke="#8a5a36" stroke-width="1.5"/><path d="M-20 6 l20 -18 l20 18" stroke="#b5653d" stroke-width="3" fill="none"/><rect x="-4" y="8" width="8" height="10" fill="#8a5a36"/><path d="M-6 0 q3 -3 6 0 q3 -3 6 0 l-6 6z" fill="#d8494b"/></g>'+
/* 5 music */
'<g transform="translate(92 120)" fill="#5b6d8a"><ellipse cx="0" cy="8" rx="5" ry="4"/><ellipse cx="16" cy="4" rx="5" ry="4"/><path d="M4 8 v-20 l16 -4 v20" stroke="#5b6d8a" stroke-width="2.5" fill="none"/><path d="M4 -10 l16 -4" stroke="#5b6d8a" stroke-width="4"/></g>'+
/* pencil */
'<g transform="translate(176 118) rotate(-35)"><rect x="-4" y="-26" width="8" height="40" fill="#e0b030"/><path d="M-4 14 l4 10 l4 -10z" fill="#e8c9a0"/><path d="M-1.5 21 l1.5 3 l1.5 -3z" fill="#333"/><rect x="-4" y="-32" width="8" height="6" fill="#e58b9b"/></g>'+
'</svg>'}
]};

/* ---------- FLOW ---------- */
NEWS_ART['happiness-flow'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A rock climber high on a sunny cliff above a river. Below, a teenager plays chess and another plays guitar.">'+
'<defs><linearGradient id="hfSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6d9"/><stop offset="1" stop-color="#d8ecf4"/></linearGradient>'+
'<linearGradient id="hfRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c98a5a"/><stop offset="1" stop-color="#8f5a3a"/></linearGradient>'+
'<linearGradient id="hfRiver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f9ac0"/><stop offset="1" stop-color="#7cc0dc"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="url(#hfSky)"/>'+
'<g fill="#fff" opacity=".85"><ellipse cx="120" cy="40" rx="40" ry="12"/><ellipse cx="150" cy="34" rx="28" ry="12"/><ellipse cx="470" cy="56" rx="46" ry="12"/><ellipse cx="500" cy="48" rx="26" ry="11"/></g>'+
'<path d="M0 150 l70 -50 l60 30 l70 -60 l80 70 l60 -30 l70 40 v110 h-410z" fill="#9db7a0" opacity=".7"/>'+
/* cliff */
'<path d="M330 260 V40 q20 -18 46 -10 q30 -10 60 6 q40 -6 66 20 q40 10 60 40 q30 30 78 40 V260z" fill="url(#hfRock)"/>'+
'<g stroke="#7a4a2e" stroke-width="2" fill="none" opacity=".75"><path d="M360 60 l18 30 l-6 26 l20 30"/><path d="M420 40 l-8 40 l22 24 l-4 40"/><path d="M480 70 l10 26 l-14 30 l16 36"/><path d="M540 92 l-10 30 l18 26"/><path d="M380 160 l30 10 l10 30"/></g>'+
'<g fill="#a86a43" opacity=".7"><path d="M352 120 l20 -6 l6 10 l-22 4z"/><path d="M440 150 l22 -4 l4 10 l-24 2z"/><path d="M500 120 l18 -4 l4 8 l-20 4z"/></g>'+
'<g fill="#4c7c55"><path d="M600 98 q10 -26 24 -6 q10 -20 16 4 v14 h-40z"/><path d="M336 40 q6 -16 16 -4 q6 -12 12 2 v8 h-28z"/></g>'+
/* rope + climber */
'<path d="M452 28 C448 70 446 100 444 128" stroke="#e23b3b" stroke-width="2.2" fill="none"/><circle cx="452" cy="30" r="3" fill="#bbb" stroke="#555"/>'+
'<g transform="translate(436 120)"><circle cx="8" cy="0" r="8" fill="#e0a36f"/><path d="M0 -2 q8 -12 16 0z" fill="#f2c230"/><path d="M0 -2 h16" stroke="#c99a10" stroke-width="2"/>'+
'<path d="M2 8 h14 l2 22 h-18z" fill="#2f6b9a"/><path d="M16 12 l14 -14" stroke="#e0a36f" stroke-width="4" stroke-linecap="round"/><path d="M2 12 l-12 -6" stroke="#e0a36f" stroke-width="4" stroke-linecap="round"/>'+
'<path d="M2 30 l-8 18 M16 30 l10 14" stroke="#3b3b3b" stroke-width="5" stroke-linecap="round"/><path d="M0 22 h18" stroke="#e23b3b" stroke-width="2"/><rect x="14" y="14" width="6" height="8" rx="2" fill="#fff" opacity=".8"/></g>'+
/* river */
'<path d="M0 214 q80 -12 160 0 t160 0 t170 2 t150 -4 v52 h-640z" fill="url(#hfRiver)"/>'+
'<g stroke="#e6f4fa" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"><path d="M30 226 q20 -6 40 0"/><path d="M130 236 q24 -6 48 0"/><path d="M250 228 q20 -6 40 0"/><path d="M400 238 q24 -6 48 0"/><path d="M540 228 q20 -6 40 0"/></g>'+
'<path d="M0 214 q80 -12 160 0 t160 0" stroke="#3a7ea3" stroke-width="2" fill="none"/>'+
/* bank with chess player and guitarist */
'<path d="M0 180 q60 -14 140 -8 q90 4 190 18 v18 q-110 8 -330 6z" fill="#7aa96b"/>'+
'<g transform="translate(60 150)"><rect x="18" y="30" width="44" height="6" fill="#6b4223"/><path d="M22 36 v12 M58 36 v12" stroke="#6b4223" stroke-width="3"/>'+
'<g transform="translate(24 20)"><rect width="32" height="10" fill="#f4efe4" stroke="#333" stroke-width="1"/><g fill="#333"><rect x="0" y="0" width="4" height="5"/><rect x="8" y="0" width="4" height="5"/><rect x="16" y="0" width="4" height="5"/><rect x="24" y="0" width="4" height="5"/><rect x="4" y="5" width="4" height="5"/><rect x="12" y="5" width="4" height="5"/><rect x="20" y="5" width="4" height="5"/><rect x="28" y="5" width="4" height="5"/></g>'+
'<path d="M6 -2 v-5 M5 -7 h2" stroke="#fff" stroke-width="2"/><path d="M22 -2 v-6 l-2 -2 h4z" stroke="#222" stroke-width="2" fill="#222"/></g>'+
'<circle cx="2" cy="10" r="9" fill="#c98f65"/><path d="M-7 8 q2 -14 12 -12 q8 2 6 12 q-6 -6 -12 -4z" fill="#1d1a17"/><path d="M-6 20 q8 -6 14 0 l4 22 h-20z" fill="#3f8a5a"/><path d="M8 26 l18 2" stroke="#c98f65" stroke-width="4" stroke-linecap="round"/>'+
'<circle cx="2" cy="10" r="1.3" fill="#2a1d14" transform="translate(4 0)"/></g>'+
'<g transform="translate(220 150)"><circle cx="10" cy="8" r="9" fill="#f0c8a4"/><path d="M0 6 q2 -14 12 -12 q10 2 8 14 q-6 -8 -14 -4z" fill="#7a4a2a"/><path d="M0 20 h20 l3 24 h-26z" fill="#d8494b"/>'+
'<g transform="translate(-6 30) rotate(-20)"><ellipse cx="0" cy="0" rx="12" ry="9" fill="#c4842e" stroke="#7a4a1a" stroke-width="1.5"/><circle cx="2" cy="0" r="3" fill="#3b2a1a"/><rect x="10" y="-2" width="30" height="4" fill="#6b4223"/><rect x="38" y="-3" width="6" height="6" fill="#3b2a1a"/></g>'+
'<path d="M2 28 l-4 6 M18 26 l10 10" stroke="#f0c8a4" stroke-width="4" stroke-linecap="round"/>'+
'<g fill="#2f6b4f"><path d="M30 -8 q2 -2 4 0 v-8"/><circle cx="31" cy="-6" r="2.5"/><circle cx="40" cy="-12" r="2.5"/><path d="M33 -6 v-10 l9 -2 v-4" stroke="#2f6b4f" stroke-width="1.5" fill="none"/></g></g>'+
'</svg>',
pics:[
{at:0.4,near:['pagers','pager'],cap:'A pager beeps. Write how you feel.',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An old black pager beeping, next to a small paper form with questions and a pencil">'+
'<rect width="200" height="160" fill="#eef2ec"/><rect y="122" width="200" height="38" fill="#c9bea6"/><path d="M0 122 h200" stroke="#a89a7c" stroke-width="2"/>'+
/* pager */
'<g transform="translate(18 44) rotate(-8)"><rect width="70" height="44" rx="8" fill="#2a2f36"/><rect x="4" y="4" width="62" height="36" rx="6" fill="#3a414b"/><rect x="10" y="10" width="42" height="16" rx="2" fill="#a9c79a"/><text x="14" y="22" font-family="monospace" font-size="10" font-weight="700" fill="#2c4a22">BEEP!</text>'+
'<circle cx="60" cy="18" r="4" fill="#e23b3b"/><circle cx="60" cy="18" r="8" fill="#e23b3b" opacity=".25"/><rect x="12" y="30" width="10" height="5" rx="2" fill="#6b7480"/><rect x="26" y="30" width="10" height="5" rx="2" fill="#6b7480"/><rect x="40" y="30" width="10" height="5" rx="2" fill="#6b7480"/>'+
'<rect x="50" y="-6" width="12" height="8" rx="2" fill="#2a2f36"/></g>'+
'<g stroke="#e08a1e" stroke-width="3" fill="none" stroke-linecap="round"><path d="M14 36 q-6 -8 0 -16"/><path d="M6 40 q-10 -12 0 -26"/><path d="M92 26 q8 6 4 16"/><path d="M100 20 q12 10 6 26"/></g>'+
/* form */
'<g transform="translate(104 34) rotate(5)"><rect width="80" height="100" rx="3" fill="#fffdf6" stroke="#8a7a62" stroke-width="2"/>'+
'<g font-family="Nunito,Arial" font-size="7.5" font-weight="800" fill="#3d4a42"><text x="6" y="14">What are you doing?</text><text x="6" y="40">How hard is it?</text><text x="6" y="66">How do you feel?</text></g>'+
'<path d="M6 22 h66 M6 28 h50" stroke="#5b6d8a" stroke-width="1.4"/>'+
'<g fill="none" stroke="#8a7a62" stroke-width="1.2"><circle cx="12" cy="50" r="4"/><circle cx="26" cy="50" r="4"/><circle cx="40" cy="50" r="4"/><circle cx="54" cy="50" r="4"/><circle cx="68" cy="50" r="4"/></g><circle cx="40" cy="50" r="2.5" fill="#2f6b4f"/>'+
'<g transform="translate(10 74)"><circle cx="6" cy="6" r="6" fill="#f3d67a"/><circle cx="4" cy="5" r="1" fill="#333"/><circle cx="8" cy="5" r="1" fill="#333"/><path d="M3 8 q3 3 6 0" stroke="#333" stroke-width="1" fill="none"/></g>'+
'<g transform="translate(30 74)"><circle cx="6" cy="6" r="6" fill="#f3d67a"/><circle cx="4" cy="5" r="1" fill="#333"/><circle cx="8" cy="5" r="1" fill="#333"/><path d="M3 9 h6" stroke="#333" stroke-width="1"/></g>'+
'<g transform="translate(50 74)"><circle cx="6" cy="6" r="6" fill="#f3d67a"/><circle cx="4" cy="5" r="1" fill="#333"/><circle cx="8" cy="5" r="1" fill="#333"/><path d="M3 10 q3 -3 6 0" stroke="#333" stroke-width="1" fill="none"/></g></g>'+
'<g transform="translate(160 132) rotate(-60)"><rect x="-3" y="-24" width="6" height="34" fill="#e0b030"/><path d="M-3 10 l3 8 l3 -8z" fill="#e8c9a0"/></g>'+
'</svg>'},
{at:0.75,near:['challenge matches','narrow channel','too easy'],cap:'Challenge and skill',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A chart. Up is challenge, right is skill. A green band runs up the middle. A nervous face is at the top left, a yawning face at the bottom right, a happy climber in the green band.">'+
'<rect width="200" height="160" fill="#fbfaf4"/>'+
'<path d="M30 132 L30 18 L182 18 Z" fill="#fde2d8"/><path d="M30 132 L182 132 L182 18 Z" fill="#dde8f4"/>'+
'<path d="M30 132 L58 132 L182 40 L182 18 L162 18 Z" fill="#cdebd2"/><path d="M30 132 L182 18" stroke="#3f8a5a" stroke-width="2" stroke-dasharray="4 3"/>'+
'<path d="M30 140 V14 M22 132 H190" stroke="#2b3a33" stroke-width="2.5"/><path d="M30 10 l-5 8 h10z M194 132 l-8 -5 v10z" fill="#2b3a33"/>'+
'<text x="36" y="12" font-family="Nunito,Arial" font-size="10" font-weight="800" fill="#2b3a33">challenge</text><text x="150" y="150" font-family="Nunito,Arial" font-size="10" font-weight="800" fill="#2b3a33">skill</text>'+
'<text transform="translate(108 84) rotate(-37)" font-family="Nunito,Arial" font-size="12" font-weight="900" fill="#2c6343">flow</text>'+
/* nervous face top-left */
'<g transform="translate(58 46)"><circle r="13" fill="#f3d67a" stroke="#b68a20" stroke-width="1.5"/><circle cx="-4" cy="-2" r="1.8" fill="#333"/><circle cx="4" cy="-2" r="1.8" fill="#333"/><path d="M-5 6 q2 -3 4 0 q2 3 4 0 q1 -2 2 0" stroke="#333" stroke-width="1.4" fill="none"/><path d="M10 -10 q3 4 0 7 q-3 -3 0 -7z" fill="#7cc0dc"/></g>'+
/* yawning face bottom-right */
'<g transform="translate(158 108)"><circle r="13" fill="#f3d67a" stroke="#b68a20" stroke-width="1.5"/><path d="M-7 -3 h5 M2 -3 h5" stroke="#333" stroke-width="1.6"/><ellipse cx="0" cy="6" rx="4" ry="5" fill="#7a2e2e"/><text x="10" y="-10" font-family="Nunito,Arial" font-size="9" font-weight="800" fill="#5b6d8a">z</text></g>'+
/* small happy climber in band */
'<g transform="translate(126 58)"><circle r="7" fill="#e0a36f"/><path d="M-6 -2 q6 -9 12 0z" fill="#f2c230"/><path d="M-3 2 q3 3 6 0" stroke="#333" stroke-width="1.2" fill="none"/><path d="M0 7 v12 M0 10 l8 -8 M0 10 l-8 2 M0 19 l-6 8 M0 19 l6 8" stroke="#2f6b9a" stroke-width="3" stroke-linecap="round"/></g>'+
'</svg>'}
]};

/* ---------- PLANT ---------- */
NEWS_ART['happiness-plant'] = {
hero:
'<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An older woman in a 1970s nursing home room waters a small plant on the windowsill. A notice board shows a movie night with two choices.">'+
'<defs><linearGradient id="hpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d0e8"/><stop offset="1" stop-color="#e5f1f6"/></linearGradient>'+
'<linearGradient id="hpLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff7d6" stop-opacity=".7"/><stop offset="1" stop-color="#fff7d6" stop-opacity="0"/></linearGradient></defs>'+
'<rect width="640" height="260" fill="#e9dcc0"/>'+
/* 70s wallpaper stripes */
'<g opacity=".35"><rect x="0" width="12" height="190" fill="#d9b46a"/><rect x="40" width="12" height="190" fill="#d9b46a"/><rect x="80" width="12" height="190" fill="#d9b46a"/><rect x="120" width="12" height="190" fill="#d9b46a"/><rect x="420" width="12" height="190" fill="#d9b46a"/><rect x="460" width="12" height="190" fill="#d9b46a"/><rect x="500" width="12" height="190" fill="#d9b46a"/><rect x="540" width="12" height="190" fill="#d9b46a"/><rect x="580" width="12" height="190" fill="#d9b46a"/><rect x="620" width="12" height="190" fill="#d9b46a"/></g>'+
'<rect y="190" width="640" height="70" fill="#9c7a52"/><g stroke="#7f6040" stroke-width="2"><path d="M0 206 h640 M0 226 h640 M0 246 h640"/></g>'+
/* window */
'<rect x="160" y="20" width="230" height="140" rx="4" fill="#f4efe4" stroke="#8a7a62" stroke-width="4"/><rect x="170" y="30" width="210" height="120" fill="url(#hpSky)"/>'+
'<g fill="#8fbf7a"><circle cx="200" cy="130" r="26"/><circle cx="236" cy="120" r="22"/><circle cx="340" cy="126" r="28"/><circle cx="372" cy="136" r="18"/></g><g fill="#5f8f4a" opacity=".6"><circle cx="210" cy="136" r="14"/><circle cx="350" cy="134" r="14"/></g>'+
'<path d="M260 150 v-34 h40 v34" fill="#c9b7a0"/><path d="M256 118 l24 -16 l24 16z" fill="#a3685a"/>'+
'<path d="M275 30 v120 M170 90 h210" stroke="#f4efe4" stroke-width="6"/>'+
'<path d="M170 30 L380 150 L170 150Z" fill="url(#hpLight)"/>'+
'<rect x="150" y="158" width="250" height="10" rx="2" fill="#c7b38e" stroke="#8a7a62" stroke-width="2"/>'+
/* curtains */
'<path d="M146 14 q-10 80 4 150 h22 q-14 -70 -4 -150z" fill="#d07a3a"/><path d="M404 14 q10 80 -4 150 h-22 q14 -70 4 -150z" fill="#d07a3a"/><path d="M140 12 h270" stroke="#7a5a3a" stroke-width="5"/>'+
/* plant on sill */
'<g transform="translate(300 118)"><path d="M0 26 h34 l-4 16 h-26z" fill="#c4683a"/><path d="M-2 24 h38 v6 h-38z" fill="#a95632"/>'+
'<path d="M17 24 q-4 -22 -16 -30 M17 24 q2 -26 8 -36 M17 24 q12 -14 22 -18" stroke="#3f6b4a" stroke-width="3" fill="none"/>'+
'<ellipse cx="0" cy="-6" rx="9" ry="4.5" fill="#4c7c55" transform="rotate(-30 0 -6)"/><ellipse cx="26" cy="-12" rx="9" ry="4.5" fill="#5c9a62" transform="rotate(-70 26 -12)"/><ellipse cx="40" cy="6" rx="9" ry="4.5" fill="#4c7c55" transform="rotate(-10 40 6)"/><ellipse cx="8" cy="8" rx="7" ry="3.5" fill="#5c9a62" transform="rotate(30 8 8)"/>'+
'<circle cx="26" cy="-22" r="5" fill="#e58b9b"/><circle cx="26" cy="-22" r="2" fill="#f3d67a"/></g>'+
/* woman watering */
'<g transform="translate(410 70)">'+
'<path d="M10 120 q-6 -66 40 -70 q44 2 44 70z" fill="#6e8fb5"/><path d="M26 76 q24 10 48 0" stroke="#5a7aa0" stroke-width="2" fill="none"/>'+
'<g fill="#fff" opacity=".55"><circle cx="34" cy="90" r="2"/><circle cx="50" cy="100" r="2"/><circle cx="66" cy="88" r="2"/><circle cx="42" cy="110" r="2"/><circle cx="74" cy="108" r="2"/></g>'+
'<rect x="42" y="34" width="14" height="16" rx="6" fill="#e8c4a0"/><circle cx="50" cy="20" r="22" fill="#e8c4a0"/>'+
'<path d="M28 18 q0 -26 24 -26 q24 2 22 26 q-4 -14 -22 -14 q-16 0 -24 14z" fill="#e6e6e6"/><circle cx="60" cy="-6" r="10" fill="#dcdcdc"/>'+
'<path d="M36 20 h10 M54 20 h10" stroke="#555" stroke-width="1.4"/><circle cx="41" cy="22" r="5" fill="none" stroke="#7a6a52" stroke-width="1.5"/><circle cx="59" cy="22" r="5" fill="none" stroke="#7a6a52" stroke-width="1.5"/><path d="M46 22 h8" stroke="#7a6a52" stroke-width="1.5"/>'+
'<path d="M42 32 q8 5 16 0" stroke="#a5583d" stroke-width="2" fill="none"/><path d="M34 12 q2 -2 4 0 M62 12 q2 -2 4 0" stroke="#999" stroke-width="1"/>'+
'<path d="M24 70 q-30 6 -50 -6" stroke="#6e8fb5" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="-28" cy="62" r="7" fill="#e8c4a0"/>'+
/* watering can */
'<g transform="translate(-66 46)"><path d="M10 6 h34 v22 q0 6 -6 6 h-22 q-6 0 -6 -6z" fill="#3f8a5a" stroke="#2c6343" stroke-width="2"/><path d="M10 12 l-22 -14 l-3 4 l20 16" fill="#3f8a5a" stroke="#2c6343" stroke-width="2"/><path d="M44 10 q12 2 10 14" stroke="#2c6343" stroke-width="3" fill="none"/>'+
'<g stroke="#7cc0dc" stroke-width="2" stroke-linecap="round"><path d="M-16 0 l-6 10 M-12 4 l-4 12 M-20 -2 l-8 8"/></g></g></g>'+
/* armchair */
'<g transform="translate(470 150)"><rect x="-6" y="30" width="110" height="40" rx="10" fill="#b5653d"/><rect x="-14" y="10" width="24" height="60" rx="10" fill="#a0532f"/><rect x="92" y="10" width="24" height="60" rx="10" fill="#a0532f"/><path d="M0 70 v14 M96 70 v14" stroke="#5e3a22" stroke-width="5"/></g>'+
/* notice board: movie night choice */
'<g transform="translate(26 40)"><rect width="104" height="96" rx="4" fill="#c8945a" stroke="#7a5a3a" stroke-width="3"/>'+
'<g transform="rotate(-3 50 30)"><rect x="10" y="10" width="84" height="44" fill="#fffdf6"/><text x="16" y="26" font-family="Nunito,Arial" font-size="10" font-weight="900" fill="#3d4a42">MOVIE NIGHT</text>'+
'<rect x="16" y="32" width="8" height="8" fill="none" stroke="#3d4a42" stroke-width="1.2"/><text x="28" y="40" font-family="Nunito,Arial" font-size="8" font-weight="700" fill="#3d4a42">Thursday</text>'+
'<rect x="16" y="42" width="8" height="8" fill="none" stroke="#3d4a42" stroke-width="1.2"/><text x="28" y="50" font-family="Nunito,Arial" font-size="8" font-weight="700" fill="#3d4a42">Friday</text><circle cx="50" cy="12" r="3" fill="#e23b3b"/></g>'+
'<g transform="rotate(4 50 74)"><rect x="18" y="60" width="66" height="28" fill="#f7e9b0"/><text x="26" y="78" font-family="Nunito,Arial" font-size="11" font-weight="900" fill="#7a5a3a">1976</text><circle cx="50" cy="62" r="3" fill="#3f78b5"/></g></g>'+
'</svg>',
pics:[
{at:0.2,near:['two floors','floor'],cap:'Two floors, two messages',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A building cut open. On the top floor, a woman picks a plant herself. On the lower floor, a nurse waters a plant for a man in a chair.">'+
'<rect width="200" height="160" fill="#eaf1f6"/><rect y="146" width="200" height="14" fill="#9cc3a3"/>'+
'<path d="M18 30 l82 -22 l82 22z" fill="#a3685a"/><rect x="22" y="30" width="156" height="116" fill="#e7d9bd" stroke="#8a7a62" stroke-width="2"/>'+
'<path d="M22 88 h156" stroke="#8a7a62" stroke-width="4"/><text x="28" y="44" font-family="Nunito,Arial" font-size="9" font-weight="900" fill="#5a4630">4</text><text x="28" y="102" font-family="Nunito,Arial" font-size="9" font-weight="900" fill="#5a4630">2</text>'+
/* top floor: resident chooses among 3 plants */
'<g transform="translate(46 50)"><rect x="0" y="22" width="70" height="6" fill="#b5653d"/>'+
'<g transform="translate(6 10)"><path d="M0 12 h10 l-1 6 h-8z" fill="#c4683a"/><path d="M5 12 q-4 -8 -2 -12 M5 12 q4 -8 2 -12" stroke="#3f6b4a" stroke-width="2" fill="none"/></g>'+
'<g transform="translate(26 10)"><path d="M0 12 h10 l-1 6 h-8z" fill="#3f78b5"/><circle cx="5" cy="4" r="5" fill="#e58b9b"/><path d="M5 12 v-4" stroke="#3f6b4a" stroke-width="2"/></g>'+
'<g transform="translate(46 10)"><path d="M0 12 h10 l-1 6 h-8z" fill="#e0b030"/><path d="M5 12 l-4 -10 M5 12 l4 -10 M5 12 v-12" stroke="#3f6b4a" stroke-width="2"/></g>'+
'<g transform="translate(84 -4)"><circle cx="8" cy="6" r="7" fill="#e8c4a0"/><path d="M1 4 q2 -10 8 -8 q8 0 6 10 q-4 -6 -8 -4z" fill="#ddd"/><path d="M0 14 h16 l2 18 h-20z" fill="#6e8fb5"/><path d="M0 18 l-12 2" stroke="#e8c4a0" stroke-width="3" stroke-linecap="round"/><path d="M-12 20 l-2 -4" stroke="#e8c4a0" stroke-width="2"/></g>'+
'<text x="62" y="-4" font-family="Nunito,Arial" font-size="14" font-weight="900" fill="#2f6b4f">?</text></g>'+
/* lower floor: nurse waters for resident */
'<g transform="translate(50 106)"><g><rect x="0" y="16" width="34" height="18" rx="4" fill="#b5653d"/><circle cx="16" cy="6" r="7" fill="#c98f65"/><path d="M9 4 q2 -9 8 -8 q7 1 6 9 q-4 -5 -8 -4z" fill="#eee"/><path d="M8 14 h16 l2 12 h-20z" fill="#9a8fb0"/></g>'+
'<g transform="translate(58 0)"><path d="M0 10 h10 l-1 6 h-8z" fill="#c4683a"/><path d="M5 10 q-4 -8 -2 -12 M5 10 q4 -8 2 -12" stroke="#3f6b4a" stroke-width="2" fill="none"/></g>'+
'<g transform="translate(84 -12)"><circle cx="8" cy="6" r="7" fill="#f0c8a4"/><path d="M1 2 h14 v-3 h-14z" fill="#fff" stroke="#e23b3b" stroke-width="1"/><path d="M0 14 h16 l2 20 h-20z" fill="#fff" stroke="#9aa6b8" stroke-width="1.5"/>'+
'<path d="M0 18 l-10 2" stroke="#f0c8a4" stroke-width="3" stroke-linecap="round"/><g transform="translate(-20 14)"><rect x="0" y="0" width="12" height="9" rx="2" fill="#3f8a5a"/><path d="M0 3 l-8 -4" stroke="#3f8a5a" stroke-width="2.5"/><path d="M-9 0 l-2 5 M-7 0 l-1 6" stroke="#7cc0dc" stroke-width="1.5"/></g></g></g>'+
'</svg>'},
{at:0.7,near:['Eighteen months','eighteen months'],cap:'Eighteen months later',svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A wall calendar with many pages flipping. Beside it, the same plant, now much bigger, with flowers.">'+
'<rect width="200" height="160" fill="#f4efe2"/><rect y="128" width="200" height="32" fill="#c9a77a"/><path d="M0 128 h200" stroke="#9c7a52" stroke-width="2"/>'+
/* calendar pages flipping */
'<g transform="translate(16 18)">'+
'<g transform="rotate(-14 40 4)"><rect width="78" height="84" rx="3" fill="#ece4d2" stroke="#8a7a62" stroke-width="1.5"/></g>'+
'<g transform="rotate(-7 40 4)"><rect width="78" height="84" rx="3" fill="#f3ecdc" stroke="#8a7a62" stroke-width="1.5"/></g>'+
'<rect width="78" height="84" rx="3" fill="#fffdf6" stroke="#8a7a62" stroke-width="2"/><rect width="78" height="20" rx="3" fill="#c2484d"/>'+
'<text x="10" y="15" font-family="Nunito,Arial" font-size="10" font-weight="900" fill="#fff">1977</text>'+
'<g fill="#c9bda3"><rect x="8" y="28" width="10" height="8"/><rect x="22" y="28" width="10" height="8"/><rect x="36" y="28" width="10" height="8"/><rect x="50" y="28" width="10" height="8"/><rect x="64" y="28" width="8" height="8"/>'+
'<rect x="8" y="42" width="10" height="8"/><rect x="22" y="42" width="10" height="8"/><rect x="36" y="42" width="10" height="8"/><rect x="50" y="42" width="10" height="8"/><rect x="64" y="42" width="8" height="8"/>'+
'<rect x="8" y="56" width="10" height="8"/><rect x="22" y="56" width="10" height="8"/><rect x="36" y="56" width="10" height="8"/><rect x="50" y="56" width="10" height="8"/><rect x="64" y="56" width="8" height="8"/>'+
'<rect x="8" y="70" width="10" height="8"/><rect x="22" y="70" width="10" height="8"/><rect x="36" y="70" width="10" height="8"/></g>'+
'<circle cx="18" cy="-2" r="3" fill="#555"/><circle cx="60" cy="-2" r="3" fill="#555"/></g>'+
'<path d="M98 50 q14 -8 26 2" stroke="#5b6d8a" stroke-width="2" fill="none" stroke-dasharray="3 3"/><path d="M124 52 l-6 -1 l3 -5z" fill="#5b6d8a"/>'+
/* grown plant */
'<g transform="translate(150 66)"><path d="M-18 46 h36 l-5 20 h-26z" fill="#c4683a"/><path d="M-20 44 h40 v6 h-40z" fill="#a95632"/>'+
'<g stroke="#3f6b4a" stroke-width="3" fill="none"><path d="M0 44 q-6 -30 -22 -46"/><path d="M0 44 q2 -40 6 -58"/><path d="M0 44 q14 -26 26 -34"/><path d="M0 44 q-16 -10 -28 -10"/></g>'+
'<g fill="#4c7c55"><ellipse cx="-22" cy="0" rx="10" ry="5" transform="rotate(-40 -22 0)"/><ellipse cx="6" cy="-14" rx="10" ry="5" transform="rotate(-80 6 -14)"/><ellipse cx="26" cy="10" rx="10" ry="5" transform="rotate(-20 26 10)"/><ellipse cx="-28" cy="34" rx="10" ry="5"/><ellipse cx="-10" cy="16" rx="8" ry="4" transform="rotate(40 -10 16)"/><ellipse cx="14" cy="24" rx="8" ry="4" transform="rotate(-40 14 24)"/></g>'+
'<g><circle cx="6" cy="-28" r="6" fill="#e58b9b"/><circle cx="6" cy="-28" r="2.4" fill="#f3d67a"/><circle cx="-24" cy="-10" r="5" fill="#e58b9b"/><circle cx="-24" cy="-10" r="2" fill="#f3d67a"/><circle cx="30" cy="-2" r="5" fill="#e58b9b"/><circle cx="30" cy="-2" r="2" fill="#f3d67a"/></g></g>'+
'</svg>'}
]};

/* ---------- set intro picture (picker page) ---------- */
var NEWS_ART_SET = window.NEWS_ART_SET = window.NEWS_ART_SET || {};
NEWS_ART_SET['science-of-happiness'] = {cap:'UC Berkeley', svg:
'<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The tall clock tower at UC Berkeley, with trees, hills, and the bay in the distance">'+
'<defs><linearGradient id="hbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc2e2"/><stop offset="1" stop-color="#eaf4f8"/></linearGradient></defs>'+
'<rect width="200" height="160" fill="url(#hbSky)"/>'+
'<path d="M0 92 q40 -28 90 -18 q50 -26 110 -6 v40 h-200z" fill="#8fae86"/><path d="M0 104 q60 -14 120 -4 q40 -8 80 0 v20 h-200z" fill="#7aa06e"/>'+
'<rect x="0" y="112" width="70" height="10" fill="#7cb3d4" opacity=".7"/>'+
'<g fill="#fff" opacity=".8"><ellipse cx="30" cy="30" rx="22" ry="7"/><ellipse cx="160" cy="24" rx="20" ry="6"/></g>'+
/* campanile */
'<g transform="translate(100 0)"><path d="M-8 18 l8 -12 l8 12z" fill="#7d8a8a"/><path d="M0 6 v-4" stroke="#7d8a8a" stroke-width="1.5"/>'+
'<rect x="-11" y="18" width="22" height="22" fill="#e9e3d6" stroke="#9a9184" stroke-width="1"/><g fill="#5a5448"><rect x="-8" y="22" width="4" height="14" rx="2"/><rect x="-2" y="22" width="4" height="14" rx="2"/><rect x="4" y="22" width="4" height="14" rx="2"/></g>'+
'<rect x="-13" y="40" width="26" height="4" fill="#d8d0c0"/><rect x="-11" y="44" width="22" height="84" fill="#efe9dc" stroke="#9a9184" stroke-width="1"/>'+
'<circle cx="0" cy="54" r="7" fill="#fbfaf4" stroke="#5a5448" stroke-width="1.2"/><path d="M0 54 v-4 M0 54 l3 2" stroke="#2b2b2b" stroke-width="1.2"/>'+
'<g stroke="#d6cfbe" stroke-width="1"><path d="M-5 66 v58 M5 66 v58"/></g><g fill="#c8c0ae"><rect x="-3" y="72" width="6" height="8"/><rect x="-3" y="92" width="6" height="8"/></g>'+
'<rect x="-16" y="124" width="32" height="10" fill="#d8d0c0"/></g>'+
/* trees */
'<g fill="#3f6b4a"><circle cx="40" cy="120" r="18"/><circle cx="58" cy="128" r="14"/><circle cx="150" cy="122" r="20"/><circle cx="172" cy="130" r="14"/></g><g fill="#4c7c55"><circle cx="34" cy="114" r="10"/><circle cx="156" cy="114" r="10"/></g>'+
'<rect y="136" width="200" height="24" fill="#c9b796"/><path d="M60 160 q40 -26 80 0" fill="#d8c8a8"/>'+
'<g transform="translate(118 132)"><circle cx="0" cy="-12" r="3" fill="#c98f65"/><path d="M-3 -9 h6 l1 8 h-8z" fill="#003262"/><path d="M-2 -1 v6 M2 -1 v6" stroke="#333" stroke-width="1.5"/></g>'+
'<g transform="translate(130 132)"><circle cx="0" cy="-12" r="3" fill="#f0c8a4"/><path d="M-3 -9 h6 l1 8 h-8z" fill="#fdb515"/><path d="M-2 -1 v6 M2 -1 v6" stroke="#333" stroke-width="1.5"/></g>'+
'</svg>'};
