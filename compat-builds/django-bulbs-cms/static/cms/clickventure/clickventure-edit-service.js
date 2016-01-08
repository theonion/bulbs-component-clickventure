'use strict';

angular.module('bulbs.clickventure.edit.service', [])
  .service('ClickventureEdit', [
    function () {

      var data = {
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
          order: settings.order ||
            Math.max.apply(null, data.nodes.map(function (node) {
              if (node.id in data.view) {
                return data.view[node.id].order;
              }
            })) + 1,
          active: settings.active || false
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
        return Math.max.apply(
          null,
          data.nodes.map(function (node) {
            return node.id;
          })
        ) + 1;
      };

      var setNodes = function (nodes) {
        data.nodes = nodes;

        data.view = {};
        data.nodes.forEach(function (node, i) {
          // 1-based index for readability
          _setNodeViewData(node, {order: i + 1});
        });

        selectNode(nodes[0]);

        return _reindexNodes();
      };

      var addNode = function () {
        var node = {
          id: _getNextNodeId(),
          title: '',
          body: '',
          link_style: 'action',
          links: [],
          start: data.nodes.length === 0,
          finish: false,
          shareable: false,
          share_text: ''
        };
        data.nodes.push(node);

        _setNodeViewData(node);

        selectNode(node);

        return _reindexNodes();
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
      };

      var cloneNode = function (node) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
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
          });
        }

        selectNode(data.nodes[i - 1]);

        return _reindexNodes();
      };

      var addEmptyLink = function (node) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
      };

      return {
        getData: function () {
          return data;
        },
        setNodes: setNodes,
        addNode: addNode,
        reorderNode: reorderNode,
        registerSelectNodeHandler: registerSelectNodeHandler,
        selectNode: selectNode,
        cloneNode: cloneNode,
        deleteNode: deleteNode,
        addEmptyLink: addEmptyLink
      };
    }
  ]);
