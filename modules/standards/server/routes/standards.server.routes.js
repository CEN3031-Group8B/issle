'use strict';

module.exports = function(app) {
	var standards = require('../controllers/standards.server.controller');
	var standardsPolicy = require('../policies/standards.server.policy');

	// Standards Routes
	app.route('/api/standards').all()
		.get(standards.list).all(standardsPolicy.isAllowed)
		.post(standards.create);
	app.route('/api/standards/:standardId').all(standardsPolicy.isAllowed)
		.get(standards.read)
		.put(standards.update)
		.delete(standards.delete);
	
	

	// Finish by binding the Standard middleware
	app.param('standardId', standards.standardByID);

};