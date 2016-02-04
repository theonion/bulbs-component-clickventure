describe('clickventureEditNodeContainer', function () {

  var $compile;
  var $directiveScope;
  var $parentScope;
  var ClickventureEdit;
  var ClickventureEditConfigPages;

  beforeEach(function () {
    module('bulbs.clickventure.edit.node.container');
    module('bulbs.clickventure.edit.services.configPage');
    module('bulbs.clickventure.templates');

    inject(function (_$compile_, _ClickventureEdit_, _ClickventureEditConfigPages_,
        $rootScope) {

      $compile = _$compile_;
      $parentScope = $rootScope.$new();
      ClickventureEdit = _ClickventureEdit_;
      ClickventureEditConfigPages = _ClickventureEditConfigPages_;
    });
  });

  describe('initialization', function () {

    it('should choose a config page for rendering based on key', function () {
      var configPageKey = 'copy';
      var configPage = ClickventureEditConfigPages.getConfigPage(configPageKey);

      $parentScope.configPageKey = configPageKey;
      var element = $compile(
        '<clickventure-edit-node-container config-page-key="{{ configPageKey }}"></clickventure-edit-node-container'
      )($parentScope);
      $parentScope.$digest();
      $directiveScope = element.isolateScope();

      expect($directiveScope.configPage).to.equal(configPage);
    });
  });
});
