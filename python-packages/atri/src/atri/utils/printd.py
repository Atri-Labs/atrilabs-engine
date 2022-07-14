from .globals import globals

def printd(*args):
    if globals["in_debug_mode"]:
        print(*args)