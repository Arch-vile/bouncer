'use strict';

var moment = require('moment');

exports.currentDateTime = function() {
	return new Date();
};


exports.defer = function(amount, units) {
	var newMoment = moment(this.currentDateTime()).add(amount, units);
	return newMoment.toDate();
}