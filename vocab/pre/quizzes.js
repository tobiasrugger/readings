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
  }

];
