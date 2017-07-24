var mainApp = angular.module("mainApp", ['ngCookies', 'ngRoute', 'btford.socket-io']);
var apiUrl = "http://92.90.130.123/api/";
var socketUrl = "http://92.90.130.123";
var postConfig = {headers : {'Content-Type': 'application/json'}};

mainApp.controller('mainController', function($scope) {
});

mainApp.factory('gamesock', function (socketFactory, $cookies) {
    if(!$cookies.get("token"))
        return null;
    var myIoSocket = io(socketUrl, {query: "token=" + $cookies.get("token")});

    return socketFactory({
        ioSocket: myIoSocket
    });
});

angular.module('mainApp')
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);