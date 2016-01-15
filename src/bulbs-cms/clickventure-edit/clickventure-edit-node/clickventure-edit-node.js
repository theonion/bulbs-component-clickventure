angular.module('bulbs.clickventure.edit.node', [
  'bulbs.clickventure.edit.node.copy',
  'bulbs.clickventure.edit.node.settings'
])
  .directive('clickventureEditNode', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node.html',
        scope: {
          node: '='
        },
        require: '^clickventureEdit'
      };
    }
  ]);
