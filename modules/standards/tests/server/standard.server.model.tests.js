'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Standard = mongoose.model('Standard');

/**
 * Globals
 */
var user, standard;

/**
 * Unit tests
 */
describe('Standard Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			school: 'school',
			county: 'county',
			age: '0',
			gradesTaught: '9',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			standard = new Standard({
				name: 'Standard Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return standard.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			standard.name = '';

			return standard.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Standard.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
