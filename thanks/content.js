/* readings/thanks/content.js — T-404 (Nov 13 2026). All the words of the ELD 101 Thank You Card page,
   in one place, so the student page (thanks/index.html) and its dashboard (thanks/dashboard.html, which
   pre-translates them) always read the same text. Change a line here and both follow. */
window.THANKS = (function () {
  var WORDS = [
    { w: 'thank you', d: 'what you say when someone helps you or gives you something', s: 'Thank you for the lunch!', art: 'w_thank' },
    { w: 'help', d: 'do something for someone; make it easier for them', s: 'Ms. Rosa helps me every day.', art: 'w_help' },
    { w: 'kind', d: 'nice and good to other people', s: 'You are very kind.', art: 'w_kind' },
    { w: 'card', d: 'a folded paper with a message inside', s: 'Linh writes a card.', art: 'w_card' },
    { w: 'smile', d: 'a happy face; the corners of your mouth go up', s: 'You always smile at me.', art: 'w_smile' },
    { w: 'every day', d: 'Monday, Tuesday, Wednesday… all the days', s: 'You work hard every day.', art: 'w_every' },
    { w: 'because', d: 'a word that tells the reason why', s: 'I am happy because you help me.', art: 'w_because' },
    { w: 'welcome', d: 'people are glad you are here', s: 'Because of you, I feel welcome.', art: 'w_welcome' }
  ];
  /* Linh's card. Each line has its own 🔊. */
  var MODEL = [
    { part: 'Hello', t: 'Dear Ms. Rosa,' },
    { part: 'Say thank you', t: 'Thank you for the lunch every day.' },
    { part: 'Say what they do', t: 'You always smile at me.' },
    { part: 'Say what they do', t: 'You help me when I do not understand.' },
    { part: 'Say how you feel', t: 'Because of you, I feel welcome at Galileo.' },
    { part: 'Goodbye', t: 'From,' },
    { part: 'Your name', t: 'Linh' }
  ];
  /* Reading questions about the card. a = the right option. Hints: miss 1, miss 2. */
  var READQ = [
    { q: 'Who is the card for?', o: ['Ms. Rosa', 'Linh', 'Mr. Toby'], a: 'Ms. Rosa',
      h: ['Look at the first line. It starts with Dear.', 'Dear ___ = the person who gets the card.'] },
    { q: 'What does Ms. Rosa give Linh every day?', o: ['lunch', 'a book', 'a bus ticket'], a: 'lunch',
      h: ['Read line 2: Thank you for the ___ every day.', 'Ms. Rosa works in the cafeteria.'] },
    { q: 'How does Linh feel because of Ms. Rosa?', o: ['welcome', 'tired', 'angry'], a: 'welcome',
      h: ['Find the words: Because of you, I feel…', 'Look at the line before From.'] },
    { q: 'Which word starts a card?', o: ['Dear', 'From', 'Because'], a: 'Dear',
      h: ['From is at the end, before your name.', 'The card starts with ___ Ms. Rosa.'] }
  ];
  /* Grammar from the card. One plain blank ___ (multiple choice never shows a letter count). */
  var GRAM = [
    { q: 'Thank you for ___ me.', o: ['helping', 'help', 'helps'], a: 'helping',
      h: ['After "for", the verb ends in -ing.', 'Thank you for helping, for cooking, for teaching.'] },
    { q: 'You always ___ at me.', o: ['smile', 'smiles', 'smiling'], a: 'smile',
      h: ['With "you", the verb has no -s.', 'I smile, you smile, we smile. She smiles.'] },
    { q: 'Ms. Rosa ___ lunch every day.', o: ['gives', 'give', 'giving'], a: 'gives',
      h: ['Ms. Rosa is one person, like "she".', 'With he, she or one name, add -s: she gives.'] },
    { q: 'Because ___ you, I feel welcome.', o: ['of', 'for', 'to'], a: 'of',
      h: ['It is always the same two words: because ___ you.', 'Because of you = you are the reason.'] }
  ];
  /* Who will you thank? (picture chips) and the line chips for the card. */
  var WHO = [
    { k: 'lunch', label: 'a cafeteria worker', dear: 'Dear Ms. ' },
    { k: 'guard', label: 'a security guard', dear: 'Dear Mr. ' },
    { k: 'custodian', label: 'a custodian', dear: 'Dear Mr. ' },
    { k: 'teacher', label: 'a teacher', dear: 'Dear Ms. ' },
    { k: 'friend', label: 'a friend', dear: 'Dear ' },
    { k: 'family', label: 'my family', dear: 'Dear ' }
  ];
  var FOR = ['the lunch every day', 'helping me', 'keeping us safe', 'cleaning our school', 'teaching me English', 'being my friend', 'your smile', 'taking care of me'];
  var YOU = ['always smile at me', 'help students every day', 'work very hard', 'say hello to me', 'are very kind', 'make me laugh'];
  var FEEL = ['welcome', 'happy', 'safe', 'strong', 'not alone', 'ready to learn'];
  /* Directions: data-en text by key. Translated by default like every direction. */
  var DIR = {
    l1: 'Look at the picture. Finish the two sentences. Any answer is OK!',
    sA: 'Tap a word. What do you see in the picture?',
    wA: 'Choose one, or write your own idea.',
    w1: 'Look at each picture. Tap 🔊 and listen. Say the word.',
    w2: 'Tap the big 🔊. Then tap the picture you heard.',
    r1: 'Linh wrote a thank-you card. Tap 🔊 and read it.',
    r2: 'Every card has the same parts. Look at the colors.',
    r3: 'Answer the questions about the card.',
    g1: 'Tap the right word for the blank.',
    c1: 'Who will you thank? Tap a picture.',
    c2: 'Write your card. Tap an idea, or write your own.',
    c3: 'Here is your card. Tap 🔊 to hear it.',
    s1: 'Listen to your card. Then read it out loud.',
    s2: 'Print your card. Fold it. Give it to the person!',
    s3: 'Did you give your card? What did they say?'
  };
  var LOOK = {
    see: ['a card', 'a lunch line', 'food', 'a worker', 'a girl'],
    won: ['the girl gives her a card.', 'the worker looks surprised.', 'the girl is smiling.'],
    think: 'What do you think the card says? Who would you give a card to?'
  };
  var NEXT = [
    'Start here. Tap a word: what do you see?', 'Now tap one idea: I wonder why…', 'Next: learn the words.',
    'Look at each picture and tap 🔊. Then tap “I’m ready”.', 'Tap the big 🔊 and listen.', 'Tap the picture you heard.',
    'Next: read Linh’s card.', 'Tap 🔊 and listen to Linh’s card.', 'Tap the right answer.', 'Next: grammar from the card.',
    'Next: write your own card!', 'Who will you thank? Tap a picture.', 'Write the name after Dear.', 'Tap an idea: Thank you for…',
    'Tap an idea: You…', 'Tap an idea: Because of you, I feel…', 'Next: say it and give it.', 'Tap 🔊 and listen to your card.',
    'Now tap 🎤 and read your card out loud.', 'Print your card. Fold it. Give it!', 'You finished this part.',
    'Mr. Toby asked you to fix a line on your card.', 'Almost done! Finish the part with no ✓.'
  ];
  function lines() {
    var out = [], seen = {};
    function add(s) { s = String(s || '').trim(); if (s && !seen[s]) { seen[s] = 1; out.push(s); } }
    WORDS.forEach(function (x) { add(x.w); add(x.d); add(x.s); });
    MODEL.forEach(function (x) { add(x.t); add(x.part); });
    READQ.concat(GRAM).forEach(function (x) { add(x.q); x.o.forEach(add); x.h.forEach(add); });
    WHO.forEach(function (x) { add(x.label); });
    FOR.forEach(function (x) { add('Thank you for ' + x + '.'); });
    YOU.forEach(function (x) { add('You ' + x + '.'); });
    FEEL.forEach(function (x) { add(x); });
    Object.keys(DIR).forEach(function (k) { add(DIR[k]); });
    LOOK.see.concat(LOOK.won).forEach(add); add(LOOK.think);
    NEXT.forEach(add);
    return out;
  }
  return { WORDS: WORDS, MODEL: MODEL, READQ: READQ, GRAM: GRAM, WHO: WHO, FOR: FOR, YOU: YOU, FEEL: FEEL, DIR: DIR, LOOK: LOOK, NEXT: NEXT, lines: lines,
    SLUG: 'thanks', TABLE: 'eld103_donow', UNIT: 'thanks' };
})();
