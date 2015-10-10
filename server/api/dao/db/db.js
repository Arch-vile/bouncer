'use strict';

var config = require('../../../config/environment');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.mongo.uri);

exports.getCollection = function(collection) {
	return db.get(collection);
};