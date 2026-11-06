/* Grammar from the story (Tier D, T-333) for ep02 — every sentence is a real line from the episode.
   Episode 2 spirals has/have and adds places at school, can / don’t have, and before / after. */
window.EP_GRAMMAR = [
  { id: "has", title: "has and have", scene: 2,
    rule: "With he, she or one name, use has. With I, you and we, use have.",
    hint: "One person (he, she, a name) \u2192 has. I, you, we \u2192 have.",
    example: { p: "Jun ___ an orange backpack.", a: "has", note: "Jun is he, so we use has." },
    items: [
      { p: "Mateo ___ a red backpack.", o: ["has", "have"], a: "has" },
      { p: "I ___ ten pencils!", o: ["have", "has"], a: "have" },
      { p: "Paolo ___ ten pencils.", o: ["has", "have"], a: "has" },
      { p: "A library ___ many books.", o: ["has", "have"], a: "has" },
      { p: "Now Jun ___ one pencil.", o: ["has", "have"], a: "has" }
    ] },
  { id: "place", title: "Places at school: in and at", scene: 1,
    rule: "Use in for a room: in the library, in the gym. Use at for the whole school.",
    hint: "One room \u2192 in. The whole school \u2192 at.",
    example: { p: "Students read books ___ the library.", a: "in", note: "The library is one room, so we use in." },
    items: [
      { p: "Students play sports ___ the gym.", o: ["in", "at", "on"], a: "in" },
      { p: "Students eat lunch ___ the cafeteria.", o: ["in", "at", "on"], a: "in" },
      { p: "Where do students go ___ school?", o: ["at", "in", "on"], a: "at" },
      { p: "Jun forgot his backpack ___ the music corner.", o: ["in", "at", "to"], a: "in" },
      { p: "Everything is ___ my backpack!", o: ["in", "at", "on"], a: "in" }
    ] },
  { id: "notdo", title: "I can and I don\u2019t", scene: 3,
    rule: "Use can for what you are able to do. Use don\u2019t have to say you do not have something.",
    hint: "Able to do it \u2192 can. Do not have it \u2192 don\u2019t have.",
    example: { p: "I ___ have a pencil, and I don\u2019t have a notebook.", a: "don\u2019t", note: "Jun does not have a pencil, so we use don\u2019t have." },
    items: [
      { p: "I ___ have a notebook.", o: ["don\u2019t", "doesn\u2019t", "not"], a: "don\u2019t" },
      { p: "You ___ borrow one.", o: ["can", "are", "have"], a: "can" },
      { p: "We ___ find it. Let\u2019s go!", o: ["can", "are", "have"], a: "can" },
      { p: "___ I borrow a pencil?", o: ["Could", "Have", "Are"], a: "Could" }
    ] },
  { id: "beforeafter", title: "before and after", scene: 5,
    rule: "Before means earlier. After means later.",
    hint: "Earlier \u2192 before. Later \u2192 after.",
    example: { p: "___ class, I am in the hallway.", a: "Before", note: "The hallway comes earlier, so we use Before." },
    items: [
      { p: "___ class, I am in the music corner!", o: ["After", "Before"], a: "After" },
      { p: "Where do you go ___ class?", o: ["before", "under"], a: "before" },
      { p: "I forgot it here ___ class.", o: ["after", "before"], a: "after" },
      { p: "Where do you go ___ class?", o: ["after", "before"], a: "after" }
    ] }
];
