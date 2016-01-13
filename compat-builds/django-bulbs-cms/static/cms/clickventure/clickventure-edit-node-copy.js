
'use strict';

angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.service',
  'ui.bootstrap.tooltip'
])
  .directive('clickventureEditNodeCopy', [
    '$timeout', '$window', 'ClickventureEdit',
    function ($timeout, $window, ClickventureEdit) {
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

            ClickventureEdit.registerConfigPage($scope.configPageTitle);

            $scope.addLink = ClickventureEdit.addLink;
            $scope.data = ClickventureEdit.getData();
            $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
            $scope.reorderLink = ClickventureEdit.reorderLink;
          }
        ],
        link: function (scope, elements) {

          scope.$watch('data.configPageActive', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal === scope.configPageTitle) {
              $timeout(function () {
                $window.picturefill(elements[0]);
              });
            }
          });

          scope.$watch('data.nodeActive', function (newVal, oldVal) {
            if (newVal !== oldVal) {
              $timeout(function () {
                $window.picturefill(elements[0]);
              });
            }
          });
        }
      };
    }
  ]);
