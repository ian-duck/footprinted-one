## 1. Setup

- [x] 1.1 Create `regional-statistics` change artifacts (proposal, design,
  specs, tasks)

## 2. Implementation

- [x] 2.2 Add DOM container `#regionalStats` inside the stats section of
  `map.html` and minimal CSS for table layout
- [x] 2.3 Implement aggregation function `computeRegionalStats(features)`
  that returns totals per Region and per RegionDistrict
- [x] 2.4 Add render function `renderRegionalStatsTable(stats, container)`
  which produces the table with rows in the required order
- [x] 2.5 Integrate with existing map load flow so the table updates when the
  GeoJSON is loaded or refreshed

## 3. Testing

- [ ] 3.1 Test locally: serve the repo, open `map.html`, verify table counts and
  percentages for a few sample datasets
- [ ] 3.2 Cross-browser check: Chrome and Firefox on desktop and mobile widths
- [ ] 3.3 Accessibility check: keyboard navigation and screen reader verifyin
  g table semantics

## 4. Release

- [x] 4.1 Commit changes and update project changelog
- [ ] 4.2 Optional: add a short note in README about the new stats view
