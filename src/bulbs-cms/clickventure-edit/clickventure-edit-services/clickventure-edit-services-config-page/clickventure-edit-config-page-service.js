angular.module('bulbs.clickventure.edit.services.configPage', [
  'bulbs.clickventure.edit.services.configPage.factory',
  'lodash'
])
  .service('ClickventureEditConfigPages', [
    '_', 'ClickventureEditConfigPage',
    function (_, ClickventureEditConfigPage) {

      var settings = new ClickventureEditConfigPage('Settings');

      var copy = new ClickventureEditConfigPage('Copy');
      copy
        .addStatus('Copy status not set')
        .addStatus('Needs first pass')
        .addStatus('Needs copy edit')
        .addStatus('Copy ready');

      var photo = new ClickventureEditConfigPage('Image');
      photo
        .addStatus('Image status not set')
        .addStatus('Needs image')
        .addStatus('Needs photoshop/photoshoot')
        .addStatus('Needs approval')
        .addStatus('Image ready')

      var data = {
        configPageActive: null,
        configPages: {
          settings: settings,
          copy: copy,
          photo: photo
        }
      };

      var handlers = {
        configPageChange: []
      };

      var _getVerifiedConfigPageKey = function (status) {
        return getConfigPageKeys()
          .find(function (key) {
            return data.configPages[key].statuses.indexOf(status) >= 0;
          });
      };

      var getConfigPageKeys = function () {
        return Object.keys(data.configPages);
      };

      var getConfigPage = function (configPage) {
        var type = typeof configPage;

        var key;
        if (type === 'object') {
          key = getConfigPageKeys()
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
        if (activeConfigPage) {
          data.configPageActive = activeConfigPage;
          handlers.configPageChange.forEach(function (func) {
            func(activeConfigPage);
          });
        };
      };

      changeConfigPage(data.configPages.settings);

      return {
        getConfigPageKeys: getConfigPageKeys,
        getConfigPage: getConfigPage,
        changeConfigPage: changeConfigPage,
        getOrderedConfigPages: function () {
          return getConfigPageKeys()
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
        registerConfigPageChangeHandler: function (func) {
          handlers.configPageChange.push(func);
        }
      };
    }
  ]);
