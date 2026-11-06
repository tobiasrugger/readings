/* dashboards/list/index.js — the loader behind readings/dashboards/.
 *
 * The registry used to be ONE file, dashboards/list.js, which every chat
 * edited when it shipped a teacher page. It collided twice in two days
 * (Nov 5 and Nov 6), each time silently dropping somebody's entry. So the
 * registry is now one file PER FOLDER, and only that folder's owner edits it.
 *
 * A BRAND-NEW top-level folder adds its name to FILES below — one line, the
 * only shared edit left. Nothing else here changes.
 *
 * The files are written with document.write so they load in order and are
 * ready the moment the page's own script runs, exactly as the single file was.
 */
window.DASHBOARD_FILES = [
  'advice',
  'arrival',
  'assign',
  'atlas',
  'audit',
  'basics',
  'brothers-in-arms',
  'checks',
  'creativity',
  'describe',
  'desk',
  'diagnostic',
  'donow',
  'easy-true',
  'eld103',
  'fables',
  'false-friends',
  'favorite-songs',
  'fluency',
  'four-agreements',
  'gradebook',
  'grasshopper-ant',
  'group',
  'groups',
  'health',
  'holidays',
  'landlady',
  'launch-plus',
  'manzanar',
  'maus',
  'missed',
  'monkeyspaw',
  'monsters',
  'news',
  'odyssey',
  'omelas',
  'oral-histories',
  'phonics',
  'psychology',
  'question-builder',
  'questions',
  'reel-test',
  'reel-v2',
  'reports',
  'resume',
  'roadmap',
  'romeo-juliet',
  'say',
  'seedfolks',
  'sept11',
  'shelves',
  'simple',
  'skills',
  'songs',
  'spell',
  'stand-by-me',
  'survival-english',
  'teacher',
  'teachme',
  'telltale',
  'this-is-how',
  'toolkits',
  'verbs',
  'vocab',
  'voices',
  'wordgame',
  'write',
  'year'
];
(function () {
  var me = document.currentScript || (function () {
    var s = document.getElementsByTagName('script'); return s[s.length - 1];
  })();
  var base = String(me && me.src || '').replace(/[^/]*$/, '');   // .../dashboards/list/
  window.DASHBOARDS = window.DASHBOARDS || [];
  window.DASHBOARD_FILES.forEach(function (f) {
    document.write('<scr' + 'ipt src="' + base + f + '.js"></scr' + 'ipt>');
  });
})();
/* Legacy paths kept working but NOT listed: the front door redirects them.
   arrival/arrival_dashboard.html -> arrival/dashboard.html
   eld103/ch3_dashboard.html      -> eld103/ch3/dashboard.html
   dashboard.html (repo root)     -> easy-true/dashboard.html
   fables/ false-friends/ grasshopper-ant/ questions/ teacher.html -> dashboard.html (T-121)
   New dashboards are named dashboard.html inside their activity's folder. */
window.DASHBOARD_LEGACY = {
  'arrival/arrival_dashboard.html': 'arrival/dashboard.html',
  'eld103/ch3_dashboard.html':      'eld103/ch3/dashboard.html',
  'dashboard.html':                 'easy-true/dashboard.html',
  'fables/teacher.html':            'fables/dashboard.html',
  'false-friends/teacher.html':     'false-friends/dashboard.html',
  'grasshopper-ant/teacher.html':   'grasshopper-ant/dashboard.html',
  'questions/teacher.html':         'questions/dashboard.html'
};