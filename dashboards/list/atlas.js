/* dashboards/list/atlas.js — the atlas pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS atlas/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'atlas/',                  name:'The Atlas \u2014 everything we\u2019ve built', course:'both', group:'Data', note:'Every page, maker and engine on one spiral. Tap one to peel its layers: sign-in, pictures, listening, translation, saving, score, My Page, dashboard \u2014 and read what changed.'}
]);
