'use strict';

module.exports = function(app) {
	var schools = require('../controllers/schools.server.controller');


	//schools routes (has county in it)
	app.route('/api/schools').all()
		.get(schools.list)
		.post(schools.create);

	app.route('/api/schools/:schoolsId').all()
		.get(schools.read)
		.put(schools.update)
		.delete(schools.delete);
	
	
	

	// Finish by binding the Standard middleware
	app.param('schoolsId', schools.schoolsByID);
};