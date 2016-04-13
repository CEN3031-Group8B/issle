'use strict';

module.exports = function(app) {
	var standards = require('../controllers/standards.server.controller');
	var countiesandschools = require('../controllers/countiesandschools.server.controller');
	var counties = require('../controllers/counties.server.controller');
	var schools = require('../controllers/schools.server.controller');
	var standardsPolicy = require('../policies/standards.server.policy');

	// Standards Routes
	app.route('/api/standards').all()
		.get(standards.list).all(standardsPolicy.isAllowed)
		.post(standards.create);
	app.route('/api/standards/:standardId').all(standardsPolicy.isAllowed)
		.get(standards.read)
		.put(standards.update)
		.delete(standards.delete);
	//countiesandschools routes	
	app.route('/api/countiesandschools').all()
		.get(countiesandschools.list)
		.post(countiesandschools.create);

	app.route('/api/countiesandschools/:countyId').all()
		.get(countiesandschools.read)
		.put(countiesandschools.update)
		.delete(countiesandschools.delete);
	//counties routes
	app.route('/api/counties').all()
		.get(counties.list)
		.post(counties.create);

	app.route('/api/counties/:countiesId').all()
		.get(counties.read)
		.put(counties.update)
		.delete(counties.delete);
	//schools routes (has county in it)
	app.route('/api/schools').all()
		.get(schools.list)
		.post(schools.create);

	app.route('/api/schools/:schoolsId').all()
		.get(schools.read)
		.put(schools.update)
		.delete(schools.delete);
	
	
	

	// Finish by binding the Standard middleware
	app.param('standardId', standards.standardByID);
	app.param('countyId', countiesandschools.countyByID);
	app.param('countiesId', counties.countiesByID);
	app.param('schoolsId', schools.schoolsByID);
};