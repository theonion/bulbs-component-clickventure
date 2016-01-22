'use strict';

angular.module('bulbs.clickventure.edit.link.addPageModal.factory', [
  'bulbs.clickventure.edit.service',
  'ui.bootstrap.modal',
  'uuid4'
])
  .factory('ClickventureEditLinkAddPageModal', [
    '$modal', 'uuid4',
    function ($modal, uuid4) {
      var AddPageModal = function (scope) {
        var modal = $modal
          .open({
            controller: [
              '$scope', 'ClickventureEdit',
              function ($scope, ClickventureEdit) {
                $scope.uuid = uuid4.generate();
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
