angular.module('codeGeneratorApp')
    .directive('spoiler',
        function () {
            return {
                restrict: 'E',
                transclude: true,
                template: "<md-list ng-cloak>" +
                "<md-subheader class='md-no-sticky spoiler-head' ng-click='expanded = !expanded'" +
                " ng-bind='title'></md-subheader>" +
                "<div ng-show='expanded' ng-transclude></div></md-list>",
                link: function(scope, element, attrs) {
                    scope.title = attrs.title;
                    scope.expanded = false;
                }
            }
        }
    );