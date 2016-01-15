angular.module('bulbs.clickventure.edit.toolFixture', [
  'jquery'
])
  .directive('clickventureEditToolFixture', [
    '$',
    function ($) {
      return {
        restrict: 'A',
        scope: false,
        link: function (scope, elements) {
          var $nav = $('nav-bar nav');

          $(window).on('scroll resize', requestAnimationFrame.bind(null, function () {
            var container = elements.parent();

            if (container[0].getBoundingClientRect().top - $nav.height() <= 0) {
              var padding = $nav.height();

              elements.css('position', 'fixed');
              elements.css('top', padding + 'px');
              elements.css('z-index', 100);
            } else {
              elements.css('position', '');
              elements.css('top', '');
              elements.css('z-index', '');
            }
          }));
        }
      };
    }
  ]);
