'use strict';

var dao = require('../../api/dao/bounce');
var emailService = require('../../service/email');
var builder = require('./emailBuilder');

exports.run = function() {
	console.info('Sending reminders');
	dao.getPending(function(err, pending) {
		if (err) {
			// TODO: log error and alert
		} else {
			console.info('Sending ' + pending.length + ' reminders');
			pending.forEach(function(bounce) { 
				builder.build(bounce, function(err, html) {
					if (err) {
						// TODO: log error and alert
					} else {
						emailService.send(bounce.topic, html, bounce.email, function(err) {
							if (err) {
								// TODO: log error and alert
								console.error("Error sending email: " + err);
							} else {
								console.info("Email sent to: " + bounce.email);
								dao.deactivate(bounce, function(err, updated) {
									if (err) {
										// TODO: log error and alert
									}
								});
							}
						});
					}
				});

			});
		}
	});

};