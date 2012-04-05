module.exports = function (req, res) {
  res.render('create', { title: 'say wat?', phrase: req.query.phrase || '' });
};