/**
 * Copy files into necessary locations.
 */
'use strict';

module.exports = {
  bulbs_cms_to_django_app_pre_1_scripts: {
    dest: '.tmp/django-bulbs-cms-pre-1/',
    src: 'src/bulbs-cms/**/*.js',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_pre_1_styles: {
    dest: '.tmp/django-bulbs-cms-pre-1/',
    src: 'src/bulbs-cms/**/*.less',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_complete: {
    cwd: '.tmp/django-bulbs-cms-pre-2',
    dest: 'compat-builds/django-bulbs-cms/static/cms/clickventure/',
    src: '**',
    expand: true
  }
};
