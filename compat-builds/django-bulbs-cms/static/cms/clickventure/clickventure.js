angular.module('bulbs.clickventure.edit.link', [
  'confirmationModal.factory',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.service',
  'uuid4'
])
  .directive('clickventureEditLink', function (routes) {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-link/clickventure-edit-link.html',
      scope: {
        node: '=',
        link: '='
      },
      require: '^clickventureNode',
      controller: [
        '$scope', 'ClickventureEdit', 'ConfirmationModal', 'uuid4',
        function ($scope, ClickventureEdit, ConfirmationModal, uuid4) {

          $scope.uuid = uuid4.generate();

          $scope.deleteLink = ClickventureEdit.deleteLink;
          $scope.updateInboundLinks = ClickventureEdit.updateInboundLinks;
          $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
          $scope.nodeData = ClickventureEdit.getData();

          $scope.deleteLink = function (node, link) {
            var modalScope = $scope.$new();

            modalScope.modalOnOk = ClickventureEdit.deleteLink.bind(ClickventureEdit, node, link);
            modalScope.modalOnCancel = function () {};
            modalScope.modalTitle = 'Confirm Link Delete';
            modalScope.modalBody = 'Are you sure you wish to delete this link? This action cannot be undone!';
            modalScope.modalOkText = 'Delete';
            modalScope.modalCancelText = 'Cancel';

            new ConfirmationModal(modalScope);
          };


        }
      ]
    };
  });

angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeContainer', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
        require: '^clickventureEdit',
        transclude: true,
        scope: {
          configPageTitle: '@',
          onConfigPageRender: '&'
        },
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {
            ClickventureEdit.registerConfigPage($scope.configPageTitle);

            $scope.data = ClickventureEdit.getData();
          }
        ],
        link: function (scope, elements) {
          scope.$watch(
            'data.configPageActive',
            $timeout.bind(null, function () {
              if (scope.data.configPageActive === scope.configPageTitle) {
                scope.onConfigPageRender();
              }
            })
          );

          scope.$watch(
            'data.nodeActive',
            $timeout.bind(null, function () {
              scope.onConfigPageRender();
            })
          );
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.service',
  'ui.bootstrap.tooltip'
])
  .directive('clickventureEditNodeCopy', [
    '$window', 'ClickventureEdit',
    function ($window, ClickventureEdit) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$scope',
          function ($scope) {
            $scope.configPageTitle = 'Copy';

            $scope.addLink = ClickventureEdit.addLink;
            $scope.data = ClickventureEdit.getData();
            $scope.linkStyles = ClickventureEdit.getValidLinkStyles();
            $scope.reorderLink = ClickventureEdit.reorderLink;
          }
        ],
        link: function (scope, elements) {
          scope.onConfigPageActive = function () {
            $window.picturefill(elements[0]);
          };
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.nodeList.node', [
  'bulbs.clickventure.edit.nodeNameFilter',
])
  .directive('clickventureEditNodeListNode', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list-node/clickventure-edit-node-list-node.html',
        transclude: true,
        scope: {
          node: '='
        },
        require: '^clickventureEditNodeList'
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.nodeList', [
  'bulbs.clickventure.edit.nodeList.node',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.validator.service'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {},
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit', 'ClickventureEditValidator',
          function ($scope, ClickventureEdit, ClickventureEditValidator) {
            $scope.addNode = ClickventureEdit.addNode;
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();

            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph(ClickventureEdit.getData().nodes);
            };
          }
        ]
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.nodeNameFilter', [])
  .filter('clickventure_node_name', [
    function () {

      return function (node) {
        var title = '';

        if (typeof node.title === 'string' && node.title.length > 0) {
          title = node.title;
        } else {
          title = 'Page ' + node.id;
        }

        return title;
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.node.photo', [
  'bettyEditable',
  'bulbs.clickventure.edit.node.container',
  'uuid4'
])
  .directive('clickventureEditNodePhoto', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-photo/clickventure-edit-node-photo.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$scope', 'uuid4',
          function ($scope, uuid4) {
            $scope.configPageTitle = 'Photo';
            $scope.uuid = uuid4.generate();
          }
        ],
        link: function (scope, elements) {
          scope.onConfigPageActive = function () {
            // HACK : since betty improperly sizes betty-editable elements in
            //  this pane when the pane is hidden
            elements.find('betty-editable').trigger('resize');
          };
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.node.settings', [
  'confirmationModal.factory',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeSettings', function () {
    return {
      restrict: 'E',
      templateUrl: 'clickventure-edit-node/clickventure-edit-node-settings/clickventure-edit-node-settings.html',
      require: '^clickventureEdit',
      scope: {
        node: '='
      },
      controller: [
        '$scope', 'ClickventureEdit', 'ConfirmationModal',
        function ($scope, ClickventureEdit, ConfirmationModal) {
          $scope.configPageTitle = 'Settings';

          $scope.cloneNode = ClickventureEdit.cloneNode;
          $scope.data = ClickventureEdit.getData();
          $scope.selectNode = ClickventureEdit.selectNode;

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
        }
      ]
    };
  });

angular.module('bulbs.clickventure.edit.nodeToolbar', [
  'bulbs.clickventure.edit.service'
])
  .directive('clickventureEditNodeToolbar', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
        scope: {
          article: '='
        },
        require: '^clickventureEdit',
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();
            $scope.changeConfigPage = ClickventureEdit.changeConfigPage;
          }
        ],
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.node', [
  'bulbs.clickventure.edit.node.copy',
  'bulbs.clickventure.edit.node.photo',
  'bulbs.clickventure.edit.node.settings'
])
  .directive('clickventureEditNode', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node.html',
        scope: {
          node: '='
        },
        require: '^clickventureEdit'
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.service', [
  'lodash'
])
  .service('ClickventureEdit', [
    '_', '$filter',
    function (_, $filter) {

      var data = {
        configPageActive: '',
        configPages: [],
        nodeActive: null,
        nodes: [],
        view: {}
      };

      var handlers = {
        configPageChange: [],
        select: []
      };

      var _setNodeViewData = function (node, preset) {
        var viewData;
        var settings = preset || {};

        data.view[node.id] = {
          node: node,
          order: settings.order ||
            Math.max.apply(null, data.nodes.map(function (node) {
              if (node.id in data.view) {
                return data.view[node.id].order;
              }
            })) + 1,
          inboundLinks: []
        };

        return viewData;
      };

      var _reindexNodes = function () {
        data.nodes
          .forEach(function (node, i) {
            data.view[node.id].order = i + 1;
          });

        return data.nodes;
      };

      var _getNextNodeId = function () {
        var lastId = 0;

        if (data.nodes.length > 0) {
          lastId = Math.max.apply(
            null,
            data.nodes.map(function (node) {
              return node.id;
            })
          );
        }

        return lastId + 1;
      };

      /**
       * Ensure node is up to date with newest fields.
       *
       * @param {Object} node - node to update.
       * @returns {Object} updated node.
       */
      var _updateNodeData = function (node) {
        if (_.isArray(node.links)) {
          node.links.forEach(function (link) {
            link.from_node = node.id;
          });
        } else {
          node.links = [];
        }

        if (!_.isArray(node.sister_pages)) {
          node.sister_pages = [];
        }

        return node;
      };

      var setNodes = function (nodes) {
        if (!_.isArray(nodes)) {
          nodes = [];
        }

        data.nodes = nodes;
        data.view = {};

        var newActiveNode = null;
        if (nodes.length < 1) {
          // ensure there's at least one node
          addNode();
        } else {
          data.nodes.forEach(function (node, i) {
            // some cleanup to ensure old nodes are in a good state
            _updateNodeData(node);

            // 1-based index for readability
            _setNodeViewData(node, {order: i + 1});

            if (i === 0 && data.nodeActive === null ||
                newActiveNode === null && data.nodeActive.id === node.id) {
              newActiveNode = node;
            }
          });

          // setup inboundLinks
          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              updateInboundLinks(link);
            });
          });

          selectNode(newActiveNode);
        }

        return _reindexNodes();
      };

      var addNode = function () {
        var node = {
          id: _getNextNodeId(),
          body: '',
          finish: false,
          link_style: 'action',
          links: [],
          photo_description: '',
          photo_final: null,
          photo_note: null,
          photo_placeholder_page_url: '',
          photo_placeholder_url: '',
          share_text: '',
          shareable: false,
          sister_pages: [],
          start: data.nodes.length === 0,
          title: ''
        };

        var activeNodeIndex = data.nodes.indexOf(data.nodeActive);
        if (activeNodeIndex >= 0) {
          data.nodes.splice(activeNodeIndex + 1, 0, node);
        } else {
          data.nodes.push(node);
        }

        _setNodeViewData(node);
        _reindexNodes();

        return selectNode(node);
      };

      var reorderNode = function (indexFrom, indexTo) {
        var node = data.nodes[indexFrom];

        if (typeof(indexTo) !== 'number' ||
            indexTo < 0 ||
            indexTo >= data.nodes.length) {
          // don't move it if an invalid index was given
          data.view[node.id].order = indexFrom + 1;
          return data.nodes;
        }

        data.nodes.splice(indexFrom, 1);
        data.nodes.splice(indexTo, 0, node);

        return _reindexNodes();
      };

      var registerSelectNodeHandler = function (func) {
        handlers.select.push(func);
      };

      var selectNode = function (node) {
        data.nodeActive = node;

        handlers.select.forEach(function (func) {
          func(node);
        });

        return node;
      };

      var cloneNode = function (node) {
        var clonedNode = addNode();

        clonedNode.title = 'Clone - ' + $filter('clickventure_node_name')(node);
        clonedNode.body = node.body;
        clonedNode.link_style = node.link_style;
        clonedNode.start = false;
        clonedNode.finish = node.finish;
        clonedNode.shareable = true;
        clonedNode.share_text = node.share_text;

        // so we don't modify the original page's links
        clonedNode.links = node.links.map(function (link) {
          var newLink = _.clone(link);

          newLink.from_node = clonedNode.id;
          updateInboundLinks(newLink);

          return newLink;
        });

        if (!_.isArray(node.sister_pages)) {
          node.sister_pages = [];
        }

        // this node gets the current list of siblings (which doesn't include itself)
        clonedNode.sister_pages = _.clone(node.sister_pages);

        // tell each sister that they have a new sibling
        node.sister_pages.forEach(function (sisterId) {
          var sister = data.view[sisterId].node;

          if (!_.isArray(sister.sister_pages)) {
            sister.sister_pages = [];
          }

          sister.sister_pages.push(clonedNode.id);
        });

        // tell the new siblings about eachother
        clonedNode.sister_pages.push(node.id);
        node.sister_pages.push(clonedNode.id);

        return clonedNode;
      };

      var deleteNode = function (rmNode) {
        var i = data.nodes.indexOf(rmNode);

        if (i >= 0) {
          data.nodes.splice(i, 1);
          delete data.view[rmNode.id];

          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              if (typeof link.to_node === 'number' && link.to_node === rmNode.id) {
                link.to_node = null;
              }
            });

            node.sister_pages = _.without(node.sister_pages, rmNode.id);
            data.view[node.id].inboundLinks = _.without(data.view[node.id].inboundLinks, rmNode.id);
          });
        }

        if (data.nodes.length < 1) {
          // ensure there's at least 1 node
          addNode();
        }

        var nextNodeId = i - 1;
        if (nextNodeId < 0) {
          nextNodeId = 0;
        }

        selectNode(data.nodes[nextNodeId]);

        return _reindexNodes();
      };

      var addLink = function (node) {
        var link = {
          body: '',
          from_node: node.id,
          to_node: null,
          transition: '',
          link_style: node.link_style,
          float: false
        };

        node.links.push(link);

        return link;
      };

      var updateInboundLinks = function (link) {
        if (typeof link.to_node === 'number') {
          var links = data.view[link.to_node].inboundLinks;

          if (links.indexOf(link.from_node) < 0) {
            links.push(link.from_node);
          }
        }
      };

      var reorderLink = function (node, indexFrom, indexTo) {
        if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
          var link = node.links[indexFrom];
          node.links.splice(indexFrom, 1);
          node.links.splice(indexTo, 0, link);
        }
      };

      var deleteLink = function (node, rmLink) {
        var indexLinks = node.links.indexOf(rmLink);
        node.links.splice(indexLinks, 1);

        if (typeof rmLink.to_node !== 'number') {
          var linksInbound = data.view[rmLink.to_node].inboundLinks;
          var indexInbound = linksInbound.indexOf(rmLink.from_node);
          linksInbound.splice(indexInbound, 1);
        }
      };

      var registerConfigPage = function (title) {
        data.configPages.push(title);

        if (data.configPageActive.length === 0) {
          data.configPageActive = title;
        }
      };

      var registerConfigPageChangeHandler = function (func) {
        handlers.configPageChange.push(func);
      };

      var changeConfigPage = function (title) {
        data.configPageActive = title;

        handlers.configPageChange.forEach(function (func) {
          func(title);
        });
      };

      return {
        getData: function () {
          return data;
        },
        getValidLinkStyles: function () {
          return [
            '',
            'Action',
            'Dialogue',
            'Music',
            'Quiz'
          ];
        },
        getValidNodeTransitions: function () {
          return [
            'default',
            'slideLeft',
            'slideRight',
            'slideUp',
            'slideDown',
            'flipLeft'
          ];
        },
        setNodes: setNodes,
        addNode: addNode,
        reorderNode: reorderNode,
        registerSelectNodeHandler: registerSelectNodeHandler,
        selectNode: selectNode,
        cloneNode: cloneNode,
        deleteNode: deleteNode,
        addLink: addLink,
        updateInboundLinks: updateInboundLinks,
        reorderLink: reorderLink,
        deleteLink: deleteLink,
        registerConfigPage: registerConfigPage,
        registerConfigPageChangeHandler: registerConfigPageChangeHandler,
        changeConfigPage: changeConfigPage
      };
    }
  ]);

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
              elements.css('z-index', 1000);
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

angular.module('bulbs.clickventure.edit.validator.service', [
  'bulbs.clickventure.edit.service',
])
  .service('ClickventureEditValidator', [
    '$filter', 'ClickventureEdit',
    function ($filter, ClickventureEdit) {

      var checkForDuplicateNodeIds = function (nodes) {
        var visited = {};
        var duplicates = {};
        var dupes = false;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (visited[node.id]) {
            dupes = true;
            if (!duplicates[node.id]) {
              duplicates[node.id] = [visited[node.id]];
            }
            duplicates[node.id].push(node);
          }
          visited[node.id] = node;
        }
        if (dupes) {
          var msg = ['Duplicate ids found:'];
          for (var key in duplicates) {
            var dupeList = duplicates[key];
            msg.push('id: ' + key);
            _.forEach(dupeList, function (d) {
              msg.push(d.title);
            });
          }
          alert(msg.join('\n'));
        }
        return !dupes;
      };

      var validateLinks = function (nodes) {
        // make sure all links are good to go
        var invalidNode = null;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          var numBad = _.size(_.reject(node.links, 'to_node'));
          if (numBad > 0) {
            invalidNode = node;
            break;
          }
        }
        if (invalidNode) {
          ClickventureEdit.selectNode(invalidNode);
          alert('A link has no target page');
        }
        return !invalidNode;
      };

      var validateNoOrphanedPages = function (nodes) {
        // ensure there's no pages which cannot be reached
        // from a start page
        var chain = _.chain(nodes);
        var visited = chain.filter('start').pluck('id').value();
        var notVisited = chain.reject('start').pluck('id').value();
        var linksById = chain.transform(function (result, node) {
          result[node.id] = _.pluck(node.links, 'to_node');
        }, {}).value();
        // check it out
        var result = floodfillPageGraph(visited, notVisited, linksById);
        // display an error if there are unreachable pages
        var unreachables = result.unreachable;
        if (_.size(unreachables) > 0) {
          var node = chain.find({id: _.first(unreachables)}).value();
          ClickventureEdit.selectNode(node);
          alert('Unreachable from start: ' + $filter('clickventure_node_name')(node));
          return false;
        }
        return true;
      };

      var validateAllCanFinish = function (nodes) {
        // ensure all pages can eventually reach a finish
        var chain = _.chain(nodes);
        var visited = chain.filter('finish').pluck('id').value();
        var notVisited = chain.reject('finish').pluck('id').value();
        var linksById = chain.transform(function (result, node) {
          result[node.id] = [];
        }, {}).value();
        linksById = chain.transform(function (result, node) {
          _.forEach(node.links, function (link) {
            var to_node = link.to_node;
            if (to_node) {
              var nodeLinks = result[to_node];
              result[to_node] = _.union(nodeLinks, [node.id]);
            }
          });
        }, linksById).value();
        // check it out
        var result = floodfillPageGraph(visited, notVisited, linksById);
        // display an error if there are unreachable pages
        var unreachables = result.unreachable;
        if (_.size(unreachables) > 0) {
          var node = chain.find({id: _.first(unreachables)}).value();
          ClickventureEdit.selectNode(node);
          alert('No path to finish: ' + $filter('clickventure_node_name')(node));
          return false;
        }
        return true;
      };

      var floodfillPageGraph = function (queue, notVisited, linksById) {
        // breadth-first search the page graph
        var visited = _.clone(queue);
        while (queue.length > 0) {
          var nodeId = queue.pop();
          var links = linksById[nodeId];
          if (links) {
            for (var i = 0; i < links.length; i++) {
              var toNodeId = links[i];
              if (!_.contains(visited, toNodeId)) {
                visited.push(toNodeId);
                queue.push(toNodeId);
                _.remove(notVisited, function (val) { return val == toNodeId; });
              }
            }
          }
        }

        return {
          reachable: visited,
          unreachable: notVisited
        };
      };

      return {
        validateGraph: function (nodes) {
          if (checkForDuplicateNodeIds(nodes) &&
              validateLinks(nodes) &&
              validateNoOrphanedPages(nodes) &&
              validateAllCanFinish(nodes)) {
             alert('Looks great! The pages are fully linked.');
          }
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit', [
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.service',
  'bulbs.clickventure.edit.toolFixture'
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
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {

            $scope.data = ClickventureEdit.getData();

            $scope.$watch('article.nodes', function (newVal, oldVal) {
              ClickventureEdit.setNodes(newVal);
            });
          }
        ]
      };
    }
  ]);

angular.module('bulbs.clickventure', [
  'bulbs.clickventure.edit',
  'bulbs.clickventure.templates'
]);

angular.module('bulbs.clickventure.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('clickventure-edit-link/clickventure-edit-link.html',
    "<div class=clickventure-link><div ng-show=!link.to_node class=\"alert alert-danger\" role=alert><span class=\"fa fa-exclamation-circle\"></span> <span>This link doesn't link to another page!</span></div><div class=\"form-group form-group\"><label for=\"linkText{{ uuid }}\">Link Content</label><input id=\"linkText{{ uuid }}\" class=form-control ng-model=link.body placeholder=\"Link Content (displays on site)\"></div><div class=row><div class=col-xs-5 ng-class=\"{'has-error': !link.to_node}\"><label class=control-label for=\"linkTo{{ uuid }}\">Link To</label><select id=\"linkTo{{ uuid }}\" class=form-control ng-model=link.to_node ng-change=updateInboundLinks(link) ng-options=\"node.id as (node | clickventure_node_name) || node.id for node in nodeData.nodes\"></select></div><div class=col-xs-4><label for=\"linkStyle{{ uuid }}\">Style</label><select id=\"linkStyle{{ uuid }}\" class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=link.link_style></select></div><div class=col-xs-3><button class=\"btn form-button\" ng-class=\"{\n" +
    "            'btn-info': link.float,\n" +
    "            'btn-default': !link.flaot\n" +
    "          }\" ng-click=\"link.float = !link.float\"><span class=fa ng-class=\"{\n" +
    "              'fa-check-square-o': link.float,\n" +
    "              'fa-square-o': !link.float\n" +
    "            }\"></span> <span>Float Link</span></button></div></div><div class=row><div class=col-xs-12><button class=\"btn btn-danger form-button\" ng-click=\"deleteLink(node, link)\"><span class=\"fa fa-trash-o\"></span> <span>Delete Link</span></button></div></div></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list-node/clickventure-edit-node-list-node.html',
    "<div class=clickventure-edit-node-list-node-status ng-class=\"{\n" +
    "      'clickventure-edit-node-list-node-status-start': node.start,\n" +
    "      'clickventure-edit-node-list-node-status-finish': node.finish\n" +
    "    }\"></div><div class=clickventure-edit-node-list-node-title ng-bind-html=\"node | clickventure_node_name\"></div><div class=clickventure-edit-node-list-node-tools><ng-transclude></ng-transclude></div>"
  );


  $templateCache.put('clickventure-edit-node-list/clickventure-edit-node-list.html',
    "<ol><li ng-repeat=\"node in nodeData.nodes track by node.id\" ng-click=selectNode(node)><clickventure-edit-node-list-node node=node ng-class=\"{'clickventure-edit-node-list-node-active': nodeData.nodeActive === node}\"><input class=clickventure-edit-node-list-node-tools-item ng-model=nodeData.view[node.id].order ng-pattern=\"/^[1-9]{1}[0-9]*$/\" ng-keyup=\"$event.which === 13 && reorderNode($index, nodeData.view[node.id].order - 1)\" ng-blur=\"reorderNode($index, nodeData.view[node.id].order - 1)\"> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index - 1)\" ng-disabled=$first><span class=\"fa fa-chevron-up\"></span></button> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button></clickventure-edit-node-list-node></li></ol><div class=clickventure-edit-node-list-tools><button class=\"btn btn-primary\" ng-click=addNode()><span class=\"fa fa-plus\"></span> <span>New Page</span></button> <button class=\"btn btn-default\" ng-click=validateGraph()><span class=\"fa fa-check\"></span> <span>Run Check</span></button></div>"
  );


  $templateCache.put('clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
    "<div class=clickventure-edit-node-toolbar-title>Edit</div><div class=\"clickventure-edit-node-toolbar-view btn-group\"><button ng-repeat=\"title in data.configPages\" ng-click=changeConfigPage(title) ng-class=\"{\n" +
    "        'btn-default': data.configPageActive !== title,\n" +
    "        'btn-primary': data.configPageActive === title\n" +
    "      }\" class=btn>{{ title }}</button></div><div class=clickventure-edit-node-toolbar-preview><a class=\"btn btn-link text-primary\" target=_blank href=\"/r/{{ article.id }}#{{ data.nodeActive.id }}\"><i class=\"fa fa-share\"></i> <span>Preview Page</span></a></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
    "<div class=container-fluid ng-show=\"data.configPageActive === '{{ configPageTitle }}'\" ng-transclude></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
    "<clickventure-edit-node-container config-page-title=\"{{ configPageTitle }}\" on-config-page-render=onConfigPageActive()><div class=row><div class=col-xs-12><label>Page Body</label><onion-editor ng-model=node.body role=multiline placeholder=\"Body (displays on site)\"></onion-editor></div></div><div class=row><h4 class=col-xs-12>Links</h4><div class=\"form-group col-xs-4\"><button class=\"btn btn-success\" ng-click=addLink(node)><span class=\"fa fa-plus\"></span> <span>Add Link</span></button></div><div class=\"form-group col-xs-8\"><div class=\"form-inline pull-right\"><label for=nodeDefaultLinkStyle>Default Link Style</label><select id=nodeDefaultLinkStyle class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=node.link_style></select></div></div></div><div class=row><ol class=col-xs-12 ng-show=\"node.links.length > 0\"><li ng-repeat=\"link in node.links track by $index\" ng-init=\"linkOpen = false\" class=\"clearfix panel panel-default\"><div class=panel-heading><button class=\"btn btn-link btn-xs panel-title\" ng-click=\"linkOpen = !linkOpen\"><span class=\"fa fa-caret-right\" ng-class=\"{\n" +
    "                  'fa-caret-right': !linkOpen,\n" +
    "                  'fa-caret-down': linkOpen\n" +
    "                }\"></span> <span><span ng-show=\"link.body.length > 0\"><span>{{ link.body | limitTo:25 }}</span><span ng-show=\"link.body.length > 25\">...</span></span> <span ng-show=\"link.body.length === 0\">Link {{ $index + 1 }}</span></span> <span class=\"fa fa-exclamation-circle text-danger\" ng-show=!link.to_node></span></button><div class=\"btn-group pull-right\"><button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button> <button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index - 1)\" ng-disabled=\"$index === 0\"><span class=\"fa fa-chevron-up\"></span></button></div></div><div class=panel-body ng-show=linkOpen><clickventure-edit-link node=node link=link></clickventure-edit-link></div></li></ol><div class=col-xs-12 ng-show=\"node.links.length === 0\">No outbound links yet, click \"Add Link\" to add the first one.</div></div></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-photo/clickventure-edit-node-photo.html',
    "<clickventure-edit-node-container config-page-title=\"{{ configPageTitle }}\" on-config-page-render=onConfigPageActive()><div class=row><label class=\"form-group col-xs-12\"><span>Image</span><betty-editable image=node.photo_final ratio=16x9 add-styles=\"fa fa-picture-o add-image-box clickventure-photo-box\"></betty-editable></label></div><div class=\"row form-group\"><div class=col-xs-8><div class=form-group><label for=\"photoPlaceholderUrl{{ uuid }}\">Stock/Placeholder Image URL</label><input id=\"photoPlaceholderUrl{{ uuid }}\" type=url class=form-control ng-model=node.photo_placeholder_url></div><div class=form-group><label for=\"photoPlaceholderPageUrl{{ uuid }}\">Stock/Placeholder Image Page URL</label><input id=\"photoPlaceholderPageUrl{{ uuid }}\" type=url class=form-control ng-model=node.photo_placeholder_page_url></div></div><div class=\"col-xs-4 form-group\"><label>Preview</label><div class=clickventure-photo-placeholder-preview><span class=\"fa fa-picture-o\" ng-if=!node.photo_placeholder_url></span> <img ng-if=node.photo_placeholder_url ng-src=\"{{ node.photo_placeholder_url }}\"></div></div></div><div class=row><div class=\"col-xs-12 form-group\"><label for=\"photoDescription{{ uuid }}\">Description</label><textarea id=\"photoDescription{{ uuid }}\" class=\"form-control clickventure-photo-description-field\" ng-model=node.photo_description>\n" +
    "      </textarea></div></div><div class=row><div class=\"col-xs-12 form-group\"><label for=\"photoNote{{ uuid }}\">Image Note</label><input id=\"photoNote{{ uuid }}\" class=form-control ng-model=node.photo_note></div></div></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-settings/clickventure-edit-node-settings.html',
    "<clickventure-edit-node-container config-page-title=\"{{ configPageTitle }}\"><div class=\"row form-group\"><div class=col-xs-8><label for=nodePageName>Page Name (Internal Use)</label><input id=nodePageName class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.title></div><div class=col-xs-4><button class=\"btn btn-primary form-button\" ng-click=cloneNode(node)><i class=\"fa fa-copy\"></i> <span>Clone Page</span></button></div></div><div class=\"row form-group\"><div class=col-xs-12><label>Select Page Type</label></div><div class=\"clearfix form-group\"><div class=\"btn-group col-xs-4\"><button class=btn ng-class=\"{\n" +
    "              'btn-info': node.start,\n" +
    "              'btn-default': !node.start\n" +
    "            }\" ng-click=\"node.start = !node.start; node.finish = false\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-circle-o': node.start,\n" +
    "                'fa-circle-o': !node.start\n" +
    "              }\"></span> <span>Start</span></button> <button class=btn ng-class=\"{\n" +
    "              'btn-info': node.finish,\n" +
    "              'btn-default': !node.finish\n" +
    "            }\" ng-click=\"node.finish = !node.finish; node.start = false\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-circle-o': node.finish,\n" +
    "                'fa-circle-o': !node.finish\n" +
    "              }\"></span> <span>End</span></button></div><div class=col-xs-4><button class=btn ng-show=node.finish ng-class=\"{\n" +
    "              'btn-info': node.shareable,\n" +
    "              'btn-default': !node.shareable\n" +
    "            }\" ng-click=\"node.shareable = !node.shareable\"><span class=fa ng-class=\"{\n" +
    "                'fa-check-square-o': node.shareable,\n" +
    "                'fa-square-o': !node.shareable\n" +
    "              }\"></span> <span>Shareable</span></button></div></div><div ng-show=\"node.finish && node.shareable\" class=\"col-xs-12 form-group\"><label for=nodeShareText>Share Message</label><input id=nodeShareText class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.share_text></div></div><div class=\"row form-group\"><div class=col-xs-6><label>Inbound Links</label><ul ng-show=\"data.view[node.id].inboundLinks.length > 0\"><li ng-repeat=\"nodeId in data.view[node.id].inboundLinks track by nodeId\"><a ng-bind-html=\"data.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(data.view[nodeId].node)></a></li></ul><div ng-show=\"data.view[node.id].inboundLinks.length === 0\">No inbound links yet, link a page to this one to make the first one.</div></div><div class=col-xs-6><label>Sister Pages</label><ul ng-show=\"node.sister_pages.length > 0\"><li ng-repeat=\"nodeId in node.sister_pages track by nodeId\"><a ng-bind-html=\"data.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(data.view[nodeId].node)></a></li></ul><div ng-show=\"node.sister_pages.length === 0\">No sister pages yet, clone this page to make the first one.</div></div></div><div class=\"row col-xs-12 form-group\"><button class=\"btn btn-danger\" ng-click=deleteNode(node)><i class=\"fa fa-trash-o\"></i> <span>Delete Page</span></button></div></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node.html',
    "<clickventure-edit-node-settings node=node default-active=true></clickventure-edit-node-settings><clickventure-edit-node-copy node=node></clickventure-edit-node-copy><clickventure-edit-node-photo node=node></clickventure-edit-node-photo>"
  );


  $templateCache.put('clickventure-edit.html',
    "<clickventure-edit-node-list clickventure-edit-tool-fixture></clickventure-edit-node-list><clickventure-edit-node-toolbar clickventure-edit-tool-fixture article=article></clickventure-edit-node-toolbar><clickventure-edit-node node=data.nodeActive></clickventure-edit-node>"
  );

}]);
