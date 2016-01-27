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
    .factory('usersService', function (apiService) {
        var service = {
            gets: gets
        };
       
        return service;

        function gets(data) {
            return apiService.get('users', data, { key: 'users' });
        }
    });
})();
