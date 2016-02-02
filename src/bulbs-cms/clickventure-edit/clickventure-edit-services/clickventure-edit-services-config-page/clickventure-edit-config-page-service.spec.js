describe('ClickventureEditConfigPages', function () {

  var ClickventureEditConfigPages;
  var ClickventureEditNode;

  beforeEach(function () {
    module('bulbs.clickventure.edit.services.configPage');
    module('bulbs.clickventure.edit.services.node.factory');

    inject(function (_ClickventureEditConfigPages_, _ClickventureEditNode_) {
      ClickventureEditConfigPages = _ClickventureEditConfigPages_;
      ClickventureEditNode = _ClickventureEditNode_;
    });
  });

  describe('initialization', function () {

    it('should add a \'Settings\' page', function () {
      var configPage = ClickventureEditConfigPages.getConfigPage('settings');

      expect(configPage.title).to.equal('Settings');
      expect(configPage.order).to.equal(0);
      expect(configPage.statuses.length).to.equal(0);
    });

    it('should add a \'Copy\' page', function () {
      var configPage = ClickventureEditConfigPages.getConfigPage('copy');

      expect(configPage.title).to.equal('Copy');
      expect(configPage.order).to.equal(1);
      expect(configPage.statuses[0]).to.equal('Copy status not set');
      expect(configPage.statuses[configPage.statuses.length - 1])
        .to.equal('Copy ready');
    });

    it('should add a \'Image\' page', function () {
      var configPage = ClickventureEditConfigPages.getConfigPage('photo');

      expect(configPage.title).to.equal('Image');
      expect(configPage.order).to.equal(2);
      expect(configPage.statuses[0]).to.equal('Image status not set');
      expect(configPage.statuses[configPage.statuses.length - 1])
        .to.equal('Image ready');
    });
  });

  describe('public interface', function () {

    it('should have a method to get an ordered list of config pages', function () {
      var pages = ClickventureEditConfigPages.getOrderedConfigPages();

      expect(pages[0]).to.deep.equal(ClickventureEditConfigPages.getConfigPage('settings'));
      expect(pages[1]).to.deep.equal(ClickventureEditConfigPages.getConfigPage('copy'));
      expect(pages[2]).to.deep.equal(ClickventureEditConfigPages.getConfigPage('photo'));
    });

    describe('should have a method to set the status of a node that', function () {
      var node;

      beforeEach(function () {
        node = new ClickventureEditNode();
      });

      it('should work for a valid status', function () {
        var copy = ClickventureEditConfigPages.getConfigPage('copy');
        var status = copy.statuses[0];

        ClickventureEditConfigPages.setNodeStatus(node, status);

        expect(node.statuses.copy).to.equal(status);
      });

      it('should not work for an invalid status', function () {
        var status = 'Not a real status';

        ClickventureEditConfigPages.setNodeStatus(node, status);

        expect(node.statuses.copy).to.be.undefined;
      });
    });

    describe('should have a method to check if a node has specific status that', function () {
      var node;

      beforeEach(function () {
        node = new ClickventureEditNode();
      });

      it('should be true if it doesn\'t have the status, but the status being tested for is the first in the list of statuses for a config page', function () {
        var copy = ClickventureEditConfigPages.getConfigPage('copy');
        var status = copy.statuses[0];

        var hasStatus = ClickventureEditConfigPages.nodeHasStatus(node, status);

        expect(hasStatus).to.be.true;
      });

      it('should be true if it does have the first status in the list of statuses for a config page', function () {
        var copy = ClickventureEditConfigPages.getConfigPage('copy');
        var status = copy.statuses[0];

        node.statuses.copy = status;
        var hasStatus = ClickventureEditConfigPages.nodeHasStatus(node, status);

        expect(hasStatus).to.be.true;
      });

      it('should be true if the node has that status', function () {
        var copy = ClickventureEditConfigPages.getConfigPage('copy');
        var status = copy.statuses[1];

        node.statuses.copy = status;
        var hasStatus = ClickventureEditConfigPages.nodeHasStatus(node, status);

        expect(hasStatus).to.be.true;
      });

      it('should be false if the node does not have that status', function () {
        var copy = ClickventureEditConfigPages.getConfigPage('copy');
        var status = copy.statuses[1];

        var hasStatus = ClickventureEditConfigPages.nodeHasStatus(node, status);

        expect(hasStatus).to.be.false;
      });

      it('should be false if an invalid status is given', function () {
        var status = 'Not a real status';

        var hasStatus = ClickventureEditConfigPages.nodeHasStatus(node, status);

        expect(hasStatus).to.be.false;
      });
    });

    describe('should have a method to determine if a node is "complete" that', function () {
      var node;

      beforeEach(function () {
        node = new ClickventureEditNode();
      });

      it('should be true if a node has all of the last statuses of all config pages', function () {
        var completeStatuses = ClickventureEditConfigPages
          .getConfigPageKeys()
          .forEach(function (key) {
            var statuses = ClickventureEditConfigPages.getConfigPage(key).statuses;
            node.statuses[key] = statuses[statuses.length - 1];
          });

        var isComplete = ClickventureEditConfigPages.nodeIsComplete(node);

        expect(isComplete).to.be.true;
      });

      it('should be false if a node only has some of the last statuses of all config pages', function () {
        var configPageKey = 'copy';
        var statuses = ClickventureEditConfigPages.getConfigPage(configPageKey).statuses;
        var status = statuses[statuses.length - 1];

        node.statuses[configPageKey] = status;
        var isComplete = ClickventureEditConfigPages.nodeIsComplete(node);

        expect(isComplete).to.be.false;
      });

      it('should be false if a node has none of the last statuses of all config pages', function () {

        node.statuses = {};
        var isComplete = ClickventureEditConfigPages.nodeIsComplete(node);

        expect(isComplete).to.be.false;
      });
    });

    it('should have a method to get the currently active config page', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should have a method to get a single config page by key', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should have a method to register a config page change handler', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });

    it('should have a method to change the active config page', function () {

      // TODO : add test code here
      throw new Error('Not implemented yet.');
    });
  });
});
