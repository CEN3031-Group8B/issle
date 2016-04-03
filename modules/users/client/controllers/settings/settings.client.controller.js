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
