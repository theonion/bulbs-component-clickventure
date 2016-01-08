'use strict';

angular.module('bulbs.clickventure.edit', [
  'jquery',
  'lodash',
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.service'
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
          '_', '$', '$scope', '$window', '$timeout', 'ClickventureEdit',
          function (_, $, $scope, $window, $timeout, ClickventureEdit) {

            $scope.$watch('article', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal.nodes);
            });

            $scope.addNode = ClickventureEdit.addNode;

            ClickventureEdit.registerSelectNodeHandler(function (node) {
              $scope.selectedNode = node;
              $scope.isEditing = !!node;
// TODO : this looks bad?
              // terrible code alarm
              if ($scope.isEditing) {
                $timeout(function () {
                  $window.picturefill($('.clickventure-node')[0]);
                });
              }
            });


// >>>>>>> OLD

// TODO : wtf is this variable?
            $scope.isEditing = false;

            $scope.linkStyles = [
              '',
              'Action',
              'Dialogue',
              'Music',
              'Quiz'
            ];

            $scope.nodeTransitions = [
              'default',
              'slideLeft',
              'slideRight',
              'slideUp',
              'slideDown',
              'flipLeft'
            ];


            $scope.onDeleteNode = function (objList, obj) {
              var idx = objList.indexOf(obj);
              if (idx >= 0) {
                objList.splice(idx, 1);
                if ($scope.selectedNode && obj.id == $scope.selectedNode.id) {
                  $scope.selectNode(null);
                }
                updateLinksForMissingNodes();
              }
            };
            $scope.onCloneNode = function (obj) {
              $scope.onAddNode();
              var selected = $scope.selectedNode;
              var selectedId = selected.id;  // save for later
              angular.copy(obj, selected);
              selected.id = selectedId; // well, now
              selected.title = 'Clone ' + selected.title;
            };

            $scope.validatePages = function () {
              if (checkForDuplicateNodeIds() &&
                  validateLinks() &&
                  validateNoOrphanedPages() &&
                  validateAllCanFinish()) {
                 alert('Looks great! The pages are fully linked.');
              }
            };
            function floodfillPageGraph(queue, notVisited, linksById) {
              // breadth-first search the page graph
              var visited = _.clone(queue);
              while (queue.length > 0) {
                var nodeId = queue.pop();
                var links = linksById[nodeId];
                if (links) {
                  for (var i = 0; i < links.length; i++) {
                    var toNodeId = links[i];
                    if (!_.contains(visited, toNodeId)) {
                      visited.push(toNodeId);
                      queue.push(toNodeId);
                      _.remove(notVisited, function (val) { return val == toNodeId; });
                    }
                  }
                }
              }

              return {
                reachable: visited,
                unreachable: notVisited
              };
            }
            function validateLinks() {
              // make sure all links are good to go
              var invalidNode = null;
              var nodes = $scope.article.nodes;
              for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var numBad = _.size(_.reject(node.links, 'to_node'));
                if (numBad > 0) {
                  invalidNode = node;
                  break;
                }
              }
              if (invalidNode) {
                $scope.selectNode(invalidNode);
                alert('A link has no target page');
              }
              return !invalidNode;
            }
            function validateNoOrphanedPages() {
              // ensure there's no pages which cannot be reached
              // from a start page
              var nodes = _.chain($scope.article.nodes);
              var visited = nodes.filter('start').pluck('id').value();
              var notVisited = nodes.reject('start').pluck('id').value();
              var linksById = nodes.transform(function (result, node) {
                result[node.id] = _.pluck(node.links, 'to_node');
              }, {}).value();
              // check it out
              var result = floodfillPageGraph(visited, notVisited, linksById);
              // display an error if there are unreachable pages
              var unreachables = result.unreachable;
              if (_.size(unreachables) > 0) {
                var node = nodes.find({id: _.first(unreachables)}).value();
                $scope.selectNode(node);
                alert('Unreachable from start: ' + node.title);
                return false;
              }
              return true;
            }
            function validateAllCanFinish() {
              // ensure all pages can eventually reach a finish
              var nodes = _.chain($scope.article.nodes);
              var visited = nodes.filter('finish').pluck('id').value();
              var notVisited = nodes.reject('finish').pluck('id').value();
              var linksById = nodes.transform(function (result, node) {
                result[node.id] = [];
              }, {}).value();
              linksById = nodes.transform(function (result, node) {
                _.forEach(node.links, function (link) {
                  var to_node = link.to_node;
                  if (to_node) {
                    var nodeLinks = result[to_node];
                    result[to_node] = _.union(nodeLinks, [node.id]);
                  }
                });
              }, linksById).value();
              // check it out
              var result = floodfillPageGraph(visited, notVisited, linksById);
              // display an error if there are unreachable pages
              var unreachables = result.unreachable;
              if (_.size(unreachables) > 0) {
                var node = nodes.find({id: _.first(unreachables)}).value();
                $scope.selectNode(node);
                alert('No path to finish: ' + node.title);
                return false;
              }
              return true;
            }

            $scope.onAddLink = function (node) {
              var link = {
                body: '',
                to_node: null,
                transition: '',
                link_style: '',
                float: false
              };
              node.links.push(link);
            };
            $scope.onDeleteObject = function (objList, obj) {
              var idx = objList.indexOf(obj);
              if (idx >= 0) {
                objList.splice(idx, 1);
              }
            };
            $scope.onMoveListObject = function (objList, startIndex, newIndex) {
              if (startIndex >= 0 && newIndex >= 0 && newIndex < objList.length) {
                var obj = objList[startIndex];
                objList.splice(startIndex, 1);
                objList.splice(newIndex, 0, obj);
              }
            };
            function updateOrderIds(objList, fieldName) {
              for (var i = 0; i < objList.length; i++) {
                objList[fieldName] = i;
              }
            }
            function updateLinksForMissingNodes() {
              var validIds = _.pluck($scope.article.nodes, 'id');
              _.forEach($scope.article.nodes, function (node) {
                _.forEach(node.links, function (link) {
                  var toNodeId = link.to_node;
                  if (!_.contains(validIds, toNodeId)) {
                    link.to_node = null;
                  }
                });
              });
            }
            function checkForDuplicateNodeIds() {
              var visited = {};
              var duplicates = {};
              var dupes = false;
              var nodes = $scope.article.nodes;
              for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (visited[node.id]) {
                  dupes = true;
                  if (!duplicates[node.id]) {
                    duplicates[node.id] = [visited[node.id]];
                  }
                  duplicates[node.id].push(node);
                }
                visited[node.id] = node;
              }
              if (dupes) {
                var msg = ['Duplicate ids found:'];
                for (var key in duplicates) {
                  var dupeList = duplicates[key];
                  msg.push('id: ' + key);
                  _.forEach(dupeList, function (d) {
                    msg.push(d.title);
                  });
                }
                alert(msg.join('\n'));
              }
              return !dupes;
            }
            // start out with a page ready to go
            if ($scope.article.nodes && $scope.article.nodes.length === 0) {
              $scope.onAddNode();
            }
          }
        ]
      };
    }
  ]);
