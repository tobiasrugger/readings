/* ============================================================
   T-350 (Nov 6) — Pre-translate for the ELD 103 story dashboards.
   <script src="/readings/landlady/pretr.js" data-pages="/readings/landlady/,…"></script>
   Opens each student page in a hidden frame and asks it (window.GAL_PRETR) for every
   text it can send to the translation proxy, then translates what is not saved yet and
   saves it to song_tr under the page's own story slug — the cache the student page
   reads before it ever calls the proxy. Reruns skip everything already saved.
   ============================================================ */
(function(){
  var me = document.currentScript;
  var PAGES = String(me && me.getAttribute('data-pages') || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
  var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
  /* the 15 project languages; code = what the story page's language menu uses */
  var LANGS = [['es','Spanish'],['yue','Cantonese'],['zh','Mandarin'],['ar','Arabic'],['vi','Vietnamese'],['ru','Russian'],
               ['ary','Darija'],['ur','Urdu'],['tl','Tagalog'],['fr','French'],['ko','Korean'],['hi','Hindi'],['so','Somali'],['th','Thai'],['ne','Nepali']];
  var DEFAULT = ['es','zh','ar','vi'];   /* Toby's four */
  var ONPAGE = ['es','zh','ar','vi','th','ne','ru','ur','tl','fr','ko','hi','so'];   /* the story pages offer these */
  function H(pref){ var h = { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' }; if(pref) h.Prefer = pref; return h; }
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var css = document.createElement('style');
  css.textContent =
    '#ptOpen{margin-left:6px}' +
    '#ptPanel{display:none;margin:12px auto;max-width:1100px;background:#fff;border:2px solid #241d12;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,.15);padding:14px 16px;font-family:Nunito,system-ui,sans-serif}' +
    '#ptPanel.on{display:block}#ptPanel h3{margin:0 0 4px;font-size:1.05rem}#ptPanel p{margin:0 0 8px;color:#555;font-size:.9rem}' +
    '#ptLangs{display:flex;flex-wrap:wrap;gap:6px 16px;margin:8px 0 12px;font-size:.92rem}#ptLangs label.off{opacity:.45}' +
    '#ptGo{font:800 .95rem Nunito,sans-serif;background:#0F6E56;color:#fff;border:2px solid #0b5946;border-radius:8px;padding:7px 16px;cursor:pointer}' +
    '#ptGo:disabled{opacity:.5;cursor:default}#ptMsg{margin-left:10px;font-weight:700}' +
    '#ptBarW{height:9px;background:#e6e3dc;border-radius:99px;margin-top:10px;overflow:hidden}#ptBar{height:100%;width:0;background:#0F6E56}' +
    '#ptFails{margin-top:10px;font-size:.85rem;max-height:220px;overflow:auto;border-top:1px solid #ddd;padding-top:8px;display:none}' +
    '#ptFails li{margin:2px 0}';
  document.head.appendChild(css);

  function build(){
    var bar = $('bar'); if(!bar || $('ptOpen')) return;
    var b = document.createElement('button'); b.id = 'ptOpen'; b.type = 'button'; b.textContent = '\uD83C\uDF10 Pre-translate';
    var spacer = bar.querySelector('.spacer'); bar.insertBefore(b, spacer || null);
    var p = document.createElement('div'); p.id = 'ptPanel';
    p.innerHTML = '<h3>Pre-translate the story</h3>' +
      '<p>Translates every word, question and direction a student can tap on ' + (PAGES.length > 1 ? 'all ' + PAGES.length + ' versions of this story' : 'this story') +
      ', for the languages you tick, and saves them, so students\u2019 taps never wait and never spend the daily limit. Already-saved lines are skipped, so running it again costs nothing. Leave this tab open until it says Done.</p>' +
      '<div id="ptLangs">' + LANGS.map(function(L){
        var on = ONPAGE.indexOf(L[0]) >= 0;
        return '<label' + (on ? '' : ' class="off" title="The story page does not offer this language"') + '><input type="checkbox" value="' + L[0] + '"' +
          (DEFAULT.indexOf(L[0]) >= 0 ? ' checked' : '') + (on ? '' : ' disabled') + '> ' + L[1] + (on ? '' : ' (not on the story page)') + '</label>';
      }).join('') + '</div>' +
      '<button id="ptGo" type="button">Pre-translate</button><span id="ptMsg"></span>' +
      '<div id="ptBarW"><div id="ptBar"></div></div><div id="ptFails"></div>';
    bar.parentNode.insertBefore(p, bar.nextSibling);
    b.addEventListener('click', function(){ p.classList.toggle('on'); });
    $('ptGo').addEventListener('click', run);
  }

  /* ---- ask each student page for its texts ---- */
  function texts(url){
    return new Promise(function(resolve){
      var f = document.createElement('iframe');
      f.style.cssText = 'position:absolute;left:-9999px;top:0;width:1200px;height:900px;border:0;visibility:hidden';
      f.src = url + (url.indexOf('?') < 0 ? '?' : '&') + 'pretr=1';
      var t0 = Date.now(), done = false;
      function finish(v){ if(done) return; done = true; try{ f.remove(); }catch(e){} resolve(v); }
      function poll(){
        var w = null; try{ w = f.contentWindow; }catch(e){}
        if(w && typeof w.GAL_PRETR === 'function' && w.document.readyState === 'complete' && Date.now() - t0 > 2500){
          try{
            var list = w.GAL_PRETR(), names = {};
            ONPAGE.forEach(function(c){ names[c] = w.GAL_STORY_LANGNAME ? w.GAL_STORY_LANGNAME(c) : c; });
            finish({ list: list, slug: w.GAL_STORY_SLUG, names: names });
          }catch(e){ finish(null); }
          return;
        }
        if(Date.now() - t0 > 30000) return finish(null);
        setTimeout(poll, 300);
      }
      f.onload = function(){ setTimeout(poll, 300); };
      document.body.appendChild(f);
    });
  }

  /* ---- what is already saved ---- */
  function saved(slug, langs){
    var have = {}, jobs = langs.map(function(lg){
      return new Promise(function(res){
        var off = 0;
        (function page(){
          fetch(SUPA_URL + '/rest/v1/song_tr?select=src&slug=eq.' + encodeURIComponent(slug) + '&lang=eq.' + encodeURIComponent(lg) + '&limit=1000&offset=' + off, { headers: H() })
            .then(function(r){ return r.ok ? r.json() : []; })
            .then(function(rows){
              (rows || []).forEach(function(r){ have[r.src + '|' + lg] = 1; });
              if(rows && rows.length === 1000){ off += 1000; page(); } else res();
            }).catch(function(){ res(); });
        })();
      });
    });
    return Promise.all(jobs).then(function(){ return have; });
  }

  /* ---- the proxy, asked exactly the way the student page asks it (XHR, so no page wrapper interferes) ---- */
  var QUOTA = /too many times|quota|daily limit|limit exceeded|rate limit|exceeded/i;
  function ask(text, lang){
    return new Promise(function(res){
      var mode = String(text).trim().split(/\s+/).length <= 3 ? 'word' : 'sentence';
      var u = PROXY + '?action=translate&mode=' + mode + '&idiom=' + encodeURIComponent(text) + '&meaning=&lang=' + encodeURIComponent(lang);
      var x = new XMLHttpRequest(), done = false;
      function fin(v){ if(!done){ done = true; res(v); } }
      x.open('GET', u, true); x.timeout = 20000;
      x.onload = function(){
        var body = x.responseText || '', d = null;
        try{ d = JSON.parse(body); }catch(e){}
        if(d && d.ok && d.translation){
          var v = typeof d.translation === 'string' ? d.translation : (d.translation.equiv || d.translation.meaning || '');
          return fin(v ? { v: v } : { fail: true });
        }
        var why = d ? String(d.error || d.message || d.err || '') : body.slice(0, 400);
        fin({ fail: true, quota: QUOTA.test(why) });
      };
      x.onerror = x.ontimeout = function(){ fin({ fail: true }); };
      x.send();
    });
  }
  function put(slug, lang, text, v){
    return fetch(SUPA_URL + '/rest/v1/song_tr?on_conflict=slug,lang,src', {
      method: 'POST', headers: H('resolution=merge-duplicates,return=minimal'),
      body: JSON.stringify([{ slug: slug, lang: lang, src: text, equiv: v, meaning: '', note: '' }])
    }).then(function(r){ return r.ok; }).catch(function(){ return false; });
  }

  function run(){
    var codes = [].map.call(document.querySelectorAll('#ptLangs input:checked'), function(c){ return c.value; });
    if(!codes.length){ alert('Tick at least one language.'); return; }
    var btn = $('ptGo'), msg = $('ptMsg'), bar = $('ptBar'), fl = $('ptFails');
    btn.disabled = true; fl.style.display = 'none'; fl.innerHTML = ''; bar.style.width = '0';
    msg.textContent = 'Reading the story pages\u2026';
    var all = [], slug = '', names = {}, i = 0;
    (function nextPage(){
      if(i >= PAGES.length) return plan();
      msg.textContent = 'Reading the story pages\u2026 (' + (i + 1) + ' of ' + PAGES.length + ')';
      texts(PAGES[i++]).then(function(r){
        if(r){ slug = slug || r.slug; names = r.names; all.push(r.list); }
        nextPage();
      });
    })();
    function plan(){
      if(!all.length || !slug){ btn.disabled = false; msg.textContent = 'Could not read the story page. Reload and try again.'; return; }
      var seen = {}, jobs = [];
      all.forEach(function(list){ list.forEach(function(it){
        codes.forEach(function(c){
          if(it.skip && it.skip.indexOf(c) >= 0) return;   /* a hand-written translation is shown instead */
          var lg = names[c] || c, k = it.text + '|' + lg;
          if(seen[k]) return; seen[k] = 1; jobs.push({ text: it.text, lang: lg });
        });
      }); });
      var langs = codes.map(function(c){ return names[c] || c; });
      msg.textContent = 'Checking what is already saved\u2026';
      saved(slug, langs).then(function(have){
        var todo = jobs.filter(function(j){ return !have[j.text + '|' + j.lang]; });
        var total = todo.length, done = 0, ok = 0, failed = [], active = 0, k = 0, stopped = false, streak = 0;
        if(!total){ btn.disabled = false; bar.style.width = '100%'; msg.textContent = 'Already done \u2014 everything was saved (' + jobs.length + ' lines).'; return; }
        msg.textContent = '0 of ' + total;
        function show(){
          bar.style.width = Math.round(done / total * 100) + '%';
          msg.textContent = done + ' of ' + total + (failed.length ? ' \u00b7 ' + failed.length + ' failed' : '');
        }
        function end(text){
          btn.disabled = false; msg.textContent = text;
          if(failed.length){
            fl.style.display = 'block';
            fl.innerHTML = '<b>Did not translate (' + failed.length + '):</b><ul>' + failed.map(function(f){ return '<li>' + esc(f.lang) + ' \u2014 ' + esc(f.text) + '</li>'; }).join('') + '</ul>';
          }
        }
        function pump(){
          if(stopped) return;
          while(active < 3 && k < total){
            (function(j){
              active++;
              ask(j.text, j.lang).then(function(r){
                if(stopped){ active--; return; }
                if(r.v){ streak = 0; return put(slug, j.lang, j.text, r.v).then(function(saved){ if(saved) ok++; else failed.push(j); }); }
                streak++; failed.push(j);
                if(r.quota || streak >= 12){
                  stopped = true;
                  end((r.quota ? 'Daily limit reached.' : 'Many lines failed in a row \u2014 the daily limit may be reached.') +
                      ' Run again tomorrow; nothing is lost. (' + ok + ' saved before it stopped.)');
                }
              }).then(function(){
                if(stopped) return;
                active--; done++; show();
                if(done >= total) end('Done. ' + ok + ' saved, ' + failed.length + ' failed' + (failed.length ? ' (run again to retry).' : '.'));
                else pump();
              });
            })(todo[k++]);
          }
        }
        pump();
      });
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.GAL_PRETR_RUN = run;
})();
