'use strict';

angular.module('bulbs.clickventure.edit.nodeToolbar', [])
  .directive('clickventureEditNodeToolbar', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
        require: '^clickventureEdit'
      };
    }
  ]);
