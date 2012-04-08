module.exports = function (req, res) {
  res.render('index', { title: 'say wat?', layout: 'typeahead-layout' });
};