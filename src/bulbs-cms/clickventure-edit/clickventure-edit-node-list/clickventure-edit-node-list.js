angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.validator.service'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {},
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit', 'ClickventureEditValidator',
          function ($scope, ClickventureEdit, ClickventureEditValidator) {
            $scope.addNode = ClickventureEdit.addNode;
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();

            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph(ClickventureEdit.getData().nodes);
            };
          }
        ]
      };
    }
  ]);
