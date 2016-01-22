angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.icon.error'
])
  .directive('clickventureEditNodeCopy', [
    '$window', 'ClickventureEdit',
    function ($window, ClickventureEdit) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$scope',
          function ($scope) {
            $scope.configPageTitle = 'Copy';

            $scope.addLink = ClickventureEdit.addLink;
            $scope.data = ClickventureEdit.getData();
            $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
            $scope.reorderLink = ClickventureEdit.reorderLink;
          }
        ],
        link: function (scope, elements) {
          scope.onConfigPageActive = function () {
            $window.picturefill(elements[0]);
          };
        }
      };
    }
  ]);
