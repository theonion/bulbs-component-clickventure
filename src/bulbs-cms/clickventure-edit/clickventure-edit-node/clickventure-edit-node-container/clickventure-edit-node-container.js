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
          '$rootScope', '$scope', '$timeout', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($rootScope, $scope, $timeout, ClickventureEdit, ClickventureEditConfigPages) {
            $scope.configPage = ClickventureEditConfigPages.getConfigPage($scope.configPageKey);
            $scope.nodeData = ClickventureEdit.getData();
            $scope.selectedStatus = '';

            $scope.getActiveConfigPage = ClickventureEditConfigPages.getActiveConfigPage;

            var configPageRender = function () {
              $scope.selectedStatus = $scope.nodeData.nodeActive.statuses[$scope.configPageKey];
              $scope.onConfigPageRender();
            };

            ClickventureEditConfigPages.registerConfigPageChangeHandler(
              $timeout.bind(null, function () {
                if (ClickventureEditConfigPages.getActiveConfigPage() === $scope.configPage) {
                  configPageRender();
                }
              })
            );

            ClickventureEdit.registerSelectNodeHandler(
              $timeout.bind(null, configPageRender)
            );

            $scope.selectedStatus = $scope.nodeData.nodeActive &&
              $scope.nodeData.nodeActive.statuses[$scope.configPageKey];
            $scope.setActiveNodeStatus = function () {
              ClickventureEditConfigPages.setNodeStatus(
                $scope.nodeData.nodeActive,
                $scope.selectedStatus || $scope.getActiveConfigPage().statuses[0]
              )
              $rootScope.$emit('bulbs.clickventure.edit.nodeList.searchNodes');
            };
          }
        ]
      };
    }
  ]);
