/* readings/thanksgiving-103/art103.js — T-499 (Nov 20 2026). ELD 103 word pictures. Loads AFTER /readings/thanksgiving/art.js (scenes + grandparents);
   helpers are copied from that file so this one stands alone. */
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

  var A = window.TG_ART = window.TG_ART || {};
  function bubble(x, y, w, h, txt, col, tail) { return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="' + (col || '#fff') + '" stroke="#3c4a5a" stroke-width="2.5"/>' +
    '<path d="M' + (tail || x + 16) + ' ' + (y + h) + ' l6 12 l8 -12" fill="' + (col || '#fff') + '" stroke="#3c4a5a" stroke-width="2.5" stroke-linejoin="round"/><path d="M' + ((tail || x + 16) + 1) + ' ' + (y + h - 1.5) + ' h12" stroke="' + (col || '#fff') + '" stroke-width="4"/>' +
    '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 6) + '" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="15" fill="#1c2640">' + txt + '</text></g>'; }
  /* ELD 103 word pictures 200×160 */
  A.grateful = function () { return pic('#fff4e6', person(100, 64, 0.95, { skin: '#c98d63', shirt: '#2f6fbd', hair: '#2b211b', arms: 'hold' }) +
    '<path d="M100 132 l-14 -14 a9 9 0 0 1 14 -12 a9 9 0 0 1 14 12z" fill="#d9567f" stroke="#a83a5c" stroke-width="2"/>' +
    '<text x="34" y="36" font-family="Nunito,Arial" font-weight="900" font-size="18" fill="#d4a017">✶</text><text x="156" y="30" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="#d4a017">✶</text>' +
    bubble(118, 8, 76, 28, 'thank you', '#fffdf6', 130), 'a person with a hand on the heart, saying thank you'); };
  A.tradition = function () { var s = ''; ['1990', '2005', '2026'].forEach(function (y, i) { var x = 14 + i * 62; s += '<g><rect x="' + x + '" y="26" width="52" height="100" rx="6" fill="#fff" stroke="#3c4a5a" stroke-width="2.5"/><rect x="' + x + '" y="26" width="52" height="20" rx="6" fill="#c9412e"/>' +
      '<text x="' + (x + 26) + '" y="41" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="13" fill="#fff">' + y + '</text>' + turkey(x + 26, 86, 0.3) + '</g>'; if (i < 2) s += '<path d="M' + (x + 54) + ' 76 h6" stroke="#2f7d4f" stroke-width="4"/><path d="M' + (x + 58) + ' 70 l6 6 l-6 6" fill="none" stroke="#2f7d4f" stroke-width="4"/>'; });
    return pic('#eef7ee', s + '<text x="100" y="148" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="14" fill="#2f7d4f">every year</text>', 'the same turkey dinner in 1990, 2005 and 2026'); };
  A.nag = function () { return pic('#f3eefb', person(56, 70, 0.8, { skin: '#e0ac85', shirt: '#b5476b', hair: '#5a3a22', style: 'long', arms: 'up' }) + person(150, 76, 0.75, { skin: '#e0ac85', shirt: '#e08a2c', hair: '#7a4a24' }) +
    bubble(70, 6, 74, 26, 'girlfriend?', '#fff', 80) + bubble(84, 34, 62, 22, 'again?', '#fff', 92).replace('font-size="15"', 'font-size="13"') +
    '<path d="M136 52 q4 6 0 12" stroke="#4a8ad4" stroke-width="3" fill="none"/>', 'an aunt asks the same question again and again'); };
  A.awkward = function () { return pic('#eef5ff', person(100, 66, 1, { skin: '#e0ac85', shirt: '#e08a2c', hair: '#7a4a24' }) +
    '<path d="M86 76 Q100 70 114 76" stroke="#8a3d2a" stroke-width="3" fill="#fff" />' + '<path d="M128 44 q6 10 0 14 q-6 -4 0 -14z" fill="#7cc4f0" stroke="#3a8ac0" stroke-width="1.5"/>' +
    '<circle cx="86" cy="70" r="5" fill="#f29b9b" opacity=".7"/><circle cx="114" cy="70" r="5" fill="#f29b9b" opacity=".7"/>' +
    '<text x="22" y="40" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="#9aa6b0">. . .</text>', 'a boy with an uncomfortable smile and a drop of sweat'); };
  A.argue = function () { var zig = 'M78 18 l10 8 l6 -10 l8 10 l8 -8 l4 12 l10 -2 l-6 10 l8 6 l-12 2 l2 10 l-10 -6 l-6 10 l-4 -12 l-10 6 l2 -12 l-10 -2 l8 -8z';
    return pic('#fbefe6', person(52, 74, 0.82, { skin: '#d79e78', shirt: '#4f7a4a', hair: '#cfcfcf', style: 'bald', wrinkles: true, arms: 'up' }) + person(148, 74, 0.82, { skin: '#c98d63', shirt: '#2f5d7c', hair: '#2b211b', arms: 'up' }) +
      '<path d="' + zig + '" fill="#ffd2c7" stroke="#c9412e" stroke-width="2.5"/><text x="100" y="40" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="14" fill="#c9412e">NO!</text>' +
      '<path d="M40 52 l8 6 M44 46 l10 4 M156 52 l-8 6 M152 46 l-10 4" stroke="#c9412e" stroke-width="2.5"/>', 'two men argue with angry faces'); };
  A.subject = function () { return pic('#eef7ee', bubble(10, 14, 84, 30, 'girlfriend?', '#fff', 30) + '<path d="M52 20 L80 40" stroke="#c9412e" stroke-width="4"/>' +
    '<path d="M100 60 C 120 40, 140 40, 150 54" stroke="#2f7d4f" stroke-width="5" fill="none"/><path d="M144 44 l8 10 l-12 2" fill="none" stroke="#2f7d4f" stroke-width="5" stroke-linejoin="round"/>' +
    bubble(112, 64, 80, 30, 'football!', '#e9f6ee', 128) + person(60, 104, 0.6, { skin: '#e0ac85', shirt: '#e08a2c', hair: '#7a4a24' }), 'a boy stops one topic and starts talking about football'); };
  A.exhausted = function () { return pic('#e9eef8', '<rect x="0" y="0" width="200" height="160" fill="#2c3e66"/><circle cx="166" cy="30" r="14" fill="#f2e6b0"/><circle cx="160" cy="26" r="12" fill="#2c3e66"/>' +
    '<text x="30" y="34" font-family="Nunito,Arial" font-size="12" fill="#f2e6b0">✦</text><text x="120" y="20" font-family="Nunito,Arial" font-size="10" fill="#f2e6b0">✦</text>' +
    person(84, 70, 0.95, { skin: '#e6c39f', shirt: '#c25a3a', hair: '#1a1a1a', style: 'long', arms: 'hold' }) + person(84, 128, 0.42, { style: 'baby', skin: '#ecc9a5', shirt: '#f5c6d6', hair: '#1a1a1a' }) +
    '<path d="M72 74 q4 3 8 0 M88 74 q4 3 8 0" stroke="#6b4a5a" stroke-width="2" fill="none"/>' +
    '<g transform="translate(150 96)"><circle r="22" fill="#fff" stroke="#3c4a5a" stroke-width="3"/><path d="M0 0 V-14 M0 0 L10 6" stroke="#222" stroke-width="3"/><text y="40" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="14" fill="#f2e6b0">3:00 a.m.</text></g>', 'a very tired mother holding a baby at 3 in the morning'); };
  A.immigrate = function () { return pic('#cfe6f5', '<path d="M0 100 Q50 92 100 100 T200 100 V160 H0Z" fill="#3f7fb3"/>' +
    '<path d="M0 110 Q24 90 40 100 L44 160 H0Z" fill="#6aa84f"/><path d="M160 104 Q178 86 200 92 V160 H156Z" fill="#9cc47a"/>' +
    '<text x="22" y="132" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="12" fill="#fff">Haiti</text><text x="180" y="132" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="12" fill="#1c2640">U.S.</text>' +
    '<path d="M36 80 C 80 30, 120 30, 164 76" stroke="#c9412e" stroke-width="3" stroke-dasharray="8 6" fill="none"/><path d="M156 66 l10 12 l-14 2" fill="none" stroke="#c9412e" stroke-width="3"/>' +
    '<g transform="translate(100 42) rotate(10)"><path d="M-24 0 L24 -2 L28 2 L-22 6Z" fill="#fff" stroke="#3c4a5a" stroke-width="2"/><path d="M-4 0 L-14 -14 L-8 -14 L6 0Z M-4 4 L-12 16 L-6 16 L6 4Z" fill="#dfe6ee" stroke="#3c4a5a" stroke-width="1.5"/></g>' +
    '<rect x="66" y="112" width="34" height="24" rx="4" fill="#a8743f" stroke="#6b4325" stroke-width="2"/><rect x="104" y="116" width="26" height="20" rx="4" fill="#5d7891" stroke="#3a5066" stroke-width="2"/>', 'moving from Haiti to the United States'); };
  A.leftovers = function () { return pic('#eef5ff', '<rect x="20" y="20" width="160" height="124" rx="10" fill="#f4f7fa" stroke="#9aa6b0" stroke-width="3"/><path d="M20 82 H180" stroke="#b8c2ca" stroke-width="3"/>' +
    '<rect x="34" y="40" width="64" height="34" rx="6" fill="#dbe9ff" opacity=".7" stroke="#6a8fb8" stroke-width="2"/><ellipse cx="66" cy="60" rx="20" ry="8" fill="#b8692c"/>' +
    '<rect x="110" y="44" width="56" height="30" rx="6" fill="#dbe9ff" opacity=".7" stroke="#6a8fb8" stroke-width="2"/><path d="M118 70 Q138 50 158 70Z" fill="#e08a2c"/>' +
    '<g transform="translate(100 112)"><path d="M-44 10 H44 L36 -4 H-36Z" fill="#e9c27a" stroke="#a8743f" stroke-width="2"/><path d="M-40 -4 H40" stroke="#6aa84f" stroke-width="5"/><path d="M-38 -9 H38" stroke="#c98a3d" stroke-width="7"/><path d="M-36 -16 H36 L44 -22 H-44Z" fill="#e9c27a" stroke="#a8743f" stroke-width="2"/></g>', 'leftover turkey and pie in the fridge and a turkey sandwich'); };
  /* T-502: family words */
  var KID = { skin: '#e0ac85', shirt: '#e08a2c', hair: '#7a4a24' }, SIB = { skin: '#c98d63', shirt: '#3a9e8f', hair: '#2b211b', style: 'long' };
  function o(base, extra) { var r = {}, k; for (k in base) r[k] = base[k]; for (k in (extra || {})) r[k] = extra[k]; return r; }
  A.pester = function () { return pic('#eef7ee', person(132, 52, 0.85, o(SIB, { arms: 'hold' })) +
    '<rect x="106" y="96" width="52" height="30" rx="5" fill="#2b2b33"/><rect x="110" y="100" width="44" height="22" fill="#5aa0d8"/>' +
    person(58, 92, 0.55, o(KID, { arms: 'up' })) + '<path d="M78 92 Q96 96 108 104" stroke="#e08a2c" stroke-width="8" stroke-linecap="round" fill="none"/>' +
    bubble(8, 6, 92, 26, 'play with me!', '#fff', 40).replace('font-size="15"', 'font-size="12"') + bubble(14, 36, 70, 20, 'please?', '#fff', 40).replace('font-size="15"', 'font-size="11"') +
    '<text x="158" y="28" font-family="Nunito,Arial" font-weight="900" font-size="20" fill="#7d8a94">😩</text>', 'a little brother pulls his big sister: play with me, please'); };
  A.tease = function () { return pic('#fff6e6', person(56, 60, 0.85, o(KID, { shirt: '#4f7a4a', arms: 'up' })) + person(144, 62, 0.85, o(SIB, { shirt: '#b5476b', style: 'short', hair: '#2b211b' })) +
    '<path d="M126 34 L162 34 L152 14 Z" fill="#c9412e" stroke="#7a1f16" stroke-width="2"/><circle cx="152" cy="12" r="5" fill="#f2c94c"/>' +
    '<text x="40" y="22" font-family="Nunito,Arial" font-weight="900" font-size="15" fill="#c9412e">ha ha!</text><path d="M78 44 L118 54" stroke="#4f7a4a" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M136 74 Q144 70 152 74" stroke="#8a3d2a" stroke-width="2.5" fill="none"/>', 'a boy laughs and points at his sister’s funny hat'); };
  A.scold = function () { return pic('#f3eefb', person(62, 50, 0.95, o({ skin: '#e0ac85', shirt: '#7d5ba6', hair: '#5a3a22', style: 'bun' }, { arms: 'up' })) +
    person(146, 92, 0.6, o(KID, { shirt: '#2f6fbd' })) + '<path d="M146 98 l-6 -4 m12 0 l6 -4" stroke="#333" stroke-width="2"/>' +
    '<path d="M110 150 l10 -10 l8 6 l6 -12 l10 14 z" fill="#d7dde3" stroke="#8a99a6" stroke-width="2"/><path d="M168 150 l8 -8 l6 8z" fill="#d7dde3" stroke="#8a99a6" stroke-width="2"/>' +
    '<path d="M18 22 l10 6 l-10 6 M8 28 h18" stroke="#c9412e" stroke-width="3" fill="none"/>' + bubble(80, 6, 110, 26, 'Why did you…?!', '#ffe4de', 92).replace('font-size="15"', 'font-size="13"'), 'a mother talks angrily; her son looks down at a broken plate'); };
  A.punish = function () { return pic('#eef5ff', person(58, 52, 0.9, { skin: '#c98d63', shirt: '#3d6fa8', hair: '#2b211b', arms: 'up' }) +
    '<rect x="8" y="2" width="22" height="36" rx="4" fill="#2b2b33" transform="rotate(-12 19 20)"/><rect x="11" y="6" width="16" height="26" fill="#5aa0d8" transform="rotate(-12 19 20)"/>' +
    person(148, 92, 0.6, o(KID)) + '<path d="M140 100 q8 -4 16 0" stroke="#8a3d2a" stroke-width="2" fill="none" transform="rotate(180 148 100)"/><path d="M158 82 q3 6 0 9" stroke="#4a8ad4" stroke-width="2" fill="none"/>' +
    '<g transform="translate(98 104)"><rect width="48" height="44" rx="4" fill="#fff" stroke="#3c4a5a" stroke-width="2"/><rect width="48" height="12" rx="4" fill="#c9412e"/>' +
    '<text x="24" y="28" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="10" fill="#1c2640">NO PHONE</text><text x="24" y="40" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="9" fill="#5c6b62">7 days</text></g>', 'a father holds the phone up high; no phone for 7 days'); };

  /* T-502: history scenes, 400×250 each, labelled; the war picture shows fighting but no blood or bodies */
  function lab(x, y, t, col) { return '<g><rect x="' + (x - t.length * 4.2 - 8) + '" y="' + (y - 15) + '" width="' + (t.length * 8.4 + 16) + '" height="22" rx="6" fill="#fff" stroke="' + col + '" stroke-width="2.5"/><text x="' + x + '" y="' + (y + 1) + '" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="14" fill="' + col + '">' + t + '</text></g>'; }
  var WAMP = { skin: '#a8694a', shirt: '#9a6a3c', hair: '#1a120c', style: 'long' }, PIL = { skin: '#efc9a6', shirt: '#2b2b33', hair: '#6b4a2b' };
  function pilgrim(x, y, s, arms) { return person(x, y, s, o(PIL, { arms: arms || 'down' })) + '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-14 36 L0 52 L14 36 Z" fill="#fff"/><rect x="-24" y="-40" width="48" height="8" rx="3" fill="#1a1a1a"/><path d="M-15 -38 L-12 -66 L12 -66 L15 -38Z" fill="#1a1a1a"/><rect x="-6" y="-48" width="12" height="9" fill="none" stroke="#d4a017" stroke-width="3"/></g>'; }
  function wamp(x, y, s, arms) { return person(x, y, s, o(WAMP, { arms: arms || 'down' })) + '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-24 -10 Q0 -2 24 -10" stroke="#c9412e" stroke-width="4" fill="none"/><path d="M14 -24 L22 -56 L26 -24Z" fill="#e8e2d0" stroke="#7a6a4a" stroke-width="1.5"/><path d="M-30 50 Q0 64 30 50" stroke="#e0b13a" stroke-width="4" stroke-dasharray="4 4" fill="none"/></g>'; }
  A.histMeal = function () { var s = '<rect width="400" height="250" fill="#f6e2b8"/><rect y="150" width="400" height="100" fill="#a8b860"/>';
    [[30, 60], [90, 40], [330, 50], [370, 70]].forEach(function (t) { s += '<rect x="' + (t[0] - 5) + '" y="' + (t[1] + 40) + '" width="10" height="60" fill="#6b4325"/><circle cx="' + t[0] + '" cy="' + (t[1] + 30) + '" r="30" fill="' + (t[0] % 60 ? '#d9822b' : '#c9412e') + '"/>'; });
    s += wamp(90, 120, 0.62, 'eat') + wamp(150, 112, 0.62, 'hold') + pilgrim(250, 112, 0.62, 'eat') + pilgrim(310, 120, 0.62, 'hold');
    s += '<rect x="60" y="164" width="290" height="12" rx="3" fill="#8a5a33"/><path d="M70 176 V214 M340 176 V214" stroke="#6b4325" stroke-width="8"/>';
    s += '<ellipse cx="150" cy="160" rx="26" ry="9" fill="#b8692c"/><ellipse cx="205" cy="160" rx="18" ry="6" fill="#f2c94c"/><ellipse cx="250" cy="160" rx="22" ry="8" fill="#9a6a3c"/><circle cx="110" cy="158" r="7" fill="#e08a2c"/><circle cx="290" cy="158" r="7" fill="#6aa84f"/>';
    s += lab(105, 238, 'Wampanoag', '#7a3d14') + lab(290, 238, 'English settlers', '#1c2640') + '<text x="200" y="26" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="20" fill="#7a3d14">1621: a harvest meal</text>';
    return svg(400, 250, s, '1621: Wampanoag men and English settlers eat a harvest meal together'); };
  A.histWar = function () { var s = '<rect width="400" height="250" fill="#c9c3b8"/><rect y="0" width="400" height="140" fill="#b8b2a8"/><rect y="150" width="400" height="100" fill="#8a9a5a"/>';
    s += '<g transform="translate(330 96)"><rect x="-22" y="0" width="44" height="40" fill="#8a6a44"/><path d="M-28 2 L0 -24 L28 2Z" fill="#6b4a2b"/><path d="M-10 -20 Q-4 -34 4 -26 Q10 -40 16 -28" fill="#e0662c"/><path d="M-6 -26 Q-30 -70 6 -90 Q40 -110 20 -140" stroke="#7d7d7d" stroke-width="18" fill="none" opacity=".55" stroke-linecap="round"/></g>';
    s += pilgrim(70, 120, 0.6, 'hold') + '<path d="M58 160 L112 140" stroke="#4a3a2a" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="137" r="8" fill="#e6e6e6" opacity=".8"/><circle cx="130" cy="133" r="6" fill="#e6e6e6" opacity=".6"/>';
    s += pilgrim(130, 128, 0.55, 'hold') + '<path d="M118 166 L166 150" stroke="#4a3a2a" stroke-width="5" stroke-linecap="round"/>';
    s += wamp(250, 122, 0.6, 'hold') + '<path d="M222 140 Q206 160 222 180" stroke="#6b4325" stroke-width="4" fill="none"/><path d="M222 140 V180" stroke="#555" stroke-width="1.5"/><path d="M222 160 H196" stroke="#4a3a2a" stroke-width="2.5"/><path d="M196 160 l6 -4 v8z" fill="#4a3a2a"/>';
    s += wamp(300, 130, 0.55, 'hold') + '<path d="M276 148 Q262 166 276 184" stroke="#6b4325" stroke-width="4" fill="none"/><path d="M276 148 V184" stroke="#555" stroke-width="1.5"/>';
    s += lab(100, 238, 'English settlers', '#1c2640') + lab(280, 238, 'Wampanoag', '#7a3d14') + '<text x="200" y="26" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="20" fill="#5a1f10">1675: war</text>';
    return svg(400, 250, s, '1675: English settlers with guns and Wampanoag with bows face each other; a house burns'); };
})();