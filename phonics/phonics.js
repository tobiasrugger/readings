/* =====================================================================
   phonics.js — shared phonics engine for Mr. Toby's readings.

   Used by any page with a spelling activity (My Words today) and by the
   phonics lessons in /readings/phonics/<rule>/.

   The main job: when a student types a letter that is the RIGHT SOUND but
   the WRONG SPELLING ("bisykle" for "bicycle"), say so. Those letters show
   yellow, not red, and the page can explain the rule behind them.

   Rules are found from each word's own spelling, so no word lists need
   tagging. To add a rule later: add it to PH.RULES and teach PH.letterInfo
   to recognise it.

   String concatenation only. No template literals.
   ===================================================================== */
(function(){
var PH = window.PH = {};

PH.SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
PH.SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';

/* a rule shows up on My Page after this many mix-ups */
PH.ASSIGN_AFTER = 2;

PH.RULES = {
  'c-and-g': {
    title: 'C and G sounds',
    short: 'C says /s/ or /k/. G says /j/ or /g/.',
    url: '/readings/phonics/c-and-g/',
    emoji: '\ud83d\udd24',
    /* activities that count toward finishing the lesson */
    parts: ['sortC', 'sortG', 'look', 'spell'],
    partNames: { sortC:'Sort C', sortG:'Sort G', look:'Look first', say:'Say it', spell:'Spell' }
  },
  'magic-e': {
    title: 'Magic E',
    short: 'A silent e at the end makes the vowel say its name.',
    url: '/readings/phonics/magic-e/',
    emoji: '\ud83e\ude84',
    parts: ['sort', 'adde', 'look', 'spell'],
    partNames: { sort:'Hear it', adde:'Add the e', look:'Look first', say:'Say it', spell:'Spell' }
  }
};

PH.RULES['digraphs'] = {
  title: 'Letter Teams: sh, ch, th, ph, wh',
  short: 'Two letters, one sound.',
  url: '/readings/phonics/digraphs/',
  emoji: '\ud83e\udd1d',
  parts: ['sort', 'hear', 'match', 'spell'],
  partNames: { sort:'Sort sh / ch', hear:'Which team?', match:'Read and match', say:'Say it', spell:'Spell' }
};

PH.RULES['bossy-r'] = {
  title: 'Bossy R: ar, or, er, ir, ur',
  short: 'R changes the vowel before it.',
  url: '/readings/phonics/bossy-r/',
  emoji: '\ud83d\udc51',
  parts: ['sort', 'which', 'match', 'spell'],
  partNames: { sort:'Sort by sound', which:'er, ir, or ur?', match:'Read and match', say:'Say it', spell:'Spell' }
};

PH.RULES['vowel-teams'] = {
  title: 'Vowel Teams: ai, ay, ee, ea, oa, ow, oo',
  short: 'Two vowels, one sound.',
  url: '/readings/phonics/vowel-teams/',
  emoji: '\ud83d\udc6f',
  parts: ['sort', 'two', 'which', 'spell'],
  partNames: { sort:'Sort by sound', two:'Two sounds', which:'Which team?', say:'Say it', spell:'Spell' }
};

/* ---------------- Vowel teams ----------------
   Each team makes one sound. oo, ow, and ea can make two, so word lists decide. */
PH.VT_SOUND = {
  A:  { name:'long A', teams:['ai','ay'], alts:['ai','ay','a?e','ei','e'], ex:['rain','day','train','play'] },
  E:  { name:'long E', teams:['ee','ea'], alts:['ee','ea','e?e','i','ie'], ex:['tree','beach','green','leaf'] },
  O:  { name:'long O', teams:['oa','ow'], alts:['oa','ow','o?e','o'], ex:['boat','snow','coat','yellow'] },
  OO: { name:'/oo/, like in moon', teams:['oo'], alts:['oo','u','u?e','ue'], ex:['moon','food','spoon','zoo'] },
  UU: { name:'/oo/, like in book', teams:['oo'], alts:['oo','u'], ex:['book','look','foot','good'] },
  OW: { name:'/ow/, like in cow', teams:['ow'], alts:['ow','ou','au'], ex:['cow','owl','clown','flower'] },
  ES: { name:'short e, like in bread', teams:['ea'], alts:['ea','e'], ex:['bread','head','weather','breakfast'] }
};
var EA_SHORT = ['bread','head','heavy','breakfast','weather','ready','dead','sweater','feather','thread','health','instead','spread','already','meant','heaven','leather','deaf','meadow','pleasant'];
var EA_LONGA = ['steak','break','great'];
var OO_SHORT = ['book','books','look','looks','good','foot','football','cook','cooking','wood','wool','hook','stood','took','shook','cookie','hood','notebook','facebook','goodbye'];
var OW_LONG  = ['snow','grow','show','slow','low','blow','bowl','window','yellow','know','throw','own','row','tomorrow','follow','elbow',
  'arrow','rainbow','pillow','shadow','below','snowman','crow','glow','mow','bow','grown','shown','known','borrow','narrow','swallow','owner','growth'];
var VT_ODD = ['said','again','against','captain','mountain','certain','fountain','been','idea','create','area','ocean','react','reality',
  'theater','cooperate','zoology','blood','flood','door','floor','poor','knowledge','bowling'];
PH.vtTeams = function(tok){
  var w = String(tok || '').toLowerCase(), out = [], i;
  if (VT_ODD.indexOf(w) > -1) return out;
  for (i = 0; i < w.length - 1; i++){
    var t = w.substr(i, 2);
    if (['ai','ay','ee','ea','oa','ow','oo'].indexOf(t) < 0) continue;
    if (w.charAt(i + 2) === 'r') { i++; continue; }                 /* hair, ear, door: bossy r */
    var snd = t === 'ai' || t === 'ay' ? 'A' : t === 'ee' ? 'E' : t === 'oa' ? 'O'
      : t === 'ea' ? (EA_SHORT.indexOf(w) > -1 ? 'ES' : EA_LONGA.indexOf(w) > -1 ? 'A' : 'E')
      : t === 'oo' ? (OO_SHORT.indexOf(w) > -1 ? 'UU' : 'OO')
      : (OW_LONG.indexOf(w) > -1 ? 'O' : 'OW');
    out.push({ start:i, team:t, sound:snd });
    i++;
  }
  return out;
};
/* every other way to spell the team's sound, as a whole alternate word */
PH.vtAlts = function(word){
  var T = String(word || ''), out = [], re = /[a-z]+/gi, m;
  while ((m = re.exec(T))){
    var tok = m[0], base = m.index;
    PH.vtTeams(tok).forEach(function(tm){
      var S = PH.VT_SOUND[tm.sound], after = tok.slice(tm.start + 2).toLowerCase();
      S.alts.forEach(function(x){
        if (x === tm.team) return;
        var alt, span = {};
        if (x.indexOf('?') > -1){                                        /* split: rain -> rane */
          if (!/^[^aeiouwy]$/.test(after)) return;
          alt = tok.slice(0, tm.start) + x.charAt(0) + after + 'e';
          span[base + tm.start] = 1; span[base + alt.length - 1] = 1;
        } else {
          alt = tok.slice(0, tm.start) + x + tok.slice(tm.start + 2);
          for (var k = 0; k < x.length; k++) span[base + tm.start + k] = 1;
        }
        out.push({ alt:T.slice(0, base) + alt + T.slice(base + tok.length), span:span,
          info:{ rule:'vowel-teams', word:tok.toLowerCase(), team:tm.team, sound:tm.sound, typedTeam:x.replace('?', '_'), letter:tm.team, alike:[], why:'vt-alt' } });
      });
    });
  }
  return out;
};

/* ---------------- Bossy R ---------------- */
var R_ODD = ['very','every','carry','sorry','berry','cherry','mirror','arrow','error','hurry','worry','story','parent','carol',
  'hero','zero','area','iron','are','fire','here','there','where','were','more','store','care','sure','pure','your','four','our','hour'];
function bossyInfos(T, i){
  var t = tokenAt(T, i), w = t.word, at = i - t.start, out = [];
  if (!w || R_ODD.indexOf(w) > -1) return out;
  var base = { rule:'bossy-r', word:w };
  function isR(v){      /* vowel at v is bossed by an r: r follows, then a consonant or the end */
    return VOW[w.charAt(v)] && w.charAt(v + 1) === 'r' && !VOW[w.charAt(v + 2)] && w.charAt(v + 2) !== 'r' && !(v > 0 && VOW[w.charAt(v - 1)]);
  }
  if (isR(at)){
    var vw = w.charAt(at), endR = (at + 2 === w.length || (at + 3 === w.length && w.charAt(at + 2) === 's'));
    var others = function(list){ return list.filter(function(x){ return x !== vw; }); };
    if (endR && at >= 2 && w.length >= 5)                                    /* teacher, doctor, dollar */
      out.push(Object.assign({}, base, { letter:vw + 'r', alike:others(['a','e','i','o','u']), why:'r-final' }));
    else if (vw === 'e' || vw === 'i' || vw === 'u' || (vw === 'o' && w.charAt(at - 1) === 'w'))   /* her, bird, fur, word */
      out.push(Object.assign({}, base, { letter:vw + 'r', alike:others(['e','i','u']), why:'r-er' }));
    out.push(Object.assign({}, base, { letter:vw + 'r', alike:['r'], why:'r-novowel', shift:true }));   /* "brd" */
  }
  if (w.charAt(at) === 'r' && at > 0 && isR(at - 1) && at + 1 < w.length)   /* "bid" for bird */
    out.push(Object.assign({}, base, { letter:w.charAt(at - 1) + 'r', alike:[w.charAt(at + 1)], why:'r-drop', shift:true }));
  return out;
}

/* ---------------- letter teams (digraphs) ---------------- */
PH.DG = {
  sh:{ snd:'/sh/', say:'like "shh!"', ex:['ship','fish','shoe','shell'] },
  ch:{ snd:'/ch/', say:'like the start of "chair"', ex:['chair','lunch','cheese','peach'] },
  th:{ snd:'/th/', say:'put your tongue between your teeth and blow', ex:['three','teeth','the','mother'] },
  ph:{ snd:'/f/',  say:'p and h together say /f/', ex:['phone','photo','elephant','dolphin'] },
  wh:{ snd:'/w/',  say:'most question words start with wh', ex:['what','when','where','why'] }
};
/* ch that says /k/, and other look-alikes that are not teams */
PH.DG_ODD = ['school','schools','chemistry','character','chorus','stomach','echo','ache','christmas','chaos','orchestra',
  'technology','mechanic','anchor','choir','chrome','shepherd','uphill','haphazard','mishap','thomas','thailand','thai','thyme'];
function dgInfos(T, i){
  var t = tokenAt(T, i), w = t.word, at = i - t.start, out = [];
  if (!w || PH.DG_ODD.indexOf(w) > -1) return out;
  var pair = w.substr(at, 2), prevPair = at > 0 ? w.substr(at - 1, 2) : '';
  var base = { rule:'digraphs', word:w };
  /* first letter of a team: another sound's spelling */
  if (PH.DG[pair]){
    var sub = { sh:['c'], ch:['s'], th:['d','f','s','z'], ph:['f'], wh:[] }[pair];
    var why = { sh:'sh-ch', ch:'ch-sh', th:'th-sub', ph:'ph-f', wh:'' }[pair];
    /* th -> d and ph -> f: one letter for two, so the rest of the word shifts */
    if (sub.length) out.push(Object.assign({}, base, { dg:pair, letter:pair, alike:sub, why:why, shift:pair === 'th' || pair === 'ph' }));
  }
  /* second letter (the h) left out: "sip" for ship, "wen" for when */
  if (PH.DG[prevPair] && prevPair.charAt(1) === 'h' && at + 1 < w.length)
    out.push(Object.assign({}, base, { dg:prevPair, letter:prevPair, alike:[w.charAt(at + 1)], why:'dg-drop', shift:true }));
  return out;
}

/* e at the end, but the vowel does NOT say its name: heart words */
PH.MAGIC_E_HEART = ['have','give','live','love','glove','above','come','some','done','gone','none','one','once',
  'are','were','where','there','here','move','lose','whose','prove','shove','dove','sure','eye','axe','machine',
  'police','office','notice','promise','practice','justice','engine','imagine','favorite','minute','definite','purchase'];
var VOW = { a:1, e:1, i:1, o:1, u:1 };
/* spelling a long vowel the way it sounds in Spanish and many other languages:
   name -> "neim", nice -> "nais", these -> "tis" */
var LONG_ALIKE = { a:['e'], i:['a'], e:['i'], o:[], u:[] };

/* hard G even though e, i, or y comes next */
PH.HARD_G = ['get','gets','getting','give','gives','given','forgive','girl','girls','gift','gifts','begin',
  'beginning','tiger','together','forget','target','gear','geese','giggle','gill','finger','hunger','anger',
  'eager','tiger','burger','hamburger','singer','bigger','biggest','foggy','soggy','buggy','doggy','piggy',
  'baggy','muggy','leggings','digging','hugging','logging','jogging','shaggy','geyser','gecko','gynecology'];
/* C that breaks the rule */
PH.C_ODD = ['soccer','cello','celtic','ocean','special','social','delicious','musician','magician'];

function inList(list, word){
  var w = String(word || '').toLowerCase();
  return w.split(/[^a-z]+/).some(function(t){ return list.indexOf(t) > -1; });
}
var SOFT = { e:1, i:1, y:1 };

/* What is this letter doing in this word?
   Returns null for letters no rule covers, or
   { rule, letter, sound, alike:[letters that make the same sound], why } */
/* the word (one token of a phrase) that position i sits in */
function tokenAt(T, i){
  var a = i, b = i;
  while (a > 0 && /[a-z]/i.test(T.charAt(a - 1))) a--;
  while (b < T.length && /[a-z]/i.test(T.charAt(b))) b++;
  return { start:a, word:T.slice(a, b).toLowerCase() };
}
/* Magic E: vowel + one consonant + e at the end of the word (or + s / d: makes, hoped).
   Returns the vowel's position inside the token, or -1. */
PH.magicVowel = function(tok){
  var w = String(tok || '').toLowerCase();
  if (PH.MAGIC_E_HEART.indexOf(w) > -1) return -1;
  var end = w.length;
  if (/[sd]$/.test(w) && w.charAt(end - 2) === 'e') end--;
  if (w.charAt(end - 1) !== 'e') return -1;
  var v = end - 3, c = w.charAt(end - 2);
  if (v < 0 || !VOW[w.charAt(v)] || VOW[c] || c === 'r' || c === 'y' || c === 'w' || c === 'x') return -1;
  if (v > 0 && VOW[w.charAt(v - 1)]) return -1;              /* house, cause: vowel teams, not magic e */
  return v;
};
function magicInfos(T, i){
  var t = tokenAt(T, i), v = PH.magicVowel(t.word); if (v < 0) return [];
  var at = i - t.start, vowel = t.word.charAt(v), out = [];
  var base = { rule:'magic-e', vowel:vowel, word:t.word };
  if (at === v && LONG_ALIKE[vowel].length)
    out.push(Object.assign({}, base, { letter:vowel, sound:vowel, alike:LONG_ALIKE[vowel], why:'magic-e-vowel' }));
  if (at === v + 1)                                           /* a vowel where the consonant goes: "caek", "caik" */
    out.push(Object.assign({}, base, { letter:vowel, sound:vowel, alike:['a','e','i','o','u','y','w'], why:'magic-e-team' }));
  return out;
}
PH.letterInfos = function(word, i){
  var out = [], a = cgInfo(word, i);
  if (a) out.push(a);
  return out.concat(magicInfos(String(word || ''), i), dgInfos(String(word || ''), i), bossyInfos(String(word || ''), i));
};
PH.letterInfo = function(word, i){ return PH.letterInfos(word, i)[0] || null; };
/* which rule explains THIS typed letter (or null) */
PH.matchInfo = function(word, i, typed){
  var ch = String(typed || '').toLowerCase();
  return PH.letterInfos(word, i).filter(function(x){ return x.alike.indexOf(ch) > -1; })[0] || null;
};
/* they typed everything but the silent e: "cak" for "cake" */
PH.missingE = function(word, typed){
  var T = String(word || ''), v = String(typed || '');
  /* stopped on another whole spelling: "sno" for snow, "tri" for tree */
  if (v && v.toLowerCase() !== T.toLowerCase()){
    var alts = PH.vtAlts(T);
    for (var a = 0; a < alts.length; a++) if (alts[a].alt.toLowerCase() === v.toLowerCase()) return alts[a].info;
  }
  /* also: "ca" for "car", the bossy r left off the end */
  var lt = tokenAt(T, T.length - 1).word;
  if (/[aeiou]r$/i.test(T) && v.toLowerCase() === T.slice(0, -1).toLowerCase() && R_ODD.indexOf(lt) < 0 && !VOW[lt.charAt(lt.length - 3)])
    return { rule:'bossy-r', word:lt, letter:lt.slice(-2), alike:[], why:'r-drop' };
  /* also: "fis" for "fish", the h of a letter team left off the end */
  var tail = T.slice(-2).toLowerCase();
  if (PH.DG[tail] && v.toLowerCase() === T.slice(0, -1).toLowerCase() && PH.DG_ODD.indexOf(tokenAt(T, T.length - 1).word) < 0)
    return { rule:'digraphs', dg:tail, letter:tail, word:tokenAt(T, T.length - 1).word, alike:[], why:'dg-drop' };
  if (!/e$/i.test(T) || v.toLowerCase() !== T.slice(0, -1).toLowerCase()) return null;
  var t = tokenAt(T, T.length - 1), p = PH.magicVowel(t.word); if (p < 0) return null;
  var vowel = t.word.charAt(p);
  return { rule:'magic-e', vowel:vowel, letter:vowel, word:t.word, alike:[], why:'missing-e' };
};

function cgInfo(word, i){
  var T = String(word || ''), c = T.charAt(i).toLowerCase(), nx = T.charAt(i + 1).toLowerCase(), pv = T.charAt(i - 1).toLowerCase();
  if (!c) return null;
  if (c === 'c'){
    if (nx === 'h') return null;                              /* ch is its own sound */
    if (pv === 's' && SOFT[nx]) return null;                 /* science, scissors: sc */
    if (inList(PH.C_ODD, T)) return null;
    if (SOFT[nx]) return { rule:'c-and-g', letter:'c', sound:'s', alike:['s'], next:nx, why:'soft-c' };
    return { rule:'c-and-g', letter:'c', sound:'k', alike:['k'], next:nx, why:'hard-c' };
  }
  if (c === 'g'){
    if (nx === 'h') return null;                              /* ghost, night */
    if (pv === 'n' && !SOFT[nx]) return null;                /* sing, English: ng */
    if (SOFT[nx] && !inList(PH.HARD_G, T)) return { rule:'c-and-g', letter:'g', sound:'j', alike:['j'], next:nx, why:'soft-g' };
    return null;                                              /* hard g: nothing sounds like it */
  }
  /* the other direction: K, S, J where a student might write C or G */
  if (c === 'k' && SOFT[nx]) return { rule:'c-and-g', letter:'k', sound:'k', alike:['c'], next:nx, why:'k-not-c' };
  if (c === 's' && SOFT[nx]) return { rule:'c-and-g', letter:'s', sound:'s', alike:['c'], next:nx, why:'s-not-c' };
  if (c === 'j' && SOFT[nx]) return { rule:'c-and-g', letter:'j', sound:'j', alike:['g'], next:nx, why:'j-not-g' };
  return null;
}

/* Compare what they typed with the word, letter by letter.
   Each position: 'ok', 'bad', 'sound' (right sound, other spelling), or null (empty). */
/* Walk through what they typed. Usually letter i matches letter i of the word.
   After "f" for "ph" (or a dropped h), the rest of the word is one letter behind,
   so we keep comparing one letter further along. */
PH.align = function(word, typed){
  var T = String(word || ''), v = String(typed || ''), out = [], off = 0, j;
  for (j = 0; j < v.length; j++){
    var ti = j + off, ch = v.charAt(j);
    if (ti >= T.length){ out.push({ m:'bad' }); continue; }
    if (ch.toLowerCase() === T.charAt(ti).toLowerCase()){ out.push({ m:'ok', ti:ti }); continue; }
    var info = PH.matchInfo(T, ti, ch);
    if (info){ out.push({ m:'sound', ti:ti, info:info }); if (info.shift) off++; continue; }
    /* another spelling of a vowel team's sound? follow that spelling from here on */
    var pick = off ? null : altFor(T, v, j);
    if (pick){
      /* letters already typed that belong to the other spelling ("o" in "bot") turn yellow too */
      for (var r = 0; r < j; r++) if (pick.span[r] && out[r].m === 'ok') out[r] = { m:'sound', ti:r, info:pick.info };
      out.pickAt = j; out.pickInfo = pick.info;
      for (var k = j; k < v.length; k++){
        var c = v.charAt(k).toLowerCase();
        if (k < pick.alt.length && c === pick.alt.charAt(k).toLowerCase()) out.push(pick.span[k] ? { m:'sound', ti:k, info:pick.info } : { m:'ok', ti:k });
        else out.push({ m:'bad', ti:k });
      }
      return out;
    }
    out.push({ m:'bad', ti:ti });
  }
  return out;
};
function altFor(T, v, j){
  var alts = PH.vtAlts(T); if (!alts.length) return null;
  var all = v.toLowerCase(), upto = all.slice(0, j + 1), i;
  for (i = 0; i < alts.length; i++) if (alts[i].alt.toLowerCase().indexOf(all) === 0) return alts[i];
  for (i = 0; i < alts.length; i++) if (alts[i].alt.toLowerCase().indexOf(upto) === 0) return alts[i];
  return null;
}
/* one mark per box: 'ok', 'sound', 'bad', or null (empty) */
PH.analyze = function(word, typed){
  var T = String(word || ''), a = PH.align(word, typed), out = [], i;
  for (i = 0; i < T.length; i++) out.push(a[i] ? a[i].m : null);
  return out;
};
/* the rule behind the letter they just typed, if it was right-sound-wrong-spelling */
PH.lastInfo = function(word, typed){
  var a = PH.align(word, typed), x = a[a.length - 1];
  if (x && x.m === 'sound') return x.info;
  if (a.pickAt === a.length - 1) return a.pickInfo;     /* "bot": the t finished a different spelling */
  return null;
};

/* ---------------- what to tell them ---------------- */
PH.EXPLAIN = {
  'soft-c': { head:'Good ear! You hear /s/.',
    body:'Here the /s/ sound is spelled with C. C says /s/ when e, i, or y comes next.',
    ex:['city','rice','pencil','bicycle'] },
  'hard-c': { head:'Good ear! You hear /k/.',
    body:'Here the /k/ sound is spelled with C. C says /k/ when a, o, u, or another consonant comes next.',
    ex:['cat','coat','cup','clock'] },
  'soft-g': { head:'Good ear! You hear /j/.',
    body:'Here the /j/ sound is spelled with G. G often says /j/ when e, i, or y comes next.',
    ex:['gym','page','orange','giraffe'] },
  'k-not-c': { head:'Good ear! You hear /k/.',
    body:'Before e, i, or y, we spell the /k/ sound with K. C would say /s/ there.',
    ex:['kite','key','kid','keep'] },
  's-not-c': { head:'Good ear! You hear /s/.',
    body:'C can say /s/ before e, i, or y, so your spelling makes sense. But this word uses S. Look at it and remember it.',
    ex:['sit','see','six','seven'] },
  'j-not-g': { head:'Good ear! You hear /j/.',
    body:'G can say /j/ before e, i, or y, so your spelling makes sense. But this word uses J. Look at it and remember it.',
    ex:['jeans','jelly','jet','jeep'] }
};

/* Magic E explanations depend on the vowel */
PH.VOWEL = {
  a:{ name:'long A', ex:['cake','name','game','face'] }, i:{ name:'long I', ex:['bike','five','time','nice'] },
  o:{ name:'long O', ex:['home','nose','rope','bone'] }, u:{ name:'long U', ex:['cute','huge','cube','use'] },
  e:{ name:'long E', ex:['these','Pete','theme','eve'] }
};
PH.explain = function(info){
  if (!info) return null;
  if (info.rule === 'digraphs'){
    var D = PH.DG[info.dg], two = info.dg.charAt(0) + ' and ' + info.dg.charAt(1);
    if (info.why === 'dg-drop') return { head:'Almost! ' + info.dg + ' is a team.',
      body:'The letters ' + two + ' work together to make one sound: ' + D.snd + ' (' + D.say + '). Two letters, one sound.', ex:D.ex };
    if (info.why === 'th-sub') return { head:'Good try! This is the /th/ sound.',
      body:'Many languages do not have /th/. English writes it with t and h. To say it, put your tongue between your teeth and blow.', ex:D.ex };
    if (info.why === 'ph-f') return { head:'Good ear! You hear /f/.',
      body:'In this word, the /f/ sound is spelled ph. p and h together say /f/.', ex:D.ex };
    if (info.why === 'sh-ch') return { head:'Listen closely: /sh/ or /ch/?',
      body:'This word has /sh/, like "shh!" It is spelled s and h.', ex:D.ex };
    if (info.why === 'ch-sh') return { head:'Listen closely: /ch/ or /sh/?',
      body:'This word has /ch/, like the start of "chair." It is spelled c and h.', ex:D.ex };
  }
  if (info.rule === 'vowel-teams'){
    var S = PH.VT_SOUND[info.sound];
    var ways = S.teams.join(' or ');
    var tip = (info.team === 'ai' || info.team === 'ay') ? ' Tip: ay usually comes at the end of a word (day), and ai in the middle (rain).'
      : (info.team === 'oa' || (info.team === 'ow' && info.sound === 'O')) ? ' Tip: ow often comes at the end (snow), and oa in the middle (boat).' : '';
    var single = /^[aeiou]$/.test(info.typedTeam) ? ' In English, this sound is not written with just one letter here.' : '';
    return { head:'Good ear! You hear ' + S.name + '.',
      body:'You wrote ' + info.typedTeam + '. This sound can be spelled ' + ways + (S.teams.length > 1 ? '' : '') + '. This word uses ' + info.team + '.' + single + tip,
      ex:S.ex };
  }
  if (info.rule === 'bossy-r'){
    if (info.why === 'r-er') return { head:'Good ear! You hear /er/.',
      body:'In English, er, ir, and ur all make the same sound: /er/. After w, or makes it too (word, work). You have to learn which one each word uses.',
      ex:['her','bird','fur','word'] };
    if (info.why === 'r-final') return { head:'Good ear! The end sounds like /er/.',
      body:'At the end of a longer word, er, or, and ar can all sound like /er/: teacher, doctor, dollar. Learn this word\'s spelling.',
      ex:['teacher','doctor','dollar','sister'] };
    if (info.why === 'r-drop') return { head:'Almost! Don\'t forget the bossy r.',
      body:'When r comes after a vowel, it bosses the vowel and changes its sound. Write the r.', ex:['car','bird','fork','her'] };
    if (info.why === 'r-novowel') return { head:'Almost! English writes a vowel before the r.',
      body:'You hear /er/ or /ar/, and English still writes a vowel before the r: bird, not brd.', ex:['bird','her','turn','car'] };
  }
  if (info.rule !== 'magic-e') return PH.EXPLAIN[info.why];
  var V = PH.VOWEL[info.vowel] || PH.VOWEL.a, L = info.vowel;
  var pattern = L + '_e';
  if (info.why === 'missing-e') return { head:'Almost! Something is missing at the end.',
    body:'You hear ' + V.name + ': the ' + L + ' says its name. Add a silent e at the end. The e makes the ' + L + ' say its name.', ex:V.ex };
  return { head:'Good ear! You hear ' + V.name + '.',
    body:'In this word, ' + V.name + ' is spelled ' + pattern + ': the letter ' + L + ', one consonant, then a silent e at the end. The e makes the ' + L + ' say its name.', ex:V.ex };
};

/* Notes for each home language: what is the same, what is different.
   Written in simple English; pages translate them on request. */
PH.L1 = {
  'c-and-g': {
    es: 'Good news: in Latin American Spanish, c before e and i also says /s/ (cena, cine), and c before a, o, u says /k/ (casa). English works the same way! G is different. In Spanish, g before e and i is a sound from the throat (gente). In English, g before e, i, or y says /j/, like in "jeans."',
    fr: 'Good news: in French, c before e, i, y says /s/ (ceci), and c before a, o, u says /k/ (café). English works the same way! G before e and i is soft in French too (girafe). But the English sound is /j/, like in "jeans," not the French j.',
    tl: 'In Tagalog, the /k/ sound is usually spelled with k, and the /s/ sound with s. In English, both sounds can be spelled with c. In Tagalog, g always sounds like in "gabi." In English, g before e, i, or y often says /j/, like in "jeans."',
    vi: 'In Vietnamese, c always says /k/ (cá). In English, c says /k/ only before a, o, u, or a consonant. Before e, i, or y, it says /s/. In Vietnamese, "gi" sounds like z or y. In English, "gi" usually says /j/, like in "giraffe."',
    so: 'In Somali, the letter c is a sound from the throat (like in "caano"). In English, c never makes that sound. It says /k/ or /s/. In Somali, g always sounds like in "gabar." In English, g before e, i, or y often says /j/.',
    ru: 'Be careful: the Russian letter С looks like the English c, and it always says /s/. The English c says /s/ only before e, i, or y. Before a, o, u, or a consonant, it says /k/.',
    _other: 'Your language does not use the letters c and g, so this rule is new for you. Here is the trick: look at the next letter. It tells you the sound.'
  },
  'magic-e': {
    es: 'In Spanish, every letter makes a sound, and an e at the end is always read (nube, leche). In English, the e at the end of "cake" is silent. It only changes the vowel before it. Also: English long A (cake) sounds like Spanish "ei," and long I (bike) sounds like Spanish "ai." But English does not spell them that way. It uses a_e and i_e.',
    fr: 'In French, an e at the end is often silent too (porte, table), so this may feel familiar! In English, that silent e has a job: it makes the vowel before it say its name. cap becomes cape.',
    tl: 'In Tagalog, every letter is read, and an e at the end is pronounced. In English, the e at the end of "cake" is silent. It changes the vowel before it, so the vowel says its name.',
    vi: 'In Vietnamese, every written vowel is pronounced. In English, the e at the end of "cake" is silent. It is a signal: the vowel before it says its name.',
    so: 'In Somali, every letter is pronounced, and long vowels are written with two letters (aa, ee, oo). In English, a long vowel is often written with one vowel and a silent e at the end: cake, bike, home.',
    ru: 'In Russian, every vowel letter is pronounced. In English, the e at the end of "cake" is silent. It changes the vowel before it: cap becomes cape.',
    _other: 'In English, some letters are silent. The e at the end of "cake" makes no sound. It is a signal: the vowel before it says its name.'
  },
  'vowel-teams': {
    es: 'Spanish writes each vowel sound one way: a, e, i, o, u. English writes long vowel sounds in many ways. Long E is often ee or ea (tree, beach), not i. Long A is often ai or ay (rain, day), not ei. The oo in moon sounds like Spanish u. And ow in cow sounds like Spanish au.',
    fr: 'French has vowel teams too (ai, au, ou), but English teams sound different. English ai says long A (rain). ea says long E (beach). English oo sounds like French ou (moon).',
    tl: 'Tagalog writes each vowel sound with one letter. English often uses two letters for one vowel sound: ai (rain), ee (tree), oa (boat), oo (moon).',
    vi: 'Vietnamese has many vowel combinations, but English teams sound different. Learn each English team with its sound: ai (rain), ee (tree), oa (boat), oo (moon), ow (cow).',
    so: 'Somali writes long vowels with double letters, like English! But the sounds are different. English ee sounds like Somali ii (tree). English oo sounds like Somali uu (moon).',
    ru: 'In Russian, each vowel letter has its own sound. English often uses two letters for one vowel sound: ai (rain), ee (tree), oa (boat). English oo sounds like Russian у (moon).',
    _other: 'In English, two vowels together often make one sound. Learn each team with its sound: ai (rain), ee (tree), oa (boat), oo (moon).'
  },
  'bossy-r': {
    es: 'In Spanish, r is tapped or rolled (pero, perro), and the vowel keeps its sound. In English, r bosses the vowel before it: car, her, fork. Do not roll it. Pull your tongue back, and do not touch the top of your mouth. Also: er, ir, and ur all sound the same (/er/), so learn how each word is spelled.',
    fr: 'French r is made in the throat. English r is made with the tongue pulled back, not touching anything. In English, r also changes the vowel before it. er, ir, and ur all say /er/: her, bird, fur.',
    tl: 'In Tagalog, r is tapped, and every vowel keeps its sound. In English, r bosses the vowel before it and changes its sound: car, her, fork. er, ir, and ur all sound the same.',
    vi: 'Vietnamese words never end with an r sound, so English words like car and teacher can feel hard. Keep the r at the end: pull your tongue back. In English, er, ir, and ur all sound the same (/er/).',
    so: 'Somali r is rolled. English r is not rolled: pull your tongue back. In English, r changes the vowel before it. er, ir, and ur all say /er/: her, bird, fur.',
    ru: 'Russian р is rolled. English r is not: pull your tongue back and do not touch the top of your mouth. English r also changes the vowel before it. er, ir, and ur all say /er/.',
    ar: 'Arabic writing often leaves out short vowels, but English always writes them. Write "bird," not "brd." Also, English r is not rolled: pull your tongue back. er, ir, and ur all say /er/.',
    ary: 'Arabic writing often leaves out short vowels, but English always writes them. Write "bird," not "brd." Also, English r is not rolled: pull your tongue back. er, ir, and ur all say /er/.',
    ur: 'Urdu writing often leaves out short vowels, but English always writes them. Write "bird," not "brd." Also, English r is not rolled: pull your tongue back. er, ir, and ur all say /er/.',
    _other: 'In English, r changes the vowel before it. ar says /ar/ (car). or says /or/ (fork). er, ir, and ur all say /er/ (her, bird, fur).'
  },
  'digraphs': {
    es: 'Spanish has ch (chico), and it sounds like English ch. But Latin American Spanish has no sh sound and no th sound. Many Spanish speakers say "chip" for "ship." Try this: sh is long and soft, like "shh!" ch is short, like a sneeze: "choo!" For th, put your tongue between your teeth.',
    fr: 'Careful: French ch (chat) sounds like English sh, not English ch! English "chair" starts with t + sh together. French ph and English ph both say /f/ (photo). French has no th sound: put your tongue between your teeth.',
    tl: 'Tagalog writes the /ch/ sound as ts (tsinelas), and a sound close to /sh/ as sy (siyempre). English writes them ch and sh. Tagalog has no th sound: put your tongue between your teeth.',
    vi: 'Careful: Vietnamese th is a t with air, but English th puts your tongue between your teeth (think, the). Good news: Vietnamese ph says /f/, just like English ph (phở, phone).',
    so: 'Somali sh (shan) is the same sound as English sh. Somali has no th sound: put your tongue between your teeth and blow.',
    ru: 'Russian has ш and ч, the same sounds as English sh and ch. English writes each one with two letters. Russian has no th sound: put your tongue between your teeth. It is not t, s, or f.',
    _other: 'In English, two letters can make one new sound: sh, ch, th, ph, wh. Say them as one sound, not two.'
  }
};
PH.l1Note = function(rule, lang){
  var r = PH.L1[rule]; if (!r) return '';
  if (!lang) return '';
  return r[lang] || r._other;
};

/* ---------------- saving ---------------- */
function sb(path, opts){
  opts = opts || {};
  var h = { apikey:PH.SUPA_KEY, Authorization:'Bearer ' + PH.SUPA_KEY, 'Content-Type':'application/json' };
  if (opts.prefer) h.Prefer = opts.prefer;
  return fetch(PH.SUPA_URL + '/rest/v1/' + path, { method:opts.method || 'GET', headers:h,
    body:opts.body ? JSON.stringify(opts.body) : undefined })
  .then(function(r){
    if (!r.ok) return r.text().then(function(t){ console.warn('PH', path, r.status, t); return null; });
    return r.text().then(function(t){ return t ? JSON.parse(t) : []; });
  }).catch(function(e){ console.warn('PH', e); return null; });
}
PH.sb = sb;
function variants(e){
  e = String(e || '').trim().toLowerCase();
  var lp = e.split('@')[0], out = [e];
  if (/@(s\.)?sfusd\.edu$/.test(e)){ out.push(lp + '@s.sfusd.edu'); out.push(lp + '@sfusd.edu'); }
  return out.filter(function(x, i){ return x && out.indexOf(x) === i; });
}
function inEmails(e){
  return 'email=in.(' + encodeURIComponent(variants(e).map(function(x){ return '"' + x + '"'; }).join(',')) + ')';
}
/* one mix-up: which rule, which word, what they typed */
PH.logHit = function(email, info, word, typed, source){
  if (!email || !info) return;
  sb('phonics_hits', { method:'POST', prefer:'return=minimal', body:[{
    email:email, rule:info.rule, why:info.why, word:word, typed:typed, source:source || '',
    created_at:new Date().toISOString() }] });
};
PH.loadHits = function(email){ return sb('phonics_hits?' + inEmails(email) + '&select=rule,why,word,typed,source,created_at&order=created_at.desc&limit=200'); };
PH.loadWork = function(email){ return sb('phonics_work?' + inEmails(email) + '&select=rule,scores,updated_at'); };

/* Which rules should this student practice, and how far along are they?
   A rule is assigned after ASSIGN_AFTER mix-ups, or once they have started it. */
PH.assigned = function(hits, work){
  var by = {};
  (hits || []).forEach(function(h){
    var o = by[h.rule] = by[h.rule] || { rule:h.rule, hits:[], scores:{} };
    if (!o.hits.some(function(x){ return x.word === h.word && x.typed === h.typed; })) o.hits.push(h);
  });
  (work || []).forEach(function(w){
    var o = by[w.rule] = by[w.rule] || { rule:w.rule, hits:[], scores:{} };
    var s = w.scores || {};
    Object.keys(s).forEach(function(k){ o.scores[k] = Math.max(o.scores[k] || 0, s[k] || 0); });
    o.started = true;
  });
  return Object.keys(by).map(function(k){ return by[k]; }).filter(function(o){
    return PH.RULES[o.rule] && (o.started || o.hits.length >= PH.ASSIGN_AFTER);
  }).map(function(o){
    var R = PH.RULES[o.rule];
    o.done = R.parts.filter(function(p){ return (o.scores[p] || 0) >= 80; }).length;
    o.total = R.parts.length;
    o.complete = o.done === o.total;
    return o;
  });
};

})();
