#!/usr/bin/env python3
"""Generate src/data/communities.ts and src/data/hubs.ts from merged.json."""
import json, re, sys
from datetime import date

REPO = "/home/user/Revia"
M = json.load(open("/tmp/research/merged.json"))

def esc(s):
    return (s or "").replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()

def fmt_coord(v):
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return s if s else "0"

def emit_community(c):
    lines = ["  {"]
    lines.append(f'    city: "{esc(c["city"])}",')
    lines.append(f'    state: "{esc(c["state"])}",')
    lines.append(f'    iata: "{c["iata"]}",')
    lines.append(f'    coordinates: [{fmt_coord(c["coordinates"][0])}, {fmt_coord(c["coordinates"][1])}],')
    lines.append(f'    population: {int(c["population"])},')
    lines.append(f'    populationSource: "{esc(c.get("populationSource") or "US Census 2020")}",')
    lines.append(f'    status: "{c["status"]}",')
    y = c.get("lastYearServed")
    lines.append(f'    lastYearServed: {int(y) if y is not None else "null"},')
    lines.append(f'    lastCarrier: "{esc(c.get("lastCarrier"))}",')
    lines.append(f'    routesLost: {int(c["routesLost"])},')
    hubs = ", ".join(f'"{h}"' for h in c["formerHubs"])
    lines.append(f'    formerHubs: [{hubs}],')
    lines.append(f'    restorableBy: "{c["restorableBy"]}",')
    if c.get("detail"):
        lines.append(f'    detail:')
        lines.append(f'      "{esc(c["detail"])}",')
    lines.append(f'    source: "{esc(c.get("source"))}",')
    lines.append(f'    verification: "{c["verification"]}",')
    lines.append("  },")
    return "\n".join(lines)

coms = M["communities"]
# stable ordering: by state then city
coms_sorted = sorted(coms, key=lambda c: (c["state"], c["city"]))

header = f'''import type {{ Community, Verification }} from "@/lib/types";

/**
 * SOURCED DATASET — documented lost / diminished / EAS-dependent communities.
 * Coordinates are real airport positions; population is US Census 2020.
 * Each row carries its `source` and a `verification` flag:
 * `confirmed` (traced to a DOT order / GAO / contemporaneous news) or
 * `needs-check` (the `source` cell says what to confirm). The `verified`
 * boolean is derived from that so the UI keeps its honesty.
 *
 * Built from a 24-group state-by-state research sweep ({date.today():%B %Y})
 * against DOT/EAS orders, GAO reports, Wikipedia airport service histories,
 * and local news archives, layered on the prior verified seed. `formerHubs`
 * now lists every documented severed nonstop link (not just the primary
 * hub), which is what the map's arc layer draws. Scope: losses since
 * airline deregulation (~1979); pre-deregulation exits are excluded.
 *
 * See `data-sources/route-analysis/METHODOLOGY.md` for the T-100 pipeline
 * that can re-derive the national dataset from BTS data.
 */
type Seed = Omit<Community, "id" | "verified"> & {{
  verification: Verification;
}};

const seed: Seed[] = [
'''

body = []
cur_state = None
STATE_NAMES = {}
for c in coms_sorted:
    if c["state"] != cur_state:
        cur_state = c["state"]
        body.append(f"\n  // ── {cur_state} ──────────────────────────────────────────────")
    body.append(emit_community(c))

footer = '''];

export const communities: Community[] = seed.map((c) => ({
  ...c,
  id: c.iata.toLowerCase(),
  verified: c.verification === "confirmed",
}));
'''

open(f"{REPO}/src/data/communities.ts", "w").write(header + "\n".join(body) + "\n" + footer)

# ---------- hubs.ts ----------
hubs = M["hubs"]
hub_lines = []
for iata in sorted(hubs):
    h = hubs[iata]
    hub_lines.append(
        f'  {iata}: {{ iata: "{iata}", name: "{esc(h["name"])}", '
        f'coordinates: [{fmt_coord(h["coordinates"][0])}, {fmt_coord(h["coordinates"][1])}] }},')

hubs_src = f'''import type {{ LngLat }} from "@/lib/types";

/**
 * Every destination airport referenced by a community's `formerHubs` —
 * the other end of each severed (or subsidy-dependent) nonstop link.
 * Coordinates are real airport positions. Names are the common city name.
 */
export interface Hub {{
  iata: string;
  name: string;
  coordinates: LngLat;
}}

export const hubs: Record<string, Hub> = {{
{chr(10).join(hub_lines)}
}};
'''
open(f"{REPO}/src/data/hubs.ts", "w").write(hubs_src)

n_arcs = sum(len(c["formerHubs"]) for c in coms)
n_conf = sum(1 for c in coms if c["verification"] == "confirmed")
n_lost = sum(1 for c in coms if c["status"] == "lost-all-service")
print(f"communities.ts: {len(coms)} records ({n_conf} confirmed, {n_lost} lost-all-service)")
print(f"hubs.ts: {len(hubs)} destination airports; arcs drawn: {n_arcs}")
print(f"sum routesLost: {sum(c['routesLost'] for c in coms)}")
