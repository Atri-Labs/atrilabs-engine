import subprocess
from .printd import printd

def pipenv_where():
    child_process = subprocess.Popen(
        ["pipenv", "--where"],
        stdout=subprocess.PIPE,
        stdin=subprocess.DEVNULL,
        stderr=subprocess.PIPE
        )
    if child_process.returncode == 0:
        return str(child_process.stdout.read())
    else:
        print("Failed to detect pipenv project's root directory.")
        printd("[pipenv_where] STDOUT", child_process.stdout.read())
        printd("[pipenv_where] STDERR", child_process.stderr.read())