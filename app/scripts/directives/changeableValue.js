angular.module('codeGeneratorApp')
    .directive('changeableValue',
        function () {
            return {
                restrict: 'E',
                templateUrl: "/views/directives/changeableValue.html",
                scope: {
                    value: "="
                },
                link: function(scope, element, attrs) {
                    scope.title = attrs.title;
                    scope.expanded = false;
                }
            }
        }
    );

