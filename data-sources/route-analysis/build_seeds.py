#!/usr/bin/env python3
"""Build enriched seed datasets to the full community schema.
Distances/coords are computed (real). Service-loss facts are sourced to DOT
orders / GAO / news. Population + a few last-carrier fields are scaffolded for
the user's verification pass; the `source` and `verification` columns say which.
Outputs: lost_routes_seed.csv, communities.geojson, overcapable_seed.csv"""

import csv, json, os
from revia_route_analysis import (load_airports, load_aircraft, haversine_nm,
                                  revia_variant_for, score_overcapable)

HERE = os.path.dirname(os.path.abspath(__file__))
AP, AC = load_airports(), load_aircraft()

def coord(iata):
    if iata in AP:
        lat, lon = AP[iata][0], AP[iata][1]
        return round(lon, 4), round(lat, 4)   # (lng, lat)
    return None, None

# ---------------------------------------------------------------------------
# LOST / DIMINISHED communities. Fields researched & sourced.
# status: lost-all-service | diminished
# verification: confirmed (sourced to DOT order/news) | needs-check (scaffolded)
# ---------------------------------------------------------------------------
C = [
 dict(iata="JHW", city="Jamestown", state="NY", pop=28712, status="lost-all-service",
      last_year=2018, carrier="Southern Airways Express", routes_lost=1, hubs="PIT",
      human="Per-passenger subsidy hit $460 — more than double the $200 federal cap — and DOT pulled it.",
      source="DOT Order 2017-12-2 (eff. 2018-01-16); GAO-20-74; Post-Journal 2024", ver="confirmed"),
 dict(iata="FKL", city="Franklin/Oil City", state="PA", pop=6097, status="lost-all-service",
      last_year=2019, carrier="Southern Airways Express", routes_lost=1, hubs="PIT",
      human="Last service was a 19x-weekly 9-seat Cessna Caravan to Pittsburgh before EAS was withdrawn.",
      source="DOT Order 2019-8-17 (eff. 2019-10-18); ch-aviation 2019", ver="confirmed"),
 dict(iata="HGR", city="Hagerstown", state="MD", pop=43527, status="diminished",
      last_year=2019, carrier="Southern Airways Express (EAS); Allegiant retains leisure",
      routes_lost=2, hubs="BWI, PIT",
      human="Sits within 70nm of Dulles, BWI and National — that proximity is exactly why DOT cut the subsidy; only a 2x-weekly Allegiant flight to Orlando remains.",
      source="DOT Order 2019-10-10; ch-aviation 2019", ver="confirmed"),
 dict(iata="AHN", city="Athens", state="GA", pop=127315, status="lost-all-service",
      last_year=2014, carrier="(EAS, pre-2014) — confirm operator", routes_lost=1, hubs="ATL",
      human="Home of UGA, ~70 miles from Atlanta's hub; failed the 10-enplanements-per-day floor.",
      source="DOT Order 2014-6-6 (eff. 2014-09-30); Air Midwest shutdown 2008", ver="needs-check"),
 dict(iata="IGM", city="Kingman", state="AZ", pop=32689, status="lost-all-service",
      last_year=2015, carrier="Great Lakes Aviation", routes_lost=1, hubs="LAS",
      human="Served by Air Midwest Beech 1900Ds to 2008, restored, then lost EAS for good in 2015.",
      source="DOT Order 2015-3-6 (eff. 2015-05-01); Air Midwest 2008", ver="confirmed"),
 dict(iata="ELD", city="El Dorado", state="AR", pop=17756, status="lost-all-service",
      last_year=2008, carrier="Air Midwest (Beech 1900D)", routes_lost=1, hubs="DFW",
      human="South Arkansas oil town; lost its Dallas link when Mesa shut Air Midwest in June 2008.",
      source="Air Midwest shutdown (eff. 2008-06-30); DOT EAS reports", ver="needs-check"),
 dict(iata="CBE", city="Cumberland", state="MD", pop=19076, status="lost-all-service",
      last_year=None, carrier="(confirm — likely US Airways Express/Colgan era)", routes_lost=1, hubs="(confirm)",
      human='Allegany County seat, the "Queen City," walled off by ridge-and-valley terrain from the rest of Maryland.',
      source="Revia deck; US Census 2020 — confirm last service via DOT EAS list", ver="needs-check"),
 dict(iata="PRC", city="Prescott", state="AZ", pop=45827, status="diminished",
      last_year=2008, carrier="Air Midwest (2008); SkyWest/United Express restored service",
      routes_lost=1, hubs="PHX (lost), now DEN/LAX",
      human="Lost Air Midwest in 2008 but is now one of the rare restorations — SkyWest flies United Express to Denver and LA.",
      source="Air Midwest 2008; DOT waiver 2016; confirm current SkyWest schedule", ver="needs-check"),
 dict(iata="FMN", city="Farmington", state="NM", pop=46624, status="diminished",
      last_year=2008, carrier="Air Midwest (2008); subsidized service later restored",
      routes_lost=1, hubs="DEN",
      human="Four Corners hub city; lost Air Midwest in 2008, later reconnected to Denver under EAS.",
      source="Air Midwest 2008; confirm current EAS carrier", ver="needs-check"),
 # EAS-dependent (diminished — still served but only via federal subsidy)
 dict(iata="GGW", city="Glasgow", state="MT", pop=3353, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="BIL/MSP (EAS)",
      human="Routinely ranked the most isolated town in the lower 48 — the definition of an EAS lifeline.",
      source="Revia deck; DOT EAS subsidized report", ver="needs-check"),
 dict(iata="DVL", city="Devils Lake", state="ND", pop=7192, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="MSP (EAS)",
      human="Connected to Minneapolis only through federal subsidy after mainline regional service withdrew.",
      source="Revia deck; DOT EAS subsidized report", ver="needs-check"),
 dict(iata="BKX", city="Brookings", state="SD", pop=23377, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="MSP (EAS)",
      human="SDSU college town kept on the network only by EAS despite a 23k population.",
      source="Revia deck; DOT EAS subsidized report", ver="needs-check"),
 dict(iata="OLF", city="Wolf Point", state="MT", pop=2585, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="BIL (EAS)",
      human="On the Fort Peck Reservation; air service is a genuine medical-access lifeline.",
      source="Revia deck; DOT EAS subsidized report", ver="needs-check"),
 dict(iata="BFD", city="Bradford", state="PA", pop=7849, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="PIT (EAS)",
      human="Held a subsidy-cap waiver to stay in the program when others were cut.",
      source="Revia deck; ch-aviation 2018 waiver list", ver="needs-check"),
 dict(iata="LWT", city="Lewistown", state="MT", pop=5924, status="diminished",
      last_year=None, carrier="(current EAS carrier — confirm)", routes_lost=0, hubs="BIL (EAS)",
      human="Geographic center of Montana; reachable by scheduled air only through EAS.",
      source="Revia deck; DOT EAS subsidized report", ver="needs-check"),
]

lost_rows, features = [], []
for r in C:
    lng, lat = coord(r["iata"])
    rv = revia_variant_for(50, None) if lng is None else "R-50"
    row = {
        "city": r["city"], "state": r["state"], "iata": r["iata"],
        "lng": lng, "lat": lat, "coordinates": f"[{lng}, {lat}]" if lng is not None else "",
        "population": r["pop"] if r["pop"] is not None else "",
        "population_source": "US Census 2020",
        "status": r["status"],
        "last_year_served": r["last_year"] if r["last_year"] else "",
        "last_carrier": r["carrier"],
        "routes_lost": r["routes_lost"],
        "former_hubs": r["hubs"],
        "revia_variant": "R-50",
        "human_detail": r["human"],
        "source": r["source"],
        "verification": r["ver"],
    }
    lost_rows.append(row)
    if lng is not None:
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lng, lat]},
            "properties": {k: v for k, v in row.items() if k not in ("lng", "lat", "coordinates")},
        })

# ---------------------------------------------------------------------------
# OVER-CAPABLE seed — enriched with endpoint city/state, coords, source.
# ---------------------------------------------------------------------------
CITY = {  # iata: (city, state)
 "HNL":("Honolulu","HI"),"OGG":("Kahului","HI"),"SEA":("Seattle","WA"),"PDX":("Portland","OR"),
 "DTW":("Detroit","MI"),"CLE":("Cleveland","OH"),"ORD":("Chicago","IL"),"GRR":("Grand Rapids","MI"),
 "LGA":("New York","NY"),"DCA":("Washington","DC"),"BOS":("Boston","MA"),"DAL":("Dallas","TX"),
 "HOU":("Houston","TX"),"AUS":("Austin","TX"),"LAX":("Los Angeles","CA"),"LAS":("Las Vegas","NV"),
 "SFO":("San Francisco","CA"),"ATL":("Atlanta","GA"),"CLT":("Charlotte","NC"),"DFW":("Dallas","TX"),
 "IAH":("Houston","TX"),"PHX":("Phoenix","AZ"),"MSP":("Minneapolis","MN"),"DEN":("Denver","CO"),
 "COS":("Colorado Springs","CO"),"FLL":("Fort Lauderdale","FL"),"MCO":("Orlando","FL"),
 "JFK":("New York","NY"),"MDW":("Chicago","IL"),"STL":("St. Louis","MO"),"SAN":("San Diego","CA"),
 "TUS":("Tucson","AZ"),"SBA":("Santa Barbara","CA"),
}
overcap = [
 ("HNL","OGG","A21N"),("SEA","PDX","B738"),("DTW","CLE","E75L"),("ORD","GRR","E75L"),
 ("LGA","DCA","A319"),("BOS","LGA","E75L"),("DAL","HOU","B738"),("DAL","AUS","B738"),
 ("LAX","LAS","A320"),("LAX","SFO","A21N"),("ATL","CLT","B739"),("DFW","IAH","B738"),
 ("PHX","LAS","A320"),("MSP","ORD","A319"),("CLE","ORD","A319"),("DEN","COS","E75L"),
 ("IAH","AUS","E75L"),("FLL","MCO","B738"),("JFK","BOS","E190"),("DCA","BOS","A320"),
 ("ORD","DTW","A320"),("MDW","STL","B738"),("SAN","LAX","A320"),("PHX","TUS","CRJ9"),
 ("LAX","SBA","E75L"),
]
oc_rows = []
for o, d, code in overcap:
    olng, olat = coord(o); dlng, dlat = coord(d); ac = AC.get(code.upper())
    if olng is None or dlng is None or not ac:
        continue
    dist = haversine_nm(olat, olng, dlat, dlng)
    ratio, flag = score_overcapable(dist, ac)
    oc_rows.append({
        "origin_iata": o, "origin_city": CITY.get(o,("",""))[0], "origin_state": CITY.get(o,("",""))[1],
        "dest_iata": d, "dest_city": CITY.get(d,("",""))[0], "dest_state": CITY.get(d,("",""))[1],
        "origin_coordinates": f"[{olng}, {olat}]", "dest_coordinates": f"[{dlng}, {dlat}]",
        "distance_nm": dist, "aircraft": ac["name"], "ac_seats": ac["seats"], "ac_range_nm": ac["range_nm"],
        "capability_ratio": ratio, "flag": flag,
        "revia_variant": revia_variant_for(ac["seats"], dist),
        "source": "Aircraft range: mfr/industry specs. Route+equipment: illustrative real route; frequency/passengers pending DOT T-100.",
        "verification": "ratio-confirmed; traffic needs-T-100",
    })
oc_rows.sort(key=lambda x: (x["flag"] != "SEVERE", -x["capability_ratio"]))

def write(path, rows, fields):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader()
        for r in rows: w.writerow(r)

write(os.path.join(HERE,"lost_routes_seed.csv"), lost_rows,
      ["city","state","iata","lng","lat","coordinates","population","population_source",
       "status","last_year_served","last_carrier","routes_lost","former_hubs",
       "revia_variant","human_detail","source","verification"])
write(os.path.join(HERE,"overcapable_seed.csv"), oc_rows,
      ["origin_iata","origin_city","origin_state","dest_iata","dest_city","dest_state",
       "origin_coordinates","dest_coordinates","distance_nm","aircraft","ac_seats","ac_range_nm",
       "capability_ratio","flag","revia_variant","source","verification"])
with open(os.path.join(HERE,"communities.geojson"),"w",encoding="utf-8") as f:
    json.dump({"type":"FeatureCollection","features":features}, f, indent=1)

print(f"lost_routes_seed.csv: {len(lost_rows)} communities "
      f"({sum(1 for r in lost_rows if r['status']=='lost-all-service')} lost-all-service, "
      f"{sum(1 for r in lost_rows if r['status']=='diminished')} diminished)")
print(f"  confirmed: {sum(1 for r in lost_rows if r['verification']=='confirmed')}, "
      f"needs-check: {sum(1 for r in lost_rows if r['verification']=='needs-check')}")
print(f"communities.geojson: {len(features)} mapped points")
print(f"overcapable_seed.csv: {len(oc_rows)} routes")
