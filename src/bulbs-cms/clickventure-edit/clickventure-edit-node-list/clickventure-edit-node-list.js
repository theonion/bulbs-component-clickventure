'use strict';

angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {
          nodes: '=',
          onSelectNode: '&'
        },
        require: '^clickventureEdit',
        controller: [
          '$scope', 'Utils',
          function ($scope, Utils) {

            $scope.nodeViewData = $scope.nodes.reduce(function (data, node, i) {
              data[node.id] = {
                // 1-based index for readability
                order: i + 1,
                active: false
              };

              return data;
            }, {});

            var reindexNodes = function () {
              return $scope.nodes
                .forEach(function (node, i) {
                  $scope.nodeViewData[node.id].order = i + 1;
                });
            };

            $scope.reorderNode = function (indexFrom, indexTo) {
              var node = $scope.nodes[indexFrom];

              if (typeof(indexTo) !== 'number' ||
                  indexTo < 0 ||
                  indexTo >= $scope.nodes.length) {
                // don't move it if an invalid index was given
                $scope.nodeViewData[node.id].order = indexFrom + 1;
                return;
              }

              $scope.nodes.splice(indexFrom, 1);
              $scope.nodes.splice(indexTo, 0, node);

              reindexNodes();
            };

            $scope.selectNode = function (node) {
              Object.keys($scope.nodeViewData).forEach(function (id) {
                $scope.nodeViewData[id].active = node.id === parseInt(id, 10);
              });

              $scope.onSelectNode({node: node});
            };

            reindexNodes();
          }
        ]
      };
    }
  ]);
