/* dashboards/list/voices.js — the voices pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS voices/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'voices/homelessness/dashboard.html', name:'Who Answers Whom? Homelessness', course:'103', group:'Reading', note:'Op-ed + letters to the editor: progress per student, wrong first picks, the class wall of student letters (projector mode), and what the class thinks of each idea.'}
]);
