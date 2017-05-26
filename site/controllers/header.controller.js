mainApp.directive("header", function(){
    return {
        restrict : "E",
        templateUrl : "views/header.partial.html",
        controller: "headerCtrl"
    };
});

mainApp.controller('headerCtrl', function($scope, $http, $location, $cookies, $window, gamesock){
    $scope.logged = false;
    if(!$cookies.get("login"))
        $scope.nav_login = "Login";
    else {
        $scope.logged = true;
        $scope.nav_login = $cookies.get("login");
    }
    $scope.goTo = function () {
        if($cookies.get("login"))
            $location.path("/");
    };
    $scope.getClass = function (path) {
        return $location.path() === "/" + path ? "active" : "";
    };
    $scope.disconnect = function() {
        if($cookies.get("login")){
            console.log("COOKIES DELETED");
            $cookies.remove("token", { path: '/' });
            $cookies.remove("login", { path: '/' });
        }
        $window.location.href = "/login"; // Delete game instance
        //$location.path("/login");
    };
});