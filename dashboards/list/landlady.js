/* dashboards/list/landlady.js — the landlady pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS landlady/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'landlady/dashboard.html',         name:'The Landlady',                  course:'103', group:'Reading'},
{url:'landlady/investigate/dashboard.html', name:'The Landlady: Investigate the tea', course:'103', group:'Reading', note:'Optional detective game: which bottle, which poison, the case report.'},
{url:'landlady/test/dashboard.html',    name:'The Landlady: Test',            course:'103', group:'Reading', note:'44-point test: 12 words with pictures (closed book), order, questions, cozy or warning, writing. Score Part E here; tab-leaves and 🌐 uses per student; which items were hard.'},
{url:'landlady/test/preview.html',      name:'The Landlady: Test preview (all questions)', course:'103', group:'Reading', note:'Every test question on one page, Easier/Harder, answers shown or hidden, printable. Nothing saves.'},
{url:'landlady/table/dashboard.html',   name:'The Landlady: Read it together', course:'103', group:'Reading', note:'Table read-aloud on one Chromebook: turns read, recordings to play, each student\u2019s turn length, and the one-time Fill translations button.'},
{url:'landlady/table/handout.html',     name:'The Landlady: paper story (print)', course:'103', group:'Reading', note:'Printable story with \u00b61\u2013\u00b652 numbers that match the Reader, room to write translations, the 12 words with pictures, table-talk questions.'}
]);
