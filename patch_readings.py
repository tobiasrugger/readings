#!/usr/bin/env python3
"""
Patch every readings page with one <script src="/readings/track.js"> line,
and generate the `activities` registry SQL from what is actually in the repo.
Run from the repo root:  python3 patch_readings.py
Safe to re-run; it never double-inserts.
"""
import os, re, html, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
TAG = '<script src="/readings/track.js"></script>'

# files that are not student activities
SKIP_NAME = re.compile(
    r'(dashboard|teacher|unit[-_ ]?plan|unitplan|plans?|hub[-_ ]?card|snippet|readings[-_]index)',
    re.I)
SKIP_PATH = ('mnt/user-data',)

UNIT_NAMES = {
    'arrival': 'Arrival Stories', 'ave-cesaria': 'Songs', 'eld103': 'ELD 103 Writing',
    'eld103-unit1': 'ELD 103 Writing', 'fables': 'Fables', 'favorite-songs': 'Favorite Songs',
    'favorites': 'Favorites', 'grasshopper-ant': 'Fables', 'gratitude': 'Gratitude',
    'gratitude-letters': 'Gratitude', 'holidays': 'Holidays', 'human-rights': 'Human Rights',
    'manzanar': 'Farewell to Manzanar', 'maus': 'Maus', 'mlk': 'MLK', 'news': 'Every Week',
    'odyssey': 'The Odyssey', 'oral-histories': 'Oral Histories',
    'phenomenal-woman': 'Poems', 'psychology': 'Psychology', 'resume': 'Resume',
    'romeo-juliet': 'Romeo and Juliet', 'seedfolks': 'Seedfolks', 'seedfolks-easy': 'Seedfolks',
    'sept11': 'September 11', 'sept11-easy': 'September 11', 'songs': 'Songs',
    'stand-by-me': 'Stand By Me', 'stromae-gender': 'Songs', 'survival-english': 'Survival English',
    'this-is-how': 'This Is How', 'thoughts': 'Grammar', 'toolkits': 'Toolkits',
    'tyma-vocab': 'Thank You Ma\'am', 'vocab': 'Vocabulary', 'student': None,
}

# keyword -> skill tags. First match wins per category; a page can collect several.
SKILL_RULES = [
    (r'grammar|verb|tense|preposition|article',        ['grammar']),
    (r'past[-_ ]?tense|past\b',                        ['past-tense']),
    (r'present|simple present',                        ['present-tense']),
    (r'vocab|word|glossary|dictionary',                ['vocabulary']),
    (r'read|chapter|ch\d|part\d|guide|scene',          ['reading-comprehension']),
    (r'writ|essay|paragraph|compose',                  ['writing']),
    (r'assess|test|quiz|exam',                         ['assessment']),
    (r'listen|record|fluency|sound|pronoun',           ['speaking-listening']),
    (r'charact|theme|symbol|literary|poem|poetry',     ['literary-analysis']),
    (r'anticipat|predict',                             ['predicting']),
    (r'summar',                                        ['summarizing']),
    (r'infer',                                         ['inference']),
    (r'interview|oral|histor',                         ['speaking-listening']),
    (r'song|music|mixtape',                            ['listening']),
    (r'resume|job|work|survival|daily',                ['life-skills']),
    (r'describ|feeling|self|identity|favorite',        ['describing']),
]


def title_of(txt, fallback):
    m = re.search(r'<title>(.*?)</title>', txt, re.S | re.I)
    t = m.group(1) if m else ''
    if not t:
        m = re.search(r'<h1[^>]*>(.*?)</h1>', txt, re.S | re.I)
        t = m.group(1) if m else ''
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t).strip()
    # Titles look like "1 · What Is Psychology?" or "Ch. 1 — Manzanar · Mr. Toby".
    # Drop the byline and any bare page-number segment, keep the real name.
    parts = [p.strip() for p in re.split(r'\s*[·|]\s*', t) if p.strip()]
    good = [p for p in parts
            if not re.fullmatch(r'(p(age)?\s*)?\d+', p, flags=re.I)
            and not re.search(r"mr\.?\s*toby", p, flags=re.I)]
    t = good[0] if good else (parts[0] if parts else '')
    t = re.sub(r"\s*[—–-]\s*Mr\.?\s*Toby('?s)?(\s*ELD)?.*$", '', t, flags=re.I)
    t = re.sub(r"\s*[—–-]\s*(Galileo|Mr\.? Toby).*$", '', t, flags=re.I).strip()
    return t or fallback


def skills_for(slug, title, txt):
    hay = (slug + ' ' + title).lower()
    out = []
    for pat, tags in SKILL_RULES:
        if re.search(pat, hay):
            for t in tags:
                if t not in out:
                    out.append(t)
    if not out:
        out = ['reading-comprehension']
    return out[:4]


def load_existing(path):
    """Read the previous activities_registry.sql so hand-edited titles and
    skill tags are never overwritten by a re-run."""
    keep = {}
    if not os.path.exists(path):
        return keep
    txt = open(path, encoding='utf-8').read()
    row = re.compile(
        r"\(\s*'((?:[^']|'')*)'\s*,"      # slug
        r"\s*'((?:[^']|'')*)'\s*,"        # title
        r"\s*'((?:[^']|'')*)'\s*,"        # unit
        r"\s*'((?:[^']|'')*)'\s*,"        # url
        r"\s*([^,]+)\s*,"                 # max_score
        r"\s*'\{([^}]*)\}'\s*,"           # skills
        r"\s*(\d+)\s*\)")                 # sort_order
    for m in row.finditer(txt):
        slug = m.group(1).replace("''", "'")
        skills = [re.sub(r'^[\s\\"]+|[\s\\"]+$', '', s)
                  for s in m.group(6).split(',')]
        skills = [s for s in skills if s]
        keep[slug] = {
            'title': m.group(2).replace("''", "'"),
            'unit': m.group(3).replace("''", "'"),
            'max_score': m.group(5).strip(),
            'skills': skills,
            'sort_order': int(m.group(7)),
        }
    return keep


def sql_str(s):
    return "'" + str(s).replace("'", "''") + "'" if s is not None else 'null'


def main():
    patched = skipped = already = new_rows = 0
    rows = []

    global EXISTING
    REG = os.path.join(ROOT, 'activities_registry.sql')
    EXISTING = load_existing(REG)

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d != 'node_modules']
        for fn in sorted(filenames):
            if not fn.lower().endswith('.html'):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, ROOT).replace(os.sep, '/')
            if any(s in rel for s in SKIP_PATH):
                continue

            txt = open(full, encoding='utf-8', errors='replace').read()

            # ---- 1. inject the tracker ----
            if TAG in txt:
                already += 1
            else:
                if re.search(r'</body>', txt, re.I):
                    new = re.sub(r'</body>', TAG + '\n</body>', txt, count=1, flags=re.I)
                else:
                    new = txt.rstrip() + '\n' + TAG + '\n'
                open(full, 'w', encoding='utf-8').write(new)
                patched += 1

            # ---- 2. registry row ----
            folder = rel.split('/')[0] if '/' in rel else ''
            if SKIP_NAME.search(fn) or SKIP_NAME.search(rel) or rel == 'index.html' \
               or folder == 'student' or UNIT_NAMES.get(folder, '') is None:
                skipped += 1
                continue

            # a page that is mostly links to other pages is a hub, not an activity
            cards = len(re.findall(r'class="[^"]*\bcard\b', txt))
            has_inputs = len(re.findall(r'<(input|textarea|select)\b', txt, re.I))
            if cards >= 3 and has_inputs < 3:
                skipped += 1
                continue

            slug = re.sub(r'\.html?$', '', rel)
            slug = re.sub(r'/index$', '', slug)
            url = 'https://tobiasrugger.github.io/readings/' + \
                  re.sub(r'index\.html$', '', rel)

            prev = EXISTING.get(slug)
            if prev:
                # your edits win; only the URL is refreshed from the file tree
                rows.append([slug, prev['title'], prev['unit'], url,
                             prev['skills'], prev['sort_order'], prev['max_score'], False])
            else:
                title = title_of(txt, slug)
                unit = UNIT_NAMES.get(folder, folder.replace('-', ' ').title() or 'Other')
                rows.append([slug, title, unit, url,
                             skills_for(slug, title, txt), 0, 'null', True])
                new_rows += 1

    # keep existing sort_order; number only the new arrivals, after the last one
    used = sorted(r[5] for r in rows if r[5])
    nxt = (used[-1] if used else 0) + 10
    for r in rows:
        if not r[5]:
            r[5] = nxt
            nxt += 10
    rows.sort(key=lambda r: (r[5], r[0]))

    def render(subset, header):
        lines = [header,
                 "insert into activities (slug, title, unit, url, max_score, skills, sort_order) values"]
        vals = []
        for slug, title, unit, url, skills, o, maxs, is_new in subset:
            arr = "'{" + ",".join('"%s"' % s for s in skills) + "}'"
            vals.append("  (%s, %s, %s, %s, %s, %s, %d)" %
                        (sql_str(slug), sql_str(title), sql_str(unit),
                         sql_str(url), maxs, arr, o))
        lines.append(",\n".join(vals))
        lines.append("""on conflict (slug) do update
  set title      = excluded.title,
      unit       = excluded.unit,
      url        = excluded.url,
      skills     = excluded.skills,
      sort_order = excluded.sort_order;""")
        return "\n".join(lines) + "\n"

    open(REG, 'w', encoding='utf-8').write(render(
        rows,
        "-- activities registry for the readings repo.\n"
        "-- EDIT THIS FILE, not Supabase. Re-running patch_readings.py keeps\n"
        "-- every title and skill tag you change here, and appends new pages."))

    newonly = os.path.join(ROOT, 'activities_new.sql')
    fresh = [r for r in rows if r[7]]
    if fresh:
        open(newonly, 'w', encoding='utf-8').write(render(
            fresh, "-- Only the pages that were NEW this run.\n"
                   "-- Paste this into Supabase if the full registry is already loaded."))
    elif os.path.exists(newonly):
        os.remove(newonly)

    print("tracker injected : %d" % patched)
    print("already had it   : %d" % already)
    print("not an activity  : %d" % skipped)
    print("registry rows    : %d  (%d new this run)" % (len(rows), new_rows))
    print("wrote            : activities_registry.sql" +
          ("  +  activities_new.sql" if fresh else ""))


if __name__ == '__main__':
    main()
