'use strict';

var dateTimeProvider = require('../../utils/dateTimeProvider');
var db = require('../db');
var logger = require('log4js').getLogger('bounce.dao');

exports.findByToken = function(token, next) {
	db.getCollection('bounces').find({
		token: token
	}, {}, function(err, doc) {
		if (err) {
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
			next(err);
		} else {
			next(null, doc);
		}
	});
};


exports.update = function(bounce, next) {
	db.getCollection('bounces').update({
		token: bounce.token
	}, bounce, function(err, status) {
		next(err, bounce);
	});
};

exports.deactivate = function(bounce, next) {
	bounce.active = false;
	exports.update(bounce, next);
}

exports.getPending = function(next) {

	db.getCollection('bounces').find({
		$and: [{
			moment: {
				$lt: dateTimeProvider.currentDateTime()
			}
		}, {
			active: true
		}]
	}, {}, function(err, docs) {
		if (err) {
			next(new Error("Technical error finding pending"));
		} else {
			next(null, docs);
		}
	} );

};