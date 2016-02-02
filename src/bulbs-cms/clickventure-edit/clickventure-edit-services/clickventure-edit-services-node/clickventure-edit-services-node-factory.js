angular.module('bulbs.clickventure.edit.services.node.factory', [
  'lodash'
])
  .factory('ClickventureEditNode', [
    '_',
    function (_) {

      function ClickventureEditNode (props) {
        _.assign(this, {
          id: null,
          body: '',
          finish: false,
          link_style: 'action',
          links: [],
          photo_description: '',
          photo_final: null,
          photo_note: '',
          photo_placeholder_page_url: '',
          photo_placeholder_url: '',
          share_text: '',
          shareable: false,
          sister_pages: [],
          start: false,
          statuses: {},
          title: ''
        }, props);
      };

      return ClickventureEditNode;
    }
  ]);
