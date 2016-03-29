'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication','Projects',
  function ($scope, Authentication, Projects){
    $scope.user = Authentication.user;


    // Grab projects that belong to this user
    $scope.getUserProjects = function(){
      Projects.query(
        {userId : $scope.user._id},
        function(projects) {
          $scope.userProjects = projects;
        }
    );};

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
