

mainApp.controller('gameCtrl', function($scope, $http, $cookies, $window) {
    if(!$cookies.get("login"))
        $window.location.href = "/login";

    $scope.play = function () {
        var players = [];
        players.push(new Player(0, -GAME.SIZE, "right"));
        players.push(new Player(GAME.SIZE * 9, -GAME.SIZE, "right"));

        var game = new Game(players);
        game.start();
    };
});

function consoleLog($scope, type, message) {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();
    var time = n + "h" + ((m < 10) ? ("0" + m) : m);
    $scope.$broadcast('log', {time:time, message:message, type:type});
}