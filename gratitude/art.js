/* readings/gratitude/art.js — T-412 (Nov 15 2026). Drawn pictures for The Science of Gratitude.
   window.GR_ART[key] = full <svg> string. Vocab cards 200×160; section pictures 240×180; scene panels 640×200.
   Flat layered SVG, two or three tones per surface, muted palette. No words inside any picture
   (a picture must never answer the matching question). */
(function () {
  var A = window.GR_ART = {};
  var SK = ['#f2cba6', '#d9a47c', '#a8714d', '#7a4e33', '#e8b98f'];   /* skin tones */
  var HR = ['#231b1b', '#3b2a20', '#5a3a22', '#1a1a2a', '#6b4a2a'];
  function svg(w, h, body, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (label || '') + '">' + body + '</svg>';
  }
  /* a person, head centre (x,y), scale s. o = {skin, hair, shirt, expr:'smile'|'calm'|'flat'|'bored'|'open', eyes:'open'|'closed'|'up',
     hijab:colour, long:true, cap:colour, arms:'down'|'heart'|'none'} */
  function face(x, y, s, o) {
    o = o || {};
    var sk = o.skin || SK[0], hr = o.hair || HR[0], g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
    if (o.hijab) {
      g += '<path d="M-30 6 C-34 -34 34 -34 30 6 L34 40 C20 50 -20 50 -34 40Z" fill="' + o.hijab + '"/>';
      g += '<path d="M-30 6 C-34 -34 34 -34 30 6" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="3"/>';
    } else if (o.long) {
      g += '<path d="M-27 -2 C-30 -34 30 -34 27 -2 L30 34 C22 38 18 28 19 10 L-19 10 C-18 28 -22 38 -30 34Z" fill="' + hr + '"/>';
    }
    g += '<ellipse cx="0" cy="0" rx="22" ry="25" fill="' + sk + '"/>';
    g += '<ellipse cx="-22" cy="2" rx="4" ry="6" fill="' + sk + '" opacity=".9"/><ellipse cx="22" cy="2" rx="4" ry="6" fill="' + sk + '" opacity=".9"/>';
    if (!o.hijab) g += '<path d="M-23 -6 C-22 -30 22 -30 23 -6 C16 -16 6 -19 0 -14 C-8 -19 -16 -16 -23 -6Z" fill="' + hr + '"/>';
    if (o.cap) g += '<path d="M-23 -10 C-20 -32 20 -32 23 -10Z" fill="' + o.cap + '"/><path d="M-4 -12 L34 -10 C30 -6 10 -6 -4 -8Z" fill="' + o.cap + '" opacity=".85"/>';
    var e = o.eyes || 'open';
    if (e === 'closed') g += '<path d="M-13 1 Q-8 5 -3 1 M3 1 Q8 5 13 1" stroke="#2b2233" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    else if (e === 'up') g += '<ellipse cx="-8" cy="-1" rx="3" ry="3.8" fill="#2b2233"/><ellipse cx="8" cy="-1" rx="3" ry="3.8" fill="#2b2233"/><circle cx="-7" cy="-3" r="1.1" fill="#fff"/><circle cx="9" cy="-3" r="1.1" fill="#fff"/>';
    else g += '<ellipse cx="-8" cy="1" rx="3" ry="3.8" fill="#2b2233"/><ellipse cx="8" cy="1" rx="3" ry="3.8" fill="#2b2233"/><circle cx="-7" cy="0" r="1.1" fill="#fff"/><circle cx="9" cy="0" r="1.1" fill="#fff"/>';
    var x2 = o.expr || 'smile';
    if (x2 === 'bored') g += '<path d="M-13 -7 L-3 -6 M3 -6 L13 -7" stroke="#3a2a22" stroke-width="2.2" stroke-linecap="round"/><path d="M-6 14 L6 14" stroke="#7a2e2e" stroke-width="2.4" stroke-linecap="round"/><path d="M-13 3 Q-8 6 -3 3 M3 3 Q8 6 13 3" stroke="' + sk + '" stroke-width="3" fill="none"/>';
    else {
      g += '<path d="M-13 -8 Q-8 -11 -3 -8 M3 -8 Q8 -11 13 -8" stroke="#3a2a22" stroke-width="2" fill="none" stroke-linecap="round"/>';
      if (x2 === 'smile') g += '<path d="M-8 11 Q0 19 8 11" stroke="#7a2e2e" stroke-width="2.4" fill="#fff" stroke-linecap="round"/>';
      else if (x2 === 'open') g += '<ellipse cx="0" cy="13" rx="5" ry="4" fill="#7a2e2e"/>';
      else if (x2 === 'calm') g += '<path d="M-6 12 Q0 15 6 12" stroke="#7a2e2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      else g += '<path d="M-6 13 L6 13" stroke="#7a2e2e" stroke-width="2.2" stroke-linecap="round"/>';
    }
    g += '<circle cx="-14" cy="8" r="3.6" fill="#e8736b" opacity=".28"/><circle cx="14" cy="8" r="3.6" fill="#e8736b" opacity=".28"/>';
    return g + '</g>';
  }
  /* shoulders + shirt under a head at (x,y) scale s */
  function body(x, y, s, shirt, o) {
    o = o || {};
    var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
    g += '<rect x="-7" y="22" width="14" height="10" fill="' + (o.skin || SK[0]) + '"/>';
    g += '<path d="M-36 80 C-36 44 -24 30 0 30 C24 30 36 44 36 80Z" fill="' + shirt + '"/>';
    g += '<path d="M-10 30 L0 42 L10 30" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2.5"/>';
    g += '<path d="M-36 80 C-36 56 -30 44 -22 38" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="3"/>';
    return g + '</g>';
  }
  function heart(x, y, s, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 6 C-3 -2 -14 -2 -14 6 C-14 13 0 20 0 20 C0 20 14 13 14 6 C14 -2 3 -2 0 6Z" fill="' + (c || '#d4575b') + '"/>';
  }
  function sparkle(x, y, s, c) {
    return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="' + (c || '#f2c230') + '"/>';
  }
  function bg(w, h, top, floor, fy) {
    return '<rect width="' + w + '" height="' + h + '" fill="' + top + '"/>' + (floor ? '<rect y="' + fy + '" width="' + w + '" height="' + (h - fy) + '" fill="' + floor + '"/>' : '');
  }

  /* ======================= VOCABULARY (200×160) ======================= */
  /* write: a hand writing in a notebook on a desk, lamp light */
  A.write = svg(200, 160, bg(200, 160, '#efe6d2', '#b8875a', 112) +
    '<path d="M0 112 H200" stroke="#8d6440" stroke-width="3"/><path d="M0 130 H200 M0 146 H200" stroke="#a87a50" stroke-width="1.5" opacity=".5"/>' +
    '<path d="M150 10 L176 10 L190 46 L136 46Z" fill="#2f6f57"/><rect x="160" y="46" width="6" height="56" fill="#3d3d3d"/><ellipse cx="163" cy="104" rx="20" ry="5" fill="#3d3d3d"/>' +
    '<path d="M136 46 L100 140 L226 140 L190 46Z" fill="#fff4c2" opacity=".35"/>' +
    '<g transform="rotate(-6 80 112)"><rect x="26" y="86" width="112" height="56" rx="3" fill="#fdfcf6" stroke="#8b8172" stroke-width="2"/><path d="M82 86 V142" stroke="#c9bfae" stroke-width="2"/>' +
    '<path d="M34 98 H76 M34 108 H74 M34 118 H66 M34 128 H72 M90 98 H130 M90 108 H118" stroke="#9fb6cf" stroke-width="1.6"/>' +
    '<path d="M90 118 c4 -6 8 6 12 0 s8 6 12 0" stroke="#1d2a5a" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
    '<g transform="rotate(-40 124 108)"><rect x="118" y="70" width="9" height="48" rx="2" fill="#f2c230"/><path d="M118 118 L122.5 128 L127 118Z" fill="#f2cba6"/><path d="M121 125 L122.5 128 L124 125Z" fill="#2b2233"/><rect x="118" y="66" width="9" height="6" fill="#e58a8a"/></g>' +
    '<path d="M124 96 C138 90 156 92 170 104 L176 124 L140 124 C132 118 124 112 124 96Z" fill="' + SK[2] + '"/><path d="M128 104 C132 112 140 116 150 118" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/>' +
    '<rect x="170" y="100" width="30" height="30" fill="#4a6fa5"/>', 'a hand writing in a notebook');

  /* journal: an open private notebook with ribbon, pressed flower, pen, small lock */
  A.journal = svg(200, 160, bg(200, 160, '#e9e2f2', '#c9b7d9', 124) +
    '<path d="M18 34 C60 26 92 30 100 38 C108 30 140 26 182 34 L182 132 C140 124 108 128 100 136 C92 128 60 124 18 132Z" fill="#7a4a6e"/>' +
    '<path d="M24 30 C62 22 92 26 100 34 L100 128 C92 120 62 118 24 124Z" fill="#fffdf4"/><path d="M176 30 C138 22 108 26 100 34 L100 128 C108 120 138 118 176 124Z" fill="#fbf6e6"/>' +
    '<path d="M100 34 V128" stroke="#d8ccb2" stroke-width="2"/>' +
    '<path d="M34 50 H88 M34 62 H88 M34 74 H80 M34 86 H88 M34 98 H70" stroke="#c7bfd8" stroke-width="1.5"/>' +
    '<circle cx="38" cy="50" r="2.3" fill="#7a4a6e"/><circle cx="38" cy="62" r="2.3" fill="#7a4a6e"/><circle cx="38" cy="74" r="2.3" fill="#7a4a6e"/>' +
    '<path d="M44 49 c4-3 8 3 12 0 s8 3 12 0 M44 61 c4-3 8 3 12 0 s6 3 10 0 M44 73 c4-3 8 3 12 0" stroke="#3a3a6a" stroke-width="1.6" fill="none"/>' +
    '<g transform="translate(140 74)"><path d="M0 0 C-8 -14 -2 -24 0 -26 C2 -24 8 -14 0 0Z" fill="#e8a0b8"/><path d="M0 0 C-14 -6 -20 -2 -22 0 C-20 2 -14 6 0 0Z" fill="#e8a0b8"/><path d="M0 0 C14 -6 20 -2 22 0 C20 2 14 6 0 0Z" fill="#e8a0b8"/><circle r="4" fill="#f2c230"/><path d="M0 4 C2 18 -4 30 -2 40" stroke="#5f8f5a" stroke-width="2.4" fill="none"/></g>' +
    '<path d="M112 100 c6 -4 10 2 16 -2" stroke="#3a3a6a" stroke-width="1.6" fill="none"/>' +
    '<path d="M96 30 L96 150 L100 144 L104 150 L104 30Z" fill="#d4575b"/>' +
    '<g transform="rotate(14 160 140)"><rect x="128" y="136" width="56" height="7" rx="3" fill="#2f6f57"/><path d="M184 136 L192 139.5 L184 143Z" fill="#d9c9a0"/></g>' +
    '<rect x="172" y="66" width="14" height="12" rx="2" fill="#c9a24a"/><path d="M175 66 V61 a4 4 0 0 1 8 0 V66" stroke="#c9a24a" stroke-width="2.4" fill="none"/>', 'an open journal with a ribbon');

  /* smile */
  A.smile = svg(200, 160, bg(200, 160, '#fdf0d8') +
    '<circle cx="168" cy="30" r="16" fill="#f7c948"/><path d="M168 6 v-6 M190 30 h6 M184 14 l4 -4" stroke="#f7c948" stroke-width="3"/>' +
    '<path d="M0 132 C50 118 150 118 200 132 V160 H0Z" fill="#9cc58f"/>' +
    body(100, 72, 1.25, '#e98a5a', { skin: SK[1] }) + face(100, 72, 1.25, { skin: SK[1], hair: HR[1], expr: 'smile', long: true }) +
    '<path d="M82 100 Q100 116 118 100" fill="#fff" stroke="#7a2e2e" stroke-width="3"/>' +
    sparkle(48, 44, 1) + sparkle(152, 70, .8, '#fff'), 'a girl smiling');

  /* breathe: a teen sitting tall, breath cloud in and out, belly rising */
  A.breathe = svg(200, 160, bg(200, 160, '#e3f0f2', '#b9d6d0', 128) +
    '<path d="M44 128 C44 106 70 96 100 96 C130 96 156 106 156 128Z" fill="#5d8aa8"/>' +
    body(100, 50, 1.05, '#5d8aa8', { skin: SK[0] }) + face(100, 50, 1.05, { skin: SK[0], hair: HR[3], eyes: 'closed', expr: 'calm' }) +
    '<ellipse cx="100" cy="112" rx="22" ry="10" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 4"><animate attributeName="ry" values="8;13;8" dur="8s" repeatCount="indefinite"/></ellipse>' +
    '<path d="M126 64 C140 58 150 64 152 56 C162 54 170 62 164 70 C172 76 164 86 154 82 C148 90 134 86 134 78 C126 78 122 70 126 64Z" fill="#fff" opacity=".9"/>' +
    '<path d="M150 70 L168 70 M162 64 L170 70 L162 76" stroke="#5d8aa8" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M42 64 C30 60 22 66 24 74 C16 78 20 88 30 86 C34 92 46 90 48 82 C56 82 58 72 52 68" fill="#fff" opacity=".7"/>' +
    '<path d="M50 76 L32 76 M40 70 L32 76 L40 82" stroke="#5d8aa8" stroke-width="3" fill="none" stroke-linecap="round" transform="rotate(180 41 76)"/>', 'a student breathing slowly');

  /* close your eyes: face, eyes shut, hands in lap, soft dark room */
  A.closeeyes = svg(200, 160, bg(200, 160, '#2f3a5a', '#3c4a6e', 120) +
    '<circle cx="34" cy="30" r="2" fill="#fff"/><circle cx="160" cy="22" r="1.6" fill="#fff"/><circle cx="178" cy="54" r="1.4" fill="#fff"/><circle cx="20" cy="70" r="1.2" fill="#fff"/>' +
    '<path d="M150 20 a14 14 0 1 0 14 24 a11 11 0 1 1 -14 -24Z" fill="#f7e7a0"/>' +
    body(100, 66, 1.2, '#c97a8a', { skin: SK[2] }) + face(100, 66, 1.2, { skin: SK[2], hijab: '#9a6ab0', eyes: 'closed', expr: 'calm' }) +
    '<path d="M86 64 Q90 68 95 64" stroke="#2b2233" stroke-width="1" fill="none" opacity="0"/>' +
    '<path d="M76 70 l-8 -2 M124 70 l8 -2" stroke="#f7e7a0" stroke-width="1.5" opacity=".5"/>', 'a girl with her eyes closed');

  /* notice: a teen at a bus stop stops and looks up at an orange morning sky with birds */
  A.notice = svg(200, 160, '<defs><linearGradient id="grsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6a55a"/><stop offset=".7" stop-color="#fbd38d"/><stop offset="1" stop-color="#fde7b8"/></linearGradient></defs>' +
    '<rect width="200" height="160" fill="url(#grsky)"/><circle cx="150" cy="104" r="24" fill="#fff1c9"/>' +
    '<path d="M0 116 L20 96 L32 104 L50 84 L70 102 L90 92 L110 116Z" fill="#8a6a8f" opacity=".6"/><path d="M90 116 L130 90 L160 108 L200 94 V116Z" fill="#7a5a80" opacity=".55"/>' +
    '<rect y="116" width="200" height="44" fill="#6e6e78"/><path d="M0 128 H200" stroke="#f2f2f2" stroke-width="2" stroke-dasharray="12 10"/>' +
    '<path d="M60 40 q6 -6 12 0 q6 -6 12 0 M100 26 q5 -5 10 0 q5 -5 10 0 M128 50 q4 -4 8 0 q4 -4 8 0" stroke="#4a3a4a" stroke-width="2" fill="none"/>' +
    '<rect x="160" y="60" width="4" height="60" fill="#555"/><rect x="152" y="50" width="20" height="14" rx="2" fill="#2f6f57"/>' +
    body(70, 92, .9, '#e2b13c', { skin: SK[3] }) + face(70, 92, .9, { skin: SK[3], hair: HR[3], eyes: 'up', expr: 'open', cap: '#a33' }) +
        sparkle(96, 66, .9, '#fff') + sparkle(42, 66, .6, '#fff'), 'a boy looking up at the sky');

  /* calm: still lake, reflection, a person sitting on a dock */
  A.calm = svg(200, 160, '<rect width="200" height="80" fill="#d7e6ef"/><rect y="80" width="200" height="80" fill="#9ec3d6"/>' +
    '<path d="M0 80 L30 56 L52 68 L80 44 L110 66 L140 50 L170 64 L200 52 V80Z" fill="#7aa38a"/>' +
    '<path d="M0 80 L30 104 L52 92 L80 116 L110 94 L140 110 L170 96 L200 108 V80Z" fill="#7aa38a" opacity=".35"/>' +
    '<circle cx="46" cy="30" r="12" fill="#fff4cf"/><ellipse cx="46" cy="130" rx="12" ry="4" fill="#fff4cf" opacity=".5"/>' +
    '<path d="M20 96 h30 M120 120 h40 M60 140 h24" stroke="#fff" stroke-width="1.5" opacity=".7"/>' +
    '<path d="M110 104 H200 V112 H110Z" fill="#8b6a46"/><path d="M118 112 V150 M150 112 V150 M184 112 V150" stroke="#6e5236" stroke-width="5"/>' +
    '<g transform="translate(150 90)"><path d="M-12 14 C-12 0 12 0 12 14Z" fill="#3c6e8f"/>' + face(0, -10, .45, { skin: SK[4], hair: HR[2], eyes: 'closed', expr: 'calm' }) + '<path d="M-4 14 L-10 30 M4 14 L10 30" stroke="#2d3f55" stroke-width="5" stroke-linecap="round"/></g>', 'a still lake');

  /* grateful: hands on heart, a warm meal on the table and a family photo */
  A.grateful = svg(200, 160, bg(200, 160, '#fbe9dc', '#c58f62', 120) +
    '<rect x="14" y="20" width="40" height="32" fill="#fff" stroke="#8b6a46" stroke-width="3"/>' + face(26, 38, .26, { skin: SK[2], hair: HR[0] }) + face(42, 36, .28, { skin: SK[2], long: true, hair: HR[1] }) +
    '<ellipse cx="160" cy="124" rx="30" ry="9" fill="#fff"/><ellipse cx="160" cy="120" rx="22" ry="7" fill="#e3a14a"/><path d="M150 112 q4 -10 0 -18 M162 110 q4 -10 0 -18" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>' +
    body(92, 62, 1.1, '#6a8f5a', { skin: SK[1] }) + face(92, 62, 1.1, { skin: SK[1], hair: HR[0], eyes: 'closed', expr: 'smile' }) +
    '<path d="M70 110 C78 100 98 98 106 106 C102 116 82 120 70 110Z" fill="' + SK[1] + '"/><path d="M76 104 C86 96 104 96 110 102" stroke="rgba(0,0,0,.2)" stroke-width="2" fill="none"/>' +
    heart(92, 82, .8) + sparkle(130, 40, .9) + sparkle(56, 84, .6), 'a boy with his hands on his heart');

  /* thank: one student hands a folded card with a heart to a smiling cafeteria worker */
  A.thank = svg(200, 160, bg(200, 160, '#e8eef6', '#b7c4d6', 118) +
    '<rect x="0" y="86" width="200" height="34" fill="#d9dde3"/><rect x="0" y="86" width="200" height="6" fill="#b9bfc8"/>' +
    body(150, 54, 1, '#f2f2f2', { skin: SK[3] }) + face(150, 54, 1, { skin: SK[3], hair: HR[0], expr: 'smile' }) +
    '<path d="M126 40 C130 26 170 26 174 40" fill="#2f6f57"/><rect x="128" y="36" width="44" height="6" rx="3" fill="#2f6f57"/>' +
    body(54, 60, 1, '#d4575b', { skin: SK[0] }) + face(54, 60, 1, { skin: SK[0], long: true, hair: HR[4], expr: 'smile' }) +
    '<g transform="rotate(-10 104 96)"><path d="M84 82 L124 82 L124 110 L84 110Z" fill="#fff8e7" stroke="#b8842c" stroke-width="2"/><path d="M104 82 V110" stroke="#e6d6b0" stroke-width="2"/>' + heart(114, 90, .45) + '</g>' +
    '<circle cx="84" cy="102" r="7" fill="' + SK[0] + '"/><circle cx="124" cy="96" r="7" fill="' + SK[3] + '"/>' + sparkle(104, 66, .8), 'a student giving a card to a cafeteria worker');

  /* kind: a student helping another pick up dropped books in a hallway */
  A.kind = svg(200, 160, bg(200, 160, '#f1ebdc', '#c9b48e', 112) +
    '<rect x="10" y="20" width="26" height="80" fill="#5d7fa3"/><rect x="38" y="20" width="26" height="80" fill="#5d7fa3"/><rect x="66" y="20" width="26" height="80" fill="#5d7fa3"/>' +
    '<path d="M30 54 v10 M58 54 v10 M86 54 v10" stroke="#c9d3df" stroke-width="3"/>' +
    '<rect x="112" y="118" width="26" height="8" fill="#d4575b" transform="rotate(-14 125 122)"/><rect x="60" y="128" width="30" height="8" fill="#2f6f57" transform="rotate(10 75 132)"/><path d="M96 134 L116 128 L118 138 L98 144Z" fill="#fffdf4" stroke="#999"/>' +
    '<g transform="translate(70 96)">' + face(0, -10, .7, { skin: SK[2], hair: HR[0], expr: 'flat' }) + '<path d="M-20 34 C-20 14 -12 8 0 8 C12 8 20 14 20 34Z" fill="#7a6aa8"/></g>' +
    '<g transform="translate(150 78)">' + face(0, -10, .8, { skin: SK[4], hijab: '#2f6f57', expr: 'smile' }) + '<path d="M-22 42 C-22 16 -12 10 0 10 C12 10 22 16 22 42Z" fill="#e2b13c"/>' +
    '<path d="M-14 26 C-26 34 -36 40 -42 44" stroke="#e2b13c" stroke-width="9" stroke-linecap="round"/><circle cx="-44" cy="46" r="6" fill="' + SK[4] + '"/>' +
    '<rect x="-56" y="34" width="22" height="7" fill="#4a6fa5" transform="rotate(-8 -45 37)"/></g>' + heart(112, 60, .6), 'a student helping another pick up books');

  /* remember: a girl with a thought bubble: grandmother and a birthday cake */
  A.remember = svg(200, 160, bg(200, 160, '#f4ecf6', '#d9c6df', 128) +
    body(52, 92, 1, '#4a6fa5', { skin: SK[1] }) + face(52, 92, 1, { skin: SK[1], long: true, hair: HR[0], eyes: 'up', expr: 'smile' }) +
    '<circle cx="84" cy="62" r="4" fill="#fff" stroke="#b9a5c6" stroke-width="2"/><circle cx="94" cy="50" r="6" fill="#fff" stroke="#b9a5c6" stroke-width="2"/>' +
    '<path d="M104 12 C120 2 150 2 166 10 C190 10 196 32 186 44 C196 60 178 76 160 70 C146 82 118 80 110 68 C90 70 84 50 96 40 C88 26 94 14 104 12Z" fill="#fff" stroke="#b9a5c6" stroke-width="2"/>' +
    face(124, 36, .55, { skin: SK[1], hair: '#c9c9c9', long: true, expr: 'smile' }) + '<path d="M110 50 C110 44 116 42 124 42 C132 42 138 44 138 50Z" fill="#9a6ab0"/>' +
    '<rect x="146" y="38" width="28" height="18" rx="3" fill="#f6c3d1"/><rect x="146" y="38" width="28" height="5" fill="#fff"/><path d="M154 38 v-8 M160 38 v-8 M166 38 v-8" stroke="#4a6fa5" stroke-width="2.4"/>' +
    '<path d="M154 28 q-2 -4 0 -6 q2 2 0 6 M160 28 q-2 -4 0 -6 q2 2 0 6 M166 28 q-2 -4 0 -6 q2 2 0 6" fill="#f2a33a"/>' +
    '<path d="M146 56 H174" stroke="#c38fa0" stroke-width="2"/>', 'a girl thinking of her grandmother and a cake');

  /* relax: a teen on a sofa, feet up, tea steaming, cat */
  A.relax = svg(200, 160, bg(200, 160, '#eef0e4', '#b59a76', 130) +
    '<rect x="132" y="18" width="46" height="36" fill="#cfe3ea" stroke="#8b6a46" stroke-width="4"/><path d="M155 18 V54 M132 36 H178" stroke="#8b6a46" stroke-width="2"/>' +
    '<rect x="10" y="84" width="150" height="40" rx="10" fill="#6f8fb0"/><rect x="10" y="64" width="34" height="56" rx="10" fill="#5f7f9f"/><rect x="134" y="70" width="30" height="50" rx="10" fill="#5f7f9f"/><rect x="18" y="122" width="8" height="10" fill="#4a3a2a"/><rect x="146" y="122" width="8" height="10" fill="#4a3a2a"/>' +
    '<g transform="translate(46 70)">' + face(0, 0, .75, { skin: SK[2], hair: HR[1], eyes: 'closed', expr: 'smile' }) + '</g>' +
    '<path d="M50 88 C70 82 100 86 122 82 L150 76 L152 88 L120 96 C100 100 70 100 50 100Z" fill="#e98a5a"/><path d="M146 74 l14 -4 l2 10 l-14 4Z" fill="' + SK[2] + '"/>' +
    '<rect x="168" y="112" width="26" height="18" fill="#8b6a46"/><path d="M174 100 h14 v12 h-14Z" fill="#fff"/><path d="M188 104 c6 0 6 6 0 6" stroke="#fff" stroke-width="2" fill="none"/><path d="M178 96 q-3 -6 0 -12 M184 96 q-3 -6 0 -12" stroke="#bbb" stroke-width="1.6" fill="none"><animate attributeName="opacity" values=".3;1;.3" dur="3s" repeatCount="indefinite"/></path>' +
    '<g transform="translate(96 82)"><ellipse rx="14" ry="7" fill="#e2b13c"/><circle cx="12" cy="-4" r="6" fill="#e2b13c"/><path d="M8 -9 l2 -5 l3 4 M14 -9 l2 -5 l2 5" fill="#e2b13c"/><path d="M-14 0 c-8 -2 -8 -10 -2 -12" stroke="#e2b13c" stroke-width="3" fill="none"/></g>', 'a teen resting on a sofa');

  /* ======================= SECTION PICTURES (240×180) ======================= */
  /* hero: a desk at night by a window, journal open, tea, string lights */
  A.hero = svg(240, 180, bg(240, 180, '#24413a', '#5a4030', 130) +
    '<rect x="132" y="14" width="92" height="88" fill="#1b2c4a" stroke="#c9b48e" stroke-width="5"/><path d="M178 14 V102 M132 58 H224" stroke="#c9b48e" stroke-width="3"/>' +
    '<circle cx="204" cy="34" r="9" fill="#f7e7a0"/><circle cx="150" cy="30" r="1.5" fill="#fff"/><circle cx="160" cy="80" r="1.2" fill="#fff"/><circle cx="210" cy="80" r="1.4" fill="#fff"/>' +
    '<path d="M150 102 L160 86 L170 92 L184 80 L198 94 L214 84 L224 102Z" fill="#2c3e5e"/>' +
    '<path d="M0 22 Q30 36 60 22 T120 22" stroke="#d9c79a" stroke-width="1.4" fill="none"/>' +
    [8, 26, 44, 62, 80, 98, 114].map(function (x, i) { return '<circle cx="' + x + '" cy="' + (26 + (i % 2) * 6) + '" r="3.4" fill="' + ['#f7c948', '#f29b70', '#9fd3a8'][i % 3] + '"><animate attributeName="opacity" values="1;.4;1" dur="' + (2 + i % 3) + 's" repeatCount="indefinite"/></circle>'; }).join('') +
    '<rect x="0" y="126" width="240" height="8" fill="#7a5a40"/>' +
    '<path d="M30 124 C64 116 94 118 104 124 C114 118 144 116 178 124 L178 130 L30 130Z" fill="#fffdf4" stroke="#b8a882" stroke-width="2"/><path d="M104 124 V130" stroke="#b8a882" stroke-width="2"/>' +
    '<path d="M44 124 c6 -3 10 1 16 -1 s10 1 16 -1 M118 122 c6 -3 10 1 16 -1 s10 1 16 -1" stroke="#3a3a6a" stroke-width="1.4" fill="none"/>' +
    heart(150, 116, .35) +
    '<rect x="196" y="108" width="20" height="18" rx="3" fill="#d4575b"/><path d="M216 112 c6 0 6 8 0 8" stroke="#d4575b" stroke-width="3" fill="none"/>' +
    '<path d="M202 102 q-3 -6 0 -12 M210 102 q-3 -6 0 -12" stroke="#ddd" stroke-width="1.6" fill="none"><animate attributeName="opacity" values=".2;.9;.2" dur="3s" repeatCount="indefinite"/></path>' +
    '<g transform="rotate(20 70 150)"><rect x="60" y="146" width="60" height="6" rx="3" fill="#f2c230"/></g>', 'a desk at night with an open journal');

  /* warm-up: small good things: the bus on time, a friend laughing, a fresh mango */
  A.small = svg(240, 180, bg(240, 180, '#fdf6e6') +
    '<rect x="8" y="10" width="108" height="76" rx="10" fill="#dff0ea" stroke="#1f4d3d" stroke-width="2"/>' +
    '<rect x="20" y="34" width="86" height="34" rx="6" fill="#e2b13c"/><rect x="26" y="40" width="14" height="12" fill="#cfe3ea"/><rect x="44" y="40" width="14" height="12" fill="#cfe3ea"/><rect x="62" y="40" width="14" height="12" fill="#cfe3ea"/><rect x="82" y="40" width="18" height="20" fill="#cfe3ea"/>' +
    '<circle cx="36" cy="70" r="7" fill="#333"/><circle cx="88" cy="70" r="7" fill="#333"/><circle cx="36" cy="70" r="3" fill="#999"/><circle cx="88" cy="70" r="3" fill="#999"/>' +
    '<circle cx="98" cy="22" r="9" fill="#fff" stroke="#1f4d3d" stroke-width="2"/><path d="M98 16 V22 L102 25" stroke="#1f4d3d" stroke-width="2" fill="none"/>' +
    '<rect x="124" y="10" width="108" height="76" rx="10" fill="#fbe3e3" stroke="#a14a4a" stroke-width="2"/>' +
    face(156, 50, .62, { skin: SK[2], hair: HR[0], expr: 'open' }) + face(200, 50, .62, { skin: SK[0], long: true, hair: HR[4], expr: 'smile' }) +
    '<path d="M172 30 l4 -6 M178 34 l6 -4 M146 26 l-4 -6" stroke="#a14a4a" stroke-width="2" stroke-linecap="round"/>' +
    '<rect x="8" y="96" width="108" height="76" rx="10" fill="#fff1d6" stroke="#b8842c" stroke-width="2"/>' +
    '<path d="M40 150 C24 130 40 108 64 112 C88 116 92 146 70 156 C58 162 48 160 40 150Z" fill="#f2a33a"/><path d="M48 118 C60 112 80 118 84 132" stroke="#f7c948" stroke-width="5" fill="none" opacity=".7"/><path d="M62 112 C62 104 68 100 74 100" stroke="#5f8f5a" stroke-width="3" fill="none"/><path d="M70 102 C78 96 86 100 84 106 C78 108 72 106 70 102Z" fill="#5f8f5a"/>' +
    '<rect x="124" y="96" width="108" height="76" rx="10" fill="#e6ecf6" stroke="#4a6fa5" stroke-width="2"/>' +
    '<rect x="140" y="132" width="76" height="26" rx="6" fill="#6f8fb0"/><rect x="146" y="118" width="64" height="18" rx="8" fill="#fdfcf6"/><path d="M150 124 h30" stroke="#d6d0c0" stroke-width="2"/>' +
    '<path d="M196 106 a10 10 0 1 0 10 16 a8 8 0 1 1 -10 -16Z" fill="#f7e7a0"/>', 'four small good things');

  /* what is gratitude: a warm bed, a friend waiting, food you like */
  A.whatis = svg(240, 180, bg(240, 180, '#f6efe0') +
    '<rect x="6" y="8" width="72" height="164" rx="10" fill="#e9e2f2" stroke="#7a4a6e" stroke-width="2"/>' +
    '<rect x="14" y="94" width="56" height="34" rx="4" fill="#9a6ab0"/><rect x="14" y="80" width="22" height="18" rx="6" fill="#fff"/><path d="M14 104 C30 96 50 100 70 96" stroke="#b98cd0" stroke-width="3" fill="none"/><rect x="14" y="128" width="4" height="12" fill="#5a3a22"/><rect x="66" y="128" width="4" height="12" fill="#5a3a22"/>' +
    '<path d="M30 40 a10 10 0 1 0 10 16 a8 8 0 1 1 -10 -16Z" fill="#f7e7a0"/><text x="50" y="60" font-size="10" fill="#7a4a6e" font-family="Nunito">z z</text>' +
    '<rect x="84" y="8" width="72" height="164" rx="10" fill="#dff0ea" stroke="#1f4d3d" stroke-width="2"/>' +
    '<rect x="92" y="40" width="10" height="110" fill="#8b8b8b"/><path d="M92 40 h30 v16 h-30Z" fill="#2f6f57"/>' +
    body(130, 92, .62, '#d4575b', { skin: SK[3] }) + face(130, 92, .62, { skin: SK[3], hair: HR[0], expr: 'smile' }) +
    '<path d="M144 112 C152 104 154 96 150 88" stroke="#d4575b" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="150" cy="86" r="4" fill="' + SK[3] + '"/>' +
    '<path d="M116 150 V130 M140 150 V130" stroke="#2d3f55" stroke-width="7"/>' +
    '<rect x="162" y="8" width="72" height="164" rx="10" fill="#fff1d6" stroke="#b8842c" stroke-width="2"/>' +
    '<ellipse cx="198" cy="112" rx="30" ry="10" fill="#fff" stroke="#c9b48e" stroke-width="2"/><ellipse cx="198" cy="106" rx="24" ry="12" fill="#e9e1cf"/>' +
    '<path d="M180 104 c4 -6 8 -4 10 0 c2 -6 8 -6 10 0 c2 -5 8 -5 10 0" stroke="#d4a24a" stroke-width="4" fill="none"/><circle cx="190" cy="100" r="3" fill="#d4575b"/><circle cx="206" cy="100" r="3" fill="#5f8f5a"/>' +
    '<path d="M190 84 q-4 -8 0 -16 M200 84 q-4 -8 0 -16 M210 84 q-4 -8 0 -16" stroke="#c9b48e" stroke-width="2" fill="none"><animate attributeName="opacity" values=".2;1;.2" dur="3s" repeatCount="indefinite"/></path>' +
    '<path d="M170 140 L176 112 M226 140 L220 112" stroke="#8b6a46" stroke-width="3"/>', 'a warm bed, a friend who waits, good food');

  /* scientist asking a question: woman with clipboard, question mark, smiley scale */
  A.scientist = svg(240, 180, bg(240, 180, '#e8f0f2', '#c9d3d6', 140) +
    '<rect x="150" y="20" width="76" height="60" rx="4" fill="#fff" stroke="#4a6fa5" stroke-width="3"/><path d="M160 66 L176 50 L192 58 L214 32" stroke="#d4575b" stroke-width="3" fill="none"/><path d="M160 30 V70 H220" stroke="#999" stroke-width="2" fill="none"/>' +
    body(96, 62, 1.15, '#fff', { skin: SK[4] }) + '<path d="M70 104 V180 M122 104 V180" stroke="#e6e6e6" stroke-width="2"/>' + face(96, 62, 1.15, { skin: SK[4], hair: HR[2], long: true, expr: 'calm', eyes: 'up' }) +
    '<rect x="80" y="54" width="14" height="10" rx="4" fill="none" stroke="#333" stroke-width="2"/><rect x="98" y="54" width="14" height="10" rx="4" fill="none" stroke="#333" stroke-width="2"/><path d="M94 58 h4" stroke="#333" stroke-width="2"/>' +
    '<rect x="110" y="106" width="34" height="44" rx="3" fill="#c9a24a"/><rect x="114" y="112" width="26" height="34" fill="#fff"/><path d="M118 120 h18 M118 128 h18 M118 136 h12" stroke="#9fb6cf" stroke-width="2"/><rect x="120" y="102" width="14" height="8" rx="2" fill="#777"/>' +
    '<path d="M40 30 C40 14 66 14 66 30 C66 42 54 42 54 54" stroke="#b8842c" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="54" cy="66" r="4.5" fill="#b8842c"/>' +
    '<g transform="translate(24 120)"><circle r="10" fill="#e3e3e3"/><path d="M-4 3 Q0 0 4 3" stroke="#555" stroke-width="2" fill="none"/></g><g transform="translate(46 128)"><circle r="10" fill="#f7e7a0"/><path d="M-5 1 Q0 6 5 1" stroke="#555" stroke-width="2" fill="none"/></g>', 'a scientist with a clipboard and a question');

  /* the experiment: two calendars — one ticked once a week, one ticked three times */
  A.experiment = svg(240, 180, bg(240, 180, '#f7f2e6') +
    (function () {
      var out = '', c;
      [[10, '#2f6f57', [1]], [124, '#a14a4a', [0, 2, 4]]].forEach(function (cal) {
        var x = cal[0];
        out += '<rect x="' + x + '" y="20" width="106" height="140" rx="6" fill="#fff" stroke="' + cal[1] + '" stroke-width="3"/><rect x="' + x + '" y="20" width="106" height="22" rx="6" fill="' + cal[1] + '"/>' +
          '<circle cx="' + (x + 22) + '" cy="20" r="4" fill="#ccc"/><circle cx="' + (x + 84) + '" cy="20" r="4" fill="#ccc"/>';
        for (var r = 0; r < 6; r++) for (c = 0; c < 7; c++) {
          var cx = x + 8 + c * 13.6, cy = 50 + r * 18;
          out += '<rect x="' + cx + '" y="' + cy + '" width="11" height="14" fill="#f2efe6"/>';
          if (cal[2].indexOf(c) > -1) out += '<path d="M' + (cx + 1.5) + ' ' + (cy + 7) + ' l3 4 l6 -9" stroke="' + cal[1] + '" stroke-width="2.4" fill="none"/>';
        }
      });
      return out;
    })() +
    '<g transform="translate(200 168)"><rect x="-10" y="-10" width="20" height="8" fill="#f2c230"/></g>', 'two calendars: once a week and three times a week');

  /* chore: a bored teen with a tall pile of the same notebooks */
  A.chore = svg(240, 180, bg(240, 180, '#ece8e2', '#b9a98e', 140) +
    [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<rect x="' + (150 + (i % 2) * 4) + '" y="' + (128 - i * 12) + '" width="60" height="11" rx="2" fill="' + (i % 2 ? '#8a8a8a' : '#9a9a9a') + '" stroke="#6e6e6e"/>'; }).join('') +
    '<rect x="20" y="118" width="110" height="10" fill="#8b6a46"/><path d="M30 128 V160 M120 128 V160" stroke="#6e5236" stroke-width="6"/>' +
    body(76, 70, 1.05, '#8a8a9a', { skin: SK[0] }) + face(76, 70, 1.05, { skin: SK[0], hair: HR[1], expr: 'bored' }) +
    '<path d="M50 112 C60 100 66 96 70 92" stroke="' + SK[0] + '" stroke-width="10" stroke-linecap="round" fill="none"/>' +
    '<rect x="60" y="110" width="44" height="10" fill="#fff"/><path d="M64 115 h34" stroke="#ccc" stroke-width="2"/>' +
    '<circle cx="108" cy="30" r="14" fill="#fff" stroke="#999" stroke-width="2"/><path d="M108 22 V30 H114" stroke="#555" stroke-width="2" fill="none"/>' +
    '<text x="118" y="60" font-size="14" fill="#888" font-family="Nunito" font-weight="800">z z z</text>', 'a bored student with a pile of the same notebooks');

  /* three reasons: savor (eat slowly), cope (umbrella in rain), adaptation (new phone sparkle → dull) */
  A.reasons = svg(240, 180, bg(240, 180, '#f7f2e6') +
    '<rect x="4" y="8" width="74" height="164" rx="10" fill="#fff1d6" stroke="#b8842c" stroke-width="2"/>' +
    face(41, 66, .7, { skin: SK[1], hair: HR[0], eyes: 'closed', expr: 'smile' }) + '<path d="M22 140 C22 106 30 94 41 94 C52 94 60 106 60 140Z" fill="#5f8f5a"/>' +
    '<ellipse cx="41" cy="122" rx="18" ry="6" fill="#fff"/><path d="M30 120 c4 -6 18 -6 22 0" fill="#f2a33a"/><path d="M58 98 l8 -12" stroke="#bbb" stroke-width="3"/>' +
    '<rect x="83" y="8" width="74" height="164" rx="10" fill="#e3ebf3" stroke="#4a6fa5" stroke-width="2"/>' +
    '<path d="M94 20 l-4 10 M108 16 l-4 10 M124 20 l-4 10 M140 16 l-4 10 M150 30 l-4 10 M98 40 l-4 10" stroke="#7a9cc0" stroke-width="2"/>' +
    '<path d="M94 74 C94 50 146 50 146 74Z" fill="#d4575b"/><path d="M120 74 V112 q0 6 -6 6" stroke="#333" stroke-width="3" fill="none"/>' +
    face(120, 98, .6, { skin: SK[3], hair: HR[0], expr: 'calm' }) + '<path d="M104 160 C104 128 110 118 120 118 C130 118 136 128 136 160Z" fill="#e2b13c"/>' +
    '<rect x="162" y="8" width="74" height="164" rx="10" fill="#efe9f6" stroke="#7a4a6e" stroke-width="2"/>' +
    '<rect x="176" y="24" width="22" height="40" rx="4" fill="#2a2a3a"/><rect x="179" y="28" width="16" height="30" fill="#7fd1e0"/>' + sparkle(206, 28, .9) + sparkle(172, 60, .7) + face(214, 52, .32, { skin: SK[0], hair: HR[3], expr: 'open' }) +
    '<path d="M199 80 v14 M193 88 l6 6 l6 -6" stroke="#7a4a6e" stroke-width="3" fill="none"/>' +
    '<rect x="176" y="104" width="22" height="40" rx="4" fill="#2a2a3a"/><rect x="179" y="108" width="16" height="30" fill="#8a9aa0"/>' + face(214, 132, .32, { skin: SK[0], hair: HR[3], expr: 'bored' }), 'savoring, coping, and getting used to things');

  /* mindful breathing + heart rate slowing */
  A.heart = svg(240, 180, bg(240, 180, '#e3f0f2') +
    body(70, 70, 1, '#5d8aa8', { skin: SK[2] }) + face(70, 70, 1, { skin: SK[2], hijab: '#b8842c', eyes: 'closed', expr: 'calm' }) +
    '<rect x="132" y="30" width="100" height="120" rx="12" fill="#fff" stroke="#1f4d3d" stroke-width="3"/>' + heart(182, 44, .7) +
    '<path d="M140 92 L156 92 L160 76 L166 110 L172 70 L178 100 L182 92 L190 92" stroke="#d4575b" stroke-width="2.6" fill="none"/>' +
    '<path d="M190 92 L200 92 L204 84 L208 100 L212 92 L226 92" stroke="#5f8f5a" stroke-width="2.6" fill="none"/>' +
    '<path d="M150 124 H220 M206 118 L220 124 L206 130" stroke="#1f4d3d" stroke-width="3" fill="none"/>' +
    '<path d="M30 170 C30 150 110 150 110 170" fill="#5d8aa8" opacity=".35"/>', 'a calm girl and a heart beat that slows down');

  /* flow: a boy drawing, a clock whose hands have blurred */
  A.flow = svg(240, 180, bg(240, 180, '#f2ead8', '#b8875a', 128) +
    '<circle cx="196" cy="40" r="26" fill="#fff" stroke="#333" stroke-width="3"/>' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var a = i * Math.PI / 6; return '<path d="M' + (196 + 21 * Math.cos(a)).toFixed(1) + ' ' + (40 + 21 * Math.sin(a)).toFixed(1) + ' L' + (196 + 24 * Math.cos(a)).toFixed(1) + ' ' + (40 + 24 * Math.sin(a)).toFixed(1) + '" stroke="#333" stroke-width="2"/>'; }).join('') +
    '<g><path d="M196 40 L196 22" stroke="#d4575b" stroke-width="3" opacity=".9"/><animateTransform attributeName="transform" type="rotate" from="0 196 40" to="360 196 40" dur="3s" repeatCount="indefinite"/></g>' +
    '<path d="M196 40 L210 40" stroke="#333" stroke-width="3"/><path d="M174 18 A30 30 0 0 1 222 22" stroke="#d4575b" stroke-width="2" fill="none" opacity=".4"/>' +
    '<rect x="20" y="118" width="170" height="10" fill="#8b6a46"/>' +
    body(80, 64, 1.05, '#2f6f57', { skin: SK[3] }) + face(80, 64, 1.05, { skin: SK[3], hair: HR[0], expr: 'calm' }) +
    '<rect x="96" y="96" width="70" height="22" fill="#fff" transform="skewX(-20)"/><path d="M116 108 c6 -8 14 8 20 -2 c4 -6 10 2 14 -2" stroke="#4a6fa5" stroke-width="2.4" fill="none"/>' +
    '<path d="M100 104 L126 100" stroke="' + SK[3] + '" stroke-width="9" stroke-linecap="round"/><rect x="124" y="94" width="5" height="16" fill="#f2c230" transform="rotate(30 126 102)"/>' +
    sparkle(150, 70, .8) + sparkle(30, 30, .6), 'a boy drawing, so focused he forgets the time');

  /* comprehension: two students talking it over */
  A.think = svg(240, 180, bg(240, 180, '#eef3ea', '#c8d6bf', 140) +
    body(70, 74, 1, '#d4575b', { skin: SK[1] }) + face(70, 74, 1, { skin: SK[1], long: true, hair: HR[0], expr: 'open' }) +
    body(170, 74, 1, '#4a6fa5', { skin: SK[3] }) + face(170, 74, 1, { skin: SK[3], hair: HR[3], expr: 'smile', eyes: 'up' }) +
    '<path d="M40 14 h70 a10 10 0 0 1 10 10 v20 a10 10 0 0 1 -10 10 h-46 l-10 10 v-10 h-14 a10 10 0 0 1 -10 -10 v-20 a10 10 0 0 1 10 -10Z" fill="#fff" stroke="#1f4d3d" stroke-width="2"/>' +
    '<path d="M52 30 h50 M52 40 h34" stroke="#9fb6cf" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="196" cy="34" r="12" fill="#fff" stroke="#b8842c" stroke-width="2"/><path d="M192 30 c0 -6 9 -6 9 0 c0 4 -5 4 -5 8" stroke="#b8842c" stroke-width="2.4" fill="none"/><circle cx="196" cy="42" r="1.6" fill="#b8842c"/>' +
    '<circle cx="176" cy="52" r="3" fill="#fff" stroke="#b8842c" stroke-width="1.5"/>', 'two students talking about the reading');

  /* words: a stack of word cards with small pictures */
  A.words = svg(240, 180, bg(240, 180, '#fdf6e6') +
    [[22, 30, -8, '#dff0ea'], [86, 22, 4, '#fbe3e3'], [150, 30, -4, '#e6ecf6'], [40, 98, 6, '#fff1d6'], [112, 100, -6, '#efe9f6']].map(function (c) {
      return '<g transform="rotate(' + c[2] + ' ' + (c[0] + 34) + ' ' + (c[1] + 30) + ')"><rect x="' + c[0] + '" y="' + c[1] + '" width="68" height="60" rx="8" fill="' + c[3] + '" stroke="#1f4d3d" stroke-width="2"/>' +
        '<path d="M' + (c[0] + 12) + ' ' + (c[1] + 46) + ' h44" stroke="#1f4d3d" stroke-width="4" stroke-linecap="round"/></g>';
    }).join('') +
    heart(56, 46, .6) + '<circle cx="120" cy="40" r="10" fill="#f7c948"/><path d="M114 42 Q120 48 126 42" stroke="#7a2e2e" stroke-width="2" fill="none"/>' +
    '<path d="M174 40 c6 -8 14 -8 18 0 c-6 8 -12 8 -18 0Z" fill="#9cc58f"/>' + face(74, 116, .3, { skin: SK[2], hair: HR[0], eyes: 'closed', expr: 'calm' }) +
    '<path d="M136 112 C144 104 156 108 154 118 C162 122 156 132 148 128 C140 134 130 126 136 120Z" fill="#cfe3ea"/>', 'word cards with small pictures');

  /* sit for breathing: feet on floor, back straight, hands on knees */
  A.sit = svg(240, 180, bg(240, 180, '#e3f0f2', '#b9d6d0', 150) +
    '<rect x="70" y="96" width="70" height="10" rx="3" fill="#8b6a46"/><path d="M76 106 V152 M134 106 V152" stroke="#6e5236" stroke-width="6"/><rect x="128" y="40" width="10" height="66" rx="3" fill="#8b6a46"/>' +
    face(110, 40, .9, { skin: SK[0], hair: HR[2], eyes: 'closed', expr: 'calm' }) +
    '<path d="M90 96 C88 74 94 62 110 62 C126 62 132 74 130 96Z" fill="#2f6f57"/>' +
    '<path d="M94 96 L80 98 L82 148 M126 96 L112 98 L114 148" stroke="#2d3f55" stroke-width="10" stroke-linecap="round" fill="none"/>' +
    '<path d="M72 150 h18 M104 150 h18" stroke="#222" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M92 72 C84 84 84 92 90 98 M128 72 C136 84 134 92 126 98" stroke="#2f6f57" stroke-width="8" stroke-linecap="round" fill="none"/>' +
    '<path d="M150 30 V140" stroke="#1f4d3d" stroke-width="2" stroke-dasharray="5 5"/><path d="M144 36 L150 26 L156 36" stroke="#1f4d3d" stroke-width="2" fill="none"/>' +
    '<path d="M60 160 H170" stroke="#5d8aa8" stroke-width="3"/>' +
    '<path d="M40 60 C30 56 24 62 26 70 C18 74 22 84 32 82 C36 88 48 86 50 78" fill="#fff" opacity=".8"/>', 'how to sit for slow breathing');

  /* journal section: the ways to do it — write, letter, draw/photo, tell someone, thank someone new */
  A.ways = svg(240, 180, bg(240, 180, '#fdf6e6') +
    '<rect x="8" y="10" width="70" height="74" rx="8" fill="#fff" stroke="#b8842c" stroke-width="2"/><path d="M18 30 h50 M18 42 h50 M18 54 h40 M18 66 h46" stroke="#9fb6cf" stroke-width="2"/><circle cx="22" cy="30" r="2" fill="#b8842c"/><circle cx="22" cy="42" r="2" fill="#b8842c"/>' +
    '<rect x="86" y="10" width="70" height="74" rx="8" fill="#fff" stroke="#b8842c" stroke-width="2"/><path d="M96 30 h50 v34 h-50Z" fill="#fdf2dd" stroke="#a14a4a" stroke-width="2"/><path d="M96 30 L121 50 L146 30" stroke="#a14a4a" stroke-width="2" fill="none"/>' + heart(121, 52, .4) +
    '<rect x="164" y="10" width="70" height="74" rx="8" fill="#fff" stroke="#b8842c" stroke-width="2"/><rect x="176" y="32" width="46" height="34" rx="5" fill="#3a3a4a"/><circle cx="199" cy="49" r="10" fill="#7fb0d0" stroke="#ddd" stroke-width="3"/><rect x="182" y="26" width="12" height="8" rx="2" fill="#3a3a4a"/>' +
    '<rect x="36" y="96" width="78" height="76" rx="8" fill="#fff" stroke="#b8842c" stroke-width="2"/>' + face(60, 140, .48, { skin: SK[2], hair: HR[0], expr: 'open' }) + face(92, 140, .48, { skin: SK[4], long: true, hair: HR[1], expr: 'smile' }) +
    '<path d="M50 104 h28 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-16 l-6 6 v-6 h-6 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6Z" fill="#e3f0f2"/>' + heart(64, 108, .3) +
    '<rect x="126" y="96" width="78" height="76" rx="8" fill="#fff" stroke="#b8842c" stroke-width="2"/>' +
    '<rect x="146" y="128" width="38" height="30" fill="#d4575b"/><rect x="142" y="120" width="46" height="10" fill="#e06a6e"/><path d="M165 120 V158" stroke="#f7c948" stroke-width="5"/><path d="M165 120 C154 108 146 116 165 120 C184 116 176 108 165 120Z" fill="#f7c948"/>' +
    sparkle(196, 108, .7), 'five ways to keep a gratitude journal');

  /* before you go: two mood faces on a ladder */
  A.mood = svg(240, 180, bg(240, 180, '#f2f6ee') +
    '<rect x="96" y="14" width="48" height="152" rx="24" fill="#fff" stroke="#1f4d3d" stroke-width="3"/>' +
    [0, 1, 2, 3, 4].map(function (i) { return '<path d="M104 ' + (36 + i * 28) + ' h32" stroke="#d6e2d8" stroke-width="3"/>'; }).join('') +
    '<rect x="104" y="96" width="32" height="62" rx="14" fill="#9cc58f"/>' +
    '<circle cx="50" cy="126" r="26" fill="#f7e7a0" stroke="#b8842c" stroke-width="2"/><circle cx="41" cy="120" r="3" fill="#333"/><circle cx="59" cy="120" r="3" fill="#333"/><path d="M42 136 h16" stroke="#333" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="190" cy="56" r="26" fill="#f7c948" stroke="#b8842c" stroke-width="2"/><circle cx="181" cy="50" r="3" fill="#333"/><circle cx="199" cy="50" r="3" fill="#333"/><path d="M178 62 Q190 74 202 62" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M76 116 C100 90 140 70 160 62" stroke="#1f4d3d" stroke-width="2" stroke-dasharray="5 5" fill="none"/><path d="M152 58 L162 62 L154 70" stroke="#1f4d3d" stroke-width="2" fill="none"/>', 'how do you feel now');

  /* the hidden Galileo lion (easter egg) */
  A.lion = '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="a tiny lion">' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var a = i * Math.PI / 6; return '<circle cx="' + (30 + 19 * Math.cos(a)).toFixed(1) + '" cy="' + (30 + 19 * Math.sin(a)).toFixed(1) + '" r="9" fill="' + (i % 2 ? '#b8662c' : '#c97a34') + '"/>'; }).join('') +
    '<circle cx="30" cy="30" r="17" fill="#f2b34a"/><circle cx="18" cy="17" r="5" fill="#f2b34a"/><circle cx="42" cy="17" r="5" fill="#f2b34a"/>' +
    '<circle cx="24" cy="28" r="2.4" fill="#2b2233"/><circle cx="36" cy="28" r="2.4" fill="#2b2233"/><path d="M27 34 L33 34 L30 38Z" fill="#7a3a2a"/><path d="M30 38 Q26 42 23 40 M30 38 Q34 42 37 40" stroke="#7a3a2a" stroke-width="1.6" fill="none"/></svg>';
})();
