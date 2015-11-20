'use strict';

var db = require('../db');
var logger = require('log4js').getLogger('bounce.dao');

exports.findByToken = function(token, next) {
	db.getCollection('bounces').find({
		token: token
	}, {}, function(err, doc) {
		if (err) {
			logger.error("There was a DB problem getting bounce by token [%s]: %s", token, JSON.stringify(err));
			next(new Error("Techinal DB error"));
		} else if (doc.length > 1) {
			next(new Error("More then one match"));
		} else {
			next(null, doc[0]);
		}
	});
};

exports.create = function(bounce, next) {
	db.getCollection('bounces').insert(bounce, function(err, doc) {
		if (err) {
			logger.error("There was a DB error creating new bounce [%s]: %s", JSON.stringify(bounce), JSON.stringify(err));
			next(err);
		} else {
			next(null, doc);
		}
	});
};