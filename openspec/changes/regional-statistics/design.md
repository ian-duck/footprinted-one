## Context

Existing map page renders GeoJSON features and a small stats area. Regions
and RegionDistricts are present on each feature as `properties.Region` and
`properties.RegionDistrict`.

## Goals / Non-Goals

**Goals:**
- Add a simple, accessible table showing regional and district statistics as
  described in the spec delta.
- Keep client-side performance acceptable for typical dataset sizes (couple o
  f thousand features).

**Non-Goals:**
- No server-side aggregation or new APIs.

## Decisions

- Compute aggregates client-side when the GeoJSON is loaded. Build a map o
  f region → {total, withDate, withoutDate, districts: {districtName→counts}}
- Render a plain HTML table under the existing stats container. For wide view
  ports render full table; on narrow widths allow horizontal scroll with `ov
  erflow:auto`.
- Format percentages to one decimal place using JavaScript `toFixed(1)` and s
  how nominal counts alongside percentages.
- Ensure table is keyboard navigable and uses semantic `<table>` markup and `t
  head`/`tbody` for screen readers.

## Risks / Trade-offs

- Very large GeoJSON (>50k features) may slow client-side aggregation; mitig
  ation: early bailouts, virtualized rendering, or server-side aggregation if
  needed later.

## Migration Plan

1. Add rendering code and container in `map.html`.
2. Test locally with `atlas_sk.geojson` and `atlas_sk_invalid.geojson`.
3. Verify accessibility and responsive behavior.

## Open Questions

- Should we include sorting controls for the table? (Not in MVP)
