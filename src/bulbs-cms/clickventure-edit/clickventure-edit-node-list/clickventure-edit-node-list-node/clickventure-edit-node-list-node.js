'use strict';

angular.module('bulbs.clickventure.edit.nodeList.node', [])
  .directive('clickventureEditNodeListNode', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list-node/clickventure-edit-node-list-node.html',
        transclude: true,
        scope: {
          node: '='
        },
        require: '^clickventureEditNodeList'
      };
    }
  ]);
