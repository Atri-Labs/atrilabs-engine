# This shell script should be run from inside a python virtual env.
# The version of a the built package is set to 1.0.0.
# This script is only supposed to be run to verify if build is successful.
PIP_EDITABLE_BUILD=true python -m build -s
PIP_EDITABLE_BUILD=true python -m build -w