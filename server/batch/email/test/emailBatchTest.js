'use strict';

var should = require('should');
var assert = require('chai').assert;
var mockery = require('mockery');

describe('emailBatch', function() {

	var batch;

	var pendingBounce1 = {
		id: 1
	};
	var pendingBounce2 = {
		id: 2
	};

	var daoMock = {
		getPending: function(next) {
			next(null, [pendingBounce1, pendingBounce2]);
		}
	};

	var emailBuilderMock = {
		build: function(bounce, next) {
			next(null, 'html for ' + bounce.id);
		}
	};

	var emailServiceMock = {
		send: function(message, next) {
			next(null);
		}
	};

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

	describe('sendPending()', function() {

		it('send email for pending', function() {
			// Given: Capture sent emails
			var emails = [];
			emailServiceMock.send = function(message, next) {
				emails.push(message);
			}

			// When:
			batch.run();

			// Then:
			assert.include([1, 2, 3], 3, 'array contains value');
			assert.include(emails, 'html for 1');
			assert.include(emails, 'html for 2');

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