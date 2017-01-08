app.controller('manageUserCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
    	if (typeof $sessionStorage.uid == "undefined") {
            $location.path("/login");
            return
        }
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token;
       	$rootScope.showSpinner = true;
    };
    //initial load
    $scope.loadData();
});

app.controller('createUserCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token;        
       	var data = {}
       	data.created_by = $rootScope.uid;
        data.updated_by = $rootScope.uid;
       	data.access_token = $rootScope.access_token;
        data.is_active = "y"
        data.role = "admin"
        data.tags = "pl-batch-no-01"
       	$scope.data = data;
    };
    $scope.submitForm = function (){
    	console.log($scope.data)
        console.log($scope.data.tags.split(","))


    };
    //initial load
    $scope.loadData();
});