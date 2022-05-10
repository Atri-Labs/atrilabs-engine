import sys
import setuptools

try:
    from pipenv.project import Project
    try:
        # Pipenv 2022.4.8
        from pipenv.utils.dependencies import convert_deps_to_pip
    except:
        # Older Pipenv
        from pipenv.utils import convert_deps_to_pip
except:
    err_msg = "Please install pipenv and try again."
    sys.exit(err_msg)

NAME = "atri"

VERSION = "0.0.1"

DESCRIPTION = "The best tools to build better and fast apps"

LONG_DESCRIPTION = (
    "A full stack framework that let's you drag-&-drop components to build apps."
    "The backend of these apps can be very easily built using Python."
    "It (semi-)automates many things out of the box such as CDN caching, browser caching etc."
)

pipfile = Project(chdir=False).parsed_pipfile
packages = pipfile["packages"].copy()
requirements = convert_deps_to_pip(packages, r = False)

setuptools.setup(
    name=NAME,
    version=VERSION,
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    url="https://atrilabs.com",
    project_urls={
        "Source": "https://github.com/cruxcode/atrilabs-engine.git"
    },
    author="Atri Labs",
    author_email="shyam.swaroop@atrilabs.com",
    python_requires=">=3.6",
    license="GPLv3",
    package_dir="src",
    packages=setuptools.find_packages(where="src"),
    install_requires=requirements,
    zip_safe=False,
    include_package_data=True,
    entry_points={"console_scripts": ["atri=atri.cli:main"]}
)