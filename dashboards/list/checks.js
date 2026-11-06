/* dashboards/list/checks.js — the checks pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS checks/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'checks/dashboard.html',            name:'Read-aloud Check',              course:'both', group:'Speaking', note:'A student reads to you; tap the words they miss. Next check shows last time\u2019s misses. Most-missed words per period.'}
]);
