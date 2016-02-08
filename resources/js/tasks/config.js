/**
 * Custom configuration variables to use in tasks and other grunt files.
 */

var grunt = require('grunt');

var Config = {
  environment: function() {
    return grunt.option('target') || process.env.APP_ENV || 'local';
  },
  buildPath: function () {
    return grunt.option('buildPath') || '.build';
  }
};

module.exports = Config;
