// Define our variables
var MOHCD_DATA_URL = 'https://data.sfgov.org/resource/9rdx-httc.json';
var h = require('hyperscript');

// When the page is loaded
// https://caniuse.com/#feat=domcontentloaded
window.addEventListener('DOMContentLoaded', function handleDOMContentLoaded (evt) {
  // Start handling our dynamic content
  // DEV: We could break this into its own component but this webpage is *very* single purpose
  var containerEl = document.getElementById('dynamic-content');
  if (!containerEl) {
    throw new Error('Unable to find container element #dynamic-content');
  }
  function handleError(err) {
    console.error(err);
    containerEl.textContent = 'Failed to load MOHCD data. Error: ' + err.message;
  }
  function handleData(data) {
    containerEl.innerHTML = '';
    containerEl.appendChild(
      h('table', [
        h('thead', [
          h('th', 'Address'),
          h('th', 'Neighborhood'),
          h('th', 'Affordable units'),
          h('th', 'Total units'),
          h('th', 'Year building constructed'),
          h('th', 'Year affordability began'),
        ])
      ])
    );
  }

  // Load our dataset
  // DEV: We could use a library (e.g. jQuery, request) for this but it's simple/small enough
  // DEV: We are skipping the ActiveX version as we don't need to support IE6
  //   https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest_in_IE6
  // http://youmightnotneedjquery.com/#json
  var xhr = new XMLHttpRequest();
  xhr.open('GET', MOHCD_DATA_URL, true /* async */);
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
});
