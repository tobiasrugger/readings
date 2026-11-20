/* dashboards/list/monkeyspaw.js — the monkeyspaw pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS monkeyspaw/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'monkeyspaw/dashboard.html',       name:'The Monkey\u2019s Paw',         course:'103', group:'Reading'},
{url:'monkeyspaw/words/dashboard.html', name:'The Monkey\u2019s Paw: 12 words, one row each', course:'103', group:'Vocabulary', note:'Standalone page (not linked from the story): pick the picture, say it (🎤 or ✋), use it in the right sentence. Give the link to one student.'}
]);
