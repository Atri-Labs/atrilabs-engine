import asyncio
import os
from typing import Any
import socketio
import subprocess

async def connect_ipc_server(port: str):
    print("connecting to ipc server...")
    sio = socketio.AsyncClient()
    await sio.connect("http://localhost:" + port)
    return sio

def handle_ipc_events(sio, paths):
    @sio.on("doComputeInitialState")
    async def doComputeInitialState(route: str, page_state: str):
        app_dir = paths["app_dir"]
        child_proc = subprocess.Popen(
            ["python", "-m", "server", "compute", "--route", route, "state", page_state],
            stdout=subprocess.PIPE,
            cwd=app_dir
            )
        out = child_proc.stdout.read()
        return out

async def start_ipc_connection(port: str, paths):
    sio = await connect_ipc_server(port)
    await sio.emit("registerAs", "atri-cli")
    handle_ipc_events(sio, paths)

def run(u_port, app_dir):
    abs_app_dir = os.path.abspath(app_dir)
    paths = {"app_dir": abs_app_dir}
    asyncio.run(start_ipc_connection(u_port, paths))