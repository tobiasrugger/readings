#!/usr/bin/env python3
"""T-170 Robot save test — a headless robot student for every page that saves to Supabase.

Serve the repo over http from a folder named readings/ (python3 -m http.server 8800 in the
parent folder), then:  python3 robot.py readings/omelas/index.html [more pages...] --out results.json

Supabase is faked by a tiny in-memory PostgREST (GET filters eq/in/ilike/or, upsert, PATCH, DELETE).
Four runs per page:
  A  record   - empty server, robot signs in, types a marker into every answer box, waits for autosave.
               What the page saved becomes "the student's saved work".
  1  fresh    - a new Chromebook (empty browser). The saved work is on the server under the OTHER
               email spelling. PASS = the marker shows up on the page, and no save ever leaves it out.
  2  down     - server down at sign-in (every Supabase call fails). PASS = no save is attempted to a
               work table, and a visible "can't reach the server" style notice appears.
  3  shared   - student A works and saves; student B opens the page on the same Chromebook.
               PASS = B can sign in as B, sees none of A's answers, and no save under B carries them.
"""
import asyncio, json, re, sys, os, time, urllib.parse, argparse, copy

BASE = os.environ.get("ROBOT_BASE", "http://localhost:8800")
ROOT = os.environ.get("ROBOT_ROOT", "/home/claude/srv")          # folder that CONTAINS readings/
INFRA = {"students", "student_aliases", "activity_attempts", "skill_attempts", "activities",
         "instruction_reveals", "page_translation", "song_tr", "student_work", "response_history",
         "class_assignments", "excusals", "student_profiles", "song_lyrics", "favorites_log"}
KEYS = ["email", "student_email", "set_slug", "slug", "guide_key", "episode", "lesson", "lesson_id",
        "page", "story", "activity", "set_id", "unit", "part", "deck", "item", "kind", "set_key",
        "story_id", "lesson_key", "quiz", "chapter", "text_slug", "song"]

def lp(e): return str(e or "").strip().lower().split("@")[0]
def other_spelling(e):
    e = str(e or "").lower()
    return lp(e) + ("@sfusd.edu" if e.endswith("@s.sfusd.edu") else "@s.sfusd.edu")

# ---------------------------------------------------------------- fake PostgREST
class DB:
    def __init__(self, tables=None):
        self.t = copy.deepcopy(tables) if tables else {}
        self.log = []          # every request: dict(method, table, url, body, ts, status)
        self.down = False
    def rows(self, table): return self.t.setdefault(table, [])

    @staticmethod
    def _val(v):
        if v is None: return None
        return v
    def _match1(self, row, col, opval):
        neg = False
        if opval.startswith("not."): neg = True; opval = opval[4:]
        op, _, val = opval.partition(".")
        rv = row.get(col, None)
        def s(x): return "" if x is None else (json.dumps(x) if isinstance(x, (dict, list)) else str(x)).lower() if isinstance(x,(dict,list)) else ("true" if x is True else "false" if x is False else str(x))
        r = None
        if op == "eq": r = s(rv) == val
        elif op == "neq": r = s(rv) != val
        elif op == "in":
            items = [x.strip().strip('"') for x in val.strip("()").split(",")]
            r = s(rv) in items
        elif op in ("ilike", "like"):
            pat = "^" + re.escape(val).replace("\\*", ".*").replace("%", ".*") + "$"
            r = re.match(pat, s(rv), re.I if op == "ilike" else 0) is not None
        elif op == "is":
            r = (rv is None) if val == "null" else (s(rv) == val)
        elif op in ("gt", "gte", "lt", "lte"):
            try:
                a, b = float(rv), float(val)
            except Exception:
                a, b = s(rv), val
            r = {"gt": a > b, "gte": a >= b, "lt": a < b, "lte": a <= b}[op]
        elif op in ("cs", "cd", "ov", "fts", "plfts", "wfts"):
            r = True
        else:
            r = True
        return (not r) if neg else r
    def _or(self, row, expr):
        expr = expr.strip()
        if expr.startswith("(") and expr.endswith(")"): expr = expr[1:-1]
        parts, depth, cur = [], 0, ""
        for ch in expr:
            if ch == "(" : depth += 1
            if ch == ")" : depth -= 1
            if ch == "," and depth == 0: parts.append(cur); cur = ""
            else: cur += ch
        if cur: parts.append(cur)
        for p in parts:
            col, _, rest = p.partition(".")
            if self._match1(row, col, rest): return True
        return False
    def filt(self, rows, q):
        out = []
        for row in rows:
            ok = True
            for k, vs in q.items():
                if k in ("select", "order", "limit", "offset", "on_conflict", "columns"): continue
                for v in vs:
                    if k == "or":
                        if not self._or(row, v): ok = False
                    elif k == "and":
                        pass
                    elif not self._match1(row, k, v): ok = False
            if ok: out.append(row)
        return out

    def handle(self, method, url, headers, body):
        u = urllib.parse.urlparse(url)
        path = u.path
        q = urllib.parse.parse_qs(u.query, keep_blank_values=True)
        table = path.split("/rest/v1/")[-1].split("/")[0] if "/rest/v1/" in path else path
        entry = {"method": method, "table": table, "url": url, "body": body, "ts": time.time()}
        self.log.append(entry)
        if self.down:
            entry["status"] = 503
            return 503, {"message": "Service unavailable (robot: server down)"}
        if "/rest/v1/" not in path:
            entry["status"] = 200; return 200, {}
        if table == "rpc" or path.split("/rest/v1/")[-1].startswith("rpc/"):
            entry["status"] = 200; return 200, []
        prefer = (headers.get("prefer") or headers.get("Prefer") or "")
        data = None
        if body:
            try: data = json.loads(body)
            except Exception: data = None
        if method in ("GET", "HEAD"):
            rows = self.filt(self.rows(table), q)
            if "order" in q:
                for spec in reversed(q["order"][0].split(",")):
                    col, *mods = spec.split(".")
                    rev = "desc" in mods
                    rows = sorted(rows, key=lambda r: (r.get(col) is None, str(r.get(col)) if not isinstance(r.get(col),(int,float)) else r.get(col)), reverse=rev)
            if "limit" in q:
                try: rows = rows[: int(q["limit"][0])]
                except Exception: pass
            acc = headers.get("accept") or headers.get("Accept") or ""
            entry["status"] = 200
            if "vnd.pgrst.object" in acc:
                if len(rows) != 1:
                    entry["status"] = 406; return 406, {"message": "JSON object requested, multiple (or no) rows returned"}
                return 200, rows[0]
            return 200, rows
        if method == "POST":
            items = data if isinstance(data, list) else ([data] if isinstance(data, dict) else [])
            merge = "merge-duplicates" in prefer
            ignore = "ignore-duplicates" in prefer
            conflict = q.get("on_conflict", [""])[0]
            out = []
            for it in items:
                it = dict(it)
                cols = [c for c in conflict.split(",") if c] if conflict else [k for k in KEYS if k in it]
                hit = None
                if (merge or ignore) and cols:
                    for r in self.rows(table):
                        if all(str(r.get(c)) == str(it.get(c)) for c in cols): hit = r; break
                if hit is not None:
                    if merge: hit.update(it)
                    out.append(hit)
                else:
                    self.rows(table).append(it); out.append(it)
            entry["status"] = 201
            return 201, (out if "return=representation" in prefer else None)
        if method == "PATCH":
            rows = self.filt(self.rows(table), q)
            for r in rows:
                if isinstance(data, dict): r.update(data)
            entry["status"] = 200
            return 200, (rows if "return=representation" in prefer else None)
        if method == "DELETE":
            rows = self.filt(self.rows(table), q)
            self.t[table] = [r for r in self.rows(table) if r not in rows]
            entry["status"] = 200; return 200, None
        entry["status"] = 200
        return 200, None

    def writes(self, since=0.0, work_only=True):
        return [e for e in self.log if e["method"] in ("POST", "PATCH", "PUT", "DELETE")
                and e["ts"] >= since and "/rest/v1/" in e["url"]
                and (not work_only or (e["table"] not in INFRA and not e["table"].startswith("rpc")))]

# ---------------------------------------------------------------- browser plumbing
CTYPES = {".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json",
          ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp3": "audio/mpeg"}

async def wire(ctx, db):
    async def route(r):
        req = r.request; url = req.url
        try:
            if url.startswith(BASE):
                return await r.continue_()
            if "supabase.co" in url:
                body = req.post_data
                status, payload = db.handle(req.method, url, {k.lower(): v for k, v in req.headers.items()}, body)
                return await r.fulfill(status=status, content_type="application/json",
                    headers={"access-control-allow-origin": "*", "content-range": "0-0/*"},
                    body="" if payload is None else json.dumps(payload))
            if "tobiasrugger.github.io/readings/" in url:
                p = urllib.parse.urlparse(url).path
                f = os.path.join(ROOT, p.lstrip("/"))
                if os.path.isdir(f): f = os.path.join(f, "index.html")
                if os.path.exists(f):
                    ext = os.path.splitext(f)[1]
                    return await r.fulfill(status=200, content_type=CTYPES.get(ext, "application/octet-stream"),
                                           body=open(f, "rb").read())
                return await r.fulfill(status=404, body="")
            if "script.google.com" in url:
                return await r.fulfill(status=200, content_type="application/json",
                    body=json.dumps({"ok": True, "translation": {"equiv": "x", "meaning": "x", "note": ""}}))
            ct = "text/css" if ".css" in url or "fonts.googleapis" in url else "application/javascript"
            if req.resource_type in ("image", "media", "font"):
                return await r.fulfill(status=200, body=b"")
            return await r.fulfill(status=200, content_type=ct, body="")
        except Exception:
            try: await r.abort()
            except Exception: pass
    await ctx.route("**/*", route)

SCAN_JS = r"""
() => {
  const vis = el => { if(!el) return false; const s = getComputedStyle(el); if (s.display==='none'||s.visibility==='hidden'||+s.opacity===0) return false;
     const r = el.getBoundingClientRect(); return r.width>0 && r.height>0; };
  const all = [...document.querySelectorAll('input,select,textarea,button,[role=button]')].filter(vis);
  return all.map((el,i) => { el.dataset.robot = 'r'+i; return {
     id: 'r'+i, tag: el.tagName.toLowerCase(), type: (el.type||'').toLowerCase(), idattr: el.id||'', name: el.name||'',
     ph: el.placeholder||'', text: (el.innerText||el.value||'').trim().slice(0,60),
     aria: (el.getAttribute('aria-label')||'') + ' ' + ((el.labels && el.labels[0] && el.labels[0].innerText) || (el.previousElementSibling && el.previousElementSibling.tagName==='LABEL' && el.previousElementSibling.innerText) || ''), cls: el.className && el.className.baseVal===undefined ? String(el.className) : '',
     opts: el.tagName==='SELECT' ? [...el.options].map(o=>[o.value,o.text]) : null }; });
}
"""

async def ev(page, js, arg=None, tries=4):
    for i in range(tries):
        try:
            return await (page.evaluate(js, arg) if arg is not None else page.evaluate(js))
        except Exception as ex:
            if "context was destroyed" in str(ex) or "navigation" in str(ex).lower():
                try: await page.wait_for_load_state("domcontentloaded", timeout=8000)
                except Exception: pass
                await page.wait_for_timeout(300); continue
            raise
    return None

def lab(x): return " ".join([x["idattr"], x["name"], x["ph"], x["aria"], x["cls"]]).lower()

async def fill_gate(page, who):
    """Try to sign in like a student. Returns a short string describing what happened."""
    for attempt in range(3):
        els = (await ev(page, SCAN_JS)) or []
        email = [e for e in els if e["tag"] == "input" and (e["type"] == "email" or "mail" in lab(e))]
        roster = [e for e in els if e["tag"] == "select" and e["opts"] and any((who["first"]+" "+who["last"]).lower() in (t or "").lower() for v, t in e["opts"])]
        if not email and not roster:
            # a button that opens a sign-in box
            opener = [e for e in els if e["tag"] in ("button",) and re.search(r"sign ?in|log ?in|your name|who are you|start here|enter", (e["text"] + " " + e["aria"]).lower())
                      and not re.search(r"sign ?out|log ?out", e["text"].lower())]
            if opener and attempt < 2:
                try: await page.click(f'[data-robot="{opener[0]["id"]}"]', timeout=1500)
                except Exception: pass
                await page.wait_for_timeout(400); continue
            return "no-gate"
        filled = []
        for e in els:
            sel = f'[data-robot="{e["id"]}"]'; L = lab(e)
            try:
                if e["tag"] == "input" and e["type"] in ("", "text", "email", "search"):
                    if e["type"] == "email" or "mail" in L: await page.fill(sel, who["typed"]); filled.append("email")
                    elif "first and last" in L or "full name" in L or "first last" in L or "your name" in L:
                        await page.fill(sel, who["first"] + " " + who["last"]); filled.append("name")
                    elif "first" in L or "fname" in L: await page.fill(sel, who["first"]); filled.append("first")
                    elif "last" in L or "lname" in L: await page.fill(sel, who["last"]); filled.append("last")
                    elif "name" in L or "first and last" in L: await page.fill(sel, who["first"] + " " + who["last"]); filled.append("name")
                    elif "period" in L or L.strip() in ("gper", "per"): await page.fill(sel, "3"); filled.append("period")
                elif e["tag"] == "input" and e["type"] == "number" and ("period" in L or "per" in L):
                    await page.fill(sel, "3"); filled.append("period")
                elif e["tag"] == "select" and e["opts"]:
                    texts = [t for v, t in e["opts"]]
                    full = (who["first"] + " " + who["last"]).lower()
                    if any(full in (t or "").lower() for t in texts):
                        lab_ = [t for t in texts if full in (t or "").lower()][0]
                        await page.select_option(sel, label=lab_); filled.append("roster")
                    elif "period" in L or "per" in L or any(re.fullmatch(r"(p(eriod)?\s*)?3", (t or "").strip().lower()) for t in texts):
                        cand = [v for v, t in e["opts"] if re.fullmatch(r"(p(eriod)?\s*)?3", (t or "").strip().lower()) or v == "3"]
                        if cand: await page.select_option(sel, value=cand[0]); filled.append("period")
                    elif any("spanish" in (t or "").lower() or "español" in (t or "").lower() for t in texts) and not ("mode" in L):
                        cand = [v for v, t in e["opts"] if "spanish" in (t or "").lower() or "español" in (t or "").lower()]
                        try: await page.select_option(sel, value=cand[0]); filled.append("lang")
                        except Exception: pass
            except Exception:
                pass
        # submit: a button near the email box
        btns = [e for e in els if e["tag"] in ("button",) or e["type"] in ("submit", "button")]
        def score(b):
            t = (b["text"] + " " + b["aria"] + " " + b["idattr"]).lower()
            if re.search(r"translat|direction|listen|🔊|print|teacher|sign ?out|log ?out|hint|speak", t): return -1
            s = 0
            if re.search(r"sign ?in|log ?in|start|begin|let'?s go|enter|continue|^go\b|go →|go$|submit|ready|save and|i'?m ready|open", t): s += 5
            if re.search(r"gate|gbtn|ggo|login|signin|start", b["idattr"].lower() + " " + b["cls"].lower()): s += 4
            return s
        near = []
        if email or roster:
            anchor = (email or roster)[0]["id"]
            near = await ev(page, '''(id) => { let el = document.querySelector('[data-robot="'+id+'"]'); let p = el;
                for (let i=0; i<8 && p; i++) { p = p.parentElement; if (!p) break;
                  const bs = [...p.querySelectorAll('button,[role=button],input[type=submit]')].filter(b => b.dataset.robot);
                  if (bs.length) return bs.map(b => b.dataset.robot); } return []; }''', anchor) or []
        btns = sorted([b for b in btns if score(b) > 0 or (b["id"] in near and score(b) == 0)],
                      key=lambda b: (b["id"] in near, score(b)), reverse=True)
        if btns:
            try: await page.click(f'[data-robot="{btns[0]["id"]}"]', timeout=2000)
            except Exception:
                try: await page.evaluate(f'document.querySelector(\'[data-robot="{btns[0]["id"]}"]\').click()')
                except Exception: pass
        else:
            if email: await page.press(f'[data-robot="{email[0]["id"]}"]', "Enter")
        await page.wait_for_timeout(700)
        # signed in?  the email box should be gone
        still = await ev(page, """() => { const v = el => { const s=getComputedStyle(el); const r=el.getBoundingClientRect(); return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0; };
            return [...document.querySelectorAll('input[type=email],input[id*=mail i],input[placeholder*=mail i]')].some(v); }""")
        if not still:
            return "ok:" + ",".join(filled)
    return "stuck:" + ",".join(filled)

WORK_JS = r"""
(marker) => {
  let n = 0;
  const fire = el => { ['input','keyup','change','blur'].forEach(t => el.dispatchEvent(new Event(t, {bubbles:true}))); };
  for (const el of document.querySelectorAll('textarea')) {
    if (el.readOnly || el.disabled) continue;
    el.focus && el.focus(); el.value = marker + ' ' + (n++); fire(el);
  }
  for (const el of document.querySelectorAll('input')) {
    const t = (el.type||'text').toLowerCase(); if (!['text',''].includes(t)) continue;
    const L = (el.id+' '+el.name+' '+el.placeholder+' '+el.className).toLowerCase();
    if (/mail|name|period|search|lang|password|pw|code|url/.test(L) || el.readOnly || el.disabled) continue;
    if (el.closest('[id*=gate i],[class*=gate i],[id*=login i],[id*=signin i]')) continue;
    el.value = marker + ' ' + (n++); fire(el);
  }
  for (const el of document.querySelectorAll('[contenteditable=true]')) {
    if (el.closest('[id*=gate i]')) continue; el.textContent = marker + ' ' + (n++); fire(el);
  }
  return n;
}
"""
POKE_JS = r"""() => { const el = document.querySelector('textarea, input[type=text]'); if (el) { ['input','keyup','change'].forEach(t => el.dispatchEvent(new Event(t,{bubbles:true}))); } 
  document.dispatchEvent(new Event('visibilitychange')); return !!el; }"""
SHOWN_JS = r"""(marker) => { const vals = [...document.querySelectorAll('textarea,input')].map(e => e.value||'').join(' ');
  return vals.indexOf(marker) >= 0 || ((document.body && document.body.innerText)||'').indexOf(marker) >= 0; }"""
NOTICE_JS = r"""() => { const al = [...document.querySelectorAll('#sgbar,#t168bar,[role=alert]')].find(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed');
  if (al && (al.innerText||'').trim()) return al.innerText.trim().slice(0,120);
  const re = /(can.?t|cannot|couldn.?t|unable to|not able to|failed to|trouble)\s+(reach|connect|load|contact|save|get)|reach the server|offline|no connection|not saved|check (your )?(internet|connection)|network error|trying again/i;
  const v = el => { const s=getComputedStyle(el); const r=el.getBoundingClientRect(); return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0&&r.width>0&&r.height>0; };
  for (const el of document.querySelectorAll('body *')) { if (el.children.length > 3) continue; const t = (el.innerText||'').trim();
    if (t && t.length < 300 && re.test(t) && v(el)) return t.slice(0,120); } return ''; }"""

async def new_page(browser, db, ctx=None):
    if ctx is None:
        ctx = await browser.new_context(viewport={"width": 1366, "height": 768})
        await wire(ctx, db)
    page = await ctx.new_page()
    page.on("dialog", lambda d: asyncio.ensure_future(d.accept("Robo Tester") if d.type == "prompt" else d.accept()))
    await page.clock.install()
    return ctx, page

async def settle(page, ms):
    # let saved-work loads resolve and autosave timers fire (fake clock)
    step = 2500
    for _ in range(max(1, ms // step)):
        try:
            await page.clock.run_for(step)
            await page.wait_for_timeout(120)
        except Exception:
            break

def seeded_students():
    rows = []
    for f, l, e in (("Robo", "Tester", "robo.tester@sfusd.edu"), ("Anna", "Robot", "anna.robot@sfusd.edu"), ("Bruno", "Robot", "bruno.robot@sfusd.edu")):
        rows.append({"email": e, "first_name": f, "last_name": l, "name": f + " " + l, "period": "3", "lang": "Spanish"})
    return {"students": rows}

def work_rows(db, marker):
    out = {}
    for t, rows in db.t.items():
        if t in INFRA: continue
        for r in rows:
            if marker in json.dumps(r): out.setdefault(t, []).append(r)
    return out

async def goto(page, url):
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    except Exception as ex:
        return str(ex)[:80]
    await settle(page, 2500)
    return ""

async def run_page(browser, rel):
    url = BASE + "/" + rel.lstrip("/")
    R = {"page": rel, "url": url}
    WHO = {"first": "Robo", "last": "Tester", "typed": "robo.tester@s.sfusd.edu"}
    # ---------- A: record what this page saves
    db = DB(seeded_students())
    ctx, page = await new_page(browser, db)
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)[:120]))
    try:
        e = await goto(page, url)
        g = await fill_gate(page, WHO); R["gate"] = g
        await settle(page, 3000)
        mk = "ROBOWORKA"
        n = await ev(page, WORK_JS, mk); R["boxes"] = n
        await settle(page, 25000)
        rows = work_rows(db, mk)
        if not rows:
            # some pages only save on a Save / Turn in button
            els = (await ev(page, SCAN_JS)) or []
            sv = [x for x in els if x["tag"] == "button" and re.search(r"\bsave\b|turn ?in|submit|hand in|finish", x["text"].lower())]
            for b in sv[:2]:
                try: await page.click(f'[data-robot="{b["id"]}"]', timeout=1500)
                except Exception: pass
                await settle(page, 5000)
            rows = work_rows(db, mk); R["needed_button"] = bool(rows)
        R["tables"] = sorted(rows.keys())
        R["any_work_write"] = sorted({w["table"] for w in db.writes()})
        R["reads"] = sorted({x["table"] for x in db.log if x["method"] == "GET" and "/rest/v1/" in x["url"] and x["table"] not in INFRA})
        R["errorsA"] = errs[:3]
    finally:
        await ctx.close()
    if not rows:
        R["verdict"] = "no-server-save" if not R["any_work_write"] else "saves-but-robot-text-not-in-save"
        if R.get("gate", "").startswith(("stuck", "no-gate")) and not R["any_work_write"]:
            R["verdict"] = "robot-could-not-sign-in" if R["gate"].startswith("stuck") else R["verdict"]
        return R
    seed = {t: [dict(r) for r in rs] for t, rs in rows.items()}

    # ---------- 1: fresh Chromebook, work saved under the other spelling
    tabs = seeded_students()
    for t, rs in seed.items():
        tabs[t] = []
        for r in rs:
            r2 = dict(r)
            for k in ("email", "student_email"):
                if k in r2 and r2[k]: r2[k] = other_spelling(r2[k])
            tabs[t].append(r2)
    db1 = DB(tabs)
    ctx, page = await new_page(browser, db1)
    try:
        await goto(page, url)
        t0 = time.time()
        g = await fill_gate(page, WHO)
        shown = False
        for _ in range(8):
            await settle(page, 2500)
            shown = await ev(page, SHOWN_JS, "ROBOWORKA")
            if shown: break
            await page.wait_for_timeout(400)
        await ev(page, POKE_JS)
        await settle(page, 25000)
        bad = [w for w in db1.writes(t0) if w["table"] in seed and "ROBOWORKA" not in (w["body"] or "")
               and w["method"] != "DELETE"]
        R["t1"] = {"pass": bool(shown) and not bad, "shown": bool(shown),
                   "saves": len([w for w in db1.writes(t0) if w["table"] in seed]),
                   "saves_without_work": len(bad), "gate": g,
                   "read_emails": sorted({m for x in db1.log if x["method"] == "GET" and x["table"] in seed
                                          for m in re.findall(r"[a-z0-9._%-]+(?:%40|@)[a-z.]+", urllib.parse.unquote(x["url"]).lower())})[:4]}
    finally:
        await ctx.close()

    # ---------- 2: server down at sign-in
    db2 = DB(tabs); db2.down = True
    ctx, page = await new_page(browser, db2)
    try:
        await goto(page, url)
        t0 = time.time()
        g = await fill_gate(page, WHO)
        await settle(page, 4000)
        await ev(page, WORK_JS, "ROBOWORKD")
        await settle(page, 25000)
        notice = ""
        for _ in range(4):
            notice = await ev(page, NOTICE_JS)
            if notice: break
            await settle(page, 2500)
        tried = [w for w in db2.writes(t0) if w["table"] in seed]
        R["t2"] = {"pass": (not tried) and bool(notice), "save_attempts": len(tried), "notice": notice, "gate": g}
    finally:
        await ctx.close()

    # ---------- 3: shared Chromebook
    db3 = DB(seeded_students())
    A = {"first": "Anna", "last": "Robot", "typed": "anna.robot@s.sfusd.edu"}
    B = {"first": "Bruno", "last": "Robot", "typed": "bruno.robot@s.sfusd.edu"}
    ctx, page = await new_page(browser, db3)
    try:
        await goto(page, url)
        await fill_gate(page, A); await settle(page, 3000)
        await ev(page, WORK_JS, "ROBOWORKANNA"); await settle(page, 25000)
        a_saved = bool(work_rows(db3, "ROBOWORKANNA"))
        await page.close()
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.ensure_future(d.accept("Bruno Robot") if d.type == "prompt" else d.accept()))
        await page.clock.install()
        await goto(page, url)
        t0 = time.time()
        g = await fill_gate(page, B)
        how = "gate"
        if g.startswith("ok") and not any(k in g for k in ("email", "roster", "name", "first")): g = "no-gate"
        if g == "no-gate":
            els = (await ev(page, SCAN_JS)) or []
            out = [x for x in els if re.search(r"sign ?out|log ?out|not you|switch|change (student|name)|i'?m not", (x["text"] + " " + x["aria"]).lower())]
            if out:
                try: await page.click(f'[data-robot="{out[0]["id"]}"]', timeout=1500)
                except Exception: pass
                await page.wait_for_timeout(1500)
                try: await page.wait_for_load_state("domcontentloaded", timeout=8000)
                except Exception: pass
                await settle(page, 2500); await page.wait_for_timeout(800)
                g = await fill_gate(page, B); how = "signed-out-first"
            else:
                how = "page-kept-A-signed-in"
        await settle(page, 5000)
        shownA = await ev(page, SHOWN_JS, "ROBOWORKANNA")
        await ev(page, POKE_JS); await settle(page, 25000)
        leaks = [w for w in db3.writes(t0) if "ROBOWORKANNA" in (w["body"] or "") and "bruno" in (w["body"] + w["url"]).lower()]
        asA = [w for w in db3.writes(t0) if "anna.robot" in ((w["body"] or "") + w["url"]).lower()] if how == "page-kept-A-signed-in" else []
        R["t3"] = {"pass": g.startswith("ok") and not shownA and not leaks, "B_gate": g, "how": how,
                   "A_saved": a_saved, "A_answers_shown_to_B": bool(shownA), "saves_with_A_answers": len(leaks),
                   "saves_as_A": len(asA)}
    finally:
        await ctx.close()
    R["verdict"] = "PASS" if all(R[k]["pass"] for k in ("t1", "t2", "t3")) else "FAIL"
    return R

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pages", nargs="+")
    ap.add_argument("--out", default="results.json")
    ap.add_argument("-j", type=int, default=6)
    a = ap.parse_args()
    pages = []
    for p in a.pages:
        if p.startswith("@"): pages += [l.strip() for l in open(p[1:]) if l.strip()]
        else: pages.append(p)
    from playwright.async_api import async_playwright
    results = []
    sem = asyncio.Semaphore(a.j)
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        async def one(p):
            async with sem:
                try:
                    r = await asyncio.wait_for(run_page(browser, p), timeout=240)
                except Exception as ex:
                    r = {"page": p, "verdict": "robot-error", "error": str(ex)[:200]}
                results.append(r)
                print(json.dumps({"page": p, "verdict": r.get("verdict"), "t1": (r.get("t1") or {}).get("pass"),
                                  "t2": (r.get("t2") or {}).get("pass"), "t3": (r.get("t3") or {}).get("pass")}), flush=True)
                json.dump(results, open(a.out, "w"), indent=1)
        await asyncio.gather(*[one(p) for p in pages])
        await browser.close()
    json.dump(results, open(a.out, "w"), indent=1)

if __name__ == "__main__":
    asyncio.run(main())
