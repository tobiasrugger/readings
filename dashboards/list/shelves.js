/* dashboards/list/shelves.js — the shelves pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS shelves/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'shelves/',                name:'Shelves \u2014 Lab, Trying, Ready', course:'both', group:'Data', note:'Every page on one of three shelves. When it\u2019s urgent, look only at Ready. Things to watch the first time you use a page sit on its card.'}
]);
