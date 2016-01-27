(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name app.apiService
     * @description
     * # apiService
     * Factory in the app.
     * 
     * conifg
     *    urlencoded = true/false
     *
     */
    angular.module('app')
    .factory('apiService', function ($http, $httpParamSerializer, sessionService, configService, alertService, $location, $q) {
        var service = {
            get: get,
            gets: gets,
            post: post,
            put: put,
            'delete': deleted,
            config: {   timeout: 10000,
                        urlencoded: true,
                        dataKey: 'data',
                        authorize: true }
        };       

        var sv = service;        

        return service;

        function params(data) {
            return '?' + $httpParamSerializer(data);
        }

        function get(endpoint, data, config) {
            endpoint = endpoint + params(data);
            return send('GET',endpoint, data, config);
        }

        function gets(endpoint, data, config) {
            endpoint = endpoint + params(data);
            return send('GET',endpoint, data, config);
        }

        function post(endpoint, data, config) {            
            return send('POST',endpoint, data, config);
        }

        function put(endpoint, data, config) {
            return send('PUT',endpoint, data, config);
        }

        function deleted(endpoint, config) {
            return send('DELETE',endpoint, null, config);
        }

        function send(method, endpoint, data, config) {
            var config = angular.extend({},sv.config,config || {});
            var url = configService.api.url + endpoint;
            var headers = {};

            if(config.authorize) {
                var api_key = apiKey();
                console.info(api_key);
                if(api_key)
                    headers['Api-Key'] = api_key;
            }
            
            if(config.urlencoded)
                headers['Content-Type'] = 'application/x-www-form-urlencoded';

            var dfd = $.Deferred();

            $http({
                method: method,
                url: url,
                headers: headers,
                timeout: sv.config.timeout,
                data: data,
                transformRequest: function(obj) {

                    if(config.urlencoded) {
                        var str = [];
                        for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }

                    return obj;
                }
            })
            .then(function (response) {
                dfd.resolve(restfulSuccess(response, config));
            })
            .catch(function (response) {
                dfd.reject(restfulFail(response, config));
            });

            return dfd.promise();
        }

        function headers(config) {
            return false;
        }

        function apiKey() {
            var token = sessionService.token();
            return token ? token.key : '';
        }

        function restfulSuccess(response, config) {
            var data = response.data;

            //if(config.dataKey) {
            //   data = data[config.dataKey];
            //}
            //
            //if (config && config.key) {
            //    data = data[config.key];
            //}

            return data;
        }

        function restfulFail(response, config) {

            var message = "Connection issue";

            if(response.data && response.data.message)
                message = response.data.message;

            response = {    message: message, 
                            code: response.status,
                            response: response };

            // no error handling required, simply return the message
            if (config && config.handle === false) {
                throw response;
            }

            // API token invalid
            if (response.code === 401 || response.code === 403) {
                alertService.error('Sorry, your session has expired, please try again.');
                $location.path('/login');
                throw response;
            }

            // General error
            alertService.error(message);
            throw response;
        }  
    });
})();
