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

