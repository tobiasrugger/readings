# Group Practice decks

A deck is one file here (`<slug>.js`, added to `list.js`) or a row in the `group_decks` table made with `group/maker.html`.
Play one: `/readings/group/?deck=<slug>` · Mix several: `/readings/group/?deck=a,b,c` (played in that order, one Turn in at the end).

```js
GP_DECKS["my-deck"] = {
  slug, title, short, course: '101',
  pics: ['data:image/jpeg;base64,…'],           // slide.img = index into this
  art:  { key: '<svg viewBox="0 0 200 160">…' },  // slide.art = a key here or a built-in drawing
  store: { table, match, conflict },              // optional; default = group_work, one row per (email, deck)
  slides: [ … ]
}
```

Every slide: `id` (never reuse or renumber), `kind`, `part` (chip label), `dir` (a built-in direction key or `{en, 'zh-CN', es, th, vi, ne, ar}`).

| kind | fields | what happens |
|---|---|---|
| intro | body, art/img, repeatTip | Play reads the directions + body |
| word | ans, say, art | Play says the word; Check shows it big + the drawing; group taps 👍 / ✏️ |
| sent | ans, say, art | same, capital underlined, "capital + period" note |
| cap | ans (one letter) | "capital kay"; capital-vs-small contrast picture |
| letters | ans, spell, note, art | spells letter by letter (slower on 🔁) |
| pic | img or art, n, models[], credit | "Describe picture one"; Check shows model sentences |
| ask | q, models[], art | Play reads the question; Check shows good answers |
| mc | q, choices[] (FIRST = right), hint, why, art | shuffled per student and stored; a wrong choice fades + hint, two misses cross out one more wrong one; never revealed |
| circle | sentence, target ('period' / 'cap' / any text) | red circle draws on Check |
| aloud | words[], need, wordArt{} | take turns spelling out loud; done after `need` words |
| end | dir, art | unfinished list + Turn in |

Built-in direction keys: intro, word, sent, p2, pic, p3, cap, letters, circP, circC, aloud, ask, mc, qintro, end (quiz tomorrow), done.
