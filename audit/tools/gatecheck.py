#!/usr/bin/env python3
"""
gatecheck.py — the "At sign-in" column of the feature audit.

Is the language picker on the sign-in screen, where a student chooses it
before the activity starts?  This is a straight port of gateCheck() in
readings/audit/check.html.  The browser version parses the page with
DOMParser; this one uses html5lib, which follows the same HTML parsing
rules, so both see the same element tree (scripts stay text, stray markup
after </html> lands in <body>, SVG elements keep a non-string className).

If you change a rule here, change gateCheck() in check.html the same way.

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


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    for p in sys.argv[1:]:
        with open(p, encoding='utf-8', errors='replace') as f:
            print(p, gate_check(f.read()))
