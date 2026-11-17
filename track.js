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
     3. (T-232, Nov 3 2026) also scores on AUTOSAVE: a few seconds after any
        save of student work it reads the score and, if it is above 0 and has
        changed, writes an attempt too (at most once a minute). A student who
        forgets Turn in still gets a grade; the gradebook keeps the best
        attempt, so this can only raise a grade. Off on teacher pages, or with
        window.GAL_NO_AUTOLOG = true.
   Nothing else in the page changes. Safe to include twice.
   ===================================================================== */
(function () {
  if (window.__GAL_TRACK__) return;
  window.__GAL_TRACK__ = true;

  /* ---------------------------------------------------------------
     T-463 (Nov 17 2026): Chrome's own page translation is OFF on every
     page that loads track.js. Students turned on "Translate to 中文" and
     Chrome rewrote the whole page, English included (seen on landlady/
     and launch-plus/u1-l3/). Pages give their own translations under
     the English, so Chrome's is never needed.
       - <html translate="no"> + class notranslate: Chrome skips the page,
         even if "always translate English" is on.
       - <meta name="google" content="notranslate">: no translate offer.
       - any old translate="yes" (vocab sets) becomes "no", or it would
         switch Chrome back on for that part.
     A tab Chrome already translated goes back to English on reload.
     --------------------------------------------------------------- */
  try {
    var R = document.documentElement;
    R.setAttribute('translate', 'no');
    R.classList.add('notranslate');
    var hd = document.head || R;
    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      var m = document.createElement('meta');
      m.name = 'google'; m.content = 'notranslate';
      hd.insertBefore(m, hd.firstChild);
    }
    var noYes = function () {
      var ys = document.querySelectorAll('[translate="yes"]');
      for (var i = 0; i < ys.length; i++) ys[i].setAttribute('translate', 'no');
    };
    noYes();
    document.addEventListener('DOMContentLoaded', noYes);
    window.addEventListener('load', noYes);
    /* pages (landlady, reel tiers, vocab sets) keep stamping translate="yes"
       on new directions as students move around; turn each one back */
    if (window.MutationObserver) {
      new MutationObserver(function (ms) {
        for (var i = 0; i < ms.length; i++) {
          var mu = ms[i];
          if (mu.type === 'attributes') {
            if (mu.target.getAttribute('translate') === 'yes') mu.target.setAttribute('translate', 'no');
          } else if (mu.addedNodes.length) {
            for (var j = 0; j < mu.addedNodes.length; j++) {
              var nd = mu.addedNodes[j];
              if (nd.nodeType !== 1) continue;
              if (nd.getAttribute('translate') === 'yes') nd.setAttribute('translate', 'no');
              if (nd.querySelector && nd.querySelector('[translate="yes"]')) noYes();
            }
          }
        }
        if (R.getAttribute('translate') !== 'no') R.setAttribute('translate', 'no');
      }).observe(R, { subtree: true, childList: true, attributes: true, attributeFilter: ['translate'] });
    }
  } catch (e) {}

  /* the student page standard (language in every sign-in box, readable dropdowns) */
  try {
    var stdFrom = document.currentScript && document.currentScript.src;
    var std = document.createElement('script');
    std.src = stdFrom ? stdFrom.replace(/track\.js(\?.*)?$/, 'std.js') : '/readings/std.js';
    (document.head || document.documentElement).appendChild(std);
  } catch (e) {}

  /* ---------------------------------------------------------------
     T-283: teacher view on pages that resume a sign-in silently.

     27 pages (basics/, launch-plus/u1-l1..l5, the 20 vocab sets, teachme/)
     remember the last sign-in for 12 hours and skip their sign-in box, so
     std.js's tvSignIn finds no box to fill and gives up: the yellow bar named
     the right student while the page loaded whoever used the laptop last, in
     the laptop's language.

     track.js runs BEFORE the page boots (pages boot on DOMContentLoaded), so
     here, synchronously, we take std.js's snapshot ourselves and clear those
     keys. The page then finds nothing to resume, opens its sign-in box, and
     std.js fills it with the right student and their home language.
     std.js's restore on Exit and pagehide puts the laptop's own sign-in back:
     it re-writes every key in the snapshot, so the extra key is covered too.
     --------------------------------------------------------------- */
  try {
    var tvq = new URLSearchParams(location.search);
    if (tvq.get('view') === 'teacher' && tvq.get('email')) {
      /* std.js's own key set, plus eld103_lang — Daily Basics reads that one
         first for its language, so leaving it behind kept the wrong language. */
      var TV_KEYS = /^(gal_student_|vocab_lang$|vocab_me$|eld103_lang$|[a-z0-9]+_student$|resume_user$)/;
      /* only the first teacher-view load in this tab snapshots, exactly as std.js does */
      if (!sessionStorage.getItem('gal_tv_snap')) {
        var snap = {}, k;
        for (var ti = 0; ti < localStorage.length; ti++) {
          k = localStorage.key(ti);
          if (TV_KEYS.test(k)) snap[k] = localStorage.getItem(k);
        }
        sessionStorage.setItem('gal_tv_snap', JSON.stringify(snap));
      }
      var drop = [];
      for (var tj = 0; tj < localStorage.length; tj++) {
        k = localStorage.key(tj);
        if (TV_KEYS.test(k)) drop.push(k);
      }
      drop.forEach(function (key) { localStorage.removeItem(key); });
    }
  } catch (e) {}

  /* T-230: tab icon (🦁 student / 🍎 teacher / 📊 gradebook) */
  try {
    if (!window.GAL_ICON) {
      var icFrom = document.currentScript && document.currentScript.src;
      var ic = document.createElement('script');
      ic.src = icFrom ? icFrom.replace(/track\.js(\?.*)?$/, 'icon.js') : '/readings/icon.js';
      (document.head || document.documentElement).appendChild(ic);
    }
  } catch (e) {}

  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  function H(extra) {
    var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  /* ---------- slug from the page's own path ---------- */
  var SLUG = (function () {
    /* a page that moved can keep its old name, so students' history stays in one place */
    if (window.GAL_SLUG_KEEP) return String(window.GAL_SLUG_KEEP);
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

  /* ---------- T-432: a blank period gets the first one the student picks ----------
     Rule (Toby, Nov 16): if a student has NO period on the class list, the first
     period they choose at sign-in is saved there. After that only Mr. Toby can
     change it (gradebook ✏ Edit students). The database function
     roster_fill_period does the deciding: it fills a blank and never changes a
     period that is already set, so calling it again is harmless. We ask once per
     student per tab. Sources: the period a page puts in its own save, and the
     period std.js remembers when a sign-in box is submitted. */
  var PFILL_KEY = 'gal_pfill_done';
  var pfillAsked = {};
  function pfillNum(p) {
    var m = String(p == null ? '' : p).trim().match(/^(?:p(?:er(?:iod)?)?\.?\s*)?([1-7])$/i);
    return m ? +m[1] : 0;
  }
  function fillPeriod(email, p) {
    try {
      email = clean(email);
      var n = pfillNum(p);
      if (!n || !/@(s\.)?sfusd\.edu$/.test(email)) return;
      if (TEACHERISH.test(location.pathname)) return;
      if (new URLSearchParams(location.search).get('view') === 'teacher') return;
      var user = email.split('@')[0];
      if (pfillAsked[user]) return;
      try { if ((sessionStorage.getItem(PFILL_KEY) || '').split(',').indexOf(user) > -1) return; } catch (e) {}
      pfillAsked[user] = 1;
      realFetch(SUPA_URL + '/rest/v1/rpc/roster_fill_period', {
        method: 'POST', keepalive: true,
        headers: H({}),
        body: JSON.stringify({ p_email: email, p_period: n })
      }).then(function (r) {
        if (!r.ok) { pfillAsked[user] = 0; return; }   /* try again on the next save */
        try {
          var done = (sessionStorage.getItem(PFILL_KEY) || '').split(',').filter(Boolean);
          if (done.indexOf(user) < 0) done.push(user);
          sessionStorage.setItem(PFILL_KEY, done.slice(-20).join(','));
        } catch (e) {}
      }).catch(function () { pfillAsked[user] = 0; });
    } catch (e) {}
  }
  window.GAL_fillPeriod = fillPeriod;
  /* std.js remembers a submitted sign-in box ~60 ms after the click */
  function pfillFromSignIn(beforeAt) {
    try {
      var at = localStorage.getItem('gal_student_at') || '';
      if (beforeAt !== null && at === beforeAt) return;            /* no sign-in happened */
      if (!at || Date.now() - +at > 70 * 60 * 1000) return;        /* stale */
      fillPeriod(localStorage.getItem('gal_student_email'), localStorage.getItem('gal_student_period'));
    } catch (e) {}
  }
  document.addEventListener('click', function () {
    var before = null;
    try { before = localStorage.getItem('gal_student_at') || ''; } catch (e) {}
    setTimeout(function () { pfillFromSignIn(before); }, 400);
  }, true);

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
    if (got.length) {
      var r = 0, t = 0;
      for (var j = 0; j < got.length; j++) { r += got[j][0]; t += got[j][1]; }
      return { score: r, max: t, parts: got.length, source: 'dom' };
    }

    // no number on the page: fall back to completion (what was done / what could be done)
    var c = readCompletion();
    if (c) return { score: c.done, max: c.total, parts: c.total, source: 'completion' };
    return null;
  }

  /* ---------- completion: how much of the page did the student actually do? ----------
     A page can declare its own: window.GAL_COMPLETION = { done: 7, total: 10 }.
     Otherwise we count answerable things outside the sign-in box:
       text inputs / textareas / selects with something in them,
       radio or checkbox groups with at least one checked, contenteditable areas with text.
     Needs at least 3 answerable things, or it's not a meaningful measure. */
  function readCompletion() {
    var g = window.GAL_COMPLETION;
    if (g && g.total > 0) return { done: Math.min(+g.done || 0, +g.total), total: +g.total };

    var SKIP = '#namewrap,#namebox,#gate,.gate,[id*="login" i],[id*="signin" i],[class*="login" i],[class*="signin" i],#bar,header';
    function skipped(el) { return !!(el.closest && el.closest(SKIP)); }
    var total = 0, done = 0, groups = {};

    var fields = document.querySelectorAll('input,textarea,select,[contenteditable="true"],[contenteditable=""]');
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (skipped(el)) continue;
      var tag = el.tagName, type = (el.type || '').toLowerCase();
      if (tag === 'INPUT' && /^(hidden|submit|button|reset|image|file|password|email|search)$/.test(type)) continue;
      if (el.getAttribute('autocomplete') === 'name' || /name|email|period/i.test(el.id || '')) continue;
      if (tag === 'INPUT' && (type === 'radio' || type === 'checkbox')) {
        var key = el.name || (el.closest('fieldset,.q,.card,.item') ? 'g' + i : 'c' + i);
        if (type === 'checkbox' && !el.name) key = 'c' + i;
        if (!groups[key]) { groups[key] = { any: false }; total++; }
        if (el.checked) groups[key].any = true;
        continue;
      }
      total++;
      var v = (el.isContentEditable ? el.textContent : el.value) || '';
      if (String(v).trim().length) done++;
    }
    for (var k in groups) if (groups[k].any) done++;

    if (total < 3) return null;
    return { done: done, total: total };
  }


  /* ==================================================================
     PAGE DECLARATION  (optional, but this is how a page joins in)

     Put this ABOVE the track.js tag on any activity page:

       <script>
       window.GAL_META = {
         title : 'Maus Chapter 1',          // shown on student pages
         unit  : 'Maus',                    // groups it in the list
         skills: ['reading-comprehension','inference']
       };
       </script>

     Then, whenever the page knows more, it can add any of these:

       window.GAL_SCORE = 7;  window.GAL_MAX = 10;   // exact score
       window.GAL_SKILLS = { inference:{n:3,d:4} };  // per-skill detail
       window.GAL_HIGHLIGHTS = [                     // student work worth showing
         { label:'Favorite song', text:'Tití Me Preguntó', pin:true },
         { label:'Best sentence', text:'The snow fell like rice.' }
       ];

     Nothing here is required. A page with no declaration still logs a score,
     exactly as before.
     ================================================================== */
  var META = window.GAL_META || {};

  function registerActivity() {
    if (!META.title && !META.skills) return Promise.resolve();
    var row = {
      slug: SLUG,
      title: META.title || document.title.split(/[·|]/)[0].trim() || SLUG,
      unit: META.unit || 'Readings',
      url: META.url || (location.origin + location.pathname),
      skills: META.skills || [],
      sort_order: META.sort_order || 600
    };
    if (typeof window.GAL_MAX === 'number') row.max_score = window.GAL_MAX;
    return fetch(SUPA_URL + '/rest/v1/activities?on_conflict=slug', {
      method: 'POST',
      headers: H({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify([row])
    }).catch(function () {});
  }

  function logSkills(email, when) {
    var by = window.GAL_SKILLS;
    if (!by || typeof by !== 'object') return;
    var rows = [];
    Object.keys(by).forEach(function (k) {
      var v = by[k];
      if (!v || !(v.d > 0)) return;
      rows.push({ email: email, slug: SLUG, skill: k,
                  n: v.n || 0, d: v.d, completed_at: when });
    });
    if (!rows.length) return;
    fetch(SUPA_URL + '/rest/v1/skill_attempts', {
      method: 'POST', headers: H({ Prefer: 'return=minimal' }),
      body: JSON.stringify(rows)
    }).catch(function () {});
  }

  function logHighlights(email, when) {
    var hs = window.GAL_HIGHLIGHTS;
    if (!hs || !hs.length) return;
    var rows = [];
    hs.forEach(function (h, i) {
      var text = (h && h.text != null) ? String(h.text).trim() : '';
      if (!text) return;
      rows.push({ email: email, slug: SLUG,
        label: (h.label || 'From this activity').slice(0, 80),
        text: text.slice(0, 2000),
        pinned: !!h.pin, sort_order: i, updated_at: when });
    });
    if (!rows.length) return;
    fetch(SUPA_URL + '/rest/v1/student_work?on_conflict=email,slug,label', {
      method: 'POST',
      headers: H({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(rows)
    }).catch(function () {});
  }

  /* ---------- log one completed attempt ---------- */
  function logAttempt(email, extra, soft, sGiven) {
    email = clean(email);
    if (!email) return;
    var now = Date.now();
    if (!soft) {
      if (now - lastLog < 8000) return;   // ignore double-clicks
      lastLog = now;
    }

    var s = sGiven || readScore();
    if (!soft && s) { softKey = email + '|' + s.score + '/' + s.max; softAt = now; }   // autosave won't repeat a turn-in
    var row = {
      email: email,
      slug: SLUG,
      score: s ? s.score : null,
      max_score: s ? s.max : null,
      detail: Object.assign({ path: location.pathname, source: s ? s.source : 'none',
                              parts: s ? s.parts : 0 }, extra || {}),
      completed_at: new Date().toISOString()
    };
    registerActivity();
    if (!soft) logSkills(email, row.completed_at);   // skill rows only for a real turn-in
    logHighlights(email, row.completed_at);
    fetch(SUPA_URL + '/rest/v1/activity_attempts', {
      method: 'POST',
      headers: H({ Prefer: 'return=minimal' }),
      body: JSON.stringify([row])
    }).catch(function () {});
  }
  window.GAL_logAttempt = function (extra) { logAttempt(knownEmail, extra); };

  /* ---------- T-232: score on autosave ---------- */
  var INFRA = /^(students|student_aliases|activity_attempts|skill_attempts|activities|instruction_reveals|page_translation|song_tr|student_work|response_history|class_assignments|excusals|student_profiles|song_lyrics|news_translations|teacher_checks|shelf_status|rpc)$/;
  var TEACHERISH = /(dashboard|teacher|gradebook|\/desk\/|\/assign\/|\/shelves\/|\/year\/|\/reports\/|\/audit\/|\/atlas\/|preview)/i;
  var softTimer = null, softKey = '', softAt = 0, softEmail = '';
  function autologOff() {
    if (window.GAL_NO_AUTOLOG) return true;
    if (TEACHERISH.test(location.pathname)) return true;
    var pw = document.querySelector('input[type=password]');
    if (pw && !document.querySelector('input[type=email], input[autocomplete=email], input[id*="mail" i]')) return true;
    return false;
  }
  function softLog() {
    softTimer = null;
    var email = softEmail || knownEmail;
    if (!email || autologOff()) return;
    var s = null;
    try { s = readScore(); } catch (e) { return; }
    if (!s || !(s.max > 0) || !(s.score > 0)) return;      // nothing done yet: no row, the cell stays blank
    var key = email + '|' + s.score + '/' + s.max;
    if (key === softKey) return;                            // same score as last time: nothing new
    var wait = 60000 - (Date.now() - softAt);
    if (wait > 0) { softTimer = setTimeout(softLog, wait + 500); return; }   // once a minute at most; the latest score still goes
    softKey = key; softAt = Date.now();
    logAttempt(email, { via: 'autosave' }, true, s);
  }
  function softSchedule(email) {
    if (email) softEmail = clean(email);
    if (softTimer) clearTimeout(softTimer);
    softTimer = setTimeout(softLog, 4000);
  }
  window.addEventListener('pagehide', function () { if (softTimer) { clearTimeout(softTimer); softAt = 0; softLog(); } });

  /* ---------- T-440: read one save body (string, or a Blob's text) ---------- */
  function scanBody(url, body) {
    var data = null;
    try { data = JSON.parse(body); } catch (e) {}
    var rows = Array.isArray(data) ? data : (data ? [data] : []);
    var tbl = (url.split('/rest/v1/')[1] || '').split('?')[0];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row || typeof row !== 'object') continue;
      var em = row.email || row.student_email || row.user_email;
      if (em) noteEmail(em, row.name || row.student_name || row.full_name);
      if (em && (row.period != null || row.class_period != null)) fillPeriod(em, row.period != null ? row.period : row.class_period);   /* T-432 */
      if (em && !INFRA.test(tbl)) softSchedule(em);
      if (row.turned_in === true || row.turned_in === 'true') {
        logAttempt(em || knownEmail, { table: tbl });
      }
    }
  }

  /* ---------- the hook ---------- */
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();

      if (url.indexOf('/rest/v1/') > -1 && method === 'POST' &&
          url.indexOf('activity_attempts') < 0 && url.indexOf('/students') < 0) {
        var body = init && init.body;
        if (typeof body === 'string' && body.length < 400000) scanBody(url, body);
        /* T-440: some pages (reel-test, tyma-vocab, gratitude-letters, stand-by-me/characters)
           send their save as a Blob. Read a COPY of its text; the page's own fetch still
           gets the original Blob untouched. */
        else if (typeof Blob !== 'undefined' && body instanceof Blob && body.size < 400000 && body.text) {
          body.text().then(function (s) { try { scanBody(url, s); } catch (e) {} }).catch(function () {});
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
    var qs = new URLSearchParams(location.search);
    /* T-245: ?view=teacher&email=X is the teacher looking at X's work (read only, std.js) —
       never adopt X as this browser's student or write their students row */
    var q = qs.get('view') === 'teacher' ? '' : qs.get('email');
    if (q) noteEmail(q);
    else {
      var saved = localStorage.getItem('gal_student_email');
      if (saved) knownEmail = clean(saved);
    }
    /* T-432: a sign-in resumed from earlier in this class period */
    if (!q) setTimeout(function () { pfillFromSignIn(null); }, 2500);
  } catch (e) {}
})();
