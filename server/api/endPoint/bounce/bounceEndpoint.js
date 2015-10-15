'use strict';

var validator = require('validator');
var bounceDao = require('../../dao/bounce');

exports.show = function(req, res) {
	var token = req.params.token;

	bounceDao.findByToken(token, function(err, bounce) {
		if (err) {
			return res.status(500).send('Ouch! Internal error');
		} else if (!bounce) {
			return res.status(404).send('Not Found');
		} else {
			return res.json(bounce);
		}
	});

};

exports.create = function(req, res) {

	var moment = req.body.moment;
	var topic = req.body.topic;
	var email = req.body.email;

	if (!validator.isEmail(email) || !validator.isLength(email, 4, 60)) {
		return res.status(400).send('bad email');
	}

	if (!validator.isLength(topic, 4, 120)) {
		return res.status(400).send('bad topic');
	}

	if (!validator.isISO8601(moment)) {
		return res.status(400).send('not a ISO8601 date');
	}

	var bounce = {
		moment: new Date(moment),
		topic: topic,
		email: email
	};

	bounceDao.create(bounce, function(err, created) {

		if (err) {
			return res.status(500).send('Ouch! Internal error');
		} else {
			return res.json(created);
		}
	});


};