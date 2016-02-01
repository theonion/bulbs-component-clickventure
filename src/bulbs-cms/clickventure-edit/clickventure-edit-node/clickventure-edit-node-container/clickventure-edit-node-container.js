angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.services.node',
  'bulbs.clickventure.edit.services.configPage'
])
  .directive('clickventureEditNodeContainer', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
        require: '^clickventureEdit',
        transclude: true,
        scope: {
          configPageKey: '@',
          onConfigPageRender: '&',
        },
        controller: [
          '$scope', '$timeout', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($scope, $timeout, ClickventureEdit, ClickventureEditConfigPages) {
            $scope.configPage = ClickventureEditConfigPages.getConfigPage($scope.configPageKey);
            $scope.nodeData = ClickventureEdit.getData();

            $scope.getActiveConfigPage = ClickventureEditConfigPages.getActiveConfigPage;

            ClickventureEditConfigPages.registerConfigPageChangeHandler(
              $timeout.bind(null, function () {
                if (ClickventureEditConfigPages.getActiveConfigPage() === $scope.configPage) {
                  $scope.onConfigPageRender();
                }
              })
            );

            ClickventureEdit.registerSelectNodeHandler(
              $timeout.bind(null, function () {
                $scope.onConfigPageRender();
              })
            );

            $scope.selectedStatus = '';
            $scope.setActiveNodeStatus = function () {
              ClickventureEditConfigPages.setNodeStatus(
                $scope.nodeData.nodeActive,
                $scope.selectedStatus
              )
            };
          }
        ]
      };
    }
  ]);
