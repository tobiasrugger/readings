/* readings/thanksgiving-103/content.js — T-499 (Nov 20 2026). ELD 103 parallel of the ELD 101 Thanksgiving reading
   (readings/thanksgiving/). Same three families (Mark, the Lees, Andre), rewritten longer and more real: personal
   questions, politics at the table, a new baby, grandparents who immigrated. Less scaffolding: word meanings instead of
   listen-and-tap, inference questions, a "why" sentence after each part, two paragraphs. Saves to eld103_donow,
   unit 'thanksgiving-103'. Pictures come from /readings/thanksgiving/art.js (scenes) + art103.js (new words). */
(function () {
  var T = window.TG = { TABLE: 'eld103_donow', UNIT: 'thanksgiving-103', SLUG: 'thanksgiving-103', LEVEL: 103 };

  T.LOOK = {
    see: ['a family dinner', 'a big turkey', 'a grandmother with glasses', 'a “thank you” sign', 'autumn trees'],
    won: ['everyone is smiling.', 'some people look tired.', 'nobody is on their phone.'],
    think: 'Is a big family dinner always happy? What can make it stressful?'
  };

  T.WORDS = [
    { w: 'grateful', d: 'thankful; happy for what you have', s: 'Thanksgiving is a day to say what you are grateful for.', art: 'grateful' },
    { w: 'relatives', d: 'people in your family: aunts, uncles, cousins, grandparents', s: 'Many relatives travel to be together.', art: 'grandparents' },
    { w: 'tradition', d: 'something a family or group does again every year', s: 'Spicy pikliz on the turkey is now a family tradition.', art: 'tradition' },
    { w: 'nag', d: 'ask or tell someone the same thing again and again, in an annoying way', s: 'Every year, Aunt Rosa nags Mark about girlfriends.', art: 'nag' },
    { w: 'awkward', d: 'uncomfortable; you do not know what to say', s: 'The table goes quiet. It is very awkward.', art: 'awkward' },
    { w: 'argue', d: 'talk in an angry way because you do not agree', s: 'Grandpa and Uncle Dave argue about politics.', art: 'argue' },
    { w: 'change the subject', d: 'start talking about something different', s: 'Mark changes the subject to football.', art: 'subject' },
    { w: 'exhausted', d: 'very, very tired', s: 'Ellen is exhausted. The baby wakes up every two hours.', art: 'exhausted' },
    { w: 'immigrate', d: 'move to a new country to live there', s: 'Andre’s grandparents immigrated from Haiti in 1985.', art: 'immigrate' },
    { w: 'leftovers', d: 'food that is not eaten at a meal; you eat it later', s: 'The next day, they eat leftovers: turkey sandwiches.', art: 'leftovers' }
  ];

  T.PARTS = [
    { id: 'p1', title: 'Thanksgiving in the United States', art: 'table',
      paras: [
        ['There is no school next week because of Thanksgiving.', 'Thanksgiving is on the fourth Thursday of November.', 'It is one of the most important holidays in the United States, and the day before it is one of the busiest travel days of the year.', 'Millions of people take planes, trains and cars to be with their relatives.'],
        ['The center of the day is a big dinner.', 'Many families eat turkey, cranberry sauce, mashed potatoes and pumpkin pie.', 'Before they eat, some families go around the table, and each person says one thing they are grateful for.'],
        ['The holiday started with a harvest meal in 1621, when English settlers (the Pilgrims) and Wampanoag people ate together in what is now Massachusetts.', 'But the story is not simple.', 'For many Native Americans, Thanksgiving is also a sad day, a day to remember the land and the lives their people lost.'],
        ['Thanksgiving is about being grateful, but it can also be stressful.', 'Relatives ask personal questions.', 'People argue about politics.', 'Parents are tired.', 'Today you will read about three families and what really happens at their Thanksgiving.']
      ] },
    { id: 'p2', title: 'Family #1: Mark’s family', art: 'mark',
      paras: [
        ['My name is Mark, and I am sixteen.', 'Every year we eat Thanksgiving dinner in my grandparents’ dining room at 6:00 p.m., and every year it starts the same way.', 'My father carves the turkey, my grandmother brings her cranberry sauce, and my Aunt Rosa looks at me across the table and says, “So, Mark, do you have a girlfriend yet?”'],
        ['Everyone laughs, and my face turns red.', 'She nags me about it every single year.', 'This year I was ready.', 'I said, “Not yet, but did you see the 49ers game?” and changed the subject to football.', 'It worked for about two minutes.'],
        ['Then my grandfather and my Uncle Dave started to argue about the election.', 'Their voices got louder and louder.', 'It was really awkward, and my little sister looked at her plate.', 'Finally my grandmother put down her fork and said, “Not at the table. Pass the potatoes, please.”', 'Everyone was quiet, and then my uncle passed the potatoes.'],
        ['After dinner, my mother talked on the phone with her sisters, and my father and grandfather watched football in the living room like nothing happened.', 'My grandmother and I washed the dishes in the kitchen.', 'I put my phone in my jacket, and she told me stories about her first job when she was my age.', 'I love pumpkin pie, but I think I love this part of Thanksgiving more.']
      ] },
    { id: 'p3', title: 'Family #2: The Lee family', art: 'lee',
      paras: [
        ['This is the Lee family’s first Thanksgiving with their new daughter, Courtney.', 'Courtney is three months old, and she wakes up every two hours, all night.', 'John and Ellen Lee are exhausted.', 'This year they decided to have dinner at home, in their small kitchen, because traveling with a baby felt impossible.'],
        ['John’s father came early to cook the turkey.', 'Ellen made rice and a big salad, using her mother’s recipe.', 'John’s two brothers came too, and they had a lot of advice.', '“You should let her cry.”', '“You should never let her cry.”', '“Did you try music?”'],
        ['Ellen smiled, but she was annoyed.', 'She did not want to argue on Thanksgiving, so she said nothing.', 'John noticed.', 'He took Courtney, walked with her, and said to his brothers, “Thanks, guys. We are figuring it out.”', 'Ellen looked at him and mouthed, “Thank you.”'],
        ['Before they ate, they went around the table.', 'John’s father said he was grateful to be a grandfather.', 'After dinner, they played cards in the living room from 7:00 p.m. to 11:00 p.m., and for the first time in three months, Courtney slept for four hours.', 'Ellen said it was the best gift of the year.']
      ] },
    { id: 'p4', title: 'Family #3: Andre’s family', art: 'andre',
      paras: [
        ['My name is Andre, and I think Thanksgiving is the best holiday.', 'We always go to my grandparents’ house.', 'My grandparents immigrated from Haiti in 1985.', 'Every year, my grandfather tells the story of their first Thanksgiving in Brooklyn.', 'A neighbor gave them a turkey, and they had no idea what to do with it!'],
        ['So my grandmother cooked it the Haitian way, with epis, a green sauce of garlic, peppers and herbs.', 'She served it with pikliz, a very spicy pickled cabbage.', 'Now that is our family tradition.', 'My cousins say our turkey is better than anyone’s.'],
        ['This year at dinner, my older sister asked me about college.', '“Where are you applying?', 'What do you want to study?”', 'I am only fifteen, and I felt a lot of pressure.', 'My grandmother saw my face and said, “Leave him alone. Eat first, worry later.”'],
        ['After dinner, my father relaxed in the living room, and my grandmother and mother sang old songs in the kitchen.', 'My grandfather, my brother, my sister and I played basketball outside.', 'My grandfather is seventy-two, and he is very competitive.', 'He still beat us.', 'The next day, we ate leftovers: turkey sandwiches with pikliz.']
      ] }
  ];

  /* four checks per part; o[0] is right (options shuffled per student) */
  T.MC = {
    p1: [
      { q: 'When is Thanksgiving?', o: ['the fourth Thursday of November', 'the last Friday of November', 'the first Monday of December'], h: ['Look at the first paragraph.'] },
      { q: 'Why is the day before Thanksgiving so busy?', o: ['Millions of people travel to see their relatives.', 'Everyone goes shopping for presents.', 'Schools have their final tests.'], h: ['Look for the word travel.'] },
      { q: 'Why is Thanksgiving also a sad day for many Native Americans?', o: ['They remember the land and lives their people lost.', 'They do not like turkey.', 'They have to work on that day.'], h: ['Read the third paragraph again.'] },
      { q: 'What does the writer say about Thanksgiving in the last paragraph?', o: ['It is about being grateful, but it can also be stressful.', 'It is always relaxing and easy.', 'It is only for children.'], h: ['Find the word but.'] }
    ],
    p2: [
      { q: 'What does Aunt Rosa ask Mark every year?', o: ['if he has a girlfriend', 'what he wants to study', 'if he can cook the turkey'], h: ['Look at the end of the first paragraph.'] },
      { q: 'Why does Mark talk about the 49ers game?', o: ['He wants to change the subject.', 'He loves to talk to his aunt about football.', 'His father asked him about the game.'], h: ['Mark was ready this year. What did he want to stop?'] },
      { q: 'What does Grandmother mean by “Not at the table”?', o: ['Stop arguing during dinner.', 'Do not put your plate on the table.', 'Go eat in the kitchen.'], h: ['What were Grandpa and Uncle Dave doing?'] },
      { q: 'What is Mark’s favorite part of Thanksgiving?', o: ['washing dishes and talking with his grandmother', 'eating pumpkin pie', 'watching football with his father'], h: ['Read the last sentence carefully.'] }
    ],
    p3: [
      { q: 'Why are John and Ellen exhausted?', o: ['The baby wakes up every two hours.', 'They traveled a long way.', 'They cooked all night.'], h: ['Look at the first paragraph.'] },
      { q: 'How does Ellen feel about the brothers’ advice?', o: ['annoyed, but she says nothing', 'happy and grateful', 'angry, so she shouts at them'], h: ['She smiled, but…'] },
      { q: 'What does John do when he notices Ellen’s feelings?', o: ['He takes the baby and politely stops the advice.', 'He asks his brothers for more advice.', 'He leaves the house.'], h: ['John noticed. What did he do next?'] },
      { q: 'What is “the best gift of the year” for Ellen?', o: ['Courtney slept for four hours.', 'She won the card game.', 'Her mother sent a recipe.'], h: ['Look at the last two sentences.'] }
    ],
    p4: [
      { q: 'Where did Andre’s grandparents immigrate from?', o: ['Haiti', 'Brooklyn', 'Mexico'], h: ['Find the word immigrated.'] },
      { q: 'Why is spicy turkey a family tradition?', o: ['The grandmother cooked their first turkey the Haitian way, and they still do it.', 'The neighbor told them to cook it that way.', 'Andre saw it on a cooking show.'], h: ['Read the second paragraph.'] },
      { q: 'What does “Eat first, worry later” mean?', o: ['Stop asking Andre stressful questions now.', 'Andre should eat fast.', 'Andre is not hungry.'], h: ['Andre felt a lot of pressure about college.'] },
      { q: 'Which word best describes Andre’s grandfather?', o: ['competitive', 'shy', 'exhausted'], h: ['He is seventy-two and he still beat them.'] }
    ]
  };
  T.MC_IDS = [];
  ['p1', 'p2', 'p3', 'p4'].forEach(function (p) { T.MC[p].forEach(function (_, i) { T.MC_IDS.push(p + '.' + i); }); });

  /* word meanings: read the word, tap its meaning (built from WORDS) */
  T.MC.w = T.WORDS.map(function (w, i) {
    var others = T.WORDS.filter(function (_, k) { return k !== i; });
    var a = others[(i * 3 + 1) % others.length].d, b = others[(i * 7 + 4) % others.length].d;
    if (a === b) b = others[(i + 2) % others.length].d;
    return { q: 'What does “' + w.w + '” mean?', o: [w.d, a, b], h: ['Read the sentence on the word card: ' + w.s] };
  });
  T.W_IDS = T.WORDS.map(function (_, i) { return 'w.' + i; });

  /* one "why" sentence after each family part (Mr. Toby marks them) */
  T.WHY = {
    p2: { k: 'y2', q: 'Why do you think Mark loves washing the dishes more than eating pie?', st: 'I think Mark loves washing the dishes because ___.', min: 8 },
    p3: { k: 'y3', q: 'Was it a good idea for Ellen to say nothing? Why or why not?', st: 'I think it was a good / bad idea because ___.', min: 8 },
    p4: { k: 'y4', q: 'Why do you think the grandfather tells the same story every year?', st: 'I think he tells the story because ___.', min: 8 }
  };
  /* Part B: writing */
  T.QS = [
    { k: 'q1', q: 'Which family is most like your family? Explain with two details from the story.', st: 'My family is most like ___’s family because ___. For example, ___. Also, ___.', min: 25 },
    { k: 'q2', q: 'Write a paragraph about an important holiday in your country. What is it? What do people do and eat? How do you feel on that day?', st: 'An important holiday in my country is ___. On this day, people ___. We eat ___. I feel ___ because ___.', min: 40 },
    { k: 'q3', q: 'A relative asks you a personal question at dinner, like Aunt Rosa. What do you say or do? Why?', st: 'If a relative asks me ___, I would ___ because ___.', min: 12 }
  ];
  T.ALLW = T.QS.concat([T.WHY.p2, T.WHY.p3, T.WHY.p4]);

  T.IV = ['What is an important holiday in your country?', 'What do you like to do on this holiday?', 'Do people in your family ever argue at holiday dinners? About what?'];

  T.DIR = {
    l1: 'Look at the picture. Finish the two sentences. There is no wrong answer.',
    w1: 'Read each word card. Tap 🔊 to hear it. Then answer the 10 questions.',
    r1: 'Read the story. Tap 🔊 to listen. Tap any word to see it in your language.',
    r2: 'Answer the questions. Look back at the story.',
    r3: 'Answer in one or two complete sentences.',
    b1: 'Write in complete sentences. Use details from the stories. The sentence starter is there if you need it.',
    c1: 'Find somebody who speaks a different language and comes from a different country. Ask the questions. Write what they said.',
    d1: 'You finished the Thanksgiving reading. Happy Thanksgiving!'
  };

  function words(s) { return String(s || '').trim().split(/\s+/).filter(function (w) { return /[a-z0-9]/i.test(w); }); }
  T.words = words;
  T.qOk = function (q, s) { s = String(s || '').trim(); if (/_{2,}/.test(s)) return false; return words(s).length >= (q.min || 4); };
  T.ivOk = function (x) { return !!(x && String(x.who || '').trim() && words(x.a).length >= 3); };

  T.MAX = 2 + T.W_IDS.length + T.MC_IDS.length + T.ALLW.length;
  T.score = function (p, marks, off) {
    p = p || {}; marks = marks || {}; off = off || function () { return false; };
    var L = p.look || {}, R = p.R || {}, M = R.m || {}, look = (L.see ? 1 : 0) + (L.won ? 1 : 0), w = 0, m = 0, b = 0, c = 0;
    T.W_IDS.forEach(function (id) { if (M[id] && M[id].done) w++; });
    T.MC_IDS.forEach(function (id) { if (M[id] && M[id].done) m++; });
    T.ALLW.forEach(function (q) { var a = (p.qa || {})[q.k]; if (T.qOk(q, a) && !off(marks, q.k, a)) b++; });
    (p.iv || []).forEach(function (x) { if (T.ivOk(x)) c++; });
    var core = look + w + m + b;
    return { look: look, w: w, m: m, b: b, iv: Math.min(3, c), core: core, max: T.MAX, score: Math.min(T.MAX, core + Math.min(3, c)) };
  };

  T.lines = function () {
    var out = [];
    function add(s) { s = String(s || '').trim(); if (s && out.indexOf(s) < 0) out.push(s); }
    T.WORDS.forEach(function (w) { add(w.w); add(w.d); add(w.s); });
    T.PARTS.forEach(function (P) { add(P.title); P.paras.forEach(function (pp) { pp.forEach(add); }); });
    Object.keys(T.MC).forEach(function (k) { T.MC[k].forEach(function (x) { add(x.q); x.o.forEach(add); x.h.forEach(add); }); });
    T.ALLW.forEach(function (q) { add(q.q); add(q.st); });
    T.IV.forEach(add); Object.keys(T.DIR).forEach(function (k) { add(T.DIR[k]); });
    T.LOOK.see.forEach(add); T.LOOK.won.forEach(add); add(T.LOOK.think);
    return out;
  };
})();
