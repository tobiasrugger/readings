/* vets-extras.js — works with vets_l10n.js on every story page. Adds:
   the language choice inside the sign-in box (handed to the page picker and remembered),
   a translated line under each caption and question, and hides the Directions button.
   String concatenation only. */
(function(){
var PROXY = 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec';
var LANGS = [['Spanish','Español'],['Chinese (Simplified)','中文'],['Arabic','العربية'],['Vietnamese','Tiếng Việt'],['Russian','Русский'],
  ['Urdu','اردو'],['Tagalog','Tagalog'],['French','Français'],['Korean','한국어'],['Hindi','हिन्दी'],['Somali','Soomaali'],['Nepali','नेपाली'],['Thai','ไทย']];
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function picker(){ return $('vl-lang'); }
function lang(){ var p = picker(); return p ? p.value : ''; }

var st = document.createElement('style');
st.textContent = '#vl-dir{display:none !important}' +
  '.vx-bi{display:block;margin-top:6px;font-size:.92em;color:var(--ocean,#2E6B8C);font-style:italic}.vx-bi:empty{display:none}';
document.head.appendChild(st);

/* ---- sign-in: language choice ---- */
var per = $('gate-period');
if (per && !$('gate-lang')){
  var lab = document.createElement('label'); lab.setAttribute('for', 'gate-lang'); lab.textContent = 'Your language';
  var sel = document.createElement('select'); sel.id = 'gate-lang';
  sel.innerHTML = '<option value="">-- select --</option>' + LANGS.map(function(l){ return '<option value="' + esc(l[0]) + '">' + esc(l[1]) + '</option>'; }).join('');
  var saved = ''; try { saved = localStorage.getItem('vocab_lang') || ''; } catch(e){}
  if (saved) sel.value = saved;
  per.parentNode.insertBefore(lab, per.nextSibling); per.parentNode.insertBefore(sel, lab.nextSibling);
  var orig = window.gateSubmit;
  window.gateSubmit = function(){
    var v = $('gate-lang').value, err = $('gate-error');
    if (!v){ if (err){ err.textContent = 'Please choose your language.'; err.style.display = 'block'; } return; }
    try { localStorage.setItem('vocab_lang', v); } catch(e){}
    setPicker(v);
    if (orig) orig();
    setTimeout(renderBilingual, 80);
  };
}
function setPicker(v){ var p = picker(); if (p && p.value !== v){ p.value = v; p.dispatchEvent(new Event('change')); } }

/* ---- bilingual lines ---- */
var tmem = {};
function translate(text){
  var L = lang(); if (!L) return Promise.resolve('');
  var key = 'vt|' + L + '|' + text; if (tmem[key]) return Promise.resolve(tmem[key]);
  try { var c = localStorage.getItem(key); if (c){ tmem[key] = c; return Promise.resolve(c); } } catch(e){}
  return fetch(PROXY + '?action=translate&idiom=' + encodeURIComponent(text) + '&meaning=&lang=' + encodeURIComponent(L))
    .then(function(r){ return r.json(); })
    .then(function(d){ var v = (d && d.ok && d.translation) ? String(d.translation).trim() : '';
      if (/backend is running/i.test(v) || v.toLowerCase() === text.toLowerCase()) v = '';
      if (v){ tmem[key] = v; try { localStorage.setItem(key, v); } catch(e){} } return v; })
    .catch(function(){ return ''; });
}
function renderBilingual(){
  var on = !!lang();
  Array.prototype.forEach.call(document.querySelectorAll('.panel-caption, .q-prompt, .story-sub, .q-feedback.show'), function(el){
    var bi = el.querySelector(':scope > .vx-bi');
    if (!on){ if (bi) bi.textContent = ''; return; }
    if (!bi){ bi = document.createElement('span'); bi.className = 'vx-bi'; el.appendChild(bi); }
    var text = ''; Array.prototype.forEach.call(el.childNodes, function(n){ if (n !== bi && !(n.classList && n.classList.contains('vl-bub'))) text += n.textContent; });
    text = text.replace(/\s+/g, ' ').trim(); if (!text || bi.getAttribute('data-for') === text + '|' + lang()) return;
    bi.setAttribute('data-for', text + '|' + lang());
    translate(text).then(function(t){ bi.textContent = t || ''; });
  });
}
function start(){
  var p = picker(); if (!p){ setTimeout(start, 200); return; }
  var saved = ''; try { saved = localStorage.getItem('vocab_lang') || ''; } catch(e){}
  if (saved && !p.value) p.value = saved;
  p.addEventListener('change', function(){ try { if (p.value) localStorage.setItem('vocab_lang', p.value); } catch(e){} setTimeout(renderBilingual, 0); });
  renderBilingual();
  var mo = new MutationObserver(function(){ clearTimeout(mo.t); mo.t = setTimeout(renderBilingual, 300); });
  mo.observe(document.body, {attributes:true, subtree:true, attributeFilter:['class']});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
