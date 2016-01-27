'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

angular
.module('app', [
    /* cg-modules-start */
    /* cg-modules-end */
])
.config(function ($routeProvider) {
    $routeProvider
    /* cg-routes-start */
    /* cg-routes-end */
    .when('/404', {
        templateUrl: 'views/404.html'
    })
    .otherwise({
        redirectTo: '/404'
    });
})
.run(function($http) {
    //stub
    var data = {
        email: "admin@admin.com",
        password: "admin"
    }
    $http.post('http://athena.dev.firestitch.com/api/auth/login', data).then(
        function(result) {
            localStorage.token = JSON.stringify(result.data.data.token);
        }
    );

});