## Context

The repository includes a static `map.html` that loads `atlas_sk.geojson` and r
enders features as Leaflet markers. Users currently must inspect the map visuall
y to understand data completeness (whether `properties.Date` is present).

Constraints:
- Client-side only change; no backend components.
- Keep the page lightweight and usable offline except for tile requests.

## Goals / Non-Goals

**Goals:**
- Add a simple UI control to toggle between the map and a statistics view.
- Display a pie chart showing percent of features with defined `Date` vs emp
ty/missing `Date`.
- Keep the implementation minimal, using a CDN-hosted chart library and reus
ing the already-loaded GeoJSON.

**Non-Goals:**
- Implementing clustering, filtering, or heavy analytics.
- Adding server-side statistics or persistent telemetry.

## Decisions

- Chart library: use Chart.js via CDN (`https://cdn.jsdelivr.net/npm/chart.js`) 
  because it is small, widely used, and provides a simple pie chart API.
- Data source: reuse the `atlas_sk.geojson` already requested by the map pag
e; compute counts client-side to avoid extra requests.
- Placement: a fixed toggle button at top-right that switches between `#mapCo
ntainer` and `#statsContainer` to keep layout simple.
- Accessibility: provide textual summary under the chart for screen-reader fr
iendly numeric values; explicit ARIA attributes will be deferred per request.

## Risks / Trade-offs

- Relying on Chart.js CDN: if CDN is blocked, the stats view will not render.
  Mitigation: provide a textual summary when the chart fails to load.
- Switching views must preserve map state. We'll call `map.invalidateSize()` w
hen returning to the map and preserve center/zoom in memory.
- Large datasets: pie chart handles counts but not distribution nuances; this i
s acceptable for this change.

## Migration Plan

1. Edit `map.html` to add `#viewToggle`, `#mapContainer`, and `#statsContainer`.
2. Add Chart.js CDN script tag and JS to compute counts and initialize the cha
rt.
3. Test locally by serving the repo and verifying toggle, chart, and popup be
havior.
4. Commit change and update change artifacts.

## Open Questions

- Should the chart colors match marker colors exactly? (Recommended: yes.)
- Where should this change be documented for non-technical users? (README o
r project docs)
