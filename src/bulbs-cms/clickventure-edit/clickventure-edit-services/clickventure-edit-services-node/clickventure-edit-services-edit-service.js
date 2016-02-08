angular.module('bulbs.clickventure.edit.services.edit', [
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.services.node.service',
  'bulbs.clickventure.edit.services.node.link.service',
  'lodash'
])
  .service('ClickventureEdit', [
    '_', '$filter', 'ClickventureEditNode', 'ClickventureEditNodeLink',
    function (_, $filter, ClickventureEditNode, ClickventureEditNodeLink) {

      var data = {
        nodeActive: null,
        nodes: [],
        view: {}
      };

      var handlers = {
        select: []
      };

      var _setNodeViewData = function (node) {
        var viewData;

        data.view[node.id] = {
          node: node,
          order: Math.max.apply(null, data.nodes.map(function (node) {
              if (node.id in data.view) {
                return data.view[node.id].order;
              }
            })) + 1,
          inboundLinks: []
        };

        return viewData;
      };

      var _reindexNodes = function () {
        data.nodes
          .forEach(function (node, i) {
            data.view[node.id].order = i + 1;
          });

        return data.nodes;
      };

      var _getNextNodeId = function () {
        var lastId = 0;

        if (data.nodes.length > 0) {
          lastId = Math.max.apply(
            null,
            data.nodes.map(function (node) {
              return node.id;
            })
          );
        }

        return lastId + 1;
      };

      var methods = {};
      var method = function (name, func) {
        methods[name] = func.bind(methods);
      };

      method('addNode', function () {
        var node = ClickventureEditNode.prepOrCreate({
          id: _getNextNodeId(),
          start: data.nodes.length === 0
        });

        var activeNodeIndex = data.nodes.indexOf(data.nodeActive);
        if (activeNodeIndex >= 0) {
          data.nodes.splice(activeNodeIndex + 1, 0, node);
        } else {
          data.nodes.push(node);
        }

        _setNodeViewData(node);
        _reindexNodes();

        return node;
      });

      method('addAndSelectNode', function () {
        return this.selectNode(this.addNode());
      });

      method('updateInboundLinks', function (link) {
        if (typeof link.to_node === 'number') {
          var links = data.view[link.to_node].inboundLinks;

          if (links.indexOf(link.from_node) < 0) {
            links.push(link.from_node);
          }
        }
      });

      method('getData', function () {
        return data;
      });

      method('setNodes', function (nodes) {
        data.nodes = nodes;
        data.view = {};

        var newActiveNode = null;
        if (nodes.length < 1) {
          // ensure there's at least one node
          this.addAndSelectNode();
        } else {
          data.nodes.forEach(function (node, i) {
            var modNode = ClickventureEditNode.prepOrCreate(node);

            // 1-based index for readability
            _setNodeViewData(modNode);

            if (i === 0 && data.nodeActive === null ||
                newActiveNode === null && data.nodeActive.id === modNode.id) {
              newActiveNode = modNode;
            }
          });

          // setup inboundLinks
          var _this = this;
          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              if (data.view[link.to_node]) {
                _this.updateInboundLinks(link);
              } else {
                link.to_node = null;
              }
            });
          });

          this.selectNode(newActiveNode);
        }

        return _reindexNodes();
      });

      method('reorderNode', function (indexFrom, indexTo) {
        var node = data.nodes[indexFrom];

        if (typeof indexTo !== 'number' ||
            indexTo < 0 ||
            indexTo >= data.nodes.length) {
          // don't move it if an invalid index was given
          data.view[node.id].order = indexFrom + 1;
          return data.nodes;
        }

        data.nodes.splice(indexFrom, 1);
        data.nodes.splice(indexTo, 0, node);

        return _reindexNodes();
      });

      method('registerSelectNodeHandler', function (func) {
        handlers.select.push(func);
      });

      method('selectNode', function (node) {
        data.nodeActive = node;

        handlers.select.forEach(function (func) {
          func(node);
        });

        return node;
      });

      method('cloneNode', function (node) {
        var clonedNode = this.addAndSelectNode();

        _.assign(
          clonedNode,
          _.omit(node, [
            'id',
            'links',
            'statuses',
            'sister_pages',
            'title'
          ])
        );

        clonedNode.title = 'Clone - ' + $filter('clickventure_node_name')(node);

        // so we don't modify the original page's links
        var _this = this;
        clonedNode.links = node.links.map(function (link) {
          var newLink = ClickventureEditNodeLink.prepOrCreate(_.clone(link));

          newLink.from_node = clonedNode.id;
          _this.updateInboundLinks(newLink);

          return newLink;
        });

        clonedNode.statuses = _.clone(node.statuses);

        // this node gets the current list of siblings (which doesn't include itself)
        clonedNode.sister_pages = _.clone(node.sister_pages);

        // tell each sister that they have a new sibling
        node.sister_pages.forEach(function (sisterId) {
          var sister = data.view[sisterId].node;

          if (!_.isArray(sister.sister_pages)) {
            sister.sister_pages = [];
          }

          sister.sister_pages.push(clonedNode.id);
        });

        // tell the new siblings about eachother
        clonedNode.sister_pages.push(node.id);
        node.sister_pages.push(clonedNode.id);

        return clonedNode;
      });

      method('deleteNode', function (rmNode) {
        var i = data.nodes.indexOf(rmNode);

        if (i >= 0) {
          data.nodes.splice(i, 1);
          delete data.view[rmNode.id];

          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              if (typeof link.to_node === 'number' && link.to_node === rmNode.id) {
                link.to_node = null;
              }
            });

            node.sister_pages = _.without(node.sister_pages, rmNode.id);
            data.view[node.id].inboundLinks = _.without(data.view[node.id].inboundLinks, rmNode.id);
          });
        }

        if (data.nodes.length < 1) {
          // ensure there's at least 1 node
          this.addAndSelectNode();
        }

        var nextNodeId = i - 1;
        if (nextNodeId < 0) {
          nextNodeId = 0;
        }

        this.selectNode(data.nodes[nextNodeId]);

        return _reindexNodes();
      });

      method('getValidLinkStyles', function () {
        return [
          '',
          'Action',
          'Dialogue',
          'Music',
          'Quiz'
        ];
      });

      method('addLink', function (node) {
        var link = ClickventureEditNodeLink.prepOrCreate({
          from_node: node.id,
          link_style: node.link_style
        });

        node.links.push(link);

        return link;
      });

      method('reorderLink', function (node, indexFrom, indexTo) {
        if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
          var link = node.links[indexFrom];
          node.links.splice(indexFrom, 1);
          node.links.splice(indexTo, 0, link);
        }
      });

      method('deleteLink', function (node, rmLink) {
        var indexLinks = node.links.indexOf(rmLink);
        var toNode = rmLink.to_node;

        node.links.splice(indexLinks, 1);

        var hasAnotherLinkToNode = typeof node.links.find(function (link) {
          return link.to_node === toNode;
        }) !== 'undefined';

        if (typeof toNode === 'number' && !hasAnotherLinkToNode) {
          var linksInbound = data.view[toNode].inboundLinks;
          var indexInbound = linksInbound.indexOf(rmLink.from_node);
          linksInbound.splice(indexInbound, 1);
        }
      });

      return methods;
    }
  ]);
