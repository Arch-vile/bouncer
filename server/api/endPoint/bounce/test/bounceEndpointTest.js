'use strict';

var should = require('should');
var assert = require('assert');
var httpMocks = require('node-mocks-http');
var mockery = require('mockery');



describe('bounceEndpoint', function() {

	var endpoint;

	var daoMock = {
		err: null,
		doc: null,

		findByToken: function(token, next) {
			token.should.equal('theToken');
			next(this.err, this.doc);
		},

		create: function(bounce, next) {
			bounce.should.eql({
				moment: new Date('2015-10-12T22:10:20+03:00'),
				topic: 'some topic',
				email: 'someEmail@email.com'
			});
			next(this.err, this.doc);
		}
	};

	before(function() {
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
		daoMock.err = null;
		daoMock.doc = null;
	});

	describe('show()', function() {

		var getRequest = httpMocks.createRequest({
			method: 'GET',
			params: {
				token: 'theToken'
			}
		});


		it('should return bounce as json', function() {
			// Given: Bounce is returned
			daoMock.doc = {
				value: 1
			};

			// When: Requested
			var response = httpMocks.createResponse();
			endpoint.show(getRequest, response);

			// Then: 200 status and bounce as JSON
			response.statusCode.should.equal(200);
			response._getData().should.eql(JSON.stringify({ 
				value: 1
			}));

		});

		it('should return status 500 if internal error ', function() {
			// Given: Internal error happens
			daoMock.err = new Error("Some error");

			// When: Requested
			var response = httpMocks.createResponse();
			endpoint.show(getRequest, response);

			// Then: 500 status is given
			response.statusCode.should.equal(500);
		});

		it('should return status 404 if no results', function() {
			// Given: No docs found
			daoMock.doc = undefined;

			// When: Requested
			var response = httpMocks.createResponse();
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
			daoMock.doc = {
				value: 2
			};

			// When: POST is requested
			var response = httpMocks.createResponse();
			endpoint.create(postRequest, response);

			// Then: New bounce is created
			response.statusCode.should.equal(200);
			response._getData().should.equal(JSON.stringify({
				value: 2
			}));
		});

		it('should return status 500 if internal error', function() {
			// Given: Internal error happens
			daoMock.err = new Error("som error");

			// When: POST is requested
			var response = httpMocks.createResponse();
			endpoint.create(postRequest, response);

			// Then: Status 500 returned
			response.statusCode.should.equal(500);
		});

		it('it should return status 400 for invalid email', function() {
			// Given: Request with illegal email
			postRequest.body.email = 'nonsense';

			// When: Requested
			var response = httpMocks.createResponse();
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

		it('it should return status 400 for invalid topic', function() {
			// Given: Request with illegal email
			postRequest.body.topic = 'a';

			// When: Requested
			var response = httpMocks.createResponse();
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

		it('it should return status 400 for invalid moment', function() {
			// Given: Request with illegal email
			postRequest.body.moment = 'a';

			// When: Requested
			var response = httpMocks.createResponse();
			endpoint.create(postRequest, response);

			// Then:
			response.statusCode.should.equal(400);
		});

	});
});