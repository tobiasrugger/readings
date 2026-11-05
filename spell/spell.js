/* spell.js — T-273 (Nov 2026). Shared spelling helper. Load with
     <script src="/readings/spell/spell.js"></script>
   Four parts, each usable on its own:
   1. SAY-AS   The voice gets "Matayo" for Mateo (and "Ameera" for Amira when std.js isn't on the
               page), and spelled-out letters (C-h-r-i-s, J - U - N) as letter NAMES with commas, so
               they don't run together. Captions are untouched; onboundary charIndex is mapped back.
   2. LETTERS  Spell.letters('L-I-N-H', btn) says one letter per beat. Each letter STARTS on a fixed
               beat (1.3 s, 1.8 s slow) measured from the previous start, not after onend — short
               letters like N and H report "done" early in Chrome and used to bunch up.
   3. WATCH    Spell.watch(textareas, opts) — free writing. When a student writes a real word that is
               probably the wrong one (barrow for borrow, kitchen for chicken) or a common misspelling
               (tomorow), a bordered tip shows BOTH words with pictures, meanings, translations and a
               sound-spelling strip. Never marks anything wrong; the student decides.
   4. CHUNKS   Spell.chunks(host, {word}) — spell a long word in parts (col · lab · o · ra · tive),
               one box per letter, a 🔊 per part, then the whole word once. Misses 1–2 get the
               part's hint; the 3rd miss SHOWS that part (T-294). Words: Spell.CHUNKS.
   5. TYPED    Spell.typed(host, {word}) — any typed answer, one box per letter; 3rd miss shows the
               word big with 🔊, the student types it once (T-294). Finished after a reveal = full
               point; onDone gets shown:true for the dashboard only.
   Owner: spell/ chat https://claude.ai/chat/1604fa1e-7145-4d6a-bb9c-a2b5d1a28999 (T-273, T-294). Other folders call it; they don't edit it — hand changes over. */
(function () {
  if (window.Spell) return;
  var S = window.Spell = { version: 'T-294' };

  /* ------------------------------------------------------------ 1. SAY-AS */
  var NAMES = { a:'ay', b:'bee', c:'see', d:'dee', e:'ee', f:'eff', g:'jee', h:'aitch', i:'eye', j:'jay',
    k:'kay', l:'ell', m:'em', n:'en', o:'oh', p:'pee', q:'cue', r:'ar', s:'ess', t:'tee', u:'you',
    v:'vee', w:'double you', x:'ex', y:'why', z:'zee' };
  S.letterName = function (ch) { return NAMES[String(ch).toLowerCase()] || ch; };
  var SAY_AS = { 'Mateo': 'Matayo' };
  S.SAY_AS = SAY_AS;
  var LETTERS_RE = /\b([A-Za-z])((?:\s*-\s*[A-Za-z])+)\b/g;
  function swap(text, stdOn) {
    var names = Object.keys(SAY_AS);
    if (!stdOn) names = names.concat(['Amira']);
    var re = new RegExp('\\b(' + names.join('|') + ')\\b|' + LETTERS_RE.source, 'g');
    var out = '', map = [], last = 0, m, i;
    while ((m = re.exec(text))) {
      for (i = last; i < m.index; i++) map.push(i);
      out += text.slice(last, m.index);
      var r, src = m[0];
      if (m[1]) r = m[1] === 'Amira' ? 'Ameera' : SAY_AS[m[1]];
      else r = src.split('-').map(function (s) { return S.letterName(s.trim()); }).join(', ');
      for (i = 0; i < r.length; i++) map.push(m.index + Math.min(Math.floor(i * src.length / r.length), src.length - 1));
      out += r; last = m.index + src.length;
    }
    for (i = last; i <= text.length; i++) map.push(i);
    return { text: out + text.slice(last), map: map };
  }
  S._swap = swap;
  (function () {
    var ss = window.speechSynthesis; if (!ss || ss.__galSpellSayAs) return; ss.__galSpellSayAs = 1;
    var orig = ss.speak;
    ss.speak = function (u) {
      try {
        if (u && u.text && !u.__galSpell) {
          var s = swap(u.text, false);
          if (s.text !== u.text) {
            u.text = s.text;
            var h = u.onboundary;
            if (typeof h === 'function' && !h.__galSpellMapped) {
              var w = function (e) {
                var ci = e.charIndex;
                return h.call(this, { charIndex: typeof ci === 'number' && s.map[ci] != null ? s.map[ci] : ci,
                  charLength: e.charLength, name: e.name, elapsedTime: e.elapsedTime, utterance: e.utterance,
                  type: e.type, target: e.target, currentTarget: e.currentTarget });
              };
              w.__galSpellMapped = 1; u.onboundary = w;
            }
          }
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  })();

  /* ------------------------------------------------------------ voice */
  var VOICE = null;
  function pickVoice() {
    if (!window.speechSynthesis) return null;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^en/i.test(x.lang); });
    VOICE = v.filter(function (x) { return /Google US English/i.test(x.name); })[0] ||
      v.filter(function (x) { return /Samantha/i.test(x.name); })[0] ||
      v.filter(function (x) { return /en-US/i.test(x.lang); })[0] || v[0] || null;
    return VOICE;
  }
  if (window.speechSynthesis) { pickVoice(); try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) {} }
  var SEQ = 0;
  function say(text, rate, raw) {
    if (!window.speechSynthesis) return;
    SEQ++; speechSynthesis.cancel();
    var t = String(text).replace(/(^|[^A-Za-z])I([^A-Za-z]|$)/g, '$1eye$2');
    var u = new SpeechSynthesisUtterance(t); if (raw) u.__galSpell = 1;
    u.lang = 'en-US'; if (VOICE || pickVoice()) u.voice = VOICE; u.rate = rate || 0.85;
    setTimeout(function () { speechSynthesis.speak(u); }, 40);
  }
  S.say = say;

  /* ------------------------------------------------------------ 2. LETTERS */
  /* list: 'L-I-N-H', 'LINH' or ['L','I','N','H']. opts: {slow, onStep(k) (-1 at the end)} */
  S.letters = function (list, btn, opts) {
    opts = opts || {};
    if (!window.speechSynthesis) return;
    var arr = Array.isArray(list) ? list : (/-/.test(list) ? String(list).split('-') : String(list).split(''));
    arr = arr.map(function (s) { return String(s).trim(); }).filter(Boolean);
    var beat = opts.beat || (opts.slow ? 1800 : 1300), my = ++SEQ;
    speechSynthesis.cancel(); if (!VOICE) pickVoice();
    if (btn && btn.classList) btn.classList.add('on');
    arr.forEach(function (ch, k) {
      setTimeout(function () {
        if (my !== SEQ) return;
        var u = new SpeechSynthesisUtterance(S.letterName(ch) + '.'); u.__galSpell = 1;
        u.lang = 'en-US'; if (VOICE) u.voice = VOICE; u.rate = opts.slow ? 0.7 : 0.85;
        if (opts.onStep) opts.onStep(k);
        try { speechSynthesis.speak(u); } catch (e) {}
      }, 60 + k * beat);
    });
    setTimeout(function () {
      if (my !== SEQ) return;
      if (btn && btn.classList) btn.classList.remove('on');
      if (opts.onStep) opts.onStep(-1);
    }, 60 + arr.length * beat);
  };

  /* ------------------------------------------------------------ pictures (120 x 96) */
  var SK = '#f2c9a0', SK2 = '#d9a77a', INK = '#1c2640';
  function head(x, y, s, hair) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (9 * s) + '" fill="' + SK + '"/>' +
      '<path d="M' + (x - 9 * s) + ' ' + (y - 1 * s) + ' q' + (9 * s) + ' ' + (-14 * s) + ' ' + (18 * s) + ' 0 q-2 -6 -9 -7 q-7 1 -9 7z" fill="' + (hair || '#3b2a1e') + '"/>' +
      '<circle cx="' + (x - 3 * s) + '" cy="' + (y + 1 * s) + '" r="' + (1.2 * s) + '" fill="' + INK + '"/><circle cx="' + (x + 3 * s) + '" cy="' + (y + 1 * s) + '" r="' + (1.2 * s) + '" fill="' + INK + '"/>';
  }
  function frame(inner, bg) {
    return '<svg viewBox="0 0 120 96" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="120" height="96" rx="8" fill="' + (bg || '#f4efe4') + '"/>' + inner + '</svg>';
  }
  var PIC = {
    barrow: frame(
      '<rect y="70" width="120" height="26" fill="#a3c585"/><path d="M0 70 q30 -6 60 0 t60 0v4H0z" fill="#8fb36f"/>' +
      '<path d="M22 44 h52 l-8 22 h-36z" fill="#2f6fbd"/><path d="M22 44 h52 l-3 6 h-46z" fill="#5b8fd6"/>' +
      '<path d="M26 44 q10 -14 22 -6 q10 -12 22 2 z" fill="#7a5233"/><circle cx="36" cy="40" r="3" fill="#5e3e26"/><circle cx="56" cy="38" r="2.5" fill="#5e3e26"/><circle cx="46" cy="36" r="2" fill="#93653f"/>' +
      '<circle cx="34" cy="74" r="9" fill="#333"/><circle cx="34" cy="74" r="4" fill="#9aa3ad"/><path d="M34 66 v16 M26 74 h16" stroke="#555" stroke-width="1"/>' +
      '<path d="M66 64 l30 -12 M68 66 l32 -10" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/><path d="M60 66 l-4 12 M42 66 l2 10" stroke="#444" stroke-width="3"/>' +
      '<rect x="96" y="48" width="8" height="5" rx="2" fill="#333"/><rect x="99" y="54" width="8" height="5" rx="2" fill="#333"/>'),
    borrow: frame(
      '<rect x="0" y="62" width="120" height="34" fill="#c99a62"/><rect x="0" y="62" width="120" height="4" fill="#a87a45"/>' +
      '<path d="M4 64 q14 -8 30 -6 l14 4 q4 3 0 6 l-16 -1 q-14 4 -28 2z" fill="' + SK + '" stroke="' + SK2 + '"/><path d="M4 64 h8 v10 h-8z" fill="#d9567f"/>' +
      '<path d="M116 52 q-14 -6 -30 -2 l-12 6 q-3 4 1 6 l14 -3 q14 2 27 -1z" fill="' + SK2 + '" stroke="#b98657"/><path d="M116 50 h-8 v12 h8z" fill="#2f6fbd"/>' +
      '<g transform="rotate(-18 62 52)"><rect x="40" y="48" width="44" height="7" rx="2" fill="#f2c230"/><path d="M84 48 l10 3.5 l-10 3.5z" fill="#f4d9a8"/><path d="M90 50 l4 1.5 l-4 1.5z" fill="' + INK + '"/><rect x="36" y="48" width="5" height="7" fill="#e88aa5"/><rect x="40" y="48" width="3" height="7" fill="#c0c0c0"/></g>' +
      '<path d="M38 22 q22 -14 44 0" fill="none" stroke="#1f8a7e" stroke-width="3"/><path d="M82 22 l-6 -6 M82 22 l-8 2" stroke="#1f8a7e" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M82 34 q-22 14 -44 0" fill="none" stroke="#e07a1f" stroke-width="3"/><path d="M38 34 l6 6 M38 34 l8 -2" stroke="#e07a1f" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="60" y="13" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="8" fill="#5c6b62">now</text><text x="60" y="47" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="8" fill="#5c6b62">later</text>'),
    tomorrow: frame(
      '<rect x="12" y="16" width="44" height="54" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><rect x="12" y="16" width="44" height="14" rx="4" fill="#d9567f"/><text x="34" y="27" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="9" fill="#fff">TODAY</text><text x="34" y="58" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="22" fill="' + INK + '">4</text>' +
      '<rect x="66" y="16" width="44" height="54" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><rect x="66" y="16" width="44" height="14" rx="4" fill="#2d6a4f"/><text x="88" y="58" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="22" fill="' + INK + '">5</text>' +
      '<circle cx="104" cy="66" r="9" fill="#f2c230"/><path d="M104 54 v-4 M116 66 h4 M92 66 h-4" stroke="#f2c230" stroke-width="2"/>' +
      '<path d="M50 80 q10 8 22 0" fill="none" stroke="#e07a1f" stroke-width="3"/><path d="M72 80 l-6 -2 M72 80 l-2 6" stroke="#e07a1f" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="20" y="34" width="28" height="3" fill="#e9e1d0"/><rect x="74" y="34" width="28" height="3" fill="#e9e1d0"/>'),
    sorry: frame(
      '<rect y="74" width="120" height="22" fill="#cfd8e3"/>' + head(40, 34, 1.4, '#2b1d14') + '<path d="M32 38 q8 -3 16 0" stroke="' + INK + '" stroke-width="0" />' +
      '<path d="M34 44 q6 -4 12 0" fill="none" stroke="' + INK + '" stroke-width="1.6"/><path d="M33 31 l5 2 M47 31 l-5 2" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<path d="M24 74 v-16 q16 -12 32 0 v16z" fill="#2f6fbd"/><path d="M50 60 q8 -2 10 -10" stroke="' + SK + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      head(86, 38, 1.2, '#5a3a22') + '<path d="M80 42 q6 4 12 0" fill="none" stroke="' + INK + '" stroke-width="1.4"/><path d="M72 74 v-14 q14 -10 28 0 v14z" fill="#d9567f"/>' +
      '<path d="M62 20 l4 -8 l4 8 z" fill="#f2c230"/><text x="66" y="30" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="7" fill="#5c6b62">oops</text>' +
      '<rect x="52" y="76" width="16" height="10" rx="2" fill="#fff" stroke="#999"/><path d="M54 80 h12 M54 83 h9" stroke="#999"/>'),
    then: frame(
      '<rect x="8" y="20" width="30" height="40" rx="5" fill="#fff" stroke="' + INK + '" stroke-width="2"/><text x="23" y="48" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="24" fill="#d9567f">1</text>' +
      '<path d="M42 40 h12" stroke="' + INK + '" stroke-width="3"/><path d="M54 40 l-5 -4 v8z" fill="' + INK + '"/>' +
      '<rect x="60" y="20" width="30" height="40" rx="5" fill="#fff" stroke="' + INK + '" stroke-width="2"/><text x="75" y="48" text-anchor="middle" font-family="Nunito,Arial" font-weight="900" font-size="24" fill="#2d6a4f">2</text>' +
      '<circle cx="104" cy="40" r="12" fill="#fff" stroke="' + INK + '" stroke-width="2"/><path d="M104 40 v-8 M104 40 l6 3" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' +
      '<text x="60" y="82" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="10" fill="#5c6b62">first … next</text>'),
    than: frame(
      '<path d="M60 20 v52" stroke="' + INK + '" stroke-width="3"/><path d="M44 78 h32 l-4 -6 h-24z" fill="#7a5233"/><path d="M18 30 l84 14" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M8 32 h22 l-3 10 h-16z" fill="#c0c0c0"/><path d="M90 46 h22 l-3 10 h-16z" fill="#c0c0c0"/>' +
      '<circle cx="19" cy="26" r="5" fill="#e07a1f"/><circle cx="101" cy="32" r="13" fill="#d9567f"/><circle cx="97" cy="28" r="3" fill="#f4a3bd"/>' +
      '<text x="60" y="92" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="10" fill="#5c6b62">bigger ›  smaller</text>'),
    were: frame(
      '<rect x="10" y="12" width="56" height="44" rx="4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><rect x="10" y="12" width="56" height="10" fill="#8b98a8"/><text x="38" y="20" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="7" fill="#fff">YESTERDAY</text>' +
      head(28, 38, 0.9, '#2b1d14') + head(48, 38, 0.9, '#5a3a22') + '<path d="M20 54 v-6 q8 -6 16 0 v6z" fill="#2f6fbd"/><path d="M40 54 v-6 q8 -6 16 0 v6z" fill="#1f8a7e"/>' +
      '<path d="M100 40 a18 18 0 1 0 -6 13" fill="none" stroke="#8b98a8" stroke-width="3"/><path d="M90 50 l5 4 l1 -6" fill="none" stroke="#8b98a8" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="60" y="80" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="10" fill="#5c6b62">they were there</text>'),
    where: frame(
      '<rect x="6" y="10" width="108" height="70" rx="6" fill="#d8ead2"/><path d="M6 50 q30 -14 54 0 t54 -6" fill="none" stroke="#9cc3e6" stroke-width="7"/><path d="M30 10 v70 M80 10 v70" stroke="#fff" stroke-width="4"/>' +
      '<path d="M60 52 q-12 -14 -12 -22 a12 12 0 0 1 24 0 q0 8 -12 22z" fill="#d9567f"/><circle cx="60" cy="30" r="5" fill="#fff"/>' +
      '<text x="96" y="34" font-family="Nunito,Arial" font-weight="900" font-size="22" fill="' + INK + '">?</text>'),
    kitchen: frame(
      '<rect width="120" height="96" rx="8" fill="#f3e3c3"/><rect x="0" y="58" width="120" height="38" fill="#b07a4a"/><rect x="0" y="56" width="120" height="5" fill="#8a5a2b"/>' +
      '<rect x="8" y="64" width="30" height="28" fill="#c99a62" stroke="#8a5a2b"/><circle cx="34" cy="78" r="1.6" fill="#555"/><rect x="44" y="64" width="34" height="28" fill="#dfe3e8" stroke="#888"/><rect x="48" y="68" width="26" height="16" rx="2" fill="#555"/>' +
      '<circle cx="54" cy="58" r="5" fill="#333"/><circle cx="70" cy="58" r="5" fill="#333"/><path d="M48 50 h14 v6 h-14z" fill="#9aa3ad"/><path d="M56 44 q2 -6 0 -10 M60 44 q2 -6 0 -10" stroke="#ccc" fill="none"/>' +
      '<rect x="86" y="14" width="26" height="30" fill="#bfe3f5" stroke="#fff" stroke-width="3"/><path d="M99 14 v30 M86 29 h26" stroke="#fff" stroke-width="2"/>' +
      '<rect x="12" y="16" width="34" height="18" rx="2" fill="#c99a62"/><path d="M29 16 v18" stroke="#8a5a2b"/><rect x="86" y="62" width="26" height="30" fill="#f4f1ee" stroke="#999"/>'),
    chicken: frame(
      '<rect y="70" width="120" height="26" fill="#d9c08a"/><path d="M10 78 l6 -2 M30 84 l5 -3 M90 80 l6 -2" stroke="#b8975a" stroke-width="2"/>' +
      '<ellipse cx="58" cy="52" rx="26" ry="20" fill="#fff" stroke="#ddd"/><path d="M36 48 q-12 -10 -8 -24 q8 6 12 18z" fill="#f4f1ee" stroke="#ddd"/><path d="M50 48 q10 14 24 4" fill="none" stroke="#e5e5e5" stroke-width="3"/>' +
      '<circle cx="82" cy="34" r="11" fill="#fff" stroke="#ddd"/><path d="M78 24 q4 -8 8 -2 q4 -6 6 2" fill="#d33"/><path d="M92 34 l8 3 l-8 3z" fill="#f2a230"/><path d="M86 42 q2 6 -2 8 q-3 -4 2 -8z" fill="#d33"/><circle cx="85" cy="32" r="1.8" fill="' + INK + '"/>' +
      '<path d="M52 70 v8 l-4 4 M52 78 l4 4 M64 70 v8 l-4 4 M64 78 l4 4" stroke="#f2a230" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="22" cy="86" rx="6" ry="4" fill="#f4e7c8"/><ellipse cx="100" cy="86" rx="5" ry="3.5" fill="#f4e7c8"/>'),
    lose: frame(
      '<rect y="72" width="120" height="24" fill="#cfd8e3"/>' + head(38, 28, 1.3, '#2b1d14') + '<path d="M31 35 q7 -4 14 0" fill="none" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<path d="M22 72 v-20 q16 -12 32 0 v20z" fill="#e07a1f"/><path d="M50 56 q10 -4 14 4" stroke="' + SK + '" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 58 h12 v10 h-12z" fill="#8a5a2b"/><path d="M60 58 q6 6 12 0" fill="none" stroke="#5e3e26"/>' +
      '<g transform="rotate(30 92 70)"><circle cx="86" cy="70" r="5" fill="none" stroke="#c9a227" stroke-width="2.5"/><rect x="90" y="69" width="14" height="3" fill="#c9a227"/><rect x="100" y="69" width="2" height="6" fill="#c9a227"/></g>' +
      '<path d="M78 46 l4 6 M86 44 l2 7 M94 48 l-1 6" stroke="#8b98a8" stroke-width="2" stroke-linecap="round"/><text x="98" y="30" font-family="Nunito,Arial" font-weight="900" font-size="20" fill="#8b98a8">?</text>'),
    loose: frame(
      '<rect y="80" width="120" height="16" fill="#cfd8e3"/>' + head(60, 16, 1.1, '#5a3a22') +
      '<path d="M48 28 h24 l2 20 h-28z" fill="#1f8a7e"/><path d="M34 46 h52 l4 36 h-22 l-8 -22 l-8 22 h-22z" fill="#2f6fbd"/><path d="M34 46 h52" stroke="#1c4f8f" stroke-width="3"/>' +
      '<path d="M40 52 q2 10 -2 20 M80 52 q-2 10 2 20" stroke="#1c4f8f" fill="none"/><path d="M30 50 q-6 2 -4 8 M90 50 q6 2 4 8" stroke="' + SK + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M14 40 l8 4 M14 52 l9 1 M106 40 l-8 4 M106 52 l-9 1" stroke="#e07a1f" stroke-width="2" stroke-linecap="round"/>'),
    live: frame(
      '<rect y="74" width="120" height="22" fill="#a3c585"/><path d="M20 44 l40 -30 l40 30z" fill="#b5451b"/><rect x="28" y="44" width="64" height="34" fill="#f6d6b8"/>' +
      '<rect x="36" y="52" width="20" height="16" fill="#ffe9a8" stroke="#5a3a22"/><path d="M46 52 v16 M36 60 h20" stroke="#5a3a22"/>' + head(46, 58, 0.55, '#2b1d14') +
      '<rect x="64" y="56" width="16" height="22" fill="#5a3a22"/><circle cx="77" cy="68" r="1.4" fill="#f2c230"/><rect x="80" y="20" width="8" height="14" fill="#7a2f14"/><path d="M84 18 q4 -8 0 -12" stroke="#ccc" fill="none" stroke-width="2"/>'),
    leave: frame(
      '<rect y="80" width="120" height="16" fill="#cfd8e3"/><rect x="10" y="14" width="40" height="66" fill="#8a5a2b"/><rect x="14" y="18" width="32" height="62" fill="#f4efe4"/><path d="M14 18 l18 6 v60 l-18 -4z" fill="#a87a45"/><circle cx="29" cy="52" r="1.6" fill="#f2c230"/>' +
      '<text x="30" y="12" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="7" fill="#5c6b62">EXIT</text>' +
      head(78, 30, 1, '#2b1d14') + '<path d="M70 40 h16 l2 22 h-20z" fill="#d9567f"/><path d="M72 62 l-6 18 M84 62 l8 18" stroke="#1c2640" stroke-width="4" stroke-linecap="round"/><path d="M86 44 l10 8" stroke="' + SK + '" stroke-width="4" stroke-linecap="round"/><rect x="94" y="48" width="12" height="14" rx="2" fill="#2f6fbd"/>' +
      '<path d="M100 26 h12" stroke="#e07a1f" stroke-width="3"/><path d="M112 26 l-5 -4 v8z" fill="#e07a1f"/>'),
    sit: frame(
      '<rect y="80" width="120" height="16" fill="#cfd8e3"/><rect x="50" y="56" width="34" height="5" fill="#8a5a2b"/><path d="M52 61 v19 M82 61 v19" stroke="#8a5a2b" stroke-width="4"/><path d="M82 30 v30" stroke="#8a5a2b" stroke-width="5"/>' +
      head(66, 24, 1, '#5a3a22') + '<path d="M58 34 h16 l2 22 h-20z" fill="#1f8a7e"/><path d="M58 56 h-12 v20 M60 56 h-10 v20" stroke="#1c2640" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M40 44 l-10 0" stroke="#e07a1f" stroke-width="3"/><path d="M34 34 v14 l-4 -4 M34 48 l4 -4" stroke="#e07a1f" stroke-width="3" fill="none" stroke-linecap="round"/>'),
    seat: frame(
      '<rect y="80" width="120" height="16" fill="#cfd8e3"/><path d="M30 40 h60 v8 h-60z" fill="#d9567f"/><path d="M30 48 h60 v6 h-60z" fill="#b8406a"/><path d="M34 54 v26 M86 54 v26" stroke="#555" stroke-width="4"/><path d="M84 14 h8 v34 h-8z" fill="#d9567f"/>' +
      '<rect x="36" y="20" width="22" height="12" rx="2" fill="#fff" stroke="' + INK + '"/><text x="47" y="29" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="8" fill="' + INK + '">12A</text>'),
    quiet: frame(
      '<rect y="80" width="120" height="16" fill="#cfd8e3"/>' + head(48, 36, 1.5, '#2b1d14') + '<path d="M40 74 v-12 q8 -8 16 0 v12z" fill="#2f6fbd"/><path d="M28 74 v-18 q20 -14 40 0 v18z" fill="#2f6fbd"/>' +
      '<rect x="46" y="42" width="4" height="14" rx="2" fill="' + SK2 + '"/><path d="M42 46 h12" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text x="84" y="40" font-family="Nunito,Arial" font-weight="900" font-size="16" fill="#8b98a8">shh</text><path d="M80 52 q8 6 18 0 M82 60 q6 4 14 0" stroke="#cbd2da" fill="none" stroke-width="2"/>'),
    quite: frame(
      '<rect x="14" y="58" width="16" height="18" fill="#e07a1f"/><rect x="38" y="44" width="16" height="32" fill="#e07a1f"/><rect x="62" y="30" width="16" height="46" fill="#e07a1f"/><rect x="86" y="16" width="16" height="60" fill="#d9567f"/>' +
      '<path d="M8 76 h104" stroke="' + INK + '" stroke-width="2"/><path d="M94 10 l-4 -6 M94 10 l4 -6" stroke="#d9567f" stroke-width="2"/>' +
      '<text x="60" y="90" text-anchor="middle" font-family="Nunito,Arial" font-weight="800" font-size="9" fill="#5c6b62">a little → a lot</text>')
  };
  S.PIC = PIC;

  var WORDS = {
    barrow:   { def: 'a cart with one wheel, for carrying dirt or heavy things' },
    borrow:   { def: 'take something now and give it back later' },
    tomorrow: { def: 'the day after today' },
    sorry:    { def: 'what you say when you made a mistake' },
    then:     { def: 'next; after that' },
    than:     { def: 'a word for comparing: bigger than, more than' },
    were:     { def: 'past of "are": we were, they were' },
    where:    { def: 'a question word for a place' },
    kitchen:  { def: 'the room where you cook' },
    chicken:  { def: 'a bird; also a food' },
    lose:     { def: 'not find something; or not win' },
    loose:    { def: 'not tight; too big' },
    live:     { def: 'have your home in a place' },
    leave:    { def: 'go out of a place' },
    sit:      { def: 'put your body down on a chair' },
    seat:     { def: 'a chair or place to sit (a thing)' },
    quiet:    { def: 'no noise; not loud' },
    quite:    { def: 'very, or a lot' }
  };
  S.WORDS = WORDS;

  var STRIPS = {
    orr: { rule: 'In English, <b>o + rr</b> often sounds like <b>ar</b>.', words: ['sorry', 'sorrow', 'tomorrow', 'borrow'], say: { tomorrow: 'tomorrow' } },
    rr:  { rule: 'This word has <b>two r\u2019s</b> together.', words: ['sorry', 'borrow', 'tomorrow', 'carry'] }
  };

  /* rules: re finds the spot (group 1 = the written word). pair = [what they wrote, the likely word]. */
  var RULES = [
    { id: 'barrow', re: /\b(barrows?|barrowed)\b/gi, pair: ['barrow', 'borrow'], strip: 'orr', ask: 'Barrow or borrow?' },
    { id: 'borrow-sp', re: /\b(borow|barow|borro|borrw|barro|borrrow|borows|borowed)\b/gi, pair: [null, 'borrow'], strip: 'rr', ask: 'Check the spelling.' },
    { id: 'tomorrow-sp', re: /\b(tomorow|tommorow|tommorrow|tomorro|tmorrow|tomarrow|tomarow|tumorrow|tomorw|2morrow)\b/gi, pair: [null, 'tomorrow'], strip: 'orr', ask: 'Check the spelling.' },
    { id: 'sorry-sp', re: /\b(sory|sorri|sorrie|sorrey|soory)\b/gi, pair: [null, 'sorry'], strip: 'orr', ask: 'Check the spelling.' },
    { id: 'then-than', re: /\b(?:more|less|better|worse|\w{2,}er)\s+(then)\b/gi, pair: ['then', 'than'], ask: 'Then or than?' },
    { id: 'were-where', re: /(?:^|[.!?]\s*)(were)\s+(?:is|are|do|does|did|can|you\s+from)\b/gi, pair: ['were', 'where'], ask: 'Were or where?' },
    { id: 'kitchen-chicken', re: /\b(?:eat|eats|ate|eating|like|likes|fried|cook|cooks|love|loves)\s+(kitchen)\b/gi, pair: ['kitchen', 'chicken'], ask: 'Kitchen or chicken?' },
    { id: 'loose-lose', re: /\b(loose)\s+(?:my|your|his|her|our|their|the\s+game|a\s+game|the\s+key|money)\b/gi, pair: ['loose', 'lose'], ask: 'Loose or lose?' },
    { id: 'live-leave', re: /\b(live|lives)\s+(?:school|class|the\s+class|the\s+room|the\s+classroom|at\s+\d)/gi, pair: ['live', 'leave'], ask: 'Live or leave?' },
    { id: 'seat-sit', re: /\b(seat)\s+down\b/gi, pair: ['seat', 'sit'], ask: 'Seat or sit?' },
    { id: 'quite-quiet', re: /\b(?:be|is|are|was|very|so|keep|stay)\s+(quite)(?=\s*[.!?,]|\s*$)/gi, pair: ['quite', 'quiet'], ask: 'Quite or quiet?' }
  ];
  S.RULES = RULES;

  var CAST = [['Linh', '#d9567f'], ['Mateo', '#2f6fbd'], ['Amira', '#1f8a7e'], ['Jun', '#5b6b7c'], ['Paolo', '#e07a1f']];
  var LINES = ['Hmm. Look at this word again.', 'Two words sound alike here!', 'English is tricky here. Look!', 'Same sound, different word?'];

  var CSS = '.sp-tip{border:2px solid #1c2640;border-radius:12px;box-shadow:0 3px 0 rgba(28,38,64,.25);background:#fff;padding:10px 12px;margin:8px 0;font-family:Nunito,Arial,sans-serif;color:#1c2640;display:none}' +
    '.sp-tip.show{display:block}.sp-tip .sp-q{font-weight:900;font-size:1.05rem;margin:0 0 6px}.sp-tip .sp-who{font-weight:900}' +
    '.sp-cards{display:flex;gap:10px;flex-wrap:wrap}.sp-card{flex:1 1 200px;border:2px solid #1c2640;border-radius:10px;padding:8px;background:#fffdf7;display:flex;gap:8px;align-items:flex-start}' +
    '.sp-card .sp-pic{flex:0 0 110px;width:110px}.sp-card .sp-pic svg{width:110px;height:88px;display:block}.sp-card .sp-w{font-size:1.35rem;font-weight:900}.sp-card .sp-d{font-size:.95rem}' +
    '.sp-card .sp-tr{margin-top:3px}.sp-card .sp-tr b{text-decoration:underline}.sp-card .sp-tr .none{color:#8b98a8}.sp-card.mine{background:#f4efe4}' +
    '.sp-tag{display:inline-block;font-size:.75rem;font-weight:800;background:#e9e1d0;border-radius:6px;padding:1px 6px;margin-bottom:2px}' +
    '.sp-strip{margin-top:8px;border:2px dashed #e07a1f;border-radius:10px;padding:6px 8px;background:#fff8ee}.sp-strip .sp-chip{display:inline-block;margin:3px 4px 0 0;border:2px solid #1c2640;border-radius:999px;padding:2px 10px;font-weight:800;background:#fff;cursor:pointer}' +
    '.sp-btns{margin-top:8px;display:flex;gap:8px;flex-wrap:wrap}.sp-btns button{font:inherit;font-weight:800;border:2px solid #1c2640;border-radius:8px;background:#fff;padding:4px 10px;cursor:pointer}' +
    '.sp-spk{border:0;background:none;cursor:pointer;font-size:1.05rem;padding:0 3px}.sp-spk.on{filter:drop-shadow(0 0 4px #e07a1f)}' +
    /* chunks */
    '.ch-box{font-family:Nunito,Arial,sans-serif;color:#1c2640}.ch-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.ch-top button,.ch-btns button{font:inherit;font-weight:800;border:2px solid #1c2640;border-radius:8px;background:#fff;padding:4px 10px;cursor:pointer}' +
    '.ch-row{display:flex;flex-wrap:wrap;gap:6px 4px;align-items:flex-start}.ch-part{border:2px solid #1c2640;border-radius:10px;padding:6px 6px 4px;background:#fffdf7;text-align:center;transition:transform .2s}' +
    '.ch-part.ok{background:#e3f4e8;border-color:#2d6a4f}.ch-part.wob{animation:chwob .4s}@keyframes chwob{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' +
    '.ch-dot{align-self:center;font-weight:900;font-size:1.4rem;color:#8b98a8;padding:0 1px}.ch-letters{display:flex;gap:3px;justify-content:center}' +
    '.ch-letters input{width:1.9em;height:2.2em;text-align:center;font:inherit;font-size:1.15rem;font-weight:900;border:0;border-bottom:3px solid #1c2640;background:#fff;border-radius:4px 4px 0 0;text-transform:lowercase;padding:0}' +
    '.ch-part.ok .ch-letters input{border-bottom-color:#2d6a4f;color:#2d6a4f;background:transparent}.ch-letters input:focus{outline:2px solid #e07a1f}' +
    '.ch-hint{margin-top:3px;font-size:.78rem;font-weight:800;color:#a0521a;max-width:14em}.ch-ok{color:#2d6a4f;font-weight:900}' +
    '.ch-msg{margin-top:8px;min-height:1.3em;font-weight:800}.ch-msg .sp-who{font-weight:900}.ch-whole{margin-top:10px;border-top:2px dashed #cbd2da;padding-top:8px}.ch-hidden .ch-letters input{color:transparent;text-shadow:none}' +
    '.ch-btns{margin-top:8px;display:flex;gap:8px;flex-wrap:wrap}' +
    /* T-294 reveal */
    '.ch-look{display:inline-block;margin:0 0 4px;padding:2px 10px;border:2px dashed #2f6fbd;border-radius:8px;background:#eef4fc}.ch-look b{font-size:1.5rem;letter-spacing:.12em;color:#1c4f8f}' +
    '.ty-look b{font-size:2rem}.ch-part.shown{border-color:#2f6fbd}.ty-fix{display:inline-block;width:.9em;text-align:center;font-weight:900;font-size:1.15rem;align-self:flex-end}';
  function css() { if (document.getElementById('sp-css')) return; var s = document.createElement('style'); s.id = 'sp-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function spk(text, extra) { return '<button type="button" class="sp-spk" data-say="' + esc(text) + '"' + (extra || '') + ' aria-label="Listen">\ud83d\udd0a</button>'; }

  /* ------------------------------------------------------------ 3. WATCH */
  /* opts: lang() -> code or '', tr(word, meaning, lang, cb), onHit(ruleId, written) */
  S.watch = function (els, opts) {
    opts = opts || {}; css();
    (els && els.length !== undefined ? Array.prototype.slice.call(els) : [els]).forEach(function (el) {
      if (!el || el.dataset.spWatched) return; el.dataset.spWatched = '1';
      var tip = document.createElement('div'); tip.className = 'sp-tip'; tip.setAttribute('translate', 'no');
      el.insertAdjacentElement('afterend', tip);
      var dismissed = {}, shown = '', logged = {};
      function find(txt) {
        for (var r = 0; r < RULES.length; r++) {
          var rule = RULES[r]; rule.re.lastIndex = 0; var m;
          while ((m = rule.re.exec(txt))) {
            var word = m[1], at = m.index + m[0].lastIndexOf(word), end = at + word.length;
            if (end >= txt.length) continue;                 /* still typing this word */
            if (/[A-Za-z]/.test(txt.charAt(end))) continue;
            if (dismissed[rule.id + '|' + word.toLowerCase()]) continue;
            return { rule: rule, word: word };
          }
        }
        return null;
      }
      function card(w, mine) {
        var d = WORDS[w] || { def: '' };
        return '<div class="sp-card' + (mine ? ' mine' : '') + '"><div class="sp-pic">' + (PIC[w] || '') + '</div><div>' +
          (mine ? '<span class="sp-tag">you wrote</span><br>' : '') +
          '<span class="sp-w">' + esc(w) + '</span> ' + spk(w) + '<div class="sp-d">' + esc(d.def) + ' ' + spk(d.def) + '</div>' +
          '<div class="sp-tr" data-w="' + esc(w) + '"></div></div></div>';
      }
      function render(hit) {
        var key = hit.rule.id + '|' + hit.word.toLowerCase();
        if (shown === key) return; shown = key;
        var c = CAST[(hit.rule.id.length + hit.word.length) % CAST.length], line = LINES[hit.word.length % LINES.length];
        var p = hit.rule.pair, h = '<div class="sp-q"><span class="sp-who" style="color:' + c[1] + '">' + c[0] + ':</span> ' + line + ' ' + spk(line) + '</div>';
        h += '<div style="font-weight:900;margin-bottom:6px">' + esc(hit.rule.ask) + (p[0] ? ' Which one do you mean?' : '') + '</div><div class="sp-cards">';
        if (p[0]) h += card(p[0], true);
        h += card(p[1], !p[0] ? false : false) + '</div>';
        if (!p[0]) h = h.replace('<div class="sp-cards">', '<div style="margin:-2px 0 6px">You wrote <b>' + esc(hit.word) + '</b>. ' + spk(hit.word) + '</div><div class="sp-cards">');
        var st = STRIPS[hit.rule.strip];
        if (st) h += '<div class="sp-strip">' + st.rule + ' ' + spk(st.rule.replace(/<[^>]+>/g, '').replace('o + rr', 'o and double r').replace('ar', 'ar, like car')) + '<br>' +
          st.words.map(function (w) { return '<span class="sp-chip" data-say="' + w + '">' + w + ' \ud83d\udd0a</span>'; }).join('') + '</div>';
        h += '<div class="sp-btns">' + (p[0] ? '<button type="button" data-keep="1">I mean <b>' + esc(p[0]) + '</b></button>' : '') +
          '<button type="button" data-keep="1">' + (p[0] ? 'Close' : 'OK') + '</button></div>';
        tip.innerHTML = h; tip.classList.add('show');
        tip.querySelectorAll('.sp-tr').forEach(function (t) { fillTr(t, t.getAttribute('data-w')); });
        if (!logged[key]) { logged[key] = 1; try { opts.onHit && opts.onHit(hit.rule.id, hit.word.toLowerCase()); } catch (e) {} }
        tip._hit = key;
      }
      function fillTr(t, w) {
        var lg = opts.lang ? opts.lang() : '';
        var none = '<b class="none">' + esc(w) + '</b>';
        if (!lg || !opts.tr) { t.innerHTML = lg ? none : ''; return; }
        t.innerHTML = '<span style="color:#8b98a8">\u2026</span>';
        opts.tr(w, (WORDS[w] || {}).def || '', lg, function (x) { t.innerHTML = x ? '<b>' + esc(x) + '</b>' : none; });
      }
      function refresh() {
        var hit = find(el.value || '');
        if (!hit) { tip.classList.remove('show'); tip.innerHTML = ''; shown = ''; return; }
        render(hit);
      }
      tip.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-say]');
        if (b) { say(b.getAttribute('data-say'), 0.8); return; }
        var k = ev.target.closest('[data-keep]');
        if (k && tip._hit) { dismissed[tip._hit] = 1; shown = ''; refresh(); }
      });
      var t; el.addEventListener('input', function () { clearTimeout(t); t = setTimeout(refresh, 450); });
      el._spRefresh = refresh; refresh();
    });
  };

  /* ------------------------------------------------------------ 4. CHUNKS */
  /* say: what the voice says for that part (a sound spelling). hint: shown only after a miss on that part. */
  var CHUNKS = {
    collaborative: [{ t: 'col', say: 'call', hint: 'Sounds like "call". One vowel: o.' }, { t: 'lab', say: 'lab', hint: 'This part starts with the same letter the part before ended with.' },
      { t: 'o', say: 'uh', hint: 'One vowel, the same as in the first part.' }, { t: 'ra', say: 'ruh', hint: 'Two letters.' }, { t: 'tive', say: 'tiv', hint: 'Sounds like "tiv", but the e at the end is silent.' }],
    responsible: [{ t: 're', say: 'ree', hint: 'Two letters.' }, { t: 'spon', say: 'spahn', hint: 'Sounds like "spahn", spelled with o.' }, { t: 'si', say: 'suh', hint: 'Two letters, with i.' }, { t: 'ble', say: 'bull', hint: 'Sounds like "bull"; the e at the end is silent.' }],
    imaginative: [{ t: 'im', say: 'im', hint: 'Two letters.' }, { t: 'ag', say: 'adj', hint: 'Here g sounds like j.' }, { t: 'i', say: 'ih', hint: 'One letter.' }, { t: 'na', say: 'nuh', hint: 'Two letters, with a.' }, { t: 'tive', say: 'tiv', hint: 'Sounds like "tiv", but the e at the end is silent.' }],
    curious: [{ t: 'cur', say: 'cure', hint: 'Three letters. It starts with c, not k.' }, { t: 'i', say: 'ee', hint: 'One letter.' }, { t: 'ous', say: 'us', hint: 'Sounds like "us", spelled with three letters.' }],
    studious: [{ t: 'stu', say: 'stew', hint: 'Three letters.' }, { t: 'di', say: 'dee', hint: 'Two letters, with i.' }, { t: 'ous', say: 'us', hint: 'Sounds like "us", spelled with three letters.' }],
    creative: [{ t: 'cre', say: 'cree', hint: 'Three letters.' }, { t: 'a', say: 'ay', hint: 'One letter.' }, { t: 'tive', say: 'tiv', hint: 'Sounds like "tiv", but the e at the end is silent.' }],
    honest: [{ t: 'hon', say: 'on', hint: 'The first letter is silent: you don\u2019t hear it.' }, { t: 'est', say: 'ist', hint: 'Three letters, with e.' }],
    helpful: [{ t: 'help', say: 'help', hint: 'Four letters.' }, { t: 'ful', say: 'full', hint: 'Sounds like "full", but only ONE l.' }]
  };
  S.CHUNKS = CHUNKS;

  /* T-294 (Nov 5): REVEAL AFTER 3 MISSES, replacing "never reveal". Misses 1–2 on a part (or on the
     whole word) get its hint; on the 3rd miss that part's letters (or the whole word) are SHOWN big
     with 🔊 and "Look, listen, then type it yourself." The student types it once to finish.
     Score: Toby chose FULL — finished after a reveal = 1 point, same as solved alone. shown:true is
     passed to onDone for the dashboard only. Nothing turns red (ELD 101); every miss is counted.
     opts.reveal = misses before the reveal (default 3; 0 = never, for pages Toby names as tests). */
  var LOOK = 'Look, listen, then type it yourself.';

  /* opts: word, chunks (else CHUNKS[word]), value (a saved answer; equal to word = solved), reveal,
     onInput(value), onDone({first, misses, shown}), onMiss(part, n, shownNow) */
  S.chunks = function (host, opts) {
    css(); opts = opts || {};
    var word = String(opts.word || '').toLowerCase(), parts = opts.chunks || CHUNKS[word];
    if (!host || !word) return null;
    if (!parts) parts = [{ t: word, say: word, hint: 'It has ' + word.length + ' letters.' }];
    var REV = opts.reveal == null ? 3 : +opts.reveal;
    var ok = parts.map(function () { return false; }), pm = parts.map(function () { return 0; }), shownPart = {},
      wm = 0, shownWhole = false, misses = 0, phase = 1, solved = (String(opts.value || '').toLowerCase() === word);
    if (solved) { ok = ok.map(function () { return true; }); phase = 3; }
    function anyShown() { return shownWhole || Object.keys(shownPart).length > 0; }
    host.classList.add('ch-box');
    function boxes(n, cls, vals) {
      var h = '<div class="ch-letters">'; for (var i = 0; i < n; i++) h += '<input maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="' + cls + '"' + (vals ? ' value="' + esc(vals[i] || '') + '" readonly' : '') + '>';
      return h + '</div>';
    }
    function look(text, sayText, k) {
      return '<div class="ch-look"><b>' + esc(text) + '</b> <button type="button" class="sp-spk" data-look="' + esc(sayText) + '" aria-label="Listen">\ud83d\udd0a</button></div>';
    }
    function draw() {
      var h = '<div class="ch-top"><button type="button" data-say-word="1">\ud83d\udd0a ' + 'Hear the word</button><button type="button" data-say-word="slow">\ud83d\udc22 Slow</button>' +
        '<span style="font-weight:800;color:#5c6b62">' + parts.length + ' parts</span></div><div class="ch-row' + (phase === 2 ? ' ch-hidden' : '') + '">';
      parts.forEach(function (p, i) {
        if (i) h += '<span class="ch-dot">\u00b7</span>';
        var sh = !ok[i] && shownPart[i];
        h += '<div class="ch-part' + (ok[i] ? ' ok' : '') + (sh ? ' shown' : '') + '" data-i="' + i + '">' + (sh ? look(p.t, p.say, i) : '') + boxes(p.t.length, 'chp', ok[i] ? p.t.split('') : null) +
          '<button type="button" class="sp-spk" data-part="' + i + '" aria-label="Listen to this part">\ud83d\udd0a</button>' + (ok[i] ? '<span class="ch-ok">\u2713</span>' : '') +
          '<div class="ch-hint">' + (ok[i] ? '' : sh ? LOOK : pm[i] ? esc(p.hint || 'Listen to this part again.') : '') + '</div></div>';
      });
      h += '</div>';
      if (phase >= 2) h += '<div class="ch-whole"><div style="font-weight:900;margin-bottom:4px">Now the whole word, all together:</div><div class="ch-part' + (phase === 3 ? ' ok' : '') + (phase === 2 && shownWhole ? ' shown' : '') + '" data-whole="1" style="display:inline-block">' +
        (phase === 2 && shownWhole ? look(word, word) : '') +
        boxes(word.length, 'chw', phase === 3 ? word.split('') : null) + (phase === 3 ? '<span class="ch-ok">\u2713 ' + esc(word) + '</span>' : '') +
        '<div class="ch-hint">' + (phase === 2 ? (shownWhole ? LOOK : wm ? 'Look at your parts: tap \ud83d\udc40 Peek, then try again.' : '') : '') + '</div></div>' +
        (phase === 2 ? '<div class="ch-btns"><button type="button" data-peek="1">\ud83d\udc40 Peek at your parts</button></div>' : '') + '</div>';
      if (phase < 3) h += '<div class="ch-btns"><button type="button" data-check="1" style="background:#2d6a4f;color:#fff">Check</button></div>';
      h += '<div class="ch-msg"></div>';
      host.innerHTML = h; wire();
    }
    function msg(t, who) { var m = host.querySelector('.ch-msg'); if (!m) return; var c = CAST[(misses + 1) % CAST.length]; m.innerHTML = who ? '<span class="sp-who" style="color:' + c[1] + '">' + c[0] + ':</span> ' + esc(t) : esc(t); }
    function val(sel) { return Array.prototype.map.call(host.querySelectorAll(sel), function (x) { return (x.value || '').toLowerCase(); }).join(''); }
    function wire() {
      var ins = host.querySelectorAll('input');
      Array.prototype.forEach.call(ins, function (inp, k) {
        if (inp.readOnly) return;
        inp.addEventListener('input', function () {
          inp.value = inp.value.replace(/[^A-Za-z]/g, '').slice(-1).toLowerCase();
          if (inp.value) { for (var j = k + 1; j < ins.length; j++) { if (!ins[j].readOnly) { ins[j].focus(); break; } } }
          if (opts.onInput) try { opts.onInput(phase === 2 ? val('input.chw') : ''); } catch (e) {}
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value) { for (var j = k - 1; j >= 0; j--) { if (!ins[j].readOnly) { ins[j].focus(); ins[j].value = ''; break; } } e.preventDefault(); }
          else if (e.key === 'Enter') { check(); }
        });
      });
      host.querySelectorAll('[data-part]').forEach(function (b) { b.onclick = function () { var p = parts[+b.getAttribute('data-part')]; say(p.say, 0.7, true); }; });
      host.querySelectorAll('[data-look]').forEach(function (b) { b.onclick = function () { say(b.getAttribute('data-look'), 0.7, true); }; });
      host.querySelectorAll('[data-say-word]').forEach(function (b) { b.onclick = function () { say(word, b.getAttribute('data-say-word') === 'slow' ? 0.6 : 0.85); }; });
      var pk = host.querySelector('[data-peek]'); if (pk) pk.onclick = function () { var r = host.querySelector('.ch-row'); r.classList.toggle('ch-hidden'); };
      var ck = host.querySelector('[data-check]'); if (ck) ck.onclick = check;
    }
    function check() {
      if (phase === 1) {
        var any = false, newShow = [], vals = {};
        parts.forEach(function (p, i) {
          if (ok[i]) return;
          var el = host.querySelector('.ch-part[data-i="' + i + '"]'), cur = Array.prototype.map.call(el.querySelectorAll('input'), function (x) { return x.value; }), got = cur.join('').toLowerCase();
          vals[i] = cur;
          if (got.length < p.t.length) return;
          any = true;
          if (got === p.t) { ok[i] = true; return; }
          misses++; pm[i]++;
          var showNow = REV > 0 && pm[i] >= REV && !shownPart[i];
          if (showNow) { shownPart[i] = 1; newShow.push(i); vals[i] = []; }
          if (opts.onMiss) try { opts.onMiss(i, pm[i], showNow); } catch (e) {}
        });
        if (ok.every(Boolean)) { phase = 2; draw(); msg('All the parts are right! Now type the whole word.', true); var f = host.querySelector('input.chw'); if (f) f.focus(); return; }
        draw();
        Object.keys(vals).forEach(function (i) { var ins = host.querySelectorAll('.ch-part[data-i="' + i + '"] input'); vals[i].forEach(function (v, k) { if (ins[k]) ins[k].value = v; }); });
        parts.forEach(function (p, i) { if (!ok[i] && pm[i] && newShow.indexOf(i) < 0) { var el = host.querySelector('.ch-part[data-i="' + i + '"]'); if (el) el.classList.add('wob'); } });
        if (newShow.length) { msg(LOOK, true); var p0 = parts[newShow[0]]; say(p0.say, 0.7, true); var fi = host.querySelector('.ch-part[data-i="' + newShow[0] + '"] input'); if (fi) fi.focus(); return; }
        msg(!any ? 'Fill in the boxes for a part first. Tap \ud83d\udd0a under it to hear it.' : (ok.some(Boolean) ? 'The green parts are right. Listen to the others again.' : 'Not yet. Tap \ud83d\udd0a under a part and listen.'), any);
        return;
      }
      if (phase === 2) {
        var got = val('input.chw');
        if (got.length < word.length) { msg('Fill every box, then Check.'); return; }
        if (got === word) {
          phase = 3; draw(); msg('Yes! ' + word + '.', true); say(word, 0.85);
          if (opts.onInput) try { opts.onInput(word); } catch (e) {}
          if (opts.onDone) try { opts.onDone({ first: misses === 0, misses: misses, shown: anyShown() }); } catch (e) {}
        } else {
          misses++; wm++;
          var showNow = REV > 0 && wm >= REV && !shownWhole;
          if (showNow) { shownWhole = true; draw(); msg(LOOK, true); say(word, 0.7); var f = host.querySelector('input.chw'); if (f) f.focus(); }
          else {
            var keep = Array.prototype.map.call(host.querySelectorAll('input.chw'), function (x) { return x.value; });
            draw(); var ins = host.querySelectorAll('input.chw'); keep.forEach(function (v, k) { if (ins[k]) ins[k].value = v; });
            var el = host.querySelector('[data-whole]'); el.classList.add('wob');
            msg('Close! Check each part against your boxes.', true);
          }
          if (opts.onMiss) try { opts.onMiss('whole', wm, showNow); } catch (e) {}
        }
      }
    }
    draw();
    return { get solved() { return phase === 3; }, get misses() { return misses; }, get shown() { return anyShown(); } };
  };

  /* ------------------------------------------------------------ 5. TYPED (T-294) */
  /* Any typed answer: one box per letter (spaces and punctuation stay fixed), 🔊, Check.
     Misses 1–2: the hint (opts.hint: text, or function(n) -> text) and a cast line.
     3rd miss: the word shown big with 🔊 + "Look, listen, then type it yourself." Typed once = done.
     opts: word, say (what the voice says; default word), hint, value (saved answer), reveal (default 3),
           onInput(value), onDone({first, misses, shown}), onMiss(n, shownNow) */
  S.typed = function (host, opts) {
    css(); opts = opts || {};
    var word = String(opts.word || ''), lw = word.toLowerCase(), REV = opts.reveal == null ? 3 : +opts.reveal;
    if (!host || !word) return null;
    var misses = 0, shown = false, done = String(opts.value || '').toLowerCase() === lw;
    host.classList.add('ch-box');
    function isL(c) { return /[A-Za-z]/.test(c); }
    function draw(keep) {
      var h = '<div class="ch-top"><button type="button" data-say-word="1">\ud83d\udd0a Listen</button><button type="button" data-say-word="slow">\ud83d\udc22 Slow</button></div>';
      if (shown && !done) h += '<div class="ch-look ty-look"><b>' + esc(word) + '</b> <button type="button" class="sp-spk" data-look="1" aria-label="Listen">\ud83d\udd0a</button></div><div class="ch-hint" style="max-width:none;margin-bottom:6px">' + LOOK + '</div>';
      h += '<div class="ch-part' + (done ? ' ok' : '') + '" style="display:inline-block"><div class="ch-letters">';
      for (var i = 0; i < word.length; i++) {
        var c = word.charAt(i);
        if (!isL(c)) { h += '<span class="ty-fix">' + (c === ' ' ? '&nbsp;' : esc(c)) + '</span>'; continue; }
        h += '<input maxlength="1" autocomplete="off" autocapitalize="off" spellcheck="false" class="tyi"' + (done ? ' value="' + esc(c.toLowerCase()) + '" readonly' : '') + '>';
      }
      h += '</div>' + (done ? '<span class="ch-ok">\u2713 ' + esc(word) + '</span>' : '') + '</div>';
      if (!done) h += '<div class="ch-btns"><button type="button" data-check="1" style="background:#2d6a4f;color:#fff">Check</button></div>';
      h += '<div class="ch-msg"></div>';
      host.innerHTML = h;
      var ins = host.querySelectorAll('input.tyi');
      if (keep) keep.forEach(function (v, k) { if (ins[k] && !ins[k].readOnly) ins[k].value = v; });
      Array.prototype.forEach.call(ins, function (inp, k) {
        if (inp.readOnly) return;
        inp.addEventListener('input', function () {
          inp.value = inp.value.replace(/[^A-Za-z]/g, '').slice(-1).toLowerCase();
          if (inp.value && ins[k + 1]) ins[k + 1].focus();
          if (opts.onInput) try { opts.onInput(value()); } catch (e) {}
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value && ins[k - 1]) { ins[k - 1].focus(); ins[k - 1].value = ''; e.preventDefault(); }
          else if (e.key === 'Enter') check();
        });
      });
      host.querySelectorAll('[data-say-word]').forEach(function (b) { b.onclick = function () { say(opts.say || word, b.getAttribute('data-say-word') === 'slow' ? 0.6 : 0.85); }; });
      var lk = host.querySelector('[data-look]'); if (lk) lk.onclick = function () { say(opts.say || word, 0.7); };
      var ck = host.querySelector('[data-check]'); if (ck) ck.onclick = check;
    }
    function value() {
      var ins = host.querySelectorAll('input.tyi'), k = 0, out = '';
      for (var i = 0; i < word.length; i++) { var c = word.charAt(i); if (!isL(c)) { out += c; continue; } out += (ins[k] && ins[k].value) || ''; k++; }
      return out;
    }
    function msg(t, who) { var m = host.querySelector('.ch-msg'); if (!m) return; var c = CAST[(misses + 2) % CAST.length]; m.innerHTML = who ? '<span class="sp-who" style="color:' + c[1] + '">' + c[0] + ':</span> ' + esc(t) : esc(t); }
    function check() {
      var got = value();
      if (got.replace(/[^A-Za-z]/g, '').length < lw.replace(/[^a-z]/g, '').length) { msg('Fill every box, then Check.'); return; }
      if (got.toLowerCase() === lw) {
        done = true; draw(); msg('Yes! ' + word + '.', true); say(opts.say || word, 0.85);
        if (opts.onInput) try { opts.onInput(word); } catch (e) {}
        if (opts.onDone) try { opts.onDone({ first: misses === 0, misses: misses, shown: shown }); } catch (e) {}
        return;
      }
      misses++;
      var showNow = REV > 0 && misses >= REV && !shown;
      if (showNow) { shown = true; draw(); msg(LOOK, true); say(opts.say || word, 0.7); var f = host.querySelector('input.tyi'); if (f) f.focus(); }
      else {
        var keep = Array.prototype.map.call(host.querySelectorAll('input.tyi'), function (x) { return x.value; });
        draw(keep); var el = host.querySelector('.ch-part'); el.classList.add('wob');
        var hint = typeof opts.hint === 'function' ? opts.hint(misses) : opts.hint;
        msg(shown ? LOOK : (hint || 'Listen again \ud83d\udd0a and check each letter.'), true);
      }
      if (opts.onMiss) try { opts.onMiss(misses, showNow); } catch (e) {}
    }
    draw();
    return { get solved() { return done; }, get misses() { return misses; }, get shown() { return shown; } };
  };
})();
