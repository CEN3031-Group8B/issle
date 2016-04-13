'use strict';

// Authentication service for user variables
angular.module('users').factory('Counties', ['$resource',
  function($resource) {
		return $resource('api/counties/:countiesId', { countiesId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

