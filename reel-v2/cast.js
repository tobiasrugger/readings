/* =====================================================================
   cast.js — Story Reel cast + scenery (Mr. Toby, Galileo ELD)
   Everything is drawn as SVG strings. No images, no template literals.
   Stage is 1600 x 900. Characters stand on GROUND (y = 820).
   ===================================================================== */
(function () {
  var R = window.REEL = window.REEL || {};
  R.W = 1600; R.H = 900; R.GROUND = 820;

  /* ---------- the recurring cast ---------- */
  R.CAST = {
    linh: {
      name: 'Linh', from: 'Vietnam', lang: 'Vietnamese',
      skin: '#f2cba6', hair: 'long', hairColor: '#231b1b',
      shirt: '#e98aa5', pants: '#3d4a6b', shoes: '#f4f1ee', detail: 'sweater',
      h: 0.86, voice: 'f', pitch: 1.2, rate: 0.95, color: '#d9567f',
      aboutA: 'Linh is from Vietnam. She is short. She has long, straight, black hair. She is shy and curious.',
      aboutB: 'Linh moved here from Vietnam. She is quiet at first, but she notices everything. She has long, straight, black hair.'
    },
    mateo: {
      name: 'Mateo', from: 'Guatemala', lang: 'Spanish',
      skin: '#c68a5e', hair: 'curly', hairColor: '#1c1512',
      shirt: '#2f6fbd', pants: '#2b2f3a', shoes: '#e24b3b', detail: 'jersey',
      h: 1.1, voice: 'm', pitch: 0.85, rate: 1.0, color: '#2f6fbd',
      aboutA: 'Mateo is from Guatemala. He is tall. He has short, curly, black hair. He is athletic and funny.',
      aboutB: 'Mateo is from Guatemala. He is the tallest student in class, and he never stops joking. He plays soccer every day.'
    },
    amira: {
      name: 'Amira', from: 'Yemen', lang: 'Arabic',
      skin: '#d9a37a', hair: 'hijab', hairColor: '#2a9d8f',
      shirt: '#F8981F', pants: '#4b3f58', shoes: '#2b2233', detail: 'cardigan',
      h: 0.95, voice: 'f', pitch: 1.35, rate: 1.05, color: '#1f8a7e',
      aboutA: 'Amira is from Yemen. She wears a hijab. She is friendly and loud. She is artistic. She draws every day.',
      aboutB: 'Amira is from Yemen. She is outgoing and a little loud, and she always carries a sketchbook.'
    },
    jun: {
      name: 'Jun', from: 'China', lang: 'Cantonese',
      skin: '#efcfae', hair: 'short', hairColor: '#161314',
      shirt: '#6f7d8c', pants: '#23262d', shoes: '#f4f1ee', detail: 'hoodie',
      glasses: true, prop: 'headphones',
      h: 0.98, voice: 'm', pitch: 1.05, rate: 0.9, color: '#5b6b7c',
      aboutA: 'Jun is from China. He speaks Cantonese. He has short black hair and glasses. He is shy and musical.',
      aboutB: 'Jun is from Guangzhou, China. He is reserved, but when he talks about music, he lights up.'
    },
    paolo: {
      name: 'Paolo', from: 'the Philippines', lang: 'Tagalog',
      skin: '#b97a50', hair: 'wavy', hairColor: '#4a2f1d',
      shirt: '#864D9E', pants: '#2f3342', shoes: '#f8c33a', detail: 'tee',
      h: 1.0, voice: 'm', pitch: 1.15, rate: 1.05, color: '#864D9E',
      aboutA: 'Paolo is from the Philippines. He has wavy brown hair. He is playful and dramatic.',
      aboutB: 'Paolo is from the Philippines. He is playful and a bit dramatic, and he turns every moment into a show.'
    }
  };
  R.NARRATOR = { name: 'Narrator', voice: 'n', pitch: 1.0, rate: 0.92, color: '#864D9E' };

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(c) { return Math.max(0, Math.min(255, Math.round(c + amt))); }
    return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }
  R.shade = shade;

  /* ---------- faces ---------- */
  var MOUTH = {
    smile:    '<path d="M-20,-416 Q0,-398 20,-416" fill="none" stroke="#6b2b2b" stroke-width="5" stroke-linecap="round"/>',
    happy:    '<path d="M-23,-419 Q0,-386 23,-419 Z" fill="#7a2e2e"/><path d="M-15,-417 Q0,-410 15,-417" fill="none" stroke="#fff" stroke-width="4"/>',
    neutral:  '<path d="M-13,-410 L13,-410" stroke="#6b2b2b" stroke-width="5" stroke-linecap="round"/>',
    nervous:  '<path d="M-18,-409 q6,-6 12,0 q6,6 12,0" fill="none" stroke="#6b2b2b" stroke-width="4.5" stroke-linecap="round"/>',
    surprised:'<ellipse cx="0" cy="-409" rx="8" ry="11" fill="#7a2e2e"/>',
    shy:      '<path d="M-10,-411 Q0,-404 10,-411" fill="none" stroke="#6b2b2b" stroke-width="4.5" stroke-linecap="round"/>',
    reading:  '<path d="M-9,-410 Q0,-405 9,-410" fill="none" stroke="#6b2b2b" stroke-width="4.5" stroke-linecap="round"/>'
  };
  var BROWS = {
    base:     ['M-34,-480 q11,-7 22,-1', 'M12,-481 q11,-6 22,1'],
    up:       ['M-34,-487 q11,-8 22,-2', 'M12,-489 q11,-6 22,2'],
    nervous:  ['M-34,-476 q12,-4 22,-10', 'M12,-486 q10,6 22,10'],
    shy:      ['M-33,-478 q11,-4 21,-4', 'M12,-482 q10,0 21,4']
  };
  var EXPR_BROWS = { smile: 'base', happy: 'up', neutral: 'base', nervous: 'nervous', surprised: 'up', shy: 'shy', reading: 'base' };

  function hairBack(c) {
    var hc = c.hairColor;
    if (c.hair === 'long')  return '<path d="M-72,-468 C-82,-548 82,-548 72,-468 L80,-322 C44,-306 -44,-306 -80,-322 Z" fill="' + hc + '"/>';
    if (c.hair === 'wavy')  return '<path d="M-72,-462 C-82,-548 82,-548 72,-462 C84,-432 70,-408 80,-386 C62,-372 52,-392 42,-382 L-42,-382 C-52,-392 -62,-372 -80,-386 C-70,-408 -84,-432 -72,-462 Z" fill="' + hc + '"/>';
    if (c.hair === 'hijab') return '<path d="M-86,-452 C-94,-566 94,-566 86,-452 C92,-398 112,-372 124,-330 C64,-296 -64,-296 -124,-330 C-112,-372 -92,-398 -86,-452 Z" fill="' + hc + '"/>' +
                                   '<path d="M-40,-520 C-10,-530 30,-528 56,-510" fill="none" stroke="' + shade(hc, -25) + '" stroke-width="5" stroke-linecap="round" opacity=".6"/>';
    return '';
  }
  function hairFront(c) {
    var hc = c.hairColor, s = '';
    if (c.hair === 'long') {
      s += '<path d="M-66,-468 C-62,-538 62,-538 66,-468 C46,-500 16,-494 -2,-508 C-18,-488 -46,-496 -66,-468 Z" fill="' + hc + '"/>';
      s += '<path d="M-66,-470 C-72,-430 -70,-400 -64,-372 L-56,-372 C-60,-410 -58,-440 -54,-470 Z" fill="' + hc + '"/>';
      s += '<path d="M66,-470 C72,-430 70,-400 64,-372 L56,-372 C60,-410 58,-440 54,-470 Z" fill="' + hc + '"/>';
    } else if (c.hair === 'curly') {
      var pts = [[-54,-486],[-34,-510],[-10,-522],[14,-521],[36,-509],[55,-486],[-64,-462],[64,-462],[-22,-503],[24,-502],[0,-508]];
      for (var i = 0; i < pts.length; i++) {
        s += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (i > 7 ? 18 : 21) + '" fill="' + hc + '"/>';
      }
      s += '<path d="M-40,-512 q8,-6 14,2 M8,-526 q8,-6 14,2 M40,-500 q8,-6 14,2" fill="none" stroke="' + shade(hc, 40) + '" stroke-width="3" opacity=".7"/>';
    } else if (c.hair === 'short') {
      s += '<path d="M-67,-452 C-72,-544 72,-544 67,-452 C62,-478 46,-490 26,-488 C6,-500 -24,-497 -42,-487 C-54,-481 -63,-468 -67,-452 Z" fill="' + hc + '"/>';
    } else if (c.hair === 'wavy') {
      s += '<path d="M-67,-460 C-63,-540 63,-540 67,-460 C52,-496 32,-480 14,-502 C0,-480 -30,-503 -42,-486 C-52,-492 -62,-476 -67,-460 Z" fill="' + hc + '"/>';
    } else if (c.hair === 'hijab') {
      s += '<path d="M-60,-476 C-52,-532 52,-532 60,-476 C38,-502 -38,-502 -60,-476 Z" fill="' + hc + '"/>';
    }
    return s;
  }

  function torso(c, face) {
    var sh = c.shirt, dk = shade(sh, -28), s = '';
    s += '<rect x="-64" y="-372" width="128" height="200" rx="36" fill="' + sh + '"/>';
    if (c.detail === 'jersey') {
      s += '<path d="M-22,-372 L0,-346 L22,-372" fill="none" stroke="#fff" stroke-width="6"/>';
      s += '<text x="0" y="-262"' + (face < 0 ? ' transform="scale(-1,1)"' : '') + ' text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="64" fill="#fff" opacity=".92">9</text>';
    } else if (c.detail === 'hoodie') {
      s += '<path d="M-44,-236 L44,-236 L36,-196 L-36,-196 Z" fill="' + dk + '"/>';
      s += '<path d="M-14,-368 L-18,-310 M14,-368 L18,-310" stroke="#e9ecef" stroke-width="4" stroke-linecap="round"/>';
    } else if (c.detail === 'cardigan') {
      s += '<rect x="-26" y="-370" width="52" height="196" fill="#fdf3e4"/>';
      s += '<circle cx="-34" cy="-300" r="4" fill="' + dk + '"/><circle cx="-34" cy="-250" r="4" fill="' + dk + '"/>';
    } else if (c.detail === 'sweater') {
      s += '<path d="M-60,-212 L60,-212" stroke="' + dk + '" stroke-width="8"/><path d="M-60,-200 L60,-200" stroke="' + dk + '" stroke-width="4"/>';
    } else {
      s += '<path d="M-20,-370 Q0,-354 20,-370" fill="none" stroke="' + dk + '" stroke-width="5"/>';
    }
    return s;
  }

  function arm(c, side, angle, wave, noHand) {
    var sx = side * 60, anim = '';
    if (wave) {
      anim = '<animateTransform attributeName="transform" type="rotate" values="' +
             angle + ' ' + sx + ' -355;' + (angle + 22) + ' ' + sx + ' -355;' + angle + ' ' + sx + ' -355" dur="0.9s" repeatCount="indefinite"/>';
    }
    return '<g transform="rotate(' + angle + ' ' + sx + ' -355)">' + anim +
      '<rect x="' + (sx - 14) + '" y="-362" width="28" height="158" rx="14" fill="' + c.shirt + '"/>' +
      '<rect x="' + (sx - 14) + '" y="-362" width="28" height="158" rx="14" fill="#000" opacity=".06"/>' +
      (noHand ? '' : '<circle cx="' + sx + '" cy="-198" r="15" fill="' + c.skin + '"/>') + '</g>';
  }

  function prop(c) {
    if (c.prop === 'headphones') {
      return '<path d="M-44,-372 C-46,-340 46,-340 44,-372" fill="none" stroke="#2b2233" stroke-width="9" stroke-linecap="round"/>' +
             '<rect x="-56" y="-382" width="20" height="28" rx="8" fill="#F8981F"/><rect x="36" y="-382" width="20" height="28" rx="8" fill="#F8981F"/>';
    }
    return '';
  }
  function heldProp(name) {
    if (name === 'ball') {
      return '<g transform="translate(96,-40)"><circle r="38" fill="#fff" stroke="#2b2233" stroke-width="4"/>' +
             '<path d="M0,-14 L13,-4 L8,12 L-8,12 L-13,-4 Z" fill="#2b2233"/>' +
             '<path d="M0,-14 L0,-37 M13,-4 L34,-12 M8,12 L20,31 M-8,12 L-20,31 M-13,-4 L-34,-12" stroke="#2b2233" stroke-width="3"/></g>';
    }
    if (name === 'sketchbook') {
      return '<g transform="translate(-70,-250) rotate(-12)"><rect x="-44" y="-56" width="88" height="112" rx="6" fill="#2b2233"/>' +
             '<rect x="-38" y="-50" width="76" height="100" rx="4" fill="#fffdf8"/>' +
             '<path d="M-24,10 q12,-26 24,-4 q12,-26 24,-4" fill="none" stroke="#1f8a7e" stroke-width="4"/>' +
             '<circle cx="14" cy="-22" r="9" fill="#F8981F"/></g>';
    }
    if (name === 'backpack') {
      /* Jun's orange backpack, carried at the side by one strap */
      return '<g transform="translate(118,-200)"><path d="M-10,-62 Q-40,-170 -84,-128" fill="none" stroke="#c9742a" stroke-width="12" stroke-linecap="round"/>' +
             '<rect x="-44" y="-70" width="88" height="130" rx="22" fill="#F8981F"/><rect x="-44" y="-70" width="88" height="46" rx="22" fill="#e07f12"/>' +
             '<rect x="-30" y="0" width="60" height="42" rx="12" fill="#ffb648" stroke="#c9742a" stroke-width="3"/>' +
             '<rect x="-14" y="-30" width="28" height="10" rx="5" fill="#2b2233"/>' +
             '<path d="M0,42 L0,60" stroke="#2b2233" stroke-width="4"/></g>';
    }
    if (name === 'pencil') {
      return '<g transform="translate(96,-44) rotate(-58)"><rect x="-56" y="-8" width="100" height="16" rx="3" fill="#f2c230"/>' +
             '<path d="M44,-8 L66,0 L44,8 Z" fill="#e8c9a0"/><path d="M58,-3 L66,0 L58,3 Z" fill="#2b2233"/>' +
             '<rect x="-56" y="-8" width="14" height="16" fill="#e98aa5"/><rect x="-42" y="-8" width="6" height="16" fill="#9aa3ad"/></g>';
    }
    if (name === 'notebook') {
      return '<g transform="translate(74,-214) rotate(8)"><rect x="-30" y="-40" width="60" height="78" rx="4" fill="#2f6fbd"/>' +
             '<rect x="-22" y="-32" width="46" height="62" rx="3" fill="#fffdf8"/>' +
             '<path d="M-14,-18 L16,-18 M-14,-6 L16,-6 M-14,6 L12,6 M-14,18 L14,18" stroke="#9aa3ad" stroke-width="3"/>' +
             '<path d="M-30,-30 L-36,-30 M-30,-16 L-36,-16 M-30,-2 L-36,-2 M-30,12 L-36,12 M-30,26 L-36,26" stroke="#8b8f98" stroke-width="4" stroke-linecap="round"/></g>';
    }
    if (name === 'schedule') {
      /* a printed class schedule, held up to read */
      var sc = '<g transform="translate(96,-250) rotate(-6)"><rect x="-56" y="-72" width="112" height="144" rx="5" fill="#fffdf8" stroke="#c9c2b3" stroke-width="3"/>' +
               '<rect x="-56" y="-72" width="112" height="26" rx="5" fill="#864D9E"/>' +
               '<text x="0" y="-53" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="17" fill="#fff">SCHEDULE</text>';
      for (var r = 0; r < 5; r++) {
        sc += '<path d="M-56,' + (-34 + r * 22) + ' L56,' + (-34 + r * 22) + '" stroke="#e0d7c8" stroke-width="2"/>';
        sc += '<rect x="-48" y="' + (-28 + r * 22) + '" width="34" height="9" rx="3" fill="#9aa3ad"/>';
        sc += '<rect x="-4" y="' + (-28 + r * 22) + '" width="' + (30 + (r * 13) % 22) + '" height="9" rx="3" fill="' + ['#2f6fbd', '#1f8a7e', '#F8981F', '#d9567f', '#864D9E'][r] + '"/>';
      }
      return sc + '</g>';
    }
    if (name === 'tray') {
      /* a lunch tray carried in front: plate, milk carton, apple, napkin, fork and spoon */
      return '<g transform="translate(0,-212)">' +
             '<rect x="-108" y="-16" width="216" height="40" rx="10" fill="#9aa3ad"/>' +
             '<rect x="-100" y="-22" width="200" height="30" rx="8" fill="#c0c7cf"/>' +
             '<ellipse cx="-34" cy="-20" rx="46" ry="16" fill="#fffdf8" stroke="#d9d3e3" stroke-width="3"/>' +
             '<path d="M-60,-24 A46,16 0 0 1 -8,-24 Z" fill="#F8981F"/>' +
             '<path d="M-50,-26 l10,-6 l10,6 l10,-6 l10,6" fill="none" stroke="#c9412e" stroke-width="3"/>' +
             '<rect x="28" y="-52" width="34" height="46" rx="4" fill="#fffdf8" stroke="#2f6fbd" stroke-width="3"/>' +
             '<path d="M28,-52 L45,-62 L62,-52 Z" fill="#2f6fbd"/>' +
             '<circle cx="86" cy="-24" r="16" fill="#c9412e"/><path d="M86,-40 q6,-10 14,-8" fill="none" stroke="#1f8a7e" stroke-width="4"/>' +
             '<rect x="-104" y="-8" width="26" height="20" rx="3" fill="#fffdf8"/>' +
             '<path d="M-96,-10 L-96,-34 M-92,-10 L-92,-34 M-88,-10 L-88,-34" stroke="#8b8f98" stroke-width="3"/>' +
             '<path d="M-74,-10 L-74,-36 q6,-4 6,-14 q-6,4 -6,14" fill="none" stroke="#8b8f98" stroke-width="3"/></g>';
    }
    if (name === 'map') {
      /* Episode 5: a folded paper school map, held open to read (three floors, a star, a dotted route) */
      var mp = '<g transform="translate(96,-250) rotate(-5)"><rect x="-66" y="-60" width="132" height="120" rx="4" fill="#fffdf8" stroke="#c9c2b3" stroke-width="3"/>' +
               '<path d="M-22,-60 L-22,60 M22,-60 L22,60" stroke="#e0d7c8" stroke-width="2"/>';
      for (var f = 0; f < 3; f++) {
        mp += '<rect x="-56" y="' + (-50 + f * 36) + '" width="112" height="28" rx="3" fill="' + ['#cfe7f2', '#f6e3c4', '#e7d9f0'][f] + '" stroke="#9aa3ad" stroke-width="2"/>';
        mp += '<rect x="-52" y="' + (-46 + f * 36) + '" width="14" height="20" fill="#9aa3ad"/>';
      }
      mp += '<path d="M-36,32 L-45,32 L-45,-36 L40,-36" fill="none" stroke="#c9412e" stroke-width="3" stroke-dasharray="5 4"/>';
      mp += '<path d="M-30,32 l3,-7 l3,7 l-7,-4 h8 Z" fill="#F8981F" stroke="#c9742a" stroke-width="1"/>';
      mp += '<rect x="36" y="-46" width="16" height="20" fill="#1f8a7e"/>';
      return mp + '</g>';
    }
    if (name === 'calculator') {
      var cs = '<g transform="translate(-70,-250) rotate(-8)"><rect x="-30" y="-48" width="60" height="96" rx="8" fill="#5b6b7c"/>' +
               '<rect x="-22" y="-40" width="44" height="24" rx="3" fill="#dfe9d3"/>';
      for (var r = 0; r < 3; r++) for (var k = 0; k < 3; k++) cs += '<rect x="' + (-22 + k * 16) + '" y="' + (-8 + r * 16) + '" width="12" height="11" rx="3" fill="' + (k === 2 ? '#F8981F' : '#fffdf8') + '"/>';
      return cs + '</g>';
    }
    if (name === 'paper') {
      return '<g transform="translate(74,-214) rotate(10)"><rect x="-24" y="-32" width="48" height="62" rx="3" fill="#fffdf8" stroke="#c9c2b3" stroke-width="2"/>' +
             '<path d="M-14,-18 L14,-18 M-14,-6 L14,-6 M-14,6 L10,6 M-14,18 L12,18" stroke="#9aa3ad" stroke-width="3"/></g>';
    }
    return '';
  }

  /* opts: {expr, pose:'idle'|'wave'|'point'|'spin'|'think'|'read'|'write', hold:'ball'|'sketchbook'|'paper'|'backpack'|'pencil'|'notebook'|'calculator'|'schedule'|'tray', talk:bool} */

  /* =================== SEASONS & HOLIDAYS (T-36) ===================
     The cast dresses for the time of year with no change to any episode.
     R.season() picks by today's date; override with ?season=NAME on any reel page
     (halloween, autumn, winter, lunar, valentine, spring, summer, none) or window.REEL_SEASON.
     Outfits are overlays: seasonBack() goes under the body (capes), seasonFront() on top
     (hats, scarves, pins). Backgrounds get matching set dressing from seasonDressing().
     Amira keeps her hijab in every season; hats sit over it. Nothing scary beyond a cat and a cape. */
  var LUNAR = { 2026: '02-17', 2027: '02-06', 2028: '01-26', 2029: '02-13', 2030: '02-03', 2031: '01-23' };
  function mmdd(d) { return (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate(); }
  R.seasonFor = function (d) {
    var md = mmdd(d), y = d.getFullYear();
    if (md >= '10-20' && md <= '10-31') return 'halloween';
    if (md >= '11-01' && md <= '11-30') return 'autumn';
    if (md >= '12-01' || md <= '01-10') return 'winter';
    var ln = LUNAR[y];
    if (ln) {
      var t = new Date(y, +ln.slice(0, 2) - 1, +ln.slice(3));
      var diff = (d - t) / 864e5;
      if (diff >= -9 && diff <= 6) return 'lunar';
    }
    if (md >= '02-10' && md <= '02-14') return 'valentine';
    if (md >= '03-15' && md <= '04-30') return 'spring';
    if (md >= '05-15' && md <= '06-30') return 'summer';
    return 'none';
  };
  var SEASONS = ['halloween', 'autumn', 'winter', 'lunar', 'valentine', 'spring', 'summer', 'none'];
  R.season = function () {
    var q = null;
    try { q = new URLSearchParams(location.search).get('season'); } catch (e) { q = null; }
    var v = q || window.REEL_SEASON;
    if (v && SEASONS.indexOf(v) >= 0) return v;
    return R.seasonFor(new Date());
  };
  R.SEASON_NAMES = { halloween: 'Halloween', autumn: 'Autumn', winter: 'Winter holidays', lunar: 'Lunar New Year',
                     valentine: 'Valentine’s Day', spring: 'Spring', summer: 'Summer', none: '' };

  /* per-character palette for knitwear so no two scarves match */
  var KNIT = { linh: '#d9567f', mateo: '#2f6fbd', amira: '#F8981F', jun: '#1f8a7e', paolo: '#864D9E' };
  var KNIT2 = { linh: '#f2c230', mateo: '#fffdf8', amira: '#864D9E', jun: '#f2c230', paolo: '#F8981F' };

  function headTopY(c) { return c.hair === 'hijab' ? -548 : -512; }
  function scarf(col, col2) {
    return '<g><rect x="-66" y="-372" width="132" height="36" rx="16" fill="' + col + '"/>' +
           '<path d="M-50,-354 L-30,-354 M-10,-354 L10,-354 M30,-354 L50,-354" stroke="' + col2 + '" stroke-width="6" stroke-linecap="round"/>' +
           '<g transform="translate(34,-346) rotate(8)"><rect x="-18" y="0" width="36" height="92" rx="12" fill="' + col + '"/>' +
           '<path d="M-10,70 L-10,86 M0,74 L0,90 M10,70 L10,86" stroke="' + col2 + '" stroke-width="5" stroke-linecap="round"/>' +
           '<path d="M-12,30 L12,30 M-12,48 L12,48" stroke="' + col2 + '" stroke-width="5" stroke-linecap="round"/></g></g>';
  }
  function beanie(c, col, col2) {
    var t = headTopY(c);
    return '<g><path d="M-74,' + (t + 34) + ' Q0,' + (t - 88) + ' 74,' + (t + 34) + ' Z" fill="' + col + '"/>' +
           '<path d="M-40,' + (t + 20) + ' Q-20,' + (t - 50) + ' 0,' + (t - 60) + ' M40,' + (t + 20) + ' Q20,' + (t - 50) + ' 0,' + (t - 60) + '" fill="none" stroke="' + col2 + '" stroke-width="5" opacity=".7"/>' +
           '<rect x="-76" y="' + (t + 10) + '" width="152" height="34" rx="12" fill="' + col2 + '"/>' +
           '<path d="M-60,' + (t + 18) + ' L-60,' + (t + 36) + ' M-40,' + (t + 18) + ' L-40,' + (t + 36) + ' M-20,' + (t + 18) + ' L-20,' + (t + 36) + ' M0,' + (t + 18) + ' L0,' + (t + 36) + ' M20,' + (t + 18) + ' L20,' + (t + 36) + ' M40,' + (t + 18) + ' L40,' + (t + 36) + ' M60,' + (t + 18) + ' L60,' + (t + 36) + '" stroke="' + col + '" stroke-width="4" opacity=".5"/>' +
           '<circle cx="0" cy="' + (t - 78) + '" r="20" fill="#fffdf8"/><circle cx="-6" cy="' + (t - 84) + '" r="7" fill="#eee9dc"/></g>';
  }
  function flowerAt(x, y, col, r) {
    r = r || 11;
    var f = '<g transform="translate(' + x + ',' + y + ')">';
    for (var k = 0; k < 5; k++) f += '<circle cx="' + (Math.cos(k * 1.257) * r).toFixed(1) + '" cy="' + (Math.sin(k * 1.257) * r).toFixed(1) + '" r="' + (r * .62).toFixed(1) + '" fill="' + col + '"/>';
    return f + '<circle r="' + (r * .5).toFixed(1) + '" fill="#f2c230"/></g>';
  }
  function heart(x, y, sz, col) {
    return '<path transform="translate(' + x + ',' + y + ') scale(' + sz + ')" d="M0,8 C-10,-2 -14,-10 -7,-14 C-3,-16 0,-13 0,-10 C0,-13 3,-16 7,-14 C14,-10 10,-2 0,8 Z" fill="' + col + '"/>';
  }
  function seasonBack(c, id) {
    var se = R.season();
    if (se === 'halloween' && id === 'jun') {   /* vampire cape */
      return '<path d="M-72,-352 C-120,-260 -140,-120 -150,-40 L150,-40 C140,-120 120,-260 72,-352 Z" fill="#3b1d3a"/>' +
             '<path d="M-60,-340 C-96,-260 -110,-140 -116,-56 L116,-56 C110,-140 96,-260 60,-340 Z" fill="#c9412e" opacity=".85"/>';
    }
    if (se === 'halloween' && id === 'paolo') {  /* Paolo the Great: royal cape */
      return '<path d="M-70,-352 C-110,-250 -126,-120 -134,-40 L134,-40 C126,-120 110,-250 70,-352 Z" fill="#864D9E"/>' +
             '<path d="M-56,-340 C-90,-250 -102,-140 -108,-56 L108,-56 C102,-140 90,-250 56,-340 Z" fill="#a66dc0" opacity=".9"/>';
    }
    return '';
  }
  function seasonFront(c, id, pose) {
    var se = R.season(), t = headTopY(c), s = '';
    if (se === 'none') return '';
    if (se === 'halloween') {
      if (id === 'linh') {           /* witch hat */
        s += '<ellipse cx="0" cy="' + (t + 14) + '" rx="100" ry="20" fill="#3b1d3a"/>' +
             '<path d="M-58,' + (t + 10) + ' C-30,' + (t - 60) + ' -10,' + (t - 120) + ' 12,' + (t - 168) + ' C20,' + (t - 110) + ' 40,' + (t - 50) + ' 58,' + (t + 10) + ' Z" fill="#4a2a52"/>' +
             '<path d="M-54,' + (t + 4) + ' C-40,' + (t - 10) + ' 40,' + (t - 10) + ' 54,' + (t + 4) + ' L50,' + (t - 14) + ' C36,' + (t - 26) + ' -36,' + (t - 26) + ' -50,' + (t - 14) + ' Z" fill="#F8981F"/>' +
             '<path d="M0,' + (t - 92) + ' l5,10 l11,1 l-8,7 l3,11 l-11,-6 l-11,6 l3,-11 l-8,-7 l11,-1 Z" fill="#f2c230"/>';
      } else if (id === 'amira') {   /* black cat on her shoulder + pumpkin pin */
        s += '<g transform="translate(-82,-350)"><ellipse cx="0" cy="0" rx="26" ry="18" fill="#2b2233"/><circle cx="-22" cy="-14" r="15" fill="#2b2233"/>' +
             '<path d="M-34,-24 L-32,-40 L-22,-28 Z M-10,-24 L-8,-40 L-18,-28 Z" fill="#2b2233"/>' +
             '<path d="M24,-4 Q46,-8 40,-30" fill="none" stroke="#2b2233" stroke-width="7" stroke-linecap="round"/>' +
             '<ellipse cx="-27" cy="-14" rx="3" ry="4" fill="#F8981F"/><ellipse cx="-17" cy="-14" rx="3" ry="4" fill="#F8981F"/></g>' +
             '<g transform="translate(46,-300)"><circle r="12" fill="#F8981F"/><path d="M-4,-4 L-1,-1 L-7,-1 Z M4,-4 L7,-1 L1,-1 Z M-6,4 Q0,9 6,4 L4,2 Q0,5 -4,2 Z" fill="#2b2233"/><rect x="-2" y="-16" width="4" height="6" fill="#1f8a7e"/></g>';
      } else if (id === 'mateo') {   /* pirate bandana + eye patch */
        s += '<path d="M-68,' + (t + 46) + ' Q0,' + (t - 44) + ' 68,' + (t + 46) + ' Q0,' + (t + 70) + ' -68,' + (t + 46) + ' Z" fill="#c9412e"/>';
        for (var i = 0; i < 7; i++) s += '<circle cx="' + (-48 + i * 16) + '" cy="' + (t + 22 - Math.abs(3 - i) * 7) + '" r="4" fill="#fffdf8"/>';
        s += '<path d="M-66,' + (t + 46) + ' L-98,' + (t + 70) + ' L-70,' + (t + 66) + ' L-94,' + (t + 96) + ' Z" fill="#c9412e"/>' +
             '<path d="M-60,-470 L58,-440" stroke="#2b2233" stroke-width="5"/><ellipse cx="22" cy="-452" rx="19" ry="17" fill="#2b2233"/>';
      } else if (id === 'jun') {     /* cape collar (cape itself is behind) */
        s += '<path d="M-36,-372 L-116,-312 L-24,-340 Z M36,-372 L116,-312 L24,-340 Z" fill="#3b1d3a"/>' +
             '<path d="M-28,-366 L-96,-318 L-22,-344 Z M28,-366 L96,-318 L22,-344 Z" fill="#c9412e" opacity=".85"/>';
      } else if (id === 'paolo') {   /* crown */
        s += '<path d="M-54,' + (t + 40) + ' L-54,' + (t - 10) + ' L-30,' + (t + 16) + ' L0,' + (t - 30) + ' L30,' + (t + 16) + ' L54,' + (t - 10) + ' L54,' + (t + 40) + ' Z" fill="#f2c230" stroke="#c9742a" stroke-width="3"/>' +
             '<circle cx="-54" cy="' + (t - 12) + '" r="6" fill="#c9412e"/><circle cx="0" cy="' + (t - 32) + '" r="7" fill="#2f6fbd"/><circle cx="54" cy="' + (t - 12) + '" r="6" fill="#c9412e"/>' +
             '<rect x="-54" y="' + (t + 26) + '" width="108" height="12" fill="#c9742a" opacity=".5"/>';
      }
    } else if (se === 'autumn') {
      var AC = { linh: '#c9742a', mateo: '#864D9E', amira: '#1f8a7e', jun: '#c9412e', paolo: '#f2c230' };
      s += scarf(AC[id] || '#c9742a', KNIT2[id] || '#fffdf8');
      if (id === 'paolo') s += '<path transform="translate(-60,-330) rotate(-30)" d="M0,-18 C8,-14 14,-6 12,4 C8,2 6,8 0,14 C-6,8 -8,2 -12,4 C-14,-6 -8,-14 0,-18 Z" fill="#c9412e"/>';
      if (id === 'linh') s += '<path transform="translate(50,-500) rotate(20)" d="M0,-14 C7,-10 11,-4 9,3 C6,2 5,6 0,11 C-5,6 -6,2 -9,3 C-11,-4 -7,-10 0,-14 Z" fill="#F8981F"/>';
    } else if (se === 'winter') {
      s += scarf(KNIT[id], KNIT2[id]);
      if (id === 'jun') {            /* earmuffs, so the glasses stay clear */
        s += '<path d="M-64,-466 Q0,-560 64,-466" fill="none" stroke="#1f8a7e" stroke-width="8"/>' +
             '<circle cx="-66" cy="-452" r="22" fill="#8fd3c6"/><circle cx="66" cy="-452" r="22" fill="#8fd3c6"/>' +
             '<circle cx="-66" cy="-452" r="12" fill="#1f8a7e" opacity=".4"/><circle cx="66" cy="-452" r="12" fill="#1f8a7e" opacity=".4"/>';
      } else {
        s += beanie(c, KNIT[id], KNIT2[id]);
      }
    } else if (se === 'lunar') {     /* red and gold for everyone */
      s += scarf('#c9412e', '#f2c230');
      s += '<g transform="translate(-44,-296)"><rect x="-13" y="-18" width="26" height="36" rx="3" fill="#c9412e" stroke="#f2c230" stroke-width="2"/><circle r="6" fill="#f2c230"/></g>';
      if (id === 'linh' || id === 'amira') s += '<path transform="translate(' + (id === 'linh' ? -58 : 0) + ',' + (t + 10) + ')" d="M-18,0 C-30,-12 -30,12 -18,0 L0,0 L18,0 C30,-12 30,12 18,0 Z" fill="#c9412e"/><circle cx="' + (id === 'linh' ? -58 : 0) + '" cy="' + (t + 10) + '" r="5" fill="#f2c230"/>';
    } else if (se === 'valentine') {
      s += heart(40, -300, 2.2, '#d9567f') + heart(40, -300, 1.1, '#fff0f5');
      if (id === 'amira') s += heart(-50, -520, 1.6, '#d9567f');
    } else if (se === 'spring') {
      var FC = { linh: '#d9567f', mateo: '#f2c230', amira: '#fffdf8', jun: '#2f6fbd', paolo: '#F8981F' };
      if (id === 'linh' || id === 'amira' || id === 'paolo') {
        s += '<path d="M-64,' + (t + 40) + ' Q0,' + (t - 2) + ' 64,' + (t + 40) + '" fill="none" stroke="#1f8a7e" stroke-width="5"/>';
        [-56, -28, 0, 28, 56].forEach(function (x, k) { s += flowerAt(x, t + 40 - (28 - Math.abs(x) / 2), k % 2 ? '#fffdf8' : FC[id], 10); });
      } else {
        s += flowerAt(44, -300, FC[id], 12) + '<path d="M44,-288 L44,-264" stroke="#1f8a7e" stroke-width="4"/>';
      }
    } else if (se === 'summer') {
      if (id === 'linh') {           /* straw sun hat */
        s += '<ellipse cx="0" cy="' + (t + 22) + '" rx="124" ry="24" fill="#e8c98a"/>' +
             '<path d="M-70,' + (t + 22) + ' Q0,' + (t - 70) + ' 70,' + (t + 22) + ' Z" fill="#f2d9a6"/>' +
             '<rect x="-72" y="' + (t + 4) + '" width="144" height="18" fill="#d9567f"/>';
      } else if (id === 'mateo') {   /* backwards cap */
        s += '<path d="M-70,' + (t + 40) + ' Q0,' + (t - 50) + ' 70,' + (t + 40) + ' Z" fill="#2f6fbd"/>' +
             '<path d="M-70,' + (t + 34) + ' L-130,' + (t + 46) + ' L-70,' + (t + 52) + ' Z" fill="#2f6fbd"/>' +
             '<circle cx="0" cy="' + (t - 46) + '" r="6" fill="#fffdf8"/>';
      } else if (id === 'amira') {   /* sunglasses */
        s += '<g fill="#2b2233"><rect x="-44" y="-466" width="40" height="26" rx="10"/><rect x="4" y="-466" width="40" height="26" rx="10"/><rect x="-6" y="-458" width="12" height="4"/></g>' +
             '<rect x="-38" y="-462" width="12" height="4" rx="2" fill="#fff" opacity=".6"/>';
      } else if (id === 'jun') {     /* sun visor */
        s += '<rect x="-66" y="' + (t + 28) + '" width="132" height="22" rx="10" fill="#1f8a7e"/>' +
             '<path d="M-60,' + (t + 40) + ' L-62,' + (t + 46) + ' Q0,' + (t + 96) + ' 62,' + (t + 46) + ' L60,' + (t + 40) + ' Z" fill="#8fd3c6"/>';
      } else if (id === 'paolo') {   /* flower lei */
        var cols = ['#d9567f', '#f2c230', '#F8981F', '#fffdf8'];
        for (var k2 = 0; k2 < 11; k2++) {
          var a = Math.PI * (0.1 + 0.8 * k2 / 10), lx = Math.cos(a) * 74, ly = -356 + Math.sin(a) * 60;
          s += flowerAt(lx.toFixed(1), ly.toFixed(1), cols[k2 % 4], 9);
        }
      }
    }
    return s;
  }
  /* set dressing along the top of every background */
  R.seasonDressing = function () {
    var se = R.season(), s = '', i;
    if (se === 'none' || se === 'valentine') {
      if (se === 'valentine') { for (i = 0; i < 9; i++) s += heart(120 + i * 170, 90 + (i % 2) * 30, 2.4, i % 3 ? '#d9567f' : '#c9412e'); }
      return s;
    }
    s += '<path d="M0,40 Q400,110 800,40 T1600,40" fill="none" stroke="#5b6b7c" stroke-width="3"/>';
    for (i = 0; i < 10; i++) {
      var x = 80 + i * 160, y = 40 + 35 * Math.abs(Math.sin(Math.PI * x / 800));
      if (se === 'halloween') {
        if (i % 2) s += '<g transform="translate(' + x + ',' + (y + 30) + ')"><circle r="22" fill="#F8981F"/><rect x="-3" y="-30" width="6" height="10" fill="#1f8a7e"/><path d="M-9,-6 L-4,0 L-14,0 Z M9,-6 L14,0 L4,0 Z M-10,8 Q0,16 10,8 L7,5 Q0,10 -7,5 Z" fill="#2b2233"/></g>';
        else s += '<path transform="translate(' + x + ',' + (y + 26) + ')" d="M0,0 C-8,-10 -22,-12 -34,-2 C-28,-14 -18,-18 -10,-14 L-6,-20 L0,-14 L6,-20 L10,-14 C18,-18 28,-14 34,-2 C22,-12 8,-10 0,0 Z" fill="#2b2233"><animateTransform attributeName="transform" type="translate" values="' + x + ' ' + (y + 26) + ';' + (x + 6) + ' ' + (y + 18) + ';' + x + ' ' + (y + 26) + '" dur="2.4s" repeatCount="indefinite"/></path>';
      } else if (se === 'autumn') {
        var lc = ['#c9412e', '#F8981F', '#f2c230', '#c9742a'][i % 4];
        s += '<path transform="translate(' + x + ',' + (y + 10) + ') rotate(' + (i * 37 % 60 - 30) + ')" d="M0,0 C10,6 18,16 14,30 C8,27 6,34 0,42 C-6,34 -8,27 -14,30 C-18,16 -10,6 0,0 Z" fill="' + lc + '"/>';
      } else if (se === 'winter') {
        var bc = ['#c9412e', '#f2c230', '#1f8a7e', '#2f6fbd', '#d9567f'][i % 5];
        s += '<path d="M' + x + ',' + y + ' L' + x + ',' + (y + 14) + '" stroke="#5b6b7c" stroke-width="3"/><circle cx="' + x + '" cy="' + (y + 32) + '" r="18" fill="' + bc + '"/><circle cx="' + (x - 6) + '" cy="' + (y + 26) + '" r="5" fill="#fff" opacity=".6"/>';
      } else if (se === 'lunar') {
        s += '<g transform="translate(' + x + ',' + y + ')"><path d="M0,0 L0,16" stroke="#f2c230" stroke-width="3"/><rect x="-20" y="16" width="40" height="8" rx="3" fill="#f2c230"/>' +
             '<ellipse cx="0" cy="48" rx="26" ry="30" fill="#c9412e"/><path d="M-12,24 L-12,72 M0,20 L0,76 M12,24 L12,72" stroke="#a52e22" stroke-width="2"/>' +
             '<rect x="-20" y="72" width="40" height="8" rx="3" fill="#f2c230"/><path d="M-8,80 L-8,104 M0,80 L0,108 M8,80 L8,104" stroke="#f2c230" stroke-width="3"/></g>';
      } else if (se === 'spring') {
        s += flowerAt(x, y + 18, ['#d9567f', '#fffdf8', '#F8981F', '#8fd3c6'][i % 4], 14) + '<path d="M' + x + ',' + y + ' L' + x + ',' + (y + 8) + '" stroke="#1f8a7e" stroke-width="3"/>';
      } else if (se === 'summer') {
        var pc = ['#F8981F', '#2f6fbd', '#f2c230', '#1f8a7e', '#d9567f'][i % 5];
        s += '<path d="M' + (x - 22) + ',' + y + ' L' + (x + 22) + ',' + y + ' L' + x + ',' + (y + 46) + ' Z" fill="' + pc + '"/>';
      }
    }
    return s;
  };

  R.drawChar = function (id, opts) {
    var c = R.CAST[id]; if (!c) return '';
    opts = opts || {};
    var expr = opts.expr || 'smile', pose = opts.pose || 'idle';
    var brow = BROWS[EXPR_BROWS[expr] || 'base'];
    var s = '';
    /* shadow */
    s += '<ellipse cx="0" cy="4" rx="82" ry="14" fill="#000" opacity=".13"/>';
    s += seasonBack(c, id);
    /* legs + shoes */
    s += '<rect x="-38" y="-192" width="32" height="186" rx="14" fill="' + c.pants + '"/>';
    s += '<rect x="6" y="-192" width="32" height="186" rx="14" fill="' + c.pants + '"/>';
    s += '<ellipse cx="-24" cy="-6" rx="30" ry="12" fill="' + c.shoes + '" stroke="#2b2233" stroke-width="2"/>';
    s += '<ellipse cx="24" cy="-6" rx="30" ry="12" fill="' + c.shoes + '" stroke="#2b2233" stroke-width="2"/>';
    /* back hair behind everything above */
    s += hairBack(c);
    /* arms behind torso */
    var la = 10, ra = -10, wave = false;
    if (pose === 'wave') { ra = -150; wave = true; }
    if (pose === 'point') { ra = -80; }
    if (pose === 'think') { ra = -155; }
    if (pose === 'spin') { la = 60; ra = -60; }
    var board = (pose === 'read' || pose === 'write');
    if (board) { la = -8; ra = pose === 'write' ? 20 : 8; }
    s += arm(c, -1, la, false, board);
    s += torso(c, opts.face || 1);
    if (c.hair === 'hijab') s += '<path d="M-62,-444 C-60,-380 -30,-338 0,-332 C30,-338 60,-380 62,-444 Z" fill="' + c.hairColor + '"/>';
    s += arm(c, 1, ra, wave, board);
    if (board) {
      s += '<g transform="translate(0,-270)"><rect x="-48" y="-64" width="96" height="128" rx="7" fill="#9c7650"/>' +
           '<rect x="-41" y="-55" width="82" height="112" rx="2" fill="#fffdf8"/>' +
           '<path d="M-30,-30 L30,-30 M-30,-14 L30,-14 M-30,2 L22,2 M-30,18 L28,18 M-30,34 L16,34" stroke="#9aa3ad" stroke-width="3"/>' +
           '<rect x="-17" y="-70" width="34" height="14" rx="4" fill="#8b8f98"/></g>';
      s += '<circle cx="-42" cy="-212" r="15" fill="' + c.skin + '"/>';
      if (pose === 'write') {
        s += '<g><animateTransform attributeName="transform" type="translate" values="0 0;12 2;2 7;14 4;0 0" dur="0.8s" repeatCount="indefinite"/>' +
             '<path d="M8,-258 L30,-298" stroke="#f2c230" stroke-width="8" stroke-linecap="round"/>' +
             '<path d="M8,-258 L4,-250" stroke="#2b2233" stroke-width="4" stroke-linecap="round"/>' +
             '<circle cx="24" cy="-286" r="14" fill="' + c.skin + '"/></g>';
      } else {
        s += '<circle cx="42" cy="-212" r="15" fill="' + c.skin + '"/>';
      }
    }
    /* neck + head */
    if (c.hair !== 'hijab') s += '<rect x="-15" y="-398" width="30" height="34" rx="8" fill="' + shade(c.skin, -14) + '"/>';
    if (c.hair !== 'hijab') {
      s += '<ellipse cx="-61" cy="-446" rx="11" ry="15" fill="' + shade(c.skin, -10) + '"/>';
      s += '<ellipse cx="61" cy="-446" rx="11" ry="15" fill="' + shade(c.skin, -10) + '"/>';
    }
    var rx = c.hair === 'hijab' ? 56 : 62, ry = c.hair === 'hijab' ? 64 : 68;
    s += '<ellipse cx="0" cy="-450" rx="' + rx + '" ry="' + ry + '" fill="' + c.skin + '"/>';
    /* cheeks */
    s += '<circle cx="-36" cy="-424" r="10" fill="#e8736b" opacity="' + (expr === 'shy' || expr === 'nervous' ? '.45' : '.2') + '"/>';
    s += '<circle cx="36" cy="-424" r="10" fill="#e8736b" opacity="' + (expr === 'shy' || expr === 'nervous' ? '.45' : '.2') + '"/>';
    /* eyes (blink) */
    var eyeY = expr === 'shy' ? -446 : (expr === 'reading' ? -442 : -452), eyeR = expr === 'reading' ? 5.5 : 9;
    s += '<g class="eyes"><ellipse cx="-22" cy="' + eyeY + '" rx="7" ry="' + eyeR + '" fill="#2b2233"/><ellipse cx="22" cy="' + eyeY + '" rx="7" ry="' + eyeR + '" fill="#2b2233"/>' +
         '<circle cx="-19" cy="' + (eyeY - 3) + '" r="2.4" fill="#fff"/><circle cx="25" cy="' + (eyeY - 3) + '" r="2.4" fill="#fff"/></g>';
    s += '<path d="' + brow[0] + '" fill="none" stroke="' + shade(c.hairColor === '#2a9d8f' ? '#3a2a22' : c.hairColor, 10) + '" stroke-width="5" stroke-linecap="round"/>';
    s += '<path d="' + brow[1] + '" fill="none" stroke="' + shade(c.hairColor === '#2a9d8f' ? '#3a2a22' : c.hairColor, 10) + '" stroke-width="5" stroke-linecap="round"/>';
    /* mouth: static + talking version, CSS decides which shows */
    s += '<g class="m-static">' + (MOUTH[expr] || MOUTH.smile) + '</g>';
    s += '<ellipse class="m-talk" cx="0" cy="-410" rx="11" ry="9" fill="#7a2e2e"/>';
    s += hairFront(c);
    if (c.glasses) {
      s += '<g fill="none" stroke="#2b2233" stroke-width="4.5"><circle cx="-22" cy="-452" r="17"/><circle cx="22" cy="-452" r="17"/><path d="M-5,-454 Q0,-458 5,-454"/></g>';
    }
    s += prop(c);
    if (opts.hold && !(board && opts.hold === 'paper')) s += heldProp(opts.hold);
    s += seasonFront(c, id, pose);
    var cls = 'ch ch-' + id + (pose === 'spin' ? ' spin' : '') + (opts.talk ? ' talking' : '');
    return '<g class="' + cls + '"><g class="bob">' + s + '</g></g>';
  };

  /* place a character on the stage */
  R.placeChar = function (id, x, face, opts) {
    var c = R.CAST[id]; if (!c) return '';
    var sc = c.h;
    return '<g transform="translate(' + x + ',' + R.GROUND + ') scale(' + (sc * (face < 0 ? -1 : 1)) + ',' + sc + ')">' +
           R.drawChar(id, { expr: opts.expr, pose: opts.pose, hold: opts.hold, face: face }) + '</g>';
  };
  R.headTop = function (id) { var c = R.CAST[id]; return R.GROUND - 540 * (c ? c.h : 1); };

  /* ---------- scenery ---------- */
  function floor(col) {
    var s = '<rect x="0" y="640" width="1600" height="260" fill="' + col + '"/>';
    for (var i = 0; i < 7; i++) {
      s += '<path d="M0,' + (660 + i * i * 7) + ' L1600,' + (660 + i * i * 7) + '" stroke="' + shade(col, -14) + '" stroke-width="2" opacity=".5"/>';
    }
    return s;
  }
  function bayWindow(x, y, w, h) {
    var s = '<rect x="' + (x - 14) + '" y="' + (y - 14) + '" width="' + (w + 28) + '" height="' + (h + 28) + '" rx="6" fill="#fbfaf7"/>';
    s += '<defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8fcbea"/><stop offset="1" stop-color="#dff1f8"/></linearGradient></defs>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="url(#sky)"/>';
    s += '<path d="M' + x + ',' + (y + h * 0.72) + ' Q' + (x + w * 0.3) + ',' + (y + h * 0.55) + ' ' + (x + w * 0.55) + ',' + (y + h * 0.68) + ' T' + (x + w) + ',' + (y + h * 0.62) + ' L' + (x + w) + ',' + (y + h) + ' L' + x + ',' + (y + h) + ' Z" fill="#86a874"/>';
    s += '<rect x="' + x + '" y="' + (y + h * 0.78) + '" width="' + w + '" height="' + (h * 0.22) + '" fill="#4f8fbf"/>';
    /* a small red bridge on the bay */
    var bx = x + w * 0.18, by = y + h * 0.78, bw = w * 0.62;
    s += '<g stroke="#c9412e" stroke-width="4" fill="none">' +
         '<path d="M' + bx + ',' + by + ' L' + (bx + bw) + ',' + by + '"/>' +
         '<path d="M' + (bx + bw * 0.25) + ',' + by + ' L' + (bx + bw * 0.25) + ',' + (by - 62) + ' M' + (bx + bw * 0.75) + ',' + by + ' L' + (bx + bw * 0.75) + ',' + (by - 62) + '"/>' +
         '<path d="M' + bx + ',' + (by - 8) + ' Q' + (bx + bw * 0.12) + ',' + (by - 14) + ' ' + (bx + bw * 0.25) + ',' + (by - 60) + ' Q' + (bx + bw * 0.5) + ',' + (by - 6) + ' ' + (bx + bw * 0.75) + ',' + (by - 60) + ' Q' + (bx + bw * 0.88) + ',' + (by - 14) + ' ' + (bx + bw) + ',' + (by - 8) + '" stroke-width="2.5"/></g>';
    s += '<path d="M' + (x + w / 2) + ',' + y + ' L' + (x + w / 2) + ',' + (y + h) + ' M' + x + ',' + (y + h / 2) + ' L' + (x + w) + ',' + (y + h / 2) + '" stroke="#fbfaf7" stroke-width="10"/>';
    return s;
  }
  function desks(y) {
    var s = '';
    for (var i = 0; i < 4; i++) {
      var x = 90 + i * 400;
      s += '<rect x="' + (x + 20) + '" y="' + (y + 20) + '" width="10" height="90" fill="#8b8f98"/><rect x="' + (x + 230) + '" y="' + (y + 20) + '" width="10" height="90" fill="#8b8f98"/>';
      s += '<rect x="' + x + '" y="' + y + '" width="260" height="24" rx="6" fill="#c89a62"/>';
    }
    return s;
  }
  function greetingsPoster(x, y) {
    var words = ['Hello', 'Hola', 'Xin chào', '你好', 'مرحبا', 'Kumusta', 'Привет', 'Salaan'];
    var cols = ['#864D9E', '#d9567f', '#1f8a7e', '#c9412e', '#2f6fbd', '#b8860b', '#5b6b7c', '#864D9E'];
    var s = '<rect x="' + x + '" y="' + y + '" width="230" height="300" rx="8" fill="#fffdf8" stroke="#e0d7c8" stroke-width="3"/>';
    for (var i = 0; i < words.length; i++) {
      s += '<text x="' + (x + 115) + '" y="' + (y + 44 + i * 34) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="' + (i === 0 ? 30 : 24) + '" fill="' + cols[i] + '">' + words[i] + '</text>';
    }
    return s;
  }
  function clock(x, y) {
    return '<circle cx="' + x + '" cy="' + y + '" r="40" fill="#fff" stroke="#2b2233" stroke-width="6"/>' +
           '<path d="M' + x + ',' + y + ' L' + x + ',' + (y - 27) + '" stroke="#2b2233" stroke-width="4" stroke-linecap="round"/>' +
           '<path d="M' + x + ',' + y + ' L' + (x - 9) + ',' + (y - 16) + '" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>';
  }

  R.BG = {};
  R.BG.classroom = function (board) {
    var s = '<rect width="1600" height="900" fill="#d6e5df"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#cadbd4"/>';
    s += bayWindow(1140, 130, 360, 320);
    s += '<rect x="380" y="100" width="660" height="320" rx="8" fill="#9aa3ad"/><rect x="394" y="114" width="632" height="292" rx="4" fill="#fbfdfd"/>';
    var b = board || ['ELD 101', 'Talk to every classmate!'];
    s += '<text x="430" y="190" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="54" fill="#864D9E">' + b[0] + '</text>';
    s += '<text x="430" y="262" font-family="Nunito,Arial,sans-serif" font-style="italic" font-weight="700" font-size="38" fill="#2f6fbd">' + (b[1] || '') + '</text>';
    if (b[2]) s += '<text x="430" y="322" font-family="Nunito,Arial,sans-serif" font-style="italic" font-weight="700" font-size="34" fill="#c9412e">' + b[2] + '</text>';
    s += greetingsPoster(110, 130);
    s += clock(1070, 70);
    s += '<rect x="0" y="628" width="1600" height="16" fill="#b7c9c1"/>';
    s += floor('#caa77a');
    s += desks(560);
    return s;
  };
  R.BG.hallway = function () {
    var s = '<rect width="1600" height="900" fill="#e7e1ef"/>';
    s += '<rect x="0" y="0" width="1600" height="40" fill="#d7cfe3"/>';
    for (var l = 0; l < 4; l++) s += '<rect x="' + (120 + l * 400) + '" y="10" width="200" height="14" rx="7" fill="#fffbe8"/>';
    s += '<rect x="330" y="80" width="560" height="84" rx="10" fill="#F8981F"/>';
    s += '<text x="610" y="136" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="46" fill="#fff">Welcome to Galileo</text>';
    for (var i = 0; i < 12; i++) {
      var x = i * 106, col = i % 2 ? '#7e57a8' : '#8b63b5';
      if (x > 1180) break;
      s += '<rect x="' + x + '" y="220" width="102" height="410" fill="' + col + '"/>';
      for (var v = 0; v < 4; v++) s += '<rect x="' + (x + 26) + '" y="' + (250 + v * 12) + '" width="50" height="5" rx="2" fill="' + shade(col, -30) + '"/>';
      s += '<rect x="' + (x + 80) + '" y="400" width="8" height="40" rx="3" fill="#d9d2e6"/>';
    }
    s += '<rect x="1260" y="200" width="230" height="440" rx="6" fill="#b98b5a"/><rect x="1300" y="240" width="150" height="120" rx="4" fill="#cfe7f2"/>';
    s += '<rect x="1310" y="170" width="130" height="40" rx="8" fill="#fff"/><text x="1375" y="199" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="26" fill="#864D9E">ELD 101</text>';
    s += '<circle cx="1455" cy="440" r="10" fill="#e9d38a"/>';
    s += '<rect x="0" y="626" width="1600" height="16" fill="#cfc4de"/>';
    s += floor('#d2c9ba');
    s += '<rect x="0" y="700" width="1600" height="30" fill="#fff" opacity=".18"/>';
    return s;
  };
  R.BG.corner = function () {
    var s = '<rect width="1600" height="900" fill="#d6e5df"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#cadbd4"/>';
    s += '<rect x="980" y="170" width="440" height="460" fill="#9c7650"/>';
    var bc = ['#864D9E', '#F8981F', '#2f6fbd', '#1f8a7e', '#d9567f', '#c9412e', '#5b6b7c'];
    for (var r = 0; r < 3; r++) {
      s += '<rect x="990" y="' + (315 + r * 150) + '" width="420" height="12" fill="#7d5c3c"/>';
      for (var k = 0; k < 9; k++) {
        var bh = 90 + ((k * 37 + r * 11) % 30);
        s += '<rect x="' + (1004 + k * 44) + '" y="' + (315 + r * 150 - bh) + '" width="36" height="' + bh + '" rx="3" fill="' + bc[(k + r * 2) % bc.length] + '"/>';
      }
    }
    s += '<path d="M300,630 q-30,-120 40,-200 q60,70 20,200 Z" fill="#5f9d62"/><path d="M340,630 q60,-140 130,-150 q-10,110 -80,150 Z" fill="#78b56f"/>';
    s += '<rect x="290" y="600" width="120" height="70" rx="10" fill="#c9412e"/>';
    s += '<rect x="520" y="150" width="300" height="200" rx="6" fill="#fffdf8" stroke="#e0d7c8" stroke-width="3"/>';
    s += '<text x="670" y="235" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="40" fill="#1f8a7e">Music</text>';
    s += '<text x="670" y="290" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-size="46" fill="#864D9E">♪ ♫ ♪</text>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#b7c9c1"/>';
    s += floor('#caa77a');
    /* a keyboard piano on a stand, under the Music poster */
    s += '<rect x="540" y="700" width="10" height="110" fill="#2b2233"/><rect x="790" y="700" width="10" height="110" fill="#2b2233"/>';
    s += '<rect x="520" y="660" width="300" height="46" rx="6" fill="#2b2233"/><rect x="530" y="668" width="280" height="30" fill="#fffdf8"/>';
    for (var kk = 0; kk < 20; kk++) {
      s += '<path d="M' + (544 + kk * 14) + ',668 L' + (544 + kk * 14) + ',698" stroke="#c9c2b3" stroke-width="1.5"/>';
      if (kk % 7 !== 2 && kk % 7 !== 6) s += '<rect x="' + (539 + kk * 14) + '" y="668" width="9" height="18" fill="#2b2233"/>';
    }
    return s;
  };
  /* ---------- Episode 2 places ---------- */
  function shelf(x, y, w, rows) {
    var bc = ['#864D9E', '#F8981F', '#2f6fbd', '#1f8a7e', '#d9567f', '#c9412e', '#5b6b7c'], s = '';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (rows * 150 + 20) + '" fill="#9c7650"/>';
    for (var r = 0; r < rows; r++) {
      s += '<rect x="' + (x + 10) + '" y="' + (y + 145 + r * 150) + '" width="' + (w - 20) + '" height="12" fill="#7d5c3c"/>';
      for (var k = 0; k < Math.floor((w - 30) / 44); k++) {
        var bh = 90 + ((k * 37 + r * 11 + x) % 30);
        s += '<rect x="' + (x + 24 + k * 44) + '" y="' + (y + 145 + r * 150 - bh) + '" width="36" height="' + bh + '" rx="3" fill="' + bc[(k + r * 2 + x / 10) % bc.length | 0] + '"/>';
      }
    }
    return s;
  }
  function sign(x, y, w, word, col) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="72" rx="10" fill="' + (col || '#864D9E') + '"/>' +
           '<text x="' + (x + w / 2) + '" y="' + (y + 50) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="42" fill="#fff">' + word + '</text>';
  }
  R.BG.library = function () {
    var s = '<rect width="1600" height="900" fill="#f1e9d8"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#e4d9c3"/>';
    s += shelf(60, 170, 420, 3) + shelf(1120, 170, 420, 3);
    s += sign(620, 90, 360, 'Library');
    s += '<rect x="560" y="200" width="480" height="240" rx="8" fill="#fffdf8" stroke="#e0d7c8" stroke-width="3"/>';
    s += '<text x="800" y="290" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="40" fill="#1f8a7e">Quiet, please</text>';
    s += '<text x="800" y="360" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-size="60" fill="#864D9E">📚 🤫</text>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#d9ccb0"/>';
    s += floor('#b9c7d6');
    /* reading table with two books */
    s += '<rect x="560" y="720" width="12" height="100" fill="#7d5c3c"/><rect x="1028" y="720" width="12" height="100" fill="#7d5c3c"/>';
    s += '<rect x="520" y="700" width="560" height="26" rx="6" fill="#c89a62"/>';
    s += '<rect x="620" y="682" width="90" height="20" rx="3" fill="#2f6fbd"/><rect x="880" y="682" width="90" height="20" rx="3" fill="#c9412e"/>';
    return s;
  };
  R.BG.gym = function () {
    var s = '<rect width="1600" height="900" fill="#e8ddd0"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#d8ccbc"/>';
    for (var i = 0; i < 4; i++) s += '<rect x="' + (120 + i * 400) + '" y="14" width="200" height="14" rx="7" fill="#fffbe8"/>';
    s += '<rect x="120" y="150" width="520" height="100" rx="12" fill="#864D9E"/>';
    s += '<text x="380" y="216" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="52" fill="#F8981F">GO LIONS!</text>';
    s += sign(700, 90, 260, 'Gym', '#1f8a7e');
    /* basketball hoop */
    s += '<rect x="1300" y="150" width="200" height="140" rx="6" fill="#fffdf8" stroke="#2b2233" stroke-width="6"/><rect x="1350" y="200" width="100" height="70" fill="none" stroke="#c9412e" stroke-width="6"/>';
    s += '<ellipse cx="1400" cy="290" rx="52" ry="12" fill="none" stroke="#F8981F" stroke-width="8"/>';
    s += '<path d="M1352,296 L1366,360 M1376,298 L1384,362 M1400,300 L1400,364 M1424,298 L1416,362 M1448,296 L1434,360 M1356,330 L1444,330 M1368,350 L1432,350" stroke="#fff" stroke-width="3"/>';
    s += '<rect x="1394" y="290" width="12" height="340" fill="#8b8f98"/>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#cbbfae"/>';
    s += floor('#d6a564');
    s += '<path d="M0,760 L1600,760" stroke="#864D9E" stroke-width="8"/><circle cx="800" cy="760" r="90" fill="none" stroke="#864D9E" stroke-width="8"/>';
    return s;
  };
  R.BG.lab = function () {
    var s = '<rect width="1600" height="900" fill="#e7eef0"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#d7e2e5"/>';
    s += sign(620, 90, 360, 'Science', '#1f8a7e');
    /* periodic-table poster */
    s += '<rect x="90" y="170" width="420" height="250" rx="8" fill="#fffdf8" stroke="#2b2233" stroke-width="5"/>';
    var pc = ['#F8981F', '#2f6fbd', '#1f8a7e', '#d9567f', '#864D9E', '#c9412e'];
    for (var r = 0; r < 5; r++) for (var k = 0; k < 10; k++) {
      s += '<rect x="' + (108 + k * 39) + '" y="' + (188 + r * 44) + '" width="33" height="38" rx="4" fill="' + pc[(k + r) % 6] + '" opacity=".85"/>';
    }
    /* whiteboard with a diagram */
    s += '<rect x="1050" y="170" width="460" height="250" rx="8" fill="#fffdf8" stroke="#c9c2b3" stroke-width="6"/>';
    s += '<circle cx="1230" cy="296" r="30" fill="#f2c230"/><ellipse cx="1230" cy="296" rx="86" ry="34" fill="none" stroke="#2f6fbd" stroke-width="5"/>';
    s += '<ellipse cx="1230" cy="296" rx="86" ry="34" fill="none" stroke="#c9412e" stroke-width="5" transform="rotate(62,1230,296)"/>';
    s += '<circle cx="1316" cy="296" r="11" fill="#2f6fbd"/><circle cx="1190" cy="228" r="9" fill="#c9412e"/>';
    s += '<text x="1420" y="400" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="34" fill="#1f8a7e">H O</text>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#c6d2d6"/>';
    s += floor('#9fb2bb');
    /* black lab bench with a sink, beakers and a burner */
    s += '<rect x="500" y="690" width="680" height="30" rx="6" fill="#2b2233"/><rect x="520" y="720" width="640" height="100" fill="#5b6b7c"/>';
    s += '<rect x="548" y="736" width="130" height="64" rx="6" fill="#9aa3ad"/><path d="M613,736 L613,700 Q613,686 638,686" fill="none" stroke="#c0c7cf" stroke-width="9"/>';
    s += '<path d="M744,690 L724,604 L804,604 L784,690 Z" fill="#cfe7f2" opacity=".92" stroke="#8fd3c6" stroke-width="4"/>';
    s += '<path d="M757,690 L748,648 L780,648 L771,690 Z" fill="#1f8a7e" opacity=".6"/>';
    s += '<rect x="738" y="592" width="76" height="14" rx="5" fill="#8fd3c6"/>';
    s += '<rect x="872" y="614" width="78" height="76" rx="5" fill="#cfe7f2" stroke="#9aa3ad" stroke-width="4"/>';
    s += '<rect x="876" y="652" width="70" height="38" fill="#F8981F" opacity=".65"/>';
    s += '<path d="M940,628 L950,628 M940,644 L950,644 M940,660 L950,660" stroke="#5b6b7c" stroke-width="3"/>';
    s += '<rect x="1016" y="664" width="42" height="26" rx="4" fill="#2b2233"/><rect x="1031" y="616" width="12" height="50" fill="#5b6b7c"/>';
    s += '<path d="M1037,616 q-18,-34 0,-56 q18,22 0,56 Z" fill="#F8981F"/><path d="M1037,606 q-8,-18 0,-30 q8,12 0,30 Z" fill="#f2c230"/>';
    /* safety goggles on a hook */
    s += '<g transform="translate(300,470)"><rect x="-44" y="-16" width="88" height="32" rx="14" fill="#8fd3c6" opacity=".8" stroke="#1f8a7e" stroke-width="4"/><path d="M-44,0 L-62,-10 M44,0 L62,-10" stroke="#2b2233" stroke-width="5"/></g>';
    return s;
  };
  R.BG.art = function () {
    var s = '<rect width="1600" height="900" fill="#fdf1e2"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#f4e2cc"/>';
    s += sign(640, 90, 320, 'Art', '#d9567f');
    /* finished paintings on the wall */
    var fr = [[90, 180, 230, 170, '#2f6fbd'], [350, 200, 190, 150, '#1f8a7e'], [1120, 180, 200, 160, '#F8981F'], [1360, 210, 170, 140, '#864D9E']];
    fr.forEach(function (f, i) {
      s += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" fill="#fffdf8" stroke="#9c7650" stroke-width="8"/>';
      if (i % 2) {
        s += '<circle cx="' + (f[0] + f[2] / 2) + '" cy="' + (f[1] + f[3] * .4) + '" r="' + (f[3] * .22) + '" fill="' + f[4] + '"/>' +
             '<path d="M' + (f[0] + 14) + ',' + (f[1] + f[3] - 16) + ' L' + (f[0] + f[2] / 2) + ',' + (f[1] + f[3] * .5) + ' L' + (f[0] + f[2] - 14) + ',' + (f[1] + f[3] - 16) + ' Z" fill="#1f8a7e" opacity=".8"/>';
      } else {
        s += '<rect x="' + (f[0] + 16) + '" y="' + (f[1] + 16) + '" width="' + (f[2] - 32) + '" height="' + (f[3] / 3) + '" fill="' + f[4] + '" opacity=".8"/>' +
             '<rect x="' + (f[0] + 16) + '" y="' + (f[1] + 20 + f[3] / 3) + '" width="' + (f[2] - 32) + '" height="' + (f[3] / 4) + '" fill="#f2c230" opacity=".8"/>';
      }
    });
    s += '<rect x="0" y="628" width="1600" height="16" fill="#e8d2b4"/>';
    s += floor('#c89a62');
    /* easel with a half-finished painting */
    s += '<path d="M60,820 L150,560 M300,820 L210,560 M180,820 L180,600" stroke="#9c7650" stroke-width="14" stroke-linecap="round"/>';
    s += '<rect x="76" y="470" width="208" height="166" fill="#fffdf8" stroke="#9c7650" stroke-width="8"/>';
    s += '<path d="M88,590 L180,502 L272,590 Z" fill="#8fd3c6"/><circle cx="140" cy="520" r="20" fill="#f2c230"/>';
    s += '<path d="M88,604 L272,604" stroke="#1f8a7e" stroke-width="10"/>';
    s += '<rect x="64" y="632" width="232" height="18" rx="5" fill="#9c7650"/>';
    /* work table with paint jars and a brush pot */
    s += '<rect x="1000" y="692" width="430" height="26" rx="6" fill="#c89a62"/><rect x="1016" y="718" width="14" height="102" fill="#9c7650"/><rect x="1400" y="718" width="14" height="102" fill="#9c7650"/>';
    ['#c9412e', '#F8981F', '#f2c230', '#1f8a7e', '#2f6fbd'].forEach(function (c, i) {
      var jx = 1020 + i * 62;
      s += '<rect x="' + jx + '" y="634" width="48" height="58" rx="7" fill="#cfe7f2" stroke="#9aa3ad" stroke-width="3"/>' +
           '<rect x="' + (jx + 5) + '" y="658" width="38" height="30" rx="3" fill="' + c + '"/>' +
           '<rect x="' + (jx + 2) + '" y="628" width="44" height="10" rx="4" fill="' + c + '"/>';
    });
    s += '<rect x="1336" y="628" width="64" height="64" rx="8" fill="#9aa3ad"/>';
    ['#c9412e', '#f2c230', '#2f6fbd'].forEach(function (c, i) {
      s += '<path d="M' + (1352 + i * 16) + ',628 L' + (1346 + i * 16) + ',556" stroke="#9c7650" stroke-width="6"/>' +
           '<path d="M' + (1346 + i * 16) + ',556 l-6,-16 l12,0 Z" fill="' + c + '"/>';
    });
    return s;
  };
  R.BG.lunchline = function () {
    var s = '<rect width="1600" height="900" fill="#fbead6"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#f1dcc2"/>';
    s += sign(560, 80, 480, 'Lunch line', '#c9412e');
    /* menu board */
    s += '<rect x="90" y="160" width="400" height="250" rx="10" fill="#2b2233"/>';
    s += '<text x="290" y="216" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="36" fill="#fffdf8">Today</text>';
    ['Pizza', 'Rice and beans', 'Salad', 'Milk'].forEach(function (t, i) {
      s += '<text x="120" y="' + (266 + i * 38) + '" font-family="Nunito,Arial,sans-serif" font-weight="700" font-size="28" fill="' + ['#F8981F', '#8fd3c6', '#f2c230', '#cfe7f2'][i] + '">' + t + '</text>';
    });
    /* the food service worker behind the counter: hairnet, apron, serving spoon */
    s += '<g transform="translate(1180,250)">';
    s += '<rect x="-86" y="66" width="172" height="250" rx="40" fill="#1f8a7e"/>';
    s += '<rect x="-54" y="116" width="108" height="200" rx="12" fill="#fffdf8"/>';
    s += '<path d="M-54,116 L-18,74 M54,116 L18,74" stroke="#fffdf8" stroke-width="10"/>';
    s += '<circle cx="0" cy="0" r="74" fill="#c98f63"/>';
    s += '<path d="M-74,-10 A74,74 0 0 1 74,-10 Z" fill="#5b4536"/>';
    s += '<path d="M-77,-12 A77,77 0 0 1 77,-12" fill="none" stroke="#cfe7f2" stroke-width="9"/>';
    s += '<circle cx="-26" cy="8" r="8" fill="#2b2233"/><circle cx="26" cy="8" r="8" fill="#2b2233"/>';
    s += '<path d="M-22,38 q22,18 44,0" fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>';
    s += '<path d="M-86,130 L-150,74" stroke="#c98f63" stroke-width="22" stroke-linecap="round"/>';
    s += '<path d="M-150,74 L-212,40" stroke="#9aa3ad" stroke-width="11" stroke-linecap="round"/><ellipse cx="-222" cy="34" rx="28" ry="18" fill="#c0c7cf" transform="rotate(-28,-222,34)"/>';
    s += '</g>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#e8cdb0"/>';
    s += floor('#e2d4c0');
    /* the counter: sneeze guard, hot pans of food, stack of trays, napkins and forks */
    s += '<rect x="120" y="560" width="1240" height="34" rx="6" fill="#c0c7cf"/>';
    s += '<rect x="140" y="594" width="1200" height="120" fill="#9aa3ad"/>';
    s += '<path d="M150,560 L150,440 M1330,560 L1330,440" stroke="#8b8f98" stroke-width="7"/>';
    s += '<rect x="150" y="432" width="1180" height="12" rx="5" fill="#8b8f98"/>';
    s += '<rect x="150" y="444" width="1180" height="116" fill="#cfe7f2" opacity=".32"/>';
    var pans = [[620, '#F8981F'], [800, '#8fd3c6'], [980, '#f2c230']];
    pans.forEach(function (pn) {
      s += '<rect x="' + pn[0] + '" y="524" width="150" height="40" rx="5" fill="#8b8f98"/>';
      s += '<rect x="' + (pn[0] + 10) + '" y="516" width="130" height="18" rx="5" fill="' + pn[1] + '"/>';
      s += '<path d="M' + (pn[0] + 44) + ',512 q-10,-22 2,-34 M' + (pn[0] + 104) + ',512 q-10,-22 2,-34" fill="none" stroke="#fffdf8" stroke-width="4" opacity=".65"/>';
    });
    /* stack of trays */
    for (var k = 0; k < 6; k++) s += '<rect x="' + (190 + k) + '" y="' + (548 - k * 9) + '" width="150" height="12" rx="4" fill="' + (k % 2 ? '#9aa3ad' : '#c0c7cf') + '"/>';
    /* napkin box, forks and spoons in a tub */
    s += '<rect x="1140" y="520" width="80" height="44" rx="5" fill="#fffdf8" stroke="#d9d3e3" stroke-width="3"/><rect x="1156" y="506" width="48" height="16" rx="3" fill="#fffdf8"/>';
    s += '<rect x="1240" y="516" width="80" height="48" rx="5" fill="#5b6b7c"/>';
    s += '<path d="M1258,516 L1258,480 M1266,516 L1266,480 M1274,516 L1274,480" stroke="#c0c7cf" stroke-width="4"/>';
    s += '<path d="M1300,516 L1300,486 q8,-6 8,-18 q-8,6 -8,18" fill="none" stroke="#c0c7cf" stroke-width="4"/>';
    /* the line on the floor */
    s += '<path d="M120,790 L1480,790" stroke="#c9412e" stroke-width="7" stroke-dasharray="26 18"/>';
    return s;
  };
  R.BG.cafeteria = function () {
    var s = '<rect width="1600" height="900" fill="#fbead6"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#f1dcc2"/>';
    s += sign(600, 90, 400, 'Cafeteria', '#c9412e');
    /* serving counter with a menu board */
    s += '<rect x="80" y="180" width="440" height="260" rx="10" fill="#2b2233"/>';
    s += '<text x="300" y="250" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="40" fill="#fffdf8">Lunch</text>';
    s += '<text x="300" y="310" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="700" font-size="30" fill="#F8981F">🍕 🍎 🥛</text>';
    s += '<text x="300" y="370" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="700" font-size="30" fill="#8fd3c6">🌮 🍌 🥤</text>';
    s += '<rect x="60" y="470" width="480" height="160" rx="8" fill="#9aa3ad"/><rect x="60" y="470" width="480" height="30" fill="#c0c7cf"/>';
    s += '<rect x="110" y="438" width="70" height="36" rx="6" fill="#F8981F"/><rect x="200" y="438" width="70" height="36" rx="6" fill="#2f6fbd"/><rect x="290" y="438" width="70" height="36" rx="6" fill="#1f8a7e"/>';
    /* windows */
    s += '<rect x="640" y="180" width="380" height="260" rx="6" fill="#cfe7f2" stroke="#fbfaf7" stroke-width="12"/><rect x="1100" y="180" width="380" height="260" rx="6" fill="#cfe7f2" stroke="#fbfaf7" stroke-width="12"/>';
    s += '<rect x="0" y="628" width="1600" height="16" fill="#e8cdb0"/>';
    s += floor('#e2d4c0');
    /* long lunch tables with benches */
    for (var t = 0; t < 2; t++) {
      var x = 620 + t * 480;
      s += '<rect x="' + (x + 30) + '" y="730" width="12" height="90" fill="#8b8f98"/><rect x="' + (x + 378) + '" y="730" width="12" height="90" fill="#8b8f98"/>';
      s += '<rect x="' + x + '" y="704" width="420" height="28" rx="8" fill="#c9412e"/>';
      s += '<rect x="' + (x + 20) + '" y="776" width="380" height="18" rx="6" fill="#8b8f98"/>';
      s += '<rect x="' + (x + 120) + '" y="688" width="70" height="18" rx="4" fill="#F8981F"/><rect x="' + (x + 240) + '" y="688" width="70" height="18" rx="4" fill="#2f6fbd"/>';
    }
    return s;
  };

  /* ---------- Episode 5 places: Getting Around School ---------- */
  /* the big "You are here" school map on the stairwell wall: three floors plus the cafeteria downstairs,
     the stairwell on the left, a star on floor 1, and a dotted route up to the last room on floor 3 */
  function wallMap(x, y, w, h) {
    var s = '<rect x="' + (x - 10) + '" y="' + (y - 10) + '" width="' + (w + 20) + '" height="' + (h + 20) + '" rx="8" fill="#5b6b7c"/>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="#fffdf8"/>';
    s += '<text x="' + (x + w / 2) + '" y="' + (y + 34) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="28" fill="#864D9E">School map</text>';
    var top = y + 50, fh = (h - 110) / 3, sx = x + 18, sw = 70, tints = ['#e7d9f0', '#f6e3c4', '#cfe7f2'];
    for (var f = 0; f < 3; f++) {
      var fy = top + f * fh, fl = 3 - f;
      s += '<rect x="' + (x + 12) + '" y="' + fy + '" width="' + (w - 24) + '" height="' + (fh - 8) + '" rx="4" fill="' + tints[f] + '" stroke="#9aa3ad" stroke-width="3"/>';
      /* stairwell column with little steps */
      s += '<rect x="' + sx + '" y="' + (fy + 6) + '" width="' + sw + '" height="' + (fh - 20) + '" fill="#c0c7cf" stroke="#8b8f98" stroke-width="2"/>';
      for (var k = 0; k < 4; k++) s += '<path d="M' + (sx + 8 + k * 14) + ',' + (fy + fh - 18 - k * 9) + ' h14 v-9" fill="none" stroke="#5b6b7c" stroke-width="2"/>';
      s += '<text x="' + (sx + sw / 2) + '" y="' + (fy + 26) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="20" fill="#2b2233">' + fl + '</text>';
      /* rooms along the hallway */
      var rx0 = sx + sw + 24, rw = (w - 24 - sw - 60) / 4;
      for (var r = 0; r < 4; r++) {
        var num = fl * 100 + 12 + r * 2, rxp = rx0 + r * (rw + 4);
        var hot = (fl === 3 && r === 3);
        s += '<rect x="' + rxp + '" y="' + (fy + 8) + '" width="' + rw + '" height="' + (fh - 40) + '" rx="3" fill="' + (hot ? '#8fd3c6' : '#fff') + '" stroke="' + (hot ? '#1f8a7e' : '#9aa3ad') + '" stroke-width="' + (hot ? 4 : 2) + '"/>';
        s += '<text x="' + (rxp + rw / 2) + '" y="' + (fy + fh / 2 - 6) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="19" fill="#2b2233">' + num + '</text>';
      }
      s += '<rect x="' + rx0 + '" y="' + (fy + fh - 30) + '" width="' + (w - 24 - sw - 48) + '" height="12" rx="3" fill="#d2c9ba"/>';
    }
    /* downstairs: the cafeteria */
    var cy = top + 3 * fh;
    s += '<rect x="' + (x + 12) + '" y="' + cy + '" width="' + (w - 24) + '" height="40" rx="4" fill="#fbead6" stroke="#9aa3ad" stroke-width="3"/>';
    s += '<text x="' + (x + w / 2 + 30) + '" y="' + (cy + 28) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="20" fill="#c9412e">Downstairs: Cafeteria</text>';
    /* the route: star on floor 1 -> stairwell -> up to floor 3 -> right along the hallway to the end */
    var f1y = top + 2 * fh + fh - 24, f3y = top + fh - 24, stx = x + w - 120;
    s += '<path d="M' + (sx + sw + 70) + ',' + f1y + ' L' + (sx + sw / 2) + ',' + f1y + ' L' + (sx + sw / 2) + ',' + f3y + ' L' + (x + w - 60) + ',' + f3y + '" fill="none" stroke="#c9412e" stroke-width="5" stroke-dasharray="12 9" stroke-linecap="round"/>';
    s += '<path d="M' + (x + w - 66) + ',' + (f3y - 10) + ' L' + (x + w - 50) + ',' + f3y + ' L' + (x + w - 66) + ',' + (f3y + 10) + '" fill="none" stroke="#c9412e" stroke-width="5" stroke-linejoin="round"/>';
    var stc = sx + sw + 76;
    s += '<path transform="translate(' + stc + ',' + f1y + ')" d="M0,-20 L6,-6 L21,-6 L9,3 L13,18 L0,9 L-13,18 L-9,3 L-21,-6 L-6,-6 Z" fill="#F8981F" stroke="#c9742a" stroke-width="2"/>';
    s += '<rect x="' + (stc + 26) + '" y="' + (f1y - 18) + '" width="118" height="28" rx="6" fill="#2b2233"/>';
    s += '<text x="' + (stc + 85) + '" y="' + (f1y + 2) + '" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="800" font-size="17" fill="#fff">You are here</text>';
    return s;
  }
  /* board for the stairwell: [floor number shown on the wall, show the wall map (true/false)] */
  R.BG.stairwell = function (board) {
    var b = board || ['1', false], s = '<rect width="1600" height="900" fill="#e3e8ef"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#d3dae3"/>';
    for (var l = 0; l < 4; l++) s += '<rect x="' + (120 + l * 400) + '" y="12" width="200" height="14" rx="7" fill="#fffbe8"/>';
    /* concrete block wall texture */
    for (var r = 0; r < 9; r++) for (var c = 0; c < 14; c++) {
      s += '<rect x="' + (c * 120 + (r % 2) * 60 - 60) + '" y="' + (70 + r * 62) + '" width="116" height="58" rx="3" fill="none" stroke="#ccd4de" stroke-width="2"/>';
    }
    /* big floor number painted on the wall */
    s += '<circle cx="180" cy="210" r="96" fill="#864D9E"/><circle cx="180" cy="210" r="80" fill="none" stroke="#fff" stroke-width="5" opacity=".5"/>';
    s += '<text x="180" y="248" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="112" fill="#fff">' + b[0] + '</text>';
    s += '<text x="180" y="350" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="34" fill="#864D9E">Floor</text>';
    /* tall window on the landing: fog over the Bay */
    s += '<rect x="330" y="120" width="190" height="320" rx="6" fill="#fbfaf7"/><rect x="342" y="132" width="166" height="296" fill="#c9d6de"/>';
    s += '<path d="M342,330 q40,-30 84,-8 t82,-12 L508,428 L342,428 Z" fill="#7d9a86"/><rect x="342" y="300" width="166" height="40" fill="#fff" opacity=".55"/>';
    s += '<path d="M425,132 L425,428 M342,280 L508,280" stroke="#fbfaf7" stroke-width="8"/>';
    if (b[1]) {
      s += wallMap(560, 110, 520, 470);
    } else {
      /* direction signs instead of the map */
      s += '<rect x="600" y="130" width="420" height="96" rx="12" fill="#1f8a7e"/>';
      s += '<path d="M640,210 L640,150 M620,172 L640,150 L660,172" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<text x="690" y="194" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="40" fill="#fff">UP · Floors 2, 3</text>';
      s += '<rect x="600" y="250" width="420" height="96" rx="12" fill="#c9412e"/>';
      s += '<path d="M640,266 L640,326 M620,304 L640,326 L660,304" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<text x="690" y="314" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="38" fill="#fff">DOWN · Cafeteria</text>';
      s += '<rect x="600" y="370" width="420" height="96" rx="12" fill="#2f6fbd"/>';
      s += '<text x="810" y="432" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="34" fill="#fff">OUTSIDE · Schoolyard</text>';
    }
    s += '<rect x="0" y="628" width="1600" height="16" fill="#c6ced8"/>';
    s += floor('#b9c2cc');
    /* the staircase going UP to the right, behind the people: treads, risers, stringer, handrail */
    var x0 = 1080, y0 = 640;
    s += '<path d="M' + x0 + ',' + y0 + ' L1600,' + (y0 - 520) + ' L1600,' + y0 + ' Z" fill="#a9b2bd"/>';
    for (var t = 0; t < 13; t++) {
      var tx = x0 + t * 40, ty = y0 - t * 40;
      s += '<rect x="' + tx + '" y="' + (ty - 40) + '" width="' + (1600 - tx) + '" height="40" fill="' + (t % 2 ? '#c4ccd6' : '#bcc5cf') + '"/>';
      s += '<rect x="' + tx + '" y="' + (ty - 40) + '" width="' + (1600 - tx) + '" height="7" fill="#e9c46a"/>';   /* yellow safety edge */
    }
    s += '<path d="M' + (x0 - 20) + ',' + (y0 - 150) + ' L1600,' + (y0 - 670) + '" stroke="#5b6b7c" stroke-width="12" stroke-linecap="round"/>';
    for (var p = 0; p < 7; p++) {
      var px = x0 + 10 + p * 80;
      s += '<path d="M' + px + ',' + (y0 - 160 - p * 80) + ' L' + px + ',' + (y0 - p * 80 - 40) + '" stroke="#5b6b7c" stroke-width="6"/>';
    }
    /* the stairwell door, propped open, with an EXIT sign above it */
    s += '<rect x="20" y="452" width="170" height="40" rx="6" fill="#2b2233"/><text x="105" y="481" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="28" fill="#e04b3a">EXIT</text>';
    s += '<rect x="0" y="500" width="220" height="140" fill="#3f7f6a"/><rect x="0" y="500" width="40" height="140" fill="#336b58"/>';
    s += '<rect x="170" y="560" width="30" height="10" rx="4" fill="#c0c7cf"/>';
    return s;
  };
  /* board for a hallway of numbered rooms: [floor label, room A, room B, room C, which door is open (0-2), colour seen inside] */
  R.BG.rooms = function (board) {
    var b = board || ['Floor 1', '114', '116', '118', 2, '#d9567f'], s = '<rect width="1600" height="900" fill="#efe9dd"/>';
    s += '<rect x="0" y="0" width="1600" height="60" fill="#e2dbcc"/>';
    for (var l = 0; l < 4; l++) s += '<rect x="' + (120 + l * 400) + '" y="12" width="200" height="14" rx="7" fill="#fffbe8"/>';
    /* floor label + an arrow sign for the room numbers */
    s += '<rect x="40" y="96" width="250" height="80" rx="12" fill="#864D9E"/>';
    s += '<text x="165" y="150" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="44" fill="#fff">' + b[0] + '</text>';
    /* a bulletin board with flyers and a fire-alarm pull */
    s += '<rect x="60" y="230" width="230" height="170" rx="6" fill="#c89a62" stroke="#9c7650" stroke-width="8"/>';
    s += '<rect x="80" y="250" width="80" height="60" fill="#fffdf8" transform="rotate(-4,120,280)"/><rect x="176" y="256" width="90" height="70" fill="#f2c230" transform="rotate(5,221,291)"/>';
    s += '<rect x="96" y="326" width="96" height="56" fill="#8fd3c6" transform="rotate(3,144,354)"/><circle cx="120" cy="252" r="5" fill="#c9412e"/><circle cx="221" cy="258" r="5" fill="#2f6fbd"/>';
    s += '<rect x="230" y="440" width="44" height="60" rx="6" fill="#c9412e"/><rect x="242" y="458" width="20" height="14" rx="3" fill="#fff"/>';
    /* three doors with number plates above */
    for (var d = 0; d < 3; d++) {
      var dx = 380 + d * 420, open = (b[4] === d);
      s += '<rect x="' + (dx - 14) + '" y="196" width="268" height="444" rx="6" fill="#9c7650"/>';
      s += '<rect x="' + (dx + 34) + '" y="120" width="172" height="62" rx="10" fill="#fffdf8" stroke="#2b2233" stroke-width="5"/>';
      s += '<text x="' + (dx + 120) + '" y="168" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="48" fill="#2b2233">' + b[1 + d] + '</text>';
      if (open) {
        /* the room inside, then the door swung open against the frame */
        s += '<rect x="' + dx + '" y="210" width="240" height="430" fill="' + (b[5] || '#d9567f') + '" opacity=".55"/>';
        s += '<rect x="' + (dx + 20) + '" y="250" width="200" height="130" rx="4" fill="#fffdf8" opacity=".85"/>';
        s += '<path d="M' + dx + ',210 L' + (dx - 60) + ',190 L' + (dx - 60) + ',660 L' + dx + ',640 Z" fill="#b98b5a" stroke="#8a6440" stroke-width="3"/>';
      } else {
        s += '<rect x="' + dx + '" y="210" width="240" height="430" fill="#b98b5a"/>';
        s += '<rect x="' + (dx + 50) + '" y="240" width="140" height="120" rx="4" fill="#cfe7f2" stroke="#8a6440" stroke-width="4"/>';
        s += '<path d="M' + (dx + 120) + ',240 L' + (dx + 120) + ',360" stroke="#8a6440" stroke-width="3"/>';
        s += '<circle cx="' + (dx + 210) + '" cy="440" r="11" fill="#e9d38a" stroke="#8a6440" stroke-width="2"/>';
        s += '<rect x="' + (dx + 30) + '" y="580" width="180" height="16" rx="3" fill="#a07a4f"/>';
      }
    }
    /* a water fountain */
    s += '<rect x="1414" y="470" width="120" height="70" rx="10" fill="#c0c7cf"/><rect x="1430" y="476" width="88" height="22" rx="8" fill="#9aa3ad"/><rect x="1460" y="540" width="28" height="90" fill="#9aa3ad"/>';
    s += '<rect x="0" y="626" width="1600" height="16" fill="#d8cfbd"/>';
    s += floor('#d2c9ba');
    s += '<rect x="0" y="700" width="1600" height="30" fill="#fff" opacity=".18"/>';
    return s;
  };

  /* ---------- things lying around a scene (scene.items / line.items) ---------- */
  R.item = function (kind, x) {
    var y = R.GROUND;
    if (kind === 'backpack') {
      return '<g transform="translate(' + x + ',' + y + ')"><ellipse cx="0" cy="2" rx="70" ry="12" fill="#000" opacity=".13"/>' +
             '<path d="M-30,-130 Q-60,-190 -96,-120" fill="none" stroke="#c9742a" stroke-width="12" stroke-linecap="round"/>' +
             '<rect x="-60" y="-150" width="120" height="150" rx="26" fill="#F8981F"/><rect x="-60" y="-150" width="120" height="54" rx="26" fill="#e07f12"/>' +
             '<rect x="-40" y="-70" width="80" height="50" rx="14" fill="#ffb648" stroke="#c9742a" stroke-width="3"/>' +
             '<rect x="-16" y="-106" width="32" height="12" rx="6" fill="#2b2233"/><path d="M0,-20 L0,0" stroke="#2b2233" stroke-width="4"/></g>';
    }
    return '';
  };
  R.item2 = function (kind, x) {
    if (kind === 'tray') {
      /* a tray left on a lunch table (table top sits at y 704 in the cafeteria) */
      return '<g transform="translate(' + x + ',700)"><rect x="-70" y="-12" width="140" height="26" rx="7" fill="#9aa3ad"/>' +
             '<rect x="-64" y="-18" width="128" height="20" rx="6" fill="#c0c7cf"/>' +
             '<ellipse cx="-16" cy="-16" rx="30" ry="11" fill="#fffdf8"/><path d="M-36,-19 A30,11 0 0 1 4,-19 Z" fill="#F8981F"/>' +
             '<rect x="26" y="-40" width="24" height="32" rx="3" fill="#fffdf8" stroke="#2f6fbd" stroke-width="3"/></g>';
    }
    return '';
  };
  R.itemsSVG = function (list) {
    var s = '';
    (list || []).forEach(function (it) { s += (R.item(it.kind, it.x) || R.item2(it.kind, it.x)); });
    return s;
  };

  /* every background gets the season's set dressing on top */
  Object.keys(R.BG).forEach(function (k) {
    var fn = R.BG[k];
    R.BG[k] = function (board) { return fn(board) + '<g class="season">' + R.seasonDressing() + '</g>'; };
  });

  /* a full static scene (used by storyboard thumbnails and the cast page) */
  R.sceneSVG = function (scene, extraCls) {
    var bgFn = R.BG[scene.bg] || R.BG.classroom;
    var s = '<svg class="' + (extraCls || '') + '" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (scene.alt || 'scene') + '">';
    s += '<g class="bg">' + bgFn(scene.board) + '</g><g class="items">' + R.itemsSVG(scene.items) + '</g><g class="chars">';
    var list = scene.chars || [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      s += R.placeChar(p.id, p.x, p.face || 1, { expr: p.expr, pose: p.pose, hold: p.hold });
    }
    s += '</g></svg>';
    return s;
  };
})();
