import os
import platform

def send_ipc_msg(msg: bytes):
    ATRI_IPC_PATH = os.environ["ATRI_IPC_PATH"]
    if platform.system() == "Windows":
        import win32file
        import win32pipe
        handle = win32file.CreateFile(ATRI_IPC_PATH, win32file.GENERIC_READ | win32file.GENERIC_WRITE,
                              0, None, win32file.OPEN_EXISTING, win32file.FILE_ATTRIBUTE_NORMAL, None)
        win32file.WriteFile(handle, msg)
    else:
        import socket
        s = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        s.connect(ATRI_IPC_PATH)
        s.send(msg)
        s.close()