angular.module('bulbs.clickventure.edit.validator.service', [
  'bulbs.clickventure.edit.services.node',
])
  .service('ClickventureEditValidator', [
    '$filter', 'ClickventureEdit',
    function ($filter, ClickventureEdit) {

      var checkForDuplicateNodeIds = function (nodes) {
        var visited = {};
        var duplicates = {};
        var dupes = false;
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

      var validateLinks = function (nodes) {
        // make sure all links are good to go
        var invalidNode = null;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var numBad = _.size(_.reject(node.links, 'to_node'));
          if (numBad > 0) {
            invalidNode = node;
            break;
          }
        }
        if (invalidNode) {
          ClickventureEdit.selectNode(invalidNode);
          alert('A link has no target page');
        }
        return !invalidNode;
      };

      var validateNoOrphanedPages = function (nodes) {
        // ensure there's no pages which cannot be reached
        // from a start page
        var chain = _.chain(nodes);
        var visited = chain.filter('start').pluck('id').value();
        var notVisited = chain.reject('start').pluck('id').value();
        var linksById = chain.transform(function (result, node) {
          result[node.id] = _.pluck(node.links, 'to_node');
        }, {}).value();
        // check it out
        var result = floodfillPageGraph(visited, notVisited, linksById);
        // display an error if there are unreachable pages
        var unreachables = result.unreachable;
        if (_.size(unreachables) > 0) {
          var node = chain.find({id: _.first(unreachables)}).value();
          ClickventureEdit.selectNode(node);
          alert('Unreachable from start: ' + $filter('clickventure_node_name')(node));
          return false;
        }
        return true;
      };

      var validateAllCanFinish = function (nodes) {
        // ensure all pages can eventually reach a finish
        var chain = _.chain(nodes);
        var visited = chain.filter('finish').pluck('id').value();
        var notVisited = chain.reject('finish').pluck('id').value();
        var linksById = chain.transform(function (result, node) {
          result[node.id] = [];
        }, {}).value();
        linksById = chain.transform(function (result, node) {
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
          var node = chain.find({id: _.first(unreachables)}).value();
          ClickventureEdit.selectNode(node);
          alert('No path to finish: ' + $filter('clickventure_node_name')(node));
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

      return {
        validateGraph: function (nodes) {
          if (checkForDuplicateNodeIds(nodes) &&
              validateLinks(nodes) &&
              validateNoOrphanedPages(nodes) &&
              validateAllCanFinish(nodes)) {
             alert('Looks great! The pages are fully linked.');
          }
        }
      };
    }
  ]);
