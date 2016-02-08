angular.module('bulbs.clickventure.edit.services.node.link.service', [
  'lodash'
])
  .service('ClickventureEditNodeLink', [
    '_',
    function (_) {

      return {
        prepOrCreate: function (data) {
          return _.defaults(data, {
            order: null,
            body: '',
            from_node: null,
            to_node: null,
            transition: '',
            link_style: null,
            float: false
          });
        }
      };
    }
  ]);
