/* =====================================================================
   Find Someone Who — question sets (Launch Plus)
   One set per lesson. Loaded by find/index.html (students) and find/wall.html (teacher).

   prompt: { id, e (emoji), find ("Find someone who …"), ask (the question to say),
             yes (the answer that counts), report ("{B}" = the classmate's first name),
             open: {label, ask, report} when a short answer is collected too ("{x}") }
   bold:   the per-period optional set (teacher switches it on per period in wall.html)
   String concatenation only. No template literals.
   ===================================================================== */
window.FIND_SETS = {
  'u1-l1': {
    title: 'People at School',
    lesson: 'Launch Plus · Lesson 1',
    back: '/readings/launch-plus/u1-l1/',
    intro: 'Walk around the room and talk to other students. Ask the question. If the answer is yes, write that student\u2019s name in the box.',
    maxUses: 2,
    rules: ['Stand up and walk.', 'Ask in English.', 'Listen to the answer.', 'Write the first name.'],
    core: [
      {id:'walk',    e:'\ud83d\udeb6', find:'walked to school in their country', ask:'Did you walk to school in your country?', yes:'Yes, I walked to school.', report:'{B} walked to school.'},
      {id:'bus',     e:'\ud83d\ude8c', find:'took a bus to school', ask:'Did you take a bus to school?', yes:'Yes, I took a bus.', report:'{B} took a bus to school.'},
      {id:'bike',    e:'\ud83d\udeb2', find:'rode a bike or a motorbike to school', ask:'Did you ride a bike or a motorbike to school?', yes:'Yes, I rode a bike.', report:'{B} rode a bike to school.'},
      {id:'car',     e:'\ud83d\ude97', find:'went to school by car', ask:'Did your family drive you to school?', yes:'Yes, my family drove me.', report:'{B} went to school by car.'},
      {id:'big',     e:'\ud83c\udfdf\ufe0f', find:'went to a big school (more than 1,000 students)', ask:'Was your school big? How many students?', yes:'Yes, it was big.', report:'{B} went to a big school with {x} students.', short:'{B} went to a big school.',
        open:{label:'How many students?', ask:'How many students were in your school?', ph:'2,000'}},
      {id:'small',   e:'\ud83c\udfe0', find:'went to a small school (fewer than 300 students)', ask:'Was your school small? How many students?', yes:'Yes, it was small.', report:'{B} went to a small school with {x} students.', short:'{B} went to a small school.',
        open:{label:'How many students?', ask:'How many students were in your school?', ph:'150'}},
      {id:'uniform', e:'\ud83d\udc54', find:'wore a uniform to school', ask:'Did you wear a uniform to school?', yes:'Yes, I wore a uniform.', report:'{B} wore a uniform to school.'},
      {id:'saturday',e:'\ud83d\udcc5', find:'had school on Saturday', ask:'Did you have school on Saturday?', yes:'Yes, I had school on Saturday.', report:'{B} had school on Saturday.'},
      {id:'langs',   e:'\ud83d\udde3\ufe0f', find:'speaks three or more languages', ask:'How many languages do you speak? Which ones?', yes:'I speak three languages.', report:'{B} speaks {x}.', short:'{B} speaks three languages.',
        open:{label:'Which languages?', ask:'Which languages do you speak?', ph:'Spanish, English, and Mam'}},
      {id:'teacher', e:'\u2b50', find:'remembers a favorite teacher\u2019s name', ask:'Who was your favorite teacher in your country?', yes:'My favorite teacher was Ms. Ana.', report:'{B}\u2019s favorite teacher was {x}.', short:'{B} remembers a favorite teacher.',
        open:{label:'The teacher\u2019s name', ask:'What was your teacher\u2019s name?', ph:'Mr. Lopez'}},
      {id:'principal',e:'\ud83c\udfeb', find:'knows the name of the principal of Galileo', ask:'Who is the principal of Galileo?', yes:'The principal is Ms. Brown.', report:'{B} knows the principal. The principal is {x}.', short:'{B} knows the principal.',
        open:{label:'The principal\u2019s name', ask:'Who is the principal?', ph:'Ms. Brown', hint:'Her office is Room 208, the main office.'}},
      {id:'team',    e:'\u26bd', find:'wants to join a team or a club at Galileo', ask:'Do you want to join a team or a club? Which one?', yes:'Yes, I want to join the soccer team.', report:'{B} wants to join {x}.', short:'{B} wants to join a team.',
        open:{label:'Which team or club?', ask:'Which team or club?', ph:'the soccer team'}}
    ],
    bold: [
      {id:'love',    e:'\ud83d\udc98', find:'has been in love', ask:'Have you ever been in love?', yes:'Yes, I have.', report:'{B} has been in love.'},
      {id:'date',    e:'\ud83d\udc91', find:'is allowed to date', ask:'Does your family let you date?', yes:'Yes, they do.', report:'{B} is allowed to date.'},
      {id:'crush',   e:'\ud83d\udc40', find:'has a crush on someone right now (no names!)', ask:'Do you have a crush on someone? Don\u2019t say who!', yes:'Yes, I do.', report:'{B} has a crush on someone.'},
      {id:'song',    e:'\ud83c\udfa7', find:'has a song stuck in their head', ask:'Is a song stuck in your head? Which song?', yes:'Yes! It\u2019s \u2026', report:'{B} has \u201c{x}\u201d stuck in their head.', short:'{B} has a song stuck in their head.',
        open:{label:'Which song?', ask:'Which song?', ph:'Despacito'}},
      {id:'midnight',e:'\ud83c\udf19', find:'went to bed after midnight last night', ask:'Did you go to bed after midnight last night?', yes:'Yes, I did.', report:'{B} went to bed after midnight.'},
      {id:'phone',   e:'\ud83d\udcf1', find:'has secretly used a phone in class (not this class!)', ask:'Have you ever secretly used your phone in class?', yes:'Yes\u2026 once.', report:'{B} has secretly used a phone in class.'}
    ]
  }
};

/* original flat SVG icons, one per prompt id (currentColor = the card's accent) */
window.FIND_ICONS={
 walk:'<svg viewBox="0 0 64 64"><circle cx="33" cy="9" r="6" fill="currentColor"/><path d="M30 17h7l4 12 9 4-2 5-11-5-2-4-3 11 8 9-3 5-11-11 2-11-5 5-2 10-6-1 2-13 10-10z" fill="currentColor"/><rect x="6" y="57" width="52" height="4" rx="2" fill="currentColor" opacity=".35"/></svg>',
 bus:'<svg viewBox="0 0 64 64"><rect x="6" y="14" width="52" height="34" rx="6" fill="currentColor"/><rect x="11" y="20" width="12" height="12" rx="2" fill="#fff" opacity=".9"/><rect x="26" y="20" width="12" height="12" rx="2" fill="#fff" opacity=".9"/><rect x="41" y="20" width="12" height="12" rx="2" fill="#fff" opacity=".9"/><circle cx="18" cy="50" r="6" fill="currentColor"/><circle cx="46" cy="50" r="6" fill="currentColor"/><circle cx="18" cy="50" r="2.5" fill="#fff"/><circle cx="46" cy="50" r="2.5" fill="#fff"/></svg>',
 bike:'<svg viewBox="0 0 64 64"><circle cx="16" cy="44" r="11" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="48" cy="44" r="11" fill="none" stroke="currentColor" stroke-width="4"/><path d="M16 44l12-20h16l4 20M28 24l-6 20h20" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="40" cy="12" r="5" fill="currentColor"/></svg>',
 car:'<svg viewBox="0 0 64 64"><path d="M10 38l6-14c1-2 3-4 6-4h20c3 0 5 2 6 4l6 14v10H10z" fill="currentColor"/><path d="M19 24l-4 10h34l-4-10c-.5-1-1.5-2-3-2H22c-1.5 0-2.5 1-3 2z" fill="#fff" opacity=".9"/><circle cx="20" cy="49" r="6" fill="currentColor"/><circle cx="44" cy="49" r="6" fill="currentColor"/><circle cx="20" cy="49" r="2.5" fill="#fff"/><circle cx="44" cy="49" r="2.5" fill="#fff"/></svg>',
 big:'<svg viewBox="0 0 64 64"><rect x="4" y="22" width="56" height="34" fill="currentColor"/><rect x="24" y="10" width="16" height="12" fill="currentColor"/><g fill="#fff" opacity=".9"><rect x="10" y="28" width="7" height="7"/><rect x="22" y="28" width="7" height="7"/><rect x="34" y="28" width="7" height="7"/><rect x="46" y="28" width="7" height="7"/><rect x="10" y="40" width="7" height="7"/><rect x="22" y="40" width="7" height="7"/><rect x="34" y="40" width="7" height="7"/><rect x="46" y="40" width="7" height="7"/></g><rect x="28" y="48" width="8" height="8" fill="#fff"/></svg>',
 small:'<svg viewBox="0 0 64 64"><path d="M8 32L32 12l24 20v24H8z" fill="currentColor"/><rect x="26" y="40" width="12" height="16" fill="#fff" opacity=".9"/><rect x="14" y="36" width="8" height="8" fill="#fff" opacity=".9"/><rect x="42" y="36" width="8" height="8" fill="#fff" opacity=".9"/></svg>',
 uniform:'<svg viewBox="0 0 64 64"><path d="M20 10l-12 8 4 10 6-2v30h28V26l6 2 4-10-12-8-6 6h-12z" fill="currentColor"/><path d="M28 10h8l-4 8z" fill="#fff" opacity=".9"/><path d="M30 18h4l1 10-3 14-3-14z" fill="#fff" opacity=".9"/></svg>',
 saturday:'<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="44" rx="5" fill="currentColor"/><rect x="8" y="12" width="48" height="12" rx="5" fill="currentColor"/><rect x="14" y="30" width="36" height="20" rx="3" fill="#fff" opacity=".92"/><text x="32" y="46" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="16" fill="currentColor">SAT</text><rect x="18" y="6" width="4" height="10" rx="2" fill="currentColor"/><rect x="42" y="6" width="4" height="10" rx="2" fill="currentColor"/></svg>',
 langs:'<svg viewBox="0 0 64 64"><path d="M6 12h30a5 5 0 015 5v12a5 5 0 01-5 5H20l-8 7v-7H6a5 5 0 01-5-5V17a5 5 0 015-5z" fill="currentColor" opacity=".45"/><path d="M28 28h30a5 5 0 015 5v12a5 5 0 01-5 5h-5v7l-8-7H28a5 5 0 01-5-5V33a5 5 0 015-5z" fill="currentColor"/><text x="43" y="44" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="13" fill="#fff">ABC</text></svg>',
 teacher:'<svg viewBox="0 0 64 64"><rect x="6" y="10" width="40" height="28" rx="3" fill="currentColor" opacity=".45"/><path d="M12 32l8-10 6 6 8-12 6 8" fill="none" stroke="#fff" stroke-width="3"/><circle cx="50" cy="30" r="6" fill="currentColor"/><path d="M42 56v-12a8 8 0 0116 0v12z" fill="currentColor"/><path d="M12 18l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" fill="#fff"/></svg>',
 principal:'<svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="22" fill="currentColor" opacity=".4"/><path d="M32 12l5 8 9-4-1 10 9 4-8 6 3 10-9-2-4 9-4-9-9 2 3-10-8-6 9-4-1-10 9 4z" fill="currentColor" opacity=".55"/><circle cx="32" cy="34" r="13" fill="currentColor"/><circle cx="27" cy="31" r="2" fill="#fff"/><circle cx="37" cy="31" r="2" fill="#fff"/><path d="M32 36l-3 3h6zM29 39q3 4 6 0" fill="#fff" stroke="#fff" stroke-width="1.2"/><circle cx="20" cy="26" r="4" fill="currentColor"/><circle cx="44" cy="26" r="4" fill="currentColor"/></svg>',
 team:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#fff" stroke="currentColor" stroke-width="4"/><path d="M32 18l9 7-3 11H26l-3-11z" fill="currentColor"/><path d="M32 18V10M41 25l9-4M38 36l5 9M26 36l-5 9M23 25l-9-4" stroke="currentColor" stroke-width="3"/></svg>',
 love:'<svg viewBox="0 0 64 64"><path d="M32 54S8 40 8 24a12 12 0 0124-4 12 12 0 0124 4c0 16-24 30-24 30z" fill="currentColor"/></svg>',
 date:'<svg viewBox="0 0 64 64"><circle cx="20" cy="18" r="7" fill="currentColor"/><circle cx="44" cy="18" r="7" fill="currentColor"/><path d="M8 54V38a12 12 0 0124 0v16zM32 54V38a12 12 0 0124 0v16z" fill="currentColor" opacity=".8"/><path d="M32 30s-6-4-6-8a3 3 0 016-1 3 3 0 016 1c0 4-6 8-6 8z" fill="#fff"/></svg>',
 crush:'<svg viewBox="0 0 64 64"><ellipse cx="20" cy="32" rx="12" ry="14" fill="#fff" stroke="currentColor" stroke-width="4"/><ellipse cx="44" cy="32" rx="12" ry="14" fill="#fff" stroke="currentColor" stroke-width="4"/><path d="M20 34s-5-3-5-6a2.5 2.5 0 015-1 2.5 2.5 0 015 1c0 3-5 6-5 6zM44 34s-5-3-5-6a2.5 2.5 0 015-1 2.5 2.5 0 015 1c0 3-5 6-5 6z" fill="currentColor"/></svg>',
 song:'<svg viewBox="0 0 64 64"><path d="M12 36v-6a20 20 0 0140 0v6" fill="none" stroke="currentColor" stroke-width="5"/><rect x="8" y="34" width="12" height="18" rx="4" fill="currentColor"/><rect x="44" y="34" width="12" height="18" rx="4" fill="currentColor"/><path d="M30 44v-10l8-2v10" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="28" cy="45" r="3" fill="currentColor"/><circle cx="36" cy="43" r="3" fill="currentColor"/></svg>',
 midnight:'<svg viewBox="0 0 64 64"><path d="M38 6C22 6 10 18 10 32s12 26 28 26c6 0 11-2 16-5-14 0-24-10-24-21S31 11 46 9c-3-2-5-3-8-3z" fill="currentColor"/><circle cx="48" cy="18" r="2.5" fill="currentColor"/><circle cx="56" cy="34" r="2" fill="currentColor"/><circle cx="50" cy="46" r="1.6" fill="currentColor"/></svg>',
 phone:'<svg viewBox="0 0 64 64"><rect x="18" y="6" width="28" height="52" rx="5" fill="currentColor"/><rect x="22" y="12" width="20" height="36" rx="2" fill="#fff" opacity=".9"/><circle cx="32" cy="53" r="2.5" fill="#fff"/><path d="M8 20l6 4-6 4M56 20l-6 4 6 4" fill="none" stroke="currentColor" stroke-width="3" opacity=".6"/></svg>'
};
