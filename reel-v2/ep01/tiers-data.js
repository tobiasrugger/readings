/* After-the-story tier data for ep01 (owned by the tiers chat; loaded by ../tiers.js). */
window.EP_TIERS = {
    ask: 'Ask your teacher which activity to do next.',
    key: [
      { t: 'Linh is a new student from Vietnam.', keep: true,
        idea: 'who Linh is', ideas: /\b(new|first day|vietnam|arriv\w*|moved)\b/i },
      { t: 'She is nervous.', swap: 'is nervous',
        rungs: [ ['feels nervous'], ['feels a little scared', 'is worried'], ['is shy because she is new', 'Her heart is beating fast.'] ],
        idea: 'how she feels at first', ideas: /\b(nervous|scared|worried|shy|afraid|cold)\b/i },
      { t: 'She asks questions to other students.', swap: 'asks questions to other students',
        rungs: [ ['talks to other students'], ['talks to her classmates', 'meets new students', 'talks to students in the class'],
                 ['talks to three students', 'asks Amira, Paolo and Mateo questions', 'says hello to everyone'] ],
        idea: 'what she does in class', ideas: /\b(asks?|talks?|meets?|questions?|hello|classmates?)\b/i },
      { t: 'She writes down students\u2019 answers.', swap: 'writes down students\u2019 answers',
        rungs: [ ['writes the answers'], ['writes on her paper', 'takes notes', 'fills in her worksheet'],
                 ['does her assignment', 'writes what her classmates say', 'finishes the question sheet'] ],
        idea: 'what she writes', ideas: /\b(writes?|notes|answers?|paper|worksheet|assignment)\b/i },
      { t: 'She feels more comfortable now.', swap: 'feels more comfortable now',
        rungs: [ ['feels comfortable'], ['is happy', 'feels happy', 'is relaxed', 'Linh feels relaxed.'],
                 ['Linh is calm.', 'is not nervous anymore', 'has new friends, so she feels good'] ],
        idea: 'how she feels at the end', ideas: /\b(comfortable|happy|relaxed|calm|not nervous|friends?|better|good|smiles?)\b/i }
    ],
    topic: {
      ask: 'Which sentence is the best topic sentence for this story?',
      opts: [ 'Linh is a new student, and she meets her classmates on her first day.',
              'Mateo is tall, and he plays soccer.',
              'Jun cannot find his backpack.' ],
      good: 0,
      why: [ 'Yes. This sentence tells what the whole story is about.',
             'That is one detail about one person. Which sentence tells the whole story?',
             'That happens at the very end. It is a teaser for Episode 2, not the main story.' ]
    },
    summary: {
      min: 25,
      hint: 'Look at the pictures. Write 4 or 5 sentences about the story in your own words. Leave the backpack out: it is for Episode 2.',
      teaser: /\bbackpack\b/i
    }
};
