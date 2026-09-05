## Purpose

Provide statistics and accessibility requirements for the Leaflet map view, specifically reporting counts and percentages of features with and without `Date`.
## Requirements
### Requirement: Display statistics below the map view
The Leaflet map view SHALL display a statistics summary below the interactive map on the same page. The statistics SHALL be visible simultaneously with the map and shall not obscure or overlay map controls or markers.

#### Scenario: Stats shown below map
- **WHEN** the map page loads
- **THEN** a statistics section is rendered directly below the map container
- **THEN** the map remains interactive and existing marker behavior is unchanged

### Requirement: Provide percent summary of `Date` presence
The system SHALL compute and present the counts and percentages of features with defined `properties.Date` and those with empty or missing `Date` values. The percentages SHALL be calculated as (count / total) * 100 and displayed with one decimal place. The statistics shall include both nominal counts and percentage labels.

#### Scenario: Percent calculation is correct
- **WHEN** the GeoJSON dataset contains N features
- **THEN** the statistics section shows counts and percentages that sum to N and 100.0% respectively (within rounding tolerance)

### Requirement: Visual consistency with map markers
The statistics chart color mapping SHALL match the marker colors used in the map (green for defined `Date`, red for missing/empty `Date`) to avoid confusion.

#### Scenario: Chart colors match markers
- **WHEN** the map renders markers with green/red fills
- **THEN** the doughnut chart uses the same green and red colors for corresponding slices

### Requirement: Overall statistic display details
The overall statistic for `Date` presence SHALL be shown as a doughnut chart (not a pie chart). The doughnut chart SHALL be 200px by 200px. Chart labels SHALL include both the percentage (displayed with one decimal place) and the nominal count together for each slice (for example: "72.3% — 231").

#### Scenario: Doughnut rendering
- **WHEN** statistics are computed
- **THEN** the doughnut chart is rendered at 200px × 200px below the map
- **THEN** each slice label shows percentage and nominal count formatted as "{P}% — {N}"

### Requirement: Render SK GeoJSON as map markers
The system SHALL load the repository output file at `atlas_sk.geojson` and render each GeoJSON Feature as a marker on a Leaflet map view within the map page.

#### Scenario: Map page loads and markers render
- **WHEN** the Leaflet map page is opened in a browser
- **THEN** the system fetches `atlas_sk.geojson` from the repository
- **THEN** the system creates one visible marker for each Feature in the GeoJSON
- **THEN** no JavaScript errors occur during data loading or marker rendering

### Requirement: Color markers by `properties.Date` presence
The system SHALL style markers using a green fill when `properties.Date` is present and non-empty, and a red fill when `properties.Date` is empty or missing. Marker borders SHALL be white and clearly visible against the fill color.

#### Scenario: Marker color reflects date presence
- **WHEN** a Feature has a non-empty `properties.Date` value
- **THEN** its marker is rendered with a green fill and a white border
- **WHEN** a Feature has an empty or missing `properties.Date`
- **THEN** its marker is rendered with a red fill and a white border

### Requirement: Popup shows key metadata
The system SHALL bind a popup to each marker that displays the place name and the key metadata fields: `Date`, `Region`, and `Sector`. The popup content SHALL be human-readable and clearly labeled.

#### Scenario: Popup displays expected fields
- **WHEN** a user clicks or opens a marker popup
- **THEN** the popup shows the place name and labeled fields for `Date`, `Region`, and `Sector`
- **THEN** missing values are displayed as an explicit placeholder (e.g., "(missing)")
- **THEN** the popup content is readable on common desktop and mobile widths

### Requirement: Fit map to feature bounds after loading
After loading features, the system SHALL adjust the map view to fit the bounds of all rendered markers so the full dataset is visible by default.

#### Scenario: Map fits to all markers
- **WHEN** the dataset finishes loading and markers are added to the map
- **THEN** the map view is set to bounds that include all markers
- **THEN** the resulting zoom is within a readable range (not fully zoomed out)
- **THEN** the map view respects maximum allowed zoom constraints so markers remain visible

### Requirement: Simple, static behavior for current repo state
The implemented view SHALL be a lightweight, static Leaflet page with no external clustering, filtering, or server-side components. Future extensions MAY add interactivity but are out of scope for this change.

#### Scenario: Page is static and lightweight
- **WHEN** the page is loaded in a normal browser environment
- **THEN** it loads only the necessary static assets and the GeoJSON file
- **THEN** there are no network requests to external APIs beyond tile provider and the local GeoJSON
- **THEN** the page remains responsive for datasets of the current repo size

### Requirement: Regional and district statistics table
The statistics section SHALL include a table that shows aggregated counts for each Region and its constituent RegionDistricts. The table SHALL have three columns: "Name", "With Footprint", and "No Footprint".

#### Scenario: Table layout and ordering
- **WHEN** the page renders statistics
- **THEN** for each Region in the dataset the table contains a row for the Region totals followed immediately by rows for each RegionDistrict in that Region (region row first, then its districts)

#### Scenario: Percentage calculation
- **WHEN** computing statistics for a scope (Region or RegionDistrict)
- **THEN** the percentage SHALL be calculated as (count_with_date / total) * 100 and displayed with one decimal place

#### Scenario: Column contents
- **WHEN** a row is rendered
- **THEN** the Name column shows the Region or RegionDistrict name
- **THEN** the "With Footprint" column shows the percentage and the nominal count in the format "{P}% — {N}" (e.g., "72.3% — 231")
- **THEN** the "No Footprint" column shows the integer count of features missing or empty `Date` values

#### Scenario: Accessibility and responsiveness
- **WHEN** the table is displayed on narrow viewports
- **THEN** it remains readable (horizontal scroll or stacked labels) and is keyboard accessible

