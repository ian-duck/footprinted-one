## Context

The project receives a CSV export from the Atlas dataset, which contains place records from multiple countries. The dataset is semicolon-delimited, mixes `#N/A` placeholders with valid values, and uses locale-specific decimal formatting such as `48,41157` instead of `48.41157`. For map display, the project needs a GeoJSON representation of the Slovak subset so it can be consumed by a Leaflet-based map without extra front-end parsing logic.

The current state is a raw export file rather than a prepared geodata layer. There is no dedicated conversion step or normalization routine, so every ingestion path would need to re-implement parsing logic. The design resolves that by defining a single conversion flow that filters for `Country Code = SK`, preserves incomplete SK rows for traceability, and emits valid GeoJSON points only when coordinates are usable.

## Goals / Non-Goals

**Goals:**
- Convert the Atlas export into GeoJSON for map rendering
- Restrict the output to rows with `Country Code` equal to `SK`
- Normalize malformed numeric values and missing coordinate markers
- Retain SK rows even when coordinates are unavailable so the dataset stays complete and observable
- Produce valid GeoJSON points using `[longitude, latitude]` ordering

**Non-Goals:**
- Converting all countries in the file to separate outputs
- Building a map UI or map rendering layer
- Supporting polygons, multi-polygons, or other geometry types beyond point data
- Handling large-scale geospatial indexing or database migration

## Decisions

### 1) Use CSV parsing and Python normalization as the transformation layer

A Python script is the most direct option because the source file is a flat export rather than a database table. Python’s `csv` module handles semicolon-delimited data reliably, and the logic for cleaning locale-specific decimals and `#N/A` values is straightforward and explicit.

Alternative considered: doing the conversion in SQL or JavaScript. SQL would be useful later if the dataset is loaded into PostGIS, but for this repo and current input format, a lightweight one-off conversion script is simpler and more maintainable.

### 2) Keep SK rows even when coordinates are invalid

The requirement is to retain all Slovak entries in the output dataset, even if coordinates are missing or malformed. The design therefore produces a GeoJSON `Feature` for each SK record, with `geometry: null` and flags such as `valid: false` and `issue: "Missing or invalid coordinates"` when coordinate parsing fails.

This is preferable to silently dropping rows because it preserves dataset completeness and makes later debugging or filtering easier. It also avoids hidden data loss in a map context where an empty coordinate is not necessarily a data-quality failure but a record attribute that still matters.

### 3) Keep metadata in `properties` and emit `Point` only when valid

Each GeoJSON feature stores the original record metadata as `properties`, which keeps the dataset useful for UI display, filtering, and future analysis. For valid records, the `geometry` object is a GeoJSON point using longitude/latitude ordering: `[lon, lat]`.

This matches Leaflet expectations and keeps the map layer simple. For invalid records, the feature remains represented in the dataset but is excluded from actual map rendering by checking `geometry` and/or `valid` before adding to a map layer.

### 4) Normalize input strings before numeric conversion

The dataset includes values such as:
- `48,41157` instead of `48.41157`
- `#N/A` or blank strings for missing coordinates
- strings with whitespace and non-breaking spaces

Normalization occurs before conversion so invalid values are handled consistently and not silently parsed into incorrect numbers.

## Risks / Trade-offs

- [Data quality risk] Some coordinates may be missing or malformed and should not be silently dropped. → Mitigation: keep the SK row in the output and mark it invalid using `valid: false` and a descriptive issue.
- [Locale formatting risk] Decimal comma parsing may be inconsistent if there are thousands separators or unusual text values. → Mitigation: normalize whitespace, strip non-breaking spaces, and convert comma decimals before numeric parsing.
- [Map usability risk] Invalid features may still be present in the JSON if consumers do not check `geometry`. → Mitigation: document the `valid` flag and `geometry: null` behavior, and keep map-layer filtering explicit.
- [Schema drift risk] Column names may change if the export format changes in future. → Mitigation: treat the converter as a thin normalization layer and validate required columns at runtime before building features.

## Migration Plan

1. Validate the input CSV headers and required columns against the current export.
2. Implement the converter script for the Atlas file.
3. Run it against the current dataset and inspect counts of valid/invalid SK rows.
4. Save the generated GeoJSON output as a static file in the repo for now.
5. Separate invalid SK records into a dedicated invalid-output file so map consumers can choose whether to ignore them.
6. Consume the valid GeoJSON file in Leaflet using `L.geoJSON`, filtering out `geometry === null` rows before map rendering as needed.

## Open Questions

- None at this time; the agreed decisions are now: static file storage in the repo, invalid SK records separated into a dedicated file, and no stricter validation step required.
