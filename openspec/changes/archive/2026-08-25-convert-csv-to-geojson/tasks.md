## 1. Data Inspection and Validation

- [x] 1.1 Confirm the input CSV headers and required fields for the Atlas export
- [x] 1.2 Verify the `Country Code` and coordinate columns in the source file
- [x] 1.3 Check the exact missing-value patterns used by the dataset (`#N/A`, blank values, decimal commas)

## 2. Conversion Script Setup

- [x] 2.1 Create the Python conversion script for the Atlas CSV input
- [x] 2.2 Add CSV parsing with a semicolon delimiter and UTF-8 input handling
- [x] 2.3 Implement normalization for whitespace, decimal commas, and missing-value markers

## 3. SK Filtering and Validation

- [x] 3.1 Filter the input to only records where `Country Code` equals `SK`
- [x] 3.2 Parse latitude and longitude values safely with range checks
- [x] 3.3 Preserve invalid SK rows by keeping them in the output with `geometry: null` and a validity flag

## 4. GeoJSON Output Generation

- [x] 4.1 Build a GeoJSON `FeatureCollection` for the filtered SK rows
- [x] 4.2 Create GeoJSON `Point` geometry for valid rows using `[longitude, latitude]`
- [x] 4.3 Add metadata to `properties` while retaining the original row information
- [x] 4.4 Write the resulting JSON to a `.geojson` output file

## 5. Verification and QA

- [x] 5.1 Validate that the output JSON is syntactically correct
- [x] 5.2 Confirm that all SK rows are retained in the data, including invalid-coordinate rows
- [x] 5.3 Count valid vs invalid SK features and inspect the output for correctness
- [x] 5.4 Confirm that the GeoJSON structure matches Leaflet expectations for point rendering
