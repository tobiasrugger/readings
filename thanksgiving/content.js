/* readings/thanksgiving/content.js — T-498 (Nov 20 2026). Words, reading, questions and the score rule for
   the ELD 101 Thanksgiving reading. Shared by thanksgiving/index.html (student) and thanksgiving/dashboard.html.
   The reading is Mr. Toby's own worksheet "Thanksgiving in the United States" (Nov 20 2026), word for word.
   Saves to eld103_donow, unit 'thanksgiving' (no new table). Translations cache in song_tr slug 'thanksgiving'. */
(function () {
  var T = window.TG = { TABLE: 'eld103_donow', UNIT: 'thanksgiving', SLUG: 'thanksgiving' };

  /* Look and think: opinion, never wrong */
  T.LOOK = {
    see: ['a turkey', 'a family', 'a pie', 'a table', 'a grandmother'],
    won: ['the family is so happy.', 'the turkey is so big.', 'there is no school next week.'],
    think: 'Thanksgiving = thanks + giving. What do you say “thank you” for?'
  };

  /* Words before reading: picture, then word: definition, then translation. Sentences are from the reading. */
  T.WORDS = [
    { w: 'holiday', d: 'a special day with no school or work', s: 'Thanksgiving is an important holiday in the United States.', art: 'holiday' },
    { w: 'turkey', d: 'a big bird; people cook it and eat it', s: 'On Thanksgiving, my father likes to cook a turkey.', art: 'turkey' },
    { w: 'cranberry sauce', d: 'a sweet red sauce made from small red fruit', s: 'My grandmother likes to make cranberry sauce.', art: 'cranberry' },
    { w: 'potatoes', d: 'a vegetable from the ground; you can mash it', s: 'My mother likes to cook potatoes.', art: 'potatoes' },
    { w: 'pumpkin pie', d: 'a sweet orange pie', s: 'I do not like to cook, but I love to eat pumpkin pie!', art: 'pie' },
    { w: 'cook', d: 'make food hot, ready to eat', s: 'On Thanksgiving, people like to cook many different foods.', art: 'cook' },
    { w: 'grandparents', d: 'your father’s or mother’s mother and father', s: 'My grandparents are kind and funny.', art: 'grandparents' },
    { w: 'wash the dishes', d: 'clean the plates with water and soap', s: 'My grandmother and I like to wash the dishes in the kitchen.', art: 'dishes' },
    { w: 'play cards', d: 'play a game with small paper cards', s: 'After dinner, they like to play cards in the living room.', art: 'cards' },
    { w: 'relax', d: 'rest; do nothing; feel calm', s: 'After dinner, my father likes to relax in the living room.', art: 'relax' }
  ];

  /* The reading, in four parts. Each paragraph = a list of sentences (each gets its own 🔊). */
  T.PARTS = [
    { id: 'p1', title: 'Thanksgiving in the United States', art: 'table',
      paras: [
        ['There is no school next week!', 'Why is there no school?', 'There is no school because of Thanksgiving.'],
        ['Thanksgiving is an important holiday in the United States.', 'It is a Thursday in November.', 'On Thanksgiving, people like to cook many different foods.', 'They like to eat a big dinner with their family.', 'Before eating, they like to say “Thank you for all the good food.”', 'Thanksgiving is a holiday for saying “Thank you”.', 'On Thanksgiving, many families like to eat four foods:']
      ],
      foods: true,
      after: ['Today we will read about three families and the things they like to do on Thanksgiving.'] },
    { id: 'p2', title: 'Family #1: Mark’s family', art: 'mark',
      paras: [
        ['Hello, my name is Mark, and I love Thanksgiving.', 'This is a picture of my family’s Thanksgiving.', 'My grandparents, parents, brothers, sisters and I are all eating Thanksgiving dinner.', 'We are talking about school, work, and sports.', 'We are eating in the dining room at 6:00 p.m.', 'On Thanksgiving, my father likes to cook a turkey.', 'My grandmother likes to make cranberry sauce.', 'My mother likes to cook potatoes.', 'I do not like to cook, but I love to eat pumpkin pie!'],
        ['After dinner, my mother likes to talk on the phone to her sisters.', 'My father and grandfather like to watch football on TV in the living room.', 'My grandmother and I like to wash the dishes in the kitchen.', 'My brothers and sisters like to read and play video games in their bedrooms.', 'Thanksgiving is a fun day!']
      ] },
    { id: 'p3', title: 'Family #2: The Lee family', art: 'lee',
      paras: [
        ['This is a picture of the Lee family’s Thanksgiving.', 'They are eating in the kitchen at John Lee and Ellen Lee’s house.', 'They are talking about John and Ellen’s new daughter, Courtney.', 'Courtney is 3 months old.', 'John’s two brothers and his father are also eating dinner with them.', 'For Thanksgiving, John’s father likes to cook a turkey.', 'Ellen likes to make rice and salad.', 'They like to say “Thank you” for all the good food.', 'After dinner, they like to play cards in the living room from 7:00 p.m.-11:00 p.m.']
      ] },
    { id: 'p4', title: 'Family #3: Andre’s family', art: 'andre',
      paras: [
        ['My name is Andre, and I think Thanksgiving is very fun.', 'I like to cook many foods.', 'I also like to eat turkey with my grandparents, parents, and brother and sister.', 'My grandparents are kind and funny.', 'I like to go to their house.'],
        ['After dinner, my father likes to relax in the living room.', 'My grandmother and mother like to sing in the kitchen.', 'My grandfather, brother, sister, and I like to play basketball outside.', 'The next day, we like to eat turkey again!']
      ] }
  ];


  /* T-503 · key phrases in the reading (curved orange underline + a box beside the paragraph).
     [text|k] = this chunk matches English word k of the phrase (0 = first word); several words: [text|1,2].
     Plain text = no clean match, so it never turns blue. Other languages come from the translator, without matching.
     "wash the dishes" and "play cards" are left out on purpose: they are Words-step words and already have a word box. */
  T.PHRASES = [
    { p: 'no school', es: '[no hay|0] [clases|1]', zh: '[不|0][上学|1]', ar: '[لا|0] [مدرسة|1]', vi: '[nghỉ học|0,1]', th: '[ไม่มี|0][เรียน|1]', ne: '[विद्यालय|1] [बिदा|0]' },
    { p: 'next week', es: '[la próxima|0] [semana|1]', zh: '[下|0][周|1]', ar: '[الأسبوع|1] [القادم|0]', vi: '[tuần|1] [sau|0]', th: '[สัปดาห์|1][หน้า|0]', ne: '[अर्को|0] [हप्ता|1]' },
    { p: 'grandparents, parents, brothers, sisters', es: '[abuelos|0], [padres|1], [hermanos|2], [hermanas|3]', zh: '[祖父母|0]、[父母|1]、[兄弟|2]、[姐妹|3]', ar: '[الأجداد|0]، [الوالدان|1]، [الإخوة|2]، [الأخوات|3]', vi: '[ông bà|0], [bố mẹ|1], [anh em trai|2], [chị em gái|3]', th: '[ปู่ย่าตายาย|0] [พ่อแม่|1] [พี่ชายน้องชาย|2] [พี่สาวน้องสาว|3]', ne: '[हजुरबुबा-हजुरआमा|0], [आमाबुबा|1], [दाजुभाइ|2], [दिदीबहिनी|3]' },
    { p: 'school, work, and sports', es: '[la escuela|0], [el trabajo|1] [y|2] [los deportes|3]', zh: '[学校|0]、[工作|1][和|2][体育|3]', ar: '[المدرسة|0] و[العمل|1] [و|2][الرياضة|3]', vi: '[trường học|0], [công việc|1] [và|2] [thể thao|3]', th: '[โรงเรียน|0] [งาน|1] [และ|2][กีฬา|3]', ne: '[विद्यालय|0], [काम|1] [र|2] [खेलकुद|3]' },
    { p: 'dining room', es: '[el comedor|0,1]', zh: '[餐|0][厅|1]', ar: '[غرفة|1] [الطعام|0]', vi: '[phòng|1] [ăn|0]', th: '[ห้อง|1][อาหาร|0]', ne: '[भोजन|0] [कोठा|1]' },
    { p: 'do not like', es: '[no|1] me [gusta|2]', zh: '[不|1][喜欢|2]', ar: '[لا|1] [أحب|2]', vi: '[không|1] [thích|2]', th: '[ไม่|1][ชอบ|2]', ne: '[मन पर्दैन|1,2]' },
    { p: 'after dinner', es: '[después de|0] [la cena|1]', zh: '[晚饭|1][后|0]', ar: '[بعد|0] [العشاء|1]', vi: '[sau|0] [bữa tối|1]', th: '[หลัง|0][อาหารเย็น|1]', ne: '[बेलुकीको खाना|1] [पछि|0]' },
    { p: 'talk on the phone', es: '[hablar|0] [por|1] [teléfono|3]', zh: '[讲|0][电话|3]', ar: '[التحدث|0] [عبر|1] [الهاتف|3]', vi: '[nói chuyện|0] [qua|1] [điện thoại|3]', th: '[คุย|0][โทรศัพท์|3]', ne: '[फोन|3][मा|1] [कुरा गर्नु|0]' },
    { p: 'watch football', es: '[ver|0] [fútbol americano|1]', zh: '[看|0][美式足球|1]', ar: '[مشاهدة|0] [كرة القدم الأمريكية|1]', vi: '[xem|0] [bóng bầu dục|1]', th: '[ดู|0][อเมริกันฟุตบอล|1]', ne: '[अमेरिकी फुटबल|1] [हेर्नु|0]' },
    { p: 'in the living room', es: '[en|0] [la|1] [sala|2,3]', zh: '[在|0][客厅|2,3]', ar: '[في|0] [غرفة|3] [المعيشة|2]', vi: '[trong|0] [phòng khách|2,3]', th: '[ใน|0][ห้องนั่งเล่น|2,3]', ne: '[बैठक कोठा|2,3][मा|0]' },
    { p: 'play video games', es: '[jugar|0] [videojuegos|1,2]', zh: '[玩|0][电子游戏|1,2]', ar: '[لعب|0] [ألعاب|2] [الفيديو|1]', vi: '[chơi|0] [trò chơi|2] [điện tử|1]', th: '[เล่น|0][วิดีโอเกม|1,2]', ne: '[भिडियो गेम|1,2] [खेल्नु|0]' },
    { p: '3 months old', es: '[3|0] [meses|1] [de edad|2]', zh: '[3|0][个月|1][大|2]', ar: '[عمرها|2] [3|0] [أشهر|1]', vi: '[3|0] [tháng|1] [tuổi|2]', th: '[อายุ|2] [3|0] [เดือน|1]', ne: '[3|0] [महिनाकी|1,2]' },
    { p: 'kind and funny', es: '[amables|0] [y|1] [divertidos|2]', zh: '[善良|0][又|1][有趣|2]', ar: '[لطيفان|0] [و|1][مضحكان|2]', vi: '[tốt bụng|0] [và|1] [vui tính|2]', th: '[ใจดี|0][และ|1][ตลก|2]', ne: '[दयालु|0] [र|1] [रमाइला|2]' },
    { p: 'the next day', es: '[el|0] [día|2] [siguiente|1]', zh: '[第二|1][天|2]', ar: '[اليوم|2] [التالي|1]', vi: '[ngày|2] [hôm sau|1]', th: '[วัน|2][รุ่งขึ้น|1]', ne: '[भोलिपल्ट|1,2]' }
  ];

  /* Check questions after each part. a = the right answer (options are shuffled per student). h = two hints. */
  T.MC = {
    p1: [
      { q: 'Why is there no school next week?', o: ['because of Thanksgiving', 'because of Halloween', 'because it is summer'], h: ['Look at the first paragraph.', 'There is no school because of ___giving.'] },
      { q: 'When is Thanksgiving?', o: ['a Thursday in November', 'a Monday in October', 'a Friday in December'], h: ['Find the word November.', 'It is a Thursday in ___.'] },
      { q: 'Thanksgiving is a holiday for saying ___.', o: ['“Thank you”', '“Hello”', '“Goodbye”'], h: ['Look at the name: THANKSgiving.', 'Before eating, they say “Thank you for all the good food.”'] }
    ],
    p2: [
      { q: 'Who likes to cook a turkey?', o: ['Mark’s father', 'Mark’s mother', 'Mark'], h: ['Find the word turkey.', 'My ___ likes to cook a turkey.'] },
      { q: 'What does Mark love to eat?', o: ['pumpkin pie', 'potatoes', 'cranberry sauce'], h: ['Mark does not like to cook.', 'I love to eat ___ pie!'] },
      { q: 'Where do Mark and his grandmother wash the dishes?', o: ['in the kitchen', 'in the living room', 'in the bedroom'], h: ['Find the words wash the dishes.', 'You wash dishes in the sink. Where is the sink?'] }
    ],
    p3: [
      { q: 'Who is Courtney?', o: ['John and Ellen’s new daughter', 'John’s sister', 'Ellen’s mother'], h: ['Courtney is 3 months old.', 'She is a baby. She is John and Ellen’s new ___.'] },
      { q: 'What does Ellen like to make?', o: ['rice and salad', 'a turkey', 'pumpkin pie'], h: ['Find the name Ellen.', 'Ellen likes to make ___ and salad.'] },
      { q: 'What do they do after dinner?', o: ['play cards', 'watch football', 'play basketball'], h: ['Find the words after dinner.', 'From 7:00 to 11:00 p.m. they play ___.'] }
    ],
    p4: [
      { q: 'What does Andre think about Thanksgiving?', o: ['It is very fun.', 'It is boring.', 'It is scary.'], h: ['Look at the first sentence.', 'I think Thanksgiving is very ___.'] },
      { q: 'Where does Andre play basketball?', o: ['outside', 'in the kitchen', 'in the living room'], h: ['Find the word basketball.', 'You play basketball out of the house: ___side.'] },
      { q: 'What do they eat the next day?', o: ['turkey again', 'rice and salad', 'only pie'], h: ['Look at the last sentence.', 'The next day, we like to eat ___ again!'] }
    ]
  };
  T.MC_IDS = [];
  ['p1', 'p2', 'p3', 'p4'].forEach(function (p) { T.MC[p].forEach(function (_, i) { T.MC_IDS.push(p + '.' + i); }); });

  /* Part B questions: answer in complete sentences. Starters are hints (hidden until tapped). */
  T.QS = [
    { k: 'q1', q: 'Why is there no school at Galileo next week?', st: 'There is no school next week because of ___.', need: function (s) { return /thanks\s*giving/i.test(s); }, hint: 'Use the word Thanksgiving.' },
    { k: 'q2', q: 'What are four foods people like to eat at Thanksgiving?', st: 'People like to eat ___, ___, ___ and ___.', need: function (s) { var n = 0; [/turkey/i, /cranberr/i, /potato/i, /pie|pumpkin/i].forEach(function (r) { if (r.test(s)) n++; }); return n >= 2; }, hint: 'Look at the four food pictures in Part 1.' },
    { k: 'q3', q: 'What do people do on Thanksgiving?', st: 'On Thanksgiving, people like to ___.', need: null },
    { k: 'q4', q: 'Thanksgiving is an important holiday in the United States. What is an important holiday in your country?', st: 'An important holiday in my country is ___.', need: null },
    { k: 'q5', q: 'What do you like to do on this important holiday in your country?', st: 'On ___, I like to ___.', need: null },
    { k: 'q6', q: 'What do you like to eat on this important holiday in your country?', st: 'On ___, I like to eat ___.', need: null }
  ];


  /* ---------- Word search (Mr. Toby's worksheet "Thanksgiving word search", Nov 20 2026) ----------
     Picture words first (cards, then listen-and-tap), then the puzzle. Left out on purpose: pilgrims, native American,
     agreement, hunting (history words that need context the reading does not give). Turkey + pumpkin pie are review. */
  T.VWORDS = [
    { w: 'Mayflower', d: 'the ship that came to America in 1620', art: 'mayflower' },
    { w: 'autumn', d: 'the season after summer; leaves fall (also: fall)', art: 'autumn' },
    { w: 'pilgrim hat', d: 'a tall black hat with a buckle', art: 'pilgrimhat' },
    { w: 'harvest', d: 'the time to pick and bring in food from the farm', art: 'harvest' },
    { w: 'dinner', d: 'the big meal in the evening', art: 'dinner' },
    { w: 'acorn', d: 'a small nut from an oak tree', art: 'acorn' },
    { w: 'corn', d: 'a yellow vegetable on a cob', art: 'corn' },
    { w: 'wreath', d: 'a circle of leaves on a door', art: 'wreath' },
    { w: 'pudding', d: 'a soft, sweet dessert', art: 'pudding' },
    { w: 'wheat', d: 'a plant; we make bread from it', art: 'wheat' },
    { w: 'bread', d: 'food made from flour; you make toast with it', art: 'bread' },
    { w: 'scarecrow', d: 'a person made of straw on a farm; it scares birds', art: 'scarecrow' },
    { w: 'gravy', d: 'a hot brown sauce for turkey and potatoes', art: 'gravy' },
    { w: 'cornucopia', d: 'a horn-shaped basket full of food', art: 'cornucopia' }
  ];
  T.WS_WORDS = T.VWORDS.map(function (x) { return { w: x.w, art: x.art }; }).concat([{ w: 'turkey', art: 'turkey' }, { w: 'pumpkin pie', art: 'pie' }]);
  T.WS_N = 13;
  /* the same grid for everyone (seeded), across and down only, read left-to-right / top-to-bottom */
  T.grid = function () {
    if (T._grid) return T._grid;
    for (var seed = 1120; seed < 1220; seed++) {
      var s = seed; function rnd() { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }
      var N = T.WS_N, g = [], ok = true, place = {};
      for (var r = 0; r < N; r++) { g.push([]); for (var c = 0; c < N; c++) g[r].push(''); }
      var list = T.WS_WORDS.slice().sort(function (a, b) { return b.w.length - a.w.length; });
      for (var i = 0; i < list.length && ok; i++) {
        var W = list[i].w.toUpperCase().replace(/[^A-Z]/g, ''), done = false;
        for (var t = 0; t < 400 && !done; t++) {
          var down = rnd() < 0.5, r0 = Math.floor(rnd() * (down ? N - W.length + 1 : N)), c0 = Math.floor(rnd() * (down ? N : N - W.length + 1)), fit = true;
          for (var k = 0; k < W.length; k++) { var ch = g[down ? r0 + k : r0][down ? c0 : c0 + k]; if (ch && ch !== W[k]) { fit = false; break; } }
          if (!fit) continue;
          for (k = 0; k < W.length; k++) g[down ? r0 + k : r0][down ? c0 : c0 + k] = W[k];
          place[list[i].w] = { r: r0, c: c0, down: down, len: W.length }; done = true;
        }
        if (!done) ok = false;
      }
      if (!ok) continue;
      var AB = 'ABCDEFGHIKLMNOPRSTUVWY';
      for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (!g[r][c]) g[r][c] = AB[Math.floor(rnd() * AB.length)];
      T._grid = { g: g, place: place, seed: seed }; return T._grid;
    }
  };

  /* Part C interview: extra (fills a missing point, never lowers the score) */
  T.IV = ['What is an important holiday in your country?', 'What do you like to do on this important holiday?', 'What do you like to eat on this important holiday in your country?'];

  T.DIR = {
    l1: 'Look at the picture. Finish the two sentences. Any answer is OK!',
    w1: 'Read the word and its meaning. Tap 🔊 and listen. Then tap the right picture.',
    w2: 'Tap the big 🔊. Then tap the picture you heard.',
    r1: 'Read the story. Tap 🔊 to listen. Tap a word to see it in your language.',
    r2: 'Answer the questions. Look back at the story.',
    b1: 'Answer in complete sentences. Write at least 4 words.',
    v1: 'More Thanksgiving words. Read the word and tap 🔊. Then tap the right picture.',
    v2: 'Tap the big 🔊. Then tap the picture you heard.',
    s1: 'Find the words in the puzzle. Tap the first letter, then tap the last letter. Words go across → or down ↓.',
    c1: 'Find somebody who speaks a different language and comes from a different country. Ask the questions. Write what they said.',
    d1: 'You finished the Thanksgiving reading. Happy Thanksgiving!'
  };

  function words(s) { return String(s || '').trim().split(/\s+/).filter(function (w) { return /[a-z0-9]/i.test(w); }); }
  T.words = words;
  T.qOk = function (q, s) { s = String(s || '').trim(); if (s.indexOf('___') >= 0) return false; return words(s).length >= 4 && (!q.need || q.need(s)); };
  T.ivOk = function (x) { return !!(x && String(x.who || '').trim() && words(x.a).length >= 2); };

  /* fair score: every item solved on any try = 1 point; written answers count unless Mr. Toby marked ✗ and it is unchanged */
  T.MAX = 2 + T.WORDS.length + T.MC_IDS.length + T.QS.length + T.VWORDS.length + T.WS_WORDS.length;
  T.score = function (p, marks, off) {
    p = p || {}; marks = marks || {}; off = off || function () { return false; };
    var L = p.look || {}, R = p.R || {}, look = (L.see ? 1 : 0) + (L.won ? 1 : 0), w = 0, m = 0, b = 0, c = 0, v = 0, f = 0;
    for (var j = 0; j < T.VWORDS.length; j++) if (R.v && R.v[j] && R.v[j].done) v++;
    T.WS_WORDS.forEach(function (x) { if (p.ws && p.ws.found && p.ws.found.indexOf(x.w) >= 0) f++; });
    for (var i = 0; i < T.WORDS.length; i++) if (R.w && R.w[i] && R.w[i].done) w++;
    T.MC_IDS.forEach(function (id) { if (R.m && R.m[id] && R.m[id].done) m++; });
    T.QS.forEach(function (q) { var a = (p.qa || {})[q.k]; if (T.qOk(q, a) && !off(marks, q.k, a)) b++; });
    (p.iv || []).forEach(function (x) { if (T.ivOk(x)) c++; });
    var core = look + w + m + b + v + f;
    return { look: look, w: w, m: m, b: b, v: v, f: f, iv: Math.min(3, c), core: core, max: T.MAX, score: Math.min(T.MAX, core + Math.min(3, c)) };
  };

  /* every line a student can see, for 🌐 Pre-translate */
  T.lines = function () {
    var out = [];
    function add(s) { s = String(s || '').trim(); if (s && out.indexOf(s) < 0) out.push(s); }
    T.WORDS.forEach(function (w) { add(w.w); add(w.d); add(w.s); });
    (T.PHRASES || []).forEach(function (x) { add(x.p); }); T.PARTS.forEach(function (P) { add(P.title); P.paras.forEach(function (pp) { pp.forEach(add); }); (P.after || []).forEach(add); });
    Object.keys(T.MC).forEach(function (k) { T.MC[k].forEach(function (x) { add(x.q); x.o.forEach(add); x.h.forEach(add); }); });
    T.QS.forEach(function (q) { add(q.q); add(q.st); if (q.hint) add(q.hint); });
    T.VWORDS.forEach(function (x) { add(x.w); add(x.d); }); T.IV.forEach(add); Object.keys(T.DIR).forEach(function (k) { add(T.DIR[k]); });
    T.LOOK.see.forEach(add); T.LOOK.won.forEach(add); add(T.LOOK.think);
    return out;
  };
})();
