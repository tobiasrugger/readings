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
            'select.tsel.A{background:#fff3e2;border-color:#F8981F}select.tsel.B{background:#f1e8f6;border-color:#864D9E}select.tsel.C{background:#e3f4e8;border-color:#2d7a47}select.tsel.D{background:#e6eefc;border-color:#2f6fbd}' +
            '.ask{font-size:18px}td.tier{white-space:nowrap}.tnote{margin:10px 0 0;color:#6b5f78;font-size:14px}' +
            '.tsetall{margin-left:auto;font-weight:800;font-size:14px}.tsetall select{width:auto;display:inline-block}' +
            '.tmkbtn{border:2px solid #2B2233;background:#fff;border-radius:8px;padding:1px 7px;font-weight:900;cursor:pointer;font-size:13px}' +
            '.tmkbtn.un{background:#fff3e2;border-color:#F8981F}.tmkbtn:hover{background:#f1e8f6}' +
            '.tmkrow>td{background:#faf9fc;border-top:2px solid #2B2233;border-bottom:2px solid #2B2233;padding:10px 14px}' +
            '.tmkwrap>b{display:block;font-size:16px;margin:0 0 2px}' +
            '.tmkhow{display:block;color:#6b5f78;font-size:13px;font-weight:700;margin:0 0 8px}' +
            '.tmknone{margin:0;color:#6b5f78;font-weight:700}' +
            '.tmkone{display:flex;gap:10px;align-items:flex-start;border-top:1px solid #d9d3e3;padding:8px 0}' +
            '.tmkone:first-of-type{border-top:0}' +
            '.tmklab{flex:none;width:30px;height:30px;border-radius:50%;background:#864D9E;color:#fff;font-weight:900;font-size:13px;display:inline-flex;align-items:center;justify-content:center}' +
            '.tmkbody{flex:1;min-width:0}.tmkbody p{margin:0 0 4px;font-size:16px;line-height:1.4;white-space:pre-wrap}';
  if (!$('tiersDashCss')) { var st = document.createElement('style'); st.id = 'tiersDashCss'; st.textContent = CSS; document.head.appendChild(st); }

  function tierCols(r) {
    var sc = r.scores || {}, w = r.work || {}, t = w.tiers || {}, A = sc.tierA, B = sc.tierB, C = sc.tierC, G = sc.tierD;
    return {
      tier: r.tier || '', ask: !!t.askNext, open: t.open || '',
      a: A ? ('order ' + A.order + '/5' + (A.order_first != null && A.order_first !== A.order ? ' (first ' + A.order_first + ')' : '') + ' · topic ' + (A.topic ? '✓' : '✗') + (A.read ? ' · read ' + A.read.ok + '/' + A.read.total : '')) : '',
      b: (B != null) ? (B + '/' + (sc.tierB_max || 4) + ' changed') : '',
      c: C ? (C.words + ' words · ' + C.ideas + '/5 ideas · checked ' + C.checked + (C.revised ? ' · revised' : '')) : '',
      para: (t.C && t.C.text) || '',
      d: G ? (G.solved + '/' + G.total + ' grammar' + (G.first_try != null ? ' · ' + G.first_try + ' first try' : '') + (G.shown ? ' · ' + G.shown + ' shown' : '')) : '',
      pts: (A ? A.order + A.topic : 0) + (B || 0) + (C ? C.pts : 0) + (G ? G.solved : 0)
    };
  }
  function tierSel(r) {
    var v = r.tier || '';
    return '<select class="tsel ' + esc(v) + '" data-email="' + esc(r.email) + '"><option value=""' + (!v ? ' selected' : '') + '>Ask teacher</option>' +
           ['A', 'B', 'C', 'D'].map(function (k) { return '<option' + (v === k ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select>';
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
  /* ================= Mr. Toby's marks on the writing (T-396) =================
     The hub owns the ✓/✗/note plumbing (T-393/T-394): it binds GALMARK on #tTable and asks us,
     through markAns(row, key), what a tier answer says. Our part is to SHOW the writing — the
     compact B and C cells can't hold a paragraph — so each row gets a ✎ button that opens one
     detail row with every written answer and its control. The detail row carries the same
     data-email, so the hub's own handler resolves the student from it.
     Keys: "tB.<i>" per Tier B rewrite, "tC.sum" for the paragraph. "yt.*" is the hub's. */
  function GM() { return window.GALMARK; }
  function nz(a) { return String(a == null ? '' : a).replace(/\s+/g, ' ').trim(); }
  function rwOf(r) { var t = ((r.work || {}).tiers || {}); return (t.B && t.B.rw) || []; }
  function sumOf(r) { var t = ((r.work || {}).tiers || {}); return (t.C && t.C.text) || ''; }
  function markAns(r, key) {
    var m = /^tB\.(\d+)$/.exec(key);
    if (m) return rwOf(r)[+m[1]] || '';
    return /^tC\./.test(key) ? sumOf(r) : '';
  }
  function writtenItems(r) {
    var out = rwOf(r).map(function (a, i) { return { key: 'tB.' + i, a: a || '', lab: 'B' + (i + 1) }; })
      .filter(function (it) { return nz(it.a); });
    if (nz(sumOf(r))) out.push({ key: 'tC.sum', a: sumOf(r), lab: 'C' });
    return out;
  }
  function unmarkedCount(r) { return GM() ? GM().unmarked(r.marks, writtenItems(r)) : 0; }
  /* the tier points this row still earns once ✗ marks are taken off */
  function tierPts(r) {
    var sc = r.scores || {}, G = GM(), A = sc.tierA || {}, off = 0;
    if (G) rwOf(r).forEach(function (a, i) { if (nz(a) && G.off(r.marks, 'tB.' + i, a)) off++; });
    var b = Math.max(0, (+sc.tierB || 0) - off);
    var c = +((sc.tierC || {}).pts) || 0; if (G && G.off(r.marks, 'tC.sum', sumOf(r))) c = 0;
    return (+A.order || 0) + (+A.topic || 0) + b + c + (+((sc.tierD || {}).solved) || 0);
  }
  /* GALMARK.reelScore still reads the tier points the STUDENT page last saved, so right after a ✗
     on a rewrite or the paragraph the gradebook row would not drop until that student opened the
     page again. Until marks.js does this itself (std.js seat owns it), take the difference off
     here; the /tB\./ test means this stands down the moment their version handles tier keys. */
  (function patchScore() {
    var G = window.GALMARK;
    if (!G || G.__tierScore || /tB\\./.test(String(G.reelScore))) return;
    var base = G.reelScore;
    G.reelScore = function (row, marks) {
      var sc = base(row, marks), raw = row.scores || {}, A = raw.tierA || {};
      var before = raw.tiers_pts != null ? +raw.tiers_pts
        : (+A.order || 0) + (+A.topic || 0) + (+raw.tierB || 0) + (+((raw.tierC || {}).pts) || 0) + (+((raw.tierD || {}).solved) || 0);
      var now = tierPts({ scores: raw, work: row.work, marks: marks });
      return { score: Math.max(0, sc.score - Math.max(0, before - now)), max: sc.max };
    };
    G.__tierScore = true;
  })();
  function markRow(tr, r) {
    var nx = tr.nextElementSibling;
    if (nx && nx.classList.contains('tmkrow')) { nx.remove(); return; }
    var items = writtenItems(r), G = GM(), h = '';
    if (!items.length) h = '<p class="tmknone">This student has not written anything in B or C yet.</p>';
    else items.forEach(function (it) {
      h += '<div class="tmkone"><span class="tmklab">' + esc(it.lab) + '</span>' +
           '<div class="tmkbody"><p translate="no">' + esc(it.a) + '</p>' + (G ? G.controls(r.marks, it.key, it.a) : '') + '</div></div>';
    });
    var row = document.createElement('tr');
    row.className = 'tmkrow';
    row.setAttribute('data-email', r.email);     /* the hub's handler reads the student from here */
    row.innerHTML = '<td colspan="' + tr.children.length + '"><div class="tmkwrap">' +
      '<b>Mr. Toby\u2019s marks \u2014 ' + esc(r.student_name || r.email) + '</b>' +
      '<span class="tmkhow">A \u2717 needs a note. It takes that part\u2019s point off until the student changes the answer.</span>' + h + '</div></td>';
    tr.parentNode.insertBefore(row, tr.nextSibling);
  }

  function decorate() {
    var table = $('tTable'); if (!table) return;
    var byEmail = {}; D.rows().forEach(function (r) { byEmail[r.email] = r; });
    var head = table.querySelector('tr');
    if (head && !head.querySelector('.th-tier')) {
      var ins = head.children[head.children.length - 2] || null;   /* before "Turned in" */
      ['Tier', 'A', 'B', 'C', 'D'].forEach(function (lab) { var th = document.createElement('th'); th.textContent = lab; if (lab === 'Tier') th.className = 'th-tier'; head.insertBefore(th, ins); });
    }
    table.querySelectorAll('tr[data-email]').forEach(function (tr) {
      if (tr.querySelector('td.tier')) return;
      var r = byEmail[tr.getAttribute('data-email')]; if (!r) return;
      var s = tierCols(r), ins = tr.children[tr.children.length - 2] || null, cells = [];
      cells.push('<td class="tier">' + tierSel(r) + (s.ask ? ' <span class="ask" title="Ready for the next one?">🙋</span>' : '') + (!s.tier && s.open ? ' <span class="pill no">doing ' + esc(s.open) + '</span>' : '') + '</td>');
      var un = unmarkedCount(r), any = writtenItems(r).length;
      var mk = any ? '<button type="button" class="tmkbtn' + (un ? ' un' : '') + '" title="Mr. Toby\u2019s \u2713 / \u2717 / note on this student\u2019s writing">' + (un ? '\u270e ' + un : '\u2713') + '</button>' : '';
      cells.push('<td>' + esc(s.a) + '</td><td>' + esc(s.b) + '</td><td' + (s.para ? ' title="' + esc(s.para) + '"' : '') + '>' + esc(s.c) + ' ' + mk + '</td><td>' + esc(s.d) + '</td>');
      var tmp = document.createElement('tr'); tmp.innerHTML = cells.join('');
      while (tmp.firstChild) tr.insertBefore(tmp.firstChild, ins);
    });
    table.querySelectorAll('.tmkbtn').forEach(function (b) {
      if (b.__wired) return; b.__wired = true;
      b.addEventListener('click', function () {
        var tr = b.closest('tr[data-email]'), r = byEmail[tr.getAttribute('data-email')];
        if (r) markRow(tr, r);
      });
    });
    table.querySelectorAll('.tsel').forEach(function (sel) {
      if (sel.__wired) return; sel.__wired = true;
      sel.addEventListener('change', function () { var v = sel.value; sel.className = 'tsel ' + v; setTier(sel.getAttribute('data-email'), v); });
    });
    var csv = $('tCsv');
    if (csv && !$('tAll')) {
      var lab = document.createElement('label'); lab.className = 'tsetall';
      lab.innerHTML = 'Set all shown to <select class="txt tsel" id="tAll"><option value="">…</option><option value="">Ask teacher</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select>';
      csv.parentNode.insertBefore(lab, csv.nextSibling);
      var note = document.createElement('p'); note.className = 'tnote';
      note.textContent = 'Tier: A words and voice · B synonyms and details · C paragraph · D grammar from the story. “Ask teacher” means no tier is set and the student sees all three cards. 🙋 = the student tapped “Ready for the next one?”.';
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
    csvHead: function () { return ['tier', 'asks_next', 'tier_a', 'tier_b', 'tier_c', 'tier_d', 'paragraph', 'tier_points', 'writing_unmarked']; },
    csvRow: function (r) { var s = tierCols(r); return [s.tier, s.ask, s.a, s.b, s.c, s.d, s.para, tierPts(r), unmarkedCount(r)]; },
    markAns: markAns,              /* T-394 hook: the hub asks us what a tier answer says */
    markPts: tierPts
  };
  decorate();
})();
