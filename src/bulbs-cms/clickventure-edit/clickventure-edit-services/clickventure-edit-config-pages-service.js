angular.module('bulbs.clickventure.edit.configPages.service', [
  'lodash'
])
  .service('ClickventureEditConfigPages', [
    '_',
    function (_) {

      var data = {
        configPageActive: null,
        configPages: {
          settings: {
            title: 'Settings',
            order: 0,
            statuses: []
          },
          copy: {
            title: 'Copy',
            order: 1,
            statuses: [
              'Copy status not set',
              'Needs first pass',
              'Needs copy edit',
              'Copy ready'
            ]
          },
          photo: {
            title: 'Image',
            order: 2,
            statuses: [
              'Image status not set',
              'Needs image',
              'Needs photoshop/photoshoot',
              'Needs approval',
              'Image ready'
            ]
          }
        }
      };

      var handlers = {
        configPageChange: []
      };

      var _getVerifiedConfigPageKey = function (status) {
        return Object.keys(data.configPages)
          .find(function (key) {
            return data.configPages[key].statuses.indexOf(status) >= 0;
          });
      };

      var getConfigPage = function (configPage) {
        var type = typeof configPage;

        var key;
        if (type === 'object') {
          key = Object.keys(data.configPages)
            .find(function (key) {
              return data.configPages[key] === configPage;
            });
        } else if (type === 'string') {
          key = configPage;
        }

        return data.configPages[key];
      };

      var changeConfigPage = function (configPage) {
        var activeConfigPage = getConfigPage(configPage);

        data.configPageActive = activeConfigPage;
        handlers.configPageChange.forEach(function (func) {
          func(activeConfigPage);
        });
      };

      changeConfigPage(data.configPages.settings);

      return {
        getOrderedConfigPages: function () {
          return Object.keys(data.configPages)
            .sort(function (a, b) {
              return data.configPages[a].order - data.configPages[b].order;
            })
            .map(function (key) {
              return data.configPages[key];
            });
        },
        setNodeStatus: function (node, status) {
          var configPageKey = _getVerifiedConfigPageKey(status);
          if (configPageKey) {
            node.statuses[configPageKey] = status;
          }

          return node;
        },
        nodeHasStatus: function (node, status) {
          var hasStatus = false;
          var configPageKey = _getVerifiedConfigPageKey(status);

          if (configPageKey) {
            var configPage = data.configPages[configPageKey];
            var statusIndex = configPage.statuses.indexOf(status);
            var nodeStatus = node.statuses[configPageKey];

            hasStatus =
              (statusIndex === 0 && typeof nodeStatus === 'undefined') ||
              nodeStatus === status;
          }

          return hasStatus;
        },
        nodeIsComplete: function (node) {
          return Object.keys(data.configPages)
            .reduce(function (isComplete, configPageKey) {
              return isComplete &&
                node.statuses[configPageKey] === _.last(data.configPages[configPageKey].statuses);
            }, true);
        },
        getActiveConfigPage: function () {
          return data.configPageActive;
        },
        getConfigPage: getConfigPage,
        registerConfigPageChangeHandler: function (func) {
          handlers.configPageChange.push(func);
        },
        changeConfigPage: changeConfigPage
      };
    }
  ]);
