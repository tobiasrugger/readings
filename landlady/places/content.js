/* readings/landlady/places/content.js — T-500 (Nov 20 2026). "Where will Billy sleep?" — a standalone helper page for
   The Landlady (ELD 103). WHY: students read "bed and breakfast" as two things (a bed + a breakfast) and did not know that
   the bed and breakfast and the boarding-house are the SAME house, so "a pub would be more congenial than a boarding-house"
   made no sense. Not linked from the story pages this year (they are frozen); Mr. Toby gives the link to single students.
   Saves to eld103_donow, unit 'landlady-places'. Every item: 1 point on any try (fair scores); ELD 103 misses stay red ✗. */
(function () {
  var T = window.PL = { TABLE: 'eld103_donow', UNIT: 'landlady-places', SLUG: 'landlady-places', LEVEL: 103 };

  /* directions (each is a [data-dir] line: 🔊 + translated) */
  T.DIR = {
    o1: 'You are going to a new city. Where will you sleep? Tap one picture. Any answer is OK.',
    w1: 'Four places to sleep. Look at the picture, read the word, listen. Your language is under each word.',
    w2: 'Read each sentence. Choose the right place.',
    s1: 'In the story, one house has two names. Look at the picture.',
    s2: 'Yes! Bed + breakfast = one house. You sleep in a bed and eat breakfast there. In the story, Dahl calls the same house a boarding-house.',
    b1: 'Break the word into pieces. Tap the pieces in order.',
    b2: 'Yes! board = meals (food). A boarding-house is a house where you pay for a room AND meals.',
    f1: 'Long ago, people ate at a long wooden board: a table. So "board" means meals. "Room and board" = a room + meals.',
    f2: '"Board" has more meanings. Read the sentence. Tap the picture that matches.',
    p1: 'Now the hard sentence, in three pieces.',
    y1: 'Why does Billy think the pub is better? Look at the two pictures. Billy imagines both places.',
    y2: 'Finish the sentence in your own words. Write at least 5 words.',
    v1: 'You are Billy. It is cold and dark in Bath. Where would YOU stay? Any answer is OK.',
    d1: 'Go back to The Landlady story when you are ready.'
  };
  T.THE_SENTENCE = 'On the other hand, a pub would be more congenial than a boarding-house.';

  /* 1 · opener — opinion, any pick counts */
  T.OPEN = [
    { k: 'hotel', w: 'a hotel', art: 'hotel' },
    { k: 'family', w: 'my family’s home', art: 'familyhome' },
    { k: 'friend', w: 'a friend’s home', art: 'friendhome' },
    { k: 'tent', w: 'a tent', art: 'tent' }
  ];
  T.OPEN_THINK = 'Good guess! Now think: in a hotel, who makes your breakfast? Who makes it at a friend’s home?';

  /* 2 · word cards: picture → word: meaning → translation */
  T.WORDS = [
    { w: 'hotel', art: 'hotel', d: 'a big building with many rooms. You pay to sleep there.', s: 'The hotel has a hundred rooms.' },
    { w: 'pub', art: 'pub', d: 'a place in Britain to drink, eat and talk with people. Some pubs have rooms upstairs.', s: 'Billy thinks about staying at The Bell and Dragon, a pub.' },
    { w: 'bed and breakfast', art: 'bnb', d: 'a house where you pay for a bed for the night AND breakfast in the morning. One place, not two things.', s: 'A sign in the window says BED AND BREAKFAST.' },
    { w: 'boarding-house', art: 'boarding', d: 'a house where you pay for a room AND your meals. You often stay a long time.', s: 'He had never stayed in a boarding-house.' }
  ];
  /* every MC: o[0] is right; h = hints for miss 1, 2, 3+ */
  T.MC = {
    w: [
      { q: 'A big building with a hundred rooms, a front desk and many guests is a ___.', o: ['hotel', 'pub', 'boarding-house'], h: ['Look for the biggest building.', 'It has many, many rooms and a sign on top.'] },
      { q: 'Billy can drink, eat and talk with people at The Bell and Dragon. It is a ___.', o: ['pub', 'hotel', 'bed and breakfast'], h: ['Which place is for drinking and talking?', 'The Bell and Dragon has a hanging sign with a bell and a dragon.'] },
      { q: 'You pay for one night: a bed, then eggs and toast in the morning. It is a ___.', o: ['bed and breakfast', 'pub', 'hotel'], h: ['Bed at night. Breakfast in the morning. One place.', 'The name says both things: bed AND breakfast.'] },
      { q: 'Some people live in a ___ for months. They pay for a room and their meals.', o: ['boarding-house', 'bed and breakfast', 'pub'], h: ['Which place is for a long time, with meals?', 'Room + meals (board) = boarding-house.'] }
    ],
    s: [
      { q: 'Billy walks into the bed and breakfast. Is he in the boarding-house too?', o: ['Yes. It is the same house.', 'No. They are two different houses.', 'No. The boarding-house is a pub.'], h: ['Look at the picture again. Where do the two arrows point?', 'Two names, two arrows, one house.'] }
    ],
    b: [
      { q: 'In "boarding-house", the word "board" means ___.', o: ['meals (food)', 'a piece of wood', 'a long time'], h: ['Look at the picture of the house: a bed AND a table with food.', 'Room and board = a room + meals.'] }
    ],
    f: [
      { q: 'The rent is $100 a week for room and board.', o: ['plank', 'plane', 'boardup'], pic: 1, h: ['Board here = meals. Which picture shows food?', 'The long wooden table with food on it.'] },
      { q: 'Please board the plane now.', o: ['plane', 'whiteboard', 'plank'], pic: 1, h: ['Board here = get on. Get on what?', 'People are walking up the stairs.'] },
      { q: 'They boarded up the windows before the storm.', o: ['boardup', 'plane', 'whiteboard'], pic: 1, h: ['Board up = cover with pieces of wood.', 'Look for the planks and the hammer.'] },
      { q: 'Write your name on the board.', o: ['whiteboard', 'bored', 'boardup'], pic: 1, h: ['Where do you write in a classroom?', 'A flat board on the wall.'] },
      { q: 'I’m bored. Nothing is happening.', o: ['bored', 'plank', 'whiteboard'], pic: 1, h: ['Listen: bored sounds like board, but it is a feeling.', 'Which picture shows a feeling?'] }
    ],
    p: [
      { side: 'hands', q: '"On the other hand" means: ___', o: ['Here is a different idea.', 'Use your other hand.', 'Give me your hand.'], h: ['Look at the two hands: one idea in each.', 'Billy thinks about the B&B, then about the pub: a different idea.'] },
      { q: 'Which face is congenial?', o: ['congenialWarm', 'congenialCold'], pic: 1, h: ['Congenial = friendly and pleasant.', 'Which face makes you feel welcome?'] },
      { q: 'A pub would be MORE congenial THAN a boarding-house. So the pub is ___ than the boarding-house.', o: ['friendlier', 'quieter', 'more expensive'], h: ['more congenial = more friendly.', 'Change "more congenial" to one word ending in -er.'] }
    ],
    y: [
      { q: 'Why does Billy think a pub would be more congenial than a boarding-house?', o: [
        'At a pub there are people to talk to, darts and beer. A boarding-house seems quiet and strict.',
        'A pub is quieter than a boarding-house.',
        'A boarding-house has more people to talk to than a pub.'], h: ['Look at the two pictures. Where are people talking and laughing?', 'Billy wants friendly people. Which place has them?'] }
    ]
  };
  T.MC_IDS = [];
  ['w', 's', 'b', 'f', 'p', 'y'].forEach(function (k) { T.MC[k].forEach(function (_, i) { T.MC_IDS.push(k + '.' + i); }); });

  /* 4 · build the word */
  T.PIECES = ['board', 'ing', 'house'];
  T.DECOY = ['bed', 'ed'];

  /* 7 · writing (Mr. Toby's ✓ / ✗ via marks.js, key 'why') */
  T.WRITE = { k: 'why', q: 'A pub would be more congenial than a boarding-house because ___.', st: 'A pub would be more congenial than a boarding-house because ', min: 5 };

  /* 8 · where would YOU stay? opinion */
  T.STAY = [
    { k: 'pub', w: 'the pub', art: 'pub' },
    { k: 'bnb', w: 'the bed and breakfast', art: 'bnb' },
    { k: 'hotel', w: 'a hotel', art: 'hotel' }
  ];
  T.STAY_THINK = 'Billy picks the bed and breakfast anyway. What pulls him in?';

  T.words = function (s) { return String(s || '').trim().split(/\s+/).filter(function (w) { return /[A-Za-zÀ-ɏ]/.test(w); }); };
  T.writeOk = function (a) {
    a = String(a || '').trim(); if (/_{2,}/.test(a)) return false;
    var rest = a.replace(/^a pub would be more congenial than a boarding-house because/i, '');
    return T.words(rest).length >= T.WRITE.min;
  };

  /* score: open 1 + words 4 + same 1 + build 1 + board 1 + family 5 + pieces 3 + why 1 + write 1 + stay 1 = 19 */
  T.MAX = 1 + T.MC_IDS.length + 1 + 1 + 1;
  T.score = function (p, marks, off) {
    p = p || {}; marks = marks || {}; off = off || function () { return false; };
    var m = (p.R && p.R.m) || {}, s = 0;
    if (p.open) s++;
    T.MC_IDS.forEach(function (id) { if (m[id] && m[id].done) s++; });
    if (p.build && p.build.done) s++;
    var a = (p.qa || {})[T.WRITE.k];
    if (T.writeOk(a) && !off(marks, T.WRITE.k, a)) s++;
    if (p.stay) s++;
    return { score: Math.min(s, T.MAX), max: T.MAX, core: s };
  };

  /* every line a student sees (for 🌐 Pre-translate on the dashboard) */
  T.lines = function () {
    var L = [];
    function add(x) { x = String(x || '').trim(); if (x && L.indexOf(x) < 0) L.push(x); }
    Object.keys(T.DIR).forEach(function (k) { add(T.DIR[k]); });
    add(T.THE_SENTENCE); add(T.OPEN_THINK); add(T.STAY_THINK); add(T.WRITE.q);
    T.OPEN.forEach(function (x) { add(x.w); }); T.STAY.forEach(function (x) { add(x.w); });
    T.WORDS.forEach(function (w) { add(w.w); add(w.d); add(w.s); });
    Object.keys(T.MC).forEach(function (k) { T.MC[k].forEach(function (x) { add(x.q.replace('___', '...')); if (!x.pic) x.o.forEach(add); x.h.forEach(add); }); });
    ['on the other hand', 'congenial', 'friendly', 'board', 'meals', 'room and board'].forEach(add);
    return L;
  };
})();
