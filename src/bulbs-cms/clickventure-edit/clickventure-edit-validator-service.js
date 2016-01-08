'use strict';

angular.module('bulbs.clickventure.edit.validator.service', [])
  .service('ClickventureEditValidator', [
    function () {

      this.validateGraph = function (nodes) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
      };








// TODO : >>>>>>>>> OLD
      $scope.validatePages = function () {
        if (checkForDuplicateNodeIds() &&
            validateLinks() &&
            validateNoOrphanedPages() &&
            validateAllCanFinish()) {
           alert('Looks great! The pages are fully linked.');
        }
      };

      var checkForDuplicateNodeIds = function () {
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
      };

      var validateLinks = function () {
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
      };

      var validateNoOrphanedPages = function () {
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
      };

      var validateAllCanFinish = function () {
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
      };

      var floodfillPageGraph = function (queue, notVisited, linksById) {
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
      };
    }
  ]);
