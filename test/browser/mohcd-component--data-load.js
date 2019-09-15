// Load in our dependencies
var expect = require('chai').expect;
var h = require('hyperscript');
var mohcdComponent = require('../../browser/js/mohcd-component.js');
var mochdTestData = require('../test-files/9rdx-httc-reduced.json');
var sinon = require('sinon');

// Define our tests
describe('An MOHCD component loading data', function () {
  describe('with a successful load', function () {
    before(function stubXhr () {
      this.sinonServer = sinon.useFakeXMLHttpRequest();
      this.sinonReqs = [];
      this.sinonServer.onCreate = function (req) {
        expect(req.url).to.contain('https://data.sfgov.org/');
        req.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mochdTestData));
        this.sinonReqs.push(req);
      };
    });
    before(function () {
      var testContainer = h('div');
      mohcdComponent.init(testContainer);
    });
    after(function cleanup () {
      this.sinonServer.restore();
      delete this.sinonServer;
      delete this.sinonReqs;
    });

    it('renders data', function () {
      expect(this.sinonReqs).to.have.length(1);
    });
  });

  describe('with an unsuccessful load', function () {
    it('renders an error', function () {
      // TODO: Complete test
    });
  });
});
