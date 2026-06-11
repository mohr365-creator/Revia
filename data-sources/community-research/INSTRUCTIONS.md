# Revia air-service-loss research agent instructions

You research US communities that lost scheduled commercial air service (or saw it significantly diminished) since ~1980, plus EAS-subsidy-dependent towns. Use WebSearch and WebFetch (Wikipedia airport articles — "Airlines and destinations", former-destinations and history sections — DOT/EAS orders, GAO reports, local news). Do NOT edit any repo files.

## EFFICIENCY RULES (critical)
- HARD CAP: at most 35 WebSearch/WebFetch calls total. Budget them; prefer one Wikipedia airport-page fetch per community (it usually has the whole service history).
- APPEND each finding to YOUR OUTPUT FILE (given in your task prompt) AS SOON as you finish a community — one compact single-line JSON object per line (JSONL). Do not wait until the end. Use Bash: cat >> file <<'JSON' ... JSON  (or python). Never rewrite the file.
- When you near the cap, stop searching and finish writing what you have. Your final reply should be ONLY a one-line summary like: "wrote N update + M new records".

## TASK A — for each EXISTING community listed in your prompt (format IATA(City->knownHubs)):
Find the FULL set of scheduled nonstop destinations it lost since ~1980 beyond the known ones. Max 6 per community, most significant. Append:
{"type":"update","iata":"XXX","lostDestinations":[{"to":"ORD","toName":"Chicago O'Hare","toCoords":[-87.9048,41.9786],"lastYear":2021,"carrier":"...","source":"short citation"}],"note":"optional factual corrections to the existing record"}

## TASK B — find communities in your states NOT already documented that (a) lost ALL scheduled service since ~1980, (b) lost major hub connections but retain some service, or (c) are EAS-dependent today. Max 12, most significant & sourceable. Skip airports that never had scheduled service. Append:
{"type":"new","city":"...","state":"XX","iata":"XXX","coordinates":[-00.0,00.0],"population":12345,"status":"lost-all-service","lastYearServed":2019,"lastCarrier":"...","lostDestinations":[{"to":"ORD","toName":"Chicago O'Hare","toCoords":[-87.9048,41.9786],"lastYear":2019,"carrier":"...","source":"..."}],"detail":"one sentence with a concrete sourced fact","source":"primary citation","verification":"confirmed"}

## DATA RULES
- Only facts attributable to a real source. verification "confirmed" = traced to DOT order / GAO / contemporaneous news; else "needs-check".
- coordinates / toCoords = AIRPORT position [longitude, latitude], longitude negative in the US.
- population = 2020 US Census for the city. status: "lost-all-service" (zero scheduled service today) or "diminished" (lost routes but retains some, or EAS-dependent). lastYearServed = year last scheduled service ended, or null if still served (EAS/diminished ongoing).
