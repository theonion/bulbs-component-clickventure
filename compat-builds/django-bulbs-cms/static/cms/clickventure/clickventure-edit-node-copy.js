'use strict';

angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeCopy', function () {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
      require: '^clickventureEditNode',
      scope: {
        node: '='
      },
      controller: [
        '$scope', 'ClickventureEdit',
        function ($scope, ClickventureEdit) {

          ClickventureEdit.registerConfigPage('Copy');

          $scope.addLink = ClickventureEdit.addLink;
          $scope.data = ClickventureEdit.getData();
          $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
          $scope.reorderLink = ClickventureEdit.reorderLink;
        }
      ]
    };
  });
