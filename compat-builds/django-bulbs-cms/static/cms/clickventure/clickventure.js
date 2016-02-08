angular.module('bulbs.clickventure.edit.services.configPage.factory', [
  'lodash'
])
  .factory('ClickventureEditConfigPageError', [
    function () {
      function ClickventureEditConfigPageError (message) {
        this.name = 'Error (ClickventureEditConfigPage)';
        this.message = message || 'Something went wrong.';
      };
      ClickventureEditConfigPageError.prototype = Object.create(Error.prototype);

      return ClickventureEditConfigPageError;
    }
  ])
  .factory('ClickventureEditConfigPage', [
    '_', 'ClickventureEditConfigPageError',
    function (_, ClickventureEditConfigPageError) {

      var _order = 0;

      var _nextOrder = function () {
        return _order++;
      };

      function ClickventureEditConfigPage (title) {
        if (!_.isString(title)) {
          throw new ClickventureEditConfigPageError('Must provide a config page title as a string');
        }

        this.title = title;
        this.order = _nextOrder();
        this.statuses = [];
      };

      ClickventureEditConfigPage.prototype.addStatus = function (title) {
        this.statuses.push(title);
        return this;
      };

      ClickventureEditConfigPage.prototype.getUnsetStatus = function () {
        return this.statuses[0];
      };

      ClickventureEditConfigPage.prototype.getCompleteStatus = function () {
        return this.statuses[this.statuses.length - 1];
      };

      return ClickventureEditConfigPage;
    }
  ]);

angular.module('bulbs.clickventure.edit.services.configPage', [
  'bulbs.clickventure.edit.services.configPage.factory',
  'lodash'
])
  .service('ClickventureEditConfigPages', [
    '_', 'ClickventureEditConfigPage',
    function (_, ClickventureEditConfigPage) {

      var settings = new ClickventureEditConfigPage('Settings');

      var copy = new ClickventureEditConfigPage('Copy');
      copy
        .addStatus('Copy status not set')
        .addStatus('Needs first pass')
        .addStatus('Needs copy edit')
        .addStatus('Copy ready');

      var photo = new ClickventureEditConfigPage('Image');
      photo
        .addStatus('Image status not set')
        .addStatus('Needs image')
        .addStatus('Needs photoshop/photoshoot')
        .addStatus('Needs approval')
        .addStatus('Image ready')

      var data = {
        configPageActive: null,
        configPages: {
          settings: settings,
          copy: copy,
          photo: photo
        }
      };

      var handlers = {
        configPageChange: []
      };

      var _getVerifiedConfigPageKey = function (status) {
        return getConfigPageKeys()
          .find(function (key) {
            return data.configPages[key].statuses.indexOf(status) >= 0;
          });
      };

      var getConfigPageKeys = function () {
        return Object.keys(data.configPages);
      };

      var methods = {};
      var method = function (name, func) {
        methods[name] = func.bind(methods);
      };

      method('getConfigPageKeys', getConfigPageKeys);

      method('getConfigPage', function (configPage) {
        var type = typeof configPage;

        var key;
        if (type === 'object') {
          key = this.getConfigPageKeys()
            .find(function (key) {
              return data.configPages[key] === configPage;
            });
        } else if (type === 'string') {
          key = configPage;
        }

        return data.configPages[key];
      });

      method('changeConfigPage', function (configPage) {
        var activeConfigPage = this.getConfigPage(configPage);
        if (activeConfigPage) {
          data.configPageActive = activeConfigPage;
          handlers.configPageChange.forEach(function (func) {
            func(activeConfigPage);
          });
        };
      });

      method('getOrderedConfigPages', function () {
        return this.getConfigPageKeys()
          .sort(function (a, b) {
            return data.configPages[a].order - data.configPages[b].order;
          })
          .map(function (key) {
            return data.configPages[key];
          });
      });

      method('setNodeStatus', function (node, status) {
        var configPageKey = _getVerifiedConfigPageKey(status);
        if (configPageKey) {
          node.statuses[configPageKey] =
            status === data.configPages[configPageKey].getUnsetStatus() ? '' : status;
        }

        return node;
      });

      method('nodeHasStatus', function (node, status) {
        var hasStatus = false;
        var configPageKey = _getVerifiedConfigPageKey(status);

        if (configPageKey) {
          var configPage = data.configPages[configPageKey];
          var statusIndex = configPage.statuses.indexOf(status);
          var nodeStatus = node.statuses[configPageKey];

          hasStatus =
            (statusIndex === 0 && typeof nodeStatus === 'undefined') ||
            nodeStatus === status;
        }

        return hasStatus;
      });

      method('nodeIsComplete', function (node) {
        return Object.keys(data.configPages)
          .reduce(function (isComplete, configPageKey) {
            return isComplete &&
              node.statuses[configPageKey] === data.configPages[configPageKey].getCompleteStatus();
          }, true);
      });

      method('getActiveConfigPage', function () {
        return data.configPageActive;
      });

      method('registerConfigPageChangeHandler', function (func) {
        handlers.configPageChange.push(func);
      });

      // set intial config page
      methods.changeConfigPage(data.configPages.settings);

      return methods;
    }
  ]);

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

angular.module('bulbs.clickventure.edit.link.addPageModal.factory', [
  'bulbs.clickventure.edit.services.edit',
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

angular.module('bulbs.clickventure.edit.link', [
  'autocompleteBasic',
  'confirmationModal.factory',
  'bulbs.clickventure.edit.icon.error',
  'bulbs.clickventure.edit.link.addPageModal.factory',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.services.edit',
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

angular.module('bulbs.clickventure.edit.node.container', [
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.services.configPage'
])
  .directive('clickventureEditNodeContainer', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
        require: '^clickventureEdit',
        transclude: true,
        scope: {
          configPageKey: '@',
          onConfigPageRender: '&',
        },
        controller: [
          '$rootScope', '$scope', '$timeout', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($rootScope, $scope, $timeout, ClickventureEdit, ClickventureEditConfigPages) {
            $scope.configPage = ClickventureEditConfigPages.getConfigPage($scope.configPageKey);
            $scope.nodeData = ClickventureEdit.getData();
            $scope.selectedStatus = '';

            $scope.getActiveConfigPage = ClickventureEditConfigPages.getActiveConfigPage;

            var configPageRender = function () {
              $scope.selectedStatus = $scope.nodeData.nodeActive.statuses[$scope.configPageKey];
              $scope.onConfigPageRender();
            };

            // using $timeout to ensure all data/view is updated before calling callback
            ClickventureEditConfigPages.registerConfigPageChangeHandler(
              $timeout.bind(null, function () {
                if (ClickventureEditConfigPages.getActiveConfigPage() === $scope.configPage) {
                  configPageRender();
                }
              })
            );

            // using $timeout to ensure all data/view is updated before calling callback
            ClickventureEdit.registerSelectNodeHandler(
              $timeout.bind(null, configPageRender)
            );

            $scope.selectedStatus = $scope.nodeData.nodeActive &&
              $scope.nodeData.nodeActive.statuses[$scope.configPageKey];
            $scope.setActiveNodeStatus = function () {
              ClickventureEditConfigPages.setNodeStatus(
                $scope.nodeData.nodeActive,
                $scope.selectedStatus || $scope.getActiveConfigPage().statuses[0]
              )
              $rootScope.$emit('bulbs.clickventure.edit.nodeList.searchNodes');
            };
          }
        ]
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.node.copy', [
  'bulbs.clickventure.edit.link',
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.node.title',
  'bulbs.clickventure.edit.icon.error'
])
  .directive('clickventureEditNodeCopy', [
    '$window',
    function ($window) {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$scope', 'ClickventureEdit',
          function ($scope, ClickventureEdit) {
            $scope.addLink = ClickventureEdit.addLink;
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
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.services.configPage',
  'bulbs.clickventure.edit.services.validator',
  'uuid4'
])
  .directive('clickventureEditNodeList', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-list/clickventure-edit-node-list.html',
        scope: {},
        require: '^clickventureEdit',
        controller: [
          '$rootScope', '$scope', 'ClickventureEdit', 'ClickventureEditConfigPages',
            'ClickventureEditValidator', 'uuid4',
          function ($rootScope, $scope, ClickventureEdit, ClickventureEditConfigPages,
              ClickventureEditValidator, uuid4) {

            $scope.uuid = uuid4.generate();

            $scope.addAndSelectNode = ClickventureEdit.addAndSelectNode;
            $scope.reorderNode = ClickventureEdit.reorderNode;
            $scope.selectNode = ClickventureEdit.selectNode;

            $scope.nodeData = ClickventureEdit.getData();
            $scope.nodeList = $scope.nodeData.nodes;

            $scope.configPages = ClickventureEditConfigPages.getOrderedConfigPages();

            $scope.searchTerm = '';

            $scope.completeFilter = 'Complete';
            $scope.incompleteFilter = 'Incomplete';
            $scope.selectedFilter = '';

            $scope.validateGraph = function () {
              ClickventureEditValidator.validateGraph($scope.nodeData.nodes);
            };

            $scope.searchNodes = function () {
              if ($scope.searchTerm || $scope.selectedFilter) {
                var searchTermRE = new RegExp($scope.searchTerm || '.*', 'i');

                $scope.nodeList = $scope.nodeData.nodes.filter(function (node) {
                  var textMatch =
                    $scope.searchTerm.length === 0 ||
                    !!node.title.match(searchTermRE) ||
                    !!node.body.match(searchTermRE) ||
                    node.links.filter(function (link) {
                      return link.body.match(searchTermRE);
                    }).length > 0;

                  var statusMatch = true;
                  if ($scope.selectedFilter === $scope.completeFilter) {
                    statusMatch = ClickventureEditConfigPages.nodeIsComplete(node);
                  } else if ($scope.selectedFilter === $scope.incompleteFilter) {
                    statusMatch = !ClickventureEditConfigPages.nodeIsComplete(node);
                  } else if ($scope.selectedFilter) {
                    statusMatch = ClickventureEditConfigPages.nodeHasStatus(
                      node,
                      $scope.selectedFilter
                    );
                  }

                  return textMatch && statusMatch;
                });
              } else {
                $scope.nodeList = $scope.nodeData.nodes;
              }
            };

            $rootScope.$on('bulbs.clickventure.edit.nodeList.searchNodes', $scope.searchNodes);

            $scope.searchKeypress = function  (e) {
              if (e.keyCode === 27) {
                // esc, clear
                $scope.searchTerm = '';
              }

              $scope.searchNodes();
            };
          }
        ],
        link: function (scope) {
          scope.$watch('nodeData.nodes', function () {
            scope.searchNodes();
          });
        }
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
  'bulbs.clickventure.edit.icon.error',
  'bulbs.clickventure.edit.node.container',
  'bulbs.clickventure.edit.node.title',
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
  'bulbs.clickventure.edit.node.title',
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.services.edit'
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
          $scope.cloneNode = ClickventureEdit.cloneNode;
          $scope.nodeData = ClickventureEdit.getData();
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

angular.module('bulbs.clickventure.edit.node.title', [])
  .directive('clickventureEditNodeTitle', [
    function () {
      return {
        restrict: 'E',
        templateUrl: 'clickventure-edit-node-title/clickventure-edit-node-title.html',
        require: '^clickventureEdit',
        scope: {
          node: '='
        },
        controller: [
          '$rootScope', '$scope',
          function ($rootScope, $scope) {
            $scope.nodeTitleChanged = function () {
              $rootScope.$emit('bulbs.clickventure.edit.nodeList.searchNodes');
            };
          }
        ]
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.nodeToolbar', [
  'bulbs.clickventure.edit.services.edit',
  'bulbs.clickventure.edit.services.configPage'
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
          '$scope', 'ClickventureEdit', 'ClickventureEditConfigPages',
          function ($scope, ClickventureEdit, ClickventureEditConfigPages) {

            $scope.nodeData = ClickventureEdit.getData();
            $scope.changeConfigPage = ClickventureEditConfigPages.changeConfigPage;

            $scope.getActiveConfigPage = ClickventureEditConfigPages.getActiveConfigPage;
            $scope.configPages = ClickventureEditConfigPages.getOrderedConfigPages();
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

angular.module('bulbs.clickventure.edit.services.edit', [
  'bulbs.clickventure.edit.nodeNameFilter',
  'bulbs.clickventure.edit.services.node.service',
  'bulbs.clickventure.edit.services.node.link.service',
  'lodash'
])
  .service('ClickventureEdit', [
    '_', '$filter', 'ClickventureEditNode', 'ClickventureEditNodeLink',
    function (_, $filter, ClickventureEditNode, ClickventureEditNodeLink) {

      var data = {
        nodeActive: null,
        nodes: [],
        view: {}
      };

      var handlers = {
        select: []
      };

      var _setNodeViewData = function (node) {
        var viewData;

        data.view[node.id] = {
          node: node,
          order: Math.max.apply(null, data.nodes.map(function (node) {
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

      var methods = {};
      var method = function (name, func) {
        methods[name] = func.bind(methods);
      };

      method('addNode', function () {
        var node = ClickventureEditNode.prepOrCreate({
          id: _getNextNodeId(),
          start: data.nodes.length === 0
        });

        var activeNodeIndex = data.nodes.indexOf(data.nodeActive);
        if (activeNodeIndex >= 0) {
          data.nodes.splice(activeNodeIndex + 1, 0, node);
        } else {
          data.nodes.push(node);
        }

        _setNodeViewData(node);
        _reindexNodes();

        return node;
      });

      method('addAndSelectNode', function () {
        return this.selectNode(this.addNode());
      });

      method('updateInboundLinks', function (link) {
        if (typeof link.to_node === 'number') {
          var links = data.view[link.to_node].inboundLinks;

          if (links.indexOf(link.from_node) < 0) {
            links.push(link.from_node);
          }
        }
      });

      method('getData', function () {
        return data;
      });

      method('setNodes', function (nodes) {
        data.nodes = nodes;
        data.view = {};

        var newActiveNode = null;
        if (nodes.length < 1) {
          // ensure there's at least one node
          this.addAndSelectNode();
        } else {
          data.nodes.forEach(function (node, i) {
            var modNode = ClickventureEditNode.prepOrCreate(node);

            // 1-based index for readability
            _setNodeViewData(modNode);

            if (i === 0 && data.nodeActive === null ||
                newActiveNode === null && data.nodeActive.id === modNode.id) {
              newActiveNode = modNode;
            }
          });

          // setup inboundLinks
          var _this = this;
          data.nodes.forEach(function (node) {
            node.links.forEach(function (link) {
              if (data.view[link.to_node]) {
                _this.updateInboundLinks(link);
              } else {
                link.to_node = null;
              }
            });
          });

          this.selectNode(newActiveNode);
        }

        return _reindexNodes();
      });

      method('reorderNode', function (indexFrom, indexTo) {
        var node = data.nodes[indexFrom];

        if (typeof indexTo !== 'number' ||
            indexTo < 0 ||
            indexTo >= data.nodes.length) {
          // don't move it if an invalid index was given
          data.view[node.id].order = indexFrom + 1;
          return data.nodes;
        }

        data.nodes.splice(indexFrom, 1);
        data.nodes.splice(indexTo, 0, node);

        return _reindexNodes();
      });

      method('registerSelectNodeHandler', function (func) {
        handlers.select.push(func);
      });

      method('selectNode', function (node) {
        data.nodeActive = node;

        handlers.select.forEach(function (func) {
          func(node);
        });

        return node;
      });

      method('cloneNode', function (node) {
        var clonedNode = this.addAndSelectNode();

        _.assign(
          clonedNode,
          _.omit(node, [
            'id',
            'links',
            'statuses',
            'sister_pages',
            'title'
          ])
        );

        clonedNode.title = 'Clone - ' + $filter('clickventure_node_name')(node);

        // so we don't modify the original page's links
        var _this = this;
        clonedNode.links = node.links.map(function (link) {
          var newLink = ClickventureEditNodeLink.prepOrCreate(_.clone(link));

          newLink.from_node = clonedNode.id;
          _this.updateInboundLinks(newLink);

          return newLink;
        });

        clonedNode.statuses = _.clone(node.statuses);

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
      });

      method('deleteNode', function (rmNode) {
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
          this.addAndSelectNode();
        }

        var nextNodeId = i - 1;
        if (nextNodeId < 0) {
          nextNodeId = 0;
        }

        this.selectNode(data.nodes[nextNodeId]);

        return _reindexNodes();
      });

      method('getValidLinkStyles', function () {
        return [
          '',
          'Action',
          'Dialogue',
          'Music',
          'Quiz'
        ];
      });

      method('addLink', function (node) {
        var link = ClickventureEditNodeLink.prepOrCreate({
          from_node: node.id,
          link_style: node.link_style
        });

        node.links.push(link);

        return link;
      });

      method('reorderLink', function (node, indexFrom, indexTo) {
        if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
          var link = node.links[indexFrom];
          node.links.splice(indexFrom, 1);
          node.links.splice(indexTo, 0, link);
        }
      });

      method('deleteLink', function (node, rmLink) {
        var indexLinks = node.links.indexOf(rmLink);
        var toNode = rmLink.to_node;

        node.links.splice(indexLinks, 1);

        var hasAnotherLinkToNode = typeof node.links.find(function (link) {
          return link.to_node === toNode;
        }) !== 'undefined';

        if (typeof toNode === 'number' && !hasAnotherLinkToNode) {
          var linksInbound = data.view[toNode].inboundLinks;
          var indexInbound = linksInbound.indexOf(rmLink.from_node);
          linksInbound.splice(indexInbound, 1);
        }
      });

      return methods;
    }
  ]);

angular.module('bulbs.clickventure.edit.services.node.link.service', [
  'lodash'
])
  .service('ClickventureEditNodeLink', [
    '_',
    function (_) {

      return {
        prepOrCreate: function (data) {
          return _.defaults(data, {
            order: null,
            body: '',
            from_node: null,
            to_node: null,
            transition: '',
            link_style: null,
            float: false
          });
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.services.node.service', [
  'bulbs.clickventure.edit.services.node.link.service',
  'lodash'
])
  .service('ClickventureEditNode', [
    '_', 'ClickventureEditNodeLink',
    function (_, ClickventureEditNodeLink) {

      return {
        prepOrCreate: function (data) {
          var reference = _.defaults(data, {
            id: null,
            body: '',
            finish: false,
            link_style: 'action',
            links: [],
            photo_description: '',
            photo_final: null,
            photo_note: '',
            photo_placeholder_page_url: '',
            photo_placeholder_url: '',
            share_text: '',
            shareable: false,
            sister_pages: [],
            start: false,
            statuses: {},
            title: ''
          });

          // wrap each link properly
          reference.links = reference.links.map(function (link, i) {
            link.from_node = reference.id;

            return ClickventureEditNodeLink.prepOrCreate(link);
          });

          return reference;
        }
      };
    }
  ]);

angular.module('bulbs.clickventure.edit.services.validator', [
  'bulbs.clickventure.edit.services.edit',
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

angular.module('bulbs.clickventure.edit', [
  'bulbs.clickventure.edit.node',
  'bulbs.clickventure.edit.nodeList',
  'bulbs.clickventure.edit.nodeToolbar',
  'bulbs.clickventure.edit.services.edit',
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

            if (!article.nodes) {
              article.nodes = [];
            }

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

  $templateCache.put('clickventure-edit-link/clickventure-edit-link-add-page-modal/clickventure-edit-link-add-page-modal.html',
    "<div class=modal-header><button type=button class=close ng-click=$dismiss()><span class=\"fa fa-times\"></span></button><h4 class=modal-title>Add and Link Page</h4></div><div class=modal-body><label for=newPageTitle>Page Title</label><input id=newPageTitle class=form-control ng-model=pageTitle ng-keyup=\"$event.keyCode === 13 && confirm()\"></div><div class=modal-footer><button class=\"btn btn-success\" ng-click=confirm()><i class=\"fa fa-plus\"></i> <span>Add and Link Page</span></button> <button class=\"btn btn-danger\" ng-click=$dismiss()><i class=\"fa fa-times\"></i> <span>Cancel</span></button></div>"
  );


  $templateCache.put('clickventure-edit-link/clickventure-edit-link.html',
    "<div class=clickventure-link><div class=\"form-group form-group\"><label for=\"linkText{{ uuid }}\">Link Content</label><textarea id=\"linkText{{ uuid }}\" type=text class=\"clickventure-textarea-vertical form-control\" ng-model=link.body placeholder=\"Link Content (displays on site)\">\n" +
    "    </textarea></div><div class=\"row form-group\"><div class=col-xs-8 ng-class=\"{'has-error': !link.to_node}\"><label class=control-label for=\"linkTo{{ uuid }}\"><span>Link To</span><clickventure-edit-icon-error ng-show=!link.to_node error-text=\"This link doesn't link to another page!\"></clickventure-edit-icon-error></label><autocomplete-basic class=form-control ng-model=link.to_node item-display-formatter=nodeDisplay(item) input-placeholder=\"Page number or title\" search-function=searchNodes></autocomplete-basic></div><div class=col-xs-4><button class=\"btn btn-success form-button\" ng-click=openAddPageModal(link)><span class=\"fa fa-plus\"></span> <span>Link New Page</span></button></div></div><div class=row><div class=col-xs-4><label for=\"linkStyle{{ uuid }}\">Style</label><select id=\"linkStyle{{ uuid }}\" class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=link.link_style></select></div><div class=col-xs-3><button class=\"btn form-button\" ng-class=\"{\n" +
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
    "<div class=clickventure-edit-node-list-search ng-init=\"showFilters = false\"><div class=\"input-with-icon-container form-control\"><label><i class=\"fa fa-search\" ng-show=\"searchTerm.length === 0\"></i> <i ng-show=\"searchTerm.length > 0\"><button class=\"fa fa-times text-danger\" ng-click=\"searchTerm = ''; searchNodes()\"></button></i> <input placeholder=\"Search pages...\" ng-model=searchTerm ng-keyup=searchKeypress($event)> <i><button class=\"fa fa-filter\" ng-class=\"{'text-info': showFilters}\" ng-click=\"showFilters = !showFilters\"></button></i> <span class=text-muted>{{ nodeList.length }}/{{ nodeData.nodes.length }}</span></label></div><div class=\"clickventure-edit-node-list-search-filters form-horizontal\" ng-show=showFilters><div class=\"form-group form-group-sm\"><label class=\"control-label col-xs-4\" for=\"statusFilter{{ uuid }}\">Filter by</label><div class=col-xs-8><select id=\"statusFilter{{ uuid }}\" class=\"form-control input-sm\" ng-model=selectedFilter ng-change=searchNodes()><option value=\"\">No Filter</option><option value=\"{{ completeFilter }}\">{{ completeFilter }}</option><option value=\"{{ incompleteFilter }}\">{{ incompleteFilter }}</option><optgroup ng-repeat=\"configPage in configPages\" ng-if=\"configPage.statuses.length > 0\" label=\"{{ configPage.title }}\"><option ng-repeat=\"status in configPage.statuses\" value=\"{{ status }}\">{{ status }}</option></optgroup></select></div></div></div></div><ol><li ng-repeat=\"node in nodeList track by node.id\" ng-click=selectNode(node)><clickventure-edit-node-list-node node=node ng-class=\"{'clickventure-edit-node-list-node-active': nodeData.nodeActive === node}\"><input class=clickventure-edit-node-list-node-tools-item ng-model=nodeData.view[node.id].order ng-pattern=\"/^[1-9]{1}[0-9]*$/\" ng-keyup=\"$event.which === 13 && reorderNode($index, nodeData.view[node.id].order - 1)\" ng-blur=\"reorderNode($index, nodeData.view[node.id].order - 1)\"> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index - 1)\" ng-disabled=$first><span class=\"fa fa-chevron-up\"></span></button> <button class=\"btn btn-link btn-xs clickventure-edit-node-list-node-tools-item\" ng-click=\"reorderNode($index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button></clickventure-edit-node-list-node></li><li ng-show=\"nodeList.length === 0\" class=text-info><span class=\"fa fa-info-circle\"></span> <span>No results. Try a different search term and filter or clear the search bar and clear all filters to see all pages again.</span></li></ol><div class=clickventure-edit-node-list-tools><button class=\"btn btn-primary\" ng-click=addAndSelectNode()><span class=\"fa fa-plus\"></span> <span>New Page</span></button> <button class=\"btn btn-default\" ng-click=validateGraph()><span class=\"fa fa-check\"></span> <span>Run Check</span></button></div>"
  );


  $templateCache.put('clickventure-edit-node-title/clickventure-edit-node-title.html',
    "<label for=nodePageName>Page Name (Internal Use)</label><input id=nodePageName class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.title ng-change=nodeTitleChanged()>"
  );


  $templateCache.put('clickventure-edit-node-toolbar/clickventure-edit-node-toolbar.html',
    "<div class=clickventure-edit-node-toolbar-title>Edit</div><div class=\"clickventure-edit-node-toolbar-view btn-group\"><button ng-repeat=\"configPage in configPages track by configPage.order\" ng-click=changeConfigPage(configPage) ng-class=\"{\n" +
    "        'btn-default': getActiveConfigPage() !== configPage,\n" +
    "        'btn-primary': getActiveConfigPage() === configPage\n" +
    "      }\" class=btn>{{ configPage.title }}</button></div><div class=clickventure-edit-node-toolbar-preview><a class=\"btn btn-link text-primary\" target=_blank href=\"/r/{{ article.id }}#{{ nodeData.nodeActive.id }}\"><i class=\"fa fa-share\"></i> <span>Preview Page</span></a></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-container/clickventure-edit-node-container.html',
    "<div class=container-fluid ng-show=\"getActiveConfigPage() === configPage\"><div class=form-group ng-show=\"configPage.statuses.length > 0\"><label for=configPageStatus>{{ configPage.title }} Status</label><select id=configPageStatus ng-model=selectedStatus ng-change=setActiveNodeStatus() class=form-control><option value=\"\">{{ configPage.statuses[0] }}</option><option ng-repeat=\"status in configPage.statuses\" ng-if=!$first value=\"{{ status }}\">{{ status }}</option></select></div><ng-transclude></ng-transclude></div>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-copy/clickventure-edit-node-copy.html',
    "<clickventure-edit-node-container config-page-key=copy on-config-page-render=onConfigPageActive()><div class=\"row form-group\"><div class=col-xs-12><clickventure-edit-node-title node=node></clickventure-edit-node-title></div></div><div class=row><div class=col-xs-12><label>Page Body</label><onion-editor ng-model=node.body role=multiline placeholder=\"Body (displays on site)\"></onion-editor></div></div><div class=row><h4 class=col-xs-12>Links</h4><div class=\"form-group col-xs-4\"><button class=\"btn btn-success\" ng-click=addLink(node)><span class=\"fa fa-plus\"></span> <span>Add Link</span></button></div><div class=\"form-group col-xs-8\"><div class=\"form-inline pull-right\"><label for=nodeDefaultLinkStyle>Default Link Style</label><select id=nodeDefaultLinkStyle class=form-control ng-options=\"style.toLowerCase() as style for style in linkStyles\" ng-model=node.link_style></select></div></div></div><div class=row><ol class=col-xs-12 ng-show=\"node.links.length > 0\"><li ng-repeat=\"link in node.links track by $index\" ng-init=\"linkOpen = true\" class=\"clearfix panel panel-default\"><div class=panel-heading><button class=\"btn btn-link btn-xs panel-title\" ng-click=\"linkOpen = !linkOpen\"><span class=\"fa fa-caret-right\" ng-class=\"{\n" +
    "                  'fa-caret-right': !linkOpen,\n" +
    "                  'fa-caret-down': linkOpen\n" +
    "                }\"></span> <span><span ng-show=\"link.body.length > 0\"><span>{{ link.body | limitTo:25 }}</span><span ng-show=\"link.body.length > 25\">...</span></span> <span ng-show=\"link.body.length === 0\">Link {{ $index + 1 }}</span></span><clickventure-edit-icon-error ng-show=!link.to_node error-text=\"This link doesn't link to another page!\"></clickventure-edit-icon-error></button><div class=\"btn-group pull-right\"><button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index + 1)\" ng-disabled=$last><span class=\"fa fa-chevron-down\"></span></button> <button class=\"btn btn-link btn-xs\" ng-click=\"reorderLink(node, $index, $index - 1)\" ng-disabled=\"$index === 0\"><span class=\"fa fa-chevron-up\"></span></button></div></div><div class=panel-body ng-show=linkOpen><clickventure-edit-link node=node link=link></clickventure-edit-link></div></li></ol><div class=col-xs-12 ng-show=\"node.links.length === 0\">No outbound links yet, click \"Add Link\" to add the first one.</div></div></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-photo/clickventure-edit-node-photo.html',
    "<clickventure-edit-node-container config-page-key=photo on-config-page-render=onConfigPageActive()><form name=formNodePhoto><div class=\"row form-group\"><div class=col-xs-12><clickventure-edit-node-title node=node></clickventure-edit-node-title></div></div><div class=row><label class=\"form-group col-xs-12\"><span>Image</span><betty-editable image=node.photo_final ratio=16x9 add-styles=\"fa fa-picture-o add-image-box clickventure-photo-box\"></betty-editable></label></div><div class=\"row form-group\"><div class=col-xs-8><div class=form-group ng-class=\"{'has-error': !formNodePhoto.photoPlaceholderUrl.$valid}\"><label class=control-label for=\"photoPlaceholderUrl{{ uuid }}\"><span>Stock/Placeholder Image URL</span><clickventure-edit-icon-error ng-show=!formNodePhoto.photoPlaceholderUrl.$valid error-text=\"Invalid URL! Valid URLs start with http:// or https://\"></clickventure-edit-icon-error></label><input id=\"photoPlaceholderUrl{{ uuid }}\" type=url class=form-control name=photoPlaceholderUrl ng-model=node.photo_placeholder_url></div><div class=form-group ng-class=\"{'has-error': !formNodePhoto.photoPlaceholderPageUrl.$valid}\"><label class=control-label for=\"photoPlaceholderPageUrl{{ uuid }}\"><span>Stock/Placeholder Image Page URL</span><clickventure-edit-icon-error ng-show=!formNodePhoto.photoPlaceholderPageUrl.$valid error-text=\"Invalid URL! Valid URLs start with http:// or https://\"></clickventure-edit-icon-error></label><input id=\"photoPlaceholderPageUrl{{ uuid }}\" type=url class=form-control name=photoPlaceholderPageUrl ng-model=node.photo_placeholder_page_url></div></div><div class=\"col-xs-4 form-group\"><label>Preview</label><div class=clickventure-photo-placeholder-preview><span class=\"fa fa-picture-o\" ng-if=!node.photo_placeholder_url></span> <img ng-if=node.photo_placeholder_url ng-src=\"{{ node.photo_placeholder_url }}\"></div></div></div><div class=row><div class=\"col-xs-12 form-group\"><label for=\"photoDescription{{ uuid }}\">Description</label><textarea id=\"photoDescription{{ uuid }}\" class=\"form-control clickventure-textarea-vertical\" ng-model=node.photo_description>\n" +
    "        </textarea></div></div><div class=row><div class=\"col-xs-12 form-group\"><label for=\"photoNote{{ uuid }}\">Image Note</label><input id=\"photoNote{{ uuid }}\" class=form-control ng-model=node.photo_note></div></div></form></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node-settings/clickventure-edit-node-settings.html',
    "<clickventure-edit-node-container config-page-key=settings><div class=\"row form-group\"><div class=col-xs-8><clickventure-edit-node-title node=node></clickventure-edit-node-title></div><div class=col-xs-4><button class=\"btn btn-primary form-button\" ng-click=cloneNode(node)><i class=\"fa fa-copy\"></i> <span>Clone Page</span></button></div></div><div class=\"row form-group\"><div class=col-xs-12><label>Select Page Type</label></div><div class=\"clearfix form-group\"><div class=\"btn-group col-xs-4\"><button class=btn ng-class=\"{\n" +
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
    "              }\"></span> <span>Shareable</span></button></div></div><div ng-show=\"node.finish && node.shareable\" class=\"col-xs-12 form-group\"><label for=nodeShareText>Share Message</label><input id=nodeShareText class=form-control placeholder=\"Page Name (Internal Use)\" ng-model=node.share_text></div></div><div class=\"row form-group\"><div class=col-xs-6><label>Inbound Links</label><ul ng-show=\"nodeData.view[node.id].inboundLinks.length > 0\"><li ng-repeat=\"nodeId in nodeData.view[node.id].inboundLinks track by nodeId\"><a ng-bind-html=\"nodeData.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(nodeData.view[nodeId].node)></a></li></ul><div ng-show=\"nodeData.view[node.id].inboundLinks.length === 0\">No inbound links yet, link a page to this one to make the first one.</div></div><div class=col-xs-6><label>Outbound Links</label><ul ng-show=\"node.links.length > 0\"><li ng-repeat=\"link in node.links track by $index\"><a ng-if=link.to_node ng-bind-html=\"nodeData.view[link.to_node].node | clickventure_node_name\" ng-click=selectNode(nodeData.view[link.to_node].node)></a> <span ng-if=!link.to_node class=text-danger><span>An unset link</span><clickventure-edit-icon-error error-text=\"This link doesn't link to another page!\"></clickventure-edit-icon-error></span></li></ul><div ng-show=\"node.links.length === 0\">No outbound links yet, add a link in copy settings to make the first one.</div></div></div><div class=\"row form-group\"><div class=col-xs-6><label>Sister Pages</label><ul ng-show=\"node.sister_pages.length > 0\"><li ng-repeat=\"nodeId in node.sister_pages track by nodeId\"><a ng-bind-html=\"nodeData.view[nodeId].node | clickventure_node_name\" ng-click=selectNode(nodeData.view[nodeId].node)></a></li></ul><div ng-show=\"node.sister_pages.length === 0\">No sister pages yet, clone this page to make the first one.</div></div></div><div class=\"row col-xs-12 form-group\"><button class=\"btn btn-danger\" ng-click=deleteNode(node)><i class=\"fa fa-trash-o\"></i> <span>Delete Page</span></button></div></clickventure-edit-node-container>"
  );


  $templateCache.put('clickventure-edit-node/clickventure-edit-node.html',
    "<clickventure-edit-node-settings node=node default-active=true></clickventure-edit-node-settings><clickventure-edit-node-copy node=node></clickventure-edit-node-copy><clickventure-edit-node-photo node=node></clickventure-edit-node-photo>"
  );


  $templateCache.put('clickventure-edit.html',
    "<clickventure-edit-node-list clickventure-edit-tool-fixture></clickventure-edit-node-list><clickventure-edit-node-toolbar clickventure-edit-tool-fixture article=article></clickventure-edit-node-toolbar><clickventure-edit-node node=data.nodeActive></clickventure-edit-node>"
  );

}]);
