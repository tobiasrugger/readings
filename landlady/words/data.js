/* readings/landlady/words/data.js — T-500 (Nov 20 2026). Standalone "Words, one row per word" page for The Landlady (ELD 103).
   Each word: ① pick 1 of 3 pictures (pictures from /readings/vocab/landlady-art.js) ② say it (speech recognition, ✋ after 2 tries) ③ which sentence
   uses it the right way (first = right; two believable misuses). 3 points per word. Saves to eld103_donow, unit 'landlady-wordrows'.
   Not linked from the story pages this year; Mr. Toby gives the link to single students. */
window.WR = {
  TABLE: 'eld103_donow', UNIT: 'landlady-wordrows', SLUG: 'landlady-wordrows', LEVEL: 103, TITLE: "The Landlady",
  CAST: [["Billy", "#2f6fbd"], ["The landlady", "#864D9E"], ["Mr Mulholland", "#6f7d8c"]],
  DIR: {
    d1: 'Twelve words from the story. For each word: pick the picture, say the word, then choose the sentence that uses it the right way.',
    d2: 'When you finish, go back to the story, or practice more with the vocabulary set.'
  },
  WORDS: [
 {
  "w": "lodgings",
  "def": "a place to stay",
  "sent": "“Find your own ___,” the porter told him.",
  "use": [
   "Billy looked for cheap lodgings near the station for the night.",
   "The lodgings carried Billy's suitcase onto the train.",
   "Billy felt lodgings when he saw the little dog."
  ]
 },
 {
  "w": "porter",
  "def": "a worker at a train station who carries bags",
  "sent": "“Try The Bell and Dragon,” the ___ answered, pointing down the road.",
  "use": [
   "The porter at the station told Billy where to stay.",
   "Billy slept in a warm porter for the night.",
   "The tea tasted strange, like an old porter."
  ]
 },
 {
  "w": "briskly",
  "def": "quickly and with energy",
  "sent": "He walked ___ down the street.",
  "use": [
   "Billy walked briskly because it was cold and he wanted to look busy.",
   "The old dog lay briskly by the fire all day long.",
   "He moved briskly, so it took him an hour to cross the room."
  ]
 },
 {
  "w": "big shots",
  "def": "important, powerful people",
  "sent": "The ___ up at Head Office were absolutely fantastically brisk all the time.",
  "use": [
   "The big shots at Head Office make all the important decisions.",
   "The big shots were the newest, least important workers.",
   "The baby took big shots as it learned to walk."
  ]
 },
 {
  "w": "head office",
  "def": "the main office of a company, where the bosses work",
  "sent": "Mr Greenslade at the ___ in London had told him about Bath.",
  "use": [
   "Billy's boss works at the head office in London.",
   "The doctor looked at the cut on Billy's head office.",
   "Billy put his hat on his head office."
  ]
 },
 {
  "w": "swanky",
  "def": "fancy and expensive-looking",
  "sent": "They had porches and pillars, and once they had been very ___ residences.",
  "use": [
   "Long ago the houses were swanky, with pillars and fancy porches.",
   "The broken old house with peeling paint was very swanky.",
   "The swanky smell in the hall made Billy feel sick."
  ]
 },
 {
  "w": "neglect",
  "def": "when nobody takes care of something",
  "sent": "The paint was peeling, and the houses showed signs of ___.",
  "use": [
   "The peeling paint showed years of neglect.",
   "Because of neglect, the house looked clean and new.",
   "She gave her dog love and neglect, and it was very happy."
  ]
 },
 {
  "w": "dachshund",
  "def": "a small dog with a long body and short legs",
  "sent": "She nodded towards the ___ curled up so comfortably in front of the fire.",
  "use": [
   "The dachshund lay curled up in front of the fire.",
   "Billy drank a cup of hot dachshund.",
   "The dachshund flew over the roofs of Bath."
  ]
 },
 {
  "w": "peculiar",
  "def": "strange; odd",
  "sent": "He caught a whiff of a ___ smell that seemed to emanate from her.",
  "use": [
   "Billy noticed a peculiar smell, strange and hard to name.",
   "It was a normal, peculiar day, just like every other day.",
   "Billy paid the peculiar for his room."
  ]
 },
 {
  "w": "compulsion",
  "def": "a strong urge you cannot control",
  "sent": "The ___ to follow after her into that house was extraordinarily strong.",
  "use": [
   "Billy felt a strong compulsion to go to the door, and he could not stop himself.",
   "He made a slow, calm choice with no feeling at all: a compulsion.",
   "The compulsion was sitting on the sofa next to the dog."
  ]
 },
 {
  "w": "preserved",
  "def": "kept from rotting, using chemicals",
  "sent": "The dog had been stuffed and ___ — it had never been alive at all.",
  "use": [
   "The animals were preserved, so their bodies never rotted.",
   "The milk was preserved, so it went bad in one day.",
   "Billy preserved down the street to find a room."
  ]
 },
 {
  "w": "nest",
  "def": "a home — also the place where an animal waits",
  "sent": "“It isn’t very often I have the pleasure of taking a visitor into my little ___.”",
  "use": [
   "The landlady calls her house her little nest.",
   "Billy wrote his name in the nest at the desk.",
   "The nest walked into the room and sat down."
  ]
 }
]
};
window.WR.MAX = window.WR.WORDS.length * 3;
window.WR.score = function (p) { p = p || {}; var s = 0; (p.W || []).forEach(function (x) { if (!x) return; if (x.p && x.p.done) s++; if (x.s && x.s.done) s++; if (x.u && x.u.done) s++; });
  return { score: Math.min(s, window.WR.MAX), max: window.WR.MAX }; };
window.WR.lines = function () { var L = []; function add(x) { x = String(x || '').trim(); if (x && L.indexOf(x) < 0) L.push(x); }
  Object.keys(window.WR.DIR).forEach(function (k) { add(window.WR.DIR[k]); });
  window.WR.WORDS.forEach(function (w) { add(w.w); add(w.def); add(w.sent.replace('___', w.w)); w.use.forEach(add); add('Which sentence uses ' + w.w + ' the right way?'); });
  return L; };
