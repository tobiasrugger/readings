/* readings/taste/content.js — T-418 (Nov 15 2026). All the words of the ELD 101 Taste Test page, in one place,
   so the student page (taste/index.html) and its dashboard (taste/dashboard.html, which pre-translates them and
   shows the class wall) always read the same text. Change a line here and both follow. */
window.TASTE = (function () {
  /* g = group: taste 👅, feel 🦷, look 👀, smell 👃. Word cards: picture, then word: definition, then translation. */
  var GROUPS = [
    { k: 'taste', label: 'Taste', icon: '👅', lead: 'It tastes', d: 'What does it taste like?' },
    { k: 'feel', label: 'Feel', icon: '🦷', lead: 'It feels', d: 'How does it feel in your mouth?' },
    { k: 'look', label: 'Look', icon: '👀', lead: 'It looks', d: 'How does it look?' },
    { k: 'smell', label: 'Smell', icon: '👃', lead: 'It smells', d: 'How does it smell?' }
  ];
  var WORDS = [
    { w: 'sweet', g: 'taste', d: 'tastes like sugar', s: 'The lollipop is sweet.' },
    { w: 'sour', g: 'taste', d: 'tastes like a lemon; your face goes tight', s: 'The lemon candy is very sour.' },
    { w: 'salty', g: 'taste', d: 'tastes like salt', s: 'The chips are salty.' },
    { w: 'bitter', g: 'taste', d: 'a strong taste, like coffee or dark chocolate', s: 'Dark chocolate is a little bitter.' },
    { w: 'spicy', g: 'taste', d: 'hot in your mouth, like chili', s: 'Hot chips are very spicy.' },
    { w: 'buttery', g: 'taste', d: 'tastes like butter', s: 'The popcorn is buttery.' },
    { w: 'crunchy', g: 'feel', d: 'makes a loud sound when you bite it', s: 'The apple is crunchy.' },
    { w: 'crispy', g: 'feel', d: 'thin, dry, and breaks easily, like a chip', s: 'The chips are thin and crispy.' },
    { w: 'chewy', g: 'feel', d: 'you chew it for a long time', s: 'Gummy bears are chewy.' },
    { w: 'soft', g: 'feel', d: 'easy to press; not hard', s: 'The marshmallow is soft.' },
    { w: 'hard', g: 'feel', d: 'not soft; difficult to bite', s: 'A lollipop is hard.' },
    { w: 'sticky', g: 'feel', d: 'it stays on your fingers or teeth', s: 'Caramel is sticky.' },
    { w: 'creamy', g: 'feel', d: 'smooth and thick, like ice cream', s: 'The milk chocolate is creamy.' },
    { w: 'juicy', g: 'feel', d: 'full of juice', s: 'The orange is juicy.' },
    { w: 'shiny', g: 'look', d: 'bright; the light shines on it', s: 'The red candy is shiny.' },
    { w: 'colorful', g: 'look', d: 'it has many colors', s: 'The jelly beans are colorful.' },
    { w: 'fruity', g: 'smell', d: 'smells or tastes like fruit', s: 'The gummy bears are fruity.' },
    { w: 'minty', g: 'smell', d: 'cool and fresh, like mint', s: 'The gum is minty.' }
  ];
  /* listening: 12 of the 18 words, picked once per student and saved */
  var LISTEN_N = 12;
  /* "Which one is …?" — two pictures, one word. a = the right word, b = the other picture. */
  var PAIRS = [
    { a: 'crunchy', b: 'soft' }, { a: 'sour', b: 'sweet' }, { a: 'chewy', b: 'crispy' },
    { a: 'hard', b: 'soft' }, { a: 'salty', b: 'sweet' }, { a: 'sticky', b: 'shiny' }
  ];
  /* sort: which kind of word is it? (one word at a time, four doors) */
  var SORT = ['spicy', 'crispy', 'colorful', 'minty', 'bitter', 'sticky', 'juicy', 'fruity'];
  /* candies drawn by the page. Mr. Toby can rename them or swap in a photo on the dashboard (gal_settings taste_candies). */
  var CANDY = [
    { id: 'gummy', name: 'gummy bears', pl: true },
    { id: 'lolly', name: 'lollipop' },
    { id: 'choco', name: 'chocolate bar' },
    { id: 'sourstrip', name: 'sour strips', pl: true },
    { id: 'mint', name: 'mints', pl: true },
    { id: 'caramel', name: 'caramel' },
    { id: 'popcorn', name: 'popcorn' },
    { id: 'chips', name: 'chips', pl: true }
  ];
  var LAB_NEED = 4;   /* candies everyone describes; more is extra */
  /* grammar from the lab: one plain blank ___ (multiple choice never shows a letter count) */
  var GRAM = [
    { q: 'Gummy bears ___ chewy.', o: ['are', 'is', 'be'], a: 'are',
      h: ['Gummy bears = more than one. Use are.', 'One thing is. Two or more things are.'] },
    { q: 'The lollipop ___ sweet.', o: ['is', 'are', 'am'], a: 'is',
      h: ['The lollipop = one thing.', 'One thing is: the lollipop is, the mint is.'] },
    { q: 'The chips are salty ___ crunchy.', o: ['and', 'but', 'because'], a: 'and',
      h: ['Salty and crunchy are both true. Add them together.', 'Two good things go together with and.'] },
    { q: 'The lemon is sour, ___ the lollipop is sweet.', o: ['but', 'and', 'so'], a: 'but',
      h: ['Sour and sweet are opposites. Use the word for a difference.', 'Different ideas: … , but …'] },
    { q: 'This candy is ___ sour! My face hurts.', o: ['very', 'much', 'many'], a: 'very',
      h: ['Which word goes before an adjective, like very big?', 'very sweet, very hot, very sour'] }
  ];
  /* paragraph frame (help level 1). Each {} is a blank the student fills. */
  var FRAME = [
    'Today I tasted {n} candies.',
    'The {c1} {v1} {a1} and {a2}.',
    'The {c2} {v2} {a3}, but the {c3} {v3} {a4}.',
    'My favorite is the {fav} because it is {why}.'
  ];
  var FAV_WHY = ['sweet', 'sour', 'chewy', 'crunchy', 'creamy', 'fruity', 'salty', 'spicy', 'minty'];
  var DIR = {
    l1: 'Look at the picture. Finish the two sentences. Any answer is OK!',
    sA: 'Tap a word. What do you see in the picture?',
    tA: 'Which one do you want to taste? Tap one.',
    w0: 'Eighteen words for food. Look at each picture. Tap 🔊 and listen. Say the word.',
    w2: 'Tap the big 🔊. Then tap the picture you heard.',
    p1: 'Listen. Which picture is it? Tap it.',
    p2: 'What kind of word is it? Tap a door: Taste, Feel, Look, or Smell.',
    lab0: 'You do not have to eat it. You can look, touch, and smell, too.',
    lab1: 'Look at each candy. Tap a Taste word and a Feel word. Look and Smell words are extra. Describe at least 4 candies.',
    lab2: 'Tap the stars: how much do you like it?',
    g1: 'Tap the right word for the blank.',
    s1: 'Write one sentence about one candy. Use two words from your lab.',
    pa1: 'Now write a paragraph. Choose your help. All three count the same.',
    f1: 'Which candy is your favorite? Tap it.',
    f2: 'Why? Tap a word, or write your own.',
    f3: 'Now say your sentence out loud. Tap 🎤.',
    m1: 'Extra: show your own food! Take a picture or choose a photo. Food only, no faces.',
    m2: 'Describe it. Tap words, then write two or three sentences.',
    m3: 'Class wall: look at your classmates’ food.'
  };
  var LOOK = {
    see: ['candy', 'chips', 'popcorn', 'a lemon', 'friends', 'a table'],
    want: ['the gummy bears', 'the lollipop', 'the chocolate', 'the chips', 'the popcorn'],
    think: 'What do you think it tastes like? Sweet? Salty? Sour?'
  };
  var NEXT = [
    'Start here. Tap a word: what do you see?', 'Now tap one: which do you want to taste?', 'Next: learn the words.',
    'Look at each picture and tap 🔊. Then tap “I’m ready”.', 'Tap the big 🔊 and listen.', 'Tap the picture you heard.',
    'Next: practice the words.', 'Tap 🔊 and listen. Then tap the picture.', 'Tap a door: what kind of word is it?',
    'Next: the Candy Lab!', 'Tap words for this candy: taste, feel, look, smell.', 'Tap the stars for this candy.',
    'Next: write about the candy.', 'Tap the right word.', 'Write one sentence about a candy.', 'Choose your help for the paragraph.',
    'Write your paragraph.', 'Next: your favorite!', 'Tap your favorite candy.', 'Tap a word: why is it your favorite?',
    'Now tap 🎤 and say it out loud.', 'You finished this part.', 'Mr. Toby asked you to fix your writing.',
    'Almost done! Finish the part with no ✓.', 'Extra: show your own food!', 'Choose a photo of your food.', 'Tap words for your food.',
    'Write about your food.', 'Tap “Post to the class wall”.', 'Good! Now the next candy.'
  ];
  function lines() {
    var out = [], seen = {};
    function add(s) { s = String(s || '').trim(); if (s && !seen[s]) { seen[s] = 1; out.push(s); } }
    GROUPS.forEach(function (x) { add(x.label); add(x.d); add(x.lead); });
    WORDS.forEach(function (x) { add(x.w); add(x.d); add(x.s); });
    CANDY.forEach(function (x) { add(x.name); });
    GRAM.forEach(function (x) { add(x.q); x.o.forEach(add); x.h.forEach(add); });
    FRAME.forEach(add);
    Object.keys(DIR).forEach(function (k) { add(DIR[k]); });
    LOOK.see.concat(LOOK.want).forEach(add); add(LOOK.think);
    NEXT.forEach(add);
    return out;
  }
  /* ---- scoring, shared with the dashboard so a ✓/✗ recount matches the student page exactly ---- */
  function words(s) { return String(s || '').trim().split(/\s+/).filter(Boolean); }
  function hasFoodWord(s) { var t = ' ' + String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ') + ' '; return WORDS.some(function (w) { return t.indexOf(' ' + w.w + ' ') >= 0; }); }
  function frameKeys() { var k = []; FRAME.forEach(function (l) { l.replace(/\{(\w+)\}/g, function (_, x) { k.push(x); }); }); return k; }
  function frameText(f) { f = f || {}; return FRAME.map(function (l) { return l.replace(/\{(\w+)\}/g, function (_, k) { return f[k] || '___'; }); }).join(' '); }
  function frameFull(f) { f = f || {}; return frameKeys().every(function (k) { return !!f[k]; }); }
  function parText(par) { par = par || {}; return par.lvl === 'frame' ? frameText(par.f) : String(par.text || '').trim(); }
  function parOk(par) { par = par || {}; return par.lvl === 'frame' ? frameFull(par.f) : (words(par.text).length >= 20 && hasFoodWord(par.text)); }
  function sentOk(s) { return words(s).length >= 4 && hasFoodWord(s); }
  function listAnd(a) { a = a.filter(Boolean); if (a.length < 2) return a.join(''); if (a.length === 2) return a[0] + ' and ' + a[1]; return a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1]; }
  function theName(c) { var n = String(c.name || '').trim(); return /^(the|a|an|my)\s/i.test(n) ? n : 'the ' + n; }
  function favText(fav, c) { fav = fav || {}; if (!c) return ''; var why = (fav.why || []).slice(0, 2); if (fav.own) why = [String(fav.own).replace(/[.!]+$/, '')]; if (!why.length) return '';
    return 'My favorite candy is ' + theName(c) + ' because ' + (c.pl ? 'they are ' : 'it is ') + listAnd(why) + '.'; }
  /* p = saved payload, marks = Mr. Toby's marks, list = the candy list in use, off(marks,key,answer) = GALMARK.off */
  function score(p, marks, list, off) {
    p = p || {}; list = (list || CANDY).filter(function (c) { return c && c.id && !c.off; }); off = off || function () { return false; };
    function cnt(R, n) { var k = 0; for (var i = 0; i < n; i++) if (R && R[i] && R[i].done) k++; return k; }
    var R = p.R || {}, L = p.look || {}, need = Math.min(LAB_NEED, list.length), lab = 0;
    list.forEach(function (c) { var x = (p.lab || {})[c.id]; if (x && x.taste && x.taste.length && x.feel && x.feel.length) lab++; });
    var cmap = {}; list.forEach(function (c) { cmap[c.id] = c; });
    var ft = favText(p.fav, cmap[(p.fav || {}).c]), f = p.food || {};
    var core = (L.see ? 1 : 0) + (L.want ? 1 : 0) + cnt(R.w, LISTEN_N) + cnt(R.p, PAIRS.length) + cnt(R.s, SORT.length) + Math.min(need, lab) + cnt(R.g, GRAM.length) +
      (sentOk(p.sent) && !off(marks, 'w.sent', String(p.sent || '').trim()) ? 1 : 0) + (parOk(p.par) && !off(marks, 'w.par', parText(p.par)) ? 1 : 0) +
      (ft && !off(marks, 'fav', ft) ? 1 : 0) + (p.say && p.say.done ? 1 : 0);
    var food = f.posted && words(f.text).length >= 6 && !off(marks, 'food', f.text) ? 1 : 0;
    var max = 2 + LISTEN_N + PAIRS.length + SORT.length + need + GRAM.length + 4;
    return { score: Math.min(max, core + food), max: max, core: core, lab: lab, need: need, fav: ft };
  }
  return { score: score, favText: favText, parText: parText, parOk: parOk, sentOk: sentOk, frameText: frameText, theName: theName, listAnd: listAnd, words: words,
    GROUPS: GROUPS, WORDS: WORDS, LISTEN_N: LISTEN_N, PAIRS: PAIRS, SORT: SORT, CANDY: CANDY, LAB_NEED: LAB_NEED, GRAM: GRAM,
    FRAME: FRAME, FAV_WHY: FAV_WHY, DIR: DIR, LOOK: LOOK, NEXT: NEXT, lines: lines,
    SLUG: 'taste', TABLE: 'eld103_donow', UNIT: 'taste', PHOTO_UNIT: 'taste-photo', SETTINGS_KEY: 'taste_candies' };
})();
