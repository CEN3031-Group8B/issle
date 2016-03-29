'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('api/projects/:projectId', {projectId: '@_id'}, {
			  update: {
				method: 'PUT'
			  },
			  addCollab : {
				method: 'GET',
				url: '/api/projects/addCollab/:email'
			  }
		});
	}
]);
