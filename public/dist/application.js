'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'linkify'  ];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {
  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        $state.go('authentication.signin', {}, {
          notify: false
        }).then(function () {
          $rootScope.$broadcast('$stateChangeSuccess', 'authentication.signin', {}, toState, toParams);
        });
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    $state.previous = {
      state: fromState,
      params: fromParams,
      href: $state.href(fromState, fromParams)
    };
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects', ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'linkify', 'ngDragDrop']);
ApplicationConfiguration.registerModule('standards' , ['projects']);

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('standards');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('supports');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin'],
      isPublic: false
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

/**
 * Created by Raz Aloni on 10/4/2015.
 */
'use strict';

angular.module('core').run(['Menus',
    function (Menus) {
        // Menus.addMenuItem('topbar', {
        //     title: 'Standards',
        //     state: 'standards',
        //     isPublic: true
        // });

        // Menus.addMenuItem('topbar', {
        //     title: 'Search for Projects',
        //     state: 'projectSearch',
        //     isPublic: true
        // });

        // Menus.addMenuItem('topbar', {
        //     title: 'Support',
        //     state: 'support',
        //     isPublic: true
        // });
    }
]);


'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise('not-found');

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/views/404.client.view.html'
      });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.link, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      isPublic: true
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Configuring the Projects module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Add the Projects dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Projects',
			state: 'projects',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'projects', {
			title: 'Search for Projects',
			state: 'projects.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'projects', {
			title: 'Create Project',
			state: 'projects.create'
		});
	}
]);

'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
	function($stateProvider) {
		// Projects state routing
		$stateProvider.
		state('projects', {
			abstract: true,
			url: '/projects',
			template: '<ui-view/>'
		}).
		state('projects.list', {
			url: '',
			templateUrl: 'modules/projects/views/list-projects.client.view.html'
		}).
		state('projects.create', {
			url: '/create',
			templateUrl: 'modules/projects/views/create-project.client.view.html'
		}).
		state('projects.view', {
			url: '/:projectId',
			templateUrl: 'modules/projects/views/view-project.client.view.html'
		}).
		state('projects.edit', {
			url: '/:projectId/edit',
			templateUrl: 'modules/projects/views/edit-project.client.view.html'
		});
	}
]);
'use strict';

angular.module('projects').controller('list-ProjectsController' , ['$scope', '$stateParams', '$location', 'Authentication', 'Projects',
	function($scope, $stateParams, $location, Authentication, Projects ) {
	    $scope.authentication = Authentication;

	    // Find a list of Projects
		$scope.find = function(search) {
      //$scope.projects = Projects.query(); 
      //the way the search works is by a hiarchy
      //if a project name is put in then that over takes all other search parameters
      //if a standard is put in and but not a standard then that takes priority
      //if none of the text based search parameters are put in then it first checks if thier is a subject
      //if there is put it in with the query if not, then just search by the min and max grade.

      if(!search.minGrade) search.minGrade = '0';
      if(!search.maxGrade) search.maxGrade = '912';

      if(search.searchName){
        $scope.projects = Projects.query({projectName:search.searchName});
      } else if(search.searchText) {
        $scope.projects = Projects.query({benchmark:search.searchText});
      } else if(search.subject) {
        $scope.projects = Projects.query({minGrade:search.minGrade,maxGrade:search.maxGrade,subject:search.subject});
      } else {
        $scope.projects = Projects.query({minGrade:search.minGrade,maxGrade:search.maxGrade});
      }
      console.log(search);

    };

    //Allows for looping based on number of star ratings
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    //  K 1st   2nd   3rd   4th   5th   6th   7th   8th   9th  10th 11th 12th
    $scope.getGradeRange = function(min,max){
      var retString = '';
      if(min === 0)
        retString = 'K';
      else if(min === 1)
        retString = '1st';
      else if(min ===2)
        retString = '2nd';
      else if(min === 3)
        retString = '3rd';
      else
        retString = min + 'th';

      retString += ' - ';

      if(max === 1)
        retString += '1st';
      else if(max ===2)
        retString += '2nd';
      else if(max === 3)
        retString += '3rd';
      else
        retString += max + 'th';

      return retString;
    };

    $scope.noRatingCheck = function(rats){
      if(!(rats > 0 && rats <= 5))
        return 'None yet!';
      else return '';
    };

    $scope.enterPressName = function(keyEvent, search, show) {
      if(keyEvent.which === 13){
        $scope.projects = Projects.query({projectName:search.searchName});
        $scope.show = true;
      }
    };

    $scope.enterPressStandard = function(keyEvent, search, show) {
      if(keyEvent.which === 13){
        $scope.projects = Projects.query({benchmark:search.searchText});
        $scope.show = true;
      }
    };

    // Find existing Project
    $scope.findOne = function() {
        $scope.project = Projects.get({
            projectId: $stateParams.projectId
        });
    };

    $scope.getRatingNum = function(num) {
      if(num !== null){
        return num;
      }
    };
	}
]);

'use strict';
// Projects controller

angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$sce', '$location', '$window', '$timeout', 'Authentication', 'Projects', 'FileUploader', 'linkify', 'Users',
	function($scope, $stateParams, $sce, $location, $window, $timeout, Authentication, Projects, FileUploader, linkify , Users ) {
		$scope.authentication = Authentication;
		$scope.collaborators = [];

		//maybe should put in the create function
		$scope.collaborators.push($scope.authentication.user._id);
		// Create file uploader instance
		$scope.uploader = new FileUploader({
			url: '/api/projects/picture'
		});

		$scope.uploaderC = new FileUploader({
			url: '/api/projects/picture'
		});

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			//please note the next segment of code it will not only combine standards but also subjects
			//the main function of the this next large block if if statements is do that
			//when a project has been created the overall standards and subjects are calculated
			//so that they can be searched by those subjects and standards
			//most of the if statements are to check if either that element exists or if it is not undefined
			//in the case of checking undefined typeof allows us to preform this check without causing a crash if the array doesnt exist

			$scope.essentialDetails.overallStandards = '';

			$scope.essentialDetails.overallSubjects = '';
			$scope.essentialDetails.overallSubjects += $scope.essentialDetails.litDetails.subjectName + ' , ';
			$scope.essentialDetails.overallSubjects += $scope.essentialDetails.mathDetails.subjectName + ' , ';
			$scope.essentialDetails.overallSubjects += $scope.essentialDetails.scienceDetails.subjectName + ' , ';
			$scope.essentialDetails.overallSubjects += $scope.essentialDetails.ssDetails.subjectName + ' , ';

			if($scope.essentialDetails.litDetails.standards !== undefined){
				$scope.essentialDetails.overallStandards += $scope.essentialDetails.litDetails.standards + ', ';
			}
			if($scope.essentialDetails.mathDetails.standards !== undefined){
				$scope.essentialDetails.overallStandards += $scope.essentialDetails.mathDetails.standards + ', ';
			}
			if($scope.essentialDetails.scienceDetails.standards !== undefined){
				$scope.essentialDetails.overallStandards += $scope.essentialDetails.scienceDetails.standards + ', ';
			}
			if($scope.essentialDetails.ssDetails.standards !== undefined){
				$scope.essentialDetails.overallStandards += $scope.essentialDetails.ssDetails.standards + ', ';
			}
			if(typeof $scope.essentialDetails.otherSubject !== 'undefined'){
				if(typeof $scope.essentialDetails.otherSubject[0] !== 'undefined'){
					if($scope.essentialDetails.otherSubject[0].subjectName !== undefined){
						$scope.essentialDetails.overallSubjects += $scope.essentialDetails.otherSubject[0].subjectName + ' , ';
					}
					if($scope.essentialDetails.otherSubject[0].standards !== undefined){
						$scope.essentialDetails.overallStandards += $scope.essentialDetails.otherSubject[0].standards + ', ';
					}
				}
				if(typeof $scope.essentialDetails.otherSubject[1] !== 'undefined'){
					if($scope.essentialDetails.otherSubject[1].subjectName !== undefined){
						$scope.essentialDetails.overallSubjects += $scope.essentialDetails.otherSubject[1].subjectName + ' , ';
					}
					if($scope.essentialDetails.otherSubject[1].standards !== undefined){
						$scope.essentialDetails.overallStandards += $scope.essentialDetails.otherSubject[1].standards + ', ';
					}
				}
				if(typeof $scope.essentialDetails.otherSubject[2] !== 'undefined'){
					if($scope.essentialDetails.otherSubject[2].subjectName !== undefined){
						$scope.essentialDetails.overallSubjects += $scope.essentialDetails.otherSubject[2].subjectName + ' , ';
					}
					if($scope.essentialDetails.otherSubject[2].standards !== undefined){
						$scope.essentialDetails.overallStandards += $scope.essentialDetails.otherSubject[2].standards + ', ';
					}
				}
				if(typeof $scope.essentialDetails.otherSubject[3] !== 'undefined'){
					if($scope.essentialDetails.otherSubject[3].subjectName !== undefined){
						$scope.essentialDetails.overallSubjects += $scope.essentialDetails.otherSubject[3].subjectName + ' , ';
					}
					if($scope.essentialDetails.otherSubject[3].standards !== undefined){
						$scope.essentialDetails.overallStandards += $scope.essentialDetails.otherSubject[3].standards + ', ';
					}
				}
				if(typeof $scope.essentialDetails.otherSubject[4] !== 'undefined'){
					if($scope.essentialDetails.otherSubject[4].subjectName !== undefined){
						$scope.essentialDetails.overallSubjects += $scope.essentialDetails.otherSubject[4].subjectName + ' , ';
					}
					if($scope.essentialDetails.otherSubject[4].standards !== undefined){
						$scope.essentialDetails.overallStandards += $scope.essentialDetails.otherSubject[4].standards + ', ';
					}
				}

			}
			//the slice is used to clean up so that the last standard does not have a quote and a space
			//we do not need it for projects since overall projects will never be used to display to the user

			//$scope.essentialDetails.overallStandards = $scope.essentialDetails.overallStandards.slice(0, -2);

			

			var project = new Projects ({
				name: this.name,
				created: this.created,
				user: this.user,
				status: this.status,
				isPublic: this.isPublic,
				projAdmin: this.collaborators,
				minGrade: this.minGrade,
				maxGrade: this.maxGrade,
				askStandardStep: this.askStandardStep,
				researchStandardStep: this.researchStandardStep,
				imagineStandardStep: this.imagineStandardStep,
				planStandardStep: this.planStandardStep,
				createStandardStep: this.createStandardStep,
				testStandardStep: this.testStandardStep,
				improveStandardStep: this.improveStandardStep,
				ask: this.ask,
				research: this.research,
				imagine: this.imagine,
				plan: this.plan,
				createStep: this.createStep,
				testStep: this.testStep,
				improveStep: this.improveStep,
				worksheetStep: this.worksheetStep,
				essentialDetails: this.essentialDetails,
				rating: null
			});


		$scope.additionalSubjects = ['Dance', 'English Language Development', 'Gifted', 'Health Education', 'Music', 'Physical Education',
		'Special Skills', 'Technology', 'Theatre', 'Visual Art'];

			// Redirect after save
			project.$save(function(response) {

				// Start upload of picture

				if($scope.uploaderC.queue.length > 0) {

					$scope.uploaderC.queue[0].url = '/api/projects/picture/' + response._id;
					$scope.uploaderC.uploadAll();
				}


				// Clear form fields
				$scope.name = '';


				$location.path('projects/' + response._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


		};

		// Remove existing Project
		$scope.remove = function( project ) {
			if ( project ) { project.$remove();

				for (var i in $scope.projects ) {
					if ($scope.projects [i] === project ) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		$scope.CombineStandards = function(){
			//please note it will not only combine standards but also subjects
			//the combine standards function's main goal is to be used in the edit project page
			//when a project has been edited the overall standards and subjects are calculated
			//so that they can be searched by those subjects and standards
			//most of the if statements are to check if either that element exists or if it is not undefined
			//in the case of checking undefined typeof allows us to preform this check without causing a crash if the array doesnt exist
			$scope.project.essentialDetails.overallStandards = '';

			$scope.project.essentialDetails.overallSubjects = '';
			$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.litDetails[0].subjectName + ' , ';
			$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.mathDetails[0].subjectName + ' , ';
			$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.scienceDetails[0].subjectName + ' , ';
			$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.ssDetails[0].subjectName + ' , ';

			if($scope.project.essentialDetails.litDetails[0].standards !== ''){
				$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.litDetails[0].standards + ', ';
			}
			if($scope.project.essentialDetails.mathDetails[0].standards !== ''){
				$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.mathDetails[0].standards + ', ';
			}
			if($scope.project.essentialDetails.scienceDetails[0].standards !== ''){
				$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.scienceDetails[0].standards + ', ';
			}
			if($scope.project.essentialDetails.ssDetails[0].standards !== ''){
				$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.ssDetails[0].standards + ', ';
			}
			if(typeof $scope.project.essentialDetails.otherSubject !== 'undefined'){
				if(typeof $scope.project.essentialDetails.otherSubject[0] !== 'undefined'){
					if($scope.project.essentialDetails.otherSubject[0].subjectName !== ''){
						$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.otherSubject[0].subjectName + ' , ';
					}
					if($scope.project.essentialDetails.otherSubject[0].standards !== ''){
						$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.otherSubject[0].standards + ', ';
					}
				}
				if(typeof $scope.project.essentialDetails.otherSubject[1] !== 'undefined'){
					if($scope.project.essentialDetails.otherSubject[1].subjectName !== ''){
						$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.otherSubject[1].subjectName + ' , ';
					}
					if($scope.project.essentialDetails.otherSubject[1].standards !== ''){
						$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.otherSubject[1].standards + ', ';
					}
				}
				if(typeof $scope.project.essentialDetails.otherSubject[2] !== 'undefined'){
					if($scope.project.essentialDetails.otherSubject[2].subjectName !== ''){
						$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.otherSubject[2].subjectName + ' , ';
					}
					if($scope.project.essentialDetails.otherSubject[2].standards !== ''){
						$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.otherSubject[2].standards + ', ';
					}
				}
				if(typeof $scope.project.essentialDetails.otherSubject[3] !== 'undefined'){
					if($scope.project.essentialDetails.otherSubject[3].subjectName !== ''){
						$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.otherSubject[3].subjectName + ' , ';
					}
					if($scope.project.essentialDetails.otherSubject[3].standards !== ''){
						$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.otherSubject[3].standards + ', ';
					}
				}
				if(typeof $scope.project.essentialDetails.otherSubject[4] !== 'undefined'){
					if($scope.project.essentialDetails.otherSubject[4].subjectName !== ''){
						$scope.project.essentialDetails.overallSubjects += $scope.project.essentialDetails.otherSubject[4].subjectName + ' , ';
					}
					if($scope.project.essentialDetails.otherSubject[4].standards !== ''){
						$scope.project.essentialDetails.overallStandards += $scope.project.essentialDetails.otherSubject[4].standards + ', ';
					}
				}

			}
			
			//the slice is used to clean up so that the last standard does not have a quote and a space
			//we do not need it for projects since overall projects will never be used to display to the user
			$scope.project.essentialDetails.overallStandards = $scope.project.essentialDetails.overallStandards.slice(0, -2);
		};

		// Update existing Project
		$scope.update = function() {
            console.log('In $scope.update');

			var project = $scope.project;

			project.worksheetStep.theWorksheet = '';

			project.$update(function() {

				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			if ($scope.uploader.queue.length > 0) {
				$scope.uploader.queue[0].url = '/api/projects/picture/' + project._id;
				$scope.uploader.uploadAll();
			}
		};

		/////////////////////////////////////////////////////////////////////////////////////////////
		// Remix Project

		$scope.remix = function() {
           console.log('In $scope.remix');
           console.log(this.name);



           	var project_old = $scope.project;
           	var project_old_name = [];
           	project_old_name.push(project_old.name);
           	project_old_name.push(" Remix");
            var project = new Projects ({
				name: project_old_name,
				created: project_old.created,
				user: project_old.user,
				status: project_old.status,
				isPublic: project_old.isPublic,
				minGrade: project_old.minGrade,
				maxGrade: project_old.maxGrade,
				askStandardStep: project_old.askStandardStep,
				ask: project_old.ask,
				researchStandardStep: project_old.researchStandardStep,
				research: project_old.research,
				imagineStandardStep: project_old.imagineStandardStep,
				imagine: project_old.imagine,
				planStandardStep: project_old.planStandardStep,
				plan: project_old.plan,
				createStandardStep: project_old.createStandardStep,
				createStep: project_old.createStep,
				testStandardStep: project_old.testStandardStep,
				testStep: project_old.testStep,
				improveStandardStep: project_old.improveStandardStep,
				improveStep: project_old.improveStep,
				//worksheetStep:: project_old.worksheetStep,
				essentialDetails: project_old.essentialDetails,
				rating: null
			});


			// Redirect after save
			project.$save(function(response) {

				if($scope.uploaderC.queue.length > 0) {

					$scope.uploaderC.queue[0].url = '/api/projects/picture/' + response._id;
					$scope.uploaderC.uploadAll();
				}
				
				// Clear form fields
				$scope.name = '';


				$location.path('projects/' + response._id);


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


			
		};


		// Redirect after save
			





		/////////////////////////////////////////////////////////////////////////////////////////////

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project AND set projectOwnership
		$scope.findOne = function() {
			$scope.project = Projects.get({
				projectId: $stateParams.projectId
			},
			function(authentication){
				console.log($scope.authentication.user);
				console.log($scope.project.projAdmin);
			$scope.projectOwnership= false;
			for(var i in $scope.project.projAdmin){
              if($scope.project.projAdmin[i] === $scope.authentication.user._id){
                $scope.projectOwnership= true;
              }
            }
			});

		};

		//get userID for collaborator from email
		$scope.addCollab = function(collabEmail) {
			//$scope.collaborators = $scope.project.projAdmin;
			if(collabEmail) {  //check something was typed
				Projects.addCollab({email: collabEmail}, function(collab){  //lookup user
					if(typeof collab._id !== "undefined"){  // check that a user was returned
						if($scope.collaborators.indexOf(collab._id) < 0){  //check that it is not in the array already
							$scope.collaborators.push(collab._id);  //add user id
							console.log($scope.collaborators);
						}
						// if($scope.project.projAdmin.indexOf(collab._id) < 0){  //check that it is not in the array already
						// 	$scope.project.projAdmin.push(collab._id);  //add user id
						// 	console.log($scope.project.projAdmin);
						// }
					}
					//console.log($scope.collaborators);
				});
			}	
		};

		$scope.editCollab = function(collabEmail) {
			//$scope.collaborators = $scope.project.projAdmin;
			if(collabEmail) {  //check something was typed
				Projects.addCollab({email: collabEmail}, function(collab){  //lookup user
					if(typeof collab._id !== "undefined"){  // check that a user was returned
						// if($scope.collaborators.indexOf(collab._id) < 0){  //check that it is not in the array already
						// 	$scope.collaborators.push(collab._id);  //add user id
						// 	console.log($scope.collaborators);
						// }
						if($scope.project.projAdmin.indexOf(collab._id) < 0){  //check that it is not in the array already
							$scope.project.projAdmin.push(collab._id);  //add user id
							console.log($scope.project.projAdmin);
						}
					}
					//console.log($scope.collaborators);
				});
			}	
		};

		// Called after the user selected a new picture file
		$scope.uploader.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.project.worksheetStep.theWorksheet = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

		$scope.linkify = function(link) {
			//The linkify function parses text and creates hyperlinks out of URL's anything with www. is valid
			//the linkify function is only used in the view project page
			var text = linkify.normal(link);
			if(text) {
				//this is for every browser but firefox (and will only execute for compatible browsers)
				text = text.replace(/<a href="www./gi, '<a href="http://www.');
				//this line is specificly for linkify for the firefox browser
				text = text.replace(/<a target="_blank" href="www./gi, '<a target="_blank" href="http://www.');
			}
			//console.log(text); //used for debugging
			return $sce.trustAsHtml(text);
		};

		$scope.uploaderC.onAfterAddingFile = function (fileItem) {
			if ($window.FileReader) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(fileItem._file);

				fileReader.onload = function (fileReaderEvent) {
					$timeout(function () {
						$scope.imageURL = fileReaderEvent.target.result;
					}, 0);
				};
			}
		};

/*	-------------------------------------Star Rating Stuff-------------------------------------- */

		/*BROKEN: Animation doesn't work after the first time the user rates a project.
			Broke at some point during development after the feature was done, and it's
			too late to go back in and fix it.
		*/

		//an array containing the name of the glyphicon to use for each star
		$scope.glyphs = new Array(
			'gold glyphicon glyphicon-star-empty',
			'gold glyphicon glyphicon-star-empty',
			'gold glyphicon glyphicon-star-empty',
			'gold glyphicon glyphicon-star-empty',
			'gold glyphicon glyphicon-star-empty'
		);

		/*
			Runs when a star glyphicon is hovered into. It sets all the stars up to the current one
			to have the filled-in star glyphicon.
		*/
		$scope.rating_hover = function(num){
			for(var i = 0; i < num; i++){
				$scope.glyphs[i] = 'gold glyphicon glyphicon-star';
			}
			for(i = num; i < 5; i++){
				$scope.glyphs[i] = 'gold glyphicon glyphicon-star-empty';
			}
		};

		//Runs when a star glyphicon is hovered out of. Resets the  stars' highlighing to the current rating
		$scope.reset_hover = function(){
			$scope.rating_hover($scope.rating);
		};

		//Prints out user's current rating of the project
		$scope.getMyRating = function(){

			if ($scope.project.rating && $scope.project.rating.ratings ){
				var rater = $scope.project.rating.ratings.filter(isRater)[0];
				//console.log(rater);
				if (typeof rater === 'undefined'){
					$scope.rating = 0;	//current rating
					return 'You haven\'t yet rated this project. Give it a couple of stars?';
				}
				$scope.rating = rater.num;
				$scope.reset_hover();
				return ('Your currently rate this project at ' + rater.num + ' stars');
			}
			$scope.rating = 0;	//current rating
			return 'This project has not yet been rated. Give it a couple of stars?';

		};

        // Function to find the current rater
        var isRater = function(value){
			return value.reviewer === $scope.authentication.user._id;
        };

		//Changes the user's rating of the project
		$scope.rate = function(){
			console.log('In $scope.rate');
				if(!$scope.project.rating){
				$scope.project.rating = {		//Update the project's rating entry in schema
					ratings : [ // Create ratings array with  first rating and reviewer
						{
							num: $scope.rating,
							reviewer: $scope.authentication.user._id
						}
					],
					avg_rating : $scope.rating // For first instance, avg = only rating
				};
			} else {
                var rater = $scope.project.rating.ratings.filter(isRater)[0]; // Check if current user already has submitted a rating
                var length = $scope.project.rating.ratings.length;  // Hold current length
				var rateToRemove = 0;

								// Variable to hold resulting length after comptation
                var newLength = length + 1;

								// If length is 0, the average should be 0
                if(length === 0)
                {
                    $scope.project.rating.avg_rating = 0;
                }

				// If current user has already rated, delete previous rating
				if(typeof rater !== 'undefined') {
                    rateToRemove = rater.num;
                    var rateIndex = $scope.project.rating.ratings.indexOf(rater);
                    $scope.project.rating.ratings.splice(rateIndex, 1);
                    newLength -= 1;
                }

				// Add new rating to total rating and recalculaate average
				$scope.project.rating.avg_rating = ($scope.project.rating.avg_rating * length + $scope.rating - rateToRemove)/(newLength);

				// Push new rating object into project schema
				$scope.project.rating.ratings.push({
						num: $scope.rating,
						reviewer: $scope.authentication.user._id
				});
			}

			// Update project
			$scope.update();


		};

		
	//$scope.testList1 = [{'title': 'Standard1'},{'title': 'Standard2'},{'title': 'Standard3'}];
        $scope.askStandardStep = [];
        $scope.researchStandardStep = [];
        $scope.imagineStandardStep = [];
        $scope.planStandardStep = [];
        $scope.createStandardStep = [];
        $scope.testStandardStep = [];
        $scope.improveStandardStep = [];
        /*
        $scope.askHideMe = function() {
            return $scope.askStandardStep.length > 0;
        };
        
        $scope.researchHideMe = function() {
            return $scope.researchStandardStep.length > 0;
        };
        
        $scope.imagineHideMe = function() {
            return $scope.imagineStandardStep.length > 0;
        };
		
        $scope.planHideMe = function() {
            return $scope.planStandardStep.length > 0;
        };
        
        $scope.createHideMe = function() {
            return $scope.createStandardStep.length > 0;
        };
		
        $scope.testHideMe = function() {
            return $scope.testStandardStep.length > 0;
        };		
		
        $scope.improveHideMe = function() {
            return $scope.improveStandardStep.length > 0;
        };
		*/
	}
]);

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

'use strict';

// Configuring the Standards module
angular.module('standards').run(['Menus',
	function(Menus) {
		// Add the Standards dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Standards',
			state: 'standards',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'standards', {
			title: 'List Standards',
			state: 'standards.list'
		});
	}
]);
'use strict';

//Setting up route
angular.module('standards').config(['$stateProvider',
	function($stateProvider) {
		// Standards state routing
		$stateProvider.
		state('standards', {
			abstract: true,
			url: '/standards',
			template: '<ui-view/>'
		}).
		state('standards.list', {
			url: '',
			templateUrl: 'modules/standards/views/list-standards.client.view.html'
		}).
		state('standards.view', {
			url: '/:standardId',
			templateUrl: 'modules/standards/views/view-standard.client.view.html'
		});
	}
]);
'use strict';

// Standards controller
angular.module('standards').controller('StandardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Standards',
	function($scope, $stateParams, $location, Authentication, Standards ) {
		$scope.authentication = Authentication;

		// Create new Standard
		$scope.create = function() {
			// Create new Standard object
			var standard = new Standards ({
				benchmark: this.benchmark,
				description: this.description,
				subject: this.subject,
				grade: this.grade,
				bodyOfKnowledge: this.bodyOfKnowledge
			});

			// Redirect after save
			standard.$save(function(response) {
				$location.path('standards/' + response._id);

				// Clear form fields
				$scope.benchmark = '';
				$scope.description = '';
				$scope.subject = '';
				$scope.grade = '';
				$scope.bodyOfKnowledge = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Standard
		$scope.remove = function( standard ) {
			if ( standard ) { standard.$remove();

				for (var i in $scope.standards ) {
					if ($scope.standards [i] === standard ) {
						$scope.standards.splice(i, 1);
					}
				}
			} else {
				$scope.standard.$remove(function() {
					$location.path('standards');
				});
			}
		};

		// Update existing Standard
		$scope.update = function() {
			var standard = $scope.standard ;

			standard.$update(function() {
				$location.path('standards/' + standard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Standards
		$scope.find = function(search) {
			//if a min or max grade are not put in the min/max possible grade value is selected
			if(!search.minGrade) search.minGrade = '0';
			if(!search.maxGrade) search.maxGrade = '912';

			//the way the search works is by a hiarchy
			//if a standard is put in then that over takes all other search parameters
			//if a description keyword is put in and but not a standard then that takes priority
			//if none of the text based search parameters are put in then it first checks if thier is a subject
			//if there is put it in with the query if not, then just search by the min and max grade.
			if(search.searchText) {
				$scope.standards = Standards.query({benchmark:search.searchText});
			} else if(search.searchKeyword) {
				$scope.standards = Standards.query({keyword:search.searchKeyword});
			} else if(search.subject) {
				$scope.standards = Standards.query({minGrade:search.minGrade,maxGrade:search.maxGrade,subject:search.subject});
			} else {
				$scope.standards = Standards.query({minGrade:search.minGrade,maxGrade:search.maxGrade});
			}
			console.log(search);

		};

	    $scope.enterPressStandard = function(keyEvent, search, show) {
      		if(keyEvent.which === 13){
        		$scope.standards = Standards.query({benchmark:search.searchText});
        		$scope.show = true;
      		}
    	};

	    $scope.enterPressKeyword = function(keyEvent, search, show) {
	      if(keyEvent.which === 13){
	        $scope.standards = Standards.query({keyword:search.searchKeyword});
	        $scope.show = true;
	      }
	    };

		// Find existing Standard
		$scope.findOne = function() {
			$scope.standard = Standards.get({ 
				standardId: $stateParams.standardId
			});
		};
		
		
		
		$scope.categories = [
			//Will hold any topics specified
		];
		
		$scope.add_category = function(){
			$scope.categories.push(
		        {
		          
		        });
		};
	}
]);
'use strict';

//Standards service used to communicate Standards REST endpoints
angular.module('standards').factory('Standards', ['$resource',
	function($resource) {
		return $resource('api/standards/:standardId', { standardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Supports module
angular.module('supports').run(['Menus',
	function(Menus) {
		// Add the Supports dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Support',
			state: 'support',
			type: 'dropdown'
		});

        Menus.addSubMenuItem('topbar', 'support', {
            title: 'Example',

            state: 'support.example'
        });

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'support', {
			title: 'FAQ',
			state: 'support.faq'
		});

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'support', {
            title: 'About Us',
            state: 'support.about'
        });


	}
]);

'use strict';

//Setting up route
angular.module('supports').config(['$stateProvider',
	function($stateProvider) {
		// Supports state routing
		$stateProvider.
		state('support', {
			abstract: true,
			url: '/support',
			template: '<ui-view/>'
		}).
		state('support.faq', {
			url: '/FAQ',
			templateUrl: 'modules/support/views/faq.client.view.html'
		}).
        state('support.example', {
            url: '/example',
            templateUrl: 'modules/support/views/example.client.view.html'
        }).
		state('support.examples', {
			url: '/examples',
			templateUrl: 'modules/support/views/examples.client.view.html'
		}).
        state('support.about', {
            url: '/About',
            templateUrl: 'modules/support/views/about.client.view.html'
        }).
        state('support.example1', {
            url: '/example1',
            templateUrl: 'modules/support/views/example1.client.view.html'
        }).
        state('support.example2', {
            url: '/example2',
            templateUrl: 'modules/support/views/example2.client.view.html'
        }).
        state('support.example3', {
            url: '/example3',
            templateUrl: 'modules/support/views/example3.client.view.html'
        }).
        state('support.example4', {
            url: '/example4',
            templateUrl: 'modules/support/views/example4.client.view.html'
        }).
        state('support.example5', {
            url: '/example5',
            templateUrl: 'modules/support/views/example5.client.view.html'
        }).
        state('support.example6', {
            url: '/example6',
            templateUrl: 'modules/support/views/example6.client.view.html'
        });
	}
]);

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/views/admin/user-list.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/views/admin/user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/views/admin/user-edit.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
	  .state('settings.account', {
        url: '/account',
        templateUrl: 'modules/users/views/settings/account.client.view.html'
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/views/settings/change-password.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function () {
      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function () {
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
	
	/*
	Created my own lists manually just for testing purposes
	*/
	
	$scope.countyList = ['None','Alachua', 'Broward'];
	$scope.schoolList=[];
	$scope.county0=['None0','None1','None2'];
	$scope.county1=['University of Florida', 'Sante Fe'];
	$scope.county2=['Mater','Lakes','Stirrup'];
	$scope.county='';
	$scope.school='';
	
	$scope.County = function(){
		$scope.schoolList=[];
		$scope.credentials.county=$scope.county;
		if($scope.county.trim()===$scope.countyList[1]){
			$scope.schoolList=[];
			for(var i=0;i<$scope.county1.length;i++){
				$scope.schoolList.push($scope.county1[i]);
			}
			//$scope.school=$scope.county1[0];
		}
		else if($scope.county.trim()===$scope.countyList[2]){
			$scope.schoolList=[];
			for(var i=0;i<$scope.county2.length;i++){
				$scope.schoolList.push($scope.county2[i]);
			}
			//$scope.school=$scope.county2[0];
		}
		else{
			$scope.schoolList=[];
			for(var i=0;i<$scope.county0.length;i++){
				$scope.schoolList.push($scope.county0[i]);
			}
			//$scope.school=$scope.county0[0];
		}
		console.log($scope.school);
	};
	

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      var redirect_to;

      if ($state.previous) {
        redirect_to = $state.previous.href;
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication','Projects',
  function ($scope, Authentication, Projects){
    $scope.user = Authentication.user;
    // Grab projects that belong to this user
    $scope.getUserProjects = function(){
    //   Projects.query(
    //     //maybe changes here
    //     //{projAdmin : $scope.user._id},
    //     {},
    //     function(projects) {
    //       //projects.forEach(console.log
    //       $scope.userProjects = projects;
    //       //console.log($scope.userProjects);
    //     }
    // );
      var userP = Projects.query({minGrade:0,maxGrade:12}, function(){
        var goo =[];
        for(var i in userP){
          for(var j in userP[i].projAdmin){
            
            if(userP[i].projAdmin[j] === $scope.user._id){
              goo.push(userP[i]);
            }
          }
        }
        console.log(goo);
        $scope.userProjects = goo;
      });
    };

    $scope.deleteProject = function(project,$location){
     if (confirm('Are you sure you want to delete this project?')) { // Confirmation for deletion
	  if ( project ) { project.$remove();

        for (var i in $scope.userProjects ) {
          if ($scope.userProjects [i] === project ) {
            $scope.userProjects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function() {
          $location.path('projects');
        });
      }
	 }
	return false;

    };
  }
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    //return $resource('api/users', {email: ''}, {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {userId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
