/* assign/catalog/merge.js — runs last: one entry per path (a folder file beats the old catalog.js),
   then keeps the Push page order ('o'), new entries without 'o' after the rest. Do not edit per page. */
(function(){
  var all = window.CATALOG || [], pos = {}, out = [];
  all.forEach(function(e){ if(!e || !e.p) return; if (pos[e.p] === undefined) { pos[e.p] = out.length; out.push(e); } else out[pos[e.p]] = e; });
  out.forEach(function(e, i){ e._n = i; });
  out.sort(function(a, b){ var ao = a.o == null ? 1e6 + a._n : a.o, bo = b.o == null ? 1e6 + b._n : b.o; return ao - bo; });
  out.forEach(function(e){ delete e._n; });
  window.CATALOG = out;
})();
