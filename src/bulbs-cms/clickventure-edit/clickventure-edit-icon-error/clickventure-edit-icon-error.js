angular.module('bulbs.clickventure.edit.icon.error', [
  'ui.bootstrap.tooltip',
])
  .directive('clickventureEditIconError', [
    function () {
      return {
        restrict: 'E',
        template: '<span class="fa fa-exclamation-circle text-danger" tooltip="{{ errorText }}" tooltip-trigger tooltip-animation="false" tooltip-placement="top"></span>',
        scope: {
          errorText: '@'
        }
      };
    }
  ]);
