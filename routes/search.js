var mongoose = require('mongoose')
  , url = require('url')
  , Wat = mongoose.model('Wat')
  ;

module.exports = function (req, res) {
  if (!req.query.q || req.query.q.length === 0) { return res.redirect('/'); }

  Wat
    .find({ phrase: req.query.q })
    .populate('_user')
    .run(function (err, results) {
      if (err) { return res.redirect('/error'); }
      if (req.accepts('json')) { return res.json(results); }
      if (results.length === 0) { return res.redirect(url.format({ pathname: '/ask', query: { phrase: req.query.q } })); }
      res.render('search', { title: 'say wat?', results: results, query: req.query.q });
    });
};