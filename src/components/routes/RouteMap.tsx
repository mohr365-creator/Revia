"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { clsx } from "clsx";
import type { Community, LngLat, LostRoute } from "@/lib/types";
import { FlightArc } from "./FlightArc";
import { CommunityPanel } from "./CommunityPanel";
import { MapFilters } from "./MapFilters";
import { HeadlineCounter } from "./HeadlineCounter";
import {
  defaultFilters,
  firstLossYear,
  regionOf,
  TIMELINE_MAX,
  type MapFilterState,
} from "./filters";

const GEO_URL = "/geo/us-states-10m.json";

// The restoration view tells a single story — everything Revia brings back —
// so the whole network lights up in one warm orange rather than splitting the
// map into three variant colors. The R-50/R-75/R-100 filter narrows which of
// those orange links are shown.
const RESTORATION_ORANGE = "#E89556";

function matches(c: Community, f: MapFilterState): boolean {
  if (f.status !== "all" && c.status !== f.status) return false;
  if (f.restorableBy !== "all" && c.restorableBy !== f.restorableBy) return false;
  // Date each community by its first documented severed link, so the
  // timeline builds up loss by loss. Towns with no dated loss (purely
  // subsidy-dependent) only appear at "today".
  const firstLoss = firstLossYear(c);
  if (firstLoss == null) {
    if (f.throughYear < TIMELINE_MAX) return false;
  } else if (firstLoss > f.throughYear) {
    return false;
  }
  if (f.region !== "all" && regionOf(c.coordinates[0], c.coordinates[1]) !== f.region)
    return false;
  return true;
}

interface RouteMapProps {
  communities: Community[];
  routes: LostRoute[];
  /** Non-interactive teaser used on the home page. */
  preview?: boolean;
  /**
   * "lost" tells the story of the severed network and keeps Revia out of
   * the frame; "restoration" colors the same data by the variant that
   * brings each link back.
   */
  view?: "lost" | "restoration";
  className?: string;
}

export function RouteMap({
  communities,
  routes,
  preview = false,
  view = "lost",
  className,
}: RouteMapProps) {
  const restoration = view === "restoration";
  const [filters, setFilters] = useState<MapFilterState>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // After = the network as it is now (extinguished). Before = as it was (lit).
  // The restoration story opens on the lit "Restored" state, so the map starts
  // glowing orange; the lost-connections view opens on today's dark network.
  const [mode, setMode] = useState<"before" | "after">(
    view === "restoration" ? "before" : "after",
  );

  const activeFilters = preview ? defaultFilters : filters;

  const visibleCommunities = useMemo(
    () =>
      preview
        ? communities
        : communities.filter((c) => matches(c, activeFilters)),
    [communities, activeFilters, preview],
  );

  const visibleIds = useMemo(
    () => new Set(visibleCommunities.map((c) => c.id)),
    [visibleCommunities],
  );

  const totalPopulation = useMemo(
    () => visibleCommunities.reduce((sum, c) => sum + c.population, 0),
    [visibleCommunities],
  );

  const visibleRoutes = useMemo(
    () =>
      routes.filter((r) => {
        if (!visibleIds.has(r.fromId)) return false;
        // Each arc carries its own end year: only draw links already severed
        // by the slider year. Ongoing (subsidized) links draw only at "today".
        if (r.lastYearServed == null)
          return activeFilters.throughYear >= TIMELINE_MAX;
        return r.lastYearServed <= activeFilters.throughYear;
      }),
    [routes, visibleIds, activeFilters.throughYear],
  );

  // The integrated hubs that surviving routes merge into — one white dot per
  // distinct destination, deduped by hub IATA.
  const visibleHubs = useMemo(() => {
    const seen = new Map<string, LngLat>();
    for (const r of visibleRoutes) {
      if (!seen.has(r.toId)) seen.set(r.toId, r.to);
    }
    return Array.from(seen, ([toId, coordinates]) => ({ toId, coordinates }));
  }, [visibleRoutes]);

  const selected = selectedId
    ? communities.find((c) => c.id === selectedId) ?? null
    : null;

  const focusedId = hoveredId ?? selectedId;

  const lit = mode === "before";

  const map = (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 1050 }}
      width={880}
      height={500}
      style={{ width: "100%", height: "auto" }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: "#16244d",
                  stroke: "rgba(255,244,225,0.08)",
                  strokeWidth: 0.5,
                  outline: "none",
                },
                hover: {
                  fill: "#16244d",
                  stroke: "rgba(255,244,225,0.08)",
                  outline: "none",
                },
                pressed: { fill: "#16244d", outline: "none" },
              }}
            />
          ))
        }
      </Geographies>

      {visibleRoutes.map((r) => {
        const isFocused = focusedId === r.fromId;
        const litStroke = restoration
          ? RESTORATION_ORANGE
          : r.status === "lost-all-service"
            ? "#D86F3C"
            : "#F2C97D";
        const stroke = lit || isFocused ? litStroke : "#FFF4E1";
        const opacity = lit ? 0.55 : isFocused ? 0.85 : 0.14;
        return (
          <FlightArc
            key={r.id}
            from={r.from}
            to={r.to}
            stroke={stroke}
            strokeWidth={isFocused ? 1.4 : 0.8}
            strokeLinecap="round"
            fill="none"
            style={{ opacity, transition: "opacity 300ms, stroke 300ms" }}
          />
        );
      })}

      {visibleHubs.map((h) => (
        <Marker key={h.toId} coordinates={h.coordinates}>
          <circle
            r={3.2}
            fill="#FFF4E1"
            fillOpacity={0.95}
            stroke="var(--navy)"
            strokeWidth={0.8}
          />
        </Marker>
      ))}

      {visibleCommunities.map((c) => {
        const isFocused = focusedId === c.id;
        const isLostAll = c.status === "lost-all-service";
        const r = Math.max(2.5, Math.min(7, 2.4 + c.routesLost * 0.7));
        const fill = restoration
          ? RESTORATION_ORANGE
          : isLostAll
            ? "#D86F3C"
            : "#F2C97D";
        return (
          <Marker key={c.id} coordinates={c.coordinates}>
            {isFocused && (
              <circle
                r={r + 4}
                fill="none"
                stroke="var(--amber)"
                strokeWidth={1}
                opacity={0.7}
              />
            )}
            <circle
              r={r}
              fill={fill}
              fillOpacity={isLostAll ? 0.9 : 0.6}
              stroke="var(--navy)"
              strokeWidth={0.6}
              style={{ cursor: preview ? "default" : "pointer" }}
              onMouseEnter={preview ? undefined : () => setHoveredId(c.id)}
              onMouseLeave={preview ? undefined : () => setHoveredId(null)}
              onClick={preview ? undefined : () => setSelectedId(c.id)}
            />
          </Marker>
        );
      })}
    </ComposableMap>
  );

  if (preview) {
    return (
      <div className={clsx("relative", className)}>
        <div className="pointer-events-none select-none opacity-90">{map}</div>
      </div>
    );
  }

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {!restoration && (
          <HeadlineCounter
            communities={visibleCommunities.length}
            routes={visibleRoutes.length}
            restoration={restoration}
          />
        )}
        <div className="inline-flex rounded-full border border-cream/15 p-1 text-xs lg:ml-auto">
          {(["after", "before"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={clsx(
                "rounded-full px-4 py-1.5 transition-colors",
                mode === m ? "bg-amber text-navy" : "text-cream/70 hover:text-amber",
              )}
            >
              {restoration
                ? m === "after"
                  ? "Today"
                  : "Restored"
                : m === "after"
                  ? "As it is"
                  : "As it was"}
            </button>
          ))}
        </div>
      </div>

      <MapFilters
        filters={filters}
        onChange={setFilters}
        showRestorable={restoration}
        showRegion={!restoration}
        showTimeline={!restoration}
        restoration={restoration}
      />

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-cream/10 bg-navy/40 p-2">
          {map}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3 pb-2 pt-1 text-xs text-cream/50">
            {restoration ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: RESTORATION_ORANGE }}
                />{" "}
                Community Revia can restore
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ember" /> Lost all service
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-saffron opacity-60" /> Diminished
                </span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cream" /> Integrated hub
            </span>
          </div>
          <div className="mx-3 mb-2 mt-1 border-t border-cream/10 pt-3 text-center">
            <span className="font-serif text-2xl text-amber">
              {totalPopulation.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-cream/70">
              {restoration
                ? "people Revia could reconnect across the communities shown"
                : "people live in the communities shown on this map"}
            </span>
          </div>
        </div>
        <CommunityPanel
          community={selected}
          showRestoration={restoration}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
