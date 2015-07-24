# -*- coding: utf-8 -*-
import subprocess

from setuptools import setup, find_packages
from setuptools.command.install import install as _install

name = "bulbs-component-clickventure"
version = "0.0.9"

requires = [
    "django-bulbs==0.6.1",
    "django-jsonfield==0.9.13"
]

dev_requires = [
    "virtualenv==13.0.3"
]

repo = "https://0469c955e10241b40fffe0225e29a3c238aadf69:x-oauth-basic@github.com/theonion/{}.git#{}".format(name, version)

class InstallBowerComponents(_install):
    """Run bower commands to install bower deps."""

    def run(self):
        _install.run(self)
        subprocess.call("./node_modules/.bin/bower install --save {}", shell=True)

setup(
    name=name,
    version=version,
    description="Clickventure component for bulbs.",
    license="MIT",
    author="Andrew Kos",
    author_email="akos@theonion.com",
    package_dir={
        "bulbs_component_clickventure": "src/django-bulbs",
        "bulbs_component_clickventure_public": "src/django-bulbs-public",
        "bulbs_component_clickventure_cms": "compat-builds/django-bulbs-cms"
    },
    packages=[
        "bulbs_component_clickventure",
        "bulbs_component_clickventure_public",
        "bulbs_component_clickventure_cms"
    ],
    include_package_data=True,
    install_requires=requires,
    extras_require={
        "dev": dev_requires
    },
    # post install
    cmdclass={"install": InstallBowerComponents}
)
