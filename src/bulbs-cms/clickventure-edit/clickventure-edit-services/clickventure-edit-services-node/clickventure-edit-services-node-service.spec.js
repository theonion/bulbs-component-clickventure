describe('ClickventureEdit', function () {

  var ClickventureEdit;
  var ClickventureEditNode;

  beforeEach(function () {
    module('bulbs.clickventure.edit.services.node');

    inject(function (_ClickventureEdit_, _ClickventureEditNode_) {

      ClickventureEdit = _ClickventureEdit_;
      ClickventureEditNode = _ClickventureEditNode_;
    });
  });

  describe('public interface', function () {

    it('should have a method to get service data', function () {
      var data = ClickventureEdit.getData();

      expect(data.nodeActive).to.be.null;
      expect(data.nodes).to.be.instanceof(Array);
      expect(data.nodes.length).to.equal(0);
      expect(data.view).to.be.instanceOf(Object);
      expect(Object.keys(data.view).length).to.equal(0);
    });
  });
});
