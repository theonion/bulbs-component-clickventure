'use strict';

angular.module('bulbs.clickventure.edit', [
  'jquery',
  'lodash',
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.service'
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
          '_', '$', '$scope', '$window', '$timeout', 'ClickventureEdit',
          function (_, $, $scope, $window, $timeout, ClickventureEdit) {

            $scope.$watch('article', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal.nodes);
            });

            $scope.addNode = ClickventureEdit.addNode;

            ClickventureEdit.registerSelectNodeHandler(function (node) {
              $scope.selectedNode = node;
// TODO : this looks bad?
              // terrible code alarm
              $timeout(function () {
                $window.picturefill($('.clickventure-node')[0]);
              });
            });
          }
        ]
      };
    }
  ]);
