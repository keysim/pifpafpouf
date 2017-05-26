mainApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/game.view.html',
            controller: 'gameCtrl'
        })
        .when('/options', {
            templateUrl: 'views/options.view.html',
            controller: 'optionsCtrl'
        })
        .when('/home', {
            templateUrl: 'views/home.view.html',
            controller: 'homeCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.view.html',
            controller: 'loginCtrl'
        })
        .when('/register', {
            templateUrl: 'views/register.view.html',
            controller: 'loginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
}]);