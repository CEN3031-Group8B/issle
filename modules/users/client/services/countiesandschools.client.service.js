'use strict';

// Authentication service for user variables
angular.module('users').factory('CountiesAndSchools', ['$resource',
  function($resource) {
		return $resource('api/countiesandschools/:countyId', { countyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

