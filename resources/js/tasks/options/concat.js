/**
 * Concat js files.
 */
var config = require('../config');

module.exports = {
  bulbs_cms_to_django_app_pre_2_scripts: {
    src: config.buildPath() + '/django-bulbs-cms-pre-1/*.js',
    dest: config.buildPath() + '/django-bulbs-cms-pre-2/clickventure.js'
  }
};
