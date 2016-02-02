const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: path.join('..', '..', '..'),
    frameworks: [
      'chai',
      'mocha',
      'sinon'
    ],
    files: [
      path.join('bower_components', 'angular', 'angular.js'),
      path.join('bower_components', 'angular-bootstrap', 'ui-bootstrap.js'),
      path.join('bower_components', 'angular-mocks', 'angular-mocks.js'),
      path.join('bower_components', 'jquery', 'dist', 'jquery.js'),
      path.join('bower_components', 'lodash', 'lodash.js'),
      path.join('bower_components', 'angular-uuid4', 'angular-uuid4.js'),

      path.join('.tmp', 'django-bulbs-cms-pre-1', 'templates.js'),

      path.join('resources', 'js', 'testing', 'test-helper.js'),
      path.join('src', 'bulbs-cms', '**', '*.js')
    ],
    browsers: ['PhantomJS']
  });
};
