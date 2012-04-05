
/**
 * Module dependencies.
 */

var express = require('express')
  , less = require('less')
  , mongoose = require('mongoose')
  , MongoSession = require('connect-mongo')
  , port = process.env.C9_PORT || process.env.PORT || 3000  // Cloud9 || Heroku || localhost
  , address = process.env.C9_PORT ? "0.0.0.0" : undefined   // Cloud9 || everything else
  , mongoUrl = process.env.MONGOLAB_URI || "mongodb://localhost/saywat"
  , sessionSecret = process.env.SESSION_SECRET || "kjhsdKJH897qweyBJHBq234huidsfjkh34sdf13ASD" // Set a deployment var on Heroku to override this
  ;

var app = module.exports = express.createServer();
mongoose.connect(mongoUrl);
require('./data/config.js');

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
  app.use(express.cookieParser());
  app.use(express.session({ secret : sessionSecret, maxAge: new Date(Date.now() + 3600000), store: new MongoSession({ url: mongoUrl }) }));
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
app.get('/create', require('./routes/create.js'));
app.get('/wat/:id', require('./routes/wat.js'));

app.post('/search', require('./routes/search.js'));

app.listen(port, address);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
