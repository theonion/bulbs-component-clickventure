angular.module('bulbs.clickventure.edit.nodeNameFilter', [])
  .filter('clickventure_node_name', [
    function () {

      return function (node) {
        var title = '';

        if (typeof node.title === 'string' && node.title.length > 0) {
          title = node.title;
        } else {
          title = 'Page ' + node.id;
        }

        return title;
      };
    }
  ]);
