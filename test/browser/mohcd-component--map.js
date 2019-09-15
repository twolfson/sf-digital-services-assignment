// Load in our dependencies
var _ = require('underscore');
var expect = require('chai').expect;
var h = require('hyperscript');
var mohcdComponent = require('../../browser/js/mohcd-component.js');
var mohcdTestData = require('../test-files/9rdx-httc-reduced.json');
var simulant = require('simulant');

// Define our tests
describe('An MOHCD map subcomponent with local data', function () {
  // Success cases
  it('handles rendering address', function () {
    var testContainer = h('div');
    mohcdComponent.initWithLocalData(testContainer, [
      _.extend(mohcdTestData[0], {street_number: 100, street_name: 'Testtest', street_type: 'St'})
    ]);
    var mapEl = testContainer.querySelector('#mohcd-map');
    var markerIcons = mapEl.querySelectorAll('.leaflet-marker-icon');
    expect(markerIcons).to.have.length(1);
    expect(mapEl.textContent).to.not.contain('100 Testtest St');
    simulant.fire(markerIcons[0], 'click');
    expect(mapEl.textContent).to.contain('100 Testtest St');
  });

  // Error cases
  it('skips over missing latitude/longitude', function () {
    var testContainer = h('div');
    mohcdComponent.initWithLocalData(testContainer, [
      _.extend(mohcdTestData[0]),
      _.extend(mohcdTestData[1], {latitude: null}),
      _.extend(mohcdTestData[2], {longitude: null}),
      _.extend(mohcdTestData[3])
    ]);
    var mapEl = testContainer.querySelector('#mohcd-map');
    expect(mapEl.querySelectorAll('.leaflet-marker-icon')).to.have.length(2);
  });
});
