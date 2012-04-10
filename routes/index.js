var routes = function (app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'say wat?', layout: 'typeahead-layout' });
  });
};

module.exports = routes;