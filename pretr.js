/* ============================================================================================
   readings/pretr.js — T-360 (Nov 12 2026). ONE shared "🌐 Pre-translate" module for teacher pages.
   The page supplies only content:

     GAL.pretr({
       host:   '#somewhere' | element,              // where the box is drawn
       title:  'Pre-translate an episode',          // optional heading
       items:  [ { key:'reel-v2/ep03', title:'Episode 3 · …',
                   lines: function(){ return Promise|Array of {src, slug, meaning?, mode?} } } ],
       langs:  [[value,label],…] | function → Promise of that   // value = what the student page sends as lang
       ticked: ['es','zh',…] | RegExp                // default ticks (Spanish, Mandarin, Arabic, Vietnamese)
     });

   It draws: a yellow "Today so far" line, the 15 language ticks, one status line under each item's title
   with its own small button, a progress bar and a Stop button. It saves every answer in song_tr exactly
   where the student page's cache looks first (slug + lang + src), skips what is already saved, stops cleanly
   at the translator's daily limit, and keeps a run record per item in pretr_runs (written every 20 lines, so
   a closed tab still reads INCOMPLETE). Status is computed from the record + the saved cache; it NEVER calls
   the translator just to show a status. Counts are LINES (one text in one language), not words.
   ============================================================================================ */
(function () {
  window.GAL = window.GAL || {};
  if (window.GAL.pretr) return;
  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
  var LANGS15 = [['Spanish','Spanish'],['Cantonese','Cantonese'],['Mandarin','Mandarin'],['Arabic','Arabic'],['Vietnamese','Vietnamese'],
    ['Russian','Russian'],['Darija','Darija'],['Urdu','Urdu'],['Tagalog','Tagalog'],['French','French'],['Korean','Korean'],
    ['Hindi','Hindi'],['Somali','Somali'],['Thai','Thai'],['Nepali','Nepali']];
  var NAMES = { es: 'Spanish', yue: 'Cantonese', 'zh-HK': 'Cantonese', 'zh-TW': 'Cantonese', zh: 'Mandarin', 'zh-CN': 'Mandarin', cmn: 'Mandarin', ar: 'Arabic', vi: 'Vietnamese',
    ru: 'Russian', ary: 'Darija', ur: 'Urdu', tl: 'Tagalog', fil: 'Tagalog', fr: 'French', ko: 'Korean', hi: 'Hindi', so: 'Somali', th: 'Thai', ne: 'Nepali' };
  function english(v, label) { return NAMES[v] || NAMES[String(v).split('-')[0]] || label || v; }
  var DEFAULT_TICK = /^(es|zh|zh-CN|cmn|ar|vi)$|^(Spanish|Mandarin|Chinese|Arabic|Vietnamese)\b/i;
  var QUOTA = /too many times|quota|daily limit|limit exceeded|Service invoked/i;
  var SOFT_DEFAULT = 1500;
  var REMIND = 'The translator has a daily limit. On Nov 5 it ran out and every translation on the site stopped until the next day. Leave room for class taps.';
  function H(pref) { var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' }; if (pref) h.Prefer = pref; return h; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function hash(arr) { var s = arr.join('\u0001'), h1 = 0x811c9dc5, h2 = 0; for (var i = 0; i < s.length; i++) { h1 ^= s.charCodeAt(i); h1 = Math.imul(h1, 16777619) >>> 0; h2 = (h2 * 31 + s.charCodeAt(i)) >>> 0; } return h1.toString(16) + h2.toString(16) + ':' + arr.length; }
  function when(t) { try { return new Date(t).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'numeric', day: 'numeric', year: '2-digit', hour: 'numeric', minute: '2-digit' }); } catch (e) { return t; } }
  function pacificMidnightISO() {
    var now = new Date(), p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(now), o = {};
    p.forEach(function (x) { o[x.type] = x.value; });
    var hh = (+o.hour % 24) * 3600000 + (+o.minute) * 60000 + (+o.second) * 1000;
    return new Date(now.getTime() - hh - now.getMilliseconds()).toISOString();
  }
  function css() {
    if (document.getElementById('galPtCss')) return;
    var s = document.createElement('style'); s.id = 'galPtCss';
    s.textContent =
      '.gpt{border:2px solid #2B2233;border-radius:12px;background:#fff;padding:12px 14px;box-shadow:0 3px 0 rgba(43,34,51,.18);font-family:Nunito,system-ui,sans-serif;color:#2B2233;max-width:100%;box-sizing:border-box}' +
      '.gpt h3{margin:0 0 6px;font-size:17px}' +
      '.gpt .gpt-warn{background:#fff7d6;border:1.5px solid #c98a12;border-radius:8px;padding:6px 9px;font-size:13.5px;margin:0 0 8px}' +
      '.gpt .gpt-warn b{font-weight:900}.gpt .gpt-warn small{display:block;color:#6b5a2a;margin-top:2px}' +
      '.gpt .gpt-langs{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:13.5px;margin:0 0 8px}.gpt .gpt-langs label{white-space:nowrap}' +
      '.gpt .gpt-item{border-top:1px solid #d9d2c3;padding:8px 0 6px}' +
      '.gpt .gpt-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.gpt .gpt-title{font-weight:900;font-size:15px;flex:1 1 200px}' +
      '.gpt button{font:800 13px Nunito,system-ui,sans-serif;border:2px solid #2B2233;background:#fff;border-radius:999px;padding:3px 11px;cursor:pointer;color:#2B2233;width:auto}' +
      '.gpt button.go{background:#0F6E56;border-color:#0b5946;color:#fff}.gpt button:disabled{opacity:.45;cursor:default}' +
      '.gpt .gpt-st{font-size:13px;color:#4a4256;margin-top:3px;line-height:1.35}' +
      '.gpt .gpt-st .ok{color:#14653b;font-weight:900}.gpt .gpt-st .bad{color:#9a4f00;font-weight:900}.gpt .gpt-st .chg{color:#7c3aed;font-weight:900}' +
      '.gpt details{font-size:12.5px;margin-top:3px}.gpt details summary{cursor:pointer;color:#9a4f00;font-weight:800}.gpt details ul{margin:4px 0 0 16px;padding:0;max-height:200px;overflow:auto}' +
      '.gpt .gpt-bar{height:8px;background:#e6e3dc;border-radius:99px;margin-top:5px;overflow:hidden;display:none}.gpt .gpt-bar i{display:block;height:100%;width:0;background:#0F6E56}' +
      '.gpt .gpt-msg{font-size:13px;font-weight:800;margin-top:6px;min-height:1em}';
    document.head.appendChild(s);
  }
  /* ---- server ---- */
  function getJSON(url) { return fetch(url, { headers: H() }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function todayCount() {
    var h = H('count=exact'); h['Range-Unit'] = 'items'; h.Range = '0-0';
    return fetch(SUPA_URL + '/rest/v1/song_tr?select=src&created_at=gte.' + encodeURIComponent(pacificMidnightISO()), { headers: h })
      .then(function (r) { var cr = r.headers.get('content-range') || ''; var n = +(cr.split('/')[1] || NaN); return isNaN(n) ? null : n; }, function () { return null; });
  }
  function softLimit() {
    return getJSON(SUPA_URL + '/rest/v1/gal_settings?key=eq.pretr_soft&select=value')
      .then(function (rows) { var v = rows && rows[0] && rows[0].value; var n = v && (v.limit || v.n || v); n = +n; return n > 0 ? n : SOFT_DEFAULT; }, function () { return SOFT_DEFAULT; });
  }
  function getRun(key) { return getJSON(SUPA_URL + '/rest/v1/pretr_runs?item_key=eq.' + encodeURIComponent(key) + '&select=*').then(function (r) { return r[0] || null; }, function () { return null; }); }
  function putRun(rec) {
    return fetch(SUPA_URL + '/rest/v1/pretr_runs?on_conflict=item_key', { method: 'POST', headers: H('resolution=merge-duplicates,return=minimal'), body: JSON.stringify([rec]) })
      .then(function (r) { return r.ok; }, function () { return false; });
  }
  function savedSet(slugs, langs) {
    var have = {}, jobs = [];
    slugs.forEach(function (slug) {
      langs.forEach(function (lg) {
        jobs.push(new Promise(function (res) {
          var off = 0;
          (function page() {
            getJSON(SUPA_URL + '/rest/v1/song_tr?select=src&slug=eq.' + encodeURIComponent(slug) + '&lang=eq.' + encodeURIComponent(lg) + '&limit=1000&offset=' + off)
              .then(function (rows) { (rows || []).forEach(function (r) { have[slug + '|' + lg + '|' + r.src] = 1; }); if (rows && rows.length === 1000) { off += 1000; page(); } else res(); }, function () { res(); });
          })();
        }));
      });
    });
    return Promise.all(jobs).then(function () { return have; });
  }
  function ask(line, lg) {
    return new Promise(function (res) {
      var mode = line.mode || (String(line.src).trim().split(/\s+/).length <= 3 ? 'word' : 'sentence');
      var u = PROXY + '?action=translate&mode=' + mode + '&idiom=' + encodeURIComponent(line.src) + '&meaning=' + encodeURIComponent(line.meaning || '') + '&lang=' + encodeURIComponent(lg);
      var x = new XMLHttpRequest(), done = false;   /* XHR, so std.js's fetch cache wrapper never files a copy under THIS page's slug */
      function fin(v) { if (!done) { done = true; res(v); } }
      x.open('GET', u, true); x.timeout = 20000;
      x.onload = function () {
        var body = x.responseText || '', d = null; try { d = JSON.parse(body); } catch (e) {}
        if (d && d.translation) { var v = typeof d.translation === 'string' ? d.translation : (d.translation.equiv || d.translation.meaning || ''); if (String(v).trim()) return fin({ v: String(v).trim() }); }
        fin({ fail: true, quota: QUOTA.test(d ? String(d.error || d.message || '') : body.slice(0, 400)) });
      };
      x.onerror = x.ontimeout = function () { fin({ fail: true }); };
      x.send();
    });
  }
  function put(line, lg, v) {
    return fetch(SUPA_URL + '/rest/v1/song_tr?on_conflict=slug,lang,src', { method: 'POST', headers: H('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify([{ slug: line.slug, lang: lg, src: line.src, equiv: v, meaning: '', note: '' }]) }).then(function (r) { return r.ok; }, function () { return false; });
  }
  /* ---- status from the record + the cache (no translator calls) ---- */
  function statusHTML(rec, curHash, cov) {
    if (!rec) {
      if (cov && cov.total) {
        if (cov.saved >= cov.total) return '<span class="ok">COMPLETE</span> · all ' + cov.total + ' lines already saved (' + esc(cov.langs.join(', ')) + ')';
        if (cov.saved) return '<span class="bad">INCOMPLETE</span> · ' + cov.saved + ' of ' + cov.total + ' lines saved (' + esc(cov.langs.join(', ')) + ') · run again';
      }
      return 'Not pre-translated. No run yet.';
    }
    var langs = (rec.langs || []).join(', '), failed = rec.failed || [], head = '🌐 Pre-translated ' + esc(when(rec.updated_at)) + ' · ' + esc(langs) + ' · ' + rec.total + ' lines';
    if (curHash && rec.hash && curHash !== rec.hash) return head + ' · <span class="chg">TEXT CHANGED SINCE</span> · run again';
    var stale = rec.status === 'running' && (Date.now() - new Date(rec.updated_at).getTime() > 120000);
    if (rec.status !== 'complete' || stale) return head + ' · <span class="bad">INCOMPLETE</span> · ' + rec.done + ' of ' + rec.total + (rec.note ? ' · ' + esc(rec.note) : '') + ' · run again';
    if (failed.length && !rec.retried) return head + ' · ' + failed.length + ' failed · <span class="bad">INCOMPLETE</span> · run again to retry them';
    if (failed.length) return head + ' · <span class="ok">COMPLETE</span> · ' + failed.length + ' won\u2019t translate' +
      '<details><summary>Show the lines that won\u2019t translate</summary><ul>' + failed.slice(0, 300).map(function (f) { return '<li>' + esc(f.lang) + ' · ' + esc(f.src) + '</li>'; }).join('') + '</ul></details>';
    return head + ' · <span class="ok">COMPLETE</span>';
  }

  window.GAL.pretr = function (opt) {
    css();
    var host = typeof opt.host === 'string' ? document.querySelector(opt.host) : opt.host;
    if (!host) return null;
    var box = document.createElement('div'); box.className = 'gpt';
    box.innerHTML = '<h3>' + esc(opt.title || '\ud83c\udf10 Pre-translate') + '</h3>' +
      '<div class="gpt-warn"><b class="gpt-today">Today so far: \u2026 translations saved site-wide.</b><small>' + esc(REMIND) + '</small></div>' +
      '<div class="gpt-langs">Loading the languages\u2026</div><div class="gpt-items"></div>' +
      '<div class="gpt-row" style="margin-top:4px"><button type="button" class="gpt-stop" style="display:none">Stop</button><span class="gpt-msg"></span></div>';
    host.appendChild(box);
    var q = function (s) { return box.querySelector(s); };
    var items = opt.items || [], busy = false, stop = false, linesCache = {};
    function refreshToday() { todayCount().then(function (n) { q('.gpt-today').textContent = 'Today so far: ' + (n == null ? '?' : n) + ' translations saved site-wide.'; }); }
    function getLines(it) { if (linesCache[it.key]) return Promise.resolve(linesCache[it.key]); return Promise.resolve(it.lines()).then(function (ls) { var seen = {}, out = []; (ls || []).forEach(function (l) { if (!l || !l.src || !l.slug) return; var k = l.slug + '|' + l.src; if (seen[k]) return; seen[k] = 1; out.push(l); }); linesCache[it.key] = out; return out; }); }
    function lineHash(ls) { return hash(ls.map(function (l) { return l.slug + '|' + l.src; })); }
    function tickedLangs() { return [].map.call(q('.gpt-langs').querySelectorAll('input:checked'), function (c) { return c.value; }); }
    function langLabel(v) { var c = q('.gpt-langs input[value="' + String(v).replace(/"/g, '') + '"]'); return (c && c.getAttribute('data-en')) || english(v); }
    /* languages */
    Promise.resolve(typeof opt.langs === 'function' ? opt.langs() : (opt.langs || LANGS15)).then(function (L) {
      L = (L && L.length) ? L : LANGS15;
      var tick = opt.ticked || DEFAULT_TICK;
      q('.gpt-langs').innerHTML = L.map(function (x) {
        var on = Array.isArray(tick) ? tick.indexOf(x[0]) >= 0 : (tick.test(x[0]) || tick.test(x[1]));
        var en = english(x[0], x[1]);
        return '<label title="' + esc(x[1]) + '"><input type="checkbox" value="' + esc(x[0]) + '" data-en="' + esc(en) + '"' + (on ? ' checked' : '') + '> ' + esc(en) + '</label>';
      }).join('');
    }, function () { q('.gpt-langs').textContent = 'Could not load the language list.'; });
    /* items */
    q('.gpt-items').innerHTML = items.map(function (it, i) {
      return '<div class="gpt-item" data-i="' + i + '"><div class="gpt-row"><span class="gpt-title">' + esc(it.title) + '</span>' +
             '<button type="button" class="go" data-run="' + i + '">Pre-translate</button></div><div class="gpt-st">Checking\u2026</div><div class="gpt-bar"><i></i></div></div>';
    }).join('');
    function paint(i) {
      var it = items[i], el = q('.gpt-item[data-i="' + i + '"] .gpt-st');
      return getRun(it.key).then(function (rec) {
        return getLines(it).then(function (ls) {
          if (rec) { el.innerHTML = statusHTML(rec, lineHash(ls)); return; }
          var langs = tickedLangs(); if (!langs.length) { el.innerHTML = statusHTML(null); return; }
          var slugs = {}; ls.forEach(function (l) { slugs[l.slug] = 1; });
          return savedSet(Object.keys(slugs), langs).then(function (have) {
            var n = 0; ls.forEach(function (l) { langs.forEach(function (lg) { if (have[l.slug + '|' + lg + '|' + l.src]) n++; }); });
            el.innerHTML = statusHTML(null, null, { total: ls.length * langs.length, saved: n, langs: langs.map(langLabel) });
          });
        }, function () { el.innerHTML = rec ? statusHTML(rec) : 'Could not read this item.'; });
      });
    }
    function paintAll() { var i = 0; (function next() { if (i < items.length) paint(i++).then(next, next); })(); }
    refreshToday();
    setTimeout(paintAll, 300);
    q('.gpt-stop').addEventListener('click', function () { stop = true; q('.gpt-msg').textContent = 'Stopping after the current line\u2026'; });
    box.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-run]'); if (b && !busy) run(+b.dataset.run); });

    function run(i) {
      var it = items[i], langs = tickedLangs(), item = q('.gpt-item[data-i="' + i + '"]'), msg = q('.gpt-msg');
      if (!langs.length) { msg.textContent = 'Tick at least one language.'; return; }
      busy = true; stop = false; setButtons(true); msg.textContent = 'Reading ' + it.title + '\u2026';
      delete linesCache[it.key];
      Promise.all([getLines(it), getRun(it.key), todayCount(), softLimit()]).then(function (r) {
        var ls = r[0], prev = r[1], today = r[2] || 0, soft = r[3], slugs = {};
        ls.forEach(function (l) { slugs[l.slug] = 1; });
        return savedSet(Object.keys(slugs), langs).then(function (have) {
          var jobs = [], total = ls.length * langs.length, savedBefore = 0;
          ls.forEach(function (l) { langs.forEach(function (lg) { if (have[l.slug + '|' + lg + '|' + l.src]) savedBefore++; else jobs.push({ l: l, lg: lg }); }); });
          var prevFailed = {}; ((prev && prev.failed) || []).forEach(function (f) { prevFailed[f.lang + '|' + f.src] = 1; });
          msg.textContent = 'This run will make ' + jobs.length + ' new request' + (jobs.length === 1 ? '' : 's') + ' (' + savedBefore + ' of ' + total + ' lines already saved).';
          if (jobs.length && today + jobs.length > soft &&
              !window.confirm('Today so far: ' + today + ' translations saved site-wide. This run adds ' + jobs.length + ', past your soft limit of ' + soft + '.\n\n' + REMIND + '\n\nRun anyway?')) {
            finish(); msg.textContent = 'Not run. Try after school or tomorrow.'; return;
          }
          var rec = { item_key: it.key, page: location.pathname, langs: langs.map(langLabel), lang_codes: langs, total: total, done: savedBefore,
                      failed: [], retried: false, hash: lineHash(ls), status: 'running', note: '', started_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          var bar = item.querySelector('.gpt-bar'), fill = bar.querySelector('i'), k = 0, sinceSave = 0, quota = false, retriedAll = true, prevCount = Object.keys(prevFailed).length;
          bar.style.display = 'block';
          function draw() { fill.style.width = (total ? Math.round(100 * rec.done / total) : 100) + '%'; msg.textContent = it.title + ': ' + rec.done + ' of ' + total + ' lines · ' + rec.failed.length + ' failed'; }
          function checkpoint(force) { rec.updated_at = new Date().toISOString(); if (force || ++sinceSave >= 20) { sinceSave = 0; return putRun(rec); } return Promise.resolve(); }
          putRun(rec); draw();
          (function next() {
            if (stop || quota || k >= jobs.length) return end();
            var j = jobs[k++];
            ask(j.l, j.lg).then(function (a) {
              if (a.quota) { quota = true; k--; return; }
              if (a.v) return put(j.l, j.lg, a.v).then(function (ok) { if (ok) rec.done++; else rec.failed.push({ lang: langLabel(j.lg), src: j.l.src }); });
              rec.failed.push({ lang: langLabel(j.lg), src: j.l.src });
            }).then(function () { draw(); return checkpoint(false); }).then(function () { setTimeout(next, 100); });
          })();
          function end() {
            var stubborn = rec.failed.filter(function (f) { return prevFailed[f.lang + '|' + f.src]; }).length;
            rec.retried = rec.failed.length > 0 && prevCount > 0 && stubborn === rec.failed.length;   /* every remaining failure failed again on a retry */
            rec.status = (stop || quota || k < jobs.length) ? 'stopped' : 'complete';
            rec.note = quota ? 'daily limit reached' : (stop ? 'stopped' : '');
            checkpoint(true).then(function () {
              finish(); refreshToday(); paint(i);
              msg.textContent = quota ? 'Daily limit reached. Run again tomorrow. (' + rec.done + ' of ' + total + ' lines saved.)'
                : (stop ? 'Stopped. ' : 'Done. ') + rec.done + ' of ' + total + ' lines saved, ' + rec.failed.length + ' failed.';
              setTimeout(function () { bar.style.display = 'none'; }, 1500);
            });
          }
        });
      }).catch(function (e) { finish(); q('.gpt-msg').textContent = 'Could not read ' + it.title + ' (' + (e && e.message || e) + ').'; });
    }
    function setButtons(on) { [].forEach.call(box.querySelectorAll('[data-run]'), function (b) { b.disabled = on; }); q('.gpt-stop').style.display = on ? '' : 'none'; }
    function finish() { busy = false; setButtons(false); }
    return { refresh: function () { linesCache = {}; paintAll(); refreshToday(); } };
  };
})();
