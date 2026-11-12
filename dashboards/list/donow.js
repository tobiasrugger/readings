/* dashboards/list/donow.js — the donow pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS donow/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'donow/dashboard.html',            name:'Do Now \u2014 all',             course:'both', group:'Unit'},
{url:'donow/reel-04/dashboard.html',    name:'Do Now: Reel 4 warm-up (What\u2019s for Lunch Today?)', course:'101', group:'Unit'},
{url:'donow/reel-03/dashboard.html',    name:'Do Now: Reel 3 warm-up (What Class Do We Have Now?)', course:'101', group:'Unit'},
{url:'donow/dog-01/dashboard.html',     name:'Do Now: The Dog at the Bus Stop',course:'both', group:'Unit'},
{url:'donow/0918/dashboard.html',       name:'Do Now: Sept 18',               course:'both', group:'Unit'}
]);
