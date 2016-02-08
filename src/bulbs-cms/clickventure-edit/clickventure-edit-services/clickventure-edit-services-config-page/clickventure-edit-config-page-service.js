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

      var methods = {};
      var method = function (name, func) {
        methods[name] = func.bind(methods);
      };

      method('getConfigPageKeys', getConfigPageKeys);

      method('getConfigPage', function (configPage) {
        var type = typeof configPage;

        var key;
        if (type === 'object') {
          key = this.getConfigPageKeys()
            .find(function (key) {
              return data.configPages[key] === configPage;
            });
        } else if (type === 'string') {
          key = configPage;
        }

        return data.configPages[key];
      });

      method('changeConfigPage', function (configPage) {
        var activeConfigPage = this.getConfigPage(configPage);
        if (activeConfigPage) {
          data.configPageActive = activeConfigPage;
          handlers.configPageChange.forEach(function (func) {
            func(activeConfigPage);
          });
        };
      });

      method('getOrderedConfigPages', function () {
        return this.getConfigPageKeys()
          .sort(function (a, b) {
            return data.configPages[a].order - data.configPages[b].order;
          })
          .map(function (key) {
            return data.configPages[key];
          });
      });

      method('setNodeStatus', function (node, status) {
        var configPageKey = _getVerifiedConfigPageKey(status);
        if (configPageKey) {
          node.statuses[configPageKey] =
            status === data.configPages[configPageKey].getUnsetStatus() ? '' : status;
        }

        return node;
      });

      method('nodeHasStatus', function (node, status) {
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
      });

      method('nodeIsComplete', function (node) {
        return Object.keys(data.configPages)
          .reduce(function (isComplete, configPageKey) {
            return isComplete &&
              node.statuses[configPageKey] === data.configPages[configPageKey].getCompleteStatus();
          }, true);
      });

      method('getActiveConfigPage', function () {
        return data.configPageActive;
      });

      method('registerConfigPageChangeHandler', function (func) {
        handlers.configPageChange.push(func);
      });

      // set intial config page
      methods.changeConfigPage(data.configPages.settings);

      return methods;
    }
  ]);
