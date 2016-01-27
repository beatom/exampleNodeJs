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
    .directive('sidenav', sidenav);

    sidenav.$inject = ['$location', '$mdSidenav', '$mdUtil', 'authService', 'sessionService'];

    function sidenav($location, $mdSidenav, $mdUtil, authService, sessionService) {
        return {
            templateUrl: './views/directives/sidenav.html',
            restrict: 'E',
            replace: true,
            scope: true,
            link: function (scope) {
                scope.logout = logout;
                scope.loggedIn = sessionService.loggedIn;
                scope.button = {};
                scope.button.access = 'Login';
                scope.button.register = 'Sign Up';
                scope.access = access;
                scope.register = register;
                scope.profile = profile;

                scope.$watch(function() {
                    //return authService.isLoggedIn();
                }, function () {
                   // scope.button.access = granted ? 'Logout' : 'Login';
                    //scope.button.register = granted ? 'Profile' : 'Sign Up';
                });

                function logout() {
                    authService.logout();
                    $mdSidenav('sidenav-right').close();
                }
                function profile() {
                    $location.path('/account/profile');
                    $mdSidenav('sidenav-right').close();
                }
                function access() {
                    $location.path('/login');
                    $mdSidenav('sidenav-right').close();
                }
                function register() {
                    $location.path('/register');
                    $mdSidenav('sidenav-right').close();
                }
            }
        };
    }
})();
