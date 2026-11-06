/* dashboards/list/group.js — the group pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS group/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'group/dashboard.html',            name:'Group Practice (every deck)',   course:'both', group:'Reading', note:'Every Group Practice deck and mix: score, misses, repeats asked.'},
{url:'group/maker.html',                name:'Group Practice \u2014 make or mix a deck', course:'both', group:'Reading', note:'Teacher tool: type words, sentences, pictures and questions; get a student link.'}
]);
