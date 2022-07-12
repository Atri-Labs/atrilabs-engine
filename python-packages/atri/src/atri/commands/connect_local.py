import asyncio
from asyncio.subprocess import Process
from math import inf
import os
import traceback
from typing import Any
import socketio
import subprocess
from ..utils.in_venv import in_virtualenv
from ..utils.run_shell_cmd import run_shell_cmd
from ..utils.is_pkg_installed import is_pipenv_installed
from ..utils.install_package import install_with_pipenv
from shutil import copy
import toml

async def on_connect(sio):
    def print_success_cb(success):
        if success:
            print("Registered as atri-cli with ipc server.")
    await sio.emit("registerAs", "atri-cli", callback=print_success_cb)

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
    python_server_proc = None
    @sio.on("doComputeInitialState")
    async def doComputeInitialState(route: str, page_state: str):
        print("doComputeInitialState called")
        try:
            app_dir = paths["app_dir"]
            child_proc = subprocess.Popen(
                ["python", "-m", "controllers.server", "compute", "--route", route, "--state", page_state],
                stdout=subprocess.PIPE,
                cwd=app_dir
                )
            out = child_proc.stdout.read()
            return True, out
        except Exception:
            print("except", traceback.print_exc())
    @sio.on("doBuildPython")
    async def doBuildPython():
        print("doBuildPython called")
        app_dir = paths["app_dir"]
        controllers_dir = os.path.join(app_dir, "controllers")
        initial_pipfile_path = os.path.join(controllers_dir, "Pipfile")
        final_pipfile_path = os.path.join(app_dir, "Pipfile")
        # check if Pipfile exist in controller directory
        if os.path.exists(initial_pipfile_path):
            if not in_virtualenv():
                # check if pipenv is installed otherwise ask user to install it
                if is_pipenv_installed():
                    # copy Pipfile to app_dir
                    copy(initial_pipfile_path, final_pipfile_path)
                    # run pipenv install
                    child_proc = install_with_pipenv(app_dir)
                    await child_proc.wait()
                    # delete Pipfile from controllers_dir
                    os.remove(initial_pipfile_path)
                else:
                    print("Please install a pipenv or some other virtual environment.")
            else:
                # detect virtual env type
                if is_pipenv_installed():
                    # read Pipfile
                    pipfile_data = toml.load(initial_pipfile_path)
                    pkgs = pipfile_data["packages"]
                    dev_pkgs = pipfile_data["dev-packages"]
                    # run pipenv install <package_name> for each file in Pipfile inside app_dir
                    child_procs_wait = []
                    for pkg in pkgs:
                        version = pkgs[pkg]
                        if type(version) != str:
                            version = version["version"]
                        child_proc = await install_with_pipenv(app_dir, pkg, version)
                        child_procs_wait.append(child_proc.wait())
                    for pkg in dev_pkgs:
                        version = dev_pkgs[pkg]
                        if type(version) != str:
                            version = version["version"]
                        child_proc = await install_with_pipenv(app_dir, pkg, version)
                        child_procs_wait.append(child_proc.wait())
                    await asyncio.wait(child_procs_wait)
                    # delete Pipfile from controllers_dir
                    os.remove(initial_pipfile_path)
                else:
                    print("Failed to detect virtual env type. Currently supported are pipenv")
        return True
    @sio.on("doStartPythonServer")
    async def doStartPythonServer():
        print("doStartPythonServer called")
        nonlocal python_server_proc
        app_dir = paths["app_dir"]
        if python_server_proc == None:
            python_server_proc = await run_shell_cmd("python -m controllers.server serve", app_dir)
            await python_server_proc.wait()
            python_server_proc = None
async def start_ipc_connection(port: str, app_dir):
    abs_app_dir = os.path.abspath(app_dir)
    paths = {"app_dir": abs_app_dir}
    sio = await connect_ipc_server(port)
    handle_ipc_events(sio, paths)
    return sio

def run(u_port, app_dir):
    async def wrapper():
        # Important to call sio.wait if no other task will run
        # If sio.wait is not called, then the python program will crash in ~30 secs
        # with error message 'packet queue is empty, aborting'
        sio = await start_ipc_connection(u_port, app_dir)
        await sio.wait()
    asyncio.run(wrapper())