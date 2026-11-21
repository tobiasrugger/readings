/* readings/thanksgiving/rail.js — T-502 (Nov 20 2026). Words from the Words step, underlined in the reading and listed in
   the right margin, like the Landlady rail (each word keeps one colour in the text and in its box; the boxes for the
   paragraph on screen light up; tapping an underlined word lights its box). Page font (Nunito), not Landlady's.
   Wide screens (≥1180 px): a fixed margin on the right. Narrower: a strip of word boxes under each paragraph.
   Used by thanksgiving/ (ELD 101) and thanksgiving-103/ (ELD 103).

   TGRAIL.mark(root, words, hooks)   root = element holding the .para paragraphs of one reading screen
     words = [{w, d}]                 hooks = {spk(text)->html, fill(el) (translations), say(text)}
   TGRAIL.clear()                     hide the margin (call when leaving a reading screen) */
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
