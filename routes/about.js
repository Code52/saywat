var routes = function (app) {
  app.get('/about', function (req, res) {
    res.render('about', { title: 'About | say wat?' });
  });
};

module.exports = routes;