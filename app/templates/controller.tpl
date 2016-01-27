'use strict';

/**
* @ngdoc function
* @name app.controller:<controllerName>Ctrl
* @description
* # <controllerName>
* Controller of the app
*/
angular.module('app')
    .controller('<controllerName>Ctrl', function ($scope, <serviceName>Data, <serviceName>Service, $q, $routeParams, $location) {
        $scope.item = null;
        function fundById(array, id) {
            var result = null;
            array.forEach(function(val) {
                if(val.id == id) result = val;
            });
            return result;
        }

        if($routeParams.id)
            $scope.item = fundById(<serviceName>Data, $routeParams.id);

        $scope.getTypeOf = function(val) {
            return typeof val;
        }

        var columns = [],
            itemActions = [],
            pageInfo = {

            recordsTotal: <serviceName>Data.length,
            recordsDisplay: 0
        }

        angular.forEach(<serviceName>Data[0], function(field, name) {
            if(typeof field != 'object')
                columns.push(
                  {field: name, title: name}
                )
        });

        function getRecordsTotal() {
            return <serviceName>Data.length;
        }

        function getRecordsDisplay() {
            return <serviceName>Data.length;
        }

        function getDataForLister(query) {
            var data = <serviceName>Data.slice(query.start, query.length + query.start),
                order = query.order[0];

                console.log(order.column, columns[order.column])
            data = data.sort(function(a, b) {
                return (
                    order.dir == 'asc' ? (a[columns[order.column].field] - b[columns[order.column].field]) :
                        (b[columns[order.column].field] - a[columns[order.column].field])
                )

            });

            return data;
        }

        $scope.canChange = function() {
            return !!<serviceName>Service.change;
        };

        $scope.canRemove = function() {
            return !!<serviceName>Service.remove;
        };


        $scope.change = function() {
            var data = JSON.parse(JSON.stringify($scope.item));
            delete data.id;
            if($scope.canChange())
                <serviceName>Service.change($scope.item.id, data);
        };

        if($scope.canRemove()) {
            itemActions.push(
                 {
                     title: 'Delete',
                     icon: 'fa-trash',
                     action: function(rowData) {
                         if($scope.canRemove())
                             <serviceName>Service.remove(rowData.id);
                     }
                 }
            )
        }

        if($scope.canChange()) {
            console.log("can change", <serviceName>Service.change);
            itemActions.push(
                 {
                     title: 'Edit',
                     icon: 'fa-pencil-square-o',
                     action: function(rowData) {
                         $location.path($location.path() + '/' + rowData.id);
                     }
                 }
            )
        }

        $scope.listerConf = {
                    onClickRow: function(data) {
                        $location.path($location.path() + '/' + data.id);
                    },
                    dataSource: function(query, cb) {
                        cb(getDataForLister(query));
                    },
                    itemActions: itemActions,
                    recordsDisplay: getRecordsDisplay(),
                    recordsTotal: getRecordsTotal(),
                    columns: columns,
                    filters: [
                        {
                            name: 'search',
                            type: 'text',
                            label: 'Search'
                        }
                    ]
                };
});