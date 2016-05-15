app.directive('sidebar', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/sidebar/sidebar.directive.html',
        controller: 'airportCtrl'
    };
});