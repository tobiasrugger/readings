/* =====================================================================
   track.js — Galileo readings: one shared tracker.

   Include ONE line at the bottom of any page:
       <script src="/readings/track.js"></script>

   It does not need the page to cooperate. It wraps fetch(), watches the
   saves the page already makes to Supabase, and from those it:
     1. learns the student's email  -> writes a row in `students`
        (this is what finally gives every app the same student ID)
     2. notices turned_in:true      -> reads the score off the page and
        writes a row in `activity_attempts`
   Nothing else in the page changes. Safe to include twice.
   ===================================================================== */
(function () {
  if (window.__GAL_TRACK__) return;
  window.__GAL_TRACK__ = true;

  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  function H(extra) {
    var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  /* ---------- slug from the page's own path ---------- */
  var SLUG = (function () {
    var p = location.pathname.replace(/^\/+/, '').replace(/\.html?$/i, '');
    p = p.replace(/^readings\//, '');
    p = p.replace(/\/index$/, '').replace(/\/$/, '');
    if (!p || p === 'index') p = 'home';
    return p;
  })();
  window.GAL_SLUG = SLUG;

  var clean = function (e) { return String(e || '').trim().toLowerCase(); };
  var lastLog = 0, knownEmail = '';

  /* ---------- remember / publish the student ---------- */
  function noteEmail(email, name) {
    email = clean(email);
    if (!email || email.indexOf('@') < 0 || email === knownEmail) return;
    knownEmail = email;
    try { localStorage.setItem('gal_student_email', email); } catch (e) {}

    var row = { email: email, updated_at: new Date().toISOString() };
    if (name) {
      var parts = String(name).trim().split(/\s+/);
      row.first_name = parts.shift() || null;
      if (parts.length) row.last_name = parts.join(' ');
    }
    // merge-duplicates means an existing profile is never wiped by a blank name
    fetch(SUPA_URL + '/rest/v1/students?on_conflict=email', {
      method: 'POST',
      headers: H({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify([row])
    }).catch(function () {});
  }

  /* ---------- read a score off whatever the page rendered ---------- */
  function readScore() {
    var got = [], seen = {};

    function add(key, r, t) {
      if (!(t > 0) || r < 0 || r > t) return;
      if (seen[key]) return;
      seen[key] = 1;
      got.push([r, t]);
    }

    // "7 / 10 correct", "7/10 correct", "Score: 7 / 10"
    var nodes = document.querySelectorAll(
      '[id*="score" i],[class*="score" i],[id$="_pts"],[data-q$="_pts"]'
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var txt = (el.value != null && el.value !== '') ? el.value : el.textContent;
      var m = String(txt || '').match(/(\d+)\s*\/\s*(\d+)/);
      if (!m) continue;
      // vocab_score, vocab_pts and #vocab_scorebox are all the same quiz
      var key = (el.id || el.getAttribute('data-q') || '')
                  .toLowerCase()
                  .replace(/[_-]?(score(box)?|pts|points|result)s?$/, '');
      add(key || ('n' + i), +m[1], +m[2]);
    }

    // pages that expose their own number win over scraping
    if (typeof window.GAL_SCORE === 'number' && typeof window.GAL_MAX === 'number') {
      return { score: window.GAL_SCORE, max: window.GAL_MAX, parts: 1, source: 'page' };
    }
    if (!got.length) return null;

    var r = 0, t = 0;
    for (var j = 0; j < got.length; j++) { r += got[j][0]; t += got[j][1]; }
    return { score: r, max: t, parts: got.length, source: 'dom' };
  }

  /* ---------- log one completed attempt ---------- */
  function logAttempt(email, extra) {
    email = clean(email);
    if (!email) return;
    var now = Date.now();
    if (now - lastLog < 8000) return;   // ignore double-clicks
    lastLog = now;

    var s = readScore();
    var row = {
      email: email,
      slug: SLUG,
      score: s ? s.score : null,
      max_score: s ? s.max : null,
      detail: Object.assign({ path: location.pathname, source: s ? s.source : 'none',
                              parts: s ? s.parts : 0 }, extra || {}),
      completed_at: new Date().toISOString()
    };
    fetch(SUPA_URL + '/rest/v1/activity_attempts', {
      method: 'POST',
      headers: H({ Prefer: 'return=minimal' }),
      body: JSON.stringify([row])
    }).catch(function () {});
  }
  window.GAL_logAttempt = function (extra) { logAttempt(knownEmail, extra); };

  /* ---------- the hook ---------- */
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();

      if (url.indexOf('/rest/v1/') > -1 && method === 'POST' &&
          url.indexOf('activity_attempts') < 0 && url.indexOf('/students') < 0) {
        var body = init && init.body;
        if (typeof body === 'string' && body.length < 400000) {
          var data = null;
          try { data = JSON.parse(body); } catch (e) {}
          var rows = Array.isArray(data) ? data : (data ? [data] : []);
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (!row || typeof row !== 'object') continue;
            var em = row.email || row.student_email || row.user_email;
            if (em) noteEmail(em, row.name || row.student_name || row.full_name);
            if (row.turned_in === true || row.turned_in === 'true') {
              logAttempt(em || knownEmail, { table: (url.split('/rest/v1/')[1] || '').split('?')[0] });
            }
          }
        }
      }
    } catch (e) { /* never break the page's own save */ }
    return realFetch(input, init);
  };

  /* ---------- fallback: pages that turn in without a turned_in flag ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target;
    for (var hop = 0; el && hop < 3; hop++, el = el.parentElement) {
      var t = (el.textContent || '').trim().toLowerCase();
      if (el.tagName === 'BUTTON' && t.length < 40 && /turn\s*in|hand\s*in|i'?m finished|finish/.test(t)) {
        setTimeout(function () { if (knownEmail) logAttempt(knownEmail, { via: 'button' }); }, 1200);
        return;
      }
    }
  }, true);

  /* ---------- seed identity from a link like ?email=... ---------- */
  try {
    var q = new URLSearchParams(location.search).get('email');
    if (q) noteEmail(q);
    else {
      var saved = localStorage.getItem('gal_student_email');
      if (saved) knownEmail = clean(saved);
    }
  } catch (e) {}
})();
