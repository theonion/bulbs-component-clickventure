/**
 * Deletes given files and folders.
 */
var config = require('../config');

module.exports = {
  tmp: [config.buildPath()],
  dist: ['dist'],
  builds_django_bulbs_cms: ['compat-builds/django-bulbs-cms'],
};
