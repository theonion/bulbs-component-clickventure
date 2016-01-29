angular.module('bulbs.clickventure.edit.nodeToolbar', [
  'bulbs.clickventure.edit.configPages.service',
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
          '$scope', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($scope, ClickventureEdit, ClickventureEditConfigPages) {

            $scope.nodeData = ClickventureEdit.getData();
            $scope.changeConfigPage = ClickventureEditConfigPages.changeConfigPage;

            $scope.getActiveConfigPage = ClickventureEditConfigPages.getActiveConfigPage;
            $scope.configPages = ClickventureEditConfigPages.getOrderedConfigPages();
          }
        ],
      };
    }
  ]);
