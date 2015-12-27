'use strict';

var jade = require('jade');
var config = require('../../config/environment');

exports.build = function(bounce, next) {

	var options = {
		pretty: true,
		topic: bounce.topic,
		appURL: getAppUrl(),
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


function getAppUrl() {
	if (!config.emailLinkTarget) {
		throw new Error("config.emailLinkTarget not set")
	} else {
		return config.emailLinkTarget;
	}
}