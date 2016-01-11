'use strict';

angular.module('bulbs.clickventure.edit.node.settings', [
  'confirmationModal.factory',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeSettings', function () {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-node/clickventure-edit-node-settings/clickventure-edit-node-settings.html',
      require: '^clickventureEditNode',
      scope: {
        node: '='
      },
      controller: [
        '$scope', 'ClickventureEdit', 'ConfirmationModal',
        function ($scope, ClickventureEdit, ConfirmationModal) {

          ClickventureEdit.registerConfigPage('Settings');

          $scope.cloneNode = ClickventureEdit.cloneNode;
          $scope.data = ClickventureEdit.getData();
          $scope.selectNode = ClickventureEdit.selectNode;

          $scope.deleteNode = function (node) {
            var modalScope = $scope.$new();

            modalScope.modalOnOk = ClickventureEdit.deleteNode.bind(ClickventureEdit, node);
            modalScope.modalOnCancel = function () {};
            modalScope.modalTitle = 'Confirm Page Delete';
            modalScope.modalBody = 'Are you sure you wish to delete this page? This action cannot be undone!';
            modalScope.modalOkText = 'Delete';
            modalScope.modalCancelText = 'Cancel';

            new ConfirmationModal(modalScope);
          };
        }
      ]
    };
  });
