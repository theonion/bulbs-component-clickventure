describe('clickventureEditLink', function () {

  var $directiveScope;
  var element;
  var link;
  var node;

  beforeEach(function () {
    module('bulbs.clickventure.edit.link');
    module('bulbs.clickventure.edit.services.node');
    module('bulbs.clickventure.edit.services.node.factory');
    module('bulbs.clickventure.edit.services.node.link.factory');
    module('bulbs.clickventure.templates');

    inject(function ($compile, $rootScope, ClickventureEdit, ClickventureEditNode,
        ClickventureEditNodeLink) {
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
      var deleteLink = sinon.spy(ClickventureEdit, 'deleteLink');

      $directiveScope.deleteLink(node, link);

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });

  describe('should have a method to open an add page modal that', function () {

    it('should open an add page modal', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });

  describe('should have a method to display node titles that', function () {

    it('should display nodes with order and using the node name filter', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
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
