'use strict';

// Development specific configuration
// ==================================
module.exports = {
	// MongoDB connection options
	mongo: {
		uri: 'mongodb://bouncer:DJas7IWUY9CD@ds027509.mongolab.com:27509/bouncer'
	},

	seedDB: true,

	emailLinkTarget: 'http://somestrangeUrlForNow'
};