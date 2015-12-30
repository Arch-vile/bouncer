'use strict';

var jade = require('jade');
var properties = require('../../config/propertyProvider');

exports.build = function(bounce, next) {

	var options = {
		pretty: true,
		topic: bounce.topic,
		appURL: properties.demand('domain'),
		token: bounce.token
	};

	jade.renderFile('server/batch/email/bounceEmailTemplate.jade', options, function(err, html) {
		if (err) {
			console.error("Could not render email content: ", err);
			next(err);
		} else {
			next(null, html);
		}
	});

};