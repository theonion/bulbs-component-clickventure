angular.module('bulbs.clickventure.edit.services.node.service', [
  'bulbs.clickventure.edit.services.node.link.service',
  'lodash'
])
  .service('ClickventureEditNode', [
    '_', 'ClickventureEditNodeLink',
    function (_, ClickventureEditNodeLink) {

      return {
        prepOrCreate: function (data) {
          var reference = _.defaults(data, {
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
          });

          // wrap each link properly
          reference.links = reference.links.map(function (link, i) {
            link.from_node = reference.id;

            return ClickventureEditNodeLink.prepOrCreate(link);
          });

          return reference;
        }
      };
    }
  ]);
