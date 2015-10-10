'use strict';

var should = require('should');
var rewire = require('rewire');
var dao = rewire('./bounce.dao');

function setupMonkMock(err, doc) {
	dao.__set__({
		db: {
			getCollection: function(collection) {
				collection.should.equal('bounces');
				return {
					find: function(search, options, next) {
						next(err, doc);
					}
				};
			}
		}
	});
}


describe('bounce.dao', function() {

	describe('findByToken()', function() {

		it('should return doc if single found', function() {

			setupMonkMock(null, ["one"]);

			dao.findByToken('some', function(err, doc) {
				should.not.exist(err);
				doc.should.equal("one");
			});

		});

		it('should return error if more then one match', function() {

			setupMonkMock(null, ["one", "two"]);

			dao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

		it('should return error if db error', function() {

			setupMonkMock(new Error("Some db error"), ["one", "two"]);

			dao.findByToken('some', function(err, doc) {
				should.exist(err);
				should.not.exist(doc);
			});

		});

	});

});