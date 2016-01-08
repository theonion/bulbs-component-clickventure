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


// TODO: >>>>>>> OLD

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

            $scope.onAddLink = function (node) {
              var link = {
                body: '',
                to_node: null,
                transition: '',
                link_style: '',
                float: false
              };
              node.links.push(link);
            };
            $scope.onDeleteObject = function (objList, obj) {
              var idx = objList.indexOf(obj);
              if (idx >= 0) {
                objList.splice(idx, 1);
              }
            };
            $scope.onMoveListObject = function (objList, startIndex, newIndex) {
              if (startIndex >= 0 && newIndex >= 0 && newIndex < objList.length) {
                var obj = objList[startIndex];
                objList.splice(startIndex, 1);
                objList.splice(newIndex, 0, obj);
              }
            };
          }
        ]
      };
    }
  ]);
