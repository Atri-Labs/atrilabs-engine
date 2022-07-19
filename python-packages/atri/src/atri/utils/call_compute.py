from ..find_app_root import get_virtualenv_type
from ..errors import UNKNOWN_VIRT_TYPE
from .. import supported_virt_types
import subprocess
from .conda_utils import get_working_env_name


def get_common_command(route: str, page_state: str):
    common_command = ["python", "-m", "controllers.server", "compute", "--route", route, "--state", page_state]
    return common_command

async def pipenv_call_compute(app_dir: str, route: str, page_state: str):
    child_proc = subprocess.Popen(
        ["pipenv", "run", *get_common_command(route, page_state)],
        stdout=subprocess.PIPE,
        cwd=app_dir
        )
    out = child_proc.stdout.read()
    return out

async def conda_call_compute(app_dir: str, route: str, page_state: str):
    child_proc = subprocess.Popen(
        ["conda", "run", "-n", get_working_env_name(), *get_common_command(route, page_state)],
        stdout=subprocess.PIPE,
        cwd=app_dir
        )
    out = child_proc.stdout.read()
    return out

async def call_compute(app_dir: str, route: str, page_state: str):
    virt_type = get_virtualenv_type()
    if virt_type == "pipenv":
        return await pipenv_call_compute(app_dir, route, page_state)
    elif virt_type == "conda":
        return await conda_call_compute(app_dir, route, page_state)
    else:
        print("Error:", "Unsupported virtual environment", virt_type)
        print("Please use a virtual environment from this list:")
        print(supported_virt_types)
        exit(UNKNOWN_VIRT_TYPE)