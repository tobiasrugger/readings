/* Grammar from the story (Tier D, T-384) for ep04 — every sentence is a real line from the episode.
   Episode 4's grammar point is the sequence words and their commas (First, Then, Also, Next,
   Finally), plus in/at for places and do/does in questions. */
window.EP_GRAMMAR = [
  { id: "seq", title: "First, Then, Also, Next, Finally", scene: 1,
    rule: "These words tell the order of the steps. Each one takes a comma after it.",
    hint: "First is step 1. Then and Also and Next come in the middle. Finally is the last step.",
    example: { p: "___, wait in line. Then, take a tray.", a: "First", note: "First is step 1, and it takes a comma." },
    items: [
      { p: "First, wait in line. ___, take a tray.", o: ["Then", "First", "Finally"], a: "Then" },
      { p: "___, take a napkin, a fork, and a spoon.", o: ["Also", "First", "Finally"], a: "Also" },
      { p: "___, choose your food! I choose pizza.", o: ["Next", "First", "Also"], a: "Next" },
      { p: "Mateo! ___, clean up the table.", o: ["Finally", "First", "Next"], a: "Finally" },
      { p: "___, they wait in line. The line is long.", o: ["First", "Also", "Finally"], a: "First" }
    ] },
  { id: "comma", title: "The comma after a sequence word", scene: 2,
    rule: "After First, Then, Also, Next and Finally, write a comma before the rest of the sentence.",
    hint: "Say the sentence out loud. The comma is the little stop after the sequence word.",
    example: { p: "First, Then, Also, Next, Finally. These words tell the ___.", a: "order", note: "These five words tell the order of the steps." },
    items: [
      { p: "First, Then, Also, Next, Finally. These words tell the ___.", o: ["order", "food", "table"], a: "order" },
      { p: "Then, Linh walks to a ___ with her tray.", o: ["table", "line", "drink"], a: "table" },
      { p: "Then, they find an empty table and ___ down.", o: ["sit", "put", "walk"], a: "sit" },
      { p: "After they eat, they ___ up the table.", o: ["clean", "wait", "choose"], a: "clean" }
    ] },
  { id: "place", title: "in and at: where we eat", scene: 3,
    rule: "Use in for a room: in the cafeteria. Use at for a place like home or school.",
    hint: "One room \u2192 in. Home or school \u2192 at.",
    example: { p: "___ the cafeteria! Come with me.", a: "In", note: "The cafeteria is one room, so we use in." },
    items: [
      { p: "In Vietnam, I eat lunch ___ home. I eat rice.", o: ["at", "in", "on"], a: "at" },
      { p: "Here, we eat lunch ___ school. It is different.", o: ["at", "in", "on"], a: "at" },
      { p: "In Guatemala, I eat lunch ___ home too. With my family.", o: ["at", "in", "on"], a: "at" },
      { p: "___ the cafeteria! Come with me.", o: ["In", "At", "On"], a: "In" }
    ] },
  { id: "do", title: "do and does", scene: 0,
    rule: "With I, you and we, use do. With he, she or one name, use does.",
    hint: "I, you, we \u2192 do. He, she, a name \u2192 does.",
    example: { p: "What ___ I do first?", a: "do", note: "With I, we use do." },
    items: [
      { p: "What ___ I do first?", o: ["do", "does"], a: "do" },
      { p: "What ___ you do after you wait in line?", o: ["do", "does"], a: "do" },
      { p: "Why ___ Amira call Linh?", o: ["does", "do"], a: "does" },
      { p: "Where ___ we eat?", o: ["do", "does"], a: "do" },
      { p: "She ___ not know the steps.", o: ["does", "do"], a: "does" }
    ] }
];
