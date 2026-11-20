/* readings/monkeyspaw/words/data.js — T-500 (Nov 20 2026). Standalone "Words, one row per word" page for The Monkey’s Paw (ELD 103).
   Each word: ① pick 1 of 3 pictures (pictures from /readings/vocab/monkeyspaw-art.js) ② say it (speech recognition, ✋ after 2 tries) ③ which sentence
   uses it the right way (first = right; two believable misuses). 3 points per word. Saves to eld103_donow, unit 'monkeyspaw-wordrows'.
   Not linked from the story pages this year; Mr. Toby gives the link to single students. */
window.WR = {
  TABLE: 'eld103_donow', UNIT: 'monkeyspaw-wordrows', SLUG: 'monkeyspaw-wordrows', LEVEL: 103, TITLE: "The Monkey’s Paw",
  CAST: [["Mr White", "#2f6fbd"], ["Mrs White", "#864D9E"], ["Herbert", "#2f7d4f"]],
  DIR: {
    d1: 'Twelve words from the story. For each word: pick the picture, say the word, then choose the sentence that uses it the right way.',
    d2: 'When you finish, go back to the story, or practice more with the vocabulary set.'
  },
  WORDS: [
 {
  "w": "fakir",
  "def": "a holy man in India who lives with almost nothing",
  "sent": "It had a spell put on it by an old ___, a very holy man.",
  "use": [
   "The fakir, a holy man, put a spell on the paw.",
   "The fakir was a cheap plastic toy from a store.",
   "He drove his fakir to work."
  ]
 },
 {
  "w": "talisman",
  "def": "a small object people believe brings luck or power",
  "sent": "His father held up the ___ and wished aloud.",
  "use": [
   "He held the talisman and hoped it would bring him luck.",
   "The talisman was the man who sold tickets at the station.",
   "She talismaned the door shut."
  ]
 },
 {
  "w": "credulity",
  "def": "believing things too easily",
  "sent": "Smiling shamefacedly at his own ___, he made the wish.",
  "use": [
   "His credulity made him believe the strange story too quickly.",
   "Because of his credulity, he never believed anything.",
   "He spread credulity on his bread."
  ]
 },
 {
  "w": "grimace",
  "def": "an ugly, twisted face",
  "sent": "He hid a ___ in his thin grey beard.",
  "use": [
   "He made a grimace when he tasted the sour milk.",
   "She made a grimace: a big, happy smile.",
   "The grimace hung on the wall like a clock."
  ]
 },
 {
  "w": "condoling",
  "def": "saying you are sorry for someone’s loss",
  "sent": "The neighbours came ___ with the family in their great loss.",
  "use": [
   "Neighbours came, condoling with the family after the death.",
   "They were condoling, laughing and celebrating the good news.",
   "He was condoling the car down the road."
  ]
 },
 {
  "w": "amiably",
  "def": "in a warm, friendly way",
  "sent": "He shook hands ___ and took the offered seat by the fire.",
  "use": [
   "He shook hands amiably and smiled.",
   "He shouted amiably, angry and rude.",
   "The amiably sat by the fire."
  ]
 },
 {
  "w": "apathy",
  "def": "no feeling and no interest in anything",
  "sent": "Expectation gave place to hopeless ___.",
  "use": [
   "After the loss, she felt apathy and cared about nothing.",
   "Full of apathy, he jumped up, excited about everything.",
   "He drank a cup of apathy."
  ]
 },
 {
  "w": "resigned",
  "def": "accepting something bad because you cannot change it",
  "sent": "That ___ calm of the old, sometimes miscalled apathy.",
  "use": [
   "The old man was resigned; he accepted what he could not change.",
   "He was resigned, so he fought hard to change everything.",
   "She resigned the letter again with a new pen."
  ]
 },
 {
  "w": "compensation",
  "def": "money paid to you because something was lost or damaged",
  "sent": "They wish to present you with a certain sum as ___.",
  "use": [
   "The company paid two hundred pounds as compensation for the family's loss.",
   "He paid the company compensation because they gave him a job he liked.",
   "The compensation was a long, sad song at the funeral."
  ]
 },
 {
  "w": "oppressive",
  "def": "heavy and hard to bear",
  "sent": "The darkness was ___, and he lay screwing up his courage.",
  "use": [
   "The heavy, dark silence in the house was oppressive.",
   "The fresh, light air was oppressive and easy to breathe.",
   "He oppressive the button on the radio."
  ]
 },
 {
  "w": "frantically",
  "def": "in a wild, panicked hurry",
  "sent": "He found the paw and ___ breathed his last wish.",
  "use": [
   "She searched frantically for the paw, in a wild hurry.",
   "He walked frantically, slowly and calmly, to bed.",
   "The frantically was in the box."
  ]
 },
 {
  "w": "furtively",
  "def": "secretly, so nobody sees",
  "sent": "He gazed at her ___ and listened in a preoccupied fashion.",
  "use": [
   "He looked at her furtively, so she would not notice.",
   "He waved furtively, so everyone in the room saw him.",
   "She bought a furtively at the store."
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
