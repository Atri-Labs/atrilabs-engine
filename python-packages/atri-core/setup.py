import os
import re
import subprocess

import setuptools


def get_git_tag() -> str:
    # TODO: This is a hack. We should use setuptools_scm instead.
    try:
        git_tag = str(
            subprocess.check_output(["git", "describe", "--exact-match", "--abbrev=0"], stderr=subprocess.STDOUT)
        ).strip("'b\\n")

        return git_tag
    except subprocess.CalledProcessError as exc_info:
        match = re.search("fatal: no tag exactly matches '(?P<commit>[a-z0-9]+)'", str(exc_info.output))
        if match:
            commit = match.group("commit")
            message = f"Bailing: there is no git tag for the current commit, {commit}"
        else:
            message = str(exc_info.output)
        raise Exception(message)


NAME = "atri-core"
VERSION = "1.0.0" if os.getenv("PIP_EDITABLE_BUILD") == "true" else get_git_tag()[1:]
DESCRIPTION = "The best tools to build better and fast apps"
LONG_DESCRIPTION = (
    "A full stack framework that let's you drag-&-drop components to build apps."
    "The backend of these apps can be very easily built using Python."
    "It (semi-)automates many things out of the box such as CDN caching, browser caching etc."
)


setuptools.setup(
    name=NAME,
    version=VERSION,
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    url="https://atrilabs.com",
    project_urls={"Source": "https://github.com/cruxcode/atrilabs-engine.git"},
    author="Atri Labs",
    author_email="shyam.swaroop@atrilabs.com",
    python_requires=">=3.7",
    license="GPLv3",
    package_dir={"": "src"},
    packages=setuptools.find_packages(where="src"),
    install_requires=[],
    zip_safe=False,
    include_package_data=True,
)
