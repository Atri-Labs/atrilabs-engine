import setuptools
import json
from pathlib import Path

with open(str(Path.cwd() / "src" / "config" / "package.json")) as f:
    package_json = json.load(f)

try:
    name = package_json["atriConfig"]["pythonPackageName"]

    version = package_json["version"]

    description = package_json["description"]

    long_description = package_json["description"]

    [author, author_email] = package_json["author"].split(" ")

    author_email = author_email.replace("<", "").replace(">", "")

    url = package_json["homepage"] if "homepage" in package_json else ""

    source = package_json["repository"]["url"]

except KeyError as e:
    key = e.args[0]
    print(f"Please add {key} field in the package.json.")
    exit(1)

setuptools.setup(
    name=name,
    version=version,
    description=description,
    long_description=long_description,
    url=url,
    project_urls={
        "Source": source
    },
    author=author,
    author_email=author_email,
    python_requires=">=3.7",
    license="GPLv3",
    package_dir={"": "src", "config": "src/config"},
    packages=setuptools.find_packages(where="src"),
    install_requires=["atri_core"],
    zip_safe=False,
    include_package_data=True,
    package_data={'': ["*.json"]}
)