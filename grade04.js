/* grade04.js — the gradebook's 0–4, on every teacher page.
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

  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';

  function band(pct) {
    if (pct == null || isNaN(pct)) return null;
    pct = +pct;
    if (pct >= 90) return 4;
    if (pct >= 75) return 3;
    if (pct >= 60) return 2;
    if (pct > 0)  return 1;
    return 0;
  }
  function fmt(pct) { var b = band(pct); return b == null ? '\u2014' : String(b); }

  var COLOR = ['#b23a2c', '#c0531f', '#b5820c', '#4f8a52', '#1F7A4D'];
  function badge(pct, title) {
    var b = band(pct);
    if (b == null) return '<span class="gal04 gal04-none" title="no attempt yet">\u2014</span>';
    return '<span class="gal04 gal04-' + b + '" style="background:' + COLOR[b] + '"' +
           (title ? ' title="' + String(title).replace(/"/g, '&quot;') + '"' : '') + '>' + b + '</span>';
  }

  /* one student's email in the form the gradebook stores it */
  function canon(e) { return String(e || '').trim().toLowerCase().replace('@s.sfusd.edu', '@sfusd.edu'); }

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
    return fetch(q, { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } })
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

  window.GAL04 = { band: band, fmt: fmt, badge: badge, load: load, canon: canon, decorate: schedule };

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
