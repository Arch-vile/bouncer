'use strict';

var dao = require('../../api/dao/bounce');
var emailService = require('../../service/email');
var builder = require('./emailBuilder');

exports.run = function() {

	dao.getPending(function(err, pending) {
		if (err) {
			// TODO: log error and alert
		} else {
			pending.forEach(function(bounce) { 
				builder.build(bounce, function(err, email) {
					if (err) {
						// TODO: log error and alert
					} else {
						emailService.send(email, function(err) {
							// TODO: log error and alert
						});
					}
				});

			});
		}
	});

};