/**
 * Copy files into necessary locations.
 */
'use strict';

module.exports = {
  bulbs_cms_to_django_app_pre_1_scripts: {
    dest: '.tmp/django-bulbs-cms-pre-1/static/cms/clickventure',
    src: 'src/bulbs-cms/**/*.js',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_pre_1_styles: {
    dest: '.tmp/django-bulbs-cms-pre-1/static/cms/clickventure',
    src: 'src/bulbs-cms/**/*.less',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_complete: {
    cwd: '.tmp/django-bulbs-cms-pre-1',
    dest: 'compat-builds/django-bulbs-cms',
    src: '**',
    expand: true
  }
};
