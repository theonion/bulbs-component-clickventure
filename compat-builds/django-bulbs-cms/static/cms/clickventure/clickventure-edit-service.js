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

      var setNodeViewData = function (node, preset) {
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

      var reindexNodes = function () {
        data.nodes
          .forEach(function (node, i) {
            data.view[node.id].order = i + 1;
          });

        return data.nodes;
      };

      var getNextNodeId = function () {
        return Math.max.apply(
          null,
          data.nodes.map(function (node) {
            return node.id;
          })
        ) + 1;
      };

      this.getData = function () {
        return data;
      };

      this.setNodes = function (nodes) {
        data.nodes = nodes;

        data.view = {};
        data.nodes.forEach(function (node, i) {
          // 1-based index for readability
          setNodeViewData(node, {order: i + 1});
        });

        this.selectNode(nodes[0]);

        return reindexNodes();
      };

      this.addNode = function () {
        var node = {
          id: getNextNodeId(),
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

        setNodeViewData(node);

        this.selectNode(node);

        return reindexNodes();
      };

      this.reorderNode = function (indexFrom, indexTo) {
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

        return reindexNodes();
      };

      this.registerSelectNodeHandler = function (func) {
        handlers.select.push(func);
      };

      this.selectNode = function (node) {
        Object.keys(data.view).forEach(function (id) {
          data.view[id].active = node.id === parseInt(id, 10);
        });

        handlers.select.forEach(function (func) {
          func(node);
        });
      };

      this.cloneNode = function (node) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
      };

      this.deleteNdoe = function (node) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
      };

      this.addEmptyLink = function (node) {
        // TODO : fill in
        throw new Error('Not implemented yet.');
      };
    }
  ]);
