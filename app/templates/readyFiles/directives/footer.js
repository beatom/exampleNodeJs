'use strict';

/**
 * @ngdoc directive
 * @name app.directive:footer
 * @description
 * # footer
 */
angular.module('app')
  .directive('footer', function () {
    return {
      templateUrl: './views/directives/footer.html',
      restrict: 'E',
      replace: true
    };
  });
