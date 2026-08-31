## DELTA Requirements (MODIFIED)

### Requirement: Regional and district statistics table
The statistics section SHALL include a table that shows aggregated counts for
each Region and its constituent RegionDistricts. The table SHALL have three
columns: "Name", "With Footprint", and "No Footprint".

#### Scenario: Table layout and ordering
- **WHEN** the page renders statistics
- **THEN** for each Region in the dataset the table contains a row for the
  Region totals followed immediately by rows for each RegionDistrict in that
  Region (region row first, then its districts)

#### Scenario: Percentage calculation
- **WHEN** computing statistics for a scope (Region or RegionDistrict)
- **THEN** the percentage SHALL be calculated as (count_with_date / total) *
  100 and displayed with one decimal place

#### Scenario: Column contents
- **WHEN** a row is rendered
- **THEN** the Name column shows the Region or RegionDistrict name
- **THEN** the "With Footprint" column shows the percentage and the nominal
  count in the format "{P}% — {N}" (e.g., "72.3% — 231")
- **THEN** the "No Footprint" column shows the integer count of features
  missing or empty `Date` values

#### Scenario: Accessibility and responsiveness
- **WHEN** the table is displayed on narrow viewports
- **THEN** it remains readable (horizontal scroll or stacked labels) and is
  keyboard accessible
