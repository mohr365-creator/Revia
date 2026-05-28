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
  data/                site, communities, routes, stats, aircraft (the content/data layer)
  lib/                 types, geo helpers
public/geo/            us-states-10m.json (self-hosted)
```

## ⚠️ What I need from you (placeholders to resolve before launch)

Every placeholder is marked in the UI with a `⚠` **DataFlag** so nothing
unsourced ships disguised as fact.

1. **The "840+ routes" number.** Currently shown alongside the verified
   "~150 communities (1995–2020)" and flagged unsourced. Must be *computed from
   the dataset* — see below.
2. **The routes dataset.** `src/data/communities.ts` and `src/data/routes.ts`
   are a **sample** (real coordinates, placeholder service details) built from the
   named example communities. Replace with sourced data:
   DOT T-100, EAS terminated-communities, GAO small-community reports, RAA, Ailevon
   Pacific. Schema is in `src/lib/types.ts`. Say the word and I'll build the real
   CSV/GeoJSON.
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
