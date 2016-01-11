'use strict';

angular.module('bulbs.clickventure.edit.nodeToolbar', [
  'jquery',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeToolbar', [
    '$',
    function ($) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();
            $scope.changeConfigPage = ClickventureEdit.changeConfigPage;
          }
        ],
        link: function (scope, elements) {
          var $nav = $('nav-bar nav');

          $(window).on('scroll', requestAnimationFrame.bind(null, function () {
            var container = elements.parent();

            if (container[0].getBoundingClientRect().top - $nav.height() <= 0) {
              var padding = $nav.height();

              elements.css('position', 'fixed');
              elements.css('top', padding + 'px');
              elements.css('width', container.width() + 'px');
              elements.css('z-index', '100');

              container.css('padding-top', padding + 'px')
            } else {
              elements.css('position', '');
              elements.css('top', '');
              elements.css('width', '');

              container.css('padding-top', '');
            }
          }));
        }
      };
    }
  ]);
