'use strict';

var properties = require('../../config/propertyProvider');
var sendgrid = require('sendgrid')(properties.demand('sendgridAPIKey'));


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