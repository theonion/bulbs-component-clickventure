angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeContainer', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
        require: '^clickventureEdit',
        transclude: true,
        scope: {
          configPageTitle: '@'
        },
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {
            ClickventureEdit.registerConfigPage($scope.configPageTitle);

            $scope.data = ClickventureEdit.getData();
          }
        ]
      };
    }
  ]);
