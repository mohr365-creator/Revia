#!/usr/bin/env python3
"""
Revia route-opportunity analysis pipeline
==========================================

Two products from one BTS T-100 Domestic Segment file:

  1. LOST ROUTES   - city-pairs that had nonstop service in a baseline year and
                     have none (or near-none) in a recent year. Classified as
                     "lost all service" (an endpoint went dark) vs "diminished"
                     (both endpoints still served, but the direct link is gone -
                     travelers now connect through a hub).

  2. OVER-CAPABLE  - current segments under a distance threshold (default 1000nm)
                     flown by aircraft whose max range vastly exceeds the mission.
                     Each is scored by a capability ratio (aircraft range / stage
                     length) and mapped to the right-sized Revia variant.

Data inputs
-----------
  airports_raw.dat        OpenFlights airport coordinates (already fetched)
  aircraft_reference.csv  type code -> seats, max range, category
  <t100_segment.csv>      BTS T-100 Domestic Segment export (you download this)

The sandbox cannot reach bts.gov directly. Download the T-100 file yourself
(see METHODOLOGY.md, "Getting the raw data"), drop it in this folder, and run:

    python3 revia_route_analysis.py --t100 T_T100D_SEGMENT_ALL_CARRIER.csv \
        --baseline-year 2005 --recent-year 2024

Distances and capability ratios are REAL (computed from coordinates + verified
ranges). Passenger/frequency counts come from the T-100 file you supply.
"""

import argparse, csv, math, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))

# Revia regional family envelope (from project brief / deck)
REVIA = {
    "R-50":  {"seats": 50,  "range_nm": 1400},
    "R-75":  {"seats": 76,  "range_nm": 900},
    "R-100": {"seats": 100, "range_nm": 550},
}
DIST_THRESHOLD_NM = 1000      # user's "under 1000nm" filter
OVERCAP_RATIO_FLAG = 2.5      # range/stage >= this => carrying significant unused range
OVERCAP_RATIO_SEVERE = 5.0    # >= this => egregiously over-ranged for the mission


# ----------------------------------------------------------------------------
# Reference loaders
# ----------------------------------------------------------------------------
def load_airports(path=os.path.join(HERE, "airports_raw.dat")):
    """IATA -> (lat, lon, city, country). OpenFlights format."""
    ap = {}
    with open(path, encoding="utf-8") as f:
        for row in csv.reader(f):
            if len(row) < 8:
                continue
            iata = row[4].strip('"')
            if not iata or iata == "\\N" or len(iata) != 3:
                continue
            try:
                lat, lon = float(row[6]), float(row[7])
            except ValueError:
                continue
            ap[iata] = (lat, lon, row[2].strip('"'), row[3].strip('"'))
    # merge supplemental small/EAS airports missing from OpenFlights
    supp = os.path.join(HERE, "airport_supplement.csv")
    if os.path.exists(supp):
        with open(supp, encoding="utf-8") as f:
            for r in csv.DictReader(f):
                ap[r["iata"].strip().upper()] = (
                    float(r["lat"]), float(r["lon"]), r["city"], r["country"])
    return ap


def load_aircraft(path=os.path.join(HERE, "aircraft_reference.csv")):
    ac = {}
    with open(path, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            ac[r["aircraft_code"].strip().upper()] = {
                "name": r["aircraft_name"],
                "seats": int(r["typical_seats"]),
                "range_nm": int(r["max_range_nm"]),
                "category": r["category"],
                "notes": r["notes"],
            }
    return ac


def haversine_nm(lat1, lon1, lat2, lon2):
    R = 3440.065  # nautical miles
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return round(2 * R * math.asin(math.sqrt(a)), 1)


# ----------------------------------------------------------------------------
# Revia mapping + over-capability scoring
# ----------------------------------------------------------------------------
def revia_variant_for(seats, stage_nm):
    """Right-sized Revia variant by incumbent seat count, with a range sanity check."""
    if seats <= 55:
        v = "R-50"
    elif seats <= 85:
        v = "R-75"
    elif seats <= 110:
        v = "R-100"
    else:
        return "above R-100 (Phase 2 narrowbody story)"
    # all three variants comfortably cover a sub-1000nm mission
    return v if stage_nm <= REVIA[v]["range_nm"] else f"{v} (range-limited; check payload-range)"


def score_overcapable(stage_nm, ac):
    """Return (capability_ratio, flag) for an aircraft flying a given stage."""
    if stage_nm <= 0:
        return None, None
    ratio = round(ac["range_nm"] / stage_nm, 1)
    if ratio >= OVERCAP_RATIO_SEVERE:
        flag = "SEVERE"
    elif ratio >= OVERCAP_RATIO_FLAG:
        flag = "FLAG"
    else:
        flag = "ok"
    return ratio, flag


# ----------------------------------------------------------------------------
# T-100 ingestion (BTS standard schema)
# ----------------------------------------------------------------------------
# BTS T-100 Domestic Segment columns of interest (names are stable):
#   YEAR, ORIGIN, DEST, AIRCRAFT_TYPE (or UNIQUE field), PASSENGERS, SEATS,
#   DEPARTURES_PERFORMED, UNIQUE_CARRIER. Aircraft type in T-100 is a numeric
#   code (AIRCRAFT_TYPE) joined via the L_AIRCRAFT_TYPE lookup, OR many public
#   exports already carry a readable type. This loader accepts either an IATA
#   aircraft code column ("AIRCRAFT_CODE"/"AC_TYPE") or maps via an optional
#   --actype-lookup file. Adjust COLMAP if your export differs.
COLMAP = {
    "year": ["YEAR"],
    "origin": ["ORIGIN"],
    "dest": ["DEST"],
    "passengers": ["PASSENGERS"],
    "seats": ["SEATS"],
    "departures": ["DEPARTURES_PERFORMED", "DEPARTURES"],
    "carrier": ["UNIQUE_CARRIER", "CARRIER"],
    "actype": ["AIRCRAFT_CODE", "AC_TYPE", "AIRCRAFT_TYPE"],
}


def _pick(header, names):
    for n in names:
        if n in header:
            return n
    return None


def ingest_t100(path):
    """Yield standardized segment dicts from a BTS T-100 export."""
    with open(path, encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        h = reader.fieldnames or []
        cols = {k: _pick(h, v) for k, v in COLMAP.items()}
        missing = [k for k in ("origin", "dest", "passengers") if not cols[k]]
        if missing:
            raise SystemExit(f"T-100 file missing expected columns for: {missing}\nFound: {h}")
        for row in reader:
            def num(key):
                try:
                    return float(row.get(cols[key], 0) or 0)
                except ValueError:
                    return 0.0
            yield {
                "year": row.get(cols["year"], ""),
                "origin": (row.get(cols["origin"]) or "").strip().upper(),
                "dest": (row.get(cols["dest"]) or "").strip().upper(),
                "pax": num("passengers"),
                "seats": num("seats"),
                "deps": num("departures"),
                "carrier": row.get(cols["carrier"], ""),
                "actype": (row.get(cols["actype"]) or "").strip().upper(),
            }


def aggregate_pairs(rows):
    """Collapse directional segments into undirected city-pair totals."""
    agg = defaultdict(lambda: {"pax": 0.0, "deps": 0.0, "seats": 0.0, "actypes": defaultdict(float)})
    for r in rows:
        if not r["origin"] or not r["dest"]:
            continue
        key = tuple(sorted((r["origin"], r["dest"])))
        a = agg[key]
        a["pax"] += r["pax"]; a["deps"] += r["deps"]; a["seats"] += r["seats"]
        if r["actype"]:
            a["actypes"][r["actype"]] += r["deps"]
    return agg


def analyze_lost(baseline_rows, recent_rows, airports, min_baseline_deps=200):
    base, rec = aggregate_pairs(baseline_rows), aggregate_pairs(recent_rows)
    rec_endpoints = {ap for pair in rec for ap in pair if rec[pair]["deps"] > 0}
    out = []
    for pair, b in base.items():
        if b["deps"] < min_baseline_deps:
            continue
        r = rec.get(pair, {"deps": 0})
        if r["deps"] >= max(50, 0.1 * b["deps"]):
            continue  # still meaningfully served
        o, d = pair
        if o in airports and d in airports:
            dist = haversine_nm(airports[o][0], airports[o][1], airports[d][0], airports[d][1])
        else:
            dist = None
        both_alive = o in rec_endpoints and d in rec_endpoints
        out.append({
            "origin": o, "dest": d, "distance_nm": dist,
            "baseline_deps": int(b["deps"]), "recent_deps": int(r["deps"]),
            "status": "diminished (connect via hub)" if both_alive else "lost all service (endpoint dark)",
            "restorable_by": revia_variant_for(50, dist) if dist and dist <= 1400 else "out of regional range",
        })
    out.sort(key=lambda x: x["baseline_deps"], reverse=True)
    return out


def analyze_overcapable(recent_rows, airports, aircraft, dist_threshold=DIST_THRESHOLD_NM):
    out = []
    for r in recent_rows:
        o, d, ac_code = r["origin"], r["dest"], r["actype"]
        if not (o in airports and d in airports) or ac_code not in aircraft:
            continue
        dist = haversine_nm(airports[o][0], airports[o][1], airports[d][0], airports[d][1])
        if dist <= 0 or dist > dist_threshold:
            continue
        ac = aircraft[ac_code]
        ratio, flag = score_overcapable(dist, ac)
        if flag in ("FLAG", "SEVERE"):
            out.append({
                "origin": o, "dest": d, "distance_nm": dist,
                "aircraft": ac["name"], "ac_seats": ac["seats"], "ac_range_nm": ac["range_nm"],
                "capability_ratio": ratio, "flag": flag,
                "departures": int(r["deps"]), "passengers": int(r["pax"]),
                "revia_fit": revia_variant_for(ac["seats"], dist),
            })
    out.sort(key=lambda x: (x["flag"] != "SEVERE", -x["capability_ratio"]))
    return out


def write_csv(path, rows, fields):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow(r)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--t100", help="BTS T-100 segment CSV (recent year)")
    p.add_argument("--baseline-t100", help="BTS T-100 segment CSV (baseline year, for lost-routes)")
    p.add_argument("--dist-threshold", type=float, default=DIST_THRESHOLD_NM)
    p.add_argument("--outdir", default=HERE)
    args = p.parse_args()

    airports, aircraft = load_airports(), load_aircraft()
    print(f"Loaded {len(airports)} airports, {len(aircraft)} aircraft types.")

    if args.t100:
        recent = list(ingest_t100(args.t100))
        oc = analyze_overcapable(recent, airports, aircraft, args.dist_threshold)
        write_csv(os.path.join(args.outdir, "overcapable_routes.csv"), oc,
                  ["origin","dest","distance_nm","aircraft","ac_seats","ac_range_nm",
                   "capability_ratio","flag","departures","passengers","revia_fit"])
        print(f"Over-capable: {len(oc)} flagged segments -> overcapable_routes.csv")
        if args.baseline_t100:
            base = list(ingest_t100(args.baseline_t100))
            lost = analyze_lost(base, recent, airports)
            write_csv(os.path.join(args.outdir, "lost_routes.csv"), lost,
                      ["origin","dest","distance_nm","baseline_deps","recent_deps","status","restorable_by"])
            print(f"Lost routes: {len(lost)} pairs -> lost_routes.csv")
    else:
        print("No --t100 supplied. Run with a BTS T-100 file to generate full results.")
        print("See METHODOLOGY.md for the download steps. Seed datasets are in *_seed.csv.")


if __name__ == "__main__":
    main()
