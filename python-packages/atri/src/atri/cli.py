"""This script is the entrypoint for command line utilities provided in Atri Framework."""
import sys

from .utils.setup_env import setup_env
from atri.errors import NO_CONDA_ENVIRONMENT_FOUND
from atri.utils.is_pkg_installed import is_conda_installed_sync
import click
import asyncio
from .commands.open_editor import run as exe_open_editor
from .commands.connect_local import start_ipc_connection
from .commands.open_exe import open_exe_wrapper
from .commands.load_exe import load_exe_if_not_exists
from .commands.build_ssg_cmd import build_ssg_cmd_wrapper
from .commands.deploy_ssg_gh_pages import deploy_ssg_gh_pages_wrapper
from .utils.globals import globals
from .commands.check_requisite import check_requisite
if sys.version_info >= (3, 8):
    from asyncio.exceptions import CancelledError
else:
    from asyncio import CancelledError
from .utils.printd import printd
from .find_app_root import find_and_set_app_directory, get_virtualenv_type, is_virtualenv_set, set_virtualenv_type
from . import supported_virt_types
import questionary
from pathlib import Path
from .utils.conda_utils import get_conda_env_list, set_working_env_name, get_active_env_name
from typing import List, Union
from .utils.handle_error import error_to_message
from . import app_config_file
from .commands.create_dockerfile import create_dockerfile_with_pipenv
from .stats import collect_atri_start, collect_create_dockerfile
from .utils.manage_session import manage_session

find_and_set_app_directory()
setup_env()

class VirtTypeQuestion(click.Option):

    def __init__(self, param_decls=None, **attrs):
        click.Option.__init__(self, param_decls, **attrs)
        if not isinstance(self.type, click.Choice):
            raise Exception('ChoiceOption type arg must be click.Choice')

    def prompt_for_value(self, ctx):
        if is_virtualenv_set():
            ctx.obj = {"virt_type": get_virtualenv_type()}
            return None
        val = questionary.select(self.prompt, choices=self.type.choices).unsafe_ask()
        ctx.obj = {"virt_type": val}
        return val

class DefaultEnvNameQuestion(click.Option):

    def __init__(self, param_decls=None, **attrs):
        click.Option.__init__(self, param_decls, **attrs)
        if not isinstance(self.type, click.Choice):
            raise Exception('ChoiceOption type arg must be click.Choice')

    def prompt_for_value(self, ctx):
        if ctx.obj["virt_type"] != "conda":
            return None
        active_env_name = get_active_env_name(str(Path.cwd()))
        if active_env_name != "base":
            return active_env_name
        if len(self.type.choices) == 0:
            print("Please create a conda environment first.")
            exit(NO_CONDA_ENVIRONMENT_FOUND)
        val = questionary.select(self.prompt, choices=self.type.choices).unsafe_ask()
        return val

def get_conda_env_list_if_conda_installed() -> List[str]:
    if is_conda_installed_sync():
        return get_conda_env_list(str(Path.cwd()))
    return []

@click.group()
@click.option("--virt-type", type=click.Choice(supported_virt_types, case_sensitive=False), prompt="Select virtual environment type", cls=VirtTypeQuestion, is_eager=True)
@click.option("--working-env", type=click.Choice(get_conda_env_list_if_conda_installed(), case_sensitive=False), prompt="Select name of the conda virtual env", cls=DefaultEnvNameQuestion)
def main(virt_type: Union[str, None], working_env: Union[str, None]):
    """Open up the visual editor:

        $ atri open editor

    Click publish in the editor once you are done.

    Write your python controllers in controller directory.

    Run dev server during development for automatic refresh whenever you make changes to your code or hit publish in your editor.

        $ atri run dev-server
    
    """
    if virt_type != None:
        set_virtualenv_type(virt_type)
    if working_env != None:
        set_working_env_name(working_env)

@main.group('open')
def open():
    """Open up editor in browser using command:

        $ atri open editor
    """
    pass

@open.command('editor')
@click.option('--e-port', default="4001", help='port on which event server will be attached')
@click.option('--w-port', default="4002", help='port on which file server will be attached to serve static files')
@click.option('--m-port', default="4003", help='port on which manifest server will be attached')
@click.option('--p-port', default="4004", help='port on which publish server will be attached')
@click.option('--d-port', default="4005", help='port on which generate app server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--c-port', default="4007", help='port on which generated python server will be attached')
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, no_debug):
    """Open up editor in browser using command -

        $ atri open editor --e-port 4001 --w-port 4002 --app-dir atri
    """
    globals["in_debug_mode"] = not no_debug
    app_dir = str(Path.cwd())
    exe_open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)

@open.command('exe')
@click.option('--e-port', default="4001", help='port on which event server will be attached')
@click.option('--w-port', default="4002", help='port on which file server will be attached to serve static files')
@click.option('--m-port', default="4003", help='port on which manifest server will be attached')
@click.option('--p-port', default="4004", help='port on which publish server will be attached')
@click.option('--d-port', default="4005", help='port on which generate app server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--c-port', default="4007", help='port on which generated python server will be attached')
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def open_exe(e_port, w_port, m_port, p_port, d_port, u_port, c_port, no_debug):
    """Open up editor in browser using command -

        $ atri open editor --e-port 4001 --w-port 4002 --app-dir atri
    """
    load_exe_if_not_exists()
    globals["in_debug_mode"] = not no_debug
    app_dir = str(Path.cwd())
    asyncio.run(open_exe_wrapper(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir))

@main.group('connect')
def connect():
    """This command is intended to connect with ipc server when running locally (not inside docker)

        $ atri connect_local
    """
    pass

@connect.command("local")
@click.option('--u-port', default="4006", help='port on which publish server will be attached')
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def connect_local(u_port, no_debug):
    globals["in_debug_mode"] = not no_debug
    app_dir = str(Path.cwd())
    async def check_req_wrapper():
        ok = await check_requisite()
        return ok
    async def connect_local_wrapper():
        sio = await start_ipc_connection(u_port, app_dir)
        await sio.wait()
    async def main_wrapper():
        ok = await check_req_wrapper()
        if ok == 0:
            await connect_local_wrapper()
        else:
            error_to_message(ok)
    asyncio.run(main_wrapper())

@main.command()
@click.option('--e-port', default="4001", help='port on which event server will be attached')
@click.option('--w-port', default="4002", help='port on which file server will be attached to serve static files')
@click.option('--m-port', default="4003", help='port on which manifest server will be attached')
@click.option('--p-port', default="4004", help='port on which publish server will be attached')
@click.option('--d-port', default="4005", help='port on which generate app server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--c-port', default="4007", help='port on which generated python server will be attached')
@click.option('--debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def start(e_port, w_port, m_port, p_port, d_port, u_port, c_port, debug):
    load_exe_if_not_exists()

    virt_type = get_virtualenv_type()
    collect_atri_start(virt_type)

    globals["in_debug_mode"] = debug
    app_dir = str(Path.cwd())
    async def check_req_wrapper():
        ok = await check_requisite()
        return ok
    async def connect_local_wrapper():
        sio = await start_ipc_connection(u_port, app_dir)
        await sio.wait()
    async def main_wrapper():
        ok = await check_req_wrapper()
        if ok == 0:
            open_exe_task = asyncio.create_task(
                open_exe_wrapper(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)
                )
            connect_local_task = asyncio.create_task(
                connect_local_wrapper()
            )
            manage_session_task = asyncio.create_task(
                manage_session(virt_type)
            )
            try:
                await asyncio.wait([open_exe_task, connect_local_task, manage_session_task])
            except CancelledError:
                # socket.io AsyncClient throws CancelledError
                # closing stderr to prevent showing error
                sys.stdout.close()
                sys.stderr.close()
            except:
                print("Some error occured while closing atri cli.")
                printd(sys.exc_info())
                exit(1)
            exit(0)
        else:
             error_to_message(ok)
    # Now run the tasks(in the event loop) 
    asyncio.run(main_wrapper())

@main.group()
def check():
    pass

@main.group("create")
def create():
    pass

@create.command("dockerfile")
@click.option('--file', default="Dockerfile", show_default=True, help='Name of the output Dockerfile')
def create_dockerfile(file):
    virt_type = get_virtualenv_type()
    collect_create_dockerfile(virt_type)
    if virt_type == "pipenv":
        create_dockerfile_with_pipenv(file)
    elif virt_type == "conda":
        print("Sorry! We don't support packaging for conda environment yet.")
    elif virt_type == None:
        print("Cannot detect python environment type. Please check {}.".format(app_config_file))
    else:
        print("We don't support {} virtual environment.".format(virt_type))

@check.command()
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def req(no_debug):
    globals["in_debug_mode"] = not no_debug
    ok = asyncio.run(check_requisite())
    if not ok:
        print("If you want to report this issue,",
        "please use our discussion forum https://discuss.atrilabs.com")

@main.group("build")
def build():
    pass

@build.command("ssg")
@click.option('--debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
@click.option('--exe', default=None, help='command to execute to start the NodeJS processes')
def build_ssg(debug, exe):
    globals["in_debug_mode"] = debug
    globals["exe"] = exe
    asyncio.run(build_ssg_cmd_wrapper())

@main.group("deploy")
def deploy():
    pass

@deploy.command("ssg")
@click.option('--gh-pages', is_flag = True, default=False, show_default=True, help='deploy ssg pages to github')
@click.option('--debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def deploy_ssg(gh_pages, debug):
    globals["in_debug_mode"] = debug
    if gh_pages:
        asyncio.run(deploy_ssg_gh_pages_wrapper())

if __name__ == '__main__':
    main()