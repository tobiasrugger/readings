# Résumé Unit — Teacher Plan
Mr. Toby · Galileo Academy · ELD

---

## The design idea

The old unit treated the résumé as a **writing assignment**: teach it, draft it, grade it, done. Students finish with one artifact that is out of date in four months and lost by junior year.

This unit treats the résumé as a **living document**. Three lessons teach it. Then `index.html` stays open for four years and the student keeps adding to it. The Brag Bank is the mechanism — it lets a student record something in 15 seconds while it is fresh, and turn it into a polished line later.

---

## Files

| File | What it is |
|---|---|
| `index.html` | **The living résumé.** Build / Brag Bank / Preview & Print / Check It. This is the page students keep forever. |
| `lesson1.html` | What counts as experience · action verb vocabulary · read two model résumés |
| `lesson2.html` | Which section? · reverse chronological order · one-liner surgery with a live checker |
| `lesson3.html` | Error hunt · peer review · the application email · the 45-second spoken intro |
| `dashboard.html` | Teacher view. Password `galileo2026` |
| `schema.sql` | **Run this in Supabase first.** Two tables, two plain-column unique indexes. |

All five pages share one sign-in (name + school email, stored in `localStorage`), so a student types it once.

---

## Before day 1

1. Open Supabase → SQL Editor → paste and run `schema.sql`.
2. Open `dashboard.html`, enter `galileo2026`, confirm it loads (empty is fine).
3. Deploy: rename the student-facing entry file to `index.html` if it isn't already, push to the readings repo, and confirm the readings hub card works.

---

## 10-day pacing

**Day 1 — Lesson 1, Part A only.**
Do the "what counts" tapping activity as a whole class on the projector first. Read each item aloud. This is the emotional core of the unit: most newcomers arrive believing they have nothing. Let the number at the bottom land. Do not rush to Part B.

**Day 2 — Lesson 1, Parts B and C.**
Vocabulary, then read the two Elias résumés side by side. Partners.

**Day 3 — Lesson 1, Part D.** Reading questions. Turn in.

**Day 4 — Lesson 2, Parts A and B.** Sorting and ordering. Fast, gamelike. Finish early? Start Part C.

**Day 5 — Lesson 2, Part C.** One-liner surgery. Project the live checker and do the first one together so they see the tags flip from red to green.

**Day 6 — Lesson 2, Part D + open `index.html`.** They write four one-liners about their own life, then copy them straight into the résumé builder. First contact with the real page.

**Day 7 — Build day.** Whole period in `index.html`. Circulate. Watch the Check It tab on the dashboard to see who is stuck.

**Day 8 — Lesson 3, Parts A and B.** Error hunt, then trade devices and peer review.

**Day 9 — Revise + Lesson 3 Part C.** Fix what the partner found. Write the application email.

**Day 10 — Lesson 3 Part D + print.** Practice the spoken intro three times with a partner. Print the finished résumé. Everyone leaves with paper in hand.

---

## The part that matters after day 10

Put a recurring reminder in your calendar for **early October, early February, and early May**.

Give students 10 minutes. One instruction: *"Open your résumé. What have you done since last time?"*

The dashboard's **"Not updated 60+ days"** counter tells you who to chase. The **Check-ins** column shows who is actually maintaining it. A senior who has checked in eight times has a résumé nobody else in the building has.

---

## Grading

The dashboard exports CSV with strength score, entry count, line count, verb variety, check-ins, and per-lesson scores.

Suggested weight:
- Lessons 1–3 turned in — 40%
- Résumé strength score 10/12 or better — 40%
- Peer review completed for a partner — 10%
- Spoken intro delivered — 10%

The strength score is intentionally not a grade on content quality. It checks mechanics only — verbs, dates, brackets, length. Judgment about whether a line is *good* stays with you and the peer reviewer.

---

## Differentiation

Every lesson has Easier / Standard / Challenge toggles that change the explanation text, not the task. A low-beginner and a level 3 student do the same activity and produce the same artifact; only the framing changes depth.

For true newcomers: the Brag Bank accepts home-language input. Let them write notes in Spanish or Chinese and translate later during a build day. Getting it recorded matters more than getting it in English.

---

## Notes

- Print CSS on `index.html` prints **only** the résumé page — no header, no tabs, no editor. Cmd-P → Save as PDF is the export path.
- "Copy as plain text" exists because many online applications have a paste-only résumé box.
- Student emails are lowercased in JS before every write, because the unique indexes are on plain columns.
