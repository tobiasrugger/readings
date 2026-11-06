/* dashboards/list/advice.js — the advice pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS advice/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'advice/dashboard.html',           name:'Dear Lion \u2014 advice letters', course:'103', group:'Writing', note:'Each student\u2019s advice, compare and misses; per-question first-try; projector wall sorted by votes.'}
]);
