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
