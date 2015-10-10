'use strict';

var db = require('../db');

exports.findByToken = function(token, next) {
	db.getCollection('bounces').find({
		token: token
	}, {}, function(err, doc) {
		if (err) {
			console.error("There was a DB problem getting bounce by token [%s]: %s", token, err);
			next(new Error("Techinal DB error"));
		} else if (doc.length > 1) {
			next(new Error("More then one match"));
		} else {
			next(null, doc[0]);
		}
	});
}