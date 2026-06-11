import { geoAlbersUsa } from "d3-geo";
import fs from "fs";
const proj = geoAlbersUsa();
const M = JSON.parse(fs.readFileSync("/tmp/research/merged.json", "utf8"));
const badHubs = [];
for (const [iata, h] of Object.entries(M.hubs)) {
  if (!proj(h.coordinates)) badHubs.push(iata);
}
const badComs = M.communities.filter((c) => !proj(c.coordinates)).map((c) => c.iata);
console.log("unprojectable hubs:", badHubs.join(",") || "none");
console.log("unprojectable communities:", badComs.join(",") || "none");
for (const iata of badHubs) delete M.hubs[iata];
M.communities = M.communities.filter((c) => !badComs.includes(c.iata));
for (const c of M.communities) {
  c.formerHubs = c.formerHubs.filter((h) => M.hubs[h]);
  c.lostDestinations = (c.lostDestinations || []).filter((d) => M.hubs[d.to.toUpperCase()]);
}
fs.writeFileSync("/tmp/research/merged.json", JSON.stringify(M, null, 1));
console.log("cleaned:", M.communities.length, "communities,", Object.keys(M.hubs).length, "hubs");
