// Load in our dependencies
var h = require('hyperscript');
var L = window.L; // Loaded via Leaflet CDN

// Define our constants
var MOHCD_DATA_URL = 'https://data.sfgov.org/resource/9rdx-httc.json';
var DEFAULT_MAP_LATITUDE = 37.7749;
var DEFAULT_MAP_LONGITUDE = -122.4194;
var DEFAULT_MAP_ZOOM = 12;

// Export our init handler
exports.init = function (containerEl) {
  exports.initWithRemoteData(containerEl, MOHCD_DATA_URL);
};

exports.initWithRemoteData = function (containerEl, dataUrl) {
  // Define our post-load handlers
  function handleError(err) {
    console.error(err); // eslint-disable-line no-console
    containerEl.textContent = 'Failed to load MOHCD data. Error: ' + err.message;
  }
  function handleData(data) {
    return exports.initWithLocalData(containerEl, data);
  }

  // Load our dataset
  // DEV: We could use a library (e.g. jQuery, request) for this but it's simple/small enough
  // DEV: We are skipping the ActiveX version as we don't need to support IE6
  //   https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest_in_IE6
  // http://youmightnotneedjquery.com/#json
  var xhr = new XMLHttpRequest();
  xhr.open('GET', dataUrl, true /* async */);
  xhr.responseType = 'text';
  xhr.onload = function () {
    // If we aren't done fully loading, then wait
    if (xhr.readyState !== xhr.DONE) {
      return;
    }

    // If we received a bad response, then error out
    if (xhr.status !== 200) {
      return handleError(new Error('Expected status code 200 from server but received ' + xhr.status));
    }
    var data = JSON.parse(xhr.response);
    handleData(data);
  };
  xhr.onerror = handleError;
  xhr.send();
};

exports.initWithLocalData = function (containerEl, data) {
  // Extend our data for reuse across our subcomponents
  data.forEach(function (row) {
    var percentAffordable = (row.affordable_units / row.total_units * 100);
    if (isNaN(percentAffordable) || percentAffordable > 100) {
      percentAffordable = 100;
    }
    row._percentAffordable = percentAffordable;

    // Extend our data
    row._address = row.street_number + ' ' + row.street_name + ' ' + (row.street_type || '');
  });

  containerEl.innerHTML = '';
  containerEl.appendChild(
    h('table#mohcd-table.table', [
      // TODO: Verify ChromeVox appreciates `thead`, pretty sure it's nice
      h('thead', [
        h('tr', [
          h('th', 'Address'),
          h('th', 'Neighborhood'),
          h('th', 'Affordable units'),
          h('th', 'Total units'),
          // TODO: Ensure aria reads this as `%` (not percent sign or similar)
          h('th', '% affordable units'),
          h('th', 'Year affordability began'),
          h('th', '')
        ])
      ]),
      // DEV: Look at `test/test-files/9rdx-httc-reduced.json` for reference entries
      h('tbody', data.map(function (row) {
        return h('tr', [
          h('td', row._address),
          h('td', row.neighborhood),
          // TODO: Is data practical in this format for a11y? (e.g. 243 linked to column)
          h('td', row.affordable_units),
          h('td', row.total_units),
          h('td', row._percentAffordable.toFixed(1) + '%'),
          h('td', row.year_affordability_began),
          h('td', [
            h('button.btn.btn-info', {
              onclick: function () {
                var marker = row._marker;
                // `openPopup` will automatically pan if marker is out of frame
                marker.openPopup();
              }
            }, 'View on map')
          ])
        ]);
      }))
    ])
  );

  var mapContainerEl = h('div#mohcd-map');
  containerEl.appendChild(mapContainerEl);
  var mohcdMap = L.map(mapContainerEl);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(mohcdMap);

  // Zoom to SF
  mohcdMap.setView([DEFAULT_MAP_LATITUDE, DEFAULT_MAP_LONGITUDE], DEFAULT_MAP_ZOOM);

  // Add our markers
  data.forEach(function (row) {
    // TODO: Add test for missing lat/lng
    // TODO: Add test for clicking on button to open marker
    // TODO: Add test to verify marker has address info
    // If we're missing data, skip this row
    if (!row.latitude || !row.longitude) {
      return;
    }

    // Otherwise, add a marker to our map
    var marker = L.marker([row.latitude, row.longitude]);
    marker.bindPopup(h('div', [
      row._address,
      h('br'),
      'Affordable units: ' + row.affordable_units,
      h('br'),
      'Total units: ' + row.total_units,
      h('br'),
      '% affordable units: ' + row._percentAffordable.toFixed(1) + '%',
      h('br'),
      'Year affordability began: ' + row.year_affordability_began
    ]));
    marker.addTo(mohcdMap);

    // Save our marker to linking subcomponents
    row._marker = marker;
  });
};
