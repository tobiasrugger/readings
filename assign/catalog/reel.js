/* assign/catalog/reel.js — Push-an-activity entries for pages under /readings/reel…
   ONLY the chat that owns /readings/reel/ edits this file (T-215).
   p = path, t = title, d = description, m = card note, g = group, o = order on the Push page (optional).
   T-456 (Nov 17 2026): emptied. The old /readings/reel/ and /readings/reel/ep01/ had the same titles as reel-v2, so the
   gradebook showed two "Story Reel 1" columns and split scores. Push from assign/catalog/reel-v2.js only.
   The reel/ folder stays (old links and old rows still work).
   The frozen assign/catalog.js (loaded first) still lists both old pages, so drop them here, before merge.js runs. */
window.CATALOG = (window.CATALOG || []).filter(function (e) { return !(e && /^\/readings\/reel\//.test(e.p || '')); });
