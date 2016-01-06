/**
 * Watch files for changes and rebuild.
 */
'use strict';

module.exports = {
  files: ['src/bulbs-cms/**/*'],
  tasks: ['build_bulbs_cms_for_django']
};
