from .. import __version__
import platform
import requests
from ..utils.atri_dir_utils import get_atri_dir_path, create_atri_dir_if_not_exist
import zipfile
from pathlib import Path
import os
import sys
from ..stats import collect_download_exe
from ..utils.globals import globals

def get_remote_filename():
    if platform.system() == "Linux":
        system_str = "linux"
    if platform.system() == "Darwin":
        system_str = "macos"
    if platform.system() == "Windows":
        system_str = "win.exe"
    filename = "webapp-builder-" + system_str + ".zip"
    return filename

def get_host_filename():
    if platform.system() == "Linux":
        system_str = "linux"
    if platform.system() == "Darwin":
        system_str = "macos"
    if platform.system() == "Windows":
        system_str = "win.exe"
    filename = "webapp-builder-" + system_str + ".v" + __version__ + ".zip"
    return filename

def download_zip():
    atri_dir_path = get_atri_dir_path()
    remote_filename = get_remote_filename()
    host_filename = get_host_filename()
    full_filepath_in_host = atri_dir_path / host_filename

    url = "https://github.com/Atri-Labs/atrilabs-engine/releases/download/" \
        + "v" + __version__ + "/" + remote_filename
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(full_filepath_in_host, "wb") as f:
            count = 1
            chunk_size = 81960
            total_size = int(r.headers["Content-Length"])
            for chunk in r.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
                progress = (count * len(chunk) / total_size) * 100
                # erase and go to beginning of line
                # https://stackoverflow.com/questions/5290994/remove-and-replace-printed-items
                sys.stdout.write("\033[K")
                print("Download Progress", str(round(progress, 2)) + "%", end="\r")
                count = count + 1
            sys.stdout.write("\033[K")

def get_unzipped_remote_filename():
    if platform.system() == "Linux":
        system_str = "linux"
    if platform.system() == "Darwin":
        system_str = "macos"
    if platform.system() == "Windows":
        system_str = "win.exe"
    filename = "webapp-builder-" + system_str
    return filename

def get_unzipped_host_filename():
    if platform.system() == "Linux":
        system_str = "linux"
    if platform.system() == "Darwin":
        system_str = "macos"
    if platform.system() == "Windows":
        system_str = "win.exe"
    filename = "webapp-builder-" + system_str + ".v" + __version__
    return filename

def get_unzipped_host_path():
    atri_dir_path = get_atri_dir_path()
    unzipped_file_path = get_unzipped_host_filename()
    return atri_dir_path / unzipped_file_path

def unzip_downloaded_file():
    atri_dir_path = get_atri_dir_path()
    host_filename = get_host_filename()
    path_to_zip_file = atri_dir_path / host_filename
    extract_destination = atri_dir_path
    with zipfile.ZipFile(str(path_to_zip_file), 'r') as zip_ref:
        zip_ref.extractall(str(extract_destination))
    # rename unzipped content
    Path.rename(extract_destination / get_unzipped_remote_filename(), get_unzipped_host_path())
    # change permission to 774 (0o represents octal)
    os.chmod(str(get_unzipped_host_path()), 0o774)

def exe_exists():
    unzipped_exe_path = get_unzipped_host_path()
    if os.path.exists(str(unzipped_exe_path)):
        return True
    return False

def clean_before_download():
    downloaded_zip = get_atri_dir_path() / get_host_filename()
    if os.path.exists(downloaded_zip):
        os.remove(str(downloaded_zip))
    unzipped_path_not_renamed = get_atri_dir_path() / get_unzipped_remote_filename()
    if os.path.exists(str(unzipped_path_not_renamed)):
        os.remove(str(unzipped_path_not_renamed))

def clean_after_download():
    downloaded_zip = get_atri_dir_path() / get_host_filename()
    if os.path.exists(downloaded_zip):
        os.remove(str(downloaded_zip))

def load_exe_if_not_exists():
    create_atri_dir_if_not_exist()
    if not exe_exists():
        collect_download_exe()
        clean_before_download()
        print("Downloading atri engine...")
        download_zip()
        print("Extracting...")
        unzip_downloaded_file()
        clean_after_download()
    
def get_exe():
    if globals["exe"] != None:
        return globals["exe"]
    return get_unzipped_host_path()