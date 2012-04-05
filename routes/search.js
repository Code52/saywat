var mongoose = require('mongoose')
  , url = require('url')
  , Wat = mongoose.model('Wat')
  ;

module.exports = function (req, res) {
  if (!req.body.q || req.body.q.length === 0) { return res.redirect('/'); }

  Wat
    .find({ phrase: req.body.q })
    .populate('_user')
    .run(function (err, results) {
      if (err) { return res.redirect('/error'); }
      if (results.length === 0) { return res.redirect(url.format({ pathname: '/create', query: { phrase: req.body.q } })); }
      res.render('search', { title: 'say wat?', results: results, query: req.body.q });
    });
};