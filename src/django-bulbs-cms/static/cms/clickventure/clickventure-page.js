'use strict';

angular.module('bulbsCmsApp')
  .directive('clickventure', function (routes) {
    return {
      restrict: 'E',
      templateUrl: 'clickventure/clickventure-page.html',
      scope: {
        article: '=',
        saveArticleDeferred: '='
      },
      controller: 'ClickventureEditCtrl'
    };
  });
