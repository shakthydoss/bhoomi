app.controller('manageTagCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
    	if (typeof $sessionStorage.uid == "undefined") {
            $location.path("/login");
            return
        }
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token;
       	$rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "tags/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            console.log(data.data)
        	$scope.tags = data.data
        }).error(function(data, status, headers, config) {         
	        $rootScope.showSpinner = false;
            showFlashMessage(data.data)
            return 
        })
    };
    //initial load
    $scope.loadData();
});

app.controller('createTagCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
    	if (typeof $sessionStorage.uid == "undefined") {
            $location.path("/login");
            return
        }
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token;        
       	var data = {}
       	data.uid = $rootScope.uid;
       	data.access_token = $rootScope.access_token;
        data.is_active = "y";
       	$scope.data = data;
    };
    $scope.submitForm = function (){
    	$rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "tag/new/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.data) ? angular.toJson($scope.data) : {}
        }).success(function(data, status, headers, config) {
        	$rootScope.showSpinner = true;
        	showFlashMessage("Successfully updated.")    
        	//TODO clear the form.	
        }).error(function(data, status, headers, config) {         
	        $rootScope.showSpinner = false;
            showFlashMessage(data.data)
            return 
        })
    };
    //initial load
    $scope.loadData();
});

app.controller('editTagCtrl', function($scope, $location, $http, $rootScope, $sessionStorage, $routeParams) {
    console.log("I am here.....")
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token;
        var data = {}
		data.uid = $rootScope.uid;
		data.access_token = $rootScope.access_token;
		$scope.data = data;
    	$rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "tag/id/"+$routeParams.tagid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
        	$rootScope.showSpinner = false;
            console.log(data.data)
        	$scope.data.name = data.data.name; 
        	$scope.data.description = data.data.description;
        	$scope.data.is_active = data.data.is_active;
            $scope.data.tag_id = data.data._id.$oid
        }).error(function(data, status, headers, config) { 
            console.log("error...")
            console.log(data)    
	        $rootScope.showSpinner = false;
            showFlashMessage(data.data)
            return 
        })      
    };
    $scope.submitForm = function (){
    	$rootScope.showSpinner = true;
        console.log($scope.data)
        $http({
            method: "POST",
            url: rest_host_url + "tag/update/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.data) ? angular.toJson($scope.data) : {}
        }).success(function(data, status, headers, config) {
        	$rootScope.showSpinner = true;
        	showFlashMessage("Successfully updated.")    
        	//TODO clear the form.	
        }).error(function(data, status, headers, config) {         
	        $rootScope.showSpinner = false;
            showFlashMessage(data.data)
            return 
        })
    };
    //initial load
    $scope.loadData();
});