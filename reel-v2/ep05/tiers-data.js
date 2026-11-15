/* After-the-story tier data for ep05, "Where Is Room 318?" (T-419)
   (owned by the tiers chat; loaded by ../tiers.js).
   Episode 5 teaches direction words with go and turn (left, right, straight, upstairs,
   downstairs, inside, outside, through) and reading a school map, so the Tier B ladders
   swap the direction phrase and keep the sequence word with its comma. The how-to poster
   at the end is the Episode 6 teaser (teaser: true in the page), so it stays out of all
   three tiers. */
window.EP_TIERS = {
    /* order: 4 events, ends anchored. The first and last must be right; the two in the
       middle count right in either order — Linh meets Amira and Jun one after the other,
       and a student can retell that pair either way round. */
    order: [
      { t: 'Linh asks Paolo how to get to Room 318.', lock: 1 },
      { t: 'She follows his directions and finds Room 118: the art room.' },
      { t: 'Jun shows her how to read the school map.' },
      { t: 'Linh gets to Room 318 before the bell.', lock: "last" }
    ],
    /* two worked examples for Tier B. [brackets] mark the words that changed. */
    bex: [
      { how: "Change the direction words.", from: "First, go [straight]. Then, turn [left].", to: "First, go [upstairs]. Then, turn [right]." },
      { how: "Say it the other way around. Keep the comma with the sequence word.", from: "[First, go upstairs.] [Then, turn right.]", to: "[Turn right] [after you go upstairs.]" }
    ],
    key: [
      { t: 'Linh cannot find Room 318.', swap: 'cannot find Room 318',
        rungs: [ ['can’t find Room 318'],
                 ['does not know where Room 318 is', 'is lost in the school'],
                 ['Linh looks at her schedule and asks, “Where is it?”', 'Linh has science in Room 318, but she does not know the way.'] ],
        idea: 'what Linh’s problem is', ideas: /\b(lost|can.?not find|can.?t find|does not know|doesn.?t know|where|room ?318|science)\b/i },
      { t: 'The hallway is loud, so Paolo hears the wrong number.', swap: 'hears the wrong number',
        rungs: [ ['hears 118, not 318'],
                 ['hears a different room number', 'does not hear her correctly'],
                 ['The hallway is full of students, and Paolo hears 118.', 'Everybody is talking, so Paolo hears the wrong room.'] ],
        idea: 'why the directions were wrong', ideas: /\b(loud|noisy|hear|heard|118|wrong (number|room)|hallway)\b/i },
      { t: 'His directions take her to the art room.', swap: 'take her to the art room',
        rungs: [ ['take her to Room 118'],
                 ['send her to the wrong room', 'take her to Amira’s art class'],
                 ['She goes straight and turns left, and the door says 118.', 'Amira says, “No, this is art. This is Room 118.”'] ],
        idea: 'where Linh ends up first', ideas: /\b(art|118|wrong room|amira|door)\b/i },
      { t: 'Jun teaches her to read the map.', swap: 'teaches her to read the map',
        rungs: [ ['shows her the map'],
                 ['helps her find the way', 'tells her how to use the map'],
                 ['First, find your location. Then, find Room 318.', 'Jun says to move your finger from the star to the room.'] ],
        idea: 'who helps, and how', ideas: /\b(jun|map|star|location|destination|finger|read)\b/i },
      { t: 'Linh gets to Room 318 on time.', swap: 'gets to Room 318 on time',
        rungs: [ ['finds Room 318'],
                 ['gets there before the bell', 'is not late for science'],
                 ['The bell rings, and Linh is in Room 318.', 'She goes upstairs, turns right, and finds 318 at the end.'] ],
        idea: 'how it ends', ideas: /\b(318|on time|bell|found|finds|upstairs|third floor|science)\b/i }
    ],
    topic: {
      ask: 'Which sentence is the best topic sentence for this story?',
      opts: [ 'Linh gets lost on the way to Room 318, and Jun teaches her to read the school map.',
              'Mateo goes downstairs and outside for P.E.',
              'Next week, every student makes a how-to poster.' ],
      good: 0,
      why: [ 'Yes. This sentence tells what the whole story is about.',
             'That is one detail about one person. Which sentence tells the whole story?',
             'That is the last line. It is a teaser for Episode 6, not this story.' ]
    },
    summary: {
      min: 25,
      hint: 'Look at the pictures. Write 4 or 5 sentences about the story in your own words. Use the sequence words with their commas (First, Then, Next, Finally) and the direction words with go or turn: go straight, go upstairs, turn left, turn right. Leave out the poster at the end: it is for Episode 6.',
      teaser: /poster|how-?to|next week|project/i,
      teaserNote: 'The how-to poster is a teaser for the next episode. Leave it out of the summary.'
    }
};
