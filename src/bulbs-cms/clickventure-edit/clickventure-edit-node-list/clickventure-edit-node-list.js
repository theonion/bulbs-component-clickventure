angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  'bulbs.clickventure.edit.services.node',
  'bulbs.clickventure.edit.services.configPage',
  'bulbs.clickventure.edit.services.validator',
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
          '$rootScope', '$scope', 'ClickventureEdit', 'ClickventureEditConfigPages',
            'ClickventureEditValidator', 'uuid4',
          function ($rootScope, $scope, ClickventureEdit, ClickventureEditConfigPages,
              ClickventureEditValidator, uuid4) {

            $scope.uuid = uuid4.generate();

            $scope.addAndSelectNode = ClickventureEdit.addAndSelectNode;
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();
            $scope.nodeList = $scope.nodeData.nodes;

            $scope.configPages = ClickventureEditConfigPages.getOrderedConfigPages();

            $scope.searchTerm = '';

            $scope.completeFilter = 'Complete';
            $scope.incompleteFilter = 'Incomplete';
            $scope.selectedFilter = '';

            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph($scope.nodeData.nodes);
            };

            $scope.searchNodes = function () {
              if ($scope.searchTerm || $scope.selectedFilter) {
                var searchTermRE = new RegExp($scope.searchTerm || '.*', 'i');

                $scope.nodeList = $scope.nodeData.nodes.filter(function (node) {
                  var textMatch =
                    $scope.searchTerm.length === 0 ||
                    !!node.title.match(searchTermRE) ||
                    !!node.body.match(searchTermRE) ||
                    node.links.filter(function (link) {
                      return link.body.match(searchTermRE);
                    }).length > 0;

                  var statusMatch = true;
                  if ($scope.selectedFilter === $scope.completeFilter) {
                    statusMatch = ClickventureEditConfigPages.nodeIsComplete(node);
                  } else if ($scope.selectedFilter === $scope.incompleteFilter) {
                    statusMatch = !ClickventureEditConfigPages.nodeIsComplete(node);
                  } else if ($scope.selectedFilter) {
                    statusMatch = ClickventureEditConfigPages.nodeHasStatus(
                      node,
                      $scope.selectedFilter
                    );
                  }

                  return textMatch && statusMatch;
                });
              } else {
                $scope.nodeList = $scope.nodeData.nodes;
              }
            };

            $rootScope.$on('bulbs.clickventure.edit.nodeList.searchNodes', $scope.searchNodes);

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
