## Why

Add regional and district-level statistics to the map page so users can see,
at-a-glance, how many places per region and district have a populated `Date`.
This improves data quality awareness and helps prioritise curation.

## What Changes

- Add a statistics table to the stats section showing per-region and per-district
  counts and percentages of features with and without `Date`.
- Update the page JS that loads GeoJSON to compute region/district aggregates
  and render the table. No API changes.
- Add minimal DOM elements and CSS for the table and ensure accessibility.

## Capabilities

### New Capabilities
- `regional-statistics`: UI and JS to compute and render regional/district sta
  tistics in the stats section (creates a new capability that augments the map
  page UX).

### Modified Capabilities
- `leaflet-sk-map`: Add requirement to present regional/district statistics in
  the page's stats area (requirement-level change to the existing map spec).

## Impact

- Affected files: `map.html`, `map1.html` (if kept in parity), site JS that
  loads and renders GeoJSON, stylesheets for stats section.
- New deps: none (use existing DOM + simple table). Chart libraries are not re
  quired for this table view.
- Risks: Large datasets may need aggregation performance consideration; we wil
  l compute aggregates client-side and keep formatting simple.
