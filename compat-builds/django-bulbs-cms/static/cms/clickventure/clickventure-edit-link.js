'use strict';

angular.module('bulbs.clickventure.edit.link', [
  'confirmationModal.factory',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditLink', function (routes) {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-link/clickventure-edit-link.html',
      scope: {
        node: '=',
        link: '='
      },
      require: '^clickventureNode',
      controller: [
        '$scope', 'ClickventureEdit', 'ConfirmationModal',
        function ($scope, ClickventureEdit, ConfirmationModal) {

          $scope.deleteLink = ClickventureEdit.deleteLink;
          $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
          $scope.nodeData = ClickventureEdit.getData();
          $scope.nodeTransitions = ClickventureEdit.getValidNodeTransitions();

          $scope.deleteLink = function (node, link) {
            var modalScope = $scope.$new();

            modalScope.modalOnOk = ClickventureEdit.deleteLink.bind(ClickventureEdit, node, link);
            modalScope.modalOnCancel = function () {};
            modalScope.modalTitle = 'Confirm Link Delete';
            modalScope.modalBody = 'Are you sure you wish to delete this link? This action cannot be undone!';
            modalScope.modalOkText = 'Delete';
            modalScope.modalCancelText = 'Cancel';

            new ConfirmationModal(modalScope);
          };


        }
      ]
    };
  });
