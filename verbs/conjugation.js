/* =============================================================================
   conjugation.js — shared verb engine for readings/verbs/*
   Mr. Toby / Galileo ELD

   WHAT IT DOES
     CONJ.form('watch','he','present')            -> "watches"
     CONJ.form('watch','he','present',{neg:1})    -> "doesn't watch"
     CONJ.form('go','they','past')                -> "went"
     CONJ.form('go','they','past',{neg:1})        -> "didn't go"
     CONJ.form('run','she','prog')                -> "is running"
     CONJ.sentence('she','watch','present')       -> "She watches"
     CONJ.accepts('dream','I','past',{},'dreamt') -> true  (alternate accepted)

   HOW TO ADD A LESSON'S VERBS
     Add one line to CONJ.SETS. One set = one verb list + one tense, because
     scores are saved as "<set id>-<mode>" and the dashboard reads that key.
     Same verbs in two tenses = two sets.

       {id:'u1l4', title:'Unit 1 Lesson 4', tense:'past', level:'Beginner',
        verbs:['walk','talk','play','go','see','eat']}

     The page readings/verbs/drill/?set=u1l4 then exists with no other work:
     paradigm grid, choose, negatives, and the verb table all build themselves.
     Add the set to the dashboard list too (verbs/dashboard.html, TENSES.drills).

   TENSES: 'present' | 'past' | 'prog' (present progressive)
   Add a tense by extending TENSE_RULES at the bottom.
   ============================================================================= */
(function(global){
'use strict';

/* ---------------------------------------------------------------- persons -- */
var PERSONS = [
  {k:'I',    t:'I',    g:'i'},
  {k:'you',  t:'You',  g:'pl'},
  {k:'he',   t:'He',   g:'s3'},
  {k:'she',  t:'She',  g:'s3'},
  {k:'it',   t:'It',   g:'s3'},
  {k:'we',   t:'We',   g:'pl'},
  {k:'they', t:'They', g:'pl'}
];
var PMAP = {}; PERSONS.forEach(function(p){ PMAP[p.k]=p; });
function person(k){ return PMAP[k] || PMAP.he; }

/* ------------------------------------------------------- spelling rules --- */
var VOWEL = /[aeiou]/;
function syllables(b){ var m = b.toLowerCase().match(/[aeiouy]+/g); return m ? m.length : 1; }
function cvc(b){ return /[^aeiou][aeiou][^aeiouwxy]$/.test(b) && syllables(b)===1; }

function sForm(b){
  if(b==='be') return 'is';
  if(b==='have') return 'has';
  if(b==='do') return 'does';
  if(b==='go') return 'goes';
  if(/(ch|sh|ss|s|x|z|o)$/.test(b)) return b+'es';
  if(/[^aeiou]y$/.test(b)) return b.slice(0,-1)+'ies';
  return b+'s';
}
function ingForm(b){
  if(/ie$/.test(b)) return b.slice(0,-2)+'ying';         /* lie -> lying   */
  if(/[^aeiou]e$/.test(b)) return b.slice(0,-1)+'ing';   /* write -> writing */
  if(cvc(b)) return b+b.slice(-1)+'ing';                 /* run -> running */
  return b+'ing';
}
function edForm(b){
  if(/e$/.test(b)) return b+'d';                         /* like -> liked  */
  if(/[^aeiou]y$/.test(b)) return b.slice(0,-1)+'ied';   /* study -> studied */
  if(cvc(b)) return b+b.slice(-1)+'ed';                  /* stop -> stopped */
  return b+'ed';
}

/* ------------------------------------------------------ irregular table ---
   [past, past participle, (optional) -ing, (optional) accepted alternates]  */
var IRR = {
  be:['was','been','being'], have:['had','had','having'], do:['did','done'],
  go:['went','gone'], get:['got','gotten',null,['got']], make:['made','made','making'],
  take:['took','taken','taking'], give:['gave','given','giving'], put:['put','put','putting'],
  say:['said','said'], see:['saw','seen','seeing'], come:['came','come','coming'],
  know:['knew','known'], think:['thought','thought'], find:['found','found'],
  write:['wrote','written','writing'], read:['read','read'], run:['ran','run','running'],
  eat:['ate','eaten','eating'], feel:['felt','felt'], sleep:['slept','slept','sleeping'],
  fall:['fell','fallen'], fight:['fought','fought'], hit:['hit','hit','hitting'],
  spend:['spent','spent'], teach:['taught','taught'], understand:['understood','understood'],
  ride:['rode','ridden','riding'], win:['won','won','winning'], lose:['lost','lost','losing'],
  let:['let','let','letting'], forget:['forgot','forgotten','forgetting'],
  drink:['drank','drunk'], wake:['woke','woken','waking',['waked']], speak:['spoke','spoken','speaking'],
  buy:['bought','bought'], shoot:['shot','shot'], stand:['stood','stood'],
  sting:['stung','stung'], strive:['strove','striven','striving',['strived']],
  weep:['wept','wept'], build:['built','built'], hold:['held','held'], hurt:['hurt','hurt'],
  kneel:['knelt','knelt',null,['kneeled']], plead:['pleaded','pleaded',null,['pled']],
  ring:['rang','rung'], seek:['sought','sought'], sell:['sold','sold'], feed:['fed','fed'],
  dig:['dug','dug','digging'], deal:['dealt','dealt'], flee:['fled','fled','fleeing'],
  catch:['caught','caught'], creep:['crept','crept'], grind:['ground','ground'],
  dream:['dreamed','dreamed',null,['dreamt']], learn:['learned','learned',null,['learnt']],
  bring:['brought','brought'], leave:['left','left','leaving'], meet:['met','met'],
  sit:['sat','sat','sitting'], swim:['swam','swum','swimming'], begin:['began','begun','beginning'],
  bite:['bit','bitten','biting'], break:['broke','broken'], choose:['chose','chosen','choosing'],
  drive:['drove','driven','driving'], fly:['flew','flown'], forgive:['forgave','forgiven','forgiving'],
  freeze:['froze','frozen','freezing'], grow:['grew','grown'], hear:['heard','heard'],
  hide:['hid','hidden','hiding'], keep:['kept','kept'], lead:['led','led'], lend:['lent','lent'],
  pay:['paid','paid'], rise:['rose','risen','rising'], send:['sent','sent'], shake:['shook','shaken','shaking'],
  sing:['sang','sung'], sink:['sank','sunk'], slide:['slid','slid','sliding'], steal:['stole','stolen','stealing'],
  swear:['swore','sworn'], swing:['swung','swung'], tear:['tore','torn'], tell:['told','told'],
  throw:['threw','thrown'], wear:['wore','worn'], bend:['bent','bent'], lie:['lay','lain','lying'],
  cost:['cost','cost'], cut:['cut','cut','cutting'], shut:['shut','shut','shutting'],
  hang:['hung','hung','hanging'], show:['showed','shown'], spread:['spread','spread'],
  spell:['spelled','spelled',null,['spelt']], become:['became','become','becoming']
};

var cache = {};
function verb(b){
  b = String(b||'').toLowerCase().trim();
  if(cache[b]) return cache[b];
  var sp = b.indexOf(' ');
  if(sp>0){                                   /* phrasal verb: hang out, wake up */
    var head = verb(b.slice(0,sp)), tail = b.slice(sp);
    return (cache[b] = {
      b:b, s:head.s+tail, ing:head.ing+tail, past:head.past+tail, pp:head.pp+tail,
      irregular:head.irregular, alts:head.alts.map(function(a){ return a+tail; })
    });
  }
  var ir = IRR[b];
  var rec = {
    b:b,
    s:sForm(b),
    ing: (ir && ir[2]) || ingForm(b),
    past: ir ? ir[0] : edForm(b),
    pp: ir ? ir[1] : edForm(b),
    irregular: !!ir && ir[0]!==edForm(b),
    alts: (ir && ir[3]) || []
  };
  return (cache[b]=rec);
}

/* --------------------------------------------------------------- tenses --- */
/* Each tense says how to build the verb phrase for a person, positive and
   negative, and which person groups look different from the others.          */
var TENSE_RULES = {
  present: {
    label:'Present', hint:'every day',
    changes:['s3'],                                   /* he / she / it changes */
    pos:function(v,p){
      if(v.b==='be') return p.g==='i' ? 'am' : p.g==='s3' ? 'is' : 'are';
      return p.g==='s3' ? v.s : v.b;
    },
    neg:function(v,p,contract){
      if(v.b==='be') return p.g==='i' ? (contract?"'m not":'am not')
        : p.g==='s3' ? (contract?"isn't":'is not') : (contract?"aren't":'are not');
      return (p.g==='s3' ? (contract?"doesn't":'does not') : (contract?"don't":'do not'))+' '+v.b;
    }
  },
  past: {
    label:'Past', hint:'yesterday',
    changes:['i','s3'],                               /* only "be" splits here */
    pos:function(v,p){
      if(v.b==='be') return p.g==='pl' ? 'were' : 'was';   /* you / we / they were */
      return v.past;
    },
    neg:function(v,p,contract){
      if(v.b==='be'){
        var w = ((p.g==='pl') ? 'were' : 'was');
        return contract ? (w==='was'?"wasn't":"weren't") : w+' not';
      }
      return (contract?"didn't":'did not')+' '+v.b;
    }
  },
  prog: {
    label:'Present progressive', hint:'right now',
    changes:['i','s3'],
    pos:function(v,p){ return (p.g==='i'?'am':p.g==='s3'?'is':'are')+' '+v.ing; },
    neg:function(v,p,contract){
      var be = p.g==='i' ? (contract?"'m not":'am not') : p.g==='s3' ? (contract?"isn't":'is not') : (contract?"aren't":'are not');
      return be+' '+v.ing;
    }
  }
};

function form(base, personKey, tense, opts){
  opts = opts||{};
  var v = verb(base), p = person(personKey), r = TENSE_RULES[tense] || TENSE_RULES.present;
  var contract = opts.contract!==false;
  return opts.neg ? r.neg(v,p,contract) : r.pos(v,p);
}
function sentence(personKey, base, tense, opts){
  var p = person(personKey), f = form(base, personKey, tense, opts);
  if(opts && opts.neg && tense==='present' && verb(base).b==='be' && p.g==='i' && f.charAt(0)==="'") return p.t+f;
  if(opts && opts.neg && tense==='prog'  && p.g==='i' && f.charAt(0)==="'") return p.t+f;
  return p.t+' '+f;
}
/* true if the person's form is different from the plain "I / you / we / they" form */
function changesHere(base, personKey, tense){
  var p = person(personKey);
  return form(base,'they',tense) !== form(base, personKey, tense);
}
/* accept alternates and contraction variants when a student types an answer */
function accepts(base, personKey, tense, opts, typed){
  var want = form(base, personKey, tense, opts);
  var got = String(typed||'').toLowerCase().replace(/[’`]/g,"'").replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
  var ok = [want, form(base, personKey, tense, {neg:opts&&opts.neg, contract:false})];
  var v = verb(base);
  v.alts.forEach(function(a){
    ok.push(want.replace(v.past, a));
    if(!opts || !opts.neg) ok.push(a);
  });
  /* "he's not" / "he isn't", "I'm not" / "I am not" */
  if(/^'m not$/.test(want)) ok.push('am not');
  return ok.some(function(x){ return String(x).toLowerCase().replace(/[’`]/g,"'").trim()===got; });
}

/* ------------------------------------------------------ negative pairs ----
   Builds the "I am not = I'm not" block from the worksheet, any tense.      */
function negatives(base, tense){
  return PERSONS.map(function(p){
    return {
      person: p,
      long:  p.t+' '+form(base, p.k, tense, {neg:1, contract:false}),
      short: sentence(p.k, base, tense, {neg:1, contract:true}),
      changes: changesHere(base, p.k, tense)
    };
  });
}

/* ------------------------------------------------------------ paradigms --- */
/* Person grid (the blue worksheet): rows = persons, columns = verbs.        */
function paradigm(verbs, tense, opts){
  opts = opts||{};
  return {
    kind:'persons',
    cols: verbs.map(function(b){ return {base:b, head:person('I').t+' '+form(b,'I',tense)}; }),
    rows: PERSONS.map(function(p){
      return {
        person:p,
        cells: verbs.map(function(b){
          return {
            subject:p.t, answer:form(b,p.k,tense,{neg:opts.neg}), base:b, personKey:p.k,
            tense:tense, neg:!!opts.neg, changes: changesHere(b,p.k,tense)
          };
        })
      };
    })
  };
}
/* Forms grid (better for past): rows = verbs, columns = base / past / didn't */
function formsGrid(verbs, tense){
  var cols = tense==='past'
      ? [{k:'base',label:'Now'},{k:'past',label:'Yesterday'},{k:'neg',label:"Not yesterday"}]
      : tense==='prog'
        ? [{k:'base',label:'Verb'},{k:'prog',label:'He is …'},{k:'neg',label:"He isn't …"}]
        : [{k:'base',label:'I …'},{k:'s',label:'He …'},{k:'neg',label:"He doesn't …"}];
  return {
    kind:'forms',
    cols:cols,
    rows: verbs.map(function(b){
      var v = verb(b);
      return {base:b, irregular:v.irregular, cells: cols.map(function(c){
        if(c.k==='base') return {answer:b, base:b, fixed:true};
        if(c.k==='past') return {answer:v.past, base:b, personKey:'I',  tense:'past',    changes:v.irregular};
        if(c.k==='s')    return {answer:v.s,    base:b, personKey:'he', tense:'present', changes:v.s!==b+'s'};
        if(c.k==='prog') return {answer:form(b,'he','prog'), base:b, personKey:'he', tense:'prog', changes:true};
        return {answer:form(b,'he',tense,{neg:1}), base:b, personKey:'he', tense:tense, neg:true, changes:false};
      })};
    })
  };
}

/* --------------------------------------------------- multiple choice ------ */
/* Wrong answers are the mistakes students actually make, not random words.  */
function distractors(base, personKey, tense, opts){
  var v = verb(base), p = person(personKey), out = [];
  var right = form(base, personKey, tense, opts);
  if(opts && opts.neg){
    PERSONS.forEach(function(q){ out.push(form(base,q.k,tense,{neg:1})); });
    out.push(form(base, personKey, tense));
  } else if(tense==='present'){
    out.push(v.b, v.s, v.b+'s', v.b+'es', form(base,'I','prog').replace(/^am /,'is '));
    if(v.b==='be') out = ['am','is','are'];
  } else if(tense==='past'){
    out.push(v.b, edForm(v.b), v.s, v.b+'ed', 'did '+v.b, v.pp);
    if(v.b==='be') out = ['was','were','is','are'];
  } else {
    out.push('am '+v.ing, 'is '+v.ing, 'are '+v.ing, v.b+'ing', 'is '+v.b);
  }
  var seen = {}; seen[right]=1;
  return out.filter(function(x){ if(!x || seen[x]) return false; seen[x]=1; return true; });
}
function choiceItem(base, personKey, tense, opts, howMany){
  var right = form(base, personKey, tense, opts);
  var wrong = distractors(base, personKey, tense, opts).slice(0, Math.max(1,(howMany||3)-1));
  return {
    base:base, personKey:personKey, tense:tense, neg:!!(opts&&opts.neg),
    subject:person(personKey).t, answer:right,
    full:sentence(personKey, base, tense, opts),
    options:shuffle(wrong.concat([right]))
  };
}
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

/* ============================= LESSON SETS ================================
   One set = one verb list + one tense. Add a line, get a page:
   readings/verbs/drill/?set=<id>
   ========================================================================= */
var SETS = [
  /* ---- Language Launch Unit 1, in Launch Plus order ---- */
  {id:'u1l1', title:'L1 People at School', tense:'present', level:'Newcomer', group:'Unit 1',
   verbs:['read','write','listen','speak','learn','teach','help','work','give','fix','clean','make'],
   blurb:'Book pages 6-15 and 64-77. The coach teaches. The custodian fixes things.'},

  {id:'u1l2', title:'L2 Meet and Greet', tense:'present', level:'Newcomer', group:'Unit 1',
   verbs:['meet','introduce','ask','say','answer','greet','thank','show','wave','shake'],
   blurb:'Book pages 16-29. She says hello. He introduces his friend.'},

  {id:'u1l3', title:'L3 From A to Z', tense:'present', level:'Newcomer', group:'Unit 1',
   verbs:['spell','write','read','say','start','begin','use','put'],
   blurb:'Book pages 30-37. He spells his name. A sentence starts with an uppercase letter.'},

  {id:'u1l4', title:'L4 From 0 to 100', tense:'present', level:'Newcomer', group:'Unit 1',
   verbs:['see','count','say','write','need','use','add','have'],
   blurb:'Book pages 38-47. I see fifteen students. She has two teachers.'},

  {id:'u1l5', title:'L5 About Me', tense:'present', level:'Newcomer', group:'Unit 1',
   verbs:['be','speak','go','live','have','like','study'],
   blurb:'Book pages 48-63. The pronoun lesson: I am, she is, they are.'},

  {id:'u1l8', title:'L8 Class Acts', tense:'present', level:'Beginner', group:'Unit 1',
   verbs:['find','hang out','learn','play','practice','solve','study','understand'],
   blurb:"Book pages 90-105. The book's own present-tense verb lesson, all eight verbs."},

  {id:'u1prog', title:'Unit 1 right now', tense:'prog', level:'Beginner', group:'Unit 1',
   verbs:['read','write','listen','speak','study','play','practice','hang out','work','learn'],
   blurb:'The same school verbs with am, is, are + -ing.'},

  {id:'u1past', title:'Unit 1 yesterday', tense:'past', level:'Beginner', group:'Unit 1',
   verbs:['say','meet','write','read','speak','teach','find','understand','go','have','learn','be'],
   blurb:'The Unit 1 verbs in the past. Most of them are irregular.'},

  /* ---- general verb lists ---- */
  {id:'core',  title:'Everyday verbs',      tense:'present', level:'Newcomer', group:'Verb lists',
   verbs:['play','talk','write','watch','study','go','have','be'],
   blurb:'I play, he plays, she watches.'},

  {id:'coreprog', title:'Right now',        tense:'prog',    level:'Newcomer', group:'Verb lists',
   verbs:['play','write','run','eat','study','watch','go','read'],
   blurb:'I am playing, he is running.'},

  {id:'pasta', title:'Past A: everyday verbs', tense:'past', level:'Beginner', group:'Verb lists',
   verbs:['talk','help','learn','play','study','write','read','need','like','think','see','sleep','run','eat','do','feel','try','cry','say'],
   blurb:'The first past tense list.'},

  {id:'pastb', title:'Past B: next 20',     tense:'past',    level:'Intermediate', group:'Verb lists',
   verbs:['fall','dream','fight','hit','spend','teach','understand','ride','win','lose','know','believe','find','let','come','forget','drink','wake','speak','buy'],
   blurb:'Mostly irregular.'},

  {id:'pastc', title:'Past C: harder verbs', tense:'past',   level:'Advanced', group:'Verb lists',
   verbs:['shoot','stand','sting','strive','weep','build','hold','hurt','kneel','plead','ring','seek','sell','feed','dig','deal','flee','catch','creep'],
   blurb:'Advanced irregular verbs.'},

  {id:'pastd', title:'Past D: the hard ones', tense:'past',  level:'Advanced', group:'Verb lists',
   verbs:['sting','grind','swear','tear','wear','bite','slide','shake','freeze','sink','swing','bend','steal','hide','lend'],
   blurb:'Vowel-change verbs.'}
];
function set(id){ for(var i=0;i<SETS.length;i++) if(SETS[i].id===id) return SETS[i]; return null; }

/* ------------------------------------------------------------- exports ---- */
global.CONJ = {
  PERSONS:PERSONS, person:person, TENSES:TENSE_RULES, SETS:SETS, set:set,
  verb:verb, sForm:sForm, ingForm:ingForm, edForm:edForm,
  form:form, sentence:sentence, accepts:accepts, changesHere:changesHere,
  negatives:negatives, paradigm:paradigm, formsGrid:formsGrid,
  choiceItem:choiceItem, distractors:distractors, shuffle:shuffle
};
})(window);
