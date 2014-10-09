from setuptools import setup, find_packages
import os

version = "4.5.2"

with open("requirements.txt", "r") as f:
	install_requires = f.readlines()

setup(
    name='erpnext',
    version=version,
    description='Open Source ERP',
    author='Web Notes Technologies',
    author_email='support@erpboost.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
