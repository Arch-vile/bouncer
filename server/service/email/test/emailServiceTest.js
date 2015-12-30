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
		mockery.registerMock('../../config/propertyProvider', configMock);
		service = require('../emailService');
	});

	after(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	beforeEach(function() {
		captureEmail = null;
		sendGridMock.send = function(email, next) {
			captureEmail = email;
		};
	});

	describe('send()', function() {

		it('should create email', function() {

			// When: Email is sent
			service.send('subject here', 'html content', 'toAddress');

			// Then: Fields are passed forward
			captureEmail.to.should.equal('toAddress');
			captureEmail.subject.should.equal('subject here');
			captureEmail.html.should.equal('html content');
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
			service.send('subject', 'message', 'to', function(err) {
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
			service.send('subject', 'message', 'to', function(err) {
				// Then: Error callback called
				should.exist(err);
				done();
			});
		});


	});


});