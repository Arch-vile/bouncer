'use strict';

var config = require('../environment');

exports.demand = function(key) {
	if (!config[key]) {
		throw new Error("Demanded property not found: " + key);
	} else {
		return config[key];
	}
};