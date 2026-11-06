/* =====================================================================
   simple/simple.js — "English - simple" as a language choice (T-286, Nov 2026)

   Why: some students speak a language at home but never learned to read it
   (Ayush, Nepali). A translation they can't read is no help. For them, a tap
   on a word gives a short, easy English definition instead, and a sentence or
   a direction comes back in shorter, easier English.

   Who sees the choice — set by Mr. Toby on
   https://tobiasrugger.github.io/readings/simple/dashboard.html (pw galileo2026):
     - students he ticks: "English - simple" appears in THEIR language list and
       is chosen for them when they type their email (they can still switch
       back to their home language);
     - "show to everyone" switch: the choice appears in every student's list,
       chosen for nobody (challenge day, differentiation).
   Settings live in Supabase table gal_settings, key 'simple_english',
   value {all: bool, emails: [local parts]} — both email spellings match.

   How it works: std.js loads this file on every page. Every translation on
   the site is a fetch to the Apps Script proxy, so this file sits in front of
   fetch. When the student's language (vocab_lang) is 'en-simple':
     - a TAPPED word (1–2 words): Simple English Wiktionary definition (simple.
       wiktionary.org, written for learners), saved in song_tr (slug
       'simple-wk', lang 'en-simple') so the next student gets it at once;
       if it has no entry, the proxy is asked with lang "Simple English";
     - anything else (sentence, direction, label, button): the proxy with lang
       "Simple English", saved in song_tr (slug 'simple-s', lang 'en-simple');
       old 'simple-ai' rows are never read;
     - T-324: a definition is ONLY for a word the student just tapped. Labels, buttons
       and directions (drawn by the page, not tapped) come back as a simpler sentence or
       as the original English — never as a definition. (The T-286b hard-word gloss
       for sentences is gone: it turned "open · tap to start" into a definition.)
     - nothing comes back: the original English is shown, never a blank.
     - pages that read or write their OWN translation caches (song_tr,
       news_translations) get an empty answer / a quiet "saved", so no other
       language's cache is shown and nothing simple ever lands in another
       language's cache.
   Teacher pages are left alone.
   ===================================================================== */
(function () {
  if (window.__GAL_SIMPLE__) return;
  window.__GAL_SIMPLE__ = true;

  var CODE = 'en-simple';
  var LABEL = 'English - simple';
  var PROXY_ID = 'AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz';
  var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
  var LLM_LANG = 'Simple English';
  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var WIKT = 'https://simple.wiktionary.org/w/api.php';
  var TEACHER_PATH = /dashboard|teacher|gradebook|roadmap|\/assign|\/reports|\/audit|admin/i;
  var STUDENT_PAGE = !TEACHER_PATH.test(location.pathname);

  var inner = window.fetch ? window.fetch.bind(window) : null;
  var SET = { all: false, emails: [] };

  function hdr(extra) {
    var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };
    if (extra) h.Prefer = extra;
    return h;
  }
  function stored() { try { return localStorage.getItem('vocab_lang') || ''; } catch (e) { return ''; } }
  function active() { return STUDENT_PAGE && stored() === CODE; }
  function local(e) { return String(e || '').trim().toLowerCase().split('@')[0].replace(/\s+/g, ''); }
  function assigned(email) { var l = local(email); return !!l && SET.emails.indexOf(l) >= 0; }
  function signedEmail() { try { return localStorage.getItem('gal_student_email') || ''; } catch (e) { return ''; } }

  /* ---------- settings ---------- */
  function loadSettings() {
    if (!inner) return;
    inner(SUPA_URL + '/rest/v1/gal_settings?key=eq.simple_english&select=value', { headers: hdr() })
      .then(function (r) { if (!r.ok) throw new Error('gal_settings ' + r.status); return r.json(); })
      .then(function (rows) {
        var v = rows && rows[0] && rows[0].value;
        if (v && typeof v === 'object') {
          SET.all = !!v.all;
          SET.emails = (v.emails || []).map(local).filter(Boolean);
        }
        scan();
      })
      .catch(function () { scan(); });
  }

  /* ---------- the dropdowns ---------- */
  var LANGISH = /^(es|zh|zh-cn|zh-tw|yue|ar|ary|vi|th|ne|ru|ur|tl|fr|ko|hi|so)$/i;
  var LANGNAME = /spanish|español|espanol|chinese|中文|mandarin|cantonese|廣東話|arabic|العربية|vietnam|tiếng|thai|ไทย|nepali|नेपाली|russian|русский|urdu|اردو|tagalog|french|français|korean|한국어|hindi|हिन्दी|somali|soomaali/i;
  function isLangSelect(sel) {
    if (sel.id === 'galStdLang') return true;
    var n = 0;
    for (var i = 0; i < sel.options.length; i++) {
      var o = sel.options[i];
      if (o.value === CODE) continue;
      if (LANGISH.test(String(o.value).trim()) || LANGNAME.test(o.text) || LANGNAME.test(o.value)) n++;
    }
    return n >= 3;
  }
  var EMAIL_SEL = 'input[type=email], input[id*=mail i], input[name*=mail i], input[autocomplete=email]';
  function boxOf(sel) {
    var b = sel;
    for (var i = 0; i < 8 && b; i++) {
      b = b.parentElement;
      if (b && b.querySelector(EMAIL_SEL)) return b;
    }
    return null;
  }
  function boxEmail(box) {
    var ems = box.querySelectorAll(EMAIL_SEL);
    for (var i = 0; i < ems.length; i++) if (ems[i].type !== 'hidden' && ems[i].value) return ems[i].value;
    return '';
  }
  function optionOf(sel) {
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === CODE) return sel.options[i];
    return null;
  }
  function addOption(sel) {
    var o = optionOf(sel);
    if (o) return o;
    o = document.createElement('option');
    o.value = CODE;
    o.textContent = LABEL;
    o.setAttribute('translate', 'no');
    sel.appendChild(o);
    return o;
  }
  function choose(sel) {
    if (sel.value === CODE) return;
    sel.value = CODE;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function watchUser(sel) {
    if (sel.__galSimpleW) return;
    sel.__galSimpleW = true;
    sel.addEventListener('change', function (e) { if (e.isTrusted) sel.__galUserPicked = true; });
  }

  /* sign-in boxes first decide; page pickers get the option BEFORE a box chooses it,
     because some pages mirror the box's choice into their own picker (vocab pages). */
  function scan() {
    if (!STUDENT_PAGE || !document.body) return;
    var sels = document.querySelectorAll('select'), boxed = [], page = [], want = false;
    for (var i = 0; i < sels.length; i++) {
      var sel = sels[i];
      try {
        if (!isLangSelect(sel)) continue;
        watchUser(sel);
        var box = boxOf(sel);
        if (box && !box.querySelector('input[type=password]')) {
          var mine = assigned(boxEmail(box));
          if (mine || sel.value === CODE) want = true;
          boxed.push([sel, mine]);
        } else page.push(sel);
      } catch (e) {}
    }
    var pageOK = SET.all || active() || want || assigned(signedEmail());
    page.forEach(function (sel) {
      try {
        if (pageOK) addOption(sel);
        if (active() && !sel.__galUserPicked) choose(sel);
      } catch (e) {}
    });
    boxed.forEach(function (b) {
      var sel = b[0], mine = b[1];
      try {
        if (SET.all || mine) {
          addOption(sel);
          if (mine && !sel.__galUserPicked) choose(sel);                     /* ticked: chosen for them */
          else if (!sel.value && stored() === CODE) choose(sel);            /* came back: keep last choice */
        } else {
          var o = optionOf(sel);
          if (o && sel.value !== CODE) o.parentNode.removeChild(o);         /* email changed to someone else */
          else if (o && !sel.__galUserPicked) {                              /* untick: don't keep it chosen */
            sel.value = ''; o.parentNode.removeChild(o);
            sel.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      } catch (e) {}
    });
  }
  var pend = null;
  function soon() { if (pend) return; pend = setTimeout(function () { pend = null; scan(); }, 200); }

  /* ---------- simple answers ---------- */
  var MEM = {};
  function timed(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function words(s) { return String(s || '').trim().split(/\s+/).filter(Boolean); }
  function bare(s) { return String(s || '').trim().replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, ''); }

  /* Simple English Wiktionary wikitext -> first definition, cleaned */
  function cleanWiki(t) {
    var s = String(t || '');
    s = s.replace(/<ref[^>]*\/>/gi, '').replace(/<ref[\s\S]*?<\/ref>/gi, '');
    for (var k = 0; k < 4; k++) s = s.replace(/\{\{[^{}]*\}\}/g, '');
    s = s.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
         .replace(/'{2,}/g, '').replace(/<[^>]+>/g, '')
         .replace(/\s+([.,;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
    return s;
  }
  function parseWiki(text) {
    var lines = String(text || '').split('\n'), defs = [], base = '';
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      if (!/^#\s*[^:*#]/.test(L)) continue;
      var m = L.match(/\{\{\s*(?:plural|past|past tense|past participle|present participle|third[- ]person singular|simple past|comparative|superlative|alternative spelling|alternate spelling)[^|}]*of\s*\|\s*([^|}]+)/i) ||
              L.match(/\b(?:plural|past tense|past participle|present participle|third-person singular|comparative|superlative) (?:form )?of \[\[([^\]|]+)/i);
      if (m && !base) base = m[1].trim();
      var d = cleanWiki(L.replace(/^#\s*/, ''));
      if (d.length > 3) defs.push(d);
      if (defs.length >= 2) break;
    }
    return { defs: defs, base: base };
  }
  function wiktPage(title) {
    var u = WIKT + '?action=parse&page=' + encodeURIComponent(title) +
            '&prop=wikitext&format=json&formatversion=2&redirects=1&origin=*';
    return timed(inner(u).then(function (r) { if (!r.ok) throw new Error('wikt'); return r.json(); }), 6000)
      .then(function (d) { return d && d.parse && d.parse.wikitext ? parseWiki(d.parse.wikitext) : null; })
      .catch(function () { return null; });
  }
  function forms(w) {
    var l = w.toLowerCase(), out = [l];
    if (w !== l) out.push(w);
    if (/ies$/.test(l)) out.push(l.replace(/ies$/, 'y'));
    if (/es$/.test(l)) out.push(l.replace(/es$/, ''));
    if (/s$/.test(l) && !/ss$/.test(l)) out.push(l.replace(/s$/, ''));
    if (/ied$/.test(l)) out.push(l.replace(/ied$/, 'y'));
    if (/ed$/.test(l)) { out.push(l.replace(/ed$/, '')); out.push(l.replace(/d$/, '')); out.push(l.replace(/(.)\1ed$/, '$1')); }
    if (/ing$/.test(l)) { out.push(l.replace(/ing$/, '')); out.push(l.replace(/ing$/, 'e')); out.push(l.replace(/(.)\1ing$/, '$1')); }
    if (/'s$/.test(l)) out.push(l.replace(/'s$/, ''));
    return out.filter(function (x, i, a) { return x.length > 1 && a.indexOf(x) === i; });
  }
  function wiktDefine(word) {
    var tries = forms(word), i = 0;
    function next() {
      if (i >= tries.length || i >= 4) return Promise.resolve('');
      var t = tries[i++];
      return wiktPage(t).then(function (p) {
        if (!p) return next();
        if (p.defs.length && !/^(plural|past|present|third|simple past|comparative|superlative)\b[^.]*\bof\b/i.test(p.defs[0])) {
          var d = p.defs[0];
          if (d.length < 40 && p.defs[1]) d += ' / ' + p.defs[1];
          return d.length > 220 ? d.slice(0, 217) + '…' : d;
        }
        if (p.base) { tries.splice(i, 0, p.base.toLowerCase()); }
        return next();
      });
    }
    return next();
  }
  function cacheGet(src, slug) {
    var u = SUPA_URL + '/rest/v1/song_tr?select=equiv&slug=eq.' + (slug || 'simple-wk') + '&lang=eq.' + CODE + '&src=eq.' + encodeURIComponent(src);
    return timed(inner(u, { headers: hdr() }).then(function (r) { return r.ok ? r.json() : []; }), 4000)
      .then(function (rows) { return rows && rows[0] && rows[0].equiv || ''; })
      .catch(function () { return ''; });
  }
  function cachePut(src, val, slug) {
    try {
      inner(SUPA_URL + '/rest/v1/song_tr?on_conflict=slug,lang,src', {
        method: 'POST', headers: hdr('resolution=merge-duplicates,return=minimal'),
        body: JSON.stringify([{ slug: slug || 'simple-wk', lang: CODE, src: src, equiv: val, meaning: '', note: slug === 'simple-s' ? 'proxy Simple English' : 'simple.wiktionary.org', updated_at: new Date().toISOString() }])
      }).catch(function () {});
    } catch (e) {}
  }
  function askProxy(src, meaning, isWord) {
    var u = PROXY + '?action=translate&idiom=' + encodeURIComponent(src) +
            '&meaning=' + encodeURIComponent(meaning || '') + '&lang=' + encodeURIComponent(LLM_LANG);
    return timed(inner(u).then(function (r) { return r.json(); }), 8000).then(function (d) {
      var t = d && d.translation, v = '';
      if (t && typeof t === 'object') v = isWord ? (t.meaning || t.equiv || '') : (t.equiv || t.meaning || '');
      else if (typeof t === 'string') v = t;
      v = String(v || '').trim();
      return v;
    }).catch(function () { return ''; });
  }
  /* T-324: a dictionary definition is ONLY for a word the student just tapped.
     Labels, buttons and directions are translated when the page draws them, not on a
     tap, so they never get a definition: they come back as a simpler sentence, or as
     the original English. A "tap" = a pointer/click in the last 3 s whose element text
     contains the requested word as a whole word, and that isn't simply the whole text
     of a button/chip/label (tapping a chip redraws its label). */
  var LAST_TAP = { t: 0, text: '', ctl: '' };
  function noteTap(e) {
    try {
      var el = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      if (!el) return;
      var ctl = el.closest && el.closest('button, [role=button], select, option, label, a, input, textarea, .chip, [class*=chip]');
      LAST_TAP = { t: Date.now(), text: String(el.textContent || '').slice(0, 4000), ctl: ctl ? String(ctl.textContent || '').trim() : '' };
    } catch (x) {}
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function isTappedWord(src) {
    var w = norm(src);
    if (!w || w.split(' ').length > 2) return false;
    if (Date.now() - LAST_TAP.t > 3000) return false;
    if (LAST_TAP.ctl && norm(LAST_TAP.ctl) === w) return false;       /* the whole button/label text */
    return (' ' + norm(LAST_TAP.text) + ' ').indexOf(' ' + w + ' ') >= 0;
  }

  function simpleFor(src, meaning, forceWord) {
    var key = String(src || '').trim();
    if (!key) return Promise.resolve('');
    var ws = words(key), w = ws.length <= 2 ? bare(ws.join(' ')) : '';
    var tapped = !!w && /^[A-Za-z][A-Za-z' -]*$/.test(w) && (forceWord || isTappedWord(key));
    var mk = (tapped ? 'w|' : 's|') + key;
    if (MEM[mk]) return MEM[mk];
    var p;
    if (tapped) {
      /* a tapped word: easy definition (Wiktionary), else ask the translator */
      var ck = w.toLowerCase();
      p = cacheGet(ck, 'simple-wk').then(function (hit) {
        if (hit) return hit;
        return wiktDefine(w).then(function (d) {
          if (d) { cachePut(ck, d, 'simple-wk'); return d; }
          return askProxy(key, meaning, true);
        });
      });
    } else if (ws.length <= 2) {
      /* a 1–2 word label or button (or std.js warming up words nobody tapped yet):
         short English is already simple — keep it, and spend no translator quota */
      p = Promise.resolve(key);
    } else {
      /* a label, button, direction or sentence: a simpler sentence or the English itself */
      p = cacheGet(key, 'simple-s').then(function (hit) {
        if (hit) return hit;
        return askProxy(key, meaning, false).then(function (v) {
          var same = !v || norm(v) === norm(key);
          if (same) return '';
          if (/^[a-z' -]{2,30}:\s/i.test(v) && v.length > key.length * 2) return '';   /* looks like a definition, not a sentence */
          cachePut(key, v, 'simple-s');
          return v;
        });
      });
    }
    p = p.then(function (v) { return v || key; });              /* never a blank: the English stays */
    MEM[mk] = p;
    p.then(function (v) { if (v === key) delete MEM[mk]; });  /* a miss is retried next time */
    return p;
  }

  /* ---------- fake answers in the shapes callers expect ---------- */
  function fake(body, type, status) {
    status = status || 200;
    if (typeof Response === 'function') {
      try { return new Response(status === 204 ? null : body, { status: status, headers: { 'Content-Type': type } }); } catch (e) {}
    }
    return {
      ok: true, status: status, headers: { get: function () { return type; } },
      json: function () { return Promise.resolve(body ? JSON.parse(body) : null); },
      text: function () { return Promise.resolve(body || ''); },
      clone: function () { return fake(body, type, status); }
    };
  }
  function jsonAnswer(v) {
    return fake(JSON.stringify({ ok: true, translation: { equiv: v, meaning: '', note: '' } }), 'application/json');
  }

  /* ---------- in front of fetch ---------- */
  function install() {
    if (!inner || window.__GAL_SIMPLE_WRAP__) return;
    window.__GAL_SIMPLE_WRAP__ = true;
    var below = window.fetch;
    inner = below.bind(window);
    window.fetch = function (input, init) {
      if (!active()) return below.apply(this, arguments);
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();

      if (url.indexOf(PROXY_ID) >= 0) {
        var q = {};
        url.replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) { try { q[k] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { q[k] = v; } return ''; });
        var isTr = q.action === 'translate', isText = !q.action && (q.text || q.q);
        if (isTr || isText) {
          var src = q.idiom || q.text || q.q || '';
          return simpleFor(src, q.meaning || '').then(function (v) {
            return isTr ? jsonAnswer(v) : fake(v, 'text/plain');
          });
        }
        return below.apply(this, arguments);
      }
      if (/\/rest\/v1\/(song_tr|news_translations)\b/.test(url)) {
        if (method === 'GET' || method === 'HEAD') return Promise.resolve(fake('[]', 'application/json'));
        return Promise.resolve(fake('', 'application/json', 201));
      }
      return below.apply(this, arguments);
    };
  }

  function boot() {
    install();
    if (!STUDENT_PAGE) return;
    loadSettings();
    scan();
    try { new MutationObserver(soon).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    document.addEventListener('input', soon, true);
    document.addEventListener('change', soon, true);
    document.addEventListener('focusout', soon, true);
    document.addEventListener('pointerdown', noteTap, true);
    document.addEventListener('click', noteTap, true);
    document.addEventListener('touchstart', noteTap, { capture: true, passive: true });
    document.addEventListener('click', function () { setTimeout(scan, 300); setTimeout(scan, 1300); setTimeout(scan, 3200); }, true);
  }
  window.GAL_SIMPLE = { CODE: CODE, settings: SET, simpleFor: simpleFor, parseWiki: parseWiki, rescan: scan };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
