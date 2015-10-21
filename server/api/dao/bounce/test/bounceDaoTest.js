'use strict';

var should = require('should');
var assert = require('assert');
var mockery = require('mockery');

describe('bounce.dao', function() {

	var bounceDao;

	var dbMock = {

		err: null,
		doc: null,

		getCollection: function(collection) {
			var myParent = this;

			collection.should.equal('bounces');


			return {
				find: function(search, options, next) {
					search.should.eql({
						token: "some"
					});
					options.should.eql({});
					next(myParent.err, myParent.doc);
				},

				insert: function(toCreate, next) {
					toCreate.token.should.have.length(40);
					toCreate.active.should.equal(true);
					next(myParent.err, myParent.doc);
				}
			};
		}
	};

	before(function() {
		mockery.enable({
			useCleanCache: true
		});
		mockery.enable();
		mockery.registerMock('../db', dbMock);
		mockery.registerAllowable('log4js');
		mockery.registerAllowable('../bounce.dao');
		bounceDao = require('../bounce.dao');
	});

	after(function() {
		mockery.disable();
	});

	beforeEach(function() {
		dbMock.err = null;
		dbMock.doc = null;
	});


	describe('findByToken()', function() {

		it('should return doc if single found', function() {

			dbMock.doc = [{
				value: 1
			}];

			bounceDao.findByToken('some', function(err, doc) {
				should.not.exist(err);
				doc.should.eql({
					value: 1
				});
			});

		});

		it('should return error if more then one match', function() {

			dbMock.doc = [{}, {}];

			bounceDao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

		it('should return error if db error', function() {

			dbMock.err = new Error("some error");

			bounceDao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

	});

	describe('create()', function() {

		it('should forward created bounce', function() {

			dbMock.doc = {
				value: 1
			};

			bounceDao.create({}, function(err, doc) {
				doc.should.eql(dbMock.doc);
			});

		});

		it('should return error if db error', function() {

			dbMock.err = new Error("some error");

			bounceDao.create({},
				function(err, doc) {
					should.not.exist(doc);
					should.exist(err);

				});
		});

	});

});