import os
import asyncio
from ..utils.run_shell_cmd import run_shell_cmd
from .. import __version__
from ..utils.globals import globals
import signal
import webbrowser

def port_map(host: str, container: str):
    return host + ":" + container

def volume_map(app_dir:str, subdir: str, container_dir: str):
    return os.path.join(app_dir, subdir) + ":" + container_dir

def create_env(name: str, value: str):
    return name + "=" + value

def host_map(container: str, host: str):
    return container + ":" + host

async def open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir):
    abs_app_dir = os.path.abspath(app_dir)
    host_uri_inside_docker = "host.docker.internal"
    atri_controller_host = host_uri_inside_docker + ":" + c_port
    cmd = " ".join([
        "docker", "run", "--rm",
        "-p", port_map(e_port, "4001"),
        "-p", port_map(w_port, "4002"),
        "-p", port_map(m_port, "4003"),
        "-p", port_map(p_port, "4004"),
        "-p", port_map(d_port, "4005"),
        "-p", port_map(u_port, "4006"),
        "-e", create_env("ATRI_CONTROLLER_HOST", atri_controller_host),
        "--add-host", host_map(host_uri_inside_docker, "host-gateway"),
        "-v", volume_map(abs_app_dir, "localdb", "/code/localdb"),
        "-v", volume_map(abs_app_dir, "controllers", "/code/node_modules/.targets/controllers"),
        "-v", volume_map(abs_app_dir, "atri-app", "/code/node_modules/.targets/atri-app"),
        "-v", volume_map(abs_app_dir, "assets", "/code/node_modules/.targets/assets"),
        "atrilabs/atrieditor:" + __version__
        ])
    child_proc = await run_shell_cmd(cmd, os.getcwd(), not globals["in_debug_mode"])
    return child_proc

def run(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir):
    try:
        # create a child process
        async def wrapper():
            child_proc = await open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)
            await child_proc.wait()
        asyncio.run(wrapper())
    except KeyboardInterrupt:
        return
    except Exception as e:
        if e.args[0] != 10:
            print(e)

async def open_editor_wrapper(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir):
    child_proc = await open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)
    # terminate docker process if SIGINT, SIGTERM is received
    def handle_signal(a, b):
        child_proc.terminate()
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    print("Success! Visit http://localhost:4002 to access the editor.")
    await asyncio.sleep(2)
    webbrowser.open("http://localhost:4002", new=0, autoraise=True)
    await child_proc.wait()