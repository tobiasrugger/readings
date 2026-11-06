/* dashboards/list/missed.js — the missed pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS missed/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'missed/dashboard.html',               name:'Practice the words you missed', course:'101', group:'Vocabulary', note:'Each student\u2019s own misses from a word check: see it, hear it, spell it. Who hasn\u2019t started.'}
]);
