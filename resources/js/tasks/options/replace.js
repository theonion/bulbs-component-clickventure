/**
 * Replace things in files.
 */
'use strict';

module.exports = {
  bulbs_cms_to_django_app_pre_1_html: {
    options: {
      patterns: [{
        match: /{{[\w\s\.]+}}/g,
        replacement: function (content) {
          return '{% verbatim %}' + content + '{% endverbatim %}';
        }
      }]
    },
    files: [{
      cwd: 'src/bulbs-cms',
      dest: '.tmp/django-bulbs-cms-pre-1/templates/cms/partials/clickventure',
      src: '**/*.html',
      expand: true,
      flatten: true
    }]
  }
};
