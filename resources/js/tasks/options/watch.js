/**
 * Watch files for changes and rebuild.
 */

module.exports = {
  options: {
    atBegin: true,
  },
  dev: {
    files: ['src/bulbs-cms/**/*'],
    tasks: ['build_bulbs_cms_for_django']
  },
  test: {
    files: ['src/bulbs-cms/**/*'],
    tasks: [
      'bulbs_cms_pre_dist',
      'karma:unit:run'
    ]
  }
};
