/* readings/landlady/marks.js — T-366 (T-125), Nov 12 2026.
   Mr. Toby marks WRITTEN answers on the 5 ELD 103 story pages ✓ or ✗.
   Stored in <story>_responses.marks (jsonb, the student page never writes it):
     marks[qid] = { m: "ok" | "x", note: "...", a: <answer when marked>, at: ISO }
   ✗ + same answer  -> the point is off until the student changes it.
   ✗ + new answer   -> counts again, shows "fixed, Mr. Toby will check again" (= unmarked).
   ✓ + new answer   -> unmarked again.  No mark -> counts as before. Multiple choice is never marked here.
   Used by: the 5 story pages (student badges), the 3 story dashboards (✓/✗ buttons), desk/ (✎ flag). */
(function(){
  var SUPA = "https://lhmwtfyceilgndpygivj.supabase.co";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU";
  var WRITTEN = {"landlady": ["pre3", "pre5", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "pred1", "s6", "q4", "pred2", "h2", "q5", "h3", "pred3", "s9", "pred4", "q6", "q7", "q8", "e1", "e8", "e2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "sum1", "sum2", "sum3", "c3", "c4", "d4", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p8", "f1", "f2"], "landlady_easy": ["pre3", "pre5", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "pred1", "s6", "q4", "pred2", "h2", "q5", "h3", "pred3", "s9", "pred4", "q6", "q7", "q8", "e1", "e2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "sum1", "sum2", "sum3", "c3", "c4", "d4", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p8", "f1", "f2"], "landlady_hard": ["pre3", "pre5", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "pred1", "s6", "q4", "pred2", "h2", "q5", "h3", "pred3", "s9", "pred4", "q6", "q7", "q8", "e1", "e2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "sum1", "sum2", "sum3", "c3", "c4", "d4", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p8", "f1", "f2"], "telltale": ["pre3", "pre5", "q1", "h1", "pred1", "rep1", "rep2", "rep3", "rep4", "q2", "h2", "pred2", "q3", "pred3", "q4", "q5", "h3", "q6", "q7", "sum1", "sum2", "sum3", "c1w", "c2w", "c3w", "c4w"], "monkeyspaw": ["pre3", "pre5", "q1", "h1", "pred1", "q2", "h2", "pred2", "q3", "fs1", "fs2", "fs3", "fs4", "pred3", "q4", "h3", "q5", "q6", "q7", "sum1", "sum2", "sum3", "c1w", "c2w", "c3w", "c4w"]};
  var BUCKETS = {"landlady": {"slug": "landlady", "r": ["pre1", "pre2", "pre3", "pre4", "pre5", "s1", "s2", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "s4", "s5", "pred1", "s6", "q4", "pred2", "h2", "s7", "s8", "q5", "h3", "pred3", "s9", "pred4", "s10", "s11", "q6", "q7", "q8"], "a": ["d1", "c3", "d2", "c4", "d3", "d4"], "s": ["sum1", "sum2", "sum3"], "x": ["e3", "e4", "e5", "e6", "e1", "e8", "e2", "f3", "f4", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "pw1", "pw2", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p7", "p8", "f1", "f2"]}, "landlady_easy": {"slug": "landlady-easy", "r": ["pre1", "pre2", "pre3", "pre4", "pre5", "s1", "s2", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "s4", "s5", "pred1", "s6", "q4", "pred2", "h2", "s7", "s8", "q5", "h3", "pred3", "s9", "pred4", "s10", "s11", "q6", "q7", "q8"], "a": ["d1", "c3", "d2", "c4", "d3", "d4"], "s": ["sum1", "sum2", "sum3"], "x": ["e1", "e2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "pw1", "pw2", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p7", "p8", "f1", "f2"]}, "landlady_hard": {"slug": "landlady-hard", "r": ["pre1", "pre2", "pre3", "pre4", "pre5", "s1", "s2", "s3", "q1", "q2", "h1", "simile1", "simile2", "simile3", "simile4", "q3", "s4", "s5", "pred1", "s6", "q4", "pred2", "h2", "s7", "s8", "q5", "h3", "pred3", "s9", "pred4", "s10", "s11", "q6", "q7", "q8"], "a": ["d1", "c3", "d2", "c4", "d3", "d4"], "s": ["sum1", "sum2", "sum3"], "x": ["e1", "e2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "pw1", "pw2", "w1", "p1", "p2", "p3", "p4", "p5", "p6", "w2", "p7", "p8", "f1", "f2"]}, "telltale": {"slug": "telltale", "r": ["pre1", "pre2", "pre3", "pre4", "pre5", "s1", "s2", "q1", "h1", "pred1", "s3", "rep1", "rep2", "rep3", "rep4", "s4", "q2", "h2", "pred2", "s5", "q3", "s6", "pred3", "s7", "s8", "q4", "q5", "h3", "q6", "q7"], "a": ["c1", "c1w", "c2", "c2w", "c3", "c3w", "c4", "c4w"], "s": ["sum1", "sum2", "sum3"], "x": []}, "monkeyspaw": {"slug": "monkeyspaw", "r": ["pre1", "pre2", "pre3", "pre4", "pre5", "s1", "q1", "s2", "h1", "pred1", "s3", "q2", "h2", "pred2", "s4", "q3", "fs1", "fs2", "fs3", "fs4", "pred3", "s5", "q4", "s6", "h3", "q5", "q6", "q7"], "a": ["c1", "c1w", "c2", "c2w", "c3", "c3w", "c4", "c4w"], "s": ["sum1", "sum2", "sum3"], "x": []}};
  var TABLES = { landlady:"landlady_responses", landlady_easy:"landlady_responses", landlady_hard:"landlady_responses", telltale:"telltale_responses", monkeyspaw:"monkeyspaw_responses" };
  function H(x){ var h = { apikey:KEY, Authorization:"Bearer " + KEY, "Content-Type":"application/json" }; if(x) for(var k in x) h[k] = x[k]; return h; }
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
  function norm(a){ return String(a == null ? "" : a).replace(/\s+/g, " ").trim(); }
  function isWritten(gk, qid){ return !!(WRITTEN[gk] && WRITTEN[gk].indexOf(qid) > -1); }
  /* none | ok | x | fixed | changed */
  function state(mk, ans){
    ans = norm(ans);
    if(!mk || !mk.m || !ans) return "none";
    var same = norm(mk.a) === ans;
    if(mk.m === "x") return same ? "x" : "fixed";
    return same ? "ok" : "changed";
  }
  function unmarkedOf(gk, questions, marks){
    var n = 0, by = { r:0, a:0, x:0 }, b = BUCKETS[gk] || {};
    (questions || []).forEach(function(q){
      if(!q || !isWritten(gk, q.id) || q.h == 1 || !norm(q.a)) return;
      var st = state((marks || {})[q.id], q.a);
      if(st === "ok" || st === "x") return;
      n++;
      if((b.r || []).indexOf(q.id) > -1) by.r++; else if((b.x || []).indexOf(q.id) > -1) by.x++; else by.a++;
    });
    return { n:n, by:by };
  }
  /* the same three numbers the story page reports (T-253), with ✗ answers off */
  function scoresOf(gk, questions, marks){
    var b = BUCKETS[gk], r = { r:{d:0,t:0}, a:{d:0,t:0}, x:{d:0,t:0} }, sumSeen = false, sumDone = false;
    if(!b) return null;
    (questions || []).forEach(function(q){
      if(!q || q.h == 1 || q.id === "hl1" || q.id === "ctl1") return;
      var has = !!norm(q.a) && state((marks || {})[q.id], q.a) !== "x";
      if(b.s.indexOf(q.id) > -1){ sumSeen = true; if(has) sumDone = true; return; }
      var k = b.r.indexOf(q.id) > -1 ? "r" : b.a.indexOf(q.id) > -1 ? "a" : b.x.indexOf(q.id) > -1 ? "x" : null;
      if(!k) return; r[k].t++; if(has) r[k].d++;
    });
    if(sumSeen){ r.a.t++; if(sumDone) r.a.d++; }
    return r;
  }
  var G = window.GALMARKS = { WRITTEN:WRITTEN, BUCKETS:BUCKETS, state:state, isWritten:isWritten, unmarkedOf:unmarkedOf, scoresOf:scoresOf, marks:{} };
  /* a ✗ answer the student has not changed does not count (used by t253Scores on the story page) */
  G.off = function(qid, ans){ return state(G.marks[qid], ans) === "x"; };

  var css = document.createElement("style");
  css.textContent =
    ".gm-b{margin:.45rem 0 .1rem;padding:.4rem .6rem;border-radius:8px;border:2px solid;font:600 .9rem/1.35 Nunito,sans-serif;clear:both}" +
    ".gm-b.ok{border-color:#2e7d4f;background:#e6f2ea;color:#1d5235}.gm-b.x{border-color:#b3261e;background:#fde7e4;color:#7a1610}" +
    ".gm-b.fixed{border-color:#6b5ca5;background:#efecf8;color:#3f3470}.gm-b i{font-style:normal;font-weight:400}" +
    "#gm-bar{margin:.5rem auto;max-width:900px;padding:.55rem .8rem;border:2px solid #b3261e;background:#fde7e4;border-radius:10px;font:600 .95rem Nunito,sans-serif;color:#7a1610}" +
    "#gm-bar button{margin:.2rem .3rem 0 0;font:700 .85rem Nunito,sans-serif;border:2px solid #b3261e;background:#fff;color:#7a1610;border-radius:7px;padding:.15rem .5rem;cursor:pointer}" +
    ".gm-ctl{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.35rem 0 .2rem}" +
    ".gm-ctl button{font:700 .85rem Nunito,sans-serif;border:2px solid #444;background:#fff;border-radius:7px;padding:.12rem .55rem;cursor:pointer}" +
    ".gm-ctl button.ok.on{background:#2e7d4f;border-color:#2e7d4f;color:#fff}.gm-ctl button.x.on{background:#b3261e;border-color:#b3261e;color:#fff}" +
    ".gm-ctl input{flex:1 1 14rem;font:.85rem Nunito,sans-serif;border:2px solid #999;border-radius:7px;padding:.15rem .4rem}" +
    ".gm-ctl .st{font:600 .8rem Nunito,sans-serif;color:#555}.gm-ctl .st.un{color:#b06000}" +
    ".gm-pen{display:inline-block;font:700 .75rem Nunito,sans-serif;color:#7a4a00;background:#ffe9b8;border:1px solid #c9922a;border-radius:6px;padding:0 .3rem;margin-left:.25rem}";
  (document.head || document.documentElement).appendChild(css);

  /* ================= STUDENT PAGE ================= */
  function onStory(){ return typeof window.GUIDE_KEY === "string" && TABLES[window.GUIDE_KEY] && document.querySelector("[data-qid]"); }
  function boxOf(qid){ return document.querySelector('[data-qid="' + qid + '"]'); }
  function ansOf(qid){ var b = boxOf(qid), t = b && b.querySelector("textarea"); return t ? t.value : ""; }
  function paint(){
    var gk = window.GUIDE_KEY, sent = [];
    (WRITTEN[gk] || []).forEach(function(qid){
      var box = boxOf(qid); if(!box) return;
      var old = box.querySelector(".gm-b"); if(old) old.remove();
      var mk = G.marks[qid], st = state(mk, ansOf(qid)), h = "";
      if(st === "ok") h = "✓ Mr. Toby checked this." + (mk.note ? " <i>" + esc(mk.note) + "</i>" : "");
      else if(st === "x"){ h = "✗ Mr. Toby sent this back" + (mk.note ? ": <i>" + esc(mk.note) + (/[.!?]$/.test(mk.note) ? "" : ".") + "</i>" : ".") + " Fix your answer — then it counts again."; sent.push(qid); }
      else if(st === "fixed") h = "✎ You fixed it. Mr. Toby will check it again.";
      if(!h) return;
      var d = document.createElement("div"); d.className = "gm-b " + st; d.setAttribute("translate", "no"); d.innerHTML = h;
      /* above the answer box, so the note is read before the fix */
      var t = box.querySelector("textarea:not(.mcval)");
      if(t && t.parentNode) t.parentNode.insertBefore(d, t); else box.appendChild(d);
    });
    var bar = document.getElementById("gm-bar");
    if(!sent.length){ if(bar) bar.remove(); return; }
    if(!bar){ bar = document.createElement("div"); bar.id = "gm-bar"; var anchor = document.getElementById("storywrap") || document.body.firstChild;
      anchor.parentNode.insertBefore(bar, anchor); }
    bar.innerHTML = "✗ Mr. Toby sent back " + sent.length + " answer" + (sent.length === 1 ? "" : "s") + ". Fix " + (sent.length === 1 ? "it" : "them") + " to get the point" + (sent.length === 1 ? "" : "s") + " back:<br>" +
      sent.map(function(q){ return '<button type="button" data-gmgo="' + q + '">' + esc(where(q)) + " \u2192</button>"; }).join("");
  }
  /* a name a student understands: the chip or activity button the answer lives under */
  function where(qid){
    var box = boxOf(qid); if(!box) return qid;
    var ch = box.closest(".chunk"), act = box.closest("section.act"), btn = null;
    if(ch) btn = document.querySelector('.cbtn[data-ch="' + ch.id.replace(/^ch-/, "") + '"]');
    else if(act) btn = document.querySelector('.actbtn[data-act="' + act.id.replace(/^act-/, "") + '"]');
    var t = btn ? btn.cloneNode(true) : null; if(t){ var c = t.querySelector(".ccnt,.cnt"); if(c) c.remove(); }
    return t ? t.textContent.trim() : qid;
  }
  function go(qid){
    var box = boxOf(qid); if(!box) return;
    var ch = box.closest(".chunk"), act = box.closest("section.act");
    if(ch){ var c = document.querySelector('.cbtn[data-ch="' + ch.id.replace(/^ch-/, "") + '"]'); if(c) c.click(); }
    else if(act){ var a = document.querySelector('.actbtn[data-act="' + act.id.replace(/^act-/, "") + '"]'); if(a) a.click(); }
    setTimeout(function(){ box.scrollIntoView({ block:"center" }); var t = box.querySelector("textarea:not(.mcval)") || box.querySelector("input"); if(t) try{ t.focus({ preventScroll:true }); }catch(e){} }, 250);
  }
  var lastKey = "";
  function fetchMine(){
    var st = window.student; if(!st || !st.email || !window.GAL_LOADED) return;
    var u = String(st.email).toLowerCase().split("@")[0];
    var url = SUPA + "/rest/v1/" + TABLES[window.GUIDE_KEY] + "?select=email,marks&guide_key=eq." + encodeURIComponent(window.GUIDE_KEY) +
              "&email=in.(" + encodeURIComponent('"' + u + '@sfusd.edu","' + u + '@s.sfusd.edu"') + ")";
    fetch(url, { headers:H() }).then(function(r){ return r.ok ? r.json() : null; }).then(function(rows){
      if(!rows) return;                                 /* column not there yet, or offline: change nothing */
      var m = {}; rows.forEach(function(x){ if(x.marks && typeof x.marks === "object") for(var k in x.marks) m[k] = x.marks[k]; });
      var key = JSON.stringify(m); if(key === lastKey) return; lastKey = key;
      G.marks = m; paint();
      try{ if(typeof window.reportProgress === "function") window.reportProgress(); }catch(e){}
    }).catch(function(){});
  }
  function startStudent(){
    document.addEventListener("click", function(e){ var b = e.target.closest && e.target.closest("[data-gmgo]"); if(b) go(b.getAttribute("data-gmgo")); });
    var t = null;
    document.addEventListener("input", function(e){ if(!e.target.closest || !e.target.closest("[data-qid]")) return; clearTimeout(t); t = setTimeout(paint, 400); }, true);
    var tries = 0, iv = setInterval(function(){ if(window.GAL_LOADED && window.student){ clearInterval(iv); fetchMine(); } else if(++tries > 600) clearInterval(iv); }, 1000);
    setInterval(fetchMine, 90000);
    document.addEventListener("visibilitychange", function(){ if(document.visibilityState === "visible") fetchMine(); });
  }

  /* ================= DASHBOARDS ================= */
  G.badge = function(r){
    var gk = r && r.guide_key; if(!gk || !WRITTEN[gk]) return "";
    var u = unmarkedOf(gk, (r.payload || {}).questions, r.marks).n;
    return u ? '<span class="gm-pen" title="Written answers not marked yet">✎ ' + u + "</span>" : "";
  };
  G.controls = function(r, it){
    var gk = r && r.guide_key; if(!gk || !it || !isWritten(gk, it.id) || it.h == 1 || !norm(it.a)) return "";
    var mk = (r.marks || {})[it.id], st = state(mk, it.a);
    var lab = { none:"✎ not marked", changed:"✎ changed since your ✓", fixed:"✎ fixed — check again", ok:"✓ marked", x:"✗ sent back" }[st];
    return '<div class="gm-ctl" data-gmq="' + esc(it.id) + '">' +
      '<button type="button" class="ok' + (st === "ok" ? " on" : "") + '" data-gm="ok" title="Good — counts">✓</button>' +
      '<button type="button" class="x' + (st === "x" ? " on" : "") + '" data-gm="x" title="Send back — point off until fixed">✗</button>' +
      (mk ? '<button type="button" data-gm="clear" title="Remove the mark">clear</button>' : "") +
      '<input type="text" placeholder="Note to the student (they see it)" value="' + esc(mk && mk.note || "") + '">' +
      '<span class="st' + (st === "ok" || st === "x" ? "" : " un") + '">' + lab + "</span></div>";
  };
  function rescore(r){
    var gk = r.guide_key, b = BUCKETS[gk]; if(!b) return Promise.resolve();
    var s = scoresOf(gk, (r.payload || {}).questions, r.marks), jobs = [];
    [["", s.r], ["/after", s.a], ["/extras", s.x]].forEach(function(p){
      if(!(p[1].t > 0)) return;
      jobs.push(fetch(SUPA + "/rest/v1/rpc/story_set_score", { method:"POST", headers:H(),
        body:JSON.stringify({ p_email:r.email, p_slug:b.slug + p[0], p_score:p[1].d, p_max:p[1].t }) }));
    });
    return Promise.all(jobs);
  }
  G.save = function(r, qid, what, note){
    var tbl = TABLES[r.guide_key];
    /* re-read so another tab's marks are kept */
    return fetch(SUPA + "/rest/v1/" + tbl + "?select=marks,payload&id=eq." + encodeURIComponent(r.id), { headers:H() })
      .then(function(x){ if(!x.ok) throw new Error(x.status === 400 ? "run the T-366 SQL first" : "HTTP " + x.status); return x.json(); })
      .then(function(rows){
        var cur = (rows[0] && rows[0].marks) || {}, pay = (rows[0] && rows[0].payload) || r.payload || {};
        var q = (pay.questions || []).filter(function(z){ return z.id === qid; })[0];
        if(what === "clear") delete cur[qid];
        else cur[qid] = { m:what, note:norm(note), a:q ? q.a : "", at:new Date().toISOString() };
        return fetch(SUPA + "/rest/v1/" + tbl + "?id=eq." + encodeURIComponent(r.id), { method:"PATCH", headers:H({ Prefer:"return=minimal" }), body:JSON.stringify({ marks:cur }) })
          .then(function(x){ if(!x.ok) throw new Error("HTTP " + x.status); r.marks = cur; r.payload = pay; return rescore(r); });
      });
  };
  G.bind = function(box, r){
    box._gmRow = r;                       /* the detail panel is redrawn per student: listen once, read the current row */
    if(box._gmBound) return; box._gmBound = true;
    box.addEventListener("click", function(e){
      var r = box._gmRow;
      var b = e.target.closest && e.target.closest("[data-gm]"); if(!b) return;
      var ctl = b.closest("[data-gmq]"), qid = ctl.getAttribute("data-gmq"), what = b.getAttribute("data-gm");
      var note = ctl.querySelector("input").value, st = ctl.querySelector(".st");
      if(what === "x" && !norm(note)){ ctl.querySelector("input").focus(); st.textContent = "Write a short note first — the student sees it."; st.className = "st un"; return; }
      st.textContent = "Saving…";
      G.save(r, qid, what, note).then(function(){
        ctl.outerHTML = G.controls(r, ((r.payload || {}).questions || []).filter(function(z){ return z.id === qid; })[0]);
        if(typeof window.draw === "function") window.draw();
      }).catch(function(err){ st.textContent = "Not saved: " + err.message; st.className = "st un"; });
    });
    box.addEventListener("keydown", function(e){
      var r = box._gmRow;
      if(e.key !== "Enter" || !e.target.closest || !e.target.closest(".gm-ctl input")) return;
      var ctl = e.target.closest(".gm-ctl"), m = (r.marks || {})[ctl.getAttribute("data-gmq")];
      var btn = ctl.querySelector('[data-gm="' + (m && m.m === "ok" ? "ok" : "x") + '"]'); if(btn) btn.click();
    });
  };

  /* ================= TEACHER'S DESK ✎ ================= */
  G.loadDesk = function(){
    var out = {}, jobs = ["landlady_responses", "telltale_responses", "monkeyspaw_responses"].map(function(t){
      return fetch(SUPA + "/rest/v1/" + t + "?select=email,guide_key,q:payload->questions,marks&guide_key=in.(landlady,landlady_easy,landlady_hard,telltale,monkeyspaw)", { headers:H() })
        .then(function(x){ return x.ok ? x.json() : []; }).catch(function(){ return []; });
    });
    return Promise.all(jobs).then(function(all){
      all.forEach(function(rows){ (rows || []).forEach(function(r){
        var gk = r.guide_key, b = BUCKETS[gk]; if(!b) return;
        var u = unmarkedOf(gk, r.q, r.marks), k = String(r.email || "").toLowerCase().split("@")[0];
        out[k] = out[k] || {};
        [["", u.by.r], ["/after", u.by.a], ["/extras", u.by.x]].forEach(function(p){ if(p[1]) out[k][b.slug + p[0]] = (out[k][b.slug + p[0]] || 0) + p[1]; });
      }); });
      G.desk = out; return out;
    });
  };

  if(onStory()) startStudent();
  /* the Desk: fetch the ✎ counts once, then redraw the grade book if it is on screen */
  if(/\/desk\//.test(location.pathname)) setTimeout(function(){
    G.loadDesk().then(function(){ try{ if(typeof window.drawBook === "function" && window.STATIONS && STATIONS.length) window.drawBook(); }catch(e){} });
  }, 0);
})();
