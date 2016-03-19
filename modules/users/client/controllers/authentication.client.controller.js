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
	
	//$scope.val="o0";
	//$scope.school = function(value){
	//	if(value!=""){
	//		return false;
	//	}
	//	return true;
	//};
	
	
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
