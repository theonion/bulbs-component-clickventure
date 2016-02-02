angular.module('bulbs.clickventure.edit.node.title', [])
  .directive('clickventureEditNodeTitle', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-title/clickventure-edit-node-title.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$rootScope', '$scope',
          function ($rootScope, $scope) {
            $scope.nodeTitleChanged = function () {
              $rootScope.$emit('bulbs.clickventure.edit.nodeList.searchNodes');
            };
          }
        ]
      };
    }
  ]);
