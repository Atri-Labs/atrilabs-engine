import subprocess
from .run_shell_cmd import run_shell_cmd
import os
from .globals import globals
from ..find_app_root import get_virtualenv_type
from ..errors import UNKNOWN_VIRT_TYPE
from .. import supported_virt_types

async def is_pipenv_installed():
    child_proc = await run_shell_cmd("pipenv --version", os.getcwd(), globals["in_debug_mode"])
    await child_proc.wait()
    if child_proc.returncode == 0:
        return True
    return False

async def is_conda_installed():
    child_proc = await run_shell_cmd("conda --version", os.getcwd(), globals["in_debug_mode"])
    await child_proc.wait()
    if child_proc.returncode == 0:
        return True
    return False

def is_conda_installed_sync() -> bool:
    try:
        child_proc = subprocess.Popen(["conda", "--version"], stderr=subprocess.PIPE, stdout=subprocess.PIPE, stdin=subprocess.DEVNULL)
        child_proc.wait()
        if child_proc.returncode == 0:
            return True
        return False
    except:
        return False

async def is_selected_virtenv_installed():
    virt_type = get_virtualenv_type()
    if virt_type == "pipenv":
        return await is_pipenv_installed()
    elif virt_type == "conda":
        return await is_conda_installed()
    else:
        print("Error:", "Unsupported virtual environment", virt_type)
        print("Please use a virtual environment from this list:")
        print(supported_virt_types)
        exit(UNKNOWN_VIRT_TYPE)