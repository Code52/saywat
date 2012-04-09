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
    // This is an awful way to do the test.
    // Having a lot of trouble finding a good html/dom parser that 
    // works on windows though
    assert.ok(body.indexOf('<title>say wat?</title>') !== -1);
  })
});