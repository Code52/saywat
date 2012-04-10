var express = require('express')
  , less = require('less')
  , mongoose = require('mongoose')
  , MongoSession = require('connect-mongo')
  , sessionSecret = process.env.SESSION_SECRET || "kjhsdKJH897qweyBJHBq234huidsfjkh34sdf13ASD" // Set a deployment var on Heroku to override this
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

// Set configuration variables

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', process.env.C9_PORT || process.env.PORT || 3000); // Cloud9 || Heroku || localhost
  app.set('address', process.env.C9_PORT ? "0.0.0.0" : undefined); // Cloud9 || everything else
  app.set('mongo_url', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/saywat");
});

app.configure('test', function () {
  app.set('port', 3001);
  app.set('mongo_url', "mongodb://localhost/saywat_test");
});

// Configure express modules

app.configure(function () {
  app.use(express.cookieParser());
  app.use(express.session({ secret : sessionSecret, maxAge: new Date(Date.now() + 3600000), store: new MongoSession({ url: app.settings.mongo_url }) }));
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

// Database

mongoose.connect(app.settings.mongo_url);
require('./data/config.js');

// Routes

require('./routes/index.js')(app);
require('./routes/about.js')(app);
require('./routes/ask.js')(app);
require('./routes/wat.js')(app);
require('./routes/search.js')(app);

// Start server

app.listen(app.settings.port, app.settings.address);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
