/* =====================================================================
   std.js — Galileo readings: the student page standard, enforced on
   every page. Loaded automatically by track.js (no page edits needed).

   1. Every student sign-in box gets a language dropdown (if it has none),
      with the last choice (vocab_lang) preselected. Start is blocked
      until a language is chosen.
   2. On Start, the choice is handed to the page's own language picker
      (whatever it calls the languages: "es", "Spanish", "Español"...)
      and saved as vocab_lang.
   3. Dropdown choices are always dark text on white (no more invisible
      options under a white-text picker).
   4. Plain browser dropdowns inside a sign-in box copy the look of that
      box's own text fields (rounded corners, padding, font).

   7. Listen + translate safety net: tap any word on a student page to hear it,
      see it in your language, and hear/translate its sentence or paragraph —
      only where the page doesn't already do this (see section 7 for opt-outs).

   5. Every "Hear it" button shows the speaker icon: 🔊 Hear it. So do
      "Listen" buttons that play sound (never an answer choice that just
      says "listen" — that is a vocabulary word in Unit 1).

   6. Stay signed in: a student who signed in on any activity in the last
      12 hours is recognised on the next one. The sign-in box fills itself
      in, shows "Signed in as <name> — Not <name>? Tap here", and walks
      straight through when nothing is left to type.
   7. Translation cache: every call to the Apps Script proxy checks the
      shared song_tr table first, so the second student to tap a word gets
      it instantly and the proxy is asked once per word per language.
      Rows: slug "dir" for directions (shared by all pages) and
      "tap:<page>" for words tapped on that page.

   Pages that already have a language dropdown in their sign-in box are
   left alone (only fixes 3, 4, 5, 6 and 7 apply). Safe to load twice.
   ===================================================================== */
(function () {
  if (window.__GAL_STD__) return;
  window.__GAL_STD__ = true;

  /* code, label shown, words that mean this language on other pickers */
  var LANGS = [
    ['es',    'Español',            'es|spanish|español|espanol'],
    ['zh-CN', '中文 (普通话)',        'zh-cn|zh|zh-hans|mandarin|chinese|中文|普通话|普通話'],
    ['yue',   '廣東話 (Cantonese)',   'yue|cantonese|廣東話|广东话|粵語|粤语|zh-hk|zh-hant'],
    ['ar',    'العربية',            'ar|arabic|العربية'],
    ['vi',    'Tiếng Việt',         'vi|vietnamese|tiếng việt|tieng viet'],
    ['th',    'ไทย',                'th|thai|ไทย'],
    ['ne',    'नेपाली',              'ne|nepali|नेपाली'],
    ['ary',   'الدارجة (Darija)',   'ary|darija|الدارجة|moroccan arabic'],
    ['ru',    'Русский',            'ru|russian|русский'],
    ['ur',    'اردو',               'ur|urdu|اردو'],
    ['tl',    'Tagalog',            'tl|tagalog|filipino|fil'],
    ['fr',    'Français',           'fr|french|français|francais'],
    ['ko',    '한국어',              'ko|korean|한국어'],
    ['hi',    'हिन्दी',               'hi|hindi|हिन्दी|हिंदी'],
    ['so',    'Soomaali',           'so|somali|soomaali']
  ];
  var LABEL = 'Your language / Tu idioma / 你的语言 / لغتك';

  function norm(s) { return String(s || '').trim().toLowerCase(); }
  function aliases(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i][2].split('|');
    return [norm(code)];
  }
  /* which of our codes does an option (value or text) mean? */
  function codeOf(val, text) {
    var v = norm(val), t = norm(text);
    for (var i = 0; i < LANGS.length; i++) {
      var a = LANGS[i][2].split('|');
      for (var j = 0; j < a.length; j++) {
        if (v === a[j] || t === a[j]) return LANGS[i][0];
      }
      for (var k = 0; k < a.length; k++) {
        if (a[k].length > 2 && (t.indexOf(a[k]) >= 0)) return LANGS[i][0];
      }
    }
    return '';
  }
  function looksLikeLangSelect(sel) {
    if (/lang/i.test((sel.id || '') + ' ' + (sel.name || ''))) return true;
    var n = 0;
    for (var i = 0; i < sel.options.length; i++) if (codeOf(sel.options[i].value, sel.options[i].text)) n++;
    return n >= 3;
  }
  function stored() { try { return localStorage.getItem('vocab_lang') || ''; } catch (e) { return ''; } }
  function store(code) { try { localStorage.setItem('vocab_lang', code); } catch (e) {} }

  /* ---------- 3. options always readable ---------- */
  /* ---------- 6. hide the "Find your name" roster on every sign-in box ----------
     Oct 18 2026, Toby: students saw it first, assumed they had to use it, and some
     names appear twice. Typing name + email is the path we want. This is a HIDE,
     not a delete: the roster markup (#grosterwrap / select#groster) stays in every
     page, so set HIDE_ROSTER to false here to bring it back everywhere at once.
     The !important beats pages (vocab.js, the reel engine) that show it with
     style.display = '' once the roster loads. */
  var HIDE_ROSTER = true;
  var ROSTER_CSS = HIDE_ROSTER ? '#grosterwrap{display:none !important}' : '';

  var WHO_CSS = '.gal-std-who{font-size:14px;font-weight:700;margin:8px 0;line-height:1.5}' +
    '.gal-std-notme{font:inherit;font-size:13px;font-weight:700;background:none;border:0;padding:0;' +
    'text-decoration:underline;cursor:pointer;color:inherit;opacity:.85}';
  function addCSS() {
    if (document.getElementById('gal-std-css')) return;
    var st = document.createElement('style');
    st.id = 'gal-std-css';
    st.textContent =
      'select option,select optgroup{color:#2b2233 !important;background-color:#fff !important}' +
      '.gal-std-lang-msg{color:#c0392b;font-weight:800;font-size:.9em;margin:4px 0 0;min-height:1.2em}' +
      WHO_CSS + ROSTER_CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---------- 4. match a dropdown to the box's text fields ---------- */
  var COPY = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle', 'borderColor',
              'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontFamily', 'fontSize',
              'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'width', 'boxSizing', 'marginTop', 'marginBottom'];
  function matchLook(sel, field) {
    if (!field || sel.getAttribute('data-gal-styled')) return;
    var fs = getComputedStyle(field), ss = getComputedStyle(sel);
    /* already styled like the fields? leave it */
    if (ss.borderRadius === fs.borderRadius && ss.paddingLeft === fs.paddingLeft && ss.fontSize === fs.fontSize) return;
    for (var i = 0; i < COPY.length; i++) sel.style[COPY[i]] = fs[COPY[i]];
    if (fs.width && fs.width !== 'auto') sel.style.width = field.style.width || '100%';
    sel.style.height = 'auto';
    sel.style.cursor = 'pointer';
    sel.setAttribute('data-gal-styled', '1');
  }

  /* ---------- 2. hand the language to the page's own picker ---------- */
  function handOff(code, box) {
    if (!code) return;
    store(code);
    var want = aliases(code), sels = document.querySelectorAll('select');
    for (var i = 0; i < sels.length; i++) {
      var s = sels[i];
      if (box && box.contains(s)) continue;
      if (!looksLikeLangSelect(s)) continue;
      for (var j = 0; j < s.options.length; j++) {
        var o = s.options[j];
        if (codeOf(o.value, o.text) === code || want.indexOf(norm(o.value)) >= 0) {
          if (s.value !== o.value) {
            s.value = o.value;
            s.dispatchEvent(new Event('input', { bubbles: true }));
            s.dispatchEvent(new Event('change', { bubbles: true }));
          }
          break;
        }
      }
    }
  }

  /* ---------- 1. find sign-in boxes and give them a language dropdown ---------- */
  function startButton(box) {
    var bs = box.querySelectorAll('button, input[type=submit]'), best = null;
    for (var i = 0; i < bs.length; i++) {
      var t = (bs[i].textContent || bs[i].value || '');
      if (/start|sign|log ?in|enter|go|begin|continue|let.?s|empez|开始/i.test(t)) return bs[i];
      best = bs[i];
    }
    return best;
  }
  function boxFor(email) {
    var b = email;
    for (var i = 0; i < 8 && b; i++) {
      b = b.parentElement;
      if (b && b.querySelector('button, input[type=submit]')) return b;
    }
    return null;
  }
  function childOf(box, el) { while (el && el.parentElement !== box) el = el.parentElement; return el; }
  function shown(el) { return !!(el && el.offsetParent !== null && el.getBoundingClientRect().width > 0); }
  /* the field to copy the look from: a visible text box, else a visible styled dropdown */
  function lookSource(box, email) {
    var c = box.querySelectorAll('input[type=email], input[type=text], input:not([type]), select');
    for (var i = 0; i < c.length; i++) {
      if (c[i].id === 'galStdLang' || !shown(c[i])) continue;
      if (c[i].tagName === 'INPUT' || parseFloat(getComputedStyle(c[i]).borderRadius) > 0) return c[i];
    }
    return email;
  }
  function labelSource(box) {
    var ls = box.querySelectorAll('label');
    for (var i = 0; i < ls.length; i++) if (shown(ls[i]) && !ls[i].classList.contains('gal-std-label')) return ls[i];
    return null;
  }
  var LCOPY = ['fontWeight', 'fontSize', 'fontFamily', 'color', 'letterSpacing', 'textTransform', 'marginBottom', 'marginTop'];


  /* ========== shared session: signed in once, signed in everywhere ==========
     Written by any page that signs a student in (here, or by the page's own
     code where it already does this). Read by every page for 12 hours. */
  var SESSION_HOURS = 12;
  function sess() {
    try {
      var at = +(localStorage.getItem('gal_student_at') || 0);
      var email = localStorage.getItem('gal_student_email') || '';
      if (!email || !at || Date.now() - at > SESSION_HOURS * 3600 * 1000) return null;
      return {
        email: email,
        name: localStorage.getItem('gal_student_name') || '',
        period: localStorage.getItem('gal_student_period') || ''
      };
    } catch (e) { return null; }
  }
  function remember(name, email, period) {
    try {
      if (email) localStorage.setItem('gal_student_email', email);
      if (name) localStorage.setItem('gal_student_name', name);
      if (period) localStorage.setItem('gal_student_period', period);
      localStorage.setItem('gal_student_at', String(Date.now()));
    } catch (e) {}
  }
  function forget() {
    try {
      ['gal_student_email','gal_student_name','gal_student_period','gal_student_at']
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }
  /* which field is which, by id, name, placeholder, type and label */
  function fieldKind(el, box) {
    var hay = [el.id, el.name, el.placeholder, el.getAttribute('aria-label') || ''].join(' ').toLowerCase();
    var lab = box.querySelector('label[for="' + el.id + '"]');
    if (lab) hay += ' ' + (lab.textContent || '').toLowerCase();
    if (el.type === 'email' || /mail/.test(hay)) return 'email';
    if (/period|\bper\b|gper|class/.test(hay)) return 'period';
    /* a dropdown labelled "find your name" is a roster, not the name box */
    if (/name/.test(hay)) return el.tagName === 'SELECT' ? '' : 'name';
    return '';
  }
  /* display:none on the field or any wrapper up to the box */
  function hiddenByStyle(el, box) {
    for (var n = el; n && n !== box.parentElement; n = n.parentElement) {
      if (n.style && /none/i.test(n.style.display || '')) return true;
    }
    return false;
  }
  function fillFrom(box, s) {
    var els = box.querySelectorAll('input, select'), left = 0, filled = {};
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.id === 'galStdLang' || el.type === 'password' || el.type === 'hidden') continue;
      if (hiddenByStyle(el, box)) continue;        /* a field the page is not showing yet */
      var kind = fieldKind(el, box);
      if (kind && !el.value) {
        var v = s[kind];
        if (v) {
          if (el.tagName === 'SELECT') {
            for (var o = 0; o < el.options.length; o++) {
              var ot = (el.options[o].value || '') + ' ' + (el.options[o].textContent || '');
              if (ot.replace(/[^0-9a-z]/gi, '').toLowerCase().indexOf(String(v).replace(/[^0-9a-z]/gi, '').toLowerCase()) >= 0 && String(v)) {
                el.value = el.options[o].value; break;
              }
            }
          } else { el.value = v; }
          try { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        }
      }
      if (kind) { filled[kind] = !!el.value; if (!el.value) left++; }
      /* anything else in the box (a roster list, a level, a class picker) is
         the page's own business — an empty one must not hold a student up */
    }
    return { left: left, have: filled };
  }
  function whoLine(box, s, sel, btn) {
    if (box.querySelector('.gal-std-who')) return;
    var first = (s.name || '').split(' ')[0] || 'you';
    var d = document.createElement('div');
    d.className = 'gal-std-who';
    d.setAttribute('translate', 'no');
    d.innerHTML = 'Signed in as <b></b>' + (s.period ? ' \u00b7 Period ' + s.period : '') +
      ' \u2014 <button type="button" class="gal-std-notme">Not ' + first + '? Tap here</button>';
    d.querySelector('b').textContent = s.name || s.email;
    d.querySelector('.gal-std-notme').addEventListener('click', function () {
      forget();
      var els = box.querySelectorAll('input, select');
      for (var i = 0; i < els.length; i++) {
        if (els[i].id === 'galStdLang' || !shown(els[i])) continue;
        if (fieldKind(els[i], box)) els[i].value = '';
      }
      d.remove();
      var f = box.querySelector('input');
      if (f) f.focus();
    });
    var anchor = childOf(box, btn) || btn;
    anchor.parentNode.insertBefore(d, anchor);
  }
  /* remember whoever signs in through this box, however the page handles it */
  function watchSignIn(box, btn) {
    if (btn.getAttribute('data-gal-sess')) return;
    btn.setAttribute('data-gal-sess', '1');
    btn.addEventListener('click', function () {
      setTimeout(function () {
        var els = box.querySelectorAll('input, select'), got = {};
        for (var i = 0; i < els.length; i++) {
          var k = fieldKind(els[i], box);
          if (k && els[i].value) got[k] = els[i].value.trim();
        }
        if (got.email) remember(got.name, got.email, got.period);
      }, 60);
    }, false);
  }
  function resume(box, btn) {
    var s = sess();
    if (!s) { watchSignIn(box, btn); return; }
    watchSignIn(box, btn);
    tryResume(box, btn, s);
    /* a language picker added after us (the mirror block, or a page engine)
       should still count — look again a couple of times */
    setTimeout(function () { tryResume(box, btn, s); }, 1200);
    setTimeout(function () { tryResume(box, btn, s); }, 2600);
  }
  function tryResume(box, btn, s) {
    if (box.getAttribute('data-gal-walked')) return;
    /* a language picker in the box starts on the last language they chose */
    var prev = stored();
    if (prev) {
      var ls = box.querySelectorAll('select');
      for (var i = 0; i < ls.length; i++) {
        if (!looksLikeLangSelect(ls[i]) && ls[i].id !== 'galStdLang' && ls[i].id !== 'gate-lang') continue;
        if (ls[i].value) continue;
        for (var o = 0; o < ls[i].options.length; o++) {
          var ov = ls[i].options[o].value, ot = ls[i].options[o].textContent || '';
          if (!ov) continue;
          if (codeOf(ov, ot) === codeOf(prev, prev)) { ls[i].value = ov; break; }
        }
        if (ls[i].value) { try { ls[i].dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} }
      }
    }
    var r = fillFrom(box, s);
    whoLine(box, s, null, btn);
    /* name, email and period known, and a language chosen? walk straight in.
       Other fields in the box are left as the page set them. */
    var lang = box.querySelector('#galStdLang');
    var langOK = !lang || !!lang.value;
    if (r.left === 0 && r.have.email && langOK && !box.getAttribute('data-gal-walked')) {
      box.setAttribute('data-gal-walked', '1');
      setTimeout(function () { if (shown(btn)) btn.click(); }, 400);
    }
  }

  /* ========== translation cache (song_tr) ==========
     Wraps fetch so any page that calls the proxy gets the cached answer
     first. One row per word per language, shared by every student. */
  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var PAGE_SLUG = 'tap:' + (location.pathname.replace(/^\/readings\//, '').replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '') || 'root');
  var tcache = {}, loadedLang = {};
  function hdr(pref) {
    var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };
    if (pref) h.Prefer = pref;
    return h;
  }
  function ckey(slug, src, lg) { return slug + '|' + src + '|' + lg; }
  function cacheLoad(lg) {
    if (!lg || loadedLang[lg]) return Promise.resolve();
    loadedLang[lg] = true;
    return fetch(SUPA_URL + '/rest/v1/song_tr?select=slug,src,equiv,meaning&lang=eq.' +
        encodeURIComponent(lg) + '&or=(slug.eq.dir,slug.eq.' + encodeURIComponent(PAGE_SLUG) + ')', { headers: hdr() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        (rows || []).forEach(function (r) {
          var v = r.equiv || r.meaning || '';
          if (v) tcache[ckey(r.slug, r.src, lg)] = v;
        });
      }).catch(function () {});
  }
  function cacheSave(slug, src, lg, val) {
    if (!val) return;
    fetch(SUPA_URL + '/rest/v1/song_tr?on_conflict=slug,lang,src', {
      method: 'POST', headers: hdr('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify([{ slug: slug, lang: lg, src: src, equiv: val, meaning: '', note: '', updated_at: new Date().toISOString() }])
    }).catch(function () {});
  }
  /* a cached answer in the shape every caller expects */
  function fakeRes(equiv) {
    var body = JSON.stringify({ ok: true, translation: { equiv: equiv, meaning: '', note: '' } });
    if (typeof Response === 'function') {
      try { return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }); } catch (e) {}
    }
    return {
      ok: true, status: 200, headers: { get: function () { return 'application/json'; } },
      json: function () { return Promise.resolve(JSON.parse(body)); },
      text: function () { return Promise.resolve(body); },
      clone: function () { return fakeRes(equiv); }
    };
  }
  function wrapFetch() {
    if (!window.fetch || window.__GAL_TRWRAP__) return;
    window.__GAL_TRWRAP__ = true;
    var real = window.fetch;
    window.fetch = function (input, init) {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (url.indexOf('script.google.com') < 0 || url.indexOf('action=translate') < 0) return real.apply(this, arguments);
      var q = {};
      url.replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) { q[k] = decodeURIComponent(v.replace(/\+/g, ' ')); return ''; });
      var src = q.idiom || '', lg = q.lang || '';
      if (!src || !lg) return real.apply(this, arguments);
      var slug = q.meaning ? PAGE_SLUG : 'dir';
      var hit = tcache[ckey(slug, src, lg)] || tcache[ckey('dir', src, lg)] || tcache[ckey(PAGE_SLUG, src, lg)];
      if (hit) return Promise.resolve(fakeRes(hit));
      var args = arguments, self = this;
      return cacheLoad(lg).then(function () {
        var again = tcache[ckey(slug, src, lg)] || tcache[ckey('dir', src, lg)];
        if (again) return fakeRes(again);
        return real.apply(self, args).then(function (res) {
          try {
            var clone = res.clone();
            clone.json().then(function (d) {
              var t = d && d.translation ? (d.translation.equiv || d.translation.meaning || '') : '';
              if (t) { tcache[ckey(slug, src, lg)] = t; cacheSave(slug, src, lg, t); }
            }).catch(function () {});
          } catch (e) {}
          return res;
        });
      });
    };
  }
  /* as soon as a language is known, pull that language's rows */
  function warm() {
    var lg = stored();
    if (lg) cacheLoad(lg);
  }

  function fixBox(email) {
    var box = boxFor(email);
    if (!box) return;
    box.setAttribute('data-gal-std', '1');
    /* teacher screens (password box, dashboards) are not student sign-ins */
    if (box.querySelector('input[type=password]') || /dashboard|teacher/i.test(location.pathname)) return;

    /* restyle plain dropdowns already in the box (period, roster...) */
    var own = box.querySelectorAll('select'), haveLang = null, src = lookSource(box, email);
    for (var i = 0; i < own.length; i++) {
      matchLook(own[i], src);
      if (looksLikeLangSelect(own[i])) haveLang = own[i];
    }
    var btn0 = startButton(box);
    if (haveLang && haveLang.id !== 'galStdLang') {              /* page already does it right */
      if (btn0) resume(box, btn0);
      return;
    }

    var btn = btn0;
    if (!btn) return;
    if (haveLang) { guardButton(btn, box, haveLang); resume(box, haveLang === null ? btn : btn); return; }   /* ours is still here */

    var wrap = document.createElement('div');
    wrap.className = 'gal-std-lang';
    var lab = document.createElement('label');
    var anyLabel = labelSource(box);
    if (anyLabel) {
      lab.className = anyLabel.className;
      var lcs = getComputedStyle(anyLabel);
      for (var m = 0; m < LCOPY.length; m++) lab.style[LCOPY[m]] = lcs[LCOPY[m]];
    }
    lab.classList.add('gal-std-label');
    lab.setAttribute('translate', 'no');
    lab.textContent = LABEL;
    lab.style.display = 'block';
    var sel = document.createElement('select');
    sel.id = 'galStdLang';
    sel.setAttribute('translate', 'no');
    sel.className = src.className || '';
    var h = '<option value="">Choose your language</option>';
    for (var k = 0; k < LANGS.length; k++) h += '<option value="' + LANGS[k][0] + '">' + LANGS[k][1] + '</option>';
    sel.innerHTML = h;
    var prev = stored();
    if (prev) { var c = codeOf(prev, prev) || prev; sel.value = c; }
    lab.htmlFor = sel.id;
    var msg = document.createElement('div');
    msg.className = 'gal-std-lang-msg';
    wrap.appendChild(lab); wrap.appendChild(sel); wrap.appendChild(msg);

    var anchor = childOf(box, btn) || btn;
    anchor.parentNode.insertBefore(wrap, anchor);
    matchLook(sel, src);
    if (shown(src)) sel.style.width = src.getBoundingClientRect().width + 'px';
    sel.style.maxWidth = '100%';
    sel.addEventListener('change', function () {
      msg.textContent = '';
      try { localStorage.setItem('vocab_lang', sel.value); } catch (e) {}
      cacheLoad(sel.value);                     /* warm the cache the moment they choose */
    });
    guardButton(btn, box, sel);
    resume(box, btn);
  }

  /* Start does nothing until a language is chosen; then the choice is handed off */
  function guardButton(btn, box, sel) {
    if (btn.__galStdGuard) return;
    btn.__galStdGuard = true;
    function guard(e) {
      var cur = box.querySelector('#galStdLang') || sel;
      var msg = box.querySelector('.gal-std-lang-msg');
      if (cur.value) { handOff(cur.value, box); later(cur.value, box); return; }
      e.preventDefault(); e.stopImmediatePropagation();
      if (msg) msg.textContent = 'Please choose your language.';
      cur.focus();
    }
    btn.addEventListener('click', guard, true);
    if (!box.__galStdKeys) {
      box.__galStdKeys = true;
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target && e.target.tagName !== 'TEXTAREA') guard(e);
      }, true);
    }
  }
  /* pages often build or reset their picker after sign-in, so hand off again */
  function later(code, box) {
    setTimeout(function () { handOff(code, box); }, 250);
    setTimeout(function () { handOff(code, box); }, 1200);
    setTimeout(function () { handOff(code, box); }, 3000);
  }

  /* ---------- 5. 🔊 on every Hear it button ---------- */
  var HEAR = /^(hear it|hear|hear it again|hear again)$/i,
      LISTEN = /^(listen|listen again)$/i,
      SOUNDY = /spk|speak|say|audio|listen|play|voice|tts|sound/i;
  function speakerIcons() {
    var bs = document.querySelectorAll('button, [role=button], a.btn, .spk');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      if (b.__galSpk) continue;
      var t = (b.textContent || '').trim();
      if (!t || t.indexOf('🔊') >= 0 || t.indexOf('🔈') >= 0 || t.indexOf('🔉') >= 0) { continue; }
      var hint = (b.className || '') + ' ' + (b.id || '') + ' ' + (b.title || '') + ' ' +
                 (b.getAttribute('aria-label') || '') + ' ' + (b.getAttribute('onclick') || '');
      if (HEAR.test(t) || (LISTEN.test(t) && SOUNDY.test(hint))) {
        b.__galSpk = true;
        b.insertBefore(document.createTextNode('🔊 '), b.firstChild);
      }
    }
  }

  /* ========== 7. listen + translate safety net (T-67, Oct 19 2026) ==========
     On any student page, tapping a word opens a small card: the word with 🔊,
     its translation, and buttons to hear or translate the whole sentence and
     hear the whole paragraph. It exists for pages that forgot to offer this,
     so it stays out of the way everywhere else:
       - page opt-out:    <html data-no-listen> or <body data-no-listen>,
                          or window.GAL_NO_LISTEN = true
       - auto opt-out:    pages running the Launch Plus tap-words engine (#wtip),
                          teacher pages (dashboard, gradebook, assign, reports…)
       - element opt-out: anything inside [data-no-listen]; buttons, links,
                          inputs, labels, anything with a pointer cursor; the
                          sign-in box; pop-ups; words the page already made
                          tappable (.w, .tword, .tapline, [data-w]…)
       - yield:           ~0.2s after a tap, if the page itself started speaking
                          or opened its own pop-up, this does nothing.
     A lone "I" is always spoken as "eye", never "capital I". */
  var LISTEN_PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
  var TEACHER_PATH = /dashboard|teacher|gradebook|roadmap|\/assign|\/reports|\/audit|admin/i;
  var OWN_TAP = '.w, .tw, .tword, .tapline, .qw, [data-w], [data-tap], .tapword, .tap-word, .vw, .gl, .gw';
  var NO_GO = 'a, button, input, select, textarea, label, option, summary, [role=button], [role=tab], ' +
              '[contenteditable], [onclick], [data-no-listen], [data-gal-std], #gate, .gate, ' +
              '.pop, #galListenPop, .gal-listen-hint, svg, img, video, audio, canvas';
  var POPLIKE = /(^|[\s_-])(pop|popup|tip|tooltip|bubble|gloss|wtip|trpop)([\s_-]|$)/i;

  function listenOff() {
    var h = document.documentElement, b = document.body;
    if (window.GAL_NO_LISTEN || (h && h.hasAttribute('data-no-listen')) || (b && b.hasAttribute('data-no-listen'))) return true;
    if (TEACHER_PATH.test(location.pathname)) return true;
    if (document.getElementById('wtip')) return true;                 /* Launch Plus engine has its own */
    return false;
  }
  function speakEn(text, rate) {
    if (!window.speechSynthesis || !text) return;
    var t = String(text);
    /* T-87: never read emoji aloud (a 🌍 was spoken "globe showing Europe-Africa").
       Same strip as the Holidays/Monsters engine: flags, then pictographs, then
       variation selectors / joiners / keycaps, then collapse the spaces left behind. */
    try {
      t = t.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
           .replace(/\p{Extended_Pictographic}/gu, '')
           .replace(/[\uFE0F\u200D\u20E3]/g, '');
    } catch (e) {}                                                     /* very old browser: speak as before */
    t = t.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
    if (!t) return;
    t = t.replace(/\bI\b(?![\u2019'])/g, 'eye');                       /* "I" -> "eye" */
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t);
    u.lang = 'en-US'; u.rate = rate || 0.85;
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)US/i.test(v.lang); });
    if (vs.length) u.voice = vs[0];
    u.__galListen = true;
    speechSynthesis.speak(u);
  }
  function listenLang() {
    var v = stored();
    if (!v) { var p = document.getElementById('lang') || document.getElementById('langSel'); if (p && p.value && p.value !== 'none') v = p.value; }
    return v ? (codeOf(v, v) || v) : '';
  }
  /* T-94 (Oct 22 2026): the proxy can hang. Every request now has a 10 s timeout and
     2 retries; cb(value, failed, attempt). failed = true means "nothing came back at all"
     (the card then offers "Tap to try again"); an empty value with failed = false means the
     proxy answered but had no translation (the card shows the English word in grey). */
  var TR_TIMEOUT = 10000, TR_TRIES = 3;
  function trURL(text, mode, lg) {
    return LISTEN_PROXY + '?action=translate&mode=' + mode + '&idiom=' + encodeURIComponent(text) +
           '&meaning=&lang=' + encodeURIComponent(lg);
  }
  function fetchJSONTimed(u, ms) {
    return new Promise(function (resolve, reject) {
      var done = false, ctl = window.AbortController ? new AbortController() : null;
      var tm = setTimeout(function () {
        if (done) return; done = true; try { if (ctl) ctl.abort(); } catch (e) {}
        reject(new Error('timeout'));
      }, ms);
      fetch(u, ctl ? { signal: ctl.signal } : undefined)
        .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
        .then(function (d) { if (done) return; done = true; clearTimeout(tm); resolve(d); },
              function (e) { if (done) return; done = true; clearTimeout(tm); reject(e); });
    });
  }
  function trValue(d) {
    var tr = d && d.translation, v = '';
    if (tr && typeof tr === 'object') v = tr.equiv || tr.meaning || '';
    else if (typeof tr === 'string') v = tr;
    return String(v || '').trim();
  }
  function proxyTranslate(text, mode, cb) {
    var lg = listenLang(); if (!lg) { cb(null, false, 0); return; }
    var u = trURL(text, mode, lg), attempt = 0;
    (function go() {
      attempt++;
      if (attempt > 1) cb(undefined, false, attempt);            /* tells the card "still trying" */
      fetchJSONTimed(u, TR_TIMEOUT).then(function (d) { cb(trValue(d), false, attempt); },
        function () { if (attempt < TR_TRIES) go(); else cb('', true, attempt); });
    })();
  }
  /* T-94 warm-up: once a language is known, quietly ask for the words on screen, a few at a
     time, so most taps are instant. Each request goes through the song_tr cache wrapper, so a
     word any student already looked up costs nothing, and a new one is saved for everyone. */
  var WARM_MAX = 80, WARM_AT_ONCE = 3, warmQ = [], warmSeen = {}, warmBusy = 0, warmSent = 0, warmLang = '';
  var WARM_SKIP = /^(the|and|but|for|you|your|are|was|were|has|have|had|this|that|with|from|they|them|their|she|her|his|him|its|our|not|can|will|all|any|one|two|who|what|when|how|why|yes|did|does|too|very|into|out|then|than|there|here|about)$/i;
  function warmPump() {
    while (warmBusy < WARM_AT_ONCE && warmQ.length && warmSent < WARM_MAX) {
      var w = warmQ.shift(), lg = listenLang(); if (!lg || lg !== warmLang) { warmQ = []; return; }
      warmBusy++; warmSent++;
      fetchJSONTimed(trURL(w, 'word', lg), TR_TIMEOUT).then(function () {}, function () {})
        .then(function () { warmBusy--; setTimeout(warmPump, 150); });
    }
  }
  function warmVisible() {
    if (listenOff()) return;
    var lg = listenLang(); if (!lg) return;
    if (lg !== warmLang) { warmLang = lg; warmSeen = {}; warmQ = []; warmSent = 0; }
    if (warmSent >= WARM_MAX) return;
    var vh = window.innerHeight, walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, added = 0;
    while ((n = walker.nextNode()) && added < 40) {
      var el = n.parentElement; if (!el || !/[A-Za-z]{3}/.test(n.data)) continue;
      if (el.closest(NO_GO) || el.closest(OWN_TAP) || el.closest('script,style,noscript')) continue;
      var r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > vh) continue;
      var m = n.data.match(/[A-Za-z][A-Za-z'\u2019-]{2,}/g) || [];
      for (var i = 0; i < m.length && added < 40; i++) {
        var w = m[i].replace(/^['\u2019-]+|['\u2019-]+$/g, '');
        if (w.length < 3 || WARM_SKIP.test(w) || warmSeen[w]) continue;
        warmSeen[w] = 1; warmQ.push(w); added++;
      }
    }
    warmPump();
  }
  function blockOf(node) {
    var el = node.nodeType === 3 ? node.parentElement : node;
    while (el && el !== document.body) {
      var d = getComputedStyle(el).display;
      if (d && d !== 'inline' && d !== 'contents') return el;
      el = el.parentElement;
    }
    return el;
  }
  /* the word, sentence and paragraph under a tap point, or null if the tap missed the text */
  function textAt(x, y) {
    var r = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
    if (!r && document.caretPositionFromPoint) {
      var cp = document.caretPositionFromPoint(x, y);
      if (cp) { r = document.createRange(); r.setStart(cp.offsetNode, cp.offset); }
    }
    if (!r || !r.startContainer || r.startContainer.nodeType !== 3) return null;
    var node = r.startContainer, s = node.data, i = r.startOffset;
    var isW = function (ch) { return /[A-Za-z\u00C0-\u024F'\u2019-]/.test(ch); };
    var a = i, b = i;
    while (a > 0 && isW(s.charAt(a - 1))) a--;
    while (b < s.length && isW(s.charAt(b))) b++;
    var word = s.slice(a, b).replace(/^['\u2019-]+|['\u2019-]+$/g, '');
    if (!/[A-Za-z]/.test(word)) return null;
    var wr = document.createRange(); wr.setStart(node, a); wr.setEnd(node, b);
    var rect = wr.getBoundingClientRect();
    if (x < rect.left - 3 || x > rect.right + 3 || y < rect.top - 3 || y > rect.bottom + 3) return null;
    var blk = blockOf(node);
    var para = (blk && (blk.innerText || blk.textContent) || '').replace(/\s+/g, ' ').trim();
    /* where the word sits inside the paragraph text, to pick its sentence */
    var pre = document.createRange();
    try { pre.setStart(blk, 0); pre.setEnd(node, a); } catch (e) {}
    var off = pre.toString().replace(/\s+/g, ' ').length;
    var sents = para.match(/[^.!?]+[.!?]*["\u201d']?\s*/g) || [para], acc = 0, sent = para;
    for (var k = 0; k < sents.length; k++) { if (off < acc + sents[k].length) { sent = sents[k].trim(); break; } acc += sents[k].length; }
    return { word: word, sentence: sent, paragraph: para, rect: rect };
  }
  function visiblePopups() {
    var n = 0, els = document.querySelectorAll('[class], [id]');
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.id === 'galListenPop' || e.classList.contains('gal-listen-hint')) continue;
      if (!POPLIKE.test((e.className && e.className.baseVal === undefined ? e.className : '') + ' ' + e.id)) continue;
      /* fixed-position pop-ups have no offsetParent, so test the box itself */
      var cs = getComputedStyle(e);
      if (e.getClientRects().length && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0') n++;
    }
    return n;
  }
  function closeListen() { var p = document.getElementById('galListenPop'); if (p) p.remove(); }
  function openListen(t) {
    closeListen();
    var p = document.createElement('div');
    p.id = 'galListenPop'; p.setAttribute('translate', 'no'); p.setAttribute('data-no-listen', '');
    var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    p.innerHTML =
      '<div class="gl-top"><b class="gl-word">' + esc(t.word) + '</b>' +
      '<button type="button" class="gl-b" data-act="w" aria-label="Hear the word">\uD83D\uDD0A</button></div>' +
      '<div class="gl-tr"></div>' +
      '<div class="gl-row">' +
        '<button type="button" class="gl-b" data-act="s">\uD83D\uDD0A Sentence</button>' +
        '<button type="button" class="gl-b" data-act="st">\uD83C\uDF10 Sentence</button>' +
        (t.paragraph.length > t.sentence.length + 2 ? '<button type="button" class="gl-b" data-act="p">\uD83D\uDD0A Paragraph</button>' : '') +
      '</div><div class="gl-str"></div>';
    document.body.appendChild(p);
    var x = Math.min(window.innerWidth - p.offsetWidth - 8, Math.max(8, t.rect.left));
    var y = t.rect.bottom + 8;
    if (y + p.offsetHeight > window.innerHeight - 8) y = Math.max(8, t.rect.top - p.offsetHeight - 8);
    p.style.left = x + 'px'; p.style.top = y + 'px';
    var trBox = p.querySelector('.gl-tr');
    warmSeen[t.word] = 1;                                           /* the warmer leaves this word to the card */
    function showWord() {
      trBox.innerHTML = '<span class="gl-wait">Translating\u2026</span>';
      proxyTranslate(t.word, 'word', function (v, failed, attempt) {
        if (v === undefined) { trBox.innerHTML = '<span class="gl-wait">Still translating\u2026</span>'; return; }
        if (failed) { trBox.innerHTML = '<button type="button" class="gl-b gl-retry" data-act="rw">\u21bb Tap to try again</button>'; return; }
        if (v) trBox.innerHTML = '<b class="gl-eq">' + esc(v) + '</b>';
        else trBox.innerHTML = '<b class="gl-eq gl-grey">' + esc(t.word) + '</b>';
      });
    }
    function showSentence() {
      var box = p.querySelector('.gl-str');
      if (!listenLang()) { box.textContent = 'Choose your language at sign-in first.'; return; }
      box.innerHTML = '<span class="gl-wait">Translating\u2026</span>';
      proxyTranslate(t.sentence, 'sentence', function (v, failed) {
        if (v === undefined) { box.innerHTML = '<span class="gl-wait">Still translating\u2026</span>'; return; }
        if (failed) { box.innerHTML = '<button type="button" class="gl-b gl-retry" data-act="rs">\u21bb Tap to try again</button>'; return; }
        box.textContent = v || 'No translation came back. Tap again.';
      });
    }
    if (!listenLang()) trBox.innerHTML = '<span class="gl-none">Choose your language at sign-in to see a translation.</span>';
    else showWord();
    p.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
      e.stopPropagation();
      var act = b.getAttribute('data-act');
      if (act === 'w') speakEn(t.word, 0.75);
      else if (act === 's') speakEn(t.sentence);
      else if (act === 'p') speakEn(t.paragraph);
      else if (act === 'st' || act === 'rs') showSentence();
      else if (act === 'rw') showWord();
    });
    speakEn(t.word, 0.75);
  }
  var LISTEN_CSS =
    '#galListenPop{position:fixed;z-index:2147483000;background:#fff;color:#2b2233;border:2px solid #2b2233;border-radius:12px;' +
    'box-shadow:0 10px 28px rgba(0,0,0,.28);padding:10px 12px;max-width:min(340px,92vw);font:600 16px/1.35 Nunito,system-ui,sans-serif;text-align:left}' +
    '#galListenPop .gl-top{display:flex;align-items:center;gap:8px}#galListenPop .gl-word{font-size:20px}' +
    '#galListenPop .gl-tr{margin:4px 0 8px;min-height:1.2em}' +
    '#galListenPop .gl-eq{font-size:19px;text-decoration:underline;text-underline-offset:3px}#galListenPop .gl-grey{color:#8d8496}' +
    '#galListenPop .gl-none{color:#6d6377;font-weight:600;font-size:14px}' +
    '#galListenPop .gl-wait{color:#6d6377;font-style:italic;font-weight:700}#galListenPop .gl-retry{background:#fff4d6;border-color:#8a6200;color:#5a4000}' +
    '#galListenPop .gl-row{display:flex;flex-wrap:wrap;gap:6px}' +
    '#galListenPop .gl-b{border:2px solid #2b2233;background:#f6f2fb;color:#2b2233;border-radius:999px;padding:4px 10px;font:800 14px Nunito,system-ui,sans-serif;cursor:pointer}' +
    '#galListenPop .gl-str{margin-top:6px;color:#4a3f55}#galListenPop .gl-str:empty{display:none}' +
    '.gal-listen-hint{position:fixed;left:12px;bottom:12px;z-index:2147482000;background:#2b2233;color:#fff;border-radius:999px;' +
    'padding:8px 14px;font:700 14px Nunito,system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);transition:opacity .6s}';

  function listenBoot() {
    if (listenOff()) return;
    if (!document.getElementById('gal-listen-css')) {
      var st = document.createElement('style'); st.id = 'gal-listen-css'; st.textContent = LISTEN_CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    var before = 0, spoke = false;
    /* capture phase: snapshot before the page's own handlers run */
    document.addEventListener('click', function (e) {
      if (listenOff()) return;
      before = visiblePopups();
      spoke = !!(window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending));
    }, true);
    document.addEventListener('click', function (e) {
      if (listenOff()) return;
      var pop = document.getElementById('galListenPop');
      if (pop && pop.contains(e.target)) return;
      if (pop) closeListen();
      var tg = e.target;
      if (!tg || !tg.closest) return;
      if (tg.closest(NO_GO) || tg.closest(OWN_TAP)) return;
      if (getComputedStyle(tg).cursor === 'pointer') return;
      var sel = window.getSelection && window.getSelection();
      if (sel && String(sel).trim()) return;                          /* a student selecting text */
      var t = textAt(e.clientX, e.clientY); if (!t) return;
      warmSeen[t.word] = 1;                                         /* T-94: the card will look this one up */
      var x0 = before, s0 = spoke;
      setTimeout(function () {                                         /* yield to the page */
        var talking = window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending);
        if ((talking && !s0) || visiblePopups() > x0) return;
        openListen(t);
      }, 220);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeListen(); });
    /* T-94: warm the cache with the words on screen once a language is chosen */
    var lastLang = '', warmTimer = null;
    function warmSoon(ms) { clearTimeout(warmTimer); warmTimer = setTimeout(warmVisible, ms); }
    setInterval(function () { var lg = listenLang(); if (lg && lg !== lastLang) { lastLang = lg; warmSoon(1500); } }, 2000);
    window.addEventListener('scroll', function () { if (lastLang) warmSoon(1500); }, { passive: true });
    document.addEventListener('click', function () { if (lastLang) warmSoon(2500); });
    window.addEventListener('scroll', closeListen, { passive: true });
    /* one quiet hint per page visit, only once something is on screen to read */
    try {
      var key = 'gal_listen_hint:' + location.pathname;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        setTimeout(function () {
          if (listenOff()) return;
          var g = document.querySelector('[data-gal-std]');
          if (g && g.offsetParent !== null) return;                    /* still on the sign-in box */
          var h = document.createElement('div');
          h.className = 'gal-listen-hint'; h.setAttribute('data-no-listen', ''); h.setAttribute('translate', 'no');
          h.textContent = '\uD83D\uDC46 Tap any word: \uD83D\uDD0A hear it + see it in your language';
          document.body.appendChild(h);
          setTimeout(function () { h.style.opacity = '0'; }, 6000);
          setTimeout(function () { h.remove(); }, 6800);
        }, 2500);
      }
    } catch (e) {}
  }

  function scan() {
    addCSS();
    speakerIcons();
    var ems = document.querySelectorAll('input[type=email], input[id*=mail i], input[name*=mail i]');
    for (var i = 0; i < ems.length; i++) fixBox(ems[i]);
  }
  var pending = null;
  function soon() { if (pending) return; pending = setTimeout(function () { pending = null; scan(); }, 150); }
  function boot() {
    wrapFetch();
    warm();
    scan();
    listenBoot();
    try { new MutationObserver(soon).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(scan, 600);
  setTimeout(scan, 2000);
})();
