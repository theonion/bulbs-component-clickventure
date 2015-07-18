/**
 * Copy files into necessary locations.
 */
'use strict';

module.exports = {
  bulbs_cms_to_django_app_pre_1_scripts: {
    dest: '.tmp/django-bulbs-cms-pre-1/static/js',
    src: 'src/bulbs-cms/**/*.js',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_pre_1_html: {
    dest: '.tmp/django-bulbs-cms-pre-1/templates/clickventure',
    src: 'src/bulbs-cms/**/*.html',
    expand: true,
    flatten: true
  },
  bulbs_cms_to_django_app_complete: {
    cwd: '.tmp/django-bulbs-cms-pre-1',
    dest: 'src/django-bulbs-cms',
    src: '**',
    expand: true
  }
};
