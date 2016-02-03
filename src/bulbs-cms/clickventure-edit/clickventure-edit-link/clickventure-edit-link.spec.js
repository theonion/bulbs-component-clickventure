describe('clickventureEditLink', function () {

  var $directiveScope;
  var element;
  var link;
  var node;

  beforeEach(function () {
    module('bulbs.clickventure.edit.link');
    module('bulbs.clickventure.edit.services.node.factory');
    module('bulbs.clickventure.edit.services.node.link.factory');
    module('bulbs.clickventure.templates');

    inject(function ($compile, $rootScope, ClickventureEditNode,
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
});
