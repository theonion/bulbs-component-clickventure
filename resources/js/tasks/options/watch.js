/**
 * Watch files for changes and rebuild.
 */
'use strict';

module.exports = {
  files: [
    'src/bulbs-cms/**/*.html'
  ],
  tasks: [
    // clean out old files
    'clean:tmp',
    'clean:builds_django_bulbs_cms',
    // copy scripts and styles into a django compatibile package
    'copy:bulbs_cms_to_django_app_pre_1_scripts',
    'copy:bulbs_cms_to_django_app_pre_1_styles',
    // copy html to package, do verbatim wrapping for django compatibility
    'replace:bulbs_cms_to_django_app_pre_1_html',
    // do the rest of prep needed for django app
    'bulbs_cms_to_django_app_pre_1_init_py',
    // copy the whole thing into a place where setup.py can pick it up
    'copy:bulbs_cms_to_django_app_complete',
    // cleanup
    'clean:tmp'
  ]
};
