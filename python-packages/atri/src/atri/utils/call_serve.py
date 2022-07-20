from ..find_app_root import get_virtualenv_type
from ..errors import UNKNOWN_VIRT_TYPE
from .. import supported_virt_types
from .run_shell_cmd import run_shell_cmd
from .globals import globals
from .conda_utils import get_working_env_name

def get_common_command():
    return "python -m controllers.server serve"

async def pipenv_call_serve(app_dir: str):
    cmd = "pipenv run" + " " + get_common_command()
    python_server_proc = await run_shell_cmd(
        cmd,
        app_dir,
        not globals["in_debug_mode"]
        )
    return python_server_proc

async def conda_call_serve(app_dir: str):
    cmd = "conda run -n " + get_working_env_name() + " " + get_common_command()
    python_server_proc = await run_shell_cmd(
        cmd,
        app_dir,
        not globals["in_debug_mode"]
        )
    return python_server_proc

async def call_serve(app_dir: str):
    virt_type = get_virtualenv_type()
    if virt_type == "pipenv":
        return await pipenv_call_serve(app_dir)
    elif virt_type == "conda":
        return await conda_call_serve(app_dir)
    else:
        print("Error:", "Unsupported virtual environment", virt_type)
        print("Please use a virtual environment from this list:")
        print(supported_virt_types)
        exit(UNKNOWN_VIRT_TYPE)