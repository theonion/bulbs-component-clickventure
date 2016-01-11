'use strict';

angular.module('bulbs.clickventure.edit.service', [
  'lodash'
])
  .service('ClickventureEdit', [
    '_', '$filter',
    function (_, $filter) {

      var data = {
        configPageActive: '',
        configPages: [],
        nodes: [],
        view: {}
      };

      var handlers = {
        configPageChange: [],
        select: []
      };

      var _setNodeViewData = function (node, preset) {
        var viewData;
        var settings = preset || {};

        data.view[node.id] = {
          node: node,
          order: settings.order ||
            Math.max.apply(null, data.nodes.map(function (node) {
              if (node.id in data.view) {
                return data.view[node.id].order;
              }
            })) + 1,
          active: settings.active || false,
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

      var setNodes = function (nodes) {
        if (!_.isArray(nodes)) {
          nodes = [];
        }

        data.nodes = nodes;
        data.view = {};

        if (nodes.length < 1) {
          // ensure there's at least one node
          addNode();
        } else {
          data.nodes.forEach(function (node, i) {
            // some cleanup to ensure old nodes are in a good state
            node.links.forEach(function (link) {
              link.from_node = node.id;
            });

            // 1-based index for readability
            _setNodeViewData(node, {order: i + 1});
          });

          selectNode(nodes[0]);
        }

        return _reindexNodes();
      };

      var addNode = function () {
        var node = {
          id: _getNextNodeId(),
          title: '',
          body: '',
          link_style: 'action',
          links: [],
          sister_pages: [],
          start: data.nodes.length === 0,
          finish: false,
          shareable: false,
          share_text: ''
        };
        data.nodes.push(node);

        _setNodeViewData(node);
        _reindexNodes();

        return selectNode(node);
      };

      var reorderNode = function (indexFrom, indexTo) {
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
      };

      var registerSelectNodeHandler = function (func) {
        handlers.select.push(func);
      };

      var selectNode = function (node) {
        Object.keys(data.view).forEach(function (id) {
          data.view[id].active = node.id === parseInt(id, 10);
        });

        handlers.select.forEach(function (func) {
          func(node);
        });

        return node;
      };

      var cloneNode = function (node) {
        var clonedNode = addNode();

        clonedNode.title = 'Clone - ' + $filter('clickventure_node_name')(node);
        clonedNode.body = node.body;
        clonedNode.link_style = node.link_style;
        clonedNode.start = false;
        clonedNode.finish = node.finish;
        clonedNode.shareable = true;
        clonedNode.share_text = node.share_text;

        // so we don't modify the original page's links
        clonedNode.links = node.links.map(function (link) {
          return _.clone(link);
        });

        if (!_.isArray(node.sister_pages)) {
          node.sister_pages = [];
        }

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
      };

      var deleteNode = function (rmNode) {
        var i = data.nodes.indexOf(rmNode);

        if (i >= 0) {
          data.nodes.splice(i, 1);
          delete data.view[rmNode.id];

          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              if (typeof link.to_node === 'number' && link.to_node.id === rmNode.id) {
                link.to_node = null;
              }
            });

            node.sister_pages = _.without(node.sister_pages, rmNode.id);
          });
        }

        if (data.nodes.length < 1) {
          // ensure there's at least 1 node
          addNode();
        }

        var nextNodeId = i - 1;
        if (nextNodeId < 0) {
          nextNodeId = 0;
        }

        selectNode(data.nodes[nextNodeId]);

        return _reindexNodes();
      };

      var addLink = function (node) {
        var link = {
          body: '',
          from_node: node.id,
          to_node: null,
          transition: '',
          link_style: node.link_style,
          float: false
        };

        node.links.push(link);

        return link;
      };

      var updateInboundLinks = function (link) {
        data.view[link.to_node].inboundLinks.push(link.from_node);
      };

      var reorderLink = function (node, indexFrom, indexTo) {
        if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
          var link = node.links[indexFrom];
          node.links.splice(indexFrom, 1);
          node.links.splice(indexTo, 0, link);
        }
      };

      var deleteLink = function (node, rmLink) {
        var indexLinks = node.links.indexOf(rmLink);
        node.links.splice(indexLinks, 1);

        var linksInbound = data.view[rmLink.to_node].inboundLinks;
        var indexInbound = linksInbound.indexOf(rmLink.from_node);
        linksInbound.splice(indexInbound, 1);
      };

      var registerConfigPage = function (title) {
        data.configPages.push(title);

        if (data.configPageActive.length === 0) {
          data.configPageActive = title;
        }
      };

      var registerConfigPageChangeHandler = function (func) {
        handlers.configPageChange.push(func);
      };

      var changeConfigPage = function (title) {
        data.configPageActive = title;

        handlers.configPageChange.forEach(function (func) {
          func(title);
        });
      };

      return {
        getData: function () {
          return data;
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
        setNodes: setNodes,
        addNode: addNode,
        reorderNode: reorderNode,
        registerSelectNodeHandler: registerSelectNodeHandler,
        selectNode: selectNode,
        cloneNode: cloneNode,
        deleteNode: deleteNode,
        addLink: addLink,
        updateInboundLinks: updateInboundLinks,
        reorderLink: reorderLink,
        deleteLink: deleteLink,
        registerConfigPage: registerConfigPage,
        registerConfigPageChangeHandler: registerConfigPageChangeHandler,
        changeConfigPage: changeConfigPage
      };
    }
  ]);
