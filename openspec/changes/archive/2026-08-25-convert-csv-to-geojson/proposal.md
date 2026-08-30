## Why

The project needs a reliable way to convert exported Atlas CSV data into GeoJSON for map rendering, while keeping the Slovak subset visible even when some rows do not contain usable coordinates. The current dataset includes mixed-country rows, decimal-comma numeric fields, and `#N/A` placeholders, so a consistent conversion step is required before any Leaflet map can consume the data.

## What Changes

- Add a CSV-to-GeoJSON conversion flow for the Atlas export dataset.
- Filter the input to only rows where `Country Code` equals `SK`.
- Normalize decimal-comma values and missing coordinate markers before building JSON.
- Preserve SK rows even when coordinates are missing or invalid by keeping them in the GeoJSON output with `geometry: null` and a validity flag.
- Emit valid GeoJSON `Point` objects for rows with usable latitude and longitude values.
- Ensure the resulting JSON is ready to be consumed by a Leaflet map layer.

## Capabilities

### New Capabilities
- `csv-to-geojson`: convert Atlas CSV input into GeoJSON while filtering and validating rows for map consumption.

### Modified Capabilities
- None

## Impact

- Input pipeline for exported Atlas data in [inputs/Atlas DB 2026-08-24-export.csv](../../inputs/Atlas%20DB%202026-08-24-export.csv)
- Potential downstream map rendering in Leaflet or a web frontend
- Data validation and normalization logic for CSV-derived geospatial datasets
