/* Word lists for /readings/say/ (and for the Words tab inside /describe/).
   One list per set. Each deck: k (id), name, e (emoji), items. An item is a word or phrase.
   Link to a set from any activity: /readings/say/?set=NAME   */
window.SAY_SETS={
  describe:{ title:'Describe a Classmate', back:'/readings/describe/', decks:[
  {k:'hair', name:'Hair', e:'💇', items:['hair','blond hair','brown hair','black hair','red hair','gray hair','orange hair','short hair','medium hair','long hair','straight hair','wavy hair','curly hair']},
  {k:'eyes', name:'Eyes', e:'👀', items:['eyes','blue eyes','brown eyes','black eyes','green eyes','glasses']},
  {k:'body', name:'Tall, short…', e:'🧍', items:['tall','short','tall or short','young','old','young or old','athletic','artistic','friendly','shy','a student']},
  {k:'traits', name:'Traits', e:'🙂', items:['loud','quiet','musical','dramatic','hardworking','lazy','nice','cruel','generous','selfish','playful','serious','peaceful','aggressive','proud','humble']},
  {k:'verbs', name:'Reasons', e:'💬', items:['because','shares','does not share','food','does','does not do','homework','talks','does not talk','to new people','plays','soccer','soccer every day','draws','pictures','the guitar','fights','does not fight','with people','helps','friends','shouts','does not shout','in class']},
  {k:'compare', name:'Same / different', e:'⚖️', items:['both','same','different','is like','but','and','the dog','the cat','cute','white','black and white','four legs','an animal','first','then','next','also','finally']},
  {k:'heroes', name:'Comet & Mischief', e:'🦸', items:['a red cape','a purple hat','a mask','orange hair','serious','playful']},
  {k:'questions', name:'Questions', e:'❓', items:['Do you have','Are you','Do you have blue eyes?','Are you tall or short?','Are you friendly or shy?']}
] },
  pronouns:{ title:'Pronouns', back:'', decks:[
    {k:'pron', name:'Pronouns', e:'🧑', items:['I','you','he','she','it','we','they']},
    {k:'hard', name:'Sounds alike', e:'👂', items:['he','she','see','they','there','day','we','be']},
    {k:'sent', name:'Sentences', e:'💬', items:['I am a student.','You are a student.','He is a boy.','She is a girl.','It is a book.','We are students.','They are friends.']}
  ] },
  indigenous:{ title:'Indigenous Peoples\u2019 Day', back:'/readings/indigenous/', decks:[
    {k:'holiday', name:'The holiday', e:'📅', items:['holiday','no school','celebrate','Columbus Day','Indigenous Peoples\u2019 Day','Christopher Columbus']},
    {k:'history', name:'Hard history', e:'🌎', items:['indigenous','indigenous people','Native Americans','North America','Europe','disease','diseases','killed','weapon','weapons','genocide','angry']},
    {k:'rigoberta', name:'Rigoberta Menchú', e:'✊', items:['Rigoberta Menchú','Guatemala','equality','fair treatment','rights','protest','protested','protesters','army','wrote a book','problems','forced','Nobel Peace Prize']},
    {k:'sent', name:'Sentences', e:'💬', items:['Monday is a holiday.','There is no school.','Indigenous people lived here first.','The diseases killed millions of people.','Some people are angry.','She fights for equality.','The army tried to kill her.','She won the Nobel Peace Prize.']}
  ] },
  firstpeoples:{ title:'Indigenous Peoples\u2019 Day (101)', back:'/readings/indigenous101/', decks:[
    {k:'people', name:'People', e:'🌎', items:['first peoples','indigenous people','the Ohlone','Europeans','Columbus']},
    {k:'past', name:'Past tense', e:'⏮️', items:['lived','came','died','killed','took','They lived here first.','Columbus came in 1492.','Many people died.']},
    {k:'feel', name:'Feelings', e:'😊', items:['happy','sad','angry','It\u2019s complicated.']},
    {k:'today', name:'Today', e:'📅', items:['holiday','celebrate','remember','respect','We respect all people.','Indigenous Peoples\u2019 Day']}
    ] },
  'people-at-school':{ title:'People at School', back:'/readings/launch-plus/u1-l1/', decks:[
    {k:'jobs', name:'Jobs', e:'🏫', items:['custodian','security guard','secretary','nurse','substitute teacher','coach','dean']},
    {k:'does', name:'What they do', e:'🛠️', items:['cleans the building','fixes small things','keeps the school safe','checks the doors','works in the office','answers the phone','keeps records','helps students who are sick or hurt','teaches a class','when the regular teacher is absent','trains a sports team','handles behavior','student discipline']},
    {k:'sent', name:'Sentences', e:'💬', items:['A custodian cleans the building and fixes small things.','A security guard keeps the school safe and checks the doors.','A secretary works in the office, answers the phone, and keeps records.','A nurse helps students who are sick or hurt.','A substitute teacher teaches a class when the regular teacher is absent.','A coach trains a sports team.','A dean handles behavior and student discipline.']}
    ] },
  introductions:{ title:'Introductions', back:'/readings/launch-plus/u1-l2/', decks:[
    {k:'words', name:'Words', e:'🪪', items:['name','introduce','meet','language','hello','goodbye','thank you']},
    {k:'phrases', name:'Phrases', e:'💬', items:['Nice to meet you.','What is your name?','My name is Ana.','Where are you from?','I am from Guatemala.','Excuse me.','You\u2019re welcome.','See you tomorrow.']},
    {k:'sent', name:'Sentences', e:'📝', items:['I speak Spanish at home.','English is a new language for me.','The teacher says hello.','Let me introduce my friend.','We meet new friends every day.','Thank you for your help.','We say goodbye at the bus stop.']}
    ] },
  'people-at-school-2':{ title:'People at School · Extras', back:'/readings/launch-plus/u1-l1x/', decks:[
    {k:'who', name:'He / She / They', e:'🧑', items:['He is a custodian.','She is a nurse.','They are nurses.','He is a coach.','She is the secretary.','They are teachers.','It is a big school.']},
    {k:'where', name:'Where?', e:'📍', items:['She is in the Main Office.','She is in the nurse\u2019s office.','She is in the library.','He is in the gym.','She is in the cafeteria.','He is in the hallway.','She is in the Counseling Office.','He is in the classroom.']},
    {k:'names', name:'Names', e:'🏫', items:['Ms. Brown','Ms. Shah','Dr. Bloemsma','Ms. Avar','Ms. Bettie','Galileo','San Francisco']}
    ] },
  'from-a-to-z':{ title:'From A to Z', back:'/readings/launch-plus/u1-l3/', decks:[
    {k:'words', name:'Words', e:'🔤', items:['letter','alphabet','uppercase','lowercase','spell','vowel','consonant']},
    {k:'spell', name:'Spell it', e:'✏️', items:['C-H-R-I-S','M-A-R-I-A','O-M-A-R','A-N-D-I','T-H-A-N']},
    {k:'sent', name:'Sentences', e:'💬', items:['How do you spell your name?','I spell my name C-H-R-I-S.','The C is uppercase.','Could you please repeat that?','My name begins with the letter M.','The alphabet has 26 letters.']}
  ] }
};
