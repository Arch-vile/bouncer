'use strict';


var should = require('should');
var assert = require('assert');
var mockery = require('mockery');

describe('emailService', function() {

	var service;

	var captureEmail;
	var sendGridMock = {};
	var sendGridMockO = function(apikey) {
		return sendGridMock
	};
	var configMock = {};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('sendgrid', sendGridMockO);
		mockery.registerMock('../../config/environment', configMock);
		service = require('../emailService');
	});

	beforeEach(function() {
		captureEmail = null;
		sendGridMock.send = function(email, next) {
			captureEmail = email;
		};
	});

	describe('send()', function() {

		it('should pass fields to sendGrid', function() {

			// Given: Message to send
			var message = {
				to: 'toAddress',
				subject: 'subject here',
				html: 'html content'
			};

			// When: Email is sent
			service.send(message);

			// Then: Fields are passed forward
			captureEmail.to.should.equal(message.to);
			captureEmail.subject.should.equal(message.subject);
			captureEmail.html.should.equal(message.html);
		});

		it('should augment email', function() {
			// Given: Message to send
			var message = {};

			// When: Email is sent
			service.send(message);

			// Then: Fields are added
			captureEmail.from.should.equal('do_not_reply@bouncer.mybluemix.net');
			captureEmail.text.should.equal('Seems your email reader does not support html, tough luck');
		});

		it('should callback if all ok', function(done) {
			// Given: Email sending ok
			sendGridMock.send = function(email, next) {
				next();
			};

			// When: Email is sent
			service.send({}, function(err) {
				// Then: Callback without errors
				should.not.exist(err);
				done();
			});
		});

		it('should return error if sending fails', function(done) {
			// Given: Email sending fails
			sendGridMock.send = function(email, next) {
				next(new Error("Some error"));
			};

			// When: Email is sent
			service.send({}, function(err) {
				// Then: Error callback called
				should.exist(err);
				done();
			});
		});


	});


});