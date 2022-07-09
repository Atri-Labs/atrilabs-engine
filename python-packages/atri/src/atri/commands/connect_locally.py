import asyncio
from math import inf
import os
import traceback
from typing import Any
import socketio
import subprocess

def print_success(success):
    if success:
        print("Registered as atri-cli with ipc server.")

async def on_connect(sio):
    await sio.emit("registerAs", "atri-cli", callback=print_success)

async def connect_ipc_server(port: str):
    print("Connecting to ipc server...")
    sio = socketio.AsyncClient(
        reconnection=True,
        reconnection_attempts=inf,
        reconnection_delay=1,
        reconnection_delay_max=4,
        handle_sigint=True
        )

    @sio.on('connect')
    async def connect_handler():
        print('Connected to ipc server!')
        await on_connect(sio)

    @sio.event
    def connect_error(data):
        print("Connection to ipc server failed!")

    @sio.event
    def disconnect():
        print("Disconnected from ipc server!")

    while True:
        try:
            await sio.connect("http://localhost:" + port)
            break
        except:
            await asyncio.sleep(1)
    return sio

def handle_ipc_events(sio, paths):
    @sio.on("doComputeInitialState")
    async def doComputeInitialState(route: str, page_state: str):
        print(route, page_state)
        try:
            app_dir = paths["app_dir"]
            child_proc = subprocess.Popen(
                ["python", "-m", "server", "compute", "--route", route, "state", page_state],
                stdout=subprocess.PIPE,
                cwd=app_dir
                )
            out = child_proc.stdout.read()
            return out
        except Exception:
            print("except", traceback.print_exc())

async def start_ipc_connection(port: str, paths):
    sio = await connect_ipc_server(port)
    handle_ipc_events(sio, paths)
    # Important to call sio.wait if no other task will run
    # If sio.wait is not called, then the python program will crash in ~30 secs
    # with error message 'packet queue is empty, aborting'
    await sio.wait()

def run(u_port, app_dir):
    abs_app_dir = os.path.abspath(app_dir)
    paths = {"app_dir": abs_app_dir}
    asyncio.run(start_ipc_connection(u_port, paths))