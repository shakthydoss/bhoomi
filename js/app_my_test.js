app.controller('listMyTestPaperCtrl', function($scope, $location, $http, $rootScope, $sessionStorage) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "/test/mytestpaper/"+$rootScope.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
        	$scope.tps = data.data
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

    $scope.goToSummary = function(tpid, uid){
        $location.path("my-testpaper-summary/"+tpid+"/"+uid+"/");
    }
    //initial load
    $scope.loadData();
});


app.controller('mytestSummaryCtrl', function($scope, $location, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "/test/summary/"+$routeParams.tpid+"/"+$routeParams.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            console.log(data.data)
            $scope.tp = data.data.tp
            $scope.test = data.data.test
            $scope.tp.total_no_of_questions = Object.keys(data.data.tp.questions).length
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

app.controller('testCtrl', function($scope, $location, $route, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $rootScope.tpid = $routeParams.tpid
        $scope.showReview = false;
        $http({
            method: "GET",
            url: rest_host_url + "/load-test/"+$routeParams.tpid+"/"+$routeParams.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            $scope.tp = data.data.tp
            $scope.test = data.data.test
            $scope.tp.total_no_of_questions = Object.keys(data.data.tp.questions).length
             // call only for first time attempt.
            if($scope.test.status == "not-started"){
                $scope.test_started()
            }
            $scope.qid_arry = []
            for(qid in $scope.test.questions){
                $scope.qid_arry.push(qid)
            }
            //getting question index from url param 
            $scope.show_question_at_index = parseInt($routeParams.qindex)
            $scope.question = $scope.test.questions[$scope.qid_arry[$scope.show_question_at_index-1]]
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return;
            }
            showFlashMessage(data.data)
            return;
        })
    };
    $scope.gotToNextQuestion = function(){
        $scope.update_responce($scope.question.qid)
        $scope.show_question_at_index = $scope.show_question_at_index +1
        $location.path("/test/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+$scope.show_question_at_index);
    };
    $scope.gotToPreviousQuestion = function(){
        $scope.update_responce($scope.question.qid)
        $scope.show_question_at_index = $scope.show_question_at_index -1
        $location.path("/test/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+$scope.show_question_at_index);
    };
    $scope.test_started = function(){
        $rootScope.showSpinner = true;
         $http({
            method: "GET",
            url: rest_host_url + "/test/started/"+$routeParams.tpid+"/"+$routeParams.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            $scope.test.status = "pending"
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return;
            }
            showFlashMessage(data.data)
            return;
        })
    };

    $scope.update_responce = function(qid){
        if($scope.test.questions[qid].type == 'single_choice'){
            selected_values = [$("input[name="+qid+"]:checked").val()]
            
        }
        if($scope.test.questions[qid].type == 'multi_choice'){
            selected_values = $("input:checkbox:checked").map(function(){
                return $(this).val();
            }).get();
        }
        // removing undefined values.
        selected_values = selected_values.filter(function( element ) {
        return element !== undefined;
        });
       // if there is no change in response then do nothing.
       if(selected_values + "" == $scope.test.questions[qid].response + ""){
        return;
       }
       $scope.test.questions[qid].response = selected_values
       var jsonData = {}
       jsonData["access_token"] = $rootScope.access_token
       jsonData["updated_by"] = $rootScope.uid
       jsonData["uid"] = $rootScope.uid
       jsonData["tpid"] = $scope.test.tpid
       jsonData["qid"] = $scope.question.qid
       jsonData["response"] = selected_values
        $http({
            method: "POST",
            url: rest_host_url + "/test/updateResponse/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: (jsonData) ? angular.toJson(jsonData) : {}
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage("Updated Successfully.");
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })
    };

    $rootScope.goToReviewQuestion = function(){
        $scope.update_responce($scope.qid_arry[$scope.show_question_at_index-1])
        console.log($scope.show_question_at_index)
        $scope.showReview = true;
    }

    $scope.goToQuestion = function(question_at_index){
        console.log("I am here")
        $location.path("/test/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+question_at_index);
        $route.reload();
    }

    $scope.submitNow = function(){
        console.log("submitting now")
        $rootScope.showSpinner = true;
        $http({
            method: "GET",
            url: rest_host_url + "/test/completed/"+$scope.test.tpid+"/"+$rootScope.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage("Updated Successfully.");
            $location.path("/my-testpaper-summary/"+$scope.test.tpid+"/"+$rootScope.uid+"/"); 
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            showFlashMessage(data.data)
        })

    }

    //initial load
    $scope.loadData();
});


app.controller('testReviewCtrl', function($scope, $location, $route, $http, $rootScope, $sessionStorage, $routeParams) {
    $scope.loadData = function() {
        $rootScope.uid = $sessionStorage.uid;
        $rootScope.username = $sessionStorage.username;
        $rootScope.access_token = $sessionStorage.access_token
        $rootScope.showSpinner = true;
        $rootScope.tpid = $routeParams.tpid
        $scope.showReview = false;
        $http({
            method: "GET",
            url: rest_host_url + "/load-test/"+$routeParams.tpid+"/"+$routeParams.uid+"/",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).success(function(data, status, headers, config) {
            $scope.tp = data.data.tp
            $scope.test = data.data.test
            $scope.tp.total_no_of_questions = Object.keys(data.data.tp.questions).length
             // call only for first time attempt.
            if($scope.test.status == "not-started"){
                $scope.test_started()
            }
            $scope.qid_arry = []
            for(qid in $scope.test.questions){
                $scope.qid_arry.push(qid)
            }
            //getting question index from url param 
            $scope.show_question_at_index = parseInt($routeParams.qindex)
            $scope.question = $scope.test.questions[$scope.qid_arry[$scope.show_question_at_index-1]]
            $rootScope.showSpinner = false;
        }).error(function(data, status, headers, config) {
            $rootScope.showSpinner = false;
            if (status == 401) {
                $location.path("/login");
                return;
            }
            showFlashMessage(data.data)
            return;
        })
    };
    $scope.gotToNextQuestion = function(){
        console.log()
        $scope.show_question_at_index = $scope.show_question_at_index +1
        $location.path("/test-review/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+$scope.show_question_at_index);
    };
    $scope.gotToPreviousQuestion = function(){
        $scope.show_question_at_index = $scope.show_question_at_index -1
        $location.path("/test-review/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+$scope.show_question_at_index);
    };

    $scope.goToQuestion = function(question_at_index){
        $location.path("/test-review/"+$routeParams.tpid+"/"+$routeParams.uid+"/"+question_at_index);
        $route.reload();
    }

    $rootScope.goToReviewQuestion = function(){
        $scope.showReview = true;
    }

    //initial load
    $scope.loadData();
});



