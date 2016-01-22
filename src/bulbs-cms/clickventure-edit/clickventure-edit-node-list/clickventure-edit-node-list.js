angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.validator.service',
  'uuid4'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {},
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit', 'ClickventureEditValidator', 'uuid4',
          function ($scope, ClickventureEdit, ClickventureEditValidator, uuid4) {
            $scope.uuid = uuid4.generate();

            $scope.addAndSelectNode = ClickventureEdit.addAndSelectNode;
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();
            $scope.nodeList = $scope.nodeData.nodes;

            $scope.searchTerm = '';

            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph(ClickventureEdit.getData().nodes);
            };

            $scope.searchNodes = function () {
              if ($scope.searchTerm.length > 0) {
                var searchTermRE = new RegExp($scope.searchTerm, 'i');

                $scope.nodeList = $scope.nodeData.nodes.filter(function (node) {
                  return !!node.title.match(searchTermRE) ||
                      !!node.body.match(searchTermRE) ||
                      node.links.filter(function (link) {
                        return link.body.match(searchTermRE);
                      }).length > 0;
                });
              } else {
                $scope.nodeList = $scope.nodeData.nodes;
              }
            };

            $scope.searchKeypress = function  (e) {
              if (e.keyCode === 27) {
                // esc, clear
                $scope.searchTerm = '';
              }

              $scope.searchNodes();
            };
          }
        ],
        link: function (scope) {
          scope.$watch('nodeData.nodes', function () {
            scope.searchNodes();
          });
        }
      };
    }
  ]);
