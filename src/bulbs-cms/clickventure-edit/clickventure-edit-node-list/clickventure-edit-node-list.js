'use strict';

angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {
          nodes: '='
        },
        require: '^clickventureEdit'
      };
    }
  ]);
