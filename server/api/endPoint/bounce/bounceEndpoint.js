'use strict';

var validator = require('validator');
var bounceDao = require('../../dao/bounce');
var bounceService = require('../../../service/bounce/bounceService');

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
	if (isNaN(Date.parse(moment))) {
		return res.status(400).send('not a valid date');
	}

	var bounce = {
		moment: new Date(Date.parse(moment)),
		topic: topic,
		email: email,
		active: true,
		token: createToken()
	};

	bounceDao.create(bounce, function(err, created) {

		if (err) {
			return res.status(500).send('Ouch! Internal error');
		} else {
			return res.json(created);
		}
	});
};


exports.defer = function(req, res) {

	var token = req.body.token;
	var units = req.body.units;
	var amount = req.body.amount;

	if (!validator.isLength(token, 40, 40)) {
		return res.status(400).send('bad token');
	}

	if (!validator.isIn(units, ["hours", "days", "weeks", "months"])) {
		return res.status(400).send('Units must be hours,days,weeks or months');
	}

	if (!validator.isInt(amount, {
			min: 1,
			max: 30
		})) {
		return res.status(400).send('amount needs to be between 1 and 30');
	}

	bounceDao.findByToken(token, function(err, doc) {
		if (err) {
			return res.status(500).send('Ouch! Internal error');
		} else if (!doc) {
			return res.status(404).send('Bounce not found');
		}

		bounceService.defer(doc, amount, units, function(err, updated) {
			if (err) {
				return res.status(500).send('Ouch! Internal error');
			}
			return res.json(updated);
		});

	});
};


function createToken() {
	var buf = require('crypto').randomBytes(20);
	return buf.toString('hex');
}