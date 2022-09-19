from .load_exe import get_unzipped_host_path
from ..utils.run_shell_cmd import run_shell_cmd
from ..utils.globals import globals
from pathlib import Path

async def deploy_ssg_gh_pages():
    child_proc = await run_shell_cmd(
        " ".join([str(get_unzipped_host_path()), "deploy", "ssg", "--gh-pages"]),
        str(Path.cwd() / "atri_app"),
        not globals["in_debug_mode"]
        )
    return child_proc

async def deploy_ssg_gh_pages_wrapper():
    child_proc = await deploy_ssg_gh_pages()
    await child_proc.wait()
    if child_proc.returncode == 0:
        print("Successfully deployed to github pages!")