/* dashboards/list/simple.js — the simple pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS simple/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'simple/dashboard.html',    name:'English - simple \u2014 who sees it', course:'both', group:'Data', note:'Tick students who speak a home language but can\u2019t read it: they get easy English definitions instead of a translation. Or switch it on for everyone (challenge day). Try-a-word box shows what a student would see.'}
]);
