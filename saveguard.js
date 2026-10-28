/* saveguard.js — T-170 (Oct 28 2026). LOAD BEFORE SAVE for any student page.
 *
 * One line in <head>, BEFORE the page's own scripts:
 *     <script src="/readings/saveguard.js"></script>
 * Optional, before it:  <script>window.SG_TABLES = ['my_work_table'];</script>
 *
 * It watches the page's own Supabase calls and makes four promises, whatever the page does:
 *  1. Reads find the student under BOTH email spellings (@s.sfusd.edu and @sfusd.edu); the fullest row comes first.
 *  2. No save to a work table leaves until this student's saved row has loaded. If the server can't be
 *     reached: a red bar, nothing is saved, it keeps trying. (The page just sees a slow load.)
 *  3. A save never blanks what is already on the server: empty boxes in the save are filled from the
 *     saved row, so a fresh or wiped Chromebook can't overwrite real work. Saved answers are also put
 *     back into empty boxes on the page when their ids match.
 *  4. A different student on the same computer gets a clean page: the last student's copy of THIS
 *     page is cleared, the page reloads, and the new student's email is waiting in the sign-in box.
 * Pages that already guard themselves (window.__T168, T-166 story pages) don't need it; it is harmless there.
 */
(function () {
  if (window.__SG) return;
  var SG = window.__SG = { loaded: {}, rows: {} };
  var realFetch = window.fetch.bind(window);
  var LS = window.localStorage, SS = window.sessionStorage;
  var PATH = location.pathname.replace(/index\.html?$/, '');
  var INFRA = /^(students|student_aliases|activity_attempts|skill_attempts|activities|instruction_reveals|page_translation|song_tr|student_work|response_history|class_assignments|excusals|student_profiles|song_lyrics|news_translations|teacher_checks|rpc)$/;
  var KEYCOLS = ['set_slug', 'slug', 'guide_key', 'episode', 'lesson', 'lesson_id', 'page', 'story', 'activity', 'set_id', 'unit',
    'part', 'deck', 'item', 'kind', 'set_key', 'story_id', 'lesson_key', 'quiz', 'chapter', 'text_slug', 'song', 'module', 'section'];
  var SKIPFILL = /^(id|email|student_email|updated_at|created_at|saved_at)$/;
  var KEEP = /^(__sg|gal_|vocab_lang|std_)|lang|_dir$|_tap$|font|theme|textsize|bigtext/i;

  function lp(e) { return String(e || '').trim().toLowerCase().split('@')[0]; }
  function inList(e) { var l = lp(e); return 'in.(' + encodeURIComponent('"' + l + '@sfusd.edu"') + ',' + encodeURIComponent('"' + l + '@s.sfusd.edu"') + ')'; }
  function isStu(e) { return /@(s\.)?sfusd\.edu$/i.test(String(e || '').trim()); }
  function size(r) { try { return JSON.stringify(r).length; } catch (e) { return 0; } }
  function tableOf(url) { var m = /\/rest\/v1\/([^?\/]+)/.exec(url); return m ? m[1] : ''; }

  /* ---------- remember which local keys belong to this page (for the shared-Chromebook clean-up) ---------- */
  var mine = {};
  try { (JSON.parse(LS.getItem('__sg_k:' + PATH) || '[]')).forEach(function (k) { mine[k] = 1; }); } catch (e) {}
  function note(k) { if (!k || KEEP.test(k) || mine[k]) return; mine[k] = 1;
    try { Storage.prototype.setItem.call(LS, '__sg_k:' + PATH, JSON.stringify(Object.keys(mine))); } catch (e) {} }
  var gi = Storage.prototype.getItem, si = Storage.prototype.setItem;
  try {
    Storage.prototype.getItem = function (k) { var v = gi.call(this, k); if (this === LS && v != null && !SG.who) note(k); return v; };
    Storage.prototype.setItem = function (k, v) { if (this === LS) { if (SG.reloading && mine[k]) return; note(k); } return si.call(this, k, v); };
  } catch (e) {}

  /* ---------- shared Chromebook: the last student is never signed in for the next one ----------
     Older than 70 minutes (one class period): the last student's sign-in is cleared before the page runs.
     Newer: if the page signs them in by itself, a yellow "Not you? Tap here" box is shown. */
  function idKeys(owner) {
    var out = ['gal_student_email', 'gal_student_name', 'gal_student_period'];
    try { for (var i = 0; i < LS.length; i++) { var k = LS.key(i); if (/^__sg/.test(k)) continue;
      var v = String(gi.call(LS, k) || '').toLowerCase(); if (owner && v.indexOf(owner + '@') > -1) out.push(k); } } catch (e) {}
    return out;
  }
  var OWNER = '', OWNER_AT = 0;
  try { OWNER = gi.call(LS, '__sg_owner') || ''; OWNER_AT = +gi.call(LS, '__sg_owner_at') || 0; } catch (e) {}
  if (OWNER && Date.now() - OWNER_AT > 70 * 60 * 1000) {
    idKeys(OWNER).forEach(function (k) { try { LS.removeItem(k); } catch (e) {} });
  } else if (OWNER) {
    var offer = function () {
      if (SG.who && SG.who !== OWNER) return;
      var v = function (el) { var r = el.getBoundingClientRect(), st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      if ([].some.call(document.querySelectorAll('input[type=email]'), v)) return;   /* the sign-in box is showing: nothing to do */
      var n = document.createElement('div'); n.id = 'sgnotyou'; n.setAttribute('translate', 'no');
      n.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483645;background:#fff3b0;color:#1a1a1a;border:2px solid #222;box-shadow:0 4px 0 #222;border-radius:12px;padding:8px 12px;font:700 15px/1.35 Nunito,system-ui,sans-serif;max-width:92vw';
      n.innerHTML = 'Signed in as <span></span> \u2014 <button type="button" style="font:inherit;background:#fff;border:2px solid #222;border-radius:8px;padding:2px 10px;cursor:pointer">Not you? Tap here</button>';
      n.querySelector('span').textContent = OWNER;
      n.querySelector('button').onclick = function () {
        SG.reloading = true;
        idKeys(OWNER).concat(Object.keys(mine)).forEach(function (k) { try { LS.removeItem(k); } catch (e) {} });
        try { LS.removeItem('__sg_owner'); LS.removeItem('__sg_owner_at'); } catch (e) {}
        location.reload();
      };
      document.body.appendChild(n);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(offer, 1500); });
    else setTimeout(offer, 1500);
  }

  /* ---------- the red bar ---------- */
  function bar(on) {
    var b = document.getElementById('sgbar');
    if (!on) { if (b) b.remove(); return; }
    if (b || !document.body) return;
    b = document.createElement('div'); b.id = 'sgbar'; b.setAttribute('role', 'alert'); b.setAttribute('translate', 'no');
    b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483646;background:#b3261e;color:#fff;font:700 16px/1.4 Nunito,system-ui,sans-serif;padding:10px 14px;text-align:center;border-bottom:3px solid #5c0f0a';
    b.textContent = '\u26a0\ufe0f Can\u2019t reach the server. Nothing is being saved yet \u2014 your answers stay on this computer. Trying again\u2026';
    document.body.appendChild(b);
  }
  var down = 0;
  function failing(on) { down += on ? 1 : -1; if (down < 0) down = 0; bar(down > 0); }

  /* GET that keeps trying until the server answers (network error / 5xx). 4xx is a real answer. */
  function tryGet(url, init) {
    var wait = 3000, flagged = false;
    return new Promise(function (resolve) {
      (function go() {
        realFetch(url, init).then(function (r) {
          if (r.status >= 500 || r.status === 0) throw new Error('server ' + r.status);
          if (flagged) failing(false); resolve(r);
        }).catch(function () {
          if (!flagged) { flagged = true; failing(true); }
          setTimeout(go, wait); wait = Math.min(wait * 2, 30000);
        });
      })();
    });
  }

  /* ---------- who is signed in; a new student on this computer gets a clean page ---------- */
  function identify(email) {
    if (!isStu(email)) return true;
    var l = lp(email);
    if (SG.who === l) return true;
    var owner = ''; try { owner = LS.getItem('__sg_owner') || ''; } catch (e) {}
    var hadOther = false;
    if (owner && owner !== l) Object.keys(mine).forEach(function (k) { try { if (LS.getItem(k) != null) hadOther = true; } catch (e) {} });
    try { si.call(LS, '__sg_owner', l); si.call(LS, '__sg_owner_at', String(Date.now())); } catch (e) {}
    if (hadOther && !SG.who) {
      Object.keys(mine).forEach(function (k) { try { LS.removeItem(k); } catch (e) {} });
      try { SS.setItem('__sg_fresh', String(email).trim().toLowerCase()); } catch (e) {}
      SG.reloading = true; location.reload(); return false;
    }
    SG.who = l; return true;
  }
  /* after the clean-up reload: put the email back in the box and ask for one tap */
  function fresh() {
    var e = null; try { e = SS.getItem('__sg_fresh'); SS.removeItem('__sg_fresh'); } catch (x) {}
    if (!e) return;
    var put = function () {
      var box = document.querySelector('input[type=email]');
      if (box && !box.value) { box.value = e; box.dispatchEvent(new Event('input', { bubbles: true })); }
      var n = document.createElement('div'); n.setAttribute('role', 'status');
      n.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:2147483645;background:#fff3b0;color:#1a1a1a;border:2px solid #222;box-shadow:0 4px 0 #222;border-radius:12px;padding:10px 16px;font:700 16px/1.35 Nunito,system-ui,sans-serif;max-width:92vw';
      n.textContent = '\u2728 Clean page for ' + e + '. The last student\u2019s answers were cleared from this computer. Tap Start to sign in.';
      document.body.appendChild(n); setTimeout(function () { n.remove(); }, 15000);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(put, 600); }); else setTimeout(put, 600);
  }
  fresh();

  /* ---------- fill empty boxes on the page from saved answers ---------- */
  function restore(row) {
    if (!row || !document.body) return;
    var src = row.answers || row.payload || row.work || row.data || row.responses || row;
    if (typeof src === 'string') { try { src = JSON.parse(src); } catch (e) { return; } }
    var n = 0;
    (function walk(o, depth) {
      if (!o || typeof o !== 'object' || depth > 2) return;
      Object.keys(o).forEach(function (k) {
        var v = o[k];
        if (v && typeof v === 'object') { walk(v, depth + 1); return; }
        if (v == null || v === '' || SKIPFILL.test(k) || /^(name|student_name|period|lang)$/.test(k)) return;
        var sel = '[data-save="' + k + '"],[data-id="' + k + '"],[data-qid="' + k + '"],[data-key="' + k + '"],[name="' + k + '"]';
        var el = null; try { el = document.getElementById(k) || document.querySelector(sel); } catch (e) {}
        if (!el || el.closest('[id*=gate i],[class*=gate i],[id*=signin i],[id*=login i]')) return;
        var t = (el.type || '').toLowerCase();
        if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && (t === 'text' || t === '')) || el.tagName === 'SELECT') {
          if (el.value) return; el.value = String(v); n++;
        } else if (t === 'checkbox' || t === 'radio') { if (el.checked || !v) return; el.checked = true; n++; }
        else return;
        el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    })(src, 0);
    return n;
  }

  /* ---------- load a table for this student (once), before any save to it ---------- */
  function base(url) { return url.split('/rest/v1/')[0]; }
  function load(url0, table, col, email, headers) {
    var key = table + '|' + lp(email);
    if (SG.loaded[key]) return SG.loaded[key];
    var u = base(url0) + '/rest/v1/' + table + '?select=*&' + col + '=' + inList(email);
    SG.loaded[key] = tryGet(u, { headers: headers }).then(function (r) {
      return r.ok ? r.json() : [];
    }).then(function (rows) {
      rows = Array.isArray(rows) ? rows : [];
      rows.sort(function (a, b) { return size(b) - size(a); });
      SG.rows[key] = rows;
      setTimeout(function () { rows.forEach(restore); }, 300);
      return rows;
    }).catch(function () { SG.rows[key] = []; return []; });
    return SG.loaded[key];
  }

  /* fill what a save leaves empty from the saved row, so a save can only add */
  function empty(v) { return v == null || v === '' || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length); }
  function fill(out, srv) {
    if (!srv || typeof srv !== 'object' || !out || typeof out !== 'object' || Array.isArray(out)) return out;
    Object.keys(srv).forEach(function (k) {
      if (SKIPFILL.test(k)) return;
      var a = out[k], b = srv[k];
      if (empty(b)) return;
      if (!(k in out) || empty(a)) out[k] = b;
      else if (typeof a === 'number' && typeof b === 'number' && a === 0 && b > 0) out[k] = b;
      else if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a)) fill(a, b);
      else if (typeof a === 'string' && typeof b === 'string' && (a.charAt(0) === '{' || a.charAt(0) === '[')) {
        try { var pa = JSON.parse(a), pb = JSON.parse(b); if (pa && pb && typeof pa === 'object') { fill(pa, pb); out[k] = JSON.stringify(pa); } } catch (e) {}
      }
    });
    return out;
  }
  function match(row, rows) {
    var best = null;
    (rows || []).forEach(function (r) {
      for (var i = 0; i < KEYCOLS.length; i++) { var c = KEYCOLS[i]; if (c in row && c in r && String(row[c]) !== String(r[c])) return; }
      if (!best || size(r) > size(best)) best = r;
    });
    return best;
  }

  /* writes waiting for a load: only the newest per table+student is sent */
  var held = {};
  function hdrs(init) { var h = {}; var src = init && init.headers; if (!src) return h;
    if (typeof src.forEach === 'function') src.forEach(function (v, k) { h[k] = v; }); else for (var k in src) h[k] = src[k]; return h; }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/rest/v1/') < 0) return realFetch(input, init);
    var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
    var table = tableOf(url);
    var h = hdrs(init);

    if (method === 'GET' || method === 'HEAD') {
      var m = /[?&](email|student_email)=(eq|ilike)\.([^&]+)/.exec(url);
      if (!m || INFRA.test(table)) return realFetch(input, init);
      var email = decodeURIComponent(m[3]).replace(/^"|"$/g, '');
      if (!isStu(email)) return realFetch(input, init);
      if (!identify(email)) return new Promise(function () {});
      var obj = /vnd\.pgrst\.object/.test(h.Accept || h.accept || '');
      var u2 = url.replace(m[0], m[0].charAt(0) + m[1] + '=' + inList(email));
      var h2 = {}; for (var k in h) if (!/^accept$/i.test(k)) h2[k] = h[k];
      var init2 = {}; for (var j in (init || {})) init2[j] = init[j]; init2.headers = h2;
      var key = table + '|' + lp(email);
      var p = tryGet(u2, init2).then(function (r) {
        if (!r.ok) { if (!SG.loaded[key]) SG.loaded[key] = Promise.resolve([]); return r; }
        return r.json().then(function (rows) {
          rows = Array.isArray(rows) ? rows : [];
          rows.sort(function (a, b) { return size(b) - size(a); });
          SG.rows[key] = (SG.rows[key] || []).concat(rows);
          if (!SG.loaded[key]) SG.loaded[key] = Promise.resolve(rows);
          setTimeout(function () { rows.forEach(restore); }, 700);
          if (obj) return rows.length ? new Response(JSON.stringify(rows[0]), { status: 200, headers: { 'content-type': 'application/json' } })
                                      : new Response(JSON.stringify({ message: 'no rows' }), { status: 406, headers: { 'content-type': 'application/json' } });
          return new Response(JSON.stringify(rows), { status: 200, headers: { 'content-type': 'application/json' } });
        });
      });
      return p;
    }

    if ((method === 'POST' || method === 'PATCH') && !INFRA.test(table) && init && typeof init.body === 'string') {
      var data; try { data = JSON.parse(init.body); } catch (e) { return realFetch(input, init); }
      var list = Array.isArray(data) ? data : [data];
      var first = list[0] || {};
      var col = first.email ? 'email' : (first.student_email ? 'student_email' : '');
      var em = first.email || first.student_email || '';
      if (!em && method === 'PATCH') { var pm = /[?&](email|student_email)=(eq|ilike)\.([^&]+)/.exec(url); if (pm) { col = pm[1]; em = decodeURIComponent(pm[3]).replace(/^"|"$/g, ''); } }
      if (!isStu(em)) return realFetch(input, init);
      if (!identify(em)) return new Promise(function () {});
      try { var t = JSON.parse(LS.getItem('__sg_t:' + PATH) || '[]'); if (t.indexOf(table) < 0) { t.push(table); Storage.prototype.setItem.call(LS, '__sg_t:' + PATH, JSON.stringify(t)); } } catch (e) {}
      var key2 = table + '|' + lp(em);
      var slot = held[key2] || (held[key2] = { waiters: [] });
      slot.latest = { input: input, init: init, list: list, isArr: Array.isArray(data) };
      return new Promise(function (resolve, reject) {
        slot.waiters.push({ resolve: resolve, reject: reject });
        load(url, table, col, em, h).then(function () {
          var job = slot.latest, ws = slot.waiters; if (!job) return;
          slot.latest = null; slot.waiters = [];
          var rows = SG.rows[key2] || [];
          job.list.forEach(function (row) { fill(row, match(row, rows)); });
          /* the merged row is now the newest server copy */
          job.list.forEach(function (row) { var old = match(row, rows); if (old) { var i = rows.indexOf(old); rows[i] = JSON.parse(JSON.stringify(row)); } else rows.push(JSON.parse(JSON.stringify(row))); });
          var init3 = {}; for (var j2 in job.init) init3[j2] = job.init[j2];
          init3.body = JSON.stringify(job.isArr ? job.list : job.list[0]);
          realFetch(job.input, init3).then(function (r) {
            ws.forEach(function (w, i) { w.resolve(i === ws.length - 1 ? r : r.clone()); });
          }, function (err) { ws.forEach(function (w) { w.reject(err); }); });
        });
      });
    }
    return realFetch(input, init);
  };

  /* preload known tables as soon as a student email shows up anywhere on the page's requests */
  SG.preload = function (email) {
    var t = (window.SG_TABLES || []).slice();
    try { JSON.parse(LS.getItem('__sg_t:' + PATH) || '[]').forEach(function (x) { if (t.indexOf(x) < 0) t.push(x); }); } catch (e) {}
    t.forEach(function (tb) { load('https://lhmwtfyceilgndpygivj.supabase.co/rest/v1/' + tb, tb, 'email', email,
      { apikey: SG.key, Authorization: 'Bearer ' + SG.key }); });
  };
  SG.key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var wf = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (url.indexOf('/rest/v1/') > -1 && !SG.preloaded) {
        var b = init && typeof init.body === 'string' ? init.body : '';
        var m = /"(?:email|student_email)"\s*:\s*"([^"]+@(?:s\.)?sfusd\.edu)"/i.exec(b) || /[?&](?:email|student_email)=(?:eq|ilike)\.([^&]+)/.exec(url);
        if (m) { var e = decodeURIComponent(m[1]).replace(/^"|"$/g, ''); if (isStu(e) && identify(e)) { SG.preloaded = true; SG.preload(e); } }
      }
    } catch (x) {}
    return wf(input, init);
  };
})();
