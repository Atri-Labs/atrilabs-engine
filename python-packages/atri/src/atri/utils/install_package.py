from .run_shell_cmd import run_shell_cmd
from ..find_app_root import get_virtualenv_type
from ..errors import UNKNOWN_VIRT_TYPE
from .. import supported_virt_types
from .run_shell_cmd import run_shell_cmd
from .conda_utils import get_working_env_name

async def install_with_pipenv(app_dir: str, pkg: str, version: str):
    full_install_path = pkg if version == "*" else pkg + "==" + version
    child_proc = await run_shell_cmd("pipenv install " + full_install_path, app_dir)
    return child_proc

async def install_with_conda(app_dir: str, pkg: str, version: str):
    full_install_path = pkg if version == "*" else pkg + "==" + version
    child_proc = await run_shell_cmd("conda run -n " + get_working_env_name() + " python -m pip install " + full_install_path, app_dir)
    return child_proc

async def install_package(app_dir: str, pkg: str, version: str):
    virt_type = get_virtualenv_type()
    if virt_type == "pipenv":
        return await install_with_pipenv(app_dir, pkg, version)
    elif virt_type == "conda":
        return await install_with_conda(app_dir, pkg, version)
    else:
        print("Error:", "Unsupported virtual environment", virt_type)
        print("Please use a virtual environment from this list:")
        print(supported_virt_types)
        exit(UNKNOWN_VIRT_TYPE)