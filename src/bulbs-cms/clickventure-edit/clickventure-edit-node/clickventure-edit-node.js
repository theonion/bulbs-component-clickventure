'use strict';

angular.module('bulbs.clickventure.edit.node', [
  'confirmationModal.factory',
  'lodash',
  'bulbs.clickventure.edit.node.copy',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNode', function () {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-node/clickventure-edit-node.html',
      scope: {
        node: '=',
        nodes: '=',
        selectNode: '&',
        cloneNode: '&'
      },
      controller: [
        '$scope', 'ClickventureEdit', 'ConfirmationModal',
        function ($scope, ClickventureEdit, ConfirmationModal) {

          $scope.cloneNode = ClickventureEdit.cloneNode;
          $scope.nodeData = ClickventureEdit.getData();
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
      ],
      require: '^clickventureEdit'
    };
  });
