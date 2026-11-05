/* Daily Basics · Level B and Level C question pools (T-275).
   Level A lives in basics/index.html (DATA) + wit/items.js (sentence or fragment).
   Every list is ELD 101 Unit 1 content: school people and places, names, letters, numbers, countries, languages.
   Rules: one clearly right answer per item; distractors are plausible but wrong; no item gives away another. */
var BASICS_LEVELS={
B:{
 /* He / She / It / We / They / You — replace the words before the verb */
 pron:[
  {e:'🧑‍🤝‍🧑',s:'Mateo and I are in the gym.',r:'are in the gym.',a:'We'},
  {e:'👩‍🎓',s:'Linh is a new student.',r:'is a new student.',a:'She'},
  {e:'🧑',s:'Paolo is from the Philippines.',r:'is from the Philippines.',a:'He'},
  {e:'📚',s:'The library is quiet.',r:'is quiet.',a:'It'},
  {e:'👫',s:'Jun and Amira are friends.',r:'are friends.',a:'They'},
  {e:'🫵',s:'You and Jun are in Room 101.',r:'are in Room 101.',a:'You'},
  {e:'🗣️',s:'My sister and I speak Spanish.',r:'speak Spanish.',a:'We'},
  {e:'🔤',s:'The alphabet has twenty-six letters.',r:'has twenty-six letters.',a:'It'},
  {e:'👩‍💼',s:'Ms. Brown is the principal.',r:'is the principal.',a:'She'},
  {e:'👨‍🏫',s:'Mr. Toby is my teacher.',r:'is my teacher.',a:'He'},
  {e:'🍽️',s:'The students are in the cafeteria.',r:'are in the cafeteria.',a:'They'},
  {e:'📘',s:'My book is on the desk.',r:'is on the desk.',a:'It'},
  {e:'👭',s:'Amira and Linh are in the library.',r:'are in the library.',a:'They'},
  {e:'⚽',s:'Mateo and I like soccer.',r:'like soccer.',a:'We'},
  {e:'🏥',s:'The nurse\u2019s office is next to the main office.',r:'is next to the main office.',a:'It'}
 ],
 /* am / is / are with harder subjects, and the negatives am not / isn't / aren't */
 be:[
  {e:'👧🧑',s:'My sister and I ___ in Room 101.',a:'are'},
  {e:'🏀',s:'The students ___ in the gym.',a:'are'},
  {e:'🙋',s:'Everyone ___ here today.',a:'is'},
  {e:'🇬🇹',s:'My friends ___ from Guatemala.',a:'are'},
  {e:'🩺',s:'The nurse ___ in her office.',a:'is'},
  {e:'🤝',s:'Mateo and Jun ___ good friends.',a:'are'},
  {e:'🔠',s:'The letter Z ___ the last letter.',a:'is'},
  {e:'🧑‍🎓',s:'You and I ___ in the same class.',a:'are'},
  {e:'👩‍⚕️',s:'My mother ___ a nurse.',a:'is'},
  {e:'⏰',s:'I ___ late today. I am on time!',a:'am not',neg:1},
  {e:'📚',s:'Jun ___ in the library. He is in the gym.',a:'isn\u2019t',neg:1},
  {e:'🚪',s:'We ___ in Room 101. We are in Room 102.',a:'aren\u2019t',neg:1},
  {e:'🍽️',s:'The cafeteria ___ open. It is closed.',a:'isn\u2019t',neg:1},
  {e:'🏠',s:'My friends ___ here. They are at home.',a:'aren\u2019t',neg:1},
  {e:'🌏',s:'I ___ from China. I am from Vietnam.',a:'am not',neg:1},
  {e:'😄',s:'Paolo ___ tired. He is happy!',a:'isn\u2019t',neg:1},
  {e:'⏱️',s:'You ___ late. You are on time.',a:'aren\u2019t',neg:1}
 ],
 /* Where? — two steps: what does the person need? where do you get it? */
 where:[
  {e:'🤒',s:'Ali has a fever and a headache.',p:'nurse\u2019s office'},
  {e:'🩹',s:'Linh cut her finger. She needs a bandage.',p:'nurse\u2019s office'},
  {e:'📖',s:'Mateo wants to borrow a book about soccer.',p:'library'},
  {e:'🍔',s:'It is lunchtime. Jun is very hungry.',p:'cafeteria'},
  {e:'🥪',s:'Paolo wants a tray of hot food.',p:'cafeteria'},
  {e:'🏀',s:'The basketball team has practice after school.',p:'gym'},
  {e:'👟',s:'Linh has P.E. today. She puts on her sneakers.',p:'gym'},
  {e:'✍️',s:'A visitor wants to sign in at the front desk.',p:'main office'},
  {e:'👩‍💼',s:'Your mother wants to talk to the principal.',p:'main office'},
  {e:'📅',s:'Jun wants to change his class schedule.',p:'counseling office'},
  {e:'🎓',s:'Amira wants advice about college.',p:'counseling office'},
  {e:'🔔',s:'The bell rings. Students walk to their next class.',p:'hallway'},
  {e:'🔒',s:'Mateo puts his jacket in his locker.',p:'hallway'},
  {e:'✋',s:'The teacher takes attendance. Students say \u201chere.\u201d',p:'classroom'},
  {e:'🧑‍🏫',s:'The teacher writes on the whiteboard. Students write in their notebooks.',p:'classroom'}
 ],
 /* because / but / so — pick the ending that fits */
 bbs:[
  {s:'I am hungry, so ___',a:'I eat my lunch.',w:['I am full.','the bell is loud.']},
  {s:'Jun is sick, so ___',a:'he goes to the nurse\u2019s office.',w:['he is very healthy.','the library is open.']},
  {s:'I like the library because ___',a:'it is quiet.',w:['I don\u2019t like books.','so I read.']},
  {s:'Mateo is tall, but ___',a:'his brother is short.',w:['he is tall.','because he is tall.']},
  {s:'The bell rings, so ___',a:'we walk to our next class.',w:['we stay in our seats all day.','because it is lunch.']},
  {s:'Amira is happy because ___',a:'she has a new friend.',w:['she is sad.','so she smiles.']},
  {s:'I want to read a book, so ___',a:'I go to the library.',w:['I go to the gym.','I don\u2019t like books.']},
  {s:'Linh speaks Vietnamese, but ___',a:'she is learning English too.',w:['she speaks Vietnamese.','because she is from Vietnam.']},
  {s:'Paolo is late because ___',a:'he missed the bus.',w:['he is early.','so he runs.']},
  {s:'The gym is big, but ___',a:'the nurse\u2019s office is small.',w:['the gym is big.','because it is big.']},
  {s:'It is cold today, so ___',a:'I wear a jacket.',w:['I wear shorts.','because it is cold.']},
  {s:'Jun has a test tomorrow, so ___',a:'he studies tonight.',w:['he does not study.','because he has a test.']}
 ]
},
C:{
 /* pronoun + be together: pick the right pair */
 pron:[
  {e:'👫',subj:'Linh and Paolo',rest:'new students',p:'They'},
  {e:'🇾🇪',subj:'Amira',rest:'from Yemen',p:'She'},
  {e:'🏀',subj:'Mateo',rest:'in the gym',p:'He'},
  {e:'🍽️',subj:'The cafeteria',rest:'next to the gym',p:'It'},
  {e:'🗣️',subj:'Jun and I',rest:'bilingual',p:'We'},
  {e:'🫵',subj:'You and Linh',rest:'in my class',p:'You'},
  {e:'👨‍🏫',subj:'Mr. Toby',rest:'our teacher',p:'He'},
  {e:'🔤',subj:'The letters B and C',rest:'consonants',p:'They'},
  {e:'🎂',subj:'My brother and I',rest:'fifteen and sixteen',p:'We'},
  {e:'📚',subj:'The library',rest:'open after school',p:'It'},
  {e:'👩‍💼',subj:'Ms. Brown',rest:'in the main office',p:'She'},
  {e:'🇵🇭',subj:'Paolo and his sister',rest:'from Manila',p:'They'}
 ],
 /* questions, contractions, which sentence is right — each item has its own options */
 be:[
  {e:'🏠',s:'___ your brothers at home?',a:'Are',o:['Am','Is','Are']},
  {e:'🧑‍🎓',s:'___ Linh in your class?',a:'Is',o:['Am','Is','Are']},
  {e:'⏰',s:'___ I late?',a:'Am',o:['Am','Is','Are']},
  {e:'📚',s:'Where ___ the library?',a:'is',o:['am','is','are']},
  {e:'🎒',s:'Where ___ my books?',a:'are',o:['am','is','are']},
  {e:'👩‍🏫',s:'Who ___ your English teacher?',a:'is',o:['am','is','are']},
  {e:'🇬🇹',s:'They are from Guatemala. \u2192 ___ from Guatemala.',a:'They\u2019re',o:['They\u2019re','Their','There']},
  {e:'🏫',s:'We are at Galileo. \u2192 ___ at Galileo.',a:'We\u2019re',o:['We\u2019re','Were','Where']},
  {e:'🏀',s:'It is next to the gym. \u2192 ___ next to the gym.',a:'It\u2019s',o:['It\u2019s','Its','It']},
  {e:'👋',s:'I am new here. \u2192 ___ new here.',a:'I\u2019m',o:['I\u2019m','Im','I\u2019am']},
  {e:'✅',q:'Which sentence is correct?',a:'My friends are in the gym.',o:['My friends are in the gym.','My friends is in the gym.','My friends am in the gym.']},
  {e:'✅',q:'Which sentence is correct?',a:'Amira and I are friends.',o:['Amira and I are friends.','Amira and I is friends.','Amira and I am friends.']},
  {e:'✅',q:'Which sentence is correct?',a:'The students are not here.',o:['The students are not here.','The students is not here.','The students not here.']},
  {e:'✅',q:'Which sentence is correct?',a:'Is the nurse in her office?',o:['Is the nurse in her office?','Are the nurse in her office?','The nurse in her office?']}
 ],
 /* the school map: next to / across from / far from, and "which room is between…?" */
 rooms:['library','main office','nurse\u2019s office','gym','cafeteria','counseling office'],
 where:[
  {s:'The nurse\u2019s office is ___ the main office.',a:'next to'},
  {s:'The library is ___ the main office.',a:'next to'},
  {s:'The gym is ___ the cafeteria.',a:'next to'},
  {s:'The counseling office is ___ the cafeteria.',a:'next to'},
  {s:'The cafeteria is ___ the main office.',a:'across from'},
  {s:'The gym is ___ the library.',a:'across from'},
  {s:'The counseling office is ___ the nurse\u2019s office.',a:'across from'},
  {s:'The library is ___ the counseling office.',a:'far from'},
  {s:'The gym is ___ the nurse\u2019s office.',a:'far from'},
  {q:'Which room is between the library and the nurse\u2019s office?',a:'main office'},
  {q:'Which room is between the gym and the counseling office?',a:'cafeteria'}
 ],
 /* write your own ending (3 words or more) */
 bbs:[
  'I am tired, so ___','I like Galileo because ___','My school is big, but ___','I want to learn English because ___',
  'It is lunchtime, so ___','English is hard, but ___','I am happy today because ___','The bell rings, so ___',
  'I have homework, so ___','I go to the library because ___','My friend is from another country, but ___'
 ]
}
};
