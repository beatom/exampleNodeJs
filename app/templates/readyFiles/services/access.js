(function () {
    'use strict';

    /* jshint latedef:nofunc */

    /**
     * @ngdoc service
     * @name app.accessService
     * @description
     * # accessService
     * A helper that handles redirection based on authentication states.
     */
    angular.module('app')
    .factory('accessService', function ($q, $location, $route, authService, sessionService) {
        var service = {
            loggedIn: loggedIn,
            loggedOut: loggedOut
        };

        return service;

        /**
         * @ngdoc method
         * @name bypass
         * @methodOf app.tokenService
         * @description If the user is logged in then certain pages will be bypassed.
         * @param {String} [redirectTo] - Optional path to redirect to, defaults to '/'
         * @return {Promise}
         */
        function loggedOut(redirectTo) {

            if (sessionService.loggedIn()) {
                redirectTo = redirectTo || '/';
                $location.path(redirectTo);
            }

            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name restricted
         * @methodOf app.tokenService
         * @description If the user is not logged in then certain pages will be inaccessible and therefor the user will be redirected to /login.
         * @param {String} [redirectTo] - Optional path to redirect to, defaults to '/login'
         * @return {Promise}
         */
        function loggedIn(redirectTo) {
            if (!sessionService.loggedIn()) {
                redirectTo = redirectTo || '/login';
                $location.path(redirectTo);
            }

            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    });
})();
