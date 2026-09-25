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
  var WORDS = [];
  function renderCaption(ln) {
    var p = person(ln.who);
    $('who').textContent = ln.thought ? p.name + ' thinks' : p.name;
    $('who').style.background = p.color;
    $('cap').classList.toggle('thought', !!ln.thought);
    var text = ln.type === 'q' ? txt(ln.q) : txt(ln);
    var parts = text.split(/(\s+)/), h = '', n = 0, i;
    WORDS = [];
    var off = 0;
    for (i = 0; i < parts.length; i++) {
      var tok = parts[i];
      if (/^\s+$/.test(tok) || !tok) { h += tok; off += tok.length; continue; }
      var core = tok.replace(/[^A-Za-z'\u2019-]/g, '').toLowerCase().replace(/\u2019/g, "'");
      var cls = 'w' + (VOCAB[core] ? ' key' : '');
      h += '<span class="' + cls + '" data-i="' + n + '" data-w="' + esc(core) + '">' + esc(tok) + '</span>';
      WORDS.push({ start: off, end: off + tok.length, len: core.length || 1 });
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
  function say(text, p, done, lineAudio) {
    stopSpeech();
    var myId = ++playId, fired = false;
    function finish() {
      if (fired || myId !== playId) return;
      fired = true; clearInterval(hlTimer); clearTimeout(safety); hl(-1);
      done && done();
    }
    var rate = (p.rate || 1) * (state.slow ? 0.72 : 0.94);
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
      if (myId !== playId || typeof e.charIndex !== 'number') return;
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
    var u = new SpeechSynthesisUtterance(w); var v = pickVoice('n'); if (v) u.voice = v;
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
    if (ln.type === 'q') { showQ(ln); say(txt(ln.q), R.NARRATOR, null); return; }
    if (ln.who && cast[ln.who]) setTalking(ln.who);
    say(txt(ln), person(ln.who), function () {
      setTalking(null);
      if (then) then();
    }, ln.audio);
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
    h += '<p class="qkind" translate="yes">' + (ln.kind === 'predict' ? 'Predict. What do you think?' : 'Check. Choose the answer.') + '</p>';
    h += '<p class="qtext" translate="no">' + esc(txt(q)) + '</p>';
    h += '<div class="qopts">';
    opts.forEach(function (o, i) { h += '<button class="qopt" data-i="' + i + '" translate="no">' + esc(o) + '</button>'; });
    h += '</div>';
    h += '<div class="qfoot"><span class="qmsg" id="qmsg" translate="yes"></span><button class="go" id="qgo" style="display:none" translate="yes">Keep watching</button></div>';
    box.innerHTML = h; box.style.display = 'block';
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
    window.GAL_SCORE = r; window.GAL_MAX = t;
    return { checks_first_try: r, checks_total: t };
  }

  /* ================= TRANSLATION ================= */
  var tcache = {};
  function translate(text, lang, cb) {
    var key = lang + '|' + text;
    if (tcache[key]) { cb(tcache[key]); return; }
    var u = PROXY + '?action=translate&idiom=' + encodeURIComponent(text) + '&meaning=' + encodeURIComponent(text) +
            '&lang=' + encodeURIComponent(lang) + '&text=' + encodeURIComponent(text) + '&target=' + encodeURIComponent(lang);
    fetch(u).then(function (r) { return r.text(); }).then(function (t) {
      var v = t;
      try {
        var j = JSON.parse(t), tr = j.translation;
        if (tr && typeof tr === 'object') v = tr.equiv || tr.meaning || '';
        else v = tr || j.text || j.result || j.translatedText || '';
      } catch (e) {}
      v = String(v || '').trim() || '(no translation)';
      tcache[key] = v; cb(v);
    }).catch(function () { cb('(translation unavailable)'); });
  }
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) { if (pop && !pop.contains(e.target) && !e.target.classList.contains('w')) closePop(); });
  function wordPop(el) {
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
      $('popTr').textContent = '…';
      translate(w, state.lang, function (v) { if ($('popTr')) $('popTr').textContent = v; });
    } else {
      $('popTr').textContent = 'Choose your language at the top to see a translation.';
    }
  }

  /* ================= YOUR TURN ================= */
  function showYourTurn(scroll) {
    var yt = EP.yourTurn[state.level] || EP.yourTurn.A, h = '';
    var saved = state.yt[state.level] || (state.yt[state.level] = []);
    h += '<h2>Your turn</h2><p class="lead" translate="yes">' + esc(yt.intro) + '</p>';
    yt.prompts.forEach(function (p, i) {
      h += '<div class="prompt"><label for="yt' + i + '" translate="yes">' + (i + 1) + '. ' + esc(p.ask) + '</label>' +
           '<textarea id="yt' + i + '" data-i="' + i + '" placeholder="' + esc(p.frame) + '" translate="no" spellcheck="false">' + esc(saved[i] || '') + '</textarea></div>';
    });
    h += '<p class="speakit" translate="yes">🗣️ ' + esc(yt.speak) + '</p>';
    h += '<div class="row"><button class="btn" id="turnIn" translate="yes">' + (state.turned ? 'Turned in. Turn in again' : 'Turn in') + '</button>' +
         '<button class="btn alt" id="rewatch" translate="yes">Watch again</button><span id="ytMsg"></span></div>';
    $('ytBox').innerHTML = h;
    $('yt').style.display = 'block';
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
  }
  function highlights() {
    var s = state.yt[state.level] || [];
    window.GAL_HIGHLIGHTS = s.filter(function (x) { return x && x.trim(); }).slice(0, 2).map(function (x, i) {
      return { label: i ? 'Compare sentence' : 'Describe a classmate', text: x.trim() };
    });
  }

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
  var CANON_DOMAIN = '@s.sfusd.edu', ROSTER = [];
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
    var canon = canonMail(raw);
    recordAlias(raw, canon); seedStudent(n, canon, p);
    me.name = n; me.email = canon; me.period = p;
    try { localStorage.setItem('reel_me', JSON.stringify(me)); localStorage.setItem('gal_student_email', canon); } catch (e) {}
    $('gate').style.display = 'none';
    load();
  }

  /* ================= SAVE / LOAD ================= */
  function payload() {
    return [{ email: me.email, episode: EP.id, student_name: me.name, period: me.period, level: state.level, lang: state.lang,
              work: state, scores: score(), turned_in: state.turned, updated_at: new Date().toISOString() }];
  }
  function lsKey() { return 'reel_' + EP.id + '_' + me.email; }
  function save() {
    if (!me.email) return;
    $('saved').className = 'saving';
    try { localStorage.setItem(lsKey(), JSON.stringify(state)); } catch (e) {}
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?on_conflict=email,episode', {
      method: 'POST', headers: sbHead('resolution=merge-duplicates,return=minimal'), body: JSON.stringify(payload())
    }).then(function (r) { $('saved').className = r.ok ? '' : 'err'; })
      .catch(function () { $('saved').className = 'err'; });
  }
  function load() {
    fetch(SUPA_URL + '/rest/v1/' + TABLE + '?email=eq.' + encodeURIComponent(me.email) + '&episode=eq.' + encodeURIComponent(EP.id) + '&select=work',
      { headers: sbHead() })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        var w = rows && rows[0] && rows[0].work;
        if (!w) { try { w = JSON.parse(localStorage.getItem(lsKey()) || 'null'); } catch (e) {} }
        if (w) { for (var k in w) state[k] = w[k]; }
        afterLoad();
      }).catch(function () {
        try { var w = JSON.parse(localStorage.getItem(lsKey()) || 'null'); if (w) for (var k in w) state[k] = w[k]; } catch (e) {}
        afterLoad();
      });
  }
  function afterLoad() {
    if (!state.yt) state.yt = { A: [], B: [] };
    pos = Math.min(state.pos || 0, STEPS.length - 1);
    syncControls();
    render(pos, true);
    if (pos > 0) {
      $('curtainMsg').textContent = 'Continue from scene ' + (STEPS[pos].si + 1);
      $('again').style.display = '';
    }
    if (state.done) showYourTurn(false);
    score(); highlights();
  }
  setInterval(function () { if (dirty) { dirty = false; save(); } }, 2500);
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
      if (e.target.classList.contains('w')) wordPop(e.target);
    });
    $('trBtn').addEventListener('click', function () {
      var ln = STEPS[pos].ln, t = ln.type === 'q' ? txt(ln.q) : txt(ln);
      if (!state.lang) { $('capTr').textContent = 'Choose your language at the top first.'; return; }
      $('capTr').textContent = '…';
      translate(t, state.lang, function (v) { $('capTr').textContent = v; });
    });
    document.querySelectorAll('#levelSeg button').forEach(function (b) {
      b.addEventListener('click', function () {
        state.level = b.getAttribute('data-l'); syncControls(); touch();
        render(pos, true);
        if ($('yt').style.display === 'block') showYourTurn(false);
      });
    });
    $('lang').addEventListener('change', function () { state.lang = this.value; touch(); });
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
    try {
      var s = JSON.parse(localStorage.getItem('reel_me') || 'null');
      if (s && s.email) { $('gname').value = s.name || ''; $('gmail').value = s.email; $('gper').value = String(s.period || '').replace(/[^0-9]/g, ''); }
      else { var g = localStorage.getItem('gal_student_email'); if (g) $('gmail').value = g; }
    } catch (e) {}
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
})();
