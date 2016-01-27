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
    .directive('subnav', subnav);

    subnav.$inject = ['$location', '$mdUtil'];

    function subnav($location, $mdUtil) {
        return {
            templateUrl: './views/directives/subnav.html',
            restrict: 'E',
            replace: true,
            scope: true,
            link: function (scope) {
                
            }
        };
    }
})();
