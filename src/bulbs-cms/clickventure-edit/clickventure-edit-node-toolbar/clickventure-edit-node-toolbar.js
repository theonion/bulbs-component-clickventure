'use strict';

angular.module('bulbs.clickventure.edit.nodeToolbar', [
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeToolbar', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
        scope: {
          article: '='
        },
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();
            $scope.changeConfigPage = ClickventureEdit.changeConfigPage;
          }
        ],
      };
    }
  ]);
