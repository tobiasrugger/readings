/* =====================================================================
   engine.js - parsing + scoring for Grammar Checks.
   Used by index.html (students) and report.html (teacher).
   ===================================================================== */
var DX = (function () {

  function low(s) {
    return String(s == null ? '' : s).replace(/[\u2018\u2019\u02bc]/g, "'").trim().toLowerCase();
  }

  /* ---------- slot text -> parts ---------- */
  function parse(text) {
    var parts = [], re = /\{([^}]*)\}|\[([^\]]+)\]/g, last = 0, m, slot = 0;
    while ((m = re.exec(text))) {
      if (m.index > last) parts.push({ t: 'text', s: text.slice(last, m.index) });
      var before = parts.length ? parts[parts.length - 1] : null;
      var start = !before || (before.t === 'text' && /(^|[.!?])\s*$/.test(before.s) && !/:\s*$/.test(before.s));
      if (m[1] !== undefined) {
        parts.push({ t: 'blank', i: slot++, start: start,
          ans: m[1].split('/').map(function (x) { return x.trim(); }) });
      } else {
        var inner = m[2], c = inner.indexOf(':');
        var head = c > -1 ? inner.slice(0, c) : inner;
        var choices = c > -1 ? inner.slice(c + 1).split(',').map(function (x) { return x.trim(); }) : [];
        var g = head.indexOf('>');
        var orig = (g > -1 ? head.slice(0, g) : head).trim();
        var ans = g > -1 ? head.slice(g + 1).split('/').map(function (x) { return x.trim(); }) : [orig];
        if (choices.indexOf(orig) < 0) choices.unshift(orig);
        parts.push({ t: 'fix', i: slot++, start: start, orig: orig, ans: ans, choices: choices });
      }
      last = re.lastIndex;
    }
    if (last < text.length) parts.push({ t: 'text', s: text.slice(last) });
    return parts;
  }
  function slots(item) {
    if (!item._parts) item._parts = parse(item.text);
    return item._parts.filter(function (p) { return p.t !== 'text'; });
  }
  function blankResp(item) {
    return slots(item).map(function (p) { return p.t === 'fix' ? p.orig : null; });
  }

  /* ---------- sentence normalizing ---------- */
  var CONTR = [[/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'], [/\bwon't\b/g, 'will not'],
    [/\bdon't\b/g, 'do not'], [/\bdoesn't\b/g, 'does not'], [/\bdidn't\b/g, 'did not'],
    [/\bisn't\b/g, 'is not'], [/\baren't\b/g, 'are not'], [/\bwasn't\b/g, 'was not'],
    [/\bweren't\b/g, 'were not'], [/\bit's\b/g, 'it is']];
  function loose(s) {
    s = low(s).replace(/[\u201c\u201d]/g, '"');
    s = s.replace(/\s+([,;.!?])/g, '$1').replace(/([,;])\s*/g, '$1 ');
    CONTR.forEach(function (r) { s = s.replace(r[0], r[1]); });
    return s.replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
  }
  function tight(s) {
    return String(s == null ? '' : s).replace(/[\u2018\u2019\u02bc]/g, "'").replace(/\s+/g, ' ').trim();
  }

  function orderSentence(item, resp) {
    var words = (resp || []).map(function (k) { return item.tiles[k]; });
    var body = words.join(' ');
    if (!item.pre) body = body.charAt(0).toUpperCase() + body.slice(1);
    return (item.pre ? item.pre + ' ' : '') + body + (item.post || '');
  }

  /* ---------- is a response complete? ---------- */
  function complete(item, resp) {
    if (item.type === 'slots') {
      if (!resp) return false;
      for (var i = 0; i < resp.length; i++) if (resp[i] === null || resp[i] === undefined) return false;
      return true;
    }
    if (item.type === 'order') return !!resp && resp.length === item.tiles.length;
    if (item.type === 'write') return !!resp && String(resp).trim().length > 3;
    return false;
  }

  /* ---------- score one item ----------
     returns {correct, strict, n, d}
     correct : the whole item is right (this is what skill scores use)
     strict  : also right with exact capitals, commas and spaces
     n / d   : parts right / parts                                    */
  function score(item, resp) {
    if (item.type === 'slots') {
      var sl = slots(item), n = 0, d = sl.length, used = {};
      for (var i = 0; i < sl.length; i++) {
        var v = low(resp ? resp[i] : null);
        var ok = sl[i].ans.map(low).indexOf(v) > -1;
        if (ok && item.distinct) { if (used[v]) ok = false; used[v] = 1; }
        if (ok) n++;
      }
      return { correct: n === d, strict: n === d, n: n, d: d };
    }
    var said = item.type === 'order' ? orderSentence(item, resp) : String(resp || '');
    var L = loose(said), T = tight(said), c = false, st = false;
    item.accept.forEach(function (a) {
      if (loose(a) === L) c = true;
      if (tight(a) === T) st = true;
    });
    return { correct: c, strict: st && c, n: c ? 1 : 0, d: 1 };
  }

  /* which slots are right (for practice feedback) */
  function slotResults(item, resp) {
    var sl = slots(item), used = {};
    return sl.map(function (p, i) {
      var v = low(resp ? resp[i] : null);
      var ok = p.ans.map(low).indexOf(v) > -1;
      if (ok && item.distinct) { if (used[v]) ok = false; used[v] = 1; }
      return ok;
    });
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- text for the teacher ---------- */
  function fillText(item, vals, mark) {
    var parts = item._parts || (item._parts = parse(item.text));
    return parts.map(function (p) {
      if (p.t === 'text') return p.s;
      var v = vals[p.i];
      var shown = (v === '' ? '\u2205' : (v == null ? '?' : v));
      if (p.start && v) shown = cap(shown);
      return mark ? '\u27e8' + shown + '\u27e9' : shown;
    }).join('');
  }
  function keyText(item) {
    if (item.type === 'slots') {
      var sl = slots(item);
      var used = {};
      return fillText(item, sl.map(function (p) {
        if (!item.distinct) return p.ans[0];
        for (var k = 0; k < p.ans.length; k++) if (!used[p.ans[k]]) { used[p.ans[k]] = 1; return p.ans[k]; }
        return p.ans[0];
      }), true);
    }
    return item.accept[0];
  }
  function respText(item, resp) {
    if (item.type === 'slots') return fillText(item, resp || [], true);
    if (item.type === 'order') return orderSentence(item, resp);
    return String(resp || '');
  }
  function promptText(item) {
    if (item.type === 'slots') return item.text.replace(/\{[^}]*\}/g, '___')
      .replace(/\[([^\]>:]+)[^\]]*\]/g, '_$1_');
    if (item.type === 'order') return (item.pre ? item.pre + ' ' : '') + '(' + item.tiles.join(' / ') + ')' + (item.post || '');
    return item.prompt + (item.words ? '  (' + item.words.join(', ') + ')' : '');
  }

  function findTest(id) {
    for (var i = 0; i < TESTS.length; i++) if (TESTS[i].id === id) return TESTS[i];
    return null;
  }

  return { parse: parse, slots: slots, blankResp: blankResp, complete: complete, score: score,
    orderSentence: orderSentence, keyText: keyText, respText: respText, promptText: promptText,
    findTest: findTest, slotResults: slotResults, low: low, loose: loose, cap: cap };
})();
