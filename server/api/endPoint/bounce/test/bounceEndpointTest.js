'use strict';

var should = require('should');
var assert = require('assert');
var httpMocks = require('node-mocks-http');
var mockery = require('mockery');



describe('bounceEndpoint', function() {

	var response;

	var validToken = '1234567890123456789012345678901234567890';

	var validBounce = {
		topic: 'some topic',
		moment: new Date('2016-10-12T22:10:20+03:00'),
		email: 'john.doe@cia.com',
		token: validToken
	}

	var endpoint;

	var daoMock = {



	};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../../dao/bounce', daoMock);
		mockery.registerAllowable('../bounceEndpoint');
		mockery.registerAllowable('validator');
		mockery.registerAllowable('querystring');
		endpoint = require('../bounceEndpoint');
	});

	after(function() {
		mockery.disable();
	});

	beforeEach(function() {
		daoMock.findByToken = function() {};
		daoMock.create = function() {};
		response = httpMocks.createResponse();
	});

	describe('show()', function() {

		var getRequest = httpMocks.createRequest({
			method: 'GET',
			params: {
				token: validToken
			}
		});


		it('should return bounce as json', function() {
			// Given: Bounce is returned
			daoMock.findByToken = function(token, next) {
				next(null, validBounce);
			};

			// When: Requested
			endpoint.show(getRequest, response);

			// Then: 200 status and bounce as JSON
			response.statusCode.should.equal(200);
			response._getData().should.eql(JSON.stringify(validBounce));
		});

		it('should use token from request to find the bounce', function() {

			// Given: Correct token is expected
			daoMock.findByToken = function(token, next) {
				token.should.equal(validToken);
			};

			// When: requested
			endpoint.show(getRequest, response);

			// Then: All ok

		});

		it('should return status 500 if internal error ', function() {
			// Given: Internal error happens
			daoMock.findByToken = function(token, next) {
				next(new Error("some error"));
			};

			// When: Requested
			endpoint.show(getRequest, response);

			// Then: 500 status is given
			response.statusCode.should.equal(500);
		});

		it('should return status 404 if no results', function() {
			/// Given: No docs found
			daoMock.findByToken = function(token, next) {
				next(null, null);
			};

			// When: Requested
			endpoint.show(getRequest, response);

			// Then: 404 status is given
			response.statusCode.should.equal(404);
		});
	});

	describe('create()', function() {

		var postRequest;

		beforeEach(function() {
			postRequest = httpMocks.createRequest({
				method: 'POST',
				body: {
					moment: '2015-10-12T22:10:20+03:00',
					topic: 'some topic',
					email: 'someEmail@email.com'
				}
			});
		});


		it('should return created as json', function() {
			// Given: Bounce is created
			daoMock.create = function(bounce, next) {
				next(null, validBounce);
			};

			// When: Requested
			endpoint.create(postRequest, response);

			// Then: Created bounce returned as JSON
			response.statusCode.should.equal(200);
			response._getData().should.equal(JSON.stringify(validBounce));
		});

		it('should return status 500 if internal error on dao create', function() {
			// Given: Internal error happens
			daoMock.create = function(bounce, next) {
				next(new Error(""));
			};

			// When: POST is requested
			endpoint.create(postRequest, response);

			// Then: Status 500 returned
			response.statusCode.should.equal(500);
		});

		it('it should return status 400 for invalid email', function() {
			// Given: Request with illegal email
			postRequest.body.email = 'nonsense';

			// When: Requested
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

		it('it should return status 400 for invalid topic', function() {
			// Given: Request with illegal email
			postRequest.body.topic = 'a';

			// When: Requested
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

		it('should return status 400 for invalid moment', function() {
			// Given: Request with illegal email
			postRequest.body.moment = 'a';

			// When: Requested
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

	});


	describe('defer()', function() {

		var putRequest;

		beforeEach(function() {
			putRequest = httpMocks.createRequest({
				method: 'PUT',
				body: {
					units: 'days',
					amount: 1,
					token: validToken
				}
			});

		});


		it('should return status 400 for invalid token', function() {

			// Given: the request with invalid token
			putRequest.body.token = 'invalid';

			// When: Deferred
			endpoint.defer(putRequest, response);

			// Then: Status 400 returned
			response.statusCode.should.equal(400);

		});

		it('should fetch with token from request', function() {

			// Expect: token from request is used
			daoMock.findByToken = function(token, next) {
				token.should.equal(validToken);
			};

			// When: Deferred 
			endpoint.defer(putRequest, response);

		});

		it('should return status 500 if internal error finding the bounce', function() {

			// Given: Internal error when finding the bounce
			daoMock.findByToken = function(token, next) {
				next(new Error(""));
			};

			// When: Deferred
			endpoint.defer(putRequest, response);

			// Then: Status 500 is returned
			response.statusCode.should.equal(500);

		});

		it('should return status 404 if bounce is not found', function() {
			// Given: Bounce is not found by token
			daoMock.findByToken = function(token, next) {
				next(null, null);
			};

			// When: Deferred
			endpoint.defer(putRequest, response);

			// Then: Status 404 is returned
			response.statusCode.should.equal(404);
		});

		it('should return status 400 if invalid time unit', function() {
			// Given: The units parameter with invalid value
			putRequest.body.units = 'splitSecond';

			// When: Deferred
			endpoint.defer(putRequest, response);

			// Then: Status 404 is returned
			response.statusCode.should.equal(400);
		});

		it('should return status 400 if unit count not a number', function() {
			// Given: The units parameter with invalid value
			putRequest.body.amount = 'many';

			// When: Deferred
			endpoint.defer(putRequest, response);

			// Then: Status 404 is returned
			response.statusCode.should.equal(400);
		});

	});
});