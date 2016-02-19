# bulbs-component-clickventure
Clickventure content type component for bulbs projects.

## Setup
Using this project requires dependency setup and implementation of provided
Django apps. The site refers to the site that this component is being installed in.

### Python and Bower Dependencies
From the site using this component:

1. Add a dependency for this project in ```requirements.txt```, where ```<version>```
is the version to install:
  ```
  git+https://0469c955e10241b40fffe0225e29a3c238aadf69:x-oauth-basic@github.com/theonion/bulbs-component-clickventure.git@<version>#egg=bulbs-component-clickventure
  ```

1. Run ```pip install -r requirements.txt``` on requirements file in the correct
context to install this project's Django apps.

1. Install bower dependencies, where ```<version>``` is the version to
install which should match the ```<version>``` used in ```requirements.txt```:
  ```bash
  $ bower install --save https://0469c955e10241b40fffe0225e29a3c238aadf69:x-oauth-basic@github.com/theonion/bulbs-component-clickventure.git\#\<version>
  ```

### Implementation
1. Create a clickventure package in the site's app directory.
1. Add ```"bulbs_component_clickventure"``` to ```INSTALLED_APPS``` in Django's settings file.
1. Add a ```models.py``` that implements ```bulbs_component_clickventure.models.ClickventureMixin```.
1. Create a migration for your app with Django migrations as you would any other app.

#### Implementing Public Resources
To use the public templates, scripts, and styles:

1. Include ```"bulbs_component_clickventure_public"``` in ```INSTALLED_APPS``` in
Django's settings file.

1. Create a detail page with the following template logic included:
  ```html
  {% include "clickventure/partials/clickventure.html" with content=<content-variable> share_partial_template="<share-template-path>" %}
  ```
  Where ```<share-template-path>``` is the path to a share template, and
  ```<content-variable>``` is the name of the variable containing the content's data.
  Note: you can use the ```{% with %}``` Django template tag to customize variables in
  the share template.

#### Implementing CMS Resources
To use the CMS templates, scripts, and styles:

1. Include ```"bulbs_component_clickventure_cms"``` in ```INSTALLED_APPS``` in
Django's settings file.

1. Create a CMS page with the following html:
  ```html
  <clickventure-edit article="content"></clickventure-edit>
  ```
  Where ```content``` is an angular scope variable containing the content's data.

1. Add ```bulbs.clickventure``` as a dependency for your CMS's Angular app.


## django-bulbs-cms Package
```compat-builds/django-bulbs-cms``` should not be edited directly. This app exists only until
CMS files are completely migrated out of django. To make changes to this package,
edit files located in ```src/bulbs-cms``` then run ```grunt build_bulbs_cms_for_django```
to rebuild ```compat-builds/django-bulbs-cms``` with your changes.

Commit your changes and the rebuilt package, then reinstall the app on whatever
project(s) require the changes.

## Development

### Setting up your environment
To prep your environment for development:
```bash
$ ./scripts/dev-setup
```

### Testing javascript
To run a continuous test:
```bash
$ ./scripts/test-js
```
To do a single test run:
```bash
$ ./scripts/test-js --single-run
```

### Building
For continuous builds while you develop:
```bash
./scripts/dev-start
```
or to run a single build, as in creating a build for release:
```bash
$ ./scripts/build
```
See [django-bulbs-cms Package](#django-bulbs-cms-package) section for more info.
