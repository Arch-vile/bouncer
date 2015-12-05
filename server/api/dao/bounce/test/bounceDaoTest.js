'use strict';

var should = require('should');
var assert = require('chai').assert;
var mockery = require('mockery');

describe('bounce.dao', function() {

	var validBounce = {
		topic: 'some topic',
		moment: new Date('2016-10-12T22:10:20+03:00'),
		email: 'john.doe@cia.com',
		active: true,
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

	var dateTimeMock = {
		currentDateTime: function() {
			return new Date('2016-12-31T00:00:00+00:00');
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
		mockery.registerMock('../../utils/dateTimeProvider', dateTimeMock);
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

	describe('update()', function() {

		it('should update by token', function(done) {
			// Given: Validate search term
			collectionMock.update = function(search, bounce, next) {
				assert.deepEqual(search, {
					token: validBounce.token
				});
				done();
			};

			// When: Updated
			bounceDao.update(validBounce);
		});

		it('should update with given bounce', function(done) {

			// Given: Validate bounce to update
			collectionMock.update = function(search, bounce, next) {
				assert.deepEqual(bounce, validBounce);
				done();
			};

			// When: Updated
			bounceDao.update(validBounce);
		});

		it('callbacks with updated bounce', function(done) {

			// Given: Update ok
			collectionMock.update = function(search, bounce, next) {
				next(null, "ok");
			};

			// When: Updated
			bounceDao.update(validBounce, function(err, updated) {
				assert.deepEqual(updated, validBounce);
				assert.notOk(err);
				done();
			});

		});

		it('callbacks error if dao error', function(done) {

			// Given: Update fails
			collectionMock.update = function(search, bounce, next) {
				next(new Error("Some error"), "fails");
			};

			// When: Updated throws error
			bounceDao.update(validBounce, function(err, updated) {
				assert.ok(err);
				done();
			});

		});

	});

	describe('deactivate', function() {

		it('should deactivate the bounce', function() {

			// When: Deactivate
			bounceDao.deactivate(validBounce, function() {});

			// Then:
			assert.isFalse(validBounce.active);
		});
	});

	describe('getPending()', function() {

		it('should search by date and active', function() {

			// Capture find
			var search;
			var options;
			collectionMock.find = function(_search, _options, next) {
				search = _search;
				options = _options;
			};

			// When: Get pending
			bounceDao.getPending(function(err, doc) {});

			// Then: Search by date and active
			search.should.eql({
				$and: [{
					moment: {
						$lt: new Date('2016-12-31T00:00:00+00:00')
					}
				}, {
					active: true
				}]
			});

			// And: No options
			options.should.eql({});
		});

		it('should return results', function() {

			// Given: 
			collectionMock.find = function(_search, _options, next) {
				next(null, ['a', 'b']);
			};

			// When: Get pending
			var docs;
			bounceDao.getPending(function(err, _docs) {
				docs = _docs;
			});

			// Then: Found are returned
			docs.should.eql(['a', 'b']);
		});

		it('should return error if db error', function() {

			// Given: 
			collectionMock.find = function(_search, _options, next) {
				next(new Error("some error"));
			};

			// When: Get pending
			var err, docs;
			bounceDao.getPending(function(_err, _docs) {
				docs = _docs;
				err = _err;
			});

			// Then: Error is returned
			should.exist(err);
			should.not.exist(docs);
		});

	});

});