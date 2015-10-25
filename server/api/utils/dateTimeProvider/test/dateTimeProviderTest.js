'use strict';

var should = require('should');
var assert = require('assert');
var dateTimeProvider = require('../');

describe('dataTimeProvider', function() {

	describe('currentDateTime', function() {

		// Miserable test but will do for now
		it('should return current date and time', function() {
			// Given: time just now
			var earlier = new Date();

			// When: datatime is requested
			var dateTime = dateTimeProvider.currentDateTime();

			// Then: It is after earlier but before current
			var current = new Date();
			assert(earlier <= dateTime);
			assert(current >= dateTime);
		});


	});


});