import subprocess
import os

def run():
    # create a child process
    child_proc = subprocess.Popen(
        ["docker", "run", "--rm", "-it", "atrieditor:0.0.1"],
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