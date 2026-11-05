/* grade04.js — the gradebook's 0–4.5, on every teacher page.
 *
 * THE SCALE (T-302, Toby, Nov 5): 0 = 0–14%, 1 = 15–35, 2 = 36–55, 3 = 56–75,
 * 4 = 76–94, 4.5 = 95–100; never attempted = blank. Read GAL04.BANDS or call
 * GAL04.band(pct) — do not keep your own cut points in a dashboard.
 *
 * ONE STUDENT = ONE USERNAME (T-305): GAL04.key(email) is the part before the
 * @, lowercased; GAL04.same(a, b) compares two addresses that way, aliases
 * included. A dashboard that matches students itself should use these instead
 * of comparing email strings, so one student never splits into two rows.
 *
 * Why: each dashboard works out its own display from its own table, so the same
 * student could read 82% here, "7/9" there and a green tick somewhere else. This
 * puts the ONE number the gradebook shows — and the one that goes into Synergy —
 * next to each student, wherever they appear.
 *
 * Use it either way:
 *
 *   <script src="/readings/grade04.js" data-slugs="landlady,vocab/landlady-1"></script>
 *   <script src="/readings/grade04.js" data-prefix="news"></script>
 *       Same, but every slug under that folder — news, news/ai, news/food … — so
 *       the dashboard keeps up on its own as new ones appear.
 *       Auto mode. Reads gradebook_best for those slugs and drops a 0–4 badge
 *       beside every student email it finds on the page, now and as rows render.
 *       data-slugs="*" takes every slug (slower; only for an all-activities page).
 *
 *   GAL04.band(pct) -> 0..4        GAL04.fmt(pct) -> "3" or "—"
 *   GAL04.badge(pct) -> HTML       GAL04.load(slugs) -> Promise<{email:{pct,band,slug}}>
 *       API mode, for a dashboard that wants the number in its own column.
 *
 * Banding matches readings/gradebook/: 4 = 90+, 3 = 75–89, 2 = 60–74,
 * 1 = started but under 60, 0 = nothing right. Never attempted shows nothing.
 */
(function () {
  'use strict';
  if (window.GAL04) return;

  /* T-230: every page that loads grade04.js is a teacher page -> 🍎 (📊 on the gradebook) */
  window.GAL_TEACHER_PAGE = true;
  try {
    if (window.GAL_ICON) window.GAL_ICON.auto();
    else {
      var icFrom = document.currentScript && document.currentScript.src;
      var ic = document.createElement('script');
      ic.src = icFrom ? icFrom.replace(/grade04\.js(\?.*)?$/, 'icon.js') : '/readings/icon.js';
      (document.head || document.documentElement).appendChild(ic);
    }
  } catch (e) {}

  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';

  /* T-302 (Toby, Nov 5): the scale Synergy uses, which has a 4.5.
     Each pair is [lowest percent, mark]. Half the work should read as a 2,
     not a 1 — a student at 54% was showing a 1 under the old 90/75/60 cuts.
     Never attempted stays blank. This table is THE one: read GAL04.BANDS
     instead of keeping your own cut points. */
  var BANDS = [[95, 4.5], [76, 4], [56, 3], [36, 2], [15, 1], [0, 0]];
  function band(pct) {
    if (pct == null || isNaN(pct)) return null;
    pct = Math.round(+pct);
    for (var i = 0; i < BANDS.length; i++) if (pct >= BANDS[i][0]) return BANDS[i][1];
    return 0;
  }
  function fmt(pct) { var b = band(pct); return b == null ? '\u2014' : String(b); }

  /* 0, 1, 2, 3, 4, then 4.5 stronger than the 4 */
  var COLOR = ['#b23a2c', '#c0531f', '#b5820c', '#4f8a52', '#1F7A4D'];
  var COLOR45 = '#0d5c3a';
  function colorFor(b) { return b === 4.5 ? COLOR45 : COLOR[b]; }
  function badge(pct, title) {
    var b = band(pct);
    if (b == null) return '<span class="gal04 gal04-none" title="no attempt yet">\u2014</span>';
    return '<span class="gal04 gal04-' + String(b).replace('.', '-') + '" style="background:' + colorFor(b) + '"' +
           (title ? ' title="' + String(title).replace(/"/g, '&quot;') + '"' : '') + '>' + b + '</span>';
  }

  /* T-305 USERNAME IS THE ID. One student = the part before @, lowercased —
     std.js gives pages the same rule as GAL.key; dashboards don't all load
     std.js, so the one line lives here too and is exported as GAL04.key.
     ALIAS folds student_aliases in, so a student whose old address was merged
     away still gets their badge. Without this a dashboard that happens to
     print a different spelling silently showed NO badge, which reads as
     "this student did nothing" rather than as a matching failure. */
  var ALIAS = {};
  function key(e) { return String(e == null ? '' : e).trim().toLowerCase().split('@')[0].replace(/\s+/g, ''); }
  function canon(e) { var k = key(e); return ALIAS[k] || k; }
  function loadAliases() {
    return fetch(SUPA_URL + '/rest/v1/student_aliases?select=alias_email,email',
                 { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        (rows || []).forEach(function (a) {
          var from = key(a.alias_email), to = key(a.email);
          if (from && to && from !== to) ALIAS[from] = to;
        });
        return ALIAS;
      })
      .catch(function () { return ALIAS; });   // no aliases is fine; usernames still group
  }

  function load(slugs, prefix) {
    var q = SUPA_URL + '/rest/v1/gradebook_best?select=email,slug,title,pct,attempts,last_at';
    if (prefix) {
      /* everything under a folder, so a dashboard keeps working as new slugs appear */
      q += '&or=(slug.eq.' + encodeURIComponent(prefix) + ',slug.like.' + encodeURIComponent(prefix + '/*') + ')';
    } else if (slugs && slugs !== '*') {
      var list = (typeof slugs === 'string' ? slugs.split(',') : slugs)
        .map(function (s) { return String(s).trim(); }).filter(Boolean);
      if (!list.length) return Promise.resolve({});
      q += '&slug=in.(' + list.map(encodeURIComponent).join(',') + ')';
    }
    return loadAliases().then(function () {
      return fetch(q, { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } });
    })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        /* a student may have several of the listed slugs: keep the best, remember how many */
        var by = {};
        rows.forEach(function (r) {
          var e = canon(r.email); if (!e) return;
          var cur = by[e];
          if (!cur || (r.pct != null && (cur.pct == null || +r.pct > +cur.pct))) {
            by[e] = { pct: r.pct, slug: r.slug, title: r.title, attempts: r.attempts, last_at: r.last_at, n: cur ? cur.n + 1 : 1 };
          } else { cur.n++; }
        });
        return by;
      })
      .catch(function () { return {}; });
  }

  /* ---------- auto mode ---------- */
  var EMAIL = /[a-z0-9._%+-]+@s?\.?sfusd\.edu/i;
  var DATA = null, pending = false;

  function style() {
    if (document.getElementById('gal04-css')) return;
    var s = document.createElement('style');
    s.id = 'gal04-css';
    s.textContent =
      '.gal04{display:inline-block;min-width:1.5em;padding:1px 7px;margin-left:6px;border-radius:7px;' +
      'color:#fff;font-weight:900;font-size:.82em;line-height:1.5;vertical-align:middle;font-family:inherit}' +
      '.gal04-none{background:#eceeea;color:#6b7b74;font-weight:700}';
    document.head.appendChild(s);
  }

  /* Put the badge next to the email, without disturbing the page's own markup:
     we only ever append one span, and only once per element. */
  function decorate() {
    if (!DATA) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var hits = [], n;
    while ((n = walker.nextNode())) {
      if (!EMAIL.test(n.nodeValue)) continue;
      var host = n.parentElement;
      if (!host || host.closest('.gal04-done') || host.querySelector && host.querySelector('.gal04')) continue;
      hits.push([host, (n.nodeValue.match(EMAIL) || [''])[0]]);
    }
    hits.forEach(function (h) {
      var host = h[0], rec = DATA[canon(h[1])];
      host.classList.add('gal04-done');
      if (!rec) return;                       // no attempt: leave the page as it was
      var span = document.createElement('span');
      span.innerHTML = badge(rec.pct, (rec.title || rec.slug) + ' \u00b7 ' + rec.pct + '% \u00b7 ' +
                        rec.attempts + ' attempt' + (rec.attempts === 1 ? '' : 's') +
                        (rec.n > 1 ? ' \u00b7 best of ' + rec.n + ' activities' : ''));
      host.appendChild(span.firstChild);
    });
  }
  function schedule() {
    if (pending) return; pending = true;
    setTimeout(function () { pending = false; decorate(); }, 150);
  }

  /* ---------- the way back ----------
     Every teacher page gets one button, top left, to the front door at
     readings/dashboards/. It lives here so a page never has to be edited
     for it; a page that already has its own back link keeps that too. */
  function backButton() {
    if (document.getElementById('gal04-back')) return;
    if (/\/dashboards\/?$|\/dashboards\/index/.test(location.pathname)) return;  // not on the front door itself
    var depth = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    depth.pop();                                   // drop the file name
    var i = depth.indexOf('readings');
    var up = i >= 0 ? depth.length - i - 1 : Math.max(0, depth.length - 1);
    var href = (up ? new Array(up + 1).join('../') : './') + 'dashboards/';
    if (i < 0 && location.hostname.indexOf('github.io') >= 0) href = '/readings/dashboards/';
    var a = document.createElement('a');
    a.id = 'gal04-back'; a.href = href; a.textContent = '\u2190 All dashboards';
    a.setAttribute('style',
      'position:fixed;left:10px;top:calc(10px + env(safe-area-inset-top,0px));z-index:9999;' +
      'background:#1F4D3D;color:#fff;font:800 13px/1 Nunito,system-ui,sans-serif;' +
      'padding:8px 12px;border-radius:9px;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,.28)');
    a.addEventListener('mouseenter', function () { a.style.background = '#2d6a4f'; });
    a.addEventListener('mouseleave', function () { a.style.background = '#1F4D3D'; });
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', backButton);
  else backButton();

  window.GAL04 = { BANDS: BANDS, band: band, fmt: fmt, badge: badge, load: load, key: key, same: function (a, b) { var k = canon(a); return !!k && k === canon(b); }, canon: canon, decorate: schedule, back: backButton };

  var me = document.currentScript,
      slugs = me && me.getAttribute('data-slugs'),
      prefix = me && me.getAttribute('data-prefix');
  if (slugs || prefix) {
    style();
    load(slugs, prefix).then(function (by) {
      DATA = by; decorate();
      /* dashboards render after their own fetches, so keep watching for new rows */
      if (window.MutationObserver) {
        new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
      }
    });
  }
})();
