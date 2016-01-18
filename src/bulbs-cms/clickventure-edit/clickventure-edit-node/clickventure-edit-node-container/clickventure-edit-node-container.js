angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeContainer', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
        require: '^clickventureEdit',
        transclude: true,
        scope: {
          configPageTitle: '@',
          onConfigPageRender: '&'
        },
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {
            ClickventureEdit.registerConfigPage($scope.configPageTitle);

            $scope.data = ClickventureEdit.getData();
          }
        ],
        link: function (scope, elements) {
          scope.$watch(
            'data.configPageActive',
            $timeout.bind(null, function () {
              if (scope.data.configPageActive === scope.configPageTitle) {
                scope.onConfigPageRender();
              }
            })
          );

          scope.$watch(
            'data.nodeActive',
            $timeout.bind(null, function () {
              scope.onConfigPageRender();
            })
          );
        }
      };
    }
  ]);
