describe('clickventureEditNodeContainer', function () {

  var $parentScope;
  var $rootScope;
  var $timeout;
  var ClickventureEdit;
  var ClickventureEditConfigPages;
  var ClickventureEditNode;
  var configPage;
  var configPageKey;
  var element;
  var renderCallback;
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    module('bulbs.clickventure.edit.node.container');
    module('bulbs.clickventure.edit.services.configPage');
    module('bulbs.clickventure.edit.services.node.factory');
    module('bulbs.clickventure.templates');

    inject(function ($compile, _$rootScope_, _$timeout_, _ClickventureEdit_,
        _ClickventureEditConfigPages_, _ClickventureEditNode_) {

        $rootScope = _$rootScope_;
      $parentScope = $rootScope.$new();
      $timeout = _$timeout_;
      ClickventureEdit = _ClickventureEdit_;
      ClickventureEditConfigPages = _ClickventureEditConfigPages_;
      ClickventureEditNode = _ClickventureEditNode_;

      configPageKey = 'copy';
      configPage = ClickventureEditConfigPages.getConfigPage(configPageKey);

      $parentScope.configPageKey = configPageKey;
      $parentScope.onRender = function () {
        if (typeof renderCallback === 'function') {
          renderCallback();
        }
      };

      element = $compile(
        '<clickventure-edit-node-container ' +
            'config-page-key="{{ configPageKey }}" ' +
            'on-config-page-render="onRender()">' +
        '</clickventure-edit-node-container>'
      )($parentScope);
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('initialization', function () {

    it('should choose a config page for rendering based on key', function () {

      $parentScope.$digest();

      expect(element.isolateScope().configPage).to.equal(configPage);
    });

    it('should set the selected status to the active node\'s status for active config page', function () {
      var node = new ClickventureEditNode();
      ClickventureEdit.getData().nodeActive = node;
      node.statuses[configPageKey] = configPage.statuses[1];

      $parentScope.$digest();

      expect(element.isolateScope().selectedStatus).to.equal(node.statuses[configPageKey]);
    });
  });

  describe('functionality', function () {

    it('should set selected status and call render callback when config page changes to this config page', function () {
      var node = new ClickventureEditNode();
      var registerConfigPageChangeHandler = sandbox.stub(
        ClickventureEditConfigPages,
        'registerConfigPageChangeHandler'
      );
      renderCallback = sandbox.stub();
      sandbox.stub(ClickventureEditConfigPages, 'getActiveConfigPage').returns(configPage);
      node.statuses[configPageKey] = configPage.statuses[1];
      ClickventureEdit.getData().nodeActive = node;

      $parentScope.$digest();
      var callback = registerConfigPageChangeHandler.getCall(0).args[0];

      callback();
      $timeout.flush();

      expect(registerConfigPageChangeHandler.calledOnce).to.be.true;
      expect(element.isolateScope().selectedStatus).to.equal(node.statuses[configPageKey]);
      expect(renderCallback.calledOnce).to.be.true;
    });

    it('should do nothing when config page changes to a different config page', function () {
      var registerConfigPageChangeHandler = sandbox.stub(
        ClickventureEditConfigPages,
        'registerConfigPageChangeHandler'
      );
      renderCallback = sandbox.stub();
      sandbox.stub(ClickventureEditConfigPages, 'getActiveConfigPage').returns(null);

      $parentScope.$digest();
      var callback = registerConfigPageChangeHandler.getCall(0).args[0];

      callback();
      $timeout.flush();

      expect(renderCallback.callCount).to.equal(0);
    });

    it('should set selected status and call render callback when node changes', function () {
      var node = new ClickventureEditNode();
      var registerSelectNodeHandler = sandbox.stub(
        ClickventureEdit,
        'registerSelectNodeHandler'
      );
      renderCallback = sandbox.stub();
      node.statuses[configPageKey] = configPage.statuses[1];
      ClickventureEdit.getData().nodeActive = node;

      $parentScope.$digest();
      var callback = registerSelectNodeHandler.getCall(0).args[0];

      callback();
      $timeout.flush();

      expect(registerSelectNodeHandler.calledOnce).to.be.true;
      expect(element.isolateScope().selectedStatus).to.equal(node.statuses[configPageKey]);
      expect(renderCallback.calledOnce).to.be.true;
    });

    it('should have a way to change active node status that causes a search', function () {
      var node = new ClickventureEditNode();
      var setNodeStatus = sandbox.stub(ClickventureEditConfigPages, 'setNodeStatus');
      var $emit = sandbox.stub($rootScope, '$emit');
      var selectedStatus = 'some status';

      $parentScope.$digest();
      var $directiveScope = element.isolateScope();
      $directiveScope.selectedStatus = selectedStatus;
      ClickventureEdit.getData().nodeActive = node;

      $directiveScope.setActiveNodeStatus();

      expect(setNodeStatus.calledOnce).to.be.true;
      expect(setNodeStatus.calledWith(node, selectedStatus)).to.be.true;
      expect($emit.calledOnce).to.be.true;
      expect($emit.calledWith('bulbs.clickventure.edit.nodeList.searchNodes')).to.be.true;
    });
  });
});
