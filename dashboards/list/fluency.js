/* dashboards/list/fluency.js — the fluency pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS fluency/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'fluency/dashboard.html',          name:'Fluency \u2014 read aloud',     course:'both', group:'Reading', note:'Words per minute and the recordings. Listen and tap the words they missed; your marks replace the computer\u2019s guess.'}
]);
