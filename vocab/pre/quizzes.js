/* =====================================================================
   PRE-ASSESSMENTS
   Each quiz is 10 questions. One emoji per question, four words to pick from.

   To add a quiz, copy a block and change it:

     { id:'u1-l9-places',                  // short name, no spaces. Goes in the link: ?q=u1-l9-places
       title:'Places at School',           // what students see
       tag:'Unit 1, Lesson 9',             // where it comes from
       emoji:'🏫',                          // shown on the menu
       items:[
         { e:'🏀', w:'gym', opts:['library','office','hallway'] },   // w = right answer, opts = the three wrong words
         ...ten of these...
       ]
     },

   Some words have no emoji (honest, tomorrow, responsible). Those use a sentence
   with a blank instead. Same quiz shape, but the item carries s: instead of e:

         { s:'Beto always tells the truth. Beto is ____.', w:'honest', opts:['brave','tired','funny'] },

   A quiz can mix both kinds of item.

   Rules I follow in these, worth keeping:
   - Answer choices stay lowercase. They are words, not sentences.
   - The three wrong words should be words a student could believe,
     but must not also fit the emoji.
   ===================================================================== */

window.QUIZZES = [

  {
    id: 'u1-l7-supplies',
    title: 'School Supplies',
    tag: 'Unit 1, Lesson 7',
    emoji: '🎒',
    items: [
      { e:'🎒', w:'backpack',   opts:['jacket','folder','locker'] },
      { e:'✏️', w:'pencil',     opts:['pen','ruler','paper'] },
      { e:'🖊️', w:'pen',        opts:['pencil','marker','eraser'] },
      { e:'📕', w:'book',       opts:['folder','notebook','poster'] },
      { e:'📓', w:'notebook',   opts:['book','calculator','backpack'] },
      { e:'🧮', w:'calculator', opts:['computer','clock','ruler'] },
      { e:'💻', w:'computer',   opts:['calculator','television','phone'] },
      { e:'📂', w:'folder',     opts:['book','backpack','notebook'] },
      { e:'📏', w:'ruler',      opts:['pencil','scissors','paper'] },
      { e:'✂️', w:'scissors',   opts:['ruler','glue','pen'] }
    ]
  },

  {
    id: 'u2-l5-weather',
    title: 'Weather Report',
    tag: 'Unit 2, Lesson 5',
    emoji: '🌦️',
    items: [
      { e:'☀️', w:'sunny',       opts:['cloudy','windy','snowy'] },
      { e:'🌧️', w:'rainy',       opts:['sunny','snowy','hot'] },
      { e:'☁️', w:'cloudy',      opts:['rainy','sunny','windy'] },
      { e:'🌬️', w:'windy',       opts:['cloudy','rainy','cold'] },
      { e:'❄️', w:'snowy',       opts:['rainy','sunny','windy'] },
      { e:'🥵', w:'hot',         opts:['cold','tired','wet'] },
      { e:'🥶', w:'cold',        opts:['hot','sad','sick'] },
      { e:'🌡️', w:'temperature', opts:['weather','season','clock'] },
      { e:'⛈️', w:'storm',       opts:['cloudy','sunny','fog'] },
      { e:'🌈', w:'rainbow',     opts:['sunset','star','cloud'] }
    ]
  },

  {
    id: 'u2-l11-feelings',
    title: 'How I Feel',
    tag: 'Unit 2, Lesson 11',
    emoji: '😀',
    items: [
      { e:'😀', w:'happy',       opts:['sad','angry','tired'] },
      { e:'😢', w:'sad',         opts:['happy','proud','hungry'] },
      { e:'😠', w:'angry',       opts:['afraid','happy','sleepy'] },
      { e:'😨', w:'afraid',      opts:['angry','excited','bored'] },
      { e:'😬', w:'nervous',     opts:['proud','cold','funny'] },
      { e:'😕', w:'confused',    opts:['proud','hungry','ready'] },
      { e:'😳', w:'embarrassed', opts:['excited','strong','busy'] },
      { e:'😌', w:'proud',       opts:['nervous','hungry','lost'] },
      { e:'😴', w:'tired',       opts:['hungry','angry','afraid'] },
      { e:'🤩', w:'excited',     opts:['tired','sad','quiet'] }
    ]
  },

  {
    id: 'u2-l7-clothes',
    title: 'What to Wear',
    tag: 'Unit 2, Lesson 7',
    emoji: '👕',
    items: [
      { e:'👕', w:'shirt',   opts:['jacket','dress','socks'] },
      { e:'👖', w:'pants',   opts:['shirt','shoes','scarf'] },
      { e:'👗', w:'dress',   opts:['shirt','jacket','hat'] },
      { e:'🧥', w:'jacket',  opts:['shirt','dress','gloves'] },
      { e:'👟', w:'shoes',   opts:['socks','pants','hat'] },
      { e:'👓', w:'glasses', opts:['hat','scarf','watch'] },
      { e:'🧢', w:'hat',     opts:['glasses','shoes','jacket'] },
      { e:'🧦', w:'socks',   opts:['shoes','gloves','shirt'] },
      { e:'🧣', w:'scarf',   opts:['gloves','pants','hat'] },
      { e:'🧤', w:'gloves',  opts:['socks','scarf','shoes'] }
    ]
  },

  {
    id: 'u1-l12-lunch',
    title: 'Lunch Food',
    tag: 'Unit 1, Lesson 12',
    emoji: '🍎',
    items: [
      { e:'🍎', w:'apple',    opts:['banana','bread','rice'] },
      { e:'🍌', w:'banana',   opts:['apple','cookie','salad'] },
      { e:'🥪', w:'sandwich', opts:['pizza','salad','bread'] },
      { e:'🍕', w:'pizza',    opts:['sandwich','chicken','rice'] },
      { e:'🥛', w:'milk',     opts:['water','juice','soup'] },
      { e:'🍚', w:'rice',     opts:['bread','salad','beans'] },
      { e:'🍗', w:'chicken',  opts:['fish','eggs','rice'] },
      { e:'🥗', w:'salad',    opts:['soup','sandwich','fruit'] },
      { e:'🍞', w:'bread',    opts:['rice','cheese','cake'] },
      { e:'🍪', w:'cookie',   opts:['bread','apple','candy'] }
    ]
  },

  {
    id: 'u2-l8-habits',
    title: 'Everyday Habits',
    tag: 'Unit 2, Lesson 8',
    emoji: '⏰',
    items: [
      { e:'⏰', w:'wake up',        opts:['go to sleep','sit down','come back'] },
      { e:'🪥', w:'brush my teeth', opts:['wash my hands','comb my hair','eat lunch'] },
      { e:'🚿', w:'take a shower',  opts:['wash my hands','go swimming','make dinner'] },
      { e:'🧼', w:'wash',           opts:['sleep','write','drive'] },
      { e:'🍽️', w:'eat',            opts:['cook','drink','clean'] },
      { e:'🏃', w:'exercise',       opts:['sleep','study','wait'] },
      { e:'📝', w:'do homework',    opts:['make dinner','play outside','take the bus'] },
      { e:'📺', w:'watch TV',       opts:['read a book','play music','ride a bike'] },
      { e:'🚌', w:'take the bus',   opts:['walk to school','ride a bike','wake up'] },
      { e:'😴', w:'go to sleep',    opts:['wake up','get dressed','run'] }
    ]
  },

  {
    id: 'u1-l10-subjects',
    title: 'School Subjects',
    tag: 'Unit 1, Lesson 10',
    emoji: '📐',
    items: [
      { e:'➗', w:'math',               opts:['science','history','music'] },
      { e:'🔬', w:'science',            opts:['math','art','English'] },
      { e:'🎨', w:'art',                opts:['music','drama','science'] },
      { e:'🎼', w:'music',              opts:['art','drama','math'] },
      { e:'🏃', w:'physical education', opts:['health','drama','science'] },
      { e:'💻', w:'computer science',   opts:['math','art','English'] },
      { e:'🏛️', w:'history',            opts:['science','math','music'] },
      { e:'🗺️', w:'social studies',     opts:['science','math','art'] },
      { e:'🔤', w:'English',            opts:['math','music','science'] },
      { e:'🎭', w:'drama',              opts:['art','music','history'] }
    ]
  },

  {
    id: 'u2-l6-freetime',
    title: 'Common Ground',
    tag: 'Unit 2, Lesson 6',
    emoji: '💃',
    items: [
      { e:'💃', w:'dance',       opts:['sing','swim','cook'] },
      { e:'🎤', w:'sing',        opts:['dance','talk','read'] },
      { e:'👨‍🍳', w:'cook',        opts:['eat','clean','shop'] },
      { e:'🚲', w:'ride a bike', opts:['drive a car','take the bus','run'] },
      { e:'🏊', w:'swim',        opts:['run','dance','sleep'] },
      { e:'📖', w:'read',        opts:['write','draw','sing'] },
      { e:'⚽', w:'play soccer',  opts:['play music','watch a movie','go shopping'] },
      { e:'📷', w:'take photos', opts:['draw pictures','write stories','play games'] },
      { e:'⌨️', w:'code',         opts:['type a letter','play a game','call a friend'] },
      { e:'🎬', w:'watch movies',opts:['read books','play sports','make food'] }
    ]
  },

  {
    id: 'u2-l3-strengths',
    title: 'My Strengths',
    tag: 'Unit 2, Lesson 3',
    emoji: '💪',
    items: [
      { s:'Ana asks many questions. She wants to know about everything. Ana is ____.', w:'curious',       opts:['honest','tired','quiet'] },
      { s:'Beto always tells the truth. Beto is ____.',                                 w:'honest',        opts:['brave','funny','hungry'] },
      { s:'Mia writes stories about dragons and other worlds. Mia is ____.',            w:'imaginative',   opts:['studious','nervous','late'] },
      { s:'Lin sees a sad student, so she sits with her. Lin is ____.',                 w:'kind',          opts:['busy','loud','strong'] },
      { s:'Ken carries books for the teacher every day. Ken is ____.',                  w:'helpful',       opts:['curious','angry','shy'] },
      { s:'Ana does her homework every night. She is never late. Ana is ____.',         w:'responsible',   opts:['funny','hungry','new'] },
      { s:'Tom reads and studies for two hours every day. Tom is ____.',                w:'studious',      opts:['sleepy','loud','hungry'] },
      { s:'Lila is afraid, but she speaks in front of the class. Lila is ____.',        w:'brave',         opts:['shy','tired','angry'] },
      { s:'Max likes to work with other students in a group. Max is ____.',             w:'collaborative', opts:['quiet','early','cold'] },
      { s:'Nina makes art with paper, paint, and old boxes. Nina is ____.',             w:'creative',      opts:['strong','late','cold'] }
    ]
  },

  {
    id: 'u2-l4-dates',
    title: 'Save the Date',
    tag: 'Unit 2, Lesson 4',
    emoji: '📅',
    items: [
      { s:'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. These seven days are one ____.', w:'week',     opts:['month','year','day'] },
      { s:'January, February, and March. Each one is a ____.',                                             w:'month',    opts:['week','day','year'] },
      { s:'2026 is this ____.',                                                                            w:'year',     opts:['month','week','day'] },
      { s:'It is Tuesday. I am at school now. ____ is Tuesday.',                                           w:'today',    opts:['yesterday','tomorrow','tonight'] },
      { s:'It is Tuesday. Monday was ____.',                                                               w:'yesterday',opts:['today','tomorrow','next week'] },
      { s:'It is Tuesday. Wednesday is ____.',                                                             w:'tomorrow', opts:['today','yesterday','last week'] },
      { s:'I look at the ____ to see the days and the months.',                                            w:'calendar', opts:['clock','map','book'] },
      { s:'I was born on May 12. May 12 is my ____.',                                                      w:'birthday', opts:['vacation','address','name'] },
      { s:'Saturday and Sunday are the ____.',                                                             w:'weekend',  opts:['morning','holiday','summer'] },
      { s:'Class begins at 9:00. We ____ at 9:00.',                                                        w:'start',    opts:['finish','wait','leave'] }
    ]
  }

];
