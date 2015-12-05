'use strict';

var config = require('../../config/environment');
var sendgrid = require('sendgrid')(config.sendgridAPIKey);


exports.send = function(subject, message, to, next) {
	message = {
		subject: subject,
		html: message,
		to: to
	};
	message.from = 'do_not_reply@bouncer.mybluemix.net';
	message.text = 'Seems your email reader does not support html, tough luck';
	sendgrid.send(message, function(err) {
		next(err);
	});
};