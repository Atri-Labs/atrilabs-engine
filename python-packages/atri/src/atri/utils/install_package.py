from .run_shell_cmd import run_shell_cmd

async def install_with_pipenv(cwd: str, pkg: str = "", version: str = ""):
    full_install_path = pkg if version == "*" else pkg + version
    child_proc = await run_shell_cmd("pipenv install " + full_install_path, cwd)
    return child_proc