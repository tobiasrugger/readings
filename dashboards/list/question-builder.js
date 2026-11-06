/* dashboards/list/question-builder.js — the question-builder pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS question-builder/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'question-builder/dashboard.html', name:'Question Builder (pictures): Find Someone Who', course:'103', group:'Grammar'}
]);
