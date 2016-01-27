(function () {
    'use strict';

    /* jshint latedef:nofunc */

    /**
     * @ngdoc service
     * @name app.meService
     * @description
     * # meService
     * Factory in the app.
     */
    angular.module('app')
    .factory('meService', function (apiService) {
        var service = {
            get: getUser,
            update: updateUser
        };
       
        return service;

        function getUser() {
           
            return apiService.gets('me', ['accounts'], { key: 'user' })
            .then(getUserSuccess);

            function getUserSuccess(response) {
                return response;
            }
        }

        function updateUser(data) {
            return apiService.put('me', data, { key: 'user' });
        }
    });
})();
