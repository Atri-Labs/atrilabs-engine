from typing import Union, List
import subprocess
import re

def get_conda_env_list(app_dir: str) -> List[str]:
    """
    Get list of conda env names.
    """
    child_proc = subprocess.Popen(
        ["conda", "env", "list"],
        stdout=subprocess.PIPE,
        cwd=app_dir
        )
    out = child_proc.stdout.read().decode("utf-8")
    # parse lines starting without #
    env_names: List[str] = []
    for line in out.splitlines():
        if not re.search("^#", line):
            for ind, a in enumerate(line):
                if a.isspace():
                    env_name = line[0:ind]
                    env_names.append(env_name)
                    break
    return env_names

def get_active_env_name(app_dir: str) -> Union[str, None]:
    """
    Returns name of the active conda environment if any otherwise None.
    """
    child_proc = subprocess.Popen(
        ["conda", "env", "list"],
        stdout=subprocess.PIPE,
        cwd=app_dir
        )
    out = child_proc.stdout.read().decode("utf-8")
    env_name: Union[str, None] = None
    for line in out.splitlines():
        if not re.search("^#", line):
            temp_env_name: Union[str, None] = None
            for ind, a in enumerate(line):
                # find first space and store the string before it in temp variable
                if a.isspace() and temp_env_name == None:
                    temp_env_name = line[0:ind]
                # find * in the line
                if a == "*" and temp_env_name != None:
                    env_name = temp_env_name
                    break
        if env_name != None:
            break
    return env_name

def is_pkg_installed_in_env(env_name: str, pkg_name: str, app_dir: str) -> bool:
    """
    check if packages like python and pip are installed
    """
    child_proc = subprocess.Popen(
        ["conda", "list", "-n", env_name],
        stdout=subprocess.PIPE,
        cwd=app_dir
        )
    out = child_proc.stdout.read().decode("utf-8")
    # parse lines starting without #
    for line in out.splitlines():
        if not re.search("^#", line):
            for ind, a in enumerate(line):
                if a.isspace():
                    curr_pkg_name = line[0:ind]
                    if curr_pkg_name == pkg_name:
                        return True
                    break
    return False

working_env_name: Union[str, None]
def set_working_env_name(name: str):
    global working_env_name
    working_env_name = name
def get_working_env_name():
    return working_env_name
