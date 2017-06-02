var players = [];
players.push(new Player(0, -GAME.SIZE, "left"));
players.push(new Player(GAME.SIZE * 9, -GAME.SIZE, "right"));
var game = new Game(players);

mainApp.controller('gameCtrl', function($scope, $http, $cookies, $window) {
    if(!$cookies.get("login"))
        $window.location.href = "/login";
    $scope.sound = true;
    $scope.menu = true;
    game.show();
    $scope.play = function () {
        game.toggleMenu();
    };
    $scope.restart = function () {
        game.restart();
    };
    $scope.toggleSound = function () {
        $scope.sound = !$scope.sound;
        game.sound($scope.sound);
    }
});

function consoleLog($scope, type, message) {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();
    var time = n + "h" + ((m < 10) ? ("0" + m) : m);
    $scope.$broadcast('log', {time:time, message:message, type:type});
}