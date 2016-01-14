angular.module('bulbs.clickventure.edit', [
  'jquery',
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.validator.service'
])
  .directive('clickventureEdit', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit.html',
        scope: {
          article: '=',
          saveArticleDeferred: '='
        },
        controller: [
          '$scope', 'ClickventureEdit', 'ClickventureEditValidator',
          function ($scope, ClickventureEdit, ClickventureEditValidator) {

            $scope.data = ClickventureEdit.getData();

            $scope.$watch('article', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal.nodes);
            });

            $scope.addNode = ClickventureEdit.addNode;
            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph(ClickventureEdit.getData().nodes);
            };
          }
        ]
      };
    }
  ]);
