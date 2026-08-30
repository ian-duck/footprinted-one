## 1. Map Setup

- [x] 1.1 Create a minimal Leaflet page with a map container and tile layer
- [x] 1.2 Load the generated SK GeoJSON file into the page

## 2. Marker Styling

- [x] 2.1 Add a marker color function that checks whether `properties.Date` is non-empty
- [x] 2.2 Use green fill for records with a populated date and red fill for missing dates
- [x] 2.3 Style markers with a white border and a readable radius for map visibility

## 3. Popup and Data Display

- [x] 3.1 Bind a popup that shows the place name and key metadata
- [x] 3.2 Include date, region, and sector fields in the popup content
- [x] 3.3 Fit the map to the full feature bounds after loading

## 4. Validation

- [x] 4.1 Verify that all markers render without JS errors
- [x] 4.2 Confirm that filled `Date` values are green and empty `Date` values are red
- [x] 4.3 Check that the map remains readable at the project’s expected zoom level
