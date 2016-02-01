angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.services.link',
  'bulbs.clickventure.edit.node.container',
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
          '$scope', 'ClickventureEditLink',
          function ($scope, ClickventureEditLink) {
            $scope.addLink = ClickventureEditLink.addLink;
            $scope.linkStyles = ClickventureEditLink.getValidLinkStyles();
            $scope.reorderLink = ClickventureEditLink.reorderLink;
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
