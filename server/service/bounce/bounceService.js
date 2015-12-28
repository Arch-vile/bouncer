'use strict';

var dao = require('../../api/dao/bounce');
var dateTimeProvider = require('../../api/utils/dateTimeProvider');

exports.defer = function(bounce, amount, units, next) {
	bounce.active = true;
	bounce.moment = dateTimeProvider.defer(amount, units);
	dao.update(bounce, next);
};