# Feature-audit tools

These two scripts rebuild the grid at
https://tobiasrugger.github.io/readings/audit/ — they used to live only in one
chat's container and were lost; now they live here so any chat can re-run them.

| File | What it does |
|---|---|
| `audit.py` | Downloads (or reads) the six repos, scans every page, prints the counts, and rewrites `audit/index.html`. |
| `gatecheck.py` | The "At sign-in", "No English only" and "Chrome translate off" columns. Parses the page as a browser would (html5lib) and asks whether the language picker sits inside the sign-in screen. `audit.py` imports it; it also runs on its own for one file. |

**One rule set, two engines.** The live checker
(https://tobiasrugger.github.io/readings/audit/check.html, password galileo2026)
runs the same rules in the browser against the live site. Python and JavaScript
must agree page for page. If you change a rule, change it in `check.html`
(`checkText`, `gateCheck`, `fetchWithScripts`) and here in the same zip, then
re-run the agreement test below.

## How to run

```bash
pip install html5lib --break-system-packages      # once
python3 readings/audit/tools/audit.py --download --write
```

`--download` fetches all six repos from codeload.github.com into `./audit-repos/`
(never api.github.com). `--write` rewrites `audit-repos/readings-main/audit/index.html`;
copy that file into the zip as `readings/audit/index.html`.

Other options: `--repos DIR` (repos already unzipped there, as `readings/` or
`readings-main/`), `--out FILE` (write the grid elsewhere), `--json FILE` (dump
the rows), `--compare OLD.html` (list every cell that changed against an older grid).

The run prints the totals and the list of readings pages still red on
**Loads first** — that list is the T-187 handover tracker.

## Which files count as pages

Every `.html` in the six repos except: anything under `_phases/` (frozen
backups), `readings/audit/` itself, the stray `readings/readings/` folder, `mnt/` and `node_modules/` folders, hub-card
snippets (`*hub-card*`, `*hub_card*`, `*snippet*`), and four stray copies
(`easy-true/vets_index.html`, `eld103/ch3_dashboard.html`, `eld103/ch3_index.html`,
`fables/readings_index.html`).

Each page is read together with the first eight local scripts it loads
(`std.js`, `vets_l10n.js`, `track.js` …), because many features live in a shared
module. `saveguard.js` is the exception: its text is skipped, because its list
of shared table names would otherwise count as a translation toggle and a canary.

## What each column means

**Kind.** *student* pages get every check. Pages with nothing to type or tap are
*hub* (landing pages); dashboards, teacher tools, `gradebook/`, `roadmap/`, `assign/`,
`groups/`, `reports/`, `shelves/`, `studentdata/` and pages titled "teacher" are *teacher*.
The two episode hubs (`reel/index.html`, `reel-v2/index.html`) are *hub*: their inputs belong to the Teacher tab; unit plans are *plan*. Non-student pages
show N/A on the grid.

| Column | ✓ | ~ | ✗ |
|---|---|---|---|
| **Login** | email field + sfusd check + alias table or remembered email | email but no alias/prefill, or no sfusd check | name only, or no sign-in |
| **Languages** | all 13 required (Spanish, Chinese, Arabic, Vietnamese, Russian, Urdu, Tagalog, French, Korean, Hindi, Somali, Nepali, Thai) | has Nepali and Thai, others missing | missing Nepali or Thai, or no picker |
| **At sign-in** | picker is in the sign-in screen (own markup, the shared gate engine, or std.js adding it) | picker exists but after sign-in, or no sign-in screen | no picker |
| **No English only** | the sign-in box's language list has no "English only" choice | — | it offers one (N/A = no picker in the box; At sign-in flags that). Toolbar pickers outside the box, "Instructions: English only" toggles, "Glossary: English only" and the "You chose English only" message don't count. A page that mirrors its toolbar picker into `#gate-lang` counts the toolbar's options. Checked Nov 17, 2026 against a real-browser scan of all 268 readings student pages: same 30 pages. | A mirror that drops "English only" from its copy (`/english only/i.test(o.textContent)`) is fine, and a script line marked `toolbar only` builds the toolbar picker, not the sign-in list (T-461c).
| **Chrome translate off** | student and hub pages: translate="no" on `<html>`, `<meta name="google" content="notranslate">`, or the page loads track.js (T-463/T-468, T-470) | — | Chrome can still translate the page. Only the page's own HTML counts. Teacher pages are N/A (left open on purpose). |
| **Period** | dropdown 1–7 | other range, or a free-text box | none |
| **Protect** | `translate="no"` on content + a directions/mode toggle | one of the two | neither |
| **Tap words** | tap-to-translate through the Apps Script proxy | tap UI on a local dictionary | none |
| **Canary** | browser translation detected and logged silently to `page_translation` | detected but shown to students, or not logged | no detection |
| **Tracker** | loads `track.js` | — | doesn't |
| **Saving** | names the Supabase table(s) it writes | Supabase with no literal table name, or localStorage only | no saving |
| **Loads first** | `saveguard.js` in a `<script src>`, or an inline guard: `GAL_LOADED` (T-166 story pages) or `window.__T168` (T-168 pages) | — | writes to Supabase with neither (N/A when it saves nothing) |
| **Robot** | last `readings/robot/robot.py` run passed tests 1, 2 and 3 | inconclusive (e.g. "tap-saved-nothing-new") | failed — the failing tests are named |

Robot verdicts come from `readings/robot/results-index.json`: every results file
listed there is read in order, later files win. A page never driven shows N/A.
To add a run, drop its results file in `readings/robot/` and add its name to
the index — the grid picks it up on the next `audit.py` run, the live checker
immediately.

## Agreement test (do this after any rule change)

`python3 audit.py --repos DIR --agree` runs `check.html`'s own rule code (`agree.js`,
Node + jsdom: `npm i jsdom`) over the same
files and diffs it against `audit.py`, cell by cell. On Oct 28, 2026 the two
agreed on all 392 pages (and on all 446 on Nov 15), all 11 columns, details included. Reproduced the
pre-rebuild grid exactly from commit 348b7d7: 392 pages, 254 student pages,
readings 177 ok / 64 red on Loads first, robot 25 / 9 / 21 / 199.
