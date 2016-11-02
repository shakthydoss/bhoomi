// initiating  angular js app 
var rest_host_url = "http://localhost/rest/"
var app = angular.module("bhoomiApp", ["ngRoute", "ngStorage"]);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/login.html"
        })
        .when("/login", {
            templateUrl: "pages/login.html"
        })
        .when("/sign-out", {
            templateUrl: "pages/sign-out.html"
        })
        .when("/dashboard", {
            templateUrl: "pages/dashboard.html"
        })
        .when("/profile", {
            templateUrl: "pages/profile.html"
        })
        .when("/my-testpaper", {
            templateUrl: "pages/my-testpaper.html"
        })
        .when("/my-testpaper-summary", {
            templateUrl: "pages/my-testpaper-summary.html"
        })
        .when("/manage-testpaper", {
            templateUrl: "pages/manage-testpaper.html"
        })
        .when("/create-testpaper", {
            templateUrl: "pages/create-testpaper.html"
        })
        .when("/edit-testpaper", {
            templateUrl: "pages/edit-testpaper.html"
        })
        .when("/testpaper-report", {
            templateUrl: "pages/testpaper-report.html"
        })
        .when("/manage-user", {
            templateUrl: "pages/manage-user.html"
        })
        .when("/create-user", {
            templateUrl: "pages/create-user.html"
        })
        .when("/edit-user", {
            templateUrl: "pages/edit-user.html"
        })
        .when("/manage-tag", {
            templateUrl: "pages/manage-tag.html"
        })
        .when("/create-tag", {
            templateUrl: "pages/create-tag.html"
        })
        .when("/edit-tag", {
            templateUrl: "pages/edit-tag.html"
        })
        .when("/manage-role", {
            templateUrl: "pages/manage-role.html"
        })
        .when("/create-role", {
            templateUrl: "pages/create-role.html"
        })
        .when("/edit-role", {
            templateUrl: "pages/edit-role.html"
        })
});

// adding spinner directive
app.directive("spinnerdirective", function() {
    return {
        template : "<div class='spinner' ng-show='showSpinner'><div class='spinner-box'><img src='img/hourglass.svg' height='100' width='100' ><br/>Please wait</div></div>"
    };
});



app.controller('loginCtrl', function($scope, $location, $http, $rootScope, $sessionStorage,$route,$templateCache, $timeout) {
     $scope.loadData = function() {
        if(typeof $sessionStorage.uid !== "undefined"){
            $rootScope.showSpinner = true;
            $templateCache.removeAll();
            $route.reload();
            $rootScope.showSpinner = false;
            $location.path("/dashboard");
        }
    };
    //initial load
    $scope.loadData();   

    $scope.submitForm = function() {   
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "authenticate/", 
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.loginForm.data) ?  angular.toJson($scope.loginForm.data) : {},
        }).success(function(data, status, headers, config) {
            $sessionStorage.access_token = data.data.access_token
            $sessionStorage.uid = data.data.uid
            $sessionStorage.username = data.data.username
            $templateCache.removeAll();
            $route.reload();
            $rootScope.showSpinner = false;
            $location.path("/dashboard");
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $templateCache.removeAll();
                $route.reload();
                $location.path("/login");
            }
            if(data.data){
                alert(data.data)
            }
        })               
        
    };    
});

app.controller('signOutCtrl', function($scope, $location, $http, $rootScope, $sessionStorage,$route,$templateCache, $timeout) {
    $scope.loadData = function() {
        $rootScope.showSpinner = true;
        $sessionStorage.$reset();
        $templateCache.removeAll();
        $route.reload();
        $rootScope.showSpinner = false;
        $location.path("/login");
    };

   
    //initial load
    $scope.loadData();   
});

app.controller('menuCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.username = $sessionStorage.username;
    };
    //initial load
    $scope.loadData();
});

app.controller('dashboardCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
    };
    //initial load
    $scope.loadData();
});


app.controller('profileCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $http({
            method: "GET",
            url: rest_host_url + "getProfile/uid/" + $scope.uid,
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


        }).error(function(data, status, headers, config) {
            $rootScope.flashMessage = "";
            if (status == 401) {
                $location.path("/login");
            }
            $rootScope.flashMessage = "";
            if (status == 400) {
                $rootScope.flashMessage = "Invalid inputs";
                return;
            }
            $rootScope.flashMessage = "Something went wrong couldn't process your request";
        })
        return;
    };
    $scope.submitForm = function() {
        $http({
            method: "POST",
            url: rest_host_url + "updateProfile/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: angular.toJson($scope.profileForm.data)
        }).success(function(data, status, headers, config) {
            $rootScope.flashMessage = "Updated Successfully.";
        }).error(function(data, status, headers, config) {
            if (status == 401) {
                $location.path("/login");
            }
            $rootScope.flashMessage = "";
            if (status == 400) {
                $rootScope.flashMessage = "Invalid inputs";
                return;
            }
            $rootScope.flashMessage = "Something went wrong couldn't process your request";
        })
    };
    //initial load
    $scope.loadData();
});

app.controller('usernameCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        //setting to model 
        var data = {};
        data.username = $scope.username;
        data.new_username = $scope.username;
        data.uid = $scope.uid;
        data.access_token = $scope.uid;
        $scope.data = data;
    };
    $scope.submitForm = function() {
        $http({
            method: "POST",
            url: rest_host_url + "changeUsername/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: angular.toJson($scope.data)
        }).success(function(data, status, headers, config) {
            $rootScope.flashMessage = "Updated Successfully.";
            $scope.errorMessage = "";
            $scope.username = $scope.data.new_username;
            $scope.data.username = $scope.data.new_username;
            $rootScope.username = $scope.username;
            $sessionStorage.username = $scope.username;
        }).error(function(data, status, headers, config) {
            if (status == 401) {
                $location.path("/login");
            }
            if (status == 400) {
                $rootScope.flashMessage = "Invalid inputs";
                return;
            }
            $rootScope.flashMessage = "Sorry couldn't process your request or Username already taken";
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
        $http({
            method: "POST",
            url: rest_host_url + "changePassword/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: angular.toJson($scope.data)
        }).success(function(data, status, headers, config) {
            $rootScope.flashMessage = "Updated Successfully. Please Sign out and login again.";
        }).error(function(data, status, headers, config) {
            if (status == 401) {
                $location.path("/login");
            }
            if (status == 400) {
                $rootScope.flashMessage = data['data'];
                return;
            }
            $rootScope.flashMessage = "Something went wrong couldn't process your request";
        })
    };
    //initial load
    $scope.loadData();
});
