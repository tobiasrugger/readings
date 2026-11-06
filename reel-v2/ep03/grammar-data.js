/* Grammar from the story (Tier D, T-333) for ep03 — every sentence is a real line from the episode.
   Episode 3 teaches the schedule: has/have, on / at / in, before and after lunch, and the days of the week. */
window.EP_GRAMMAR = [
  { id: "has", title: "has and have", scene: 0,
    rule: "With he, she or one name, use has. With I, you and we, use have.",
    hint: "One person (he, she, a name) \u2192 has. I, you, we \u2192 have.",
    example: { p: "Every student ___ a different schedule.", a: "has", note: "Every student means one student at a time, so we use has." },
    items: [
      { p: "I ___ science. My schedule says science.", o: ["have", "has"], a: "have" },
      { p: "Mateo ___ P.E. on Tuesday and Thursday in the morning.", o: ["has", "have"], a: "has" },
      { p: "What class do we ___ now?", o: ["have", "has"], a: "have" },
      { p: "A schedule ___ days and times.", o: ["has", "have"], a: "has" },
      { p: "I ___ science too. Let\u2019s go, Linh.", o: ["have", "has"], a: "have" }
    ] },
  { id: "prep", title: "on, at, in", scene: 1,
    rule: "Use on for a day, at for a clock time, and in for a part of the day.",
    hint: "A day \u2192 on Tuesday. A clock time \u2192 at 10:20. A part of the day \u2192 in the morning.",
    example: { p: "I have math ___ Tuesday.", a: "on", note: "Tuesday is a day, so we use on." },
    items: [
      { p: "I have math on Tuesday ___ 10:20.", o: ["at", "on", "in"], a: "at" },
      { p: "Mateo has P.E. on Tuesday and Thursday ___ the morning.", o: ["in", "on", "at"], a: "in" },
      { p: "___ the afternoon, Amira has art.", o: ["In", "On", "At"], a: "In" },
      { p: "___ Tuesday you have P.E. at 10:20.", o: ["On", "At", "In"], a: "On" },
      { p: "The bell rings. It is 10:15 ___ the morning.", o: ["in", "on", "at"], a: "in" }
    ] },
  { id: "beforeafter", title: "before lunch, after lunch", scene: 5,
    rule: "Before means earlier. After means later. Lunch is in the middle of the day.",
    hint: "Earlier than lunch \u2192 before lunch. Later than lunch \u2192 after lunch.",
    example: { p: "I have P.E. ___ lunch.", a: "before", note: "P.E. is at 10:20, which is earlier than lunch." },
    items: [
      { p: "I have music ___ lunch.", o: ["after", "before"], a: "after" },
      { p: "I have P.E. ___ lunch. On Tuesday!", o: ["before", "after"], a: "before" },
      { p: "Everyone has a different schedule. But everyone has lunch at the same ___.", o: ["time", "day", "room"], a: "time" },
      { p: "I have music ___ lunch.", o: ["after", "before"], a: "after" }
    ] },
  { id: "days", title: "The days of the week", scene: 2,
    rule: "The school week is Monday, Tuesday, Wednesday, Thursday, Friday. Every day has its own row on your schedule.",
    hint: "Read the days in order: Monday, Tuesday, Wednesday, Thursday, Friday.",
    example: { p: "Oh no. That is Monday. Today is ___!", a: "Tuesday", note: "Tuesday comes right after Monday." },
    items: [
      { p: "Monday, ___, Wednesday, Thursday, Friday.", o: ["Tuesday", "Thursday", "Sunday"], a: "Tuesday" },
      { p: "On Tuesday you have P.E. at ___, in the gym.", o: ["10:20", "8:00", "3:15"], a: "10:20" },
      { p: "A schedule has days and times. Monday, Tuesday, Wednesday, ___, Friday.", o: ["Thursday", "Saturday", "Sunday"], a: "Thursday" },
      { p: "Come to art with me on ___ after lunch!", o: ["Thursday", "Sunday", "Monday"], a: "Thursday" },
      { p: "Oh no! That line is ___. Today is Tuesday!", o: ["Monday", "Friday", "Sunday"], a: "Monday" }
    ] }
];
