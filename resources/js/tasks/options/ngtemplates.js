
/**
 * Creates a cachable templates js file for quick template access.
 */
'use strict';

module.exports = {
  templates: {
    cwd: 'src/bulbs-cms/clickventure-edit',
    src: '**/*.html',
    dest: '.tmp/django-bulbs-cms-pre-1/templates.js',
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
