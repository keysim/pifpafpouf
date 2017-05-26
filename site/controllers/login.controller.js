mainApp.controller('loginCtrl', function($scope, $http, $location, $cookies, $timeout, $window) {
    $scope.loginBtn = "Login";
    $scope.loginClass = "btn-primary";

    $scope.registerBtn = "Register";
    $scope.registerClass = "btn-primary";
    $scope.register = function () {
        var data = {password: $scope.pwd, login: $scope.login};
        $scope.registerBtn = "<div class='login_anim'></div>";
        $http.post(apiUrl + "register", data, postConfig).then(function(res) {
            $timeout(function() { // fake loading
                $scope.registerClass = "btn-primary login_out"; // Login fadeOut
                $timeout(function() {
                    if (!res.data.success) { // error
                        $scope.registerClass = "btn-danger login_in"; // Error fadeIn
                        $scope.registerBtn = res.data.message;
                        $timeout(function () {
                            $scope.registerClass = "btn-danger login_out";
                            $timeout(function () {
                                $scope.registerBtn = "Register";
                                $scope.registerClass = "btn-primary login_in";
                            }, 500);
                        }, 500);
                    }
                    else {
                        $scope.registerClass = "btn-success login_in";
                        $scope.registerBtn = "Success";
                        $timeout(function () {
                            $window.location.href = "./login";
                        }, 400);
                    }
                }, 300);
            }, 800);
        }, function (err) {
            console.log(err.data);
        });
    };
    $scope.log = function() {
        $scope.loginBtn = "<div class='login_anim'></div>";
        var data = {password: $scope.pwd, login: $scope.login};
        $http.post(apiUrl + "authenticate", data, postConfig).then(function(res){
            $timeout(function() { // fake loading
                $scope.loginClass = "btn-primary login_out"; // Login fadeOut
                $timeout(function() {
                    if (!res.data.success) { // error
                        $scope.loginClass = "btn-danger login_in"; // Error fadeIn
                        $scope.loginBtn = res.data.message;
                        $timeout(function () {
                            $scope.loginClass = "btn-danger login_out";
                            $timeout(function () {
                                $scope.loginBtn = "Login";
                                $scope.loginClass = "btn-primary login_in";
                            }, 300);
                        }, 500);
                    }
                    else {
                        $scope.loginClass = "btn-success login_in";
                        $scope.loginBtn = "Welcome " + $scope.login;
                        $cookies.put("token", res.data.token);
                        $cookies.put("login", $scope.login);
                        $timeout(function () {
                            $window.location.href = "./";
                        }, 400);
                    }
                }, 300);
            }, 800);
        }, function (err) {
            console.log(err.data);
        });
    };
});