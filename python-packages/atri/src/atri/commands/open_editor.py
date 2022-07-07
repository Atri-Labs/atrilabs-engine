import subprocess
import os

def port_map(host: str, container: str):
    return host + ":" + container

def volume_map(app_dir:str, subdir: str, container_dir: str):
    return os.path.join(app_dir, subdir) + ":" + container_dir

def run(e_port, w_port, m_port, p_port, app_dir):
    abs_app_dir = os.path.abspath(app_dir)
    # create a child process
    child_proc = subprocess.Popen(
        [
            "docker", "run", "--rm", "-it",
            "-p", port_map(e_port, "4001"),
            "-p", port_map(w_port, "4002"),
            "-p", port_map(m_port, "4003"),
            "-p", port_map(p_port, "4004"),
            "-v", volume_map(abs_app_dir, "localdb", "/code/localdb"),
            "-v", volume_map(abs_app_dir, "controllers", "/code/node_modules/.targets/controllers"),
            "-v", volume_map(abs_app_dir, "app", "/code/node_modules/.targets/atri-app"),
            "-v", volume_map(abs_app_dir, "assets", "/code/node_modules/.targets/assets"),
            "atrilabs/atrieditor"
            ],
        stdin=None,     # shares the parent stdin
        stdout=None,    # shares the parent stdout
        stderr=None,    # shares the parent stderr
        universal_newlines=True,    # automatically decodes stdout as utf-8
        bufsize=0   # don't buffer i.e. immidiatedly send to current process stdout
        )

    # wait for child to terminate
    try:
        os.waitpid(child_proc.pid, 0)
            
    except KeyboardInterrupt:
        pass

    except Exception as e:
        print(e)