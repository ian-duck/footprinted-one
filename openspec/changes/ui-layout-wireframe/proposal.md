## Why

Align the map UI with the `footprinted-wireframe.excalidraw` layout to improve visual hierarchy and usability. The current map view works functionally, but the new layout groups controls, filters, and statistics in a clearer arrangement.

## What Changes

- Update page layout to match the Excalidraw wireframe: move the doughnut chart and summary into the new left-side stats column, place region/subregion filters and aggregation table below the chart, and keep the interactive map as the primary right-side element.
- Preserve existing map functionality: marker rendering, coloring by `properties.Date`, popups, and fit-to-bounds behavior are unchanged.
- Preserve existing doughnut chart functionality and sizing (200px × 200px) and labels.
- Leave the Region/RegionDistrict filters and tables present in the layout but empty/placeholder for now.

## Capabilities

### New Capabilities
- `ui-layout-wireframe`: Introduce a revised UI layout for the map view following the Excalidraw sketch. This capability covers the page-level DOM layout, responsive rules, and placement of existing widgets (map, doughnut chart, filters, tables).

### Modified Capabilities
- `leaflet-sk-map`: Modify the `leaflet-sk-map` spec to include layout/location expectations for statistics, filters, and tables. No changes to functional requirements (data loading, markers, chart calculations) beyond placement and structure.

## Impact

- Affected code: map view HTML/CSS templates and the page-level layout component or static HTML file(s) that host the Leaflet map and statistics.
- Dependencies: no new runtime dependencies expected. Layout adjustments should use existing front-end assets and CSS. Confirm tile provider unchanged.
-- Implementation risk: minor visual regressions; ensure responsive rules preserve layout and keyboard order.
