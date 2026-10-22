/* Our School · Galileo — ELD 101 group practice: school words, two sentences,
   three talk-then-choose questions, one written question, spell out loud.
   Shows every slide kind the engine has beyond the Seedfolks set (mc, ask). */
window.GP_DECKS=window.GP_DECKS||{};
GP_DECKS["galileo-1"]={
  slug:'galileo-1', title:'Our School · Galileo', short:'Our School', course:'101',
  art:{
    teacher:'<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#eef6fb"/><rect y="132" width="200" height="28" fill="#c9b79a"/>'+
      '<rect x="14" y="14" width="120" height="76" rx="3" fill="#fff" stroke="#55636a" stroke-width="4"/><path d="M14 90h120" stroke="#8a9a9f" stroke-width="6"/>'+
      '<text x="24" y="40" font-family="Nunito" font-weight="900" font-size="16" fill="#2457a6">Hello, class!</text><path d="M24 54h70M24 68h50" stroke="#1e8c45" stroke-width="3" stroke-linecap="round"/><rect x="104" y="86" width="14" height="4" fill="#c62828"/>'+
      '<g transform="translate(130 30)"><path d="M10 102l4-48q2-12 18-12t18 12l4 48z" fill="#2f6f52" stroke="#1d4634" stroke-width="2"/><path d="M26 42l6 10 6-10" fill="#fff"/>'+
      '<circle cx="32" cy="22" r="15" fill="#e8b98a" stroke="#8a6a4a" stroke-width="1.5"/><path d="M17 20q2-16 16-16t15 14q-8-6-16-6t-15 8z" fill="#5a3a1f"/><circle cx="27" cy="23" r="1.8" fill="#2a1a0a"/><circle cx="38" cy="23" r="1.8" fill="#2a1a0a"/><path d="M27 30q5 4 10 0" stroke="#7a4f2c" stroke-width="1.8" fill="none"/>'+
      '<path d="M12 60q-14 6-24 -8" stroke="#e8b98a" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="-18" y="44" width="6" height="12" fill="#1b2a2f" transform="rotate(-30 -15 50)"/>'+
      '<path d="M22 102v26h-8M42 102v26h8" stroke="#1b2a2f" stroke-width="6" stroke-linecap="round"/></g>'+
      '<rect x="20" y="112" width="40" height="22" fill="#c48a52" stroke="#5a3a1f" stroke-width="2"/><rect x="26" y="104" width="22" height="10" fill="#e9e1d0" stroke="#8a7a62"/><path d="M30 108h14" stroke="#8a7a62"/></svg>',
    library:'<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#f4efe6"/><rect y="136" width="200" height="24" fill="#a37a52"/>'+
      '<rect x="10" y="14" width="110" height="122" fill="#7a4f2c" stroke="#4a2f17" stroke-width="3"/><path d="M10 54h110M10 94h110" stroke="#4a2f17" stroke-width="4"/>'+
      '<g stroke="#1b2a2f" stroke-width="1"><rect x="16" y="22" width="9" height="32" fill="#c62828"/><rect x="26" y="26" width="8" height="28" fill="#2457a6"/><rect x="35" y="20" width="10" height="34" fill="#1e8c45"/><rect x="46" y="28" width="7" height="26" fill="#f2b632"/><rect x="54" y="22" width="9" height="32" fill="#7d3c98"/><rect x="66" y="30" width="22" height="7" fill="#d9661a" transform="rotate(-12 77 33)"/>'+
      '<rect x="16" y="62" width="10" height="32" fill="#0e8a7a"/><rect x="27" y="66" width="8" height="28" fill="#c62828"/><rect x="36" y="60" width="9" height="34" fill="#f2b632"/><rect x="46" y="64" width="11" height="30" fill="#2457a6"/><rect x="58" y="62" width="8" height="32" fill="#1e8c45"/><rect x="80" y="64" width="9" height="30" fill="#7d3c98"/><rect x="90" y="60" width="10" height="34" fill="#c62828"/>'+
      '<rect x="16" y="102" width="9" height="34" fill="#2457a6"/><rect x="26" y="106" width="10" height="30" fill="#d9661a"/><rect x="37" y="100" width="8" height="36" fill="#1e8c45"/><rect x="70" y="104" width="10" height="32" fill="#f2b632"/><rect x="81" y="102" width="9" height="34" fill="#c62828"/><rect x="91" y="106" width="11" height="30" fill="#0e8a7a"/></g>'+
      '<rect x="130" y="96" width="62" height="40" fill="#c48a52" stroke="#5a3a1f" stroke-width="2"/><rect x="136" y="84" width="22" height="14" fill="#1b2a2f"/><rect x="138" y="86" width="18" height="10" fill="#8fc0dc"/>'+
      '<g transform="translate(160 52)"><circle cx="12" cy="10" r="10" fill="#8d5a3b"/><path d="M2 8q10-14 20 0v10q-10-6-20 0z" fill="#3d6b5a"/><circle cx="12" cy="11" r="8" fill="#8d5a3b"/><path d="M-2 44q14-26 28 0z" fill="#c62828"/><rect x="-6" y="30" width="16" height="12" fill="#2457a6" stroke="#12305e"/></g>'+
      '<text x="146" y="128" font-family="Nunito" font-weight="900" font-size="11" fill="#fff">LIBRARY</text>'+
      '<g class="lion" id="lionEgg" transform="translate(64 47)"><circle r="6" fill="#b8661e"/><circle r="4" fill="#f2c27a"/><circle cx="-1.4" cy="-.6" r=".8" fill="#2a1a0a"/><circle cx="1.4" cy="-.6" r=".8" fill="#2a1a0a"/></g></svg>',
    cafeteria:'<svg viewBox="0 0 200 160" aria-hidden="true"><rect width="200" height="160" fill="#fdf3e1"/><rect y="124" width="200" height="36" fill="#cfd8dc"/><path d="M0 124h200" stroke="#9aa6ad" stroke-width="2"/>'+
      '<rect x="10" y="20" width="180" height="40" fill="#b8c4cc" stroke="#55636a" stroke-width="2"/><g fill="#e9eef1" stroke="#55636a"><rect x="18" y="28" width="36" height="24"/><rect x="62" y="28" width="36" height="24"/><rect x="106" y="28" width="36" height="24"/><rect x="150" y="28" width="32" height="24"/></g>'+
      '<ellipse cx="36" cy="40" rx="12" ry="6" fill="#e67e22"/><ellipse cx="80" cy="40" rx="12" ry="6" fill="#3d8f3c"/><ellipse cx="124" cy="40" rx="12" ry="6" fill="#f2d16b"/><ellipse cx="166" cy="40" rx="10" ry="6" fill="#c62828"/>'+
      '<path d="M30 86l130 0 10 18H20z" fill="#8a9a9f" stroke="#55636a" stroke-width="2"/>'+
      '<rect x="44" y="72" width="110" height="20" rx="4" fill="#ffffff" stroke="#55636a" stroke-width="2"/><circle cx="66" cy="82" r="8" fill="#f2d16b" stroke="#b08a2a"/><path d="M84 76h26v12H84z" fill="#e67e22" stroke="#9a5a12"/><circle cx="128" cy="82" r="7" fill="#c62828"/><rect x="140" y="74" width="8" height="16" rx="2" fill="#2457a6"/>'+
      '<path d="M40 104v20M160 104v20" stroke="#55636a" stroke-width="5"/></svg>'
  },
  slides:[
    {id:'i1',kind:'intro',part:'Part 1 · Spelling',dir:'intro',art:'group',repeatTip:true,body:'Get paper and a pencil (or a whiteboard). I will say words about our school. You write them.'},
    {id:'w1',kind:'word',part:'Part 1 · Spelling',dir:'word',ans:'teacher',art:'teacher'},
    {id:'w2',kind:'word',part:'Part 1 · Spelling',dir:'word',ans:'student',art:'group'},
    {id:'w3',kind:'word',part:'Part 1 · Spelling',dir:'word',ans:'library',art:'library'},
    {id:'w4',kind:'word',part:'Part 1 · Spelling',dir:'word',ans:'lunch',art:'cafeteria'},
    {id:'s1',kind:'sent',part:'Part 1 · Spelling',dir:'sent',ans:'My teacher is Mr. Toby.',say:'My teacher is Mister Toby.',art:'teacher'},
    {id:'s2',kind:'sent',part:'Part 1 · Spelling',dir:'sent',ans:'I eat lunch in the cafeteria.',art:'cafeteria'},
    {id:'i2',kind:'intro',part:'Part 2 · Questions',dir:'qintro',art:'easel',body:'Read the question together. Say your answer to your group. Then choose.'},
    {id:'m1',kind:'mc',part:'Part 2 · Questions',q:'Where do you borrow a book?',choices:['the library','the gym','the cafeteria','the nurse’s office'],hint:'You read books in this place.',why:'You borrow books in the library.',art:'library'},
    {id:'m2',kind:'mc',part:'Part 2 · Questions',q:'Who helps you choose your classes for next year?',choices:['the counselor','the librarian','the cook','the coach'],hint:'This person works in the counseling office.',why:'The counselor helps you choose your classes.',art:'group'},
    {id:'m3',kind:'mc',part:'Part 2 · Questions',q:'Where do you eat lunch?',choices:['the cafeteria','the library','the main office','the classroom'],hint:'There is hot food on a tray here.',why:'You eat lunch in the cafeteria.',art:'cafeteria'},
    {id:'q1',kind:'ask',part:'Part 2 · Questions',q:'What is your favorite place at Galileo? Why?',models:['My favorite place is the library because it is quiet.','I like the gym because I play basketball.','My favorite place is the cafeteria because I eat with my friends.'],art:'library'},
    {id:'a1',kind:'aloud',part:'Spell out loud',dir:'aloud',words:['Galileo','library','cafeteria','counselor','principal'],need:3,wordArt:{library:'library',cafeteria:'cafeteria'}},
    {id:'end',kind:'end',part:'Spell out loud',dir:'done',art:'trophy'}
  ]
};
