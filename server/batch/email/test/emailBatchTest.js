'use strict';

var should = require('should');
var assert = require('chai').assert;
var mockery = require('mockery');

describe('emailBatch', function() {

	var batch;

	var pendingBounce1 = {
		email: 'email1',
		topic: 'topic1'
	};
	var pendingBounce2 = {
		email: 'email2',
		topic: 'topic2'
	};

	var daoMock = {
		getPending: function(next) {
			next(null, [pendingBounce1, pendingBounce2]);
		},
		deactivate: function(bounce, next) {
			bounce.active = false;
			next(null, bounce);
		}
	};

	var emailBuilderMock = {
		build: function(bounce, next) {
			next(null, 'html for ' + bounce.topic);
		}
	};

	var emailServiceMock = {};

	after(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../../api/dao/bounce', daoMock);
		mockery.registerMock('../../service/email', emailServiceMock);
		mockery.registerMock('./emailBuilder', emailBuilderMock);
		mockery.registerAllowable('../emailBatch');
		batch = require('../emailBatch');
	});

	beforeEach(function() {
		emailServiceMock.send = function(topic, message, to, next) {
			next(null);
		};
	});

	describe('sendPending()', function() {

		it('should send email for pending', function() {
			// Given: Capture sent emails
			var emails = [];
			emailServiceMock.send = function(subject, message, to, next) {
				emails.push({
					subject: subject,
					message: message,
					to: to
				});
			}

			// When:
			batch.run();

			// Then: Proper emails sent
			assert.include(emails, {
				subject: 'topic1',
				message: 'html for topic1',
				to: 'email1'
			});
			assert.include(emails, {
				subject: 'topic2',
				message: 'html for topic2',
				to: 'email2'
			});
			assert.lengthOf(emails, 2);

		});

		it('should set sent bounces inactive', function() {
			// When:
			batch.run();

			// Then: Bounces are set inactive
			assert.isFalse(pendingBounce1.active);
			assert.isFalse(pendingBounce2.active);
		});

		it('handle error in dao', function() {
			// Given: error in dao
			daoMock.getPending = function(next) {
				next(new Error("some error"));
			};

			// When:
			batch.run();

			// Then: TODO: log error and alert

		});


		it('handle error in email builder');
		it('handle error in email sending');

	});


});