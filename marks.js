/* readings/marks.js — T-393 (Nov 13 2026). Mr. Toby's ✓ / ✗ / note on WRITTEN answers, for any page.
   The ELD 103 story pages keep their own copy, landlady/marks.js (GALMARKS, T-366); this is the same
   behaviour as a module any page can load. Each page supplies its own list of written answers.

   One mark per written answer, stored in <table>.marks (jsonb; the student page NEVER sends it):
     marks[key] = { m: "ok" | "x", note: "...", a: <the answer when marked>, at: ISO }
   Keys are namespaced per page: Story Reel Your Turn = "yt.<level>.<i>"; "tB.<id>" / "tC.<id>" are
   reserved for the reel tiers chat; Launch Plus chooses its own.
     ✗ + same answer  -> the point is off until the student changes it (a ✗ needs a note)
     ✗ + new answer   -> counts again and shows as unmarked ("fixed — check again")
     ✓ + new answer   -> unmarked again
     no mark          -> counts as it does now

   PAGE API (student)
     GALMARK.fetch(table, filter) -> Promise(marks)        filter = PostgREST query, e.g. "episode=eq.ep05"
                                                            (the student's two email spellings are added for you)
     GALMARK.state(mk, answer) -> "none" | "ok" | "x" | "fixed" | "changed"
     GALMARK.off(marks, key, answer) -> true when a ✗ answer has not been changed (does not count)
     GALMARK.paint101(items, marks, hooks)                  ELD 101 view: nothing red
        items = [{ key, box (element the badge goes above), field (the textarea/input) }]
        hooks = { say(text), tap(el, sentence), dir(root), who: "linh" }   all optional
   DASHBOARD API (teacher)
     GALMARK.controls(marks, key, answer) -> HTML          the ✓ ✗ clear note row
     GALMARK.bind(container, ctx)                           ctx(key, ctlEl) -> { table, filter, after(marks) }
     GALMARK.unmarked(marks, [{key, a}]) -> count           for a ✎ badge
     GALMARK.setScore(email, slug, score, max) -> Promise   RPC eld101_set_score (only reel-v2 / launch-plus slugs)
   TEACHER'S DESK ✎
     On /desk/ this file adds ELD 101 counts into GALMARKS.desk[username][slug] (penOf reads that).
     GALMARK.DESK = [{ table, select, count(row) -> {slug: n} }] — the reel source is built in; another
     page family adds its own entry here (ask the std.js seat, which owns this file). */
(function () {
  if (window.GALMARK) return;
  var SUPA = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  function H(x) { var h = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }; if (x) for (var k in x) h[k] = x[k]; return h; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(a) { return String(a == null ? '' : a).replace(/\s+/g, ' ').trim(); }
  function user(e) { return String(e || '').trim().toLowerCase().split('@')[0]; }
  function state(mk, ans) {
    ans = norm(ans);
    if (!mk || !mk.m || !ans) return 'none';
    var same = norm(mk.a) === ans;
    if (mk.m === 'x') return same ? 'x' : 'fixed';
    return same ? 'ok' : 'changed';
  }
  var G = window.GALMARK = { SUPA: SUPA, KEY: KEY, state: state, norm: norm, esc: esc, DESK: [] };
  G.off = function (marks, key, ans) { return state((marks || {})[key], ans) === 'x'; };
  G.unmarked = function (marks, items) {
    var n = 0;
    (items || []).forEach(function (it) { if (!norm(it.a)) return; var s = state((marks || {})[it.key], it.a); if (s !== 'ok' && s !== 'x') n++; });
    return n;
  };
  function bothEmails(email) { var u = user(email); return 'email=in.(' + encodeURIComponent('"' + u + '@sfusd.edu","' + u + '@s.sfusd.edu"') + ')'; }
  /* the student's marks, merged over both email spellings; null = column missing / offline (change nothing) */
  G.fetch = function (table, filter, email) {
    return fetch(SUPA + '/rest/v1/' + table + '?select=marks&' + bothEmails(email) + (filter ? '&' + filter : ''), { headers: H() })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (!rows) return null;
        var m = {}; rows.forEach(function (x) { if (x.marks && typeof x.marks === 'object') for (var k in x.marks) m[k] = x.marks[k]; });
        return m;
      }).catch(function () { return null; });
  };

  /* ================= STYLES ================= */
  var css = document.createElement('style');
  css.textContent =
    /* student, ELD 101: nothing red */
    '.gmk{display:flex;gap:12px;align-items:flex-start;margin:6px 0 8px;padding:10px 12px;border:2px solid #2B2233;border-left:10px solid #F8981F;border-radius:12px;background:#fff8ea;box-shadow:0 2px 0 rgba(43,34,51,.18);font:700 17px/1.35 Nunito,system-ui,sans-serif;color:#2B2233;clear:both}' +
    '.gmk .gmface{width:64px;height:64px;flex:none;border:2px solid #2B2233;border-radius:50%;background:#fff;overflow:hidden}' +
    '.gmk .gmface svg{width:100%;height:100%;display:block}' +
    '.gmk .gmbody{flex:1;min-width:0}' +
    '.gmk .gmhead{margin:0;font-weight:900;font-size:19px}' +
    '.gmk .gmnote{margin:6px 0 0;display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap}' +
    '.gmk .gmnote .gmtxt{font-weight:800}' +
    '.gmk .gmw{cursor:pointer;border-bottom:2px dotted #9b8f6a}' +
    '.gmk .gmw:hover{background:#fff1cc}' +
    '.gmk .gmsay{border:2px solid #2B2233;background:#fff;border-radius:999px;width:34px;height:34px;font-size:16px;line-height:1;cursor:pointer;flex:none}' +
    '.gmk .dirtr{display:block;font-weight:700;color:#5d536a;font-size:.92em;margin-top:2px}' +
    '.gmk .gmgo{display:flex;align-items:center;gap:8px;margin:8px 0 0;border:2px solid #2B2233;border-left:8px solid #1f7a4d;border-radius:10px;background:#e0f2e8;padding:6px 10px;font-weight:900;color:#2B2233}' +
    '.gmk .gmgo{flex-wrap:wrap}.gmk .gmgo .dirtr{flex-basis:100%;margin:0}' +
    '.gmk.fixed{border-left-color:#1f7a4d;background:#f3faf5}' +
    '.gmfield{border-color:#1f7a4d!important;box-shadow:0 0 0 3px #cfe9da!important}' +
    '.gmok{display:inline-flex;gap:6px;align-items:center;margin:4px 0 8px;padding:2px 10px;border:2px solid #1f7a4d;border-radius:999px;background:#e0f2e8;color:#1f7a4d;font:900 15px Nunito,system-ui,sans-serif}' +
    '.gmok .gmsay{border:0;background:none;font-size:14px;cursor:pointer;padding:0}' +
    '.gmok i{font-style:normal;font-weight:700;color:#2B2233}' +
    /* the pointer: the same solid green ➤ as My Page and the tiers (T-374) */
    '#gm-nudge{position:fixed;width:56px;height:56px;z-index:41;pointer-events:none;display:none}' +
    '#gm-nudge svg{width:100%;height:100%;display:block}' +
    '#gm-nudge.left{animation:gmX 1s ease-in-out infinite}#gm-nudge.down{animation:gmY 1s ease-in-out infinite}#gm-nudge.down svg{transform:rotate(90deg)}' +
    '#gm-nudge.up{animation:gmYu 1s ease-in-out infinite}#gm-nudge.up svg{transform:rotate(-90deg)}' +
    '@keyframes gmX{0%,100%{transform:translateX(-10px);opacity:.5}50%{transform:translateX(5px);opacity:1}}' +
    '@keyframes gmY{0%,100%{transform:translateY(-10px);opacity:.5}50%{transform:translateY(5px);opacity:1}}' +
    '@keyframes gmYu{0%,100%{transform:translateY(10px);opacity:.5}50%{transform:translateY(-5px);opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){#gm-nudge{animation:none!important;opacity:.9}}' +
    '@media (max-width:760px){#gm-nudge{width:42px;height:42px}.gmk{font-size:16px}.gmk .gmface{width:52px;height:52px}}' +
    /* one arrow on screen: while Mr. Toby has an answer waiting, other pointers rest */
    'body.gm-fixing .gnudge{display:none!important}' +
    /* teacher */
    '.gm-ctl{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:6px 0 2px}' +
    '.gm-ctl button{font:800 13px Nunito,sans-serif;border:2px solid #444;background:#fff;border-radius:7px;padding:1px 8px;cursor:pointer}' +
    '.gm-ctl button.ok.on{background:#2e7d4f;border-color:#2e7d4f;color:#fff}.gm-ctl button.x.on{background:#b3261e;border-color:#b3261e;color:#fff}' +
    '.gm-ctl input{flex:1 1 9rem;min-width:8rem;font:13px Nunito,sans-serif;border:2px solid #999;border-radius:7px;padding:1px 6px}' +
    '.gm-ctl .st{flex-basis:100%;font:700 12px Nunito,sans-serif;color:#555}.gm-ctl .st.un{color:#b06000}' +
    '.gm-pen{display:inline-block;font:800 12px Nunito,sans-serif;color:#7a4a00;background:#ffe9b8;border:1px solid #c9922a;border-radius:6px;padding:0 5px;margin-left:4px;white-space:nowrap}';
  (document.head || document.documentElement).appendChild(css);

  /* ================= STUDENT, ELD 101 ================= */
  /* a cast face from cast.js when the page has it; otherwise Linh, drawn here */
  function face(who) {
    var R = window.REEL;
    if (R && R.CAST && R.drawChar && R.headTop) {
      var id = (who && R.CAST[who]) ? who : 'linh';
      if (R.CAST[id]) return '<svg viewBox="-150 ' + R.headTop(id) + ' 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(R.CAST[id].name) + '">' +
        R.placeChar(id, 0, 1, { expr: 'smile', pose: 'idle' }) + '</svg>';
    }
    return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Linh">' +
      '<rect width="120" height="120" fill="#fdf3e4"/><path d="M0 92 Q60 70 120 92 V120 H0Z" fill="#f3dfc4"/>' +
      '<path d="M22 120 C24 96 40 86 60 86 C80 86 96 96 98 120Z" fill="#e98aa5"/><path d="M48 88 Q60 100 72 88" fill="none" stroke="#c96d88" stroke-width="3"/>' +
      '<path d="M26 58 C24 24 96 24 94 58 L98 104 C88 110 80 96 82 70 L38 70 C40 96 32 110 22 104Z" fill="#231b1b"/>' +
      '<rect x="53" y="72" width="14" height="14" rx="5" fill="#e0b48f"/>' +
      '<ellipse cx="60" cy="56" rx="27" ry="30" fill="#f2cba6"/>' +
      '<ellipse cx="33" cy="58" rx="5" ry="7" fill="#e3b892"/><ellipse cx="87" cy="58" rx="5" ry="7" fill="#e3b892"/>' +
      '<path d="M32 50 C34 26 86 26 88 50 C80 38 66 34 60 40 C52 34 40 38 32 50Z" fill="#231b1b"/>' +
      '<ellipse cx="50" cy="56" rx="3.4" ry="4.4" fill="#2b2233"/><ellipse cx="70" cy="56" rx="3.4" ry="4.4" fill="#2b2233"/>' +
      '<circle cx="51.3" cy="54.6" r="1.2" fill="#fff"/><circle cx="71.3" cy="54.6" r="1.2" fill="#fff"/>' +
      '<path d="M45 47 Q50 44 55 47 M65 47 Q70 44 75 47" stroke="#3a2a22" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="44" cy="66" r="4.5" fill="#e8736b" opacity=".3"/><circle cx="76" cy="66" r="4.5" fill="#e8736b" opacity=".3"/>' +
      '<path d="M52 70 Q60 76 68 70" stroke="#7a2e2e" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<g transform="rotate(-38 92 96)"><rect x="80" y="92" width="34" height="7" rx="2" fill="#f2c230"/><path d="M114 92 L122 95.5 L114 99Z" fill="#f2cba6"/><path d="M119 94 L122 95.5 L119 97Z" fill="#2b2233"/><rect x="76" y="92" width="5" height="7" fill="#e98aa5"/></g>' +
      '<circle cx="92" cy="104" r="7" fill="#f2cba6"/></svg>';
  }
  function words(note) {
    return esc(note).split(/(\s+)/).map(function (t) { return /\S/.test(t) ? '<span class="gmw" data-w="' + t.replace(/^[^A-Za-z0-9\u2019']+|[^A-Za-z0-9\u2019']+$/g, '') + '">' + t + '</span>' : t; }).join('');
  }
  var NUDGE = null, target = null;
  function nudge() {
    if (NUDGE && NUDGE.parentNode) return NUDGE;
    NUDGE = document.createElement('div'); NUDGE.id = 'gm-nudge'; NUDGE.setAttribute('aria-hidden', 'true');
    NUDGE.innerHTML = '<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><path d="M12 6 C 30 18, 40 24, 48 28 C 40 32, 30 38, 12 50 C 17 38, 19 32, 19 28 C 19 24, 17 18, 12 6 Z" fill="#1f7a4d"/></svg>';
    document.body.appendChild(NUDGE); return NUDGE;
  }
  function place() {
    if (!target || !document.body.contains(target)) { if (NUDGE) NUDGE.style.display = 'none'; return; }
    var r = target.getBoundingClientRect(), n = nudge(), W = n.offsetWidth || 56, vh = window.innerHeight || 800;
    if (!r.width && !r.height) { n.style.display = 'none'; return; }
    var left, top, mode;
    if (r.top > vh - 20) { left = Math.min(window.innerWidth - W - 8, Math.max(8, r.left + 24)); top = vh - W - 8; mode = 'down'; }   /* below the screen: point down at it */
    else if (r.bottom < 20) { left = Math.max(8, r.left + 24); top = 8; mode = 'up'; }
    else if (r.left - W - 2 >= 4) { left = r.left - W - 2; top = r.top + Math.min(r.height, 80) / 2 - W / 2; mode = 'left'; }
    else { left = Math.max(4, r.left + 18); top = r.top - W + 6; mode = 'down'; }                                                     /* no room beside: sit on its top edge */
    n.style.display = 'block'; n.style.left = Math.round(left) + 'px'; n.style.top = Math.round(top) + 'px'; n.className = mode;
  }
  window.addEventListener('scroll', function () { if (target) place(); }, { passive: true });
  window.addEventListener('resize', function () { if (target) place(); });
  G.pointAt = function (el) { target = el || null; place(); };

  /* items: [{key, box, field}]  — the badge goes just above field (inside box) */
  G.paint101 = function (items, marks, hooks) {
    hooks = hooks || {};
    var firstX = null, nX = 0;
    (items || []).forEach(function (it) {
      if (!it || !it.box) return;
      var old = it.box.querySelectorAll('.gmk,.gmok'); Array.prototype.forEach.call(old, function (o) { o.remove(); });
      if (it.field) it.field.classList.remove('gmfield');
      var mk = (marks || {})[it.key], ans = it.field ? it.field.value : '', st = state(mk, ans), d = null, note = mk && norm(mk.note);
      if (st === 'x') {
        nX++;
        d = document.createElement('div'); d.className = 'gmk'; d.setAttribute('translate', 'no'); d.setAttribute('data-gmkey', it.key);
        d.innerHTML = '<div class="gmface">' + face(hooks.who) + '</div><div class="gmbody">' +
          '<p class="gmhead" data-en="Mr. Toby: try this again">Mr. Toby: try this again ✏️</p>' +
          (note ? '<div class="gmnote"><button type="button" class="gmsay" aria-label="Listen">🔊</button><span class="gmtxt" data-en="' + esc(note) + '">' + words(note) + '</span></div>' : '') +
          '<div class="gmgo" data-en="Fix your answer for Mr. Toby">Fix your answer for Mr. Toby</div></div>';
        if (it.field) { it.field.disabled = false; it.field.readOnly = false; it.field.classList.add('gmfield'); }
        if (!firstX) firstX = it.field || it.box;
      } else if (st === 'fixed') {
        d = document.createElement('div'); d.className = 'gmk fixed'; d.setAttribute('translate', 'no');
        d.innerHTML = '<div class="gmface">' + face(hooks.who) + '</div><div class="gmbody"><p class="gmhead" data-en="You fixed it. Mr. Toby will look again.">You fixed it. Mr. Toby will look again. ✓</p></div>';
      } else if (st === 'ok') {
        d = document.createElement('div'); d.className = 'gmok'; d.setAttribute('translate', 'no');
        d.innerHTML = '✓ Mr. Toby' + (note ? ' <i class="gmtxt">' + words(note) + '</i> <button type="button" class="gmsay" aria-label="Listen">🔊</button>' : '');
      }
      if (!d) return;
      var say = d.querySelector('.gmsay');
      if (say) say.addEventListener('click', function (e) { e.stopPropagation(); if (hooks.say) hooks.say(note); else speak(note); });
      Array.prototype.forEach.call(d.querySelectorAll('.gmw'), function (w) {
        w.addEventListener('click', function (e) { e.stopPropagation(); if (hooks.tap) hooks.tap(w, note); else speak(w.textContent); });
      });
      if (st === 'ok' && it.field && it.field.parentNode) it.field.parentNode.insertBefore(d, it.field.nextSibling);
      else if (it.field && it.field.parentNode) it.field.parentNode.insertBefore(d, it.field);
      else it.box.appendChild(d);
      if (hooks.dir && st !== 'ok') try { hooks.dir(d); } catch (e) {}
    });
    document.body.classList.toggle('gm-fixing', nX > 0);
    G.pointAt(firstX);
    return { sentBack: nX, first: firstX };
  };
  function speak(t) {
    if (!t || !window.speechSynthesis) return;
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(t).replace(/\bI\b/g, 'eye').replace(/_{2,}/g, ' blank ')); u.lang = 'en-US'; u.rate = 0.8; speechSynthesis.speak(u); } catch (e) {}
  }
  G.speak = speak;

  /* ================= DASHBOARD ================= */
  G.controls = function (marks, key, ans) {
    if (!norm(ans)) return '';
    var mk = (marks || {})[key], st = state(mk, ans);
    var lab = { none: '✎ not marked', changed: '✎ changed since your ✓', fixed: '✎ fixed — check again', ok: '✓ marked', x: '✗ sent back' }[st];
    return '<div class="gm-ctl" data-gmq="' + esc(key) + '">' +
      '<button type="button" class="ok' + (st === 'ok' ? ' on' : '') + '" data-gm="ok" title="Good — counts">✓</button>' +
      '<button type="button" class="x' + (st === 'x' ? ' on' : '') + '" data-gm="x" title="Send back — point off until the student changes it">✗</button>' +
      (mk ? '<button type="button" data-gm="clear" title="Remove the mark">clear</button>' : '') +
      '<input type="text" placeholder="Note (the student sees it)" value="' + esc(mk && mk.note || '') + '">' +
      '<span class="st' + (st === 'ok' || st === 'x' ? '' : ' un') + '">' + lab + '</span></div>';
  };
  /* re-read the row's marks (another tab may have marked too), change one key, PATCH only the marks column */
  G.save = function (table, filter, key, what, note, ans) {
    return fetch(SUPA + '/rest/v1/' + table + '?select=marks&' + filter, { headers: H() })
      .then(function (x) { if (!x.ok) throw new Error(x.status === 400 ? 'run the T-393 SQL first' : 'HTTP ' + x.status); return x.json(); })
      .then(function (rows) {
        if (!rows.length) throw new Error('no saved work for this student');
        var cur = (rows[0] && rows[0].marks) || {};
        if (what === 'clear') delete cur[key];
        else cur[key] = { m: what, note: norm(note), a: ans == null ? '' : String(ans), at: new Date().toISOString() };
        return fetch(SUPA + '/rest/v1/' + table + '?' + filter, { method: 'PATCH', headers: H({ Prefer: 'return=minimal' }), body: JSON.stringify({ marks: cur }) })
          .then(function (x) { if (!x.ok) throw new Error('HTTP ' + x.status); return cur; });
      });
  };
  G.setScore = function (email, slug, score, max) {
    return fetch(SUPA + '/rest/v1/rpc/eld101_set_score', { method: 'POST', headers: H(),
      body: JSON.stringify({ p_email: email, p_slug: slug, p_score: score, p_max: max }) })
      .then(function (r) { return r.ok; }).catch(function () { return false; });
  };
  /* ctx(key, ctlEl) -> { table, filter, ans, after(marks) -> Promise|void } */
  G.bind = function (box, ctx) {
    box._gmCtx = ctx;
    if (box._gmBound) return; box._gmBound = true;
    box.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-gm]'); if (!b) return;
      var ctl = b.closest('[data-gmq]'), key = ctl.getAttribute('data-gmq'), what = b.getAttribute('data-gm');
      var inp = ctl.querySelector('input'), st = ctl.querySelector('.st'), c = box._gmCtx(key, ctl);
      if (!c) return;
      if (what === 'x' && !norm(inp.value)) { inp.focus(); st.textContent = 'Write a short note first — the student sees it.'; st.className = 'st un'; return; }
      st.textContent = 'Saving…';
      G.save(c.table, c.filter, key, what, inp.value, c.ans).then(function (marks) {
        return Promise.resolve(c.after && c.after(marks)).then(function () { if (ctl.parentNode) ctl.outerHTML = G.controls(marks, key, c.ans); });
      }).catch(function (err) { st.textContent = 'Not saved: ' + err.message; st.className = 'st un'; });
    });
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !e.target.closest || !e.target.closest('.gm-ctl input')) return;
      var ctl = e.target.closest('.gm-ctl'), on = ctl.querySelector('button.on');
      var btn = ctl.querySelector('[data-gm="' + (on && on.classList.contains('ok') ? 'ok' : 'x') + '"]'); if (btn) btn.click();
    });
  };

  /* ================= STORY REEL helpers (shared by the episode page and the hub dashboard) ================= */
  /* the level a Your Turn answer list came from: own level, C falls back to B, then A (as the dashboard shows it) */
  G.reelLevel = function (work, level) {
    var Y = (work && work.yt) || {}, L = level || 'A';
    if (Y[L] && Y[L].some(function (x) { return norm(x); })) return L;
    if (L === 'C' && Y.B && Y.B.some(function (x) { return norm(x); })) return 'B';
    if (Y.A && Y.A.some(function (x) { return norm(x); })) return 'A';
    return L;
  };
  /* the gradebook score of one reel row with marks applied; same rule as engine.js score() */
  G.reelScore = function (row, marks) {
    var w = row.work || {}, sc = row.scores || {}, L = row.level || w.level || 'A';
    var t = +sc.checks_total || 0, solved = sc.checks_solved != null ? +sc.checks_solved : (+sc.checks_first_try || 0);
    var np = +sc.yt_total || 0, mine = ((w.yt || {})[L]) || [], wrote = 0;
    for (var j = 0; j < np; j++) {
      var a = mine[j] || '';
      if (norm(a).split(' ').filter(Boolean).length >= 3 && !G.off(marks, 'yt.' + L + '.' + j, a)) wrote++;
    }
    var tp = sc.tiers_pts;
    if (tp == null) { var A = sc.tierA || {}; tp = (+A.order || 0) + (+A.topic || 0) + (+sc.tierB || 0) + (+((sc.tierC || {}).pts) || 0) + (+((sc.tierD || {}).solved) || 0); }
    var max = t + np;
    return { score: Math.min(max, solved + wrote + (+tp || 0)), max: max };
  };

  /* ================= TEACHER'S DESK ✎ ================= */
  G.DESK.push({ table: 'reel_views', select: 'email,episode,level,work,marks', count: function (r) {
    var w = r.work || {}, L = r.level || w.level || 'A', mine = ((w.yt || {})[L]) || [], n = 0, out = {};
    mine.forEach(function (a, j) { if (!norm(a)) return; var s = state((r.marks || {})['yt.' + L + '.' + j], a); if (s !== 'ok' && s !== 'x') n++; });
    if (n) out['reel-v2/' + r.episode] = n;
    return out;
  } });
  G.loadDesk = function () {
    var out = {};
    return Promise.all(G.DESK.map(function (src) {
      return fetch(SUPA + '/rest/v1/' + src.table + '?select=' + src.select, { headers: H() })
        .then(function (x) { return x.ok ? x.json() : []; }).catch(function () { return []; })
        .then(function (rows) { (rows || []).forEach(function (r) {
          var k = user(r.email), c = src.count(r); if (!k) return;
          for (var sl in c) { out[k] = out[k] || {}; out[k][sl] = (out[k][sl] || 0) + c[sl]; }
        }); });
    })).then(function () { G.desk = out; return out; });
  };
  if (/\/desk\//.test(location.pathname)) setTimeout(function () {
    G.loadDesk().then(function (mine) {
      var tries = 0;
      (function merge() {
        /* the Desk's ✎ reads GALMARKS.desk (landlady/marks.js); add ours once that one has loaded */
        var GM = window.GALMARKS;
        if ((!GM || !GM.desk) && ++tries < 40) { setTimeout(merge, 500); return; }
        if (!GM) GM = window.GALMARKS = {};
        GM.desk = GM.desk || {};
        for (var k in mine) { GM.desk[k] = GM.desk[k] || {}; for (var sl in mine[k]) GM.desk[k][sl] = (GM.desk[k][sl] || 0) + mine[k][sl]; }
        try { if (typeof window.drawBook === 'function' && window.STATIONS && STATIONS.length) window.drawBook(); } catch (e) {}
      })();
    });
  }, 0);
})();
