angular.module('bulbs.clickventure.edit.services.node', [
  'bulbs.clickventure.edit.services.node.factory',
  'bulbs.clickventure.edit.services.node.link.factory',
  'lodash'
])
  .service('ClickventureEdit', [
    '_', '$filter', 'ClickventureEditNode',
    function (_, $filter, ClickventureEditNode) {

      var data = {
        nodeActive: null,
        nodes: [],
        view: {}
      };

      var handlers = {
        select: []
      };

      var _setNodeViewData = function (node, preset) {
        var viewData;
        var settings = preset || {};

        data.view[node.id] = {
          node: node,
          order: settings.order ||
            (Math.max.apply(null, data.nodes.map(function (node) {
              if (node.id in data.view) {
                return data.view[node.id].order;
              }
            })) + 1),
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

      /**
       * Ensure node is up to date with newest fields.
       *
       * @param {Object} node - node to update.
       * @returns {Object} updated node.
       */
      var _updateNodeData = function (node) {
        if (_.isArray(node.links)) {
          node.links.forEach(function (link) {
            link.from_node = node.id;
          });
        } else {
          node.links = [];
        }

        if (!_.isObject(node.statuses)) {
          node.statuses = {};
        }

        if (!_.isArray(node.sister_pages)) {
          node.sister_pages = [];
        }

        return node;
      };

      var updateInboundLinks = function (link) {
        if (typeof link.to_node === 'number') {
          var links = data.view[link.to_node].inboundLinks;

          if (links.indexOf(link.from_node) < 0) {
            links.push(link.from_node);
          }
        }
      };

      var addNode = function () {
        var node = new ClickventureEditNode({
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
      };

      var addAndSelectNode = function () {
        return selectNode(addNode());
      };

      var selectNode = function (node) {
        data.nodeActive = node;

        handlers.select.forEach(function (func) {
          func(node);
        });

        return node;
      };

      return {
        addNode: addNode,
        addAndSelectNode: addAndSelectNode,
        updateInboundLinks: updateInboundLinks,
        getData: function () {
          return data;
        },
        setNodes: function (nodes) {
          if (!_.isArray(nodes)) {
            nodes = [];
          }

          data.nodes = nodes;
          data.view = {};

          var newActiveNode = null;
          if (nodes.length < 1) {
            // ensure there's at least one node
            addAndSelectNode();
          } else {
            data.nodes.forEach(function (node, i) {
              // some cleanup to ensure old nodes are in a good state
              _updateNodeData(node);

              // 1-based index for readability
              _setNodeViewData(node, {order: i + 1});

              if (i === 0 && data.nodeActive === null ||
                  newActiveNode === null && data.nodeActive.id === node.id) {
                newActiveNode = node;
              }
            });

            // setup inboundLinks
            data.nodes.forEach(function (node) {
              node.links.forEach(function (link) {
                updateInboundLinks(link);
              });
            });

            selectNode(newActiveNode);
          }

          return _reindexNodes();
        },
        reorderNode: function (indexFrom, indexTo) {
          var node = data.nodes[indexFrom];

          if (typeof(indexTo) !== 'number' ||
              indexTo < 0 ||
              indexTo >= data.nodes.length) {
            // don't move it if an invalid index was given
            data.view[node.id].order = indexFrom + 1;
            return data.nodes;
          }

          data.nodes.splice(indexFrom, 1);
          data.nodes.splice(indexTo, 0, node);

          return _reindexNodes();
        },
        registerSelectNodeHandler: function (func) {
          handlers.select.push(func);
        },
        cloneNode: function (node) {
          var clonedNode = addAndSelectNode();

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
          clonedNode.links = node.links.map(function (link) {
            var newLink = _.clone(link);

            newLink.from_node = clonedNode.id;
            updateInboundLinks(newLink);

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
        },
        deleteNode: function (rmNode) {
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
            addAndSelectNode();
          }

          var nextNodeId = i - 1;
          if (nextNodeId < 0) {
            nextNodeId = 0;
          }

          selectNode(data.nodes[nextNodeId]);

          return _reindexNodes();
        },
        getValidLinkStyles: function () {
          return [
            '',
            'Action',
            'Dialogue',
            'Music',
            'Quiz'
          ];
        },
        getValidNodeTransitions: function () {
          return [
            'default',
            'slideLeft',
            'slideRight',
            'slideUp',
            'slideDown',
            'flipLeft'
          ];
        },
        addLink: function (node) {
          var link = new ClickventureEditNodeLink({
            from_node: node.id,
            link_style: node.link_style
          });

          node.links.push(link);

          return link;
        },
        reorderLink: function (node, indexFrom, indexTo) {
          if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
            var link = node.links[indexFrom];
            node.links.splice(indexFrom, 1);
            node.links.splice(indexTo, 0, link);
          }
        },
        deleteLink: function (node, rmLink) {
          var indexLinks = node.links.indexOf(rmLink);
          node.links.splice(indexLinks, 1);

          if (typeof rmLink.to_node !== 'number') {
            var linksInbound = data.view[rmLink.to_node].inboundLinks;
            var indexInbound = linksInbound.indexOf(rmLink.from_node);
            linksInbound.splice(indexInbound, 1);
          }
        }
      };
    }
  ]);
