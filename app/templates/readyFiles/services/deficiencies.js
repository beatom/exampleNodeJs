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
    .factory('deficienciesService', function (apiService) {
        var service = {
            get: getDeficiencies
        };
       
        return service;

        function getDeficiencies() {
           
            return apiService.gets('me', ['accounts'], { key: 'user' })
            .then(getUserSuccess);

            function getUserSuccess(response) {
                return response;
            }
        }
    });
})();
