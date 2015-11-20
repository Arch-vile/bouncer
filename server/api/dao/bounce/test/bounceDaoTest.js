'use strict';

var should = require('should');
var assert = require('assert');
var mockery = require('mockery');

describe('bounce.dao', function() {

	var validBounce = {
		topic: 'some topic',
		moment: new Date('2016-10-12T22:10:20+03:00'),
		email: 'john.doe@cia.com',
		token: '1234567890123456789012345678901234567890'
	}

	var bounceDao;

	var collectionMock = {
		find: function(search, options, next) {},
		insert: function(toCreate, next) {}
	};

	var dbMock = {
		getCollection: function(collection) {
			collection.should.equal('bounces');
			return collectionMock;
		}
	};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../db', dbMock);
		mockery.registerAllowable('log4js');
		mockery.registerAllowable('crypto');
		mockery.registerAllowable('../bounce.dao');
		bounceDao = require('../bounce.dao');
	});

	after(function() {
		mockery.disable();
	});

	beforeEach(function() {
		collectionMock.find = function(search, options, next) {};
		collectionMock.insert = function(toCreate, next) {};
	});


	describe('findByToken()', function() {

		it('should search by token', function() {
			// Given: Search term and options captured
			var search;
			var options;
			collectionMock.find = function(_search, _options, next) {
				search = _search;
				options = _options;
			};

			// When: Searched
			bounceDao.findByToken('myToken', function(err, doc) {});

			// Then: Token used in search 
			search.should.eql({
				token: 'myToken'
			});

			// And: No options
			options.should.eql({});
		});

		it('should return doc if single found', function() {
			// Given: One doc is found in collection
			collectionMock.find = function(search, options, next) {
				next(null, [validBounce]);
			};

			// When: Doc is searched
			var doc;
			var err;
			bounceDao.findByToken('any', function(_err, _doc) {
				doc = _doc;
				err = _err;
			});

			// Then: Found bunce is returned without errors
			should.not.exist(err);
			doc.should.eql(validBounce);

		});

		it('should return error if more then one match', function() {

			// Given: Multiple matches
			collectionMock.find = function(search, options, next) {
				next(null, [{}, {}]);
			};

			// When: Searched
			var err, doc;
			bounceDao.findByToken('any', function(_err, _doc) {
				err = _err;
				doc = _doc;
			});

			// Then: Error returned
			should.exist(err);
			should.not.exist(doc);
		});

		it('should return error if db error', function() {

			// Given: Error on find
			collectionMock.find = function(search, options, next) {
				next(new Error("some"));
			};

			// When: Searched
			var err, doc;
			bounceDao.findByToken('some', function(_err, _doc) {
				err = _err;
				doc = _doc;
			});

			// Then: Error returned
			should.exist(err);
			should.not.exist(doc);

		});

	});

	describe('create()', function() {

		it('should return created bounce', function() {

			// Given: insert is successfull
			collectionMock.insert = function(toCreate, next) {
				next(null, validBounce);
			};

			// When: Created
			var err, doc;
			bounceDao.create({}, function(_err, _doc) {
				err = _err;
				doc = _doc;
			});

			// Then: created bounce returned
			should.not.exist(err);
			doc.should.eql(validBounce);

		});

		it('should return error if db error', function() {

			// Given: insert fails
			collectionMock.insert = function(toCreate, next) {
				next(new Error("some"));
			};

			// When: Created
			var err, doc;
			bounceDao.create({}, function(_err, _doc) {
				err = _err;
				doc = _doc;
			});

			// Then: error returned
			should.exist(err);
			should.not.exist(doc);
		});

	});

});