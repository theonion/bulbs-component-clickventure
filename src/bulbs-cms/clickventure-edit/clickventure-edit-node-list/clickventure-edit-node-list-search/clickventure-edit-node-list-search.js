angular.module('bulbs.clickventure.edit.nodeList.search', [
  'autocompleteBasic',
  'bulbs.clickventure.edit.service',
  'lodash'
])
  .directive('clickventureEditNodeListSearch', [
    '_',
    function (_) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list-search/clickventure-edit-node-list-search.html',
        require: '^clickventureEditNodeList',
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();
            $scope.searchTerm = '';

            $scope.search = _.debounce(function (searchTerm) {
              var searchTermRE = new RegExp(searchTerm, 'i');

              var results;
              if (searchTerm) {
                var results = data.nodes.filter(function (node) {
                  return node.title.match(searchTermRE) ||
                    node.body.match(searchTermRE) ||
                    node.links.filter(function (link) {
                      return link.body.match(searchTermRE);
                    }).length > 0;
                });
              } else {
                results = data.nodes;
              }
// TODO : make this actually filter node list
              console.log('searching', searchTerm, results.length);
            }, 250);

            $scope.searchKeypress = function  (e) {
              if (e.keyCode === 27) {
                // esc, clear
                $scope.searchTerm = '';
              }
            };
          }
        ]
      };
    }
  ]);
