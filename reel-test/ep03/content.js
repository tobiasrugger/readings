/* content.js — Story Check 3: What Class Do We Have Now? (T-379). Shared by the student page (index.html) and the teacher page (dashboard.html).
   Item ids are permanent: never reuse or renumber one (saved answers are keyed by id).
   The Episode 4 teaser (Mateo: "What's for lunch today?") is kept out of every item. */
var CFG={
 ep:'ep03', num:3, title:'What Class Do We Have Now?', sort:620,
 skills:['reading-aloud','listening','vocabulary','comprehension','prepositions-of-time','school-subjects'],
 intro:{bg:'lab',chars:[{id:'mateo',x:600,face:1,expr:'surprised',hold:'schedule'},{id:'linh',x:960,face:-1,expr:'smile',hold:'notebook'},{id:'jun',x:1180,face:-1,expr:'smile'}]},
 board:['Amira','draw','Amira draws'],
 orderAsk:'What happens in the story? Put the five events in order, from first to last.',
 orderHint:'First, the bell rings in the hallway. What is next?',
 sumAsk:'Write 4 or 5 sentences. Tell Mateo\u2019s problem, where he goes, and how it ends. Use First, Then, Next, and Finally.',
 sumStart:'Mateo does not know ___. First, he goes to ___. Then, ___. Next, ___. Finally, ___.',
 retell:{prompt:'Tell the story of Episode 3. What is Mateo\u2019s problem? Where does he go? How does it end?',keys:['schedule','science','lab','gym','monday','tuesday','paolo','amira','favorite','art','math','music','wrong','morning','class']},
 talk:{prompt:'What is your favorite subject? Why? Say two or three sentences. Use My favorite subject is ___ because ___.',keys:['math','science','art','music','english','history','social','sports','draw','because','like','favorite'],must:'\\bbecause\\b',scene:{bg:'art',chars:[{id:'amira',x:800,face:1,expr:'happy',hold:'sketchbook'}]}}
};
/* Read aloud: 8 lines from the episode (Level A, every scene) + 2 new sentences built from its words. */
var READ=[
 {id:'r1',scene:0,t:'The bell rings. It is 10:15 in the morning.'},
 {id:'r2',scene:0,t:'Every student has a schedule. A schedule tells you when you have each class.'},
 {id:'r3',scene:1,t:'I have math. I have math on Tuesday at 10:20.'},
 {id:'r4',scene:2,t:'Mateo opens the door of the science lab.'},
 {id:'r5',scene:2,t:'Oh no. That is Monday. Today is Tuesday!'},
 {id:'r6',scene:3,t:'Mateo has P.E. on Tuesday and Thursday in the morning.'},
 {id:'r7',scene:4,t:'My favorite subject is art because I like to draw.'},
 {id:'r8',scene:5,t:'I have music after lunch. Music is my favorite because I like to play the piano.'},
 {id:'r9',isNew:true,custom:{bg:'lab',chars:[{id:'linh',x:800,face:1,expr:'smile',hold:'notebook'}]},t:'Linh has science in Room 214. She likes to do experiments.'},
 {id:'r10',isNew:true,custom:{bg:'classroom',chars:[{id:'paolo',x:800,face:1,expr:'happy'}]},t:'Paolo has math before lunch. He has social studies after lunch.'}
];
var WORDS_PIC=[
 {id:'w1',pic:'sched',a:'schedule',opts:['schedule','notebook','calculator','sketchbook'],hint:'It tells you when you have each class.'},
 {id:'w2',pic:'bell',a:'bell',opts:['bell','clock','phone','door'],hint:'It rings. Then class starts.'},
 {id:'w3',pic:'lab',a:'science lab',opts:['science lab','art room','gym','cafeteria'],hint:'Linh and Jun do experiments here.'},
 {id:'w4',pic:'art',a:'art room',opts:['art room','science lab','library','gym'],hint:'Amira draws here.'},
 {id:'w5',pic:'gym',a:'gym',opts:['gym','classroom','art room','library'],hint:'Mateo has P.E. here.'},
 {id:'w6',pic:'piano',a:'music',opts:['music','math','art','science'],hint:'Jun likes to play the piano in this class.'}
];
var WORDS_LANG=[
 {id:'w7',w:'favorite',ctx:'P.E. is my favorite class!',def:'the one you like best'},
 {id:'w8',w:'different',ctx:'Every student has a different schedule.',def:'not the same'},
 {id:'w9',w:'subject',ctx:'My favorite subject is art.',def:'a class you study, like math or art'},
 {id:'w10',w:'late',ctx:'Come on, we\u2019re late!',def:'after the right time'},
 {id:'w11',w:'because',ctx:'My favorite subject is art because I like to draw.',def:'for this reason'},
 {id:'w12',w:'wrong',ctx:'Mateo goes to the wrong room.',def:'not right; not correct'}
];
var LETTERS=[
 /* say = what the dashboard shows; ear = what the voice says, ONE LETTER PER UTTERANCE with a pause between. */
 {id:'l1',say:'P',ear:['P.'],a:['p'],kind:'letter'},
 {id:'l2',say:'R',ear:['R.'],a:['r'],kind:'letter'},
 {id:'l3',say:'I',ear:['eye.'],a:['i'],kind:'letter'},
 {id:'l4',say:'H',ear:['H.'],a:['h'],kind:'letter'},
 {id:'l5',say:'A-M-I-R-A',ear:['A.','M.','eye.','R.','A.'],a:['amira'],kind:'name',n:5},
 {id:'l6',say:'J-U-N',ear:['J.','you.','N.'],a:['jun'],kind:'name',n:3}
];
var DICT=[
 {id:'d1',w:'science',sent:'I have science now.'},
 {id:'d2',w:'Tuesday',sent:'Today is Tuesday!'},
 {id:'d3',w:'morning',sent:'It is 10:15 in the morning.'},
 {id:'d4',w:'favorite',sent:'P.E. is my favorite class!'},
 {id:'d5',w:'schedule',sent:'Look at your schedule again.'}
];
var LISTEN=[
 {id:'h1',say:'Linh has science in Room 214.',q:'What room is Linh\u2019s science class in?',opts:['Room 214','Room 241','Room 204','Room 124'],a:0,hint:'Listen for the number after \u201cRoom.\u201d'},
 {id:'h2',say:'Mateo has P.E. on Tuesday and Thursday.',q:'When does Mateo have P.E.?',opts:['On Tuesday and Thursday','On Monday and Friday','On Tuesday and Wednesday','Every day'],a:0,hint:'There are two days. Listen for both.'},
 {id:'h3',say:'Paolo has math in the morning. He has social studies in the afternoon.',q:'When does Paolo have social studies?',opts:['In the afternoon','In the morning','Before lunch','On Monday'],a:0,hint:'Listen to the second sentence again.'},
 {id:'h4',say:'Jun has music after lunch. He likes to play the piano.',q:'What does Jun like to do?',opts:['Play the piano','Draw','Do experiments','Play sports'],a:0,hint:'Listen for the word after \u201clikes to.\u201d'}
];
/* ONE "why did...?" question (s4), as the standing rule asks for Ep 3 and later. */
var STORY=[
 {id:'s1',pic:'hallway',q:'What is Mateo\u2019s problem?',opts:['He does not know which class he has.','He is hungry.','He cannot find his backpack.','He does not have a schedule.'],a:0,hint:'The bell rings. Mateo says, \u201cI don\u2019t know!\u201d'},
 {id:'s2',pic:'classroom',q:'Who helps Mateo first?',opts:['Paolo','Linh','Jun','Amira'],a:0,hint:'Mateo goes back to the ELD classroom. Who is there?'},
 {id:'s3',pic:'classroom',q:'When does Paolo have math?',opts:['On Tuesday at 10:20','On Monday at 10:15','On Friday after lunch','On Thursday in the afternoon'],a:0,hint:'Paolo says the day and the time.'},
 {id:'s4',pic:'lab',q:'Why did Mateo go to the science lab?',opts:['He read the Monday line on his schedule.','He likes to do experiments.','Linh asked him to come.','He has science every day.'],a:0,hint:'Mateo says, \u201cThat is Monday. Today is Tuesday!\u201d'},
 {id:'s5',pic:'gym',q:'Where is Mateo\u2019s class on Tuesday at 10:20?',opts:['In the gym','In the science lab','In the art room','In the ELD classroom'],a:0,hint:'Amira reads his schedule. He has P.E.'},
 {id:'s6',pic:'art',q:'What is Amira\u2019s favorite subject?',opts:['Art','Science','Music','P.E.'],a:0,hint:'She says, \u201cI like to draw.\u201d'},
 {id:'s7',pic:'lab',q:'Why is science Linh\u2019s favorite subject?',opts:['She likes to do experiments.','She likes to draw.','She likes to play sports.','She likes to play the piano.'],a:0,hint:'Linh talks to Amira in the art room. Listen for \u201cbecause.\u201d'},
 {id:'s8',pic:'classroom',q:'What is the same for all five friends?',opts:['They have lunch at the same time.','They have the same schedule.','They have the same favorite subject.','They have P.E. on Tuesday.'],a:0,hint:'Everyone has a different schedule. But ...'}
];
/* fix: words; errs = list of errors; each error = list of [wordIndex, accepted replacements] (any one fixes it).
   Every error is a WRONG word to change, never a missing word (T-265). ok = whole-sentence patterns that also count. */
var FIX=[
 {id:'f1',s:'Mateo have P.E. on Tuesday.',errs:[[[1,['has']]]],hint:'Look at the verb. Mateo is one person.',ok:['^mateo (has|had) pe on (tuesday|thursday|tuesday and thursday)$']},
 {id:'f2',s:'I have math in Tuesday.',errs:[[[3,['on']]]],hint:'Days take on: on Monday, on Tuesday.',ok:['^i (have|had) math on (monday|tuesday|wednesday|thursday|friday)$']},
 {id:'f3',s:'The bell rings on 10:15.',errs:[[[3,['at']]]],hint:'A time takes at: at 10:15.',ok:['^the bell (rings|rang) at 1015$']},
 {id:'f4',s:'Paolo has social studies at the afternoon.',errs:[[[4,['in']]]],hint:'In the morning, in the afternoon.',ok:['^paolo (has|had) social studies in the (afternoon|morning)$']},
 {id:'f5',s:'My favorite subject are art because I likes to draw.',errs:[[[3,['is']]],[[7,['like','love']]]],hint:'Two errors. My favorite subject is one thing. And after I, use like.',ok:['^my favorite subject is art because i (like|love) to draw$']},
 {id:'f6',s:'Everyone have lunch at the different time.',errs:[[[1,['has','eats']]],[[5,['same']]]],hint:'Two errors. Everyone takes has. And the friends all eat together.',ok:['^everyone (has|had|eats|ate) lunch at the same time$']}
];
var GRAM=[
 {id:'g1',q:'I have math ___ Tuesday.',opts:['on','at','in','to'],a:0,hint:'Days take on.'},
 {id:'g2',q:'Mateo has P.E. ___ 10:20.',opts:['at','on','in','to'],a:0,hint:'A time takes at.'},
 {id:'g3',q:'Jun has music ___ the afternoon.',opts:['in','on','at','to'],a:0,hint:'In the morning, in the afternoon.'},
 {id:'g4',q:'Art is my favorite subject ___ I like to draw.',opts:['because','but','so','or'],a:0,hint:'This word tells the reason.'}
];
/* extensions. PLACES = the order cards: [background, sentence]. Same shape as Ep 2, so the dashboard reads it the same way. */
var PLACES=[['hallway','The bell rings. Mateo does not know his class.'],['classroom','Paolo helps Mateo read his schedule.'],['lab','Mateo opens the door of the science lab.'],['gym','Amira takes Mateo to the gym.'],['art','Linh and Amira talk about their favorite subjects.']];
var CHARS=['jun','mateo','amira','linh','paolo'];
var FACTS=[
 ['is short',['linh']],['has long, straight, black hair',['linh']],['is from Vietnam',['linh']],['has science in Room 214',['linh']],['likes to do experiments',['linh']],
 ['is tall',['mateo']],['is from Guatemala',['mateo']],['has P.E. on Tuesday and Thursday',['mateo']],['goes to the wrong room',['mateo']],['loves P.E.',['mateo']],
 ['wears a hijab',['amira']],['is from Yemen',['amira']],['draws every day',['amira']],['has art in the afternoon',['amira']],['helps Mateo',['amira','paolo']],
 ['has glasses',['jun']],['is from China',['jun']],['plays the piano',['jun']],['has music after lunch',['jun']],['has science with Linh',['jun']],
 ['has wavy brown hair',['paolo']],['is from the Philippines',['paolo']],['has math on Tuesday at 10:20',['paolo']],['has social studies in the afternoon',['paolo']]
];
var PAIRS=[
 {id:'ma',a:'mateo',b:'amira',chips:[['loves P.E.','a'],['goes to the wrong room','a'],['wears a hijab','b'],['loves art','b'],['has a schedule','both'],['is in the ELD class','both']]},
 {id:'lj',a:'linh',b:'jun',chips:[['likes to do experiments','a'],['is from Vietnam','a'],['has glasses','b'],['plays the piano','b'],['has science in the morning','both'],['is in the ELD class','both']]},
 {id:'al',a:'amira',b:'linh',chips:[['wears a hijab','a'],['loves art','a'],['loves science','b'],['is from Vietnam','b'],['is in the art room in the afternoon','both'],['has a favorite subject','both']]},
 {id:'mp',a:'mateo',b:'paolo',chips:[['is tall','a'],['has P.E. at 10:20','a'],['has math at 10:20','b'],['has wavy brown hair','b'],['has a class at 10:20','both'],['is in the ELD class','both']]}
];
var CAST_NAME={jun:'Jun',mateo:'Mateo',amira:'Amira',linh:'Linh',paolo:'Paolo'};
/* summary auto-check (0-4): order words, the problem, the places, the ending */
function sumCheck(s){ var why=[];
 if(['first','then','next','finally'].filter(function(w){return new RegExp('\\b'+w+'\\b').test(s);}).length>=3) why.push('order words');
 if(/mateo|he /.test(s)&&/(don.?t know|doesn.?t know|does not know|not know|wrong|which class|confused|forgot)/.test(s)) why.push('the problem');
 if(['classroom','lab','science','gym','art'].filter(function(w){return s.indexOf(w)>=0;}).length>=3) why.push('places');
 if(/(gym|p\.?\s?e\b|favorite|knows? (his|the|my) schedule|tuesday)/.test(s)) why.push('the ending');
 return why; }

var SECTIONS=[
 {k:'read',t:'1. Read aloud',n:READ.length,pic:'readpic',dir:'Read each sentence out loud. Tap Record, read, then tap Stop. There is no help on this part.'},
 {k:'words',t:'2. Words',n:12,pic:'sched',dir:'Look at the picture or the word. Choose the right answer.'},
 {k:'listen',t:'3. Listen',n:LETTERS.length+DICT.length+LISTEN.length,pic:'ear',dir:'Tap the play button. Listen. Then type or choose your answer.'},
 {k:'story',t:'4. Story questions',n:STORY.length,pic:'lab',dir:'Answer the questions about the story. Tap a word to see it in your language.'},
 {k:'fix',t:'5. Fix the sentence',n:FIX.length,pic:'board',dir:'Each sentence has a mistake. Tap the wrong word and type the right word. Then tap Check.'},
 {k:'gram',t:'6. Grammar',n:GRAM.length,pic:'clock',dir:'Choose the word that completes the sentence.'}
];
var EXTS=[
 {k:'order',t:'A. What happened?',pic:'map',dir:'Put the story in order. Tap a card, then tap a number.'},
 {k:'summary',t:'B. Write a summary',pic:'notebook',dir:'Write a summary of the story. Use First, Then, Next, and Finally.'},
 {k:'describe',t:'C. Describe a character',pic:'cast',dir:'Choose one character. Tap the sentences that are true about that character. Then write about the character.'},
 {k:'compare',t:'D. Compare two characters',pic:'pair',dir:'Choose two characters. Put each sentence in the right circle. Then write one sentence with both and but.'},
 {k:'retell',t:'E. Tell the story',pic:'mic',dir:'Tell the story out loud in your own words. You can talk for up to 90 seconds. There is no text to read.'},
 {k:'talk',t:'F. Your favorite subject',pic:'talk',dir:'Answer out loud: What is your favorite subject? Why? Use because.'}
];
