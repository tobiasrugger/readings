/* Grammar from the story (Tier D) for ep05, "Where Is Room 318?" (T-419) — every sentence is
   a real line from the episode. Episode 5's grammar points are go vs turn with a direction
   word, the sequence words with their commas, in/inside vs outside for places, and the
   past tense of the verbs the story uses when Linh tells what happened. */
window.EP_GRAMMAR = [
  { id: "goturn", title: "go or turn", scene: 0,
    rule: "Use turn with left and right. Use go with straight, upstairs, downstairs, inside, outside and through.",
    hint: "You turn a corner: left or right. You go along: straight, upstairs, downstairs.",
    example: { p: "Room 118? Easy! Go straight. Then, ___ left.", a: "turn", note: "Left and right go with turn." },
    items: [
      { p: "Room 118? Easy! ___ straight. Then, turn left.", o: ["Go", "Turn", "Take"], a: "Go" },
      { p: "First, go straight. Then, ___ left.", o: ["turn", "go", "walk"], a: "turn" },
      { p: "First, ___ upstairs. Then, turn right.", o: ["go", "turn", "take"], a: "go" },
      { p: "Then, ___ right and go straight.", o: ["turn", "go", "walk"], a: "turn" },
      { p: "First, Linh goes ___ the door. Then, she goes upstairs.", o: ["through", "turn", "left"], a: "through" }
    ] },
  { id: "seq", title: "First, Then, Next, Finally", scene: 2,
    rule: "These words tell the order of the steps. Each one takes a comma after it.",
    hint: "First is step 1. Then and Next come in the middle.",
    example: { p: "___, go straight. Then, turn left.", a: "First", note: "First is step 1, and it takes a comma." },
    items: [
      { p: "First, go straight. ___, turn left.", o: ["Then", "First", "Through"], a: "Then" },
      { p: "___, find your location. The star is you.", o: ["First", "Then", "Next"], a: "First" },
      { p: "___, find Room 318. Move your finger from the star to the room.", o: ["Then", "First", "Inside"], a: "Then" },
      { p: "___, Linh turns right. She goes straight.", o: ["Next", "First", "Through"], a: "Next" }
    ] },
  { id: "inout", title: "inside and outside", scene: 3,
    rule: "Inside means in the building. Outside means out in the open air.",
    hint: "A classroom is inside. The schoolyard is outside.",
    example: { p: "I have P.E. It is ___ today.", a: "outside", note: "P.E. is in the schoolyard, in the open air." },
    items: [
      { p: "I have P.E. It is ___ today.", o: ["outside", "inside", "upstairs"], a: "outside" },
      { p: "Science is ___. Good! Bye, Mateo!", o: ["inside", "outside", "downstairs"], a: "inside" },
      { p: "Hi, Linh! I am going ___.", o: ["downstairs", "upstairs", "inside"], a: "downstairs" },
      { p: "Mateo goes down. Linh goes ___. Floor 2. Floor 3!", o: ["up", "out", "through"], a: "up" }
    ] },
  { id: "floor", title: "the room number tells the floor", scene: 1,
    rule: "The first number of a room tells you the floor. Room 318 is on the third floor.",
    hint: "3-18: the 3 is the floor.",
    example: { p: "Room 318 is upstairs. It is on the ___ floor.", a: "third", note: "The 3 in 318 tells you the floor." },
    items: [
      { p: "Room 318 is upstairs. It is on the ___ floor.", o: ["third", "first", "second"], a: "third" },
      { p: "Linh! No, this is art. This is Room ___.", o: ["118", "318", "218"], a: "118" },
      { p: "Look at the map. The ___ is you.", o: ["star", "room", "floor"], a: "star" },
      { p: "Oh no! I heard 118. ___, Linh!", o: ["Sorry", "Thank you", "Hello"], a: "Sorry" }
    ] }
];
