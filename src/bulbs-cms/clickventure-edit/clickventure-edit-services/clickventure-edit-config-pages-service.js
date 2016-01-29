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
        setNodeStatus: function (node, configPageKey, status) {
          var configPage = Object.keys(data.configPages)
            .find(function (key) {
              var configPage = data.configPages[key];
              return configPage.title === configPageKey;
            });

          if (configPage.statuses.indexOf(status) >= 0) {
            // allow only one of a config page statuses on a node
            node.statuses = _.difference(node.statuses, configPage.statuses);
            node.statuses.push(status);
          }

          return node;
        },
        nodeHasStatus: function (node, status) {
          return node.statuses.indexOf(status) >= 0 ||
            data.configPages.find(function (configPage) {
              return configPage.statuses.indexOf(status) === 0;
            });
        },
        nodeIsComplete: function (node) {
          return data.configPages
            .reduce(function (isComplete, configPage) {
              var statuses = configPage.statuses;
              return isComplete &&
                (statuses.length === 0 ||
                node.statuses.indexOf(statuses[statuses.length - 1]) >= 0);
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
