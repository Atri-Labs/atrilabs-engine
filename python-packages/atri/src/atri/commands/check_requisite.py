import asyncio
from ..utils.printd import printd

async def check_docker_installed():
    child_proc = await asyncio.create_subprocess_shell(
        "docker images",
        stderr=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE
        )
    # call communicate otherwise it might go into deadlock
    # refer https://docs.python.org/3/library/asyncio-subprocess.html
    _, stderr = await child_proc.communicate()
    if child_proc.returncode != 0:
        print(
            "Please install docker.",
            "If docker is already installed, then please make sure that docker daemon is running."
            )
        printd("[stderr]\n", stderr.decode("utf-8"))
        return False
    return True

async def check_requisite():
    is_docker_installed = await check_docker_installed()
    if is_docker_installed:
        return True
    return False