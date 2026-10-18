/* ============================================================
   landlady-words.js — word analysis for the twelve core words.
   DRAFT: data only. No engine reads this yet.

   Each entry has whichever of these actually apply — not every
   word rewards every kind of analysis, and padding them would
   teach students that the analysis is busywork:

     type      which kind of word knowledge pays off here
     parts     prefix / root / suffix, with meanings
     family    related words, grouped by part of speech
     cognate   per language; only where it is real
     picture   what an illustration would show (contrast pairs
               for abstract words, per Toby's design)
     context   four sentences, one correct (correct: index)
     shades    near-synonyms, ordered weakest -> strongest
     form      the SAME word used in the wrong grammatical slot
               (never a misspelling — see note at the foot)
   ============================================================ */

var LL_WORDS = [

{ w:"porter", type:"latin-root",
  def:"a worker at a train station who carries bags",
  parts:[["port-","Latin: to carry (portare) — and also a door or gate (porta)"],
         ["-er","a person who does it"]],
  family:{ nouns:["port","portal","porch","transport","import","export"],
           adjs:["portable"], verbs:["transport","import","export"] },
  cognate:{ es:["portero (doorman)","puerta (door)","puerto (port)","portar (to carry)"],
            fr:["porter (to carry)","porte (door)"] },
  note:"Two Latin roots sit inside this word. The station porter is the carrying one.",
  picture:"A uniformed man lifting a suitcase onto a train, beside a station clock.",
  context:["The porter carried our bags onto the train.",
           "I will porter the door for you.",
           "She felt a porter to stay.",
           "The soup tasted very porter."], correct:0,
  shades:[["helper","general"],["porter","station or hotel, carries luggage"],
          ["bellhop","hotel only, American"]],
  form:["The porter helped us.",          /* noun, correct */
        "He portered our bags.",          /* wrong: not a verb */
        "She was very porter today."] },  /* wrong: not an adjective */

{ w:"compulsion", type:"latin-root",
  def:"a strong pull to do something that you cannot control",
  parts:[["com-","together, with force"],
         ["-puls-","Latin: to push or drive (pellere, pulsus)"],
         ["-ion","makes it a noun — the thing itself"]],
  family:{ verbs:["compel","repel","expel","propel","impel"],
           nouns:["compulsion","pulse","impulse","expulsion"],
           adjs:["compulsive"], advs:["compulsively"] },
  cognate:{ es:["compulsión","compulsivo","impulso"],
            fr:["compulsion"], ru:["компульсия"] },
  picture:"A figure leaning hard toward an open door while a hand pulls their sleeve back.",
  context:["He felt a compulsion to follow her into the house.",
           "She compulsioned him to come inside.",
           "The room was very compulsion.",
           "They walked compulsion down the street."], correct:0,
  shades:[["wish","weak, you can ignore it"],["urge","stronger"],
          ["compulsion","you cannot stop yourself"],["obsession","it fills your whole mind"]],
  form:["Billy felt a strange compulsion.",
        "The house compulsioned him.",
        "He was compulsion about the tea."] },

{ w:"peculiar", type:"latin-root",
  def:"strange or odd — not what you expected",
  parts:[["pecu-","Latin: private property, what is your own (peculium)"],
         ["-iar","belonging to"]],
  family:{ nouns:["peculiarity"], advs:["peculiarly"] },
  cognate:{ es:["peculiar (same spelling)","peculiaridad"],
            fr:["particulier"], vi:["kỳ lạ"] },
  note:"It first meant 'belonging only to one person'. Something that belongs to nobody else is unusual — and unusual slid into strange.",
  picture:"Three identical teacups in a row and a fourth, upside down, slightly glowing.",
  context:["There was a peculiar smell in the room.",
           "She peculiared at the guest book.",
           "He felt a peculiar to leave.",
           "The tea was peculiarly."], correct:0,
  shades:[["unusual","neutral"],["odd","mildly strange"],
          ["peculiar","strange in a way you notice"],["bizarre","very strange"]],
  form:["A peculiar smell filled the hall.",
        "The smell peculiared the hall.",
        "He noticed the peculiar of it."] },

{ w:"neglect", type:"latin-root",
  def:"when nobody takes care of a thing, so it falls apart",
  parts:[["neg-","not"],["-lect","Latin: to choose, to gather up (legere)"]],
  family:{ verbs:["neglect"], nouns:["neglect","negligence"],
           adjs:["neglectful","negligent","negligible"],
           cousins:["collect","select","elect","lecture"] },
  cognate:{ es:["negligencia","negligente","negar (to deny)"],
            fr:["négliger"], ar:["إهمال"] },
  note:"'Not chosen' — you walk past it and never pick it up.",
  picture:"Left: a parent lifting a crying baby. Right: the same parent on a phone, baby ignored, red X.",
  context:["Years of neglect had ruined the paint on the houses.",
           "The house was very neglect.",
           "She neglectly closed the door.",
           "He gave a neglect to the dog."], correct:0,
  shades:[["forget","by accident"],["ignore","on purpose, once"],
          ["neglect","on purpose, over a long time"],["abandon","leave completely"]],
  form:["The garden showed signs of neglect.",
        "The garden was neglect.",
        "She neglect the dog every day."] },

{ w:"preserved", type:"latin-root",
  def:"kept from rotting, using chemicals",
  parts:[["pre-","before, in advance"],["-serv-","Latin: to keep, to guard (servare)"],
         ["-ed","past, or describing something already done"]],
  family:{ verbs:["preserve","conserve","reserve","observe"],
           nouns:["preservation","preservative","conservation"],
           adjs:["preserved","well-preserved"] },
  cognate:{ es:["preservar","preservativo","conservar"],
            fr:["préserver"], ru:["консервировать"] },
  picture:"A glass jar on a shelf with a small animal inside, a museum label beneath it.",
  context:["The dog had been stuffed and preserved.",
           "She preserved into the room.",
           "He felt very preserved about the tea.",
           "They preserved him a cup."], correct:0,
  shades:[["kept","general"],["preserved","stopped from decaying"],
          ["embalmed","a human body"],["stuffed","an animal skin — taxidermy"]],
  form:["The parrot was preserved.",
        "She did a preserved on the dog.",
        "He walked preserved into the hall."] },

{ w:"briskly", type:"suffix",
  def:"moving quickly, like a busy person in a hurry",
  parts:[["brisk","quick and full of energy"],["-ly","turns an adjective into an adverb — HOW something is done"]],
  family:{ adjs:["brisk"], advs:["briskly"], nouns:["briskness"] },
  cognate:{},
  note:"The three forms are the lesson: brisk (what it is), briskly (how it is done), briskness (the thing itself). Billy copies all three from the big shots.",
  picture:"Left: a figure striding with speed lines. Right: the same figure dawdling, red X.",
  context:["He walked briskly down the street.",
           "He was very briskly that morning.",
           "His briskly impressed the manager.",
           "She briskly the door open."], correct:0,
  shades:[["slowly",""],["steadily",""],["briskly","quick and businesslike"],["hurriedly","quick and flustered"]],
  form:["He walked briskly.",
        "He had a briskly manner.",
        "The briskly of his walk."] },

{ w:"lodgings", type:"suffix",
  def:"a room in someone's house that you pay to sleep in",
  parts:[["lodge","to stay somewhere for a time"],["-ing","the activity"],["-s","always plural in this meaning"]],
  family:{ verbs:["lodge"], nouns:["lodge","lodger","lodging","lodgings"] },
  cognate:{ fr:["loger","logement"] },
  note:"Always plural: you look for lodgings, never a lodging. A lodger is the person staying.",
  picture:"A narrow house front with a lit upstairs window and a small card in the glass.",
  context:["Billy needed cheap lodgings for the night.",
           "He lodgings at the bed and breakfast.",
           "The room was very lodgings.",
           "She gave him a lodgings."], correct:0,
  shades:[["room","general"],["lodgings","paid, short stay, old-fashioned"],
          ["boarding house","meals included"],["hotel","a business"]],
  form:["He looked for lodgings.",
        "He looked for a lodgings.",
        "He lodgings in Bath."] },

{ w:"dachshund", type:"compound",
  def:"a small dog with a long body and short legs",
  parts:[["Dachs","German: badger"],["Hund","German: dog"]],
  family:{ cousins:["hound (English, same root as Hund)"] },
  cognate:{ },
  note:"A badger-dog: bred long and low to go down badger holes. English borrowed the whole German word.",
  picture:"A long low brown dog in profile beside a badger hole.",
  context:["The dachshund was curled up in front of the fire.",
           "She dachshunded across the room.",
           "The tea was rather dachshund.",
           "He felt a dachshund to stay."], correct:0,
  shades:[],
  form:["A dachshund lay by the fire.",
        "The dog was very dachshund.",
        "She dachshunds every evening."] },

{ w:"head office", type:"compound",
  def:"the main office of a company, where the bosses work",
  parts:[["head","main, most important — not the body part here"],["office","a place of work"]],
  family:{ nouns:["headquarters","headmaster","headline","header"],
           pattern:["head + noun = the main one"] },
  cognate:{ es:["oficina central","sede"], zh:["总部"], ar:["المكتب الرئيسي"] },
  note:"English builds many words this way: head teacher, head chef, head office. 'Head' means main.",
  picture:"A tall city office block, one floor lit, a small arrow labelled 'the bosses'.",
  context:["Mr Greenslade at the Head Office told him about Bath.",
           "He head officed to London.",
           "The room felt head office.",
           "She was very head office."], correct:0,
  shades:[["branch","a smaller local office"],["head office","the main one"],
          ["headquarters","the main one, often military or large"]],
  form:["He works at the head office.",
        "He head offices in London.",
        "The office was very head."] },

{ w:"big shots", type:"idiom",
  def:"the important, powerful people in a company",
  parts:[],
  family:{ nouns:["big shot","bigwig","VIP","top brass"] },
  cognate:{ es:["peces gordos (literally: fat fish)"], zh:["大人物"], ar:["كبار الشخصيات"] },
  note:"An idiom: the words do not mean what they say. Nobody is big and nobody is shot. Most languages have their own version — Spanish says fat fish.",
  picture:"Three small figures looking up at three large figures in suits on a balcony.",
  context:["The big shots at Head Office were always brisk.",
           "He big shotted into the room.",
           "The tea was very big shot.",
           "She felt a big shot to leave."], correct:0,
  shades:[["worker",""],["manager",""],["big shot","informal, slightly mocking"],["executive","formal"]],
  form:["The big shots arrived.",
        "He was big shots.",
        "She big shots the company."] },

{ w:"swanky", type:"register",
  def:"expensive and fancy-looking",
  parts:[["swank","to show off"],["-y","makes it an adjective: having that quality"]],
  family:{ nouns:["swank"], adjs:["swanky"] },
  cognate:{},
  note:"Informal. You would say it to a friend, not in an essay. The formal word is 'luxurious'.",
  picture:"Left: a grand house with pillars. Right: the same house peeling and dark.",
  context:["Once they had been very swanky residences.",
           "The house swankied in the moonlight.",
           "He felt a swanky about the room.",
           "She swanky opened the door."], correct:0,
  shades:[["nice","neutral"],["smart","neutral"],["swanky","informal, a bit mocking"],
          ["luxurious","formal"],["opulent","very formal"]],
  form:["A swanky hotel.",
        "The hotel had swanky.",
        "They swanky the hotel."] },

{ w:"nest", type:"metaphor",
  def:"a home — and also the place where an animal waits",
  parts:[],
  family:{ nouns:["nest","nest egg"], verbs:["nest","nestle"], adjs:["nested"] },
  cognate:{ es:["nido"], fr:["nid"], vi:["tổ"] },
  note:"The landlady calls her house 'my little nest'. A nest sounds warm and safe — but a spider has a nest too, and it is where it waits for what comes in.",
  picture:"A woven bird's nest; behind it, faintly, a web in the same shape.",
  context:["It isn't often I have a visitor in my little nest.",
           "She nested him a cup of tea.",
           "The room was very nest.",
           "He felt nest about the house."], correct:0,
  shades:[["house","a building"],["home","where you belong"],
          ["nest","small, soft, hidden — and animal"],["lair","where a dangerous animal waits"]],
  form:["She called it her little nest.",
        "The birds nest in the roof.",     /* also correct — verb */
        "He was very nest."] }

];

/* ------------------------------------------------------------
   A note on `form`, replacing the misspelling idea.

   Showing briksly / brksly / briskily next to briskly means three
   of the four things a student reads are wrong, and wrong spellings
   do stick. These items instead spell the word correctly every time
   and move it into the wrong grammatical slot, so the student has
   to notice that `briskly` cannot be a noun. Same discrimination
   work, no exposure to bad spelling, and it teaches word class.

   The Listen-and-spell tab already covers production spelling,
   which is the stronger test anyway.
   ------------------------------------------------------------ */

/* ============================================================
   LL_BRIDGE — for students whose language shares no roots with
   Latin. A cognate would be a lie here, so this is the real
   thing instead: how THEIR language builds the same idea.
   Chinese builds from characters; Arabic from a three-letter
   root. Both are word-building systems the student already
   owns — the point is "you already do this".
     [term, what its pieces literally say]
   ============================================================ */
var LL_BRIDGE = {

"porter": {
  zh:[["搬运工 bānyùngōng","搬 carry + 运 transport + 工 worker — the carry-worker, exactly like carry + -er"],
      ["门房 ménfáng","门 door + 房 room — the other Latin root, porta, is a door too"]],
  ar:[["حمّال ḥammāl","root ح م ل = to carry. The faʿʿāl shape means 'the one who does it for a living' — it IS the -er"],
      ["حَمْل ḥaml","same three letters: the load itself"]] },

"compulsion": {
  zh:[["强迫 qiǎngpò","强 strong + 迫 to force — force applied from outside, the com- of compulsion"],
      ["冲动 chōngdòng","冲 rush + 动 move — this is im-pulse, piece for piece"]],
  ar:[["اندفاع indifāʿ","root د ف ع = to push. Latin -puls- also means push. Same idea, different alphabet"],
      ["إجبار ijbār","root ج ب ر = to force someone"]] },

"peculiar": {
  zh:[["特有 tèyǒu","特 special + 有 have — 'his own', which is where peculiar started: your own private thing"],
      ["奇怪 qíguài","奇 strange + 怪 odd — where the word ended up"]],
  ar:[["خاص khāṣṣ","root خ ص ص = belonging to one person only — the old meaning of peculiar"],
      ["غريب gharīb","root غ ر ب = west, foreign. Foreign → strange, the same slide English made"]] },

"neglect": {
  zh:[["忽视 hūshì","忽 overlook + 视 to look — to not-look, and neg-lect means not-pick-up"],
      ["疏忽 shūhū","疏 distant + 忽 overlook"]],
  ar:[["إهمال ihmāl","root ه م ل. From these three letters: أهمل he neglected, مُهمَل neglected, إهمال neglect — one root, a whole family, just like English"]] },

"preserved": {
  zh:[["保存 bǎocún","保 protect + 存 keep in being — pre- (before) + serve (keep)"],
      ["标本 biāoběn","标 mark + 本 specimen — the stuffed dog in the story is a 标本"]],
  ar:[["محفوظ maḥfūẓ","root ح ف ظ = to guard, to keep. ma- at the front makes it 'the thing that has been kept'"]] },

"briskly": {
  zh:[["轻快地 qīngkuài de","轻 light + 快 fast, then 地 — and 地 is your -ly: it turns the describing word into a how-word"]],
  ar:[["بسرعة bi-surʿa","بـ with + سرعة speed. Arabic says 'with speed' where English says 'quickly' — same job, different build"],
      ["نشيط nashīṭ","root ن ش ط = lively, energetic"]] },

"lodgings": {
  zh:[["住处 zhùchù","住 to live + 处 place — the place where you live, which is all the word means"],
      ["寄宿 jìsù","寄 to lodge with + 宿 to stay the night"]],
  ar:[["مَسكن maskan","root س ك ن = to dwell. ma- at the front makes a PLACE: dwell → dwelling-place. Arabic builds place-words this way every time"],
      ["ساكن sākin","same root: the person living there"]] },

"dachshund": {
  zh:[["腊肠犬 làchángquǎn","腊肠 sausage + 犬 dog. English borrowed German; Chinese just described it"]],
  ar:[["كلب الغرير kalb al-ghurayr","dog of the badger — and that is exactly what Dachs-hund means in German. Same name, translated"]] },

"head office": {
  zh:[["总部 zǒngbù","总 chief, overall + 部 department — the head department"],
      ["总公司 zǒnggōngsī","总 chief + 公司 company"]],
  ar:[["المقر الرئيسي al-maqarr ar-raʾīsī","رئيسي main — from رأس raʾs, which means HEAD. Arabic uses the head the same way English does"]] },

"big shots": {
  zh:[["大人物 dàrénwù","大 big + 人物 person of note — big people, same joke"],
      ["大佬 dàlǎo","大 big + 佬 fellow — the street version, like 'big shot'"]],
  ar:[["كبار الشخصيات kibār ash-shakhṣiyyāt","كبير big → كبار the big ones. Arabic also makes importance out of size"]] },

"swanky": {
  zh:[["豪华 háohuá","豪 grand + 华 splendid — money you can see"],
      ["阔气 kuòqi","阔 wide + 气 air — showing off, which is what swank first meant"]],
  ar:[["فاخر fākhir","root ف خ ر = to boast. Luxury and showing off live in the same three letters"]] },

"nest": {
  zh:[["窝 wō","one character does what English needs two for: a bird's 窝, an animal's 窝, and 安乐窝 a cozy little home. The landlady's trap is in that one word"]],
  ar:[["عُشّ ʿushsh","a bird's nest — warm, safe"],
      ["وكر wakr","the den where a dangerous animal waits. Arabic keeps these two apart; English hides both inside 'nest'"]] }
};
