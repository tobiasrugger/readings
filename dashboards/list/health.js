/* dashboards/list/health.js — the health pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS health/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'health/dashboard.html',    name:'Site health \u2014 failed saves', course:'both', group:'Data', note:'Every save a student page tried that the database refused (wrong column, missing table, bad data), grouped by page and table: count, students, first and last seen, the error text. Red banner when something new broke in the last 24 hours.'}
]);
