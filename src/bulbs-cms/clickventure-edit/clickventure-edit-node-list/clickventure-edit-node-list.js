'use strict';

angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {},
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit', 'Utils',
          function ($scope, ClickventureEdit, Utils) {
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();
          }
        ]
      };
    }
  ]);
