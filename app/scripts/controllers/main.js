'use strict';

/**
 * @ngdoc function
 * @name codeGeneratorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the codeGeneratorApp
 */

angular.module('codeGeneratorApp')
    .controller('MainCtrl', function ($scope, $http, $sce, $q, ngDialog) {

        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        var x2js = new X2JS();

        getDeendencies().then(function(response) {
            $scope.dependencies = response.data;
        });
        //$sce.trustAsResourceUrl('http://localhost:1999');

        $scope.paths = {
            server: localStorage['path-to-server'] != "undefined" ? localStorage['path-to-server'] : "",
            project: localStorage['path-to-project'] != "undefined" ? localStorage['path-to-project'] : "",
            wadl: localStorage['path-to-wadl'] != "undefined" ? localStorage['path-to-wadl'] : ""
        };

        if($scope.paths.wadl) {
            wadlProceed();
        }


        $scope.wadlProceed = wadlProceed;
        $scope.generate = generate;
        $scope.dependencies = [];

        function generate() {
            var data = {
                wadlObject: $scope.wadlObject,
                dependencies: $scope.dependencies.filter(function(dependency) {
                    return dependency.selected
                }),
                pathToProject: $scope.paths.project
            };

            $http.post($scope.paths.server + '/generate', data).then(function() {
                ngDialog.open({ template: 'views/success.html' });
            })
        }

        function getDeendencies() {
            var dfd = $q.defer();
            $http({
                method: 'GET',
                url: 'dependencies.json'
            }).then(function (response) {
                dfd.resolve(response);
            }, function () {
                dfd.reject(null);
            });

            return dfd.promise;
        }

        function getWadlAsJson() {
            var dfd = $q.defer();
            if ($scope.paths.wadl) {
                $http({
                    method: 'GET',
                    url: $scope.paths.wadl,
                    transformResponse: function (data) {
                        // convert the data to JSON and provide
                        // it to the success function below
                        return x2js.xml_str2json(data);
                    },
                    timeout: 120
                }).then(function (response) {
                    dfd.resolve(response);
                }, function () {
                    dfd.reject(null);
                });
            } else {
                dfd.reject(null);
            }
            return dfd.promise;
        }

        function rememberPaths() {
            localStorage['path-to-server'] = $scope.paths.server;
            localStorage['path-to-project'] = $scope.paths.project;
            localStorage['path-to-wadl'] = $scope.paths.wadl;
        }

        function wadlProceed() {
            getWadlAsJson().then(function (response) {
                    if (response.data) {
                        $scope.wadlObject = response.data.application.resources;
                        $scope.wadlObjectString = JSON.stringify(response.data.application.resources);
                    }
                })
                .catch(function (error) {
                    alert(error.data);
                });
            rememberPaths();
        }

    });
