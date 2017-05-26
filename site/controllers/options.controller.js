mainApp.controller('optionsCtrl', function($scope, $http, $cookies, $window) {
    if(!$cookies.get("login"))
        $window.location.href = "/login";
});