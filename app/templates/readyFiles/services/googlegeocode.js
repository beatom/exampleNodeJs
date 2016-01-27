(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name app.googleGeocodeService
     * @description
     * # googleGeocodeService
     * Factory in the app.
     */
    angular.module('app')
    .factory('googleGeocodeService', function ($http, GOOGLEAPIKEY, failHandler) {
        var service = {
            postalcode: getPostalCode
        },
        url = 'https://maps.googleapis.com/maps/api/geocode/json?';

        return service;

        function getPostalCode(config) {
            var request = url + 'result_type=postal_code&';

            if (config && config.lat && config.lng) {
                request += 'latlng=' + config.lat + ',' + config.lng;
                request = attachApiKey(request, GOOGLEAPIKEY);
            } else {
                throw new Error('lat and lng must be provided');
            }

            return $http.get(request)
            .then(getPostalCodeSuccess)
            .catch(failHandler);

            function getPostalCodeSuccess(response) {
                return response.data.results[0].address_components[0].long_name;
            }
        }

        function attachApiKey(path, key) {
            if (key) {
                path += '&key=' + key;
            }
            return path;
        }
    });
})();
