import asyncio
from math import inf
import os
import traceback
import socketio
from ..utils.install_package import install_package
import toml
from ..utils.printd import printd
from ..utils.call_compute import call_compute
from ..utils.call_serve import call_serve
from ..find_app_root import get_virtualenv_type

async def on_connect(sio):
    def print_success_cb(success):
        if success:
            printd("Registered as atri-cli with ipc server.")
    await sio.emit("registerAs", "atri-cli", callback=print_success_cb)

async def connect_ipc_server(port: str):
    printd("Connecting to ipc server...")
    sio = socketio.AsyncClient(
        reconnection=True,
        reconnection_attempts=inf,
        reconnection_delay=1,
        reconnection_delay_max=4,
        handle_sigint=True
        )

    @sio.on('connect')
    async def connect_handler():
        printd('Connected to ipc server!')
        await on_connect(sio)

    @sio.event
    def connect_error(data):
        printd("Connection to ipc server failed!")

    @sio.event
    def disconnect():
        printd("Disconnected from ipc server!")

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
        printd("doComputeInitialState called")
        try:
            app_dir = paths["app_dir"]
            out = await call_compute(app_dir, route, page_state)
            return True, out
        except Exception:
            print("except", traceback.print_exc())
        return False, b''
    @sio.on("doBuildPython")
    async def doBuildPython():
        printd("doBuildPython called")
        app_dir = paths["app_dir"]
        controllers_dir = os.path.join(app_dir, "controllers")
        initial_pipfile_path = os.path.join(controllers_dir, "Pipfile")
        # check if Pipfile exist in controller directory
        if os.path.exists(initial_pipfile_path):
            # read Pipfile
            pipfile_data = toml.load(initial_pipfile_path)
            pkgs = pipfile_data["packages"]
            dev_pkgs = pipfile_data["dev-packages"]
            # run pipenv install <package_name> for each file in Pipfile inside app_dir
            for pkg in pkgs:
                version = pkgs[pkg]
                if type(version) != str:
                    version = version["version"]
                child_proc = await install_package(app_dir, pkg, version)
                _, stderr = await child_proc.communicate()
                if child_proc.returncode != 0:
                    print("Failed: {} install".format(get_virtualenv_type()), pkg, version)
                    if stderr:
                        printd("[stderr]\n", stderr)
                else:
                    printd("Installed", pkg, version)
            for pkg in dev_pkgs:
                version = dev_pkgs[pkg]
                if type(version) != str:
                    version = version["version"]
                child_proc = await install_package(app_dir, pkg, version)
                _, stderr = await child_proc.communicate()
                if child_proc.returncode != 0:
                    print("Failed: {} install".format(get_virtualenv_type()), pkg, version)
                    if stderr:
                        printd("[stderr]\n", stderr)
                else:
                    printd("Installed", pkg, version)
            # delete Pipfile from controllers_dir
            os.remove(initial_pipfile_path)
        return True
    @sio.on("doStartPythonServer")
    async def doStartPythonServer():
        printd("doStartPythonServer called")
        nonlocal python_server_proc
        app_dir = paths["app_dir"]
        if python_server_proc == None:
            python_server_proc = await call_serve(app_dir)
            await python_server_proc.wait()
            if python_server_proc.returncode != 0:
                print("Error occured while running python -m controllers.server serve")
            returncode = python_server_proc.returncode
            python_server_proc = None
            return returncode
        return 0
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