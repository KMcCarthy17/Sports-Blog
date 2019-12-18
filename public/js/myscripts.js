let app = angular.module("myApp", ["ngRoute"]);
app.config(["$routeProvider",
    function ($routeProvider,$routeParams) {
        $routeProvider
            .when("/",{
                templateUrl: "./templates/start.html"
            })
            .when("/login", {
                templateUrl : "./templates/login.html",
                controller: "loginCtrl"
            })
            .when("/logout", {
                templateUrl : "./templates/logout.html",
                controller: "logoutCtrl"
            })
            .when("/register", {
                templateUrl : "./templates/register.html",
                controller : "registerCtrl"
            })
            .when("/main", {
                templateUrl : "./templates/main.html",
                //controller : "mainCtrl"
            })
            .when("/proFootball", {
                templateUrl : "./templates/proFootball.html",
                controller : "proFootballCtrl"
            })
            .when("/proFootball/:post_id", {
                templateUrl : "./templates/specificProFootball.html",
                controller : "specificProFootballCtrl"
            })
            .when("/collegeFootball", {
                templateUrl : "./templates/collegeFootball.html",
                controller : "collegeFootballCtrl"
            })
            .when("/collegeFootball/:post_id", {
                templateUrl : "./templates/specificCollegeFootball.html",
                controller : "specificCollegeFootballCtrl"
            })
            .when("/proBasketball", {
                templateUrl : "./templates/proBasketball.html",
                controller : "proBasketballCtrl"
            })
            .when("/proBasketball/:post_id", {
                templateUrl : "./templates/specificProBasketball.html",
                controller : "specificProBasketballCtrl"
            })
            .when("/collegeBasketball", {
                templateUrl : "./templates/collegeBasketball.html",
                controller : "collegeBasketballCtrl"
            })
            .when("/collegeBasketball/:post_id", {
                templateUrl : "./templates/specificCollegeBasketball.html",
                controller : "specificCollegeBasketballCtrl"
            })
            .when("/proFootballNewPost", {
                templateUrl : "./templates/proFootballNewPost.html",
                controller : "proFootballNewPostCtrl"
            })
            .when("/collegeFootballNewPost", {
                templateUrl : "./templates/collegeFootballNewPost.html",
                controller : "collegeFootballNewPostCtrl"
            })
            .when("/proBasketballNewPost", {
                templateUrl : "./templates/proBasketballNewPost.html",
                controller : "proBasketballNewPostCtrl"
            })
            .when("/collegeBasketballNewPost", {
                templateUrl : "./templates/collegeBasketballNewPost.html",
                controller : "collegeBasketballNewPostCtrl"
            })
    }
]);

/***
 * Post Controllers
 ***/

//login controller
app.controller("loginCtrl", function ($scope,$http,dataService,$location) {
    $scope.username = "";
    $scope.password = "";
    $scope.errorMessage = "";
    console.log("Login controller");
    $scope.submit = function(evt){
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/login',
            data: { 'username': $scope.username, 'password': $scope.password }
        };
        console.log(req.data);
        $http(req).then(function (response) {
            if(response.data){
                console.log(response.data);
                console.log(response.data.loggedStatus);
                console.log(response.data.username);
                if(response.data.loggedStatus){
                    $location.path("/main");
                }
                else{
                    $scope.errorMessage = "Username and/or password are wrong";
                }
            }

        })
    };

});

//register controller
app.controller("registerCtrl", function($scope,$http,dataService,$location) {
    $scope.username = "";
    $scope.password = "";
    $scope.errorMessage = "";
    console.log("Register controller");
    $scope.submit = function (evt) {
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/register',
            data: {'username': $scope.username, 'password': $scope.password}
        };
        $http(req).then(function (response) {
            if(response.data.loggedStatus){
                $location.path("/login");
            }
            else{
                $scope.errorMessage = "Username already exists";
            }
        })
        
    }
});

//pro football new post controller
app.controller("proFootballNewPostCtrl", function ($scope,$http,dataService,$location) {
    $scope.title = "";
    $scope.author = "";
    $scope.blog_body = "";
    console.log("Pro Football New Post Controller");
    $scope.submit = function (evt) {
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/profootballnewpost',
            data:{'title': $scope.title, 'author': $scope.author, 'blog_body': $scope.blog_body}
        };
        $http(req).then(function (response) {
            $location.path("/proFootball");
        })

    }
});

//college football new post controller
app.controller("collegeFootballNewPostCtrl", function ($scope,$http,dataService,$location) {
    $scope.title = "";
    $scope.author = "";
    $scope.blog_body = "";
    console.log("College Football New Post Controller");
    $scope.submit = function (evt) {
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/collegefootballnewpost',
            data:{'title': $scope.title, 'author': $scope.author, 'blog_body': $scope.blog_body}
        };
        $http(req).then(function (response) {
            $location.path("/collegeFootball");
        })

    }
});

//college football new post controller
app.controller("proBasketballNewPostCtrl", function ($scope,$http,dataService,$location) {
    $scope.title = "";
    $scope.author = "";
    $scope.blog_body = "";
    console.log("Pro Basketball New Post Controller");
    $scope.submit = function (evt) {
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/probasketballnewpost',
            data:{'title': $scope.title, 'author': $scope.author, 'blog_body': $scope.blog_body}
        };
        $http(req).then(function (response) {
            $location.path("/proBasketball");
        })

    }
});

//college football new post controller
app.controller("collegeBasketballNewPostCtrl", function ($scope,$http,dataService,$location) {
    $scope.title = "";
    $scope.author = "";
    $scope.blog_body = "";
    console.log("College Basketball New Post Controller");
    $scope.submit = function (evt) {
        evt.preventDefault();
        var req = {
            method: 'POST',
            url: '/collegebasketballnewpost',
            data:{'title': $scope.title, 'author': $scope.author, 'blog_body': $scope.blog_body}
        };
        $http(req).then(function (response) {
            $location.path("/collegeBasketball");
        })

    }
});


/***
 * Get Controllers
 ***/

//logout controller
app.controller("logoutCtrl", function ($scope,$http,dataService,$location) {
    $scope.logout = function(){
        $http.get("/logout")
            .then(function (response) {
                console.log(response.data.loggedStatus);
                if(response.data.loggedStatus == false){
                    $location.path("/login");
                }
            })
    };
});

//pro football controller
app.controller("proFootballCtrl", function ($scope,$http,dataService) {
    console.log("made it!");
    $scope.getProFootball = function () {
        $http.get("/proFootballPosts")
            .then(function (response) {
                $scope.proFootball = response.data;
                dataService.addData("proFootball", $scope.proFootball);
            }).catch(function(err){$scope.err = err});
    };
});

//specific pro football controller
app.controller("specificProFootballCtrl", function ($scope, $routeParams,$http,dataService) {
    for(i = 0; i < dataService.getData().proFootball.length; i++){
        console.log("id: " + $routeParams.post_id);
        console.log("id2: ", (dataService.getData().proFootball[i]).post_id);
        if((dataService.getData().proFootball[i]).post_id == $routeParams.post_id){
            $scope.specificProFootball = dataService.getData().proFootball[i];
            console.log("made it to if statement");
        }
    }
    console.log($scope.specificProFootball);
});

//college football controller
app.controller("collegeFootballCtrl", function ($scope,$http,dataService) {
    console.log("made it!");
    $scope.getCollegeFootball = function () {
        $http.get("/collegeFootballPosts")
            .then(function (response) {
                $scope.collegeFootball = response.data;
                dataService.addData("collegeFootball", $scope.collegeFootball);
            }).catch(function(err){$scope.err = err});
    };
});

//specific college football controller
app.controller("specificCollegeFootballCtrl", function ($scope, $routeParams,$http,dataService) {
    for(i = 0; i < dataService.getData().collegeFootball.length; i++){
        console.log("id: " + $routeParams.post_id);
        console.log("id2: ", (dataService.getData().collegeFootball[i]).post_id);
        if((dataService.getData().collegeFootball[i]).post_id == $routeParams.post_id){
            $scope.specificCollegeFootball = dataService.getData().collegeFootball[i];
            console.log("made it to if statement");
        }
    }
    console.log($scope.specificCollegeFootball);
});

//pro basketball controller
app.controller("proBasketballCtrl", function ($scope,$http,dataService) {
    console.log("made it!");
    $scope.getProBasketball = function () {
        $http.get("/proBasketballPosts")
            .then(function (response) {
                $scope.proBasketball = response.data;
                dataService.addData("proBasketball", $scope.proBasketball);
            }).catch(function(err){$scope.err = err});
    };
});

//specific pro basketball controller
app.controller("specificProBasketballCtrl", function ($scope, $routeParams,$http,dataService) {
    for(i = 0; i < dataService.getData().proBasketball.length; i++){
        console.log("id: " + $routeParams.post_id);
        console.log("id2: ", (dataService.getData().proBasketball[i]).post_id);
        if((dataService.getData().proBasketball[i]).post_id == $routeParams.post_id){
            $scope.specificProBasketball = dataService.getData().proBasketball[i];
            console.log("made it to if statement");
        }
    }
    console.log($scope.specificProBasketball);
});

//college basketball controller
app.controller("collegeBasketballCtrl", function ($scope,$http,dataService) {
    console.log("made it!");
    $scope.getCollegeBasketball = function () {
        $http.get("/collegeBasketballPosts")
            .then(function (response) {
                $scope.collegeBasketball = response.data;
                dataService.addData("collegeBasketball", $scope.collegeBasketball);
            }).catch(function(err){$scope.err = err});
    };
});

//specific college basketball controller
app.controller("specificCollegeBasketballCtrl", function ($scope, $routeParams,$http,dataService) {
    for(i = 0; i < dataService.getData().collegeBasketball.length; i++){
        console.log("id: " + $routeParams.post_id);
        console.log("id2: ", (dataService.getData().collegeBasketball[i]).post_id);
        if((dataService.getData().collegeBasketball[i]).post_id == $routeParams.post_id){
            $scope.specificCollegeBasketball = dataService.getData().collegeBasketball[i];
            console.log("made it to if statement");
        }
    }
    console.log($scope.specificCollegeBasketball);
});





//Helpers
app.service('dataService',function () {
    let data = {};
    let setData = function(obj){
        data = obj;
    };
    let addData = function(key,value){
        data[key] = value;
    };
    let getData = function () {
        return data;
    };
    return {addData: addData, getData: getData,setData:setData}
});