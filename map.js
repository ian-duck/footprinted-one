/* Page JS for map.html — initializes Leaflet map and loads GeoJSON */
(function () {
  const state = {
    map: null,
    allFeatures: [],
    selectedRegion: 'All',
    selectedDistrict: 'All',
    selectedStatus: 'All',
    regionToDistricts: new Map(),
    activeLayer: null
  };

  function hasFilledDate(feature) {
    const dateValue = feature && feature.properties && feature.properties.Date;
    return typeof dateValue === 'string' && dateValue.trim() !== '';
  }

  function getCompletionStats(features) {
    const total = Array.isArray(features) ? features.length : 0;
    const filledCount = features.filter((feature) => hasFilledDate(feature)).length;
    const emptyCount = total - filledCount;
    const filledPercent = total === 0 ? 0 : (filledCount / total) * 100;

    return {
      total,
      filledCount,
      emptyCount,
      filledPercent,
      emptyPercent: total === 0 ? 0 : (emptyCount / total) * 100
    };
  }

  function getCssVariable(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function getMarkerPalette() {
    return {
      visited: getCssVariable('--color-green-400', '#2ea14e'),
      pending: getCssVariable('--color-danger-400', '#d85c4b'),
      border: getCssVariable('--color-surface-1', '#ffffff')
    };
  }

  function updateProgressRing(features) {
    const stats = getCompletionStats(features);
    const ring = document.getElementById('quest-progress-ring');
    const value = document.getElementById('quest-progress-value');

    if (ring) {
      ring.style.setProperty('--progress', stats.filledPercent);
      const isFiltered = state.selectedStatus !== 'All';
      ring.classList.toggle('is-active', isFiltered);
      ring.setAttribute('aria-pressed', String(isFiltered));
      const filterText = isFiltered ? `, filter active for ${state.selectedStatus} items` : '';
      ring.setAttribute('aria-label', `${stats.filledPercent.toFixed(1)} percent complete${filterText}`);
      ring.title = isFiltered ? `Clear ${state.selectedStatus} filter` : 'Click to toggle visited/missing filter';
    }

    if (value) {
      value.textContent = `${stats.filledPercent.toFixed(1)}%`;
    }

    return stats;
  }

  function buildRegionDistrictIndex(features) {
    const index = new Map();

    features.forEach((feature) => {
      const props = feature && feature.properties ? feature.properties : {};
      const region = props.Region || 'Unknown';
      const district = props.RegionDistrict || 'Unknown';

      if (!index.has(region)) {
        index.set(region, new Set());
      }

      index.get(region).add(district);
    });

    return index;
  }

  function getFilteredFeatures() {
    return state.allFeatures.filter((feature) => {
      const props = feature && feature.properties ? feature.properties : {};
      const regionMatches = state.selectedRegion === 'All' || props.Region === state.selectedRegion;
      const districtMatches = state.selectedDistrict === 'All' || props.RegionDistrict === state.selectedDistrict;
      const isVisited = hasFilledDate(feature);
      const statusMatches = state.selectedStatus === 'All'
        || (state.selectedStatus === 'visited' && isVisited)
        || (state.selectedStatus === 'missing' && !isVisited);

      return regionMatches && districtMatches && statusMatches;
    });
  }

  function toggleStatusFilter(nextStatus) {
    if (state.selectedStatus === nextStatus) {
      state.selectedStatus = 'All';
    } else {
      state.selectedStatus = nextStatus;
    }
  }

  function updateDistrictOptions() {
    const districtSelect = document.getElementById('district-select');
    if (!districtSelect) return;

    const districts = state.selectedRegion === 'All'
      ? Array.from(new Set(state.allFeatures.map((feature) => feature && feature.properties ? feature.properties.RegionDistrict : '').filter(Boolean))).sort()
      : Array.from(state.regionToDistricts.get(state.selectedRegion) || []).sort();

    districtSelect.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'All';
    districtSelect.appendChild(allOption);

    districts.forEach((district) => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });

    districtSelect.value = 'All';
    state.selectedDistrict = 'All';
  }

  function renderMap(features) {
    const map = state.map;
    if (!map) return;

    if (state.activeLayer) {
      map.removeLayer(state.activeLayer);
    }

    const layer = L.geoJSON({
      type: 'FeatureCollection',
      features
    }, {
      pointToLayer(feature, latlng) {
        const isVisited = hasFilledDate(feature);
        const palette = getMarkerPalette();
        const color = isVisited ? palette.visited : palette.pending;
        return L.circleMarker(latlng, {
          radius: 8,
          color: palette.border,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.95,
          opacity: 1
        });
      },
      onEachFeature(feature, marker) {
        const props = feature.properties || {};
        const place = props.Place || 'Unknown place';
        const date = props.Date && String(props.Date).trim() !== '' ? props.Date : 'No date';
        const region = props.Region || 'N/A';
        const district = props.RegionDistrict || 'N/A';

        marker.bindPopup(`
          <strong>${place}</strong><br>
          Date: ${date}<br>
          Region: ${region}<br>
          District: ${district}<br>
        `);
      }
    }).addTo(map);

    state.activeLayer = layer;

    try {
      const bounds = layer.getBounds && layer.getBounds();
      if (bounds && typeof bounds.isValid === 'function' ? bounds.isValid() : (bounds && bounds.getNorthEast)) {
        map.fitBounds(bounds, { padding: [24, 24] });
      }
    } catch (err) {
      console.warn('Map bounds failed', err);
    }
  }

  function populateRegionOptions(features) {
    const regionSelect = document.getElementById('region-select');
    if (!regionSelect) return;

    const regions = Array.from(new Set(
      features
        .map((feature) => feature && feature.properties ? feature.properties.Region : '')
        .filter(Boolean)
    )).sort();

    regionSelect.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = 'All';
    allOption.textContent = 'All';
    regionSelect.appendChild(allOption);

    regions.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionSelect.appendChild(option);
    });

    if (regions.includes(state.selectedRegion)) {
      regionSelect.value = state.selectedRegion;
    } else {
      state.selectedRegion = 'All';
      regionSelect.value = 'All';
    }
  }

  function getRecentVisitedPlaces(features) {
    const validItems = features
      .filter((feature) => hasFilledDate(feature))
      .filter((feature) => {
        const dateString = feature && feature.properties ? feature.properties.Date : null;
        return typeof dateString === 'string' && dateString.trim() !== '' && !Number.isNaN(new Date(dateString).getTime());
      })
      .sort((a, b) => new Date(b.properties.Date) - new Date(a.properties.Date));

    return validItems.slice(0, 3);
  }

  function getPendingPlaces(features) {
    return features
      .filter((feature) => !hasFilledDate(feature))
      .slice(0, 10);
  }

  function renderRecentPlaces(features) {
    const list = document.querySelector('.footprint-list--recent');
    if (!list) return;

    const recentPlaces = getRecentVisitedPlaces(features);

    if (recentPlaces.length === 0) {
      list.innerHTML = '<div class="footprint-row"><span class="badge-pending" aria-hidden="true"></span><span class="footprint-row__label">No recent places</span></div>';
      return;
    }

    list.innerHTML = recentPlaces
      .map((feature) => {
        const props = feature && feature.properties ? feature.properties : {};
        const name = props.Place || 'Unknown place';
        const date = props.Date ? String(props.Date).trim() : 'Unknown';
        return `
          <div class="footprint-row">
            <span class="badge-stamp" aria-hidden="true">✓</span>
            <span class="footprint-row__label">${name}</span>
            <span class="footprint-row__date">${date}</span>
          </div>
        `;
      })
      .join('');
  }

  function renderPendingPlaces(features) {
    const list = document.querySelector('.footprint-list--pending');
    if (!list) return;

    const pendingPlaces = getPendingPlaces(features);

    if (pendingPlaces.length === 0) {
      list.innerHTML = '<div class="footprint-row footprint-row--pending"><span class="badge-pending" aria-hidden="true"></span><span class="footprint-row__label">No pending places</span></div>';
      return;
    }

    list.innerHTML = pendingPlaces
      .map((feature) => {
        const props = feature && feature.properties ? feature.properties : {};
        const name = props.Place || 'Unknown place';
        return `
          <div class="footprint-row footprint-row--pending">
            <span class="badge-pending" aria-hidden="true"></span>
            <span class="footprint-row__label">${name}</span>
          </div>
        `;
      })
      .join('');
  }

  function applyFilters() {
    const filteredFeatures = getFilteredFeatures();
    updateProgressRing(filteredFeatures);
    renderMap(filteredFeatures);
    renderRecentPlaces(filteredFeatures);
    renderPendingPlaces(filteredFeatures);
  }

  function handleRingClick(event) {
    const ring = document.getElementById('quest-progress-ring');
    if (!ring) return;

    const rect = ring.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalizedAngle = (angle + 360) % 360;
    const progress = Number(ring.style.getPropertyValue('--progress')) || 0;
    const filledDegrees = progress * 3.6;
    const isVisitedClick = normalizedAngle <= filledDegrees;

    toggleStatusFilter(isVisitedClick ? 'visited' : 'missing');
    applyFilters();
  }

  function handleRingKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const ring = document.getElementById('quest-progress-ring');
      if (!ring) return;

      const progress = Number(ring.style.getPropertyValue('--progress')) || 0;
      const nextStatus = progress > 50 ? 'visited' : 'missing';
      toggleStatusFilter(nextStatus);
      applyFilters();
    }
  }

  function initMap() {
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([48.7, 19.7], 7);

    state.map = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const regionSelect = document.getElementById('region-select');
    const districtSelect = document.getElementById('district-select');
    const ring = document.getElementById('quest-progress-ring');

    if (regionSelect) {
      regionSelect.addEventListener('change', (event) => {
        state.selectedRegion = event.target.value;
        state.selectedDistrict = 'All';
        updateDistrictOptions();
        applyFilters();
      });
    }

    if (districtSelect) {
      districtSelect.addEventListener('change', (event) => {
        state.selectedDistrict = event.target.value;
        applyFilters();
      });
    }

    if (ring) {
      ring.addEventListener('click', handleRingClick);
      ring.addEventListener('keydown', handleRingKeydown);
      ring.style.cursor = 'pointer';
    }

    fetch('atlas_sk.geojson')
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.status}`);
        return response.json();
      })
      .then((geojson) => {
        const features = Array.isArray(geojson && geojson.features) ? geojson.features : [];
        state.allFeatures = features;
        state.regionToDistricts = buildRegionDistrictIndex(features);
        populateRegionOptions(features);
        updateDistrictOptions();
        applyFilters();

        window._footprintedMap = map;
      })
      .catch((error) => {
        console.error(error);
        let banner = document.getElementById('map-error-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'map-error-banner';
          banner.style.position = 'absolute';
          banner.style.left = '24px';
          banner.style.right = '24px';
          banner.style.top = '24px';
          banner.style.padding = '10px 14px';
          banner.style.background = 'rgba(200,60,60,0.95)';
          banner.style.color = '#fff';
          banner.style.borderRadius = '8px';
          banner.style.zIndex = 1200;
          banner.textContent = 'Map data failed to load.';
          document.querySelector('.map-panel').appendChild(banner);
        }
      });

    window.addEventListener('resize', () => {
      setTimeout(() => map.invalidateSize(), 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
