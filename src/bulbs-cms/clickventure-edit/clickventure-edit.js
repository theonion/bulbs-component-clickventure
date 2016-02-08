angular.module('bulbs.clickventure.edit', [
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.toolFixture'
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
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();

            $scope.$watch('article.nodes', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal);
            });
          }
        ]
      };
    }
  ]);
