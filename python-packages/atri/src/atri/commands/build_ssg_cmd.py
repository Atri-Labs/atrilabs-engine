from .load_exe import get_unzipped_host_path
from ..utils.run_shell_cmd import run_shell_cmd
from ..utils.globals import globals
from pathlib import Path

async def build_ssg_cmd():
    child_proc = await run_shell_cmd(
        " ".join([str(get_unzipped_host_path()), "build", "ssg"]),
        str(Path.cwd() / "atri_app"),
        not globals["in_debug_mode"]
        )
    return child_proc

async def build_ssg_cmd_wrapper():
    child_proc = await build_ssg_cmd()
    await child_proc.wait()
    if child_proc.returncode == 0:
        print("SSG build successfull!")