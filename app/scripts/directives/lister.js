(function () {
    'use strict';

    angular.module('app')
    .directive('lister', lister);

    lister.$inject = [
        '$compile', 
        '$templateRequest',
        '$templateCache',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder', 
        'DTColumnBuilder'
    ];

    function lister($compile, $templateRequest, $templateCache, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder) {
        var MENU_TPL_URL = './views/directives/lister-actions.html';

        var COLUMN_DEFAULTS = {        
            sortable: true,
            searchable: true,
            hasFilter: false,
            format: false,
            rowMenu: false
        };
        
        var menuTplPromise = $templateRequest(MENU_TPL_URL);

        return {
            templateUrl: './views/directives/lister.html',
            restrict: 'E',            
            scope: {
                conf: '='
            },
            link: {
                pre: function(scope) {

                    scope.pageInfo = {};
                    scope.dtColumns = [];
                    scope.columnFilters = [];
                    scope.filters = [];
                    scope.dtOptions = DTOptionsBuilder.newOptions();
                    scope.dtColumnDefs = [];
                    scope.dtInstance = {};
                    scope.dtLen = '10';
                    scope.menuTplReady = false;

                    /**
                     * Set general options for the Data Table instance.
                     */
                    scope.dtOptions
                        .withPaginationType('simple_numbers')                        
                        .withLanguage({
                            "oPaginate": {
                                "sNext":     "&#xE409;",
                                "sPrevious": "&#xE408;"
                            }
                        })
                        .withOption('drawCallback', dtDrawCallback)                        
                        .withOption('createdRow', createdRow)
                        .withOption('serverSide', true)
                        .withOption('ajax', fetchData)
                        // // use default DT ajax implementation temporarily 
                        // .withOption('ajax', {
                        //     url: 'http://localhost:3000/users',
                        //     dataSrc: 'data',
                        //     type: 'GET'
                        // })
                        .withDOM('tp');

                    /**
                     * Set row to be clickable.
                     */
                    if (scope.conf.onClickRow && angular.isFunction(scope.conf.onClickRow)) {
                        scope.dtOptions
                            .withOption('rowCallback', dtRowCallback);
                    }

                    /**
                     * Create DataTable configuration for each column based on 
                     * conf.columns provided to directive.
                     */
                    angular.forEach(scope.conf.columns, function(value, index) {
                        var column = DTColumnBuilder.newColumn(value.field, value.title)
                            .withOption('orderable', value.sortable)
                            .withOption('seachable', value.seachable);

                        if (value.format && angular.isFunction(value.format)) {
                            column.withOption('render', value.format);
                        }

                        scope.dtColumns.push(column);

                        if (value.hasFilter) {
                            scope.columnFilters
                                .push(angular.extend({model: ''}, value.hasFilter));

                            var filterIdx = scope.columnFilters.length - 1;

                            scope.$watch(function (scope) {
                                return scope.columnFilters[filterIdx].model;
                            }, function (newVal, oldVal) {
                                if (oldVal !== newVal) {
                                    scope.dtInstance.DataTable.columns(index).search(newVal).draw()
                                }
                            });
                        }
                    });

                    angular.forEach(scope.conf.filters, function(value, index) {
                        scope.filters.push(angular.extend({model: ''}, value));

                        scope.$watch(function (scope) {
                            return scope.filters[index].model;
                        }, function (newVal, oldVal) {
                            if (oldVal !== newVal) {
                                // This will initiate DataTables data fetch,
                                // which in turn will add filter values to query.
                                scope.dtInstance.DataTable.draw();
                            }
                        });
                    });

                    /**
                     * Set all columns center-aligned
                     */
                    scope.dtColumnDefs.push(
                        DTColumnDefBuilder.newColumnDef('_all')
                            .withOption('className', 'dt-body-center')
                    );

                    /**
                     * If list item actions are defined in conf
                     * add column for "more" menu in each row.
                     */
                    if (scope.conf.itemActions) {
                        scope.dtColumnDefs.push(
                            DTColumnDefBuilder.newColumnDef(-1)
                                .withOption('seachable', false)
                                .withOption('orderable', false)
                                .withOption('width', '30px')
                                .withOption('className', 'menu')
                                .withOption('title', '')
                                .withOption('render', menuColumnRender)
                        );

                        scope.dtColumns.push(
                            DTColumnBuilder.newColumn('menu').withTitle('')
                        );
                    }

                    /**
                     * Gets called after table row html element is crated.
                     * Exposes current scope to item actions template.
                     */
                    function createdRow(row, data, dataIndex) {
                        var rowScope = scope.$new(false);
                        rowScope.data = data;
                        $compile(angular.element(row))(rowScope);
                        scope.$apply();
                    }

                    /**
                     * Gets called after page is changed.
                     * Updates custom table paging info widget.
                     */
                    function dtDrawCallback() {
                        var api = this.api();
                        scope.pageInfo = api.page.info();
                    }

                    /**
                     * Row click callback.
                     */
                    function dtRowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        angular.element('td', nRow).unbind('click');
                        angular.element('td', nRow).bind('click', function() {
                            scope.$apply(function() {
                                scope.conf.onClickRow(aData);
                            });
                        });
                        return nRow;
                    }

                    /**
                     * Custom renderer for item actions column.
                     * Uses lister-actions template to populate column contents.
                     */
                    function menuColumnRender(data, type, full, meta) {
                        return $templateCache.get(MENU_TPL_URL) || '';
                    }

                    /**
                     * Implementation of data fetching logic.
                     * Normalizes dataTables query to the format acceptable by API.
                     * Calls data fetching logic provided in conf.
                     */
                    function fetchData(data, callback, settings) {
                        var normQuery = {};
                        var orderCol = parseInt(data.order.column, 10);

                        normQuery['columns'] = data.columns;

                        angular.forEach(data.columns, function(value, index) {
                            
                        })

                        if (!isNaN(orderCol)) {
                            normQuery['order'] = {
                                column: data.columns[orderCol].data,
                                dir: data.order.dir
                            }
                        }

                        normQuery['search'] = {};

                        angular.forEach(scope.filters, function(value, index) {
                            if (value.model && value.model !== '__all') {
                                normQuery.search[value.name] = value.model;
                            }                            
                        });

                        scope.conf.dataSource(normQuery, callback);
                    }

                    /**
                     * Updates menuTplReady variable on the scope.
                     * This guarantees that after lister-actions template is fetched,
                     * the table will be rerendered.
                     */
                    menuTplPromise.then(function() {
                        scope.menuTplReady = true;
                    });
                },
                post: function(scope) {

                    scope.tableSearchTerm = '';

                    scope.$watch(function (scope) {
                        return scope.tableSearchTerm;
                    }, function (newVal, oldVal) {
                        if (oldVal !== newVal) {
                            scope.dtInstance.DataTable.search(newVal).draw();
                        }
                    });

                    scope.$watch(function (scope) {
                        return scope.dtLen;
                    }, function (newVal, oldVal) {                        
                        if (oldVal !== newVal) { 
                            scope.dtInstance.DataTable
                                .page.len( parseInt(newVal, 10) )
                                .draw()
                        }
                    });

                    scope.$watch(function (scope) {
                        return scope.menuTplReady;
                    }, function (newVal, oldVal) {                        
                        if (newVal === true) {
                            scope.dtInstance.DataTable.draw();
                        }
                    });
                }
            }
        }
    }    

})();