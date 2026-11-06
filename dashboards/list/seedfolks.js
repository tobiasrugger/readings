/* dashboards/list/seedfolks.js — the seedfolks pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS seedfolks/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'seedfolks/dashboard.html',        name:'Seedfolks',                     course:'both', group:'Reading'},
{url:'seedfolks/quiz-prep/dashboard.html', name:'Seedfolks: Quiz Practice 1 (group)', course:'101', group:'Reading', note:'Slides marked right, not-yet taps, repeats asked, words spelled aloud.'}
]);
