angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.configPages.service',
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
          configPageKey: '@',
          onConfigPageRender: '&',
          node: '='
        },
        controller: [
          '$scope', '$timeout', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($scope, $timeout, ClickventureEdit, ClickventureEditConfigPages) {
            $scope.configPage = ClickventureEditConfigPages.getConfigPage($scope.configPageKey);

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
                $scope.node,
                $scope.configPageKey,
                $scope.selectedStatus
              )
            };
          }
        ]
      };
    }
  ]);
