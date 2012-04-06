module.exports = function (req, res) {
	res.render('ask', { title: 'Ask Question', phrase: req.query.phrase || '' });
};