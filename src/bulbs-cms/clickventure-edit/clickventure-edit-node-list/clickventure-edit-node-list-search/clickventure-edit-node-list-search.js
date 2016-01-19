angular.module('bulbs.clickventure.edit.nodeList.search', [
  'autocompleteBasic',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeListSearch', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list-search/clickventure-edit-node-list-search.html',
        require: '^clickventureEditNodeList',
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();

            $scope.search = function (searchTerm) {
              console.log('searching', searchTerm);
            };
          }
        ]
      };
    }
  ]);
