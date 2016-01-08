'use strict';

angular.module('bulbs.clickventure.edit.node', [
  'confirmationModal.factory',
  'lodash',
  'bulbs.clickventure.edit.link',
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
        '_', '$scope', '$window', '$timeout', 'ClickventureEdit', 'ConfirmationModal',
        function (_, $scope, $window, $timeout, ClickventureEdit, ConfirmationModal) {

          $scope.cloneNode = ClickventureEdit.cloneNode;
          $scope.addLink = ClickventureEdit.addLink;
          $scope.reorderLink = ClickventureEdit.reorderLink;

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



// TODO: >>>>>>> OLD

          $scope.inboundNodes = [];
          $scope.linkStyles = [
            '',
            'Action',
            'Dialogue',
            'Music',
            'Quiz'
          ];
          $scope.nodeTransitions = [
            'default',
            'slideLeft',
            'slideRight',
            'slideUp',
            'slideDown',
            'flipLeft'
          ];
          $scope.$watch('node', function (newVal, oldVal) {
            if (!newVal) {
              return;
            }
            $scope.inboundNodes = _.filter($scope.nodes, function (inNode) {
              return _.any(inNode.links, function (link) {
                return link.to_node == newVal.id;
              });
            });
          });
        }
      ],
      require: '^clickventureEdit'
    };
  });
