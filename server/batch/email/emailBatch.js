'use strict';

var dao = require('../../api/dao/bounce');
var emailService = require('../../service/email');
var builder = require('./emailBuilder');
var logger = require('log4js').getLogger('emailBatch');

exports.run = function() {
	logger.info('Running email batch job');
	dao.getPending(function(err, pending) {
		if (err) {
			// TODO: log error and alert
		} else {
			logger.info('Sending ' + pending.length + ' reminders');
			pending.forEach(function(bounce) { 
				logger.info('Sending reminder with topic: ' + bounce.topic);
				builder.build(bounce, function(err, html) {
					if (err) {
						logger.error("Error building email content: " + err);
					} else {
						emailService.send(bounce.topic, html, bounce.email, function(err) {
							if (err) {
								logger.error("Error sending email: " + err);
							} else {
								dao.deactivate(bounce, function(err, updated) {
									if (err) {
										logger.error("Error deactivating bounce: " + err);
									} else {
										logger.info('Reminder sent successfully');
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