'use strict';

// Authentication service for user variables
angular.module('users').factory('Schools', ['$resource',
  function($resource) {
		return $resource('api/schools/:schoolsId', { schoolsId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

