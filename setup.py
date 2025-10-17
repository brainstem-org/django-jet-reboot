import os
from setuptools import setup, find_packages


def read(fname):
    path = os.path.join(os.path.dirname(__file__), fname)
    try:
        file = open(path, encoding='utf-8')
    except TypeError:
        file = open(path)
    return file.read()


def get_install_requires():
    install_requires = ['Django']
    return install_requires


def get_version():
    """Read version from jet/__init__.py without importing the module."""
    version_file = os.path.join(os.path.dirname(__file__), 'jet', '__init__.py')
    with open(version_file, encoding='utf-8') as f:
        for line in f:
            if line.startswith('VERSION'):
                # Extract version string from VERSION='x.y.z'
                return line.split('=')[1].strip().strip("'").strip('"')
    raise RuntimeError('Unable to find version string.')


setup(
    name='django-jet-reboot',
    version=get_version(),
    description='Modern template for Django admin interface with improved functionality',
    long_description=read('README.rst'),
    long_description_content_type='text/x-rst',
    author='Denis Kildishev && assem-ch',
    url='https://github.com/assem-ch/django-jet-reboot',
    packages=find_packages(),
    license='AGPLv3',
    python_requires='>=3.6',
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Framework :: Django',
        'License :: Free for non-commercial use',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Intended Audience :: Developers',
        'Intended Audience :: System Administrators',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.9',
        'Environment :: Web Environment',
        'Topic :: Software Development',
        'Topic :: Software Development :: User Interfaces',
    ],
    zip_safe=False,
    include_package_data=True,
    install_requires=get_install_requires()
)
