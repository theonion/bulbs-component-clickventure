'use strict';

angular.module('bulbs.clickventure.edit.link', [])
  .directive('clickventureEditLink', function (routes) {
    return {
      restrict: 'E',
      templateUrl: '/cms/partials/clickventure/clickventure-edit-link.html',
      scope: false,
      require: '^clickventureNode'
    };
  });
