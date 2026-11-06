/* dashboards/list/reel-v2.js — the reel-v2 pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS reel-v2/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'reel-v2/#teacher',               name:'Story Reel \u2014 who watched, practiced, translated', course:'101', group:'Speaking', note:'The Teacher table at the foot of the Story Reel page: one row per student per episode \u2014 level, answers, Your Turn, practice minutes, listens, translations (words + whole lines), last active, and Browser translate (on / leaked / nudged \u00d7N).'}
]);
