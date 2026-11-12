/* ============================================================
   landlady/pretr.js — T-370 (Nov 12 2026). Thin adapter: the ELD 103 story dashboards now use the
   shared 🌐 Pre-translate box, readings/pretr.js (T-360), GAL.pretr({host,title,items,langs,ticked}).
   (T-350 version replaced; the _phases dashboards still load this file, so it stays.)
     <script src="/readings/pretr.js"></script>
     <script src="/readings/landlady/pretr.js" data-pages="/readings/landlady/,…"></script>
   One item per story page = one status line each. Each page is opened once in a hidden frame and asked
   (window.GAL_PRETR) for every text a student can tap. Lines are saved in song_tr under the page's own
   slug (story:landlady, story:telltale, story:monkeyspaw) in the page's language NAMES ("Chinese
   (Simplified)" for Mandarin) — the same keys T-350 used, so everything saved before still counts.
   Glossary words with hand-written translations in all six of this year's languages are left out:
   the student page shows the hand-written one and never asks the cache for them.
   ============================================================ */
(function(){
  var me = document.currentScript;
  var PAGES = String(me && me.getAttribute('data-pages') || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  /* value = the language name the story page sends and stores; label = what Toby sees */
  var LANGS = [['Spanish','Spanish'],['Chinese (Simplified)','Mandarin'],['Arabic','Arabic'],['Vietnamese','Vietnamese'],['Thai','Thai'],
               ['Nepali','Nepali'],['Russian','Russian'],['Urdu','Urdu'],['Tagalog','Tagalog'],['French','French'],['Korean','Korean'],
               ['Hindi','Hindi'],['Somali','Somali']];
  var TICKED = ['Spanish','Chinese (Simplified)','Arabic','Vietnamese'];
  var HAND = ['es','zh','ar','vi','th','ne'];   /* GLOSS words hand-written in all of these → left out */
  var NAMES = { landlady:'The Landlady', 'landlady-easy':'The Landlady · Easier', 'landlady-hard':'The Landlady · Harder',
                telltale:'The Tell-Tale Heart', monkeyspaw:'The Monkey\u2019s Paw' };
  function folder(u){ return String(u).replace(/^\/readings\//,'').split('/')[0]; }
  function $(id){ return document.getElementById(id); }

  function texts(url){
    return new Promise(function(resolve, reject){
      var f = document.createElement('iframe');
      f.style.cssText = 'position:absolute;left:-9999px;top:0;width:1200px;height:900px;border:0;visibility:hidden';
      f.src = url + (url.indexOf('?') < 0 ? '?' : '&') + 'pretr=1';
      var t0 = Date.now(), done = false;
      function fin(err, v){ if(done) return; done = true; try{ f.remove(); }catch(e){} err ? reject(err) : resolve(v); }
      function poll(){
        var w = null; try{ w = f.contentWindow; }catch(e){}
        if(w && typeof w.GAL_PRETR === 'function' && w.document.readyState === 'complete' && Date.now() - t0 > 2500){
          try{
            var slug = w.GAL_STORY_SLUG;
            if(!slug) return fin(new Error('no story slug'));
            var out = (w.GAL_PRETR() || []).filter(function(it){
              var sk = it.skip || [];
              return !HAND.every(function(c){ return sk.indexOf(c) >= 0; });
            }).map(function(it){ return { src: it.text, slug: slug }; });
            return fin(null, out);
          }catch(e){ return fin(e); }
        }
        if(Date.now() - t0 > 30000) return fin(new Error('the story page did not load'));
        setTimeout(poll, 300);
      }
      f.onload = function(){ setTimeout(poll, 300); };
      document.body.appendChild(f);
    });
  }

  function need(cb){
    if(window.GAL && GAL.pretr) return cb();
    var s = document.createElement('script'); s.src = '/readings/pretr.js'; s.onload = cb; document.head.appendChild(s);
  }

  var started = false;
  function start(){
    if(started) return; started = true;
    need(function(){
      GAL.pretr({
        host: $('ptPanel'),
        title: '\uD83C\uDF10 Pre-translate ' + (PAGES.length > 1 ? 'the story (each version)' : 'the story'),
        items: PAGES.map(function(u){
          var f = folder(u);
          return { key: 'story/' + f, title: NAMES[f] || f, lines: function(){ return texts(u); } };
        }),
        langs: LANGS,
        ticked: TICKED
      });
    });
  }

  function build(){
    var bar = $('bar'); if(!bar || $('ptOpen')) return;
    var css = document.createElement('style');
    css.textContent = '#ptOpen{margin-left:6px}#ptPanel{display:none;margin:12px auto;max-width:1100px;padding:0 10px;box-sizing:border-box}#ptPanel.on{display:block}';
    document.head.appendChild(css);
    var b = document.createElement('button'); b.id = 'ptOpen'; b.type = 'button'; b.textContent = '\uD83C\uDF10 Pre-translate';
    var spacer = bar.querySelector('.spacer'); bar.insertBefore(b, spacer || null);
    var p = document.createElement('div'); p.id = 'ptPanel';
    bar.parentNode.insertBefore(p, bar.nextSibling);
    b.addEventListener('click', function(){ p.classList.toggle('on'); if(p.classList.contains('on')) start(); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
