/* After-the-story tier data for ep02 (owned by the tiers chat; loaded by ../tiers.js). */
window.EP_TIERS = {
    ask: 'Ask your teacher which activity to do next.',
    key: [
      { t: 'Jun cannot find his backpack.', swap: 'cannot find his backpack',
        rungs: [ ['can\u2019t find his backpack'], ['does not have his backpack', 'is looking for his backpack'], ['Jun\u2019s backpack is missing.', 'forgot his backpack somewhere'] ],
        idea: 'what the problem is', ideas: /\b(can.?t find|cannot find|missing|lost|forgot|forgets|looking for|does not have|doesn.?t have)\b/i },
      { t: 'His friends help him look for it.', swap: 'help him look for it',
        rungs: [ ['help him find it'], ['look for it with him', 'go with him to find it'], ['Amira, Linh and Mateo help him.', 'Everyone helps Jun look.'] ],
        idea: 'who helps', ideas: /\b(friends?|helps?|amira|linh|mateo|together|with him)\b/i },
      { t: 'They look in many places at school.', swap: 'look in many places at school',
        rungs: [ ['look in many places'], ['go to the library, the gym and the cafeteria', 'look everywhere at school'], ['They check many rooms at school.', 'look in four places'] ],
        idea: 'where they look', ideas: /\b(library|gym|cafeteria|classroom|places?|everywhere|rooms?)\b/i },
      { t: 'The backpack is in the music corner.', swap: 'is in the music corner',
        rungs: [ ['is next to the piano'], ['is in the corner, by the piano', 'was in the music corner the whole time'], ['Jun forgot it in the music corner.', 'Jun left it by the piano.'] ],
        idea: 'where the backpack is', ideas: /\b(music corner|corner|piano)\b/i },
      { t: 'Now Jun has his backpack again.', swap: 'has his backpack again',
        rungs: [ ['has his backpack back'], ['finds his backpack', 'is happy because he has his backpack'], ['Jun is happy now.', 'has everything again'] ],
        idea: 'how it ends', ideas: /\b(again|back|finds?|found|happy|has his backpack|everything)\b/i }
    ],
    topic: {
      ask: 'Which sentence is the best topic sentence for this story?',
      opts: [ 'Jun cannot find his backpack, so his friends help him look for it at school.',
              'Paolo has ten pencils.',
              'The students do not know what class they have next.' ],
      good: 0,
      why: [ 'Yes. This sentence tells what the whole story is about.',
             'That is one detail about one person. Which sentence tells the whole story?',
             'That happens at the very end. It is a teaser for Episode 3, not the main story.' ]
    },
    summary: {
      min: 25,
      hint: 'Look at the pictures. Write 4 or 5 sentences about the story in your own words. Leave out the last question about the next class: it is for Episode 3.',
      teaser: /\b(what class|math|science|art class)\b/i
    }
};
