app.filter('replace_underscore', function () {
        return function (text) {
            if (!text) {
                return text;
            }
            return text.replace(/[_]/g, " ");
        };
})

app.filter('replace_dash', function () {
        return function (text) {
            if (!text) {
                return text;
            }
            return text.replace(/[-]/g, " ");
        };
})

app.filter('to_capitalize', function () {
        return function (text) {
            if (!text) {
                return text;
            }
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
})

app.controller('listTestPapersCreatedByMe', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        console.log($rootScope.uid)
        $http({
            method: "GET",
            url: rest_host_url + "tp/uid/"+$rootScope.uid,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
        	$scope.tps = JSON.parse(data.data)
        	$rootScope.showSpinner = false;
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
});

app.controller('createtp', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $scope.time_limit = "no-limit"
        $scope.tag = ""

    };
    $scope.saveTp = function(){
        data = {}
        data["name"] = $scope.name
        data["tag"] = $scope.tag
        data["time_limit"] = $scope.time_limit
        data["access_token"] = $rootScope.access_token
        data["updated_by"] = $rootScope.uid
        $http({
            method: "POST",
            url: rest_host_url + "/tp/create/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
            console.log(data.data)
            $rootScope.showSpinner = false;
            $location.path("/edit-testpaper/"+data.data.tpid);
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
    }
    //initial load
    $scope.loadData();
});


app.controller('getTestPaperByTpid', function($scope, $location, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "tp/tpid/"+$routeParams.tpid,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            console.log(data.data)
        	$scope.tp = data.data
            if(data.data.status != "draft"){
                $scope.disableEditControls = true
            }else{
                $scope.disableEditControls = false
            }
        	$rootScope.showSpinner = false;
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
    $scope.addModalBox = function(){
        $scope.q = {}
        $scope.q["type"] = "single_choice"
        $scope.q["mark_per_correct_answer"] = "1"
        $scope.q["mark_per_wrong_answer"] = "0"
        $scope.show_add_button = true
        $scope.show_update_button = false
        $("#myModal").modal()
    }
    $scope.addQuestion = function(){
        $scope.q["qid"] = Math.round(new Date().getTime()/1000) + ""
        data = $scope.q
        data["options"] = data["options"].toString().split(",")
        data["answers"] = data["answers"].toString().split(",")
        data["total_mark_for_this_question"] = (data["answers"].length * parseInt(data["mark_per_correct_answer"])) +""
        data["tpid"] = $scope.tp.tpid
        data["access_token"] = $rootScope.access_token
        data["updated_by"] = $rootScope.uid
        $http({
            method: "POST",
            url: rest_host_url + "/tp/addQuestion/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
            $scope.tp.questions[$scope.q.qid] = $scope.q
            $rootScope.showSpinner = false;
            $('#myModal').modal('hide')
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
    }
    $scope.editQuestion = function(qid){
    	$scope.q = $scope.tp.questions[qid]
        $scope.show_add_button = false
        $scope.show_update_button = true
    	$("#myModal").modal()
    }
    $scope.updateQuestion = function(){
    	data = $scope.q
    	data["options"] = data["options"].toString().split(",")
    	data["answers"] = data["answers"].toString().split(",")
    	data["tpid"] = $scope.tp.tpid
        data["total_mark_for_this_question"] = ($(data["answers"]).size() * parseInt(data["mark_per_correct_answer"])) +""
    	data["access_token"] = $rootScope.access_token
    	data["updated_by"] = $rootScope.uid
    	$http({
            method: "POST",
            url: rest_host_url + "/tp/updateQuestion/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
        	$scope.tp.questions[$scope.q.qid] = $scope.q
        	$rootScope.showSpinner = false;
            $('#myModal').modal('hide')
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
    }
    $scope.confirmDelete = function(qid){
    	$scope.qid_to_delete = qid
    	//alert($scope.qid )
    	$('#confirmDelete').modal()
    }
    $scope.deleteQuestion = function(){
    	alert($scope.tp.tpid+" , "+$scope.qid_to_delete)
        var data = {}
        data["tpid"] = $scope.tp.tpid
        data["qid"] = $scope.qid_to_delete
        data["updated_by"]= $rootScope.uid 
        data["access_token"] = $rootScope.access_token
        $http({
            method: "POST",
            url: rest_host_url + "/tp/removeQuestion/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            delete $scope.tp.questions[$scope.qid_to_delete];
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
        $('#confirmDelete').modal('hide')
    }
    $scope.updateTp = function(){
        data = $scope.tp
        data["access_token"] = $rootScope.access_token
        data["updated_by"] = $rootScope.uid
        console.log("I am in update")
        console.log(angular.toJson(data))
        $http({
            method: "POST",
            url: rest_host_url + "/tp/save-or-update/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
            if($scope.tp.status != "draft"){
                $scope.disableEditControls = true
            }else{
                $scope.disableEditControls = false
            }
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
    }
    //initial load
    $scope.loadData();
});


app.controller('inviteUserForTest', function($scope, $location, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "tp/tpid/"+$routeParams.tpid,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            console.log(data.data)
            $scope.tp = data.data
            $scope.uids = ""
            if(data.data.status == "published"){
                $scope.disableEditControls = false
            }else{
                $scope.disableEditControls = true
            }
            $rootScope.showSpinner = false;
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
    $scope.invite = function() {
        data = {}
        data["tpid"] = $scope.tp.tpid
        data["invited_by"] = $rootScope.uid
        data["uids"] = $scope.uids.split(",")
        $rootScope.showSpinner = true;
        console.log(data)
        $http({
            method: "POST",
            url: rest_host_url + "tp/inviteUserForTest/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (data) ? angular.toJson(data) : {}
        }).success(function(data, status, headers, config) {
            console.log(data.data)
            $scope.uids = ""
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return
            }
            showFlashMessage(data.data)
            return
        })
    }
    //initial load
    $scope.loadData();
});


app.controller('viewReportCtrl', function($scope, $location, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "tp/view-report/"+$routeParams.tpid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            console.log("I am in success")
            console.log(data.data)
            $scope.tps = data.data
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
});