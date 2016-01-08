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

      var reindexNodes = function () {
        data.nodes
          .forEach(function (node, i) {
            data.view[node.id].order = i + 1;
          });

        return data.nodes;
      };

      var getNextNodeId = function () {
        return Math.max.call(
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

        data.view = data.nodes.reduce(function (data, node, i) {
          data[node.id] = {
            // 1-based index for readability
            order: i + 1,
            active: false
          };

          return data;
        }, {});

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
          start: nodes.length === 0,
          finish: false,
          shareable: false,
          share_text: ''
        };
        data.nodes.push(node);

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

        handlers.select.each(function (func) {
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
