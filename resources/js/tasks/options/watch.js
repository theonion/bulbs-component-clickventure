/**
 * Watch files for changes and rebuild.
 */

module.exports = {
  options: {
    atBegin: true,
  },
  files: ['src/bulbs-cms/**/*'],
  tasks: ['build_bulbs_cms_for_django']
};
