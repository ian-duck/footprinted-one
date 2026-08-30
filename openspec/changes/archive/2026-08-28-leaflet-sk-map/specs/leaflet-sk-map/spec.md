## ADDED Requirements

### Requirement: Render SK GeoJSON as map markers
The system SHALL load the repository output file at `atlas_sk.geojson` and render each GeoJSON Feature as a marker on a Leaflet map view within the change's HTML page.

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
