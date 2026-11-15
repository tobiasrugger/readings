/* content.js — Story Check 5: Where Is Room 318? (T-417). Shared by the student page (index.html) and the teacher page (dashboard.html).
   Item ids are permanent: never reuse or renumber one (saved answers are keyed by id).
   The Episode 6 teaser (next week's how-to poster project) is kept out of every item. */
var CFG={
 ep:'ep05', num:5, title:'Where Is Room 318?', sort:640,
 skills:['reading-aloud','listening','vocabulary','comprehension','directions','prepositions-of-place'],
 intro:{bg:'stairwell',board:['1',true],chars:[{id:'linh',x:420,face:1,expr:'nervous',hold:'schedule'},{id:'jun',x:1150,face:-1,expr:'smile',hold:'map'}]},
 board:['They','is','They are'],
 orderAsk:'What happens in the story? Put the five events in order, from first to last.',
 orderHint:'First, Linh asks Paolo. What is next?',
 sumAsk:'Write 4 or 5 sentences. Tell Linh’s problem, where she goes, and how she finds Room 318. Use First, Then, Next, and Finally.',
 sumStart:'Linh needs Room ___. First, she ___. Then, ___. Next, ___. Finally, ___.',
 retell:{prompt:'Tell the story of Episode 5. What room does Linh need? Where does she go first? How does she find Room 318?',keys:['318','118','paolo','amira','jun','mateo','map','star','upstairs','downstairs','left','right','straight','floor','art','science','loud','heard','found','time']},
 talk:{prompt:'How do you get from our classroom to the cafeteria? Say two or three steps. Use First, Then, go and turn.',keys:['first','then','next','go','turn','left','right','straight','upstairs','downstairs','door','hallway','stairs','cafeteria'],must:'\\b(go|goes|turn|turns)\\b',scene:{bg:'hallway',chars:[{id:'paolo',x:800,face:1,expr:'happy'}]}}
};
/* Read aloud: 8 lines from the episode (Level A, scenes 0-5, teaser lines left out) + 2 new sentences built from its words. */
var READ=[
 {id:'r1',scene:0,t:'Lunch is over. Linh has science in Room 318.'},
 {id:'r2',scene:0,t:'Room 118? Easy! Go straight. Then, turn left.'},
 {id:'r3',scene:1,t:'Room 318 is upstairs. It is on the third floor.'},
 {id:'r4',scene:2,t:'Look at the map. The star is you.'},
 {id:'r5',scene:2,t:'First, go upstairs. Then, turn right.'},
 {id:'r6',scene:3,t:'First, Linh goes through the door. Then, she goes upstairs.'},
 {id:'r7',scene:3,t:'I have P.E. It is outside today.'},
 {id:'r8',scene:4,t:'Next, Linh turns right. She goes straight.'},
 {id:'r9',isNew:true,custom:{bg:'stairwell',board:['2',false],chars:[{id:'amira',x:800,face:1,expr:'smile',hold:'sketchbook'}]},t:'Amira goes downstairs to the art room on the first floor.'},
 {id:'r10',isNew:true,custom:{bg:'hallway',chars:[{id:'mateo',x:800,face:1,expr:'happy',hold:'ball'}]},t:'Mateo goes outside. Then, he turns left to the schoolyard.'}
];
var WORDS_PIC=[
 {id:'w1',pic:'dleft',a:'turn left',opts:['turn left','turn right','go straight','go upstairs'],hint:'Look at the arrow. Which hand is on that side?'},
 {id:'w2',pic:'dright',a:'turn right',opts:['turn right','turn left','go straight','go downstairs'],hint:'Look at the arrow. Which hand is on that side?'},
 {id:'w3',pic:'dstraight',a:'go straight',opts:['go straight','turn left','turn right','go outside'],hint:'The arrow does not turn.'},
 {id:'w4',pic:'dup',a:'upstairs',opts:['upstairs','downstairs','outside','inside'],hint:'Linh goes this way to the third floor.'},
 {id:'w5',pic:'ddown',a:'downstairs',opts:['downstairs','upstairs','straight','inside'],hint:'Mateo goes this way to P.E.'},
 {id:'w6',pic:'schoolmap',a:'map',opts:['map','schedule','poster','notebook'],hint:'Jun shows it to Linh. The star is you.'}
];
var WORDS_LANG=[
 {id:'w7',w:'floor',ctx:'It is on the third floor.',def:'one level of a building'},
 {id:'w8',w:'through',ctx:'Linh goes through the door.',def:'in one side and out the other side'},
 {id:'w9',w:'outside',ctx:'Today, P.E. is outside.',def:'not in the building'},
 {id:'w10',w:'location',ctx:'First, find your location.',def:'the place where you are'},
 {id:'w11',w:'loud',ctx:'The hallway is very loud.',def:'a lot of noise'},
 {id:'w12',w:'heard',ctx:'I heard 118. Sorry, Linh!',def:'past of hear: listened and got the sound'}
];
var LETTERS=[
 /* say = what the dashboard shows; ear = what the voice says, ONE LETTER PER UTTERANCE with a pause between.
    G and J sound alike to many students, so each gets its own item. */
 {id:'l1',say:'G',ear:['G.'],a:['g'],kind:'letter'},
 {id:'l2',say:'J',ear:['J.'],a:['j'],kind:'letter'},
 {id:'l3',say:'F',ear:['F.'],a:['f'],kind:'letter'},
 {id:'l4',say:'S',ear:['S.'],a:['s'],kind:'letter'},
 {id:'l5',say:'L-I-N-H',ear:['L.','eye.','N.','H.'],a:['linh'],kind:'name',n:4},
 {id:'l6',say:'M-A-T-E-O',ear:['M.','A.','T.','E.','oh.'],a:['mateo'],kind:'name',n:5}
];
var DICT=[
 {id:'d1',w:'upstairs',sent:'First, go upstairs.'},
 {id:'d2',w:'left',sent:'Then, turn left.'},
 {id:'d3',w:'straight',sent:'She goes straight.'},
 {id:'d4',w:'floor',sent:'It is on the third floor.'},
 {id:'d5',w:'third',sent:'Room 318 is on the third floor.'}
];
var LISTEN=[
 {id:'h1',say:'Room 214 is on the second floor.',q:'Which floor is Room 214 on?',opts:['The second floor','The first floor','The third floor','The fourth floor'],a:0,hint:'Listen for the word before “floor.”'},
 {id:'h2',say:'Go straight. Then, turn right.',q:'What do you do after you go straight?',opts:['Turn right','Turn left','Go upstairs','Go outside'],a:0,hint:'Listen for the word “Then.”'},
 {id:'h3',say:'Mateo goes downstairs. He has P.E. outside today.',q:'Where is Mateo’s P.E. class today?',opts:['Outside','Inside','Upstairs','In Room 318'],a:0,hint:'Listen to the second sentence again.'},
 {id:'h4',say:'Jun looks at the map. The star shows where you are.',q:'What does the star on the map show?',opts:['Where you are','Where the bell is','Where Room 318 is','Where the cafeteria is'],a:0,hint:'Listen for “The star shows ...”'}
];
/* ONE "why did...?" question (s3), as the standing rule asks for Ep 3 and later. */
var STORY=[
 {id:'s1',pic:'hallway',q:'What room does Linh need?',opts:['Room 318','Room 118','Room 214','Room 18'],a:0,hint:'Linh has science. Look at her schedule.'},
 {id:'s2',pic:'hallway',q:'Who does Linh ask first?',opts:['Paolo','Jun','Amira','Mateo'],a:0,hint:'She asks in the loud hallway.'},
 {id:'s3',pic:'rooms',q:'Why did Linh go to Room 118?',opts:['Paolo heard 118, not 318.','Linh wanted to go to art.','The map was wrong.','Linh was late for class.'],a:0,hint:'The hallway was very loud. What did Paolo hear?'},
 {id:'s4',pic:'rooms',q:'What does the 3 in Room 318 tell you?',opts:['The floor','The teacher','The time','The door'],a:0,hint:'Amira says, “It is on the third ...”'},
 {id:'s5',pic:'stairwell',q:'What does Jun use to help Linh?',opts:['A map','A phone','A schedule','A notebook'],a:0,hint:'Jun says, “The star is you.”'},
 {id:'s6',pic:'stairwell',q:'Where does Mateo go?',opts:['Downstairs and outside','Upstairs to Room 318','To the art room','To the science lab'],a:0,hint:'Mateo has P.E. today.'},
 {id:'s7',pic:'rooms',q:'Who is in Linh’s science class?',opts:['Paolo','Mateo','Amira','The art teacher'],a:0,hint:'Someone says, “You are in my science class?”'},
 {id:'s8',pic:'lab',q:'Is Linh late for science?',opts:['No. She is on time.','Yes. She is very late.','She misses the class.','She goes home.'],a:0,hint:'The bell rings. Where is Linh?'}
];
/* fix: words; errs = list of errors; each error = list of [wordIndex, accepted replacements] (any one fixes it).
   Every error is a WRONG word to change, never a missing word (T-265). ok = whole-sentence patterns that also count. */
var FIX=[
 {id:'f1',s:'Linh go straight.',errs:[[[1,['goes']]]],hint:'Look at the verb. Linh is one person.',ok:['^linh (goes|went|walks) straight$']},
 {id:'f2',s:'Room 318 is in the third floor.',errs:[[[3,['on']]]],hint:'We say on the first floor, on the second floor.',ok:['^room 318 is on the third floor$']},
 {id:'f3',s:'Jun look at the map.',errs:[[[1,['looks']]]],hint:'Look at the verb. Jun is one person.',ok:['^jun (looks|looked) at the map$']},
 {id:'f4',s:'Paolo heared 118.',errs:[[[1,['heard']]]],hint:'It already happened. The past of hear is not heared.',ok:['^paolo heard 118$']},
 {id:'f5',s:'Linh go throw the door.',errs:[[[1,['goes']]],[[2,['through']]]],hint:'Two errors. Linh is one person. And throw is what you do with a ball.',ok:['^linh (goes|went|walks) through the door$']},
 {id:'f6',s:'Mateo have P.E. inside today.',errs:[[[1,['has']]],[[3,['outside']]]],hint:'Two errors. Mateo is one person. And where is P.E. today?',ok:['^mateo (has|had) pe outside today$']}
];
var GRAM=[
 {id:'g1',q:'Room 318 is ___ the third floor.',opts:['on','in','at','to'],a:0,hint:'on the first floor, on the second floor'},
 {id:'g2',q:'First, go upstairs. ___, turn right.',opts:['Then','First','Because','Before'],a:0,hint:'This word comes after First.'},
 {id:'g3',q:'Linh ___ through the door.',opts:['goes','go','going','are go'],a:0,hint:'Linh is one person: she ___.'},
 {id:'g4',q:'Linh walks up the stairs. She goes ___.',opts:['upstairs','downstairs','outside','left'],a:0,hint:'Up the stairs = ___stairs.'}
];
/* extensions. PLACES = the order cards: [background, sentence]. Same shape as Ep 2-4, so the dashboard reads it the same way. */
var PLACES=[['hallway','Linh asks Paolo how to get to Room 318.'],['rooms','Linh finds Room 118. It is the art room.'],['stairwell','Jun shows Linh the school map.'],['stairwell','Linh goes upstairs. Mateo goes downstairs.'],['lab','Linh finds Room 318. She is on time.']];
var CHARS=['jun','mateo','amira','linh','paolo'];
var FACTS=[
 ['needs Room 318',['linh']],['goes to the wrong room first',['linh']],['goes upstairs to the third floor',['linh']],['has science in Room 318',['linh','paolo']],['is from Vietnam',['linh']],
 ['heard 118, not 318',['paolo']],['says sorry to Linh',['paolo']],['has wavy brown hair',['paolo']],['is from the Philippines',['paolo']],
 ['is in the art room',['amira']],['says Room 318 is upstairs',['amira']],['wears a hijab',['amira']],['is from Yemen',['amira']],
 ['has a school map',['jun']],['says the star is you',['jun']],['has glasses',['jun']],['is from China',['jun']],
 ['goes downstairs and outside',['mateo']],['has P.E. today',['mateo']],['is tall',['mateo']],['is from Guatemala',['mateo']]
];
var PAIRS=[
 {id:'lm',a:'linh',b:'mateo',chips:[['goes upstairs','a'],['has science','a'],['goes downstairs','b'],['has P.E. outside','b'],['is on the stairs','both'],['is in the ELD class','both']]},
 {id:'pj',a:'paolo',b:'jun',chips:[['heard the wrong number','a'],['says sorry','a'],['has a map','b'],['says the star is you','b'],['helps Linh','both'],['is in the ELD class','both']]},
 {id:'la',a:'linh',b:'amira',chips:[['needs Room 318','a'],['is from Vietnam','a'],['is in the art room','b'],['wears a hijab','b'],['is on the first floor','both'],['talks about Room 318','both']]},
 {id:'pa',a:'paolo',b:'amira',chips:[['gives directions to Room 118','a'],['is in the science class','a'],['says Room 318 is upstairs','b'],['is in the art room','b'],['talks to Linh','both'],['knows the school','both']]}
];
var CAST_NAME={jun:'Jun',mateo:'Mateo',amira:'Amira',linh:'Linh',paolo:'Paolo'};
/* summary auto-check (0-4): order words, the problem, the places, the ending */
function sumCheck(s){ var why=[];
 if(['first','then','next','finally'].filter(function(w){return new RegExp('\\b'+w+'\\b').test(s);}).length>=3) why.push('order words');
 if(/(linh|she)/.test(s)&&/(318|lost|where|find|wrong room|does not know|doesn.?t know)/.test(s)) why.push('the problem');
 if(['118','art','stairs','map','upstairs','third floor','science','star'].filter(function(w){return s.indexOf(w)>=0;}).length>=3) why.push('places');
 if(/(found|finds|on time|in time)/.test(s)) why.push('the ending');
 return why; }

var SECTIONS=[
 {k:'read',t:'1. Read aloud',n:READ.length,pic:'readpic',dir:'Read each sentence out loud. Tap Record, read, then tap Stop. There is no help on this part.'},
 {k:'words',t:'2. Words',n:12,pic:'dup',dir:'Look at the picture or the word. Choose the right answer.'},
 {k:'listen',t:'3. Listen',n:LETTERS.length+DICT.length+LISTEN.length,pic:'ear',dir:'Tap the play button. Listen. Then type or choose your answer.'},
 {k:'story',t:'4. Story questions',n:STORY.length,pic:'stairwell',dir:'Answer the questions about the story. Tap a word to see it in your language.'},
 {k:'fix',t:'5. Fix the sentence',n:FIX.length,pic:'board',dir:'Each sentence has a mistake. Tap the wrong word and type the right word. Then tap Check.'},
 {k:'gram',t:'6. Grammar',n:GRAM.length,pic:'schoolmap',dir:'Choose the word that completes the sentence.'}
];
var EXTS=[
 {k:'order',t:'A. What happened?',pic:'map',dir:'Put the story in order. Tap a card, then tap a number.'},
 {k:'summary',t:'B. Write a summary',pic:'notebook',dir:'Write a summary of the story. Use First, Then, Next, and Finally.'},
 {k:'describe',t:'C. Describe a character',pic:'cast',dir:'Choose one character. Tap the sentences that are true about that character. Then write about the character.'},
 {k:'compare',t:'D. Compare two characters',pic:'pair',dir:'Choose two characters. Put each sentence in the right circle. Then write one sentence with both and but.'},
 {k:'retell',t:'E. Tell the story',pic:'mic',dir:'Tell the story out loud in your own words. You can talk for up to 90 seconds. There is no text to read.'},
 {k:'talk',t:'F. Give directions',pic:'talk',dir:'Answer out loud: How do you get from our classroom to the cafeteria? Use First, Then, go and turn.'}
];
