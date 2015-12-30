'use strict';

var should = require('should');
var assert = require('assert');
var mockery = require('mockery');

describe('emailBuilder', function() {

	var builder;
	var configMock = {
		demand: function(key) {
			assert.equal(key, 'domain');
			return 'http://theapp.com';
		}

	};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('../../config/propertyProvider', configMock);
		mockery.registerAllowable('../emailBuilder');
		builder = require('../emailBuilder');
	});

	after(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('build', function() {

		var bounce = {
			topic: 'this is the topic',
			token: 'theToken'
		};

		it('should contain bounce topic', function(done) {
			builder.build(bounce, function(err, content) {
				assert(content.indexOf('this is the topic') !== -1);
				done();
			});
		});

		it('should contain links to defer the bounce', function(done) {
			builder.build(bounce, function(err, content) {

				// Defer two hours
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=2&amp;units=hours') !== -1);

				// Defer four hours
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=4&amp;units=hours') !== -1);

				// Defer one day
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=1&amp;units=days') !== -1);

				// Defer two days
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=2&amp;units=days') !== -1);

				// Defer one week
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=1&amp;units=weeks') !== -1);

				// Defer two weeks
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=2&amp;units=weeks') !== -1);

				// Defer one month
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=1&amp;units=months') !== -1);

				// Defer two hours
				assert(content.indexOf('http://theapp.com/defer/theToken?amount=2&amp;units=months') !== -1);


				done();
			});
		});

	});

});