(function () {
    'use strict';

    /* jshint latedef:nofunc */

    /**
     * @ngdoc service
     * @name app.passwordsService
     * @description
     * # passwordsService
     * Factory in the app.
     */

    angular.module('app')
    .service('passwordsService', function (apiService) {
        var service = {
            request: request,
            reset: reset
        };

        return service;

        function request(data){
            debugger;
            return apiService.post('password/request', data);
        }

        function reset(data){
            return apiService.post('password/reset', data);
        }
    });
})();
