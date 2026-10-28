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
