import asyncio
from math import inf
import os
import traceback
import socketio
import yaml
from pathlib import Path
import io
from ..utils.install_package import install_package
from ..utils.run_shell_cmd import run_shell_cmd
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

def add_packages_to_global_pipfile(global_pip_path: str, current_pip_path: str):
    current_pip_file = toml.load(current_pip_path)
    global_pip_file = toml.load(global_pip_path)

    for pckg, version in current_pip_file['packages'].items():
        global_pip_file['packages'][pckg] = version
    for pckg, version in current_pip_file['dev-packages'].items():
        global_pip_file['dev-packages'][pckg] = version

    with open(global_pip_path, 'w') as f:
        toml.dump(global_pip_file, f)

def add_packages_to_global_yml_file(global_yml_path: str, current_pip_path: str):
    current_pip_file = toml.load(current_pip_path)
    with open(global_yml_path, 'r') as stream:
        data_loaded = yaml.safe_load(stream)
        for pckg, version in current_pip_file['packages'].items():
            if version != '*':
                if type(version) == dict:
                    data_loaded['dependencies'] += [f'{pckg}{version["version"]}']
                else:
                    data_loaded['dependencies'] += [f'{pckg}{version}']
            else:
                data_loaded['dependencies'] += [pckg]
        for pckg, version in current_pip_file['dev-packages'].items():
            if version != '*':
                data_loaded['dependencies'] += [f'{pckg}{version}']
            else:
                data_loaded['dependencies'] += [pckg]
    with io.open(global_yml_path, 'w', encoding='utf8') as outfile:
        yaml.dump(data_loaded, outfile, default_flow_style=False, allow_unicode=True)




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
            current_env = get_virtualenv_type()
            if current_env == 'pipenv':
                add_packages_to_global_pipfile(os.path.join(app_dir, 'Pipfile'), initial_pipfile_path)
                child_proc =  await run_shell_cmd('pipenv install', app_dir)
                _, stderr = await child_proc.communicate()

                if child_proc.returncode != 0:
                    print("Failed: {} installation of internal dependencies".format(get_virtualenv_type()))
                    if stderr:
                        printd("[stderr]\n", stderr)
                else:
                    printd("Installed Packages")

            elif current_env == 'conda':

                child_proc = await run_shell_cmd('conda env export > environment.yml', app_dir)
                _, stderr = await child_proc.communicate()
                add_packages_to_global_yml_file(os.path.join(app_dir, 'environment.yml'), initial_pipfile_path)
                child_proc = await run_shell_cmd('conda env update -f environment.yml', app_dir)
                _, stderr = await child_proc.communicate()

                if child_proc.returncode != 0:
                    print("Failed: {} installation of internal dependencies".format(get_virtualenv_type()))
                    if stderr:
                        printd("[stderr]\n", stderr)
                else:
                    printd("Installed Packages")

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
                print("Error occurred while running python -m controllers.server serve")
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
