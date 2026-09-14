# Maus / Holocaust / Oral Histories — digital unit
Mr. Toby · Galileo Academy of Science and Technology

Deploy to `readings/maus/`. All files are self-contained single-page HTML.

## Set up once, in this order

1. **Supabase SQL editor** → run `schema.sql`.
   Creates `maus_progress`, a plain-column unique index (not an expression
   index — PostgREST upserts fail silently against those), RLS policies, and
   two teacher views.

2. **Supabase → Storage → New bucket**
   - name: `maus-recordings`
   - public: **yes**
   Then add the two storage policies printed in `schema.sql` section 3.
   The anon key cannot create buckets, so this step is manual.

3. **Optional — live translation.** Open any student page, find
   `var TRANSLATE_PROXY='';` near the top of the script block and paste your
   Apps Script proxy URL. Without it the pages still work: a glossary covering
   every unit word in 8 languages is baked in and needs no network.

4. **Deploy.** `index.html` is already the hub, so it can go straight to
   `readings/maus/`. A card has been added to the readings hub.

## Pages

| file | who | what |
|---|---|---|
| `index.html` | students | unit hub |
| `background.html` | students | anticipation guide · how to read a comic · timeline · ten stages |
| `vocab.html` | students | 30 words, 5 auto-checked drills, missed words recycle |
| `reading.html` | students | all 11 chapters, reading roles, text coding, 3 levels |
| `oralhistory.html` | students | 11-stage interview project, in-browser recording |
| `assessment.html` | students | auto-scored matching + the "lucky or smart" paragraph |
| `anthology.html` | everyone | finished stories laid out as a printable class book |
| `dashboard.html` | teacher | password `galileo2026` |

## Teacher dashboard — four tabs

- **Completion** — who has started / turned in each page, chapters done, last seen. CSV export.
- **Check-ins** — students who ticked *"this was heavy for me today"* on an exit
  ticket, with what they wrote. Read this one first.
- **Oral history** — a ten-column stage tracker, plus a banner naming the
  students who opened the project but never chose a person. Those are the ones
  who quietly fall off in March.
- **Read work** — every prose answer, per student, collapsed by name.

## Notes

- Work saves to the device instantly and to Supabase about a second after
  typing stops. A student with no name typed still keeps their work locally.
- Levels save per page, so a student can be Level 1 for reading and Level 3
  for the interview project. Nobody can see which level anyone picked.
- Every page prints clean: controls vanish, all three levels print, textareas
  become ruled lines. `anthology.html` prints one story per page.
- The "I need a minute" button records nothing. It is not telemetry.
- Nothing in these files reproduces Spiegelman's text or art. Questions point
  to page numbers; students use the classroom copies.

## Rebuilding

Source is in the parent folder. `python3 build_reading.py` etc., or all at once:

    for f in build_reading build_background build_vocab build_oral build_rest build_anthology; do
      python3 $f.py
    done
