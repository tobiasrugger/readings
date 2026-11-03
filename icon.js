/* icon.js — T-230 (Nov 2026). The little picture in the Chrome tab.
 *   📊 the gradebook (so it stands out)
 *   🍎 every other teacher page, and a page's own Teacher tab while it is open
 *   🦁 every student activity
 * Loaded by track.js (student pages) and grade04.js (dashboards); teacher pages
 * that load neither carry <script src="/readings/icon.js" data-teacher></script>.
 * Safe to load twice. A page can force one with GAL_ICON('🍎').
 */
(function () {
  'use strict';
  if (window.GAL_ICON) { window.GAL_ICON.auto(); return; }

  var LION = '\uD83E\uDD81', APPLE = '\uD83C\uDF4E', CHART = '\uD83D\uDCCA';
  var current = '';

  function set(emoji) {
    if (!emoji || emoji === current) return;
    try {
      var head = document.head || document.documentElement;
      var old = document.querySelectorAll('link[rel~="icon"]');
      for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
      var l = document.createElement('link');
      l.rel = 'icon';
      l.setAttribute('data-gal-icon', '1');
      l.href = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="88">' + emoji + '</text></svg>');
      head.appendChild(l);
      current = emoji;
    } catch (e) {}
  }

  var TEACHER_PATH = /\/(gradebook|dashboards|assign|reports|shelves|teacher|atlas|audit|roadmap|desk|skills|robot|groups|dashboard)\/|dashboard[^\/]*\.html|report\.html|preview\.html|handout\.html|maker\.html|teacher-guide|mywords\.html|check\.html|\/basics\/print\//i;

  function isTeacherPage() {
    if (window.GAL_TEACHER_PAGE) return true;
    if (document.querySelector('script[src*="icon.js"][data-teacher]')) return true;
    if (document.querySelector('script[src*="grade04.js"]')) return true;
    return TEACHER_PATH.test(location.pathname);
  }
  function base() {
    if (/\/gradebook\//i.test(location.pathname)) return CHART;
    return isTeacherPage() ? APPLE : LION;
  }
  function auto() {
    if (/teacher/i.test(location.hash) && base() === LION) { set(APPLE); return; }
    set(base());
  }

  /* a student page's own Teacher tab: 🍎 while it's open, 🦁 again on any sibling tab */
  function isTeacherTab(el) {
    if (!el) return false;
    var key = (el.getAttribute('data-p') || el.getAttribute('data-tab') || el.id || '').toLowerCase();
    if (key === 'teacher' || key === 'tab-teacher' || key === 'tabteacher') return true;
    return /^\s*(\S+\s+)?teacher\s*$/i.test(el.textContent || '') && (el.textContent || '').length < 30;
  }
  document.addEventListener('click', function (ev) {
    if (base() !== LION) return;
    var el = ev.target && ev.target.closest ? ev.target.closest('button,a,[role="tab"]') : null;
    if (!el) return;
    if (isTeacherTab(el)) { set(APPLE); return; }
    var p = el.parentNode, kids = p ? p.children : [];
    for (var i = 0; i < kids.length; i++) if (kids[i] !== el && isTeacherTab(kids[i])) { set(LION); return; }
  }, true);
  window.addEventListener('hashchange', auto);

  window.GAL_ICON = function (emoji) { set(emoji); };
  window.GAL_ICON.auto = auto;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
  auto();
})();
