from .load_exe import get_unzipped_host_path
from ..utils.run_shell_cmd import run_shell_cmd
import os

async def deploy_ssg_gh_pages():
    child_proc = await run_shell_cmd(" ".join(str(get_unzipped_host_path()), "deploy", "ssg", "--gh-pages"), os.getcwd(), not globals["in_debug_mode"])
    return child_proc