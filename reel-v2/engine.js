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
  var gBg = $('gBg'), gChars = $('gChars'), gTag = $('gTag');
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
    var ts = tierScores(), o = { checks_first_try: r, checks_total: t, tier: assignedTier || '' }, k;
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
    if (tcache[key] != null) { cb(tcache[key]); return; }
    var u = PROXY + '?action=translate&idiom=' + encodeURIComponent(text) + '&meaning=' + encodeURIComponent(context || '') +
            '&lang=' + encodeURIComponent(lang);
    fetch(u).then(function (r) { return r.json(); }).then(function (d) {
      var tr = d && d.translation, v = '';
      if (tr && typeof tr === 'object') v = want === 'equiv' ? (tr.equiv || '') : (tr.equiv || tr.meaning || '');
      else if (typeof tr === 'string') v = tr;
      v = String(v || '').trim();
      tcache[key] = v; cb(v);
    }).catch(function () { cb(''); });
  }
  var pop = null, popAt = 0;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) { if (pop && Date.now() - popAt > 80 && !pop.contains(e.target) && !e.target.classList.contains('w')) closePop(); });
  function wordPop(el, sentence) {
    closePop(); popAt = Date.now();
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
      $('popTr').textContent = '…';
      var lg = state.lang;
      function show(v) {
        var out = $('popTr'); if (!out) return;
        if (v) out.innerHTML = '<b class="eq">' + esc(v) + '</b>';
        else out.innerHTML = '<b class="eq none">' + esc(w) + '</b>';
      }
      /* 1st try: the word with its sentence (so "boy" -> "chico", not "Boy!").
         If that comes back empty, ask the way Launch Plus does: the word alone. */
      translate(w, lg, function (v) {
        if (v) { show(v); return; }
        translate(w, lg, show, '', 'line');
      }, sentence || '', 'equiv');
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
         '<button class="btn alt" id="rewatch" translate="yes">Watch again</button>' +
         (EP.tiers ? '<button class="btn alt" id="ytNext" translate="yes">After the story ↓</button>' : '') + '<span id="ytMsg"></span></div>';
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
    if ($('ytNext')) $('ytNext').addEventListener('click', function () { showTiers(true); });
    if (scroll) $('yt').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showTiers(false);
  }
  function highlights() {
    var s = state.yt[state.level] || [];
    window.GAL_HIGHLIGHTS = s.filter(function (x) { return x && x.trim(); }).slice(0, 2).map(function (x, i) {
      return { label: i ? 'Compare sentence' : 'Describe a classmate', text: x.trim() };
    });
  }

  /* ================= AFTER THE STORY: TIERS =================
     EP.tiers = { ask, key:[{t, swap, rungs, keep, idea, ideas}], topic:{ask, opts, good, why}, summary:{min, hint, teaser} }
     Tier A  words and voice : read along (say.js) -> order the 5 key sentences -> pick the topic sentence
     Tier B  synonyms/details: reword the key sentences, one phrase ladder each
     Tier C  paragraph       : summary from the storyboard, "Check my writing", one revision
     The teacher assigns a tier from the dashboard (reel_views.tier). With no tier set,
     the page says "Ask your teacher" and shows the three cards. */
  var TIERS = EP.tiers || null;
  var assignedTier = '';                 /* '', 'A', 'B' or 'C' — written by the dashboard */
  var TIER_INFO = {
    A: { name: 'Words and voice', e: '🗣️', blurb: 'Read along. Put the story in order. Pick the topic sentence.' },
    B: { name: 'Synonyms and details', e: '🔁', blurb: 'Say the key sentences in a new way.' },
    C: { name: 'Paragraph', e: '✍️', blurb: 'Write a short summary of the story in your own words.' }
  };
  function tierState() {
    if (!state.tiers) state.tiers = {};
    var t = state.tiers;
    if (!t.A) t.A = { step: 0, read: null, order: { shuf: null, slots: [null, null, null, null, null], first: null, best: 0, tries: 0 }, topic: { first: null, pick: null, tries: 0 } };
    if (!t.B) t.B = { rw: [] };
    if (!t.C) t.C = { text: '', fb: null, checked: 0, draft1: '', revised: false };
    if (!t.open) t.open = '';
    return t;
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/\u2019/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function wordsOf(s) { var n = norm(s); return n ? n.split(' ') : []; }
  function sentenceOk(s) { s = String(s || '').trim(); return wordsOf(s).length >= 3 && /^[A-Z]/.test(s) && /[.!?]$/.test(s); }
  function changedB(i) {
    if (!TIERS) return false;
    var k = TIERS.key[i], rw = (tierState().B.rw[i] || '');
    if (k.keep) return false;
    return !!norm(rw) && norm(rw) !== norm(k.t) && sentenceOk(rw);
  }
  function ideaHits(text) {
    var hits = [];
    (TIERS.key || []).forEach(function (k) { hits.push({ idea: k.idea, hit: !!(k.ideas && k.ideas.test(text)) }); });
    return hits;
  }
  function tierScores() {
    var out = {}, pts = 0, max = 0;
    if (!TIERS) return { out: out, pts: pts, max: max };
    var t = tierState(), A = t.A, B = t.B, C = t.C;
    if (A.order.first != null || A.topic.first != null || A.read) {
      var tp = A.topic.first === true ? 1 : 0;
      out.tierA = { order: A.order.best, order_first: A.order.first, topic: tp, read: A.read };
      pts += A.order.best + tp; max += TIERS.key.length + 1;
    }
    var nB = 0, anyB = false, maxB = 0;
    TIERS.key.forEach(function (k, i) { if (k.keep) return; maxB++; if (B.rw[i]) anyB = true; if (changedB(i)) nB++; });
    if (anyB) { out.tierB = nB; pts += nB; max += maxB; }
    if (norm(C.text)) {
      var w = wordsOf(C.text).length, hits = ideaHits(C.text).filter(function (h) { return h.hit; }).length;
      var p = (w >= (TIERS.summary.min || 25) ? 2 : (w >= 10 ? 1 : 0)) + (hits >= 3 ? 2 : (hits >= 1 ? 1 : 0)) + (C.revised ? 1 : 0);
      out.tierC = { words: w, ideas: hits, checked: C.checked, revised: C.revised, pts: p };
      pts += p; max += 5;
    }
    if (t.askNext) out.ask_next = true;
    return { out: out, pts: pts, max: max };
  }
  function speakPlain(text, rate) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(spokenWord(text)); var v = pickVoice('n'); if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = rate || 0.85; speechSynthesis.speak(u);
  }
  function dir(en, tag, cls) { tag = tag || 'p'; return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' translate="yes" data-en="' + esc(en) + '">' + esc(en) + '</' + tag + '>'; }

  function showTiers(scroll) {
    if (!TIERS) return;
    var box = $('tiersBox'); if (!box) return;
    var t = tierState(), open = assignedTier || t.open || '', h = '';
    h += '<h2 translate="yes">After the story</h2>';
    if (assignedTier) {
      var inf = TIER_INFO[assignedTier];
      h += '<div class="tcards one"><div class="tcard on"><span class="te">' + inf.e + '</span><b>' + assignedTier + '. ' + esc(inf.name) + '</b>' + dir(inf.blurb, 'span', 'tb') + '</div>' +
           '<button class="btn alt asknext' + (t.askNext ? ' on' : '') + '" id="askNext" translate="yes" data-en="' + (t.askNext ? 'Your teacher knows you are ready. Keep working.' : 'Ready for the next one? Ask your teacher.') + '">' +
           (t.askNext ? '🙋 Your teacher knows you are ready. Keep working.' : '🙋 Ready for the next one? Ask your teacher.') + '</button></div>';
    } else {
      h += dir(TIERS.ask, 'p', 'lead');
      h += '<div class="tcards">';
      ['A', 'B', 'C'].forEach(function (k) {
        var inf = TIER_INFO[k];
        h += '<button class="tcard' + (open === k ? ' on' : '') + '" data-t="' + k + '"><span class="te">' + inf.e + '</span><b>' + k + '. ' + esc(inf.name) + '</b>' + dir(inf.blurb, 'span', 'tb') + '</button>';
      });
      h += '</div>';
    }
    h += '<div class="tpanel" id="tpanel"></div>';
    box.innerHTML = h;
    $('tiers').style.display = 'block';
    showDirections(box);
    box.querySelectorAll('.tcard[data-t]').forEach(function (b) {
      b.addEventListener('click', function () { tierState().open = b.getAttribute('data-t'); touch(); showTiers(false); });
    });
    if ($('askNext')) $('askNext').addEventListener('click', function () { tierState().askNext = !tierState().askNext; touch(); save(); showTiers(false); });
    if (open === 'A') renderTierA($('tpanel'));
    else if (open === 'B') renderTierB($('tpanel'));
    else if (open === 'C') renderTierC($('tpanel'));
    score();
    if (scroll) $('tiers').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Tier A ---------- */
  var SAY_CTL = null;
  function readDecks() {
    var decks = [{ k: 'key', name: 'Key sentences', e: '⭐', items: TIERS.key.map(function (k) { return k.t; }) }];
    EP.scenes.forEach(function (sc, si) {
      var items = [];
      sc.lines.forEach(function (ln) { if (ln.type === 'q' || ln.sA || ln.sB) return; var s = ln.A || txt(ln); if (s && !ln.teaser) items.push(s); });
      if (items.length) decks.push({ k: 's' + (si + 1), name: 'Scene ' + (si + 1), e: '🎬', items: items });
    });
    return decks;
  }
  function renderTierA(root) {
    var A = tierState().A, step = A.step || 0, h = '';
    var steps = ['Read along', 'Put the story in order', 'Pick the topic sentence'];
    h += '<div class="tsteps">';
    steps.forEach(function (s, i) { h += '<button class="tstep' + (i === step ? ' on' : '') + '" data-i="' + i + '" translate="yes" data-en="' + esc(s) + '">' + (i + 1) + '. ' + esc(s) + '</button>'; });
    h += '</div><div id="tstepBody"></div>';
    root.innerHTML = h;
    root.querySelectorAll('.tstep').forEach(function (b) { b.addEventListener('click', function () { tierState().A.step = +b.getAttribute('data-i'); touch(); renderTierA(root); }); });
    showDirections(root);
    var body = $('tstepBody');
    if (step === 0) renderRead(body); else if (step === 1) renderOrder(body); else renderTopic(body);
  }
  function renderRead(root) {
    root.innerHTML = dir('Listen to each line. Then say it. The microphone listens and shows a check when it understands you. Start with the Key sentences.', 'p', 'lead') + '<div class="saywrap" id="sayMount"></div>';
    showDirections(root);
    if (!window.Say || !window.Say.mount) { $('sayMount').innerHTML = '<p class="soft">The speaking tool did not load. Check your internet and refresh.</p>'; return; }
    if (SAY_CTL) { try { SAY_CTL.destroy(); } catch (e) {} SAY_CTL = null; }
    SAY_CTL = Say.mount($('sayMount'), {
      decks: readDecks(), setName: 'reel-' + EP.id,
      student: function () { return me.email ? { email: me.email, name: me.name, period: me.period } : null; },
      lang: function () { return state.lang || 'none'; },
      translate: function (text, anchor) {
        var el = anchor || $('sayMount'), had = el.getAttribute('data-w');
        el.setAttribute('data-w', text); wordPop(el, text);
        if (had == null) el.removeAttribute('data-w'); else el.setAttribute('data-w', had);
      },
      onProgress: function (ok, total) { tierState().A.read = { ok: ok, total: total }; score(); touch(); }
    });
  }
  function shuffledIdx(n) {
    var a = [], i, j, t;
    for (i = 0; i < n; i++) a.push(i);
    do { for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } }
    while (n > 1 && a.every(function (v, k) { return v === k; }));
    return a;
  }
  var ordSel = null;
  function renderOrder(root) {
    var o = tierState().A.order, n = TIERS.key.length, i;
    if (!o.shuf || o.shuf.length !== n) { o.shuf = shuffledIdx(n); o.slots = []; for (i = 0; i < n; i++) o.slots.push(null); }
    var placed = {};
    o.slots.forEach(function (v) { if (v != null) placed[v] = 1; });
    var h = dir('Tap a sentence. Then tap its place in the list, 1 to 5. Tap a sentence in the list to take it out.', 'p', 'lead');
    h += '<div class="ord"><div class="opool" id="opool">';
    o.shuf.forEach(function (k) {
      if (placed[k]) return;
      h += '<div class="ochip' + (ordSel === k ? ' sel' : '') + '" draggable="true" data-k="' + k + '" translate="no"><button class="osay" data-k="' + k + '" aria-label="Listen">🔊</button><span>' + esc(TIERS.key[k].t) + '</span></div>';
    });
    h += '</div><ol class="oslots" id="oslots">';
    for (i = 0; i < n; i++) {
      var v = o.slots[i];
      h += '<li class="oslot' + (v != null ? ' full' : '') + '" data-i="' + i + '"><span class="onum">' + (i + 1) + '</span>' +
           (v != null ? '<div class="ochip in" draggable="true" data-k="' + v + '" translate="no"><button class="osay" data-k="' + v + '" aria-label="Listen">🔊</button><span>' + esc(TIERS.key[v].t) + '</span></div>' : '<span class="ohint" translate="yes" data-en="Tap here">Tap here</span>') + '</li>';
    }
    h += '</ol></div>';
    h += '<div class="row"><button class="btn" id="ordCheck" translate="yes">Check</button><button class="btn alt" id="ordReset" translate="yes">Start over</button><span id="ordMsg" translate="yes"></span></div>';
    root.innerHTML = h;
    showDirections(root);
    function redraw() { touch(); renderOrder(root); }
    function placeAt(k, i) {
      var cur = o.slots.indexOf(k); if (cur >= 0) o.slots[cur] = null;
      o.slots[i] = k; ordSel = null; redraw();
    }
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(TIERS.key[+b.getAttribute('data-k')].t); }); });
    root.querySelectorAll('#opool .ochip').forEach(function (c) {
      c.addEventListener('click', function () { var k = +c.getAttribute('data-k'); ordSel = ordSel === k ? null : k; renderOrder(root); });
      c.addEventListener('dragstart', function (e) { ordSel = +c.getAttribute('data-k'); try { e.dataTransfer.setData('text/plain', String(ordSel)); } catch (x) {} });
    });
    root.querySelectorAll('.oslot').forEach(function (li) {
      var i = +li.getAttribute('data-i');
      li.addEventListener('click', function () {
        if (ordSel != null) { placeAt(ordSel, i); return; }
        if (o.slots[i] != null) { o.slots[i] = null; redraw(); }
      });
      li.addEventListener('dragover', function (e) { e.preventDefault(); li.classList.add('over'); });
      li.addEventListener('dragleave', function () { li.classList.remove('over'); });
      li.addEventListener('drop', function (e) { e.preventDefault(); li.classList.remove('over'); if (ordSel != null) placeAt(ordSel, i); });
      var inChip = li.querySelector('.ochip');
      if (inChip) inChip.addEventListener('dragstart', function (e) { ordSel = +inChip.getAttribute('data-k'); try { e.dataTransfer.setData('text/plain', String(ordSel)); } catch (x) {} });
    });
    $('ordCheck').addEventListener('click', function () {
      if (o.slots.some(function (v) { return v == null; })) { $('ordMsg').textContent = 'Put all five sentences in the list first.'; showDirections(root); return; }
      var right = 0;
      root.querySelectorAll('.oslot').forEach(function (li) {
        var i = +li.getAttribute('data-i'), ok = o.slots[i] === i;
        li.classList.toggle('ok', ok); li.classList.toggle('bad', !ok); if (ok) right++;
      });
      o.tries++; if (o.first == null) o.first = right; if (right > o.best) o.best = right;
      var msg = right === n ? 'Yes! That is the story, 1 to 5.' : right + ' of ' + n + ' are in the right place. Move the red ones.';
      $('ordMsg').setAttribute('data-en', msg); $('ordMsg').textContent = msg; showDirections(root);
      score(); touch(); save();
    });
    $('ordReset').addEventListener('click', function () { o.shuf = shuffledIdx(n); o.slots = []; for (var j = 0; j < n; j++) o.slots.push(null); ordSel = null; redraw(); });
  }
  function renderTopic(root) {
    var T = TIERS.topic, tp = tierState().A.topic, h = '';
    h += '<p class="lead"><span translate="yes" data-en="A topic sentence tells what the whole story is about.">A topic sentence tells what the whole story is about.</span></p>';
    h += '<p class="qtext" translate="no">' + esc(T.ask) + '</p><div class="topts">';
    T.opts.forEach(function (o, i) {
      var cls = tp.pick === i ? (i === T.good ? ' right' : ' wrong') : '';
      h += '<div class="toptrow"><button class="osay" data-k="' + i + '" aria-label="Listen">🔊</button><button class="qopt' + cls + '" data-i="' + i + '" translate="no">' + esc(o) + '</button></div>';
    });
    h += '</div><p class="qmsg" id="topicMsg" translate="yes"' + (tp.pick != null ? ' data-en="' + esc(T.why[tp.pick]) + '">' + esc(T.why[tp.pick]) : '>') + '</p>';
    root.innerHTML = h;
    showDirections(root);
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); speakPlain(T.opts[+b.getAttribute('data-k')]); }); });
    root.querySelectorAll('.qopt').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        tp.tries++; if (tp.first == null) tp.first = (i === T.good);
        tp.pick = i; score(); touch(); save(); renderTopic(root);
      });
    });
  }

  /* ---------- Tier B ---------- */
  var ladderOpen = null;
  function renderTierB(root) {
    var B = tierState().B, h = '';
    h += dir('Say each sentence in a new way. Tap the orange words to see other ways to say them. Change at least one thing, but keep the meaning.', 'p', 'lead');
    TIERS.key.forEach(function (k, i) {
      if (k.keep && !B.rw[i]) B.rw[i] = k.t;
      var orig = k.swap ? esc(k.t).replace(esc(k.swap), '<button class="swapw" data-i="' + i + '">' + esc(k.swap) + '</button>') : esc(k.t);
      var ok = changedB(i), rw = B.rw[i] || '', st = '';
      if (k.keep) st = '<span class="rwok keep" translate="yes" data-en="Keep this one. Names and countries stay the same.">Keep this one. Names and countries stay the same.</span>';
      else if (ok) st = '<span class="rwok yes" translate="yes" data-en="Changed. It still makes sense.">✓ Changed. It still makes sense.</span>';
      else if (norm(rw) && norm(rw) === norm(k.t)) st = '<span class="rwok no" translate="yes" data-en="This is the same as the original. Change at least one word.">This is the same as the original. Change at least one word.</span>';
      else if (norm(rw) && !sentenceOk(rw)) st = '<span class="rwok no" translate="yes" data-en="Start with a capital letter and end with a period.">Start with a capital letter and end with a period.</span>';
      h += '<div class="rw' + (ok ? ' done' : '') + '"><div class="rwo"><span class="lab" translate="yes" data-en="Original">Original</span><p translate="no">' + orig + '<button class="osay" data-k="' + i + '" aria-label="Listen">🔊</button></p>' +
           (k.swap ? '<div class="ladder' + (ladderOpen === i ? ' on' : '') + '" id="lad' + i + '"></div>' : '') + '</div>' +
           '<div class="rwm"><span class="lab" translate="yes" data-en="Your sentence">Your sentence</span><textarea data-i="' + i + '" translate="no" spellcheck="false">' + esc(rw) + '</textarea>' + st + '</div></div>';
    });
    h += '<div class="row"><button class="btn" id="bTurnIn" translate="yes">Turn in</button><span id="bMsg" translate="yes"></span></div>';
    root.innerHTML = h;
    showDirections(root);
    var labels = ['Small change', 'A step further', 'Freer, more detail'];
    function fillLadder(i) {
      var k = TIERS.key[i], el = $('lad' + i); if (!el) return;
      var s = '';
      k.rungs.forEach(function (r, ri) {
        s += '<div class="rung"><span class="rlab" translate="yes" data-en="' + esc(labels[ri]) + '">' + esc(labels[ri]) + '</span>';
        r.forEach(function (opt) { s += '<button class="rchip" data-i="' + i + '" data-o="' + esc(opt) + '" translate="no">' + esc(opt) + '</button>'; });
        s += '</div>';
      });
      el.innerHTML = s;
      showDirections(el);
      el.querySelectorAll('.rchip').forEach(function (c) {
        c.addEventListener('click', function () {
          var opt = c.getAttribute('data-o'), out = /\.$/.test(opt) ? opt : k.t.replace(k.swap, opt);
          B.rw[i] = out; ladderOpen = null; touch(); score(); renderTierB(root);
          var ta = root.querySelector('textarea[data-i="' + i + '"]'); if (ta) ta.focus();
        });
      });
    }
    root.querySelectorAll('.swapw').forEach(function (b) {
      b.addEventListener('click', function () { var i = +b.getAttribute('data-i'); ladderOpen = ladderOpen === i ? null : i; renderTierB(root); });
    });
    if (ladderOpen != null) fillLadder(ladderOpen);
    root.querySelectorAll('.osay').forEach(function (b) { b.addEventListener('click', function () { speakPlain(TIERS.key[+b.getAttribute('data-k')].t); }); });
    root.querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', function () { B.rw[+ta.getAttribute('data-i')] = ta.value; score(); touch(); });
      ta.addEventListener('change', function () { renderTierB(root); });
    });
    $('bTurnIn').addEventListener('click', function () {
      state.turned = true; save();
      var n = 0, mx = 0; TIERS.key.forEach(function (k, i) { if (k.keep) return; mx++; if (changedB(i)) n++; });
      var m = 'Saved. ' + n + ' of ' + mx + ' sentences are changed.'; $('bMsg').setAttribute('data-en', m); $('bMsg').textContent = m; showDirections(root);
    });
  }

  /* ---------- Tier C ---------- */
  function sourceText() {
    var parts = [];
    EP.scenes.forEach(function (sc) { sc.lines.forEach(function (ln) { if (ln.type === 'q') return; if (ln.A) parts.push(ln.A); if (ln.B) parts.push(ln.B); }); });
    TIERS.key.forEach(function (k) { parts.push(k.t); });
    return ' ' + parts.map(norm).join(' | ') + ' ';
  }
  function copiedRuns(text, minLen) {
    var src = sourceText(), w = wordsOf(text), runs = [], i = 0;
    while (i < w.length) {
      var j = i + 1, best = null;
      while (j <= w.length) {
        var ph = ' ' + w.slice(i, j).join(' ') + ' ';
        if (src.indexOf(ph) < 0) break;
        if (j - i >= minLen) best = w.slice(i, j).join(' ');
        j++;
      }
      if (best) { runs.push(best); i = j - 1; } else i++;
    }
    return runs;
  }
  function splitSent(s) { return (String(s).match(/[^.!?]+[.!?]*\s*/g) || [s]).map(function (x) { return x.trim(); }); }
  function grammarFix(text) {
    var rules = [
      { re: /(^|\s)i(\s|'|\u2019)/, fix: function (s) { return s.replace(/(^|\s)i(\s|'|\u2019)/, '$1I$2'); }, why: 'Write I with a capital letter.' },
      { re: /(^|[.!?]\s+)[a-z]/, fix: function (s) { return s.replace(/(^|[.!?]\s+)([a-z])/, function (m, a, b) { return a + b.toUpperCase(); }); }, why: 'Start each sentence with a capital letter.' },
      { re: /\b(she|he|linh|mateo|amira|jun|paolo)\s+(have)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh|mateo|amira|jun|paolo)\s+have\b/i, '$1 has'); }, why: 'With she or he, use has.' },
      { re: /\b(she|he|linh)\s+(are|am)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(are|am)\b/i, '$1 is'); }, why: 'With she or he, use is.' },
      { re: /\b(she|he|linh)\s+(don't|dont)\b/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(don't|dont)\b/i, "$1 doesn't"); }, why: 'With she or he, use doesn\u2019t.' },
      { re: /\b(she|he|linh)\s+(ask|talk|write|meet|feel|say|like|go|walk|sit|want|need|make|see|learn|play)\s/i, fix: function (s) { return s.replace(/\b(she|he|linh)\s+(ask|talk|write|meet|feel|say|like|go|walk|sit|want|need|make|see|learn|play)\s/i, function (m, a, b) { return a + ' ' + b + (b === 'go' ? 'es' : 's') + ' '; }); }, why: 'With she or he, the verb takes -s: she asks, she writes.' },
      { re: /\bis (new student|student|girl|boy|teacher|friend)\b/i, fix: function (s) { return s.replace(/\bis (new student|student|girl|boy|teacher|friend)\b/i, 'is a $1'); }, why: 'Use a before a singular noun: a new student.' },
      { re: /\bis (nervous|happy|shy|new|short|tall|comfortable|scared)\s+(linh|she|he)\b/i, fix: function (s) { return s.replace(/\bis (nervous|happy|shy|new|short|tall|comfortable|scared)\s+(linh|she|he)\b/i, 'is $1. $2'); }, why: 'Put a period between two sentences.' },
      { re: /[a-z]\s*$/i, fix: function (s) { return s.replace(/\s*$/, '.'); }, why: 'End your last sentence with a period.' }
    ];
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].re.test(text)) {
        var fixed = rules[i].fix(text);
        if (fixed !== text) {
          var a = splitSent(text), b = splitSent(fixed), k;
          for (k = 0; k < a.length; k++) if (a[k] !== b[k]) break;
          return { before: a[k] || text, after: b[k] || fixed, why: rules[i].why };
        }
      }
    }
    return null;
  }
  function localFeedback(text) {
    var fb = { copied: copiedRuns(text, 5), ideas: ideaHits(text), fix: grammarFix(text), notes: [] };
    var w = wordsOf(text).length, min = TIERS.summary.min || 25;
    if (w < min) fb.notes.push('You wrote ' + w + ' words. Try for ' + min + ' or more.');
    if (TIERS.summary.teaser && TIERS.summary.teaser.test(text)) fb.notes.push('The backpack is a teaser for the next episode. Leave it out of the summary.');
    return fb;
  }
  function remoteFeedback(text, cb) {
    var done = false, timer = setTimeout(function () { if (!done) { done = true; cb(null); } }, 9000);
    var u = PROXY + '?action=feedback&text=' + encodeURIComponent(text) + '&source=' + encodeURIComponent(TIERS.key.map(function (k) { return k.t; }).join(' ')) +
            '&lang=' + encodeURIComponent(state.lang || '') + '&level=' + encodeURIComponent(state.level);
    fetch(u).then(function (r) { return r.json(); }).then(function (d) {
      if (done) return; done = true; clearTimeout(timer);
      cb(d && d.ok && d.feedback && typeof d.feedback === 'object' ? d.feedback : null);
    }).catch(function () { if (!done) { done = true; clearTimeout(timer); cb(null); } });
  }
  function renderTierC(root) {
    var C = tierState().C, S = TIERS.summary, h = '';
    h += dir(S.hint, 'p', 'lead');
    h += '<div class="cgrid"><div class="cframes" id="cframes"></div><div class="cwrite">' +
         '<span class="lab" translate="yes" data-en="My summary">My summary</span>' +
         '<textarea id="cText" translate="no" spellcheck="false" placeholder="Linh is ...">' + esc(C.text) + '</textarea>' +
         '<div class="row"><span class="wc" id="cCount"></span><button class="btn" id="cCheck" translate="yes">Check my writing</button><button class="btn alt" id="cTurnIn" translate="yes">Turn in</button><span id="cMsg" translate="yes"></span></div>' +
         '<div class="fb" id="cFb"></div></div></div>';
    root.innerHTML = h;
    showDirections(root);
    var fh = '';
    EP.scenes.forEach(function (sc, si) {
      var first = null;
      for (var i = 0; i < sc.lines.length; i++) if (sc.lines[i].type !== 'q') { first = sc.lines[i]; break; }
      fh += '<div class="cframe">' + R.sceneSVG(boardState(sc)) + '<p translate="no"><b>' + (si + 1) + '.</b> ' + esc(first ? (first.A || txt(first)) : '') + '</p></div>';
    });
    $('cframes').innerHTML = fh;
    function count() { var n = wordsOf($('cText').value).length; $('cCount').textContent = n + (n === 1 ? ' word' : ' words'); }
    count();
    $('cText').addEventListener('input', function () {
      C.text = this.value; count();
      if (C.checked && norm(C.text) && norm(C.text) !== norm(C.draft1)) C.revised = true;
      score(); touch();
    });
    function showFb(fb) {
      var s = '';
      if (fb.copied && fb.copied.length) {
        s += '<div class="fbrow copy"><b translate="yes" data-en="These words are copied from the story. Say them your way.">These words are copied from the story. Say them your way.</b><ul>';
        fb.copied.forEach(function (c) { s += '<li translate="no">\u201c' + esc(c) + '\u201d</li>'; });
        s += '</ul></div>';
      } else s += '<div class="fbrow good"><b translate="yes" data-en="Your words are your own. Good.">✓ Your words are your own. Good.</b></div>';
      if (fb.ideas && fb.ideas.length) {
        s += '<div class="fbrow ideas"><b translate="yes" data-en="Does it say what happened?">Does it say what happened?</b><ul>';
        fb.ideas.forEach(function (it) { s += '<li class="' + (it.hit ? 'hit' : 'miss') + '" translate="yes" data-en="' + esc(it.idea) + '">' + (it.hit ? '✓ ' : '○ ') + esc(it.idea) + '</li>'; });
        s += '</ul></div>';
      }
      if (fb.fix && fb.fix.after) {
        s += '<div class="fbrow fix"><b translate="yes" data-en="One thing to fix:">One thing to fix:</b>' + (fb.fix.why ? ' <span translate="yes" data-en="' + esc(fb.fix.why) + '">' + esc(fb.fix.why) + '</span>' : '') +
             '<p translate="no"><s>' + esc(fb.fix.before) + '</s><br>\u2192 <b>' + esc(fb.fix.after) + '</b></p></div>';
      }
      (fb.notes || []).forEach(function (n) { s += '<div class="fbrow note" translate="yes" data-en="' + esc(n) + '">' + esc(n) + '</div>'; });
      if (fb.note) s += '<div class="fbrow note" translate="no">' + esc(fb.note) + '</div>';
      s += '<div class="fbrow next" translate="yes" data-en="Now change one thing in your summary. Then turn it in.">Now change one thing in your summary. Then turn it in.</div>';
      $('cFb').innerHTML = s; $('cFb').style.display = 'block';
      showDirections($('cFb'));
    }
    if (C.fb) showFb(C.fb);
    $('cCheck').addEventListener('click', function () {
      var text = $('cText').value.trim();
      if (wordsOf(text).length < 5) { $('cMsg').setAttribute('data-en', 'Write a few sentences first.'); $('cMsg').textContent = 'Write a few sentences first.'; showDirections(root); return; }
      $('cCheck').disabled = true; $('cCheck').textContent = '…';
      var local = localFeedback(text);
      remoteFeedback(text, function (rf) {
        $('cCheck').disabled = false; $('cCheck').textContent = 'Check my writing';
        var fb = local;
        if (rf) { fb = { copied: rf.copied || local.copied, ideas: rf.ideas || local.ideas, fix: rf.fix || local.fix, notes: rf.notes || local.notes, note: rf.note || '' }; }
        C.fb = fb; C.checked++; if (!C.draft1) C.draft1 = text; C.revised = false;
        C.text = text; showFb(fb); score(); touch(); save();
      });
    });
    $('cTurnIn').addEventListener('click', function () {
      C.text = $('cText').value; state.turned = true; save();
      $('cMsg').setAttribute('data-en', 'Saved. You can keep editing.'); $('cMsg').textContent = 'Saved. You can keep editing.'; showDirections(root);
    });
  }

  /* ---------- the teacher's tier switch (reel_views.tier) ---------- */
  function applyTier(v) {
    v = (v || '').toUpperCase(); if (!/^[ABC]$/.test(v)) v = '';
    if (v === assignedTier) return;
    assignedTier = v;
    if (assignedTier) { tierState().open = assignedTier; tierState().askNext = false; }
    if ($('tiers') && $('tiers').style.display === 'block') showTiers(false);
  }
  function pollTier() {
    if (!me.email) return;
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(me.email) + '&episode=eq.' + encodeURIComponent(EP.id) + '&select=tier', { headers: sbHead() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) { if (rows && rows[0]) applyTier(rows[0].tier); })
      .catch(function () {});
  }
  setInterval(pollTier, 30000);

  /* ================= STORYBOARD ================= */
  function boardState(sc) {
    var chars = (sc.chars || []).map(function (c) { var o = {}, k; for (k in c) o[k] = c[k]; return o; });
    sc.lines.forEach(function (ln) {
      var set = ln.set || {}, id, k;
      chars.forEach(function (c) { if (set[c.id]) for (k in set[c.id]) c[k] = set[c.id][k]; });
    });
    return { bg: sc.bg, board: sc.board, chars: chars, alt: sc.alt };
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
  var CANON_DOMAIN = '@s.sfusd.edu', ROSTER = [], CHOSEN_LANG = '';
  function cleanMail(x) { return String(x || '').trim().toLowerCase(); }
  function localPart(e) { return cleanMail(e).split('@')[0]; }
  function validMail(e) { return /^[^@\s]+@(s\.)?sfusd\.edu$/.test(cleanMail(e)); }
  function canonMail(raw) {
    var lp = localPart(raw), i;
    for (i = 0; i < ROSTER.length; i++) if (localPart(ROSTER[i].email) === lp) return cleanMail(ROSTER[i].email);
    return lp + CANON_DOMAIN;
  }
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
  function save() {
    if (!me.email) return;
    $('saved').className = 'saving';
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?on_conflict=email,episode', {
      method: 'POST', headers: sbHead('resolution=merge-duplicates,return=minimal'), body: JSON.stringify(payload())
    }).then(function (r) { $('saved').className = r.ok ? '' : 'err'; if (r.ok) pollTier(); })
      .catch(function () { $('saved').className = 'err'; });
  }
  function load() {
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(me.email) + '&episode=eq.' + encodeURIComponent(EP.id) + '&select=work,tier',
      { headers: sbHead() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var w = rows && rows[0] && rows[0].work;
        if (w) { for (var k in w) state[k] = w[k]; }
        if (rows && rows[0]) applyTier(rows[0].tier);
        afterLoad();
      }).catch(function () { afterLoad(); });
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
  setInterval(function () { if (dirty) { dirty = false; save(); } }, 20000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && dirty) { dirty = false; save(); } });
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
        else if ($('tiers') && $('tiers').style.display === 'block') showTiers(false);
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
    if ($('tierBtn')) $('tierBtn').addEventListener('click', function () { showTiers(true); });
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
  if (EP.tiers && !$('tiers')) {
    var tsec = document.createElement('section'); tsec.className = 'tiers'; tsec.id = 'tiers'; tsec.style.display = 'none';
    tsec.innerHTML = '<div class="tiersbox" id="tiersBox"></div>';
    $('yt').parentNode.insertBefore(tsec, $('yt').nextSibling);
  }
  $('epNum').textContent = 'Episode ' + EP.num;
  $('epTitle').textContent = EP.title;
  document.title = 'Story Reel ' + EP.num + ': ' + EP.title;
  wire();
  syncControls();
  render(0, true);
  dots();
})();
