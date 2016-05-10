describe('clickventureEditLink', function () {

  var $directiveScope;
  var ClickventureEdit;
  var ClickventureEditLinkAddPageModal_stub;
  var link;
  var node;
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    // modules from bulbs-cms
    angular.module('autocompleteBasic', []);
    angular.module('confirmationModal.factory', [])
      .factory('ConfirmationModal', function () { return function (a) {}; });

    angular.module('bulbs.clickventure.edit.link.addPageModal.factory')
      .factory('ClickventureEditLinkAddPageModal', function () {
        ClickventureEditLinkAddPageModal_stub = sandbox.stub();
        return ClickventureEditLinkAddPageModal_stub;
      });

    module('bulbs.clickventure.edit.link');
    module('bulbs.clickventure.edit.services.edit');
    module('bulbs.clickventure.edit.services.node.service');
    module('bulbs.clickventure.edit.services.node.link.service');
    module('bulbs.clickventure.templates');

    inject(function (_ClickventureEdit_, $compile, $rootScope, ClickventureEditNode,
        ClickventureEditNodeLink) {
      ClickventureEdit = _ClickventureEdit_;

      link = ClickventureEditNodeLink.prepOrCreate();
      node = ClickventureEditNode.prepOrCreate();

      var $parentScope = $rootScope.$new();
      $parentScope.link = link;
      $parentScope.node = node;

      var element = $compile(
        '<clickventure-edit-link node="node" link="link"></clickventure-edit-link>'
      )($parentScope);

      $parentScope.$digest();
      $directiveScope = element.isolateScope();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('should have a method to delete a node\'s links that', function () {

    it('should delete the link on modal confirm', function () {
      var deleteLink = sandbox.stub(ClickventureEdit, 'deleteLink');

      var $modalScope = $directiveScope.deleteLink(node, link);
      $modalScope.modalOnOk();

      expect(deleteLink.calledOnce).to.be.true;
      expect(deleteLink.calledWith(node, link)).to.be.true;
    });
  });

  describe('should have a method to open an add page modal that', function () {

    it('should open an add page modal', function () {

      $directiveScope.openAddPageModal(link);

      expect(ClickventureEditLinkAddPageModal_stub.calledOnce).to.be.true;
      expect(ClickventureEditLinkAddPageModal_stub.calledWithNew()).to.be.true;

      var $newScope = ClickventureEditLinkAddPageModal_stub.getCall(0).args[0];
      expect($newScope.link).to.equal(link);
    });
  });

  describe('should have a method to display node titles that', function () {

    it('should display nodes with order and using the node name filter', function () {
      var nodeId = 101001;
      var nodeOrder = 10;
      var nodeTitle = 'hello one two three';
      node.id = nodeId;
      node.title = nodeTitle;
      $directiveScope.nodeData.view = {};
      $directiveScope.nodeData.view[nodeId] = {
        order: nodeOrder,
        node: node
      };

      var displayText = $directiveScope.nodeDisplay(nodeId);

      expect(displayText).to.equal('(' + nodeOrder + ') ' + nodeTitle);
    });

    it('should fail gracefully when not given an id', function () {
      var nodeDisplay = sandbox.spy($directiveScope, 'nodeDisplay');

      try {
        nodeDisplay();
      } catch (e) {}

      expect(nodeDisplay.exceptions[0]).to.be.undefined;
    });

    it('should fail gracefully when given a non-existent id', function () {
      var nodeDisplay = sandbox.spy($directiveScope, 'nodeDisplay');

      try {
        nodeDisplay(10);
      } catch (e) {}

      expect(nodeDisplay.exceptions[0]).to.be.undefined;
    });

    it('should return an empty string when not given an id', function () {

      var displayText = $directiveScope.nodeDisplay();

      expect(displayText).to.equal('');
    });
  });

  describe('should have a method to search nodes by search term that', function () {
    beforeEach(function () {
      var nodes = [{
        id: 0,
        title: 'my garbage title'
      }, {
        id: 1,
        title: 'this is trash'
      }, {
        id: 2,
        title: 'not garbage, not trash'
      }, {
        id: 4,
        title: 'garbage trucks'
      }];
      $directiveScope.nodeData.nodes = nodes;
      $directiveScope.nodeData.view = {};
      $directiveScope.nodeData.view[nodes[0].id] = {
        node: nodes[0],
        order: 0
      };
      $directiveScope.nodeData.view[nodes[1].id] = {
        node: nodes[1],
        order: 1
      };
      $directiveScope.nodeData.view[nodes[2].id] = {
        node: nodes[2],
        order: 100
      };
      $directiveScope.nodeData.view[nodes[3].id] = {
        node: nodes[3],
        order: 11
      };
    });

    it('should be able to search by node order', function () {
      var searchTerm = 10;
      var testNode = {
        id: 1010101,
        order: searchTerm
      };
      $directiveScope.nodeData.view[testNode.id] = testNode;

      var selections;
      $directiveScope.searchNodes(searchTerm)
        .then(function (value) {
          selections = value;
        });
      $directiveScope.$digest();

      expect(selections.length).to.equal(1);
      expect(selections[0]).to.equal(testNode.id);
    });

    it('should return an empty list when no node with order exists', function () {
      var selections;
      $directiveScope.searchNodes(101010)
        .then(function (value) {
          selections = value;
        });
      $directiveScope.$digest();

      expect(selections.length).to.equal(0);
    });

    it('should be able to search by node title', function () {
      var searchTerm = 'my favorite node';
      var testNode1 = {
        id: 1010101,
        title: searchTerm
      };
      var testNode2 = {
        id: 2020202,
        title: searchTerm + ' not garbage, these are flowers'
      };
      $directiveScope.nodeData.nodes.push(testNode1);
      $directiveScope.nodeData.nodes.push(testNode2);

      var selections;
      $directiveScope.searchNodes(searchTerm)
        .then(function (value) {
          selections = value;
        });
      $directiveScope.$digest();

      expect(selections.length).to.equal(2);
      expect(selections[0]).to.equal(testNode1.id);
      expect(selections[1]).to.equal(testNode2.id);
    });

    it('should return an empty list when no node matching title exists', function () {
      var selections;
      $directiveScope.searchNodes('no title should mtch this 3ver, probably...')
        .then(function (value) {
          selections = value;
        });
      $directiveScope.$digest();

      expect(selections.length).to.equal(0);
    });

    it('should return a promise interface', function () {

      var searchPromise = $directiveScope.searchNodes();

      expect(searchPromise.then).to.be.defined;
      expect(searchPromise.catch).to.be.defined;
      expect(searchPromise.finally).to.be.defined;
    });
  });
});
