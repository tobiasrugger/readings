/* =====================================================================
   lesson.js — the parts every phonics lesson shares.
   Needs /readings/vocab/mywords/words.js and /readings/phonics/phonics.js first.

   A lesson page calls:
     PL.init({
       rule:'digraphs', slug:'phonics-digraphs',
       panes:[['p-learn','Learn'], ...],          tab ids and labels
       prog:['sort','hear','match','say','spell'], parts shown at the top
       ruleText:'...',                             for "Show in my language"
       onStart:function(){ ...build activities... },
       onTab:function(paneId){ ... }
     });
   and then uses PL.sort(), PL.say(), PL.spell() and the helpers below.

   Page needs: #prog #lang #notMe #gate(#gName #gMail #gPer #gBtn #gErr) #app #tabs
               optional #ruleTrBtn #ruleTr #l1 #l1h #l1t #l1Btn #l1Tr
   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var PL = window.PL = {};
var esc = PL.esc = MW.esc;
var $ = PL.$ = function(id){ return document.getElementById(id); };
PL.shuffle = function(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
PL.speak = function(t, slow){ MW.speak(t, slow); };
PL.ME = { email:'', name:'', period:'' };
PL.LANG = MW.getLang('');
var CFG = {}, SC = {}, WORK = { rounds:{} };

/* ---------------- save + progress ---------------- */
function save(){
  if (!PL.ME.email) return;
  PH.sb('phonics_work?on_conflict=email,rule', { method:'POST', prefer:'resolution=merge-duplicates,return=minimal',
    body:[{ email:PL.ME.email, rule:CFG.rule, name:PL.ME.name || null, period:PL.ME.period || null,
            scores:SC, work:WORK, updated_at:new Date().toISOString() }] });
}
PL.score = function(part, pct){
  WORK.rounds[part] = (WORK.rounds[part] || 0) + 1;
  SC[part] = Math.max(SC[part] || 0, pct);
  drawProg(); save();
};
function drawProg(){
  var R = PH.RULES[CFG.rule];
  $('prog').innerHTML = CFG.prog.map(function(p){
    var d = (SC[p] || 0) >= 80;
    return '<span class="' + (d ? 'done' : '') + '">' + (d ? '\u2713 ' : '') + R.partNames[p] + (SC[p] != null ? ' ' + SC[p] + '%' : '') + '</span>';
  }).join('');
}
/* a round-over card with a restart button */
PL.doneCard = function(el, big, msg, btnLabel, again){
  el.innerHTML = '<div class="done-card"><div class="big">' + big + '</div><p>' + msg + '</p><button class="btn">' + btnLabel + '</button></div>';
  el.querySelector('button').onclick = again;
};

/* ---------------- language ---------------- */
PL.trInto = function(el, text){
  el.classList.remove('hide'); el.textContent = '\u2026';
  if (MW.RTL[PL.LANG]) el.setAttribute('dir', 'rtl'); else el.removeAttribute('dir');
  MW.translate(text, PL.LANG).then(function(t){ el.textContent = t || '(translation unavailable)'; });
};
function drawLeads(){
  Array.prototype.forEach.call(document.querySelectorAll('[data-k][data-en]'), function(p){
    var en = p.getAttribute('data-en');
    p.textContent = en;
    if (!PL.LANG) return;
    var b = document.createElement('button'); b.className = 'lrev'; b.textContent = 'Translate';
    b.onclick = function(){
      b.remove(); var s = document.createElement('span'); s.className = 'ltr'; p.appendChild(s); PL.trInto(s, en);
      if (PL.ME.email) PH.sb('instruction_reveals', { method:'POST', prefer:'return=minimal',
        body:[{ email:PL.ME.email, set_slug:CFG.slug, activity:p.getAttribute('data-k'), lang:PL.LANG }] });
    };
    p.appendChild(b);
  });
}
function drawL1(){
  if (!$('l1')) return;
  var note = PH.l1Note(CFG.rule, PL.LANG);
  $('l1').classList.toggle('hide', !note);
  $('l1t').textContent = note || '';
  $('l1Tr').classList.add('hide');
  var name = (MW.LANGS.filter(function(l){ return l[0] === PL.LANG; })[0] || [,''])[1];
  $('l1h').textContent = 'For ' + name + ' speakers';
}

/* ---------------- sign in ---------------- */
var EMAIL_RE = /^[^@\s]+@(s\.)?sfusd\.edu$/;
function canonicalEmail(typed){
  var lp = typed.split('@')[0], a = lp + '@s.sfusd.edu', b = lp + '@sfusd.edu';
  return PH.sb('students?select=email&email=in.(' + encodeURIComponent('"' + a + '","' + b + '"') + ')').then(function(rows){
    if (rows && rows.length) return rows.some(function(r){ return r.email === a; }) ? a : rows[0].email;
    return a;
  });
}

/* ---------------- init ---------------- */
PL.init = function(cfg){
  CFG = cfg;
  $('lang').innerHTML = MW.langOptions(PL.LANG);
  $('lang').addEventListener('change', function(){ PL.LANG = this.value; MW.setLang(PL.LANG); drawLeads(); drawL1(); });
  if ($('ruleTrBtn')) $('ruleTrBtn').onclick = function(){
    if (!PL.LANG){ alert('Choose your language at the top first.'); return; }
    PL.trInto($('ruleTr'), cfg.ruleText);
  };
  if ($('l1Btn')) $('l1Btn').onclick = function(){ PL.trInto($('l1Tr'), $('l1t').textContent); };

  /* tabs */
  var nav = $('tabs');
  cfg.panes.forEach(function(p, i){
    var b = document.createElement('button');
    b.textContent = p[1]; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', i ? 'false' : 'true');
    b.onclick = function(){
      cfg.panes.forEach(function(q){ $(q[0]).classList.remove('on'); });
      Array.prototype.forEach.call(nav.children, function(c){ c.setAttribute('aria-selected', 'false'); });
      $(p[0]).classList.add('on'); b.setAttribute('aria-selected', 'true');
      if (SORTS[p[0]]) SORTS[p[0]]();
      if (cfg.onTab) cfg.onTab(p[0]);
    };
    nav.appendChild(b);
  });
  $(cfg.panes[0][0]).classList.add('on');
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-say]'); if (!b) return;
    PL.speak(b.getAttribute('data-say'), !!b.getAttribute('data-slow'));
  });

  /* sign in */
  $('gBtn').onclick = function(){
    var name = $('gName').value.trim(), typed = $('gMail').value.trim().toLowerCase(), per = $('gPer').value, btn = this;
    if (!name){ $('gErr').textContent = 'Write your name.'; return; }
    if (!EMAIL_RE.test(typed)){ $('gErr').textContent = 'Use your school email. It ends with @s.sfusd.edu'; return; }
    if (!per){ $('gErr').textContent = 'Choose your period.'; return; }
    btn.disabled = true;
    canonicalEmail(typed).then(function(email){
      PL.ME = { email:email, name:name, period:per };
      try { localStorage.setItem('gal_student_email', email); localStorage.setItem('gal_student_name', name); localStorage.setItem('gal_student_period', per); } catch(e){}
      PH.sb('students?on_conflict=email', { method:'POST', prefer:'resolution=ignore-duplicates,return=minimal', body:[{ email:email, name:name, period:per }] });
      if (typed !== email) PH.sb('student_aliases?on_conflict=alias_email', { method:'POST', prefer:'resolution=ignore-duplicates,return=minimal', body:[{ alias_email:typed, email:email }] });
      $('gate').classList.add('hide'); start();
    }).finally(function(){ btn.disabled = false; });
  };
  $('notMe').onclick = function(e){ e.preventDefault(); try { localStorage.removeItem('gal_student_email'); } catch(err){} location.reload(); };

  try { PL.ME.email = localStorage.getItem('gal_student_email') || ''; PL.ME.name = localStorage.getItem('gal_student_name') || ''; PL.ME.period = localStorage.getItem('gal_student_period') || ''; } catch(e){}
  var qe = new URLSearchParams(location.search).get('email'); if (qe) PL.ME.email = qe.toLowerCase();
  if (PL.ME.email) start(); else { $('gate').classList.remove('hide'); $('gName').value = PL.ME.name; }

  setInterval(checkTranslation, 20000); setTimeout(checkTranslation, 4000);
};
function start(){
  $('notMe').classList.remove('hide'); $('app').classList.remove('hide');
  PH.sb('phonics_work?email=eq.' + encodeURIComponent(PL.ME.email) + '&rule=eq.' + CFG.rule + '&select=scores,work').then(function(rows){
    if (rows && rows[0]){ SC = rows[0].scores || {}; WORK = rows[0].work || { rounds:{} }; if (!WORK.rounds) WORK.rounds = {}; }
    drawProg();
  });
  if (!PL.LANG) PH.sb('students?email=eq.' + encodeURIComponent(PL.ME.email) + '&select=home_language').then(function(r){
    if (r && r[0] && r[0].home_language){ PL.LANG = MW.langFromHome(r[0].home_language); $('lang').value = PL.LANG; drawLeads(); drawL1(); }
  });
  drawProg(); drawLeads(); drawL1();
  CFG.onStart();
}

/* ---------------- SORT: hear a word, drag it (or tap) into a box ----------------
   PL.sort({ el, pane, part, bins:{key:{label, e, key}}, items:[{w, e, s}], mark(w), why(item) }) */
var SORTS = {};
PL.sort = function(o){
  var box = o.el, items = o.items, I = 0, right = 0, busy = false, keys = Object.keys(o.bins);
  function bin(s){
    var B = o.bins[s];
    return '<div class="bin" data-s="' + s + '"><div class="lab"><span class="k">' + B.e + '</span><span>' + esc(B.label) + '</span>'
      + (B.key ? ' <button class="btn ghost sm" data-say="' + esc(B.key) + '">' + esc(B.key) + '</button>' : '') + '</div>'
      + '<div class="pile"></div><button class="btn sm pick">This one</button></div>';
  }
  box.innerHTML = '<div class="count"></div><div class="dock"></div><div class="why"></div><div class="fb"></div>'
    + '<div class="bins">' + keys.map(bin).join('') + '</div>';
  var cnt = box.querySelector('.count'), dock = box.querySelector('.dock'), why = box.querySelector('.why'), fb = box.querySelector('.fb');
  Array.prototype.forEach.call(box.querySelectorAll('.bin'), function(b){ b.querySelector('.pick').onclick = function(){ drop(b.getAttribute('data-s')); }; });
  function play(){ var it = items[I]; if (it && !busy && $(o.pane).classList.contains('on')) setTimeout(function(){ PL.speak(it.w); }, 200); }
  SORTS[o.pane] = play;
  function card(){
    if (I >= items.length) return finish();
    busy = false;
    cnt.textContent = (I + 1) + ' of ' + items.length; why.textContent = ''; fb.textContent = '';
    dock.innerHTML = '<div class="scard" role="button" tabindex="0" aria-label="Play the word"><div><div class="play">\ud83d\udd0a</div><div class="sub">Tap to hear again</div></div></div>';
    drag(dock.querySelector('.scard')); play();
  }
  function drop(s){
    if (busy || I >= items.length) return; busy = true;
    var it = items[I], ok = s === it.s; if (ok) right++;
    var c = dock.querySelector('.scard'); c.style.transform = '';
    c.innerHTML = '<div class="rev">' + (it.e ? '<span class="e">' + it.e + '</span>' : '') + o.mark(it.w) + '</div>';
    why.textContent = o.why(it);
    fb.className = 'fb ' + (ok ? 'ok' : 'no');
    fb.textContent = ok ? 'Yes!' : 'Listen: ' + it.w + ' goes in "' + o.bins[it.s].label + '."';
    PL.speak(it.w, !ok);
    var chip = document.createElement('span'); chip.textContent = it.w; if (!ok) chip.className = 'miss'; if (it.heart) chip.classList.add('heart');
    box.querySelector('.bin[data-s="' + it.s + '"] .pile').appendChild(chip);
    setTimeout(function(){ I++; card(); }, ok ? 1500 : 2600);
  }
  function finish(){
    var pct = Math.round(100 * right / items.length); PL.score(o.part, pct);
    why.textContent = ''; fb.textContent = '';
    PL.doneCard(dock, right + ' of ' + items.length, pct >= 80 ? 'Great listening!' : 'Keep practicing. Try again with new words.', 'Sort new words',
      function(){ o.restart(); SORTS[o.pane](); });
  }
  function drag(el){
    var sx = null, sy, moved, over = null;
    el.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); PL.speak(items[I].w); } });
    el.addEventListener('pointerdown', function(e){ if (busy) return; sx = e.clientX; sy = e.clientY; moved = false; el.setPointerCapture(e.pointerId); el.classList.add('drag'); });
    el.addEventListener('pointermove', function(e){
      if (sx == null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + (dx / 30) + 'deg)';
      el.style.visibility = 'hidden';
      var under = document.elementFromPoint(e.clientX, e.clientY);
      el.style.visibility = '';
      var b = under && under.closest ? under.closest('.bin') : null;
      if (over && over !== b) over.classList.remove('over');
      over = b; if (b) b.classList.add('over');
    });
    el.addEventListener('pointerup', function(){
      el.classList.remove('drag');
      if (over){ over.classList.remove('over'); var s = over.getAttribute('data-s'); over = null; sx = null; drop(s); return; }
      el.style.transform = ''; sx = null; if (!moved) PL.speak(items[I].w);
    });
  }
  card();
};

/* ---------------- SAY: record, speech check ----------------
   PL.say({ el, part, items:[[word, emoji]], mark(w), why(w), restart }) */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition, MEDIA = null, CH = [];
PL.say = function(o){
  var st = o.el, I = 0, R = 0, tried = {};
  function draw(){
    if (I >= o.items.length){
      if (SR) PL.score(o.part, Math.round(100 * R / o.items.length));
      PL.doneCard(st, 'Done!', SR ? R + ' of ' + o.items.length + ' words heard clearly.' : 'Great practice.', 'Say them again', o.restart);
      return;
    }
    var w = o.items[I][0];
    st.innerHTML = '<div class="count">' + (I + 1) + ' of ' + o.items.length + '</div><div class="pic">' + (o.items[I][1] || '') + '</div>'
      + '<div class="bigword">' + o.mark(w) + '</div><div class="why">' + esc(o.why(w)) + '</div>'
      + '<div class="row" style="margin:10px 0"><button class="btn sm" data-say="' + esc(w) + '">Hear it</button><button class="btn ghost sm" data-say="' + esc(w) + '" data-slow="1">Slow</button></div>'
      + '<div class="row"><button class="btn rec">Record</button><button class="btn ghost hide mine">My voice</button></div>'
      + '<div class="heard"></div><div class="row" style="margin-top:12px"><button class="btn ghost sm next">Next word</button></div>';
    st.querySelector('.next').onclick = function(){ I++; draw(); };
    st.querySelector('.rec').onclick = function(){ record(w); };
  }
  function record(w){
    var btn = st.querySelector('.rec'), heard = st.querySelector('.heard');
    if (MEDIA && MEDIA.state === 'recording'){ MEDIA.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder){ heard.textContent = 'This computer cannot record. Say it out loud, then tap Next word.'; return; }
    navigator.mediaDevices.getUserMedia({ audio:true }).then(function(stream){
      CH = []; MEDIA = new MediaRecorder(stream);
      MEDIA.ondataavailable = function(e){ if (e.data.size) CH.push(e.data); };
      MEDIA.onstop = function(){
        stream.getTracks().forEach(function(t){ t.stop(); });
        btn.classList.remove('on'); btn.textContent = 'Record again';
        var url = URL.createObjectURL(new Blob(CH, { type:MEDIA.mimeType || 'audio/webm' }));
        var m = st.querySelector('.mine'); m.classList.remove('hide'); m.onclick = function(){ new Audio(url).play(); };
      };
      MEDIA.start(); btn.classList.add('on'); btn.textContent = 'Stop'; heard.textContent = 'Listening\u2026';
      if (SR) try {
        var r = new SR(); r.lang = 'en-US'; r.maxAlternatives = 5;
        r.onresult = function(ev){
          var alts = [], i; for (i = 0; i < ev.results[0].length; i++) alts.push(MW.norm(ev.results[0][i].transcript));
          var ok = alts.some(function(a){ return (' ' + a + ' ').indexOf(' ' + w.toLowerCase() + ' ') > -1; });
          heard.innerHTML = ok ? '<span style="color:var(--green)">I heard: ' + esc(w) + '. Clear!</span>' : 'I heard: <b>' + esc(alts[0] || '?') + '</b>. Listen and try again.';
          if (ok && !tried[w]) R++;
          tried[w] = 1;
          if (MEDIA && MEDIA.state === 'recording') MEDIA.stop();
        };
        r.onnomatch = function(){ heard.textContent = 'I did not hear it. Try again.'; };
        r.start();
      } catch(e){}
      setTimeout(function(){ if (MEDIA && MEDIA.state === 'recording') MEDIA.stop(); }, 5000);
    }).catch(function(){ heard.textContent = 'Allow the microphone. Or say it out loud.'; });
  }
  draw();
};

/* ---------------- SPELL: letter boxes, yellow = right sound ----------------
   PL.spell({ el, part, words:[...], emoji(w), restart }) */
PL.spell = function(o){
  var st = o.el, I = 0, R = 0;
  function draw(){
    if (I >= o.words.length){
      var pct = Math.round(100 * R / o.words.length); PL.score(o.part, pct);
      PL.doneCard(st, R + ' of ' + o.words.length, 'right the first time', 'Spell new words', o.restart);
      return;
    }
    var T = o.words[I], wrong = 0, done = false, prev = 0, idle = null, nudged = false, i;
    var boxes = ''; for (i = 0; i < T.length; i++) boxes += '<span class="lbox" data-i="' + i + '"></span>';
    st.innerHTML = '<div class="count">' + (I + 1) + ' of ' + o.words.length + '</div><div class="pic">' + (o.emoji(T) || '') + '</div>'
      + '<div class="row"><button class="btn sm" data-say="' + esc(T) + '">Hear it</button><button class="btn ghost sm" data-say="' + esc(T) + '" data-slow="1">Slow</button></div>'
      + '<label class="lbwrap">' + boxes + '<input class="lbin" maxlength="' + T.length + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Type the word"></label>'
      + '<div class="fb"></div><div class="hints"></div>';
    var inp = st.querySelector('.lbin'), fb = st.querySelector('.fb'), hintEl = st.querySelector('.hints');
    inp.focus(); setTimeout(function(){ PL.speak(T); }, 250);
    function paint(){
      var v = inp.value, m = PH.analyze(T, v);
      Array.prototype.forEach.call(st.querySelectorAll('.lbox'), function(b){
        var k = +b.getAttribute('data-i'); b.className = 'lbox';
        if (!v[k]){ b.textContent = ''; if (k === v.length && !done) b.classList.add('cur'); return; }
        b.textContent = v[k].toLowerCase() === T[k].toLowerCase() ? T[k] : v[k];
        b.classList.add(m[k] === 'ok' ? 'ok' : m[k] === 'sound' ? 'snd' : 'bad');
      });
    }
    function hint(info, typed){
      var X = PH.explain(info);
      hintEl.innerHTML = '<div class="hintline">' + esc(X.head) + ' ' + esc(X.body) + '</div>';
      PH.logHit(PL.ME.email, info, T, typed, CFG.slug + '-spell');
    }
    inp.addEventListener('input', function(){
      if (done) return;
      var v = inp.value;
      if (v.length > prev){
        var k = v.length - 1;
        if (PH.analyze(T, v)[k] !== 'ok'){
          wrong++;
          var info = PH.lastInfo(T, v);
          if (info) hint(info, v);
          else { fb.className = 'fb no'; fb.textContent = 'Letter ' + (k + 1) + ' is not right.'; }
        } else fb.textContent = '';
      }
      prev = v.length; paint();
      clearTimeout(idle);
      idle = setTimeout(function(){
        if (done || nudged) return;
        var mi = PH.missingE(T, inp.value);
        if (mi){ nudged = true; wrong++; hint(mi, inp.value); }
      }, 2500);
      if (v.toLowerCase() === T.toLowerCase()){
        done = true; inp.disabled = true; clearTimeout(idle); if (!wrong) R++; paint();
        fb.className = 'fb ok'; fb.textContent = 'Yes! ' + T; PL.speak(T);
        setTimeout(function(){ I++; draw(); }, 1400);
      }
    });
    paint();
  }
  draw();
};

/* ---------------- CHOOSE: one question at a time, first-try scoring ----------------
   PL.choose({ el, part, items, render(item) -> {html, options:[{html, ok}]}, after(item, ok), restart, msg }) */
PL.choose = function(o){
  var st = o.el, I = 0, R = 0;
  function draw(){
    if (I >= o.items.length){
      var pct = Math.round(100 * R / o.items.length); PL.score(o.part, pct);
      PL.doneCard(st, R + ' of ' + o.items.length, pct >= 80 ? (o.good || 'Great work!') : (o.retry || 'Keep practicing. Try again.'), 'New words', o.restart);
      return;
    }
    var it = o.items[I], v = o.render(it), first = true;
    st.innerHTML = '<div class="count">' + (I + 1) + ' of ' + o.items.length + '</div>' + v.html
      + '<div class="' + (v.cls || 'many') + '">' + v.options.map(function(op, n){ return '<button class="opt" data-n="' + n + '"><span>' + op.html + '</span></button>'; }).join('') + '</div>'
      + '<div class="why" style="margin-top:12px"></div><div class="fb"></div>';
    var fb = st.querySelector('.fb'), why = st.querySelector('.why');
    Array.prototype.forEach.call(st.querySelectorAll('.opt'), function(b){
      b.onclick = function(){
        var ok = v.options[+b.getAttribute('data-n')].ok;
        b.classList.add(ok ? 'ok' : 'no');
        if (first && ok) R++; first = false;
        why.textContent = o.why ? o.why(it) : '';
        if (ok){ fb.className = 'fb ok'; fb.textContent = o.okText ? o.okText(it) : 'Yes!'; if (o.after) o.after(it); setTimeout(function(){ I++; draw(); }, 1700); }
        else { fb.className = 'fb no'; fb.textContent = o.noText ? o.noText(it) : 'Try again.'; if (o.onWrong) o.onWrong(it); }
      };
    });
    if (v.autoplay) setTimeout(function(){ PL.speak(v.autoplay); }, 250);
  }
  draw();
};

/* ---------------- quiet browser-translation check ---------------- */
var TR_SENT = '';
function checkTranslation(){
  if (!PL.ME.email) return;
  var btns = document.querySelectorAll('nav.tabs button'), observed = '', i;
  for (i = 0; i < btns.length && i < CFG.panes.length; i++){
    var got = (btns[i].textContent || '').trim();
    if (got && got !== CFG.panes[i][1]){ observed = got; break; }
  }
  var cls = document.documentElement.className || '';
  if (!observed && !/translated/.test(cls)) return;
  var sig = observed + '|' + document.documentElement.lang;
  if (sig === TR_SENT) return; TR_SENT = sig;
  PH.sb('page_translation?on_conflict=email,set_slug', { method:'POST', prefer:'resolution=merge-duplicates,return=minimal',
    body:[{ email:PL.ME.email, set_slug:CFG.slug, translated:true, observed:observed, html_lang:document.documentElement.lang || '',
            html_class:cls, updated_at:new Date().toISOString() }] });
}
})();
