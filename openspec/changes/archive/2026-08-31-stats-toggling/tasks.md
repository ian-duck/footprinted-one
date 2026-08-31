## Implementation Tasks

1. [x] Backup `map.html` (create `map.html.bak`) to preserve current state.
2. [x] Add UI: insert a `#viewToggle` button, `#mapContainer`, and `#statsContainer` elements into `map.html` and minimal CSS for layout.
3. [x] Add Chart.js CDN script tag to `map.html` and create the JS logic to compute counts from the loaded GeoJSON and initialize a pie chart.
4. [x] Implement toggle logic to switch visibility between `#mapContainer` and `#statsContainer`, preserving map center/zoom and calling `map.invalidateSize()` after showing the map.
5. [x] Add textual summary beneath the chart that shows exact counts and percentages for accessibility and no-CDN fallback.
6. [ ] Test locally: serve the repo, open `map.html`, toggle views, verify counts, chart rendering, and that map state restores correctly.
7. [ ] Cross-browser check: test in Chrome and Firefox. Verify behavior on mobile widths.
8. [ ] Commit the change and update the project changelog or notes.
