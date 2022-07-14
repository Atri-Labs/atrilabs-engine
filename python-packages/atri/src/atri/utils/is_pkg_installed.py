from .run_shell_cmd import run_shell_cmd
import os
from .globals import globals

async def is_pipenv_installed():
    child_proc = await run_shell_cmd("pipenv --version", os.getcwd(), globals["in_debug_mode"])
    await child_proc.wait()
    if child_proc.returncode == 0:
        return True
    return False