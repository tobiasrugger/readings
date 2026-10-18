/* Story Reel hub: teacher tier controls for the "After the story" tiers (owned by the tiers chat).
   Contract with the hub (window.REEL_DASH): rows() -> the loaded reel_views rows, episode() -> the
   episode id shown, period() -> the period filter ('' = all), SUPA_URL, SUPA_KEY, esc.
   The hub renders each student row as <tr data-email="..."> and calls REEL_TIERS_DASH.decorate() at the
   end of draw(); REEL_TIERS_DASH.csvHead() / csvRow(r) give the extra CSV columns. */
(function () {
  'use strict';
  var D = window.REEL_DASH;
  if (!D) { console.warn('tiers-dash.js: window.REEL_DASH missing'); return; }
  var esc = D.esc || function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  function $(id) { return document.getElementById(id); }
  var CSS = 'select.tsel{border:2px solid var(--line,#d9d3e3);border-radius:8px;padding:3px 6px;font-weight:800;background:#fff}' +
            'select.tsel.A{background:#fff3e2;border-color:#F8981F}select.tsel.B{background:#f1e8f6;border-color:#864D9E}select.tsel.C{background:#e3f4e8;border-color:#2d7a47}' +
            '.ask{font-size:18px}td.tier{white-space:nowrap}.tnote{margin:10px 0 0;color:#6b5f78;font-size:14px}' +
            '.tsetall{margin-left:auto;font-weight:800;font-size:14px}.tsetall select{width:auto;display:inline-block}';
  if (!$('tiersDashCss')) { var st = document.createElement('style'); st.id = 'tiersDashCss'; st.textContent = CSS; document.head.appendChild(st); }

  function tierCols(r) {
    var sc = r.scores || {}, w = r.work || {}, t = w.tiers || {}, A = sc.tierA, B = sc.tierB, C = sc.tierC;
    return {
      tier: r.tier || '', ask: !!t.askNext, open: t.open || '',
      a: A ? ('order ' + A.order + '/5' + (A.order_first != null && A.order_first !== A.order ? ' (first ' + A.order_first + ')' : '') + ' · topic ' + (A.topic ? '✓' : '✗') + (A.read ? ' · read ' + A.read.ok + '/' + A.read.total : '')) : '',
      b: (B != null) ? (B + '/' + (sc.tierB_max || 4) + ' changed') : '',
      c: C ? (C.words + ' words · ' + C.ideas + '/5 ideas · checked ' + C.checked + (C.revised ? ' · revised' : '')) : '',
      para: (t.C && t.C.text) || '',
      pts: (A ? A.order + A.topic : 0) + (B || 0) + (C ? C.pts : 0)
    };
  }
  function tierSel(r) {
    var v = r.tier || '';
    return '<select class="tsel ' + esc(v) + '" data-email="' + esc(r.email) + '"><option value=""' + (!v ? ' selected' : '') + '>Ask teacher</option>' +
           ['A', 'B', 'C'].map(function (k) { return '<option' + (v === k ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select>';
  }
  function setTier(email, v, done) {
    fetch(D.SUPA_URL + '/rest/v1/reel_views?email=eq.' + encodeURIComponent(email) + '&episode=eq.' + encodeURIComponent(D.episode()), {
      method: 'PATCH', headers: { apikey: D.SUPA_KEY, Authorization: 'Bearer ' + D.SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ tier: v || null })
    }).then(function (r) {
      if (!r.ok) throw r.status;
      D.rows().forEach(function (x) { if (x.email === email) x.tier = v || null; });
      done && done(true);
    }).catch(function (s) { var c = $('tCount'); if (c) c.textContent = 'Could not save the tier (' + s + '). Does reel_views have the tier column?'; done && done(false); });
  }
  function decorate() {
    var table = $('tTable'); if (!table) return;
    var byEmail = {}; D.rows().forEach(function (r) { byEmail[r.email] = r; });
    var head = table.querySelector('tr');
    if (head && !head.querySelector('.th-tier')) {
      var ins = head.children[head.children.length - 2] || null;   /* before "Turned in" */
      ['Tier', 'A', 'B', 'C'].forEach(function (lab) { var th = document.createElement('th'); th.textContent = lab; if (lab === 'Tier') th.className = 'th-tier'; head.insertBefore(th, ins); });
    }
    table.querySelectorAll('tr[data-email]').forEach(function (tr) {
      if (tr.querySelector('td.tier')) return;
      var r = byEmail[tr.getAttribute('data-email')]; if (!r) return;
      var s = tierCols(r), ins = tr.children[tr.children.length - 2] || null, cells = [];
      cells.push('<td class="tier">' + tierSel(r) + (s.ask ? ' <span class="ask" title="Ready for the next one?">🙋</span>' : '') + (!s.tier && s.open ? ' <span class="pill no">doing ' + esc(s.open) + '</span>' : '') + '</td>');
      cells.push('<td>' + esc(s.a) + '</td><td>' + esc(s.b) + '</td><td' + (s.para ? ' title="' + esc(s.para) + '"' : '') + '>' + esc(s.c) + '</td>');
      var tmp = document.createElement('tr'); tmp.innerHTML = cells.join('');
      while (tmp.firstChild) tr.insertBefore(tmp.firstChild, ins);
    });
    table.querySelectorAll('.tsel').forEach(function (sel) {
      if (sel.__wired) return; sel.__wired = true;
      sel.addEventListener('change', function () { var v = sel.value; sel.className = 'tsel ' + v; setTier(sel.getAttribute('data-email'), v); });
    });
    var csv = $('tCsv');
    if (csv && !$('tAll')) {
      var lab = document.createElement('label'); lab.className = 'tsetall';
      lab.innerHTML = 'Set all shown to <select class="txt tsel" id="tAll"><option value="">…</option><option value="">Ask teacher</option><option value="A">A</option><option value="B">B</option><option value="C">C</option></select>';
      csv.parentNode.insertBefore(lab, csv.nextSibling);
      var note = document.createElement('p'); note.className = 'tnote';
      note.textContent = 'Tier: A words and voice · B synonyms and details · C paragraph. “Ask teacher” means no tier is set and the student sees all three cards. 🙋 = the student tapped “Ready for the next one?”.';
      csv.parentNode.parentNode.insertBefore(note, csv.parentNode.nextSibling);
      $('tAll').addEventListener('change', function () {
        var v = $('tAll').value, per = D.period(), idx = $('tAll').selectedIndex; if (idx === 0) return;
        var list = D.rows().filter(function (r) { return !per || String(r.period) === per; }), i = 0;
        function step() { if (i >= list.length) { $('tAll').selectedIndex = 0; if (D.redraw) D.redraw(); return; } setTier(list[i++].email, v, step); }
        step();
      });
    }
  }
  window.REEL_TIERS_DASH = {
    decorate: decorate,
    csvHead: function () { return ['tier', 'asks_next', 'tier_a', 'tier_b', 'tier_c', 'paragraph', 'tier_points']; },
    csvRow: function (r) { var s = tierCols(r); return [s.tier, s.ask, s.a, s.b, s.c, s.para, s.pts]; }
  };
  decorate();
})();
