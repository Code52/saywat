
/**
 * Module dependencies.
 */

var express = require('express')
  , less = require('less')
  ;

var app = module.exports = express.createServer();

// Hack connect.js to allow relative @import statements in less.js'
express.compiler.compilers.less.compile = function (str, fn) {
  try {
    less.render(str, {paths: [__dirname + '/public/stylesheets/bootstrap']}, fn);
  } catch (err) {
    fn(err);
  }
};

// Configuration

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less']}));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

// Routes

app.get('/', require('./routes/index.js'));
app.get('/about', require('./routes/about.js'));
app.get('/ask', require('./routes/ask.js'));

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
