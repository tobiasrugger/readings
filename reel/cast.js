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
    shy:      '<path d="M-10,-411 Q0,-404 10,-411" fill="none" stroke="#6b2b2b" stroke-width="4.5" stroke-linecap="round"/>'
  };
  var BROWS = {
    base:     ['M-34,-480 q11,-7 22,-1', 'M12,-481 q11,-6 22,1'],
    up:       ['M-34,-487 q11,-8 22,-2', 'M12,-489 q11,-6 22,2'],
    nervous:  ['M-34,-476 q12,-4 22,-10', 'M12,-486 q10,6 22,10'],
    shy:      ['M-33,-478 q11,-4 21,-4', 'M12,-482 q10,0 21,4']
  };
  var EXPR_BROWS = { smile: 'base', happy: 'up', neutral: 'base', nervous: 'nervous', surprised: 'up', shy: 'shy' };

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

  function arm(c, side, angle, wave) {
    var sx = side * 60, anim = '';
    if (wave) {
      anim = '<animateTransform attributeName="transform" type="rotate" values="' +
             angle + ' ' + sx + ' -355;' + (angle + 22) + ' ' + sx + ' -355;' + angle + ' ' + sx + ' -355" dur="0.9s" repeatCount="indefinite"/>';
    }
    return '<g transform="rotate(' + angle + ' ' + sx + ' -355)">' + anim +
      '<rect x="' + (sx - 14) + '" y="-362" width="28" height="158" rx="14" fill="' + c.shirt + '"/>' +
      '<rect x="' + (sx - 14) + '" y="-362" width="28" height="158" rx="14" fill="#000" opacity=".06"/>' +
      '<circle cx="' + sx + '" cy="-198" r="15" fill="' + c.skin + '"/></g>';
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
    if (name === 'backpackless') { return ''; }
    return '';
  }

  /* opts: {expr, pose:'idle'|'wave'|'point'|'spin'|'think', hold:'ball'|'sketchbook', talk:bool} */
  R.drawChar = function (id, opts) {
    var c = R.CAST[id]; if (!c) return '';
    opts = opts || {};
    var expr = opts.expr || 'smile', pose = opts.pose || 'idle';
    var brow = BROWS[EXPR_BROWS[expr] || 'base'];
    var s = '';
    /* shadow */
    s += '<ellipse cx="0" cy="4" rx="82" ry="14" fill="#000" opacity=".13"/>';
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
    s += arm(c, -1, la, false);
    s += torso(c, opts.face || 1);
    if (c.hair === 'hijab') s += '<path d="M-62,-444 C-60,-380 -30,-338 0,-332 C30,-338 60,-380 62,-444 Z" fill="' + c.hairColor + '"/>';
    s += arm(c, 1, ra, wave);
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
    var eyeY = expr === 'shy' ? -446 : -452;
    s += '<g class="eyes"><ellipse cx="-22" cy="' + eyeY + '" rx="7" ry="9" fill="#2b2233"/><ellipse cx="22" cy="' + eyeY + '" rx="7" ry="9" fill="#2b2233"/>' +
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
    if (opts.hold) s += heldProp(opts.hold);
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
           '<path d="M' + x + ',' + y + ' L' + x + ',' + (y - 24) + ' M' + x + ',' + y + ' L' + (x + 17) + ',' + (y + 6) + '" stroke="#2b2233" stroke-width="5" stroke-linecap="round"/>';
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
    return s;
  };

  /* a full static scene (used by storyboard thumbnails and the cast page) */
  R.sceneSVG = function (scene, extraCls) {
    var bgFn = R.BG[scene.bg] || R.BG.classroom;
    var s = '<svg class="' + (extraCls || '') + '" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (scene.alt || 'scene') + '">';
    s += '<g class="bg">' + bgFn(scene.board) + '</g><g class="chars">';
    var list = scene.chars || [];
    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      s += R.placeChar(p.id, p.x, p.face || 1, { expr: p.expr, pose: p.pose, hold: p.hold });
    }
    s += '</g></svg>';
    return s;
  };
})();
