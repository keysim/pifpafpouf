

mainApp.controller('gameCtrl', function($scope, $http, $cookies, $window) {
    if(!$cookies.get("login"))
        $window.location.href = "/login";
    var players = [];
    players.push(new Player(0, -60, "right"));
    //players.push(new Player(450, -50, "right"));

    var game = new Game(players);
    game.start();
});

function consoleLog($scope, type, message) {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();
    var time = n + "h" + ((m < 10) ? ("0" + m) : m);
    $scope.$broadcast('log', {time:time, message:message, type:type});
}