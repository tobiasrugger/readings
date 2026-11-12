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

   9. Prefill period + language (T-136): a student whose email arrives by autofill gets their
      period and home language from the students table — always before Start goes through.

   8. Back to My Page (T-101): a green "← My Page" button for students who came from
      /readings/student/, a finished signal it reads, and "My Page" beside Google Classroom.

   7. Listen + translate safety net: tap any word on a student page to hear it,
      see it in your language, and hear/translate its sentence or paragraph —
      only where the page doesn't already do this (see section 7 for opt-outs).

   5. Every "Hear it" button shows the speaker icon: 🔊 Hear it. So do
      "Listen" buttons that play sound (never an answer choice that just
      says "listen" — that is a vocabulary word in Unit 1).

   6. Stay signed in (T-167, Oct 28 2026): a student who signed in on any
      activity in the last 70 minutes (one class period) is recognised on the
      next one. The sign-in box fills itself in and shows a yellow "Signed in
      as <name> · Period N — Not you? Tap here" box, but NEVER presses Start:
      the student taps it. (It used to walk straight in for 12 hours, which
      put the next student on a shared Chromebook into the last one's work.)
   7. Translation cache: every call to the Apps Script proxy checks the
      shared song_tr table first, so the second student to tap a word gets
      it instantly and the proxy is asked once per word per language.
      Rows: slug "dir" for directions (shared by all pages) and
      "tap:<page>" for words tapped on that page.

  10. Username box (T-228, Nov 3 2026): every student email box becomes a username box
      with a fixed "@s.sfusd.edu" inside the same border (copy of My Page, T-260). The
      page's own email input is hidden and always holds username + suffix, so every page
      reads and saves the email exactly as before. A pasted full email keeps only the part
      before @; Enter signs in; a stored/prefilled @sfusd.edu (Period 1) keeps that domain.

  12. Who wrote it (T-337, Nov 6 2026): device code per browser + word flags on every save,
      and a friendly line in each sign-in box. Teacher page trail/dashboard.html.
  11. Practice log (T-148, Nov 5 2026): active minutes, 🔊 taps and translations per student,
      page and day → practice_log. GAL.key(email) (T-299) = the username, the one student ID.

   Pages that already have a language dropdown in their sign-in box are
   left alone (only fixes 3, 4, 5, 6 and 7 apply). Safe to load twice.
   ===================================================================== */
(function () {
  if (window.__GAL_STD__) return;
  window.__GAL_STD__ = true;

  /* T-299 USERNAME IS THE ID (Nov 5 2026). One student = the part of the email before @, lowercased.
     "jili81@s.sfusd.edu", "JILI81@sfusd.edu" and "jili81" all give "jili81", so a page or dashboard that
     matches students by GAL.key never splits one student into two rows. Old rows are NOT rewritten:
     anything that reads them compares GAL.key(row.email) instead of the email itself. */
  window.GAL = window.GAL || {};
  window.GAL.key = function (email) { return String(email == null ? '' : email).trim().toLowerCase().split('@')[0].replace(/\s+/g, ''); };
  window.GAL.same = function (a, b) { var k = window.GAL.key(a); return !!k && k === window.GAL.key(b); };

  /* T-268: names said right on every page (captions unchanged). The voice gets "Ameera" for
     "Amira" (the fix used to live only in reel-v2/engine.js SAY_AS). "Ameera" is one letter
     longer, so a page's onboundary handler gets charIndex mapped back to ITS text, and word
     highlights don't drift after the name. */
  (function () {
    /* T-287: Mateo too ("Matayo", same as spell/spell.js from T-273; Toby's pick, Nov 5). */
    var SAY_AS = { 'Amira': 'Ameera', 'Mateo': 'Mah-tay-oh', 'ELD': 'E. L. D.', 'hijab': 'hee-jahb', 'hijabs': 'hee-jahbs', 'Hijab': 'Hee-jahb' };   /* T-340: same list as reel-v2/engine.js */
    var ss = window.speechSynthesis; if (!ss || ss.__galSayAs) return; ss.__galSayAs = 1;
    var orig = ss.speak, RE = new RegExp('\\b(' + Object.keys(SAY_AS).join('|') + ')\\b', 'g');
    function swap(text) {
      var out = '', map = [], last = 0, m, i;
      RE.lastIndex = 0;
      while ((m = RE.exec(text))) {
        for (i = last; i < m.index; i++) map.push(i);
        out += text.slice(last, m.index);
        var r = SAY_AS[m[1]];
        for (i = 0; i < r.length; i++) map.push(m.index + Math.min(i, m[1].length - 1));
        out += r; last = m.index + m[1].length;
      }
      for (i = last; i <= text.length; i++) map.push(i);
      return { text: out + text.slice(last), map: map };
    }
    ss.speak = function (u) {
      try {
        if (u && u.text) {
          var s = swap(u.text);
          if (s.text !== u.text) {
            u.text = s.text;
            var h = u.onboundary;
            if (typeof h === 'function' && !h.__galMapped) {
              var w = function (e) {
                var ci = e.charIndex;
                return h.call(this, { charIndex: typeof ci === 'number' && s.map[ci] != null ? s.map[ci] : ci,
                  charLength: e.charLength, name: e.name, elapsedTime: e.elapsedTime, utterance: e.utterance,
                  type: e.type, target: e.target, currentTarget: e.currentTarget });
              };
              w.__galMapped = 1; u.onboundary = w;
            }
          }
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  })();

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

  /* T-167: the "Signed in as" line is now the only guard on a shared computer, so it is loud */
  /* T-368 (Nov 12): the yellow "Signed in as … Not you? Tap here" box pushed Start below the fold on a
     Chromebook, and a student kept pressing "Not you?" (the only button she could see), clearing her own
     sign-in each time. Now: a small "Signed in as …" line directly above ONE row — Start (big, unchanged)
     with a small plain "Not ___?" beside it. And Start is never left below the fold (ensureStart). */
  var WHO_CSS = '.gal-std-who{font-size:13.5px;font-weight:700;margin:6px 0 4px;line-height:1.35;color:#4a4256}' +
    '.gal-std-who b{color:#2B2233}' +
    '.gal-std-row{display:flex;align-items:center;gap:10px;flex-wrap:nowrap;max-width:100%}' +
    '.gal-std-row > *{margin-top:0;margin-bottom:0}' +
    '.gal-std-notme{font:inherit;font-size:13px;font-weight:700;background:transparent;border:1px solid #a9a1b3;border-radius:8px;' +
    'padding:5px 9px;cursor:pointer;color:#5d536a;white-space:nowrap;flex:0 0 auto;width:auto;min-width:0;box-shadow:none}' +
    '.gal-compact{padding-top:10px!important;padding-bottom:10px!important;row-gap:6px!important}' +
    '.gal-compact > *{margin-top:5px!important;margin-bottom:5px!important}' +
    '.gal-compact img,.gal-compact figure,.gal-compact picture,.gal-compact svg:not(button svg),.gal-compact .gal-trail-note{display:none!important}';
  function addCSS() {
    if (document.getElementById('gal-std-css')) return;
    var st = document.createElement('style');
    st.id = 'gal-std-css';
    st.textContent =
      'select option,select optgroup{color:#2b2233 !important;background-color:#fff !important}' +
      '.gal-std-lang-msg{color:#c0392b;font-weight:800;font-size:.9em;margin:4px 0 0;min-height:1.2em}' +
      '.gal-un{display:flex !important;align-items:center;box-sizing:border-box;cursor:text}' +
      '.gal-un:focus-within{box-shadow:0 0 0 3px rgba(90,74,138,.35) !important}' +
      '.gal-un input{text-align:right !important}.gal-un input:placeholder-shown{text-align:left !important}' +
      '.gal-un-suf{flex:0 0 auto;white-space:nowrap;user-select:none;-webkit-user-select:none;font-weight:800;color:#4a3f5c}' +
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
      if (c[i].id === 'galStdLang' || !shown(c[i]) || c[i].getAttribute('data-gal-un')) continue;
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
     code where it already does this). Read by every page for one class
     period (70 min, T-167 — was 12 hours). */
  var SESSION_HOURS = 70 / 60;
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
    if (el.getAttribute && el.getAttribute('data-gal-un-orig')) return '';   /* T-228: hidden behind the username box */
    var hay = [el.id, el.name, el.placeholder, el.getAttribute('aria-label') || '', el.getAttribute('autocomplete') || ''].join(' ').toLowerCase();   /* T-264: given-name / family-name count */
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
  function namePart(el, full) {
    var hay = ((el.id || '') + ' ' + (el.name || '') + ' ' + (el.placeholder || '') + ' ' + (el.getAttribute('autocomplete') || '')).toLowerCase();
    var fo = /first|given/.test(hay) && !/last|sur|family/.test(hay), lo = /last|sur|family/.test(hay) && !/first|given/.test(hay);
    var parts = String(full).trim().split(/\s+/);
    return fo ? parts[0] : lo ? parts.slice(1).join(' ') : full;
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
        if (kind === 'name' && v) v = namePart(el, v);   /* T-264: a First or Last box gets only its half */
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
    d.innerHTML = 'Signed in as <b></b>' + (s.period ? ' \u00b7 Period ' + s.period : '');
    d.querySelector('b').textContent = s.name || s.email;
    /* T-368: Start and a small "Not ___?" share one row; the line sits directly above that row */
    var row = btn.parentNode && btn.parentNode.classList && btn.parentNode.classList.contains('gal-std-row') ? btn.parentNode : null;
    if (!row) {
      var wide = btn.parentNode && btn.offsetWidth >= btn.parentNode.clientWidth * 0.8;
      row = document.createElement('div'); row.className = 'gal-std-row';
      btn.parentNode.insertBefore(row, btn); row.appendChild(btn);
      if (wide) { btn.style.flex = '1 1 auto'; btn.style.minWidth = '0'; }
    }
    var nm = document.createElement('button'); nm.type = 'button'; nm.className = 'gal-std-notme';
    nm.textContent = 'Not ' + first + '?';
    row.appendChild(nm);
    nm.addEventListener('click', function () {
      nm.remove();
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
    row.parentNode.insertBefore(d, row);
    ensureStart(box, btn);
  }
  /* T-368: Start must never sit below the fold (Chromebooks give ~650 px). If its bottom edge is past the
     window: compact the box first (smaller padding/gaps, hide pictures and the optional note), then
     scroll Start to the middle. Runs when the box draws, again a moment later, and on resize. */
  function ensureStart(box, btn) {
    try {
      if (!btn || !shown(btn)) return;
      var r = btn.getBoundingClientRect(), H = window.innerHeight || document.documentElement.clientHeight;
      if (r.top >= 0 && r.bottom <= H - 4) return;
      if (box && !box.classList.contains('gal-compact')) { box.classList.add('gal-compact'); r = btn.getBoundingClientRect(); }
      if (r.top < 0 || r.bottom > H - 4) btn.scrollIntoView({ block: 'center' });
    } catch (e) {}
  }
  function watchStart(box, btn) {
    if (!btn || btn.__galEnsure) return;
    btn.__galEnsure = 1;
    [60, 450, 1200].forEach(function (t) { setTimeout(function () { ensureStart(box, btn); }, t); });
    var tm = 0;
    window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(function () { ensureStart(box, btn); }, 150); });
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
          if (!k || !els[i].value) continue;
          if (k === 'name' && got.name) got.name += ' ' + els[i].value.trim();   /* T-264: First + Last boxes */
          else got[k] = k === 'email' ? emailVal(els[i]) : els[i].value.trim();
        }
        if (got.email) remember(got.name, got.email, got.period);
        setTimeout(function () { try { updCheck('signin'); } catch (e) {} }, 1500);   /* T-272 */
      }, 60);
    }, false);
  }
  /* T-167: a sign-in older than one class period is someone else's now. Many pages fill the
     email box themselves from gal_student_email with no time limit, so clear what matches the
     old student (email, and the name beside it) and forget them on this computer. */
  var STALE = (function () {
    try {
      var em = localStorage.getItem('gal_student_email') || '', at = +(localStorage.getItem('gal_student_at') || 0);
      if (!em || (at && Date.now() - at <= SESSION_HOURS * 3600 * 1000)) return null;
      var st = { em: em.toLowerCase(), nm: (localStorage.getItem('gal_student_name') || '').trim().toLowerCase() };
      forget();
      return st;
    } catch (e) { return null; }
  })();
  /* T-284: a field the student typed into (a real, trusted input event) is never cleared as "expired".
     John typed "jobalam", left the name box, and the email vanished three times: every click/focusout
     re-ran scan() → resume() → clearExpired(), and his own username matched the old sign-in. */
  document.addEventListener('input', function (e) { if (e.isTrusted && e.target) e.target.__galTyped = true; }, true);
  function clearExpired(box) {
    if (!STALE) return;
    var user = STALE.em.split('@')[0], els = box.querySelectorAll('input');
    for (var i = 0; i < els.length; i++) {
      if (els[i].__galTyped) continue;                       /* T-284 */
      var k = fieldKind(els[i], box), v = (els[i].value || '').trim().toLowerCase();
      if (!v) continue;
      if ((k === 'email' && (v === STALE.em || v.split('@')[0] === user)) || (k === 'name' && STALE.nm && (v === STALE.nm || v === namePart(els[i], STALE.nm)))) {
        els[i].value = '';
        try { els[i].dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
      }
    }
  }
  function resume(box, btn) {
    var s = sess();
    if (!s) {
      /* T-284: clear an expired sign-in only on the box's FIRST pass (now + 600 ms for a page that
         fills its own box a moment later) — never again on later scans (every click / focusout) */
      if (!box.getAttribute('data-gal-expired-done')) {
        box.setAttribute('data-gal-expired-done', 'pending');
        clearExpired(box);
        setTimeout(function () { clearExpired(box); box.setAttribute('data-gal-expired-done', '1'); }, 600);
      }
      watchSignIn(box, btn); return;
    }
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
    /* T-167: never press Start for them. The fields are filled and the yellow
       "Signed in as … — Not you?" box is showing; the student taps Start. A
       shared Chromebook must never walk the next student into someone else's work. */
    void r;
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
  /* T-358 (Nov 12): pages through ALL saved rows (Supabase returns at most 1,000 per request, and
     "dir" is past that), and every caller waits for the same load instead of racing past it. */
  function cacheLoad(lg) {
    if (!lg) return Promise.resolve();
    if (loadedLang[lg]) return loadedLang[lg];
    var base = SUPA_URL + '/rest/v1/song_tr?select=slug,src,equiv,meaning&lang=eq.' + encodeURIComponent(lg) +
               '&or=(slug.eq.dir,slug.eq.' + encodeURIComponent(PAGE_SLUG) + ')&order=slug.asc,src.asc';
    var STEP = 1000;
    function page(from) {
      var h = hdr(); h['Range-Unit'] = 'items'; h.Range = from + '-' + (from + STEP - 1);
      return fetch(base, { headers: h })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) {
          (rows || []).forEach(function (r) {
            var v = r.equiv || r.meaning || '';
            if (v) tcache[ckey(r.slug, r.src, lg)] = v;
          });
          if (rows && rows.length === STEP && from < 30000) return page(from + STEP);
        });
    }
    loadedLang[lg] = page(0).catch(function () {});
    return loadedLang[lg];
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
        var again = tcache[ckey(slug, src, lg)] || tcache[ckey('dir', src, lg)] || tcache[ckey(PAGE_SLUG, src, lg)];   /* T-358 */
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
  /* ================= T-295 HEALTH CHECK (Nov 5 2026) =================
     A save to Supabase that fails is recorded in page_errors, so a silent failure (like song_tr's
     missing updated_at column, which made every translation-cache save a 400 for weeks) shows up on
     https://tobiasrugger.github.io/readings/health/dashboard.html the first day.
     Only POST / PATCH / DELETE to /rest/v1/. The page gets its own response back untouched (a clone is
     read); nothing here ever throws; the record's own request is never logged. Rate limit per tab:
     1 per page+table+status per 10 min, 20 per hour. Off in teacher view and for robots/test runs. */
  var HC = { last: {}, hour: [], real: null };
  function hcOff() {
    try {
      if (window.GAL_HEALTH_TEST) return false;
      if (window.GAL_TEACHER_VIEW || /[?&]view=teacher\b/.test(location.search)) return true;
      if (navigator.webdriver || /\/(robot|audit)\//.test(location.pathname) || /[?&](robot|test)=/.test(location.search)) return true;
      return !/^https?:$/.test(location.protocol);
    } catch (e) { return true; }
  }
  function hcSend(rec) {
    try {
      var now = Date.now(), k = rec.page + '|' + rec.tbl + '|' + rec.status;
      if (HC.last[k] && now - HC.last[k] < 600000) return;
      HC.hour = HC.hour.filter(function (t) { return now - t < 3600000; });
      if (HC.hour.length >= 20) return;
      HC.last[k] = now; HC.hour.push(now);
      HC.real.call(window, SUPA_URL + '/rest/v1/page_errors', { method: 'POST', keepalive: true,
        headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify([rec]) }).catch(function () {});
    } catch (e) {}
  }
  function hcRecord(url, method, status, err) {
    try {
      if (hcOff()) return;
      var em = ''; try { em = localStorage.getItem('gal_student_email') || ''; } catch (e) {}
      var tbl = (String(url).split('/rest/v1/')[1] || '').split('?')[0].split('/')[0];
      hcSend({ page: location.pathname, tbl: tbl, method: method, status: status, err: String(err || '').slice(0, 300),
               email: em, at: new Date().toISOString() });
    } catch (e) {}
  }
  function healthWrap() {
    if (!window.fetch || window.__GAL_HEALTH__) return;
    window.__GAL_HEALTH__ = true;
    var real = HC.real = window.fetch;
    window.fetch = function (input, init) {
      var url = '', method = 'GET';
      try {
        url = (typeof input === 'string') ? input : (input && input.url) || '';
        method = String((init && init.method) || (input && typeof input !== 'string' && input.method) || 'GET').toUpperCase();
      } catch (e) {}
      var p = real.apply(this, arguments);
      try {
        if (url.indexOf('/rest/v1/') < 0 || url.indexOf('supabase.co') < 0 || url.indexOf('/rest/v1/page_errors') >= 0 ||
            !/^(POST|PATCH|DELETE)$/.test(method)) return p;
        p.then(function (res) {
          try {
            if (res && !res.ok) {
              var st = res.status;
              res.clone().text().then(function (t) { hcRecord(url, method, st, t); }, function () { hcRecord(url, method, st, ''); });
            }
          } catch (e) {}
        }, function (e) { hcRecord(url, method, 0, (e && (e.name + ': ' + e.message)) || 'network error'); });
      } catch (e) {}
      return p;
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
    if (btn0) trBoxNote(box, btn0);                   /* T-337 */
    if (btn0) watchStart(box, btn0);                  /* T-368 */
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
    /* T-109: on-device US English first (the network "Google US English" makes every tap wait) */
    var vs = speechSynthesis.getVoices().filter(function (v) { return /^en(-|_)US/i.test(v.lang); });
    var loc = vs.filter(function (v) { return v.localService; });
    try { if (loc.length) u.voice = loc[0]; else if (vs.length) u.voice = vs[0]; } catch (e) {}
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
  /* T-358 (Nov 12): the warm-up no longer calls the translator. It spent up to 80 of the shared
     daily translator calls per page per language on words nobody tapped (48 on one Landlady load),
     and when the daily limit runs out EVERY translation fails for everyone. Now it only loads the
     saved translations (one paged Supabase read), so saved words are instant and only a real tap
     can call the translator. Teachers fill the cache ahead of time with the Pre-translate buttons.
     T-94 warm-up (old note): once a language is known, quietly ask for the words on screen, a few at a
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
    cacheLoad(lg); return;                                   /* T-358: cache only, no translator calls */
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

  /* ========== 8. back to My Page (T-101, Oct 22 2026) ==========
     The student page (/readings/student/, T-100) sets sessionStorage gal_home when a
     student opens it, and reads + clears gal_last_page / gal_last_title / gal_last_done
     when they come back. On every other student page this section:
       - shows a fixed green "← My Page" button (only when gal_home is set),
       - records gal_last_page / gal_last_title,
       - marks the page finished (gal_last_done = '1') when a Turn in / Submit / Finish /
         Done button is pressed, or GAL_SCORE >= GAL_MAX > 0, and then grows the button
         into a pulsing "✓ Done — back to My Page →",
       - puts a green "My Page" button in front of any Google Classroom link or button.
     sessionStorage here holds navigation state only, never student work. */
  var MYPAGE_DEFAULT = '/readings/student/';
  var FINISH_RE = /^(\u2713\s*)?(turn in|submit|finish|finished|done|i['\u2019]?m done)(\s+((my|this|chapter)\b[^?]{0,30}|the\s+(assessment|test|quiz|set|page|lesson|story|reading)\b[^?]{0,20}))?\s*[.!\u2192>\u00bb]*\s*$/i;
  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k) || ''; if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); }
    catch (e) { return ''; }
  }
  function myPageOff() {
    var p = location.pathname;
    try { if (window.top !== window.self) return true; } catch (e) { return true; }   /* T-264: embedded (say/ inside a lesson) */
    if (/^\/readings\/student(\/|$)/.test(p)) return true;               /* the student page itself */
    if (/^\/readings\/?(index\.html)?$/.test(p)) return true;              /* the hub */
    if (TEACHER_PATH.test(p)) return true;
    /* teacher-only screen = a password box and NO student email box. Email boxes are found by
       type, autocomplete, id or name (News's is #gEmail with no type="email" — it used to be
       mistaken for a teacher screen, so My Page never showed there). */
    var pw = document.querySelector('input[type=password]');
    if (pw && !document.querySelector('input[type=email], input[autocomplete=email], input[id*="mail" i], input[name*="mail" i]')) return true;
    return false;
  }
  function cleanTitle(t) {
    return String(t || '').replace(/\s*[\u00b7|\u2013\u2014-]\s*(Mr\.?\s*Toby|Readings)\s*$/i, '').trim();
  }
  /* Placement: pinned over the top-left corner it covered every page's own title / "← Practice" /
     "Print" buttons, so by default the button sits top-left in a slim strip ABOVE the page (it pushes
     the page down instead of covering it), and the finished state is a big pulsing button pinned at
     the bottom centre. Set MYPAGE_PINNED = true to pin it over the top-left corner instead. */
  var MYPAGE_PINNED = false;
  var MYPAGE_CSS =
    '#galMyBar{display:block;padding:8px 10px;background:#f4f1ea;border-bottom:2px solid #1d1a24;text-align:left;position:relative;z-index:2147482400}' +
    '#galMyBar #galMyPage{position:static}' +
    '#galMyDone{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147482600;display:inline-flex;align-items:center;' +
    'min-height:56px;padding:14px 24px;border-radius:999px;background:#178a4f;color:#fff !important;text-decoration:none;' +
    'border:2px solid #1d1a24;box-shadow:0 4px 0 rgba(0,0,0,.35),0 8px 18px rgba(0,0,0,.2);font:800 21px/1.1 Nunito,system-ui,sans-serif;' +
    'animation:galMyPulseC 1.4s ease-in-out infinite;white-space:nowrap}' +
    '@keyframes galMyPulseC{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.06)}}' +
    '#galMyPage{position:fixed;top:10px;left:10px;z-index:2147482500;display:inline-flex;align-items:center;gap:6px;' +
    'min-height:44px;padding:9px 16px;border-radius:999px;background:#1f7a4d;color:#fff !important;text-decoration:none;' +
    'border:2px solid #1d1a24;box-shadow:0 4px 0 rgba(0,0,0,.35),0 8px 18px rgba(0,0,0,.18);font:800 17px/1.1 Nunito,system-ui,sans-serif}' +
    '#galMyPage:hover{background:#18663f}#galMyPage:active{transform:translateY(2px);box-shadow:0 2px 0 rgba(0,0,0,.35)}' +
    '#galMyPage.done{font-size:21px;padding:14px 22px;background:#178a4f;animation:galMyPulse 1.4s ease-in-out infinite}' +
    '@keyframes galMyPulse{0%,100%{transform:scale(1);box-shadow:0 4px 0 rgba(0,0,0,.35),0 0 0 0 rgba(31,122,77,.55)}' +
    '50%{transform:scale(1.06);box-shadow:0 4px 0 rgba(0,0,0,.35),0 0 0 14px rgba(31,122,77,0)}}' +
    '.gal-mypage-inline{display:inline-flex;align-items:center;min-height:44px;padding:9px 18px;margin:4px 8px 4px 0;border-radius:999px;' +
    'background:#1f7a4d;color:#fff !important;text-decoration:none;border:2px solid #1d1a24;box-shadow:0 4px 0 rgba(0,0,0,.3);' +
    'font:800 17px Nunito,system-ui,sans-serif;vertical-align:middle}' +
    '@media print{#galMyBar,#galMyPage,#galMyDone,.gal-mypage-inline{display:none !important}}';
  var myDone = false;
  function myPageHome() {
    var h = ss('gal_home');
    /* a link opened in a NEW tab (target=_blank rel=noopener) starts with an empty sessionStorage,
       but the browser still reports where it came from: if that was the student page, adopt it */
    if (!h) {
      try {
        var r = document.referrer ? new URL(document.referrer) : null;
        if (r && r.origin === location.origin && /^\/readings\/student(\/|$)/.test(r.pathname)) {
          h = MYPAGE_DEFAULT; ss('gal_home', h);
        }
      } catch (e) {}
    }
    return h || '';
  }
  function markDone() {
    if (myDone) return; myDone = true;
    ss('gal_last_done', '1');
    var b = document.getElementById('galMyPage');
    if (!b) return;                                   /* didn't come from My Page: just record it */
    if (MYPAGE_PINNED) { b.classList.add('done'); b.textContent = '\u2713 Done \u2014 back to My Page \u2192'; return; }
    b.textContent = '\u2713 Done \u2014 back to My Page';
    if (!document.getElementById('galMyDone')) {
      var d = document.createElement('a');
      d.id = 'galMyDone'; d.href = b.getAttribute('href'); d.textContent = '\u2713 Done \u2014 back to My Page \u2192';
      d.setAttribute('data-no-listen', ''); d.setAttribute('translate', 'no');
      document.body.appendChild(d);
    }
  }
  function myPageScan() {
    if (myPageOff() || !document.body) return;
    var home = myPageHome() || MYPAGE_DEFAULT;
    var els = document.querySelectorAll('a[href*="classroom.google.com"], a, button');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.__galMyPage || el.id === 'galMyPage' || el.classList.contains('gal-mypage-inline')) continue;
      var isGC = /classroom\.google\.com/i.test(el.getAttribute('href') || '') || /google classroom/i.test(el.textContent || '');
      if (!isGC) continue;
      el.__galMyPage = true;
      var prev = el.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('gal-mypage-inline')) continue;
      var a = document.createElement('a');
      a.className = 'gal-mypage-inline'; a.href = home; a.textContent = 'My Page';
      a.setAttribute('data-no-listen', ''); a.setAttribute('translate', 'no');
      el.parentNode.insertBefore(a, el);
    }
  }
  function myPageBoot() {
    if (myPageOff()) return;
    if (!document.getElementById('gal-mypage-css')) {
      var st = document.createElement('style'); st.id = 'gal-mypage-css'; st.textContent = MYPAGE_CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    /* 2. where the student is, for the student page to read when they come back */
    if (ss('gal_last_page') !== location.pathname) ss('gal_last_done', null);   /* a new page is not finished yet */
    ss('gal_last_page', location.pathname);
    ss('gal_last_title', cleanTitle(document.title));
    /* 1. the button, only for students who came from their page */
    var home = myPageHome();
    if (home && !document.getElementById('galMyPage')) {
      var b = document.createElement('a');
      b.id = 'galMyPage'; b.href = home; b.textContent = '\u2190 My Page';
      b.setAttribute('data-no-listen', ''); b.setAttribute('translate', 'no');
      if (MYPAGE_PINNED) document.body.appendChild(b);
      else {
        var bar = document.createElement('div'); bar.id = 'galMyBar';
        bar.setAttribute('data-no-listen', ''); bar.setAttribute('translate', 'no');
        bar.appendChild(b); document.body.insertBefore(bar, document.body.firstChild);
      }
    }
    /* 3. finished: a finish button, or a full score */
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('button, [role=button], a.btn, input[type=submit], input[type=button]');
      if (!t || t.id === 'galMyPage' || t.id === 'galMyDone') return;
      var label = (t.tagName === 'INPUT' ? t.value : t.textContent || '').replace(/\s+/g, ' ').trim();
      if (FINISH_RE.test(label)) setTimeout(markDone, 300);
    }, true);
    setInterval(function () {
      var s = +window.GAL_SCORE, m = +window.GAL_MAX;
      if (m > 0 && s >= m) markDone();
    }, 2000);
    myPageScan();
  }

  /* ========== 9. prefill period + language from the class list (T-136, Oct 26 2026) ==========
     Students whose name/email come from the browser's own autofill (or are already filled in)
     never pick from the roster, type or blur, so period and language stayed blank (Abdul, Xingqi…).
     Their period and home language ARE in the students table. So for every student sign-in box:
       - look the student up (both email spellings) as soon as an email is known: input/change on the
         email box (autofill fires these), a roster pick, the box showing with an email already in it,
         a remembered session;
       - SAFETY NET: when Start (or Enter) is pressed with period or language still empty and a valid
         email, wait for the lookup (2 s at most), fill the blanks, THEN let sign-in continue. A failed
         or slow lookup never blocks sign-in;
       - fill only EMPTY fields, never overwrite the student's own choice; fire input + change on both
         so the page's own picker and vocab_lang follow; remember the period in gal_student_period. */
  var PF_CACHE = {}, PF_WAIT = 2000;
  var PF_EMAIL = /^[^@\s]+@(s\.)?sfusd\.edu$/i;
  function pfLocal(e) { return String(e || '').trim().toLowerCase().split('@')[0]; }
  function pfLookup(email) {
    var lp = pfLocal(email); if (!lp || !PF_EMAIL.test(String(email).trim())) return Promise.resolve(null);
    if (PF_CACHE[lp]) return PF_CACHE[lp];
    var list = '("' + lp + '@sfusd.edu","' + lp + '@s.sfusd.edu")';
    var u = SUPA_URL + '/rest/v1/students?email=in.' + encodeURIComponent(list) + '&select=period,home_language';
    var p = fetch(u, { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } })
      .then(function (r) { if (!r.ok) throw new Error('students ' + r.status); return r.json(); })
      .then(function (rows) {
        var out = { period: '', lang: '' };
        (rows || []).forEach(function (r) {
          if (!out.period && r.period != null && String(r.period).trim()) out.period = String(r.period).replace(/[^0-9]/g, '');
          if (!out.lang && r.home_language) out.lang = String(r.home_language).trim();
        });
        return (out.period || out.lang) ? out : null;
      })
      .catch(function () { delete PF_CACHE[lp]; return null; });   /* a failure is retried next time */
    PF_CACHE[lp] = p;
    return p;
  }
  function pfStudentBox(box) { return box && !box.querySelector('input[type=password]') && !/dashboard|teacher/i.test(location.pathname); }
  function pfFields(box) {
    var f = { email: null, period: null, lang: null }, els = box.querySelectorAll('input, select');
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el.type === 'hidden' || el.type === 'password') continue;
      if (el.tagName === 'SELECT' && (el.id === 'galStdLang' || looksLikeLangSelect(el))) { if (!f.lang || el.id === 'galStdLang') f.lang = el; continue; }
      var k = fieldKind(el, box);
      if (k === 'email' && !f.email) f.email = el;
      else if (k === 'period' && !f.period) f.period = el;
    }
    return f;
  }
  function pfNeeds(f) { return !!((f.period && !String(f.period.value || '').trim()) || (f.lang && !f.lang.value)); }
  function pfFire(el) { try { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} }
  function pfFill(box, info) {
    if (!info) return;
    var f = pfFields(box);
    if (info.period && f.period && !String(f.period.value || '').trim()) {
      if (f.period.tagName === 'SELECT') {
        for (var i = 0; i < f.period.options.length; i++) {
          var o = f.period.options[i], d = ((o.value || '') + ' ' + (o.textContent || '')).match(/\d+/);
          if (o.value && d && d[0] === info.period) { f.period.value = o.value; pfFire(f.period); break; }
        }
      } else { f.period.value = info.period; pfFire(f.period); }
      if (String(f.period.value || '').trim()) { try { localStorage.setItem('gal_student_period', info.period); } catch (e) {} }
    }
    var code = info.lang ? (codeOf(info.lang, info.lang) || '') : '';
    if (code && f.lang && !f.lang.value) {
      for (var j = 0; j < f.lang.options.length; j++) {
        var op = f.lang.options[j];
        if (op.value && (codeOf(op.value, op.text) === code || aliases(code).indexOf(norm(op.value)) >= 0)) { f.lang.value = op.value; pfFire(f.lang); break; }
      }
      if (f.lang.value) { store(code); var m = box.querySelector('.gal-std-lang-msg'); if (m) m.textContent = ''; }
    }
  }
  function pfTry(box) {
    if (!pfStudentBox(box)) return;
    var f = pfFields(box);
    if (!f.email || !pfNeeds(f)) return;
    var em = emailVal(f.email);                       /* T-228: username + data-email-suffix */
    if (!PF_EMAIL.test(em) || box.__galPfFor === em) return;
    box.__galPfFor = em;
    pfLookup(em).then(function (info) { pfFill(box, info); });
  }
  function pfScan() {
    var bs = document.querySelectorAll('[data-gal-std]');
    for (var i = 0; i < bs.length; i++) if (shown(bs[i]) || bs[i].offsetParent !== null) pfTry(bs[i]);
  }
  function pfBoot() {
    function boxOf(t) { return t && t.closest && t.closest('[data-gal-std]'); }
    /* an email arrives: typed, pasted, autofilled, or set by a roster pick */
    var deb = null;
    ['input', 'change'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        var box = boxOf(e.target); if (!box) return;
        clearTimeout(deb); deb = setTimeout(function () { box.__galPfFor = ''; pfTry(box); }, 250);
      }, true);
    });
    /* the box shows with an email already in it (autofill that fired nothing, a remembered session) */
    var n = 0, t = setInterval(function () { pfScan(); if (++n > 20) clearInterval(t); }, 1000);
    /* SAFETY NET: Start / Enter waits (≤ 2 s) for the lookup and fills the blanks first */
    function hold(e, btn, box) {
      var f = pfFields(box);
      if (!f.email || !pfNeeds(f)) return false;
      var em = emailVal(f.email);
      if (!PF_EMAIL.test(em)) return false;
      e.preventDefault(); e.stopImmediatePropagation();
      var done = false;
      function go() {
        if (done) return; done = true;
        btn.__galPfPass = true;
        try { btn.click(); } finally { setTimeout(function () { btn.__galPfPass = false; }, 0); }
      }
      setTimeout(go, PF_WAIT);
      pfLookup(em).then(function (info) { pfFill(box, info); go(); }, go);
      return true;
    }
    window.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest && e.target.closest('button, input[type=submit]');
      if (!btn || btn.__galPfPass) return;
      var box = boxOf(btn); if (!pfStudentBox(box) || startButton(box) !== btn) return;
      hold(e, btn, box);
    }, true);
    window.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !e.target || e.target.tagName === 'TEXTAREA') return;
      var box = boxOf(e.target); if (!pfStudentBox(box)) return;
      var btn = startButton(box); if (!btn || btn.__galPfPass) return;
      hold(e, btn, box);
    }, true);
  }


  /* ================= T-245 TEACHER VIEW (Nov 3 2026) =================
     A student page opened with ?view=teacher&email=X shows X's own saved work, READ ONLY:
       - teacher password once per tab (sessionStorage gal_tv_ok only);
       - every write to Supabase (POST/PATCH/PUT/DELETE on /rest/v1/ or /storage/v1/, fetch,
         XMLHttpRequest or sendBeacon) gets a fake 201 and never leaves the browser; GETs go
         through, so the page loads X's saved work as usual. GAL_NO_AUTOLOG = true and
         GAL_logAttempt is a no-op, so nothing reaches the gradebook;
       - X is looked up in students (both spellings), the page's own sign-in box is filled and
         its Start pressed — the ONE exception to T-167's "no page presses Start by itself";
       - a yellow bar: "👀 Teacher view: <name> — read only, nothing saves" + Exit;
       - this browser's own sign-in keys are snapshotted (sessionStorage gal_tv_snap) and put
         back on Exit and on pagehide, so X is never left signed in on the teacher's laptop. */
  var TV = (function () {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('view') !== 'teacher' || !q.get('email')) return null;
      if (TEACHER_PATH.test(location.pathname)) return null;
      return { email: String(q.get('email')).trim().toLowerCase() };
    } catch (e) { return null; }
  })();
  var TV_KEYS = /^(gal_student_|vocab_lang$|vocab_me$|[a-z0-9]+_student$|resume_user$)/;
  function tvSnap() {
    try {
      if (sessionStorage.getItem('gal_tv_snap')) return;     /* first teacher-view load in this tab only */
      var s = {};
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (TV_KEYS.test(k)) s[k] = localStorage.getItem(k); }
      sessionStorage.setItem('gal_tv_snap', JSON.stringify(s));
    } catch (e) {}
  }
  function tvRestore() {
    try {
      var raw = sessionStorage.getItem('gal_tv_snap'); if (raw == null) return;
      var s = JSON.parse(raw) || {}, kill = [];
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (TV_KEYS.test(k)) kill.push(k); }
      kill.forEach(function (k) { localStorage.removeItem(k); });
      Object.keys(s).forEach(function (k) { localStorage.setItem(k, s[k]); });
    } catch (e) {}
  }
  function tvIsWrite(url, method) {
    method = String(method || 'GET').toUpperCase();
    return method !== 'GET' && method !== 'HEAD' && /supabase\.co\/(rest|storage)\/v1\//.test(String(url || ''));
  }
  var TV_BLOCKED = 0;
  function tvFake(body) {
    TV_BLOCKED++; window.GAL_TV_BLOCKED = TV_BLOCKED;
    var out = '[]';
    try { var d = JSON.parse(body); out = JSON.stringify(Array.isArray(d) ? d : [d]); } catch (e) {}
    return new Response(out, { status: 201, headers: { 'Content-Type': 'application/json' } });
  }
  function tvLock() {
    window.GAL_NO_AUTOLOG = true;
    window.GAL_TEACHER_VIEW = true;
    try { Object.defineProperty(window, 'GAL_logAttempt', { configurable: true, get: function () { return function () {}; }, set: function () {} }); } catch (e) { window.GAL_logAttempt = function () {}; }
    var inner = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (input && input.method) || 'GET';
      if (tvIsWrite(url, method)) return Promise.resolve(tvFake(init && init.body));
      return inner.apply(this, arguments);
    };
    try {
      var XO = XMLHttpRequest.prototype.open, XS = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (m, u) { this.__tvW = tvIsWrite(u, m); return XO.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function () {
        if (!this.__tvW) return XS.apply(this, arguments);
        TV_BLOCKED++; window.GAL_TV_BLOCKED = TV_BLOCKED;
        var x = this; setTimeout(function () {
          try { Object.defineProperty(x, 'readyState', { value: 4 }); Object.defineProperty(x, 'status', { value: 201 }); Object.defineProperty(x, 'responseText', { value: '[]' }); } catch (e) {}
          try { x.onreadystatechange && x.onreadystatechange(); x.onload && x.onload(); } catch (e) {}
        }, 0);
      };
    } catch (e) {}
    try {
      if (navigator.sendBeacon) {
        var SB = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (u, d) { if (tvIsWrite(u, 'POST')) { TV_BLOCKED++; window.GAL_TV_BLOCKED = TV_BLOCKED; return true; } return SB(u, d); };
      }
    } catch (e) {}
  }
  function tvExitUrl() {
    var u = new URL(location.href); u.searchParams.delete('view'); u.searchParams.delete('email');
    return u.toString();
  }
  function tvBar(name) {
    var b = document.getElementById('galTvBar');
    if (!b) {
      b = document.createElement('div'); b.id = 'galTvBar'; b.setAttribute('translate', 'no'); b.className = 'notranslate';
      b.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483645;display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;' +
        'background:#ffe066;color:#2B2233;border-bottom:3px solid #2B2233;box-shadow:0 4px 12px rgba(0,0,0,.25);padding:8px 14px;' +
        'font:800 17px/1.35 Nunito,system-ui,-apple-system,Segoe UI,Arial,sans-serif';
      document.body.appendChild(b);
      document.documentElement.style.scrollPaddingTop = '60px';
      document.body.style.paddingTop = (parseInt(getComputedStyle(document.body).paddingTop, 10) + 54) + 'px';
    }
    b.innerHTML = '<span>\ud83d\udc40 Teacher view: <b class="gal-tv-name"></b> \u2014 read only, nothing saves</span>' +
      '<button type="button" id="galTvExit" style="font:inherit;font-size:15px;background:#fff;color:#2B2233;border:2px solid #2B2233;border-radius:999px;padding:4px 14px;cursor:pointer">Exit</button>';
    b.querySelector('.gal-tv-name').textContent = name || TV.email;
    document.getElementById('galTvExit').onclick = function () {
      tvRestore();
      try { sessionStorage.removeItem('gal_tv_snap'); } catch (e) {}
      var back = /\/readings\/(student|desk)\//.test(document.referrer || '');
      if (back && history.length > 1) history.back(); else location.href = tvExitUrl();
    };
  }
  function tvPassword(then) {
    var ok = false; try { ok = sessionStorage.getItem('gal_tv_ok') === '1'; } catch (e) {}
    if (ok) return then();
    var o = document.createElement('div'); o.id = 'galTvPw'; o.setAttribute('translate', 'no');
    o.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(43,34,51,.72);display:flex;align-items:center;justify-content:center;font-family:Nunito,system-ui,sans-serif';
    o.innerHTML = '<div style="background:#fff;border:3px solid #2B2233;border-radius:14px;padding:20px 22px;max-width:360px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,.35)">' +
      '<div style="font-weight:900;font-size:20px;margin-bottom:6px">\ud83d\udc40 Teacher view</div>' +
      '<div style="font-size:15px;margin-bottom:10px">Read only \u2014 nothing you do here saves.</div>' +
      '<input id="galTvPwIn" type="password" placeholder="Teacher password" style="width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:8px 10px;border:2px solid #2B2233;border-radius:8px">' +
      '<div style="display:flex;gap:8px;margin-top:10px;align-items:center"><button id="galTvPwGo" type="button" style="font:inherit;font-weight:800;background:#1f6f43;color:#fff;border:0;border-radius:999px;padding:8px 18px;cursor:pointer">Open</button>' +
      '<span id="galTvPwMsg" style="font-size:14px;color:#8a1c1c"></span></div></div>';
    document.body.appendChild(o);
    var inp = document.getElementById('galTvPwIn');
    function go() {
      if (inp.value !== 'galileo2026') { document.getElementById('galTvPwMsg').textContent = 'Try again'; inp.value = ''; inp.focus(); return; }
      try { sessionStorage.setItem('gal_tv_ok', '1'); } catch (e) {}
      o.remove(); then();
    }
    document.getElementById('galTvPwGo').onclick = go;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    setTimeout(function () { inp.focus(); }, 50);
  }
  function tvLookup() {
    var lp = TV.email.split('@')[0];
    var list = '("' + lp + '@sfusd.edu","' + lp + '@s.sfusd.edu")';
    return fetch(SUPA_URL + '/rest/v1/students?email=in.' + encodeURIComponent(list) + '&select=*',
      { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var o = { name: '', first: '', last: '', period: '', lang: '' };
        (rows || []).forEach(function (r) {
          if (!o.first && r.first_name) o.first = String(r.first_name).trim();
          if (!o.last && r.last_name) o.last = String(r.last_name).trim();
          if (!o.name && r.name) o.name = String(r.name).trim();
          if (!o.period && r.period != null && String(r.period).trim()) o.period = String(r.period).replace(/[^0-9]/g, '');
          if (!o.lang && r.home_language) o.lang = String(r.home_language).trim();
        });
        if (!o.name) o.name = (o.first + ' ' + o.last).trim();
        if (!o.first && o.name) { var p = o.name.split(/\s+/); o.first = p.shift(); o.last = p.join(' '); }
        if (!o.name) o.name = lp;
        return o;
      }, function () { return { name: lp, first: lp, last: '', period: '', lang: '' }; });
  }
  function tvSet(el, v) {
    if (!el || v == null || v === '') return;
    if (el.tagName === 'SELECT') {
      var want = String(v).replace(/[^0-9a-z]/gi, '').toLowerCase();
      for (var i = 0; i < el.options.length; i++) {
        var o = el.options[i], t = ((o.value || '') + ' ' + (o.textContent || '')).replace(/[^0-9a-z]/gi, '').toLowerCase();
        if (o.value && want && (o.value.replace(/[^0-9a-z]/gi, '').toLowerCase() === want || t.indexOf(want) >= 0)) { el.value = o.value; break; }
      }
    } else el.value = v;
    try { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
  }
  function tvFindBox() {
    var ems = document.querySelectorAll('input[type=email], input[id*=mail i], input[name*=mail i], input[autocomplete=email]');
    for (var i = 0; i < ems.length; i++) if (shown(ems[i])) { var b = ems[i].closest('[data-gal-std]') || boxFor(ems[i]); if (b) return b; }
    return null;
  }
  function tvSignIn(info) {
    var tries = 0;
    (function look() {
      var box = tvFindBox();
      if (!box) { if (++tries < 60) return setTimeout(look, 300); return; }
      setTimeout(function () {                       /* let std.js put its language box in first */
        var els = box.querySelectorAll('input, select');
        for (var i = 0; i < els.length; i++) {
          var el = els[i]; if (el.type === 'hidden' || el.type === 'password' || el.id === 'galStdLang') continue;
          var k = fieldKind(el, box), hay = ((el.id || '') + ' ' + (el.name || '') + ' ' + (el.placeholder || '') + ' ' + (el.getAttribute('autocomplete') || '')).toLowerCase();
          if (k === 'email') tvSet(el, TV.email);
          else if (k === 'period') tvSet(el, info.period);
          else if (k === 'name') {
            var fo = /first|given/.test(hay) && !/last|sur|family/.test(hay), lo = /last|sur|family/.test(hay) && !/first|given/.test(hay);   /* "First and last name" = full name */
            tvSet(el, fo ? info.first : lo ? info.last : info.name);
          }
        }
        var code = codeOf(info.lang, info.lang) || stored() || 'es';
        var sels = box.querySelectorAll('select');
        for (var j = 0; j < sels.length; j++) {
          var s = sels[j]; if (!(s.id === 'galStdLang' || looksLikeLangSelect(s))) continue;
          for (var n = 0; n < s.options.length; n++) {
            var op = s.options[n];
            if (op.value && (codeOf(op.value, op.text) === code || aliases(code).indexOf(norm(op.value)) >= 0)) { s.value = op.value; break; }
          }
          try { s.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
        }
        store(code);
        var btn = startButton(box);
        if (btn) setTimeout(function () { btn.click(); }, 300);
      }, 700);
    })();
  }
  function tvBoot() {
    if (!TV) return;
    var go = function () {
      tvBar(TV.email);
      tvLookup().then(function (info) { tvBar(info.name); tvSignIn(info); });
    };
    tvPassword(go);
    window.addEventListener('pagehide', tvRestore);
  }
  if (TV) { tvSnap(); tvLock(); }

  /* ================= T-228 USERNAME BOX (Nov 3 2026) =================
     Copy of My Page's T-260 box on every student sign-in std.js handles. The page's own email
     input stays in the page (hidden, data-gal-un-orig) and always holds username + suffix, so
     the page reads it, validates it and saves it exactly as before — no grades split.
       - visible box: the username, then a fixed "@s.sfusd.edu" inside the same border;
       - a pasted / autofilled / programmatic full email keeps only the part before @; if its
         domain is @sfusd.edu or @s.sfusd.edu, that domain is kept (Period 1 stays @sfusd.edu);
       - typing "@" jumps past the fixed part (the domain they go on typing is dropped);
       - the page setting its own email box (remembered student, teacher view, "Not you?")
         shows up in the username box;
       - Enter signs in (presses the box's Start button, unless a <form> submits by itself).
     T-264 (Nov 4): also finds email boxes known only by autocomplete="email" (eld103/unit1 #ge);
     say/, eld103/ch3_index and fluency now load std.js in their <head>. */
  var UN_SUFFIX = '@s.sfusd.edu', UN_N = 0;
  var VDESC = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  function emailVal(el) {
    var v = String((el && el.value) || '').trim();
    var suf = el && el.getAttribute && el.getAttribute('data-email-suffix');
    if (v && suf && v.indexOf('@') < 0) v += suf;
    return v;
  }
  function unFire(el) { try { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {} }
  function unEligible(orig) {
    if (!orig || orig.__galUn || orig.tagName !== 'INPUT') return null;
    if (orig.type === 'hidden' || orig.type === 'password' || orig.readOnly || orig.disabled) return null;
    if (orig.hasAttribute('data-email-suffix') || orig.getAttribute('data-gal-un')) return null;   /* My Page has its own */
    if (TEACHER_PATH.test(location.pathname) || /dashboard|teacher/i.test(location.pathname)) return null;
    if (!shown(orig)) return null;                                     /* try again once it shows */
    if (document.activeElement === orig && VDESC.get.call(orig)) return null;   /* mid-typing: wait for focusout */
    var box = orig.closest('[data-gal-std]') || boxFor(orig);
    if (!box || box.querySelector('input[type=password]') || !startButton(box)) return null;
    if (fieldKind(orig, box) !== 'email') return null;
    return box;
  }
  function unWrap(orig, box) {
    orig.__galUn = true;
    var hadFocus = document.activeElement === orig;           /* autofocus pages (sept11) */
    var cs = getComputedStyle(orig), r = orig.getBoundingClientRect(), par = orig.parentElement, pcs = getComputedStyle(par);
    var room = par.clientWidth - (parseFloat(pcs.paddingLeft) || 0) - (parseFloat(pcs.paddingRight) || 0);
    var wrap = document.createElement('div');
    wrap.className = 'gal-un notranslate'; wrap.setAttribute('translate', 'no');
    var W = wrap.style;
    ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopStyle', 'borderRightStyle',
     'borderBottomStyle', 'borderLeftStyle', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
     'borderRadius', 'backgroundColor', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'boxShadow'
    ].forEach(function (k) { W[k] = cs[k]; });
    var bw = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0) + (parseFloat(cs.borderLeftWidth) || 0);
    if (!bw) { W.border = '2px solid #2b2233'; W.borderRadius = W.borderRadius && W.borderRadius !== '0px' ? W.borderRadius : '10px'; }
    if (/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) W.backgroundColor = '#fff';
    W.width = (Math.abs(r.width - room) < 4 || cs.display === 'block' && /%/.test(orig.style.width || '')) ? '100%' : Math.round(r.width) + 'px';
    W.maxWidth = '100%';
    if (r.width < 230 && W.width !== '100%') W.width = '260px';          /* room for the username AND the suffix */

    var inp = document.createElement('input');
    inp.type = 'text';
    inp.id = 'galUserEmail' + (++UN_N) + (orig.id ? '_' + orig.id : '');
    inp.setAttribute('data-gal-un', '1');
    inp.setAttribute('data-email-suffix', UN_SUFFIX);
    inp.setAttribute('placeholder', 'username');
    inp.setAttribute('aria-label', 'School email username');
    inp.setAttribute('autocomplete', 'off'); inp.setAttribute('autocapitalize', 'off');
    inp.setAttribute('autocorrect', 'off'); inp.setAttribute('spellcheck', 'false');
    var I = inp.style;
    [['border', '0'], ['background', 'transparent'], ['box-shadow', 'none'], ['outline', 'none'], ['margin', '0'],
     ['width', 'auto'], ['min-width', '0'], ['max-width', 'none'], ['flex', '1 1 auto'], ['height', 'auto'],
     ['padding-right', '2px'], ['border-radius', '0']
    ].forEach(function (p) { I.setProperty(p[0], p[1], 'important'); });
    ['paddingTop', 'paddingBottom', 'paddingLeft', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'letterSpacing']
      .forEach(function (k) { I[k] = cs[k]; });
    var suf = document.createElement('span');
    suf.className = 'gal-un-suf'; suf.setAttribute('aria-hidden', 'true'); suf.textContent = UN_SUFFIX;
    suf.style.fontSize = cs.fontSize; suf.style.fontFamily = cs.fontFamily;
    suf.style.paddingRight = cs.paddingRight; suf.style.paddingTop = cs.paddingTop; suf.style.paddingBottom = cs.paddingBottom;
    wrap.appendChild(inp); wrap.appendChild(suf);
    wrap.addEventListener('mousedown', function (e) { if (e.target !== inp) { e.preventDefault(); inp.focus(); } });
    orig.parentNode.insertBefore(wrap, orig);
    orig.setAttribute('data-gal-un-orig', '1');
    orig.style.setProperty('display', 'none', 'important');
    orig.tabIndex = -1;
    if (orig.id) { var lab = document.querySelector('label[for="' + orig.id + '"]'); if (lab) lab.htmlFor = inp.id; }

    var syncing = false, lastVal = '', afterAt = false;
    function setSuffix(sx) { inp.setAttribute('data-email-suffix', sx); suf.textContent = sx; }
    function clean(v) {
      v = String(v == null ? '' : v).replace(/\s+/g, '');
      var i = v.indexOf('@');
      if (i > -1) {
        var dom = v.slice(i).toLowerCase();
        if (dom === '@sfusd.edu' || dom === '@s.sfusd.edu') setSuffix(dom);
        v = v.slice(0, i);
      }
      if (!v) setSuffix(UN_SUFFIX);
      return v;
    }
    function toOrig(fire) {
      var u = VDESC.get.call(inp).trim(), full = u ? u + inp.getAttribute('data-email-suffix') : '';
      if (VDESC.get.call(orig) === full) return;
      syncing = true; try { VDESC.set.call(orig, full); } finally { syncing = false; }
      if (fire) unFire(orig);
    }
    /* anything that sets the username box in code (fill-ins, teacher view, "Not you?") */
    Object.defineProperty(inp, 'value', { configurable: true,
      get: function () { return VDESC.get.call(this); },
      set: function (x) { var v = clean(x); VDESC.set.call(this, v); lastVal = v; afterAt = false; toOrig(true); } });
    /* the page setting its own (hidden) email box shows in the username box */
    Object.defineProperty(orig, 'value', { configurable: true,
      get: function () { return VDESC.get.call(this); },
      set: function (x) {
        VDESC.set.call(this, x);
        if (syncing) return;
        var v = clean(x);
        if (VDESC.get.call(inp) !== v) VDESC.set.call(inp, v);
        lastVal = v; afterAt = false;
        if (x && String(x).indexOf('@') < 0) { syncing = true; try { VDESC.set.call(this, v ? v + inp.getAttribute('data-email-suffix') : ''); } finally { syncing = false; } }
      } });
    inp.addEventListener('input', function (e) {
      var raw = VDESC.get.call(inp), t = (e && e.inputType) || '';
      if (afterAt && /^insert/.test(t) && t !== 'insertFromPaste' && raw.length > lastVal.length) {   /* the domain after a typed @ */
        VDESC.set.call(inp, lastVal); return;
      }
      if (/^delete/.test(t)) afterAt = false;
      var at = raw.indexOf('@'), bare = at > -1 && raw.slice(at).length === 1 && /^insert/.test(t) && t !== 'insertFromPaste';
      var v = clean(raw);
      if (v !== raw) VDESC.set.call(inp, v);
      if (bare && v) afterAt = true;
      lastVal = v;
      toOrig(true);
    });
    inp.addEventListener('blur', function () { afterAt = false; });
    inp.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.defaultPrevented || e.isComposing) return;
      toOrig(false);
      if (inp.form) return;                              /* the form submits itself (implicit submission) */
      var b = startButton(box);
      if (b) { e.preventDefault(); e.stopPropagation(); b.click(); }   /* T-264: once — a box-level Enter handler would press it again */
    });
    /* start from whatever the page (or the browser) already put in its box */
    var start = VDESC.get.call(orig);
    if (start) { var v0 = clean(start); VDESC.set.call(inp, v0); lastVal = v0; if (start.indexOf('@') < 0) toOrig(false); }
    orig.__galUnInput = inp;
    if (hadFocus) try { inp.focus(); } catch (e) {}
  }
  function unScan() {
    var ems = document.querySelectorAll('input[type=email], input[id*=mail i], input[name*=mail i], input[autocomplete=email]');
    for (var i = 0; i < ems.length; i++) {
      var box = unEligible(ems[i]);
      if (box) { try { unWrap(ems[i], box); } catch (e) { try { console.warn('T-228 username box', e); } catch (x) {} } }
    }
  }

  /* ================= T-272 PAGES UPDATE THEMSELVES (Nov 4 2026) =================
     Students leave tabs open for days, so a push can leave old code running in class (Xingqi's
     Story Check kept a retired item until Toby reloaded). std.js remembers what this tab is running
     and checks the server again after a sign-in, whenever the tab becomes visible, and every 10
     minutes while it is open:
       - the page's HTML (its inline scripts are compared with the ones in this tab, so a page served
         stale from the ~10-minute GitHub Pages cache is caught too) and every /readings/ script it
         loads (content.js, engine.js, items.js…), fetched cache:'no-store' and hashed;
       - if anything changed: wait until the student has not typed for 3 s (and no voice, recording
         or audio is playing); run the page's own save (blur + its pagehide/beforeunload handlers)
         and wait until every save to the server has come back OK; green bar "Mr. Toby updated this
         page — loading the new version…" (tap a word to translate it); reload after ~2 s;
       - after the reload the sign-in box is filled in again ("Signed in as … — Not you?") and the
         student taps Start (T-167). A save that fails or never answers = NO reload, red bar instead;
       - never in teacher view, on dashboards or teacher pages. Tests (landlady/test, reel-test
         ?mode=test, or window.GAL_IS_TEST) get the green bar with a "Reload when you finish" button;
       - at most one reload per new version per tab (and 3 per tab per hour), so it can never loop.
     Opt out: window.GAL_NO_UPDATE = true. */
  var UPD = { base: null, busy: false, waiting: false, lastKey: 0, streams: [], tried: {}, timer: null };
  function updOff() {
    return !!TV || TEACHER_PATH.test(location.pathname) || !/^https?:$/.test(location.protocol) || !!window.GAL_NO_UPDATE;
  }
  function updIsTest() {
    if (window.GAL_IS_TEST) return true;
    if (/\/readings\/landlady\/test\/(index\.html)?$/.test(location.pathname) && !/[?&]practice=1/.test(location.search)) return true;
    return /\/readings\/reel-test\//.test(location.pathname) && /[?&]mode=test\b/.test(location.search);
  }
  function updHash(t) {
    var h = 5381; t = String(t || '');
    for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36) + '.' + t.length;
  }
  function updGet(url, mode) {
    return fetch(url, { cache: mode || 'no-store', credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.text() : null; }).catch(function () { return null; });
  }
  function updInline(html) {                    /* the page's inline scripts, from source text */
    var out = [], re = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi, m;
    while ((m = re.exec(html))) { var t = m[1].trim(); if (t) out.push(updHash(t)); }
    return out.join('|');
  }
  function updDomInline() {
    var out = [], ss = document.querySelectorAll('script:not([src])');
    for (var i = 0; i < ss.length; i++) {
      if (ss[i].getAttribute('data-gal')) continue;
      var t = (ss[i].textContent || '').trim(); if (t) out.push(updHash(t));
    }
    return out.join('|');
  }
  function updScripts() {
    var out = [], ss = document.querySelectorAll('script[src]');
    for (var i = 0; i < ss.length && out.length < 12; i++) {
      try {
        var u = new URL(ss[i].src, location.href);
        if (u.origin === location.origin && /^\/readings\//.test(u.pathname) && out.indexOf(u.pathname) < 0) out.push(u.pathname);
      } catch (e) {}
    }
    return out;
  }
  function updPageUrl() { return location.pathname; }
  /* what this tab runs: inline scripts from the DOM; external scripts as the browser cached them */
  function updBaseline() {
    var paths = updScripts(), base = { inline: updDomInline(), html: null, js: {} };
    return Promise.all([updGet(updPageUrl(), 'force-cache').then(function (t) { if (t != null) base.html = updHash(t); })]
      .concat(paths.map(function (p) {
        return updGet(p, 'force-cache').then(function (t) { if (t != null) base.js[p] = updHash(t); });
      }))).then(function () { UPD.base = base; return base; });
  }
  /* returns a signature of the server's version when it differs from this tab, else '' */
  function updCompare() {
    var b = UPD.base; if (!b) return Promise.resolve('');
    var paths = Object.keys(b.js), sig = [], changed = false;
    return Promise.all([updGet(updPageUrl()).then(function (t) {
      if (t == null) return;
      var h = updHash(t); sig.push(h);
      /* the HTML changed if its inline scripts differ from this tab's, or its text differs from the cached copy */
      var inl = updInline(t);
      if (inl && b.inline && inl !== b.inline) changed = true;
      else if (b.html && h !== b.html) changed = true;
    })].concat(paths.map(function (p) {
      return updGet(p).then(function (t) {
        if (t == null) return;
        var h = updHash(t); sig.push(p + ':' + h);
        if (b.js[p] && h !== b.js[p]) changed = true;
      });
    }))).then(function () { return changed ? sig.join(',') : ''; });
  }
  /* every save to Supabase is watched, so the reload only happens once the save is confirmed */
  var UPDW = window.__UPDW = { pending: 0, fails: 0, oks: 0, lastOk: true };   /* lastOk: the most recent save came back OK */
  function updIsWrite(url, method) {
    method = String(method || 'GET').toUpperCase();
    return method !== 'GET' && method !== 'HEAD' && /supabase\.co\/(rest|storage)\/v1\//.test(String(url || ''));
  }
  function updWatchWrites() {
    if (window.__GAL_UPDW__ || !window.fetch) return; window.__GAL_UPDW__ = true;
    var inner = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var method = (init && init.method) || (input && input.method) || 'GET';
      var p = inner.apply(this, arguments);
      if (!updIsWrite(url, method)) return p;
      UPDW.pending++;
      return p.then(function (r) { UPDW.pending--; if (r && r.ok) { UPDW.oks++; UPDW.lastOk = true; } else { UPDW.fails++; UPDW.lastOk = false; } return r; },
        function (e) { UPDW.pending--; UPDW.fails++; UPDW.lastOk = false; throw e; });
    };
    try {
      var XO = XMLHttpRequest.prototype.open, XS = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (m, u) { this.__updW = updIsWrite(u, m); return XO.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function () {
        if (this.__updW) {
          var x = this; UPDW.pending++;
          x.addEventListener('loadend', function () { UPDW.pending--; if (x.status >= 200 && x.status < 300) { UPDW.oks++; UPDW.lastOk = true; } else { UPDW.fails++; UPDW.lastOk = false; } });
        }
        return XS.apply(this, arguments);
      };
    } catch (e) {}
  }
  function updBoot() {
    if (updOff()) return;
    updWatchWrites();
    document.addEventListener('keydown', function () { UPD.lastKey = Date.now(); }, true);
    document.addEventListener('input', function () { UPD.lastKey = Date.now(); }, true);
    try {                                              /* a reload never cuts a recording */
      var md = navigator.mediaDevices;
      if (md && md.getUserMedia && !md.__galUpd) {
        var gum = md.getUserMedia.bind(md); md.__galUpd = 1;
        md.getUserMedia = function () {
          return gum.apply(null, arguments).then(function (st) { UPD.streams.push(st); if (UPD.streams.length > 20) UPD.streams.shift(); return st; });
        };
      }
    } catch (e) {}
    try { UPD.tried = JSON.parse(sessionStorage.getItem('gal_upd_tried') || '{}') || {}; } catch (e) { UPD.tried = {}; }
    updBaseline();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') setTimeout(function () { updCheck('return'); }, 800);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) updCheck('return'); });
    UPD.timer = setInterval(function () { updCheck('timer'); }, 10 * 60 * 1000);
    try {
      if (sessionStorage.getItem('gal_upd_done')) {
        sessionStorage.removeItem('gal_upd_done');
        updBar('green', '\u2705 This is the newest version. Your work was saved.', null, 7000);
      }
    } catch (e) {}
    window.__galUpdCheck = updCheck; window.__galUpdCompare = updCompare;   /* for tests */
  }
  function updBusyStudent() {
    var a = document.activeElement;
    var texty = a && (a.isContentEditable || a.tagName === 'TEXTAREA' ||
      (a.tagName === 'INPUT' && !/^(button|submit|checkbox|radio|range|color|file|reset|image)$/i.test(a.type || '')));
    if (texty && Date.now() - UPD.lastKey < 3000) return true;
    if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) return true;
    for (var i = 0; i < UPD.streams.length; i++) {
      var tr = UPD.streams[i].getTracks ? UPD.streams[i].getTracks() : [];
      for (var j = 0; j < tr.length; j++) if (tr[j].readyState === 'live') return true;
    }
    var ms = document.querySelectorAll('audio, video');
    for (var k = 0; k < ms.length; k++) if (!ms[k].paused && !ms[k].ended) return true;
    return false;
  }
  function updCheck(why) {
    if (updOff() || UPD.busy || UPD.waiting || !UPD.base) return;
    if (document.visibilityState && document.visibilityState !== 'visible') return;
    UPD.busy = true;
    updCompare().then(function (sig) {
      UPD.busy = false;
      if (!sig || UPD.tried[sig]) return;                 /* nothing new, or already reloaded for this version */
      var hour = Date.now() - 3600 * 1000, recent = 0;
      for (var k in UPD.tried) if (UPD.tried[k] > hour) recent++;
      if (recent >= 3) return;
      updReady(sig);
    }, function () { UPD.busy = false; });
  }
  function updBar(kind, text, btn, ms) {
    var b = document.getElementById('galUpdBar');
    if (!b) {
      b = document.createElement('div'); b.id = 'galUpdBar';
      b.setAttribute('translate', 'no'); b.className = 'notranslate';
      document.body.appendChild(b);
    }
    var bg = kind === 'red' ? '#b3261e' : '#1f7a4d';
    b.style.cssText = 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:2147483640;max-width:92vw;' +
      'background:' + bg + ';color:#fff;border:2px solid #1d1a24;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.3);' +
      'padding:10px 18px;font:800 18px/1.35 Nunito,system-ui,-apple-system,Segoe UI,Arial,sans-serif;text-align:center;' +
      'display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap';
    b.innerHTML = '<span class="gal-upd-t" style="cursor:text"></span>';
    b.querySelector('.gal-upd-t').textContent = text;
    if (btn) {
      var x = document.createElement('button'); x.type = 'button'; x.textContent = btn.label;
      x.style.cssText = 'font:inherit;font-size:16px;background:#fff;color:#1d1a24;border:2px solid #1d1a24;border-radius:999px;padding:6px 14px;cursor:pointer';
      x.onclick = btn.go; b.appendChild(x);
    }
    if (ms) setTimeout(function () { if (b.parentNode && b.querySelector('.gal-upd-t').textContent === text) b.parentNode.removeChild(b); }, ms);
  }
  function updReady(sig) {
    UPD.waiting = true;
    if (updIsTest()) {                                     /* a test in progress is never interrupted */
      updBar('green', 'Mr. Toby updated this page.', { label: 'Reload when you finish', go: function () { updSaveAndReload(sig, true); } });
      UPD.waiting = false;
      return;
    }
    (function wait() {
      if (updBusyStudent() || document.visibilityState === 'hidden') return setTimeout(wait, 1000);
      updSaveAndReload(sig, false);
    })();
  }
  function updSaveAndReload(sig, manual) {
    UPD.waiting = true;
    var oks0 = UPDW.oks, fails0 = UPDW.fails;
    try { var a = document.activeElement; if (a && a.blur && a !== document.body) a.blur(); } catch (e) {}
    try { if (typeof window.GAL_flushSave === 'function') window.GAL_flushSave(); } catch (e) {}
    /* the page's own leave-save path (they all save on pagehide / beforeunload) */
    try { window.dispatchEvent(new Event('beforeunload')); } catch (e) {}
    try { window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })); } catch (e) {
      try { window.dispatchEvent(new Event('pagehide')); } catch (e2) {} }
    var t0 = Date.now();
    (function settle() {
      var waited = Date.now() - t0;
      if ((UPDW.pending > 0 || waited < 700) && waited < 8000) return setTimeout(settle, 200);
      if (UPDW.pending > 0 || UPDW.fails > fails0 || !UPDW.lastOk) {    /* not confirmed (or the last save failed): never reload over unsaved work */
        UPD.waiting = false;
        updBar('red', '\u26a0\ufe0f Can\u2019t reach the server \u2014 your work is not saved yet. Keep this page open.', null, 0);
        return;
      }
      updBar('green', 'Mr. Toby updated this page \u2014 loading the new version\u2026');
      setTimeout(function () {
        UPD.tried[sig] = Date.now();
        try {
          sessionStorage.setItem('gal_upd_tried', JSON.stringify(UPD.tried));
          sessionStorage.setItem('gal_upd_done', '1');
        } catch (e) {}
        try { if (sess()) remember(null, null, null); } catch (e) {}    /* keep a still-valid sign-in fresh for the refill */
        location.reload();
      }, 2000);
    })();
  }

  /* ================= T-148 PRACTICE LOG (Nov 5 2026) =================
     Per student, per page, per day: active minutes, 🔊 taps and translations, added up in practice_log
     through the practice_add RPC (adds to the row, never overwrites). Teacher page:
     https://tobiasrugger.github.io/readings/practice/dashboard.html (password galileo2026).
     ACTIVE = the tab is visible AND the student touched, typed, scrolled or moved the mouse in the last
     60 s; counted in 5 s steps. A 🔊 TAP = sound (speech or a recording) that starts within 1.5 s of a
     tap/click/key — at most one per tap, so a reel line that plays after Play counts once, and sound the
     page starts by itself counts zero. A TRANSLATION = a call to the translation proxy within 1.5 s of a
     tap, at most one per tap (directions translated on page load count zero).
     Only counted past the sign-in box (no email field showing) with a signed-in student (gal_student_email,
     70-min session). Off in teacher view, on teacher pages, for robots and test runs (GAL_PRACTICE_TEST
     turns it on in tests). Sent every 60 s and when the student leaves (keepalive). Never throws. */
  var PL = { b: {}, act: 0, gest: 0, spoke: -1, trd: -1, real: null, sending: false };
  function plOff() {
    try {
      if (window.GAL_PRACTICE_TEST) return false;
      if (window.GAL_TEACHER_VIEW || /[?&]view=teacher\b/.test(location.search)) return true;
      if (navigator.webdriver || /[?&](robot|test|teacher)=/.test(location.search)) return true;
      if (/\/(robot|audit|dashboards?|gradebook|desk|health|practice|shelves|atlas|year|roadmap|teacher|reports|assign|spell|simple)(\/|\.html|$)/i.test(location.pathname)) return true;
      if (/dashboard|teacher/i.test(location.pathname)) return true;
      return !/^https?:$/.test(location.protocol);
    } catch (e) { return true; }
  }
  function plDay() {
    try { return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }); }
    catch (e) { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  }
  function plPage() {
    var p = location.pathname.replace(/^\/readings\//, '').replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '') || 'root';
    var q = [];
    location.search.replace(/[?&](set|lesson|a|p|deck|q|ep|level)=([^&]*)/g, function (_, k, v) { q.push(k + '=' + decodeURIComponent(v)); return ''; });
    return (p + (q.length ? '?' + q.join('&') : '')).slice(0, 200);
  }
  function plSignInShowing() {
    try {
      var els = document.querySelectorAll('.gal-un, input[type=email], input[id*=mail i], input[name*=mail i]');
      for (var i = 0; i < els.length; i++) if (shown(els[i])) return true;
    } catch (e) {}
    return false;
  }
  function plWho() {
    if (plSignInShowing()) return null;
    var s = sess();
    if (s && s.email) { PL.tabWho = s.email; return s.email; }
    /* past the 70-min sign-in window but still the same student in this tab (a long block): keep counting */
    var raw = ''; try { raw = localStorage.getItem('gal_student_email') || ''; } catch (e) {}
    return (raw && PL.tabWho && window.GAL.same(raw, PL.tabWho)) ? raw : null;
  }
  function plBucket() {
    var em = plWho(); if (!em) return null;
    var k = window.GAL.key(em) + '|' + plDay() + '|' + plPage();
    return PL.b[k] || (PL.b[k] = { who: window.GAL.key(em), email: em.toLowerCase(), day: plDay(), page: plPage(), secs: 0, speaks: 0, trs: 0 });
  }
  function plTap() {                                 /* one count per tap, per kind */
    if (Date.now() - PL.gest > 1500) return null;
    return PL.gest;
  }
  function plSpeak() {
    try { var g = plTap(); if (g == null || PL.spoke === g) return; var b = plBucket(); if (!b) return; PL.spoke = g; b.speaks++; } catch (e) {}
  }
  function plTrans() {
    try { var g = plTap(); if (g == null || PL.trd === g) return; var b = plBucket(); if (!b) return; PL.trd = g; b.trs++; } catch (e) {}
  }
  function plSend(leaving) {
    try {
      var keys = Object.keys(PL.b); if (!keys.length) return;
      keys.forEach(function (k) {
        var b = PL.b[k]; delete PL.b[k];
        if (!b.secs && !b.speaks && !b.trs) return;
        var body = { p_who: b.who, p_email: b.email, p_day: b.day, p_page: b.page, p_secs: b.secs, p_speaks: b.speaks, p_trs: b.trs };
        var back = function () {                     /* failed: add the counts back for the next try */
          var c = PL.b[k] || (PL.b[k] = { who: b.who, email: b.email, day: b.day, page: b.page, secs: 0, speaks: 0, trs: 0 });
          c.secs += b.secs; c.speaks += b.speaks; c.trs += b.trs;
        };
        (PL.real || window.fetch).call(window, SUPA_URL + '/rest/v1/rpc/practice_add', { method: 'POST', keepalive: !!leaving,
          headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify(body) }).then(function (r) { if (!r.ok && !leaving) back(); }, function () { if (!leaving) back(); });
      });
    } catch (e) {}
  }
  function plBoot() {
    if (plOff() || window.__GAL_PL__) return;
    window.__GAL_PL__ = true;
    var now = function () { return Date.now(); };
    var gesture = function () { PL.gest = PL.act = now(); };
    var stir = function () { PL.act = now(); };
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { document.addEventListener(t, gesture, { capture: true, passive: true }); });
    ['scroll', 'mousemove', 'wheel', 'input'].forEach(function (t) { document.addEventListener(t, stir, { capture: true, passive: true }); });
    PL.act = now();
    /* sound: speech and recordings */
    try {
      var ss = window.speechSynthesis;
      if (ss && !ss.__galPL) { ss.__galPL = 1; var sp = ss.speak; ss.speak = function () { plSpeak(); return sp.apply(this, arguments); }; }
    } catch (e) {}
    try {
      var MP = window.HTMLMediaElement && HTMLMediaElement.prototype;
      if (MP && !MP.__galPL) { MP.__galPL = 1; var pl = MP.play; MP.play = function () { plSpeak(); return pl.apply(this, arguments); }; }
    } catch (e) {}
    /* translations: the proxy (any page) and the Google fallback the reel uses */
    try {
      var real = PL.real = window.fetch;
      window.fetch = function (input) {
        try {
          var u = (typeof input === 'string') ? input : (input && input.url) || '';
          if ((u.indexOf('script.google.com') >= 0 && u.indexOf('action=translate') >= 0) || u.indexOf('translate.googleapis.com') >= 0) plTrans();
        } catch (e) {}
        return real.apply(this, arguments);
      };
    } catch (e) {}
    setInterval(function () {
      try {
        if (document.visibilityState !== 'visible' || now() - PL.act > 60000) return;
        var b = plBucket(); if (b) b.secs += 5;
      } catch (e) {}
    }, 5000);
    setInterval(function () { plSend(false); }, 60000);
    window.addEventListener('pagehide', function () { plSend(true); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') plSend(true); });
    window.GAL.practiceFlush = function () { plSend(false); };   /* tests */
    window.GAL.practiceState = function () { return PL.b; };
  }

  /* ================= T-337 WHO WROTE IT (Nov 6 2026) =================
     Students sign in by picking a name, with no password, so one student could sign in as
     another. Toby wants deterrence and a trail, NOT passwords:
     1. DEVICE TRAIL. Each browser gets a random device code on first load (localStorage
        gal_device, e.g. "K7Q2-M9XD"; machine setting, not student work). Every save a student
        page sends to Supabase records username (GAL.key), device, page, day and period in
        device_log through rpc device_add (adds, never overwrites).
     2. WORD FLAGS. The text inside each save is checked against a short list (English, Spanish,
        Chinese, Arabic, Vietnamese, Thai, Nepali). A hit goes to word_flags through rpc flag_add.
        The student sees nothing different; nothing is blocked or deleted.
     3. A short, friendly line in every sign-in box: Mr. Toby can see which computer saves your
        work. Translated (six languages built in, others through the proxy).
     Teacher page: https://tobiasrugger.github.io/readings/trail/dashboard.html (pw galileo2026).
     Off in teacher view, on teacher pages and for robots (GAL_TRAIL_TEST turns it on in tests). */
  var TR = { real: null, b: {}, seen: {}, kind: '' };
  function trOff() {
    if (window.GAL_TRAIL_TEST) return false;
    var save = window.GAL_PRACTICE_TEST; window.GAL_PRACTICE_TEST = false;
    var off = plOff(); window.GAL_PRACTICE_TEST = save; return off;
  }
  function trDevice() {
    var d = '';
    try { d = localStorage.getItem('gal_device') || ''; } catch (e) {}
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(d)) {
      var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '', r = new Uint8Array(8);
      try { crypto.getRandomValues(r); } catch (e) { for (var j = 0; j < 8; j++) r[j] = Math.floor(Math.random() * 256); }
      for (var i = 0; i < 8; i++) s += A[r[i] % A.length] + (i === 3 ? '-' : '');
      d = s; try { localStorage.setItem('gal_device', d); } catch (e) {}
    }
    return d;
  }
  function trKind() {
    if (TR.kind) return TR.kind;
    var u = navigator.userAgent || '', k = 'Computer';
    if (/CrOS/.test(u)) k = 'Chromebook';
    else if (/iPad/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) k = 'iPad';
    else if (/iPhone/.test(u)) k = 'iPhone';
    else if (/Android/.test(u)) k = /Mobile/.test(u) ? 'Android phone' : 'Android tablet';
    else if (/Windows/.test(u)) k = 'Windows';
    else if (/Macintosh/.test(u)) k = 'Mac';
    try { k += ' ' + screen.width + '\u00d7' + screen.height; } catch (e) {}
    return (TR.kind = k);
  }
  /* --- the word list. Plain words match whole words; "*" = any ending; "~" = anywhere in the
     text (Chinese, Thai, Devanagari and long Arabic words have no spaces to lean on). Words that
     are also everyday words (dog, donkey, your mom, chicken) are left out on purpose. --- */
  var TR_WORDS = [
    /* English */ 'fuck*','motherfuck*','fck','fuk','shit*','bullshit','bitch*','asshole*','ass','dick','dicks','dickhead*','pussy','cunt*','cock','cocks',
    'nigga*','nigger*','fag','fags','faggot*','whore*','slut*','bastard*','retard*','kys','kill yourself','kill urself','go die','porn*','stfu',
    /* Spanish */ 'puta*','puto*','pendej*','cabron*','cabrón*','mierda*','verga*','chinga*','culer*','culo','maric*','coño','joder','jodid*','zorra*','perra*','pinche*','hijueputa','malparid*','mamaguev*','mátate','matate',
    /* Vietnamese */ 'địt','đụ','đĩ','lồn','cặc','buồi','đéo','vcl','mẹ mày','đồ khốn',
    /* Chinese (Mandarin + Cantonese) */ '~傻逼','~傻b','~煞笔','~他妈的','~他媽的','~操你','~肏','~滚蛋','~滾蛋','~鸡巴','~雞巴','~婊子','~草泥马','~去死','~贱人','~賤人','~王八蛋','~狗日','~屌你','~仆街','~撚','~𨳒','~戇鳩','~臭西',
    /* Arabic */ 'كس','كسمك','كس امك','كس أمك','~شرموط','~منيوك','~عاهرة','~قحبة','~يلعن','زب','زبي','خرا','ابن الكلب','يا حمار','يا كلب',
    /* Thai */ '~เหี้ย','~ควย','~เย็ด','~ไอ้สัตว์','~อีดอก','~ส้นตีน','~แม่ง',
    /* Nepali / Hindi (Devanagari + typed in English letters) */ '~मुजी','~मुजि','~रन्डी','~रण्डी','~मादरचोद','~भोसडी','~चुतिया','चिक','muji','randi','madarchod','machikne','bhosdi*','chutiya','chutiye'
  ];
  var TR_RX = null;
  function trRx() {
    if (TR_RX) return TR_RX;
    TR_RX = [];
    var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
    TR_WORDS.forEach(function (w) {
      var any = w.charAt(0) === '~', star = w.slice(-1) === '*', core = w.replace(/^~/, '').replace(/\*$/, '');
      var src = esc(core).replace(/ /g, '[\\s_.-]+') + (star ? '[\\p{L}\\p{M}]*' : '');
      try { TR_RX.push([core, any ? new RegExp(src, 'iu') : new RegExp('(?:^|[^\\p{L}\\p{M}\\p{N}])(' + src + ')(?=$|[^\\p{L}\\p{M}\\p{N}])', 'iu')]); } catch (e) {}
    });
    /* f*ck, sh!t, b1tch */
    TR_RX.push(['f*ck', /(?:^|[^a-z])f[\W_]{1,3}c?k/i], ['sh*t', /(?:^|[^a-z])sh[*!1@]+t/i], ['b*tch', /(?:^|[^a-z])b[*!1@]+tch/i]);
    return TR_RX;
  }
  var TR_SKIPKEY = /^(email|e|lang|.*_lang|set_slug|slug|guide_key|period|level|id|key|test_key|ep|episode|kind|src|url|href|audio|path|.*_at|.*_url|.*_path|color|colour)$/i;
  function trStrings(o, out, k, depth) {
    if (out.length > 400 || depth > 8 || o == null) return out;
    if (typeof o === 'string') { if (o.length > 1 && !TR_SKIPKEY.test(k || '') && !/^data:/.test(o)) out.push(o); return out; }
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) trStrings(o[i], out, k, depth + 1); return out; }
    if (typeof o === 'object') { for (var p in o) if (Object.prototype.hasOwnProperty.call(o, p)) trStrings(o[p], out, p, depth + 1); }
    return out;
  }
  function trScan(text) {
    var R = trRx(), low = String(text).normalize ? String(text).normalize('NFC') : String(text);
    for (var i = 0; i < R.length; i++) {
      var m = R[i][1].exec(low);
      if (m) {
        var at = m.index + (m[0].length - (m[1] || m[0]).length);
        return { word: R[i][0], at: at, len: (m[1] || m[0]).length };
      }
    }
    return null;
  }
  function trRpc(fn, body, leaving) {
    return (TR.real || window.fetch).call(window, SUPA_URL + '/rest/v1/rpc/' + fn, { method: 'POST', keepalive: !!leaving,
      headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(body) });
  }
  function trSend(leaving) {
    try {
      Object.keys(TR.b).forEach(function (k) {
        var b = TR.b[k]; if (!b.saves) return;
        var n = b.saves; b.saves = 0;
        trRpc('device_add', { p_who: b.who, p_email: b.email, p_device: b.device, p_kind: b.kind, p_day: b.day, p_page: b.page, p_period: b.period, p_saves: n }, leaving)
          .then(function (r) { if (!r.ok && !leaving) b.saves += n; }, function () { if (!leaving) b.saves += n; });
      });
    } catch (e) {}
  }
  function trNote(url, init) {
    var body = null, raw = init && init.body;
    if (typeof raw === 'string') { try { body = JSON.parse(raw); } catch (e) {} }
    var row = Array.isArray(body) ? body[0] : body;
    var email = (row && typeof row.email === 'string' && row.email) || '';
    if (!email) { var m = /[?&]email=eq\.([^&]+)/.exec(url); if (m) email = decodeURIComponent(m[1]); }
    if (!email) { var s = sess(); email = (s && s.email) || ''; }
    var who = window.GAL.key(email); if (!who) return;
    var s2 = sess() || {}, period = String((row && row.period) || s2.period || '').slice(0, 10);
    var day = plDay(), page = plPage(), dev = trDevice(), first = false;
    var k = who + '|' + day + '|' + page;
    var b = TR.b[k];
    if (!b) { b = TR.b[k] = { who: who, email: email.toLowerCase(), device: dev, kind: trKind(), day: day, page: page, period: period, saves: 0 }; first = true; }
    if (period) b.period = period;
    b.saves++;
    if (first) trSend(document.visibilityState === 'hidden');        /* first save on a page: record at once */
    /* word check */
    if (!body) return;
    var tbl = (url.split('/rest/v1/')[1] || '').split('?')[0];
    trStrings(body, [], '', 0).forEach(function (t) {
      var hit = trScan(t); if (!hit) return;
      var snip = t.slice(Math.max(0, hit.at - 80), hit.at + hit.len + 80);
      var sk = who + '|' + page + '|' + hit.word + '|' + snip;
      if (TR.seen[sk]) return; TR.seen[sk] = 1;
      trRpc('flag_add', { p_who: who, p_email: email.toLowerCase(), p_device: dev, p_kind: trKind(), p_day: day, p_page: page, p_period: period,
        p_word: hit.word, p_text: snip.slice(0, 400), p_tbl: tbl.slice(0, 60) }, document.visibilityState === 'hidden').then(function () {}, function () {});
    });
  }
  var TR_SKIPTBL = /^(rpc\/|song_tr|news_translations|page_errors|practice_log|device_log|word_flags|activity_attempts|response_history|gal_settings|grade_ticks|class_assignments)/;
  function trBoot() {
    if (trOff() || window.__GAL_TRAIL__) return;
    window.__GAL_TRAIL__ = true;
    trDevice();
    try {
      var real = TR.real = window.fetch;
      window.fetch = function (input, init) {
        try {
          var url = (typeof input === 'string') ? input : (input && input.url) || '';
          var method = String((init && init.method) || 'GET').toUpperCase();
          if (url.indexOf('supabase.co/rest/v1/') >= 0 && /^(POST|PATCH)$/.test(method) &&
              !TR_SKIPTBL.test(url.split('/rest/v1/')[1] || '')) trNote(url, init);
        } catch (e) {}
        return real.apply(this, arguments);
      };
    } catch (e) {}
    setInterval(function () { trSend(false); }, 60000);
    window.addEventListener('pagehide', function () { trSend(true); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') trSend(true); });
    window.GAL.trailState = function () { return { b: TR.b, device: trDevice() }; };   /* tests */
  }
  /* --- the line in the sign-in box (runs even where the trail is off for robots, never on teacher pages) --- */
  var TR_NOTE = 'Mr. Toby can see which computer saves your work. Please sign in only as yourself.';
  var TR_NOTE_T = {
    'es': 'Mr. Toby puede ver qué computadora guarda tu trabajo. Por favor, entra solo con tu propio nombre.',
    'zh-CN': 'Mr. Toby 可以看到是哪台电脑保存了你的作业。请只用你自己的名字登录。',
    'yue': 'Mr. Toby 睇到係邊部電腦儲存你嘅功課。請只用你自己嘅名登入。',
    'ar': 'يستطيع Mr. Toby أن يرى أيّ حاسوب يحفظ عملك. من فضلك سجّل الدخول باسمك أنت فقط.',
    'vi': 'Mr. Toby có thể thấy máy tính nào lưu bài của em. Hãy chỉ đăng nhập bằng tên của chính em.',
    'th': 'Mr. Toby เห็นได้ว่าคอมพิวเตอร์เครื่องไหนบันทึกงานของคุณ กรุณาเข้าสู่ระบบด้วยชื่อของตัวเองเท่านั้น',
    'ne': 'Mr. Toby ले कुन कम्प्युटरले तिम्रो काम सेभ गर्छ भनेर देख्न सक्नुहुन्छ। कृपया आफ्नै नामले मात्र साइन इन गर।'
  };
  /* T-343 (Nov 6): the note is OFF unless Toby switches it on (gal_settings key 'trail_note' {on:true},
     switch on trail/dashboard.html). He would rather not put the idea in anyone's head; the trail itself
     records either way. One read per tab, remembered for 10 minutes (a setting, not student work). */
  var TR_NOTE_ON = null, TR_NOTE_WAIT = [];
  function trNoteOn(cb) {
    if (window.GAL_TRAIL_NOTE_TEST != null) { cb(!!window.GAL_TRAIL_NOTE_TEST); return; }
    if (TR_NOTE_ON !== null) { cb(TR_NOTE_ON); return; }
    try { var c = JSON.parse(sessionStorage.getItem('gal_trail_note') || 'null'); if (c && Date.now() - c.t < 600000) { TR_NOTE_ON = !!c.on; cb(TR_NOTE_ON); return; } } catch (e) {}
    TR_NOTE_WAIT.push(cb); if (TR_NOTE_WAIT.length > 1) return;
    var done = function (on) { TR_NOTE_ON = on; try { sessionStorage.setItem('gal_trail_note', JSON.stringify({ on: on, t: Date.now() })); } catch (e) {}
      var w = TR_NOTE_WAIT; TR_NOTE_WAIT = []; w.forEach(function (f) { try { f(on); } catch (e) {} }); };
    try {
      (TR.real || window.fetch).call(window, SUPA_URL + '/rest/v1/gal_settings?key=eq.trail_note&select=value', { headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) { done(!!(rows && rows[0] && rows[0].value && rows[0].value.on)); }, function () { done(false); });
    } catch (e) { done(false); }
  }
  function trBoxNote(box, btn) {
    trNoteOn(function (on) { if (on) trBoxNote2(box, btn); });
  }
  function trBoxNote2(box, btn) {
    try {
      if (!box || !btn || box.querySelector('.gal-trail-note')) return;
      if (window.GAL_TEACHER_VIEW || /[?&]view=teacher\b/.test(location.search)) return;
      var n = document.createElement('div');
      n.className = 'gal-trail-note';
      n.style.cssText = 'margin:10px 0 2px;padding:7px 10px;border:2px solid #2B2233;border-radius:10px;background:#fff;font-size:13.5px;line-height:1.35;color:#2B2233;text-align:left';
      n.innerHTML = '<span aria-hidden="true">\ud83d\udda5\ufe0f </span><span class="gal-trail-en" translate="no"></span><div class="gal-trail-tr" translate="no" style="color:#5d536a;margin-top:3px"></div>';
      n.querySelector('.gal-trail-en').textContent = TR_NOTE;
      var anchor = childOf(box, btn) || btn;
      if (anchor.nextSibling) anchor.parentNode.insertBefore(n, anchor.nextSibling); else anchor.parentNode.appendChild(n);
      var paint = function () {
        var lg = listenLang(), out = n.querySelector('.gal-trail-tr');
        if (!lg || lg === 'en' || lg === 'en-simple') { out.textContent = ''; return; }
        if (TR_NOTE_T[lg]) { out.textContent = TR_NOTE_T[lg]; out.dir = lg === 'ar' ? 'rtl' : 'ltr'; return; }
        var want = lg;
        proxyTranslate(TR_NOTE, 'sentence', function (v) { if (v && listenLang() === want) { out.textContent = v; out.dir = 'auto'; } });
      };
      paint();
      box.addEventListener('change', function (e) { if (e.target && e.target.tagName === 'SELECT') setTimeout(paint, 80); });
    } catch (e) {}
  }

  function scan() {
    addCSS();
    speakerIcons();
    pfScan();
    myPageScan();
    var ems = document.querySelectorAll('input[type=email], input[id*=mail i], input[name*=mail i], input[autocomplete=email]');
    for (var i = 0; i < ems.length; i++) fixBox(ems[i]);
    unScan();                                           /* T-228 — after fixBox, so the language box copies the page's own field */
  }
  var pending = null;
  function soon() { if (pending) return; pending = setTimeout(function () { pending = null; scan(); }, 150); }
  function boot() {
    wrapFetch();
    try { healthWrap(); } catch (e) {}              /* T-295 */
    warm();
    scan();
    listenBoot();
    myPageBoot();
    pfBoot();
    tvBoot();
    try { updBoot(); } catch (e) {}                  /* T-272 */
    try { plBoot(); } catch (e) {}                   /* T-148 practice log */
    try { trBoot(); } catch (e) {}                   /* T-337 who wrote it */
    try { var gs = document.createElement('script'); gs.src = '/readings/simple/simple.js'; (document.head || document.documentElement).appendChild(gs); } catch (e) {}   /* T-286 English - simple (T-293) */
    try { new MutationObserver(soon).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    /* T-228: a sign-in box revealed by a class change (no new nodes) or left while typing */
    document.addEventListener('click', soon, true);
    document.addEventListener('focusout', soon, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(scan, 600);
  setTimeout(scan, 2000);
})();
