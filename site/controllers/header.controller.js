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
    $scope.goTo = function (path) {
        if(path !== "" && path !== "/online")
            game.hide();
        if(!$cookies.get("login") && path !== "home" && path !== "login" && path !== "register")
            $location.path("/login");
        else
            $location.path(path);
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