/* ================================================================
   Shades of Meaning — readings/shades/shades.js
   A drop-in "thesaurus mode" for ELD 101 pages.

   Two word modes, switched by a toggle the host page mounts:
     dictionary  → the page's own tap-to-translate tooltip (Shades stays out)
     shades      → tapping a basic word opens the Shade Strip: a continuum
                   weaker → base word → stronger, each shade with meaning,
                   casual/formal tag, speaker, tap-to-translate, "Use it"

   Host contract (all optional):
     Shades.mount({
       root:      element whose text gets marked  (default document.body)
       toggle:    element to render the Dictionary|Shades toggle into
       target:    textarea / input / contenteditable where "Use it" replaces words
       getLang:   () => current language name (e.g. 'Spanish'); default reads
                  window.vocab_lang then ?lang=
       proxy:     translate proxy URL (default below)
       judge:     async (sentence, oldWord, newWord) => {verdict, note}  (optional AI)
       mode:      'dictionary' | 'shades'  (default: ?mode= then 'dictionary')
       onMode:    (mode) => {}  called on every change
     })
     Shades.setMode('shades'); Shades.getMode(); Shades.open('happy');
     Shades.close(); Shades.mark(el)  // re-scan new content

   Marked words get class "sh-word" + data-sh="base". In shades mode Shades
   listens at capture phase and stops the event, so the dictionary tooltip
   never fires. In dictionary mode Shades ignores clicks entirely.
   ================================================================ */
(function (global) {
  'use strict';

  /* ---------- DATA ----------------------------------------------
     i = intensity 1..5 (3 = the base word's weight)   reg = casual|neutral|formal
     m = plain meaning (also sent to the translate proxy)   ex = example
     tip = usage note shown in the fit check (optional)
  ---------------------------------------------------------------- */
  const DATA = {
    happy: { pos: 'adjective', shades: [
      { w: 'okay',      i: 1, reg: 'casual',  m: 'not sad, not happy, just fine', ex: 'I feel okay today.', tip: 'Very weak. Only use it when the feeling is small.' },
      { w: 'content',   i: 2, reg: 'formal',  m: 'calm and satisfied with what you have', ex: 'She is content with her small apartment.', tip: 'Often "content with" something.' },
      { w: 'glad',      i: 2, reg: 'neutral', m: 'happy about one thing that happened', ex: 'I am glad you came.', tip: 'Usually "glad that…" or "glad to…".' },
      { w: 'pleased',   i: 3, reg: 'formal',  m: 'happy because something went well', ex: 'The teacher was pleased with my work.', tip: 'Often "pleased with" something.' },
      { w: 'happy',     i: 3, reg: 'neutral', m: 'feeling good', ex: 'I am happy at school.' },
      { w: 'cheerful',  i: 3, reg: 'neutral', m: 'happy and showing it with a smile', ex: 'My uncle is always cheerful in the morning.' },
      { w: 'delighted', i: 4, reg: 'formal',  m: 'very happy', ex: 'We were delighted to meet the new teacher.' },
      { w: 'thrilled',  i: 5, reg: 'neutral', m: 'extremely happy and excited', ex: 'He was thrilled to win the game.' },
      { w: 'overjoyed', i: 5, reg: 'formal',  m: 'so happy you can hardly believe it', ex: 'My mother was overjoyed when I arrived.' }
    ]},
    sad: { pos: 'adjective', shades: [
      { w: 'down',        i: 1, reg: 'casual',  m: 'a little sad', ex: 'I feel a little down today.', tip: 'Casual. Usually "feel down".' },
      { w: 'unhappy',     i: 2, reg: 'neutral', m: 'not happy', ex: 'She is unhappy with her grade.' },
      { w: 'disappointed',i: 2, reg: 'neutral', m: 'sad because something did not happen the way you wanted', ex: 'I was disappointed when the trip was canceled.' },
      { w: 'sad',         i: 3, reg: 'neutral', m: 'feeling bad, not happy', ex: 'He is sad because his friend moved away.' },
      { w: 'upset',       i: 3, reg: 'neutral', m: 'sad and a little angry or worried', ex: 'My sister was upset about the broken phone.' },
      { w: 'miserable',   i: 4, reg: 'neutral', m: 'very sad and uncomfortable', ex: 'I was miserable when I was sick.' },
      { w: 'heartbroken', i: 5, reg: 'neutral', m: 'extremely sad, like your heart is broken', ex: 'She was heartbroken when her dog died.' },
      { w: 'devastated',  i: 5, reg: 'formal',  m: 'extremely sad and shocked', ex: 'The family was devastated by the news.' }
    ]},
    angry: { pos: 'adjective', shades: [
      { w: 'annoyed',   i: 1, reg: 'neutral', m: 'a little angry about something small', ex: 'I was annoyed by the noise.' },
      { w: 'irritated', i: 2, reg: 'formal',  m: 'a little angry; something is bothering you', ex: 'The teacher was irritated by the talking.' },
      { w: 'mad',       i: 3, reg: 'casual',  m: 'angry', ex: 'My brother is mad at me.', tip: 'Casual — fine for talking, use "angry" in school writing.' },
      { w: 'angry',     i: 3, reg: 'neutral', m: 'feeling strong dislike about something wrong', ex: 'She was angry when he lied.' },
      { w: 'furious',   i: 5, reg: 'neutral', m: 'extremely angry', ex: 'My father was furious about the broken window.' },
      { w: 'outraged',  i: 5, reg: 'formal',  m: 'extremely angry because something is unfair', ex: 'People were outraged by the decision.' }
    ]},
    scared: { pos: 'adjective', shades: [
      { w: 'nervous',    i: 1, reg: 'neutral', m: 'a little worried about what will happen', ex: 'I am nervous before a test.' },
      { w: 'worried',    i: 2, reg: 'neutral', m: 'thinking about bad things that might happen', ex: 'She is worried about her grandmother.' },
      { w: 'scared',     i: 3, reg: 'neutral', m: 'feeling fear', ex: 'I was scared of the big dog.' },
      { w: 'afraid',     i: 3, reg: 'neutral', m: 'feeling fear', ex: 'He is afraid of the dark.', tip: 'Goes after "be": "I am afraid". Not before a noun.' },
      { w: 'frightened', i: 4, reg: 'formal',  m: 'very scared', ex: 'The frightened cat ran under the bed.' },
      { w: 'terrified',  i: 5, reg: 'neutral', m: 'extremely scared', ex: 'I was terrified during the earthquake.' }
    ]},
    tired: { pos: 'adjective', shades: [
      { w: 'sleepy',    i: 1, reg: 'neutral', m: 'wanting to sleep', ex: 'I feel sleepy after lunch.' },
      { w: 'tired',     i: 3, reg: 'neutral', m: 'needing rest', ex: 'She is tired after work.' },
      { w: 'worn out',  i: 4, reg: 'casual',  m: 'very tired', ex: 'I was worn out after the long walk.' },
      { w: 'exhausted', i: 5, reg: 'neutral', m: 'extremely tired, no energy left', ex: 'The players were exhausted after the game.' }
    ]},
    good: { pos: 'adjective', shades: [
      { w: 'okay',       i: 1, reg: 'casual',  m: 'not bad, not great', ex: 'The movie was okay.' },
      { w: 'fine',       i: 2, reg: 'neutral', m: 'good enough', ex: 'The food was fine.' },
      { w: 'nice',       i: 2, reg: 'neutral', m: 'pleasant', ex: 'We had a nice day.' },
      { w: 'good',       i: 3, reg: 'neutral', m: 'of high quality; positive', ex: 'That is a good idea.' },
      { w: 'great',      i: 4, reg: 'neutral', m: 'very good', ex: 'She is a great cook.' },
      { w: 'excellent',  i: 5, reg: 'formal',  m: 'extremely good', ex: 'Your essay is excellent.' },
      { w: 'wonderful',  i: 5, reg: 'neutral', m: 'extremely good; makes you feel happy', ex: 'We had a wonderful trip.' },
      { w: 'outstanding',i: 5, reg: 'formal',  m: 'much better than others', ex: 'He is an outstanding student.' }
    ]},
    bad: { pos: 'adjective', shades: [
      { w: 'not great',  i: 1, reg: 'casual',  m: 'a little bad', ex: 'My test score was not great.' },
      { w: 'poor',       i: 2, reg: 'formal',  m: 'low quality', ex: 'The sound was poor.', tip: '"poor" also means having no money — check the meaning.' },
      { w: 'bad',        i: 3, reg: 'neutral', m: 'not good', ex: 'The weather is bad today.' },
      { w: 'awful',      i: 4, reg: 'neutral', m: 'very bad', ex: 'The traffic was awful.' },
      { w: 'terrible',   i: 5, reg: 'neutral', m: 'extremely bad', ex: 'I had a terrible headache.' },
      { w: 'horrible',   i: 5, reg: 'neutral', m: 'extremely bad; shocking', ex: 'That was a horrible accident.' }
    ]},
    big: { pos: 'adjective', shades: [
      { w: 'large',    i: 3, reg: 'formal',  m: 'big', ex: 'I would like a large pizza.' },
      { w: 'big',      i: 3, reg: 'neutral', m: 'of great size', ex: 'San Francisco is a big city.' },
      { w: 'huge',     i: 4, reg: 'neutral', m: 'very big', ex: 'The school has a huge gym.' },
      { w: 'enormous', i: 5, reg: 'formal',  m: 'extremely big', ex: 'An elephant is an enormous animal.' },
      { w: 'gigantic', i: 5, reg: 'neutral', m: 'extremely big, like a giant', ex: 'They built a gigantic bridge.' }
    ]},
    small: { pos: 'adjective', shades: [
      { w: 'little',  i: 3, reg: 'neutral', m: 'small', ex: 'She has a little brother.' },
      { w: 'small',   i: 3, reg: 'neutral', m: 'not big', ex: 'My room is small.' },
      { w: 'tiny',    i: 4, reg: 'neutral', m: 'very small', ex: 'A baby has tiny hands.' },
      { w: 'minute',  i: 5, reg: 'formal',  m: 'extremely small', ex: 'There was a minute crack in the glass.', tip: 'Say "my-NEWT". Rare — "tiny" is usually better.' }
    ]},
    smart: { pos: 'adjective', shades: [
      { w: 'clever',      i: 3, reg: 'neutral', m: 'quick at understanding and finding ideas', ex: 'She found a clever way to fix it.' },
      { w: 'smart',       i: 3, reg: 'neutral', m: 'good at learning and thinking', ex: 'My cousin is very smart.' },
      { w: 'intelligent', i: 4, reg: 'formal',  m: 'able to learn and understand well', ex: 'He is an intelligent student.' },
      { w: 'brilliant',   i: 5, reg: 'neutral', m: 'extremely smart', ex: 'Her idea was brilliant.' }
    ]},
    nice: { pos: 'adjective', shades: [
      { w: 'friendly', i: 3, reg: 'neutral', m: 'kind and easy to talk to', ex: 'The new student is friendly.' },
      { w: 'nice',     i: 3, reg: 'neutral', m: 'kind and pleasant', ex: 'Our teacher is nice.' },
      { w: 'kind',     i: 3, reg: 'neutral', m: 'caring about other people', ex: 'He is kind to animals.' },
      { w: 'generous', i: 4, reg: 'formal',  m: 'happy to give and share', ex: 'My aunt is generous with her time.' },
      { w: 'warm',     i: 4, reg: 'neutral', m: 'friendly in a way that makes you feel welcome', ex: 'She gave us a warm welcome.' }
    ]},
    pretty: { pos: 'adjective', shades: [
      { w: 'nice-looking', i: 2, reg: 'casual',  m: 'pleasant to look at', ex: 'That is a nice-looking jacket.' },
      { w: 'pretty',       i: 3, reg: 'neutral', m: 'pleasant to look at', ex: 'What a pretty garden!' },
      { w: 'attractive',   i: 3, reg: 'formal',  m: 'pleasant to look at', ex: 'It is an attractive building.' },
      { w: 'beautiful',    i: 4, reg: 'neutral', m: 'very pretty', ex: 'The sunset was beautiful.' },
      { w: 'gorgeous',     i: 5, reg: 'neutral', m: 'extremely beautiful', ex: 'She wore a gorgeous dress.' },
      { w: 'stunning',     i: 5, reg: 'formal',  m: 'so beautiful it surprises you', ex: 'The view from the bridge is stunning.' }
    ]},
    funny: { pos: 'adjective', shades: [
      { w: 'amusing',    i: 2, reg: 'formal',  m: 'makes you smile', ex: 'He told an amusing story.' },
      { w: 'funny',      i: 3, reg: 'neutral', m: 'makes you laugh', ex: 'My friend is very funny.' },
      { w: 'hilarious',  i: 5, reg: 'neutral', m: 'extremely funny', ex: 'The movie was hilarious.' }
    ]},
    hot: { pos: 'adjective', shades: [
      { w: 'warm',     i: 2, reg: 'neutral', m: 'a little hot, comfortable', ex: 'It is warm in the classroom.' },
      { w: 'hot',      i: 3, reg: 'neutral', m: 'high temperature', ex: 'Today is hot.' },
      { w: 'boiling',  i: 5, reg: 'casual',  m: 'extremely hot', ex: 'It is boiling outside!' },
      { w: 'scorching',i: 5, reg: 'neutral', m: 'extremely hot (weather)', ex: 'It was a scorching summer day.' }
    ]},
    cold: { pos: 'adjective', shades: [
      { w: 'cool',     i: 2, reg: 'neutral', m: 'a little cold, pleasant', ex: 'The evening was cool.' },
      { w: 'chilly',   i: 2, reg: 'neutral', m: 'cold enough to want a jacket', ex: 'San Francisco mornings are chilly.' },
      { w: 'cold',     i: 3, reg: 'neutral', m: 'low temperature', ex: 'The water is cold.' },
      { w: 'freezing', i: 5, reg: 'neutral', m: 'extremely cold', ex: 'It is freezing in the gym.' }
    ]},
    fast: { pos: 'adjective', shades: [
      { w: 'quick', i: 3, reg: 'neutral', m: 'taking a short time', ex: 'She gave a quick answer.' },
      { w: 'fast',  i: 3, reg: 'neutral', m: 'moving at high speed', ex: 'He is a fast runner.' },
      { w: 'rapid', i: 4, reg: 'formal',  m: 'very fast', ex: 'The city is growing at a rapid pace.' },
      { w: 'speedy',i: 4, reg: 'casual',  m: 'very fast', ex: 'Thanks for the speedy reply.' }
    ]},
    easy: { pos: 'adjective', shades: [
      { w: 'simple',        i: 3, reg: 'neutral', m: 'not complicated', ex: 'The directions are simple.' },
      { w: 'easy',          i: 3, reg: 'neutral', m: 'not hard to do', ex: 'The quiz was easy.' },
      { w: 'straightforward',i: 3, reg: 'formal', m: 'easy to understand, no surprises', ex: 'The form is straightforward.' },
      { w: 'effortless',    i: 5, reg: 'formal',  m: 'so easy it needs no effort', ex: 'For her, swimming is effortless.' }
    ]},
    hard: { pos: 'adjective', shades: [
      { w: 'tricky',      i: 2, reg: 'casual',  m: 'a little hard; easy to get wrong', ex: 'Question 5 is tricky.' },
      { w: 'hard',        i: 3, reg: 'neutral', m: 'not easy to do', ex: 'Math is hard for me.' },
      { w: 'difficult',   i: 3, reg: 'formal',  m: 'not easy to do', ex: 'This is a difficult word to spell.' },
      { w: 'challenging', i: 4, reg: 'formal',  m: 'hard in a way that makes you grow', ex: 'The project was challenging but fun.' },
      { w: 'impossible',  i: 5, reg: 'neutral', m: 'cannot be done', ex: 'It is impossible to finish in one minute.' }
    ]},
    important: { pos: 'adjective', shades: [
      { w: 'useful',     i: 2, reg: 'neutral', m: 'helps you', ex: 'A dictionary is useful.' },
      { w: 'important',  i: 3, reg: 'neutral', m: 'matters a lot', ex: 'Sleep is important.' },
      { w: 'necessary',  i: 4, reg: 'formal',  m: 'you must have or do it', ex: 'Water is necessary for life.' },
      { w: 'essential',  i: 5, reg: 'formal',  m: 'extremely important; cannot go without it', ex: 'Practice is essential for learning English.' },
      { w: 'crucial',    i: 5, reg: 'formal',  m: 'extremely important for the result', ex: 'The last goal was crucial.' }
    ]},
    interesting: { pos: 'adjective', shades: [
      { w: 'okay',        i: 1, reg: 'casual',  m: 'a little interesting', ex: 'The show was okay.' },
      { w: 'interesting', i: 3, reg: 'neutral', m: 'makes you want to know more', ex: 'The story is interesting.' },
      { w: 'exciting',    i: 4, reg: 'neutral', m: 'makes you feel excited', ex: 'The game was exciting.' },
      { w: 'fascinating', i: 5, reg: 'formal',  m: 'extremely interesting', ex: 'Space is fascinating.' }
    ]},
    many: { pos: 'determiner', shades: [
      { w: 'a few',      i: 1, reg: 'neutral', m: 'a small number', ex: 'I have a few friends here.' },
      { w: 'some',       i: 2, reg: 'neutral', m: 'a number, not many', ex: 'Some students walk to school.' },
      { w: 'several',    i: 2, reg: 'formal',  m: 'more than two, but not many', ex: 'I visited several countries.' },
      { w: 'many',       i: 3, reg: 'neutral', m: 'a large number', ex: 'Many students speak Spanish.' },
      { w: 'a lot of',   i: 3, reg: 'casual',  m: 'a large number', ex: 'There are a lot of books.', tip: 'Casual. In school writing, "many" is better.' },
      { w: 'numerous',   i: 4, reg: 'formal',  m: 'very many', ex: 'There are numerous reasons.' },
      { w: 'countless',  i: 5, reg: 'formal',  m: 'too many to count', ex: 'She has helped countless students.' }
    ]},
    say: { pos: 'verb', shades: [
      { w: 'mention', i: 2, reg: 'formal',  m: 'say something briefly', ex: 'She mentioned the test.' },
      { w: 'say',     i: 3, reg: 'neutral', m: 'speak words', ex: 'He says hello every morning.' },
      { w: 'tell',    i: 3, reg: 'neutral', m: 'say something to a person', ex: 'Tell me your name.', tip: 'Needs a person after it: "tell me", "tell her".' },
      { w: 'explain', i: 3, reg: 'formal',  m: 'say how or why', ex: 'The teacher explained the rule.' },
      { w: 'announce',i: 4, reg: 'formal',  m: 'say something important to many people', ex: 'The principal announced the schedule.' },
      { w: 'shout',   i: 5, reg: 'neutral', m: 'say very loudly', ex: 'Don\'t shout in the hallway!' }
    ]},
    walk: { pos: 'verb', shades: [
      { w: 'stroll', i: 2, reg: 'neutral', m: 'walk slowly for fun', ex: 'We strolled along the beach.' },
      { w: 'walk',   i: 3, reg: 'neutral', m: 'move on foot', ex: 'I walk to school.' },
      { w: 'hike',   i: 4, reg: 'neutral', m: 'walk a long way in nature', ex: 'They hiked in the mountains.' },
      { w: 'march',  i: 4, reg: 'neutral', m: 'walk with strong, even steps', ex: 'The band marched down the street.' },
      { w: 'rush',   i: 5, reg: 'neutral', m: 'go very fast because you are late', ex: 'She rushed to class.' }
    ]},
    look: { pos: 'verb', shades: [
      { w: 'glance',  i: 1, reg: 'formal',  m: 'look very quickly', ex: 'He glanced at his phone.', tip: 'Usually "glance at".' },
      { w: 'look',    i: 3, reg: 'neutral', m: 'turn your eyes to see', ex: 'Look at the board.', tip: 'Usually "look at".' },
      { w: 'watch',   i: 3, reg: 'neutral', m: 'look at something that is moving or happening', ex: 'We watched the game.' },
      { w: 'observe', i: 4, reg: 'formal',  m: 'look carefully to learn', ex: 'Scientists observe animals.' },
      { w: 'stare',   i: 5, reg: 'neutral', m: 'look for a long time without moving your eyes', ex: 'Don\'t stare at people.', tip: 'Usually "stare at". Can seem rude.' }
    ]},
    like: { pos: 'verb', shades: [
      { w: 'don\'t mind', i: 1, reg: 'casual', m: 'it is okay for you', ex: 'I don\'t mind homework.' },
      { w: 'like',        i: 3, reg: 'neutral', m: 'feel good about', ex: 'I like soccer.' },
      { w: 'enjoy',       i: 3, reg: 'neutral', m: 'feel happy doing', ex: 'I enjoy playing soccer.', tip: 'Verb after "enjoy" ends in -ing: "enjoy playing".' },
      { w: 'love',        i: 5, reg: 'neutral', m: 'like very, very much', ex: 'I love my family.' },
      { w: 'adore',       i: 5, reg: 'formal',  m: 'love very much', ex: 'She adores her little cousin.' }
    ]},
    eat: { pos: 'verb', shades: [
      { w: 'nibble', i: 1, reg: 'neutral', m: 'eat in very small bites', ex: 'The rabbit nibbled a carrot.' },
      { w: 'snack',  i: 2, reg: 'casual',  m: 'eat a little between meals', ex: 'I snack on fruit after school.', tip: 'Usually "snack on".' },
      { w: 'eat',    i: 3, reg: 'neutral', m: 'put food in your mouth and swallow', ex: 'We eat lunch at noon.' },
      { w: 'devour', i: 5, reg: 'formal',  m: 'eat quickly because you are very hungry', ex: 'He devoured the pizza.' }
    ]}
  };

  /* ---------- CSS ------------------------------------------------ */
  const CSS = `
  .sh-word{cursor:pointer;border-radius:3px;transition:background .15s}
  body.sh-mode-shades .sh-word{text-decoration:underline dotted #7c3aed 2px;text-underline-offset:3px}
  body.sh-mode-shades .sh-word:hover,body.sh-mode-shades .sh-word.sh-active{background:#ede9fe}
  body.sh-mode-shades{padding-right:0}
  @media(min-width:900px){body.sh-mode-shades.sh-open{padding-right:340px}}

  .sh-toggle{display:inline-flex;border:2px solid #d4d4d8;border-radius:999px;padding:3px;background:#fff;font-family:Nunito,system-ui,sans-serif;font-weight:700;font-size:.9rem;gap:2px}
  .sh-toggle button{border:0;background:transparent;border-radius:999px;padding:6px 14px;cursor:pointer;color:#52525b;font:inherit}
  .sh-toggle button.on{background:#7c3aed;color:#fff}
  .sh-toggle button.on.dict{background:#0369a1}

  .sh-panel{position:fixed;z-index:9000;background:#fff;border:2px solid #7c3aed;border-radius:18px;box-shadow:0 12px 40px rgba(76,29,149,.25);font-family:Nunito,system-ui,sans-serif;color:#1f1f23;display:none;flex-direction:column;overflow:hidden}
  .sh-panel.open{display:flex}
  @media(min-width:900px){.sh-panel{top:80px;right:16px;width:316px;max-height:calc(100vh - 100px)}}
  @media(max-width:899px){.sh-panel{left:0;right:0;bottom:0;border-radius:18px 18px 0 0;max-height:70vh}}
  .sh-head{display:flex;align-items:center;gap:8px;padding:12px 14px;background:linear-gradient(90deg,#ede9fe,#fdf4ff);border-bottom:1px solid #e9d5ff}
  .sh-head h3{margin:0;font-size:1.05rem;flex:1}
  .sh-head h3 small{font-weight:600;color:#6b7280;font-size:.78rem;margin-left:6px}
  .sh-x{border:0;background:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1.1rem;font-weight:800;color:#6b21a8;box-shadow:0 1px 3px rgba(0,0,0,.15)}
  .sh-scale{display:flex;justify-content:space-between;font-size:.72rem;font-weight:800;color:#6b7280;padding:8px 14px 0;text-transform:uppercase;letter-spacing:.04em}
  .sh-list{overflow:auto;padding:6px 10px 12px;display:flex;flex-direction:column;gap:6px}
  .sh-row{display:grid;grid-template-columns:10px 1fr auto;gap:10px;align-items:center;padding:8px 10px;border-radius:12px;border:2px solid transparent;cursor:pointer;background:#fafafa}
  .sh-row:hover{border-color:#c4b5fd}
  .sh-row.base{background:#f5f3ff;border-color:#a78bfa}
  .sh-row.sel{border-color:#7c3aed;background:#fff}
  .sh-dot{width:10px;height:10px;border-radius:50%}
  .sh-w{font-weight:800;font-size:1.05rem}
  .sh-w .sh-tr{display:block;font-size:.85rem;color:#4c1d95;font-weight:800;text-decoration:underline;margin-top:2px}
  .sh-w .sh-tr.none{color:#9ca3af}
  .sh-reg{font-size:.68rem;font-weight:800;padding:2px 7px;border-radius:999px;text-transform:uppercase;letter-spacing:.03em}
  .sh-reg.casual{background:#fef3c7;color:#92400e}
  .sh-reg.neutral{background:#e5e7eb;color:#374151}
  .sh-reg.formal{background:#dbeafe;color:#1e40af}
  .sh-detail{grid-column:1/-1;font-size:.9rem;color:#374151;display:none;line-height:1.4}
  .sh-row.sel .sh-detail{display:block}
  .sh-detail .m{margin:4px 0}
  .sh-detail .ex{font-style:italic;color:#6b7280}
  .sh-detail .ex b{color:#4c1d95;font-style:normal}
  .sh-acts{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
  .sh-btn{border:0;border-radius:999px;padding:6px 12px;font:inherit;font-weight:800;cursor:pointer;font-size:.85rem}
  .sh-btn.use{background:#16a34a;color:#fff}
  .sh-btn.say{background:#e0e7ff;color:#3730a3}
  .sh-btn.tr{background:#fce7f3;color:#9d174d}
  .sh-btn:disabled{opacity:.5;cursor:default}
  .sh-foot{padding:10px 14px;border-top:1px solid #eee;font-size:.85rem;line-height:1.4;background:#fafafa;min-height:38px}
  .sh-foot .v{font-weight:800}
  .sh-foot .v.ok{color:#15803d}.sh-foot .v.hmm{color:#b45309}.sh-foot .v.no{color:#b91c1c}
  .sh-foot .undo{margin-left:8px;font-weight:800;color:#6b21a8;cursor:pointer;background:none;border:0;font:inherit;text-decoration:underline}
  .sh-flash{animation:shflash 1.2s ease}
  @keyframes shflash{0%{background:#bbf7d0}100%{background:transparent}}
  `;

  /* ---------- STATE -------------------------------------------- */
  const S = {
    mode: 'dictionary', root: null, target: null, panel: null, toggleEl: null,
    cur: null, sel: null, lastReplace: null, opts: {},
    proxy: 'https://script.google.com/macros/s/AKfycbwbFr3oopIITlxKDhI5wGhEZdomWc3tmB5ZSK6NpBVisPAz-CMA4uKiruXDkCEU3T0Q/exec',
    trCache: {}
  };
  const COLORS = ['#c4b5fd','#a78bfa','#8b5cf6','#6d28d9','#4c1d95'];
  const REGLABEL = { casual: 'casual', neutral: 'everyday', formal: 'formal' };

  const qs = (k) => new URLSearchParams(location.search).get(k);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function lang() {
    if (S.opts.getLang) { try { const l = S.opts.getLang(); if (l) return l; } catch (e) {} }
    return global.vocab_lang || qs('lang') || 'Spanish';
  }
  function speak(text) {
    try { const u = new SpeechSynthesisUtterance(text === 'I' ? 'eye' : text); u.lang = 'en-US'; u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
  }

  /* ---------- MARKING ------------------------------------------ */
  const BASES = Object.keys(DATA);
  const WORD_RE = new RegExp('\\b(' + BASES.map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi');
  function mark(root) {
    root = root || S.root || document.body;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement; if (!p) return NodeFilter.FILTER_REJECT;
        if (p.closest('.sh-panel,.sh-toggle,script,style,textarea,input,button,select,[data-sh-skip]')) return NodeFilter.FILTER_REJECT;
        if (p.classList.contains('sh-word')) return NodeFilter.FILTER_REJECT;
        return WORD_RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment(); let last = 0; const txt = n.nodeValue; WORD_RE.lastIndex = 0; let m;
      while ((m = WORD_RE.exec(txt))) {
        if (m.index > last) frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        const sp = document.createElement('span'); sp.className = 'sh-word'; sp.dataset.sh = m[1].toLowerCase(); sp.textContent = m[1];
        frag.appendChild(sp); last = m.index + m[0].length;
      }
      if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  /* ---------- MODE --------------------------------------------- */
  function setMode(m) {
    S.mode = m === 'shades' ? 'shades' : 'dictionary';
    document.body.classList.toggle('sh-mode-shades', S.mode === 'shades');
    if (S.mode !== 'shades') close();
    if (S.toggleEl) S.toggleEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.m === S.mode));
    try { S.opts.onMode && S.opts.onMode(S.mode); } catch (e) {}
  }
  function renderToggle(el) {
    el.innerHTML = '';
    const box = document.createElement('div'); box.className = 'sh-toggle';
    [['dictionary', '📖 Dictionary', 'dict'], ['shades', '🎨 Shades', '']].forEach(([m, label, cls]) => {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.m = m; b.className = cls; b.textContent = label;
      b.setAttribute('translate', 'no'); b.onclick = () => setMode(m); box.appendChild(b);
    });
    el.appendChild(box); S.toggleEl = box;
  }

  /* ---------- PANEL -------------------------------------------- */
  function buildPanel() {
    const p = document.createElement('aside'); p.className = 'sh-panel'; p.setAttribute('translate', 'no');
    p.innerHTML = '<div class="sh-head"><h3></h3><button class="sh-x" aria-label="close">✕</button></div><div class="sh-scale"><span>weaker</span><span>stronger</span></div><div class="sh-list"></div><div class="sh-foot"></div>';
    p.querySelector('.sh-x').onclick = close; document.body.appendChild(p); S.panel = p;
  }
  function open(base) {
    base = String(base || '').toLowerCase(); const d = DATA[base]; if (!d) return false;
    if (!S.panel) buildPanel();
    S.cur = base; S.sel = null;
    document.querySelectorAll('.sh-word.sh-active').forEach(e => e.classList.remove('sh-active'));
    document.querySelectorAll('.sh-word[data-sh="' + base + '"]').forEach(e => e.classList.add('sh-active'));
    S.panel.querySelector('h3').innerHTML = esc(base) + '<small>' + esc(d.pos) + '</small>';
    const list = S.panel.querySelector('.sh-list'); list.innerHTML = '';
    d.shades.slice().sort((a, b) => a.i - b.i).forEach(sh => {
      const row = document.createElement('div'); row.className = 'sh-row' + (sh.w === base ? ' base' : ''); row.dataset.w = sh.w;
      row.innerHTML = '<span class="sh-dot" style="background:' + COLORS[sh.i - 1] + '"></span>' +
        '<span class="sh-w">' + esc(sh.w) + '<span class="sh-tr" hidden></span></span>' +
        '<span class="sh-reg ' + sh.reg + '">' + REGLABEL[sh.reg] + '</span>' +
        '<div class="sh-detail"><div class="m">' + esc(sh.m) + '</div><div class="ex">' + esc(sh.ex).replace(new RegExp('\\b' + sh.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*', 'i'), x => '<b>' + x + '</b>') + '</div>' +
        '<div class="sh-acts"><button class="sh-btn say">🔊 Say it</button><button class="sh-btn tr">🌐 ' + esc(lang()) + '</button>' +
        (sh.w === base ? '' : '<button class="sh-btn use">✍️ Use it</button>') + '</div></div>';
      row.onclick = (ev) => {
        const t = ev.target;
        if (t.classList.contains('say')) { speak(sh.w); return; }
        if (t.classList.contains('tr')) { translate(base, sh, row); return; }
        if (t.classList.contains('use')) { useWord(base, sh); return; }
        select(row, sh);
      };
      list.appendChild(row);
    });
    S.panel.querySelector('.sh-foot').innerHTML = '<span style="color:#6b7280">Tap a word to see it. Tap <b>Use it</b> to put it in your writing.</span>';
    S.panel.classList.add('open'); document.body.classList.add('sh-open');
    // mobile: keep the tapped word visible above the sheet
    return true;
  }
  function close() {
    if (S.panel) S.panel.classList.remove('open');
    document.body.classList.remove('sh-open');
    document.querySelectorAll('.sh-word.sh-active').forEach(e => e.classList.remove('sh-active'));
    S.cur = null; S.sel = null;
  }
  function select(row, sh) {
    S.panel.querySelectorAll('.sh-row.sel').forEach(r => r.classList.remove('sel'));
    row.classList.add('sel'); S.sel = sh; speak(sh.w);
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---------- TRANSLATE (proxy: equiv bold+underlined, grey if none) ---- */
  async function translate(base, sh, row) {
    const L = lang(); const key = sh.w + '|' + L; const out = row.querySelector('.sh-tr'); out.hidden = false;
    if (S.trCache[key]) { out.innerHTML = S.trCache[key]; return; }
    out.textContent = '…';
    let html;
    try {
      const u = S.proxy + '?action=translate&idiom=' + encodeURIComponent(sh.w) + '&meaning=' + encodeURIComponent(sh.m) + '&lang=' + encodeURIComponent(L);
      const r = await fetch(u); const j = await r.json(); const t = (j && j.ok && j.translation) || {};
      html = t.equiv ? esc(t.equiv) + (t.meaning ? ' <span style="font-weight:600;text-decoration:none;color:#374151">— ' + esc(t.meaning) + '</span>' : '')
                     : '<span class="none">' + esc(sh.w) + '</span>' + (t.meaning ? ' <span style="font-weight:600;text-decoration:none;color:#374151">— ' + esc(t.meaning) + '</span>' : '');
    } catch (e) { html = '<span class="none">' + esc(sh.w) + '</span>'; }
    out.className = 'sh-tr' + (html.indexOf('class="none"') === 0 ? ' none' : ''); out.innerHTML = html; S.trCache[key] = html;
  }

  /* ---------- USE IT: replace in target + fit check -------------- */
  function targetText() {
    const t = S.target; if (!t) return '';
    return ('value' in t && t.tagName !== 'DIV') ? t.value : t.textContent;
  }
  function setTargetText(v) {
    const t = S.target; if (!t) return;
    if ('value' in t && t.tagName !== 'DIV') { t.value = v; } else { t.textContent = v; }
    t.dispatchEvent(new Event('input', { bubbles: true }));
    t.classList.remove('sh-flash'); void t.offsetWidth; t.classList.add('sh-flash');
  }
  function useWord(base, sh) {
    const foot = S.panel.querySelector('.sh-foot');
    if (!S.target) { foot.innerHTML = '<span class="v hmm">No writing box on this page.</span> Try: <i>' + esc(sh.ex) + '</i>'; return; }
    const txt = targetText();
    const re = new RegExp('\\b' + base + '\\b', 'i'); const m = re.exec(txt);
    if (!m) {
      foot.innerHTML = '<span class="v hmm">Write a sentence with "' + esc(base) + '" first.</span> Then tap Use it.';
      try { S.target.focus(); } catch (e) {}
      return;
    }
    const old = m[0]; const neu = old[0] === old[0].toUpperCase() && old[0] !== old[0].toLowerCase() ? sh.w[0].toUpperCase() + sh.w.slice(1) : sh.w;
    const before = txt; const after = txt.slice(0, m.index) + neu + txt.slice(m.index + old.length);
    S.lastReplace = { before };
    setTargetText(after);
    // sentence containing the word, for the judge
    const sent = (after.slice(0, m.index).split(/[.!?]\s+/).pop() || '') + after.slice(m.index).split(/(?<=[.!?])\s+/)[0];
    fitCheck(sent.trim(), base, sh);
    try { global.track && typeof global.track.log === 'function' && global.track.log('shades_use', { base, word: sh.w }); } catch (e) {}
  }
  function localJudge(sentence, base, sh) {
    const notes = [];
    if (sh.tip) notes.push(sh.tip);
    if (sh.i >= 5) notes.push('"' + sh.w + '" is very strong — use it only for a big feeling or a big thing.');
    if (sh.reg === 'casual') notes.push('"' + sh.w + '" is casual. Good for talking; in school writing, an everyday or formal word is safer.');
    if (/\bvery\s+\w+/i.test(sentence) && new RegExp('\\bvery\\s+' + sh.w + '\\b', 'i').test(sentence) && sh.i >= 4) notes.push('"very ' + sh.w + '" is too much — "' + sh.w + '" already means "very ' + base + '". Take out "very".');
    const verdict = notes.some(n => /too much|Needs a person|Not before a noun/.test(n)) ? 'hmm' : (sh.reg === 'casual' ? 'hmm' : 'ok');
    const head = verdict === 'ok' ? '✅ Nice choice.' : '🤔 Check this.';
    return { verdict, note: head + ' ' + (notes.join(' ') || '"' + sh.w + '" means: ' + sh.m + '.') };
  }
  async function fitCheck(sentence, base, sh) {
    const foot = S.panel.querySelector('.sh-foot');
    const undo = '<button class="undo" type="button">undo</button>';
    const show = (j) => { foot.innerHTML = '<span class="v ' + j.verdict + '">' + esc(j.note) + '</span>' + undo; foot.querySelector('.undo').onclick = () => { if (S.lastReplace) { setTargetText(S.lastReplace.before); S.lastReplace = null; foot.innerHTML = '<span style="color:#6b7280">Undone.</span>'; } }; };
    show(localJudge(sentence, base, sh));
    if (S.opts.judge) {
      try { const j = await S.opts.judge(sentence, base, sh.w); if (j && j.note) show({ verdict: j.verdict || 'ok', note: j.note }); } catch (e) {}
    }
  }

  /* ---------- EVENTS ------------------------------------------- */
  function onClick(ev) {
    if (S.mode !== 'shades') return;
    const w = ev.target.closest && ev.target.closest('.sh-word'); if (!w) return;
    ev.stopImmediatePropagation(); ev.preventDefault();
    open(w.dataset.sh);
  }

  /* ---------- MOUNT -------------------------------------------- */
  function mount(opts) {
    S.opts = opts || {}; S.root = S.opts.root || document.body; S.target = S.opts.target || null;
    if (S.opts.proxy) S.proxy = S.opts.proxy;
    if (!document.getElementById('sh-css')) { const st = document.createElement('style'); st.id = 'sh-css'; st.textContent = CSS; document.head.appendChild(st); }
    mark(S.root);
    if (S.opts.toggle) renderToggle(S.opts.toggle);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    setMode(S.opts.mode || qs('mode') || 'dictionary');
  }

  global.Shades = { mount, mark, open, close, setMode, getMode: () => S.mode, DATA, setTarget: (el) => { S.target = el; }, words: BASES };
})(window);
