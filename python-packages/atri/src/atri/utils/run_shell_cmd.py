import asyncio

async def run_shell_cmd(cmd: str, cwd: str, pipe: bool = True):
    proc = await asyncio.create_subprocess_shell(
        cmd,
        stdout=asyncio.subprocess.PIPE if pipe else None,
        stderr=asyncio.subprocess.PIPE if pipe else None,
        stdin=asyncio.subprocess.DEVNULL if pipe else None,
        cwd=cwd
        )
    return proc