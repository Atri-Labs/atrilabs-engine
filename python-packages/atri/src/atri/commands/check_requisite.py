import asyncio
from ..utils.printd import printd
from ..errors import SELECTED_VIRTENV_NOT_INSTALLED, PYTHON_NOT_INSTALLED, PIP_NOT_INSTALLED
from ..utils.is_pkg_installed import is_selected_virtenv_installed
from ..find_app_root import get_virtualenv_type
from ..utils.conda_utils import is_pkg_installed_in_env, get_working_env_name
from pathlib import Path

async def check_docker_installed():
    child_proc = await asyncio.create_subprocess_shell(
        "docker images",
        stderr=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE
        )
    # call communicate otherwise it might go into deadlock
    # refer https://docs.python.org/3/library/asyncio-subprocess.html
    _, stderr = await child_proc.communicate()
    if child_proc.returncode != 0:
        print(
            "Please install docker.",
            "If docker is already installed, then please make sure that docker daemon is running."
            )
        printd("[stderr]\n", stderr.decode("utf-8"))
        return False
    return True

async def check_selected_virtenv_is_installed():
    return await is_selected_virtenv_installed()

async def check_requisite():
    is_selected_virtenv_installed = await check_selected_virtenv_is_installed()
    if not is_selected_virtenv_installed:
        return SELECTED_VIRTENV_NOT_INSTALLED
    if get_virtualenv_type() == "conda":
        is_python_installed = is_pkg_installed_in_env(get_working_env_name(), "python", str(Path.cwd()))
        if not is_python_installed:
            return PYTHON_NOT_INSTALLED
        is_pip_installed = is_pkg_installed_in_env(get_working_env_name(), "pip", str(Path.cwd()))
        if not is_pip_installed:
            return PIP_NOT_INSTALLED
    return 0