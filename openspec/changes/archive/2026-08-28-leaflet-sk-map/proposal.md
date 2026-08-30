## Why

The project now has a valid SK-only GeoJSON dataset, but it still needs a way to render those points on a map in a way that distinguishes records with a known date from records without one. This makes it easier to scan the dataset visually and highlights missing date coverage without requiring extra filtering steps in the UI.

## What Changes

- Add a Leaflet map view for the generated SK GeoJSON dataset.
- Render points as markers on a map using a filtered dataset from the repo output.
- Color markers green when `properties.Date` is present and red when it is empty or missing.
- Add popups that show the place name and relevant metadata.
- Keep the map behavior simple and static for the current repo state.

## Capabilities

### New Capabilities
- `leaflet-sk-map`: render the generated Slovak GeoJSON dataset in Leaflet and style markers based on date presence.

### Modified Capabilities
- None

## Impact

- Map rendering in a frontend or static HTML view
- Consumption of [outputs/atlas_sk.geojson](../../outputs/atlas_sk.geojson)
- UI behavior for highlighting records with and without dates
- Future extension for clustering, filtering, or custom marker icons
