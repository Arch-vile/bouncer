'use strict';

var db = require('../db');
var logger = require('log4js').getLogger('bounce.dao');

exports.findByToken = function(token, next) {
	db.getCollection('bounces').find({
		token: token
	}, {}, function(err, doc) {
		if (err) {
			logger.error("There was a DB problem getting bounce by token [%s]: %s", token, err);
			next(new Error("Techinal DB error"));
		} else if (doc.length > 1) {
			next(new Error("More then one match"));
		} else {
			next(null, doc[0]);
		}
	});
};

exports.create = function(bounce, next) {
	bounce.token = createToken();
	db.getCollection('bounces').insert(bounce, function(err, doc) {
		if (err) {
			logger.error("There was a DB error creating new bounce [%s]: %s", bounce, err);
			next(err);
		} else {
			next(null, doc);
		}
	});
};


function createToken() {
	var buf = require('crypto').randomBytes(20);
	return buf.toString('hex');
}