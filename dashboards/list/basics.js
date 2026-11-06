/* dashboards/list/basics.js — the basics pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS basics/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'basics/dashboard.html',           name:'Daily Basics',                  course:'101', group:'Unit', note:'Daily grade out of 20 (Warm-up 12 + Stretch 8). \ud83d\udcdd Paper scores tab: type each student\u2019s Warm-up and Stretch from a paper sheet; it goes to the gradebook.'},
{url:'basics/print/',                   name:'Daily Basics \u2014 print & project', course:'101', group:'Unit', note:'Paper sheet: Warm-up (12) on the front, Stretch (8) on the back, levels A/B/C, answer key on its own page. A sheet code remakes the same sheet later. Or put it on the board.'},
{url:'basics/ref/',                     name:'Daily Basics \u2014 help sheet', course:'101', group:'Unit', note:'Words and grammar (pronouns, am/is/are, have/has, question words, joining words, the lesson\u2019s words) in each student\u2019s language. Print a table copy: \u4e2d\u6587/Espa\u00f1ol/\u0627\u0644\u0639\u0631\u0628\u064a\u0629 or Vi\u1ec7t/\u0e44\u0e17\u0e22/\u0928\u0947\u092a\u093e\u0932\u0940. Teacher can fix a translation (password).'}
]);
