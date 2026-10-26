#!/usr/bin/env python3
"""scan.py — rebuilds readings/atlas/scan.js from the live repo.

Claude runs this (never Toby). From the folder that holds the repo checkout:
    python3 readings/atlas/scan.py <path-to-repo-root> <path-to-write-scan.js> [YYYY-MM-DD, Toby's date]
e.g. python3 readings-main/atlas/scan.py readings-main readings-main/atlas/scan.js

It reads every .html page plus the local scripts each page loads, and records,
per page, the layers the Atlas shows: sign-in, language picker, pictures,
listening, tap-to-translate, Supabase tables, autosave, score, gradebook,
My Page, teacher dashboard, hub card, assign catalog. Nothing here is typed by
hand — the hand-written part of the Atlas is book.js.
"""
import os, re, sys, json, datetime

ROOT = sys.argv[1] if len(sys.argv) > 1 else 'readings-main'
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'atlas', 'scan.js')

TEACHER_PATH = re.compile(r'dashboard|teacher|gradebook|roadmap|(^|/)assign/|(^|/)reports/|(^|/)audit/|admin|maker|/print/|check\.html|report\.html|(^|/)atlas/', re.I)
SKIP_DIRS = {'_phases', 'node_modules', '.git', 'mnt'}
SHARED = {'track.js', 'std.js', 'grade04.js'}
REGISTRIES = {'assign/catalog.js', 'dashboards/list.js', 'atlas/book.js', 'atlas/scan.js'}  # lists of other pages: read as engines they would fake every layer

def read(p):
    try:
        with open(p, encoding='utf-8', errors='ignore') as f: return f.read()
    except Exception: return ''

def js_list(path, var):
    """pull simple {url:'..'} / {"p": ".."} values from a registry js file"""
    s = read(path)
    return s

# ---- registries ----
dash_src = read(os.path.join(ROOT, 'dashboards', 'list.js'))
DASH = re.findall(r"\{url:'([^']+)',\s*name:'((?:[^'\\]|\\.)*)'", dash_src)
cat_src = read(os.path.join(ROOT, 'assign', 'catalog.js'))
CATALOG = set(re.findall(r'"p":\s*"([^"]+)"', cat_src))
hub_src = read(os.path.join(ROOT, 'index.html'))
HUB = set(re.findall(r'href="(?:/readings/|\./)?([^"#?:]+)"', hub_src))
say_src = read(os.path.join(ROOT, 'say', 'sets.js'))

def norm_hub(h):
    h = h.lstrip('/')
    if h.startswith('readings/'): h = h[9:]
    return h

HUBN = set(norm_hub(h) for h in HUB)

def page_url(rel):
    """repo-relative file path -> /readings/ url as students type it"""
    if rel.endswith('/index.html') or rel == 'index.html':
        return '/readings/' + rel[:-len('index.html')]
    return '/readings/' + rel

def local_scripts(rel, html):
    out = []
    base = os.path.dirname(rel)
    for src in re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html, re.I):
        if src.startswith('http') or src.startswith('//'): continue
        s = src.split('?')[0]
        if s.startswith('/readings/'): p = s[len('/readings/'):]
        elif s.startswith('/'): continue
        else: p = os.path.normpath(os.path.join(base, s))
        if os.path.basename(p) in SHARED: continue
        if os.path.isfile(os.path.join(ROOT, p)): out.append(p)
    return out

TBL_PATS = [r'rest/v1/([a-z][a-z0-9_]+)', r'\.from\(\s*[\'"]([a-z][a-z0-9_]+)[\'"]',
            r'\b[A-Za-z_]*(?:TABLE|TBL|[tT]able)\s*[:=]\s*[\'"]([a-z][a-z0-9_]+)[\'"]',
            r'sb(?:Get|Post|Upsert|Fetch)?\(\s*[\'"]([a-z][a-z0-9_]+)[?\'"]']
SHARED_TABLES = {'students', 'student_aliases', 'instruction_reveals', 'page_translation', 'song_tr', 'page_flags'}
MYPAGE_TABLES = {'landlady_responses', 'telltale_responses', 'monkeyspaw_responses', 'brothers_responses', 'omelas_responses', 'write_work', 'vocab_work'}
NOT_TABLES = {'rpc', 'none', 'true', 'false', 'null', 'table', 'html', 'body', 'cell', 'grid', 'list', 'flex', 'block', 'inline', 'auto', 'fixed', 'collapse', 'separate', 'center', 'left', 'right', 'hidden', 'scroll', 'select', 'v1', 'email', 'id', 'auth', 'storage', 'json', 'text', 'name', 'period', 'object'}

def scan_page(rel):
    html = read(os.path.join(ROOT, rel))
    scripts = local_scripts(rel, html)
    blob = html + '\n'.join(read(os.path.join(ROOT, s)) for s in scripts if s not in REGISTRIES)
    low = blob.lower()
    t = re.search(r'<title>(.*?)</title>', html, re.I | re.S)
    title = re.sub(r'\s+', ' ', t.group(1)).strip() if t else rel
    url = page_url(rel)
    path_no = url[len('/readings/'):]
    has_track = bool(re.search(r'<script[^>]+src=["\'][^"\']*track\.js', html, re.I))
    pw = 'type="password"' in low or "type='password'" in low or 'type=password' in low
    email = bool(re.search(r'type=["\']?email|sfusd\.edu|placeholder=["\'][^"\']*email', blob, re.I))
    role = 'student'
    name = os.path.basename(rel).lower()
    if re.search(r'hub[-_]card|snippet', name): role = 'snippet'
    elif re.search(r'plan|teacher-guide|unitplan', name): role = 'plan'
    elif TEACHER_PATH.search(path_no) or (pw and not email): role = 'teacher'
    no_listen = 'data-no-listen' in html[:3000] or 'GAL_NO_LISTEN' in blob
    own_tr = ('script.google.com/macros' in blob and 'translate' in low) or 'id="wtip"' in low or "'wtip'" in low or 'speak-core.js' in html
    own_listen = 'speechsynthesis' in low or 'speak-core' in low or 'new audio(' in low or '<audio' in low
    svg = len(re.findall(r'<svg', blob, re.I))
    img = len(re.findall(r'<img\b', blob, re.I))
    art = [s for s in scripts if re.search(r'art|cast|pics|picture', s, re.I)]
    tables = set()
    for pat in TBL_PATS:
        for m in re.findall(pat, blob): tables.add(m)
    tables = sorted(x for x in tables if x not in NOT_TABLES and len(x) > 3)
    autosave = bool(re.search(r'setInterval\([\s\S]{0,260}?(20000|20e3|20\s*\*\s*1000|20_000)', blob)) or 'autosave' in low or 'auto-save' in low
    score = 2 if ('GAL_SCORE' in blob or 'max_score' in blob) else (1 if has_track else 0)
    turn_in = bool(re.search(r'turned_?in|turnedIn|submitted|Turn in', blob))
    my_page = 2 if any(t in tables for t in MYPAGE_TABLES) else (1 if (has_track and turn_in) else 0)
    lang_sel = bool(re.search(r'<select[\s\S]{0,1500}?(español|spanish|value=["\']es["\'])', blob, re.I)) or 'vocab_lang' in blob
    # dashboard: longest list.js url whose folder contains this page
    folder = os.path.dirname(path_no) + '/' if os.path.dirname(path_no) else ''
    dash = None
    for u, n in DASH:
        uf = u if u.endswith('/') else os.path.dirname(u) + '/'
        if uf == '/': uf = ''
        if folder.startswith(uf) and uf and (dash is None or len(uf) > len(dash[2])):
            dash = (u, n, uf)
    in_dash_list = any(path_no == u or path_no == u.rstrip('/') + '/' for u, n in DASH)
    hub = path_no in HUBN or path_no.rstrip('/') in HUBN or (path_no + 'index.html') in HUBN
    d = {
        't': title, 'r': role, 'kb': round(os.path.getsize(os.path.join(ROOT, rel)) / 1024),
        'tr': 1 if has_track else 0,
        'si': 1 if email else 0,
        'ls': 2 if lang_sel else (1 if (email and has_track) else 0),
        'pic': [svg, img, art],
        'li': 2 if own_listen else (1 if (has_track and role == 'student' and not no_listen) else 0),
        'tt': 2 if own_tr else (1 if (has_track and role == 'student' and not no_listen) else 0),
        'db': [x for x in tables if x not in SHARED_TABLES], 'dbs': [x for x in tables if x in SHARED_TABLES], 'as': 1 if autosave else 0, 'sc': score if has_track else 0, 'mp': my_page,
        'ds': dash[0] if dash else None, 'dl': 1 if in_dash_list else 0,
        'hub': 1 if hub else 0, 'cat': 1 if url in CATALOG else 0,
        'js': scripts,
    }
    return url, d

pages = {}
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [x for x in dn if x not in SKIP_DIRS and not x.startswith('.')]
    for f in fn:
        if not f.endswith('.html'): continue
        rel = os.path.relpath(os.path.join(dp, f), ROOT).replace(os.sep, '/')
        url, d = scan_page(rel)
        pages[url] = d

out = ('/* scan.js — GENERATED by atlas/scan.py from the live repo. Do not edit by hand;\n'
       '   re-run the scanner instead. Keys: t title, r role (student/teacher/plan/snippet),\n'
       '   kb size, tr track.js, si sign-in, ls language picker (2 own, 1 added by std.js),\n'
       '   pic [svg count, img count, art files], li listening (2 own, 1 sitewide std.js),\n'
       '   tt tap-to-translate (2 own, 1 sitewide std.js), db Supabase tables, as autosave,\n'
       '   sc gradebook score (2 exact: GAL_SCORE or max_score saved, 1 track.js reads it off the page), mp My Page (2 live progress, 1 after Turn in), dbs shared tables, ds its teacher dashboard, dl is itself in dashboards/list.js,\n'
       '   hub card on readings/index.html, cat in assign/catalog.js, js local engine files. */\n'
       'window.ATLAS_SCAN = ' + json.dumps({'built': (sys.argv[3] if len(sys.argv) > 3 else datetime.date.today().isoformat()), 'pages': pages},
                                          ensure_ascii=False, separators=(',', ':')) + ';\n')
with open(OUT, 'w', encoding='utf-8') as f: f.write(out)
print(len(pages), 'pages ->', OUT, round(len(out) / 1024), 'KB')
