## Context

The project currently serves a static Leaflet map view that loads `atlas_sk.geojson`, renders markers, colors them by `properties.Date`, binds popups with metadata, fits bounds after load, and renders a doughnut chart summarizing `Date` presence. The `footprinted-wireframe.excalidraw` file contains a proposed layout that groups the statistics and controls to the left and emphasizes the map on the right. This change reorganizes the page layout to match the wireframe while preserving all functional behavior.

## Goals / Non-Goals

**Goals:**
- Implement page-level layout matching the Excalidraw wireframe: left-side stats/controls column and right-side primary map area.
- Preserve current map behavior (data loading, markers, popups, fit-to-bounds) and doughnut chart functionality (200px × 200px, labels).
- Provide responsive rules so on narrow viewports the layout stacks vertically with map on top.
- Leave Region/RegionDistrict filters and aggregation tables as empty placeholders to be implemented later.

**Non-Goals:**
- Implementing filter logic, aggregation population, or server-side changes. Those are out of scope for this layout change.

## Decisions

1. Layout approach: Use a two-column CSS grid with the left column fixed-width for stats/controls (min 280px) and the right column flexible for the map (auto-fill). Rationale: simple and easy to implement in static pages without JS framework.

2. Widget placement:
   - Left column order: doughnut chart (top), summary labels, empty Region/RegionDistrict filters (placeholders), empty aggregation table (placeholder).
   - Right column: Leaflet map container occupying full height of the content area.

3. Doughnut chart: keep existing chart component and size; embed within a `figure` element with a caption.

4. Map container: ensure the map's container is responsive and full-height within the content area; when layout stacks vertically on narrow viewports, map appears above stats.

5. (Removed) Accessibility-specific requirements have been omitted from this change.

## Risks / Trade-offs

- Risk: CSS changes may alter map rendering if container dimensions change unexpectedly. Mitigation: initialize or call `map.invalidateSize()` after layout changes and after page load.
-- Risk: Some mobile viewports may push chart off-screen; mitigation: stack vertically and allow scrolling.

## Open Questions

- Confirm exact spacing and color tokens from the wireframe that should be adopted, or accept reasonable defaults using existing CSS variables.
- Do you want a small animation when switching between stacked and two-column layouts? Currently omitted to keep page lightweight.
