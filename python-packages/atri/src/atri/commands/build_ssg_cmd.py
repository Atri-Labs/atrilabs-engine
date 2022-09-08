from .load_exe import get_unzipped_host_path
from ..utils.run_shell_cmd import run_shell_cmd
import os

async def build_ssg_cmd():
    child_proc = await run_shell_cmd(" ".join(str(get_unzipped_host_path()), "build", "ssg"), os.getcwd(), not globals["in_debug_mode"])
    return child_proc