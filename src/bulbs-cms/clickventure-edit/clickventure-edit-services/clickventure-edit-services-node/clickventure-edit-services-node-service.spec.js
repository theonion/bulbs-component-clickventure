describe('ClickventureEdit', function () {

  var ClickventureEdit;
  var ClickventureEditNode;
  var ClickventureEditNodeLink;
  var nodeData;

  beforeEach(function () {
    module('bulbs.clickventure.edit.services.node');
    module('bulbs.clickventure.edit.services.node.link.factory');

    inject(function (_ClickventureEdit_, _ClickventureEditNode_, _ClickventureEditNodeLink_) {

      ClickventureEdit = _ClickventureEdit_;
      ClickventureEditNode = _ClickventureEditNode_;
      ClickventureEditNodeLink = _ClickventureEditNodeLink_;

      nodeData = ClickventureEdit.getData();
    });
  });

  describe('public interface', function () {

    describe('should have a method to get service data that', function () {

      it('should return service data', function () {

        expect(nodeData.nodeActive).to.be.null;
        expect(nodeData.nodes).to.be.instanceof(Array);
        expect(nodeData.nodes.length).to.equal(0);
        expect(nodeData.view).to.be.instanceOf(Object);
        expect(Object.keys(nodeData.view).length).to.equal(0);
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
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();
        nodeData.nodeActive = node2;

        var newNode = ClickventureEdit.addNode();

        expect(nodeData.nodes[nodeData.nodes.indexOf(nodeData.nodeActive) + 1]).to.equal(newNode);
      });

      it('should add view data for the node', function () {

        var newNode = ClickventureEdit.addNode();
        var viewData = nodeData.view[newNode.id];

        expect(viewData.node).to.equal(newNode);
        expect(viewData.order).to.equal(nodeData.nodes.indexOf(newNode) + 1);
        expect(viewData.inboundLinks).to.be.instanceOf(Array);
        expect(viewData.inboundLinks.length).to.equal(0);
      });

      it('should fix view data order numbers if there are gaps', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();

        nodeData.view[node1.id].order += 10;
        nodeData.view[node2.id].order += 10;
        nodeData.view[node3.id].order += 10;

        var newNode = ClickventureEdit.addNode();

        expect(nodeData.view[node1.id].order).to.equal(1);
        expect(nodeData.view[node2.id].order).to.equal(2);
        expect(nodeData.view[node3.id].order).to.equal(3);
        expect(nodeData.view[newNode.id].order).to.equal(4);
      });
    });

    describe('should have a method to add and select a node that', function () {

      it('should create a node and set it to the active node', function () {

        var newNode = ClickventureEdit.addAndSelectNode();

        expect(nodeData.nodes[0]).to.equal(newNode);
        expect(nodeData.nodeActive).to.equal(newNode);
      });
    });

    describe('should have a method to update inbound links that', function () {
      var node;
      var nodeTo;
      var link;

      beforeEach(function () {
        node = ClickventureEdit.addNode();
        nodeTo = ClickventureEdit.addNode();
        link = ClickventureEdit.addLink(node);
      });

      it('should update link data on view data', function () {

        link.to_node = nodeTo.id;
        ClickventureEdit.updateInboundLinks(link);

        expect(nodeData.view[nodeTo.id].inboundLinks[0]).to.equal(node.id);
        expect(nodeData.view[nodeTo.id].inboundLinks.length).to.equal(1);
      });

      it('should keep the list of inbound links unique', function () {

        link.to_node = nodeTo.id;
        ClickventureEdit.updateInboundLinks(link);
        ClickventureEdit.updateInboundLinks(link);

        expect(nodeData.view[nodeTo.id].inboundLinks[0]).to.equal(node.id);
        expect(nodeData.view[nodeTo.id].inboundLinks.length).to.equal(1);
      });
    });
  });
});
