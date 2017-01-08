app.controller('profileCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        if (typeof $sessionStorage.uid == "undefined") {
            $rootScope.showSpinner = true;
            $rootScope.showSpinner = false;
            $location.path("/login");
            return
        }
        $rootScope.showSpinner = true;
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $http({
            method: "GET",
            url: rest_host_url + "getProfile/uid/" + $rootScope.uid,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            $scope.profileForm.data = {};
            if (data.data) {
                $scope.profileForm.data.full_name = data.data.full_name;
                $scope.profileForm.data.mobile = data.data.mobile;
                $scope.profileForm.data.email = data.data.email;
            }
            $scope.profileForm.data.uid = $scope.uid;
            $scope.profileForm.data.access_token = $scope.uid;
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })
        return;
    };
    $scope.submitForm = function() {
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "updateProfile/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.profileForm.data) ? angular.toJson($scope.profileForm.data) : {}
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage("Updated Successfully.");
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })
        return;
    };
    //initial load
    $scope.loadData();
});

app.controller('usernameCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        //setting to model 
        var data = {}
        data.uid = $rootScope.uid;
        data.username = $rootScope.username;
        data.new_username = $rootScope.username;
        data.access_token = $rootScope.access_token;
        $scope.data = data;
    };
    $scope.submitForm = function() {
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "changeUsername/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.data) ? angular.toJson($scope.data) : {}
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage("Updated Successfully.");
            $sessionStorage.username = $scope.data.new_username;
            $rootScope.username = $sessionStorage.username;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })
    };
    //initial load
    $scope.loadData();
});

app.controller('changePasswordCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        var data = {};
        data.uid = $scope.uid;
        data.access_token = $scope.uid;
        $scope.data = data;
    };
    $scope.submitForm = function() {
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "changePassword/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.data)  ? angular.toJson($scope.data) : {}
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage("Updated Successfully. Please Sign out and login again.");
            //TODO clear the form.
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })
    };
    //initial load
    $scope.loadData();
});