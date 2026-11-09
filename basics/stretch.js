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
  {d:1,one:'desk',pp:'desk',s:'one desk, two ___',a:'desks'},
  {d:1,one:'book',pp:'book',s:'one book, two ___',a:'books'},
  {d:2,one:'class',pp:'class',s:'one class, two ___',a:'classes',h:'A word that ends in s: add -es.'},
  {d:2,pic:'20',s:'There are ___ desks in the room.',a:'twenty',t:'u1-l4'},
  {d:2,pic:'14',s:'Paolo is ___ years old.',a:'fourteen',t:'u1-l4'},
  {d:2,pic:'\ud83c\udd70\ufe0f',s:'A is the ___ letter of the alphabet.',a:'first',t:'u1-l3'},
  {d:2,pic:'A E I O U',s:'A, E, I, O and U are ___.',a:'vowels',t:'u1-l3'},
  {d:3,pic:'40',s:'There are ___ chairs in the cafeteria.',a:'forty',t:'u1-l4',h:'Careful: four has a U, but this number does not.'},
  {d:3,one:'library',pp:'library',s:'one library, two ___',a:'libraries',h:'A word that ends in y: change y to i, then add -es.'},
  {d:3,one:'box',pp:'box',s:'one box, two ___',a:'boxes',h:'A word that ends in x: add -es.'}
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
 out.push({ty:'type',k:'STR.SPELL',pic:p.pic||'',one:p.one||'',pp:p.pp||'',q:p.s,a:p.a,h:p.h||'',why:p.s.replace('___','<b>'+p.a+'</b>')});
 var o=pick(S.order,L,lesson,rnd,sh);
 out.push({ty:'tiles',k:'STR.ORDER',say:'',a:o.a,ans:tiles(o.a),alts:(o.alt||[]).map(tiles),tl:sh(tiles(o.a)),h:'',why:'<b>'+o.a+'</b>'});
 var q=pick(S.ques,L,lesson,rnd,sh);
 out.push({ty:'tiles',k:'STR.QUES',say:q.say,a:q.a,ans:tiles(q.a),alts:(q.alt||[]).map(tiles),tl:sh(tiles(q.a)),h:q.h||'',why:'<b>'+q.a+'</b>'});
 var r=pick(S.read,L,lesson,rnd,sh),rid='r'+Math.floor(rnd()*1e6);
 r.qs.forEach(function(x,i){out.push({ty:'mc',k:'STR.READ',rp:r.p,rid:rid,pic:'',q:x.q,o:[x.a].concat(x.w),a:x.a,rs:0,why:'<b>'+x.a+'</b>'});});
 return out;}
/* T-355 · plural pictures: one under "one class", two under the blank. Flat SVG, 80×64, muted palette. */
var PICS={
 class:'<svg viewBox="0 0 80 64" role="img" aria-label="a class"><rect x="1" y="1" width="78" height="62" rx="5" fill="#f3ead8" stroke="#6b5a45" stroke-width="1.5"/><rect x="1" y="48" width="78" height="15" fill="#c9a77c"/><path d="M1 52h78M1 57h78" stroke="#b08d62" stroke-width=".8"/><rect x="10" y="6" width="44" height="22" rx="1.5" fill="#2f5b46" stroke="#7a5534" stroke-width="2.4"/><path d="M15 12h12M15 17h18M15 22h9" stroke="#e8efe6" stroke-width="1.3" stroke-linecap="round"/><path d="M38 12l4 8 4-8" fill="none" stroke="#e8efe6" stroke-width="1.2"/><rect x="12" y="28" width="40" height="1.6" fill="#7a5534"/><rect x="40" y="28.4" width="4" height="1" fill="#fff"/><circle cx="64" cy="15" r="4.2" fill="#8d5a3b"/><path d="M60 11.5q4-4 8 0" fill="#2b1d14"/><path d="M58.5 33v-9q0-5 5.5-5t5.5 5v9z" fill="#4a7fa8"/><path d="M58.5 24l-4 4" stroke="#4a7fa8" stroke-width="2.6" stroke-linecap="round"/><path d="M58 33h12v14h-2v-12h-8v12h-2z" fill="#3c3b48"/><g fill="#a0703f"><rect x="6" y="40" width="16" height="3" rx="1"/><rect x="31" y="40" width="16" height="3" rx="1"/></g><g stroke="#6b4a2a" stroke-width="1.4"><path d="M8 43v8M20 43v8M33 43v8M45 43v8"/></g><circle cx="14" cy="33.5" r="3.6" fill="#d9a066"/><path d="M10.4 33q.4-4.8 3.6-4.8t3.6 4.8q-1.6-2-3.6-2t-3.6 2z" fill="#1d1d1d"/><path d="M9.5 40v-2.6q0-2 4.5-2t4.5 2v2.6z" fill="#e07a5f"/><circle cx="39" cy="33.5" r="3.6" fill="#a8704b"/><path d="M35 34q0-5.6 4-5.6t4 5.6v4h-8z" fill="#5b4a7a"/><circle cx="39" cy="33.8" r="2.6" fill="#a8704b"/><path d="M34.5 40v-2.6q0-2 4.5-2t4.5 2v2.6z" fill="#5b4a7a"/><rect x="12" y="38.6" width="5" height="1.6" fill="#fff" stroke="#999" stroke-width=".3"/></svg>',
 library:'<svg viewBox="0 0 80 64" role="img" aria-label="a library"><rect x="1" y="1" width="78" height="62" rx="5" fill="#efe6d4" stroke="#6b5a45" stroke-width="1.5"/><rect x="5" y="5" width="44" height="54" rx="2" fill="#8a5a33" stroke="#5c3a1e" stroke-width="1.4"/><g fill="#5c3a1e"><rect x="7" y="20" width="40" height="2"/><rect x="7" y="37" width="40" height="2"/><rect x="7" y="54" width="40" height="2"/></g><g stroke="#00000033" stroke-width=".5"><rect x="8" y="8" width="4" height="12" fill="#b5451b"/><rect x="12.3" y="10" width="3.4" height="10" fill="#2d6a4f"/><rect x="16" y="7.5" width="4.4" height="12.5" fill="#d4a017"/><rect x="20.7" y="9" width="3.2" height="11" fill="#4a7fa8"/><rect x="24.2" y="8" width="4" height="12" fill="#7b4f8c"/><path d="M29 20l3-11.6 3.2.8-3 11.6z" fill="#c26d4a"/><rect x="36" y="9.5" width="3.6" height="10.5" fill="#2f5b46"/><rect x="40" y="8" width="5" height="12" fill="#e2c06e"/><rect x="8" y="26" width="5" height="11" fill="#4a7fa8"/><rect x="13.3" y="25" width="3.6" height="12" fill="#d4a017"/><rect x="17.2" y="27" width="4" height="10" fill="#b5451b"/><rect x="21.5" y="25.5" width="3" height="11.5" fill="#6c8a3c"/><rect x="25" y="26" width="4.4" height="11" fill="#7b4f8c"/><rect x="30" y="27.5" width="3.4" height="9.5" fill="#e07a5f"/><rect x="34" y="25" width="4.6" height="12" fill="#2d6a4f"/><rect x="39" y="26" width="3.4" height="11" fill="#c9a77c"/><rect x="42.7" y="27" width="3.6" height="10" fill="#b5451b"/><rect x="8" y="43" width="3.6" height="11" fill="#e2c06e"/><rect x="12" y="42" width="5" height="12" fill="#7b4f8c"/><rect x="17.3" y="44" width="3.4" height="10" fill="#4a7fa8"/><path d="M21 54l2.8-11 3 .8-2.8 11z" fill="#2d6a4f"/><rect x="28" y="43" width="4.2" height="11" fill="#b5451b"/><rect x="32.5" y="44.5" width="3.6" height="9.5" fill="#d4a017"/><rect x="36.4" y="42.5" width="4.4" height="11.5" fill="#6c8a3c"/><rect x="41" y="43.5" width="4.8" height="10.5" fill="#e07a5f"/></g><g fill="#fff9" ><rect x="9" y="11" width="2" height="1"/><rect x="17" y="11" width="2.4" height="1"/><rect x="9" y="29" width="3" height="1"/><rect x="13" y="45" width="3" height="1"/></g><rect x="53" y="36" width="23" height="3" rx="1" fill="#a0703f"/><path d="M56 39v20M73 39v20" stroke="#6b4a2a" stroke-width="1.6"/><path d="M56 35.6q4-2.6 8 0q4-2.6 8 0v-1q-4-2.6-8 0q-4-2.6-8 0z" fill="#fff" stroke="#888" stroke-width=".4"/><path d="M64 33.6v2" stroke="#888" stroke-width=".4"/><circle cx="67" cy="17" r="5" fill="#f2d16b" stroke="#c9a23a" stroke-width=".8"/><path d="M65 25h4l1 6h-6z" fill="#9aa8a0"/><path d="M67 22v3" stroke="#555" stroke-width="1"/></svg>',
 desk:'<svg viewBox="0 0 80 64" role="img" aria-label="a desk"><rect x="1" y="1" width="78" height="62" rx="5" fill="#eef2ea" stroke="#6b7a65" stroke-width="1.5"/><rect x="1" y="52" width="78" height="11" fill="#c9cfc4"/><path d="M10 26l46-3 14 5-46 3z" fill="#c78d52" stroke="#7a5534" stroke-width="1.2"/><path d="M24 31l46-3v3l-46 3z" fill="#9b6a3a"/><path d="M10 26v3l14 5v-3z" fill="#a8743f"/><g stroke="#55606b" stroke-width="2.2" stroke-linecap="round"><path d="M14 30v24M24 34v21M66 30v22M58 28v22"/><path d="M14 50l10 3M58 47l8 3"/></g><rect x="27" y="35" width="32" height="7" rx="1" fill="#7a8892" stroke="#55606b"/><path d="M33 25.2l14-1 4 1.6-14 1z" fill="#4a7fa8" stroke="#2f5675" stroke-width=".6"/><path d="M37 27l14-1" stroke="#fff" stroke-width=".7"/><path d="M52 22.5l9-.6" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/><path d="M61 21.9l1.8-.1" stroke="#e07a5f" stroke-width="2" stroke-linecap="round"/><path d="M50.2 22.6l1.8-.1" stroke="#333" stroke-width="1.2"/><path d="M66 18h9v13h-9z" fill="#b97a45" stroke="#7a5534"/><path d="M66 31l4 2v20M75 31v22" stroke="#55606b" stroke-width="2" fill="none"/><path d="M64 33h13v3H64z" fill="#c78d52" stroke="#7a5534" stroke-width=".8"/></svg>',
 book:'<svg viewBox="0 0 80 64" role="img" aria-label="a book"><rect x="1" y="1" width="78" height="62" rx="5" fill="#eef3f7" stroke="#5f7180" stroke-width="1.5"/><path d="M22 12h34a3 3 0 0 1 3 3v36a3 3 0 0 1-3 3H22z" fill="#f7f3ea" stroke="#9a9182" stroke-width="1"/><path d="M57 16v34M55 15v36" stroke="#d8d0bf" stroke-width=".8"/><path d="M18 10h35a3 3 0 0 1 3 3v36a3 3 0 0 1-3 3H18z" fill="#2f6aa3" stroke="#1d4670" stroke-width="1.4"/><rect x="18" y="10" width="7" height="42" fill="#24578a"/><path d="M25 10v42" stroke="#173a5e" stroke-width="1"/><rect x="30" y="18" width="20" height="10" rx="1.5" fill="#f2d16b" stroke="#c9a23a" stroke-width=".8"/><path d="M33 22h14M33 25h10" stroke="#7a5d14" stroke-width="1.1" stroke-linecap="round"/><path d="M30 38h20M30 42h14" stroke="#9cc0e3" stroke-width="1.2" stroke-linecap="round"/><path d="M45 52v8l3-2.2 3 2.2v-8z" fill="#b5451b"/><path d="M20 14v34" stroke="#ffffff55" stroke-width="1"/></svg>',
 box:'<svg viewBox="0 0 80 64" role="img" aria-label="a box"><rect x="1" y="1" width="78" height="62" rx="5" fill="#f1ede6" stroke="#7a6a55" stroke-width="1.5"/><rect x="1" y="54" width="78" height="9" fill="#d6cfc2"/><path d="M14 26l26-8 26 8-26 8z" fill="#d9a865" stroke="#8a6234" stroke-width="1"/><path d="M14 26v24l26 8V34z" fill="#c48f4c" stroke="#8a6234" stroke-width="1.2"/><path d="M66 26v24l-26 8V34z" fill="#b07d3e" stroke="#8a6234" stroke-width="1.2"/><path d="M14 26l-6 9 26 8 6-9zM66 26l6 9-26 8-6-9z" fill="#dfb575" stroke="#8a6234" stroke-width="1"/><path d="M40 34v24" stroke="#e8d3a6" stroke-width="3" opacity=".8"/><path d="M27 22l26 8" stroke="#e8d3a6" stroke-width="3" opacity=".8"/><g fill="none" stroke="#5a4020" stroke-width=".9"><path d="M20 40l3 1M20 43l3 1M20 46l3 1"/><path d="M53 44l6-2v4l-6 2z"/></g><path d="M56 47l-1 -3 2 .5z" fill="#5a4020"/></svg>'
};
window.BasicsStretch={POOL:S,make:make,tiles:tiles,PICS:PICS,
 NAMES:{'STR.FIX':'Fix the mistake','STR.HAVE':'has / have','STR.JOIN':'Join two sentences','STR.SPELL':'Write the word','STR.ORDER':'Words in order','STR.QUES':'Make a question','STR.READ':'Read and answer'},
 HINTS:{'STR.FIX':'One word is wrong. Read the sentence out loud. Which word sounds wrong?',
  'STR.HAVE':'I, you, we, they \u2192 have. He, she, it, one person \u2192 has. Questions: Do you\u2026? Does he\u2026?',
  'STR.JOIN':'and = one more thing \u00b7 but = something different \u00b7 because = the reason \u00b7 so = what happens next.',
  'STR.SPELL':'Say the word slowly. Listen \ud83d\udd0a. Count the boxes: one letter in each.',
  'STR.ORDER':'Who first, then the verb (am / is / are / has / goes\u2026), then the rest. The end mark goes last.',
  'STR.QUES':'For a yes / no question, move am / is / are to the front.',
  'STR.READ':'Read the story again. The answer is in the story.'}};
})();
