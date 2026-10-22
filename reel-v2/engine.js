/* =====================================================================
   engine.js — Story Reel player (Mr. Toby, Galileo ELD)
   Every episode page defines window.EP, then loads cast.js + engine.js.
   ES5 only. No template literals anywhere.
   ===================================================================== */
(function () {
  var R = window.REEL, EP = window.EP;
  var NS = 'http://www.w3.org/2000/svg';
  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
  var TABLE = 'reel_views';
  var SLUG = 'reel-' + EP.id;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var me = { name: '', email: '', period: '' };
  var state = { level: 'A', lang: '', pos: 0, maxPos: 0, answers: {}, yt: { A: [], B: [] }, turned: false, secs: 0, slow: false, cc: true, done: false };
  var dirty = false;
  function touch() { dirty = true; }

  /* ---------- how words are SPOKEN (captions stay as written) ----------
     ___ is read as "blank", names get their real pronunciation,
     and a lone I is read as "eye" (never "capital I"). */
  var SAY_AS = { 'Amira': 'Ameera' };
  function spokenWord(tok) {
    var t = String(tok).replace(/_{2,}/g, 'blank');
    for (var k in SAY_AS) t = t.replace(new RegExp('\\b' + k + '\\b', 'g'), SAY_AS[k]);
    if (/^[^A-Za-z]*I[^A-Za-z'\u2019]*$/.test(t)) t = t.replace('I', 'eye');
    return t;
  }

  /* ---------- vocabulary lookup ---------- */
  var VOCAB = {};
  (EP.vocab || []).forEach(function (w) { VOCAB[w.toLowerCase()] = 1; });

  /* ---------- timeline ---------- */
  var STEPS = [];
  EP.scenes.forEach(function (sc, si) {
    sc.lines.forEach(function (ln, li) { STEPS.push({ si: si, li: li, ln: ln }); });
  });
  var pos = 0, playing = false, playId = 0;

  function txt(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.level] || obj.A || '';
  }
  function person(who) {
    if (!who || who === 'narrator') return R.NARRATOR;
    return R.CAST[who] || R.NARRATOR;
  }

  /* ================= STAGE ================= */
  var gBg = $('gBg'), gChars = $('gChars'), gTag = $('gTag'), gItems = $('gItems');
  var curItems = [];
  function drawItems(list) {
    curItems = list || [];
    if (gItems) gItems.innerHTML = R.itemsSVG ? R.itemsSVG(curItems) : '';
  }
  var curScene = -1, cast = {};

  function slotTransform(c) {
    var h = R.CAST[c.id].h;
    return 'translate(' + c.x + 'px,' + R.GROUND + 'px) scale(' + (h * c.face) + ',' + h + ')';
  }
  function place(id, instant) {
    var c = cast[id]; if (!c) return;
    var t = slotTransform(c);
    if (instant) {
      c.node.style.transition = 'none';
      c.node.style.transform = t;
      void c.node.getBoundingClientRect();
      c.node.style.transition = '';
    } else if (c.node.style.transform !== t) {
      c.node.classList.add('walking');
      c.node.style.transform = t;
      clearTimeout(c.walkT);
      c.walkT = setTimeout(function () { c.node.classList.remove('walking'); }, 1700);
    }
  }
  function paint(id) {
    var c = cast[id]; if (!c) return;
    var key = c.expr + '|' + c.pose + '|' + c.hold + '|' + c.talk + '|' + c.face;
    if (key === c.key) return;
    c.key = key;
    c.node.innerHTML = R.drawChar(id, { expr: c.expr, pose: c.pose, hold: c.hold, talk: c.talk, face: c.face });
  }
  function enterScene(si) {
    var sc = EP.scenes[si];
    curScene = si;
    gBg.innerHTML = (R.BG[sc.bg] || R.BG.classroom)(sc.board);
    drawItems(sc.items);
    gChars.innerHTML = ''; gTag.innerHTML = ''; cast = {};
    (sc.chars || []).forEach(function (p) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'slot');
      gChars.appendChild(g);
      cast[p.id] = { id: p.id, node: g, x: p.x, face: p.face || 1, expr: p.expr || 'smile', pose: p.pose || 'idle', hold: p.hold || '', talk: false, key: '' };
      place(p.id, true); paint(p.id);
    });
  }
  function applySet(ln, instant) {
    var set = ln.set || {}, id, k;
    if (ln.items !== undefined) drawItems(ln.items);
    for (id in set) {
      if (!cast[id]) continue;
      for (k in set[id]) cast[id][k] = set[id][k];
      place(id, instant);
    }
    /* the speaker's face for this line */
    if (ln.who && cast[ln.who]) {
      if (ln.expr) cast[ln.who].expr = ln.expr;
      if (ln.pose) cast[ln.who].pose = ln.pose;
    }
  }
  function setTalking(who) {
    for (var id in cast) { cast[id].talk = (id === who); paint(id); }
  }

  /* ---------- camera ---------- */
  var lastCam = 'wide';
  function camTo(ln, instant) {
    var f = ln.type === 'q' ? 'wide' : ln.focus;
    if (f === undefined) {
      if (ln.who && ln.who !== 'narrator' && cast[ln.who]) f = ln.who;
      else f = lastCam;
    }
    lastCam = f;
    var z = 1, fx = 0.5, fy = 0.5;
    var ids = [].concat(f).filter(function (i) { return cast[i]; });
    if (f !== 'wide' && ids.length) {
      var sx = 0, sh = 0;
      ids.forEach(function (i) { sx += cast[i].x; sh += R.CAST[i].h; });
      fx = sx / ids.length / R.W;
      fy = (R.GROUND - 400 * (sh / ids.length)) / R.H;
      z = ids.length > 1 ? 1.16 : 1.34;
    }
    var tx = Math.max((1 - z) * 100, Math.min(0, (0.5 - z * fx) * 100));
    var ty = Math.max((1 - z) * 100, Math.min(0, (0.5 - z * fy) * 100));
    var cam = $('cam');
    if (instant) cam.style.transition = 'none';
    cam.style.transform = 'translate(' + tx.toFixed(2) + '%,' + ty.toFixed(2) + '%) scale(' + z + ')';
    if (instant) { void cam.getBoundingClientRect(); cam.style.transition = ''; }
  }

  /* ---------- name tag / thought bubble over the speaker ---------- */
  function tagFor(ln) {
    gTag.innerHTML = '';
    if (!ln.who || ln.who === 'narrator' || !cast[ln.who]) return;
    var c = cast[ln.who], p = R.CAST[ln.who];
    var y = R.headTop(ln.who) - 34, w = p.name.length * 19 + 40;
    var s = '<g class="tag" transform="translate(' + c.x + ',' + y + ')">';
    if (ln.thought) {
      s += '<circle cx="' + (c.face * 40) + '" cy="44" r="9" fill="#fff" opacity=".95"/><circle cx="' + (c.face * 22) + '" cy="20" r="13" fill="#fff" opacity=".95"/>';
    }
    s += '<rect x="' + (-w / 2) + '" y="-30" width="' + w + '" height="44" rx="22" fill="' + p.color + '"/>';
    s += '<text x="0" y="1" text-anchor="middle" font-family="Nunito,Arial,sans-serif" font-weight="900" font-size="28" fill="#fff">' + esc(p.name) + (ln.thought ? ' …' : '') + '</text></g>';
    gTag.innerHTML = s;
  }

  /* ================= CAPTIONS ================= */
  var WORDS = [], SPOKEN = '';
  function renderCaption(ln) {
    var p = person(ln.who);
    $('who').textContent = ln.thought ? p.name + ' thinks' : p.name;
    $('who').style.background = p.color;
    $('cap').classList.toggle('thought', !!ln.thought);
    var text = ln.type === 'q' ? txt(ln.q) : txt(ln);
    var parts = text.split(/(\s+)/), h = '', n = 0, i;
    WORDS = []; SPOKEN = '';
    var off = 0;
    for (i = 0; i < parts.length; i++) {
      var tok = parts[i];
      if (/^\s+$/.test(tok) || !tok) { h += tok; off += tok.length; continue; }
      var core = tok.replace(/[^A-Za-z'\u2019-]/g, '').toLowerCase().replace(/\u2019/g, "'");
      var cls = 'w' + (VOCAB[core] ? ' key' : '');
      h += '<span class="' + cls + '" data-i="' + n + '" data-w="' + esc(core) + '">' + esc(tok) + '</span>';
      var sw = spokenWord(tok);
      if (SPOKEN) SPOKEN += ' ';
      WORDS.push({ start: SPOKEN.length, end: SPOKEN.length + sw.length, len: core.length || 1 });
      SPOKEN += sw;
      off += tok.length; n++;
    }
    $('line').innerHTML = h;
    $('line').classList.remove('peek');
    $('capTr').textContent = '';
  }
  function hl(i) {
    var spans = $('line').querySelectorAll('.w');
    for (var k = 0; k < spans.length; k++) spans[k].classList.toggle('now', k === i);
  }

  /* ================= SPEECH ================= */
  var VOICES = [];
  function loadVoices() {
    if (!window.speechSynthesis) return;
    VOICES = speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
  }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  var PREF = {
    n: ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny', 'Karen', 'Zira'],
    f: ['Google UK English Female', 'Samantha', 'Microsoft Jenny', 'Microsoft Aria', 'Victoria', 'Karen', 'Zira', 'Female', 'Google US English'],
    m: ['Google UK English Male', 'Daniel', 'Microsoft Guy', 'Microsoft Davis', 'David', 'Alex', 'Fred', 'Male', 'Google US English']
  };
  function pickVoice(kind) {
    var list = PREF[kind] || PREF.n, i, j;
    for (i = 0; i < list.length; i++) {
      for (j = 0; j < VOICES.length; j++) if (VOICES[j].name.indexOf(list[i]) >= 0) return VOICES[j];
    }
    return VOICES[0] || null;
  }

  var hlTimer = null, safety = null;
  function stopSpeech() {
    clearInterval(hlTimer); clearTimeout(safety);
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (curAudio) { curAudio.pause(); curAudio = null; }
  }
  var curAudio = null;

  /* speaks text for a person, highlights words, calls done() once */
  function say(text, p, done, lineAudio, opt) {
    opt = opt || {};
    stopSpeech();
    var myId = ++playId, fired = false;
    function finish() {
      if (fired || myId !== playId) return;
      fired = true; clearInterval(hlTimer); clearTimeout(safety); hl(-1);
      done && done();
    }
    var rate = (p.rate || 1) * (state.slow ? 0.72 : 0.94) * (opt.slow ? 0.72 : 1);
    /* word-timing estimate (used unless the browser reports real word boundaries) */
    var perChar = 62 / rate, times = [], t = 0, k;
    for (k = 0; k < WORDS.length; k++) { times.push(t); t += 150 / rate + WORDS[k].len * perChar; }
    var total = t;
    var t0 = Date.now(), useEst = true;
    hl(0);
    hlTimer = setInterval(function () {
      if (!useEst) return;
      var e = Date.now() - t0, i = 0;
      while (i + 1 < times.length && times[i + 1] <= e) i++;
      hl(i);
    }, 60);

    if (lineAudio) {
      curAudio = new Audio(lineAudio);
      curAudio.playbackRate = state.slow ? 0.8 : 1;
      curAudio.onended = finish; curAudio.onerror = finish;
      curAudio.play().catch(finish);
      safety = setTimeout(finish, total * 3 + 8000);
      return;
    }
    if (!window.speechSynthesis) { safety = setTimeout(finish, total + 500); return; }
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice(p.voice); if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = rate; u.pitch = p.pitch || 1;
    u.onboundary = function (e) {
      if (myId !== playId || typeof e.charIndex !== 'number' || opt.override) return;
      useEst = false;
      for (var i = 0; i < WORDS.length; i++) if (e.charIndex >= WORDS[i].start && e.charIndex < WORDS[i].end + 1) { hl(i); break; }
    };
    u.onend = finish; u.onerror = finish;
    safety = setTimeout(finish, total * 1.8 + 5000);
    setTimeout(function () { if (myId === playId) speechSynthesis.speak(u); }, 60);
  }
  function sayWord(w) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(spokenWord(w)); var v = pickVoice('n'); if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = 0.7; speechSynthesis.speak(u);
  }

  /* ================= PLAYBACK ================= */
  function render(p, instant) {
    var st = STEPS[p], ln = st.ln;
    $('qcard').style.display = 'none';
    if (st.si !== curScene || instant) {
      enterScene(st.si);
      /* replay earlier lines of this scene instantly so positions are right */
      var sc = EP.scenes[st.si];
      for (var i = 0; i < st.li; i++) applySet(sc.lines[i], true);
      applySet(ln, !!sc.lines[st.li].instant);
      camTo(ln, true);
    } else {
      applySet(ln, false);
      camTo(ln, false);
    }
    setTalking(null);
    tagFor(ln);
    renderCaption(ln);
    dots();
    if (p > state.maxPos) state.maxPos = p;
    state.pos = p; touch();
  }
  function speakStep(then) {
    var ln = STEPS[pos].ln;
    if (ln.type === 'q') { showQ(ln); say(SPOKEN, R.NARRATOR, null); return; }
    if (ln.who && cast[ln.who]) setTalking(ln.who);
    var ov = ln['s' + state.level] || ln.sA || '';
    say(ov || SPOKEN, person(ln.who), function () {
      setTalking(null);
      if (then) then();
    }, ln.audio, { slow: !!ln.slow, override: !!ov });
  }
  function advanceLater() {
    var mine = playId;
    setTimeout(function () { if (playing && mine === playId) next(true); }, state.slow ? 1200 : 750);
  }
  function go(p, auto) {
    if (p < 0 || p >= STEPS.length) return;
    var jump = p < pos || Math.abs(p - pos) > 1;
    pos = p;
    render(pos, jump);
    speakStep(function () { if (playing) advanceLater(); });
  }
  function next(auto) {
    if (pos >= STEPS.length - 1) { finishEpisode(); return; }
    go(pos + 1, auto);
  }
  function prev() { go(Math.max(0, pos - 1)); }
  function setPlaying(v) {
    playing = v;
    $('playBtn').textContent = v ? '❚❚' : '▶';
    $('playBtn').setAttribute('aria-label', v ? 'Pause' : 'Play');
  }
  function togglePlay() {
    if ($('curtain').style.display !== 'none') { start(); return; }
    if (playing) { setPlaying(false); stopSpeech(); setTalking(null); hl(-1); }
    else { setPlaying(true); if (STEPS[pos].ln.type === 'q' && !answeredNow) { showQ(STEPS[pos].ln); return; } go(pos); }
  }
  function start(fromTop) {
    $('curtain').style.display = 'none';
    if (fromTop) { pos = 0; }
    setPlaying(true);
    render(pos, true);
    speakStep(function () { if (playing) advanceLater(); });
  }
  function finishEpisode() {
    setPlaying(false); stopSpeech(); setTalking(null);
    state.done = true; touch();
    showYourTurn(true);
  }

  /* ---------- scene dots ---------- */
  function dots() {
    var box = $('dots'), h = '', cur = STEPS[pos].si, maxSi = STEPS[state.maxPos].si;
    for (var i = 0; i < EP.scenes.length; i++) {
      h += '<button class="dot' + (i === cur ? ' on' : (i <= maxSi ? ' done' : '')) + '" data-s="' + i + '" aria-label="Scene ' + (i + 1) + '"></button>';
    }
    box.innerHTML = h;
  }
  function firstStepOf(si) { for (var i = 0; i < STEPS.length; i++) if (STEPS[i].si === si) return i; return 0; }

  /* ================= QUESTIONS ================= */
  var answeredNow = false;
  function showQ(ln) {
    answeredNow = false;
    var q = ln.q, opts = q[state.level + 'o'] || q.Ao, ans = q[state.level + 'a'] != null ? q[state.level + 'a'] : q.Aa;
    var box = $('qcard'), h = '';
    var kindTxt = ln.kind === 'predict' ? 'Predict. What do you think?' : 'Check. Choose the answer.';
    h += '<p class="qkind" translate="yes" data-en="' + kindTxt + '">' + kindTxt + '</p>';
    h += '<p class="qtext" translate="no">' + txt(q).split(/(\s+)/).map(function (t) {
      if (!t || /^\s+$/.test(t)) return t;
      return '<span class="w qw" data-w="' + esc(t.replace(/[^A-Za-z'\u2019-]/g, '').toLowerCase()) + '">' + esc(t) + '</span>';
    }).join('') + '</p>';
    h += '<div class="qopts">';
    opts.forEach(function (o, i) { h += '<button class="qopt" data-i="' + i + '" translate="no">' + esc(o) + '</button>'; });
    h += '</div>';
    h += '<div class="qfoot"><span class="qmsg" id="qmsg" translate="yes"></span><button class="go" id="qgo" style="display:none" translate="yes">Keep watching</button></div>';
    box.innerHTML = h; box.style.display = 'block';
    box.querySelectorAll('.qw').forEach(function (w) { w.addEventListener('click', function (e) { e.stopPropagation(); wordPop(w, txt(q)); }); });
    showDirections(box);
    var rec = state.answers[ln.id];
    box.querySelectorAll('.qopt').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        var r = state.answers[ln.id] || (state.answers[ln.id] = { kind: ln.kind, level: state.level, first: i, tries: 0, right: null });
        r.tries++;
        if (ln.kind === 'predict') {
          box.querySelectorAll('.qopt').forEach(function (x) { x.classList.remove('picked'); });
          b.classList.add('picked'); r.pick = i;
          $('qmsg').textContent = 'Good guess. Let’s see!';
          $('qgo').style.display = ''; answeredNow = true;
        } else if (i === ans) {
          b.classList.add('right');
          if (r.right === null) r.right = (r.tries === 1);
          $('qmsg').textContent = 'Yes!';
          $('qgo').style.display = ''; answeredNow = true;
        } else {
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
          if (r.right === null && r.tries === 1) r.right = false;
          $('qmsg').textContent = 'Try again.';
        }
        score(); touch();
      });
    });
    $('qgo').addEventListener('click', function () { box.style.display = 'none'; setPlaying(true); next(true); });
    if (rec && ln.kind !== 'predict' && rec.right !== null) { /* already answered earlier: allow skipping */ }
  }
  function score() {
    var r = 0, t = 0;
    STEPS.forEach(function (s) {
      if (s.ln.type === 'q' && s.ln.kind === 'check') { t++; var a = state.answers[s.ln.id]; if (a && a.right) r++; }
    });
    var o = { checks_first_try: r, checks_total: t }, k;
    var ts = window.REEL_TIERS ? REEL_TIERS.scores() : { pts: 0, max: 0, out: {} };   /* tiers.js (tiers chat) */
    for (k in ts.out) o[k] = ts.out[k];
    window.GAL_SCORE = r + ts.pts; window.GAL_MAX = t + ts.max;
    return o;
  }

  /* ================= TRANSLATION ================= */
  var tcache = {};
  /* proxy contract: ?action=translate&idiom=WORD&meaning=CONTEXT&lang=  ->  {ok, translation:{equiv, meaning, note}}
     want = 'equiv' for a single word (context steers it: "boy" -> "chico", not "Boy!"),
     want = 'line' for a whole sentence. cb('') when nothing came back. */
  function translate(text, lang, cb, context, want) {
    var key = lang + '|' + text + '|' + (context || '') + '|' + (want || '');
    if (tcache[key]) { cb(tcache[key]); return; }
    /* mode=word -> plain one-to-one dictionary translation; mode=sentence -> plain translation.
       (Without a mode, the proxy treats everything as an idiom: "boy" became "Boy!".) */
    var u = PROXY + '?action=translate&mode=' + (want === 'equiv' ? 'word' : 'sentence') +
            '&idiom=' + encodeURIComponent(text) + '&meaning=' + encodeURIComponent(context || '') +
            '&lang=' + encodeURIComponent(lang);
    fetch(u).then(function (r) { return r.text(); }).then(function (t) {
      var d = null, v = '';
      try { d = JSON.parse(t); } catch (e) { d = null; }   /* Apps Script sometimes answers with an HTML page: treat as a miss */
      var tr = d && d.translation;
      if (tr && typeof tr === 'object') v = want === 'equiv' ? (tr.equiv || '') : (tr.equiv || tr.meaning || '');
      else if (typeof tr === 'string') v = tr;
      v = String(v || '').trim();
      if (v) tcache[key] = v;   /* a miss is never cached, so the next tap gets a real second chance */
      cb(v);
    }).catch(function () { cb(''); });
  }
  /* One word, four tries, in order:
       1. the word with its DEFINITION from EP.gloss (falls back to the sentence if a word has none)
       2. the word alone
       3. try 1 again after a short pause (the proxy hiccups under a whole class tapping at once)
     The proxy contract is idiom=WORD&meaning=DEFINITION: a definition is what stops "boy" coming back as "Boy!".
       4. the whole sentence, so the student still gets meaning instead of a grey word
     cb(value, isSentence) */
  function translateWord(w, sentence, lg, cb) {
    var def = (EP.gloss && EP.gloss[w]) || sentence || '';
    translate(w, lg, function (v1) {
      if (v1) { cb(v1, false); return; }
      translate(w, lg, function (v2) {
        if (v2) { cb(v2, false); return; }
        setTimeout(function () {
          translate(w, lg, function (v3) {
            if (v3) { cb(v3, false); return; }
            if (!sentence) { cb('', false); return; }
            translate(sentence, lg, function (v4) { cb(v4, true); }, '', 'line');
          }, def, 'equiv');
        }, 700);
      }, '', 'line');
    }, def, 'equiv');
  }
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) { if (pop && !pop.contains(e.target) && !e.target.classList.contains('w')) closePop(); });
  function wordPop(el, sentence) {
    closePop();
    var w = el.getAttribute('data-w') || el.textContent;
    pop = document.createElement('div'); pop.className = 'pop'; pop.setAttribute('translate', 'no');
    pop.innerHTML = '<b>' + esc(w) + '</b><button type="button" id="popSay">🔊</button><div class="tr" id="popTr"></div>';
    document.body.appendChild(pop);
    var r = el.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(window.innerWidth - 262, r.left + window.scrollX)) + 'px';
    pop.style.top = (r.top + window.scrollY - pop.offsetHeight - 10) + 'px';
    $('popSay').addEventListener('click', function () { sayWord(w); });
    sayWord(w);
    if (state.lang) {
      var lg = state.lang;
      var ask = function () {
        var out0 = $('popTr'); if (out0) out0.textContent = '…';
        translateWord(w, sentence || '', lg, function (v, isSentence) {
          var out = $('popTr'); if (!out) return;
          if (v && !isSentence) out.innerHTML = '<b class="eq">' + esc(v) + '</b>';
          else if (v) out.innerHTML = '<b class="eq none">' + esc(w) + '</b><div class="eqsent">' + esc(v) + '</div>';
          else out.innerHTML = '<b class="eq none">' + esc(w) + '</b><button type="button" class="eqretry" id="popRetry">↻</button>';
          var rb = $('popRetry'); if (rb) rb.addEventListener('click', function (e) { e.stopPropagation(); ask(); });
        });
      };
      ask();
    } else {
      $('popTr').textContent = 'Choose your language at the top to see a translation.';
    }
  }

  /* ================= DIRECTIONS (translated by default) =================
     Any element with data-en gets its translation on a line underneath,
     in the language chosen at sign-in. Activity content stays English. */
  function showDirections(root) {
    var lg = state.lang;
    (root || document).querySelectorAll('[data-en]').forEach(function (p) {
      var out = p.querySelector('.dirtr');
      if (!out) { out = document.createElement('span'); out.className = 'dirtr'; out.setAttribute('translate', 'no'); p.appendChild(out); }
      if (!lg) { out.textContent = ''; return; }
      out.textContent = '…';
      translate(p.getAttribute('data-en'), lg, function (t) { out.textContent = t; }, '', 'line');
    });
  }
  function setLang(v) {
    state.lang = v || '';
    $('lang').value = state.lang;
    try { localStorage.setItem('vocab_lang', state.lang); } catch (e) {}
    showDirections(); touch();
    if (window.REEL_TIERS) REEL_TIERS.refresh();
  }

  /* ================= YOUR TURN ================= */
  function showYourTurn(scroll) {
    var yt = EP.yourTurn[state.level] || EP.yourTurn.A, h = '';
    var saved = state.yt[state.level] || (state.yt[state.level] = []);
    h += '<h2>Your turn</h2><p class="lead" translate="yes" data-en="' + esc(yt.intro) + '">' + esc(yt.intro) + '</p>';
    yt.prompts.forEach(function (p, i) {
      h += '<div class="prompt"><label for="yt' + i + '" translate="yes" data-en="' + esc(p.ask) + '">' + (i + 1) + '. ' + esc(p.ask) + '</label>' +
           '<textarea id="yt' + i + '" data-i="' + i + '" placeholder="' + esc(p.frame) + '" translate="no" spellcheck="false">' + esc(saved[i] || '') + '</textarea></div>';
    });
    h += '<p class="speakit" translate="yes" data-en="' + esc(yt.speak) + '">🗣️ ' + esc(yt.speak) + '</p>';
    h += '<div class="row"><button class="btn" id="turnIn" translate="yes">' + (state.turned ? 'Turned in. Turn in again' : 'Turn in') + '</button>' +
         '<button class="btn alt" id="rewatch" translate="yes">Watch again</button><span id="ytMsg"></span></div>';
    /* what's next: a real activity when the episode has one (EP.next), otherwise back to Google Classroom */
    var nx = EP.next, gc = 'Done here? Go to Google Classroom for your next activity, or ask your teacher what to do next.';
    h += '<div class="nextbox"><h3 translate="yes" data-en="What\u2019s next">What\u2019s next</h3>';
    if (nx && nx.url) {
      if (nx.why) h += '<p translate="yes" data-en="' + esc(nx.why) + '">' + esc(nx.why) + '</p>';
      h += '<a class="btn next" href="' + esc(nx.url) + '" translate="yes" data-en="' + esc(nx.title) + '">' + esc(nx.title) + ' \u2192</a>';
    }
    h += '<p class="gc" translate="yes" data-en="' + gc + '">' + gc + '</p></div>';
    $('ytBox').innerHTML = h;
    $('yt').style.display = 'block';
    showDirections($('ytBox'));
    $('ytBox').querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', function () { saved[+ta.getAttribute('data-i')] = ta.value; highlights(); touch(); });
    });
    $('turnIn').addEventListener('click', function () {
      state.turned = true; save();
      $('turnIn').textContent = 'Turned in. Turn in again';
      $('ytMsg').textContent = 'Saved. You can keep editing.';
    });
    $('rewatch').addEventListener('click', function () { window.scrollTo(0, 0); start(true); });
    if (scroll) $('yt').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.REEL_TIERS) REEL_TIERS.show(false);   /* "After the story" tiers under Your turn */
  }
  function highlights() {
    var s = state.yt[state.level] || [];
    var yt = (EP.yourTurn || {})[state.level] || {}, labels = EP.highlightLabels || [];
    window.GAL_HIGHLIGHTS = s.filter(function (x) { return x && x.trim(); }).slice(0, 2).map(function (x, i) {
      var lab = labels[i] || ((yt.prompts || [])[i] || {}).ask || ('Sentence ' + (i + 1));
      return { label: String(lab).replace(/\.\s.*$/, ''), text: x.trim() };
    });
  }

  /* ================= STORYBOARD ================= */
  function boardState(sc) {
    var chars = (sc.chars || []).map(function (c) { var o = {}, k; for (k in c) o[k] = c[k]; return o; });
    var items = sc.items;
    sc.lines.forEach(function (ln) {
      var set = ln.set || {}, id, k;
      if (ln.items !== undefined) items = ln.items;
      chars.forEach(function (c) { if (set[c.id]) for (k in set[c.id]) c[k] = set[c.id][k]; });
    });
    return { bg: sc.bg, board: sc.board, chars: chars, items: items, alt: sc.alt };
  }
  function buildBoard() {
    var h = '';
    EP.scenes.forEach(function (sc, si) {
      var first = null;
      for (var i = 0; i < sc.lines.length; i++) if (sc.lines[i].type !== 'q') { first = sc.lines[i]; break; }
      var who = first ? person(first.who).name : '';
      h += '<button class="frame" data-s="' + si + '">' + R.sceneSVG(boardState(sc)) +
           '<p translate="no"><b>' + (si + 1) + '.</b> ' + (first && first.who && first.who !== 'narrator' ? esc(who) + ': ' : '') + esc(first ? txt(first) : '') + '</p></button>';
    });
    $('frames').innerHTML = h;
  }

  /* ================= SIGN IN (shared standard) ================= */
  var CANON_DOMAIN = '@sfusd.edu', ROSTER = [], CHOSEN_LANG = '';
  function cleanMail(x) { return String(x || '').trim().toLowerCase(); }
  function localPart(e) { return cleanMail(e).split('@')[0]; }
  function validMail(e) { return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(cleanMail(e)); }
  /* T-79 (Oct 22): ALWAYS the canonical spelling name@sfusd.edu. It used to copy the roster's
     spelling, so the same student saved as @s.sfusd.edu or @sfusd.edu depending on whether the
     roster had loaded yet, and their work split across two rows (Elias). */
  function canonMail(raw) { return localPart(raw) + CANON_DOMAIN; }
  function legacyMail(email) { return localPart(email) + '@s.sfusd.edu'; }
  function sbHead(pref) {
    var h = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };
    if (pref) h['Prefer'] = pref;
    return h;
  }
  function recordAlias(alias, canon) {
    if (!alias || alias === canon) return;
    fetch(SUPA_URL + '/rest/v1/student_aliases?on_conflict=alias_email', {
      method: 'POST', headers: sbHead('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify([{ alias_email: alias, email: canon }])
    }).catch(function () {});
  }
  function seedStudent(name, email, period) {
    fetch(SUPA_URL + '/rest/v1/students?on_conflict=email', {
      method: 'POST', headers: sbHead('resolution=ignore-duplicates,return=minimal'),
      body: JSON.stringify([{ email: email, name: name, period: period }])
    }).catch(function () {});
  }
  function fillRoster() {
    var sel = $('groster'); if (!sel) return;
    if (!ROSTER.length) { $('grosterwrap').style.display = 'none'; return; }
    var h = '<option value="">Choose your name</option>', i;
    for (i = 0; i < ROSTER.length; i++) h += '<option value="' + i + '">' + esc(ROSTER[i].name || ROSTER[i].email) + '</option>';
    sel.innerHTML = h; $('grosterwrap').style.display = '';
  }
  function loadRoster() {
    fetch(SUPA_URL + '/rest/v1/students?select=name,email,period&order=name', { headers: sbHead() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { ROSTER = rows || []; fillRoster(); })
      .catch(function () {});
  }
  function signIn() {
    var n = $('gname').value.trim(), raw = cleanMail($('gmail').value), p = $('gper').value.trim();
    if (!n) { $('gerr').textContent = 'Please write your first and last name.'; return; }
    if (!validMail(raw)) { $('gerr').textContent = 'Please use your school email. It ends with @s.sfusd.edu'; return; }
    if (!p) { $('gerr').textContent = 'Please choose your class period.'; return; }
    var lg = $('glang').value;
    if (!lg) { $('gerr').textContent = 'Please choose your language.'; return; }
    var canon = canonMail(raw);
    recordAlias(raw, canon); seedStudent(n, canon, p);
    me.name = n; me.email = canon; me.period = p;
    CHOSEN_LANG = lg; setLang(lg);
    $('gate').style.display = 'none';
    load();
  }

  /* ================= SAVE / LOAD ================= */
  function payload() {
    return [{ email: me.email, episode: EP.id, student_name: me.name, period: me.period, level: state.level, lang: state.lang,
              work: state, scores: score(), turned_in: state.turned, updated_at: new Date().toISOString() }];
  }
  /* ---- T-79 data-loss guard (Oct 22 2026) ----
     A student lost Ep 1 and Ep 2 work when load() failed and the autosave then
     upserted a BLANK state over their real row. Now nothing is ever saved until
     a load has succeeded (an empty result is fine: that's a new student). */
  var loaded = false, loadTries = 0, loadTimer = null, offlineShown = false;
  function saveNote(msg) {
    var n = $('saveNote');
    if (!n) {
      n = document.createElement('span'); n.id = 'saveNote'; n.setAttribute('translate', 'no');
      n.style.cssText = 'font-weight:800;font-size:14px;color:#ffd6a8;margin-left:6px';
      var dot = $('saved'); dot.parentNode.insertBefore(n, dot.nextSibling);
    }
    n.textContent = msg || '';
  }
  function save() {
    if (!me.email || !loaded) return;          /* T-79: never save before a successful load */
    $('saved').className = 'saving';
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?on_conflict=email,episode', {
      method: 'POST', headers: sbHead('resolution=merge-duplicates,return=minimal'), body: JSON.stringify(payload())
    }).then(function (r) { $('saved').className = r.ok ? '' : 'err'; if (r.ok && window.REEL_TIERS) REEL_TIERS.poll(); })
      .catch(function () { $('saved').className = 'err'; });
  }
  function load() { loadAttempt('work,tier', me.email); }
  function loadAttempt(sel, who) {
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(who) + '&episode=eq.' + encodeURIComponent(EP.id) + '&select=' + sel,
      { headers: sbHead() })
      .then(function (r) {
        /* a missing column (e.g. tier) answers 400: ask again without it */
        if (r.status === 400 && sel !== 'work') { loadAttempt('work', who); return null; }
        if (!r.ok) throw new Error('load ' + r.status);
        return r.json();
      })
      .then(function (rows) {
        if (rows === null) return;                       /* the retry above is handling it */
        if (!Array.isArray(rows)) throw new Error('load: not a list');
        /* nothing under the canonical email: look under the old @s.sfusd.edu spelling once,
           so a returning student's work is found (and then saved forward under @sfusd.edu) */
        if (!rows.length && who === me.email && legacyMail(me.email) !== me.email) {
          loadAttempt(sel, legacyMail(me.email)); return;
        }
        if (who !== me.email && rows.length && rows[0].work) dirty = true;   /* carry it forward */
        var w = rows[0] && rows[0].work;
        if (w) { for (var k in w) state[k] = w[k]; }
        if (rows[0] && window.REEL_TIERS && ('tier' in rows[0])) REEL_TIERS.setTier(rows[0].tier);   /* teacher's tier (reel_views.tier) */
        var firstTime = !offlineShown;
        loaded = true; loadTries = 0; clearTimeout(loadTimer);
        $('saved').className = ''; saveNote('');
        /* reached the server late: a brand-new student keeps what they did meanwhile (and it saves);
           a student with saved work gets their saved work back */
        if (!firstTime && !w) dirty = true;
        afterLoad();
      }).catch(function () { loadFailed(); });
  }
  function loadFailed() {
    loadTries++;
    clearTimeout(loadTimer);
    if (loadTries === 1) { loadTimer = setTimeout(load, 3000); return; }   /* one quick retry */
    $('saved').className = 'err';
    saveNote('Can\u2019t reach the server \u2014 your work is not being saved yet');
    if (!offlineShown) { offlineShown = true; afterLoad(); }               /* the page still works, it just can't save */
    loadTimer = setTimeout(load, 20000);                                   /* keep trying */
  }
  function afterLoad() {
    if (!state.yt) state.yt = { A: [], B: [] };
    if (CHOSEN_LANG) state.lang = CHOSEN_LANG;   /* today's sign-in choice wins */
    showDirections();
    pos = Math.min(state.pos || 0, STEPS.length - 1);
    syncControls();
    render(pos, true);
    if (pos > 0) {
      var cm = 'Continue from scene ' + (STEPS[pos].si + 1);
      $('curtainMsg').setAttribute('data-en', cm); $('curtainMsg').textContent = cm;
      showDirections($('curtain'));
      $('again').style.display = '';
    }
    if (state.done) showYourTurn(false);
    score(); highlights();
  }
  setInterval(function () { if (dirty && loaded) { dirty = false; save(); } }, 20000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && dirty && loaded) { dirty = false; save(); } });
  setInterval(function () { if (me.email && document.visibilityState === 'visible') { state.secs += 10; } }, 10000);

  /* ================= CONTROLS ================= */
  function syncControls() {
    document.querySelectorAll('#levelSeg button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-l') === state.level ? 'true' : 'false'); });
    $('slowBtn').setAttribute('aria-pressed', state.slow ? 'true' : 'false');
    $('ccBtn').setAttribute('aria-pressed', state.cc ? 'true' : 'false');
    document.body.classList.toggle('nocc', !state.cc);
    $('lang').value = state.lang || '';
  }
  function wire() {
    $('playBtn').addEventListener('click', togglePlay);
    $('bigPlay').addEventListener('click', function () { start(false); });
    $('again').addEventListener('click', function () { start(true); });
    $('nextBtn').addEventListener('click', function () { next(false); });
    $('prevBtn').addEventListener('click', prev);
    $('repBtn').addEventListener('click', function () { if (STEPS[pos].ln.type !== 'q') speakStep(null); });
    $('slowBtn').addEventListener('click', function () { state.slow = !state.slow; syncControls(); touch(); });
    $('ccBtn').addEventListener('click', function () { state.cc = !state.cc; syncControls(); touch(); });
    $('line').addEventListener('click', function (e) {
      if (!state.cc && !$('line').classList.contains('peek')) { $('line').classList.add('peek'); return; }
      if (e.target.classList.contains('w')) { var ln = STEPS[pos].ln; wordPop(e.target, ln.type === 'q' ? txt(ln.q) : txt(ln)); }
    });
    $('trBtn').addEventListener('click', function () {
      var ln = STEPS[pos].ln, t = ln.type === 'q' ? txt(ln.q) : txt(ln);
      if (!state.lang) { $('capTr').textContent = 'Choose your language at the top first.'; return; }
      $('capTr').textContent = '…';
      translate(t, state.lang, function (v) { $('capTr').textContent = v || 'No translation came back. Tap 🌐 again.'; }, '', 'line');
    });
    document.querySelectorAll('#levelSeg button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.level = b.getAttribute('data-l'); syncControls(); touch();
        render(pos, true);
        if ($('yt').style.display === 'block') showYourTurn(false);
        else if (window.REEL_TIERS) REEL_TIERS.refresh();
      });
    });
    $('lang').addEventListener('change', function () { setLang(this.value); });
    $('dots').addEventListener('click', function (e) {
      var s = e.target.getAttribute('data-s'); if (s === null) return;
      $('curtain').style.display = 'none';
      go(firstStepOf(+s));
    });
    $('boardBtn').addEventListener('click', function () { buildBoard(); $('board').classList.add('on'); setPlaying(false); stopSpeech(); });
    $('boardClose').addEventListener('click', function () { $('board').classList.remove('on'); });
    $('frames').addEventListener('click', function (e) {
      var f = e.target.closest('.frame'); if (!f) return;
      $('board').classList.remove('on'); $('curtain').style.display = 'none';
      go(firstStepOf(+f.getAttribute('data-s')));
    });
    $('ytBtn').addEventListener('click', function () { showYourTurn(true); });
    $('fsBtn').addEventListener('click', function () {
      var el = $('player');
      if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen();
    });
    document.addEventListener('keydown', function (e) {
      var t = e.target.tagName;
      if (t === 'TEXTAREA' || t === 'INPUT' || t === 'SELECT') return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') next(false);
      else if (e.key === 'ArrowLeft') prev();
    });

    /* sign-in */
    $('gbtn').addEventListener('click', signIn);
    ['gname', 'gmail', 'gper'].forEach(function (id) { $(id).addEventListener('keydown', function (e) { if (e.key === 'Enter') signIn(); }); });
    $('groster').addEventListener('change', function () {
      var r = ROSTER[this.value]; if (!r) return;
      $('gname').value = r.name || ''; $('gmail').value = cleanMail(r.email);
      if (r.period) $('gper').value = String(r.period).replace(/[^0-9]/g, '');
    });
    /* language list inside the sign-in box = the page picker's list */
    var gl = $('glang');
    Array.prototype.slice.call($('lang').options, 1).forEach(function (o) { gl.appendChild(o.cloneNode(true)); });
    try { var L = localStorage.getItem('vocab_lang'); if (L) gl.value = L; } catch (e) {}
    loadRoster();
  }

  /* ================= SILENT TRANSLATION CANARY ================= */
  /* Browser translation rewrites the control labels. We know what they
     should say, so any drift means an outside translator is running.
     Nothing is shown to the student. */
  var TR_SENT = '';
  function checkTranslation() {
    if (!me.email) return;
    var observed = '', els = document.querySelectorAll('[data-canary]'), i;
    for (i = 0; i < els.length; i++) {
      var got = (els[i].textContent || '').trim();
      if (got && got !== els[i].getAttribute('data-canary')) { observed = got; break; }
    }
    var cls = document.documentElement.className || '';
    if (!observed && !/translated/.test(cls)) return;
    var sig = observed + '|' + (document.documentElement.lang || '');
    if (sig === TR_SENT) return;
    TR_SENT = sig;
    fetch(SUPA_URL + '/rest/v1/page_translation?on_conflict=email,set_slug', {
      method: 'POST', headers: sbHead('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify([{ email: me.email, set_slug: SLUG, translated: true, observed: observed,
                              html_lang: document.documentElement.lang || '', html_class: cls, updated_at: new Date().toISOString() }])
    }).catch(function () {});
  }
  setInterval(checkTranslation, 20000);
  setTimeout(checkTranslation, 4000);

  /* ================= BOOT ================= */
  $('epNum').textContent = 'Episode ' + EP.num;
  $('epTitle').textContent = EP.title;
  document.title = 'Story Reel ' + EP.num + ': ' + EP.title;
  wire();
  syncControls();
  render(0, true);
  dots();

  /* ---- "After the story" tiers live in ../tiers.js (owned by the tiers chat). The engine only hands it
     these handles and loads it; tiers.js adds its own button, section, styles and episode data. ---- */
  window.REEL_HOST = { EP: EP, state: state, me: me, $: $, esc: esc, txt: txt, save: save, touch: touch, score: score,
                       wordPop: wordPop, showDirections: showDirections, spokenWord: spokenWord, pickVoice: pickVoice,
                       boardState: boardState, R: R, PROXY: PROXY, SUPA_URL: SUPA_URL, TABLE: TABLE, sbHead: sbHead };
  (function () { var ts = document.createElement('script'); ts.src = '../tiers.js'; document.body.appendChild(ts); })();
})();
