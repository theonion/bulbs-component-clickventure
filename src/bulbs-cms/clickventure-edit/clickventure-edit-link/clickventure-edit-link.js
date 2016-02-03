angular.module('bulbs.clickventure.edit.link', [
  'autocompleteBasic',
  'confirmationModal.factory',
  'bulbs.clickventure.edit.icon.error',
  'bulbs.clickventure.edit.link.addPageModal.factory',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.services.node',
  'uuid4'
])
  .directive('clickventureEditLink', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-link/clickventure-edit-link.html',
        scope: {
          node: '=',
          link: '='
        },
        require: '^clickventureNode',
        controller: [
          '$q', '$scope', '$filter', 'ClickventureEdit',
            'ClickventureEditLinkAddPageModal', 'ConfirmationModal', 'uuid4',
          function ($q, $scope, $filter, ClickventureEdit,
              ClickventureEditLinkAddPageModal, ConfirmationModal, uuid4) {

            $scope.uuid = uuid4.generate();

            $scope.deleteLink = ClickventureEdit.deleteLink;
            $scope.updateInboundLinks = ClickventureEdit.updateInboundLinks;
            $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
            $scope.nodeData = ClickventureEdit.getData();

            $scope.deleteLink = function (node, link) {
              var $modalScope = $scope.$new();

              $modalScope.modalOnOk = function () {
                ClickventureEdit.deleteLink(node, link);
              };
              $modalScope.modalOnCancel = function () {};
              $modalScope.modalTitle = 'Confirm Link Delete';
              $modalScope.modalBody = 'Are you sure you wish to delete this link? This action cannot be undone!';
              $modalScope.modalOkText = 'Delete';
              $modalScope.modalCancelText = 'Cancel';

              new ConfirmationModal($modalScope);

              return $modalScope
            };

            $scope.openAddPageModal = function (link) {
              var modalScope = $scope.$new();
              modalScope.link = link;

              return new ClickventureEditLinkAddPageModal(modalScope);
            };

            $scope.nodeDisplay = function (id) {
              var view = $scope.nodeData.view[id];
              return '(' + view.order + ') ' + $filter('clickventure_node_name')(view.node);
            };

            $scope.searchTerm = '';
            $scope.searchNodes = function (searchTerm) {
              var selections = [];

              // check if they're searching by order number first
              var searchNumber = parseInt(searchTerm, 10);
              if (searchNumber > 0) {
                var nodeId = Object.keys($scope.nodeData.view).find(function (id) {
                  return $scope.nodeData.view[id].order === searchNumber;
                });

                if (nodeId) {
                  selections.push(parseInt(nodeId, 10));
                }
              } else {
                // not a number, try searching as a string
                selections = $scope.nodeData.nodes
                  .filter(function (node) {
                    return !!node.title.match(new RegExp(searchTerm, 'i'));
                  })
                  .map(function (node) {
                    return node.id;
                  });
              }

              return $q.when(selections);
            };
          }
        ]
      };
    }]
  );
