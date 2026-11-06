/* dashboards/list/vocab.js — the vocab pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS vocab/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'vocab/pre/dashboard.html',          name:'Vocabulary pre-assessments',  course:'101', group:'Vocabulary'},
{url:'vocab/pre/report.html',             name:'Vocabulary \u2014 class report', course:'101', group:'Vocabulary'},
{url:'vocab/pretest-ll12/dashboard.html', name:'Vocabulary pre-test (U1\u2013U2)', course:'101', group:'Vocabulary'}
]);
