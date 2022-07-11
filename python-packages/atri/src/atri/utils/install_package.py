from .run_shell_cmd import run_shell_cmd

def install_with_pipenv(cwd: str, pkg: str = "", version: str = ""):
    child_proc = run_shell_cmd("pipenv install " + pkg + version, cwd)
    return child_proc