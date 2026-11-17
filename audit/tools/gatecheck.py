#!/usr/bin/env python3
"""
gatecheck.py — the "At sign-in" and "No English only" columns of the
feature audit.

Is the language picker on the sign-in screen, where a student chooses it
before the activity starts?  This is a straight port of gateCheck() in
readings/audit/check.html.  The browser version parses the page with
DOMParser; this one uses html5lib, which follows the same HTML parsing
rules, so both see the same element tree (scripts stay text, stray markup
after </html> lands in <body>, SVG elements keep a non-string className).

If you change a rule here, change gateCheck() / eoCheck() in check.html
the same way.

Use as a module:   from gatecheck import gate_check; gate_check(text)
Or on one file:    python3 gatecheck.py path/to/page.html
"""
import re
import sys

import html5lib

HTML_NS = '{http://www.w3.org/1999/xhtml}'
SVG_NS = '{http://www.w3.org/2000/svg}'

GATEISH = re.compile(r'gate|login|log-in|sign-?in|signin|overlay|welcome|start-?screen|screen-name', re.I)
ENGINE = re.compile(r'id=["\']gLang["\']|getElementById\(\s*["\']gLang["\']|GS\.LANGS|window\.GS|vets-practice\.js|galStdLang', re.I)
SIGNIN_FIELD = re.compile(r'type\s*=\s*["\']email["\']|id\s*=\s*["\'][^"\']*[Mm]ail')
SELECT_LANG = re.compile(r'<select[^>]*lang', re.I)
LANGS_ARRAY = re.compile(r'LANGS\s*=\s*\[')
LANG = re.compile(r'lang', re.I)


def _class_string(el):
    """className as a browser reports it: a string for HTML (and MathML)
    elements, an SVGAnimatedString for SVG ones — which check.html skips."""
    if el.tag.startswith(SVG_NS):
        return None
    return el.get('class', '')


def gate_check(t):
    """Return [status, detail] exactly as check.html's gateCheck(t) does."""
    if 'gate-lang' in t and (SELECT_LANG.search(t) or LANGS_ARRAY.search(t)):
        return ['ok', 'mirrored into sign-in']
    if ENGINE.search(t):
        return ['ok', 'picker built into the sign-in gate at load']
    if 'track.js' in t and SIGNIN_FIELD.search(t):
        return ['ok', 'std.js adds it to the sign-in box']
    try:
        root = html5lib.parse(t)          # same tree a browser builds
    except Exception:
        return ['warn', 'could not read the page']

    parent = {}
    for p in root.iter():
        for c in p:
            parent[c] = p

    saw_gate = False
    for el in root.iter():
        if not isinstance(el.tag, str):
            continue                       # comments
        if el.get('id') is None and el.get('class') is None:
            continue                       # querySelectorAll('[id],[class]')
        cls = _class_string(el)
        ident = (el.get('id') or '') + ' ' + (cls if isinstance(cls, str) else '')
        if GATEISH.search(ident):
            saw_gate = True
            break

    any_picker = False
    in_gate = False
    for s in root.iter(HTML_NS + 'select'):
        sid = (s.get('id') or '') + ' ' + (s.get('class') or '') + ' ' + (s.get('name') or '')
        if not LANG.search(sid):
            continue
        any_picker = True
        n = parent.get(s)
        while n is not None:              # up to and including <html>
            cls = _class_string(n)
            pid = (n.get('id') or '') + ' ' + (cls if isinstance(cls, str) else '')
            if GATEISH.search(pid):
                in_gate = True
                break
            n = parent.get(n)

    if not any_picker:
        return ['bad', 'no language picker']
    if in_gate:
        return ['ok', 'chosen at sign-in']
    if not saw_gate:
        return ['warn', 'picker present, no sign-in screen found']
    return ['warn', 'picker is after sign-in']


# ── "No English only" (T-461) ──────────────────────────────────────────────
# Project rule: a student sign-in box always has the language dropdown and
# never offers "English only". Port of eoCheck() in check.html.
# Not counted (different settings): "Instructions: English only" toggles,
# "Glossary: English only", a toolbar picker outside the sign-in box, and the
# "You chose English only" message — none of those is an option in the box.
EO_TEXT = re.compile(r'^\s*(?:language\s*:\s*)?english only\s*$', re.I)
EO_SCRIPT = [
    re.compile(r"""\[\s*['"](?:none|en|english|)['"]\s*,\s*['"]English only['"]\s*\]""", re.I),  # LANGS row
    re.compile(r"""textContent\s*=\s*['"]English only['"]"""),                                    # built option
    re.compile(r"""['"]<option[^>]*>\s*(?:Language:\s*)?English only\s*</option>""", re.I),       # option string
]
EO_FIRST_ONLY = re.compile(r"""===\s*0\s*\?\s*['"]<option[^>]*>\s*English only""")  # only the toolbar picker
MIRROR_SELECT = re.compile(r'<select[^>]*lang', re.I)
# T-461c: a mirror that drops "English only" when it copies the toolbar picker
EO_MIRROR_FIXED = re.compile(r'/english only/i\.test\(o\.textContent\)')
# T-461c: a script line marked "toolbar only" builds the toolbar picker, not the sign-in list
EO_TOOLBAR_ONLY = 'toolbar only'


def eo_check(t):
    """Return [status, detail] exactly as check.html's eoCheck(t) does."""
    try:
        root = html5lib.parse(t)
    except Exception:
        return ['warn', 'could not read the page']
    parent = {}
    for p in root.iter():
        for c in p:
            parent[c] = p
    # pages that copy the toolbar picker into #gate-lang: its options ARE the sign-in options
    mirror = 'gate-lang' in t and bool(MIRROR_SELECT.search(t) or LANGS_ARRAY.search(t))
    mirror_fixed = mirror and bool(EO_MIRROR_FIXED.search(t))
    if mirror_fixed:
        mirror = False

    def in_gate(el):
        n = parent.get(el)
        while n is not None:
            cls = _class_string(n)
            if GATEISH.search((n.get('id') or '') + ' ' + (cls if isinstance(cls, str) else '')):
                return True
            n = parent.get(n)
        return False

    gate_picker = False
    for s in root.iter(HTML_NS + 'select'):
        sid = (s.get('id') or '') + ' ' + (s.get('class') or '') + ' ' + (s.get('name') or '')
        if not LANG.search(sid):
            continue
        if not (mirror or in_gate(s)):
            continue
        gate_picker = True
        for o in s.iter(HTML_NS + 'option'):
            if EO_TEXT.match(''.join(o.itertext())):
                return ['bad', 'sign-in offers English only']
    if not gate_picker and mirror_fixed:
        return ['ok', 'no English only (sign-in copy drops it)']
    if not gate_picker:
        return ['na', 'no picker in the sign-in box']
    scripts = '\n'.join(''.join(sc.itertext()) for sc in root.iter(HTML_NS + 'script') if not sc.get('src'))
    for rx in EO_SCRIPT:
        for m in rx.finditer(scripts):
            if EO_FIRST_ONLY.search(scripts[max(0, m.start() - 40):m.end()]):
                continue
            ls = scripts.rfind('\n', 0, m.start()) + 1
            le = scripts.find('\n', m.end())
            if EO_TOOLBAR_ONLY in scripts[ls:le if le >= 0 else len(scripts)]:
                continue
            return ['bad', 'sign-in list includes English only']
    return ['ok', 'no English only']


# ── "Chrome translate off" (T-470) ───────────────────────────────────────
# Chrome's own page translation must stay off on student pages (T-463/T-468):
# <html translate="no">, <meta name="google" content="notranslate">, or track.js
# (which sets both when the page loads). Only the page's own HTML counts.
CT_HTML = re.compile(r'<html\b[^>]*>', re.I)
CT_NO = re.compile(r'\btranslate\s*=\s*["\']?no\b', re.I)
CT_META = re.compile(r'<meta[^>]*name\s*=\s*["\']google["\'][^>]*content\s*=\s*["\']notranslate', re.I)
CT_TEACHER = re.compile(r'dashboard|teacher|(^|/)(wall|preview|handout|share|check|404)\.html$|_archive/|(^|/)print/|^atlas/', re.I)
CT_TRACK = re.compile(r'<script[^>]+src\s*=\s*["\'][^"\']*track\.js', re.I)


def ct_check(t):
    """Return [status, detail] exactly as check.html's ctCheck(t) does."""
    page = t.split('\n/* included */\n', 1)[0]
    if re.search(r'http-equiv\s*=\s*["\']refresh', page, re.I):
        return ['na', 'redirect stub']
    h = CT_HTML.search(page)
    if h and CT_NO.search(h.group(0)):
        return ['ok', 'translate="no" on <html>']
    if CT_META.search(page):
        return ['ok', 'meta notranslate']
    if CT_TRACK.search(page):
        return ['ok', 'track.js turns it off']
    return ['bad', 'Chrome can translate the page']


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    for p in sys.argv[1:]:
        with open(p, encoding='utf-8', errors='replace') as f:
            txt = f.read()
            print(p, gate_check(txt), eo_check(txt))
