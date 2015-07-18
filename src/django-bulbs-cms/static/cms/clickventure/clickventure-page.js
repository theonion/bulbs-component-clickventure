'use strict';

angular.module('bulbsCmsApp')
  .directive('clickventure', function (routes) {
    return {
      restrict: 'E',
      templateUrl: 'clickventure/clickventure.html',
      scope: {
        article: '=',
        saveArticleDeferred: '='
      },
      controller: 'ClickventureEditCtrl'
    };
  });
