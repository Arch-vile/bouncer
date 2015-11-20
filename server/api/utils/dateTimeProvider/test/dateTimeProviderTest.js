'use strict';

var should = require('should');
var assert = require('assert');
var dateTimeProvider = require('../');

describe('dataTimeProvider', function() {

	dateTimeProvider.currentDateTime = function() {
		return new Date('2016-12-31T21:10:20+03:00');
	}

	describe('defer', function() {

		it('should defer by hours', function() {

			// When: defer by two hours
			var date = dateTimeProvider.defer(2, 'hours');

			// Then: correctly deferred
			assert(date.valueOf() === new Date('2016-12-31T23:10:20+03:00').valueOf());

		});

		it('should defer by days', function() {

			// When: defer by one day
			var date = dateTimeProvider.defer(1, 'days');

			// Then: correctly deferred
			assert(date.valueOf() === new Date('2017-01-01T21:10:20+03:00').valueOf());

		});

		it('should defer by weeks', function() {

			// When: defer by one day
			var date = dateTimeProvider.defer(3, 'weeks');

			// Then: correctly deferred
			assert(date.valueOf() === new Date('2017-01-21T21:10:20+03:00').valueOf());

		});

		it('should defer by months', function() {

			// When: defer by one day
			var date = dateTimeProvider.defer(1, 'months');

			// Then: correctly deferred
			assert(date.valueOf() === new Date('2017-01-31T21:10:20+03:00').valueOf());

		});


	});


});