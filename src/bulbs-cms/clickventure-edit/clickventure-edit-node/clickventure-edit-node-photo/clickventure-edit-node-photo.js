angular.module('bulbs.clickventure.edit.node.photo', [
  'bulbs.clickventure.edit.node.container'
])
  .directive('clickventureEditNodePhoto', function () {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-node/clickventure-edit-node-photo/clickventure-edit-node-photo.html',
      require: '^clickventureEdit',
      scope: {
        node: '='
      },
      controller: [
        '$scope',
        function ($scope) {
          $scope.configPageTitle = 'Photo';
        }
      ]
    };
  });
