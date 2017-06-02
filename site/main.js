var mainApp = angular.module("mainApp", ['ngCookies', 'ngRoute', 'btford.socket-io']);
var apiUrl = "http://localhost:1234/api/";
var socketUrl = "http://localhost:1234";
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