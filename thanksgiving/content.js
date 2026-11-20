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

  /* Part C interview: extra (fills a missing point, never lowers the score) */
  T.IV = ['What is an important holiday in your country?', 'What do you like to do on this important holiday?', 'What do you like to eat on this important holiday in your country?'];

  T.DIR = {
    l1: 'Look at the picture. Finish the two sentences. Any answer is OK!',
    w1: 'Look at each picture. Tap 🔊 and listen. Say the word.',
    w2: 'Tap the big 🔊. Then tap the picture you heard.',
    r1: 'Read the story. Tap 🔊 to listen. Tap a word to see it in your language.',
    r2: 'Answer the questions. Look back at the story.',
    b1: 'Answer in complete sentences. Write at least 4 words.',
    c1: 'Find somebody who speaks a different language and comes from a different country. Ask the questions. Write what they said.',
    d1: 'You finished the Thanksgiving reading. Happy Thanksgiving!'
  };

  function words(s) { return String(s || '').trim().split(/\s+/).filter(function (w) { return /[a-z0-9]/i.test(w); }); }
  T.words = words;
  T.qOk = function (q, s) { s = String(s || '').trim(); if (s.indexOf('___') >= 0) return false; return words(s).length >= 4 && (!q.need || q.need(s)); };
  T.ivOk = function (x) { return !!(x && String(x.who || '').trim() && words(x.a).length >= 2); };

  /* fair score: every item solved on any try = 1 point; written answers count unless Mr. Toby marked ✗ and it is unchanged */
  T.MAX = 2 + T.WORDS.length + T.MC_IDS.length + T.QS.length;
  T.score = function (p, marks, off) {
    p = p || {}; marks = marks || {}; off = off || function () { return false; };
    var L = p.look || {}, R = p.R || {}, look = (L.see ? 1 : 0) + (L.won ? 1 : 0), w = 0, m = 0, b = 0, c = 0;
    for (var i = 0; i < T.WORDS.length; i++) if (R.w && R.w[i] && R.w[i].done) w++;
    T.MC_IDS.forEach(function (id) { if (R.m && R.m[id] && R.m[id].done) m++; });
    T.QS.forEach(function (q) { var a = (p.qa || {})[q.k]; if (T.qOk(q, a) && !off(marks, q.k, a)) b++; });
    (p.iv || []).forEach(function (x) { if (T.ivOk(x)) c++; });
    var core = look + w + m + b;
    return { look: look, w: w, m: m, b: b, iv: Math.min(3, c), core: core, max: T.MAX, score: Math.min(T.MAX, core + Math.min(3, c)) };
  };

  /* every line a student can see, for 🌐 Pre-translate */
  T.lines = function () {
    var out = [];
    function add(s) { s = String(s || '').trim(); if (s && out.indexOf(s) < 0) out.push(s); }
    T.WORDS.forEach(function (w) { add(w.w); add(w.d); add(w.s); });
    T.PARTS.forEach(function (P) { add(P.title); P.paras.forEach(function (pp) { pp.forEach(add); }); (P.after || []).forEach(add); });
    Object.keys(T.MC).forEach(function (k) { T.MC[k].forEach(function (x) { add(x.q); x.o.forEach(add); x.h.forEach(add); }); });
    T.QS.forEach(function (q) { add(q.q); add(q.st); if (q.hint) add(q.hint); });
    T.IV.forEach(add); Object.keys(T.DIR).forEach(function (k) { add(T.DIR[k]); });
    T.LOOK.see.forEach(add); T.LOOK.won.forEach(add); add(T.LOOK.think);
    return out;
  };
})();
