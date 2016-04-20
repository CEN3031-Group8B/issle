'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Standard = mongoose.model('Standard'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, standard;

/**
 * Standard routes tests
 */
describe('Standard CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			school: 'school',
			county: 'county',
			age: '0',
			gradesTaught: '9',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Standard
		user.save(function() {
			standard = {
				name: 'Standard Name'
			};

			done();
		});
	});

	it('should be able to save Standard instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Standard
				agent.post('/api/standards')
					.send(standard)
					.expect(200)
					.end(function(standardSaveErr, standardSaveRes) {
						// Handle Standard save error
						if (standardSaveErr) done(standardSaveErr);

						// Get a list of Standards
						agent.get('/api/standards')
							.end(function(standardsGetErr, standardsGetRes) {
								// Handle Standard save error
								if (standardsGetErr) done(standardsGetErr);

								// Get Standards list
								var standards = standardsGetRes.body;

								// Set assertions
								(standards[0].user._id).should.equal(userId);
								(standards[0].name).should.match('Standard Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Standard instance if not logged in', function(done) {
		agent.post('/api/standards')
			.send(standard)
			.expect(403)
			.end(function(standardSaveErr, standardSaveRes) {
				// Call the assertion callback
				done(standardSaveErr);
			});
	});

	it('should not be able to save Standard instance if no name is provided', function(done) {
		// Invalidate name field
		standard.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Standard
				agent.post('/api/standards')
					.send(standard)
					.expect(400)
					.end(function(standardSaveErr, standardSaveRes) {
						// Set message assertion
						(standardSaveRes.body.message).should.match('Please fill Standard name');
						
						// Handle Standard save error
						done(standardSaveErr);
					});
			});
	});

	it('should be able to update Standard instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Standard
				agent.post('/api/standards')
					.send(standard)
					.expect(200)
					.end(function(standardSaveErr, standardSaveRes) {
						// Handle Standard save error
						if (standardSaveErr) done(standardSaveErr);

						// Update Standard name
						standard.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Standard
						agent.put('/api/standards/' + standardSaveRes.body._id)
							.send(standard)
							.expect(200)
							.end(function(standardUpdateErr, standardUpdateRes) {
								// Handle Standard update error
								if (standardUpdateErr) done(standardUpdateErr);

								// Set assertions
								(standardUpdateRes.body._id).should.equal(standardSaveRes.body._id);
								(standardUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Standards if not signed in', function(done) {
		// Create new Standard model instance
		var standardObj = new Standard(standard);

		// Save the Standard
		standardObj.save(function() {
			// Request Standards
			request(app).get('/api/standards')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Standard if not signed in', function(done) {
		// Create new Standard model instance
		var standardObj = new Standard(standard);

		// Save the Standard
		standardObj.save(function() {
			request(app).get('/api/standards/' + standardObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', standard.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Standard instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Standard
				agent.post('/api/standards')
					.send(standard)
					.expect(200)
					.end(function(standardSaveErr, standardSaveRes) {
						// Handle Standard save error
						if (standardSaveErr) done(standardSaveErr);

						// Delete existing Standard
						agent.delete('/api/standards/' + standardSaveRes.body._id)
							.send(standard)
							.expect(200)
							.end(function(standardDeleteErr, standardDeleteRes) {
								// Handle Standard error error
								if (standardDeleteErr) done(standardDeleteErr);

								// Set assertions
								(standardDeleteRes.body._id).should.equal(standardSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Standard instance if not signed in', function(done) {
		// Set Standard user 
		standard.user = user;

		// Create new Standard model instance
		var standardObj = new Standard(standard);

		// Save the Standard
		standardObj.save(function() {
			// Try deleting Standard
			request(app).delete('/api/standards/' + standardObj._id)
			.expect(403)
			.end(function(standardDeleteErr, standardDeleteRes) {
				// Set message assertion
				(standardDeleteRes.body.message).should.match('User is not authorized');

				// Handle Standard error error
				done(standardDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Standard.remove().exec(function(){
				done();
			});
		});
	});
});
