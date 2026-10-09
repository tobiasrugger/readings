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
  ] }
};
