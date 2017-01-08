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
        .when("/my-testpaper-summary/:tpid/:uid", {
            templateUrl: "pages/my-testpaper-summary.html"
        })
        .when("/manage-testpaper", {
            templateUrl: "pages/manage-testpaper.html"
        })
        .when("/create-testpaper", {
            templateUrl: "pages/create-testpaper.html"
        })
        .when("/edit-testpaper/:tpid", {
            templateUrl: "pages/edit-testpaper.html"
        })
        .when("/invite-user-for-test/:tpid", {
            templateUrl: "pages/invite-user-for-test.html"
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
        .when("/edit-tag/:tagid", {
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
        .when("/test/:tpid/:uid/:qindex", {
            templateUrl: "pages/test.html"
        })
        .when("/test-review/:tpid/:uid/:qindex", {
            templateUrl: "pages/test-review.html"
        })
        .when("/view-report/:tpid/", {
            templateUrl: "pages/view-report.html"
        })
});

// adding spinner directive
app.directive("spinnerdirective", function() {
    return {
        template: "<div class='spinner' ng-show='showSpinner'><div class='spinner-box'><img src='img/hourglass.svg' height='100' width='100' ><br/>Please wait</div></div>"
    };
});

// global function  
function showFlashMessage(str) {
    if (typeof str !== "undefined") { 
        alert(str)
    } else {
        alert("Something went wrong couldn't process your request")
    }
}

app.controller('loginCtrl', function($scope, $location, $http, $rootScope, $sessionStorage, $route, $templateCache, $timeout) {
    $scope.loadData = function() {
        if (typeof $sessionStorage.uid !== "undefined") {
            $rootScope.showSpinner = true;
            $rootScope.showSpinner = false;
            $location.path("/dashboard");
        }
    };
    $scope.submitForm = function() {
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "authenticate/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: ($scope.loginForm.data) ? angular.toJson($scope.loginForm.data) : {}
        }).success(function(data, status, headers, config) {
            $sessionStorage.uid = data.data.uid
            $sessionStorage.username = data.data.username
            $sessionStorage.access_token = data.data.access_token
            $rootScope.showSpinner = false;
            $location.path("/dashboard");
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })

    };
    //initial load
    $scope.loadData();
}); // end of login controller

app.controller('signOutCtrl', function($scope, $location, $http, $rootScope, $sessionStorage, $route, $templateCache, $timeout) {
    $scope.loadData = function() {
        $rootScope.showSpinner = true;
        $http({
            method: "POST",
            url: rest_host_url + "logout/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: {"uid":$rootScope.uid}
        }).success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {          
        })
        $sessionStorage.$reset()
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
        $rootScope.access_token = $sessionStorage.access_token
    };
    //initial load
    $scope.loadData();
});

app.controller('dashboardCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        if (typeof $sessionStorage.uid == "undefined") {
            $rootScope.showSpinner = true;
            $rootScope.showSpinner = false;
            $location.path("/login");
            return
        }
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
    };
    //initial load
    $scope.loadData();
});