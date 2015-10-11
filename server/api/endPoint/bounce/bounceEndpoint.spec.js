'use strict';

var should = require('should');
var assert = require('assert');
var rewire = require('rewire');
var endpoint = rewire('./bounceEndpoint');

var httpMocks = require('node-mocks-http');


function setupDaoMock(err, bounce) {
	endpoint.__set__({
		bounceDao: {
			findByToken: function(token, next) {
				token.should.equal('theToken');
				next(err, bounce);
			}
		}
	});
}

var request = httpMocks.createRequest({
	method: 'GET',
	params: {
		token: 'theToken'
	}
});


describe('bounceEndpoint', function() {

	describe('show()', function() {

		it('should return bounce as json', function() {
			setupDaoMock(null, [{
				value: '1'
			}]);
			var response = httpMocks.createResponse();
			endpoint.show(request, response);

			response.statusCode.should.equal(200);
			response._getData().should.equal('{\"value\":\"1\"}');
		});

		it('should return status 500 if internal error ', function() {
			setupDaoMock(new Error('some error'), "value");
			var response = httpMocks.createResponse();
			endpoint.show(request, response);

			response.statusCode.should.equal(500);
		});

		it('should return status 404 if no results', function() {
			setupDaoMock(null, null);
			var response = httpMocks.createResponse();
			endpoint.show(request, response);

			response.statusCode.should.equal(404);
		});



	});



});