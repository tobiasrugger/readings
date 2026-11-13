/* content.js — Story Check 4: What's for Lunch Today? (T-379). Shared by the student page (index.html) and the teacher page (dashboard.html).
   Item ids are permanent: never reuse or renumber one (saved answers are keyed by id).
   The Episode 5 teaser (Linh: "Room 318? Upstairs or downstairs?") is kept out of every item. */
var CFG={
 ep:'ep04', num:4, title:'What\u2019s for Lunch Today?', sort:630,
 skills:['reading-aloud','listening','vocabulary','comprehension','sequence-words','a-an'],
 intro:{bg:'lunchline',chars:[{id:'linh',x:520,face:1,expr:'surprised',hold:'tray'},{id:'amira',x:860,face:-1,expr:'happy',pose:'point'},{id:'mateo',x:1150,face:-1,expr:'happy',hold:'tray'}]},
 board:['They','is','They are'],
 orderAsk:'What are the steps for lunch? Put the five steps in order, from first to last.',
 orderHint:'First, wait in line. What is next?',
 sumAsk:'Write 4 or 5 sentences. Tell the steps for lunch, and what Linh forgets. Use First, Then, Also, Next, and Finally.',
 sumStart:'First, ___. Then, ___. Also, ___. Next, ___. Finally, ___.',
 retell:{prompt:'Tell the story of Episode 4. What are the steps for lunch? What does Linh forget? Use First, Then, and Finally.',keys:['first','then','also','next','finally','line','tray','napkin','fork','food','seat','table','clean','drink','forgot']},
 talk:{prompt:'What do you eat for lunch? Where did you eat lunch in your country? Say two or three sentences.',keys:['eat','lunch','rice','pizza','salad','home','school','family','chicken','beans','soup','noodles','bread'],must:'\\b(eat|ate)\\b',scene:{bg:'cafeteria',chars:[{id:'linh',x:800,face:1,expr:'happy',hold:'tray'}]}}
};
/* Read aloud: 8 lines from the episode (Level A, scenes 0-4; scene 5 is the teaser) + 2 new sentences built from its words. */
var READ=[
 {id:'r1',scene:0,t:'The bell rings. It is 12:05. It is lunch time.'},
 {id:'r2',scene:0,t:'Linh is new. She does not know the steps.'},
 {id:'r3',scene:1,t:'First, they wait in line. The line is long.'},
 {id:'r4',scene:1,t:'Also, take a napkin, a fork, and a spoon.'},
 {id:'r5',scene:2,t:'Your drink! You forgot a drink.'},
 {id:'r6',scene:3,t:'Then, they look for a seat. The cafeteria is full.'},
 {id:'r7',scene:4,t:'In Vietnam, I eat lunch at home. I eat rice.'},
 {id:'r8',scene:4,t:'After they eat, they clean up the table.'},
 {id:'r9',isNew:true,custom:{bg:'lunchline',chars:[{id:'jun',x:800,face:1,expr:'smile',hold:'tray'}]},t:'Jun takes a tray. Then, he chooses salad and milk.'},
 {id:'r10',isNew:true,custom:{bg:'cafeteria',chars:[{id:'paolo',x:640,face:1,expr:'happy',hold:'tray'},{id:'mateo',x:960,face:-1,expr:'smile'}]},t:'Paolo finds an empty table. Finally, they clean up together.'}
];
var WORDS_PIC=[
 {id:'w1',pic:'bigtray',a:'tray',opts:['tray','plate','table','napkin'],hint:'You put your food on it and carry it.'},
 {id:'w2',pic:'fork',a:'fork',opts:['fork','spoon','knife','pencil'],hint:'You eat salad with it. It has points.'},
 {id:'w3',pic:'napkin',a:'napkin',opts:['napkin','paper','notebook','tray'],hint:'You clean your hands and mouth with it.'},
 {id:'w4',pic:'milk',a:'milk',opts:['milk','juice','water','rice'],hint:'Jun chooses this drink. It is white.'},
 {id:'w5',pic:'pizza',a:'pizza',opts:['pizza','salad','rice','apple'],hint:'Mateo always chooses it.'},
 {id:'w6',pic:'cafeteria',a:'cafeteria',opts:['cafeteria','library','gym','classroom'],hint:'Students eat lunch here.'}
];
var WORDS_LANG=[
 {id:'w7',w:'wait',ctx:'First, they wait in line.',def:'stay until it is your turn'},
 {id:'w8',w:'choose',ctx:'Next, choose your food!',def:'pick one'},
 {id:'w9',w:'empty',ctx:'Look! This table is empty.',def:'nothing and nobody in it'},
 {id:'w10',w:'full',ctx:'The cafeteria is full.',def:'no more room'},
 {id:'w11',w:'delicious',ctx:'This food is delicious!',def:'it tastes very good'},
 {id:'w12',w:'clean',ctx:'Finally, clean up the table.',def:'make it not dirty'}
];
var LETTERS=[
 /* say = what the dashboard shows; ear = what the voice says, ONE LETTER PER UTTERANCE with a pause between.
    O and L get their own items before PAOLO because they sound alike (as in Ep 2). */
 {id:'l1',say:'K',ear:['K.'],a:['k'],kind:'letter'},
 {id:'l2',say:'W',ear:['double you.'],a:['w'],kind:'letter'},
 {id:'l3',say:'U',ear:['you.'],a:['u'],kind:'letter'},
 {id:'l4',say:'O',ear:['oh.'],a:['o'],kind:'letter'},
 {id:'l5',say:'L',ear:['L.'],a:['l'],kind:'letter'},
 {id:'l6',say:'P-A-O-L-O',ear:['P.','A.','oh.','L.','oh.'],a:['paolo'],kind:'name',n:5}
];
var DICT=[
 {id:'d1',w:'tray',sent:'Then, take a tray.'},
 {id:'d2',w:'line',sent:'First, they wait in line.'},
 {id:'d3',w:'fork',sent:'Take a napkin, a fork, and a spoon.'},
 {id:'d4',w:'drink',sent:'You forgot a drink.'},
 {id:'d5',w:'empty',sent:'This table is empty.'}
];
var LISTEN=[
 {id:'h1',say:'First, wait in line. Then, take a tray.',q:'What do you do first?',opts:['Wait in line','Take a tray','Choose your food','Clean up'],a:0,hint:'Listen for the word \u201cFirst.\u201d'},
 {id:'h2',say:'Jun chooses salad and milk. Linh chooses rice and beans.',q:'What does Linh choose?',opts:['Rice and beans','Salad and milk','Pizza','An apple'],a:0,hint:'Listen to the second sentence again.'},
 {id:'h3',say:'The cafeteria is full. There are no empty seats.',q:'Why is it hard to find a seat?',opts:['The cafeteria is full.','The cafeteria is empty.','The tables are dirty.','Lunch is over.'],a:0,hint:'Listen to the first sentence.'},
 {id:'h4',say:'In Guatemala, Mateo eats lunch at home with his family.',q:'Where does Mateo eat lunch in Guatemala?',opts:['At home','At school','In a cafeteria','At a restaurant'],a:0,hint:'Listen for the word after \u201cat.\u201d'}
];
/* ONE "why did...?" question (s4), as the standing rule asks for Ep 3 and later. */
var STORY=[
 {id:'s1',pic:'hallway',q:'What is Linh\u2019s problem at the start?',opts:['She does not know the steps for lunch.','She cannot find her schedule.','She is not hungry.','She does not like pizza.'],a:0,hint:'Linh is new. She asks, \u201cWhat do I do first?\u201d'},
 {id:'s2',pic:'lunchline',q:'What is the first step?',opts:['Wait in line.','Take a tray.','Choose your food.','Find a seat.'],a:0,hint:'Listen for the word \u201cFirst.\u201d'},
 {id:'s3',pic:'lunchline',q:'What do you take with your tray?',opts:['A napkin, a fork, and a spoon','A pencil and a notebook','A drink and a book','A schedule'],a:0,hint:'Amira says, \u201cAlso, take ...\u201d'},
 {id:'s4',pic:'lunchline',q:'Why did Amira call Linh back?',opts:['Linh forgot a drink.','Linh took the wrong tray.','Linh forgot her schedule.','Linh was late for class.'],a:0,hint:'Amira says, \u201cYour drink!\u201d'},
 {id:'s5',pic:'cafeteria',q:'Who finds an empty table?',opts:['Paolo','Mateo','Jun','Linh'],a:0,hint:'He says, \u201cLook! This table is empty.\u201d'},
 {id:'s6',pic:'cafeteria',q:'Where does Linh eat lunch in Vietnam?',opts:['At home','At school','In a cafeteria','At a friend\u2019s house'],a:0,hint:'Linh says, \u201cIn Vietnam, I eat lunch ...\u201d'},
 {id:'s7',pic:'cafeteria',q:'What is the last step?',opts:['Clean up the table.','Wait in line.','Take a tray.','Choose your food.'],a:0,hint:'Jun says, \u201cFinally, ...\u201d'},
 {id:'s8',pic:'cafeteria',q:'Which word tells the last step?',opts:['Finally','First','Then','Also'],a:0,hint:'This word comes at the end.'}
];
/* fix: words; errs = list of errors; each error = list of [wordIndex, accepted replacements] (any one fixes it).
   Every error is a WRONG word to change, never a missing word (T-265). ok = whole-sentence patterns that also count. */
var FIX=[
 {id:'f1',s:'Linh have a tray.',errs:[[[1,['has']]]],hint:'Look at the verb. Linh is one person.',ok:['^linh (has|had|takes|took) a tray$']},
 {id:'f2',s:'First, wait on line.',errs:[[[2,['in']]]],hint:'We wait in line.',ok:['^first wait in (line|the line)$']},
 {id:'f3',s:'Take a napkin, a fork, and a apple.',errs:[[[6,['an']]]],hint:'Apple starts with a vowel sound: a, e, i, o, u.',ok:['^take a napkin a fork and (an|one) apple$']},
 {id:'f4',s:'Mateo choose pizza every day.',errs:[[[1,['chooses']]]],hint:'Mateo is one person: he ___.',ok:['^mateo (chooses|chose|eats|ate|likes|gets|takes) pizza every day$']},
 {id:'f5',s:'Jun and Amira takes two tray.',errs:[[[3,['take']]],[[5,['trays']]]],hint:'Two errors. Jun and Amira are two people. Two means more than one.',ok:['^jun and amira (take|took|have|had|carry) two trays$']},
 {id:'f6',s:'Linh forget her drink in the lunch lines.',errs:[[[1,['forgot']]],[[7,['line']]]],hint:'Two errors. It already happened (past). And there is one lunch line.',ok:['^linh forgot (her|a|the) drink in the lunch line$']}
];
var GRAM=[
 {id:'g1',q:'___, wait in line. Then, take a tray.',opts:['First','Finally','Also','After'],a:0,hint:'This is the first step.'},
 {id:'g2',q:'Take a tray. ___, take a napkin and a fork.',opts:['Also','First','Finally','Before'],a:0,hint:'This word adds one more thing.'},
 {id:'g3',q:'Linh ___ rice and beans.',opts:['chooses','choose','choosing','are choose'],a:0,hint:'Linh is one person: she ___.'},
 {id:'g4',q:'Jun takes ___ apple.',opts:['an','a','two','many'],a:0,hint:'Apple starts with a vowel sound.'}
];
/* extensions. PLACES = the order cards: [background, sentence]. Same shape as Ep 2, so the dashboard reads it the same way. */
var PLACES=[['lunchline','Wait in line.'],['lunchline','Take a tray.'],['lunchline','Choose your food.'],['cafeteria','Find a seat and sit down.'],['cafeteria','Clean up the table.']];
var CHARS=['jun','mateo','amira','linh','paolo'];
var FACTS=[
 ['is new at the school',['linh']],['forgot a drink',['linh']],['chooses rice and beans',['linh']],['eats lunch at home in Vietnam',['linh']],['is from Vietnam',['linh']],
 ['is very hungry',['mateo']],['always chooses pizza',['mateo']],['forgot to clean up',['mateo']],['is from Guatemala',['mateo']],
 ['knows the steps',['amira']],['helps Linh',['amira']],['wears a hijab',['amira']],['is from Yemen',['amira']],
 ['chooses salad and milk',['jun']],['has glasses',['jun']],['says the food is delicious',['jun']],['is from China',['jun']],
 ['finds an empty table',['paolo']],['has wavy brown hair',['paolo']],['is from the Philippines',['paolo']],['is playful',['paolo']]
];
var PAIRS=[
 {id:'la',a:'linh',b:'amira',chips:[['is new at the school','a'],['forgot a drink','a'],['knows the steps','b'],['wears a hijab','b'],['waits in line','both'],['takes a tray','both']]},
 {id:'mj',a:'mateo',b:'jun',chips:[['always chooses pizza','a'],['forgot to clean up','a'],['chooses salad and milk','b'],['has glasses','b'],['eats in the cafeteria','both'],['sits at the empty table','both']]},
 {id:'lm',a:'linh',b:'mateo',chips:[['chooses rice and beans','a'],['is from Vietnam','a'],['always chooses pizza','b'],['is from Guatemala','b'],['forgot something','both'],['ate lunch at home in his or her country','both']]},
 {id:'pa',a:'paolo',b:'amira',chips:[['finds an empty table','a'],['is from the Philippines','a'],['helps Linh','b'],['is from Yemen','b'],['eats in the cafeteria','both'],['takes a tray','both']]}
];
var CAST_NAME={jun:'Jun',mateo:'Mateo',amira:'Amira',linh:'Linh',paolo:'Paolo'};
/* summary auto-check (0-4): order words, the problem, the steps, the ending */
function sumCheck(s){ var why=[];
 if(['first','then','also','next','finally'].filter(function(w){return new RegExp('\\b'+w+'\\b').test(s);}).length>=3) why.push('order words');
 if(/(linh|she)/.test(s)&&/(new|don.?t know|doesn.?t know|does not know|steps)/.test(s)) why.push('the problem');
 if(['line','tray','napkin','fork','choose','food','seat','table','clean'].filter(function(w){return s.indexOf(w)>=0;}).length>=3) why.push('steps');
 if(/(drink|forgot|forget|clean)/.test(s)) why.push('the ending');
 return why; }

var SECTIONS=[
 {k:'read',t:'1. Read aloud',n:READ.length,pic:'readpic',dir:'Read each sentence out loud. Tap Record, read, then tap Stop. There is no help on this part.'},
 {k:'words',t:'2. Words',n:12,pic:'bigtray',dir:'Look at the picture or the word. Choose the right answer.'},
 {k:'listen',t:'3. Listen',n:LETTERS.length+DICT.length+LISTEN.length,pic:'ear',dir:'Tap the play button. Listen. Then type or choose your answer.'},
 {k:'story',t:'4. Story questions',n:STORY.length,pic:'lunchline',dir:'Answer the questions about the story. Tap a word to see it in your language.'},
 {k:'fix',t:'5. Fix the sentence',n:FIX.length,pic:'board',dir:'Each sentence has a mistake. Tap the wrong word and type the right word. Then tap Check.'},
 {k:'gram',t:'6. Grammar',n:GRAM.length,pic:'steps',dir:'Choose the word that completes the sentence.'}
];
var EXTS=[
 {k:'order',t:'A. The steps for lunch',pic:'map',dir:'Put the steps in order. Tap a card, then tap a number.'},
 {k:'summary',t:'B. Write a summary',pic:'notebook',dir:'Write a summary of the story. Use First, Then, Also, Next, and Finally.'},
 {k:'describe',t:'C. Describe a character',pic:'cast',dir:'Choose one character. Tap the sentences that are true about that character. Then write about the character.'},
 {k:'compare',t:'D. Compare two characters',pic:'pair',dir:'Choose two characters. Put each sentence in the right circle. Then write one sentence with both and but.'},
 {k:'retell',t:'E. Tell the story',pic:'mic',dir:'Tell the story out loud in your own words. You can talk for up to 90 seconds. There is no text to read.'},
 {k:'talk',t:'F. Your lunch',pic:'talk',dir:'Answer out loud: What do you eat for lunch? Where did you eat lunch in your country?'}
];
