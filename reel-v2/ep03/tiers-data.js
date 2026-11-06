/* After-the-story tier data for ep03, "What Class Do We Have Now?"
   (owned by the tiers chat; loaded by ../tiers.js).
   Episode 3 teaches school subjects and the school schedule, so the Tier B ladders
   carry the time and day phrases the episode is built on: on Tuesday / at 10:20 /
   in the morning / before lunch, and "My favorite subject is ___ because I like to ___".
   Mateo asking what is for lunch is the Episode 4 teaser (teaser: true in the page),
   so it stays out of all three tiers. "before lunch" and "after lunch" are TARGET
   language here, which is why the teaser test below looks for the question itself,
   not for the word lunch. */
window.EP_TIERS = {
    ask: 'Ask your teacher which activity to do next.',
    /* T-342 order: 4 events, ends anchored. The first and last must be right; the two in
       the middle count right in any order, because both orders really are defensible. */
    order: [
      { t: "The bell rings. Mateo does not know which class he has.", lock: 1 },
      { t: "Paolo shows Mateo how to read a schedule." },
      { t: "Mateo opens the door of the science lab." },
      { t: "Amira takes Mateo to the gym for P.E.", lock: "last" }
    ],
    /* T-342 two worked examples for Tier B. [brackets] mark the words that changed. */
    bex: [
      { how: "Change one word.", from: "I have math on Tuesday [at 10:20].", to: "I have math on Tuesday [in the morning]." },
      { how: "Say it the other way around.", from: "[Mateo has P.E.] [on Tuesday and Thursday].", to: "[On Tuesday and Thursday], [Mateo has P.E.]" }
    ],
    key: [
      { t: 'Every student has a different schedule.', swap: 'has a different schedule',
        rungs: [ ['has a schedule'],
                 ['has his or her own schedule', 'does not have the same schedule'],
                 ['Every schedule is different.', 'has different classes at different times'] ],
        idea: 'what a schedule is', ideas: /\b(schedules?|different|every student|each student|own class)/i },
      { t: 'Mateo does not know which class he has.', swap: 'does not know which class he has',
        rungs: [ ['doesn\u2019t know which class he has'],
                 ['does not know where to go', 'forgets his classes', 'cannot remember his class'],
                 ['Mateo is confused about his classes.', 'has to ask his friends for help'] ],
        idea: 'what Mateo\u2019s problem is', ideas: /\b(mateo|does not know|doesn.?t know|forg|confus|cannot remember|can.?t remember|where to go|which class)/i },
      { t: 'He goes to the wrong room because he reads the wrong day.', swap: 'because he reads the wrong day',
        rungs: [ ['because he reads the wrong line'],
                 ['because he reads Monday, not Tuesday', 'because he looks at the wrong day'],
                 ['He reads the Monday row on a Tuesday.', 'He checks the room but not the day.'] ],
        idea: 'why he goes to the wrong room', ideas: /\b(wrong (room|day|line|class|place)|monday|tuesday|science lab|mistake|read the)/i },
      { t: 'Amira shows him he has P.E. on Tuesday.', swap: 'he has P.E. on Tuesday',
        rungs: [ ['he has P.E. at 10:20'],
                 ['he has P.E. in the morning', 'he has P.E. before lunch', 'he has P.E. in the gym'],
                 ['Amira takes him to the gym.', 'his real class is P.E., on Tuesday and Thursday'] ],
        idea: 'who helps him, and what class he really has', ideas: /\b(amira|p\.?\s?e\.?\b|gym|tuesday|thursday|10:20|before lunch|in the morning|helps?|shows?|takes?)/i },
      { t: 'Everyone has a different favorite subject.', swap: 'has a different favorite subject',
        rungs: [ ['likes a different subject'],
                 ['has his or her own favorite subject', 'does not like the same subject'],
                 ['Amira likes art, but Linh likes science.', 'Mateo\u2019s favorite subject is P.E. because he likes to play sports.'] ],
        idea: 'what the friends say about their favorite subjects', ideas: /\b(favou?rite|subjects?|art|science|music|math|p\.?\s?e\.?\b|because|likes? to|draw|experiments?|piano|sports?)/i }
    ],
    topic: {
      ask: 'Which sentence is the best topic sentence for this story?',
      opts: [ 'Mateo does not know which class he has, so his friends help him read his schedule.',
              'Jun has music after lunch.',
              'Mateo is hungry and asks about lunch.' ],
      good: 0,
      why: [ 'Yes. This sentence tells what the whole story is about.',
             'That is one detail about one person. Which sentence tells the whole story?',
             'That is the last line. It is a teaser for Episode 4, not the main story.' ]
    },
    summary: {
      min: 25,
      hint: 'Look at the pictures. Write 4 or 5 sentences about the story in your own words. Use a day and a time if you can: on Tuesday, at 10:20, in the morning, before lunch. Leave out the question about lunch at the end: it is for Episode 4.',
      teaser: /(what\u2019s|what.s|what is) for lunch|i\u2019m hungry|i.m hungry|\bhungry\b/i,
      teaserNote: 'The question about lunch is a teaser for the next episode. Leave it out of the summary.'
    }
};
