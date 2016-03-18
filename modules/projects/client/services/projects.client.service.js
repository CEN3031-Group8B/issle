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
				
				addCollab: $resource('api/projects/:projectId/addCollab/:email',{projectId: '@_id'},{
					addCollab : {
						method: 'GET', 
						//url: 'api/projects/:userId/addCollab/:email', 
						params:{}
					}
			     //return "dur" + email;
			   })
			};
	}
]);
