# Robot save test (T-170)

A headless robot student for every page that saves to Supabase. Supabase is faked in memory; nothing real is touched.

    pip install playwright && playwright install chromium
    cd <folder that CONTAINS readings/> && python3 -m http.server 8800 &
    python3 readings/robot/robot.py readings/sept11/index.html readings/toolkits/lesson1.html --out results.json -j 6
    python3 readings/robot/robot.py @list-of-pages.txt --out results.json

Each page, three situations:
1. New Chromebook, saved work on the server under the OTHER email spelling. PASS = the work shows up and no save ever leaves it out.
2. Server down at sign-in. PASS = nothing is saved and a visible notice appears.
3. Shared Chromebook after another student. PASS = the next student can sign in as themselves, sees none of the last student's answers, and none are saved under their name.

First a "record" run types a marker into every answer box to learn what the page saves.
Verdicts: PASS, FAIL, no-server-save (never saves to the server), saves-but-robot-text-not-in-save
(tap-only pages: the robot types, the page saves taps), robot-could-not-sign-in.
Proof it works: the unfixed Omelas (git show bf44542:omelas/index.html) fails all three; live Omelas passes all three.
Fix pattern for a failing page: `<script src="/readings/saveguard.js"></script>` at the top of <head>.

## Tap mode (T-183, Oct 28)
    python3 readings/robot/robot.py @pages.txt --out results.json -j 4 --tap
When typed text never reaches a save, the robot taps answer choices instead (first option of each choice group,
plus a lone Check/Next after them) and compares the saved fields ("answer leaves": every saved value that changed,
minus the row's own key columns and timestamps). "Shown" is measured against what the page shows the SAME student
on a fresh Chromebook (counted ✓, right/done classes, "n / m" scores). Test 3: student B taps a different option,
and a save under B that carries half or more of A's answer values is a leak.
Extra verdicts: tap-no-save, tap-saved-nothing-new (taps changed nothing saved — read the code instead),
robot-found-nothing-to-tap.
Running it in this sandbox: bash calls stop at 300 s, so start the http server and the robot in one detached
script (setsid nohup … &) and poll the log. Keep -j at 4 or lower; higher makes it flaky.

## Verdict "inconclusive" and the audit column (T-192, Oct 28)
A test the robot cannot judge is now `pass: null` instead of a fail, and the page's verdict is "inconclusive":
in tap mode, test 1 when the page made no save after the extra tap and nothing countable shows on screen; and
write/* ladders, whose text only shows inside an opened rung (every save there kept the work).
Every run gets its own results file in readings/robot/, and its name is appended to results-index.json
(later files win). The audit grid and https://tobiasrugger.github.io/readings/audit/check.html read it.

## Slow leave (T-467, Nov 17)
    python3 readings/robot/robot.py --slow @pages.txt --out results.json -j 4     # page or page:tap / page:type
The T-455 bug: a page that waits while an earlier save is still on its way loses the last answer if the student
closes the tab during that wait. This test makes Supabase a REAL local HTTP server (own thread, 1.5 s per write,
CORS + OPTIONS) that also serves a test copy of the site with the Supabase and github.io URLs rewritten to itself.
Real clock, no Playwright routes, every other host blocked. The robot signs in, answers two different items less
than 1 s apart (the second once the first save has left, or after 0.9 s), closes the tab at once, waits 5 s, and
checks the saved row holds both answers. Typing pages use markers ROBOSLOW1/2; if typing never saves, it falls back
to tapping. Tap pages: a reference run waits 6 s before closing, the slow run taps the same option texts and
closes at once; every saved value from the reference must be there.
Proof: donow/reel-05 at fa65c11 FAILS (the second answer and the score are lost); live reel-05 PASSES.
Results go in as test "t4" on top of each page's earlier t1–t3 row (results-t467-nov17.json); a t4 fail makes the
page FAIL. Verdicts: PASS, FAIL, inconclusive, robot-could-not-answer (fewer than 2 boxes / nothing to tap).
