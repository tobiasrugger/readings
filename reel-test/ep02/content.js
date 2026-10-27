/* content.js — Story Check 2: The Backpack. Shared by the student page (index.html) and the teacher page (dashboard.html).
   Item ids are permanent: never reuse or renumber one (saved answers are keyed by id). */
/* Read aloud: 8 lines from the episode (Level A, every scene) + 2 new sentences built from its words. */
var READ=[
 {id:'r1',scene:0,t:'Class is over. Jun looks left. He looks right.'},
 {id:'r2',scene:0,t:'Jun has an orange backpack. It has many things in it.'},
 {id:'r3',scene:1,t:'First, they go to the library. Students read books in the library.'},
 {id:'r4',scene:2,t:'Hmm. I have a backpack. But my backpack is red.'},
 {id:'r5',scene:3,t:'No. I don\u2019t have a pencil. I don\u2019t have a notebook. Everything is in my backpack!'},
 {id:'r6',scene:4,t:'It is lunch time. Students eat lunch in the cafeteria.'},
 {id:'r7',scene:5,t:'Jun forgot his backpack in the music corner. Now he has his backpack again.'},
 {id:'r8',scene:6,t:'I have one notebook, two pencils, one calculator, and one music book.'},
 {id:'r9',isNew:true,custom:{bg:'library',chars:[{id:'amira',x:700,face:1,expr:'smile',hold:'sketchbook'}]},t:'Amira has a blue folder. She carries it to the library.'},
 {id:'r10',isNew:true,custom:{bg:'gym',chars:[{id:'paolo',x:560,face:1,expr:'nervous'},{id:'linh',x:900,face:-1,expr:'smile'}]},t:'Paolo cannot find his calculator. Linh helps him look in the gym.'}
];
var WORDS_PIC=[
 {id:'w1',pic:'backpack',a:'backpack',opts:['backpack','notebook','folder','calculator'],hint:'Jun carries his things in it. It is orange.'},
 {id:'w2',pic:'pencil',a:'pencil',opts:['pencil','pen','book','piano'],hint:'Paolo has ten of these. You write with it.'},
 {id:'w3',pic:'calculator',a:'calculator',opts:['calculator','computer','notebook','folder'],hint:'You use it in math class. It has numbers.'},
 {id:'w4',pic:'piano',a:'piano',opts:['piano','library','calculator','computer'],hint:'It is in the music corner. Jun\u2019s backpack is next to it.'},
 {id:'w5',pic:'library',a:'library',opts:['library','gym','cafeteria','hallway'],hint:'Students read books here.'},
 {id:'w6',pic:'cafeteria',a:'cafeteria',opts:['cafeteria','classroom','library','gym'],hint:'Students eat lunch here.'}
];
var WORDS_LANG=[
 {id:'w7',w:'find',ctx:'I can\u2019t find my backpack.',def:'see something you were looking for'},
 {id:'w8',w:'borrow',ctx:'Could I borrow a pencil?',def:'take something and give it back later'},
 {id:'w9',w:'forget',ctx:'Don\u2019t forget your backpack.',def:'not remember'},
 {id:'w10',w:'hungry',ctx:'I am hungry! Let\u2019s eat first.',def:'you want to eat'},
 {id:'w11',w:'everything',ctx:'Everything is in my backpack!',def:'all the things'},
 {id:'w12',w:'carry',ctx:'I carry my books in my backpack.',def:'hold something and take it with you'}
];
var LETTERS=[
 {id:'l1',say:'G',a:['g'],kind:'letter'},
 {id:'l2',say:'J',a:['j'],kind:'letter'},
 {id:'l3',say:'E',a:['e'],kind:'letter'},
 {id:'l4',say:'Y',a:['y'],kind:'letter'},
 {id:'l5',say:'M. A. T. E. O.',a:['mateo'],kind:'name',n:5},
 {id:'l6',say:'L. eye. N. H.',a:['linh'],kind:'name',n:4}
];
var DICT=[
 {id:'d1',w:'pencil',sent:'Jun borrows a pencil.'},
 {id:'d2',w:'gym',sent:'Students play sports in the gym.'},
 {id:'d3',w:'library',sent:'Students read books in the library.'},
 {id:'d4',w:'borrow',sent:'Could I borrow one?'},
 {id:'d5',w:'orange',sent:'Jun has an orange backpack.'}
];
var LISTEN=[
 {id:'h1',say:'Mateo has a red backpack.',q:'What color is Mateo\u2019s backpack?',opts:['Red','Orange','Blue','Green'],a:0,hint:'Listen for the color word before \u201cbackpack.\u201d'},
 {id:'h2',say:'Students eat lunch in the cafeteria.',q:'Where do students eat lunch?',opts:['In the cafeteria','In the library','In the gym','In the hallway'],a:0,hint:'Listen for the word after \u201cin the.\u201d'},
 {id:'h3',say:'Paolo has ten pencils. Jun has one pencil.',q:'How many pencils does Paolo have?',opts:['Ten','One','Two','Five'],a:0,hint:'There are two numbers. Which one goes with Paolo?'},
 {id:'h4',say:'Linh has a notebook. Amira has a sketchbook and many pens.',q:'Who has many pens?',opts:['Amira','Linh','Jun','Mateo'],a:0,hint:'Listen to the second sentence again.'}
];
var STORY=[
 {id:'s1',q:'What is Jun\u2019s problem?',opts:['He can\u2019t find his backpack.','He is hungry.','He doesn\u2019t have a phone.','He is late for class.'],a:0,hint:'Think about the very beginning, in the hallway.'},
 {id:'s2',q:'Where do the friends look first?',opts:['In the library','In the gym','In the cafeteria','In the music corner'],a:0,hint:'Listen for the word \u201cFirst.\u201d Students read books there.'},
 {id:'s3',q:'Who is in the gym?',opts:['Mateo','Paolo','Linh','Amira'],a:0,hint:'Who likes sports and has a ball?'},
 {id:'s4',q:'What does Jun borrow from Paolo?',opts:['A pencil','A calculator','A ball','A music book'],a:0,hint:'Paolo has ten of them.'},
 {id:'s5',q:'Why does Jun need to borrow a pencil?',opts:['Everything is in his backpack.','He likes Paolo\u2019s pencils.','His pencil is red.','He wants to draw.'],a:0,hint:'Where are all of Jun\u2019s things?'},
 {id:'s6',q:'Where do students eat lunch?',opts:['In the cafeteria','In the classroom','In the library','In the hallway'],a:0,hint:'Mateo is hungry there.'},
 {id:'s7',q:'Where is the backpack?',opts:['Next to the piano','Under a table in the library','In the gym','In Paolo\u2019s desk'],a:0,hint:'Jun goes to the music corner after class.'},
 {id:'s8',q:'Why is the backpack in the music corner?',opts:['Jun forgot it there.','Mateo took it.','Paolo hid it.','The teacher put it there.'],a:0,hint:'Jun says, \u201cI am sorry, friends.\u201d Why?'}
];
/* fix: words; errs = list of errors; each error = list of [wordIndex, accepted replacements] (any one fixes it) */
var FIX=[
 {id:'f1',s:'Paolo have ten pencils.',errs:[[[1,['has']]]],hint:'Look at the verb. Paolo is one person.'},
 {id:'f2',s:'Jun has two pencil.',errs:[[[3,['pencils']]]],hint:'Two is more than one. Look at the last word.'},
 {id:'f3',s:'Students eat lunch in cafeteria.',errs:[[[3,['in the']],[4,['the cafeteria']]]],hint:'Say it like the story: in ___ cafeteria. A small word is missing.'},
 {id:'f4',s:'Jun has a orange backpack.',errs:[[[2,['an']]]],hint:'Orange starts with a vowel sound: a, e, i, o, u.'},
 {id:'f5',s:'Linh and Amira has many book.',errs:[[[3,['have']]],[[5,['books']]]],hint:'Two errors. Linh and Amira are two people. Many means more than one.'},
 {id:'f6',s:'Jun forget his backpack in music corner.',errs:[[[1,['forgot']]],[[4,['in the']],[5,['the music']]]],hint:'Two errors. It already happened (past). And a small word is missing.'}
];
var GRAM=[
 {id:'g1',q:'Jun ___ an orange backpack.',opts:['has','have','are','am'],a:0,hint:'Jun is one person: he ___.'},
 {id:'g2',q:'Do you ___ a pencil?',opts:['have','has','is','does'],a:0,hint:'Do you ... always takes the base verb.'},
 {id:'g3',q:'I have ___ calculator.',opts:['a','an','two','many'],a:0,hint:'Calculator starts with a consonant sound. Only one calculator.'},
 {id:'g4',q:'Paolo has ten ___.',opts:['pencils','pencil','a pencil','pencil\u2019s'],a:0,hint:'Ten is more than one.'}
];
/* extensions */
var PLACES=[['library','the library'],['gym','the gym'],['classroom','the classroom'],['cafeteria','the cafeteria'],['corner','the music corner']];
var CHARS=['jun','mateo','amira','linh','paolo'];
var FACTS=[
 ['is short',['linh']],['has long, straight, black hair',['linh']],['is shy',['linh','jun']],['is from Vietnam',['linh']],
 ['is tall',['mateo']],['has curly black hair',['mateo']],['plays sports in the gym',['mateo']],['has a red backpack',['mateo']],['is from Guatemala',['mateo']],
 ['wears a hijab',['amira']],['draws every day',['amira']],['has a sketchbook',['amira']],['is from Yemen',['amira']],
 ['has glasses',['jun']],['is musical',['jun']],['has an orange backpack',['jun']],['forgot his backpack',['jun']],['is from China',['jun']],
 ['has wavy brown hair',['paolo']],['has ten pencils',['paolo']],['is playful',['paolo']],['is from the Philippines',['paolo']]
];
var PAIRS=[
 {id:'jm',a:'jun',b:'mateo',chips:[['has glasses','a'],['forgot his backpack','a'],['is tall','b'],['plays sports in the gym','b'],['has a backpack','both'],['is in the ELD class','both']]},
 {id:'al',a:'amira',b:'linh',chips:[['wears a hijab','a'],['draws every day','a'],['has long, straight, black hair','b'],['is from Vietnam','b'],['helps Jun look for his backpack','both'],['goes to the library','both']]},
 {id:'jl',a:'jun',b:'linh',chips:[['has glasses','a'],['is musical','a'],['has long, straight, black hair','b'],['is from Vietnam','b'],['is shy','both'],['goes to the library','both']]},
 {id:'mp',a:'mateo',b:'paolo',chips:[['is tall','a'],['has a red backpack','a'],['has ten pencils','b'],['has wavy brown hair','b'],['helps Jun','both'],['is in the ELD class','both']]}
];
var CAST_NAME={jun:'Jun',mateo:'Mateo',amira:'Amira',linh:'Linh',paolo:'Paolo'};

var SECTIONS=[
 {k:'read',t:'1. Read aloud',n:READ.length,pic:'readpic',dir:'Read each sentence out loud. Tap Record, read, then tap Stop. There is no help on this part.'},
 {k:'words',t:'2. Words',n:12,pic:'backpack',dir:'Look at the picture or the word. Choose the right answer.'},
 {k:'listen',t:'3. Listen',n:LETTERS.length+DICT.length+LISTEN.length,pic:'ear',dir:'Tap the play button. Listen. Then type or choose your answer.'},
 {k:'story',t:'4. Story questions',n:STORY.length,pic:'corner',dir:'Answer the questions about the story. Tap a word to see it in your language.'},
 {k:'fix',t:'5. Fix the sentence',n:FIX.length,pic:'board',dir:'Each sentence has a mistake. Tap the wrong word and type the right word. Then tap Check.'},
 {k:'gram',t:'6. Grammar',n:GRAM.length,pic:'pencil',dir:'Choose the word that completes the sentence.'}
];
var EXTS=[
 {k:'order',t:'A. Where did they go?',pic:'map',dir:'Put the places in order. Tap a place, then tap a number.'},
 {k:'summary',t:'B. Write a summary',pic:'notebook',dir:'Write a summary of the story. Use First, Then, Next, and Finally.'},
 {k:'describe',t:'C. Describe a character',pic:'amira',dir:'Choose one character. Tap the sentences that are true about that character. Then write about the character.'},
 {k:'compare',t:'D. Compare two characters',pic:'pair',dir:'Choose two characters. Put each sentence in the right circle. Then write one sentence with both and but.'},
 {k:'retell',t:'E. Tell the story',pic:'mic',dir:'Tell the story out loud in your own words. You can talk for up to 90 seconds. There is no text to read.'},
 {k:'talk',t:'F. Your backpack',pic:'mybag',dir:'Answer out loud: What is in your backpack? Say two or three sentences. Use I have.'}
];

