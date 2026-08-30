## Context

The project now has a generated GeoJSON dataset for Slovak entries in [outputs/atlas_sk.geojson](../../outputs/atlas_sk.geojson). The dataset is suitable for map rendering, but it still lacks an explicit UI layer that displays it in Leaflet and visually distinguishes records with a populated `Date` field from those without one.

This change is intentionally narrow: it does not build a large mapping product or a general-purpose geospatial framework. It adds a simple map layer that reads the existing GeoJSON and uses the `Date` field in `properties` to assign a green or red marker color, making the data immediately understandable on a map.

## Goals / Non-Goals

**Goals:**
- Render the SK GeoJSON dataset on a Leaflet map
- Use green markers for records with a non-empty `Date`
- Use red markers for records with an empty or missing `Date`
- Attach simple popups with place and metadata for quick inspection
- Keep the implementation lightweight and static for the current repo state

**Non-Goals:**
- Building a database-backed map system
- Supporting polygon and line overlays
- Adding clustering, filters, or advanced map controls beyond the current requirement
- Replacing the GeoJSON output with another format

## Decisions

### 1) Use Leaflet’s `L.geoJSON` with `pointToLayer`

Leaflet already provides the correct path for converting GeoJSON point features into map markers. Using `pointToLayer` keeps the logic compact and aligns directly with the feature structure in the generated output.

Alternative considered: manually iterating JSON features and creating `L.marker` objects one by one. That would work, but `L.geoJSON` is more idiomatic and easier to maintain because it follows the GeoJSON data model directly.

### 2) Base the marker color on `properties.Date`

The business requirement is explicit: records with a filled `Date` should be green, and records with empty `Date` should be red. The simplest and most reliable decision is to derive the color from the raw `properties.Date` string rather than from a separate transformed field.

This keeps the rendering logic decoupled from the CSV conversion and makes the rule obvious: if `Date` is present and non-empty, use green; otherwise use red.

### 3) Keep marker styling simple and static

The map uses `L.circleMarker` with a white border and a fill color that reflects the date condition. This makes the status immediately obvious while avoiding unnecessary custom icon assets or styling complexity.

This is enough for the current requirement and stays lightweight enough for a repo-local static HTML/JS map.

### 4) Keep popups metadata-focused

Each marker will show the place name and a few key fields, such as date, region, and sector, to make the map useful without cluttering the view. This is sufficient for a discovery-oriented map and avoids overloading the UI with too much data.

## Risks / Trade-offs

- [Visual ambiguity risk] A red marker may be read as a map error rather than “no date.” → Mitigation: include a popup and use a clear color palette with a white border for contrast.
- [Data mismatch risk] Some `Date` values may be whitespace or null-like strings instead of a proper ISO date. → Mitigation: treat any empty or whitespace-only value as missing and color it red.
- [Performance risk] Rendering 2,000 points is fine for a static Leaflet map, but a larger dataset may need clustering later. → Mitigation: keep the current map simple and plan clustering as a future enhancement if the dataset grows.

## Migration Plan

1. Load the generated SK GeoJSON file into a static Leaflet page.
2. Define a marker color function based on `properties.Date`.
3. Render markers with `L.geoJSON` and `pointToLayer`.
4. Add popups for place-level inspection.
5. Fit the map to the dataset bounds and verify the green/red differentiation visually.

## Open Questions

- None at this time; the implementation approach is clear and the map styling requirement is fully specified.
