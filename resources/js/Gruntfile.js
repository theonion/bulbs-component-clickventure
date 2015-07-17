'use strict';

var rel = function (path) {
  return '../../' + path;
};

module.exports = function (grunt) {
  require(rel('package.json'));

  var config = grunt.util._.extend(
    require('./tasks/config'),
    require('load-grunt-config')(grunt, {
      configPath: require('path').join(process.cwd(), 'tasks/options'),
      init: false
    });
  );

  config.relToRoot = rel;

  grunt.initConfig(config);

  grunt.loadTasks('tasks');

};
