var mongoose = require('mongoose')
  , url = require('url')
  , flow = require('flow')
  , Wat = mongoose.model('Wat')
  , User = mongoose.model('User')
  , routes
  ;

routes = function (app) {
  app.get('/ask', function (req, res) {
    res.render('ask', { title: 'Ask Question', phrase: req.query.phrase || '' });
  });

  app.post('/ask', function (req, res) {
    if (!req.body.phrase  || req.body.phrase.length === 0)    { return res.send('No phrase entered'); }
    if (!req.body.example || req.body.example.sentence === 0) { return res.send('No example entered'); }
    if (!req.body.region  || req.body.region.length === 0)    { return res.send('No region entered'); }

    var currentUser;

    flow.exec(
      function () {
        // User auth is not currently set up, using test data until this is done
        User.find({ displayName: 'csainty' }, this);
      },
      function (err, result) {
        if (!result) { return res.send('No user found'); }

        currentUser = result[0];
        Wat.find({ phrase: req.body.phrase }, this);
      },
      function (err, result) {
        if (err) { console.log(err); return res.send('No likey'); }
        if (result.length !== 0) {
          return res.send('Someone beat you to it! ' + req.body.phrase + ' has already been asked about.');
        }

        var newWat = new Wat({
          _user: currentUser,
          phrase: req.body.phrase,
          region: req.body.region,
          example: req.body.example
        });

        newWat.save(this);
      }, function (err, wat) {
        if (err || !wat) { return res.redirect('/ask'); }
        res.redirect('/wat/' + wat._id);
      });
  });
};
module.exports = routes;