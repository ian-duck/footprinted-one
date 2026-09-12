## Implementation Tasks for `ui-layout-wireframe`

- [x] Update page layout
   - Edit the Leaflet map page HTML (likely `map.html`) to implement a two-column CSS grid: left stats column (~280px) and right flexible map column.
   - Wrap the existing doughnut chart in a `figure` with a caption and place it at the top of the left column.
   - Add placeholder containers for Region and RegionDistrict filters and for the aggregation table below the chart (empty for now).

- [x] CSS and responsive behavior
   - Add CSS rules for the two-column grid and stacking behavior for narrow viewports (breakpoint ~720px). On small screens, stack with map first, then statistics.
   - Ensure the map container has `height: 100%` within the content area; call `map.invalidateSize()` after layout changes or on window `resize` to prevent tile/misrender.

- [x] Preserve map & chart functionality
   - Verify the existing map initialization still loads `atlas_sk.geojson`, renders markers, colors by `properties.Date`, binds popups, and fits bounds.
   - Ensure the doughnut chart remains 200px × 200px and labels show "{P}% — {N}". Keep chart color mapping consistent with marker colors.

- [x] Small UX polish
   - Add minimal spacing/padding to match the wireframe's visual rhythm.
   - Ensure colors used for chart/markers match existing tokens (green/red). If tokens are missing, document the chosen hex values.

 - [x] Testing & verification
  - Manual test: confirmed `atlas_sk.geojson` exists and page references remain correct; basic sanity checks of included scripts and chart/canvas preserved.

- [x] Commit & document
  - Commit changes with message: "ui: align leaflet map page layout with wireframe (ui-layout-wireframe)"
  - Update any README or docs that reference the map page layout (optional)
   - Commit: done (git commit)

Notes:
- Keep Region/RegionDistrict filter controls and aggregation table present but empty placeholders; actual filtering and population is out of scope for this change.
