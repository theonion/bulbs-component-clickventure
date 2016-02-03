describe('clickventureEditLink', function () {

  var $directiveScope;
  var ClickventureEdit;
  var ClickventureEditLinkAddPageModal_stub;
  var clickventureNodeNameFilter;
  var element;
  var link;
  var node;

  beforeEach(function () {
    // modules from bulbs-cms
    angular.module('autocompleteBasic', []);
    angular.module('confirmationModal.factory', [])
      .factory('ConfirmationModal', function () { return function (a) {}; });

    angular.module('bulbs.clickventure.edit.link.addPageModal.factory')
      .factory('ClickventureEditLinkAddPageModal', function () {
        ClickventureEditLinkAddPageModal_stub = sinon.stub();
        return ClickventureEditLinkAddPageModal_stub;
      });

    clickventureNodeNameFilter = sinon.stub();
    angular.module('bulbs.clickventure.edit.nodeNameFilter')
      .filter('clickventure_node_name', function () {
        return clickventureNodeNameFilter;
      });

    module('bulbs.clickventure.edit.link');
    module('bulbs.clickventure.edit.services.node');
    module('bulbs.clickventure.edit.services.node.factory');
    module('bulbs.clickventure.edit.services.node.link.factory');
    module('bulbs.clickventure.templates');

    inject(function (_ClickventureEdit_, $compile, $rootScope, ClickventureEditNode,
        ClickventureEditNodeLink) {
      ClickventureEdit = _ClickventureEdit_;

      link = new ClickventureEditNodeLink();
      node = new ClickventureEditNode();

      var $parentScope = $rootScope.$new();
      $parentScope.link = link;
      $parentScope.node = node;

      element = $compile(
        '<clickventure-edit-link node="node" link="link"></clickventure-edit-link>'
      )($parentScope);

      $parentScope.$digest();
      $directiveScope = element.isolateScope();
    });
  });

  describe('should have a method to delete a node\'s links that', function () {

    it('should delete the link on modal confirm', function () {
      var deleteLink = sinon.stub(ClickventureEdit, 'deleteLink');

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
      $directiveScope.nodeData.view = {};
      $directiveScope.nodeData.view[nodeId] = {
        order: nodeOrder,
        node: node
      };

      clickventureNodeNameFilter.returns(nodeTitle);
      var displayText = $directiveScope.nodeDisplay(nodeId);

      expect(displayText).to.equal('(' + nodeOrder + ') ' + nodeTitle);
      expect(clickventureNodeNameFilter.calledOnce).to.be.true;
      expect(clickventureNodeNameFilter.calledWith(node)).to.be.true;
    });
  });

  describe('should have a method to search nodes by search term that', function () {

    it('should be able to search by node number', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should be able to search by node title', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should return a promise interface', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });
});
