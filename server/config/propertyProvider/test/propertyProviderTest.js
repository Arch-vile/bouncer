'use strict';

var should = require('should');
var assert = require('assert');
var mockery = require('mockery');



describe('propertyProvider', function() {

	var provider;

	var configMock = {
		prop: 'foobar'
	}


	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../environment', configMock);
		mockery.registerAllowable('../propertyProvider');
		provider = require('../propertyProvider');
	});

	after(function() {
		mockery.disable();
		mockery.deregisterAll();
	});

	describe('demand()', function() {

		it('should return property if set', function() {
			assert.equal(provider.demand('prop'), 'foobar');
		});

		it('should throw error if demanded property not set', function() {
			assert.throws(function() {
				provider.demand('missing')
			}, Error);
		});

	});


});