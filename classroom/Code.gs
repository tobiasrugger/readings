/**
 * Google Classroom → My Page  (T-135, Oct 2026)
 * Runs in Mr. Toby's OWN Google account (script.google.com). Every 15 minutes on school days it reads the
 * posts in the courses you map below, finds every link to https://tobiasrugger.github.io/readings/…,
 * and writes one row per link to Supabase class_assignments — the same kind of row the Push page
 * (https://tobiasrugger.github.io/readings/assign/) writes — so it shows on each student's My Page.
 *
 *   area 'site', period '3' (from COURSE_PERIODS), href '/readings/landlady/', slug 'landlady',
 *   source 'classroom', kind 'classroom', ext_id '<courseId>:<postId>:<slug>', due_at (if the post has a due date),
 *   expires_at = due date + 7 days (or empty), set to now when the post is deleted.
 *
 * Only the LINK is copied. No post text, no student data, nothing from Classroom is shown to students.
 * Re-runs update the same row (ext_id), so nothing duplicates.
 */

// ---------- 1. Fill this in after running testListCourses() ----------
// Copy the lines it prints into here: course id → period number (as text). Leave out courses you don't want.
var COURSE_PERIODS = {
  // '123456789012': '3',   // ELD 103 · Period 3
};

// ---------- settings (no need to change) ----------
var SUPA_URL = 'https://lhmwtfyceilgndpygivj.supabase.co';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobXd0ZnljZWlsZ25kcHlnaXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzk5MDIsImV4cCI6MjA5MTcxNTkwMn0.0uIXyctHMfTN4doWYn2JJ260swD5b-t0T-oDMSIPtBU';
var SITE_HOST = 'tobiasrugger.github.io';
var KEEP_DAYS_AFTER_DUE = 7;
var SCHOOL_HOURS = [6, 18];        // only sync between 6:00 and 18:00, Monday–Friday (project time zone)

// =====================================================================
// STEP 1 — run this first. It shows whether SFUSD lets the script read your Classroom.
// =====================================================================
function testListCourses() {
  var courses = listCourses_();
  if (!courses.length) { Logger.log('No ACTIVE courses where you are the teacher. (If you expected some, the account may be different.)'); return; }
  Logger.log('Your active courses (' + courses.length + '):');
  var lines = [];
  courses.forEach(function (c) {
    var nWork = countAll_(function (tok) { return Classroom.Courses.CourseWork.list(c.id, { pageSize: 100, pageToken: tok }); }, 'courseWork');
    var nMat = countAll_(function (tok) { return Classroom.Courses.CourseWorkMaterials.list(c.id, { pageSize: 100, pageToken: tok }); }, 'courseWorkMaterial');
    var guess = guessPeriod_(c.name + ' ' + (c.section || ''));
    Logger.log('• ' + c.name + (c.section ? ' — ' + c.section : '') + '   id ' + c.id + '   ' + nWork + ' assignments, ' + nMat + ' materials');
    lines.push("  '" + c.id + "': '" + (guess || '?') + "',   // " + c.name + (c.section ? ' · ' + c.section : ''));
  });
  Logger.log('\nPaste these into COURSE_PERIODS at the top (fix any ? to the right period number, delete courses you do not want):\n' + lines.join('\n'));
}

// =====================================================================
// STEP 2 — run once to see what it WOULD write, without writing anything.
// =====================================================================
function previewSync() { sync_(true); }

// STEP 3 — run once for real, then installTrigger() to keep it going every 15 minutes.
function syncNow() { sync_(false); }

function installTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'scheduledSync') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('scheduledSync').timeBased().everyMinutes(15).create();
  Logger.log('Done: scheduledSync will run every 15 minutes (it skips weekends and nights).');
}
function removeTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'scheduledSync') ScriptApp.deleteTrigger(t); });
  Logger.log('Stopped.');
}
function scheduledSync() {
  var now = new Date(), day = now.getDay(), hour = now.getHours();
  if (day === 0 || day === 6 || hour < SCHOOL_HOURS[0] || hour >= SCHOOL_HOURS[1]) return;
  sync_(false);
}

// =====================================================================
function sync_(dry) {
  var ids = Object.keys(COURSE_PERIODS);
  if (!ids.length) { Logger.log('COURSE_PERIODS is empty — run testListCourses() and paste its lines first.'); return; }
  var rows = [], okCourses = [];
  ids.forEach(function (cid) {
    var period = String(COURSE_PERIODS[cid]);
    try {
      var work = listAll_(function (tok) { return Classroom.Courses.CourseWork.list(cid, { pageSize: 100, pageToken: tok, courseWorkStates: ['PUBLISHED'] }); }, 'courseWork');
      var mats = listAll_(function (tok) { return Classroom.Courses.CourseWorkMaterials.list(cid, { pageSize: 100, pageToken: tok, courseWorkMaterialStates: ['PUBLISHED'] }); }, 'courseWorkMaterial');
      work.concat(mats).forEach(function (post) {
        var due = dueOf_(post);
        linksOf_(post).forEach(function (L) {
          rows.push({
            area: 'site', period: period, href: L.href, slug: L.slug, title: L.title || prettySlug_(L.slug), note: null,
            source: 'classroom', kind: 'classroom', ext_id: cid + ':' + post.id + ':' + L.slug,
            due_at: due ? due.toISOString() : null,
            expires_at: due ? new Date(due.getTime() + KEEP_DAYS_AFTER_DUE * 864e5).toISOString() : null
          });
        });
      });
      okCourses.push(period);
    } catch (e) {
      Logger.log('Could not read course ' + cid + ' (period ' + period + '): ' + e);   // its rows are left alone this run
    }
  });
  // one row per ext_id
  var seen = {}; rows = rows.filter(function (r) { if (seen[r.ext_id]) return false; seen[r.ext_id] = 1; return true; });

  // rows already in Supabase from Classroom, for the periods we could read
  var existing = okCourses.length ? sb_('GET', 'class_assignments?source=eq.classroom&period=in.(' + okCourses.map(encodeURIComponent).join(',') + ')&select=id,ext_id,expires_at') || [] : [];
  var byExt = {}; existing.forEach(function (r) { byExt[r.ext_id] = r; });
  var now = new Date();
  // never undo a row the teacher cleared on the Push page (expires_at already in the past)
  rows = rows.filter(function (r) { var ex = byExt[r.ext_id]; return !(ex && ex.expires_at && new Date(ex.expires_at) < now); });
  // posts that disappeared (deleted / unpublished) → expire now
  var gone = existing.filter(function (r) { return !seen[r.ext_id] && (!r.expires_at || new Date(r.expires_at) > now); });

  Logger.log((dry ? '[PREVIEW] ' : '') + rows.length + ' link rows to write; ' + gone.length + ' to expire (post removed).');
  rows.forEach(function (r) { Logger.log('  P' + r.period + '  ' + r.href + (r.due_at ? '  due ' + r.due_at.slice(0, 10) : '') + '  — ' + r.title); });
  if (dry) return;

  for (var i = 0; i < rows.length; i += 200) {
    sb_('POST', 'class_assignments?on_conflict=ext_id', rows.slice(i, i + 200), 'resolution=merge-duplicates,return=minimal');
  }
  gone.forEach(function (r) {
    sb_('PATCH', 'class_assignments?id=eq.' + encodeURIComponent(r.id), { expires_at: now.toISOString() }, 'return=minimal');
  });
  Logger.log('Synced.');
}

// ---------- helpers ----------
function listCourses_() {
  return listAll_(function (tok) { return Classroom.Courses.list({ teacherId: 'me', courseStates: ['ACTIVE'], pageSize: 100, pageToken: tok }); }, 'courses');
}
function listAll_(fetchPage, key) {
  var out = [], tok;
  do { var res = fetchPage(tok) || {}; out = out.concat(res[key] || []); tok = res.nextPageToken; } while (tok);
  return out;
}
function countAll_(fetchPage, key) {
  try { return listAll_(fetchPage, key).length; } catch (e) { return 'ERROR (' + e.message + ')'; }
}
function guessPeriod_(s) {
  var m = String(s).match(/\b(?:p(?:er(?:iod)?)?\.?\s*)([1-7])\b/i) || String(s).match(/\b([1-7])(?:st|nd|rd|th)\b/i);
  return m ? m[1] : '';
}
function dueOf_(post) {
  if (!post.dueDate) return null;
  var d = post.dueDate, t = post.dueTime || {};
  // Classroom gives due dates in UTC
  return new Date(Date.UTC(d.year, d.month - 1, d.day, t.hours || 23, t.minutes || 59));
}
/** every link to the readings site in a post: link attachments, plus any URL typed in the description */
function linksOf_(post) {
  var found = [];
  (post.materials || []).forEach(function (m) { if (m.link && m.link.url) found.push({ url: m.link.url, title: m.link.title || '' }); });
  var text = String(post.description || '');
  var re = /https?:\/\/[^\s)\]>"']+/g, mm;
  while ((mm = re.exec(text))) found.push({ url: mm[0].replace(/[.,;:!?]+$/, ''), title: '' });
  var out = [], seen = {};
  found.forEach(function (f) {
    var m = f.url.match(/^https?:\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?/i);
    if (!m || m[1].toLowerCase() !== SITE_HOST) return;
    var path = m[2] || '/';
    if (path.indexOf('/readings/') !== 0) return;
    if (/dashboard|\/teacher\/|\/assign\/|\/reports\/|\/desk\/|\/dashboards\//i.test(path)) return;   // teacher pages never go to students
    path = path.replace(/index\.html$/, '');
    var slug = path.replace(/^\/readings\//, '').replace(/\.html$/, '').replace(/\/+$/, '');
    if (!slug || slug === 'student') return;
    var href = path + (m[3] || '');
    if (seen[slug]) return; seen[slug] = 1;
    out.push({ href: href, slug: slug, title: cleanTitle_(f.title) });
  });
  return out;
}
function cleanTitle_(t) { return String(t || '').replace(/\s*[·|\-–—]\s*(Mr\.? Toby|Readings).*$/i, '').trim(); }
function prettySlug_(s) { return String(s).split('/').pop().replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }); }
function sb_(method, path, body, prefer) {
  var opt = { method: method, muteHttpExceptions: true, contentType: 'application/json',
              headers: { apikey: SUPA_KEY, Authorization: 'Bearer ' + SUPA_KEY } };
  if (prefer) opt.headers.Prefer = prefer;
  if (body) opt.payload = JSON.stringify(body);
  var res = UrlFetchApp.fetch(SUPA_URL + '/rest/v1/' + path, opt), code = res.getResponseCode();
  if (code >= 300) { Logger.log('Supabase ' + method + ' ' + path.split('?')[0] + ' → ' + code + ': ' + res.getContentText().slice(0, 300)); return null; }
  var txt = res.getContentText(); return txt ? JSON.parse(txt) : [];
}
