
/**
 * Creates a cachable templates js file for quick template access.
 */
var config = require('../config');

module.exports = {
  templates: {
    cwd: 'src/bulbs-cms/clickventure-edit',
    src: '**/*.html',
    dest: config.buildPath() + '/django-bulbs-cms-pre-1/templates.js',
    options: {
      htmlmin: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      module: 'bulbs.clickventure.templates',
      standalone: true
    }
  }
};
