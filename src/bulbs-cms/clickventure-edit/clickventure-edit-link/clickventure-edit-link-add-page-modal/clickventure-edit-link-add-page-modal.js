angular.module('bulbs.clickventure.edit.link.addPageModal.factory', [
  'bulbs.clickventure.edit.services.node',
  'ui.bootstrap.modal',
  'ui.bootstrap.tpls'
])
  .factory('ClickventureEditLinkAddPageModal', [
    '$modal', 'ClickventureEdit',
    function ($modal, ClickventureEdit) {
      var AddPageModal = function (scope) {
        return $modal
          .open({
            controller: [
              '$scope', 'ClickventureEdit',
              function ($scope, ClickventureEdit) {
                $scope.pageTitle = '';

                $scope.confirm = function () {
                  $scope.$close();

                  var newNode = ClickventureEdit.addNode();
                  newNode.title = $scope.pageTitle;

                  $scope.link.to_node = newNode.id;
                  ClickventureEdit.updateInboundLinks($scope.link);
                };
              }
            ],
            scope: scope,
            templateUrl: 'clickventure-edit-link/clickventure-edit-link-add-page-modal/clickventure-edit-link-add-page-modal.html'
          });
      };

      return AddPageModal;
    }
  ]);
