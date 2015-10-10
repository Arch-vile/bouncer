'use strict';

var bounceDao = require('../dao/bounce');

exports.show = function(req, res) {
	var token = req.params.token;
	console.error(token);

	bounceDao.findByToken(token, function(err, bounce) {
		if (err) {
			return res.status(500).send('Ouch! Internal error');
		} else if (!bounce) {
			return res.status(404).send('Not Found');
		} else {
			return res.json(doc[0]);
		}
	});

};