(function () {
    'use strict';

    /* jshint latedef:nofunc */

    /**
     * @ngdoc service
     * @name app.googlePlacesService
     * @description
     * # googlePlacesService
     * Factory in the app.
     */
    angular.module('app')
    .factory('googlePlacesService', function() {
        var service = {
            extract: extract
        };

        return service;

        // http://stackoverflow.com/a/10758313
        function extract(place, type, geo) {
            var components = place.address_components,
            location = place.geometry ? place.geometry.location : void 0;

            if (geo && location) {
                return location[type]();
            } else {
                for (var i=0; i<components.length; i++) {
                    for (var j=0; j<components[i].types.length; j++) {
                        if (components[i].types[j]===type) {
                            return components[i].short_name;
                        }
                    }
                }
                return '';
            }
        }
    });
})();
