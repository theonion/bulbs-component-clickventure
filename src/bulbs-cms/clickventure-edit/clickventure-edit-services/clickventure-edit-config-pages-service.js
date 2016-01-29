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
            title: 'Photo',
            order: 2,
            statuses: [
              'Photo status not set',
              'Needs image',
              'Needs photoshop/photoshoot',
              'Needs approval',
              'Photo ready'
            ]
          }
        }
      };

      var handlers = {
        configPageChange: []
      };

      var _getVerifiedConfigPageKey = function (configPage, status) {
        return Object.keys(data.configPages)
          .find(function (key) {
            var page = data.configPages[key];
            return page === configPage &&
              page.statuses.indexOf(status) >= 0;
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
        setNodeStatus: function (node, configPage, status) {
          var configPageKey = _getVerifiedConfigPageKey(configPage, status);
          if (configPageKey) {
            node.statuses[configPageKey] = status;
          }

          return node;
        },
        nodeHasStatus: function (node, configPage, status) {
          var hasStatus = false;
          var configPageKey = _getVerifiedConfigPageKey(configPage, status);

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
          return Object.keys(data.configPages).reduce(function (isComplete, configPageKey) {
            return isComplete &&
              node.statuses[configPageKey] === _.last(data.configPage[configPageKey].statuses)
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
