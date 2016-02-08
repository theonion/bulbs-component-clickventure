angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.node.title',
  'bulbs.clickventure.edit.icon.error'
])
  .directive('clickventureEditNodeCopy', [
    '$window',
    function ($window) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {
            $scope.addLink = ClickventureEdit.addLink;
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
