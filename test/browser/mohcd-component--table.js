// Load in our dependencies
var _ = require('underscore');
var expect = require('chai').expect;
var h = require('hyperscript');
var mohcdComponent = require('../../browser/js/mohcd-component.js');
var mohcdTestData = require('../test-files/9rdx-httc-reduced.json');
var simulant = require('simulant');

// Define our tests
describe('An MOHCD table subcomponent with local data', function () {
  // Success cases
  it('handles rendering address', function () {
    var testContainer = h('div');
    mohcdComponent.initWithLocalData(testContainer, [
      _.extend(mohcdTestData[0], {street_number: 100, street_name: 'Testtest', street_type: 'St'})
    ]);
    var tableEl = testContainer.querySelector('#mohcd-table');
    expect(tableEl.textContent).to.contain('100 Testtest St');
  });

  // Error cases
  it('handles missing street types', function () {
    var testContainer = h('div');
    mohcdComponent.initWithLocalData(testContainer, [
      _.extend(mohcdTestData[0], {street_number: 0, street_name: 'The Embarcadero', street_type: null})
    ]);
    var tableEl = testContainer.querySelector('#mohcd-table');
    expect(tableEl.textContent).to.contain('0 The Embarcadero');
    expect(tableEl.textContent).to.not.contain('null');
  });
  it('handles 0 total units', function () {
    var testContainer = h('div');
    mohcdComponent.initWithLocalData(testContainer, [
      _.extend(mohcdTestData[0], {affordable_units: 0, total_units: 0})
    ]);
    var tableEl = testContainer.querySelector('#mohcd-table');
    expect(tableEl.textContent).to.not.contain('NaN');
  });
});
