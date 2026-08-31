## Why

The current map view shows markers colored by `Date` presence but provides no a
t-a-glance summary of dataset completeness. Adding a simple stats view will hel
p users quickly understand how many places have defined dates versus missing da
te values.

## What Changes

- Add a toggle to the map page to switch between the interactive map and a st
atistics view.
- The statistics view will display a pie chart showing the percentage of feat
ures with a defined `Date` and those with an empty or missing `Date`.
- The change will be implemented client-side in the repository's `map.html` p
age (no server changes).

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `leaflet-sk-map`: Add a UI toggle and a statistics view that summarizes the
  percentage of features with defined `Date` values. This modifies the user-f
acing behavior of the existing Leaflet map view.

## Impact

- Files: `map.html` will be updated to include the toggle, stats container, a
nd a small JS implementation. It will load a lightweight chart library (CDN)
.
- No backend or build changes required; this is a client-side enhancement.
- Affects consumers of the static map page and documentation for the map fea
ture.
