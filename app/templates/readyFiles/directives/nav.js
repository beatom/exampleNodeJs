(function () {
    'use strict';

    /* jshint latedef:nofunc */

    /**
     * @ngdoc directive
     * @name app.directive:nav
     * @description
     * # nav
     */
    angular.module('app')
    .directive('nav', nav);

    nav.$inject = ['$location', '$mdSidenav', '$mdUtil', 'authService', 'sessionService'];

    function nav($location, $mdSidenav, $mdUtil, authService, sessionService) {
        return {
            templateUrl: './views/directives/nav.html',
            restrict: 'E',
            replace: true,
            scope: true,
            link: function (scope) {
                scope.logout = authService.logout;
                scope.loggedIn = sessionService.loggedIn;
                scope.button = {};
                scope.button.access = 'Login';
                scope.button.register = 'Sign Up';
                scope.access = access;
                scope.register = register;
                scope.profile = profile;
                
                scope.toggleRight = $mdUtil.debounce(function(){
                    $mdSidenav('sidenav-right').toggle()
                }, 200);

                scope.$watch(function() {
                    //return authService.isLoggedIn();
                }, function () {
                   // scope.button.access = granted ? 'Logout' : 'Login';
                    //scope.button.register = granted ? 'Profile' : 'Sign Up';
                });
                
                function profile() {
                    $location.path('/account/profile');
                }
                function access() {
                    $location.path('/login');
                }
                function register() {
                    $location.path('/register');
                }
            }
        };
    }
})();
