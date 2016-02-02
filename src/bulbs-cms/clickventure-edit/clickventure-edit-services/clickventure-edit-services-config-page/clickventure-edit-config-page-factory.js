angular.module('bulbs.clickventure.edit.services.configPage.factory', [
  'lodash'
])
  .factory('ClickventureEditConfigPageError', [
    function () {
      function ClickventureEditConfigPageError (message) {
        this.name = 'Error (ClickventureEditConfigPage)';
        this.message = message || 'Something went wrong.';
      };
      ClickventureEditConfigPageError.prototype = Object.create(Error.prototype);

      return ClickventureEditConfigPageError;
    }
  ])
  .factory('ClickventureEditConfigPage', [
    '_', 'ClickventureEditConfigPageError',
    function (_, ClickventureEditConfigPageError) {

      var _order = 0;

      var _nextOrder = function () {
        return _order++;
      };

      function ClickventureEditConfigPage (title) {
        if (!_.isString(title)) {
          throw new ClickventureEditConfigPageError('Must provide a config page title as a string');
        }

        this.title = title;
        this.order = _nextOrder();
        this.statuses = [];
      };

      ClickventureEditConfigPage.prototype.addStatus = function (title) {
        this.statuses.push(title);
        return this;
      };

      ClickventureEditConfigPage.prototype.getUnsetStatus = function () {
        return this.statuses[0];
      };

      ClickventureEditConfigPage.prototype.getCompleteStatus = function () {
        return this.statuses[this.statuses.length - 1];
      };

      return ClickventureEditConfigPage;
    }
  ]);
