# Google Classroom → My Page (T-135)

When you post an assignment or material in Google Classroom that links to a page on
https://tobiasrugger.github.io/readings/…, this script copies **just the link** to every student's
My Page (https://tobiasrugger.github.io/readings/student/) in that class's period — the same way
the Push page (https://tobiasrugger.github.io/readings/assign/, password galileo2026) does.
On My Page it looks like any push ("⭐ Most important"), with a small green **from Classroom · due …** tag,
soonest due date first. No post text, no student data, nothing else is copied.

It runs inside **your own Google account**. Nothing here can see your password.

## Setup (about 10 minutes, once)

**0. Run the SQL** (Supabase → SQL Editor → paste → Run). It is in the T-135 message.

**1. New project.** Go to https://script.google.com → **New project**. Name it "Classroom → My Page".

**2. Turn on Classroom.** In the left bar click **Services ＋** → choose **Google Classroom API** → **Add**.
(Keep the identifier `Classroom`.)

**3. Time zone.** ⚙ **Project Settings** → Time zone **(GMT-08:00) Pacific Time – Los Angeles**.

**4. Paste the code.** Open **Code.gs**, delete what's there, paste everything from `Code.gs` in this folder, **Save** (💾).

**5. Test whether SFUSD allows it.** In the function menu at the top choose **testListCourses** → **Run**.
- Google asks you to **authorize**: choose your SFUSD account → *Advanced* → *Go to Classroom → My Page* → **Allow**.
- Open **Execution log**. You should see each of your classes with its id and how many posts it has,
  and below that a block of lines like `'123456789': '3',   // ELD 103 · Period 3`.
- **If you see an error instead** ("not allowed", "access denied", "disabled for your domain"), SFUSD blocks
  scripts from reading Classroom. Stop here and send me the error — nothing has been written anywhere.

**6. Map classes to periods.** Copy the printed lines into `COURSE_PERIODS` at the top of the code.
Fix any `?` to the right period number and delete any class you don't want. **Save**.

**7. Preview.** Run **previewSync**. The log lists every link it found per period — nothing is written yet.

**8. Go live.** Run **syncNow** once, then **installTrigger** once. From now on it checks every
15 minutes, Monday–Friday, 6 am–6 pm.

## What happens when…
- **You edit a post** → the next run updates the same row (no duplicates).
- **You delete or unpublish a post** → its rows disappear from My Page on the next run.
- **The due date passes** → it stays 7 more days, then disappears.
- **You press Clear on the Push page** → it stays cleared; the script won't bring it back.
- **A link goes to a teacher page** (dashboards, Desk, reports) → it is skipped.

To stop it: run **removeTrigger**.
