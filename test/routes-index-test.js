var assert = require('assert')
  , request = require('request')
  ;

describe('GET /index', function() {
  var body = null;
  before(function(done) {
    request.get('http://localhost:3001/', function (err, resp, _body) {
      body= _body;
      done();
    })
  });

  it('should set the title', function () {
    assert.ok(body);
  })
});