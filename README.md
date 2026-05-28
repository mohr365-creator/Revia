# Revia — Company Website

> _The way, revived._

The Revia company website, built from `REVIA_WEBSITE_SPEC.md`. Next.js (App
Router) + TypeScript + Tailwind, dark-default editorial design, with an
interactive map of the severed regional network as the signature feature.

## Quick start

```bash
npm install          # installs deps + copies the US TopoJSON into /public (postinstall not used; run setup:geo if needed)
npm run setup:geo    # copies node_modules/us-atlas/states-10m.json -> public/geo/
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS, Dawn tokens as CSS variables (`src/app/globals.css`) |
| Map | `react-simple-maps` + `d3-geo` great-circle arcs (self-hosted TopoJSON) |
| Fonts | Self-hosted woff2 via `@fontsource` (Antonio · Fraunces · Inter) |

## Project shape

```
src/
  app/                 routes (home, mission, routes, aircraft/*, technology, company, newsroom, contact)
  components/
    brand/             Wordmark, ArcMark
    layout/            Header, Footer, PageHeader
    ui/                Container, Section, Button, Eyebrow, DataFlag
    home/              the home scroll-narrative sections
    routes/            RouteMap (the signature feature) + filters/panel/counter
    aircraft/          VariantCard, AircraftSilhouette
    contact/           ContactForm
  data/                site, communities, hubs, routes, overcapable, stats, aircraft
  lib/                 types, geo helpers
public/geo/            us-states-10m.json (self-hosted)
data-sources/          route-analysis pipeline + seed CSVs/GeoJSON (data provenance)
```

## ⚠️ What I need from you (placeholders to resolve before launch)

Every placeholder is marked in the UI with a `⚠` **DataFlag** so nothing
unsourced ships disguised as fact.

1. ~~**The "840+ routes" number.**~~ **Resolved.** Per the route-analysis
   methodology, that figure was never cleanly sourceable at the record level, so
   the site now leads with the defensible **"150+ communities since 1995"**
   (RAA cumulative) and reports the documented dataset honestly. A true national
   *route* count is computed by the pipeline against BTS T-100 (see
   `data-sources/route-analysis/`); until that's run, the slot reads
   "Pending T-100", not asserted.
2. ~~**The routes dataset.**~~ **Resolved (seed).** `src/data/communities.ts`
   now carries the **15 documented lost / EAS-dependent communities** (real
   coordinates, US Census 2020 population, DOT/GAO/EAS sources, per-row
   `confirmed`/`needs-check`). `src/data/routes.ts` builds real hub arcs from
   each community's `formerHubs`. `src/data/overcapable.ts` adds the **25 real
   over-capable short routes** (the "wrong aircraft" pool, split Phase-1 vs
   Phase-2). Raw artifacts + the pipeline that enumerates the full national
   dataset live in `data-sources/route-analysis/`. Rows still marked
   `needs-check` (operator / last-year confirmations) are surfaced in the UI.
3. **Aircraft specs.** `src/data/aircraft.ts` — R-100 MTOW, R-50 runway, and
   R-50 range are flagged unverified. Phase 2 narrowbody names + specs are
   placeholders.
4. **CEO quotes.** Kirby / O'Leary quotes flagged — verify exact wording, venue,
   and date before publishing.
5. **Founder bio** (`/company`) — confirm what's public given current employment.
6. **Domain** — `revia.aero` used as placeholder (`src/data/site.ts`).
7. **Brand assets** — the wordmark/arc are rendered from spec (not the source
   PNGs/`brand-mark-final.html`); aircraft side profiles are stylized
   placeholders. Drop the real SVG assets in to replace them.
8. **Contact form** has no backend — wire the routed inquiries to real inboxes.

## Design tokens (Dawn)

`--navy #0F1B3C` · `--amber #E89556` · `--ember #D86F3C` · `--saffron #F2C97D`
· `--cream #FFF4E1`. Dark is default; light sections invert (navy on cream).

## Map: simple now, richer later

The map uses `react-simple-maps` for ergonomics, but the data layer
(`src/data` + `src/lib/types.ts`) is decoupled from rendering. Swapping in
Mapbox GL JS, adding Alaska/Hawaii/global coverage, or feeding a real dataset
does not require touching the page or component contracts.
