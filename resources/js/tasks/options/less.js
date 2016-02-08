/**
 * Compile less to css.
 */
var config = require('../config');

module.exports = {
  bulbs_cms_to_django_app_pre_2_styles: {
    src: 'src/bulbs-cms/**/*.less',
    dest: config.buildPath() + '/django-bulbs-cms-pre-2/clickventure.css'
  }
};
