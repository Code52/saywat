var mongoose = require('mongoose')
  , Wat = mongoose.model('Wat')
  ;

module.exports = function (req, res) {
  if (!req.params.id) { return res.redirect('/'); }

  Wat
    .findById(req.params.id)
    .populate('_user')
    .populate('answers._user')
    .run(function (err, wat) {
      if (err) { return res.redirect('/error'); }
      if (!wat) { return res.redirect('/'); }

      if (req.accepts('json')) { return res.json(wat); }
      res.render('wat', { title: 'say wat?', id: req.params.id, wat: wat });
    });
};