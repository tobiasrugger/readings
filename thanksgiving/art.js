/* readings/thanksgiving/art.js — T-498 (Nov 20 2026). Drawn pictures for the ELD 101 Thanksgiving reading.
   window.TG_ART: scenes 800×420 (table, mark, lee, andre) and word pictures 200×160 (one per word in content.js).
   Flat layered SVG, two or three tones per surface, no emoji, no photos. Includes the hidden Galileo lion (id lionB). */
(function () {
  function sh(hex, a) { var n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(c + a))); }
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1); }
  function svg(w, h, inner, label) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (label || 'picture') + '">' + inner + '</svg>'; }
  function pic(bg, inner, label) { return svg(200, 160, '<rect width="200" height="160" fill="' + bg + '"/>' + inner, label); }

  /* a seated or standing person, head centre (x,y), scale s. o: skin, shirt, hair, style ('short','long','bun','grey','bald','cap','baby'), arms ('down','up','eat','hold') */
  function person(x, y, s, o) {
    var sk = o.skin || '#c98d63', shc = o.shirt || '#3d6fa8', hc = o.hair || '#2b211b', d = sh(shc, -35), out = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
    if (o.style === 'baby') {
      out += '<ellipse cx="0" cy="40" rx="26" ry="30" fill="' + (o.shirt || '#f5c6d6') + '" stroke="' + sh(o.shirt || '#f5c6d6', -40) + '" stroke-width="2"/>' +
        '<circle cx="0" cy="0" r="20" fill="' + sk + '"/><path d="M-14 -10 Q0 -26 14 -10" fill="none" stroke="' + hc + '" stroke-width="4"/>' +
        '<circle cx="-7" cy="0" r="2.4" fill="#222"/><circle cx="7" cy="0" r="2.4" fill="#222"/><path d="M-5 9 Q0 13 5 9" stroke="#8a3d2a" stroke-width="2" fill="none"/>' +
        '<circle cx="-12" cy="7" r="4" fill="#f29b9b" opacity=".6"/><circle cx="12" cy="7" r="4" fill="#f29b9b" opacity=".6"/></g>';
      return out;
    }
    /* back hair */
    if (o.style === 'long') out += '<path d="M-26 -6 Q-30 40 -18 52 L18 52 Q30 40 26 -6 Z" fill="' + hc + '"/>';
    if (o.style === 'hijab') out += '<path d="M-32 -4 Q-34 50 -20 64 L20 64 Q34 50 32 -4 Q30 -36 0 -38 Q-30 -36 -32 -4Z" fill="' + (o.scarf || '#2f8a7e') + '"/>';
    /* body */
    out += '<path d="M-34 96 Q-34 40 0 36 Q34 40 34 96 Z" fill="' + shc + '" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M-10 38 L0 50 L10 38" fill="none" stroke="' + d + '" stroke-width="2"/>' +
      '<rect x="-7" y="22" width="14" height="16" fill="' + sh(sk, -18) + '"/>';
    /* arms */
    var ar = o.arms || 'down';
    if (ar === 'up') out += '<path d="M-30 50 Q-50 20 -44 -6" stroke="' + shc + '" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="-44" cy="-10" r="7" fill="' + sk + '"/>' +
      '<path d="M30 50 Q50 20 44 -6" stroke="' + shc + '" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="44" cy="-10" r="7" fill="' + sk + '"/>';
    else if (ar === 'eat') out += '<path d="M-30 52 Q-34 74 -14 80" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="-12" cy="80" r="6.5" fill="' + sk + '"/>' +
      '<path d="M30 52 Q40 70 20 70 Q12 60 14 34" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="14" cy="32" r="6.5" fill="' + sk + '"/><path d="M14 30 L22 6" stroke="#9aa3ab" stroke-width="3"/>';
    else if (ar === 'hold') out += '<path d="M-30 52 Q-30 76 -6 78" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M30 52 Q30 76 6 78" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-4" cy="78" r="6.5" fill="' + sk + '"/><circle cx="4" cy="78" r="6.5" fill="' + sk + '"/>';
    else out += '<path d="M-30 50 Q-38 72 -32 92" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M30 50 Q38 72 32 92" stroke="' + shc + '" stroke-width="13" fill="none" stroke-linecap="round"/>';
    /* head */
    out += '<ellipse cx="0" cy="0" rx="22" ry="25" fill="' + sk + '"/><ellipse cx="-22" cy="2" rx="4" ry="6" fill="' + sh(sk, -12) + '"/><ellipse cx="22" cy="2" rx="4" ry="6" fill="' + sh(sk, -12) + '"/>';
    if (o.style !== 'hijab') {
      if (o.style === 'bald') out += '<path d="M-22 -2 Q-24 -12 -18 -14 M22 -2 Q24 -12 18 -14" stroke="' + (o.hair || '#cfcfcf') + '" stroke-width="5" fill="none"/>';
      else if (o.style === 'bun') out += '<path d="M-22 -2 Q-24 -28 0 -28 Q24 -28 22 -2 Q14 -18 0 -18 Q-14 -18 -22 -2Z" fill="' + hc + '"/><circle cx="0" cy="-32" r="10" fill="' + hc + '"/>';
      else if (o.style === 'cap') out += '<path d="M-23 -6 Q-22 -30 0 -30 Q22 -30 23 -6 Z" fill="' + (o.cap || '#c9412e') + '"/><path d="M-4 -8 L34 -6" stroke="' + sh(o.cap || '#c9412e', -30) + '" stroke-width="6" stroke-linecap="round"/>';
      else out += '<path d="M-23 0 Q-26 -28 0 -28 Q26 -28 23 0 Q18 -16 4 -16 Q-12 -18 -23 0Z" fill="' + hc + '"/>';
    }
    if (o.glasses) out += '<circle cx="-8" cy="-1" r="7" fill="none" stroke="#3b3b3b" stroke-width="2"/><circle cx="8" cy="-1" r="7" fill="none" stroke="#3b3b3b" stroke-width="2"/><path d="M-1 -1 L1 -1" stroke="#3b3b3b" stroke-width="2"/>';
    out += '<circle cx="-8" cy="-1" r="2.6" fill="#222"/><circle cx="8" cy="-1" r="2.6" fill="#222"/>' +
      '<path d="M-7 11 Q0 17 7 11" stroke="#8a3d2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    if (o.style === 'grey' || o.wrinkles) out += '<path d="M-14 -10 Q-8 -12 -3 -10 M3 -10 Q8 -12 14 -10" stroke="' + sh(sk, -40) + '" stroke-width="1.4" fill="none"/>';
    out += '</g>';
    return out;
  }
  var PPL = {
    dad: { skin: '#c98d63', shirt: '#3d6fa8', hair: '#2b211b' },
    mom: { skin: '#e0ac85', shirt: '#b5476b', hair: '#5a3a22', style: 'long' },
    gma: { skin: '#e8bf9a', shirt: '#7d5ba6', hair: '#d9d9d9', style: 'bun', glasses: true, wrinkles: true },
    gpa: { skin: '#d79e78', shirt: '#4f7a4a', hair: '#cfcfcf', style: 'bald', wrinkles: true },
    mark: { skin: '#e0ac85', shirt: '#e08a2c', hair: '#7a4a24' },
    sis: { skin: '#e0ac85', shirt: '#3a9e8f', hair: '#7a4a24', style: 'long' },
    john: { skin: '#e6c39f', shirt: '#2f5d7c', hair: '#1a1a1a' },
    ellen: { skin: '#e6c39f', shirt: '#c25a3a', hair: '#1a1a1a', style: 'long' },
    andre: { skin: '#8a5a3c', shirt: '#c9412e', hair: '#1a120c' },
    adad: { skin: '#7a4c30', shirt: '#2f6fbd', hair: '#1a120c' },
    amom: { skin: '#8a5a3c', shirt: '#d4a017', hair: '#1a120c', style: 'bun' },
    agma: { skin: '#7a4c30', shirt: '#9b4f96', hair: '#e2e2e2', style: 'bun', glasses: true, wrinkles: true },
    agpa: { skin: '#6e4329', shirt: '#4f7a4a', hair: '#d0d0d0', style: 'bald', wrinkles: true }
  };
  function P(x, y, s, who, extra) { var o = {}, b = PPL[who], k; for (k in b) o[k] = b[k]; for (k in (extra || {})) o[k] = extra[k]; return person(x, y, s, o); }

  /* foods (centre x,y, scale) */
  function turkey(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="34" rx="78" ry="16" fill="#e9eef2" stroke="#9aa6b0" stroke-width="3"/><ellipse cx="0" cy="30" rx="66" ry="11" fill="#f7fafc"/>' +
    '<path d="M-50 22 Q-58 -26 0 -30 Q58 -26 50 22 Z" fill="#b8692c" stroke="#7a3f14" stroke-width="3"/>' +
    '<path d="M-36 6 Q-30 -18 0 -20" stroke="#d99a55" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M40 -4 Q70 -16 74 -30" stroke="#a65c24" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="76" cy="-34" r="8" fill="#fff" stroke="#c9b9a0" stroke-width="2"/>' +
    '<path d="M-40 -4 Q-70 -16 -74 -30" stroke="#a65c24" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="-76" cy="-34" r="8" fill="#fff" stroke="#c9b9a0" stroke-width="2"/>' +
    '<circle cx="-60" cy="28" r="7" fill="#6aa84f"/><circle cx="-48" cy="32" r="6" fill="#e0b13a"/><circle cx="58" cy="28" r="7" fill="#6aa84f"/><circle cx="46" cy="32" r="6" fill="#c9412e"/></g>'; }
  function cran(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-36 -6 L36 -6 Q32 30 0 32 Q-32 30 -36 -6Z" fill="#dfe8ef" stroke="#8a99a6" stroke-width="3"/>' +
    '<ellipse cx="0" cy="-6" rx="36" ry="9" fill="#9c1b2e" stroke="#8a99a6" stroke-width="3"/>' +
    '<path d="M-24 -12 Q-10 -26 4 -14 Q16 -26 26 -10" fill="#c22a42"/><circle cx="-14" cy="-9" r="3" fill="#e46a7a"/><circle cx="10" cy="-8" r="3" fill="#e46a7a"/>' +
    '<circle cx="-6" cy="-14" r="5" fill="#b0213a"/><circle cx="14" cy="-15" r="5" fill="#b0213a"/><path d="M20 -16 L36 -38" stroke="#b9c2c9" stroke-width="5" stroke-linecap="round"/></g>'; }
  function pot(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<path d="M-40 -4 L40 -4 Q36 30 0 32 Q-36 30 -40 -4Z" fill="#f1e2c4" stroke="#a88a5a" stroke-width="3"/>' +
    '<path d="M-36 -4 Q-30 -30 -10 -24 Q0 -38 14 -26 Q34 -30 36 -4Z" fill="#fff6dc" stroke="#d8c08a" stroke-width="2"/>' +
    '<path d="M-6 -22 L8 -22 L6 -14 L-4 -14Z" fill="#f2c94c"/><path d="M-20 -14 Q-12 -20 -4 -14" stroke="#e3cf9c" stroke-width="2" fill="none"/>' +
    '<ellipse cx="-58" cy="20" rx="16" ry="11" fill="#b5895a" stroke="#7d5a34" stroke-width="2"/><circle cx="-62" cy="17" r="1.6" fill="#7d5a34"/><circle cx="-52" cy="23" r="1.6" fill="#7d5a34"/>' +
    '<ellipse cx="58" cy="22" rx="14" ry="10" fill="#c29563" stroke="#7d5a34" stroke-width="2"/><circle cx="55" cy="19" r="1.6" fill="#7d5a34"/></g>'; }
  function pie(x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="14" rx="62" ry="22" fill="#d7dde3" stroke="#8a99a6" stroke-width="3"/>' +
    '<path d="M-54 6 Q0 -22 54 6 L50 16 Q0 34 -50 16Z" fill="#c76f1c"/>' +
    '<ellipse cx="0" cy="6" rx="54" ry="18" fill="#e08a2c" stroke="#a75a12" stroke-width="3"/><ellipse cx="0" cy="6" rx="44" ry="13" fill="#e9963a"/>' +
    '<path d="M0 6 L52 0 L48 14 Z" fill="#f4c27a" stroke="#a75a12" stroke-width="2"/>' +
    '<ellipse cx="-8" cy="2" rx="12" ry="6" fill="#fffdf6"/><ellipse cx="-4" cy="-2" rx="7" ry="4" fill="#fff"/>' +
    '<path d="M-52 8 Q-48 2 -42 8 Q-36 2 -30 8 Q-24 2 -18 8" stroke="#f0b964" stroke-width="3" fill="none"/></g>'; }
  function lion(x, y, s) { return '<g id="lionB" class="lion" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><title>Go Lions!</title>' +
    '<circle cx="0" cy="0" r="20" fill="#b5701f"/><circle cx="0" cy="0" r="13" fill="#e8a53a"/><circle cx="-5" cy="-3" r="2" fill="#222"/><circle cx="5" cy="-3" r="2" fill="#222"/>' +
    '<path d="M-3 4 L3 4 L0 7Z" fill="#5a2f10"/><circle cx="-12" cy="-14" r="5" fill="#e8a53a"/><circle cx="12" cy="-14" r="5" fill="#e8a53a"/></g>'; }

  function room(wall, wall2, floor, floor2) {
    var s = '<rect width="800" height="420" fill="' + wall + '"/>';
    for (var i = 0; i < 20; i++) s += '<rect x="' + (i * 40) + '" y="0" width="20" height="300" fill="' + wall2 + '" opacity=".35"/>';
    s += '<rect y="292" width="800" height="10" fill="' + sh(wall, -40) + '"/><rect y="300" width="800" height="120" fill="' + floor + '"/>';
    for (var j = 0; j < 11; j++) s += '<path d="M' + (j * 80) + ' 300 L' + (j * 80 - 30) + ' 420" stroke="' + floor2 + '" stroke-width="3"/>';
    return s;
  }
  function windowAutumn(x, y) { return '<g transform="translate(' + x + ' ' + y + ')"><rect width="150" height="120" fill="#f6d9a8" stroke="#6b4a2b" stroke-width="6"/>' +
    '<rect x="4" y="70" width="142" height="46" fill="#c7a26a"/><circle cx="40" cy="60" r="28" fill="#d9822b"/><circle cx="62" cy="48" r="22" fill="#c9412e"/><rect x="48" y="70" width="8" height="40" fill="#5a3a22"/>' +
    '<circle cx="118" cy="56" r="24" fill="#e0b13a"/><rect x="114" y="74" width="7" height="36" fill="#5a3a22"/><path d="M75 0 V120 M0 60 H150" stroke="#6b4a2b" stroke-width="5"/></g>'; }
  function clock(x, y, label) { return '<g transform="translate(' + x + ' ' + y + ')"><circle r="30" fill="#fffdf6" stroke="#4a3a2a" stroke-width="5"/>' +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { var a = i * Math.PI / 6; return '<circle cx="' + (Math.sin(a) * 23).toFixed(1) + '" cy="' + (-Math.cos(a) * 23).toFixed(1) + '" r="2" fill="#4a3a2a"/>'; }).join('') +
    '<path d="M0 0 V-20" stroke="#222" stroke-width="3" stroke-linecap="round"/><path d="M0 0 V14" stroke="#222" stroke-width="4" stroke-linecap="round"/>' +
    (label ? '<text x="0" y="52" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="18" fill="#4a3a2a">' + label + '</text>' : '') + '</g>'; }
  function table(y, w) { var x = (800 - w) / 2; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="18" rx="4" fill="#8a5a33"/>' +
    '<path d="M' + (x - 10) + ' ' + (y - 2) + ' H' + (x + w + 10) + ' L' + (x + w - 6) + ' ' + (y + 60) + ' H' + (x + 6) + 'Z" fill="#f4efe1" stroke="#c9b98f" stroke-width="3"/>' +
    '<path d="M' + (x + 30) + ' ' + (y + 60) + ' V' + (y + 120) + ' M' + (x + w - 30) + ' ' + (y + 60) + ' V' + (y + 120) + '" stroke="#6b4325" stroke-width="12"/>' +
    '<path d="M' + (x - 10) + ' ' + (y + 6) + ' H' + (x + w + 10) + '" stroke="#c9412e" stroke-width="5" stroke-dasharray="18 10"/>'; }
  function plate(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="26" ry="8" fill="#fff" stroke="#b8c2ca" stroke-width="2"/><ellipse cx="' + x + '" cy="' + (y - 1) + '" rx="14" ry="4" fill="#e9963a" opacity=".6"/>'; }
  function candle(x, y) { return '<rect x="' + (x - 5) + '" y="' + (y - 34) + '" width="10" height="34" fill="#f3e3b5" stroke="#c9b98f" stroke-width="2"/><path d="M' + x + ' ' + (y - 46) + ' Q' + (x + 6) + ' ' + (y - 38) + ' ' + x + ' ' + (y - 34) + ' Q' + (x - 6) + ' ' + (y - 38) + ' ' + x + ' ' + (y - 46) + 'Z" fill="#f2b33a"/>'; }

  var A = window.TG_ART = {};

  /* ---------- scenes ---------- */
  A.table = function () { return svg(800, 420, room('#f3dfbf', '#e8cda3', '#9b6b43', '#7d5233') + windowAutumn(70, 50) +
    '<path d="M520 40 Q600 70 700 40" stroke="#6b8f3a" stroke-width="5" fill="none"/>' + ['#d9822b', '#c9412e', '#e0b13a', '#c9412e', '#d9822b'].map(function (c, i) { return '<path d="M' + (530 + i * 38) + ' ' + (52 + (i % 2) * 8) + ' l14 28 l-28 0z" fill="' + c + '"/>'; }).join('') +
    '<text x="610" y="128" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="26" fill="#8a3d10">THANK YOU</text>' +
    P(170, 210, 0.95, 'gpa', { arms: 'eat' }) + P(290, 196, 0.95, 'mom', { arms: 'hold' }) + P(510, 196, 0.95, 'dad', { arms: 'eat' }) + P(630, 210, 0.95, 'gma', { arms: 'hold' }) +
    table(282, 600) + candle(250, 284) + candle(550, 284) + turkey(400, 252, 0.95) + cran(300, 278, 0.55) + pot(500, 278, 0.55) + pie(640, 280, 0.5) + plate(160, 286) +
    lion(762, 396, 0.6), 'A family eats Thanksgiving dinner: turkey, cranberry sauce, potatoes and pumpkin pie'); };

  A.mark = function () { return svg(800, 420, room('#e4edf6', '#d2e0ee', '#8f6a48', '#73533a') +
    clock(400, 70, '6:00 p.m.') + '<rect x="560" y="40" width="170" height="110" fill="#fff" stroke="#6b4a2b" stroke-width="6"/><path d="M574 140 L620 86 L650 120 L680 96 L716 140Z" fill="#6aa0c8"/><circle cx="700" cy="70" r="14" fill="#f2c94c"/>' +
    '<text x="110" y="70" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="#2f5d7c">Dining room</text>' +
    P(110, 214, 0.8, 'gpa', { arms: 'eat' }) + P(200, 206, 0.8, 'gma', { arms: 'hold' }) + P(290, 200, 0.85, 'mom', { arms: 'eat' }) +
    P(510, 200, 0.85, 'dad', { arms: 'hold' }) + P(600, 212, 0.72, 'sis', { arms: 'eat' }) + P(690, 216, 0.7, 'mark', { arms: 'eat' }) +
    table(282, 680) + turkey(400, 252, 0.9) + cran(250, 280, 0.5) + pot(530, 280, 0.5) + pie(680, 282, 0.45) + plate(140, 288) + plate(320, 290) +
    lion(36, 396, 0.55), 'Mark’s family eats dinner in the dining room at 6:00 p.m.'); };

  A.lee = function () { return svg(800, 420, room('#eaf3e6', '#d7e8cf', '#a07c55', '#86643f') +
    '<rect x="20" y="70" width="210" height="150" fill="#fff" stroke="#9aa6b0" stroke-width="3"/><rect x="20" y="150" width="210" height="70" fill="#d7dde3" stroke="#9aa6b0" stroke-width="3"/>' +
    '<circle cx="70" cy="140" r="12" fill="#3b3b3b"/><circle cx="120" cy="140" r="12" fill="#3b3b3b"/><rect x="150" y="96" width="60" height="40" fill="#bfe0f2" stroke="#7d8a94" stroke-width="3"/>' +
    '<text x="125" y="250" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="#2f5d3c">Kitchen</text>' +
    clock(700, 70, '7:00 p.m.') +
    P(300, 200, 0.85, 'john', { arms: 'hold' }) + person(300, 266, 0.55, { style: 'baby', skin: '#ecc9a5', shirt: '#f5c6d6', hair: '#1a1a1a' }) +
    P(400, 196, 0.85, 'ellen', { arms: 'eat' }) + P(500, 206, 0.8, 'john', { shirt: '#6a8f3a', arms: 'eat' }) + P(590, 210, 0.8, 'john', { shirt: '#8a5a9c', arms: 'hold' }) + P(680, 216, 0.8, 'gpa', { skin: '#e6c39f', hair: '#bdbdbd', arms: 'eat' }) +
    table(286, 520) +
    '<g transform="translate(400 290)"><ellipse rx="44" ry="13" fill="#fff" stroke="#b8c2ca" stroke-width="3"/><path d="M-30 -2 Q0 -26 30 -2" fill="#fbf7ee" stroke="#d8d0bc" stroke-width="2"/>' + [-18, -8, 2, 12, 22].map(function (d) { return '<ellipse cx="' + d + '" cy="-8" rx="4" ry="2" fill="#fff"/>'; }).join('') + '</g>' +
    '<g transform="translate(540 292)"><ellipse rx="40" ry="12" fill="#e9f5e2" stroke="#8aa77a" stroke-width="3"/><circle cx="-14" cy="-6" r="9" fill="#6aa84f"/><circle cx="2" cy="-8" r="10" fill="#7fbf5a"/><circle cx="16" cy="-5" r="6" fill="#d9442e"/><circle cx="-2" cy="-2" r="5" fill="#e0b13a"/></g>' +
    turkey(250, 262, 0.55).replace('translate(250', 'translate(240') + lion(762, 400, 0.55), 'The Lee family eats rice, salad and turkey in the kitchen. Baby Courtney is with them.'); };

  A.andre = function () { var s = '<rect width="800" height="420" fill="#cfe6f5"/><circle cx="700" cy="70" r="36" fill="#f2c94c"/>' +
    '<path d="M0 170 Q160 120 340 168 T800 150 V300 H0Z" fill="#9cc47a"/><rect y="280" width="800" height="140" fill="#b9b2a5"/>' +
    '<path d="M0 290 H800" stroke="#8f887c" stroke-width="4"/>';
    for (var i = 0; i < 8; i++) s += '<rect x="' + (i * 110 + 20) + '" y="330" width="70" height="4" fill="#fff" opacity=".7"/>';
    s += '<g transform="translate(40 60)"><rect x="0" y="80" width="230" height="150" fill="#e8d3b0" stroke="#8a6a44" stroke-width="4"/><path d="M-20 84 L115 0 L250 84Z" fill="#a8432f" stroke="#6b2a1c" stroke-width="4"/>' +
      '<rect x="90" y="150" width="50" height="80" fill="#6b4325"/><rect x="20" y="110" width="50" height="40" fill="#bfe0f2" stroke="#6b4a2b" stroke-width="3"/><rect x="160" y="110" width="50" height="40" fill="#bfe0f2" stroke="#6b4a2b" stroke-width="3"/>' +
      '<text x="115" y="72" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="16" fill="#fff">Grandma &amp; Grandpa</text></g>';
    s += '<g transform="translate(690 120)"><rect x="-6" y="0" width="12" height="190" fill="#7d8a94"/><rect x="-60" y="-50" width="90" height="62" fill="#fff" stroke="#c9412e" stroke-width="4"/><rect x="-36" y="-26" width="38" height="28" fill="none" stroke="#c9412e" stroke-width="3"/>' +
      '<ellipse cx="-17" cy="16" rx="22" ry="5" fill="none" stroke="#e0662c" stroke-width="4"/><path d="M-36 18 L-28 50 M-17 20 L-17 54 M2 18 L-6 50" stroke="#ddd" stroke-width="2"/></g>';
    s += P(340, 196, 0.9, 'agpa', { arms: 'up' }) + P(450, 206, 0.8, 'andre', { arms: 'up' }) + P(550, 214, 0.75, 'andre', { shirt: '#3a9e8f', style: 'long', hair: '#1a120c', arms: 'down' }) + P(630, 220, 0.72, 'andre', { shirt: '#e0b13a', arms: 'down' });
    s += '<g transform="translate(470 90)"><circle r="20" fill="#e0662c" stroke="#8a3410" stroke-width="3"/><path d="M-20 0 H20 M0 -20 V20 M-14 -14 Q0 0 -14 14 M14 -14 Q0 0 14 14" stroke="#8a3410" stroke-width="2.5" fill="none"/></g>';
    s += '<rect x="330" y="300" width="0" height="0"/>' + lion(30, 400, 0.55);
    return svg(800, 420, s, 'Andre plays basketball outside with his grandfather, brother and sister'); };

  A.done = function () { return pic('#fff6e6', turkey(100, 92, 0.85) + '<text x="100" y="30" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="20" fill="#8a3d10">Happy Thanksgiving!</text>', 'Happy Thanksgiving'); };
  A.qs = function () { return pic('#eef5ff', '<rect x="46" y="16" width="108" height="132" rx="6" fill="#fff" stroke="#5c6b62" stroke-width="3"/>' +
    [40, 58, 76, 94, 112].map(function (y) { return '<path d="M60 ' + y + ' H140" stroke="#b8c2ca" stroke-width="3"/>'; }).join('') +
    '<path d="M130 120 L170 70 L180 78 L140 128 L126 132Z" fill="#e0b13a" stroke="#8a6a1a" stroke-width="2"/>', 'writing'); };
  A.talk = function () { return pic('#f3eefb', person(60, 70, 0.7, PPL.ellen) + person(140, 70, 0.7, PPL.andre) +
    '<path d="M70 14 h52 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-30 l-10 10 v-10 h-12 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8z" fill="#fff" stroke="#5c6b62" stroke-width="2"/>' +
    '<text x="96" y="38" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="16" fill="#5c6b62">?</text>', 'two students talk'); };

  /* ---------- word pictures 200×160 ---------- */
  A.holiday = function () { return pic('#eef5ff', '<rect x="30" y="22" width="140" height="124" rx="8" fill="#fff" stroke="#3c4a5a" stroke-width="3"/><rect x="30" y="22" width="140" height="30" rx="8" fill="#c9412e"/>' +
    '<text x="100" y="44" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="16" fill="#fff">NOVEMBER</text>' +
    (function () { var s = ''; for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) { var x = 40 + c * 18.5, y = 62 + r * 20; s += '<rect x="' + x + '" y="' + y + '" width="14" height="14" fill="' + (r === 3 && c === 4 ? '#f2c94c' : '#e8edf2') + '"/>'; } return s; })() +
    '<circle cx="121" cy="129" r="13" fill="none" stroke="#c9412e" stroke-width="3"/><path d="M8 10 L40 30" stroke="#2f7d4f" stroke-width="0"/>' +
    '<g transform="translate(150 20)"><rect x="-26" y="-12" width="52" height="24" rx="5" fill="#2f7d4f"/><text y="5" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="11" fill="#fff">NO SCHOOL</text></g>', 'a calendar: Thursday in November, no school'); };
  A.turkey = function () { return pic('#fff6e6', turkey(100, 86, 0.95), 'a cooked turkey'); };
  A.cranberry = function () { return pic('#fdeef0', cran(100, 92, 1.3) + '<circle cx="34" cy="132" r="7" fill="#b0213a"/><circle cx="48" cy="140" r="7" fill="#c22a42"/><circle cx="160" cy="136" r="7" fill="#b0213a"/>', 'a bowl of cranberry sauce'); };
  A.potatoes = function () { return pic('#f7f1e1', pot(100, 90, 1.15), 'mashed potatoes and two potatoes'); };
  A.pie = function () { return pic('#fff1df', pie(100, 82, 1.2), 'a pumpkin pie'); };
  A.cook = function () { return pic('#eef7ee', '<rect x="0" y="118" width="200" height="42" fill="#c7cfd6"/><rect x="96" y="96" width="96" height="30" fill="#4a5560"/><circle cx="122" cy="96" r="2" fill="#e0662c"/>' +
    '<path d="M110 70 H180 V96 H110Z" fill="#7d8a94" stroke="#3c4a5a" stroke-width="3"/><path d="M180 78 H196" stroke="#3c4a5a" stroke-width="5"/>' +
    '<path d="M125 64 q-6 -10 0 -20 M145 62 q-6 -10 0 -20 M165 64 q-6 -10 0 -20" stroke="#b8c2ca" stroke-width="3" fill="none"/>' +
    '<path d="M120 100 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" fill="#f2b33a"/>' + person(60, 56, 0.72, { skin: '#c98d63', shirt: '#fff', hair: '#2b211b', arms: 'down' }) +
    '<path d="M44 78 h32 v40 h-32z" fill="#e8edf2" stroke="#b8c2ca" stroke-width="2"/><path d="M80 90 L112 74" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>', 'a man cooks food in a pot'); };
  A.grandparents = function () { return pic('#f3eefb', person(66, 60, 0.85, PPL.gma) + person(136, 58, 0.85, PPL.gpa) + '<path d="M100 120 l-6 -6 a4 4 0 0 1 6 -6 a4 4 0 0 1 6 6z" fill="#d9567f"/>', 'a grandmother and a grandfather'); };
  A.dishes = function () { return pic('#eaf6fb', '<rect x="0" y="100" width="200" height="60" fill="#c7cfd6"/><path d="M30 96 H170 L160 140 H40Z" fill="#9aa6b0" stroke="#5c6b62" stroke-width="3"/><path d="M42 100 H158 L150 132 H50Z" fill="#bfe0f2"/>' +
    '<path d="M150 60 V40 H120 V48" stroke="#7d8a94" stroke-width="7" fill="none"/><path d="M120 52 v16" stroke="#6aaed6" stroke-width="4" stroke-dasharray="4 4"/>' +
    '<ellipse cx="96" cy="96" rx="34" ry="10" fill="#fff" stroke="#8a99a6" stroke-width="3" transform="rotate(-20 96 96)"/>' +
    '<circle cx="70" cy="86" r="8" fill="#fff" stroke="#bfd6e8" stroke-width="2"/><circle cx="82" cy="74" r="6" fill="#fff" stroke="#bfd6e8" stroke-width="2"/><circle cx="128" cy="82" r="7" fill="#fff" stroke="#bfd6e8" stroke-width="2"/><circle cx="60" cy="70" r="4" fill="#fff" stroke="#bfd6e8" stroke-width="2"/>' +
    '<rect x="150" y="80" width="26" height="18" rx="4" fill="#f2c94c" stroke="#a88a2a" stroke-width="2"/>', 'washing a plate in the sink with soap'); };
  A.cards = function () { function card(x, y, r, t, c) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-22" y="-32" width="44" height="64" rx="5" fill="#fff" stroke="#3c4a5a" stroke-width="2.5"/><text x="0" y="8" text-anchor="middle" font-family="Arial" font-weight="900" font-size="24" fill="' + c + '">' + t + '</text></g>'; }
    return pic('#2f7d4f', '<rect x="0" y="0" width="200" height="160" fill="#2f7d4f"/><ellipse cx="100" cy="150" rx="120" ry="30" fill="#276a43"/>' +
      card(64, 82, -22, 'A♠', '#222') + card(92, 74, -7, 'K♥', '#c9412e') + card(120, 74, 8, 'Q♦', '#c9412e') + card(146, 84, 22, '7♣', '#222') +
      '<ellipse cx="100" cy="132" rx="40" ry="14" fill="#e0ac85"/>', 'a hand of playing cards'); };
  A.relax = function () { return pic('#f6efe4', '<rect x="0" y="130" width="200" height="30" fill="#b08a62"/><path d="M20 80 Q20 60 40 60 H160 Q180 60 180 80 V130 H20Z" fill="#5d7891" stroke="#3a5066" stroke-width="3"/>' +
    '<rect x="14" y="88" width="26" height="46" rx="8" fill="#4f6b86"/><rect x="160" y="88" width="26" height="46" rx="8" fill="#4f6b86"/>' +
    '<g transform="translate(70 92) rotate(-8)"><path d="M-28 30 Q-28 -2 0 -4 Q28 -2 28 30Z" fill="#2f6fbd"/><circle cx="0" cy="-22" r="18" fill="#c98d63"/><path d="M-18 -26 Q-18 -42 0 -42 Q18 -42 18 -26 Q12 -34 0 -34 Q-12 -34 -18 -26Z" fill="#2b211b"/>' +
    '<path d="M-8 -22 q4 3 8 0 M2 -22 q4 3 8 0" stroke="#222" stroke-width="2" fill="none"/><path d="M-5 -12 Q0 -8 5 -12" stroke="#8a3d2a" stroke-width="2" fill="none"/></g>' +
    '<path d="M96 116 H160" stroke="#3c4a5a" stroke-width="14" stroke-linecap="round"/><text x="130" y="44" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="#7d8a94">z z z</text>', 'a man relaxes on the sofa'); };
})();
