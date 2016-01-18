angular.module('bulbs.clickventure.edit.node.photo', [
  'bettyEditable',
  'bulbs.clickventure.edit.node.container',
  'uuid4'
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
        '$scope', 'uuid4',
        function ($scope, uuid4) {
          $scope.configPageTitle = 'Photo';
          $scope.uuid = uuid4.generate();
        }
      ]
    };
  });
