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

  grunt.task.registerTask(
    'bulbs_cms_to_django_app_init_py',
    'Create an __init__.py file for django-bulbs-cms app.',
    function () {
      grunt.file.write('compat-builds/django-bulbs-cms/__init__.py');
    }
  );

  grunt.task.registerTask(
    'bulbs_cms_pre_dist',
    [
      // clean out old files
      'clean:tmp',
      'clean:builds_django_bulbs_cms',
      // copy scripts and styles into a django compatibile package
      'copy:bulbs_cms_to_django_app_pre_1_scripts',
      'copy:bulbs_cms_to_django_app_pre_1_styles',
      // put html into template file
      'ngtemplates'
    ]
  );

  grunt.registerTask(
    'build_bulbs_cms_for_django',
    'Convert bulbs-cms project to pre-cms-separation django app.',
    [
      'bulbs_cms_pre_dist',
      // concat/compile files
      'concat:bulbs_cms_to_django_app_pre_2_scripts',
      'less:bulbs_cms_to_django_app_pre_2_styles',
      // do the rest of prep needed for django app
      'bulbs_cms_to_django_app_init_py',
      // copy the whole thing into a place where setup.py can pick it up
      'copy:bulbs_cms_to_django_app_complete',
      // cleanup
      'clean:tmp'
    ]
  );
};
