// Load in our dependencies
var mohcdComponent = require('./mohcd-component.js');

// When the page is loaded
// https://caniuse.com/#feat=domcontentloaded
window.addEventListener('DOMContentLoaded', function handleDOMContentLoaded(evt) {
  // Initialize our MOHCD component into its container
  var containerEl = document.getElementById('mohcd-container');
  if (!containerEl) {
    throw new Error('Unable to find container element #mohcd-container');
  }
  mohcdComponent.init(containerEl);
});
