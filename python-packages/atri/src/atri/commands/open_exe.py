from asyncio.subprocess import Process
import os
from .load_exe import get_unzipped_host_path
from ..utils.run_shell_cmd import run_shell_cmd
from ..utils.globals import globals
import signal
import webbrowser
from ..utils.wait_till_file_server_ready import wait_till_file_server_ready

async def open_exe(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir) -> Process:
    abs_app_dir = os.path.abspath(app_dir)
    child_proc = await run_shell_cmd(" ".join(['"' + str(get_unzipped_host_path()) + '"', "start"]), os.getcwd(), not globals["in_debug_mode"])
    return child_proc

async def open_exe_wrapper(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir):
    child_proc = await open_exe(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)
    # terminate docker process if SIGINT, SIGTERM is received
    def handle_signal(a, b):
        child_proc.terminate()
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    await wait_till_file_server_ready(w_port)
    print("Success! Visit http://localhost:{} to access the editor.".format(w_port))
    webbrowser.open("http://localhost:4002", new=0, autoraise=True)
    await child_proc.wait()
