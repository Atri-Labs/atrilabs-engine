import asyncio

async def run_shell_cmd(cmd: str, cwd: str):
    proc = await asyncio.create_subprocess_shell(
        cmd,
        stdout=None,
        stderr=None,
        cwd=cwd
        )
    return proc