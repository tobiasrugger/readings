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
  },

  {
    id: 'u1-l6-people',
    title: 'People and Jobs',
    tag: 'Unit 1, Lesson 6',
    emoji: '🧑‍🏫',
    items: [
      { e:'🧑‍🏫', w:'teacher',        opts:['student','doctor','driver'] },
      { e:'🧑‍🎓', w:'student',        opts:['teacher','nurse','farmer'] },
      { e:'👩‍⚕️', w:'nurse',          opts:['teacher','cook','police officer'] },
      { e:'🧑‍🍳', w:'cook',           opts:['farmer','waiter','doctor'] },
      { e:'👮', w:'police officer',  opts:['firefighter','driver','nurse'] },
      { e:'🧑‍🔬', w:'scientist',      opts:['artist','teacher','singer'] },
      { e:'🧑‍🎨', w:'artist',         opts:['scientist','writer','dancer'] },
      { e:'🧑‍🌾', w:'farmer',         opts:['cook','builder','driver'] },
      { e:'🧑‍✈️', w:'pilot',          opts:['driver','sailor','soldier'] },
      { e:'🧑‍🔧', w:'mechanic',       opts:['builder','cleaner','waiter'] }
    ]
  },

  {
    id: 'u1-l9-places',
    title: 'Places',
    tag: 'Unit 1, Lesson 9',
    emoji: '🏫',
    items: [
      { e:'🏫', w:'school',      opts:['house','store','hospital'] },
      { e:'📚', w:'library',     opts:['bank','school','park'] },
      { e:'🏥', w:'hospital',    opts:['school','store','bank'] },
      { e:'🏪', w:'store',       opts:['restaurant','library','park'] },
      { e:'🏞️', w:'park',        opts:['beach','school','street'] },
      { e:'🏠', w:'house',       opts:['school','store','office'] },
      { e:'🏦', w:'bank',        opts:['hospital','library','store'] },
      { e:'🍽️', w:'restaurant',  opts:['store','park','bank'] },
      { e:'📮', w:'post office', opts:['bank','library','hospital'] },
      { e:'🚏', w:'bus stop',    opts:['train station','airport','parking lot'] }
    ]
  },

  {
    id: 'u2-l12-seasons',
    title: 'Seasons and Memories',
    tag: 'Unit 2, Lesson 12',
    emoji: '🍂',
    items: [
      { e:'⛄', w:'winter',    opts:['summer','spring','fall'] },
      { e:'🌷', w:'spring',    opts:['winter','fall','summer'] },
      { e:'🏖️', w:'summer',    opts:['winter','spring','fall'] },
      { e:'🍂', w:'fall',      opts:['spring','summer','winter'] },
      { e:'✈️', w:'vacation',  opts:['homework','practice','meeting'] },
      { e:'🎉', w:'party',     opts:['class','game','trip'] },
      { e:'🎂', w:'birthday',  opts:['holiday','weekend','vacation'] },
      { e:'⛺', w:'camping',   opts:['shopping','swimming','cooking'] },
      { e:'🧺', w:'picnic',    opts:['party','breakfast','game'] },
      { e:'🎆', w:'fireworks', opts:['candles','stars','music'] }
    ]
  },

  {
    id: 'u2-l13-senses',
    title: 'Setting the Scene',
    tag: 'Unit 2, Lesson 13',
    emoji: '👀',
    items: [
      { e:'👁️', w:'see',    opts:['hear','smell','touch'] },
      { e:'👂', w:'hear',   opts:['see','taste','smell'] },
      { e:'👃', w:'smell',  opts:['taste','hear','see'] },
      { e:'👅', w:'taste',  opts:['smell','touch','hear'] },
      { e:'✋', w:'touch',  opts:['see','hear','taste'] },
      { e:'📢', w:'loud',   opts:['quiet','soft','slow'] },
      { e:'🤫', w:'quiet',  opts:['loud','fast','bright'] },
      { e:'🍯', w:'sweet',  opts:['sour','salty','spicy'] },
      { e:'🍋', w:'sour',   opts:['sweet','salty','hot'] },
      { e:'🧊', w:'cold',   opts:['hot','wet','heavy'] }
    ]
  },

  {
    id: 'u1-l13-directions',
    title: 'Getting Around School',
    tag: 'Unit 1, Lesson 13',
    emoji: '🧭',
    items: [
      { s:'The library is on the second floor. Go ____.',                        w:'upstairs',  opts:['downstairs','outside','through'] },
      { s:'The cafeteria is on the first floor. We are on the third floor. Go ____.', w:'downstairs', opts:['upstairs','inside','straight'] },
      { s:'It is raining. Please come ____ the building.',                       w:'inside',    opts:['outside','upstairs','around'] },
      { s:'We eat lunch ____ at the tables in the schoolyard.',                  w:'outside',   opts:['inside','upstairs','under'] },
      { s:'Do not turn. Walk ____ to the end of the hallway.',                   w:'straight',  opts:['left','right','back'] },
      { s:'Your locker is number 12. Turn ____ at the water fountain, then look for 12.', w:'left', opts:['straight','back','up'] },
      { s:'The office door is on your ____ hand, next to the big window.',       w:'right',     opts:['straight','down','under'] },
      { s:'Walk ____ the double doors and you will see the gym.',                w:'through',   opts:['around','over','under'] },
      { s:'The nurse is ____ to the office. The two doors are together.',        w:'next',      opts:['far','behind','under'] },
      { s:'Room 210 is ____ room 209 and room 211.',                             w:'between',   opts:['behind','under','next'] }
    ]
  },

  {
    id: 'u2-l1-greetings',
    title: 'Getting to Know You',
    tag: 'Unit 2, Lesson 1',
    emoji: '👋',
    items: [
      { s:'You see your friend in the morning. You say, "____!"',                w:'hello',      opts:['goodbye','sorry','please'] },
      { s:'Class is over and you are leaving. You say, "____."',                 w:'goodbye',    opts:['hello','welcome','excuse me'] },
      { s:'Your teacher helps you. You say, "____."',                            w:'thank you',  opts:['goodbye','no problem','see you'] },
      { s:'You want a pencil from your friend. You say, "Can I have a pencil, ____?"', w:'please', opts:['thanks','sorry','again'] },
      { s:'A new student comes to class. You say your name. You ____ yourself.', w:'introduce',  opts:['remember','practice','finish'] },
      { s:'Today I ____ three new students in my class.',                        w:'met',        opts:['make','made','meeting'] },
      { s:'"What is your ____?" "It is Ana Reyes."',                             w:'name',       opts:['class','country','number'] },
      { s:'My first name is Ana. My ____ name is Reyes.',                        w:'last',       opts:['best','new','long'] },
      { s:'Beto and I eat lunch ____ every day. We sit at the same table.',      w:'together',   opts:['alone','again','early'] },
      { s:'I am from Guatemala. Guatemala is my ____.',                          w:'country',    opts:['city','school','language'] }
    ]
  },

  {
    id: 'u2-l2-names',
    title: 'You Can Call Me . . .',
    tag: 'Unit 2, Lesson 2',
    emoji: '🗣️',
    items: [
      { s:'My name is Giovani, but my friends call me Gio. Gio is my ____.',     w:'nickname',  opts:['last name','country','answer'] },
      { s:'"How do you say your name?" "Say it like this: Gee-o-von-ee." She helps me ____ it.', w:'pronounce', opts:['spell','write','forget'] },
      { s:'The answer is Giovani, not Govani. Giovani is ____.',                 w:'correct',   opts:['wrong','late','easy'] },
      { s:'The teacher wrote Govani on the paper. That is ____.',                w:'wrong',     opts:['correct','ready','new'] },
      { s:'I met her last week and I still know her name. I ____ it.',           w:'remember',  opts:['forget','ask','repeat'] },
      { s:'I met him one time, and now I do not know his name. I ____ it.',      w:'forget',    opts:['remember','know','learn'] },
      { s:'"How do you ____ your name?" "R-E-Y-E-S."',                           w:'spell',     opts:['pronounce','call','write'] },
      { s:'I did not hear you. Can you ____ that, please?',                      w:'repeat',    opts:['remember','spell','start'] },
      { s:'My name is Roberto, but you can ____ me Beto.',                       w:'call',      opts:['spell','ask','meet'] },
      { s:'I do not know the answer, so I ____ the teacher.',                    w:'ask',       opts:['tell','call','repeat'] }
    ]
  },

  {
    id: 'u2-l10-catching-up',
    title: 'Catching Up',
    tag: 'Unit 2, Lessons 9 and 10',
    emoji: '🤝',
    items: [
      { s:'My little brother cannot do his math. I ____ him.',                   w:'help',     opts:['win','visit','finish'] },
      { s:'The soccer team needs one more player, so I ____ the team.',          w:'join',     opts:['leave','watch','win'] },
      { s:'My grandmother lives across town. On Sunday we ____ her.',            w:'visit',    opts:['call','miss','meet'] },
      { s:'Our team played very well. We ____ the game, 3 to 1.',                w:'won',      opts:['lost','played','watched'] },
      { s:'I did all ten math problems. I am ____.',                             w:'finished', opts:['started','tired','ready'] },
      { s:'Something funny happened at lunch. Let me ____ you about it.',        w:'tell',     opts:['ask','hear','say'] },
      { s:'We are new here. On Saturday we walk around and ____ the city.',      w:'explore',  opts:['clean','wait','study'] },
      { s:'For art class I ____ a small house out of paper.',                    w:'made',     opts:['bought','found','wrote'] },
      { s:'After school I ____ time with my friends at the park.',               w:'spend',    opts:['take','give','keep'] },
      { s:'My cousin lives far away, so every Sunday I ____ her on the phone.',  w:'call',     opts:['visit','meet','see'] }
    ]
  },

  {
    id: 'tk3-compare',
    title: 'Compare Words',
    tag: 'Toolkit 3',
    emoji: '🟰',
    items: [
      { s:'Red and black ____ are colors.',                                   w:'both',       opts:['also','same','too'] },
      { s:'A circle is ____ a basketball. They are both round.',              w:'like',       opts:['for','than','with'] },
      { s:'Soccer and basketball are ____. Both are team sports.',            w:'similar',    opts:['different','opposite','strange'] },
      { s:'An important ____ between English class and history class is that both have essays.', w:'similarity', opts:['difference','contrast','problem'] },
      { s:'An important similarity ____ the two cities is the weather.',      w:'between',    opts:['about','under','across'] },
      { s:'Something that water and juice have in ____ is that both are liquids.', w:'common', opts:['same','together','equal'] },
      { s:'San Francisco and New York ____ many traits. Both are big and both are on the coast.', w:'share', opts:['keep','leave','lose'] },
      { s:'The two schools share the following ____: small classes, new books, and good teachers.', w:'traits', opts:['reasons','places','answers'] },
      { s:'Basketball is a sport, ____ as football is a sport.',              w:'just',       opts:['only','even','still'] },
      { s:'Ms. Walson is a teacher. Mr. Toby is ____ a teacher.',             w:'also',       opts:['never','almost','instead'] }
    ]
  },

  {
    id: 'tk3-contrast',
    title: 'Contrast Words',
    tag: 'Toolkit 3',
    emoji: '⚖️',
    items: [
      { s:'An apple is red, ____ a banana is yellow.',                        w:'but',        opts:['so','because','and'] },
      { s:'Apples and oranges are ____. An apple is red and an orange is orange.', w:'different', opts:['similar','same','equal'] },
      { s:'An important ____ between a tree and a rock is that a tree is alive.', w:'difference', opts:['similarity','example','answer'] },
      { s:'Plays and stories ____ because plays are performed and stories are not.', w:'differ', opts:['agree','belong','repeat'] },
      { s:'Ms. Julie is a woman, ____ Mr. Ben is a man.',                     w:'while',      opts:['during','since','until'] },
      { s:'____ Taylor Swift, who has wavy hair, Justin Bieber has straight hair.', w:'Unlike', opts:['Like','Without','Along'] },
      { s:'The most notable ____ is that a circle is round and a square has four sides.', w:'contrast', opts:['comparison','similarity','example'] },
      { s:'A circle is round, ____ a square has four sides.',                 w:'whereas',    opts:['therefore','because','also'] },
      { s:'My old school was small. ____, this school is very big.',          w:'However',    opts:['Also','Because','Finally'] },
      { s:'Galileo has more students ____ my old school.',                    w:'than',       opts:['then','that','from'] }
    ]
  },

  {
    id: 'tk3-frames',
    title: 'Compare and Contrast Frames',
    tag: 'Toolkit 3',
    emoji: '🧰',
    items: [
      { s:'Something that The Mission and Chinatown ____ is that both have many immigrants.', w:'have in common', opts:['are different because','differ from','are unlike'] },
      { s:'San Francisco and New York ____: big, on the coast, and many immigrants.', w:'share the following traits', opts:['have one difference','are not the same','differ because'] },
      { s:'____ a circle is round, whereas a square has four sides.',          w:'The most notable contrast is that', opts:['An important similarity is that','They have in common that','Both of them are'] },
      { s:'Ms. Walson ____ Mr. Toby because they both are teachers.',          w:'is like',      opts:['is unlike','differs from','is more than'] },
      { s:'Ms. Julie and Mr. Ben ____ Ms. Julie is a woman, while Mr. Ben is a man.', w:'differ because', opts:['are similar because','have in common that','are alike because'] },
      { s:'____ SFIHS, which is a small school, Galileo has more than 1,000 students.', w:'Unlike', opts:['Just as','Like','Along with'] },
      { s:'____, my old school was small. On the other hand, Galileo is very big.', w:'On the one hand', opts:['In the same way','For example','At the same time'] },
      { s:'My old school was small. ____, Galileo is very big.',               w:'On the other hand', opts:['In the same way','For this reason','Just as'] },
      { s:'Mr. Toby is an English teacher, ____ Ms. Donahue is an English teacher.', w:'just as', opts:['unlike','whereas','while'] },
      { s:'A Venn diagram shows similarities in the middle and ____ on the two sides.', w:'differences', opts:['similarities','examples','questions'] }
    ]
  }

];
