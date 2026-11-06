/* dashboards/list/eld103.js — the eld103 pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS eld103/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'eld103/dashboard.html',           name:'ELD 103 Writing',               course:'103', group:'Writing'},
{url:'eld103/ch1-2/dashboard.html',     name:'ELD 103 Ch. 1\u20132',          course:'103', group:'Writing'},
{url:'eld103/ch3/dashboard.html',       name:'ELD 103 Ch. 3',                 course:'103', group:'Writing'},
{url:'eld103/unit1/dashboard.html',     name:'ELD 103 Unit 1: Introducing People', course:'103', group:'Writing'},
{url:'eld103/respect/dashboard.html',   name:'Respect reflection',            course:'103', group:'Writing'}
]);
