/* readings/thanksgiving/rail.js — T-502 (Nov 20 2026). Words from the Words step, underlined in the reading and listed in
   the right margin, like the Landlady rail (each word keeps one colour in the text and in its box; the boxes for the
   paragraph on screen light up; tapping an underlined word lights its box). Page font (Nunito), not Landlady's.
   Wide screens (≥1180 px): a fixed margin on the right. Narrower: a strip of word boxes under each paragraph.
   Used by thanksgiving/ (ELD 101) and thanksgiving-103/ (ELD 103).

   TGRAIL.mark(root, words, hooks)   root = element holding the .para paragraphs of one reading screen
     words = [{w, d}]                 hooks = {spk(text)->html, fill(el) (translations), say(text)}
   TGRAIL.clear()                     hide the margin (call when leaving a reading screen)
   T-503 (Nov 21 2026) PHRASE BOXES. Key phrases get a curved orange underline. Hover = the phrase's box appears beside
   its own paragraph; click/tap = the box stays until ✕. Inside a phrase the word under the cursor turns light blue and
   its match in the translation turns blue (hand-written matches only). 6 open per paragraph (3 on phones); the 7th
   closes the oldest, with a one-time notice.
   TGRAIL.phrases(list, hooks)   list = [{p:'after dinner', es:'[después de|0] [la cena|1]', zh:…}]  ([text|k,k] = chunk
       that matches English word k of the phrase; plain text = no match). hooks = {lang(), tr(text,lg,cb), spk(text)->html,
       noteOff()->bool, setNoteOff(bool), onOpen(phrase)}
   TGRAIL.sent(sentence, esc, spkHTML)  sentence HTML (.sn) with phrases wrapped; the page calls it instead of its own.
   TGRAIL.relang()  repaint open phrase boxes after a language change. */
(function () {
  var COLS = ['#c0392b', '#2f6fbd', '#2f7d4f', '#b8860b', '#8e44ad', '#d35400', '#16808a', '#a83a5c', '#5d6d1e', '#34495e'];
  var TINT = ['#fdecea', '#e6f0fb', '#e3f4ea', '#fdf3d7', '#f1e6f7', '#fdebdc', '#dff3f4', '#f9e4ec', '#eef2d9', '#e5e9ee'];
  var css = '.vw{border-bottom:3px dotted var(--vc);cursor:help;border-radius:3px;transition:background .2s}.vw.hot{background:var(--vt)}' +
    '#tgRail{position:fixed;top:70px;right:12px;width:250px;max-height:calc(100vh - 90px);overflow:auto;z-index:50;background:#fff;border:2px solid #1c2640;border-radius:14px;box-shadow:0 4px 0 #1c2640;padding:10px 10px 6px;display:none;font-family:inherit}' +
    '#tgRail h3{margin:0 0 6px;font-size:1rem;color:#1b4332}' +
    '.vbox{border:2px solid #c9d3cc;border-left:8px solid var(--vc);border-radius:10px;padding:6px 8px;margin:0 0 7px;background:#fff;transition:background .25s,box-shadow .25s}' +
    '.vbox.hot{background:var(--vt);border-color:var(--vc);box-shadow:0 2px 8px rgba(0,0,0,.15)}.vbox.force{outline:3px solid var(--vc)}' +
    '.vbox .vk{font-weight:900;font-size:1.05rem;color:var(--vc);display:flex;align-items:center;gap:6px}.vbox .vd{font-size:.9rem;font-weight:600;line-height:1.35}' +
    '.vbox .trn{font-size:.95rem}.vstrip{display:none;flex-wrap:wrap;gap:6px;margin:-4px 0 14px}.vstrip .vbox{flex:1 1 210px;margin:0}' +
    '@media (min-width:1180px){body.tg-rail #tgRail{display:block}body.tg-rail main{margin-left:max(12px,calc((100vw - 1100px) / 2));margin-right:276px}}' +
    '@media (max-width:1179px){.vstrip{display:flex}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var rail = null, obs = null, WORDS = [], HOOKS = {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rx(w) {
    var parts = w.split(' '), first = parts[0], rest = parts.slice(1).join(' ');
    var stem = /e$/.test(first) ? first.slice(0, -1) + '(?:e|es|ed|ing)' : first + '(?:s|es|ed|ing|ged|ging|d)?';
    return new RegExp('\\b(' + stem + (rest ? ' ' + rest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '') + ')\\b', 'i');
  }
  function box(i, w) {
    return '<div class="vbox" data-vi="' + i + '" style="--vc:' + COLS[i % COLS.length] + ';--vt:' + TINT[i % TINT.length] + '">' +
      '<div class="vk" translate="no">' + esc(w.w) + (HOOKS.spk ? HOOKS.spk(w.w) : '') + '</div>' +
      '<div class="vd" translate="no">' + esc(w.d) + '</div><span class="trn" data-tw="' + esc(w.w) + '"></span></div>';
  }
  function wrapIn(node, res, found) {
    /* walk text nodes, skipping buttons; wrap the first match of each word per text node */
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentNode.closest('button,.vw') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
    var texts = [], n; while ((n = walker.nextNode())) texts.push(n);
    texts.forEach(function (t) {
      var done = false;
      while (!done) {
        done = true;
        for (var i = 0; i < res.length; i++) {
          var m = res[i].exec(t.nodeValue); if (!m) continue;
          var a = t.splitText(m.index), b = a.splitText(m[1].length), sp = document.createElement('span');
          sp.className = 'vw'; sp.setAttribute('data-vi', i); sp.style.setProperty('--vc', COLS[i % COLS.length]); sp.style.setProperty('--vt', TINT[i % TINT.length]);
          sp.textContent = a.nodeValue; a.parentNode.replaceChild(sp, a); found[i] = 1; t = b; done = false; break;
        }
      }
    });
  }
  function hot(set) {
    document.querySelectorAll('#tgRail .vbox').forEach(function (b) { b.classList.toggle('hot', !!set[b.getAttribute('data-vi')]); });
  }
  var T = window.TGRAIL = {};
  T.clear = function () { document.body.classList.remove('tg-rail'); if (obs) { obs.disconnect(); obs = null; } };
  T.mark = function (root, words, hooks) {
    WORDS = words; HOOKS = hooks || {};
    if (!rail) { rail = document.createElement('aside'); rail.id = 'tgRail'; rail.setAttribute('aria-label', 'Words'); document.body.appendChild(rail); }
    var res = words.map(function (w) { return rx(w.w); }), all = {}, paras = root.querySelectorAll('.para');
    paras.forEach(function (p) {
      var found = {}; wrapIn(p, res, found);
      var ks = Object.keys(found); ks.forEach(function (k) { all[k] = 1; });
      p.setAttribute('data-vws', ks.join(','));
      var old = p.nextElementSibling; if (old && old.classList.contains('vstrip')) old.remove();
      if (ks.length) { var s = document.createElement('div'); s.className = 'vstrip'; s.innerHTML = ks.map(function (k) { return box(+k, words[k]); }).join(''); p.parentNode.insertBefore(s, p.nextSibling); }
    });
    var ids = Object.keys(all).map(Number).sort(function (a, b) { return a - b; });
    rail.innerHTML = '<h3>Words in this part</h3>' + (ids.length ? ids.map(function (k) { return box(k, words[k]); }).join('') : '<p style="margin:0;font-size:.9rem">No word-list words here.</p>');
    if (HOOKS.fill) { HOOKS.fill(rail); root.querySelectorAll('.vstrip').forEach(function (s) { HOOKS.fill(s); }); }
    document.body.classList.toggle('tg-rail', ids.length > 0);
    if (obs) obs.disconnect();
    var vis = {};
    obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { vis[e.target.getAttribute('data-pi')] = e.isIntersecting ? e.target.getAttribute('data-vws') : null; });
      var set = {}; Object.keys(vis).forEach(function (k) { if (vis[k]) vis[k].split(',').forEach(function (x) { if (x !== '') set[x] = 1; }); });
      hot(set);
    }, { rootMargin: '-15% 0px -25% 0px' });
    paras.forEach(function (p, i) { p.setAttribute('data-pi', i); obs.observe(p); });
  };

  /* ===================== T-503 PHRASE BOXES ===================== */
  var PH = [], PHK = {}, PU = 0, NOTED = {};
  var CODE = { 'Spanish': 'es', 'Chinese (Simplified)': 'zh', 'Arabic': 'ar', 'Vietnamese': 'vi', 'Thai': 'th', 'Nepali': 'ne' };
  var RTL = { 'Arabic': 1, 'Urdu': 1, 'Darija': 1 };
  var NOTE = {
    en: ['Close one or more boxes, or they will close automatically.', 'Don’t show this again'],
    es: ['Cierra una o más cajas, o se cerrarán automáticamente.', 'No mostrar esto otra vez'],
    zh: ['请关闭一个或多个框，否则它们会自动关闭。', '不再显示'],
    ar: ['أغلق مربعًا واحدًا أو أكثر، وإلا ستُغلق تلقائيًا.', 'لا تعرض هذا مرة أخرى'],
    vi: ['Hãy đóng một hoặc nhiều hộp, nếu không chúng sẽ tự động đóng.', 'Không hiện lại'],
    th: ['ปิดกล่องหนึ่งกล่องหรือมากกว่า ไม่อย่างนั้นกล่องจะปิดเอง', 'ไม่ต้องแสดงอีก'],
    ne: ['एक वा बढी बाकस बन्द गर्नुहोस्, नत्र ती आफैँ बन्द हुनेछन्।', 'यो फेरि नदेखाउनुहोस्']
  };
  var ARC = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M1 2 Q50 11 99 2' fill='none' stroke='%23e67e22' stroke-width='2.6' vector-effect='non-scaling-stroke' stroke-linecap='round'/%3E%3C/svg%3E\")";
  var css2 = '.ph{background:' + ARC + ' left bottom/100% 8px no-repeat;padding-bottom:7px;cursor:pointer;-webkit-box-decoration-break:clone;box-decoration-break:clone;border-radius:3px}' +
    '.ph.on{background-color:#fff4e6}.pw{border-radius:4px;transition:background .12s}.pw.hotw{background:#cfe8ff}' +
    '.pwrap{position:relative}.phcol{display:flex;flex-direction:column;gap:7px;position:relative}' +
    '@media (min-width:900px){.pwrap.hasph{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:14px;align-items:start}.pwrap.hasph>.para{margin-right:0}}' +
    '@media (max-width:899px){.phcol{flex-direction:row;flex-wrap:wrap;margin:-4px 0 12px}.phcol .phbox{flex:1 1 200px}}' +
    '.phbox{background:#fff;border:2px solid #e67e22;border-radius:12px;box-shadow:0 3px 0 #b35c0c;padding:7px 9px 8px;font-size:.95rem;line-height:1.4}' +
    '.phbox.peek{border-style:dashed;box-shadow:0 6px 18px rgba(0,0,0,.22);z-index:20}' +
    '@media (min-width:900px){.phbox.peek{position:absolute;left:0;right:0}}' +
    '.phbox.flash{animation:phf .9s 2}@keyframes phf{50%{background:#fff0d6}}' +
    '.phbox .phh{display:flex;align-items:center;gap:6px;font-weight:900;color:#a04d06}.phbox .phh b{flex:1}' +
    '.phbox .phx{border:2px solid #1c2640;background:#fff;border-radius:8px;font-weight:900;cursor:pointer;width:28px;height:28px;line-height:1;padding:0;font-size:.95rem}' +
    '.phbox.peek .phx{display:none}.phbox .pht{font-weight:700;font-size:1.02rem;margin-top:3px}.phbox .pht.none{color:#8a948f;font-weight:600}' +
    '.tm{border-radius:4px;padding:0 1px;transition:background .12s,color .12s}.tm.hotw{background:#2f6fbd;color:#fff}' +
    '.phnote{background:#fffbe6;border:2px solid #b8860b;border-radius:10px;padding:6px 8px;font-size:.88rem;font-weight:700}' +
    '.phnote .nt2{display:block;font-weight:600;margin-top:2px}.phnote label{display:flex;gap:6px;align-items:center;margin-top:5px;font-weight:600;cursor:pointer}' +
    '@media (prefers-reduced-motion:reduce){.phbox.flash{animation:none}}';
  var st2 = document.createElement('style'); st2.textContent = css2; document.head.appendChild(st2);
  function normW(t) { return String(t).toLowerCase().replace(/^[^\w’']+|[^\w’']+$/g, ''); }
  T.phrases = function (list, hooks) {
    PH = (list || []).map(function (x, i) { var o = {}; for (var k in x) o[k] = x[k]; o.words = x.p.split(' ').map(normW); o.i = i; return o; });
    PHK = hooks || {};
  };
  T.sent = function (s, esc, spkHTML) {
    var toks = String(s).split(' ').filter(function (t) { return t !== ''; }), nm = toks.map(normW), last = toks.length - 1;
    var taken = [], start = {}, end = {};
    PH.slice().sort(function (a, b) { return b.words.length - a.words.length; }).forEach(function (P) {
      var L = P.words.length;
      for (var i = 0; i + L <= toks.length; i++) {
        var ok = true; for (var j = 0; j < L; j++) if (nm[i + j] !== P.words[j] || taken[i + j]) { ok = false; break; }
        if (!ok) continue;
        for (j = 0; j < L; j++) taken[i + j] = { p: P.i, k: j };
        start[i] = P.i; end[i + L - 1] = 1; i += L - 1;
      }
    });
    var h = '<span class="sn" data-s="' + esc(s) + '">', nw = last;
    if (taken[last]) for (var q = last; q >= 0 && taken[q] && taken[q].p === taken[last].p && (q === last || !end[q]); q--) { nw = q; if (start[q] != null) break; }
    toks.forEach(function (t, i) {
      if (i === nw) h += '<span style="white-space:nowrap">';
      if (start[i] != null) h += '<span class="ph" data-ph="' + start[i] + '" data-pu="' + (++PU) + '">';
      var trail = '';
      if (taken[i]) {
        var lead = t.match(/^[^\w’']*/)[0]; trail = t.slice(lead.length).match(/[^\w’']*$/)[0];
        var core = t.slice(lead.length, t.length - trail.length);
        h += esc(lead) + '<span class="pw" data-k="' + taken[i].k + '">' + esc(core) + '</span>';
        if (!end[i]) { h += esc(trail); trail = ''; }
      } else h += esc(t);
      if (end[i]) h += '</span>' + esc(trail);
      if (i === last) h += (spkHTML ? spkHTML(s) : '') + '</span>';
      if (i < last) h += ' ';
    });
    return h + '</span>';
  };
  function phEsc(x) { return esc(x); }
  function trHTML(P, lg) {
    var c = CODE[lg], src = c && P[c];
    if (!src) return null;
    return src.replace(/\[([^\]|]*)\|([\d,]+)\]|([^\[]+)/g, function (_, txt, ks, plain) {
      return plain != null ? phEsc(plain) : '<span class="tm" data-ks="' + ks + '">' + phEsc(txt) + '</span>';
    });
  }
  function fillBox(b) {
    var P = PH[+b.getAttribute('data-ph')], lg = PHK.lang ? PHK.lang() : '', out = b.querySelector('.pht');
    out.setAttribute('dir', RTL[lg] ? 'rtl' : 'ltr');
    if (!lg) { out.className = 'pht none'; out.textContent = ''; return; }
    var h = trHTML(P, lg);
    if (h != null) { out.className = 'pht'; out.innerHTML = h; return; }
    out.className = 'pht none'; out.textContent = '…';
    if (PHK.tr) PHK.tr(P.p, lg, function (t) { if ((PHK.lang && PHK.lang()) !== lg) return; out.className = 'pht' + (t ? '' : ' none'); out.textContent = t || ''; });
  }
  function boxEl(ph, cls) {
    var P = PH[+ph.getAttribute('data-ph')], b = document.createElement('div');
    b.className = 'phbox ' + cls; b.setAttribute('data-ph', P.i); b.setAttribute('data-pu', ph.getAttribute('data-pu'));
    b.setAttribute('translate', 'no');
    b.innerHTML = '<div class="phh"><b>' + esc(P.p) + '</b>' + (PHK.spk ? PHK.spk(P.p) : '') + '<button type="button" class="phx" aria-label="Close">✕</button></div><div class="pht"></div>';
    fillBox(b); return b;
  }
  function colOf(ph) { var w = ph.closest('.pwrap'); return w ? w.querySelector('.phcol') : null; }
  function wide() { return window.matchMedia('(min-width:900px)').matches; }
  function maxOpen() { return window.matchMedia('(max-width:599px)').matches ? 3 : 6; }
  function pinned(col) { return col.querySelectorAll('.phbox.pin'); }
  function unpeek() {
    document.querySelectorAll('.phbox.peek').forEach(function (b) { b.remove(); });
    document.querySelectorAll('.ph.on').forEach(function (p) { if (!document.querySelector('.phbox.pin[data-pu="' + p.getAttribute('data-pu') + '"]')) p.classList.remove('on'); });
  }
  function flash(b) { b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); }
  function peek(ph) {
    var col = colOf(ph); if (!col) return;
    var u = ph.getAttribute('data-pu'), have = col.querySelector('.phbox.pin[data-pu="' + u + '"]');
    if (have) return;
    if (col.querySelector('.phbox.peek[data-pu="' + u + '"]')) return;
    unpeek();
    var b = boxEl(ph, 'peek');
    if (wide()) {
      var top = ph.getBoundingClientRect().top - col.getBoundingClientRect().top - 6;
      b.style.top = Math.max(0, top) + 'px'; col.appendChild(b);
    } else col.insertBefore(b, col.firstChild);
    ph.classList.add('on');
  }
  function note(col) {
    var lg = PHK.lang ? PHK.lang() : '', c = CODE[lg], n = document.createElement('div');
    n.className = 'phnote'; n.setAttribute('translate', 'no');
    n.innerHTML = esc(NOTE.en[0]) + '<span class="nt2" dir="' + (RTL[lg] ? 'rtl' : 'ltr') + '"></span><label><input type="checkbox"> <span>' + esc(NOTE.en[1]) + '</span> <span class="nt3"></span></label>';
    var t2 = n.querySelector('.nt2'), t3 = n.querySelector('.nt3');
    if (c && NOTE[c]) { t2.textContent = NOTE[c][0]; t3.textContent = '· ' + NOTE[c][1]; }
    else if (lg && PHK.tr) { PHK.tr(NOTE.en[0], lg, function (t) { t2.textContent = t || ''; }); PHK.tr(NOTE.en[1], lg, function (t) { if (t) t3.textContent = '· ' + t; }); }
    n.querySelector('input').addEventListener('change', function (e) { if (PHK.setNoteOff) PHK.setNoteOff(e.target.checked); });
    col.insertBefore(n, col.firstChild);
  }
  function pin(ph) {
    var col = colOf(ph); if (!col) return;
    var u = ph.getAttribute('data-pu'), have = col.querySelector('.phbox.pin[data-pu="' + u + '"]');
    unpeek();
    if (have) { flash(have); ph.classList.add('on'); return; }
    var b = boxEl(ph, 'pin'); col.appendChild(b); ph.classList.add('on');
    var pins = pinned(col), mx = maxOpen();
    while (pins.length > mx) { closeBox(pins[0]); pins = pinned(col); }
    var key = col.getAttribute('data-for');
    if (pins.length >= mx && !NOTED[key] && !(PHK.noteOff && PHK.noteOff())) { NOTED[key] = 1; note(col); }
    if (PHK.onOpen) PHK.onOpen(PH[+ph.getAttribute('data-ph')].p);
  }
  function closeBox(b) {
    var u = b.getAttribute('data-pu'), col = b.parentNode; b.remove();
    var ph = document.querySelector('.ph[data-pu="' + u + '"]'); if (ph) ph.classList.remove('on');
    if (col && pinned(col).length < maxOpen()) { var n = col.querySelector('.phnote'); if (n) n.remove(); }
  }
  function hotWord(u, ks, on) {
    document.querySelectorAll('.hotw').forEach(function (e) { e.classList.remove('hotw'); });
    if (!on) return;
    ks.forEach(function (k) {
      var w = document.querySelector('.ph[data-pu="' + u + '"] .pw[data-k="' + k + '"]'); if (w) w.classList.add('hotw');
      document.querySelectorAll('.phbox[data-pu="' + u + '"] .tm').forEach(function (t) {
        if (t.getAttribute('data-ks').split(',').indexOf(String(k)) >= 0) t.classList.add('hotw');
      });
    });
  }
  T.relang = function () { document.querySelectorAll('.phbox').forEach(fillBox); };
  function wrapParas(root) {
    root.querySelectorAll('.para').forEach(function (p) {
      if (!p.querySelector('.ph') || p.parentNode.classList.contains('pwrap')) return;
      var w = document.createElement('div'); w.className = 'pwrap hasph';
      p.parentNode.insertBefore(w, p); w.appendChild(p);
      var c = document.createElement('div'); c.className = 'phcol'; c.setAttribute('data-for', p.getAttribute('data-para') || ''); c.setAttribute('aria-live', 'polite'); w.appendChild(c);
    });
  }
  var _mark = T.mark;
  T.mark = function (root, words, hooks) {
    wrapParas(root);
    _mark(root, words, hooks);
    /* word strips go under the paragraph's wrapper, not inside it */
    root.querySelectorAll('.pwrap .vstrip').forEach(function (v) { var w = v.closest('.pwrap'); w.parentNode.insertBefore(v, w.nextSibling); });
  };
  document.addEventListener('mouseover', function (e) {
    if (!e.target.closest) return;
    var ph = e.target.closest('.ph');
    if (ph) { peek(ph); var pw = e.target.closest('.pw'); hotWord(ph.getAttribute('data-pu'), pw ? [pw.getAttribute('data-k')] : [], !!pw); return; }
    var tm = e.target.closest('.phbox .tm');
    if (tm) { hotWord(tm.closest('.phbox').getAttribute('data-pu'), tm.getAttribute('data-ks').split(','), true); return; }
    if (document.querySelector('.hotw')) hotWord('', [], false);
    if (!e.target.closest('.phbox')) unpeek();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var x = e.target.closest('.phx'); if (x) { closeBox(x.closest('.phbox')); return; }
    if (e.target.closest('button')) return;
    var ph = e.target.closest('.ph'); if (ph) pin(ph);
  });
  /* tap an underlined word: light its box (and the matching underlines) */
  document.addEventListener('click', function (e) {
    var v = e.target.closest && e.target.closest('.vw'); if (!v) return;
    var i = v.getAttribute('data-vi');
    document.querySelectorAll('.vbox[data-vi="' + i + '"]').forEach(function (b) {
      b.classList.add('hot', 'force'); setTimeout(function () { b.classList.remove('force'); }, 2200);
      if (b.closest('#tgRail')) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    document.querySelectorAll('.vw[data-vi="' + i + '"]').forEach(function (x) { x.classList.add('hot'); setTimeout(function () { x.classList.remove('hot'); }, 2200); });
  }, false);
})();
