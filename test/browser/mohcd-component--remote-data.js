// Load in our dependencies
var expect = require('chai').expect;
var h = require('hyperscript');
var mohcdComponent = require('../../browser/js/mohcd-component.js');
var mohcdTestData = require('../test-files/9rdx-httc-reduced.json');
var sinon = require('sinon');

// Create test utilities
function createSinonServer(responses) {
  before(function stubXhr () {
    var sinonServer = this.sinonServer = sinon.createFakeServer();
    responses.forEach(function (response) {
      sinonServer.respondWith.apply(sinonServer, response);
    });
    this.sinonServer.autoRespond = true;
    this.sinonServer.respondImmediately = true;
  });
  after(function cleanup () {
    this.sinonServer.restore();
    delete this.sinonServer;
  });
}
function initMohcdComponent() {
  before(function () {
    this.testContainer = h('div');
    mohcdComponent.init(this.testContainer);
  });
  after(function () {
    delete this.testContainer;
  });
}

// Define our tests
describe('An MOHCD component loading remote data', function () {
  describe('with a successful load', function () {
    createSinonServer([
      ['GET', 'https://data.sfgov.org/resource/9rdx-httc.json',
        [200, {'Content-Type': 'application/json'}, JSON.stringify(mohcdTestData)]]
    ]);
    initMohcdComponent();

    it('renders data', function () {
      // Sanity check we hit our fake server
      expect(this.sinonServer.requests).to.have.length(1);

      // Verify our expected content exists
      expect(this.testContainer.textContent).to.contain('1680 Eddy St');
    });
  });

  describe('with an unsuccessful load', function () {
    createSinonServer([
      ['GET', 'https://data.sfgov.org/resource/9rdx-httc.json',
        [500, {}, 'Internal server error']]
    ]);
    before(function stubConsoleError () {
      sinon.stub(console, 'error');
    });
    initMohcdComponent();
    after(function cleanup () {
      console.error.restore();
    });

    it('renders an error', function () {
      // Sanity check we hit our fake server
      expect(this.sinonServer.requests).to.have.length(1);

      // Verify our expected content exists
      expect(this.testContainer.textContent).to.contain('but received 500');
    });
  });
});
