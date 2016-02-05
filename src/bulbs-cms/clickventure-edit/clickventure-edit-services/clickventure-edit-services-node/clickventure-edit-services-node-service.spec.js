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
        expect(newNode).to.be.instanceOf(ClickventureEditNode);
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

          expect(nodeData.nodes[0].id).to.equal(node.id);
          expect(nodeData.nodes[0].links[0].from_node).to.equal(node.id);
          expect(nodeData.nodes[0].links[1].from_node).to.equal(node.id);
        });

        it('should ensure all nodes have a links property', function () {

          ClickventureEdit.setNodes([{id: 1}, {id: 2}, {id: 3}]);

          expect(nodeData.nodes[0].links).to.be.instanceOf(Array);
          expect(nodeData.nodes[1].links).to.be.instanceOf(Array);
          expect(nodeData.nodes[2].links).to.be.instanceOf(Array);
        });

        it('should ensure all nodes have a statuses property', function () {

          ClickventureEdit.setNodes([{id: 1}, {id: 2}, {id: 3}]);

          expect(nodeData.nodes[0].statuses).to.be.instanceOf(Object);
          expect(nodeData.nodes[1].statuses).to.be.instanceOf(Object);
          expect(nodeData.nodes[2].statuses).to.be.instanceOf(Object);
        });

        it('should ensure all nodes have a sister_pages property', function () {

          ClickventureEdit.setNodes([{id: 1}, {id: 2}, {id: 3}]);

          expect(nodeData.nodes[0].sister_pages).to.be.instanceOf(Array);
          expect(nodeData.nodes[1].sister_pages).to.be.instanceOf(Array);
          expect(nodeData.nodes[2].sister_pages).to.be.instanceOf(Array);
        });

        it('should ensure new data is casted as a node object', function () {

          ClickventureEdit.setNodes([{id: 1}]);

          expect(nodeData.nodes[0]).to.be.instanceOf(ClickventureEditNode);
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
          id: 1,
          links: [{}, {}, {}]
        }, {
          id: 2,
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

    describe('should have a method to select a node that', function () {

      it('should set the active node', function () {
        var node = {};

        nodeData.nodeActive = null;
        ClickventureEdit.selectNode(node);

        expect(nodeData.nodeActive).to.equal(node);
      });

      it('should fire registered select node handlers', function () {
        var node = {};
        var handler1 = sinon.stub();
        var handler2 = sinon.stub();

        ClickventureEdit.registerSelectNodeHandler(handler1);
        ClickventureEdit.registerSelectNodeHandler(handler2);
        ClickventureEdit.selectNode(node);

        expect(handler1.calledOnce).to.be.true;
        expect(handler1.calledWith(node)).to.be.true;
        expect(handler2.calledOnce).to.be.true;
        expect(handler2.calledWith(node)).to.be.true;
      });
    });

    describe('should have a method to clone a node that', function () {

      it('should do a shallow copy of all non-unqiue properties', function () {
        var originalNode = ClickventureEdit.addNode();
        originalNode.body = 'some body';
        originalNode.finish = true;
        originalNode.link_style = 'some link style';
        originalNode.photo_description = 'some photo description';
        originalNode.photo_final = 'something something something';
        originalNode.photo_note = 'photo note';
        originalNode.photo_placeholder_page_url = 'alsdkjflaksjlfkja';
        originalNode.photo_placeholder_url = 'alsijfojoaijf3';
        originalNode.share_text = '309j8qflaskefm';
        originalNode.shareable = true;
        originalNode.start = false;
        originalNode.title = 'afli3jpajf3jakvjlamvasf'

        var clonedNode = ClickventureEdit.cloneNode(originalNode);

        expect(originalNode.id).to.not.equal(clonedNode.id);
        expect(originalNode.title).to.not.equal(clonedNode.title);
        expect(originalNode.links).to.not.equal(clonedNode.links);
        expect(originalNode.sister_pages).to.not.equal(clonedNode.sister_pages);
        expect(originalNode.statuses).to.not.equal(clonedNode.statuses);

        expect(originalNode.body).to.equal(clonedNode.body);
        expect(originalNode.finish).to.equal(clonedNode.finish);
        expect(originalNode.link_style).to.equal(clonedNode.link_style);
        expect(originalNode.photo_description).to.equal(clonedNode.photo_description);
        expect(originalNode.photo_final).to.equal(clonedNode.photo_final);
        expect(originalNode.photo_note).to.equal(clonedNode.photo_note);
        expect(originalNode.photo_placeholder_page_url).to.equal(clonedNode.photo_placeholder_page_url);
        expect(originalNode.photo_placeholder_url).to.equal(clonedNode.photo_placeholder_url);
        expect(originalNode.share_text).to.equal(clonedNode.share_text);
        expect(originalNode.shareable).to.equal(clonedNode.shareable);
        expect(originalNode.start).to.equal(clonedNode.start);
      });

      it('should prefix the cloned node title with an indication that it\'s been cloned', function () {
        var title = 'some node title';
        var originalNode = ClickventureEdit.addNode();
        originalNode.title = title;

        var clonedNode = ClickventureEdit.cloneNode(originalNode);

        expect(clonedNode.title).to.equal('Clone - ' + title);
      });

      it('should create clones of all outbound links', function () {
        var nodeTo = ClickventureEdit.addNode();
        var nodeFrom = ClickventureEdit.addNode();
        var link1 = ClickventureEdit.addLink(nodeFrom);
        var link2 = ClickventureEdit.addLink(nodeFrom);

        link1.to_node = nodeTo.id;
        link2.to_node = nodeTo.id;
        ClickventureEdit.updateInboundLinks(link1);
        ClickventureEdit.updateInboundLinks(link2);
        var clonedNode = ClickventureEdit.cloneNode(nodeFrom);

        expect(clonedNode.links.length).to.equal(2);
        expect(clonedNode.links[0].to_node).to.equal(link1.to_node);
        expect(clonedNode.links[0]).to.not.equal(link1);
        expect(clonedNode.links[1].to_node).to.equal(link2.to_node);
        expect(clonedNode.links[1]).to.not.equal(link2);
        expect(nodeData.view[nodeTo.id].inboundLinks.length).to.equal(2);
        expect(nodeData.view[nodeTo.id].inboundLinks).to.include(nodeFrom.id);
        expect(nodeData.view[nodeTo.id].inboundLinks).to.include(clonedNode.id);
      });

      it('should clone all statuses', function () {
        var node = ClickventureEdit.addNode();
        var statuses = ['my garbage status', 'trash status one', 'blah balh blah'];

        node.statuses = statuses;
        var clonedNode = ClickventureEdit.cloneNode(node);

        expect(clonedNode.statuses[0]).to.equal(node.statuses[0]);
        expect(clonedNode.statuses[1]).to.equal(node.statuses[1]);
        expect(clonedNode.statuses[2]).to.equal(node.statuses[2]);
      });

      describe('should have a way to deal with sister pages that', function () {
        var node1;
        var node2;
        var node3;
        var node1SisterPages;

        beforeEach(function () {
          node1 = ClickventureEdit.addNode();
          node2 = ClickventureEdit.addNode();
          node3 = ClickventureEdit.addNode();
          node1SisterPages = [node2.id, node3.id];

          node1.sister_pages = node1SisterPages;
        });

        it('should clone all sister page ids', function () {

          var clonedNode = ClickventureEdit.cloneNode(node1);

          expect(clonedNode.sister_pages[0]).to.equal(node1.sister_pages[0]);
          expect(clonedNode.sister_pages[1]).to.equal(node1.sister_pages[1]);
        });

        it('should tell sister pages they have a new sibling', function () {

          var clonedNode = ClickventureEdit.cloneNode(node1);

          expect(node2.sister_pages).to.include(clonedNode.id);
          expect(node3.sister_pages).to.include(clonedNode.id);
        });

        it('should list the original node as a sister, and the original node should list the clone as a sister', function () {

          var clonedNode = ClickventureEdit.cloneNode(node1);

          expect(node1.sister_pages).to.include(clonedNode.id);
          expect(clonedNode.sister_pages).to.include(node1.id);
        });
      });
    });

    describe('should have a way to delete a node that', function () {

      it('should remove the given node', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();

        ClickventureEdit.deleteNode(node2);

        expect(nodeData.nodes.length).to.equal(2);
        expect(nodeData.nodes[0]).to.equal(node1);
        expect(nodeData.nodes[1]).to.equal(node3);
      });

      it('should remove node\'s data from view data', function () {
        var node = ClickventureEdit.addNode();

        ClickventureEdit.deleteNode(node);

        expect(nodeData.view[node.id].node).to.not.equal(node);
      });

      it('should remove deleted node from all links', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var link1 = ClickventureEdit.addLink(node1);
        var link2 = ClickventureEdit.addLink(node1);

        link1.to_node = node2.id;
        link2.to_node = node2.id;
        ClickventureEdit.deleteNode(node2);

        expect(link1.to_node).to.be.null;
        expect(link2.to_node).to.be.null;
      });

      it('should remove deleted node from all sister pages', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.cloneNode(node1);
        var node3 = ClickventureEdit.cloneNode(node2);

        ClickventureEdit.deleteNode(node3);

        expect(node1.sister_pages.length).to.equal(1);
        expect(node1.sister_pages[0]).to.equal(node2.id);
        expect(node2.sister_pages.length).to.equal(1);
        expect(node2.sister_pages[0]).to.equal(node1.id);
      });

      it('should remove deleted node from all inbound links', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();
        var link1 = ClickventureEdit.addLink(node1);
        var link2 = ClickventureEdit.addLink(node1);

        link1.to_node = node2.id;
        ClickventureEdit.updateInboundLinks(link1);
        link1.to_node = node3.id;
        ClickventureEdit.updateInboundLinks(link2);
        ClickventureEdit.deleteNode(node1);

        expect(nodeData.view[node2.id].inboundLinks).to.not.contain(node1.id);
        expect(nodeData.view[node3.id].inboundLinks).to.not.contain(node1.id);
      });

      it('should add a new node if the deleted node was the only node', function () {
        var node = ClickventureEdit.addNode();

        ClickventureEdit.deleteNode(node);

        expect(nodeData.nodes.length).to.equal(1);
        expect(nodeData.nodes[0]).to.not.equal(node);
      });

      it('should select the previous node', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();

        ClickventureEdit.selectNode(node2);
        ClickventureEdit.deleteNode(node2);

        expect(nodeData.nodeActive).to.equal(node1);
      });

      it('should fix node orders in view data', function () {
        var node1 = ClickventureEdit.addNode();
        var node2 = ClickventureEdit.addNode();
        var node3 = ClickventureEdit.addNode();
        var node4 = ClickventureEdit.addNode();

        ClickventureEdit.deleteNode(node3);

        expect(nodeData.view[node1.id].order).to.equal(1);
        expect(nodeData.view[node2.id].order).to.equal(2);
        expect(nodeData.view[node4.id].order).to.equal(3);
      });
    });

    describe('should have a method to retrieve valid link styles that', function () {

      it('should returns valid link styles', function () {

        var linkStyles = ClickventureEdit.getValidLinkStyles();

        expect(linkStyles[0]).to.equal('');
        expect(linkStyles[1]).to.equal('Action');
        expect(linkStyles[2]).to.equal('Dialogue');
        expect(linkStyles[3]).to.equal('Music');
        expect(linkStyles[4]).to.equal('Quiz');
      });
    });
  });
});
