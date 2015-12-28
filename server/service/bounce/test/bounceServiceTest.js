'use strict';

var should = require('should');
var assert = require('assert');
var mockery = require('mockery');

describe('bounceService', function() {


	var service;
	var daoMock = { };
	var dateTimeMock = {};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../../api/dao/bounce', daoMock);
		mockery.registerMock('../../api/utils/dateTimeProvider', dateTimeMock);
		mockery.registerAllowable('../bounceService');
		service = require('../bounceService');
	});

	beforeEach(function() {
		daoMock.update = function(bounce, next) {};
		dateTimeMock.defer = function(amount, units) {};
	});

	after(function() {
		mockery.disable();
		mockery.deregisterAll();
	});



	describe('defer()', function() {

		var updatedBounce;
		beforeEach(function() {
			daoMock.update = function(bounce, next) {
				updatedBounce = bounce;
			};
		});

		it('should set bounce active', function() {

			// When: Deferred
			service.defer({
				active: false 
			});

			// Then: Bounce should be set active
			assert(updatedBounce.active);
		});


		it('should set deferred moment', function() {

			// Given: Deferred moment
			dateTimeMock.defer = function(amount, units) {
				assert.equal(amount, 2);
				assert.equal(units, 'someUnit');
				return new Date('2016-12-31T22:10:20+03:00');
			};

			// When: Deferred
			service.defer({
				moment: new Date()
			}, 2, 'someUnit');

			// Then: Moment is deferred
			assert.equal(updatedBounce.moment.valueOf(), new Date('2016-12-31T22:10:20+03:00').valueOf());
		});

		it('should pass callback', function(done) {

			// Given: Callback from dao
			daoMock.update = function(bounce, next) {
				next();
			};

			// When: Service is called
			service.defer({}, null, null, function() {
				done();
			});

		});

	});

});