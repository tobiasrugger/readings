/* Daily Basics · STRETCH (T-307, Nov 2026) — page 2 of every set: 8 harder, still-quick items.
   Same Unit 1 world as the Warm-up (school people and places, names, letters, numbers, countries).
   Every item has d = 1 (easier) · 2 · 3 (harder). Level A takes d1–2, B d2, C d2–3.
   t = lesson tag (?lesson=u1-l3 puts those first). One clearly right answer per item.
   Types:  fix   = find the wrong word, then choose the right one
           mc    = choose (has/have, join two sentences, reading questions)
           tiles = put the words in order (make a question / unscramble)
           type  = write the word (one blank per letter)
   Used by basics/index.html (tap-through) and basics/print/ (paper). */
(function(){
var Q='\u2019';
var S={
 fix:[
  {d:1,s:'She are a nurse.',bad:'are',good:'is',o:['is','am'],h:'One woman \u2192 is.'},
  {d:1,s:'I is a student.',bad:'is',good:'am',o:['am','are'],h:'I \u2192 am.'},
  {d:1,s:'They is in the gym.',bad:'is',good:'are',o:['are','am'],h:'Two or more people \u2192 are.'},
  {d:1,s:'He am the coach.',bad:'am',good:'is',o:['is','are'],h:'One man \u2192 is.'},
  {d:1,s:'We is from Guatemala.',bad:'is',good:'are',o:['are','am'],h:'We \u2192 are.',t:'u1-l5'},
  {d:2,s:'Jun have a red backpack.',bad:'have',good:'has',o:['has','is'],h:'He, she, one person \u2192 has.'},
  {d:2,s:'Linh and Amira is friends.',bad:'is',good:'are',o:['are','am'],h:'Linh and Amira = two people \u2192 are.'},
  {d:2,s:'My brothers is twelve and fifteen.',bad:'is',good:'are',o:['are','am'],h:'Brothers = two or more \u2192 are.',t:'u1-l4'},
  {d:2,s:'Mateo don'+Q+'t have a pencil.',bad:'don'+Q+'t',good:'doesn'+Q+'t',o:['doesn'+Q+'t','isn'+Q+'t'],h:'He, she, one person \u2192 doesn'+Q+'t have.'},
  {d:2,s:'The letter A are a vowel.',bad:'are',good:'is',o:['is','am'],h:'One letter \u2192 is.',t:'u1-l3'},
  {d:3,s:'The students isn'+Q+'t in the library.',bad:'isn'+Q+'t',good:'aren'+Q+'t',o:['aren'+Q+'t','am not'],h:'Students = two or more \u2192 aren'+Q+'t.'},
  {d:3,s:'Where are the nurse?',bad:'are',good:'is',o:['is','am'],h:'Who comes after the blank? One nurse \u2192 is.'},
  {d:3,s:'Paolo and I has a math test today.',bad:'has',good:'have',o:['have','is'],h:'Paolo and I = we \u2192 have.',t:'u1-l4'},
  {d:3,s:'Amira don'+Q+'t speak Chinese.',bad:'don'+Q+'t',good:'doesn'+Q+'t',o:['doesn'+Q+'t','isn'+Q+'t'],h:'She \u2192 doesn'+Q+'t.',t:'u1-l5'}
 ],
 have:[
  {d:1,e:'\ud83c\udf92',s:'Jun ___ a red backpack.',a:'has',o:['has','have','is']},
  {d:1,e:'\u270f\ufe0f',s:'I ___ a pencil.',a:'have',o:['has','have','am']},
  {d:1,e:'\ud83c\udfc0',s:'We ___ P.E. today.',a:'have',o:['has','have','are']},
  {d:1,e:'\ud83d\udc66\ud83d\udc66',s:'Amira ___ two brothers.',a:'has',o:['has','have','is'],t:'u1-l4'},
  {d:2,e:'\ud83d\udd8a\ufe0f',s:'Mateo ___ a pen. He needs one.',a:'doesn'+Q+'t have',o:['doesn'+Q+'t have','don'+Q+'t have','isn'+Q+'t']},
  {d:2,e:'\ud83d\udcb5',s:'My friends ___ lunch money. They need some.',a:'don'+Q+'t have',o:['doesn'+Q+'t have','don'+Q+'t have','aren'+Q+'t']},
  {d:2,e:'\ud83d\udcda',s:'The library ___ a lot of books.',a:'has',o:['has','have','is']},
  {d:2,e:'\ud83d\udd12',s:'___ you have a locker?',a:'Do',o:['Do','Does','Are']},
  {d:3,e:'\ud83d\udcd6',s:'___ Linh have a dictionary?',a:'Does',o:['Do','Does','Is']},
  {d:3,e:'\ud83e\ude9f',s:'The gym ___ any windows. It is dark.',a:'doesn'+Q+'t have',o:['doesn'+Q+'t have','don'+Q+'t have','isn'+Q+'t']},
  {d:3,e:'\ud83d\ude0a',s:'Paolo and Jun ___ a test today. They are happy!',a:'don'+Q+'t have',o:['doesn'+Q+'t have','don'+Q+'t have','aren'+Q+'t'],t:'u1-l4'}
 ],
 join:[
  {d:1,a:'I am hungry, so I go to the cafeteria.',w:['I am hungry, but I go to the cafeteria.','I go to the cafeteria, so I am hungry.'],s1:'I am hungry.',s2:'I go to the cafeteria.'},
  {d:1,a:'Jun is sick, so he goes to the nurse'+Q+'s office.',w:['Jun is sick because he goes to the nurse'+Q+'s office.','Jun is sick, but he goes to the nurse'+Q+'s office.'],s1:'Jun is sick.',s2:'He goes to the nurse'+Q+'s office.'},
  {d:1,a:'Mateo is from Guatemala, and Linh is from Vietnam.',w:['Mateo is from Guatemala, so Linh is from Vietnam.','Mateo is from Guatemala because Linh is from Vietnam.'],s1:'Mateo is from Guatemala.',s2:'Linh is from Vietnam.',t:'u1-l5'},
  {d:2,a:'Amira likes the library because it is quiet.',w:['Amira likes the library, so it is quiet.','Amira likes the library, but it is quiet.'],s1:'Amira likes the library.',s2:'It is quiet.'},
  {d:2,a:'The gym is big, but the nurse'+Q+'s office is small.',w:['The gym is big, so the nurse'+Q+'s office is small.','The gym is big because the nurse'+Q+'s office is small.'],s1:'The gym is big.',s2:'The nurse'+Q+'s office is small.'},
  {d:2,a:'Paolo is late because he missed the bus.',w:['Paolo missed the bus because he is late.','Paolo is late, but he missed the bus.'],s1:'Paolo is late.',s2:'He missed the bus.'},
  {d:3,a:'Jun has a test tomorrow, so he studies tonight.',w:['Jun studies tonight, so he has a test tomorrow.','Jun has a test tomorrow, but he studies tonight.'],s1:'Jun has a test tomorrow.',s2:'He studies tonight.'},
  {d:3,a:'I like soccer, but my sister likes basketball.',w:['I like soccer, so my sister likes basketball.','I like soccer because my sister likes basketball.'],s1:'I like soccer.',s2:'My sister likes basketball.'},
  {d:3,a:'The library is closed, so Mateo reads in the cafeteria.',w:['Mateo reads in the cafeteria, so the library is closed.','The library is closed because Mateo reads in the cafeteria.'],s1:'The library is closed.',s2:'Mateo reads in the cafeteria.'}
 ],
 spell:[
  {d:1,pic:'15',s:'There are ___ students in my class.',a:'fifteen',t:'u1-l4'},
  {d:1,pic:'16',s:'I am ___ years old.',a:'sixteen',t:'u1-l4'},
  {d:1,pic:'\ud83e\ude91\ud83e\ude91',s:'one desk, two ___',a:'desks'},
  {d:1,pic:'\ud83d\udcd8\ud83d\udcd8',s:'one book, two ___',a:'books'},
  {d:2,pic:'\ud83c\udfeb\ud83c\udfeb',s:'one class, two ___',a:'classes'},
  {d:2,pic:'20',s:'There are ___ desks in the room.',a:'twenty',t:'u1-l4'},
  {d:2,pic:'14',s:'Paolo is ___ years old.',a:'fourteen',t:'u1-l4'},
  {d:2,pic:'\ud83c\udd70\ufe0f',s:'A is the ___ letter of the alphabet.',a:'first',t:'u1-l3'},
  {d:2,pic:'A E I O U',s:'A, E, I, O and U are ___.',a:'vowels',t:'u1-l3'},
  {d:3,pic:'40',s:'There are ___ chairs in the cafeteria.',a:'forty',t:'u1-l4',h:'Careful: four has a U, but this number does not.'},
  {d:3,pic:'\ud83d\udcda\ud83d\udcda',s:'one library, two ___',a:'libraries',h:'A word that ends in y: change y to i, then add -es.'},
  {d:3,pic:'\ud83d\udce6\ud83d\udce6',s:'one box, two ___',a:'boxes',h:'A word that ends in x: add -es.'}
 ],
 /* tiles: say = the sentence to change (questions) or '' (unscramble). a = the answer; alt = other right orders. */
 ques:[
  {d:1,say:'He is the coach.',a:'Is he the coach?'},
  {d:1,say:'She is a nurse.',a:'Is she a nurse?'},
  {d:1,say:'They are in the gym.',a:'Are they in the gym?'},
  {d:1,say:'You are new.',a:'Are you new?',t:'u1-l2'},
  {d:2,say:'Linh is from Vietnam.',a:'Is Linh from Vietnam?',t:'u1-l5'},
  {d:2,say:'The library is open.',a:'Is the library open?'},
  {d:2,say:'Mateo and Jun are friends.',a:'Are Mateo and Jun friends?',alt:['Are Jun and Mateo friends?'],t:'u1-l2'},
  {d:3,say:'Amira is in the library.',a:'Where is Amira?',h:'Ask about the PLACE. Start with Where.'},
  {d:3,say:'Ms. Brown is the principal.',a:'Who is the principal?',h:'Ask about the PERSON. Start with Who.'},
  {d:3,say:'Jun has a red backpack.',a:'Does Jun have a red backpack?',h:'has \u2192 Does \u2026 have?'},
  {d:3,say:'There are twenty desks.',a:'How many desks are there?',h:'Ask about the NUMBER. Start with How many.',t:'u1-l4'}
 ],
 order:[
  {d:1,a:'The nurse is in her office.'},
  {d:1,a:'I am a new student.',t:'u1-l2'},
  {d:1,a:'Jun is in the gym.'},
  {d:1,a:'We are from China.',t:'u1-l5'},
  {d:2,a:'My locker is next to the library.'},
  {d:2,a:'Amira speaks Arabic and English.',alt:['Amira speaks English and Arabic.'],t:'u1-l5'},
  {d:2,a:'Mateo has a soccer game today.',alt:['Today Mateo has a soccer game.']},
  {d:2,a:'My name has five letters.',t:'u1-l3'},
  {d:3,a:'Linh is not in the cafeteria today.',alt:['Today Linh is not in the cafeteria.']},
  {d:3,a:'Paolo goes to the library after school.',alt:['After school Paolo goes to the library.']},
  {d:3,a:'Where is the counseling office?'}
 ],
 read:[
  {d:1,t:'u1-l1',p:'Linh is a new student at Galileo. She is from Vietnam. Her first class is in Room 101. Her teacher is Mr. Toby.',
   qs:[{q:'Where is Linh from?',a:'Vietnam',w:['China','Guatemala']},{q:'Who is her teacher?',a:'Mr. Toby',w:['Ms. Brown','Mateo']}]},
  {d:1,t:'u1-l1',p:'Mateo is in the gym. He has P.E. now. The coach gives him a basketball. Mateo is happy.',
   qs:[{q:'Where is Mateo?',a:'in the gym',w:['in the library','in the cafeteria']},{q:'What does the coach give him?',a:'a basketball',w:['a book','a pencil']}]},
  {d:2,t:'u1-l2',p:'Amira meets Jun in the hallway. \u201cHi, I'+Q+'m Amira. Nice to meet you,\u201d she says. Jun smiles. \u201cNice to meet you too. I'+Q+'m Jun.\u201d',
   qs:[{q:'Where are Amira and Jun?',a:'in the hallway',w:['in the gym','in the main office']},{q:'Is this the first time they meet?',a:'Yes. They say \u201cNice to meet you.\u201d',w:['No. They are old friends.','No. They are brother and sister.']}]},
  {d:2,t:'u1-l3',p:'Paolo spells his name for the secretary: P-A-O-L-O. The secretary writes it down. Then she gives him his class schedule.',
   qs:[{q:'How many letters are in Paolo'+Q+'s name?',a:'five',w:['four','six']},{q:'Who writes his name?',a:'the secretary',w:['the nurse','Paolo']}]},
  {d:2,t:'u1-l5',p:'Amira is from Yemen. She speaks Arabic and English. Her friend Paolo is from the Philippines. He speaks Tagalog and English.',
   qs:[{q:'What languages does Amira speak?',a:'Arabic and English',w:['Tagalog and English','only Arabic']},{q:'Who is bilingual?',a:'Amira and Paolo',w:['only Amira','only Paolo']}]},
  {d:3,t:'u1-l4',p:'There are twenty-eight students in Mr. Toby'+Q+'s class. Today, three students are absent. The other students are at their desks.',
   qs:[{q:'How many students are in the class?',a:'twenty-eight',w:['twenty-five','three']},{q:'How many students are at their desks today?',a:'twenty-five',w:['twenty-eight','three']}]},
  {d:3,t:'u1-l1',p:'Jun feels sick. His head hurts. He asks Mr. Toby for a pass. Then he walks down the hallway.',
   qs:[{q:'Where is Jun going?',a:'to the nurse'+Q+'s office',w:['to the gym','to the cafeteria']},{q:'Why does he need a pass?',a:'He feels sick.',w:['He is hungry.','He wants a book.']}]},
  {d:3,t:'u1-l1',p:'It is twelve o'+Q+'clock. The cafeteria is loud. Linh has a tray of hot food, but she can'+Q+'t find a seat. Then Mateo waves at her.',
   qs:[{q:'What time of day is it?',a:'lunchtime',w:['early morning','after school']},{q:'Why does Mateo wave?',a:'He has a seat for Linh.',w:['He wants her food.','He is going home.']}]}
 ]
};
var NAMES=/^(I|Linh|Mateo|Amira|Jun|Paolo|Mr\.|Ms\.|Toby|Brown|Vietnam|China|Guatemala|Yemen|Philippines|Arabic|English|Chinese|Tagalog|Galileo|P\.E\.)$/;
/* split a sentence into tiles: words + the end mark. First word lower-case unless it is a name or I. */
function tiles(s){var end=(s.match(/[.?!]$/)||[''])[0],body=s.replace(/[.?!]$/,''),w=body.split(' ');
 w=w.map(function(x,i){return (i===0&&!NAMES.test(x))?x.charAt(0).toLowerCase()+x.slice(1):x;});if(end)w.push(end);return w;}
function lvlD(L){return L==='A'?[1,2]:L==='B'?[2]:[2,3];}
function pick(list,L,lesson,rnd,sh){var want=lvlD(L);
 var ok=list.filter(function(x){return want.indexOf(x.d)>=0;});if(!ok.length)ok=list.slice();
 if(L==='A'){var one=ok.filter(function(x){return x.d===1;});if(one.length&&rnd()<0.7)ok=one;}
 if(L==='C'){var three=ok.filter(function(x){return x.d===3;});if(three.length&&rnd()<0.65)ok=three;}
 var lp=lesson?ok.filter(function(x){return x.t===lesson;}):[];
 var src=lp.length&&rnd()<0.75?lp:ok;return sh(src)[0];}
/* make(level, lesson, rnd, sh) → raw items in a fixed easy→hard order. Each raw item:
   {ty, k(tag), ...}. Answer positions are shuffled later by the page (same rule as the Warm-up). */
function make(L,lesson,rnd,sh){L=L||'A';var out=[];
 var f=pick(S.fix,L,lesson,rnd,sh);
 out.push({ty:'fix',k:'STR.FIX',s:f.s,bad:f.bad,good:f.good,o:[f.good].concat(f.o.filter(function(x){return x!==f.good;})),h:f.h,
  why:f.s.replace(new RegExp('(^|\\s)'+f.bad.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[\\s.?!]|$)'),'$1<b>'+f.good+'</b>')});
 var h=pick(S.have,L,lesson,rnd,sh);
 out.push({ty:'mc',k:'STR.HAVE',pic:h.e,q:h.s,o:h.o.slice(),a:h.a,why:h.s.replace('___','<b>'+h.a+'</b>')});
 var j=pick(S.join,L,lesson,rnd,sh);
 out.push({ty:'mc',k:'STR.JOIN',pic:'\ud83d\udd17',q:'<div class="fragq">Put the two sentences together. Which one makes sense?</div><div class="fragbox two"><span>'+j.s1+'</span> <span>'+j.s2+'</span></div>',
  plain:'Put the two sentences together. '+j.s1+' '+j.s2,o:[j.a].concat(j.w),a:j.a,rs:0,why:'<b>'+j.a+'</b>'});
 var p=pick(S.spell,L,lesson,rnd,sh);
 out.push({ty:'type',k:'STR.SPELL',pic:p.pic,q:p.s,a:p.a,h:p.h||'',why:p.s.replace('___','<b>'+p.a+'</b>')});
 var o=pick(S.order,L,lesson,rnd,sh);
 out.push({ty:'tiles',k:'STR.ORDER',say:'',a:o.a,ans:tiles(o.a),alts:(o.alt||[]).map(tiles),tl:sh(tiles(o.a)),h:'',why:'<b>'+o.a+'</b>'});
 var q=pick(S.ques,L,lesson,rnd,sh);
 out.push({ty:'tiles',k:'STR.QUES',say:q.say,a:q.a,ans:tiles(q.a),alts:(q.alt||[]).map(tiles),tl:sh(tiles(q.a)),h:q.h||'',why:'<b>'+q.a+'</b>'});
 var r=pick(S.read,L,lesson,rnd,sh),rid='r'+Math.floor(rnd()*1e6);
 r.qs.forEach(function(x,i){out.push({ty:'mc',k:'STR.READ',rp:r.p,rid:rid,pic:'',q:x.q,o:[x.a].concat(x.w),a:x.a,rs:0,why:'<b>'+x.a+'</b>'});});
 return out;}
window.BasicsStretch={POOL:S,make:make,tiles:tiles,
 NAMES:{'STR.FIX':'Fix the mistake','STR.HAVE':'has / have','STR.JOIN':'Join two sentences','STR.SPELL':'Write the word','STR.ORDER':'Words in order','STR.QUES':'Make a question','STR.READ':'Read and answer'},
 HINTS:{'STR.FIX':'One word is wrong. Read the sentence out loud. Which word sounds wrong?',
  'STR.HAVE':'I, you, we, they \u2192 have. He, she, it, one person \u2192 has. Questions: Do you\u2026? Does he\u2026?',
  'STR.JOIN':'and = one more thing \u00b7 but = something different \u00b7 because = the reason \u00b7 so = what happens next.',
  'STR.SPELL':'Say the word slowly. Listen \ud83d\udd0a. Count the boxes: one letter in each.',
  'STR.ORDER':'Who first, then the verb (am / is / are / has / goes\u2026), then the rest. The end mark goes last.',
  'STR.QUES':'For a yes / no question, move am / is / are to the front.',
  'STR.READ':'Read the story again. The answer is in the story.'}};
})();
