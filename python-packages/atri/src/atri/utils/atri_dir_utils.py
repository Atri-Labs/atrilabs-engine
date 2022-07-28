from pathlib import Path
import os

def get_atri_dir_path():
    atri_dir = Path.home() / ".atri"
    return atri_dir

def create_atri_dir_if_not_exist():
    atri_dir = get_atri_dir_path()
    if not os.path.exists(str(atri_dir)):
        os.mkdir(str(atri_dir))