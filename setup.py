# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

requires = [
    "django-bulbs==0.6.0",
    "django-jsonfield==0.9.13"
]

dev_requires = [
    "virtualenv==13.0.3"
]

setup(
    name="bulbs-component-clickventure",
    version="0.0.1",
    description="Clickventure component for bulbs-cms.",
    license="MIT",
    author="Andrew Kos",
    author_email="akos123@gmail.com",
    package_dir={
        "bulbs_component_clickventure": "src/django-bulbs",
    },
    packages=[
        "bulbs_component_clickventure"
    ],
    include_package_data=True,
    install_requires=requires,
    extras_require={
        "dev": dev_requires
    }
)
