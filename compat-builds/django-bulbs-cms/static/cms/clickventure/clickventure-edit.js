'use strict';

angular.module('bulbs.clickventure.edit', [
  'jquery',
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.validator.service'
])
  .directive('clickventureEdit', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit.html',
        scope: {
          article: '=',
          saveArticleDeferred: '='
        },
        controller: [
          '$', '$scope', '$window', '$timeout', 'ClickventureEdit',
            'ClickventureEditValidator',
          function ($, $scope, $window, $timeout, ClickventureEdit,
              ClickventureEditValidator) {

            $scope.$watch('article', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal.nodes);
            });

            $scope.addNode = ClickventureEdit.addNode;
            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph(ClickventureEdit.getData().nodes);
            };

            ClickventureEdit.registerSelectNodeHandler(function (node) {
              $scope.selectedNode = node;
// TODO : this looks bad?
              // terrible code alarm
              $timeout(function () {
                $window.picturefill($('clickventure-node')[0]);
              });
            });
          }
        ]
      };
    }
  ]);
