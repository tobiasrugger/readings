/* readings/landlady/places/art.js — T-500 (Nov 20 2026). Drawings for "Where will Billy sleep?"
   Word pictures are 200x160; scene panels 640x260. Flat layered SVG, 2–3 tones per surface, muted palette.
   No picture carries a word that answers the question on its own screen (the B&B sign only appears where it is taught). */
(function () {
  var A = window.PL_ART = {};
  function S(w, h, body, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (label || '') + '">' + body + '</svg>';
  }
  /* small helpers */
  function win(x, y, w, h, lit) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (lit ? '#f6d27a' : '#9fb4c4') + '" stroke="#3b3326" stroke-width="2"/>' +
      '<line x1="' + (x + w / 2) + '" y1="' + y + '" x2="' + (x + w / 2) + '" y2="' + (y + h) + '" stroke="#3b3326" stroke-width="1.5"/>' +
      '<line x1="' + x + '" y1="' + (y + h / 2) + '" x2="' + (x + w) + '" y2="' + (y + h / 2) + '" stroke="#3b3326" stroke-width="1.5"/>';
  }
  function bricks(x, y, w, h, c1, c2) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c1 + '"/>';
    for (var r = 0, yy = y + 8; yy < y + h; yy += 8, r++) {
      s += '<line x1="' + x + '" y1="' + yy + '" x2="' + (x + w) + '" y2="' + yy + '" stroke="' + c2 + '" stroke-width="1"/>';
      for (var xx = x + (r % 2 ? 6 : 12); xx < x + w; xx += 14) s += '<line x1="' + xx + '" y1="' + (yy - 8) + '" x2="' + xx + '" y2="' + yy + '" stroke="' + c2 + '" stroke-width="1"/>';
    }
    return s;
  }
  function person(x, y, shirt, skin, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<circle cx="0" cy="-30" r="8" fill="' + (skin || '#e2b48c') + '" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M-10 -20 Q0 -24 10 -20 L12 4 L-12 4 Z" fill="' + shirt + '" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="-9" y="4" width="7" height="16" fill="#3e4a5c"/><rect x="2" y="4" width="7" height="16" fill="#3e4a5c"/></g>';
  }
  function sky(w, h, night) {
    return '<rect width="' + w + '" height="' + h + '" fill="' + (night ? '#2b3550' : '#cfe3f0') + '"/>' +
      (night ? '<circle cx="' + (w - 30) + '" cy="26" r="12" fill="#f3ecd2"/><circle cx="' + (w - 25) + '" cy="23" r="11" fill="#2b3550"/>' : '<circle cx="' + (w - 28) + '" cy="26" r="13" fill="#f7e3a0"/>');
  }

  /* ---------- 1 · where do you sleep when you travel? ---------- */
  A.hotel = function () {
    var w = '';
    for (var r = 0; r < 5; r++) for (var c = 0; c < 4; c++) w += win(58 + c * 22, 22 + r * 20, 14, 13, (r + c) % 3 === 0);
    return S(200, 160, sky(200, 160) +
      '<rect x="0" y="140" width="200" height="20" fill="#8c8f86"/><rect x="0" y="138" width="200" height="4" fill="#6d6f68"/>' +
      '<rect x="48" y="12" width="104" height="128" fill="#c9b79a" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="48" y="12" width="104" height="6" fill="#a08c6d"/>' + w +
      '<rect x="78" y="114" width="44" height="26" fill="#5b3a29" stroke="#3b3326" stroke-width="2"/>' +
      '<line x1="100" y1="114" x2="100" y2="140" stroke="#d8c08a" stroke-width="2"/>' +
      '<path d="M70 112 L130 112 L124 104 L76 104 Z" fill="#a33a35" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="66" y="0" width="68" height="12" rx="2" fill="#2f3e5a"/><text x="100" y="9.5" font-size="9" font-family="Nunito,sans-serif" font-weight="900" fill="#f6d27a" text-anchor="middle">HOTEL</text>' +
      person(136, 150, '#2f6fbd', '#c88c5e', .9) +
      '<rect x="146" y="128" width="16" height="12" rx="2" fill="#7a4a2a" stroke="#3b3326" stroke-width="1.5"/><path d="M150 128 v-4 h8 v4" fill="none" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="20" y="96" width="6" height="44" fill="#6b4f2c"/><circle cx="23" cy="92" r="14" fill="#5f8f4e"/><circle cx="16" cy="98" r="9" fill="#4d7a3f"/>', 'A tall building with many windows, a red awning and a man with a suitcase at the door.');
  };
  A.familyhome = function () {
    return S(200, 160, sky(200, 160) +
      '<rect x="0" y="132" width="200" height="28" fill="#8dbb6b"/><rect x="0" y="130" width="200" height="4" fill="#6f9b51"/>' +
      '<path d="M40 70 L100 30 L160 70 Z" fill="#b4513a" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="50" y="70" width="100" height="62" fill="#f1e2c0" stroke="#3b3326" stroke-width="2.5"/>' +
      win(60, 82, 24, 20, true) + win(116, 82, 24, 20, true) +
      '<rect x="88" y="98" width="22" height="34" fill="#6b8f4e" stroke="#3b3326" stroke-width="2"/><circle cx="104" cy="116" r="1.8" fill="#3b3326"/>' +
      '<rect x="126" y="40" width="12" height="20" fill="#8a5a44" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M132 36 q4 -8 0 -14 q-4 -6 2 -12" fill="none" stroke="#c9c9c9" stroke-width="3" stroke-linecap="round"/>' +
      person(26, 148, '#d9567f', '#c88c5e', .95) + person(176, 148, '#2f7d4f', '#8d5a3b', 1) +
      '<path d="M18 112 l-8 -8" stroke="#3b3326" stroke-width="3" stroke-linecap="round"/><path d="M184 112 l8 -8" stroke="#3b3326" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M70 132 h60" stroke="#c9a46a" stroke-width="5"/>', 'A small house with smoke from the chimney and two family members waving outside.');
  };
  A.tent = function () {
    var st = '';
    [[20, 20], [50, 12], [90, 26], [140, 14], [170, 34], [120, 40], [30, 50]].forEach(function (p) { st += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#fff"/>'; });
    return S(200, 160, sky(200, 160, true) + st +
      '<path d="M0 110 L40 80 L70 100 L110 70 L150 96 L200 76 L200 160 L0 160 Z" fill="#34465e"/>' +
      '<rect x="0" y="124" width="200" height="36" fill="#3e5a3a"/>' +
      '<path d="M44 132 L92 66 L140 132 Z" fill="#d98b3a" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M92 66 L80 132 L104 132 Z" fill="#7a4520" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M92 66 L92 58" stroke="#3b3326" stroke-width="2.5"/>' +
      '<g transform="translate(160 132)"><path d="M-12 0 l24 0" stroke="#5b3a29" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M-6 -2 Q0 -26 6 -2 Z" fill="#f2a33a"/><path d="M-3 -2 Q0 -16 3 -2 Z" fill="#fde28a"/></g>' +
      '<ellipse cx="160" cy="130" rx="30" ry="10" fill="#f2a33a" opacity=".18"/>', 'A tent on a hill at night, under stars, beside a small campfire.');
  };
  A.friendhome = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#e9dcc6"/>' +
      '<rect x="0" y="118" width="200" height="42" fill="#a77b52"/>' +
      '<rect x="128" y="18" width="52" height="44" fill="#9fc0d6" stroke="#3b3326" stroke-width="2.5"/><line x1="154" y1="18" x2="154" y2="62" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="18" y="74" width="120" height="44" rx="8" fill="#5a7fa8" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="12" y="62" width="132" height="22" rx="8" fill="#6e93bb" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="26" y="88" width="104" height="18" rx="6" fill="#7cc0a0" stroke="#3b3326" stroke-width="2"/>' +
      '<circle cx="36" cy="88" r="9" fill="#e2b48c" stroke="#3b3326" stroke-width="1.5"/><path d="M30 84 q6 -8 12 0" fill="#3b2a1e"/>' +
      '<path d="M48 92 q30 -6 74 0" fill="none" stroke="#3b3326" stroke-width="1.2"/>' +
      '<rect x="150" y="86" width="34" height="32" fill="#7a5134" stroke="#3b3326" stroke-width="2"/><rect x="156" y="78" width="10" height="8" fill="#f6d27a" stroke="#3b3326" stroke-width="1.5"/>' +
      '<text x="64" y="60" font-size="11" font-family="Nunito,sans-serif" font-weight="900" fill="#5c6b62">z z z</text>', 'Someone asleep on a couch in a friend\'s living room, with a sleeping bag.');
  };

  /* ---------- 2 · the four places ---------- */
  A.pub = function () {
    return S(200, 160, sky(200, 160, true) +
      '<rect x="0" y="140" width="200" height="20" fill="#5b5a54"/>' +
      '<rect x="18" y="40" width="164" height="100" fill="#efe4cc" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M18 40 L100 14 L182 40 Z" fill="#6e4b35" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M18 62 h164 M50 40 v100 M150 40 v100 M18 100 l32 -38 M150 62 l32 38" stroke="#4a3426" stroke-width="5"/>' +
      win(60, 70, 34, 26, true) + win(106, 70, 34, 26, true) +
      '<rect x="88" y="104" width="24" height="36" fill="#4a3426" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="82" y="100" width="36" height="4" fill="#4a3426"/>' +
      '<path d="M182 50 h12 v6" stroke="#2e2a24" stroke-width="3" fill="none"/>' +
      '<rect x="182" y="56" width="16" height="22" fill="#24324d" stroke="#d4a017" stroke-width="1.5"/>' +
      '<path d="M190 60 q-4 0 -4 6 h8 q0 -6 -4 -6 Z" fill="#d4a017"/><circle cx="190" cy="68" r="1.4" fill="#d4a017"/>' +
      '<path d="M184 74 q4 -4 8 0 q4 -4 6 0" fill="none" stroke="#c0392b" stroke-width="1.5"/>' +
      '<g opacity=".85"><circle cx="70" cy="80" r="3.5" fill="#5b3a29"/><circle cx="82" cy="82" r="3.5" fill="#5b3a29"/><circle cx="118" cy="80" r="3.5" fill="#5b3a29"/><circle cx="130" cy="82" r="3.5" fill="#5b3a29"/></g>' +
      '<path d="M60 140 h80" stroke="#f6d27a" stroke-width="2" opacity=".5"/>', 'An old inn with dark wooden beams, warm yellow windows with people inside, and a hanging sign with a bell and a red dragon.');
  };
  A.bnb = function () {
    return S(200, 160, sky(200, 160) +
      '<rect x="0" y="140" width="200" height="20" fill="#9a958a"/>' +
      bricks(10, 18, 40, 122, '#b7a58c', '#9c8b72') + bricks(150, 18, 40, 122, '#b7a58c', '#9c8b72') +
      '<rect x="50" y="18" width="100" height="122" fill="#f2ecdf" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="46" y="12" width="108" height="8" fill="#d8cfbd" stroke="#3b3326" stroke-width="2"/>' +
      win(62, 30, 30, 26, false) + win(108, 30, 30, 26, false) +
      '<rect x="62" y="72" width="76" height="36" fill="#f6dc95" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="72" y="78" width="56" height="14" fill="#fffaf0" stroke="#3b3326" stroke-width="1.2"/>' +
      '<text x="100" y="84" font-size="5.6" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">BED AND</text>' +
      '<text x="100" y="90.5" font-size="5.6" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">BREAKFAST</text>' +
      '<rect x="78" y="96" width="12" height="9" fill="#2f6aa8"/><circle cx="84" cy="94" r="5" fill="#f2c230"/><circle cx="80" cy="92" r="3" fill="#f2c230"/><circle cx="88" cy="92" r="3" fill="#f2c230"/>' +
      '<rect x="88" y="112" width="24" height="28" fill="#2d4a6b" stroke="#3b3326" stroke-width="2"/><circle cx="106" cy="126" r="1.6" fill="#d4a017"/>' +
      '<rect x="84" y="138" width="32" height="4" fill="#cfc7b7" stroke="#3b3326" stroke-width="1"/>' +
      '<path d="M96 118 h8" stroke="#d4a017" stroke-width="2"/>', 'A tall narrow house in a row of houses. In the lit front window, a small sign and a vase of yellow flowers.');
  };
  A.boarding = function () {
    return S(200, 160, sky(200, 160) +
      '<rect x="0" y="140" width="200" height="20" fill="#8f8a80"/>' +
      bricks(30, 10, 140, 130, '#a89a86', '#8f826e') +
      '<rect x="30" y="10" width="140" height="130" fill="none" stroke="#3b3326" stroke-width="2.5"/>' +
      win(44, 22, 22, 22, false) + win(89, 22, 22, 22, false) + win(134, 22, 22, 22, false) +
      win(44, 58, 22, 22, false) + win(89, 58, 22, 22, true) + win(134, 58, 22, 22, false) +
      win(44, 94, 22, 22, true) + win(134, 94, 22, 22, false) +
      '<rect x="88" y="104" width="24" height="36" fill="#3b4a3a" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="78" y="88" width="44" height="12" fill="#fffaf0" stroke="#3b3326" stroke-width="1.5"/>' +
      '<text x="100" y="96.5" font-size="6.5" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">ROOMS</text>' +
      '<g transform="translate(100 70)"><circle r="6" fill="#e2b48c" stroke="#3b3326" stroke-width="1.2" cx="0" cy="-1"/><path d="M-5 -5 q5 -5 10 0" fill="#7a7a7a"/></g>' +
      '<path d="M84 138 h32" stroke="#6d6a62" stroke-width="3"/>', 'A tall plain brick building with many small windows, a small sign over the door and one face looking out of a window.');
  };

  /* ---------- 3 · same place, two names (scene) ---------- */
  A.samehouse = function () {
    return S(640, 260, '<rect width="640" height="260" fill="#eef3f7"/>' +
      '<rect x="0" y="232" width="640" height="28" fill="#c9c2b4"/>' +
      '<g transform="translate(220 40) scale(1.25)">' +
      bricks(0, 16, 30, 140, '#b7a58c', '#9c8b72') + bricks(130, 16, 30, 140, '#b7a58c', '#9c8b72') +
      '<rect x="30" y="16" width="100" height="140" fill="#f2ecdf" stroke="#3b3326" stroke-width="2.5"/>' +
      win(42, 30, 30, 26, false) + win(88, 30, 30, 26, false) +
      '<rect x="40" y="72" width="80" height="40" fill="#f6dc95" stroke="#3b3326" stroke-width="2.5"/>' +
      '<rect x="50" y="78" width="60" height="16" fill="#fffaf0" stroke="#3b3326" stroke-width="1.2"/>' +
      '<text x="80" y="85" font-size="6" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">BED AND</text>' +
      '<text x="80" y="92" font-size="6" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">BREAKFAST</text>' +
      '<rect x="56" y="100" width="10" height="9" fill="#2f6aa8"/><circle cx="61" cy="98" r="5" fill="#f2c230"/>' +
      '<rect x="68" y="122" width="24" height="34" fill="#2d4a6b" stroke="#3b3326" stroke-width="2"/></g>' +
      /* left: bed + breakfast merging into the house */
      '<g transform="translate(20 70)"><rect x="0" y="30" width="70" height="26" rx="4" fill="#e9eef7" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="0" y="22" width="22" height="16" rx="4" fill="#fff" stroke="#3b3326" stroke-width="2"/><rect x="-4" y="14" width="6" height="50" fill="#7a5134"/><rect x="68" y="26" width="6" height="38" fill="#7a5134"/>' +
      '<rect x="22" y="28" width="48" height="14" fill="#8fb3d9" stroke="#3b3326" stroke-width="1.5"/></g>' +
      '<text x="58" y="160" font-size="28" font-family="Nunito,sans-serif" font-weight="900" fill="#3b3326" text-anchor="middle">+</text>' +
      '<g transform="translate(30 172)"><ellipse cx="30" cy="22" rx="32" ry="10" fill="#fff" stroke="#3b3326" stroke-width="2"/>' +
      '<ellipse cx="22" cy="18" rx="8" ry="6" fill="#fff6d8" stroke="#3b3326" stroke-width="1.5"/><circle cx="22" cy="18" r="3.5" fill="#f2b230"/>' +
      '<rect x="36" y="12" width="16" height="8" rx="3" fill="#b5652c" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="60" y="0" width="14" height="20" rx="2" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><rect x="62" y="6" width="10" height="12" fill="#7a4520"/></g>' +
      '<path d="M120 150 C 160 150, 180 160, 214 160" fill="none" stroke="#2f7d4f" stroke-width="5" stroke-linecap="round"/><path d="M204 150 L218 160 L204 170" fill="none" stroke="#2f7d4f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      /* label arrows */
      '<g font-family="Nunito,sans-serif" font-weight="900" font-size="20">' +
      '<rect x="436" y="40" width="190" height="40" rx="10" fill="#fff" stroke="#3b3326" stroke-width="2.5"/><text x="531" y="66" text-anchor="middle" fill="#1b4332">bed and breakfast</text>' +
      '<rect x="436" y="170" width="190" height="40" rx="10" fill="#fff" stroke="#3b3326" stroke-width="2.5"/><text x="531" y="196" text-anchor="middle" fill="#1b4332">boarding-house</text></g>' +
      '<path d="M436 62 C 400 70, 390 120, 380 140" fill="none" stroke="#2f6fbd" stroke-width="5" stroke-linecap="round"/><path d="M372 128 L380 142 L392 132" fill="none" stroke="#2f6fbd" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M436 190 C 400 186, 392 170, 382 156" fill="none" stroke="#2f6fbd" stroke-width="5" stroke-linecap="round"/><path d="M374 166 L382 154 L394 162" fill="none" stroke="#2f6fbd" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
      'A bed and a breakfast plate join into one house with a sign in the window. Two labels, bed and breakfast and boarding-house, both point at the same house.');
  };

  /* ---------- 4 · board + ing + house ---------- */
  A.mealhouse = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#f3e6cf"/>' +
      '<rect x="0" y="0" width="200" height="70" fill="#d9c7a6"/><rect x="120" y="10" width="50" height="40" fill="#a9c6dc" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="14" y="20" width="70" height="44" fill="#e9eef7" stroke="#3b3326" stroke-width="2"/><rect x="14" y="14" width="18" height="14" rx="3" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><rect x="30" y="28" width="54" height="16" fill="#8fb3d9" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="20" y="96" width="160" height="12" fill="#8a5a34" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M36 108 v42 M164 108 v42" stroke="#6b4426" stroke-width="7"/>' +
      '<ellipse cx="62" cy="92" rx="18" ry="5" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><path d="M50 90 q12 -12 24 0" fill="#c0703a"/>' +
      '<ellipse cx="108" cy="92" rx="18" ry="5" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><circle cx="102" cy="89" r="4" fill="#f2b230"/><rect x="108" y="86" width="12" height="5" rx="2" fill="#b5652c"/>' +
      '<rect x="140" y="78" width="12" height="16" rx="2" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><path d="M152 82 q6 2 0 8" fill="none" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M146 74 q2 -6 0 -10" fill="none" stroke="#bfbfbf" stroke-width="2"/>', 'A room with a bed, and a table with plates of food and a hot drink.');
  };

  /* ---------- 5 · the "board" family ---------- */
  A.plank = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#efe1c4"/>' +
      '<rect x="0" y="0" width="200" height="40" fill="#cdb48a"/><path d="M0 40 h200" stroke="#a8906a" stroke-width="3"/>' +
      '<rect x="12" y="74" width="176" height="18" fill="#a06a3c" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M18 80 q30 4 60 0 q30 -4 60 2 q20 2 44 -2" fill="none" stroke="#7a4e2a" stroke-width="1.5"/>' +
      '<path d="M24 84 q20 3 40 0 M110 86 q30 2 60 -1" fill="none" stroke="#7a4e2a" stroke-width="1"/>' +
      '<path d="M28 92 L22 150 M172 92 L178 150" stroke="#6b4426" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M50 92 L46 150 M150 92 L154 150" stroke="#6b4426" stroke-width="6" stroke-linecap="round"/>' +
      '<ellipse cx="44" cy="70" rx="18" ry="6" fill="#d9c9a6" stroke="#3b3326" stroke-width="1.5"/><path d="M30 68 q14 -10 28 0" fill="#c4813e"/>' +
      '<ellipse cx="94" cy="70" rx="20" ry="7" fill="#e8dcc0" stroke="#3b3326" stroke-width="1.5"/><path d="M80 67 h28" stroke="#6b8f4e" stroke-width="4"/><path d="M86 64 h16" stroke="#b5652c" stroke-width="4"/>' +
      '<path d="M128 74 q-2 -18 6 -22 q10 -2 10 10 q0 8 -4 12" fill="#c49a5a" stroke="#3b3326" stroke-width="1.5"/>' +
      '<rect x="156" y="56" width="14" height="18" rx="3" fill="#8a7a62" stroke="#3b3326" stroke-width="1.5"/><path d="M170 60 q6 3 0 8" fill="none" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M162 52 q3 -6 0 -10" fill="none" stroke="#d0d0d0" stroke-width="2"/>', 'An old long wooden plank used as a table, with bowls of food, bread and a cup on it.');
  };
  A.tray = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#e6eef6"/>' +
      '<rect x="0" y="96" width="200" height="64" fill="#c9d6e6"/><path d="M0 96 q100 -20 200 0" fill="#dbe5f1" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="24" y="30" width="30" height="40" rx="8" fill="#fff" stroke="#3b3326" stroke-width="2"/>' +
      '<circle cx="50" cy="62" r="11" fill="#e2b48c" stroke="#3b3326" stroke-width="1.5"/><path d="M40 58 q10 -14 20 0" fill="#3b2a1e"/>' +
      '<rect x="66" y="72" width="104" height="12" rx="3" fill="#a06a3c" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M76 84 v18 M160 84 v18" stroke="#7a4e2a" stroke-width="5"/>' +
      '<ellipse cx="96" cy="70" rx="14" ry="4" fill="#fff" stroke="#3b3326" stroke-width="1.5"/><circle cx="92" cy="68" r="3.5" fill="#f2b230"/>' +
      '<rect x="120" y="58" width="10" height="13" rx="2" fill="#fff" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M140 70 l8 -10 l8 10 Z" fill="#c4813e" stroke="#3b3326" stroke-width="1.2"/>', 'A person in bed with a small wooden tray of breakfast over their legs.');
  };
  A.plane = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#cfe3f0"/>' +
      '<rect x="0" y="128" width="200" height="32" fill="#7d7f7a"/><path d="M0 140 h200" stroke="#f2f2f2" stroke-width="2" stroke-dasharray="10 8"/>' +
      '<path d="M10 70 Q20 52 70 52 L190 52 Q200 52 200 64 L200 82 Q200 92 186 92 L30 92 Q12 92 10 70 Z" fill="#f4f6f8" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M120 92 L150 118 L166 118 L148 92 Z" fill="#c9d0d8" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="40" y="62" width="10" height="8" rx="2" fill="#5a7fa8"/><rect x="58" y="62" width="10" height="8" rx="2" fill="#5a7fa8"/><rect x="76" y="62" width="10" height="8" rx="2" fill="#5a7fa8"/><rect x="94" y="62" width="10" height="8" rx="2" fill="#5a7fa8"/>' +
      '<rect x="112" y="58" width="14" height="26" rx="2" fill="#e8ecf0" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M112 84 L84 128 L100 128 L126 84" fill="#a9b2bc" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M88 122 h14 M92 114 h14 M96 106 h14 M100 98 h14" stroke="#3b3326" stroke-width="1.5"/>' +
      person(95, 120, '#d9567f', '#c88c5e', .7) + person(78, 146, '#2f6fbd', '#8d5a3b', .75) +
      '<rect x="62" y="134" width="10" height="10" rx="1.5" fill="#7a4a2a" stroke="#3b3326" stroke-width="1"/>', 'People with bags walking up the stairs into an airplane.');
  };
  A.boardup = function () {
    return S(200, 160, bricks(0, 0, 200, 160, '#b9a58a', '#9c8b72') +
      '<rect x="46" y="22" width="108" height="122" fill="#3b3326"/>' +
      '<rect x="52" y="28" width="96" height="116" fill="#5d4a36"/>' +
      '<g stroke="#3b3326" stroke-width="2">' +
      '<rect x="36" y="40" width="128" height="18" fill="#c49a5a" transform="rotate(-8 100 49)"/>' +
      '<rect x="36" y="78" width="128" height="18" fill="#b8894a" transform="rotate(6 100 87)"/>' +
      '<rect x="36" y="114" width="128" height="18" fill="#c49a5a" transform="rotate(-4 100 123)"/></g>' +
      '<g fill="#6d6d6d"><circle cx="46" cy="55" r="2.5"/><circle cx="154" cy="40" r="2.5"/><circle cx="46" cy="80" r="2.5"/><circle cx="154" cy="94" r="2.5"/><circle cx="46" cy="126" r="2.5"/><circle cx="154" cy="119" r="2.5"/></g>' +
      '<g transform="translate(168 132) rotate(-30)"><rect x="-4" y="-2" width="8" height="26" fill="#7a4e2a"/><rect x="-12" y="-10" width="24" height="9" rx="2" fill="#5e5e5e"/></g>', 'A doorway covered with wooden planks nailed across it, and a hammer.');
  };
  A.whiteboard = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#efe9dc"/>' +
      '<rect x="20" y="16" width="160" height="96" fill="#fbfdff" stroke="#6d6d6d" stroke-width="5"/>' +
      '<path d="M34 40 q10 -10 20 0 t20 0" fill="none" stroke="#2f6fbd" stroke-width="3"/>' +
      '<path d="M34 62 h80 M34 78 h56" stroke="#2f7d4f" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="140" y="56" font-size="22" font-family="Nunito,sans-serif" font-weight="900" fill="#c0392b">A+</text>' +
      '<rect x="40" y="112" width="120" height="6" fill="#8a8a8a"/><rect x="60" y="106" width="16" height="6" rx="1.5" fill="#2f6fbd"/><rect x="82" y="106" width="16" height="6" rx="1.5" fill="#c0392b"/>' +
      '<g transform="translate(150 150)">' + '<circle cx="0" cy="-30" r="8" fill="#8d5a3b" stroke="#3b3326" stroke-width="1.5"/><path d="M-10 -20 Q0 -24 10 -20 L12 4 L-12 4 Z" fill="#864D9E" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M-10 -16 L-30 -40" stroke="#864D9E" stroke-width="5" stroke-linecap="round"/></g>' +
      '<rect x="14" y="128" width="40" height="28" rx="4" fill="#e85d3c" stroke="#3b3326" stroke-width="2"/><rect x="18" y="132" width="32" height="20" fill="#f6d27a"/><circle cx="26" cy="140" r="3" fill="#2f6fbd"/><circle cx="40" cy="146" r="3" fill="#2f7d4f"/>', 'A whiteboard on a classroom wall with writing on it, a student pointing at it, and a board game on a table.');
  };
  A.bored = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#e3e6ea"/>' +
      '<rect x="0" y="118" width="200" height="42" fill="#b8b2a8"/>' +
      '<rect x="40" y="96" width="120" height="10" fill="#8a5a34" stroke="#3b3326" stroke-width="2"/>' +
      '<circle cx="100" cy="66" r="28" fill="#e2b48c" stroke="#3b3326" stroke-width="2.5"/>' +
      '<path d="M72 58 q28 -40 56 0" fill="#3b2a1e"/>' +
      '<path d="M86 66 h10 M104 66 h10" stroke="#3b3326" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M84 60 q6 -3 12 0 M104 60 q6 -3 12 0" fill="none" stroke="#3b3326" stroke-width="1.5"/>' +
      '<ellipse cx="100" cy="82" rx="7" ry="5" fill="#7a3a2a" stroke="#3b3326" stroke-width="1.5"/>' +
      '<path d="M66 96 q-8 -16 6 -26 M134 96 q8 -16 -6 -26" fill="#e2b48c" stroke="#3b3326" stroke-width="2"/>' +
      '<g transform="translate(160 26)"><circle r="14" fill="#fff" stroke="#3b3326" stroke-width="2"/><path d="M0 0 v-9 M0 0 h7" stroke="#3b3326" stroke-width="2"/></g>' +
      '<text x="28" y="40" font-size="14" font-family="Nunito,sans-serif" font-weight="900" fill="#8a8f96">z z</text>', 'A teenager with a long, sleepy face, chin on hands, yawning. A clock on the wall.');
  };

  /* ---------- 6 · the sentence in pieces ---------- */
  A.hands = function () {
    function hand(x, flip) {
      return '<g transform="translate(' + x + ' 160) scale(' + (flip ? -1 : 1) + ' 1)">' +
        '<path d="M-30 0 L-30 -46 Q-30 -60 -16 -60 L22 -60 Q36 -60 36 -46 L36 0 Z" fill="#e2b48c" stroke="#3b3326" stroke-width="2.5"/>' +
        '<path d="M36 -40 q18 -4 22 10 q2 10 -12 12 L36 -16" fill="#e2b48c" stroke="#3b3326" stroke-width="2.5"/>' +
        '<path d="M-20 -60 v-8 M-6 -60 v-10 M8 -60 v-10 M22 -60 v-8" stroke="#3b3326" stroke-width="2"/></g>';
    }
    return S(200, 160, '<rect width="200" height="160" fill="#f1ede4"/>' +
      hand(52, false) + hand(148, true) +
      '<g transform="translate(26 30) scale(.32)">' + innerBnb() + '</g>' +
      '<g transform="translate(122 30) scale(.32)">' + innerPub() + '</g>' +
      '<text x="100" y="64" font-size="22" font-family="Nunito,sans-serif" font-weight="900" fill="#5c6b62" text-anchor="middle">?</text>', 'Two open hands. One holds a little house with a sign in the window, the other holds a little inn with a hanging sign.');
  };
  function innerBnb() {
    return '<rect x="20" y="20" width="120" height="120" fill="#f2ecdf" stroke="#3b3326" stroke-width="5"/>' + win(40, 36, 30, 26, false) + win(90, 36, 30, 26, false) +
      '<rect x="36" y="74" width="88" height="34" fill="#f6dc95" stroke="#3b3326" stroke-width="4"/><rect x="50" y="80" width="60" height="16" fill="#fff" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="68" y="110" width="24" height="30" fill="#2d4a6b" stroke="#3b3326" stroke-width="3"/>';
  }
  function innerPub() {
    return '<rect x="20" y="40" width="120" height="100" fill="#efe4cc" stroke="#3b3326" stroke-width="5"/><path d="M20 40 L80 10 L140 40 Z" fill="#6e4b35" stroke="#3b3326" stroke-width="5"/>' +
      '<path d="M20 64 h120" stroke="#4a3426" stroke-width="8"/>' + win(36, 76, 30, 24, true) + win(94, 76, 30, 24, true) +
      '<rect x="68" y="108" width="24" height="32" fill="#4a3426"/><rect x="140" y="50" width="22" height="30" fill="#24324d" stroke="#d4a017" stroke-width="3"/>';
  }
  function face(cx, warm) {
    return '<circle cx="' + cx + '" cy="78" r="38" fill="' + (warm ? '#f2c79b' : '#d8c1a6') + '" stroke="#3b3326" stroke-width="2.5"/>' +
      (warm ? '<path d="M' + (cx - 16) + ' 70 q5 -6 10 0 M' + (cx + 6) + ' 70 q5 -6 10 0" fill="none" stroke="#3b3326" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M' + (cx - 18) + ' 88 q18 20 36 0" fill="#fff" stroke="#3b3326" stroke-width="2.5"/>' +
        '<circle cx="' + (cx - 24) + '" cy="84" r="6" fill="#f29c9c" opacity=".6"/><circle cx="' + (cx + 24) + '" cy="84" r="6" fill="#f29c9c" opacity=".6"/>' +
        '<path d="M' + (cx - 46) + ' 120 q10 -14 22 -6 M' + (cx + 46) + ' 120 q-10 -14 -22 -6" fill="none" stroke="#3b3326" stroke-width="3" stroke-linecap="round"/>'
      : '<path d="M' + (cx - 20) + ' 62 l12 6 M' + (cx + 20) + ' 62 l-12 6" stroke="#3b3326" stroke-width="3.5" stroke-linecap="round"/>' +
        '<circle cx="' + (cx - 10) + '" cy="74" r="3" fill="#3b3326"/><circle cx="' + (cx + 10) + '" cy="74" r="3" fill="#3b3326"/>' +
        '<path d="M' + (cx - 14) + ' 98 q14 -12 28 0" fill="none" stroke="#3b3326" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M' + (cx - 30) + ' 46 l-6 -8 M' + (cx + 30) + ' 46 l6 -8" stroke="#3b3326" stroke-width="2"/>');
  }
  A.congenialWarm = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#fdf1dc"/><circle cx="100" cy="78" r="60" fill="#f7d79a" opacity=".5"/>' + face(100, true), 'A warm, smiling face with open arms.');
  };
  A.congenialCold = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#e3e6ea"/>' + face(100, false), 'A frowning, unfriendly face.');
  };
  A.congenialPair = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#f6f1e6"/><rect x="100" y="0" width="100" height="160" fill="#e3e6ea"/><line x1="100" y1="0" x2="100" y2="160" stroke="#3b3326" stroke-width="2"/>' +
      '<g transform="translate(-25 0) scale(.75)" transform-origin="0 0">' + face(100, true) + '</g>' +
      '<g transform="translate(75 0) scale(.75)">' + face(100, false) + '</g>' +
      '<path d="M128 22 l44 44 M172 22 l-44 44" stroke="#c0392b" stroke-width="7" stroke-linecap="round" opacity=".9"/>', 'Left: a warm smiling face. Right: a frowning face with a red X over it.');
  };

  /* ---------- 7 · why? (two scenes) ---------- */
  A.pubInside = function () {
    return S(320, 220, '<rect width="320" height="220" fill="#5a3a24"/>' +
      '<rect x="0" y="160" width="320" height="60" fill="#3d281a"/>' +
      '<path d="M0 30 h320 M0 0 v220" stroke="#3a2416" stroke-width="10"/>' +
      '<rect x="18" y="70" width="70" height="90" fill="#7a6a5a" stroke="#2e1f14" stroke-width="3"/><rect x="28" y="110" width="50" height="50" fill="#2a1a10"/>' +
      '<path d="M40 160 q12 -40 26 0 Z" fill="#f2a33a"/><path d="M46 160 q7 -24 14 0 Z" fill="#fde28a"/>' +
      '<ellipse cx="53" cy="150" rx="60" ry="30" fill="#f2a33a" opacity=".18"/>' +
      '<g transform="translate(250 70)"><circle r="26" fill="#2e2a24" stroke="#d4a017" stroke-width="3"/><circle r="18" fill="#c0392b"/><circle r="10" fill="#2f7d4f"/><circle r="3" fill="#f6d27a"/>' +
      '<path d="M-40 -30 l34 28" stroke="#ddd" stroke-width="2"/><path d="M-44 -34 l6 2 l-2 6 Z" fill="#c0392b"/></g>' +
      '<rect x="110" y="120" width="120" height="10" fill="#8a5a34" stroke="#2e1f14" stroke-width="2"/><path d="M124 130 v30 M216 130 v30" stroke="#6b4426" stroke-width="6"/>' +
      '<rect x="138" y="104" width="12" height="16" rx="2" fill="#f2c230" stroke="#2e1f14" stroke-width="1.5"/><rect x="190" y="104" width="12" height="16" rx="2" fill="#f2c230" stroke="#2e1f14" stroke-width="1.5"/>' +
      person(120, 160, '#2f6fbd', '#e2b48c', 1.3) + person(170, 160, '#a33a35', '#8d5a3b', 1.25) + person(222, 160, '#2f7d4f', '#c88c5e', 1.3) +
      '<path d="M128 104 q8 -10 16 0" fill="none" stroke="#f6d27a" stroke-width="2"/>' +
      '<g fill="#f6d27a" font-family="Nunito,sans-serif" font-weight="900" font-size="14"><text x="140" y="76">ha ha!</text><text x="196" y="66">♪</text></g>' +
      '<rect x="0" y="0" width="320" height="220" fill="#f6b04a" opacity=".08"/>', 'Inside a busy, warm room: a fire, a dartboard, and three people laughing and talking at a table with drinks.');
  };
  A.boardRoom = function () {
    return S(320, 220, '<rect width="320" height="220" fill="#d7d4cc"/>' +
      '<rect x="0" y="170" width="320" height="50" fill="#9c9488"/>' +
      '<rect x="220" y="30" width="64" height="70" fill="#9fb4c4" stroke="#3b3326" stroke-width="3"/><line x1="252" y1="30" x2="252" y2="100" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="24" y="120" width="130" height="40" fill="#e3e0d8" stroke="#3b3326" stroke-width="2.5"/><rect x="24" y="108" width="30" height="22" rx="4" fill="#fff" stroke="#3b3326" stroke-width="2"/>' +
      '<rect x="18" y="96" width="8" height="74" fill="#5e5e5e"/><rect x="152" y="112" width="8" height="58" fill="#5e5e5e"/>' +
      '<rect x="70" y="28" width="96" height="44" fill="#fffaf0" stroke="#3b3326" stroke-width="2"/>' +
      '<text x="118" y="44" font-size="9" font-family="Georgia,serif" font-weight="700" fill="#3b3326" text-anchor="middle">HOUSE RULES</text>' +
      '<path d="M80 52 h76 M80 60 h60 M80 68 h70" stroke="#6d6d6d" stroke-width="2"/>' +
      '<g transform="translate(250 170)"><circle cx="0" cy="-74" r="13" fill="#e2c8a8" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M-12 -80 q12 -14 24 0" fill="#8a8a8a"/><path d="M-6 -72 h4 M2 -72 h4" stroke="#3b3326" stroke-width="2"/><path d="M-5 -64 h10" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M-18 -60 Q0 -66 18 -60 L24 0 L-24 0 Z" fill="#4a4a5a" stroke="#3b3326" stroke-width="2"/>' +
      '<path d="M-18 -52 L-44 -66" stroke="#4a4a5a" stroke-width="7" stroke-linecap="round"/><path d="M-46 -68 l-6 -4" stroke="#3b3326" stroke-width="3"/>' +
      '<g transform="translate(18 -30)"><circle r="6" fill="none" stroke="#d4a017" stroke-width="2"/><path d="M4 4 l8 8 M8 10 l3 -3" stroke="#d4a017" stroke-width="2"/></g></g>' +
      '<rect x="0" y="0" width="320" height="220" fill="#3b4a5c" opacity=".08"/>', 'A plain, quiet room with one narrow bed, a list of house rules on the wall, and a strict older woman with keys, pointing a finger.');
  };

  /* ---------- 8 · where would YOU stay? + done ---------- */
  A.lion = function () {
    return '<svg viewBox="0 0 40 40" width="34" height="34" aria-label="lion"><circle cx="20" cy="20" r="16" fill="#d98b2b"/><circle cx="20" cy="21" r="10" fill="#f2c27a"/><circle cx="16" cy="19" r="1.6" fill="#3b3326"/><circle cx="24" cy="19" r="1.6" fill="#3b3326"/><path d="M18 24 q2 2 4 0" fill="none" stroke="#3b3326" stroke-width="1.5"/></svg>';
  };
  A.suitcase = function () {
    return S(200, 160, '<rect width="200" height="160" fill="#e8eef3"/><rect x="0" y="128" width="200" height="32" fill="#a8a29a"/>' +
      '<rect x="56" y="54" width="88" height="74" rx="8" fill="#8a4b2a" stroke="#3b3326" stroke-width="3"/>' +
      '<path d="M84 54 v-14 h32 v14" fill="none" stroke="#3b3326" stroke-width="5"/>' +
      '<path d="M56 78 h88 M56 104 h88" stroke="#5e331d" stroke-width="3"/>' +
      '<rect x="64" y="62" width="22" height="14" rx="2" fill="#f2c230" stroke="#3b3326" stroke-width="1.5"/>' +
      '<text x="75" y="72" font-size="7" font-family="Nunito,sans-serif" font-weight="900" fill="#3b3326" text-anchor="middle">BATH</text>' +
      '<circle cx="128" cy="68" r="7" fill="#2f6fbd" stroke="#3b3326" stroke-width="1.5"/>', 'A brown suitcase with a yellow tag.');
  };
})();
