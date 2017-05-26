mainApp.directive("footer", function(){
    return {
        restrict : "E",
        templateUrl : "views/footer.partial.html",
        controller: "footerCtrl"
    };
});

mainApp.controller('footerCtrl', function($scope, $http) {

});