angular.module('bulbs.clickventure.edit.services.node.link.factory', [
  'lodash'
])
  .factory('ClickventureEditNodeLink', [
    '_',
    function (_) {

      function ClickventureEditNodeLink (props) {
        _.assign(this, {
          body: '',
          from_node: null,
          to_node: null,
          transition: '',
          link_style: null,
          float: false
        }, props);
      };

      return ClickventureEditNodeLink;
    }
  ]);
