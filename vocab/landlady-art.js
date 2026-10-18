/* ============================================================
   landlady-art.js — drawn SVG pictures for the twelve core words
   in vocab/landlady-words.js. Same 200x160 card as the cozy/creepy
   pictures on the Landlady page. Abstract words are contrast pairs
   (right side carries the red X); concrete words are one detailed
   scene. No caption names the word.

   Use:  LL_ART["porter"]            -> svg string
         llArt("porter", "class")    -> svg string with a class added
   If a page has #words-tab .wcard[data-w] cards, the file swaps
   each card's emoji (.we) for its picture on load.
   ============================================================ */

var LL_ART = {

/* ---- porter: uniformed man lifting a suitcase onto a train ---- */
"porter": '<svg viewBox="0 0 200 160" role="img" aria-label="A station platform. A man in a navy cap and jacket with brass buttons lifts a brown leather suitcase up into the open door of a green railway carriage; a round station clock hangs above, steam drifts past.">'
+'<defs><linearGradient id="po-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8d6"/><stop offset="1" stop-color="#e9e4d8"/></linearGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="url(#po-sky)"/>'
+'<g fill="#a8938a"><rect x="0" y="18" width="200" height="94"/></g>'
+'<g fill="#977f76" opacity=".7"><rect x="0" y="30" width="200" height="4"/><rect x="0" y="48" width="200" height="4"/><rect x="0" y="66" width="200" height="4"/><rect x="0" y="84" width="200" height="4"/><rect x="0" y="102" width="200" height="4"/></g>'
+'<g fill="#b9a59c" opacity=".5"><rect x="12" y="34" width="18" height="14"/><rect x="48" y="52" width="18" height="14"/><rect x="20" y="88" width="18" height="14"/><rect x="60" y="70" width="18" height="14"/></g>'
+'<rect x="0" y="112" width="200" height="48" fill="#8a8580"/><rect x="0" y="112" width="200" height="5" fill="#d9c35a"/><rect x="0" y="117" width="200" height="2" fill="#5e5955"/>'
+'<g><path d="M26 18 v10" stroke="#4a4340" stroke-width="2"/><circle cx="26" cy="38" r="12" fill="#f4efe3" stroke="#4a4340" stroke-width="2.4"/><g stroke="#4a4340" stroke-width="1" opacity=".7"><path d="M26 28v3 M26 45v3 M16 38h3 M33 38h3"/></g><path d="M26 38 l0 -7 M26 38 l5 3" stroke="#2a2420" stroke-width="1.6" stroke-linecap="round"/><circle cx="26" cy="38" r="1.2" fill="#2a2420"/></g>'
+'<g><rect x="108" y="8" width="92" height="116" rx="6" fill="#3f6b4c"/><rect x="108" y="8" width="92" height="14" rx="6" fill="#2f5238"/><rect x="112" y="52" width="88" height="6" fill="#d9b24f"/>'
+'<rect x="124" y="26" width="18" height="22" rx="2" fill="#bfd3dc"/><rect x="124" y="26" width="18" height="10" fill="#dfeaee" opacity=".7"/>'
+'<rect x="176" y="26" width="18" height="22" rx="2" fill="#bfd3dc"/><rect x="176" y="26" width="18" height="10" fill="#dfeaee" opacity=".7"/>'
+'<rect x="150" y="26" width="22" height="98" fill="#1f3326"/><rect x="152" y="28" width="18" height="24" fill="#8fb0bd"/>'
+'<rect x="150" y="26" width="3" height="98" fill="#2f5238"/><rect x="169" y="26" width="3" height="98" fill="#2f5238"/>'
+'<circle cx="166" cy="78" r="2.2" fill="#d9b24f"/><rect x="148" y="100" width="26" height="4" fill="#d9b24f"/><rect x="146" y="104" width="30" height="20" fill="#5a5450"/><rect x="146" y="104" width="30" height="3" fill="#8a8580"/><rect x="146" y="114" width="30" height="3" fill="#8a8580"/>'
+'<circle cx="124" cy="126" r="9" fill="#2a2420"/><circle cx="124" cy="126" r="4" fill="#8a8580"/><circle cx="184" cy="126" r="9" fill="#2a2420"/><circle cx="184" cy="126" r="4" fill="#8a8580"/></g>'
+'<g opacity=".8"><ellipse cx="176" cy="10" rx="12" ry="6" fill="#f2f0ea"><animate attributeName="cx" values="176;186;196" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;.4;0" dur="4s" repeatCount="indefinite"/></ellipse><ellipse cx="160" cy="14" rx="9" ry="5" fill="#f2f0ea"><animate attributeName="cx" values="160;170;182" dur="4s" begin="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;.3;0" dur="4s" begin="1.5s" repeatCount="indefinite"/></ellipse></g>'
+'<g><rect x="60" y="94" width="22" height="18" rx="2" fill="#4a4340"/><rect x="60" y="94" width="22" height="4" fill="#5e5955"/><circle cx="64" cy="114" r="3" fill="#2a2420"/><circle cx="78" cy="114" r="3" fill="#2a2420"/><path d="M58 94 v-16 h4 v16" fill="#6b625c"/></g>'
+'<g><path d="M96 70 l-4 44 h8 l5 -30 l6 30 h8 l-2 -44z" fill="#2c3a5c"/><rect x="100" y="112" width="9" height="5" rx="1" fill="#1b1a1a"/><rect x="112" y="112" width="9" height="5" rx="1" fill="#1b1a1a"/>'
+'<path d="M92 48 q-8 2 -8 10 v16 q0 8 8 8 h22 q8 0 8 -8 v-16 q0 -8 -8 -10z" fill="#2f4c7a"/><path d="M103 48 v34" stroke="#1f3454" stroke-width="1.2"/><g fill="#d9b24f"><circle cx="103" cy="56" r="1.5"/><circle cx="103" cy="64" r="1.5"/><circle cx="103" cy="72" r="1.5"/></g><rect x="90" y="52" width="6" height="2" fill="#d9b24f"/>'
+'<path d="M92 50 l-14 -2 l-8 -22" stroke="#2f4c7a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M114 50 l14 0 l8 -20" stroke="#2f4c7a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="70" cy="26" r="4" fill="#e3b58f"/><circle cx="136" cy="30" r="4" fill="#e3b58f"/>'
+'<circle cx="103" cy="38" r="9" fill="#e3b58f"/><path d="M93 34 q10 -8 20 0 l0 -4 q-10 -6 -20 0z" fill="#1f2f4d"/><rect x="92" y="32" width="22" height="4" rx="1" fill="#1a2740"/><rect x="100" y="28" width="6" height="3" fill="#d9b24f"/><path d="M99 41 q4 3 8 0" stroke="#7a4b3a" stroke-width="1" fill="none"/><circle cx="100" cy="37" r=".9" fill="#2a2420"/><circle cx="106" cy="37" r=".9" fill="#2a2420"/>'
+'<g transform="rotate(-18 92 22)"><rect x="66" y="6" width="52" height="32" rx="4" fill="#8a5a3a"/><rect x="66" y="6" width="52" height="32" rx="4" fill="none" stroke="#5a3620" stroke-width="1.5"/><rect x="76" y="6" width="5" height="32" fill="#5a3620"/><rect x="103" y="6" width="5" height="32" fill="#5a3620"/><rect x="86" y="2" width="12" height="6" rx="3" fill="none" stroke="#5a3620" stroke-width="2.4"/><path d="M69 9 h46 M69 35 h46" stroke="#b07a52" stroke-width=".7" stroke-dasharray="2 1.6"/><rect x="86" y="14" width="14" height="10" fill="#f1e5c8" transform="rotate(-6 93 19)"/><path d="M88 18h10 M88 21h7" stroke="#6b5a3a" stroke-width=".8"/><g fill="#d9b24f"><circle cx="70" cy="10" r="1.4"/><circle cx="114" cy="10" r="1.4"/><circle cx="70" cy="34" r="1.4"/><circle cx="114" cy="34" r="1.4"/></g></g></g>'
+'</svg>',

/* ---- compulsion: leaning toward the open door, sleeve pulled back ---- */
"compulsion": '<svg viewBox="0 0 200 160" role="img" aria-label="A dark hallway. A young man in a coat and hat leans hard toward an open door full of warm firelight, one foot already lifted, while a pale hand from the left edge grips his sleeve and pulls it back.">'
+'<defs><radialGradient id="cp-glow" cx="100%" cy="50%" r="80%"><stop offset="0" stop-color="#ffd27a"/><stop offset=".55" stop-color="#c9772c" stop-opacity=".55"/><stop offset="1" stop-color="#2a2430" stop-opacity="0"/></radialGradient><linearGradient id="cp-door" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6a8"/><stop offset="1" stop-color="#e2962f"/></linearGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="#2a2430"/>'
+'<rect x="0" y="118" width="200" height="42" fill="#3b3140"/><g stroke="#2a2430" stroke-width="1.2"><path d="M0 128h200 M0 140h200 M0 152h200"/></g>'
+'<g stroke="#4a3f52" stroke-width="1" opacity=".7"><path d="M20 22h20v70h-20z M60 26h16v62h-16z"/></g>'
+'<rect x="128" y="18" width="60" height="104" fill="url(#cp-door)"/><rect x="128" y="18" width="60" height="104" fill="none" stroke="#6b4a2a" stroke-width="3"/>'
+'<rect x="128" y="18" width="60" height="104" fill="url(#cp-glow)"><animate attributeName="opacity" values="1;.75;1" dur="2.6s" repeatCount="indefinite"/></rect>'
+'<path d="M128 18 l-14 8 v104 l14 -8z" fill="#5a3b25" stroke="#3a2516" stroke-width="1.5"/><circle cx="118" cy="76" r="2.4" fill="#d9b24f"/>'
+'<g fill="#b8641e" opacity=".9"><rect x="150" y="60" width="22" height="30" rx="2"/><path d="M152 90 q9 -22 18 0z" fill="#ffc94d"><animate attributeName="d" values="M152 90 q9 -22 18 0z;M152 90 q6 -26 18 0z;M152 90 q9 -22 18 0z" dur="1.1s" repeatCount="indefinite"/></path><path d="M156 90 q5 -12 10 0z" fill="#fff0a8"/></g>'
+'<g><circle cx="178" cy="98" r="5" fill="#f7e8d6"/><path d="M173 98 q5 -5 10 0" stroke="#c46a3a" stroke-width="1.2" fill="none"/><path d="M175 92 q3 -4 6 0" stroke="#f7e8d6" stroke-width="1" fill="none" opacity=".8"><animate attributeName="opacity" values=".8;.2;.8" dur="2s" repeatCount="indefinite"/></path></g>'
+'<path d="M96 60 q20 2 40 0 M98 84 q22 -2 40 0 M100 108 q20 2 36 0" stroke="#ffd27a" stroke-width="1.6" fill="none" opacity=".6" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" values="18;0" dur="1.2s" repeatCount="indefinite"/></path>'
+'<g transform="rotate(-24 86 96)">'
+'<rect x="78" y="106" width="9" height="20" rx="2" fill="#3a3a4a"/><rect x="90" y="106" width="9" height="20" rx="2" fill="#3a3a4a" transform="rotate(34 94 106)"/><rect x="76" y="124" width="13" height="5" rx="1" fill="#1b1a1a"/><rect x="104" y="117" width="13" height="5" rx="1" fill="#1b1a1a" transform="rotate(34 104 117)"/>'
+'<path d="M72 62 q14 -6 28 0 l6 48 h-40z" fill="#6b5a4a"/><path d="M86 62 v48" stroke="#4e4035" stroke-width="1"/><g fill="#2a2420"><circle cx="86" cy="74" r="1.3"/><circle cx="86" cy="86" r="1.3"/><circle cx="86" cy="98" r="1.3"/></g>'
+'<path d="M100 64 l20 -4 l10 -4" stroke="#6b5a4a" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="132" cy="56" r="4.5" fill="#e3b58f"/>'
+'<path d="M72 66 l-16 10 l-18 2" stroke="#6b5a4a" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M60 72 l-4 4 M64 70 l-4 6" stroke="#4e4035" stroke-width="1" opacity=".9"/>'
+'<circle cx="86" cy="48" r="10" fill="#e3b58f"/><path d="M74 46 q12 -12 26 -2 l2 -2 q-14 -14 -30 2z" fill="#5a4030"/><ellipse cx="88" cy="38" rx="15" ry="4" fill="#4a3426"/><path d="M80 52 q4 1 8 -1" stroke="#7a4b3a" stroke-width="1" fill="none"/><circle cx="92" cy="47" r="1.1" fill="#2a2420"/><circle cx="84" cy="48" r="1" fill="#2a2420"/>'
+'</g>'
+'<g><path d="M0 80 q18 -2 34 4" stroke="#3a3340" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 80 q18 -2 34 4" stroke="#4e4658" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="86" rx="9" ry="7" fill="#d8d3e6"/><g stroke="#d8d3e6" stroke-width="3.6" stroke-linecap="round" fill="none"><path d="M46 80 q8 -4 10 2"/><path d="M48 85 q8 -2 10 4"/><path d="M48 90 q8 0 9 5"/><path d="M46 94 q6 1 7 5"/></g><g stroke="#a39cb8" stroke-width="1" fill="none" opacity=".8"><path d="M46 80 q8 -4 10 2 M48 85 q8 -2 10 4 M48 90 q8 0 9 5"/></g><path d="M40 80 q4 2 6 6" stroke="#a39cb8" stroke-width="1" fill="none"/></g>'
+'</svg>',

/* ---- peculiar: contrast pair: a goldfish in a teacup; the ordinary tea carries the X ---- */
"peculiar": '<svg viewBox="0 0 200 160" role="img" aria-label="Two panels on a checked tablecloth. Left, a teacup on its saucer, but instead of tea there is water with a small orange goldfish swimming in it and bubbles rising; a puzzled question mark floats above. Right, an ordinary cup of brown tea with a little steam; a red X marks this side.">'
+'<rect width="200" height="160" rx="10" fill="#e9e1cf"/>'
+'<rect x="0" y="0" width="200" height="74" fill="#6f8f7a"/><path d="M0 24 H200 M0 48 H200" stroke="#5f7f6a" stroke-width="2"/>'
+'<g fill="#f3e9d6"><rect x="0" y="74" width="200" height="86"/></g>'
+'<g fill="#e2b9b0"><rect x="0" y="74" width="14" height="14"/><rect x="28" y="74" width="14" height="14"/><rect x="56" y="74" width="14" height="14"/><rect x="84" y="74" width="14" height="14"/><rect x="112" y="74" width="14" height="14"/><rect x="140" y="74" width="14" height="14"/><rect x="168" y="74" width="14" height="14"/><rect x="14" y="88" width="14" height="14"/><rect x="42" y="88" width="14" height="14"/><rect x="70" y="88" width="14" height="14"/><rect x="98" y="88" width="14" height="14"/><rect x="126" y="88" width="14" height="14"/><rect x="154" y="88" width="14" height="14"/><rect x="182" y="88" width="14" height="14"/><rect x="0" y="102" width="14" height="14"/><rect x="28" y="102" width="14" height="14"/><rect x="56" y="102" width="14" height="14"/><rect x="84" y="102" width="14" height="14"/><rect x="112" y="102" width="14" height="14"/><rect x="140" y="102" width="14" height="14"/><rect x="168" y="102" width="14" height="14"/><rect x="14" y="116" width="14" height="14"/><rect x="42" y="116" width="14" height="14"/><rect x="70" y="116" width="14" height="14"/><rect x="98" y="116" width="14" height="14"/><rect x="126" y="116" width="14" height="14"/><rect x="154" y="116" width="14" height="14"/><rect x="182" y="116" width="14" height="14"/><rect x="0" y="130" width="14" height="14"/><rect x="28" y="130" width="14" height="14"/><rect x="56" y="130" width="14" height="14"/><rect x="84" y="130" width="14" height="14"/><rect x="112" y="130" width="14" height="14"/><rect x="140" y="130" width="14" height="14"/><rect x="168" y="130" width="14" height="14"/><rect x="14" y="144" width="14" height="14"/><rect x="42" y="144" width="14" height="14"/><rect x="70" y="144" width="14" height="14"/><rect x="98" y="144" width="14" height="14"/><rect x="126" y="144" width="14" height="14"/><rect x="154" y="144" width="14" height="14"/><rect x="182" y="144" width="14" height="14"/></g>'
+'<rect x="99" y="0" width="2" height="160" fill="#4a3a28"/>'
+'<!-- left: fish in the cup -->'
+'<ellipse cx="50" cy="128" rx="36" ry="8" fill="#fff" stroke="#9fb0c4" stroke-width="1.5"/>'
+'<path d="M22 94 h56 q-2 30 -28 32 q-26 -2 -28 -32z" fill="#fff" stroke="#9fb0c4" stroke-width="1.5"/>'
+'<path d="M78 100 q14 0 12 12 q-2 8 -14 6" stroke="#9fb0c4" stroke-width="4" fill="none"/>'
+'<path d="M22 94 h56" stroke="#2d6ea8" stroke-width="2.5"/>'
+'<ellipse cx="50" cy="96" rx="27" ry="4" fill="#9fd3f0"/>'
+'<g transform="translate(48,104)"><path d="M-10 0 q10 -10 20 0 q-10 10 -20 0z" fill="#f08a24"/><path d="M10 0 l8 -7 v14z" fill="#e06f12"/><circle cx="-5" cy="-1" r="1.6" fill="#1a1208"/><path d="M-2 -6 q4 2 6 0" stroke="#c45a0e" stroke-width="1" fill="none"/></g>'
+'<g fill="none" stroke="#5ba8d8" stroke-width="1.2"><circle cx="40" cy="86" r="2"/><circle cx="36" cy="78" r="2.6"/><circle cx="42" cy="70" r="1.6"/></g>'
+'<text x="58" y="68" font-family="Georgia, serif" font-weight="700" font-size="26" fill="#f6e7b8" stroke="#4a3a28" stroke-width="1">?</text>'
+'<!-- right: ordinary tea -->'
+'<ellipse cx="150" cy="128" rx="36" ry="8" fill="#fff" stroke="#9fb0c4" stroke-width="1.5"/>'
+'<path d="M122 94 h56 q-2 30 -28 32 q-26 -2 -28 -32z" fill="#fff" stroke="#9fb0c4" stroke-width="1.5"/>'
+'<path d="M178 100 q14 0 12 12 q-2 8 -14 6" stroke="#9fb0c4" stroke-width="4" fill="none"/>'
+'<path d="M122 94 h56" stroke="#2d6ea8" stroke-width="2.5"/>'
+'<ellipse cx="150" cy="96" rx="27" ry="4" fill="#9a6232"/>'
+'<path d="M140 86 q-4 -8 2 -14 q4 -6 0 -12 M152 86 q-4 -8 2 -14 q4 -6 0 -12" stroke="#e8eef3" stroke-width="2" fill="none" opacity=".9"/>'
+'<circle cx="182" cy="18" r="11" fill="#fff" stroke="#c81e3a" stroke-width="3"/><path d="M176 12 l12 12 M188 12 l-12 12" stroke="#c81e3a" stroke-width="3" stroke-linecap="round"/>'
+'</svg>',
/* ---- neglect: contrast pair: a plant nobody looks after; the cared-for plant carries the X ---- */
"neglect": '<svg viewBox="0 0 200 160" role="img" aria-label="Two panels. Left, a houseplant nobody looks after: its leaves are brown and drooping, dead leaves lie on the dusty table, the soil in the pot is dry and cracked, a cobweb hangs from the pot and old letters pile up unopened. Right, the same plant green and healthy while a hand waters it from a watering can; a red X marks this side.">'
+'<rect width="200" height="160" rx="10" fill="#efe6d4"/>'
+'<rect x="0" y="0" width="99" height="160" fill="#ddd2bd"/>'
+'<rect x="101" y="0" width="99" height="160" fill="#eef3e6"/>'
+'<rect x="99" y="0" width="2" height="160" fill="#4a3a28"/>'
+'<!-- left: neglected plant -->'
+'<rect x="4" y="118" width="92" height="8" fill="#8a6a4a"/><rect x="4" y="126" width="92" height="30" fill="#6e5238"/>'
+'<g fill="#b8ab94" opacity=".7"><circle cx="16" cy="117" r="1"/><circle cx="30" cy="116" r="1.2"/><circle cx="78" cy="117" r="1"/><circle cx="88" cy="116" r=".9"/></g>'
+'<rect x="60" y="106" width="30" height="5" fill="#f2ecdf" transform="rotate(-6 75 108)"/><rect x="62" y="110" width="30" height="5" fill="#e8e0cf" transform="rotate(4 77 112)"/><rect x="58" y="113" width="32" height="5" fill="#f6f1e6"/>'
+'<path d="M60 113 l16 3 l16 -3" stroke="#c9bfa9" stroke-width=".8" fill="none"/>'
+'<path d="M22 118 l4 -24 h28 l4 24z" fill="#b5653f"/><rect x="23" y="92" width="34" height="5" rx="1" fill="#9c5434"/>'
+'<path d="M27 96 h26" stroke="#5c3a24" stroke-width="2"/><path d="M30 96 l3 -2 l2 2 l3 -2 M42 96 l2 -2 l3 2" stroke="#3a2416" stroke-width=".8" fill="none"/>'
+'<path d="M40 93 q-2 -16 -8 -26" stroke="#7a6a3a" stroke-width="2" fill="none"/><path d="M40 93 q4 -18 12 -26" stroke="#7a6a3a" stroke-width="2" fill="none"/>'
+'<path d="M32 67 q-10 4 -12 16 q8 -2 12 -16z" fill="#a07d3c"/><path d="M52 67 q10 6 9 18 q-8 -6 -9 -18z" fill="#8f6a2e"/>'
+'<path d="M36 74 q-8 10 -6 20 q6 -8 6 -20z" fill="#b08a44"/>'
+'<path d="M14 116 q4 -4 8 0 q-4 2 -8 0z M64 104 q3 -3 7 0 q-3 2 -7 0z" fill="#9c7a3a"/>'
+'<g stroke="#9a9488" stroke-width=".6" fill="none" opacity=".9"><path d="M57 96 l10 8 M57 100 l9 2 M60 94 l3 10 M58 98 q4 -1 6 3 M59 101 q3 -2 6 1"/></g>'
+'<!-- right: cared-for plant, watered -->'
+'<rect x="104" y="118" width="92" height="8" fill="#8a6a4a"/><rect x="104" y="126" width="92" height="30" fill="#6e5238"/>'
+'<path d="M124 118 l4 -24 h28 l4 24z" fill="#c8754a"/><rect x="125" y="92" width="34" height="5" rx="1" fill="#ad6140"/>'
+'<path d="M142 93 v-30" stroke="#3f7a2e" stroke-width="2.2"/>'
+'<path d="M142 80 q-18 -4 -22 -18 q16 0 22 18z" fill="#5aa043"/><path d="M142 72 q18 -6 20 -20 q-16 2 -20 20z" fill="#4c9238"/>'
+'<path d="M142 64 q-10 -10 -6 -22 q10 8 6 22z" fill="#6bb553"/><path d="M142 86 q14 2 18 -8 q-12 -4 -18 8z" fill="#5aa043"/>'
+'<path d="M134 50 l-4 4 M144 58 v4" stroke="#2e6a20" stroke-width=".8"/>'
+'<g transform="translate(-18,16)"><path d="M170 30 h18 q6 0 6 6 v12 q0 6 -6 6 h-18z" fill="#4a86c4"/><path d="M170 36 l-20 10 l2 4 l18 -6z" fill="#3a74b0"/>'
+'<path d="M188 32 q10 2 10 14" stroke="#2f5f94" stroke-width="3" fill="none"/>'
+'<path d="M193 -20 v48" stroke="#7a4a8a" stroke-width="10"/><circle cx="193" cy="31" r="5.5" fill="#d9a07a"/>'
+'<g fill="#7fc0ee"><path d="M150 50 q-2 4 0 6 q2 -2 0 -6z"/><path d="M146 56 q-2 4 0 6 q2 -2 0 -6z"/><path d="M152 60 q-2 4 0 6 q2 -2 0 -6z"/></g>'
+'</g>'
+'<circle cx="116" cy="18" r="11" fill="#fff" stroke="#c81e3a" stroke-width="3"/><path d="M110 12 l12 12 M122 12 l-12 12" stroke="#c81e3a" stroke-width="3" stroke-linecap="round"/>'
+'</svg>',
/* ---- preserved: specimen jar on a museum shelf ---- */
"preserved": '<svg viewBox="0 0 200 160" role="img" aria-label="A museum shelf against a dark green wall. A tall glass jar with a brass lid holds a small pale frog floating in yellowish liquid; a cream label with a pin hangs beneath it, and a smaller jar stands behind.">'
+'<defs><linearGradient id="pv-liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9d98a"/><stop offset="1" stop-color="#b8a04a"/></linearGradient><linearGradient id="pv-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="#2f4a3e"/><g stroke="#28403a" stroke-width="1.2"><path d="M0 20h200 M0 40h200 M0 60h200 M0 80h200"/></g>'
+'<rect x="0" y="122" width="200" height="12" fill="#6b4a2e"/><rect x="0" y="134" width="200" height="4" fill="#4a3220"/><path d="M0 122h200" stroke="#8a6238" stroke-width="2"/><g fill="#5a3c24" opacity=".6"><path d="M20 128h30 M80 130h50 M150 127h30" stroke="#5a3c24" stroke-width="1"/></g>'
+'<g opacity=".85"><rect x="134" y="66" width="34" height="56" rx="5" fill="#8a9a7a"/><rect x="134" y="80" width="34" height="42" rx="5" fill="#b9b06a" opacity=".8"/><rect x="132" y="62" width="38" height="8" rx="2" fill="#8a7a3a"/><path d="M150 112 q-10 -10 -4 -20 q6 8 4 20z" fill="#6f7a52"/><rect x="134" y="66" width="34" height="56" rx="5" fill="url(#pv-glass)"/></g>'
+'<g><rect x="66" y="34" width="52" height="88" rx="7" fill="#cfd7cf"/><rect x="66" y="46" width="52" height="76" rx="7" fill="url(#pv-liq)"/><rect x="62" y="28" width="60" height="10" rx="3" fill="#c9a24a"/><rect x="62" y="28" width="60" height="3" fill="#e2c77a"/><rect x="66" y="38" width="52" height="4" fill="#8a7a3a"/>'
+'<g transform="translate(92,86)"><ellipse cx="0" cy="4" rx="10" ry="14" fill="#9fb48a"/><ellipse cx="0" cy="-10" rx="8" ry="7" fill="#b2c69c"/><circle cx="-4" cy="-12" r="2.2" fill="#f1f1e4"/><circle cx="4" cy="-12" r="2.2" fill="#f1f1e4"/><circle cx="-4" cy="-12" r=".9" fill="#5a5a50"/><circle cx="4" cy="-12" r=".9" fill="#5a5a50"/><path d="M-9 -4 q-10 -2 -14 -12 M9 -4 q10 -2 14 -12" stroke="#9fb48a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M-6 14 q-12 4 -16 16 M6 14 q12 4 16 16" stroke="#9fb48a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-23 -16 l-3 -3 M-23 -16 l-4 1 M23 -16 l3 -3 M23 -16 l4 1" stroke="#9fb48a" stroke-width="2" stroke-linecap="round"/><ellipse cx="0" cy="6" rx="5" ry="9" fill="#d6e0c4" opacity=".6"/><path d="M-3 -8 q3 2 6 0" stroke="#6f7a52" stroke-width=".8" fill="none"/></g>'
+'<g fill="#fff8d6" opacity=".7"><circle cx="76" cy="100" r="1.2"><animate attributeName="cy" values="110;50" dur="6s" repeatCount="indefinite"/></circle><circle cx="108" cy="80" r=".9"><animate attributeName="cy" values="116;50" dur="7.5s" begin="2s" repeatCount="indefinite"/></circle></g>'
+'<rect x="66" y="34" width="52" height="88" rx="7" fill="url(#pv-glass)"/><path d="M72 42 v70" stroke="#fff" stroke-width="2" opacity=".35"/></g>'
+'<g><rect x="56" y="138" width="60" height="16" rx="2" fill="#f1e5c8" stroke="#b8a070" stroke-width="1"/><circle cx="60" cy="141" r="1.6" fill="#c81e3a"/><text x="86" y="145" font-family="Courier Prime, monospace" font-size="4.6" text-anchor="middle" fill="#3a3020">Rana temporaria</text><text x="86" y="151" font-family="Courier Prime, monospace" font-size="4" text-anchor="middle" fill="#6b5a3a">specimen 1931</text></g>'
+'</svg>',

/* ---- briskly: contrast pair: fast, long strides; the slow stroll carries the X ---- */
"briskly": '<svg viewBox="0 0 200 160" role="img" aria-label="Two panels on a city pavement. Left, a young man in a suit and hat walks fast with long steps, arms swinging, coat flying out behind him, speed lines and little puffs of dust at his heels. Right, the same man walks very slowly with his hands in his pockets, eyes half closed, and a snail beside him is keeping up; a red X marks this side.">'
+'<rect width="200" height="160" rx="10" fill="#dfe5ea"/>'
+'<rect x="0" y="0" width="99" height="160" fill="#e6ecf1"/><rect x="99" y="0" width="2" height="160" fill="#4a3a28"/>'
+'<g fill="#c4ccd4"><rect x="6" y="18" width="20" height="96"/><rect x="72" y="28" width="22" height="86"/><rect x="108" y="22" width="22" height="92"/><rect x="170" y="30" width="24" height="84"/></g>'
+'<rect x="0" y="128" width="200" height="32" fill="#9aa2aa"/><path d="M0 128 H200" stroke="#7d858d" stroke-width="2"/>'
+'<!-- left: brisk -->'
+'<g stroke="#5a6a7a" stroke-width="2.2" stroke-linecap="round"><path d="M6 70 h18 M2 84 h24 M8 98 h16"/></g>'
+'<g fill="#b9b2a2" opacity=".8"><circle cx="30" cy="126" r="4"/><circle cx="24" cy="124" r="3"/><circle cx="19" cy="126" r="2"/></g>'
+'<path d="M54 92 l-20 32 h8 l18 -26z" fill="#2c3a5e"/><path d="M56 92 l16 32 h-8 l-14 -26z" fill="#33446c"/>'
+'<path d="M30 122 h13 l1 5 h-15z M66 122 h12 l2 5 h-14z" fill="#2a1c12"/>'
+'<path d="M44 54 q12 -4 24 0 l4 40 q-16 4 -32 0z" fill="#3a4f80"/>'
+'<path d="M44 58 q-12 10 -16 28" stroke="#3a4f80" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="28" cy="88" r="3.5" fill="#e3b48c"/>'
+'<path d="M66 58 q12 6 16 18" stroke="#3a4f80" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="83" cy="78" r="3.5" fill="#e3b48c"/>'
+'<rect x="78" y="78" width="16" height="12" rx="2" fill="#7a4e2c"/><path d="M82 78 q4 -4 8 0" stroke="#5a3a20" stroke-width="1.6" fill="none"/>'
+'<path d="M40 90 q-8 4 -14 2 q6 -6 14 -10z" fill="#30436f"/>'
+'<path d="M53 56 l3 10 l3 -10" fill="#f2ecdf"/><path d="M55 58 h2 l1 8 h-4z" fill="#a33232"/>'
+'<circle cx="56" cy="42" r="10" fill="#eec4a0"/><path d="M60 41 h3" stroke="#2a1c12" stroke-width="1.6"/><circle cx="61" cy="40" r="1.3" fill="#2a1c12"/>'
+'<path d="M58 47 q3 1 5 -1" stroke="#8c4a3a" stroke-width="1.2" fill="none"/><path d="M58 36 l6 -1" stroke="#5a3a20" stroke-width="1.4"/>'
+'<ellipse cx="55" cy="33" rx="13" ry="3" fill="#4a3220"/><path d="M47 33 q0 -10 9 -11 q9 1 9 11z" fill="#6b4a2c"/><rect x="47" y="29" width="18" height="3" fill="#2a1c12"/>'
+'<!-- right: slow -->'
+'<path d="M146 92 l-4 32 h8 l3 -30z" fill="#2c3a5e"/><path d="M152 92 l6 32 h-8 l-5 -30z" fill="#33446c"/>'
+'<path d="M136 122 h14 l1 5 h-16z M150 122 h14 l1 5 h-16z" fill="#2a1c12"/>'
+'<path d="M136 56 q12 -4 24 0 l3 38 q-15 4 -30 0z" fill="#3a4f80"/>'
+'<path d="M138 60 q-4 14 2 26" stroke="#30436f" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M158 60 q4 14 -2 26" stroke="#30436f" stroke-width="7" stroke-linecap="round" fill="none"/>'
+'<path d="M136 84 h10 v6 h-10z M150 84 h10 v6 h-10z" fill="#2c3a5e"/>'
+'<path d="M145 58 l3 10 l3 -10" fill="#f2ecdf"/><path d="M147 60 h2 l1 8 h-4z" fill="#a33232"/>'
+'<circle cx="148" cy="46" r="10" fill="#eec4a0"/>'
+'<path d="M143 46 q2 1 4 0 M151 46 q2 1 4 0" stroke="#2a1c12" stroke-width="1.4" fill="none"/>'
+'<ellipse cx="149" cy="52" rx="2.4" ry="2" fill="#8c4a3a"/>'
+'<ellipse cx="148" cy="37" rx="13" ry="3" fill="#4a3220"/><path d="M140 37 q0 -10 9 -11 q9 1 9 11z" fill="#6b4a2c"/><rect x="140" y="33" width="18" height="3" fill="#2a1c12"/>'
+'<text x="162" y="38" font-family="Georgia, serif" font-size="9" fill="#5a6a7a">z z</text>'
+'<g transform="translate(170,118)"><path d="M-4 9 q0 -6 8 -6 h10 q4 0 4 4 v2z" fill="#c9a26a"/><circle cx="6" cy="2" r="7" fill="#9a6a3a"/><path d="M6 2 m-4 0 a4 4 0 1 1 4 4" stroke="#6b4422" stroke-width="1.2" fill="none"/><path d="M14 4 l3 -6 M16 4 l5 -5" stroke="#9a7a4a" stroke-width="1"/></g>'
+'<circle cx="182" cy="18" r="11" fill="#fff" stroke="#c81e3a" stroke-width="3"/><path d="M176 12 l12 12 M188 12 l-12 12" stroke="#c81e3a" stroke-width="3" stroke-linecap="round"/>'
+'</svg>',
/* ---- lodgings: narrow house front, lit upstairs window, card in the glass ---- */
"lodgings": '<svg viewBox="0 0 200 160" role="img" aria-label="A narrow brick house at night. The upstairs window glows warm behind curtains; a small white card is propped in the lower pane of the downstairs window; a street lamp lights the step and a moon sits over the chimney.">'
+'<defs><radialGradient id="lg-lamp" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="#1f2a44"/><circle cx="170" cy="26" r="10" fill="#f1ecd2"/><circle cx="166" cy="24" r="8" fill="#1f2a44" opacity=".2"/><g fill="#f1ecd2" opacity=".7"><circle cx="24" cy="20" r="1"/><circle cx="52" cy="12" r=".8"/><circle cx="142" cy="14" r="1"/><circle cx="188" cy="54" r=".8"/></g>'
+'<rect x="0" y="132" width="200" height="28" fill="#3a3a44"/><path d="M0 132h200" stroke="#5a5a66" stroke-width="2"/>'
+'<rect x="56" y="34" width="90" height="100" fill="#8a5a4a"/><g stroke="#6f4538" stroke-width="1.2" opacity=".8"><path d="M56 44h90 M56 54h90 M56 64h90 M56 74h90 M56 84h90 M56 94h90 M56 104h90 M56 114h90 M56 124h90"/></g><g stroke="#6f4538" stroke-width="1" opacity=".6"><path d="M70 34v10 M90 34v10 M110 34v10 M130 34v10 M62 54v10 M82 54v10 M102 54v10 M122 54v10 M142 54v10 M70 74v10 M130 74v10 M62 94v10 M142 94v10 M70 114v10 M130 114v10"/></g>'
+'<rect x="52" y="30" width="98" height="6" fill="#5a3b30"/><rect x="118" y="14" width="12" height="18" fill="#5a3b30"/><rect x="116" y="12" width="16" height="4" fill="#4a2f26"/>'
+'<g opacity=".6" fill="#c9c9d2"><ellipse cx="124" cy="6" rx="5" ry="2.5"><animate attributeName="cy" values="8;-2" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="3s" repeatCount="indefinite"/></ellipse></g>'
+'<rect x="84" y="46" width="34" height="30" fill="#5a3b30"/><rect x="87" y="49" width="28" height="24" fill="#ffd27a"><animate attributeName="fill" values="#ffd27a;#ffc860;#ffd27a" dur="3s" repeatCount="indefinite"/></rect><path d="M87 49 q4 12 0 24 M115 49 q-4 12 0 24" fill="#3f6b4c"/><path d="M87 49 q8 14 0 24 l-0 -24z M115 49 q-8 14 0 24z" fill="#3f6b4c"/><path d="M101 49v24 M87 61h28" stroke="#5a3b30" stroke-width="2"/><rect x="82" y="76" width="38" height="3" fill="#4a2f26"/>'
+'<rect x="66" y="90" width="28" height="36" fill="#5a3b30"/><rect x="69" y="93" width="22" height="30" fill="#2a3450"/><path d="M80 93v30 M69 108h22" stroke="#5a3b30" stroke-width="2"/><g transform="rotate(-4 80 116)"><rect x="71" y="110" width="18" height="12" fill="#f6f1e3" stroke="#bfb8a8" stroke-width=".6"/><text x="80" y="115.5" font-family="Courier Prime, monospace" font-size="3.6" font-weight="700" text-anchor="middle" fill="#2a2420">BED AND</text><text x="80" y="120.5" font-family="Courier Prime, monospace" font-size="3.6" font-weight="700" text-anchor="middle" fill="#2a2420">BREAKFAST</text></g>'
+'<rect x="108" y="88" width="26" height="46" fill="#3a2a30"/><rect x="110" y="90" width="22" height="42" fill="#5a2a2a"/><path d="M110 90 q11 -8 22 0z" fill="#ffd27a" opacity=".8"/><path d="M121 84 v6 M116 86 l2 4 M126 86 l-2 4" stroke="#3a2a30" stroke-width="1"/><rect x="113" y="98" width="7" height="12" fill="#4a2020"/><rect x="122" y="98" width="7" height="12" fill="#4a2020"/><rect x="113" y="114" width="7" height="12" fill="#4a2020"/><rect x="122" y="114" width="7" height="12" fill="#4a2020"/><circle cx="127" cy="112" r="1.4" fill="#d9b24f"/><rect x="104" y="134" width="34" height="4" fill="#8a8580"/><rect x="106" y="130" width="30" height="4" fill="#a8a39e"/>'
+'<rect x="22" y="60" width="3" height="74" fill="#2a2a30"/><path d="M14 60 h19 l-3 -8 h-13z" fill="#2a2a30"/><rect x="17" y="54" width="13" height="7" fill="#ffe9a8"><animate attributeName="opacity" values="1;.85;1" dur="2.2s" repeatCount="indefinite"/></rect><path d="M14 62 l-14 72 h48 l-14 -72z" fill="url(#lg-lamp)"/>'
+'<g fill="#d9c35a" opacity=".85"><circle cx="82" cy="86" r="2"/><circle cx="86" cy="84" r="2"/><circle cx="90" cy="86" r="2"/><path d="M82 88v6 M86 86v8 M90 88v6" stroke="#3f6b4c" stroke-width="1"/></g>'
+'</svg>',

/* ---- dachshund: long low dog beside a badger hole ---- */
"dachshund": '<svg viewBox="0 0 200 160" role="img" aria-label="A long, low brown dog with short legs and a floppy ear stands in profile on grass beside a mound of earth; a badger with a striped face peers out of the dark hole in the mound.">'
+'<rect width="200" height="160" rx="10" fill="#cfe0c0"/><rect x="0" y="0" width="200" height="70" fill="#bcd6e6"/><ellipse cx="40" cy="24" rx="20" ry="8" fill="#eef4f7"/><ellipse cx="150" cy="18" rx="16" ry="6" fill="#eef4f7"/>'
+'<path d="M0 70 q50 -12 100 0 q50 -10 100 0 v90 h-200z" fill="#8fb37a"/><path d="M0 70 q50 -12 100 0 q50 -10 100 0" stroke="#7aa066" stroke-width="2" fill="none"/>'
+'<g stroke="#6f9a5a" stroke-width="1.6" stroke-linecap="round" fill="none"><path d="M14 140 l-2 -8 M18 140 l1 -9 M22 140 l-1 -7 M180 118 l-2 -8 M184 118 l1 -9 M188 118 l-1 -7 M90 150 l-2 -8 M94 150 l1 -9"/></g>'
+'<g><path d="M118 124 q6 -34 44 -34 q30 0 36 34z" fill="#9c7a52"/><path d="M118 124 q6 -34 44 -34 q30 0 36 34" fill="none" stroke="#7a5c3a" stroke-width="2"/><ellipse cx="166" cy="110" rx="18" ry="12" fill="#2a1d14"/><ellipse cx="166" cy="112" rx="14" ry="9" fill="#120b07"/><g fill="#b8956a" opacity=".6"><circle cx="134" cy="112" r="2"/><circle cx="150" cy="98" r="1.6"/><circle cx="192" cy="116" r="2"/></g>'
+'<g transform="translate(166,112)"><ellipse cx="0" cy="2" rx="10" ry="8" fill="#d8d8d8"/><path d="M-10 2 q0 -10 10 -10 q10 0 10 10z" fill="#d8d8d8"/><path d="M-5 -6 q5 -2 10 0 l0 10 q-5 2 -10 0z" fill="#2a2a2a"/><path d="M-2 -5 q2 0 4 0 l0 10 q-2 0 -4 0z" fill="#d8d8d8"/><circle cx="-5" cy="0" r="1.3" fill="#2a2a2a"/><circle cx="5" cy="0" r="1.3" fill="#2a2a2a"/><circle cx="-5" cy="0" r=".5" fill="#fff"/><circle cx="5" cy="0" r=".5" fill="#fff"/><ellipse cx="0" cy="6" rx="2.2" ry="1.5" fill="#1a1a1a"/><circle cx="-8" cy="-6" r="2" fill="#2a2a2a"/><circle cx="8" cy="-6" r="2" fill="#2a2a2a"/></g></g>'
+'<g><ellipse cx="60" cy="128" rx="50" ry="6" fill="#6f9a5a" opacity=".45"/>'
+'<path d="M22 122 l4 -10 h8 l0 12 h-10z" fill="#5a3a22"/><path d="M34 124 l2 -12 h8 l0 12z" fill="#6e4a2c"/><path d="M84 124 l2 -12 h8 l0 12z" fill="#6e4a2c"/><path d="M96 122 l2 -10 h8 l0 12 h-8z" fill="#5a3a22"/>'
+'<path d="M24 106 q-6 -16 8 -22 q30 -10 70 -2 q14 4 10 22 q-4 10 -18 10 h-56 q-12 0 -14 -8z" fill="#8a5a32"/><path d="M34 94 q30 -8 66 -1 q8 2 8 10 q-30 4 -74 2 q-6 -4 0 -11z" fill="#a4714a"/><path d="M30 112 q40 6 80 0" stroke="#6e4a2c" stroke-width="1.2" fill="none" opacity=".8"/>'
+'<path d="M22 100 q-14 -14 -6 -30" stroke="#8a5a32" stroke-width="5" fill="none" stroke-linecap="round"><animate attributeName="d" values="M22 100 q-14 -14 -6 -30;M22 100 q-18 -10 -14 -28;M22 100 q-14 -14 -6 -30" dur="1.4s" repeatCount="indefinite"/></path>'
+'<path d="M100 92 q16 -20 32 -12 q6 4 4 12 q-4 8 -14 8 l-20 -2z" fill="#8a5a32"/><path d="M106 92 q12 -14 24 -10 q4 4 0 8 q-8 4 -22 4z" fill="#a4714a"/><circle cx="130" cy="86" r="3.2" fill="#2a1d14"/><circle cx="131" cy="85" r="1" fill="#fff"/><circle cx="120" cy="84" r="1.6" fill="#2a1d14"/><circle cx="120.5" cy="83.5" r=".5" fill="#fff"/><path d="M124 92 q4 2 8 -1" stroke="#5a3a22" stroke-width="1" fill="none"/>'
+'<path d="M104 84 q-10 12 -2 24 q8 -2 10 -16z" fill="#5a3a22"/><path d="M106 88 q-6 10 -1 18" stroke="#6e4a2c" stroke-width="1" fill="none"/>'
+'<path d="M98 96 q2 8 0 12" stroke="#c81e3a" stroke-width="3" fill="none"/><circle cx="99" cy="110" r="2.4" fill="#d9b24f"/></g>'
+'</svg>',

/* ---- head office: tall city block, one floor lit, arrow "the bosses" ---- */
"head office": '<svg viewBox="0 0 200 160" role="img" aria-label="A city skyline in grey-blue. A tall office block stands in the middle with rows of windows; only the top floor is lit yellow, and a small tag with an arrow reading the bosses points at it. A flag flies on the roof.">'
+'<defs><linearGradient id="ho-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8aa4b8"/><stop offset="1" stop-color="#d3dde4"/></linearGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="url(#ho-sky)"/><ellipse cx="34" cy="30" rx="16" ry="6" fill="#eef3f6"/><ellipse cx="166" cy="40" rx="14" ry="5" fill="#eef3f6"/>'
+'<g fill="#9fb0bf"><rect x="4" y="86" width="26" height="60"/><rect x="34" y="70" width="22" height="76"/><rect x="146" y="92" width="24" height="54"/><rect x="172" y="78" width="24" height="68"/></g>'
+'<g fill="#8595a4"><rect x="60" y="100" width="18" height="46"/><rect x="124" y="104" width="18" height="42"/></g>'
+'<g fill="#c9d4dc" opacity=".8"><rect x="8" y="92" width="4" height="5"/><rect x="16" y="92" width="4" height="5"/><rect x="8" y="104" width="4" height="5"/><rect x="16" y="104" width="4" height="5"/><rect x="38" y="76" width="4" height="5"/><rect x="46" y="76" width="4" height="5"/><rect x="38" y="88" width="4" height="5"/><rect x="46" y="88" width="4" height="5"/><rect x="150" y="98" width="4" height="5"/><rect x="158" y="98" width="4" height="5"/><rect x="176" y="84" width="4" height="5"/><rect x="184" y="84" width="4" height="5"/><rect x="176" y="96" width="4" height="5"/><rect x="184" y="96" width="4" height="5"/></g>'
+'<rect x="0" y="146" width="200" height="14" fill="#5f6b76"/><path d="M0 146h200" stroke="#7d8a95" stroke-width="2"/>'
+'<g><rect x="82" y="22" width="38" height="124" fill="#4a5a6a"/><rect x="82" y="22" width="6" height="124" fill="#3a4856"/><rect x="114" y="22" width="6" height="124" fill="#5c6c7c"/><rect x="80" y="18" width="42" height="6" fill="#2f3a46"/>'
+'<g fill="#9fb0bf"><rect x="90" y="42" width="6" height="7"/><rect x="98" y="42" width="6" height="7"/><rect x="106" y="42" width="6" height="7"/><rect x="90" y="54" width="6" height="7"/><rect x="98" y="54" width="6" height="7"/><rect x="106" y="54" width="6" height="7"/><rect x="90" y="66" width="6" height="7"/><rect x="98" y="66" width="6" height="7"/><rect x="106" y="66" width="6" height="7"/><rect x="90" y="78" width="6" height="7"/><rect x="98" y="78" width="6" height="7"/><rect x="106" y="78" width="6" height="7"/><rect x="90" y="90" width="6" height="7"/><rect x="98" y="90" width="6" height="7"/><rect x="106" y="90" width="6" height="7"/><rect x="90" y="102" width="6" height="7"/><rect x="98" y="102" width="6" height="7"/><rect x="106" y="102" width="6" height="7"/><rect x="90" y="114" width="6" height="7"/><rect x="98" y="114" width="6" height="7"/><rect x="106" y="114" width="6" height="7"/><rect x="90" y="126" width="6" height="7"/><rect x="106" y="126" width="6" height="7"/></g>'
+'<rect x="96" y="128" width="10" height="18" fill="#2f3a46"/><rect x="97" y="130" width="8" height="14" fill="#c9a24a" opacity=".8"/>'
+'<rect x="88" y="26" width="26" height="12" fill="#ffd96a"><animate attributeName="fill" values="#ffd96a;#ffe89a;#ffd96a" dur="2.4s" repeatCount="indefinite"/></rect><g fill="#3a3020"><rect x="92" y="32" width="3" height="6"/><circle cx="93.5" cy="30" r="1.6"/><rect x="99" y="32" width="3" height="6"/><circle cx="100.5" cy="30" r="1.6"/><rect x="106" y="32" width="3" height="6"/><circle cx="107.5" cy="30" r="1.6"/></g>'
+'<rect x="100" y="4" width="1.5" height="16" fill="#2f3a46"/><path d="M101.5 5 h12 l-3 4 l3 4 h-12z" fill="#c81e3a"><animate attributeName="d" values="M101.5 5 h12 l-3 4 l3 4 h-12z;M101.5 5 h12 l-2 4 l2 4 h-12z;M101.5 5 h12 l-3 4 l3 4 h-12z" dur="1.6s" repeatCount="indefinite"/></path></g>'
+'<g><rect x="134" y="20" width="52" height="16" rx="3" fill="#f6f1e3" stroke="#3a3020" stroke-width="1.5"/><text x="160" y="31" font-family="Courier Prime, monospace" font-size="7" font-weight="700" text-anchor="middle" fill="#3a3020">the bosses</text><path d="M134 30 l-10 2" stroke="#3a3020" stroke-width="1.8"/><path d="M128 28 l-6 4 l7 2z" fill="#3a3020"/></g>'
+'</svg>',

/* ---- big shots: three bosses behind a big desk at the top; a small clerk looks up ---- */
"big shots": '<svg viewBox="0 0 200 160" role="img" aria-label="The top floor of a company office. Three bosses in dark suits sit in tall leather chairs behind a long, shiny desk with a telephone and papers: an older man with grey hair and a moustache, a bald man with glasses, and a man with brown hair and a red tie. Down at the bottom, a small young clerk with a stack of papers looks up at them.">'
+'<rect width="200" height="160" rx="10" fill="#e9dfc9"/>'
+'<rect x="0" y="0" width="200" height="104" fill="#5c4632"/>'
+'<g fill="#4e3a28"><rect x="10" y="8" width="2" height="96"/><rect x="60" y="8" width="2" height="96"/><rect x="110" y="8" width="2" height="96"/><rect x="160" y="8" width="2" height="96"/></g>'
+'<rect x="128" y="10" width="62" height="34" fill="#9fc2dc"/><path d="M128 10 h62 v34 h-62z M159 10 v34" fill="none" stroke="#3a2a1c" stroke-width="2"/>'
+'<g fill="#7a96ab"><rect x="132" y="24" width="8" height="20"/><rect x="143" y="18" width="10" height="26"/><rect x="163" y="22" width="9" height="22"/><rect x="175" y="16" width="10" height="28"/></g>'
+'<rect x="18" y="12" width="40" height="26" fill="#c9a24a"/><rect x="21" y="15" width="34" height="20" fill="#8a6a3a"/><path d="M24 32 l8 -10 l6 6 l6 -8 l8 12z" fill="#b89458"/>'
+'<!-- chairs -->'
+'<g fill="#6e1e1e"><rect x="22" y="34" width="34" height="50" rx="8"/><rect x="83" y="28" width="34" height="56" rx="8"/><rect x="144" y="34" width="34" height="50" rx="8"/></g>'
+'<g fill="#8a2a2a"><rect x="26" y="38" width="26" height="40" rx="6"/><rect x="87" y="32" width="26" height="46" rx="6"/><rect x="148" y="38" width="26" height="40" rx="6"/></g>'
+'<!-- boss 1: grey hair, moustache -->'
+'<path d="M26 84 q0 -22 13 -24 q13 2 13 24z" fill="#23252e"/><path d="M36 61 l3 10 l3 -10" fill="#f2ecdf"/><path d="M38 63 h2 l1 9 h-4z" fill="#2c4f8a"/>'
+'<circle cx="39" cy="50" r="10" fill="#e8c3a0"/><path d="M29 48 q0 -12 10 -12 q10 0 10 12 q-3 -6 -10 -6 q-7 0 -10 6z" fill="#cfcfcf"/>'
+'<circle cx="35" cy="50" r="1.4" fill="#2a1c12"/><circle cx="43" cy="50" r="1.4" fill="#2a1c12"/><circle cx="35.5" cy="49.5" r=".5" fill="#fff"/><circle cx="43.5" cy="49.5" r=".5" fill="#fff"/>'
+'<path d="M34 55 q5 -3 10 0 q-5 2 -10 0z" fill="#bdbdbd"/><path d="M33 46 l4 -1 M41 45 l4 1" stroke="#9a9a9a" stroke-width="1.2"/>'
+'<!-- boss 2: bald, glasses -->'
+'<path d="M87 84 q0 -24 13 -26 q13 2 13 26z" fill="#1d2433"/><path d="M97 59 l3 10 l3 -10" fill="#f2ecdf"/><path d="M99 61 h2 l1 9 h-4z" fill="#3b6d3b"/>'
+'<circle cx="100" cy="47" r="10.5" fill="#c99a74"/><path d="M90 48 q-1 -5 2 -7 M110 48 q1 -5 -2 -7" stroke="#5a3a20" stroke-width="2" fill="none"/>'
+'<circle cx="96" cy="47" r="3.4" fill="none" stroke="#2a1c12" stroke-width="1.2"/><circle cx="104" cy="47" r="3.4" fill="none" stroke="#2a1c12" stroke-width="1.2"/><path d="M99.4 47 h1.2" stroke="#2a1c12" stroke-width="1.2"/>'
+'<circle cx="96" cy="47" r="1.2" fill="#2a1c12"/><circle cx="104" cy="47" r="1.2" fill="#2a1c12"/>'
+'<path d="M96 53 q4 2 8 0" stroke="#7a3a2a" stroke-width="1.3" fill="none"/><path d="M95 39 q5 -2 10 0" stroke="#e0b48e" stroke-width="1.5" fill="none" opacity=".8"/>'
+'<!-- boss 3: brown hair, red tie -->'
+'<path d="M148 84 q0 -22 13 -24 q13 2 13 24z" fill="#2a2a34"/><path d="M158 61 l3 10 l3 -10" fill="#f2ecdf"/><path d="M160 63 h2 l1 9 h-4z" fill="#a32d2d"/>'
+'<circle cx="161" cy="50" r="10" fill="#f0cfae"/><path d="M151 48 q1 -13 11 -13 q10 1 9 12 q-4 -7 -11 -6 q-6 0 -9 7z" fill="#6b4524"/>'
+'<circle cx="157" cy="50" r="1.4" fill="#2a1c12"/><circle cx="165" cy="50" r="1.4" fill="#2a1c12"/><circle cx="157.5" cy="49.5" r=".5" fill="#fff"/><circle cx="165.5" cy="49.5" r=".5" fill="#fff"/>'
+'<path d="M157 55 q4 2 8 0" stroke="#8c4a3a" stroke-width="1.3" fill="none"/><path d="M154 46 l4 -1 M164 45 l4 1" stroke="#5a3a20" stroke-width="1.2"/>'
+'<!-- desk -->'
+'<rect x="8" y="78" width="184" height="10" rx="2" fill="#8a5a30"/><rect x="8" y="78" width="184" height="3" fill="#b07a48"/>'
+'<rect x="14" y="88" width="172" height="16" fill="#6e4424"/><path d="M60 88 v16 M140 88 v16" stroke="#5a361c" stroke-width="1.5"/>'
+'<rect x="60" y="72" width="18" height="6" rx="1" fill="#1a1208"/><path d="M62 72 q7 -8 14 0" stroke="#1a1208" stroke-width="3" fill="none"/>'
+'<rect x="120" y="74" width="22" height="4" fill="#f6f1e6"/><rect x="122" y="71" width="20" height="4" fill="#ece5d6"/><path d="M146 74 l10 -6" stroke="#2a1c12" stroke-width="1.4"/>'
+'<!-- floor and the small clerk -->'
+'<rect x="0" y="104" width="200" height="56" fill="#c9b796"/><path d="M0 118 H200 M0 134 H200" stroke="#b8a582" stroke-width="1"/>'
+'<g transform="translate(100,124)">'
+'<path d="M-7 34 v-16 h14 v16z" fill="#6b5a44"/>'
+'<path d="M-9 20 q0 -12 9 -13 q9 1 9 13z" fill="#8a7a62"/>'
+'<circle cx="0" cy="-1" r="7" fill="#e3b48c"/><path d="M-7 -2 q1 -8 7 -8 q6 0 7 8 q-3 -4 -7 -4 q-4 0 -7 4z" fill="#3a2a1c"/>'
+'<circle cx="-2.5" cy="-2.5" r="1" fill="#2a1c12"/><circle cx="2.5" cy="-2.5" r="1" fill="#2a1c12"/><ellipse cx="0" cy="2.5" rx="1.4" ry="1.2" fill="#8c4a3a"/>'
+'<rect x="-14" y="6" width="12" height="12" fill="#f6f1e6" stroke="#c9bfa9" stroke-width=".8"/><path d="M-12 9 h8 M-12 12 h8 M-12 15 h6" stroke="#b8ae98" stroke-width=".7"/>'
+'</g>'
+'<path d="M112 116 q8 -10 6 -22" stroke="#4a3a28" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>'
+'</svg>',
/* ---- swanky: contrast pair ---- */
"swanky": '<svg viewBox="0 0 200 160" role="img" aria-label="Two panels. Left, a grand white house with pillars, a fanlight, a brass lamp and trimmed hedges, its windows glowing. Right, the same house with peeling paint, a cracked pillar, dark windows, a broken step and weeds; a red X marks this side.">'
+'<rect width="200" height="160" rx="10" fill="#dbe7ef"/><rect x="100" y="0" width="100" height="160" fill="#b9bcc2"/><rect x="99" y="0" width="2" height="160" fill="#3a3030"/>'
+'<rect x="0" y="130" width="99" height="30" fill="#7f8a6a"/><rect x="100" y="130" width="100" height="30" fill="#6e6a60"/>'
+'<g><rect x="14" y="44" width="72" height="86" fill="#f6f3ea"/><path d="M8 46 l42 -18 l42 18z" fill="#e6e1d2"/><path d="M8 46 l42 -18 l42 18" stroke="#c8c2b0" stroke-width="1.5" fill="none"/><rect x="10" y="44" width="80" height="5" fill="#d9d3c2"/>'
+'<g fill="#efeae0" stroke="#cfc8b4" stroke-width="1"><rect x="20" y="52" width="7" height="78"/><rect x="73" y="52" width="7" height="78"/><rect x="36" y="52" width="7" height="78"/><rect x="57" y="52" width="7" height="78"/></g><g fill="#d9d3c2"><rect x="18" y="50" width="11" height="4"/><rect x="71" y="50" width="11" height="4"/><rect x="34" y="50" width="11" height="4"/><rect x="55" y="50" width="11" height="4"/></g>'
+'<rect x="44" y="92" width="12" height="38" fill="#3f6b4c"/><path d="M44 92 q6 -8 12 0z" fill="#ffd27a"/><circle cx="54" cy="112" r="1" fill="#d9b24f"/><rect x="26" y="62" width="9" height="14" fill="#ffd27a"/><rect x="65" y="62" width="9" height="14" fill="#ffd27a"/><rect x="26" y="96" width="9" height="14" fill="#ffd27a"/><rect x="65" y="96" width="9" height="14" fill="#ffd27a"/><g stroke="#b8a070" stroke-width=".8"><path d="M30.5 62v14 M26 69h9 M69.5 62v14 M65 69h9 M30.5 96v14 M26 103h9 M69.5 96v14 M65 103h9"/></g>'
+'<rect x="40" y="84" width="3" height="10" fill="#d9b24f"/><path d="M38 84 h7 l-1 -4 h-5z" fill="#d9b24f"/><rect x="40" y="81" width="3" height="3" fill="#fff0a8"/>'
+'<rect x="36" y="130" width="28" height="4" fill="#c8c2b0"/><rect x="40" y="126" width="20" height="4" fill="#d9d3c2"/>'
+'<ellipse cx="12" cy="130" rx="9" ry="10" fill="#4f8a4a"/><ellipse cx="88" cy="130" rx="9" ry="10" fill="#4f8a4a"/><ellipse cx="12" cy="128" rx="5" ry="6" fill="#67a35e"/><ellipse cx="88" cy="128" rx="5" ry="6" fill="#67a35e"/></g>'
+'<g><rect x="114" y="44" width="72" height="86" fill="#bdb6a6"/><path d="M108 46 l42 -18 l42 18z" fill="#a39b8b"/><path d="M108 46 l42 -18 l42 18" stroke="#7d7566" stroke-width="1.5" fill="none"/><rect x="110" y="44" width="80" height="5" fill="#8f8777"/><path d="M150 28 l0 6 M146 32 l4 2" stroke="#6e6a60" stroke-width="1"/>'
+'<g fill="#cfc8b4" stroke="#8f8777" stroke-width="1"><rect x="120" y="52" width="7" height="78"/><rect x="173" y="52" width="7" height="78"/><rect x="136" y="52" width="7" height="78"/><rect x="157" y="52" width="7" height="78"/></g><path d="M124 60 l-2 10 l3 8 l-2 12" stroke="#5a5247" stroke-width="1" fill="none"/><path d="M160 70 l2 12 l-3 6" stroke="#5a5247" stroke-width="1" fill="none"/>'
+'<g fill="#e8e2d2"><path d="M116 60 l6 2 l-4 6 l-5 -3z"/><path d="M180 90 l5 1 l-2 7 l-5 -2z"/><path d="M130 110 l5 0 l-1 6 l-5 -1z"/><path d="M170 56 l5 -1 l0 6 l-4 1z"/></g><g fill="#8f8777" opacity=".7"><path d="M118 62 l4 -1 l-2 4z"/><path d="M181 92 l3 1 l-1 4z"/></g>'
+'<rect x="144" y="92" width="12" height="38" fill="#2f4a38"/><path d="M144 92 q6 -8 12 0z" fill="#4a4a50"/><path d="M146 100 l8 28" stroke="#1f3326" stroke-width="1"/><rect x="126" y="62" width="9" height="14" fill="#3a3a44"/><rect x="165" y="62" width="9" height="14" fill="#3a3a44"/><rect x="126" y="96" width="9" height="14" fill="#3a3a44"/><rect x="165" y="96" width="9" height="14" fill="#3a3a44"/><path d="M168 64 l3 5 l-2 4 M127 98 l4 4 l-1 5" stroke="#9fb0bf" stroke-width=".8" fill="none"/><rect x="164" y="60" width="11" height="3" fill="#5a3a22"/><rect x="164" y="74" width="11" height="3" fill="#5a3a22"/>'
+'<rect x="140" y="84" width="3" height="10" fill="#8a7a50" transform="rotate(20 141 84)"/><path d="M138 84 h7 l-1 -4 h-5z" fill="#8a7a50" transform="rotate(20 141 84)"/>'
+'<rect x="136" y="130" width="28" height="4" fill="#8f8777"/><path d="M140 126 h20 v4 h-8 l-2 -2 l-3 2 h-7z" fill="#a39b8b"/><path d="M150 126 l1 4" stroke="#5a5247" stroke-width="1"/>'
+'<g stroke="#6f8a50" stroke-width="1.6" stroke-linecap="round" fill="none"><path d="M112 134 l-3 -12 M116 134 l2 -10 M186 134 l-2 -11 M190 134 l3 -9 M130 134 l1 -8 M168 134 l-2 -8"/></g><path d="M110 118 q4 -6 8 0" stroke="#6f8a50" stroke-width="1.2" fill="none"/>'
+'<g transform="translate(174,18)"><circle r="12" fill="#fff" stroke="#c81e3a" stroke-width="3"/><path d="M-6 -6 l12 12 M6 -6 l-12 12" stroke="#c81e3a" stroke-width="3.2" stroke-linecap="round"/></g></g>'
+'</svg>',

/* ---- nest: woven bird's nest; behind it, faintly, a web the same shape ---- */
"nest": '<svg viewBox="0 0 200 160" role="img" aria-label="A woven bird’s nest with three speckled eggs sits on a branch with a few leaves. Behind it, drawn faintly in grey, a spider’s web curves in the same cup shape, with a small spider waiting at its rim.">'
+'<defs><radialGradient id="ns-bg" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#eef3e6"/><stop offset="1" stop-color="#c9d6c0"/></radialGradient></defs>'
+'<rect width="200" height="160" rx="10" fill="url(#ns-bg)"/>'
+'<g stroke="#7f8a7f" stroke-width=".9" fill="none" opacity=".55"><path d="M40 60 q60 70 120 0"/><path d="M48 62 q52 56 104 0"/><path d="M56 64 q44 42 88 0"/><path d="M64 66 q36 28 72 0"/><path d="M72 68 q28 16 56 0"/><path d="M40 60 L100 112 M160 60 L100 112 M60 42 L100 112 M140 42 L100 112 M100 40 L100 112 M80 44 L100 112 M120 44 L100 112"/><path d="M100 40 q-20 2 -40 20 M100 40 q20 2 40 20"/></g>'
+'<g opacity=".7"><circle cx="154" cy="68" r="3.2" fill="#3a3a44"/><circle cx="154" cy="63" r="2" fill="#3a3a44"/><g stroke="#3a3a44" stroke-width="1" fill="none"><path d="M152 66 l-6 -4 l-2 -4 M152 68 l-7 0 l-3 2 M152 70 l-6 4 l-1 4 M156 66 l6 -4 l2 -4 M156 68 l7 0 l3 2 M156 70 l6 4 l1 4"/></g><circle cx="153" cy="62" r=".5" fill="#e8242e"/><circle cx="155" cy="62" r=".5" fill="#e8242e"/><animateTransform attributeName="transform" type="translate" values="0 0;0 1.5;0 0" dur="3s" repeatCount="indefinite"/></g>'
+'<path d="M10 128 q50 -12 100 -4 q50 -6 84 -14" stroke="#6b4a2e" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M10 128 q50 -12 100 -4 q50 -6 84 -14" stroke="#8a6238" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/><path d="M150 116 q10 -12 14 -22" stroke="#6b4a2e" stroke-width="3" fill="none" stroke-linecap="round"/>'
+'<g fill="#6f9a5a"><ellipse cx="40" cy="112" rx="10" ry="4.5" transform="rotate(-30 40 112)"/><ellipse cx="166" cy="94" rx="9" ry="4" transform="rotate(-60 166 94)"/><ellipse cx="180" cy="108" rx="9" ry="4" transform="rotate(-20 180 108)"/></g><g stroke="#4f7a40" stroke-width=".8"><path d="M32 117 l16 -10 M164 100 l4 -12 M172 110 l16 -4"/></g>'
+'<path d="M56 86 q0 44 44 44 q44 0 44 -44z" fill="#a47a4e"/><path d="M62 88 q0 36 38 36 q38 0 38 -36z" fill="#8a6238"/>'
+'<g stroke="#c7a86a" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"><path d="M58 92 q20 10 44 6 q24 -4 40 -8"/><path d="M62 100 q22 10 40 8 q22 -2 36 -10"/><path d="M68 110 q20 10 36 8 q20 -2 28 -10"/><path d="M78 120 q14 6 26 4 q14 -2 20 -6"/><path d="M70 96 q4 10 12 16 M88 94 q-4 12 2 24 M110 94 q6 10 2 24 M126 96 q-6 10 -10 20"/></g><g stroke="#5a3c24" stroke-width="1" fill="none" opacity=".7"><path d="M60 96 q22 8 42 4 M66 106 q20 8 38 6 M74 116 q16 6 30 4"/></g>'
+'<path d="M56 86 q44 -16 88 0 q-44 10 -88 0z" fill="#c7a86a"/><path d="M56 86 q44 -16 88 0" stroke="#8a6238" stroke-width="1.6" fill="none"/><g stroke="#8a6238" stroke-width="1" fill="none"><path d="M52 84 l-8 -6 M58 82 l-4 -8 M146 84 l8 -6 M140 82 l4 -8 M100 76 l0 -8"/></g>'
+'<g><ellipse cx="84" cy="86" rx="9" ry="11" fill="#cfe1e8"/><ellipse cx="102" cy="84" rx="9" ry="11" fill="#d8e6ec"/><ellipse cx="118" cy="88" rx="8" ry="10" fill="#cfe1e8"/><g fill="#7a8a90" opacity=".7"><circle cx="81" cy="82" r=".9"/><circle cx="87" cy="88" r=".8"/><circle cx="84" cy="92" r=".7"/><circle cx="100" cy="80" r=".9"/><circle cx="105" cy="86" r=".8"/><circle cx="99" cy="90" r=".7"/><circle cx="116" cy="84" r=".8"/><circle cx="120" cy="92" r=".7"/></g><path d="M80 80 q3 -4 6 -2" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/><path d="M98 78 q3 -4 6 -2" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/></g>'
+'<path d="M56 90 q44 10 88 0 q0 6 -4 10 q-40 8 -80 0 q-4 -4 -4 -10z" fill="#8a6238" opacity=".85"/><path d="M60 94 q40 8 80 0" stroke="#c7a86a" stroke-width="1.2" fill="none"/>'
+'</svg>'
};

/* return the picture with an extra class, or "" if there is none */
function llArt(word, cls){
  var s = LL_ART[word]; if(!s) return "";
  return cls ? s.replace('<svg ', '<svg class="' + cls + '" ') : s;
}

/* auto-wire: swap emoji for pictures on the Landlady Words screen */
(function(){
  function apply(){
    var cs = document.querySelectorAll("#words-tab .wcard[data-w]"), i, w, e;
    for(i = 0; i < cs.length; i++){
      w = cs[i].getAttribute("data-w"); e = cs[i].querySelector(".we");
      if(e && LL_ART[w] && !e.querySelector("svg")){
        e.setAttribute("data-emoji", e.textContent);
        e.innerHTML = llArt(w, "wpic");
      }
    }
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
