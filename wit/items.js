/* Sentence Work (WIT) — item pool.
   Shared by readings/wit/index.html (all seven activities) and readings/basics/ (Daily Basics pool).
   Every item: lvl '101' or '103'; t = Launch Plus lesson tag for 101 items (u1-l1, u1-l2, u1-l3, …), 'gen' for general.
   ?lesson=TAG on the page puts that tag's items first. */
var WIT = {

/* 1 · SENTENCE SORT — tap a card, then tap the box it belongs in. */
sort: [
 {lvl:'101',t:'u1-l1',s:'Ms. Brown is the principal.',k:'statement'},
 {lvl:'101',t:'u1-l1',s:'Where is the library?',k:'question'},
 {lvl:'101',t:'u1-l1',s:'Open your book.',k:'command'},
 {lvl:'101',t:'u1-l1',s:'What a big school!',k:'exclamation'},
 {lvl:'101',t:'u1-l2',s:'My name is Maria.',k:'statement'},
 {lvl:'101',t:'u1-l2',s:'How do you spell your name?',k:'question'},
 {lvl:'101',t:'u1-l2',s:'Please say your name again.',k:'command'},
 {lvl:'101',t:'u1-l2',s:'I am so happy to meet you!',k:'exclamation'},
 {lvl:'101',t:'u1-l3',s:'The letter A is a vowel.',k:'statement'},
 {lvl:'101',t:'u1-l3',s:'Is B a vowel or a consonant?',k:'question'},
 {lvl:'101',t:'u1-l3',s:'Spell the word slowly.',k:'command'},
 {lvl:'101',t:'u1-l3',s:'You are a great speller!',k:'exclamation'},
 {lvl:'101',t:'u1-l1',s:'The nurse helps sick students.',k:'statement'},
 {lvl:'101',t:'u1-l1',s:'Who is your coach?',k:'question'},
 {lvl:'101',t:'u1-l1',s:'Go to the Main Office.',k:'command'},
 {lvl:'101',t:'u1-l1',s:'Our mascot is awesome!',k:'exclamation'},

 {lvl:'103',t:'gen',s:'High school is not voluntary in California.',k:'statement'},
 {lvl:'103',t:'gen',s:'Why did Miantonomo want war?',k:'question'},
 {lvl:'103',t:'gen',s:'Read the second paragraph again.',k:'command'},
 {lvl:'103',t:'gen',s:'What a terrible decision!',k:'exclamation'},
 {lvl:'103',t:'gen',s:'Winston writes in his diary every night.',k:'statement'},
 {lvl:'103',t:'gen',s:'How does the Party control the news?',k:'question'},
 {lvl:'103',t:'gen',s:'Explain your answer with evidence.',k:'command'},
 {lvl:'103',t:'gen',s:'Big Brother is always watching!',k:'exclamation'},
 {lvl:'103',t:'gen',s:'Chief Powhatan wanted peace with the settlers.',k:'statement'},
 {lvl:'103',t:'gen',s:'Was the war necessary?',k:'question'},
 {lvl:'103',t:'gen',s:'Compare the two leaders.',k:'command'},
 {lvl:'103',t:'gen',s:'I can\u2019t believe he said that!',k:'exclamation'}
],

/* 2 · SENTENCE SCRAMBLE — tap the words in order, then the end mark. */
scramble: [
 {lvl:'101',t:'u1-l2',s:'How was your weekend?'},
 {lvl:'101',t:'u1-l2',s:'I am so happy to see you.'},
 {lvl:'101',t:'u1-l2',s:'My name is Maria.'},
 {lvl:'101',t:'u1-l2',s:'How do you spell your name?'},
 {lvl:'101',t:'u1-l1',s:'The nurse is in her office.'},
 {lvl:'101',t:'u1-l1',s:'We are new students at Galileo.'},
 {lvl:'101',t:'u1-l1',s:'Where is the Main Office?'},
 {lvl:'101',t:'u1-l3',s:'Is B a vowel?'},
 {lvl:'101',t:'u1-l3',s:'Please spell the word.'},
 {lvl:'101',t:'u1-l3',s:'The alphabet has 26 letters.'},

 {lvl:'103',t:'gen',s:'How was your weekend?'},
 {lvl:'103',t:'gen',s:'I am so happy to see you.'},
 {lvl:'103',t:'gen',s:'Chief Powhatan wanted peace with the settlers.'},
 {lvl:'103',t:'gen',s:'Winston writes in his diary every night.'},
 {lvl:'103',t:'gen',s:'Why is high school not voluntary?'},
 {lvl:'103',t:'gen',s:'The Party changes the news every day.'},
 {lvl:'103',t:'gen',s:'Miantonomo wanted war because he feared the colonists.'},
 {lvl:'103',t:'gen',s:'Does Winston have any real friends?'}
],

/* 3 · SENTENCE OR FRAGMENT? — tap S or F. If F, tap the repair that makes it a sentence. */
fragment: [
 {lvl:'101',t:'u1-l1',s:'a good school',k:'F',fix:'Galileo is a good school.',wrong:['A good school.','Galileo a good school.']},
 {lvl:'101',t:'u1-l1',s:'my teacher cares about me',k:'S',fix:'My teacher cares about me.'},
 {lvl:'101',t:'u1-l1',s:'in the Main Office',k:'F',fix:'The principal is in the Main Office.',wrong:['In the Main Office.','The principal in the Main Office.']},
 {lvl:'101',t:'u1-l1',s:'the custodian has a broom',k:'S',fix:'The custodian has a broom.'},
 {lvl:'101',t:'u1-l1',s:'the coach in the gym',k:'F',fix:'The coach is in the gym.',wrong:['The coach in the gym.','In the gym the coach.']},
 {lvl:'101',t:'u1-l1',s:'they are nurses',k:'S',fix:'They are nurses.'},
 {lvl:'101',t:'u1-l2',s:'a new student from Yemen',k:'F',fix:'Ali is a new student from Yemen.',wrong:['A new student from Yemen.','Ali new student from Yemen.']},
 {lvl:'101',t:'u1-l2',s:'my name is Lin',k:'S',fix:'My name is Lin.'},
 {lvl:'101',t:'u1-l2',s:'spells her name',k:'F',fix:'She spells her name.',wrong:['Spells her name.','Her name spells.']},
 {lvl:'101',t:'u1-l3',s:'the letter A is a vowel',k:'S',fix:'The letter A is a vowel.'},
 {lvl:'101',t:'u1-l3',s:'twenty-six letters',k:'F',fix:'The alphabet has twenty-six letters.',wrong:['Twenty-six letters.','Twenty-six letters the alphabet.']},
 {lvl:'101',t:'u1-l3',s:'you are a good speller',k:'S',fix:'You are a good speller.'},

 {lvl:'103',t:'gen',s:'a good school',k:'F',fix:'Washington is a good school.',wrong:['A good school.','A good school in Washington.']},
 {lvl:'103',t:'gen',s:'my teacher cares about me',k:'S',fix:'My teacher cares about me.'},
 {lvl:'103',t:'gen',s:'because he wanted to protect his people',k:'F',fix:'Miantonomo wanted war because he wanted to protect his people.',wrong:['Because he wanted to protect his people.','Because wanting to protect his people.']},
 {lvl:'103',t:'gen',s:'high school is not voluntary',k:'S',fix:'High school is not voluntary.'},
 {lvl:'103',t:'gen',s:'writing in a secret diary',k:'F',fix:'Winston is writing in a secret diary.',wrong:['Writing in a secret diary.','Writing in a secret diary every night.']},
 {lvl:'103',t:'gen',s:'the Party controls the news',k:'S',fix:'The Party controls the news.'},
 {lvl:'103',t:'gen',s:'Miantonomo, the Narragansett leader',k:'F',fix:'Miantonomo, the Narragansett leader, wanted war.',wrong:['Miantonomo, the Narragansett leader.','The Narragansett leader, Miantonomo.']},
 {lvl:'103',t:'gen',s:'Winston hates Big Brother',k:'S',fix:'Winston hates Big Brother.'},
 {lvl:'103',t:'gen',s:'although the settlers wanted land',k:'F',fix:'Although the settlers wanted land, Powhatan wanted peace.',wrong:['Although the settlers wanted land.','Although wanting land the settlers.']},
 {lvl:'103',t:'gen',s:'his co-workers love Big Brother',k:'S',fix:'His co-workers love Big Brother.'}
],

/* 4 · SENTENCE TYPES — one picture; write a statement, a question, a command, an exclamation. */
types: [
 {lvl:'101',t:'u1-l1',pic:'👩‍🏫 📚 🧑‍🎓🧑‍🎓',alt:'A teacher and students in a classroom',
  model:{statement:'The teacher is reading a book.',question:'What is the teacher reading?',command:'Listen to the teacher.',exclamation:'This class is fun!'}},
 {lvl:'101',t:'u1-l1',pic:'👩 🩺 🤒',alt:'A nurse helps a sick student',
  model:{statement:'The nurse helps a sick student.',question:'Where is the nurse\u2019s office?',command:'Go to the nurse.',exclamation:'I feel so sick!'}},
 {lvl:'101',t:'u1-l2',pic:'👋 🧑 🤝 🧑',alt:'Two new students meet and shake hands',
  model:{statement:'Two students are meeting.',question:'What is your name?',command:'Say your name slowly.',exclamation:'Nice to meet you!'}},
 {lvl:'103',t:'gen',pic:'👰 🤵 💐',alt:'A bride and groom at a wedding',
  model:{statement:'The young bride is wearing a white dress.',question:'How did the couple meet?',command:'Have a great life together.',exclamation:'That is a beautiful dress!'}},
 {lvl:'103',t:'gen',pic:'📓 🕯️ 👁️',alt:'A man writes secretly in a diary while a poster watches',
  model:{statement:'Winston writes in his diary at night.',question:'Why does he hide the diary?',command:'Do not trust the telescreen.',exclamation:'Big Brother is watching!'}},
 {lvl:'103',t:'gen',pic:'🏹 🤝 🌲',alt:'Two leaders meet in a forest',
  model:{statement:'Chief Powhatan wanted peace.',question:'Why did the leaders meet?',command:'Explain your decision to the people.',exclamation:'What a dangerous meeting!'}}
],

/* 5 · BECAUSE, BUT, SO — first choose the conjunction that fits; then complete the three sentences. */
bbs_choose: [
 {lvl:'101',t:'u1-l1',s:'I came to school ___ I want to learn.',a:'because'},
 {lvl:'101',t:'u1-l1',s:'I came to school, ___ I wanted to stay home and sleep.',a:'but'},
 {lvl:'101',t:'u1-l1',s:'I came to school, ___ I will learn new things today.',a:'so'},
 {lvl:'101',t:'u1-l1',s:'I am tired ___ I went to bed late.',a:'because'},
 {lvl:'101',t:'u1-l1',s:'I am tired, ___ I am happy.',a:'but'},
 {lvl:'101',t:'u1-l1',s:'I am tired, ___ I will sleep early tonight.',a:'so'},
 {lvl:'101',t:'u1-l2',s:'Maria is nervous ___ she is a new student.',a:'because'},
 {lvl:'101',t:'u1-l2',s:'Maria is nervous, ___ she says hello.',a:'but'},
 {lvl:'101',t:'u1-l2',s:'Maria is nervous, ___ Lin helps her.',a:'so'},
 {lvl:'101',t:'u1-l3',s:'A is a vowel, ___ B is a consonant.',a:'but'},
 {lvl:'101',t:'u1-l3',s:'The word is hard ___ it has eight letters.',a:'because'},
 {lvl:'101',t:'u1-l3',s:'The word is hard, ___ I spell it slowly.',a:'so'},

 {lvl:'103',t:'gen',s:'High school is not voluntary ___ the law says students must attend.',a:'because'},
 {lvl:'103',t:'gen',s:'High school is not voluntary, ___ many students enjoy it anyway.',a:'but'},
 {lvl:'103',t:'gen',s:'High school is not voluntary, ___ everyone under 18 must go.',a:'so'},
 {lvl:'103',t:'gen',s:'Miantonomo wanted war ___ the colonists were taking the land.',a:'because'},
 {lvl:'103',t:'gen',s:'Miantonomo wanted war, ___ other leaders wanted to wait.',a:'but'},
 {lvl:'103',t:'gen',s:'Miantonomo wanted war, ___ he tried to unite the tribes.',a:'so'},
 {lvl:'103',t:'gen',s:'Chief Powhatan wanted peace ___ war would cost many lives.',a:'because'},
 {lvl:'103',t:'gen',s:'Chief Powhatan wanted peace, ___ the settlers kept pushing.',a:'but'},
 {lvl:'103',t:'gen',s:'Chief Powhatan wanted peace, ___ he offered the settlers food.',a:'so'},
 {lvl:'103',t:'gen',s:'Winston writes in his diary ___ he wants to remember the truth.',a:'because'},
 {lvl:'103',t:'gen',s:'Winston writes in his diary, ___ it is a crime.',a:'but'},
 {lvl:'103',t:'gen',s:'Winston writes in his diary, ___ he hides it from the telescreen.',a:'so'}
],
bbs_write: [
 {lvl:'101',t:'u1-l1',stem:'I came to school today'},
 {lvl:'101',t:'u1-l1',stem:'I like my school'},
 {lvl:'101',t:'u1-l2',stem:'Maria is a new student'},
 {lvl:'101',t:'u1-l3',stem:'Spelling is important'},
 {lvl:'103',t:'gen',stem:'High school is not voluntary'},
 {lvl:'103',t:'gen',stem:'Miantonomo wanted war'},
 {lvl:'103',t:'gen',stem:'Chief Powhatan wanted peace'},
 {lvl:'103',t:'gen',stem:'Winston writes in his diary'}
],
/* The deck's own glossary for the three conjunctions (shown under the activity; other languages use tap-to-translate). */
bbs_gloss: {
 because:{Spanish:'porque','Chinese (Simplified)':'因为',Arabic:'لان',Vietnamese:'bởi vì',Thai:'เพราะ',Hindi:'इसलिये',Tagalog:'dahil',Korean:'때문에'},
 but:{Spanish:'pero','Chinese (Simplified)':'但',Arabic:'لكن',Vietnamese:'nhưng',Thai:'แต่',Hindi:'मगर',Korean:'그러나'},
 so:{Spanish:'así que','Chinese (Simplified)':'所以',Arabic:'وبالتالي',Vietnamese:'vì vậy',Thai:'ดังนั้น',Hindi:'इस कारण',Tagalog:'kaya nga',Korean:'그래서'}
},

/* 6 · SENTENCE EXPANSION — pop the kernel. */
expand: [
 {lvl:'101',t:'u1-l1',k:'The nurse helps.',qs:['who?','where?','when?'],model:'The nurse helps a sick student in her office after lunch.'},
 {lvl:'101',t:'u1-l1',k:'Students read.',qs:['what?','where?','why?'],model:'Students read a book in the library because they like stories.'},
 {lvl:'101',t:'u1-l1',k:'The coach runs.',qs:['where?','when?','how?'],model:'The coach runs in the gym every morning very fast.'},
 {lvl:'101',t:'u1-l2',k:'Maria says hello.',qs:['who?','where?','how?'],model:'Maria says hello to her new friend in the hallway with a big smile.'},
 {lvl:'101',t:'u1-l3',k:'I spell.',qs:['what?','how?','why?'],model:'I spell my name slowly because the letters are new for me.'},
 {lvl:'103',t:'gen',k:'Winston works.',qs:['where?','what?','why?'],model:'Winston works at the Ministry of Truth, changing old news because the Party demands it.'},
 {lvl:'103',t:'gen',k:'The chief spoke.',qs:['who?','when?','how?'],model:'The chief spoke to the colonists at dawn, calmly but firmly.'},
 {lvl:'103',t:'gen',k:'The students protested.',qs:['why?','where?','when?'],model:'The students protested outside the capitol last spring because the law was unfair.'},
 {lvl:'103',t:'gen',k:'She hid the letter.',qs:['where?','why?','how?'],model:'She hid the letter under the floorboard, quickly and quietly, because the guards were coming.'}
],

/* 7 · PARALLEL REVISION — same meaning, better writing. */
revise: [
 {lvl:'101',t:'u1-l2',title:'Maria and Lin',
  boring:'Maria is a new student. Maria is from Mexico. Maria is nervous. Maria has a friend. The friend is Lin. Lin is nice. Lin helps Maria. Maria is happy.',
  names:['Maria','Lin'],
  model:'Maria is nervous because she is a new student from Mexico, but she has a nice friend named Lin. When Lin helps her, Maria is happy.'},
 {lvl:'101',t:'u1-l1',title:'The nurse',
  boring:'Ms. Garcia is the nurse. Ms. Garcia is in her office. A student is sick. The student goes to the nurse. The nurse helps the student. The student feels better.',
  names:['Ms. Garcia'],
  model:'Ms. Garcia, the nurse, is in her office. When a student is sick, he goes to her, and she helps him feel better.'},
 {lvl:'103',t:'gen',title:'Winston',
  boring:'Winston is unhappy with life. He writes in his diary. He commits thoughtcrime. He works. He changes the news. His co-workers love Big Brother. They support the hate, control and war. He has no real friends. He hates her.',
  names:['Winston','Julia','the Party'],
  model:'Winston is unhappy with life, so he writes in his diary even though it is thoughtcrime. At work he changes the news, while his co-workers love Big Brother and support the hate, control, and war. He has no real friends, and he hates Julia.'},
 {lvl:'103',t:'gen',title:'Two leaders',
  boring:'Miantonomo wanted war. The colonists took land. He was angry. Chief Powhatan wanted peace. War costs lives. He gave the settlers food. The two leaders were different.',
  names:['Miantonomo','Powhatan'],
  model:'Miantonomo wanted war because the colonists took his land and he was angry. Chief Powhatan, however, wanted peace, since war costs lives, so he gave the settlers food. The two leaders could not have been more different.'}
]
};
