/* content.js — Story Check 1: The New Student (T-454). Shared by the student page (index.html) and the teacher page (dashboard.html).
   Item ids are permanent: never reuse or renumber one (saved answers are keyed by id).
   The Episode 2 teaser (Jun: "Where is my backpack?") is kept out of every item. */
var CFG={
 ep:'ep01', num:1, title:'The New Student', sort:600,
 skills:['reading-aloud','listening','vocabulary','comprehension','describing-people','compare-contrast'],
 intro:{bg:'classroom',board:['ELD 101','Talk to every classmate!'],chars:[{id:'amira',x:560,face:1,expr:'smile',hold:'sketchbook'},{id:'linh',x:960,face:-1,expr:'nervous',hold:'paper'}]},
 board:['We','is','We are'],
 orderAsk:'What happens in the story? Put the five events in order, from first to last.',
 orderHint:'First, Amira gives Linh a question sheet. Who does Linh talk to next?',
 sumAsk:'Write 4 or 5 sentences. Tell how Linh feels, who she meets, and how she feels at the end. Use First, Then, Next, and Finally.',
 sumStart:'Linh is new and ___. First, she meets ___. Then, ___. Next, ___. Finally, ___.',
 retell:{prompt:'Tell the story of Episode 1. How does Linh feel at the start? Who does she meet? How does she feel at the end?',keys:['new','nervous','vietnam','amira','mateo','paolo','jun','tall','short','shy','friendly','piano','soccer','glasses','both','but','happy','friends']},
 talk:{prompt:'Describe yourself. Are you tall or short? Shy or friendly? What do you like? Say two or three sentences.',keys:['tall','short','shy','friendly','curious','hair','like','soccer','drawing','music','am','have'],must:'\\b(am|have|has)\\b',scene:{bg:'classroom',chars:[{id:'linh',x:800,face:1,expr:'smile',hold:'paper'}]}}
};
/* Read aloud: 8 lines from the episode (Level A, scenes 0-6; the teaser lines are left out) + 2 new sentences built from its words. */
var READ=[
 {id:'r1',scene:0,t:'This is Linh. She is new. She is from Vietnam.'},
 {id:'r2',scene:0,t:'Linh is short. She has long, straight, black hair.'},
 {id:'r3',scene:1,t:'Hi! I am Amira. What is your name?'},
 {id:'r4',scene:2,t:'Hi. Are you tall or short?'},
 {id:'r5',scene:2,t:'Sorry. Can you please repeat that?'},
 {id:'r6',scene:3,t:'How do you spell your name?'},
 {id:'r7',scene:4,t:'This is Jun. He has short, black hair and glasses.'},
 {id:'r8',scene:6,t:'Mateo and I both have black hair.'},
 {id:'r9',isNew:true,custom:{bg:'classroom',chars:[{id:'amira',x:800,face:1,expr:'happy',hold:'sketchbook'}]},t:'Amira is friendly. She has a sketchbook.'},
 {id:'r10',isNew:true,custom:{bg:'classroom',chars:[{id:'paolo',x:620,face:1,expr:'happy'},{id:'mateo',x:980,face:-1,expr:'smile',hold:'ball'}]},t:'Paolo and Mateo are both friendly, but Mateo is tall.'}
];
var WORDS_PIC=[
 {id:'w1',pic:'ptall',a:'tall',opts:['tall','short','shy','curly'],hint:'Look at the top of the door.'},
 {id:'w2',pic:'pshort',a:'short',opts:['short','tall','loud','straight'],hint:'Look at the door handle.'},
 {id:'w3',pic:'pcurly',a:'curly hair',opts:['curly hair','straight hair','glasses','headphones'],hint:'Look at the hair. It goes round and round.'},
 {id:'w4',pic:'pstraight',a:'straight hair',opts:['straight hair','curly hair','wavy hair','a hijab'],hint:'Look at the hair. It goes down like a line.'},
 {id:'w5',pic:'pglasses',a:'glasses',opts:['glasses','headphones','a hat','a hijab'],hint:'Jun has them on his eyes.'},
 {id:'w6',pic:'pheadphones',a:'headphones',opts:['headphones','glasses','a soccer ball','a sketchbook'],hint:'Jun listens to music with them.'}
];
var WORDS_LANG=[
 {id:'w7',w:'nervous',ctx:'I am nervous.',def:'a little afraid before something new'},
 {id:'w8',w:'friendly',ctx:'Amira is friendly.',def:'nice to people; likes to talk to people'},
 {id:'w9',w:'shy',ctx:'Yes. I am shy.',def:'quiet; afraid to talk to new people'},
 {id:'w10',w:'athletic',ctx:'He is athletic. He plays soccer.',def:'strong and good at sports'},
 {id:'w11',w:'curious',ctx:'But I am curious.',def:'wants to learn and know new things'},
 {id:'w12',w:'compare',ctx:'Now she compares.',def:'look at two things: the same and different'}
];
var LETTERS=[
 /* say = what the dashboard shows; ear = what the voice says, ONE LETTER PER UTTERANCE with a pause between.
    E and I sound alike to many students, so each gets its own item. */
 {id:'l1',say:'E',ear:['E.'],a:['e'],kind:'letter'},
 {id:'l2',say:'I',ear:['eye.'],a:['i'],kind:'letter'},
 {id:'l3',say:'A',ear:['A.'],a:['a'],kind:'letter'},
 {id:'l4',say:'Y',ear:['why.'],a:['y'],kind:'letter'},
 {id:'l5',say:'P-A-O-L-O',ear:['P.','A.','oh.','L.','oh.'],a:['paolo'],kind:'name',n:5},
 {id:'l6',say:'L-I-N-H',ear:['L.','eye.','N.','H.'],a:['linh'],kind:'name',n:4}
];
var DICT=[
 {id:'d1',w:'tall',sent:'Mateo is tall.'},
 {id:'d2',w:'short',sent:'Linh is short.'},
 {id:'d3',w:'curly',sent:'He has short, curly, black hair.'},
 {id:'d4',w:'glasses',sent:'He has short, black hair and glasses.'},
 {id:'d5',w:'shy',sent:'Yes. I am shy.'}
];
var LISTEN=[
 {id:'h1',say:'Amira is from Yemen. She is friendly.',q:'Where is Amira from?',opts:['Yemen','Vietnam','China','Guatemala'],a:0,hint:'Listen for the word after “from.”'},
 {id:'h2',say:'Jun has short, black hair and glasses.',q:'What does Jun have?',opts:['Glasses','Curly hair','A soccer ball','A sketchbook'],a:0,hint:'Listen to the end of the sentence.'},
 {id:'h3',say:'Mateo plays soccer every day after school.',q:'When does Mateo play soccer?',opts:['After school','Before school','At lunch','Only on Monday'],a:0,hint:'Listen to the end of the sentence.'},
 {id:'h4',say:'Linh is shy, but she is curious.',q:'Which word describes Linh?',opts:['Curious','Loud','Dramatic','Athletic'],a:0,hint:'Listen to the word after “but she is.”'}
];
/* ONE "why did...?" question (s4). */
var STORY=[
 {id:'s1',pic:'hallway',q:'Where is Linh from?',opts:['Vietnam','Yemen','China','The Philippines'],a:0,hint:'The narrator says, “She is from ...”'},
 {id:'s2',pic:'hallway',q:'How does Linh feel at the start?',opts:['Nervous','Happy','Angry','Tired'],a:0,hint:'Linh says, “I am ...”'},
 {id:'s3',pic:'classroom',q:'Who gives Linh the question sheet?',opts:['Amira','Mateo','Paolo','Jun'],a:0,hint:'She says, “Here is your paper.”'},
 {id:'s4',pic:'classroom',q:'Why did Linh say, “Can you please repeat that?”',opts:['She did not understand Mateo the first time.','She wanted to play soccer.','Mateo was very quiet.','She did not like his answer.'],a:0,hint:'Then Mateo says it again: “My name is Mateo.”'},
 {id:'s5',pic:'classroom',q:'Who is very tall?',opts:['Mateo','Linh','Paolo','Jun'],a:0,hint:'He says, “I am very tall!”'},
 {id:'s6',pic:'corner',q:'Who plays the piano?',opts:['Jun','Paolo','Amira','Mateo'],a:0,hint:'He stands in the corner with headphones.'},
 {id:'s7',pic:'classroom',q:'What do Linh and Amira both like?',opts:['Drawing','Soccer','The piano','Music'],a:0,hint:'Amira says, “Me too! We both like ...”'},
 {id:'s8',pic:'hallway',q:'How does Linh feel at the end of class?',opts:['Happy. She is not nervous now.','Sad. She has no friends.','Nervous. She wants to go home.','Angry at Amira.'],a:0,hint:'Linh says, “I am not nervous now.”'}
];
/* fix: words; errs = list of errors; each error = list of [wordIndex, accepted replacements] (any one fixes it).
   Every error is a WRONG word to change, never a missing word (T-265). ok = whole-sentence patterns that also count. */
var FIX=[
 {id:'f1',s:'Mateo have curly hair.',errs:[[[1,['has']]]],hint:'Look at the verb. Mateo is one person.',ok:['^mateo (has|had) curly hair$']},
 {id:'f2',s:'Linh are short.',errs:[[[1,['is']]]],hint:'Linh is one person: she ___.',ok:['^linh (is|was) short$']},
 {id:'f3',s:'Jun has short, black hair and glass.',errs:[[[6,['glasses']]]],hint:'You wear two of them on your eyes.',ok:['^jun (has|had) short black hair and glasses$']},
 {id:'f4',s:'I is shy.',errs:[[[1,['am']]]],hint:'After I, use am.',ok:['^i (am|was) shy$']},
 {id:'f5',s:'Amira are friendly, and she have a sketchbook.',errs:[[[1,['is']]],[[5,['has']]]],hint:'Two errors. Amira is one person. And after she, use has.',ok:['^amira (is|was) friendly and she (has|had) a sketchbook$']},
 {id:'f6',s:'Linh and Mateo both has black hair, and Mateo is short.',errs:[[[4,['have']]],[[10,['tall']]]],hint:'Two errors. Linh and Mateo are two people. And is Mateo tall or short?',ok:['^linh and mateo both (have|had) black hair and mateo is (tall|very tall)$']}
];
var GRAM=[
 {id:'g1',q:'Mateo ___ tall.',opts:['is','are','am','have'],a:0,hint:'Mateo is one person.'},
 {id:'g2',q:'Linh ___ long, straight hair.',opts:['has','have','is','are'],a:0,hint:'For hair, use has or have. Linh is one person.'},
 {id:'g3',q:'I ___ shy, but I am curious.',opts:['am','is','are','has'],a:0,hint:'After I, use am.'},
 {id:'g4',q:'Linh and Amira ___ like drawing.',opts:['both','but','or','so'],a:0,hint:'They are the same. This word means “the two of them.”'}
];
/* extensions. PLACES = the order cards: [background, sentence]. Same shape as Ep 2-5, so the dashboard reads it the same way. */
var PLACES=[['classroom','Amira gives Linh a question sheet.'],['classroom','Linh asks Mateo: tall or short?'],['classroom','Paolo spells his name for Linh.'],['corner','Linh talks to Jun in the corner.'],['classroom','Linh compares herself and Mateo.']];
var CHARS=['jun','mateo','amira','linh','paolo'];
var FACTS=[
 ['is new at Galileo',['linh']],['is short',['linh']],['has long, straight, black hair',['linh']],['is shy but curious',['linh']],['is from Vietnam',['linh']],
 ['is very tall',['mateo']],['has short, curly, black hair',['mateo']],['is athletic',['mateo']],['plays soccer',['mateo']],['is from Guatemala',['mateo']],
 ['wears a hijab',['amira']],['is from Yemen',['amira']],['is friendly and loud',['amira']],['carries a sketchbook',['amira']],['likes drawing',['amira','linh']],
 ['has glasses',['jun']],['is from China',['jun']],['plays the piano',['jun']],['has headphones',['jun']],['is shy',['jun','linh']],
 ['has wavy, brown hair',['paolo']],['is from the Philippines',['paolo']],['is playful and dramatic',['paolo']],['spells his name P-A-O-L-O',['paolo']]
];
var PAIRS=[
 {id:'lm',a:'linh',b:'mateo',chips:[['is short','a'],['likes drawing','a'],['is tall','b'],['plays soccer','b'],['has black hair','both'],['is new at Galileo','both']]},
 {id:'la',a:'linh',b:'amira',chips:[['is shy','a'],['is from Vietnam','a'],['is loud','b'],['wears a hijab','b'],['likes drawing','both'],['is in the ELD class','both']]},
 {id:'jp',a:'jun',b:'paolo',chips:[['is shy','a'],['plays the piano','a'],['is dramatic','b'],['has wavy, brown hair','b'],['talks to Linh','both'],['is in the ELD class','both']]},
 {id:'mj',a:'mateo',b:'jun',chips:[['is athletic','a'],['has curly hair','a'],['has glasses','b'],['is musical','b'],['has black hair','both'],['answers Linh’s question','both']]}
];
var CAST_NAME={jun:'Jun',mateo:'Mateo',amira:'Amira',linh:'Linh',paolo:'Paolo'};
/* summary auto-check (0-4): order words, the problem, the people, the ending */
function sumCheck(s){ var why=[];
 if(['first','then','next','finally'].filter(function(w){return new RegExp('\\b'+w+'\\b').test(s);}).length>=3) why.push('order words');
 if(/(linh|she)/.test(s)&&/(new|nervous|shy|first day)/.test(s)) why.push('the problem');
 if(['amira','mateo','paolo','jun'].filter(function(w){return s.indexOf(w)>=0;}).length>=3) why.push('people');
 if(/(not nervous|happy|friends|smile)/.test(s)) why.push('the ending');
 return why; }

var SECTIONS=[
 {k:'read',t:'1. Read aloud',n:READ.length,pic:'readpic',dir:'Read each sentence out loud. Tap Record, read, then tap Stop. There is no help on this part.'},
 {k:'words',t:'2. Words',n:12,pic:'pglasses',dir:'Look at the picture or the word. Choose the right answer.'},
 {k:'listen',t:'3. Listen',n:LETTERS.length+DICT.length+LISTEN.length,pic:'ear',dir:'Tap the play button. Listen. Then type or choose your answer.'},
 {k:'story',t:'4. Story questions',n:STORY.length,pic:'corner',dir:'Answer the questions about the story. Tap a word to see it in your language.'},
 {k:'fix',t:'5. Fix the sentence',n:FIX.length,pic:'board',dir:'Each sentence has a mistake. Tap the wrong word and type the right word. Then tap Check.'},
 {k:'gram',t:'6. Grammar',n:GRAM.length,pic:'pcurly',dir:'Choose the word that completes the sentence.'}
];
var EXTS=[
 {k:'order',t:'A. What happened?',pic:'map',dir:'Put the story in order. Tap a card, then tap a number.'},
 {k:'summary',t:'B. Write a summary',pic:'notebook',dir:'Write a summary of the story. Use First, Then, Next, and Finally.'},
 {k:'describe',t:'C. Describe a character',pic:'cast',dir:'Choose one character. Tap the sentences that are true about that character. Then write about the character.'},
 {k:'compare',t:'D. Compare two characters',pic:'pair',dir:'Choose two characters. Put each sentence in the right circle. Then write one sentence with both and but.'},
 {k:'retell',t:'E. Tell the story',pic:'mic',dir:'Tell the story out loud in your own words. You can talk for up to 90 seconds. There is no text to read.'},
 {k:'talk',t:'F. Describe yourself',pic:'talk',dir:'Answer out loud: Are you tall or short? Shy or friendly? What do you like?'}
];
