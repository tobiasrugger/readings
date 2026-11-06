/* dashboards/list/teachme.js — the teachme pages on the front door.
 *
 * THIS FILE BELONGS TO WHOEVER OWNS teachme/. Add, rename or remove a line here
 * and nowhere else; no other chat touches it, so two chats can ship teacher
 * pages on the same day without one overwriting the other's entry.
 * (That happened twice in two days with the old single list.js — T-319.)
 *
 * Same entry shape as before: url, name, course ('101' | '103' | 'both'),
 * group (Data, Reading, Vocabulary, Speaking, Writing, Grammar, Unit), note.
 */
window.DASHBOARDS = (window.DASHBOARDS || []).concat([
{url:'teachme/dashboard.html',          name:'Teach Mr. Toby \u2014 check their words, my practice, Quiz Mr. Toby', course:'101', group:'Vocabulary', note:'Every word students taught you, with how to say it in English letters and what it means back in English; tap \u2714 / \u2248 / \u2717. Practise five a day in My practice, with their voices. Quiz Mr. Toby = projector mode: the class judges you. Set picker at the top: Unit 1 or Lesson 1\u20135 (?set=u1-l3).'}
]);
