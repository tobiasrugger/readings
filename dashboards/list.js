/* dashboards/list.js — FROZEN. Do not add pages here.
 *
 * The registry moved to dashboards/list/<folder>.js (T-319, Nov 2026), one file
 * per folder, so two chats shipping teacher pages on the same day stop
 * overwriting each other. This file stays only so the pages that already load
 * it keep working and keep seeing NEW pages: it just pulls in the loader.
 *
 * Readers that come through here: shelves/, atlas/, desk/dashboard.html.
 * To add a page: edit dashboards/list/<your folder>.js. A new top-level folder
 * also adds one line to FILES in dashboards/list/index.js.
 */
(function () {
  var me = document.currentScript || (function () {
    var s = document.getElementsByTagName('script'); return s[s.length - 1];
  })();
  var base = String(me && me.src || '').replace(/[^/]*$/, '');   // .../dashboards/
  document.write('<scr' + 'ipt src="' + base + 'list/index.js"></scr' + 'ipt>');
})();
