## MODIFIED Requirements

### Requirement: Add view toggle between map and statistics
The existing Leaflet map view SHALL provide a UI control to toggle between the interactive map and a statistic summary view. The toggle SHALL not remove or alter existing marker behavior when switching views.

#### Scenario: Toggle shows statistics
- **WHEN** a user activates the toggle to show statistics
- **THEN** the map view is hidden and the statistics view is shown
- **THEN** the statistics view displays a pie chart and a textual summary of counts

### Requirement: Provide percent summary of `Date` presence
The system SHALL compute and present the counts and percentages of features with defined `properties.Date` and those with empty or missing `Date` values. The percentages SHALL be calculated as (count / total) * 100 and displayed with one decimal place.

#### Scenario: Percent calculation is correct
- **WHEN** the GeoJSON dataset contains N features
- **THEN** the statistics view shows counts and percentages that sum to N and 100.0% respectively (within rounding tolerance)

### Requirement: Visual consistency with map markers
The statistics chart color mapping SHALL match the marker colors used in the map (green for defined `Date`, red for missing/empty `Date`) to avoid confusion.

#### Scenario: Chart colors match markers
- **WHEN** the map renders markers with green/red fills
- **THEN** the pie chart uses the same green and red colors for corresponding slices

### Requirement: Preserve map state when returning to map view
When returning from the statistics view to the map view, the map SHALL preserve the previous center and zoom (or restore them to the last known state) and render markers without re-fetching the GeoJSON.

#### Scenario: Returning to map restores view
- **WHEN** a user switches to statistics and then back to the map
- **THEN** the map shows the same visible area (center/zoom) as before switching
