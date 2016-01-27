angular.module('codeGeneratorApp')
    .directive('ngTrustedModel',
        function () {
            return {
                restrict: 'A',
                scope: {
                    ngTrustedModel: "="
                },

                link: function(scope, element, attrs) {
                    element[0].addEventListener('keyup', function(evt) {
                        scope.ngTrustedModel = element[0].value;
                    })
                }
            }
        }
    );