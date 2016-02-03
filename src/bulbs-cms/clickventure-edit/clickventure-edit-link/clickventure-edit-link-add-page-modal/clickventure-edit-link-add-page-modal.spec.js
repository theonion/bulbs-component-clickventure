describe('ClickventureEditLinkAddPageModal', function () {

  var $modalScope;
  var $parse;
  var ClickventureEditNodeLink;
  var ClickventureEditLinkAddPageModal;
  var link;

  beforeEach(function () {
    module('bulbs.clickventure.edit.link.addPageModal.factory');
    module('bulbs.clickventure.edit.services.node.link.factory');
    module('bulbs.clickventure.templates');

    inject(function (_$parse_, _ClickventureEditNodeLink_,
        _ClickventureEditLinkAddPageModal_, $rootScope) {
      $parse = _$parse_;
      ClickventureEditNodeLink = _ClickventureEditNodeLink_;
      ClickventureEditLinkAddPageModal = _ClickventureEditLinkAddPageModal_;

      link = new ClickventureEditNodeLink();
      $modalScope = $rootScope.$new();
      $modalScope.link = link;
    });
  });

  describe('on initialization', function () {

    it('should open a new add page modal', function () {
      var addPageModal = new ClickventureEditLinkAddPageModal($modalScope);

      expect(addPageModal.result).to.be.defined;
      expect(addPageModal.opened).to.be.defined;
      expect(addPageModal.close).to.be.defined;
      expect(addPageModal.dismiss).to.be.defined;
    });
  });

  describe('markup', function () {

    it('should confirm modal when enter key is used on title input', function () {
      var addPageModal = new ClickventureEditLinkAddPageModal($modalScope);

      $modalScope.$digest();
      // I too hate this, good luck finding an alternative, it seems impossible
      //  to trigger any kind of event that will fire the ng-keyup logic on this
      //  stupid input.
      var confirm = sinon.stub();
      var keyupAttr = angular.element(document.getElementById('newPageTitle')).attr('ng-keyup');
      $parse(keyupAttr)({
        $event: {keyCode: 13},
        confirm: confirm
      });

      expect(confirm.calledOnce).to.be.true;
    });
  });

  describe('on confirm', function () {

    it('should add a new node', function () {
      var addPageModal = new ClickventureEditLinkAddPageModal($modalScope);

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should link new node and update inbound links on given node', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });

  describe('on dismiss', function () {

    it('should do nothing', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });
});
