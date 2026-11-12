/* After-the-story tier data for ep04, "What's for Lunch Today?"
   (owned by the tiers chat; loaded by ../tiers.js).
   Episode 4 teaches the steps for lunch and the sequence words with their commas —
   First, Then, Also, Next, Finally — so the Tier B ladders swap one sequence word for
   another and keep the comma. Room 318 is the Episode 5 teaser (teaser: true in the
   page), so it stays out of all three tiers. */
window.EP_TIERS = {
    ask: 'Ask your teacher which activity to do next.',
    /* order: 4 events, ends anchored. The first and last must be right; the two in the
       middle count right in any order, because both orders really are defensible. */
    order: [
      { t: 'The bell rings. It is lunch time.', lock: 1 },
      { t: 'Amira teaches Linh the steps in the line.' },
      { t: 'Amira calls Linh back for a drink.' },
      { t: 'After they eat, they clean up the table.', lock: "last" }
    ],
    /* two worked examples for Tier B. [brackets] mark the words that changed. */
    bex: [
      { how: "Change one word.", from: "[Then], they find an empty table and sit down.", to: "[Next], they find an empty table and sit down." },
      { how: "Say it the other way around. Keep the comma with the sequence word.", from: "[First, wait in line.] [Then, take a tray.]", to: "[Take a tray] [after you wait in line.]" }
    ],
    key: [
      { t: 'Students get lunch in the same order every day.', swap: 'in the same order every day',
        rungs: [ ['in the same order'],
                 ['step by step', 'the same way every day'],
                 ['First, Then, Also, Next, Finally \u2014 every day.', 'Every day the steps are the same.'] ],
        idea: 'that lunch has steps', ideas: /\b(steps?|order|same way|first|then|next|finally)\b/i },
      { t: 'Linh does not know the steps.', swap: 'does not know the steps',
        rungs: [ ['doesn\u2019t know the steps'],
                 ['is new, so she does not know what to do', 'does not know what to do first'],
                 ['Linh has never had lunch at this school.', 'asks, \u201cWhat do I do first?\u201d'] ],
        idea: 'what Linh\u2019s problem is', ideas: /\b(new|does not know|doesn.?t know|never|what do i do|confus|asks)\b/i },
      { t: 'Amira teaches her the steps.', swap: 'teaches her the steps',
        rungs: [ ['shows her the steps'],
                 ['tells her what to do', 'helps her in the line'],
                 ['First, wait in line. Then, take a tray.', 'Amira says: wait, take a tray, take a napkin, choose your food.'] ],
        idea: 'who helps, and how', ideas: /\b(amira|teach|show|tell|help|wait in line|tray|napkin|fork|choose)\b/i },
      { t: 'Linh forgets her drink.', swap: 'forgets her drink',
        rungs: [ ['forgets a drink'],
                 ['has food, but no drink', 'has to go back for a drink'],
                 ['Amira calls her back for a drink.', 'Linh walks past the milk.'] ],
        idea: 'what Linh forgets', ideas: /\b(drink|milk|forg|go back|calls? her back)\b/i },
      { t: 'Everyone cleans up at the end.', swap: 'cleans up at the end',
        rungs: [ ['cleans up the table'],
                 ['cleans up after they eat', 'takes their tray away'],
                 ['Finally, they clean up the table.', 'Jun tells Mateo to clean up his tray.'] ],
        idea: 'the last step', ideas: /\b(clean|last step|finally|tray|after they eat|jun|mateo)\b/i }
    ],
    topic: {
      ask: 'Which sentence is the best topic sentence for this story?',
      opts: [ 'Linh is new, so Amira teaches her the steps for getting lunch.',
              'Paolo finds an empty table with five seats.',
              'Linh has to find Room 318 for her next class.' ],
      good: 0,
      why: [ 'Yes. This sentence tells what the whole story is about.',
             'That is one detail about one person. Which sentence tells the whole story?',
             'That is the last line. It is a teaser for Episode 5, not the main story.' ]
    },
    summary: {
      min: 25,
      hint: 'Look at the pictures. Write 4 or 5 sentences about the story in your own words. Use the sequence words with their commas: First, Then, Also, Next, Finally. Leave out Room 318 at the end: it is for Episode 5.',
      teaser: /room ?318|upstairs|downstairs|next class/i,
      teaserNote: 'Room 318 is a teaser for the next episode. Leave it out of the summary.'
    }
};
