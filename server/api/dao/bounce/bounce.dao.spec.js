'use strict';

var should = require('should');
var assert = require('assert');
var rewire = require('rewire');
var dao = rewire('./bounce.dao');

function mockFind(err, doc) {
	dao.__set__({
		db: {
			getCollection: function(collection) {
				collection.should.equal('bounces');
				return {
					find: function(search, options, next) {
						assert.deepEqual(search, {
							token: "some"
						});
						next(err, doc);
					}
				};
			}
		}
	});
}

function mockInsert(err, bounce) {
	dao.__set__({
		db: {
			getCollection: function(collection) {
				collection.should.equal('bounces');
				return {
					insert: function(toCreate, next) {
						if (!err) {
							should.exist(toCreate.token);
							assert.deepEqual(toCreate, bounce);
						}
						next(err, bounce);
					}
				};
			}
		}
	});
}



describe('bounce.dao', function() {

	describe('findByToken()', function() {

		it('should return doc if single found', function() {

			mockFind(null, ["one"]);

			dao.findByToken('some', function(err, doc) {
				should.not.exist(err);
				doc.should.equal("one");
			});

		});

		it('should return error if more then one match', function() {

			mockFind(null, ["one", "two"]);

			dao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

		it('should return error if db error', function() {

			mockFind(new Error("Some db error"), ["one", "two"]);

			dao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

	});

	describe('create()', function() {

		it('should assing token and create', function() {

			var bounce = {
				name: 'value'
			};

			mockInsert(null, bounce);

			dao.create(bounce, function(err, doc) {
				should.not.exist(err);
				should.exist(doc.token);
				doc.token.should.have.length(40);
				assert.deepEqual(doc, {
					name: "value",
					token: doc.token
				});
			});

		});


		it('should return error if db error', function() {
			mockInsert(new Error("some error"), {});

			dao.create({},
				function(err, doc) {
					should.not.exist(doc);
					should.exist(err);

				});
		});

	});

});