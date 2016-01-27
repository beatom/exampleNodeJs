(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name app.validateService
     * @description
     * # validateService
     * Factory in the app.
     */
    angular.module('app')
    .factory('validateService', function() {

        var service = {
            postalCode: postalCode
        };
       
        return service;

        function postalCode(postalCode, countryCode) {        

            var postalCodeRegex = void 0;

            switch (countryCode) {
                case 'US':
                    postalCodeRegex = /^\b\d{5}(-\d{4})?\b$/;
                break;
                case 'CA':
                    postalCodeRegex = new RegExp(/^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] +?[0-9][A-Z][0-9]$/i);
                break;
                default:
                    postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
            }
            return postalCodeRegex.test(postalCode);
        }
    });
})();
