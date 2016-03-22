'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return {
				projSubmit: $resource('api/projects/:projectId', {projectId: '@_id'}, {
				  update: {
					method: 'PUT'
				  }
				}),
				
				addCollab: $resource('api/projects/addCollab/:email',{email: ''},{
					addCollab : {
						method: 'GET'
					}
			     //return "dur" + email;
			   })
			};
	}
]);
