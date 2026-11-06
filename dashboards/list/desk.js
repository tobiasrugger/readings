/* dashboards/list/desk.js — the desk pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS desk/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'desk/dashboard.html',      name:'Teacher\u2019s Desk \u2014 piles of paper', course:'both', group:'Data', note:'One desk per period: every assignment with its not-finished and done piles; tap a sheet to read that student\u2019s work. Gradebook underneath: \ud83d\udcca per activity, tap a score to jump to that student on its dashboard, \u2691 stuck, blue extra work for chosen students, and a tray to push a sheet to the whole period.'}
]);
