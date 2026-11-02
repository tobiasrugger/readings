/* ============================================================
   items.js — The Landlady test (T-198, Nov 2 2026). Data only.
   Read by readings/landlady/test/index.html and dashboard.html.

   RULES FOR EDITING (so scores stay comparable):
   - Never reuse or renumber an id. Add new items with new ids.
   - In every opts list the RIGHT answer is opts[0]. The page
     shuffles the order per student and saves it; the dashboard
     counts index 0 as right.
   - Distractors are the same part of speech as the answer where
     the sentence needs it, so grammar alone can't give it away.
   - { easy, hard } = Easier / Harder wording of the SAME question.
   ============================================================ */
var ITEMS = {

/* ---- Part A1 · picture → word (story face down) ---- */
A1: [
 { id:'a1-porter',      w:'porter',      opts:['porter','lodgings','dachshund','head office'] },
 { id:'a1-compulsion',  w:'compulsion',  opts:['compulsion','neglect','peculiar','briskly'] },
 { id:'a1-peculiar',    w:'peculiar',    opts:['peculiar','swanky','compulsion','preserved'] },
 { id:'a1-neglect',     w:'neglect',     opts:['neglect','preserved','nest','lodgings'] },
 { id:'a1-preserved',   w:'preserved',   opts:['preserved','neglect','peculiar','porter'] },
 { id:'a1-briskly',     w:'briskly',     opts:['briskly','swanky','compulsion','big shots'] },
 { id:'a1-lodgings',    w:'lodgings',    opts:['lodgings','nest','head office','porter'] },
 { id:'a1-dachshund',   w:'dachshund',   opts:['dachshund','porter','nest','preserved'] },
 { id:'a1-head-office', w:'head office', opts:['head office','lodgings','big shots','swanky'] },
 { id:'a1-big-shots',   w:'big shots',   opts:['big shots','porter','head office','briskly'] },
 { id:'a1-swanky',      w:'swanky',      opts:['swanky','peculiar','briskly','neglect'] },
 { id:'a1-nest',        w:'nest',        opts:['nest','lodgings','dachshund','compulsion'] }
].map(function(x){ x.dir={easy:'Look at the picture. Choose the word.',hard:'Look at the picture. Choose the word that it shows.'}; return x; }),

/* ---- Part A2 · new sentence → word (story face down) ---- */
A2: [
 { id:'a2-1', w:'porter',
   s:{ easy:'A ______ carried my heavy bag at the train station.',
       hard:'At the station, a ______ lifted my heavy suitcase onto the train.' },
   opts:['porter','dachshund','nest','head office'] },
 { id:'a2-2', w:'swanky',
   s:{ easy:'The hotel had gold doors and big lights. It was very ______.',
       hard:'The hotel had gold doors, marble floors and a man in white gloves. It was very ______.' },
   opts:['swanky','peculiar','preserved','briskly'] },
 { id:'a2-3', w:'big shots',
   s:{ easy:'The ______ make the big decisions at the company.',
       hard:'Only the ______ at the company can decide how much everyone is paid.' },
   opts:['big shots','lodgings','head office','nest'] },
 { id:'a2-4', w:'neglect',
   s:{ easy:'Nobody took care of the old garden. It shows years of ______.',
       hard:'After years of ______, the old garden was full of weeds and broken pots.' },
   opts:['neglect','compulsion','lodgings','nest'] },
 { id:'a2-5', w:'peculiar',
   s:{ easy:'The milk smelled ______. It did not smell like normal milk.',
       hard:'The milk smelled ______: not bad, exactly, but not like any milk I knew.' },
   opts:['peculiar','swanky','briskly','preserved'] },
 { id:'a2-6', w:'briskly',
   s:{ easy:'I was almost late, so I walked ______ to class.',
       hard:'I was almost late, so I walked ______ down the hall to my first class.' },
   opts:['briskly','peculiar','swanky','preserved'] }
].map(function(x){ x.dir={easy:'Choose the word that goes in the blank.',hard:'Choose the word that best completes the sentence.'}; return x; }),

/* ---- Part B · order (6 events; the list order IS the right order) ---- */
B: { id:'b',
  dir:{ easy:'Tap an event, then tap a number. Or drag it. Use your paper story.', hard:'Tap an event, then tap a number (or drag it). You may use your paper story.' },
  events:[
   { id:'b1', t:{ easy:'Billy gets off the train in Bath at night.',             hard:'Billy arrives in Bath on the evening train.' } },
   { id:'b2', t:{ easy:'Billy sees a Bed and Breakfast sign in a window.',       hard:'Billy notices a BED AND BREAKFAST sign in a lit window.' } },
   { id:'b3', t:{ easy:'The landlady opens the door very fast.',                 hard:'The landlady opens the door almost the moment he rings.' } },
   { id:'b4', t:{ easy:'Billy signs the guest book. He sees only two other names.', hard:'Billy signs the guest book and finds only two other names.' } },
   { id:'b5', t:{ easy:'The landlady says the two young men are still in the house.', hard:'The landlady says Mulholland and Temple never left.' } },
   { id:'b6', t:{ easy:'Billy learns that the parrot and the dog are stuffed.',  hard:'Billy realizes the parrot and the dachshund are stuffed.' } }
  ] },

/* ---- Part C · what happened and why (story order: literal → inference) ---- */
C: [
 { id:'c1', q:{ easy:'Why is Billy in Bath?', hard:'Why has Billy come to Bath?' },
   opts:['His company sent him to work at an office there.','He wants to visit his family.','He is starting at a school in Bath.','He is looking for a lost dog.'] },
 { id:'c2', q:{ easy:'At first, Billy wants to stay at a pub. Why?', hard:'At first, Billy would rather stay at a pub than a boarding-house. Why?' },
   opts:['A pub would be friendlier, with people to talk to.','His boss told him to stay at a pub.','He has stayed in many boarding-houses and is tired of them.','The pub is right next to the station.'] },
 { id:'c3', q:{ easy:'What is surprising about the price of the room?', hard:'What surprises Billy about the price of the room?' },
   opts:['It is very cheap: less than half of what he wanted to pay.','It is very expensive.','The first night is free.','He has to pay for a whole month.'] },
 { id:'c4', q:{ easy:'In the hall there are no hats, no coats and no umbrellas. What does this show?', hard:'The hall has no hats, coats, umbrellas or walking-sticks. What does this suggest?' },
   opts:['Nobody else is staying in the house.','It is summer, so nobody needs a coat.','The landlady sells hats and coats.','Billy forgot his own coat at the station.'] },
 { id:'c5', q:{ easy:'Billy thinks he knows the two names in the guest book. Where does he think he saw them?', hard:'The two names in the guest book seem familiar. Where does Billy think he saw them?' },
   opts:['In the newspapers','On a sign at the station','In a letter from Head Office','On the doors upstairs'] },
 { id:'c6', q:{ easy:'The landlady says Mr Mulholland "never left. He\u2019s still here." What does she probably mean?', hard:'"He never left. He\u2019s still here." What does the landlady most likely mean?' },
   opts:['The young men are dead, and she kept their bodies, like her pets.','They live on the third floor and pay rent.','They went home to Cardiff and Bristol.','They are hiding from the police.'] },
 { id:'c7', q:{ easy:'The tea tastes a little of bitter almonds. Why is this important?', hard:'The tea tastes "faintly of bitter almonds." Why is this an important clue?' },
   opts:['There may be poison in the tea.','Billy does not like sugar.','The landlady bakes cakes with nuts.','The tea is old and cold.'] },
 { id:'c8', q:{ easy:'Billy thinks the landlady is a little strange but harmless. Is he right?', hard:'Billy decides the landlady is "slightly dotty" but harmless. Is he right?' },
   opts:['No. The clues show she is dangerous.','Yes. She is kind and only a little strange.','Yes. She only cares about money.','No. She is a famous businesswoman.'] }
].map(function(x){ x.dir={easy:'Choose one answer. You may use your paper story.',hard:'Choose the best answer. You may use your paper story.'}; return x; }),

/* ---- Part D · cozy or a warning (only clues the story itself marks) ---- */
D: { id:'d',
  dir:{ easy:'Is each clue cozy, or is it a warning? Tap one for each.', hard:'For each clue, decide: does it make the house seem cozy, or is it a warning sign?' },
  clues:[
   { id:'d1', ans:'cz', t:{ easy:'A bright fire burns in the fireplace.',              hard:'A bright fire is burning in the hearth.' } },
   { id:'d2', ans:'cz', t:{ easy:'There are soft armchairs and a piano.',              hard:'The room has plump armchairs and a baby-grand piano.' } },
   { id:'d3', ans:'cz', t:{ easy:'She gives Billy a warm, friendly smile.',            hard:'She gives him a warm, welcoming smile.' } },
   { id:'d4', ans:'cz', t:{ easy:'She puts a hot water bottle in his bed.',            hard:'She has put a hot water-bottle between his clean sheets.' } },
   { id:'d5', ans:'cr', t:{ easy:'There are no other coats or hats in the hall.',      hard:'There are no other hats or coats in the hall.' } },
   { id:'d6', ans:'cr', t:{ easy:'The last name in the guest book is two years old.',  hard:'The last entry in the guest book is over two years old.' } },
   { id:'d7', ans:'cr', t:{ easy:'"He never left. He\u2019s still here."',             hard:'"He never left. He\u2019s still here."' } },
   { id:'d8', ans:'cr', t:{ easy:'The tea tastes of bitter almonds.',                  hard:'The tea tastes faintly of bitter almonds.' } }
  ] },

/* ---- Part E · write (Mr. Toby scores 0-4 on the dashboard) ---- */
E: { id:'e',
  dir:{ easy:'Write 4 or more sentences. Use the sentence frame if it helps.', hard:'Write a paragraph of 4 or more sentences.' },
  q:{ easy:'What do you think will happen to Billy? Give two clues from the story.',
      hard:'What do you think will happen to Billy? Support your prediction with two clues from the story, and explain what each clue shows.' },
  frame:['I think Billy will ______.','One clue is ______. This shows ______.','Another clue is ______. This shows ______.'],
  rubric:'A 4 has: a clear prediction, two true clues from the story, and what each clue shows.' }
};

/* For the dashboard: what Mr. Toby looks for in Part E */
var E_RUBRIC = [
  [4,'Clear prediction + two accurate clues + explains what each clue shows'],
  [3,'Prediction + two accurate clues, but little explaining'],
  [2,'Prediction + one accurate clue'],
  [1,'A prediction only, or clues that are not in the story'],
  [0,'Blank or off topic']
];
