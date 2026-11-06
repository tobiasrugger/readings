/* Grammar from the story (Tier D, T-333) for ep01 — every sentence is a real line from the episode.
   Episode 1 leans on is/am/are and has/have for describing classmates, plus the questions Linh asks. */
window.EP_GRAMMAR = [
  { id: "be", title: "is, am, are", scene: 1,
    rule: "Use am with I. Use is with he, she and a name. Use are with you and we.",
    hint: "Look at the word before the blank: I \u2192 am, she or he or a name \u2192 is, you or we \u2192 are.",
    example: { p: "She ___ new. She is from Vietnam.", a: "is", note: "Linh is one person, so we use is." },
    items: [
      { p: "I ___ nervous.", o: ["am", "is", "are"], a: "am" },
      { p: "She ___ from Vietnam.", o: ["is", "am", "are"], a: "is" },
      { p: "___ you tall or short?", o: ["Are", "Is", "Am"], a: "Are" },
      { p: "My name ___ Mateo.", o: ["is", "am", "are"], a: "is" },
      { p: "My hands ___ cold.", o: ["are", "is", "am"], a: "are" },
      { p: "You ___ funny!", o: ["are", "is", "am"], a: "are" }
    ] },
  { id: "has", title: "has and have", scene: 3,
    rule: "With he, she or one name, use has. With I, you and we, use have.",
    hint: "One person (he, she, a name) \u2192 has. I, you, we \u2192 have.",
    example: { p: "She ___ long, straight, black hair.", a: "has", note: "Linh is she, so we use has." },
    items: [
      { p: "He ___ short, curly, black hair.", o: ["has", "have"], a: "has" },
      { p: "I ___ new friends.", o: ["have", "has"], a: "have" },
      { p: "He ___ a soccer ball.", o: ["has", "have"], a: "has" },
      { p: "He ___ short, black hair and glasses.", o: ["has", "have"], a: "has" },
      { p: "Mateo and I both ___ black hair.", o: ["have", "has"], a: "have" }
    ] },
  { id: "desc", title: "Describing a classmate", scene: 2,
    rule: "Use is for how a person is. Use has for what a person has, like hair or glasses.",
    hint: "How the person IS \u2192 is. What the person HAS \u2192 has.",
    example: { p: "Mateo ___ tall.", a: "is", note: "Tall tells us how Mateo is, so we use is." },
    items: [
      { p: "He ___ wavy, brown hair.", o: ["has", "is"], a: "has" },
      { p: "She ___ friendly. She is loud!", o: ["is", "has"], a: "is" },
      { p: "He ___ shy, but he is musical.", o: ["is", "has"], a: "is" },
      { p: "He ___ headphones.", o: ["has", "is"], a: "has" },
      { p: "Linh ___ short.", o: ["is", "has"], a: "is" }
    ] },
  { id: "q", title: "Asking a classmate", scene: 4,
    rule: "A question about a person starts with Are, Is, What or How.",
    hint: "Ask about a name \u2192 What. Ask how to write it \u2192 How. Ask about you \u2192 Are.",
    example: { p: "___ is your name?", a: "What", note: "We are asking for a name, so the question starts with What." },
    items: [
      { p: "___ you friendly or shy?", o: ["Are", "Is", "What"], a: "Are" },
      { p: "___ do you spell your name?", o: ["How", "What", "Are"], a: "How" },
      { p: "___ has glasses?", o: ["Who", "How", "Are"], a: "Who" },
      { p: "Sorry. ___ you please repeat that?", o: ["Can", "Are", "Is"], a: "Can" }
    ] }
];
