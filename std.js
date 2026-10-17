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

   Pages that already have a language dropdown in their sign-in box are
   left alone (only fixes 3 and 4 apply). Safe to load twice.
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
  function addCSS() {
    if (document.getElementById('gal-std-css')) return;
    var st = document.createElement('style');
    st.id = 'gal-std-css';
    st.textContent =
      'select option,select optgroup{color:#2b2233 !important;background-color:#fff !important}' +
      '.gal-std-lang-msg{color:#c0392b;font-weight:800;font-size:.9em;margin:4px 0 0;min-height:1.2em}';
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
    if (haveLang && haveLang.id !== 'galStdLang') return;   /* page already does it right */

    var btn = startButton(box);
    if (!btn) return;
    if (haveLang) { guardButton(btn, box, haveLang); return; }   /* ours is still here */

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
    sel.addEventListener('change', function () { msg.textContent = ''; try { localStorage.setItem('vocab_lang', sel.value); } catch (e) {} });
    guardButton(btn, box, sel);
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

  function scan() {
    addCSS();
    var ems = document.querySelectorAll('input[type=email], input[id*=mail i], input[name*=mail i]');
    for (var i = 0; i < ems.length; i++) fixBox(ems[i]);
  }
  var pending = null;
  function soon() { if (pending) return; pending = setTimeout(function () { pending = null; scan(); }, 150); }
  function boot() {
    scan();
    try { new MutationObserver(soon).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(scan, 600);
  setTimeout(scan, 2000);
})();
