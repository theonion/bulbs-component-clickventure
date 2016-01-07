'use strict';

angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  // HACK : these utils from bulbs-cms should be extracted as a dependency
  'utils'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {
          nodes: '='
        },
        require: '^clickventureEdit',
        controller: [
          '$scope', 'Utils',
          function ($scope, Utils) {

            var reindexNodes = function () {
              return $scope.nodes
                .forEach(function (node, i) {
                  node.order = i;
                });
            };

            $scope.reorderNode = function (indexFrom, indexTo) {
              if (typeof(indexTo) !== 'number') {
                indexTo = 0;
              }

              Utils.moveTo($scope.nodes, indexFrom, indexTo);

              reindexNodes();
            };

            reindexNodes();
          }
        ]
      };
    }
  ]);
