var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: path.join('..', '..', '..'),
    frameworks: [
      'chai',
      'mocha',
      'sinon'
    ],
    files: [
      path.join('./src', 'bulbs-cms', '**', '*.spec.js')
    ],
    browsers: ['PhantomJS']
  });
};
