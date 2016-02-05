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

    describe('should have a method to set nodes from data that', function () {

      it('should work if empty data was received', function () {

        ClickventureEdit.setNodes(null);

        expect(nodeData.nodes).to.be.instanceOf(Array);
        expect(nodeData.view).to.be.instanceOf(Object);
      });

      it('should add a new start node if there aren\'t any nodes given', function () {

        ClickventureEdit.setNodes(null);

        expect(nodeData.nodeActive).to.equal(nodeData.nodes[0]);
        expect(nodeData.nodes.length).to.equal(1);
        expect(nodeData.nodes[0].start).to.be.true;
        expect(nodeData.view[nodeData.nodes[0].id]).to.be.defined;
        expect(nodeData.view[nodeData.nodes[0].id].node).to.equal(nodeData.nodes[0]);
      });

      describe('should update old node data that', function () {

        it('should ensure any existing links have a from_node property', function () {
          var node = {id: 10202};
          var link1 = {from_node: node.id};
          var link2 = {};
          node.links = [link1, link2];

          ClickventureEdit.setNodes([node]);

          expect(nodeData.nodes[0]).to.equal(node);
          expect(nodeData.nodes[0].links[0].from_node).to.equal(node.id);
          expect(nodeData.nodes[0].links[1].from_node).to.equal(node.id);
        });

        it('should ensure all nodes have a links property', function () {

          ClickventureEdit.setNodes([{}, {}, {}]);

          expect(nodeData.nodes[0].links).to.be.instanceOf(Array);
          expect(nodeData.nodes[1].links).to.be.instanceOf(Array);
          expect(nodeData.nodes[2].links).to.be.instanceOf(Array);
        });

        it('should ensure all nodes have a statuses property', function () {

          ClickventureEdit.setNodes([{}, {}, {}]);

          expect(nodeData.nodes[0].statuses).to.be.instanceOf(Object);
          expect(nodeData.nodes[1].statuses).to.be.instanceOf(Object);
          expect(nodeData.nodes[2].statuses).to.be.instanceOf(Object);
        });

        it('should ensure all nodes have a sister_pages property', function () {

          ClickventureEdit.setNodes([{}, {}, {}]);

          expect(nodeData.nodes[0].sister_pages).to.be.instanceOf(Array);
          expect(nodeData.nodes[1].sister_pages).to.be.instanceOf(Array);
          expect(nodeData.nodes[2].sister_pages).to.be.instanceOf(Array);
        });
      });

      it('should set node view data for nodes', function () {
        var nodes = [{id: 1}, {id: 2}];

        ClickventureEdit.setNodes(nodes);

        expect(nodeData.view[nodes[0].id].node).to.equal(nodes[0]);
        expect(nodeData.view[nodes[0].id].order).to.equal(1);
        expect(nodeData.view[nodes[0].id].inboundLinks).to.be.instanceOf(Array);
        expect(nodeData.view[nodes[0].id].inboundLinks.length).to.equal(0);
        expect(nodeData.view[nodes[1].id].node).to.equal(nodes[1]);
        expect(nodeData.view[nodes[1].id].order).to.equal(2);
        expect(nodeData.view[nodes[1].id].inboundLinks).to.be.instanceOf(Array);
        expect(nodeData.view[nodes[1].id].inboundLinks.length).to.equal(0);
      });

      it('should make the first node active if there is not active node', function () {
        var node1 = {id: 1};

        ClickventureEdit.setNodes([node1, {id: 2}, {id: 3}]);

        expect(nodeData.nodeActive).to.equal(node1);
      });

      it('should keep the same node active', function () {
        var activeNode = {id: 1};
        nodeData.nodeActive = activeNode;

        ClickventureEdit.setNodes([{id: 3}, activeNode, {id: 2}]);

        expect(nodeData.nodeActive).to.equal(activeNode);
      });

      it('should setup inbound links for all node view data', function () {
        var updateInboundLinks = sinon.spy(ClickventureEdit, 'updateInboundLinks');

        ClickventureEdit.setNodes([{
          links: [{}, {}, {}]
        }, {
          links: [{}]
        }]);

        expect(updateInboundLinks.callCount).to.equal(4);
      });
    });

    describe('should have a method to reorder nodes that', function () {
      var node1;
      var node2;
      var node3;

      beforeEach(function () {
        node1 = ClickventureEdit.addNode();
        node2 = ClickventureEdit.addNode();
        node3 = ClickventureEdit.addNode();
      });

      it('should change node order value', function () {

        ClickventureEdit.reorderNode(0, 1);

        expect(nodeData.nodes[0]).to.equal(node2);
        expect(nodeData.nodes[1]).to.equal(node1);
        expect(nodeData.nodes[2]).to.equal(node3);
        expect(nodeData.view[node1.id].order).to.equal(2);
        expect(nodeData.view[node2.id].order).to.equal(1);
        expect(nodeData.view[node3.id].order).to.equal(3);
      });

      it('should not change order if given index to move to is below 0', function () {

        ClickventureEdit.reorderNode(0, -1);

        expect(nodeData.nodes[0]).to.equal(node1);
        expect(nodeData.nodes[1]).to.equal(node2);
        expect(nodeData.nodes[2]).to.equal(node3);
        expect(nodeData.view[node1.id].order).to.equal(1);
        expect(nodeData.view[node2.id].order).to.equal(2);
        expect(nodeData.view[node3.id].order).to.equal(3);
      });

      it('should not change order if a given index to move to is above number of nodes', function () {

        ClickventureEdit.reorderNode(0, nodeData.nodes.length);

        expect(nodeData.nodes[0]).to.equal(node1);
        expect(nodeData.nodes[1]).to.equal(node2);
        expect(nodeData.nodes[2]).to.equal(node3);
        expect(nodeData.view[node1.id].order).to.equal(1);
        expect(nodeData.view[node2.id].order).to.equal(2);
        expect(nodeData.view[node3.id].order).to.equal(3);
      });
    });
  });
});
