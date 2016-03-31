'use strict';

module.exports = function(app) {
	var projects = require('../controllers/projects.server.controller');
	var projectsPolicy = require('../policies/projects.server.policy');

	// Projects Routes
	app.route('/api/projects')
		.get(projects.list).all(projectsPolicy.isAllowed)
		.post(projects.create);

	//app.route('/api/')

	app.route('/api/projects/:projectId').all()
		.get(projects.read)
		.put(projects.update)
		.delete(projects.delete);

	app.route('/api/projects/picture/:projectId').post(projects.uploadDiagram); // Route to upload image

	app.route('/api/projects/addCollab/:email').get(projects.addCollab);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
	app.param('email', projects.userByEmail);
};
