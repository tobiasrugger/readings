#!/usr/bin/env python3
"""
audit.py — rebuilds the feature-audit grid (readings/audit/index.html).

It scans every page in the six repos with the SAME rules the live checker
uses (readings/audit/check.html, checkText()).  The two must agree page for
page; if a rule changes, change it in check.html and here together.
The "At sign-in" column lives in gatecheck.py (DOM-based).

Typical run (downloads the six repos by codeload, scans, rewrites the grid):

    python3 audit.py --download --write

Other options:
    --repos DIR     folder holding the six repos (readings/ or readings-main/ …)
                    instead of --download
    --write         rewrite <readings>/audit/index.html in place (data + date)
    --out FILE      write the regenerated grid somewhere else
    --json FILE     also dump the rows as JSON (same shape as the grid data)
    --compare FILE  compare against an existing grid's data, page by page
    --agree         run check.html's own JS rules (agree.js, Node + jsdom) on
                    the same files and report every cell where they differ

Needs: Python 3.8+, html5lib (pip install html5lib --break-system-packages).
Never uses api.github.com (shared rate limit) — only codeload.github.com.
"""
import argparse
import datetime
import io
import json
import os
import re
import sys
import urllib.request
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gatecheck import gate_check  # noqa: E402

REPOS = ['readings', 'comicdialogue', 'eld1assessment', 'eldadventure', 'galileohub', 'languagelaunch']
COLS = ['login', 'lang', 'gate', 'period', 'trans', 'tap', 'canary', 'track', 'supa', 'save', 'robot']

# ── which .html files are pages ────────────────────────────────────────────
# _phases/ are frozen backups of live pages; audit/ is this tool; the rest
# are hub-card snippets and stray copies that were never meant to be opened.
SKIP_DIRS = {'_phases', '.git', 'node_modules', '__pycache__', 'mnt'}
SKIP_TOP = {'audit', 'readings'}         # readings/audit/ itself; readings/readings/ = stray upload (C-40)
SKIP_NAME = re.compile(r'hub[-_]card|snippet', re.I)
SKIP_FILES = {                           # readings-relative leftovers
    'easy-true/vets_index.html', 'eld103/ch3_dashboard.html',
    'eld103/ch3_index.html', 'fables/readings_index.html',
}

# ── rules, ported line for line from check.html ───────────────────────────
LANG_NAMES = {'es': 'Spanish', 'zh-CN': 'Chinese', 'zh-TW': 'Chinese', 'yue': 'Chinese', 'zh': 'Chinese',
              'ar': 'Arabic', 'ary': 'Darija', 'ar-MA': 'Darija', 'vi': 'Vietnamese', 'ru': 'Russian', 'ur': 'Urdu',
              'tl': 'Tagalog', 'fil': 'Tagalog', 'fr': 'French', 'ko': 'Korean', 'hi': 'Hindi', 'so': 'Somali',
              'ne': 'Nepali', 'th': 'Thai', 'pt': 'Portuguese', 'ja': 'Japanese', 'mn': 'Mongolian', 'sm': 'Samoan',
              'my': 'Burmese', 'fa': 'Persian', 'ps': 'Pashto', 'km': 'Khmer', 'ti': 'Tigrinya', 'am': 'Amharic'}
NAME_TO_CODE = {'spanish': 'es', 'chinese': 'zh-CN', 'mandarin': 'zh-CN', 'cantonese': 'zh-TW', 'arabic': 'ar',
                'darija': 'ary', 'vietnamese': 'vi', 'russian': 'ru', 'urdu': 'ur', 'tagalog': 'tl',
                'filipino': 'tl', 'french': 'fr', 'korean': 'ko', 'hindi': 'hi', 'somali': 'so', 'nepali': 'ne',
                'thai': 'th'}
CORE = ['es', 'zh-CN', 'ar', 'vi', 'ru', 'ur', 'tl', 'fr', 'ko', 'hi', 'so', 'ne', 'th']

# JS \d is ASCII-only, so [0-9] everywhere below.
RE_LANG_CODE = re.compile(r'(?:value\s*=\s*|\[\s*)["\']([a-zA-Z]{2}(?:-[A-Za-z]{2,4})?)["\']')
RE_LANG_NAME = re.compile(r'<option value="([^"]{3,30})"|\[\s*[\'"]([A-Z][a-z]+(?: \([A-Za-z]+\))?)[\'"]\s*,')


def langs_in(t):
    found = []
    for m in RE_LANG_CODE.finditer(t):
        c = m.group(1)
        key = c if c in LANG_NAMES else (c.lower() if c.lower() in LANG_NAMES else None)
        if key and key not in found:
            found.append(key)
    by_name = []
    for m in RE_LANG_NAME.finditer(t):
        v = (m.group(1) or m.group(2) or '').strip().lower().split('(')[0].strip()
        c2 = NAME_TO_CODE.get(v)
        if c2 and c2 not in by_name:
            by_name.append(c2)
    if len(found) < 3:
        return by_name if len(by_name) >= 3 else []
    return found if len(found) >= len(by_name) else by_name


RE_SELECT = re.compile(r'<select([^>]*)>([\s\S]*?)</select>', re.I)
RE_PERIOD_WORD = re.compile(r'>\s*Period', re.I)
RE_SELECT_PER_ID = re.compile(r'<select[^>]*id\s*=\s*["\'][^"\']*[Pp]er[^"\']*["\']')
RE_PERIOD_ARRAY = re.compile(r"\[\s*(?:'[0-9]'\s*,\s*){3,}'[0-9]'\s*\]")
RE_PER_ID = re.compile(r'id\s*=\s*["\'][^"\']*per[^"\']*["\']', re.I)
RE_INPUT_PER = re.compile(r'<input[^>]*per', re.I)
RE_INPUT = re.compile(r'<input', re.I)
RE_NUM_A = re.compile(r'value\s*=\s*["\']([0-9])["\']')
RE_NUM_B = re.compile(r'<option[^>]*>\s*(?:Period\s*)?([0-9])\s*<', re.I)
RE_NUM_C = re.compile(r"'([0-9])'")


def numbers_in(s):
    out = set()
    for rx in (RE_NUM_A, RE_NUM_B, RE_NUM_C):
        out.update(m.group(1) for m in rx.finditer(s))
    return sorted(int(x) for x in out)


def period_info(t):
    for m in RE_SELECT.finditer(t):
        head, body = (m.group(1) or '').lower(), m.group(2)
        if 'per' in head or RE_PERIOD_WORD.search(body):
            nums = numbers_in(body)
            if nums:
                return 'select', nums
    if RE_SELECT_PER_ID.search(t):
        arr = RE_PERIOD_ARRAY.search(t)
        if arr:
            return 'select', numbers_in(arr.group(0))
    if RE_PER_ID.search(t) and RE_INPUT_PER.search(t):
        return 'input', []
    if 'Period' in t and RE_INPUT.search(t):
        return 'input', []
    return 'none', []


RE_PW_INPUT = re.compile(r'<input[^>]*type\s*=\s*["\']password["\'][^>]*>', re.I)
RE_SEARCH_INPUT = re.compile(r'<input[^>]*(aria-label\s*=\s*["\'][^"\']*search|placeholder\s*=\s*["\'][^"\']*(find|search))[^>]*>', re.I)
RE_INTERACTIVE = re.compile(r'<textarea|<input|class="choice|data-q=|data-k=|data-ans=', re.I)
RE_TOOLNAME = re.compile(r'positioner|builder|editor|importer|admin')
RE_TITLE = re.compile(r'<title>([^<]{0,120})</title>', re.I)
RE_TEACHER_WORD = re.compile(r'\bteacher\b', re.I)
RE_PLAN = re.compile(r'unit[-_ ]?plan|plans?\.html$')


def kind_of(path, t):
    low = path.lower()
    name = low.split('/')[-1]
    body0 = RE_SEARCH_INPUT.sub('', RE_PW_INPUT.sub('', t))
    if not RE_INTERACTIVE.search(body0):
        return 'hub'
    if low in ('reel/index.html', 'reel-v2/index.html'):
        return 'hub'                     # episode hubs: inputs are the Teacher tab's
    if 'dashboard' in low or 'teacher' in low:
        return 'teacher'
    if RE_TOOLNAME.search(name):
        return 'teacher'
    if name in ('gradebook.html', 'assign.html', 'wall.html', 'report.html'):
        return 'teacher'
    if low.split('/')[0] in ('gradebook', 'roadmap', 'assign', 'groups', 'reports', 'shelves', 'studentdata'):
        return 'teacher'
    m = RE_TITLE.search(t)
    if RE_TEACHER_WORD.search(m.group(1) if m else ''):
        return 'teacher'
    if RE_PLAN.search(name):
        return 'plan'
    return 'student'


RE_EMAIL = re.compile(r'type\s*=\s*["\']email["\']|id\s*=\s*["\'][^"\']*mail[^"\']*["\']', re.I)
RE_SFUSD = re.compile(r'sfusd', re.I)
RE_NAME_ONLY = re.compile(r'id\s*=\s*["\'](gname|sname|nameIn|stuName)["\']', re.I)
RE_TNO = re.compile(r'translate\s*=\s*["\']no["\']')
RE_TOGGLE = re.compile(r'(three|3)[-_ ]?way|mode\s*toggle|Directions only|directions-only', re.I)
RE_TAP = re.compile(r'toggleWT|Tap words|tap-to-translate|wt-tap|tapdoc|wt-on|tapWord|data-w=', re.I)
RE_CANARY = re.compile(r'canary|browserTranslated|detectTranslation|checkTranslation', re.I)
RE_BANNER = re.compile(r'(xlbanner|translation-banner|xl-banner)[^;\n]{0,80}classList\.add\(["\']show|banner\.classList\.add\(["\']show', re.I)
RE_TRACK = re.compile(r'src\s*=\s*["\'][^"\']*track\.js["\']', re.I)
RE_REST = re.compile(r'/rest/v1/([a-zA-Z0-9_]+)')
RE_TABLE = re.compile(r'\b(?:TABLE|TBL|TABLE_NAME)\s*=\s*["\']([a-zA-Z0-9_]+)["\']')
RE_GUARD = re.compile(r'src\s*=\s*["\'][^"\']*saveguard\.js["\']', re.I)
SECOND = {'students', 'student_aliases', 'vocab_words', 'idioms', 'song_lyrics'}


def check_text(path, t, robot):
    r = {'path': path}
    r['kind'] = kind_of(path, t)

    has_email = bool(RE_EMAIL.search(t))
    sfusd = bool(RE_SFUSD.search(t))
    alias = 'student_aliases' in t
    prefill = 'gal_student_email' in t
    name_only = bool(RE_NAME_ONLY.search(t))
    if has_email and sfusd and (alias or prefill):
        r['login'] = ['ok', 'email + sfusd check' + (' + alias' if alias else '') + (' + prefill' if prefill else '')]
    elif has_email and sfusd:
        r['login'] = ['warn', 'sfusd check, no alias/prefill']
    elif has_email:
        r['login'] = ['warn', 'email field, no sfusd validation']
    elif name_only:
        r['login'] = ['bad', 'name only']
    else:
        r['login'] = ['bad', 'no sign-in']

    L = langs_in(t)
    r['langs'] = L
    missing = [c for c in CORE if c not in L and not (c == 'zh-CN' and ('zh' in L or 'zh-TW' in L or 'yue' in L))]
    r['missing'] = [LANG_NAMES[c] for c in missing] if L else []
    if L:
        if not missing and 'ne' in L and 'th' in L:
            r['lang'] = ['ok', 'all 13 \u00b7 %d in list' % len(L)]
        elif 'ne' in L and 'th' in L:
            r['lang'] = ['warn', '%d langs \u00b7 no %s' % (len(L), ', '.join(LANG_NAMES[c] for c in missing[:3]))]
        else:
            r['lang'] = ['bad', '%d langs, missing %s' % (len(L), '+'.join(LANG_NAMES[c] for c in ('ne', 'th') if c not in L))]
    else:
        r['lang'] = ['bad', 'no language picker']

    r['gate'] = gate_check(t)

    ptype, nums = period_info(t)
    if ptype == 'select' and nums == [1, 2, 3, 4, 5, 6, 7]:
        r['period'] = ['ok', '1-7']
    elif ptype == 'select' and nums:
        r['period'] = ['warn', '%d-%d \u00b7 standard is 1-7' % (nums[0], nums[-1])]
    elif ptype == 'input':
        r['period'] = ['warn', 'free-text input']
    else:
        r['period'] = ['bad', 'none']

    tno = len(RE_TNO.findall(t))
    proxy = 'script.google.com/macros' in t
    reveals = 'instruction_reveals' in t
    toggle = reveals or bool(RE_TOGGLE.search(t))
    if tno and toggle:
        r['trans'] = ['ok', '%d protected + mode toggle' % tno]
    elif tno:
        r['trans'] = ['warn', '%d translate="no", no toggle' % tno]
    elif proxy:
        r['trans'] = ['warn', 'translates, no protection']
    else:
        r['trans'] = ['bad', 'none']

    tap = bool(RE_TAP.search(t))
    if tap and proxy:
        r['tap'] = ['ok', 'tap words on']
    elif tap:
        r['tap'] = ['warn', 'tap UI, local dictionary only']
    else:
        r['tap'] = ['bad', 'none']

    canary = bool(RE_CANARY.search(t))
    logs = 'page_translation' in t
    banner = bool(RE_BANNER.search(t))
    if canary and logs and not banner:
        r['canary'] = ['ok', 'silent logging']
    elif canary and banner:
        r['canary'] = ['warn', 'student-visible banner' + (' (ELD 103 trial)' if 'eld103' in path else '')]
    elif canary:
        r['canary'] = ['warn', 'detects, no page_translation row']
    else:
        r['canary'] = ['bad', 'no detection']

    r['track'] = ['ok', 'tracker on'] if RE_TRACK.search(t) else ['bad', 'no tracker']

    tables = []                                  # insertion order, like a JS object
    for rx in (RE_REST, RE_TABLE):
        for m in rx.finditer(t):
            if m.group(1) not in tables:
                tables.append(m.group(1))
    main = [n for n in tables if n not in SECOND] or tables
    if main:
        r['supa'] = ['ok', ', '.join(main[:3])]
    elif 'supabase.co' in t:
        r['supa'] = ['warn', 'supabase, table name not literal']
    elif 'localStorage' in t:
        r['supa'] = ['warn', 'localStorage only']
    else:
        r['supa'] = ['bad', 'no saving']

    guarded = bool(RE_GUARD.search(t))
    inline = 'GAL_LOADED' in t or '__T168' in t       # T-166 / T-168 inline guards
    writes = 'supabase.co' in t or '/rest/v1/' in t
    if guarded:
        r['save'] = ['ok', 'saveguard.js']
    elif inline:
        r['save'] = ['ok', 'loads before it saves']
    elif writes:
        r['save'] = ['bad', 'saves with no guard']
    else:
        r['save'] = ['na', 'nothing to save']

    rb = robot.get(path)
    if not rb:
        r['robot'] = ['na', 'not tested yet']
    else:
        v = rb.get('verdict') or ''
        bad = [k for k in ('t1', 't2', 't3') if isinstance(rb.get(k), dict) and rb[k].get('pass') is False]
        if v == 'PASS':
            r['robot'] = ['ok', 'passed 1, 2 and 3']
        elif v == 'FAIL':
            r['robot'] = ['bad', 'fails ' + ', '.join(bad) if bad else 'failed']
        else:
            r['robot'] = ['warn', str(v)]

    if r['kind'] != 'student':
        for c in ('track', 'gate', 'save', 'robot'):
            r[c] = ['na', 'n/a']
    return r


# ── reading pages the way the browser fetches them ─────────────────────────
RE_SCRIPT_SRC = re.compile(r'<script[^>]+src=["\']([^"\':]+\.js)["\']', re.I)


def read(p):
    try:
        with open(p, encoding='utf-8', errors='replace', newline='') as f:
            return f.read()
    except OSError:
        return None


def with_scripts(text, page_file, repo_dirs):
    """check.html's fetchWithScripts(): append the first 8 local scripts the
    page loads (std.js, saveguard.js, vets_l10n.js …), so features that live
    in a shared module count for the page."""
    srcs = RE_SCRIPT_SRC.findall(text)
    if not srcs:
        return text
    parts = []
    for s in srcs[:8]:
        if re.search(r'(^|/)saveguard\.js$', s):
            parts.append('')        # its table list would fake Protect/Canary
            continue
        if s.startswith('/'):
            bits = s.lstrip('/').split('/', 1)
            base = repo_dirs.get(bits[0])
            target = os.path.join(base, bits[1]) if base and len(bits) > 1 else None
        else:
            target = os.path.normpath(os.path.join(os.path.dirname(page_file), s))
        parts.append((read(target) if target else None) or '')
    return text + '\n/* included */\n' + '\n'.join(parts)


def pages_in(repo, root):
    found = []
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        rel_dir = os.path.relpath(dp, root).replace(os.sep, '/')
        rel_dir = '' if rel_dir == '.' else rel_dir
        if repo == 'readings' and rel_dir.split('/')[0] in SKIP_TOP:
            continue
        for f in fn:
            if not f.endswith('.html') or SKIP_NAME.search(f):
                continue
            rel = (rel_dir + '/' if rel_dir else '') + f
            if repo == 'readings' and rel in SKIP_FILES:
                continue
            found.append((rel_dir, f, rel))
    # grid order: by folder, index.html first, then the rest alphabetically
    found.sort(key=lambda x: (x[0], x[1] != 'index.html', x[1]))
    return found


def load_robot(readings_dir):
    robot = {}
    idx = os.path.join(readings_dir, 'robot', 'results-index.json')
    try:
        files = json.loads(read(idx) or '')
    except ValueError:
        files = ['results-tap-oct28.json']
    for f in files:
        try:
            rows = json.loads(read(os.path.join(readings_dir, 'robot', f)) or '')
        except ValueError:
            continue
        for row in rows:
            p = row.get('page') or ''
            if p.startswith('readings/'):
                p = p[9:]
            robot[p] = row          # later files win, as in check.html
    return robot, files


def scan(repo_dirs):
    robot, robot_files = load_robot(repo_dirs['readings'])
    rows = []
    for repo in REPOS:
        root = repo_dirs.get(repo)
        if not root:
            print('  ! %s not found — skipped' % repo, file=sys.stderr)
            continue
        for rel_dir, f, rel in pages_in(repo, root):
            page_file = os.path.join(root, rel)
            text = read(page_file) or ''
            r = check_text(rel, with_scripts(text, page_file, repo_dirs), robot)
            out = {'path': rel,
                   'dir': repo + ('/' + rel_dir if rel_dir else ''),
                   'file': f, 'bytes': len(text), 'kind': r['kind']}
            for k in ('login', 'langs', 'lang', 'missing', 'period', 'trans', 'tap', 'canary',
                      'gate', 'save', 'robot', 'track', 'supa'):
                out[k] = r[k]
            out['repo'] = repo
            rows.append(out)
    return rows, robot_files


# ── repos ──────────────────────────────────────────────────────────────────
def find_repos(base):
    dirs = {}
    for repo in REPOS:
        for cand in (repo, repo + '-main'):
            p = os.path.join(base, cand)
            if os.path.isdir(p):
                dirs[repo] = p
                break
    return dirs


def download(base):
    os.makedirs(base, exist_ok=True)
    for repo in REPOS:
        url = 'https://codeload.github.com/tobiasrugger/%s/zip/refs/heads/main' % repo
        print('  downloading', repo)
        data = urllib.request.urlopen(url, timeout=120).read()
        zipfile.ZipFile(io.BytesIO(data)).extractall(base)
    return find_repos(base)


# ── output ─────────────────────────────────────────────────────────────────
def summary(rows):
    def count(repo=None):
        s = [r for r in rows if r['kind'] == 'student' and (repo is None or r['repo'] == repo)]
        c = {'ok': 0, 'bad': 0, 'na': 0, 'warn': 0}
        for r in s:
            c[r['save'][0]] += 1
        return len(s), c
    n, c = count('readings')
    lines = ['%d pages (%d student) in %d repos' % (len(rows), sum(r['kind'] == 'student' for r in rows),
                                                   len({r['repo'] for r in rows})),
             'Loads first, readings: %d ok / %d red / %d nothing to save' % (c['ok'], c['bad'], c['na'])]
    n2, c2 = count()
    lines.append('Loads first, all repos: %d ok / %d red' % (c2['ok'], c2['bad']))
    rob = {}
    for r in rows:
        if r['kind'] == 'student':
            rob[r['robot'][0]] = rob.get(r['robot'][0], 0) + 1
    lines.append('Robot, student pages: %d pass / %d fail / %d inconclusive / %d never driven'
                 % (rob.get('ok', 0), rob.get('bad', 0), rob.get('warn', 0), rob.get('na', 0)))
    return '\n'.join(lines)


def red_list(rows):
    return [r['dir'] + '/' + r['file'] for r in rows
            if r['repo'] == 'readings' and r['kind'] == 'student' and r['save'][0] == 'bad']


RE_DATA = re.compile(r'(<script id="data" type="application/json">)([\s\S]*?)(</script>)')
RE_GENERATED = re.compile(r'Generated [A-Z][a-z]+ [0-9]{1,2}, [0-9]{4}')


def render_grid(template, rows):
    blob = json.dumps(rows).replace('</', '<\\/')
    out = RE_DATA.sub(lambda m: m.group(1) + blob + m.group(3), template, count=1)
    today = datetime.date.today()
    return RE_GENERATED.sub('Generated %s %d, %d' % (today.strftime('%B'), today.day, today.year), out, count=1)


def compare(rows, grid_html):
    old = json.loads(RE_DATA.search(grid_html).group(2))
    key = lambda r: (r['repo'], r['path'])
    o = {key(r): r for r in old}
    n = {key(r): r for r in rows}
    diffs = []
    for k in sorted(set(o) | set(n)):
        if k not in o:
            diffs.append('NEW   %s/%s' % k)
            continue
        if k not in n:
            diffs.append('GONE  %s/%s' % k)
            continue
        for c in ['kind'] + COLS:
            a, b = o[k].get(c), n[k].get(c)
            if a != b:
                diffs.append('%-5s %s/%s  %s → %s' % (c, k[0], k[1], a, b))
    return diffs


def agree(rows, repo_dirs):
    import subprocess
    import tempfile
    here = os.path.dirname(os.path.abspath(__file__))
    dirs = {k: os.path.abspath(v) for k, v in repo_dirs.items()}
    pages = [{'repo': r['repo'], 'path': r['path'], 'abs': os.path.join(dirs[r['repo']], r['path'])} for r in rows]
    with tempfile.NamedTemporaryFile('w', suffix='.json', delete=False) as f:
        json.dump(pages, f)
    check = os.path.join(dirs['readings'], 'audit', 'check.html')
    res = subprocess.run(['node', os.path.join(here, 'agree.js'), check, dirs['readings'], f.name, json.dumps(dirs)],
                         capture_output=True, text=True)
    if res.returncode:
        sys.exit('agree.js failed (is jsdom installed? npm i jsdom):\n' + res.stderr[-800:])
    js = {(j['repo'], j['path']): j for j in json.loads(res.stdout)}
    n = 0
    for r in rows:
        j = js[(r['repo'], r['path'])]
        for c in ['kind'] + COLS:
            if j[c] != r[c]:
                n += 1
                if n <= 30:
                    print('   DIFF %s %s/%s  check.html %s  audit.py %s' % (c, r['repo'], r['path'], j[c], r[c]))
    print('agreement with check.html: %d pages, %d cells differ' % (len(rows), n))
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--repos', help='folder holding the six repos')
    ap.add_argument('--download', action='store_true', help='fetch the six repos by codeload first')
    ap.add_argument('--write', action='store_true', help='rewrite readings/audit/index.html in place')
    ap.add_argument('--out', help='write the regenerated grid here instead')
    ap.add_argument('--json', help='dump the rows as JSON')
    ap.add_argument('--compare', help='an existing audit/index.html to diff against')
    ap.add_argument('--agree', action='store_true', help="diff against check.html's JS rules (needs node + jsdom)")
    a = ap.parse_args()

    if a.download:
        repo_dirs = download(a.repos or 'audit-repos')
    elif a.repos:
        repo_dirs = find_repos(a.repos)
    else:
        here = os.path.dirname(os.path.abspath(__file__))     # readings/audit/tools
        repo_dirs = find_repos(os.path.abspath(os.path.join(here, '..', '..', '..')))
    if 'readings' not in repo_dirs:
        sys.exit('readings repo not found — use --download or --repos DIR')

    rows, robot_files = scan(repo_dirs)
    print(summary(rows))
    print('Robot results read:', ', '.join(robot_files))
    reds = red_list(rows)
    if reds:
        print('Readings pages still red on Loads first (%d):' % len(reds))
        for p in reds:
            print('   ', p)

    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump(rows, f, indent=1)
    if a.compare:
        diffs = compare(rows, read(a.compare) or '')
        print('%d differences against %s' % (len(diffs), a.compare))
        for d in diffs:
            print('   ', d)
    if a.agree:
        n = agree(rows, repo_dirs)
        if n:
            sys.exit('audit.py and check.html disagree on %d cells — fix before shipping' % n)
    if a.write or a.out:
        grid = os.path.join(repo_dirs['readings'], 'audit', 'index.html')
        html = render_grid(read(grid), rows)
        dest = a.out or grid
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(html)
        print('grid written to', dest)


if __name__ == '__main__':
    main()
