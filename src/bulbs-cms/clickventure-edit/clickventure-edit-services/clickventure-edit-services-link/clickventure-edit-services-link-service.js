angular.module('bulbs.clickventure.edit.services.link', [
  'lodash'
])
  .service('ClickventureEditLink', [
    '_', '$filter',
    function (_, $filter) {

      return {
        getValidLinkStyles: function () {
          return [
            '',
            'Action',
            'Dialogue',
            'Music',
            'Quiz'
          ];
        },
        getValidNodeTransitions: function () {
          return [
            'default',
            'slideLeft',
            'slideRight',
            'slideUp',
            'slideDown',
            'flipLeft'
          ];
        },
        addLink: function (node) {
          var link = {
            body: '',
            from_node: node.id,
            to_node: null,
            transition: '',
            link_style: node.link_style,
            float: false
          };

          node.links.push(link);

          return link;
        },
        updateInboundLinks: function (link) {
          if (typeof link.to_node === 'number') {
            var links = data.view[link.to_node].inboundLinks;

            if (links.indexOf(link.from_node) < 0) {
              links.push(link.from_node);
            }
          }
        },
        reorderLink: function (node, indexFrom, indexTo) {
          if (indexFrom >= 0 && indexTo >= 0 && indexTo < node.links.length) {
            var link = node.links[indexFrom];
            node.links.splice(indexFrom, 1);
            node.links.splice(indexTo, 0, link);
          }
        },
        deleteLink: function (node, rmLink) {
          var indexLinks = node.links.indexOf(rmLink);
          node.links.splice(indexLinks, 1);

          if (typeof rmLink.to_node !== 'number') {
            var linksInbound = data.view[rmLink.to_node].inboundLinks;
            var indexInbound = linksInbound.indexOf(rmLink.from_node);
            linksInbound.splice(indexInbound, 1);
          }
        }
      };
    }
  ]);
