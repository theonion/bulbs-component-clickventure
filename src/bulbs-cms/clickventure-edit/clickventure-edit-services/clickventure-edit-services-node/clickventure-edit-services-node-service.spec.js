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

    describe('should have a method to get service data that', function () {

      it('should return service data', function () {
        var data = ClickventureEdit.getData();

        expect(data.nodeActive).to.be.null;
        expect(data.nodes).to.be.instanceof(Array);
        expect(data.nodes.length).to.equal(0);
        expect(data.view).to.be.instanceOf(Object);
        expect(Object.keys(data.view).length).to.equal(0);
      });
    });

    describe('should have a method to add a node that', function () {

      it('should create a new node and add it to service data', function () {

        var newNode = ClickventureEdit.addNode();

        expect(newNode.id).to.equal(1);
        expect(newNode.start).to.be.true;
        expect(ClickventureEdit.getData().nodes[0]).to.equal(newNode);
      });

      it('should create a node with an id 1 greater than the max id', function () {
        var lastNode = ClickventureEdit.addNode();

        var newNode = ClickventureEdit.addNode();

        expect(newNode.id).to.equal(lastNode.id + 1);
        expect(newNode.start).to.be.false;
      });

      it('should create a node listed after the currently active node', function () {
        var data = ClickventureEdit.getData();
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();
        data.nodeActive = node2;

        var newNode = ClickventureEdit.addNode();

        expect(data.nodes[data.nodes.indexOf(data.nodeActive) + 1]).to.equal(newNode);
      });

      it('should add view data for the node', function () {
        var data = ClickventureEdit.getData();

        var newNode = ClickventureEdit.addNode();
        var viewData = data.view[newNode.id];

        expect(viewData.node).to.equal(newNode);
        expect(viewData.order).to.equal(data.nodes.indexOf(newNode) + 1);
        expect(viewData.inboundLinks).to.be.instanceOf(Array);
        expect(viewData.inboundLinks.length).to.equal(0);
      });

      it('should fix view data order numbers if there are gaps', function () {
        var data = ClickventureEdit.getData();
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();
        var inc = 10;

        data.view[node1.id].order += 10;
        data.view[node2.id].order += 10;
        data.view[node3.id].order += 10;

        var newNode = ClickventureEdit.addNode();

        expect(data.view[node1.id].order).to.equal(1);
        expect(data.view[node2.id].order).to.equal(2);
        expect(data.view[node3.id].order).to.equal(3);
        expect(data.view[newNode.id].order).to.equal(4);
      });
    });

    describe('should have a method to add and select a node that', function () {

      it('should create a node and set it to the active node', function () {
        var data = ClickventureEdit.getData();

        var newNode = ClickventureEdit.addAndSelectNode();

        expect(data.nodes[0]).to.equal(newNode);
        expect(data.nodeActive).to.equal(newNode);
      });
    });
  });
});
