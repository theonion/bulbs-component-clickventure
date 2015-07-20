'use strict';

module.exports = function (grunt) {
  require('./package.json');

  var config = grunt.util._.extend(
    require('./resources/js/tasks/config'),
    require('load-grunt-config')(grunt, {
      configPath: require('path').join(process.cwd(), 'resources/js/tasks/options'),
      init: false
    })
  );

  grunt.initConfig(config);

  grunt.loadTasks('resources/js/tasks');

};
