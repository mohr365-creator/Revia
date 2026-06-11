#!/usr/bin/env python3
"""Merge /tmp/research/*.jsonl agent findings into the Revia dataset.

Outputs:
  /tmp/research/merged.json   — full merged dataset (communities + hubs + stats)
  /tmp/research/report.txt    — what changed, what was dropped, corrections to review
"""
import json, glob, os, re, sys

REPO = "/home/user/Revia"
SRC = open(f"{REPO}/src/data/communities.ts").read()
HUBS_SRC = open(f"{REPO}/src/data/hubs.ts").read()

# ---------- parse existing communities.ts ----------
def parse_field(block, name, kind="str"):
    if kind == "str":
        m = re.search(rf'{name}:\s*"((?:[^"\\]|\\.)*)"', block)
        return m.group(1) if m else None
    if kind == "num":
        m = re.search(rf'{name}:\s*(-?[\d.]+)', block)
        return float(m.group(1)) if m else None
    if kind == "numornull":
        m = re.search(rf'{name}:\s*(null|-?[\d.]+)', block)
        if not m: return None
        return None if m.group(1) == "null" else float(m.group(1))
    if kind == "coords":
        m = re.search(rf'{name}:\s*\[\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\]', block)
        return [float(m.group(1)), float(m.group(2))] if m else None
    if kind == "strlist":
        m = re.search(rf'{name}:\s*\[([^\]]*)\]', block)
        if not m: return []
        return re.findall(r'"([^"]+)"', m.group(1))
    if kind == "multistr":  # string possibly concatenated over lines
        m = re.search(rf'{name}:\s*\n?\s*"((?:[^"\\]|\\.)*)"', block)
        return m.group(1) if m else None

def split_records(src):
    """Split the seed array into per-record blocks by brace matching."""
    start = src.index("const seed: Seed[] = [")
    i = src.index("[", src.index("=", start))
    depth = 0; blocks = []; cur = None
    for j in range(i, len(src)):
        ch = src[j]
        if ch == "[": depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0: break
        elif ch == "{":
            if depth == 1 and cur is None: cur = j
            depth_brace = None
        if ch == "{" and depth >= 1: pass
    # simpler: brace-match objects at depth1
    blocks = []
    depth = 0; obj_depth = 0; cur = None
    for j in range(i, len(src)):
        ch = src[j]
        if ch == "[": depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0: break
        elif ch == "{":
            obj_depth += 1
            if obj_depth == 1 and depth == 1: cur = j
        elif ch == "}":
            obj_depth -= 1
            if obj_depth == 0 and cur is not None and depth == 1:
                blocks.append(src[cur:j+1]); cur = None
    return blocks

existing = {}
order = []
for b in split_records(SRC):
    c = {
        "city": parse_field(b, "city"),
        "state": parse_field(b, "state"),
        "iata": parse_field(b, "iata"),
        "coordinates": parse_field(b, "coordinates", "coords"),
        "population": parse_field(b, "population", "num"),
        "populationSource": parse_field(b, "populationSource"),
        "status": parse_field(b, "status"),
        "lastYearServed": parse_field(b, "lastYearServed", "numornull"),
        "lastCarrier": parse_field(b, "lastCarrier"),
        "routesLost": parse_field(b, "routesLost", "num"),
        "formerHubs": parse_field(b, "formerHubs", "strlist"),
        "restorableBy": parse_field(b, "restorableBy"),
        "detail": parse_field(b, "detail", "multistr"),
        "source": parse_field(b, "source", "multistr"),
        "verification": parse_field(b, "verification"),
    }
    if not c["iata"]:
        print("WARN: unparsed block", b[:80]); continue
    c["population"] = int(c["population"]) if c["population"] else 0
    c["lastYearServed"] = int(c["lastYearServed"]) if c["lastYearServed"] is not None else None
    c["routesLost"] = int(c["routesLost"] or 0)
    c["lostDestinations"] = []  # accumulated from updates
    existing[c["iata"]] = c
    order.append(c["iata"])

# ---------- parse existing hubs.ts ----------
hubs = {}
for m in re.finditer(r'(\w+):\s*\{\s*iata:\s*"(\w+)",\s*name:\s*"([^"]+)",\s*coordinates:\s*\[\s*(-?[\d.]+),\s*(-?[\d.]+)\s*\]', HUBS_SRC):
    hubs[m.group(2)] = {"iata": m.group(2), "name": m.group(3),
                        "coordinates": [float(m.group(4)), float(m.group(5))]}

report = []
def rep(s): report.append(s)

rep(f"Parsed {len(existing)} existing communities, {len(hubs)} hubs")

# ---------- read agent jsonl ----------
def valid_coords(c, lng_range=(-180, -60), lat_range=(15, 75)):
    return (isinstance(c, list) and len(c) == 2
            and lng_range[0] <= c[0] <= lng_range[1]
            and lat_range[0] <= c[1] <= lat_range[1])

new_records = {}
stats = []
notes = []
n_updates = 0
for path in sorted(glob.glob("/tmp/research/*.jsonl")):
    group = os.path.basename(path).replace(".jsonl", "")
    for ln, line in enumerate(open(path), 1):
        line = line.strip()
        if not line: continue
        try:
            r = json.loads(line)
        except Exception as e:
            rep(f"DROP {group}:{ln} bad json: {e}"); continue
        t = r.get("type")
        if t == "stat":
            stats.append(r); continue
        if t == "update":
            iata = (r.get("iata") or "").upper()
            if iata not in existing:
                rep(f"DROP {group}:{ln} update for unknown {iata}"); continue
            for d in r.get("lostDestinations") or []:
                to = (d.get("to") or "").upper()
                if not to or not valid_coords(d.get("toCoords")):
                    rep(f"DROP {group}:{ln} {iata} dest {to}: bad coords {d.get('toCoords')}"); continue
                existing[iata]["lostDestinations"].append(d)
                n_updates += 1
            if r.get("note"):
                notes.append(f"{iata} ({group}): {r['note']}")
            continue
        if t == "new":
            iata = (r.get("iata") or "").upper()
            if not iata:
                rep(f"DROP {group}:{ln} new record without iata"); continue
            if iata in existing:
                # treat as update instead
                for d in r.get("lostDestinations") or []:
                    if valid_coords(d.get("toCoords")):
                        existing[iata]["lostDestinations"].append(d)
                rep(f"NOTE {group}:{ln} new {iata} already exists -> folded destinations in")
                continue
            if iata in new_records:
                rep(f"NOTE {group}:{ln} duplicate new {iata} (keeping first)"); continue
            if not valid_coords(r.get("coordinates")):
                rep(f"DROP {group}:{ln} new {iata}: bad coords {r.get('coordinates')}"); continue
            if r.get("status") not in ("lost-all-service", "diminished"):
                rep(f"DROP {group}:{ln} new {iata}: bad status {r.get('status')}"); continue
            if not isinstance(r.get("population"), (int, float)) or r["population"] <= 0:
                rep(f"WARN {group}:{ln} new {iata}: population {r.get('population')}")
            r["group"] = group
            new_records[iata] = r
            continue
        rep(f"DROP {group}:{ln} unknown type {t}")

rep(f"Collected {n_updates} destination updates, {len(new_records)} new communities, {len(stats)} stats")

# ---------- merge updates into existing ----------
for iata, c in existing.items():
    # Hubs the original record already counted as LOST (EAS-only towns have
    # routesLost == 0: their formerHubs entry is the live subsidized link).
    base_ended = set(c["formerHubs"]) if c["routesLost"] > 0 else set()
    seen = set(c["formerHubs"])
    added = []
    # drop pre-deregulation route losses — out of the project's scope
    c["lostDestinations"] = [d for d in c["lostDestinations"]
                             if not (d.get("lastYear") and d["lastYear"] < 1979)]
    for d in c["lostDestinations"]:
        to = d["to"].upper()
        if to == iata: continue
        if to not in seen:
            seen.add(to); added.append(d)
            c["formerHubs"].append(to)
        if to not in hubs and valid_coords(d.get("toCoords")):
            hubs[to] = {"iata": to, "name": d.get("toName") or to,
                        "coordinates": d["toCoords"]}
    ended_updates = {d["to"].upper() for d in c["lostDestinations"] if d.get("lastYear")}
    c["routesLost"] = len(base_ended | ended_updates)
    if added:
        rep(f"UPDATE {iata}: +{len(added)} hubs -> {','.join(c['formerHubs'])} (routesLost={c['routesLost']})")

# ---------- prepare new communities ----------
def restorable(pop):
    if pop < 60000: return "R-50"
    if pop < 200000: return "R-75"
    return "R-100"

# Major airports whose "loss" is a hub-dehubbing story, not a community losing
# its air link — out of scope for this map.
EXCLUDE = {"CVG", "MEM", "STL", "PIT", "CLE", "MCI", "DAY"}

for iata, r in sorted(new_records.items()):
    if iata in EXCLUDE:
        rep(f"SKIP {iata}: major-airport dehubbing, out of scope"); continue
    if (r["status"] == "lost-all-service" and r.get("lastYearServed")
            and r["lastYearServed"] < 1979):
        rep(f"SKIP {iata} {r['city']}: lost service {r['lastYearServed']} (pre-deregulation)"); continue
    dests = []
    seenh = set()
    for d in r.get("lostDestinations") or []:
        to = (d.get("to") or "").upper()
        if not to or to == iata or to in seenh: continue
        if not valid_coords(d.get("toCoords")): continue
        if d.get("lastYear") and d["lastYear"] < 1979: continue
        seenh.add(to); dests.append(d)
        if to not in hubs:
            hubs[to] = {"iata": to, "name": d.get("toName") or to,
                        "coordinates": d["toCoords"]}
    ended = [d for d in dests if d.get("lastYear")]
    c = {
        "city": r["city"], "state": r["state"], "iata": iata,
        "coordinates": r["coordinates"],
        "population": int(r.get("population") or 0),
        "populationSource": "US Census 2020",
        "status": r["status"],
        "lastYearServed": r.get("lastYearServed"),
        "lastCarrier": r.get("lastCarrier") or "—",
        "routesLost": max(1, len(dests)) if r["status"] == "lost-all-service" else len(ended),
        "formerHubs": [d["to"].upper() for d in dests],
        "restorableBy": restorable(int(r.get("population") or 0)),
        "detail": r.get("detail"),
        "source": r.get("source") or "agent research",
        "verification": r.get("verification") if r.get("verification") in ("confirmed", "needs-check") else "needs-check",
        "lostDestinations": dests,
        "group": r.get("group"),
    }
    existing[iata] = c
    order.append(iata)
    rep(f"NEW {iata} {c['city']}, {c['state']} [{c['status']}] hubs={','.join(c['formerHubs'])} ({c['verification']})")

merged = {
    "communities": [existing[i] for i in order],
    "hubs": hubs,
    "stats": stats,
    "notes": notes,
}
json.dump(merged, open("/tmp/research/merged.json", "w"), indent=1)
open("/tmp/research/report.txt", "w").write("\n".join(report + ["", "CORRECTION NOTES:"] + notes))
print(f"communities: {len(order)}  hubs: {len(hubs)}  updates: {n_updates}  new: {len(new_records)}")
print(f"arcs (sum formerHubs): {sum(len(existing[i]['formerHubs']) for i in order)}")
print(f"report: /tmp/research/report.txt")
