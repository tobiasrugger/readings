/* readings/telltale/words/data.js — T-500 (Nov 20 2026). Standalone "Words, one row per word" page for The Tell-Tale Heart (ELD 103).
   Each word: ① pick 1 of 3 pictures (pictures from /readings/vocab/telltale-art.js) ② say it (speech recognition, ✋ after 2 tries) ③ which sentence
   uses it the right way (first = right; two believable misuses). 3 points per word. Saves to eld103_donow, unit 'telltale-wordrows'.
   Not linked from the story pages this year; Mr. Toby gives the link to single students. */
window.WR = {
  TABLE: 'eld103_donow', UNIT: 'telltale-wordrows', SLUG: 'telltale-wordrows', LEVEL: 103, TITLE: "The Tell-Tale Heart",
  CAST: [["The narrator", "#8a2a2a"], ["The old man", "#6f7d8c"], ["An officer", "#2f6fbd"]],
  DIR: {
    d1: 'Twelve words from the story. For each word: pick the picture, say the word, then choose the sentence that uses it the right way.',
    d2: 'When you finish, go back to the story, or practice more with the vocabulary set.'
  },
  WORDS: [
 {
  "w": "acute",
  "def": "very sharp; able to notice tiny things",
  "sent": "Above all was the sense of hearing ___.",
  "use": [
   "His hearing was so acute that he heard the smallest sound.",
   "His hearing was acute, so he heard nothing at all.",
   "She put the acute in the oven to bake."
  ]
 },
 {
  "w": "vexed",
  "def": "annoyed; bothered",
  "sent": "It was not the old man who ___ me, but his Evil Eye.",
  "use": [
   "The Evil Eye vexed him; it bothered him every day.",
   "He was vexed, so he smiled and felt calm and happy.",
   "He vexed the door open with a key."
  ]
 },
 {
  "w": "vulture",
  "def": "a large bird that eats dead animals",
  "sent": "He had the eye of a ___ — a pale blue eye, with a film over it.",
  "use": [
   "A vulture circled in the sky above the dead animal.",
   "The vulture swam under the water like a fish.",
   "He stirred sugar into his vulture."
  ]
 },
 {
  "w": "cunningly",
  "def": "cleverly and secretly",
  "sent": "You would have laughed to see how ___ I thrust it in!",
  "use": [
   "He cunningly opened the door so slowly that the old man never knew.",
   "He cunningly shouted so that everyone saw him.",
   "The cunningly was on the table."
  ]
 },
 {
  "w": "profound",
  "def": "very deep; very wise",
  "sent": "He would have been a very ___ old man to suspect that.",
  "use": [
   "It was a profound idea, very deep and wise.",
   "He told a profound joke that was silly and meant nothing.",
   "She drove her profound to work."
  ]
 },
 {
  "w": "stifled",
  "def": "held back; smothered",
  "sent": "It was the low ___ sound that arises from the bottom of the soul.",
  "use": [
   "He stifled a cry so that nobody would hear it.",
   "He stifled the song by singing it as loud as he could.",
   "She stifled her bike to school."
  ]
 },
 {
  "w": "crevice",
  "def": "a very narrow opening",
  "sent": "I resolved to open a very, very little ___ in the lantern.",
  "use": [
   "A thin ray of light came through a crevice in the lantern.",
   "The crevice in the lantern was as wide as a door.",
   "He wore a crevice on his head."
  ]
 },
 {
  "w": "hideous",
  "def": "horribly ugly",
  "sent": "A ___ veil over it that chilled the very marrow in my bones.",
  "use": [
   "The pale, filmy eye was hideous to him.",
   "The hideous flowers were the most beautiful in the garden.",
   "He hideous under the bed."
  ]
 },
 {
  "w": "audacity",
  "def": "bold, shocking confidence",
  "sent": "In the wild ___ of my perfect triumph, I placed my own seat upon the very spot.",
  "use": [
   "He had the audacity to put his chair right over the hidden body.",
   "He was so shy and scared that he had great audacity.",
   "She ate audacity for breakfast."
  ]
 },
 {
  "w": "derision",
  "def": "cruel laughing at someone",
  "sent": "Anything was more tolerable than this ___!",
  "use": [
   "He thought the officers were laughing at him in derision.",
   "They showed derision by giving him a warm, kind hug.",
   "The derision ticked on the wall like a clock."
  ]
 },
 {
  "w": "hypocritical",
  "def": "fake; pretending to be nice",
  "sent": "I could bear those ___ smiles no longer!",
  "use": [
   "Their hypocritical smiles looked friendly, but they were fake.",
   "Her honest, hypocritical words were all true.",
   "He rode his hypocritical to the station."
  ]
 },
 {
  "w": "dissemble",
  "def": "hide the truth; pretend",
  "sent": "“Villains!” I shrieked, “___ no more! I admit the deed!”",
  "use": [
   "He dissembled, smiling so that no one guessed the truth.",
   "He dissembled by telling everyone the whole truth.",
   "She dissembled the chair and put the pieces in a box."
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
